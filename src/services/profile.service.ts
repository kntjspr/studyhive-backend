import { supabase } from "../config/supabase";
import { AppError } from "../middleware/errorHandler";
import { StatusCodes } from "http-status-codes";
import { Profile } from "../types/models";

export class ProfileService {
  async getProfile(id: string): Promise<Profile> {
    const { data, error } = await supabase
      .from("profiles")
      .select()
      .eq("id", id)
      .single();

    if (error) {
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to fetch profile",
        error.message
      );
    }

    if (!data) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        "Profile not found"
      );
    }

    return data as Profile;
  }

  async updateProfile(id: string, updates: Partial<Profile>): Promise<Profile> {
    // Remove readonly fields
    const { id: _, email: __, createdAt: ___, updatedAt: ____, ...validUpdates } = updates;

    const { data, error } = await supabase
      .from("profiles")
      .update(validUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to update profile",
        error.message
      );
    }

    if (!data) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        "Profile not found"
      );
    }

    return data as Profile;
  }
} 