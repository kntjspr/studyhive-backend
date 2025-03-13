import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import taskRoutes from "./task.routes";
import eventRoutes from "./event.routes";

const router = Router();

/**
 * @route /api/auth
 * @desc Authentication routes
 */
router.use("/auth", authRoutes);

/**
 * @route /api/users
 * @desc User management routes
 */
router.use("/users", userRoutes);

/**
 * @route /api/tasks
 * @desc Task management routes
 */
router.use("/tasks", taskRoutes);

/**
 * @route /api/events
 * @desc Event management routes
 */
router.use("/events", eventRoutes);

export default router; 