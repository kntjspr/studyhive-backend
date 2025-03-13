import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import { UpdateProfileRequest } from "../types/request.types";
import { UserProfileResponse } from "../types/response.types";
import { BadRequestError } from "../utils/errors";
import logger from "../utils/logger";

/**
 * User controller
 * Handles user-related requests
 */
export class UserController {
  /**
   * Get user profile
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next function
   */
  public static async getProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Get user ID from authenticated request
      const userId = req.user?.id;
      if (!userId) {
        throw new BadRequestError("User ID is required");
      }

      const user = await UserService.getProfile(userId);

      const response: UserProfileResponse = {
        success: true,
        message: "User profile retrieved successfully",
        data: user,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user profile
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next function
   */
  public static async updateProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Get user ID from authenticated request
      const userId = req.user?.id;
      if (!userId) {
        throw new BadRequestError("User ID is required");
      }

      const profileData = req.body as UpdateProfileRequest;
      const updatedUser = await UserService.updateProfile(userId, profileData);

      const response: UserProfileResponse = {
        success: true,
        message: "User profile updated successfully",
        data: updatedUser,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Upload user avatar
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next function
   */
  public static async uploadAvatar(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Get user ID from authenticated request
      const userId = req.user?.id;
      if (!userId) {
        throw new BadRequestError("User ID is required");
      }

      // Check if file exists
      if (!req.file) {
        throw new BadRequestError("Avatar file is required");
      }

      const updatedUser = await UserService.uploadAvatar(userId, req.file);

      const response: UserProfileResponse = {
        success: true,
        message: "Avatar uploaded successfully",
        data: updatedUser,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
} 