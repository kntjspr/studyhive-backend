import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "../middleware/validation.middleware";
import { registerValidation, loginValidation } from "../utils/validators";
import { authRateLimiter } from "../middleware/rate-limit.middleware";

const router = Router();

/**
 * @route POST /auth/register
 * @desc Register a new user
 * @access Public
 */
router.post(
  "/register",
  authRateLimiter,
  validate(registerValidation),
  AuthController.register
);

/**
 * @route POST /auth/login
 * @desc Login a user
 * @access Public
 */
router.post(
  "/login",
  authRateLimiter,
  validate(loginValidation),
  AuthController.login
);

/**
 * @route POST /auth/refresh-token
 * @desc Refresh access token
 * @access Public
 */
router.post("/refresh-token", authRateLimiter, AuthController.refreshToken);

/**
 * @route POST /auth/logout
 * @desc Logout a user
 * @access Public
 */
router.post("/logout", AuthController.logout);

export default router; 