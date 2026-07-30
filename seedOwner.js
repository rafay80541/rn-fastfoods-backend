import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from './models/User.js'

async function seed() {
  await mongoose.connect(process.env.MONGO_URI)

  const existing = await User.findOne({ username: 'owner' })
  if (existing) {
    console.log('Owner already exists, deleting old one first...')
    await User.deleteOne({ username: 'owner' })
  }

  const passwordHash = await bcrypt.hash('password123', 10)
  await User.create({ username: 'owner', passwordHash })

  console.log('✅ Owner account created: username=owner, password=password123')
  process.exit(0)
}

seed()