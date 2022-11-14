import { Schema, model } from 'mongoose'
import { IUserSchema } from '../@types'

const userSchema = new Schema<IUserSchema>(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        otpforpass: {
            type: String,
        },
        profile: {
            type: String,
            default:
                'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
        },
    },
    {
        timestamps: true,
    }
)

const User = model<IUserSchema>('User', userSchema)

export default User
