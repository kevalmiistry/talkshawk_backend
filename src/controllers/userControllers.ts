import asyncHandler from 'express-async-handler'
import { Request, Response } from 'express'
import bcrypt, { compare } from 'bcryptjs'
import User from '../models/userModel'
import genToken from '../utils/genToken'
import sendMail from '../config/Mailer'
import { UserData } from '../@types'
import jwt from 'jsonwebtoken'

export const createUser = asyncHandler(async (req: Request, res: Response) => {
    let success = false
    const { name, username, email, password, profile } = req.body

    const emailExist = await User.findOne({ email })
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
            message: 'Username is already been used! Pick another username.',
        })
        return
    }

    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_AMOUNT!) || 10)
    const hashPassword = await bcrypt.hash(password, salt)

    const newUser = await User.create({
        name,
        username,
        email,
        password: hashPassword,
        profile,
    })

    if (newUser) {
        const generatedToken = genToken(newUser._id)
        success = true
        const userToSend = {
            _id: newUser._id,
            email: newUser.email,
            name: newUser.name,
            username: newUser.username,
            profile: newUser.profile,
            token: generatedToken,
        }

        const sentMail = await sendMail(newUser.email, generatedToken)
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
})

export const emailVerify = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { _id } = req.user
        const user = await User.findByIdAndUpdate(_id, {
            isVerified: true,
        })
        res.json({ success: true, message: 'Your Email has been verified!' })
    } catch (error) {
        res.json({
            success: false,
            message: 'Some Internal Error Occure! Try again later.',
        })
    }
})

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
    let success = false
    try {
        const { type, email_username, password } = req.body
        let isUserExist: UserData | null
        if (type === 'email') {
            isUserExist = await User.findOne({ email: email_username })
            helper(isUserExist, type, req, res)
        } else if (type === 'username') {
            isUserExist = await User.findOne({ username: email_username })
            helper(isUserExist, type, req, res)
        }
    } catch (error) {}
})

async function helper(
    userData: UserData | null,
    type: string,
    req: Request,
    res: Response
) {
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
        process.env.JWT_SECRET || 'DevSecString'
    )
    const userToSend = {
        _id: userData._id,
        name: userData.name,
        username: userData.username,
        email: userData.email,
        profile: userData.profile,
        token: authToken,
    }
    res.json({ success: true, message: 'Login Successfull!', user: userToSend })
}
