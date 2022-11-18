import { Request, RequestHandler, Response } from 'express'
import asyncHandler from 'express-async-handler'
import Chat from '../models/chatModel'
import Message from '../models/messageModel'
import User from '../models/userModel'

export const createMessage: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
        const { _id } = res.locals
        const { content, chatId } = req.body

        if (!content || !chatId) {
            res.json({ success: false, message: 'Invalid data passed!' })
            return
        }
        const newMessage = {
            sender: _id,
            content,
            chat: chatId,
        }

        try {
            let message = await Message.create(newMessage)
            message = await message.populate('sender', 'name username pic')
            message = await message.populate('chat')
            const finalMessage = await User.populate(message, {
                path: 'chat.users',
                select: 'name username pic email',
            })

            await Chat.findByIdAndUpdate(chatId, {
                latestMessage: finalMessage,
            })

            res.json(finalMessage)
        } catch (error) {
            console.error(error)
        }
    }
)

export const fetchMessages: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
        try {
            const messages = await Message.find({
                chat: req.params.chatId,
            })
                .populate('sender', 'name username email pic')
                .populate('chat')
            res.json(messages)
        } catch (error) {
            console.error(error)
        }
    }
)
