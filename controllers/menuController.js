// ============================================================
// MENU CONTROLLER
// Contains the logic for menu-related routes.
// ============================================================

import MenuItem from '../models/MenuItem.js'

export const getMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find().sort({ createdAt: -1 })
    res.json(menuItems)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body

    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: 'Missing required menu item fields' })
    }

    const menuItem = await MenuItem.create({
      name,
      description,
      price,
      image: image || '',
      category,
    })

    res.status(201).json(menuItem)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}