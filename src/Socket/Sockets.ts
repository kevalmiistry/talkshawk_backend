import { Server } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'

type TUserData = {
    _id: string
    name: string
    username: string
    email: string
    pic: string
}
type TMessageSender = {
    _id: string
    pic: string
    name: string
    username: string
}
type TMessage = {
    _id: string
    sender: TMessageSender
    content: string
    chat: SingleChatData
}
type SingleChatData = {
    _id: string
    chatName: string
    isGroupChat: boolean
    groupPic: string
    users: TUserData[]
    groupAdmins: TUserData[]
    latestMessage?: TMessage
}

const configureSockets = (
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
    io.on('connection', (socket) => {
        socket.on('joinChat', (roomId) => {
            socket.join(roomId)
        })

        socket.on('online', (userData: TUserData) => {
            socket.join(userData._id)
            socket.emit('__online__')
        })

        socket.on('typing', (roomId, pic) =>
            socket.broadcast.in(roomId).emit('typing', pic)
        )
        socket.on('stopTyping', (roomId) =>
            socket.broadcast.in(roomId).emit('stopTyping')
        )

        socket.on('newMessage', (newMessage: TMessage) => {
            let chat = newMessage.chat
            if (!chat.users) return console.error('chat.users not found')
            socket.broadcast.in(chat._id).emit('messageRecieved', newMessage)

            chat.users.forEach((u: TUserData) => {
                socket
                    .in(u._id)
                    .emit('commonMessageRecieved', newMessage, u._id)
            })
        })

        socket.off('setUp', (userData: TUserData) => {
            socket.leave(userData._id)
        })
    })
}

export default configureSockets
