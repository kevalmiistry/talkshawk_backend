import { Router } from 'express'
import jwt from 'jsonwebtoken'
import {
    changePassword,
    createUser,
    emailVerify,
    forgetPassword,
    isEmail,
    isUsername,
    loginUser,
    searchUser,
    sendEmailForPass,
} from '../controllers/userControllers'
import fetchUser from '../utils/fetchUser'

export const router = Router()

//ROUTE: /api/user/createuser - To register new user account
router.post('/createuser', createUser)

//ROUTE: /api/user/verify - To verify newly created user account
router.patch('/verify', fetchUser, emailVerify)

//ROUTE: /api/user/login - To login user account
router.post('/login', loginUser)

//ROUTE: /api/user/isusername - To check whether the username is available or not
router.post('/isusername', isUsername)

//ROUTE: /api/user/isemail - To check whether the username is available or not
router.post('/isemail', isEmail)

//ROUTE: /api/user/ - To search users based on param provided
router.get('/', fetchUser, searchUser)

//ROUTE: /api/user/changepassword - To change password
router.patch('/changepassword', fetchUser, changePassword)

//ROUTE: /api/user/sendemail - To to send email for forget password
router.patch('/sendemail', sendEmailForPass)

//ROUTE: /api/user/forgetpassword - To change password based on OTP and AuthToken
router.patch('/forgetpassword', fetchUser, forgetPassword)

//ROUTE: /api/user/updateuser - To update user detailes
// router.patch('/updateuser', fetchUser, updateUser)
