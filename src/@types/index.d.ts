import { Document, ObjectId } from 'mongoose'

// User Schema Model types
declare interface IUserSchema extends Document {
    name: string
    email: string
    password: string
    isVerified: boolean
    otpforpass: string
    username: string
    pic: string
    timestamps: boolean
}

// Chat Schema Model types
declare interface IChatSchema extends Document {
    chatName: string
    isGroupChat: boolean
    groupPic: string
    users: any
    latestMessage: ObjectId
    groupAdmins: ObjectId[]
    timestamps: boolean
}

// Message Schema Model types
declare interface IMessageSchema extends Document {
    sender: ObjectId
    content: string
    chat: ObjectId
}

// User Object
declare interface UserData {
    _id: ObjectId
    name: string
    email: string
    password: string
    isVerified: boolean
    username: string
    pic: string
    timestamps: boolean
}
