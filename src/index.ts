import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

//cors & helmet => for security
app.use(cors())
app.use(helmet())

// used to log requests
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use(express.json())

app.get('/', (_, res) => {
    res.json('API running.')
})

app.listen(PORT, () =>
    console.log('Server is running at http://localhost:' + PORT)
)
