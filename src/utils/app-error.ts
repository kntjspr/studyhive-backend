/**
 * Custom application error class
 * Extends the built-in Error class with additional properties
 */
export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  errors?: Record<string, string>;

  /**
   * Create a new AppError
   * @param message - Error message
   * @param statusCode - HTTP status code
   * @param errors - Optional validation errors object
   */
  constructor(
    message: string,
    statusCode: number,
    errors?: Record<string, string>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.errors = errors;

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Create a 400 Bad Request error
 * @param message - Error message
 * @param errors - Optional validation errors object
 * @returns AppError instance
 */
export const badRequestError = (
  message = "Bad Request",
  errors?: Record<string, string>
): AppError => {
  return new AppError(message, 400, errors);
};

/**
 * Create a 401 Unauthorized error
 * @param message - Error message
 * @returns AppError instance
 */
export const unauthorizedError = (
  message = "Unauthorized"
): AppError => {
  return new AppError(message, 401);
};

/**
 * Create a 403 Forbidden error
 * @param message - Error message
 * @returns AppError instance
 */
export const forbiddenError = (
  message = "Forbidden"
): AppError => {
  return new AppError(message, 403);
};

/**
 * Create a 404 Not Found error
 * @param message - Error message
 * @returns AppError instance
 */
export const notFoundError = (
  message = "Resource not found"
): AppError => {
  return new AppError(message, 404);
};

/**
 * Create a 409 Conflict error
 * @param message - Error message
 * @returns AppError instance
 */
export const conflictError = (
  message = "Resource already exists"
): AppError => {
  return new AppError(message, 409);
};

/**
 * Create a 422 Unprocessable Entity error
 * @param message - Error message
 * @param errors - Validation errors object
 * @returns AppError instance
 */
export const validationError = (
  message = "Validation failed",
  errors: Record<string, string>
): AppError => {
  return new AppError(message, 422, errors);
};

/**
 * Create a 500 Internal Server Error
 * @param message - Error message
 * @returns AppError instance
 */
export const internalServerError = (
  message = "Internal Server Error"
): AppError => {
  return new AppError(message, 500);
}; 