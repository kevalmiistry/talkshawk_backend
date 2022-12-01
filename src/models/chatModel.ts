import { model, Schema } from 'mongoose'
import { IChatSchema } from '../@types'

const chatModel = new Schema<IChatSchema>(
    {
        chatName: { type: String, trim: true },
        isGroupChat: { type: Boolean, default: false },
        groupPic: {
            type: String,
            default:
                'https://firebasestorage.googleapis.com/v0/b/talkshawk-4d53a.appspot.com/o/images%2Fdefault_group_pic.png?alt=media&token=10fb4c40-8baf-4bc7-b4f5-bf645ecfb062',
        },
        users: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        latestMessage: {
            type: Schema.Types.ObjectId,
            ref: 'Message',
        },
        groupAdmins: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    {
        timestamps: true,
    }
)

const Chat = model<IChatSchema>('Chat', chatModel)
export default Chat
