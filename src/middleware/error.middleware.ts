import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
import { AppError } from "../utils/app-error";

/**
 * Global error handler middleware
 * Handles all errors thrown in the application
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log the error
  logger.error(`${err.name}: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Default error values
  let statusCode = 500;
  let message = "Internal Server Error";
  let errors: Record<string, string> | undefined = undefined;

  // Handle AppError instances
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  }

  // Handle validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation Error";
    // Handle mongoose validation errors if using mongoose
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please log in again.";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Your token has expired. Please log in again.";
  }

  // Handle Supabase errors
  if (err.name === "PostgrestError") {
    statusCode = 400;
    message = err.message;
  }

  // Send response
  res.status(statusCode).json({
    status: "error",
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

/**
 * Not found middleware
 * Handles requests to non-existent routes
 * @param req - Express request object
 * @param res - Express response object
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Not Found - ${req.originalUrl}`,
  });
}; 