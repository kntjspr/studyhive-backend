import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserModel } from "../models/user.model";
import { RegisterRequest, LoginRequest } from "../types/request.types";
import { User } from "../types/model.types";
import { BadRequestError, UnauthorizedError } from "../utils/errors";
import environment from "../config/environment";
import logger from "../utils/logger";

/**
 * Authentication service
 * Handles user authentication and token management
 */
export class AuthService {
  /**
   * Register a new user
   * @param userData - User registration data
   * @returns User data and tokens
   */
  public static async register(userData: RegisterRequest): Promise<{
    user: User;
    token: string;
    refreshToken: string;
  }> {
    try {
      // Create user
      const user = await UserModel.create(userData);

      // Generate tokens
      const token = this.generateToken(user);
      const refreshToken = this.generateRefreshToken(user);

      return { user, token, refreshToken };
    } catch (error) {
      logger.error("Registration error", { error });
      throw error;
    }
  }

  /**
   * Login a user
   * @param loginData - User login data
   * @returns User data and tokens
   */
  public static async login(loginData: LoginRequest): Promise<{
    user: User;
    token: string;
    refreshToken: string;
  }> {
    try {
      // Get user by email
      const user = await UserModel.getByEmail(loginData.email);

      // Verify password
      const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedError("Invalid credentials");
      }

      // Generate tokens
      const token = this.generateToken(user);
      const refreshToken = this.generateRefreshToken(user);

      // Return user data without password
      const { password, ...userData } = user;
      return { user: userData as User, token, refreshToken };
    } catch (error) {
      logger.error("Login error", { error });
      throw error;
    }
  }

  /**
   * Refresh access token
   * @param refreshToken - Refresh token
   * @returns New access token
   */
  public static async refreshToken(refreshToken: string): Promise<{
    token: string;
    refreshToken: string;
  }> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, environment.jwt.refreshSecret) as {
        userId: string;
        email: string;
      };

      // Get user
      const user = await UserModel.getById(decoded.userId);

      // Generate new tokens
      const newToken = this.generateToken(user);
      const newRefreshToken = this.generateRefreshToken(user);

      return { token: newToken, refreshToken: newRefreshToken };
    } catch (error) {
      logger.error("Token refresh error", { error });
      throw new UnauthorizedError("Invalid refresh token");
    }
  }

  /**
   * Generate JWT token
   * @param user - User data
   * @returns JWT token
   */
  private static generateToken(user: User): string {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      environment.jwt.secret as jwt.Secret,
      {
        expiresIn: environment.jwt.expiresIn,
      } as SignOptions
    );
  }

  /**
   * Generate refresh token
   * @param user - User data
   * @returns Refresh token
   */
  private static generateRefreshToken(user: User): string {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      environment.jwt.refreshSecret as jwt.Secret,
      {
        expiresIn: environment.jwt.refreshExpiresIn,
      } as SignOptions
    );
  }
} 