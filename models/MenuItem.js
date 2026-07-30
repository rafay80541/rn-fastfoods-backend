// ============================================================
// MENU ITEM MODEL
// Defines the shape of one menu item document in MongoDB.
// This mirrors the objects already in the frontend's menuData.js
// (id, name, description, price, image, category) — on purpose,
// so the shapes match when we eventually connect the two.
// ============================================================

import mongoose from 'mongoose'

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, default: '' },
  category: { type: String, required: true },
}, { timestamps: true })

export default mongoose.model('MenuItem', menuItemSchema)