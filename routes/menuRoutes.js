// ============================================================
// MENU ROUTES
// ============================================================

import express from 'express'
import { getMenuItems, createMenuItem } from '../controllers/menuController.js'

const router = express.Router()

router.get('/', getMenuItems)
router.post('/', createMenuItem)

export default router