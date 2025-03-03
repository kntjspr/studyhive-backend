import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import { StatusCodes } from "http-status-codes";
import { AppError } from "./errorHandler";

export const validateRequest = (schema: AnyZodObject) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Validation failed",
        error.errors
      );
    }
    next(error);
  }
}; 