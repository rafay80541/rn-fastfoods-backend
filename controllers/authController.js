// import bcrypt from 'bcryptjs'
// import jwt from 'jsonwebtoken'
// import User from '../models/User.js'

// export const login = async (req, res) => {
//   try {
//     const { username, password } = req.body
//     const user = await User.findOne({ username })
//     if (!user) {
//       return res.status(401).json({ message: 'Invalid username or password' })
//     }

//     const isMatch = await bcrypt.compare(password, user.passwordHash)
//     if (!isMatch) {
//       return res.status(401).json({ message: 'Invalid username or password' })
//     }

//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
//     res.json({ token, username: user.username })
//   } catch (err) {
//     console.error('Login error:', err.message)
//     res.status(500).json({ message: 'Server error during login' })
//   }
// }


import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const login = async (req, res) => {
  try {
    const { username, password } = req.body

    // 🆕 Reject anything that isn't a plain string — closes the door on
    // NoSQL operator-injection objects like { "$gt": "" } even before
    // mongo-sanitize gets involved. Defense in depth.
    if (typeof username !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: 'Invalid request' })
    }

    const user = await User.findOne({ username })
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' })
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' })
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, username: user.username })
  } catch (err) {
    console.error('Login error:', err.message) // 🆕 full detail stays in YOUR terminal only
    res.status(500).json({ message: 'Server error during login' }) // 🆕 generic message to the client
  }
}