import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { unauthorizedError, forbiddenError } from "../utils/app-error";
import config from "../config";
import { UserService } from "../services/user.service";
import { JwtPayload } from "../types/auth.types";
import { User } from "../types/model.types";

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(unauthorizedError("No token provided"));
    }
    
    const token = authHeader.split(" ")[1];
    
    if (!token) {
      return next(unauthorizedError("No token provided"));
    }
    
    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret as jwt.Secret) as JwtPayload;
    
    if (!decoded.userId) {
      return next(unauthorizedError("Invalid token"));
    }
    
    // Get user from database
    const user = await UserService.getProfile(decoded.userId);
    
    if (!user) {
      return next(unauthorizedError("User not found"));
    }
    
    // Attach user to request object
    req.user = user;
    
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(unauthorizedError("Invalid token"));
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      return next(unauthorizedError("Token expired"));
    }
    
    next(error);
  }
};

/**
 * Role-based authorization middleware
 * Checks if user has required role
 * @param roles - Array of allowed roles
 * @returns Express middleware function
 */
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(unauthorizedError("User not authenticated"));
    }
    
    // Add a default role if not present
    const userRole = (req.user as any).role || "user";
    
    if (!roles.includes(userRole)) {
      return next(forbiddenError("You do not have permission to access this resource"));
    }
    
    next();
  };
}; 