import { model, Schema } from 'mongoose'
import { IMessageSchema } from '../@types'

const messageModel = new Schema<IMessageSchema>(
    {
        sender: { type: Schema.Types.ObjectId, ref: 'User' },
        content: { type: String, trim: true },
        chat: { type: Schema.Types.ObjectId, ref: 'Chat' },
    },
    {
        timestamps: true,
    }
)

const Message = model<IMessageSchema>('Message', messageModel)

export default Message
