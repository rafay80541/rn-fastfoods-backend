import mongoose from 'mongoose'

// A tiny dedicated collection just for generating safe sequence
// numbers. One document per counter name (we'll only ever have
// one: "order"). findOneAndUpdate with $inc is atomic in MongoDB —
// even if 100 requests hit this at once, each gets a unique number.
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // e.g. "order"
  seq: { type: Number, default: 0 },
})

export default mongoose.model('Counter', counterSchema)