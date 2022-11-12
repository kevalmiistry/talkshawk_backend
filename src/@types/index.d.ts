import { ObjectId } from 'mongoose'

// User Schema Model types
declare interface IUserSchema {
    name: string
    email: string
    password: string
    username: string
    profile: string
    timestamps: boolean
}

// Chat Schema Model types
declare interface IChatSchema {
    chatName: string
    isGroupChat: boolean
    users: ObjectId[]
    latestMessage: ObjectId
    groupAdmins: ObjectId[]
    timestamps: boolean
}

// Message Schema Model types
declare interface IMessageSchema {
    sender: ObjectId
    content: string
    chat: ObjectId
}
