import { Request, Response, NextFunction } from "express";
import { supabase } from "../config/supabase";
import { StatusCodes } from "http-status-codes";
import { AppError } from "./errorHandler";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new AppError(
        StatusCodes.UNAUTHORIZED,
        "No token provided"
      );
    }

    const token = authHeader.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      throw new AppError(
        StatusCodes.UNAUTHORIZED,
        "Invalid or expired token"
      );
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select()
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      throw new AppError(
        StatusCodes.UNAUTHORIZED,
        "User profile not found"
      );
    }

    req.user = profile;
    next();
  } catch (error) {
    next(error);
  }
}; 