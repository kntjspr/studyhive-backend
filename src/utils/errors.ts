/**
 * Base API Error class
 * Extends the built-in Error class with additional properties for API errors
 */
export class ApiError extends Error {
  statusCode: number;
  errors?: Record<string, string[]>;

  /**
   * Creates a new ApiError instance
   * @param message - Error message
   * @param statusCode - HTTP status code
   * @param errors - Optional validation errors
   */
  constructor(message: string, statusCode: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Bad Request Error (400)
 * Used for invalid request data
 */
export class BadRequestError extends ApiError {
  constructor(message = "Bad Request", errors?: Record<string, string[]>) {
    super(message, 400, errors);
  }
}

/**
 * Unauthorized Error (401)
 * Used for authentication failures
 */
export class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

/**
 * Forbidden Error (403)
 * Used for permission denied errors
 */
export class ForbiddenError extends ApiError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

/**
 * Not Found Error (404)
 * Used when a resource is not found
 */
export class NotFoundError extends ApiError {
  constructor(message = "Not Found") {
    super(message, 404);
  }
}

/**
 * Conflict Error (409)
 * Used when a resource already exists
 */
export class ConflictError extends ApiError {
  constructor(message = "Conflict") {
    super(message, 409);
  }
}

/**
 * Validation Error (422)
 * Used for validation errors
 */
export class ValidationError extends ApiError {
  constructor(message = "Validation Error", errors: Record<string, string[]>) {
    super(message, 422, errors);
  }
}

/**
 * Internal Server Error (500)
 * Used for server errors
 */
export class InternalServerError extends ApiError {
  constructor(message = "Internal Server Error") {
    super(message, 500);
  }
}

/**
 * Too Many Requests Error (429)
 * Used for rate limiting
 */
export class TooManyRequestsError extends ApiError {
  constructor(message = "Too Many Requests") {
    super(message, 429);
  }
} 