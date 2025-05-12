import rateLimit from 'express-rate-limit';

// Rate limiter for login attempts
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many login attempts. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for registration attempts
export const registerRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: 'Too many accounts created from this IP, try again after an hour.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for forgot password attempts
export const forgotPasswordRateLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 3,
  message: 'Too many password reset requests. Try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for reset password attempts
export const resetPasswordRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Allow up to 5 reset password attempts per 15 minutes
  message: 'Too many reset password requests from this IP, please try again after 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});
