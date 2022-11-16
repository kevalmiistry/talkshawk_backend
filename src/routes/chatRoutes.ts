import { Router } from 'express'
import {
    addToGroupChat,
    createGroupChat,
    createOneOnOneChat,
    fetchAllChats,
    makeAdmin,
    removeAdmin,
    removeFromGroupChat,
    renameGroupChat,
    selfRemove,
} from '../controllers/chatControllers'
import fetchUser from '../utils/fetchUser'

export const router = Router()

// ROUTE /api/chat/create - To create or access (if already created) One-on-One Single chat
router.post('/create', fetchUser, createOneOnOneChat)

// ROUTE /api/chat/fetch - To all user's chats
router.get('/fetch', fetchUser, fetchAllChats)

// ROUTE /api/chat/creategroup - To create a group chat
router.post('/creategroup', fetchUser, createGroupChat)

// ROUTE /api/chat/renamegroup - To rename a group chat
router.put('/renamegroup', fetchUser, renameGroupChat)

// ROUTE /api/chat/addtogroup - To add member to a group chat
router.put('/addtogroup', fetchUser, addToGroupChat)

// ROUTE /api/chat/removefromgroup - To remove member from a group chat
router.put('/removefromgroup', fetchUser, removeFromGroupChat)

// ROUTE /api/chat/makeadmin - To make a member admin of a group chat
router.put('/makeadmin', fetchUser, makeAdmin)

// ROUTE /api/chat/removeadmin - To remove member from admin of a group chat
router.put('/removeadmin', fetchUser, removeAdmin)

// ROUTE /api/chat/selfremove - To remove self and make other admin if required
router.put('/selfremove', fetchUser, selfRemove)
