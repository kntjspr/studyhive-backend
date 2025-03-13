import { UserModel } from "../models/user.model";
import { UpdateProfileRequest } from "../types/request.types";
import { User } from "../types/model.types";
import { BadRequestError, NotFoundError } from "../utils/errors";
import logger from "../utils/logger";
import supabase from "../config/supabase";
import { v4 as uuidv4 } from "uuid";

/**
 * User service
 * Handles user-related business logic
 */
export class UserService {
  /**
   * Get user profile
   * @param userId - User ID
   * @returns User profile data
   */
  public static async getProfile(userId: string): Promise<User> {
    try {
      return await UserModel.getById(userId);
    } catch (error) {
      logger.error("Get profile error", { error, userId });
      throw error;
    }
  }

  /**
   * Update user profile
   * @param userId - User ID
   * @param profileData - Profile update data
   * @returns Updated user profile
   */
  public static async updateProfile(
    userId: string,
    profileData: UpdateProfileRequest
  ): Promise<User> {
    try {
      return await UserModel.update(userId, profileData);
    } catch (error) {
      logger.error("Update profile error", { error, userId });
      throw error;
    }
  }

  /**
   * Upload user avatar
   * @param userId - User ID
   * @param file - Avatar file
   * @returns Updated user profile with new avatar URL
   */
  public static async uploadAvatar(
    userId: string,
    file: Express.Multer.File
  ): Promise<User> {
    try {
      // Check if user exists
      await UserModel.getById(userId);

      // Generate unique filename
      const fileExtension = file.originalname.split(".").pop();
      const fileName = `${uuidv4()}.${fileExtension}`;
      const filePath = `avatars/${userId}/${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: true,
        });

      if (uploadError) {
        throw new BadRequestError(`Failed to upload avatar: ${uploadError.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(filePath);

      if (!urlData || !urlData.publicUrl) {
        throw new BadRequestError("Failed to get avatar URL");
      }

      // Update user profile with new avatar URL
      return await UserModel.updateAvatar(userId, urlData.publicUrl);
    } catch (error) {
      logger.error("Upload avatar error", { error, userId });
      throw error;
    }
  }
} 