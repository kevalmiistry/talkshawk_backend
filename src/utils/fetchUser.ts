import { NextFunction, Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'

const fetchUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const token = req.header('auth-token') as string
        if (!token) {
            res.json({
                sucess: false,
                message: `Please authenticate yourself`,
            })
            next()
            return
        }
        try {
            const data = jwt.verify(
                token,
                process.env.JWT_SEC || 'DevSecString'
            )
            res.locals._id = data
            next()
        } catch (error) {
            res.json({ sucess: false, message: 'Please authenticate yourself' })
        }
    }
)

export default fetchUser
