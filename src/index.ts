import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import connectToDB from './config/db'
import { router as userRouter } from './routes/userRoutes'
import { router as chatRouter } from './routes/chatRoutes'
import { router as messageRouter } from './routes/messageRoutes'
import { Server } from 'socket.io'
import configureSockets from './Socket/Sockets'
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001

connectToDB()

//cors & helmet => for security
app.use(cors())
app.use(helmet())

// used to log requests
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use(express.json())

// for all User related APIs
app.use('/api/user', userRouter)
app.use('/api/chat', chatRouter)
app.use('/api/message', messageRouter)

const server = app.listen(PORT, () =>
    console.log('Server is running at http://localhost:' + PORT)
)

const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.CLIENT_URL,
    },
})

configureSockets(io)
