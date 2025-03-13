import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";
import { validationError } from "../utils/app-error";

/**
 * Middleware for validating request data using Joi schemas
 * @param schema - Joi validation schema
 * @returns Express middleware function
 */
export const validate = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Combine all request data for validation
    const dataToValidate = {
      ...req.body,
      ...req.params,
      ...req.query,
    };

    // Validate data against schema
    const { error } = schema.validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: true,
    });

    // If validation fails, format errors and return 422 response
    if (error) {
      const errors: Record<string, string> = {};
      
      // Format Joi validation errors
      error.details.forEach((detail) => {
        const key = detail.path.join(".");
        errors[key] = detail.message;
      });

      // Throw validation error
      next(validationError("Validation failed", errors));
      return;
    }

    // Validation passed, continue to next middleware
    next();
  };
}; 