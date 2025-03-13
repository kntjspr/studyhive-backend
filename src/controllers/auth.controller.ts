import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { RegisterRequest, LoginRequest } from "../types/request.types";
import { AuthResponse } from "../types/response.types";
import { BadRequestError, UnauthorizedError } from "../utils/errors";
import logger from "../utils/logger";

/**
 * Authentication controller
 * Handles authentication-related requests
 */
export class AuthController {
  /**
   * Register a new user
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next function
   */
  public static async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userData = req.body as RegisterRequest;
      const { user, token, refreshToken } = await AuthService.register(userData);

      const response: AuthResponse = {
        success: true,
        message: "User registered successfully",
        data: {
          token,
          refreshToken,
          user,
        },
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login a user
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next function
   */
  public static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const loginData = req.body as LoginRequest;
      const { user, token, refreshToken } = await AuthService.login(loginData);

      const response: AuthResponse = {
        success: true,
        message: "User logged in successfully",
        data: {
          token,
          refreshToken,
          user,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Refresh access token
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next function
   */
  public static async refreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new BadRequestError("Refresh token is required");
      }

      const tokens = await AuthService.refreshToken(refreshToken);

      res.status(200).json({
        success: true,
        message: "Token refreshed successfully",
        data: tokens,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logout a user
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next function
   */
  public static async logout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // JWT is stateless, so we don't need to do anything server-side
      // The client should remove the token from storage

      res.status(200).json({
        success: true,
        message: "User logged out successfully",
      });
    } catch (error) {
      next(error);
    }
  }
} 