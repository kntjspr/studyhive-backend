import { Router } from "express";
import { TaskController } from "../controllers/task.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import { createTaskValidation, updateTaskValidation } from "../utils/validators";

const router = Router();

// All task routes require authentication
router.use(authenticate);

/**
 * @route POST /tasks
 * @desc Create a new task
 * @access Private
 */
router.post(
  "/",
  validate(createTaskValidation),
  TaskController.createTask
);

/**
 * @route GET /tasks
 * @desc Get all tasks for the user with optional filters
 * @access Private
 */
router.get("/", TaskController.getTasks);

/**
 * @route GET /tasks/:id
 * @desc Get a specific task by ID
 * @access Private
 */
router.get("/:id", TaskController.getTaskById);

/**
 * @route PUT /tasks/:id
 * @desc Update a task
 * @access Private
 */
router.put(
  "/:id",
  validate(updateTaskValidation),
  TaskController.updateTask
);

/**
 * @route DELETE /tasks/:id
 * @desc Delete a task
 * @access Private
 */
router.delete("/:id", TaskController.deleteTask);

/**
 * @route PUT /tasks/:id/complete
 * @desc Mark a task as complete
 * @access Private
 */
router.put("/:id/complete", TaskController.toggleTaskCompletion);

export default router; 