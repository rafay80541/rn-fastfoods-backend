// ============================================================
// NOSQL INJECTION SANITIZER (custom, Express-5-safe)
// Recursively strips MongoDB operator characters ($ and .) from
// object keys in req.body and req.params — these two are still
// safely mutable in Express 5.
//
// req.query is intentionally NOT touched here: Express 5 made it
// a read-only getter, so no middleware can overwrite it directly
// anymore (this is exactly what crashed express-mongo-sanitize).
// Instead, the one place in this app that uses req.query for a
// database query (searchOrders) validates its type before use —
// see controllers/orderController.js. Same protection, different
// mechanism, fully compatible with Express 5.
// ============================================================

const sanitizeObject = (obj) => {
  if (obj && typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      if (key.startsWith('$') || key.includes('.')) {
        delete obj[key]
      } else if (typeof obj[key] === 'object') {
        sanitizeObject(obj[key])
      }
    }
  }
  return obj
}

const sanitizeMiddleware = (req, res, next) => {
  if (req.body) sanitizeObject(req.body)
  if (req.params) sanitizeObject(req.params)
  next()
}

export default sanitizeMiddleware