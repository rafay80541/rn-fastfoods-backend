// ============================================================
// RATE LIMITERS
// Blocks brute-force attacks by capping how many times an IP can
// hit sensitive endpoints in a given time window.
// ============================================================

import rateLimit from 'express-rate-limit'

// Applied to login: max 10 attempts per 15 minutes per IP.
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many login attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
})

// Applied generally to the whole API: max 300 requests per 15 min per IP —
// generous for normal use, but stops scripted abuse.
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { message: 'Too many requests. Please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
})