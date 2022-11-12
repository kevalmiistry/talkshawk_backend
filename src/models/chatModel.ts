import { model, Schema } from 'mongoose'
import { IChatSchema } from '../@types'

const chatModel = new Schema<IChatSchema>(
    {
        chatName: { type: String, trim: true },
        isGroupChat: { type: Boolean, default: false },
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
