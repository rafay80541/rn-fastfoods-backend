// ============================================================
// AUTH MIDDLEWARE
// Plain Express middleware — checks "did this request include a
// valid login token?" before letting it continue. Runs BEFORE the
// controller function. If the token is missing/invalid, it stops
// the request here and sends 401 — the controller never even runs.
// ============================================================

import jwt from 'jsonwebtoken'

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization // looks like: "Bearer eyJhbGciOi..."

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' })
  }

  const token = authHeader.split(' ')[1] // grab just the token part, after "Bearer "

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.userId // stash it on req in case a controller wants it later
    next() // token is valid — let the request continue to the controller
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

export default authMiddleware