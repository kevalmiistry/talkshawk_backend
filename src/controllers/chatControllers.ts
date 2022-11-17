import { Request, RequestHandler, Response } from 'express'
import asyncHandler from 'express-async-handler'
import Chat from '../models/chatModel'
import User from '../models/userModel'

// CONTROLLER For: /api/chat/create - To create or access (if already created) One-on-One Single chat
export const createOneOnOneChat: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
        const success = false
        let userId: string = req.body.userId
        const { _id } = res.locals

        if (!userId) {
            res.json({ success, message: 'UserId is not sent with request' })
            return
        }

        let isChat = await Chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: _id } } },
                { users: { $elemMatch: { $eq: userId } } },
            ],
        })
            .populate('users', '-password')
            .populate('latestMessage')

        if (!isChat) {
            console.log('No isChat: ', isChat)
            return
        }

        let isChat2 = await User.populate(isChat, {
            path: 'latestMessage.sender',
            select: 'name username email pic',
        })

        if (isChat2.length > 0) {
            res.json(isChat2[0])
        } else {
            const chatData = {
                chatName: 'sender',
                isGroupChat: false,
                users: [_id, userId],
            }
            try {
                let createdChat = await Chat.create(chatData)
                let createdChat2 = await Chat.findOne({
                    _id: createdChat._id,
                }).populate('users', '-password')
                res.json(createdChat2)
            } catch (error) {
                console.error(error)
            }
        }
    }
)

// CONTROLLER For: /api/chat/fetch - To all user's chats
export const fetchAllChats: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
        try {
            const { _id } = res.locals

            const chats = await Chat.find({
                users: { $elemMatch: { $eq: _id } },
            })
                .populate('users', '-password')
                .populate('groupAdmins', '-password')
                .populate('latestMessage')
                .sort({ updatedAt: -1 })

            const finalChats = await User.populate(chats, {
                path: 'latestMessage.sender',
                select: 'name username email pic',
            })

            res.json(finalChats)
        } catch (error) {
            console.error(error)
        }
    }
)

// CONTROLLER For: /api/chat/creategroup - To create a group chat
export const createGroupChat: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
        const { _id } = res.locals
        const users: string[] = req.body.users
        const name: string = req.body.name

        if (!users || !name) {
            res.json({ success: false, message: 'Please fill all the details' })
            return
        }

        if (users.length < 2) {
            res.json({
                success: false,
                message: 'More than two users are required to form a group',
            })
            return
        }

        users.push(_id)
        const groupAdmins: Object[] = [_id]

        try {
            const groupChat = await Chat.create({
                chatName: name,
                users: users,
                isGroupChat: true,
                groupAdmins: groupAdmins,
            })

            const fullChat = await Chat.findOne({ _id: groupChat._id })
                .populate('users', '-password')
                .populate('groupAdmins', '-password')

            res.send(fullChat)
        } catch (error) {
            console.error(error)
        }
    }
)

// CONTROLLER For: /api/chat/renamegroup - To rename a group chat
export const renameGroupChat: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
        const { newName, chatId } = req.body
        try {
            const updatedChat = await Chat.findByIdAndUpdate(
                chatId,
                {
                    chatName: newName,
                },
                {
                    new: true,
                }
            )
                .populate('users', '-password')
                .populate('groupAdmins', '-password')

            if (!updatedChat) {
                res.json({ success: false, message: 'Chat not found' })
            } else {
                res.send(updatedChat)
            }
        } catch (error) {}
    }
)

// CONTROLLER For: /api/chat/addtogroup - To add member to a group chat
export const addToGroupChat: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
        const { _id } = res.locals
        const { chatId, newUserId } = req.body

        try {
            const isAdmin = await Chat.findOne({
                $and: [{ _id: chatId }, { groupAdmins: { $in: _id } }],
            })
            if (!isAdmin) {
                res.json({
                    success: false,
                    message: 'Only admins can add members',
                })
                return
            }
            const isAlreadyMember = await Chat.findOne({
                $and: [{ _id: chatId }, { users: { $in: newUserId } }],
            })
            if (isAlreadyMember) {
                res.json({
                    success: false,
                    message: 'User is already Member of the Group',
                })
            }
            const added = await Chat.findByIdAndUpdate(
                chatId,
                {
                    $push: { users: newUserId },
                },
                { new: true }
            )
                .populate('users', '-password')
                .populate('groupAdmins', '-password')

            if (!added) {
                res.json({ success: false, message: 'Chat not found' })
            } else {
                res.send(added)
            }
        } catch (error) {
            console.error(error)
        }
    }
)

// CONTROLLER For: /api/chat/removefromgroup - To remove member from a group chat
export const removeFromGroupChat: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
        const { chatId, userId } = req.body
        const { _id } = res.locals
        try {
            const isAdmin = await Chat.findOne({
                $and: [{ _id: chatId }, { groupAdmins: { $in: _id } }],
            })
            if (!isAdmin) {
                res.json({
                    success: false,
                    message: 'Only admins can remove members',
                })
                return
            }
            const removed = await Chat.findByIdAndUpdate(
                chatId,
                {
                    $pull: { users: userId },
                },
                { new: true }
            )
                .populate('users', '-password')
                .populate('groupAdmins', '-password')

            if (!removed) {
                res.json({ success: false, message: 'Chat not found' })
            } else {
                res.send(removed)
            }
        } catch (error) {
            console.error(error)
        }
    }
)

// CONTROLLER For: /api/chat/makeadmin - To make a member admin of a group chat
export const makeAdmin: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
        const { _id } = res.locals
        const { chatId, userId } = req.body
        try {
            const isAdmin = await Chat.findOne({
                $and: [{ _id: chatId }, { groupAdmins: { $in: _id } }],
            })
            if (!isAdmin) {
                res.json({
                    success: false,
                    message: 'Only admins can make others admin',
                })
                return
            }
            const isAlreadyAdmin = await Chat.findOne({
                $and: [{ _id: chatId }, { groupAdmins: { $in: userId } }],
            })
            if (isAlreadyAdmin) {
                res.json({ success: false, message: 'User is already Admin' })
            }

            const madeAdmin = await Chat.findByIdAndUpdate(
                chatId,
                {
                    $push: { groupAdmins: userId },
                },
                { new: true }
            )
                .populate('users', '-password')
                .populate('groupAdmins', '-password')

            if (!madeAdmin) {
                res.json({ success: false, message: 'Chat not found' })
            } else {
                res.send(madeAdmin)
            }
        } catch (error) {
            console.error(error)
        }
    }
)

// CONTROLLER For: /api/chat/removeadmin - To remove member from admin of a group chat
export const removeAdmin: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
        const { _id } = res.locals
        const { chatId, userId } = req.body

        try {
            const isAdmin = await Chat.findOne({
                $and: [{ _id: chatId }, { groupAdmins: { $in: _id } }],
            })
            if (!isAdmin) {
                res.json({
                    success: false,
                    message: 'Only admins can remove other admins',
                })
                return
            }

            const isAlreadyAdmin = await Chat.findOne({
                $and: [{ _id: chatId }, { groupAdmins: { $in: userId } }],
            })
            if (!isAlreadyAdmin) {
                res.json({ success: false, message: 'User is not an Admin' })
            }

            const removedAdmin = await Chat.findByIdAndUpdate(
                chatId,
                {
                    $pull: { groupAdmins: userId },
                },
                { new: true }
            )
                .populate('users', '-password')
                .populate('groupAdmins', '-password')

            if (!removedAdmin) {
                res.json({ success: false, message: 'Chat not found' })
            } else {
                res.send(removedAdmin)
            }
        } catch (error) {
            console.error(error)
        }
    }
)

// CONTROLLER For: /api/chat/selfremove - To remove member from admin of a group chat
export const selfRemove: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
        const { _id } = res.locals
        const { chatId } = req.body
        try {
            const isAdmin = await Chat.findOne({
                $and: [{ _id: chatId }, { groupAdmins: { $in: _id } }],
            })
            // if user is Admin then go through upcoming condition
            //
            // _id_ is request sender's mongoDB _id but in string
            const _id_ = _id._id.toString()
            if (isAdmin) {
                //if there is only 1 admin in the group chat than make someone else admin first
                if (isAdmin.groupAdmins.length <= 1) {
                    // new candidates that exclude the current leaving user
                    const newCandidates = isAdmin.users.filter(
                        (u: any) => u.toString() !== _id_
                    )

                    // make the first one admin from the candidates
                    const madeAdmin = await Chat.findByIdAndUpdate(
                        chatId,
                        {
                            $push: { groupAdmins: newCandidates[0] },
                        },
                        { new: true }
                    )
                    if (!madeAdmin) {
                        res.json({ success: false, message: 'Chat not found' })
                    }
                }
                // if there's 1 or multiple admins either way we have to remove the user from admin
                const removedAdmin = await Chat.findByIdAndUpdate(
                    chatId,
                    {
                        $pull: { groupAdmins: _id_ },
                    },
                    { new: true }
                )
                if (!removedAdmin) {
                    res.json({ success: false, message: 'Chat not found' })
                }
            }
            // remove the user in any case, admin or not whatever!
            const removedUser = await Chat.findByIdAndUpdate(
                chatId,
                {
                    $pull: { users: _id_ },
                },
                { new: true }
            )
            if (!removedUser) {
                res.json({ success: false, message: 'Chat not found' })
            } else {
                res.json({
                    success: true,
                    message: 'user removed completely',
                    removedUser,
                })
            }
        } catch (error) {
            console.error(error)
        }
    }
)
