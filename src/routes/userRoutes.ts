import { Router } from 'express'
import {
    createUser,
    emailVerify,
    loginUser,
} from '../controllers/userControllers'
import fetchUser from '../utils/fetchUser'

export const router = Router()

router.post('/createuser', createUser)
router.patch('/verify', fetchUser, emailVerify)
router.post('/login', loginUser)
