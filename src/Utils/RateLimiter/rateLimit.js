 import { rateLimit } from 'express-rate-limit';
export const ratelimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 100,
    message: {
      statusCode: 429,
      message: "too many request , try Again another time",
    },
    legacyHeaders: false,
  });