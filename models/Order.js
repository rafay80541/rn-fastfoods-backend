// ============================================================
// ORDER MODEL
// Defines the shape of one order document in MongoDB.
// This mirrors the "order" object your frontend's checkout()
// function currently builds locally in CartContext.jsx.
// ============================================================

import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true },
}, { _id: false })

const orderSchema = new mongoose.Schema({
  token: { type: String, required: true },
  items: [orderItemSchema],
  total: { type: Number, required: true },
  status: { type: String, enum: ['in-progress', 'completed'], default: 'in-progress' },
  estimatedWaitMinutes: { type: Number, default: 15 },
  completedAt: { type: Date, default: null },
}, { timestamps: true })

export default mongoose.model('Order', orderSchema)