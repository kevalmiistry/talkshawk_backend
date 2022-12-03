import asyncHandler from 'express-async-handler'
import { Request, RequestHandler, Response } from 'express'
import bcrypt, { compare } from 'bcryptjs'
import User from '../models/userModel'
import genToken from '../utils/genToken'
import sendMail, { sendMailForget } from '../config/Mailer'
import { UserData } from '../@types'
import jwt from 'jsonwebtoken'

//CONTROLLER For: /api/user/createuser - To register new user account
export const createUser: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
        let success = false
        const { name, username, email, password, pic } = req.body
        const defaultPic =
            'https://firebasestorage.googleapis.com/v0/b/talkshawk-4d53a.appspot.com/o/images%2Fanonymous-avatar-icon.jpg?alt=media&token=498b3cd2-d0d3-4350-9492-8a245cffb1d2'

        const emailExist = await User.findOne({ email: email.toLowerCase() })
        if (emailExist) {
            res.json({
                success,
                message: 'Email is already been used! Try login with that.',
            })
            return
        }

        const usernameExist = await User.findOne({ username })
        if (usernameExist) {
            res.json({
                success,
                message:
                    'Username is already been used! Pick another username.',
            })
            return
        }

        const salt = await bcrypt.genSalt(
            parseInt(process.env.SALT_AMOUNT!) || 10
        )
        const hashPassword = await bcrypt.hash(password, salt)

        const newUser = await User.create({
            name,
            username: username.toLowerCase(),
            email: email.toLowerCase(),
            password: hashPassword,
            pic: pic ? pic : defaultPic,
        })

        if (newUser) {
            const generatedToken = genToken(newUser._id)
            success = true
            const userToSend = {
                _id: newUser._id,
                email: newUser.email,
                name: newUser.name,
                username: newUser.username,
                pic: newUser.pic,
                token: generatedToken,
            }

            const sentMail = await sendMail(
                newUser.email,
                generatedToken,
                newUser.name,
                newUser.username
            )
            if (sentMail) {
                res.json({
                    success,
                    message:
                        'Account Created Successfully! Please check your mail to verify.',
                })
            }
        } else {
            success = false
            res.json({
                success,
                message: 'Oops... failed to create an account',
            })
        }
    }
)

//CONTROLLER For: /api/user/verify - To verify newly created user account
export const emailVerify: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
        try {
            const { _id } = res.locals
            const user = await User.findByIdAndUpdate(_id, {
                isVerified: true,
            })
            res.json({
                success: true,
                message: 'Your Email has been verified!',
            })
        } catch (error) {
            res.json({
                success: false,
                message: 'Some Internal Error Occure! Try again later.',
            })
        }
    }
)

//CONTROLLER For: /api/user/login - To login user account
export const loginUser: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
        let success = false
        try {
            const { type, email_username, password } = req.body
            let isUserExist: UserData | null
            if (type === 'email') {
                isUserExist = await User.findOne({
                    email: email_username.toLowerCase(),
                })
                helper(isUserExist, type, req, res)
            } else if (type === 'username') {
                isUserExist = await User.findOne({
                    username: email_username.toLowerCase(),
                })
                helper(isUserExist, type, req, res)
            }
        } catch (error) {}
    }
)

//HELPER For: Login Controller
async function helper(
    userData: UserData | null,
    type: string,
    req: Request,
    res: Response
): Promise<any> {
    if (!userData) {
        res.json({
            success: false,
            message: `Could't find Accout with that ${type}`,
        })
        return
    }

    if (!userData.isVerified) {
        res.json({ success: false, message: 'Please verify your email!' })
        return
    }

    const passwordCompare = await compare(req.body.password, userData.password!)

    if (!passwordCompare) {
        res.json({
            success: false,
            message: `Password does't match with ${type}`,
        })
        return
    }
    const authToken = jwt.sign(
        { _id: userData._id },
        process.env.JWT_SEC || 'DevSecString'
    )
    const userToSend = {
        _id: userData._id,
        name: userData.name,
        username: userData.username,
        email: userData.email,
        pic: userData.pic,
        token: authToken,
    }
    res.json({ success: true, message: 'Login Successfull!', user: userToSend })
}

//CONTROLLER For: /api/user/isusername - To check whether the username is available or not
export const isUsername: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
        const { username } = req.body

        const isUser = await User.findOne({ username: username.toLowerCase() })
        if (isUser) {
            res.json({ available: false })
        } else {
            res.json({ available: true })
        }
    }
)

//CONTROLLER For: /api/user/isemail - To check whether the email is available or not
export const isEmail: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
        const { email } = req.body

        const isUser = await User.findOne({ email: email.toLowerCase() })
        if (isUser) {
            res.json({ available: false })
        } else {
            res.json({ available: true })
        }
    }
)

//CONTROLLER For: /api/user/ - To search based on Name,username,email and send users details
export const searchUser: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
        const search = req.query.search
            ? {
                  $or: [
                      { name: { $regex: req.query.search, $options: 'i' } },
                      { email: { $regex: req.query.search, $options: 'i' } },
                      { username: { $regex: req.query.search, $options: 'i' } },
                  ],
              }
            : {}
        if (!search) {
            res.json({ success: false, message: 'No results' })
        }
        const usersToSend = await User.find(search).find({
            _id: { $ne: res.locals._id },
        })
        res.json({ success: true, users: usersToSend })
    }
)

//CONTROLLER For: /api/user/changepassword - To Change Password of user account
export const changePassword: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
        const { oldPassword, newPassword } = req.body
        const { _id } = res.locals

        const user = await User.findById(_id)
        if (!user) {
            res.json({ success: false, message: 'User not found!' })
            return
        }

        const oldPassCompare = await bcrypt.compare(oldPassword, user.password)
        if (oldPassCompare) {
            const salt = await bcrypt.genSalt(
                parseInt(process.env.SALT_AMOUNT!) || 10
            )
            const newHashPassword = await bcrypt.hash(newPassword, salt)

            const updatedUser = await User.findByIdAndUpdate(
                _id,
                {
                    password: newHashPassword,
                },
                {
                    new: true,
                }
            )
            if (!updatedUser) {
                res.json({ success: false, message: 'Cannot update!' })
                return
            }

            res.json({
                success: true,
                message: 'Password Changed Successfully',
            })
        } else {
            res.send({
                success: false,
                message: 'Your old password is Incorrect',
            })
        }
    }
)

//CONTROLLER For: /api/user/sendemail - To send email for forget password
export const sendEmailForPass: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
        const { email } = req.body

        const user = await User.findOne({ email })
        if (user) {
            const token = jwt.sign(
                { _id: user._id },
                process.env.JWT_SEC || 'SevSecString'
            )
            const OTP = Math.floor(Math.random() * 899999 + 100000).toString()
            const updatedUser = await User.findByIdAndUpdate(
                user._id,
                {
                    otpforpass: OTP,
                },
                { new: true }
            )
            if (!updatedUser?.otpforpass) {
                res.json({
                    success: false,
                    message: 'Cannot send OTP, Try again later',
                })
                return
            }

            const sent = await sendMailForget(
                user.email,
                token,
                OTP,
                user.name,
                user.username
            )
            if (sent) {
                res.json({
                    success: true,
                    message: 'Email has been sent for forgot password.',
                })
                return
            }
        } else {
            res.json({
                success: false,
                message: "Account with this email doesn't exist!",
            })
            return
        }
    }
)

//CONTROLLER For: /api/user/forgetpassword - To change password based on OTP and AuthToken
export const forgetPassword: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
        const { _id } = res.locals
        const { newPassword, OTP } = req.body

        const user = await User.findById(_id)

        if (OTP !== user?.otpforpass) {
            res.json({ success: false, message: 'OTP is incorrect' })
            return
        }
        const salt = await bcrypt.genSalt(
            parseInt(process.env.SALT_AMOUNT!) || 10
        )
        const newHashPassword = await bcrypt.hash(newPassword, salt)

        const updatedUser = await User.findByIdAndUpdate(_id, {
            password: newHashPassword,
            otpforpass: '',
        })
        if (updatedUser) {
            res.json({
                success: true,
                message: 'Password changed Successfully',
            })
        }
    }
)

//CONTROLLER For: /api/user/updateuser - To update user details
// export const updateUser: RequestHandler = asyncHandler(
//     async (req: Request, res: Response) => {
//         const {}= req.body
//     }
// )
