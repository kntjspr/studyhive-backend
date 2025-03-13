import { Request, Response, NextFunction } from "express";
import { TaskService } from "../services/task.service";
import { CreateTaskRequest, UpdateTaskRequest, TaskFilterRequest } from "../types/request.types";
import { TaskResponse, TaskListResponse, TaskCategoriesResponse } from "../types/response.types";
import { BadRequestError } from "../utils/errors";
import logger from "../utils/logger";

/**
 * Task controller
 * Handles task-related requests
 */
export class TaskController {
  /**
   * Create a new task
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next function
   */
  public static async createTask(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Get user ID from authenticated request
      const userId = req.user?.id;
      if (!userId) {
        throw new BadRequestError("User ID is required");
      }

      const taskData = req.body as CreateTaskRequest;
      const task = await TaskService.createTask(userId, taskData);

      const response: TaskResponse = {
        success: true,
        message: "Task created successfully",
        data: task,
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get task by ID
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next function
   */
  public static async getTaskById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Get user ID from authenticated request
      const userId = req.user?.id;
      if (!userId) {
        throw new BadRequestError("User ID is required");
      }

      const taskId = req.params.id;
      if (!taskId) {
        throw new BadRequestError("Task ID is required");
      }

      const task = await TaskService.getTaskById(taskId, userId);

      const response: TaskResponse = {
        success: true,
        message: "Task retrieved successfully",
        data: task,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all tasks for a user with filtering and sorting
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next function
   */
  public static async getTasks(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Get user ID from authenticated request
      const userId = req.user?.id;
      if (!userId) {
        throw new BadRequestError("User ID is required");
      }

      // Extract filter parameters from query
      const filter: TaskFilterRequest = {
        status: req.query.status as "pending" | "in_progress" | "completed" | undefined,
        priority: req.query.priority as "low" | "medium" | "high" | undefined,
        category: req.query.category as string | undefined,
        sort_by: req.query.sort_by as
          | "title"
          | "due_date"
          | "priority"
          | "status"
          | "category"
          | "created_at"
          | "updated_at"
          | undefined,
        sort_order: req.query.sort_order as "asc" | "desc" | undefined,
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
      };

      const result = await TaskService.getTasks(userId, filter);

      const response: TaskListResponse = {
        success: true,
        message: "Tasks retrieved successfully",
        data: {
          tasks: result.tasks,
          pagination: {
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages,
          },
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a task
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next function
   */
  public static async updateTask(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Get user ID from authenticated request
      const userId = req.user?.id;
      if (!userId) {
        throw new BadRequestError("User ID is required");
      }

      const taskId = req.params.id;
      if (!taskId) {
        throw new BadRequestError("Task ID is required");
      }

      const taskData = req.body as UpdateTaskRequest;
      const task = await TaskService.updateTask(taskId, userId, taskData);

      const response: TaskResponse = {
        success: true,
        message: "Task updated successfully",
        data: task,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Toggle task completion status
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next function
   */
  public static async toggleTaskCompletion(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Get user ID from authenticated request
      const userId = req.user?.id;
      if (!userId) {
        throw new BadRequestError("User ID is required");
      }

      const taskId = req.params.id;
      if (!taskId) {
        throw new BadRequestError("Task ID is required");
      }

      const task = await TaskService.toggleTaskCompletion(taskId, userId);

      const response: TaskResponse = {
        success: true,
        message: `Task marked as ${task.is_completed ? "completed" : "incomplete"}`,
        data: task,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a task
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next function
   */
  public static async deleteTask(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Get user ID from authenticated request
      const userId = req.user?.id;
      if (!userId) {
        throw new BadRequestError("User ID is required");
      }

      const taskId = req.params.id;
      if (!taskId) {
        throw new BadRequestError("Task ID is required");
      }

      await TaskService.deleteTask(taskId, userId);

      res.status(200).json({
        success: true,
        message: "Task deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all task categories for a user
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next function
   */
  public static async getTaskCategories(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Get user ID from authenticated request
      const userId = req.user?.id;
      if (!userId) {
        throw new BadRequestError("User ID is required");
      }

      const categories = await TaskService.getTaskCategories(userId);

      const response: TaskCategoriesResponse = {
        success: true,
        message: "Task categories retrieved successfully",
        data: {
          categories,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
} 