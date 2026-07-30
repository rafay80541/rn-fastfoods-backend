// import 'dotenv/config'
// import express from 'express'
// import cors from 'cors'
// import connectDB from './config/db.js'
// import apiRoutes from './routes/index.js'

// const app = express()

// connectDB()

// app.use(cors())
// app.use(express.json())

// app.use('/api', apiRoutes)

// app.get('/', (req, res) => {
//   res.send('R&N Fastfoods API is running 🍔')
// })

// const PORT = process.env.PORT || 5000
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`)
// })



import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet' // new
//import mongoSanitize from 'express-mongo-sanitize' // new
import sanitizeMiddleware from './middleware/sanitize.js'
import connectDB from './config/db.js'
import apiRoutes from './routes/index.js'
import { generalLimiter } from './middleware/rateLimiter.js' // new

// 🆕 Fail fast if critical secrets are missing — better than a confusing
// crash deep inside jwt.sign() later.
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'PORT']
for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    console.error(`❌ Missing required environment variable: ${key}`)
    process.exit(1)
  }
}

const app = express()

connectDB()

app.use(helmet()) // 🆕 sets a batch of protective HTTP headers automatically

// 🆕 CORS locked to your actual frontend, not the whole internet
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))

app.use(express.json({ limit: '10kb' })) // 🆕 limit added — blocks giant payload abuse
//app.use(mongoSanitize()) // 🆕 strips out $ and . from req.body/query/params — kills NoSQL injection attempts

app.use(sanitizeMiddleware)

app.use(generalLimiter) // 🆕 applies to every route below this line

app.use('/api', apiRoutes)

app.get('/', (req, res) => {
  res.send('R&N Fastfoods API is running 🍔')
})

const PORT = process.env.PORT || 5000;

// Only actually "listen" on a port when running locally.
// On Vercel, the api/index.js file handles requests instead.
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

export default app;


// const PORT = process.env.PORT || 5000
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`)
// })