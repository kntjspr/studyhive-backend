import Joi from "joi";

/**
 * User registration validation schema
 */
export const registerValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(8).required().messages({
    "string.min": "Password must be at least 8 characters long",
    "any.required": "Password is required",
  }),
  firstName: Joi.string().required().messages({
    "any.required": "First name is required",
  }),
  lastName: Joi.string().required().messages({
    "any.required": "Last name is required",
  }),
});

/**
 * User login validation schema
 */
export const loginValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});

/**
 * Refresh token validation schema
 */
export const refreshTokenValidation = Joi.object({
  refreshToken: Joi.string().required().messages({
    "any.required": "Refresh token is required",
  }),
});

/**
 * Update profile validation schema
 */
export const updateProfileValidation = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  bio: Joi.string().allow("", null),
  preferences: Joi.object(),
});

/**
 * Create task validation schema
 */
export const createTaskValidation = Joi.object({
  title: Joi.string().required().messages({
    "any.required": "Task title is required",
  }),
  description: Joi.string().allow("", null),
  dueDate: Joi.date().iso(),
  priority: Joi.string().valid("low", "medium", "high"),
  status: Joi.string().valid("todo", "in_progress", "completed"),
  tags: Joi.array().items(Joi.string()),
});

/**
 * Update task validation schema
 */
export const updateTaskValidation = Joi.object({
  title: Joi.string(),
  description: Joi.string().allow("", null),
  dueDate: Joi.date().iso(),
  priority: Joi.string().valid("low", "medium", "high"),
  status: Joi.string().valid("todo", "in_progress", "completed"),
  tags: Joi.array().items(Joi.string()),
});

/**
 * Create event validation schema
 */
export const createEventValidation = Joi.object({
  title: Joi.string().required().messages({
    "any.required": "Event title is required",
  }),
  description: Joi.string().allow("", null),
  startDate: Joi.date().iso().required().messages({
    "any.required": "Event start date is required",
  }),
  endDate: Joi.date().iso().min(Joi.ref("startDate")).messages({
    "date.min": "End date must be after start date",
  }),
  location: Joi.string().allow("", null),
  isAllDay: Joi.boolean(),
  color: Joi.string(),
  reminders: Joi.array().items(
    Joi.object({
      time: Joi.date().iso().required(),
      type: Joi.string().valid("email", "notification").required(),
    })
  ),
});

/**
 * Update event validation schema
 */
export const updateEventValidation = Joi.object({
  title: Joi.string(),
  description: Joi.string().allow("", null),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso().min(Joi.ref("startDate")).messages({
    "date.min": "End date must be after start date",
  }),
  location: Joi.string().allow("", null),
  isAllDay: Joi.boolean(),
  color: Joi.string(),
  reminders: Joi.array().items(
    Joi.object({
      time: Joi.date().iso().required(),
      type: Joi.string().valid("email", "notification").required(),
    })
  ),
}); 