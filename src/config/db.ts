import mongoose, { ConnectOptions } from 'mongoose'

const connectToDB = async () => {
    try {
        if (process.env.MONGO_URI) {
            const conn = await mongoose.connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            } as ConnectOptions)
            console.log(`MongoDB connected: ${conn.connection.host}`)
        }
    } catch (error) {
        console.error('Error: ', error)
        process.exit()
    }
}

export default connectToDB
