import { Router } from "express";
import { EventController } from "../controllers/event.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import { createEventValidation, updateEventValidation } from "../utils/validators";

const router = Router();

// All event routes require authentication
router.use(authenticate);

/**
 * @route POST /events
 * @desc Create a new event
 * @access Private
 */
router.post(
  "/",
  validate(createEventValidation),
  EventController.createEvent
);

/**
 * @route GET /events
 * @desc Get all events for the user with optional date range and pagination
 * @access Private
 */
router.get("/", EventController.getEvents);

/**
 * @route GET /events/:id
 * @desc Get a specific event by ID
 * @access Private
 */
router.get("/:id", EventController.getEventById);

/**
 * @route PUT /events/:id
 * @desc Update an event
 * @access Private
 */
router.put(
  "/:id",
  validate(updateEventValidation),
  EventController.updateEvent
);

/**
 * @route DELETE /events/:id
 * @desc Delete an event
 * @access Private
 */
router.delete("/:id", EventController.deleteEvent);

export default router; 