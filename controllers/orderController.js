// ============================================================
// ORDER CONTROLLER
// Contains the logic for every order-related route.
// This is the backend version of what checkout() and
// markOrderCompleted() currently do locally inside the
// frontend's CartContext.jsx.
// ============================================================

import Order from '../models/Order.js'
import Counter from '../models/Counter.js'
//these two imports are for the new resetOrders() function, which is protected by authMiddleware and is added after improvement 


const generateToken = async () => {
  const counter = await Counter.findOneAndUpdate(
    { _id: 'order' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true } // upsert: create the counter doc if it doesn't exist yet
  )
  return `RN-${counter.seq.toString().padStart(3, '0')}`
}

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const createOrder = async (req, res) => {
  try {
    const { items, total } = req.body

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' })
    }

    // 🆕 Basic sanity checks — not a full fix, but blocks the laziest
    // tampering attempts (negative prices, non-numeric junk, etc.)
    for (const item of items) {
      if (typeof item.price !== 'number' || item.price <= 0 || item.price > 5000) {
        return res.status(400).json({ message: 'Invalid item price detected' })
      }

      if (typeof item.qty !== 'number' || item.qty <= 0 || item.qty > 50) {
        return res.status(400).json({ message: 'Invalid item quantity detected' })
      }
    }

    const recalculatedTotal = items.reduce(
      (sum, i) => sum + i.price * i.qty,
      0
    )

    if (Math.abs(recalculatedTotal - total) > 0.01) {
      return res.status(400).json({
        message: 'Total does not match item prices',
      })
    }

    const token = await generateToken()

    const order = await Order.create({
      token,
      items,
      total: recalculatedTotal,
      status: 'in-progress',
    })

    res.status(201).json(order)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const order = await Order.findById(id)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    order.status = status
    if (status === 'completed') {
      order.completedAt = new Date()
    }

    await order.save()
    res.json(order)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// export const searchOrders = async (req, res) => {
//   try {
//     const { query } = req.query
//     const orders = await Order.find({
//       token: { $regex: query, $options: 'i' },
//     }).sort({ createdAt: -1 })
//     res.json(orders)
//   } catch (error) {
//     res.status(500).json({ message: error.message })
//   }
// }


export const searchOrders = async (req, res) => {
  try {
    const { query } = req.query

    // 🆕 Since req.query itself can no longer be sanitized directly
    // (Express 5 restriction), we validate its type here instead —
    // rejects any non-string/object-injection attempt before it
    // reaches the database.
    if (typeof query !== 'string') {
      return res.status(400).json({ message: 'Invalid search query' })
    }

    const orders = await Order.find({
      token: { $regex: query, $options: 'i' },
    }).sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


// 🆕 NEW: DELETE /api/orders/reset — wipes every order from the database.
// Protected by authMiddleware in the route file, so only a logged-in
// owner with a valid token can ever reach this function.
export const resetOrders = async (req, res) => {
  try {
    const result = await Order.deleteMany({})

    // 🆕 Also reset the token counter back to 0, so the next
    // order starts fresh at RN-001 instead of continuing from
    // wherever it left off.
    await Counter.findOneAndUpdate(
      { _id: 'order' },
      { $set: { seq: 0 } },
      { upsert: true }
    )

    res.json({ message: 'All orders and token counter reset successfully', deletedCount: result.deletedCount })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}