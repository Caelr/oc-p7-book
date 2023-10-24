import rateLimit from "express-rate-limit";

export const requestLimit = rateLimit({
  windowMs: 3 * 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true
})
