import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import supabase from "../config/supabase";
import { User } from "../types/model.types";
import { RegisterRequest, UpdateProfileRequest } from "../types/request.types";
import { BadRequestError, NotFoundError } from "../utils/errors";

/**
 * User model
 * Handles database operations for users
 */
export class UserModel {
  /**
   * Create a new user
   * @param userData - User registration data
   * @returns Created user
   */
  public static async create(userData: RegisterRequest): Promise<User> {
    try {
      // Check if user with email already exists
      const { data: existingUser } = await supabase
        .from("users")
        .select("*")
        .eq("email", userData.email)
        .single();

      if (existingUser) {
        throw new BadRequestError("User with this email already exists");
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Generate UUID
      const userId = uuidv4();

      // Create user
      const { data, error } = await supabase.from("users").insert({
        id: userId,
        email: userData.email,
        password: hashedPassword,
        first_name: userData.first_name,
        last_name: userData.last_name,
        avatar: userData.avatar,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }).select("id, email, first_name, last_name, avatar, created_at, updated_at").single();

      if (error) {
        throw new BadRequestError(error.message);
      }

      return data as User;
    } catch (error) {
      if (error instanceof BadRequestError) {
        throw error;
      }
      throw new BadRequestError("Failed to create user");
    }
  }

  /**
   * Get user by ID
   * @param userId - User ID
   * @returns User data
   */
  public static async getById(userId: string): Promise<User> {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, email, first_name, last_name, avatar, created_at, updated_at")
        .eq("id", userId)
        .single();

      if (error || !data) {
        throw new NotFoundError("User not found");
      }

      return data as User;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new BadRequestError("Failed to get user");
    }
  }

  /**
   * Get user by email
   * @param email - User email
   * @returns User data with password
   */
  public static async getByEmail(email: string): Promise<User & { password: string }> {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (error || !data) {
        throw new NotFoundError("User not found");
      }

      return data as User & { password: string };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new BadRequestError("Failed to get user");
    }
  }

  /**
   * Update user profile
   * @param userId - User ID
   * @param userData - User profile update data
   * @returns Updated user
   */
  public static async update(userId: string, userData: UpdateProfileRequest): Promise<User> {
    try {
      const { data, error } = await supabase
        .from("users")
        .update({
          ...userData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select("id, email, first_name, last_name, avatar, created_at, updated_at")
        .single();

      if (error || !data) {
        throw new BadRequestError("Failed to update user");
      }

      return data as User;
    } catch (error) {
      throw new BadRequestError("Failed to update user");
    }
  }

  /**
   * Update user avatar
   * @param userId - User ID
   * @param avatarUrl - Avatar URL
   * @returns Updated user
   */
  public static async updateAvatar(userId: string, avatarUrl: string): Promise<User> {
    try {
      const { data, error } = await supabase
        .from("users")
        .update({
          avatar: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select("id, email, first_name, last_name, avatar, created_at, updated_at")
        .single();

      if (error || !data) {
        throw new BadRequestError("Failed to update avatar");
      }

      return data as User;
    } catch (error) {
      throw new BadRequestError("Failed to update avatar");
    }
  }
} 