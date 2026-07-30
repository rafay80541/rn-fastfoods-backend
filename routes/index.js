// ============================================================
// ROUTE AGGREGATOR
// Every route file gets imported and mounted here, ONCE.
// server.js only ever imports this one file — adding a new
// feature area later means adding one line here, never touching
// server.js again.
// ============================================================

import express from 'express'
import orderRoutes from './orderRoutes.js'
import menuRoutes from './menuRoutes.js'
import authRoutes from './authRoutes.js'

const router = express.Router()

router.use('/orders', orderRoutes) // → /api/orders/...
router.use('/menu', menuRoutes)    // → /api/menu/...
router.use('/auth', authRoutes)    // → /api/auth/...

export default router