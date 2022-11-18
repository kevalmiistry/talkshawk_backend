import { Router } from 'express'
import { createMessage, fetchMessages } from '../controllers/messageControllers'
import fetchUser from '../utils/fetchUser'
export const router = Router()

router.post('/create', fetchUser, createMessage)

router.get('/:chatId', fetchUser, fetchMessages)
