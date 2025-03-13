import rateLimit from "express-rate-limit";
import { TooManyRequestsError } from "../utils/errors";
import environment from "../config/environment";

/**
 * Default rate limiter
 * Limits requests to 60 per minute per IP
 */
export const defaultRateLimiter = rateLimit({
  windowMs: environment.rateLimit.windowMs,
  max: environment.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new TooManyRequestsError("Too many requests, please try again later"));
  },
});

/**
 * Authentication rate limiter
 * Limits authentication requests to 10 per minute per IP
 */
export const authRateLimiter = rateLimit({
  windowMs: environment.rateLimit.authWindowMs,
  max: environment.rateLimit.authMax,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new TooManyRequestsError("Too many authentication attempts, please try again later"));
  },
}); 