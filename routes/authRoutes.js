// import express from 'express'
// import { login } from '../controllers/authController.js'

// const router = express.Router()

// router.post('/login', login)

// export default router

import express from 'express'
import { login } from '../controllers/authController.js'
import { loginLimiter } from '../middleware/rateLimiter.js' // 🆕

const router = express.Router()

router.post('/login', loginLimiter, login) // 🆕 loginLimiter runs first

export default router