import express, {json} from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import usersRouter from './routes/users-routes.js'
import authRouter from './routes/auth-routes.js'
import otpRouter from './routes/otp-routes.js'
import imgRouter from './routes/img-routes.js'
import fileUpload from 'express-fileupload'
import contactRoutes from './routes/contact-routes.js'
import pg from 'pg'

dotenv.config()
const __dirname = dirname(fileURLToPath(import.meta.url))
// Create PostgreSQL connection pool
const pool = new pg.Pool({
    user: process.env.PDB_USER,
    password: process.env.PDB_PASSWORD,
    host: process.env.PDB_HOST,
    port: process.env.PDB_PORT,
    database: process.env.PDB_DB_NAME
})

// Test database connection
const testDbConnection = async () => {
    try {
        const client = await pool.connect()
        console.log('✅ PostgreSQL Database connected successfully!')
        console.log(`📌 Database: ${process.env.PDB_DB_NAME}`)
        console.log(`📌 Host: ${process.env.PDB_HOST}`)
        console.log(`📌 Port: ${process.env.PDB_PORT}`)
        client.release()
    } catch (error) {
        console.error('❌ Error connecting to PostgreSQL:', error.message)
        console.error('⚠️ Check your database configuration in .env file')
    }
}



const app = express()
const PORT = process.env.PORT || 3302
// const corsOption = { credential:true, origin:'*' }

// app.use(cors({ corsOption }))
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(json())
app.use(cookieParser())
app.use(fileUpload())

app.use('/', express.static(join(__dirname, 'public')))
app.use('/users', usersRouter)
app.use('/auth', authRouter)
app.use('/otp', otpRouter)
app.use('/img', imgRouter)
app.use('/api', contactRoutes)

// app.listen(PORT, () => {
//     console.log(`Neura is listening to port ${PORT}`)
// })

// Test database connection before starting the server
testDbConnection()

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`)
    console.log(`⌚ Server started at: ${new Date().toISOString()}`)
    console.log('📝 API Routes:')
    console.log('   - /users')
    console.log('   - /auth')
    console.log('   - /otp')
    console.log('   - /img')
    console.log('   - /api/contact')
})
// test