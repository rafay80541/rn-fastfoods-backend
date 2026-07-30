// ============================================================
// ORDER ROUTES
// Maps URLs to controller functions. No logic lives here —
// just "when this URL is hit, call this function."
// ============================================================

// import express from 'express'
// //import { getOrders, createOrder, updateOrderStatus } from '../controllers/orderController.js'
// import { getOrders, createOrder, updateOrderStatus, resetOrders } from '../controllers/orderController.js'
// import authMiddleware from '../middleware/authMiddleware.js' //  NEW import

// const router = express.Router()

// router.get('/', getOrders)
// router.post('/', createOrder)
// router.patch('/:id', updateOrderStatus)
// router.delete('/reset', authMiddleware, resetOrders) //  NEW route — authMiddleware runs first, then resetOrders


// export default router


import express from 'express'
import { getOrders, createOrder, updateOrderStatus, resetOrders } from '../controllers/orderController.js'
import authMiddleware from '../middleware/authMiddleware.js'
import { loginLimiter } from '../middleware/rateLimiter.js' // 🆕 reusing the same strict limiter here

const router = express.Router()

router.get('/', getOrders)
router.post('/', createOrder)
router.patch('/:id', updateOrderStatus)
router.delete('/reset', loginLimiter, authMiddleware, resetOrders) // 🆕 rate-limited + auth-protected

export default router