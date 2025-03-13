import { TaskModel } from "../models/task.model";
import { CreateTaskRequest, UpdateTaskRequest, TaskFilterRequest } from "../types/request.types";
import { Task } from "../types/model.types";
import { BadRequestError, NotFoundError } from "../utils/errors";
import logger from "../utils/logger";

/**
 * Task service
 * Handles task-related business logic
 */
export class TaskService {
  /**
   * Create a new task
   * @param userId - User ID
   * @param taskData - Task creation data
   * @returns Created task
   */
  public static async createTask(userId: string, taskData: CreateTaskRequest): Promise<Task> {
    try {
      return await TaskModel.create(userId, taskData);
    } catch (error) {
      logger.error("Create task error", { error, userId });
      throw error;
    }
  }

  /**
   * Get task by ID
   * @param taskId - Task ID
   * @param userId - User ID
   * @returns Task data
   */
  public static async getTaskById(taskId: string, userId: string): Promise<Task> {
    try {
      return await TaskModel.getById(taskId, userId);
    } catch (error) {
      logger.error("Get task error", { error, taskId, userId });
      throw error;
    }
  }

  /**
   * Get all tasks for a user with filtering and sorting
   * @param userId - User ID
   * @param filter - Filter and sort options
   * @returns Array of tasks and pagination info
   */
  public static async getTasks(
    userId: string,
    filter: TaskFilterRequest
  ): Promise<{
    tasks: Task[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      return await TaskModel.getAll(userId, filter);
    } catch (error) {
      logger.error("Get tasks error", { error, userId });
      throw error;
    }
  }

  /**
   * Update a task
   * @param taskId - Task ID
   * @param userId - User ID
   * @param taskData - Task update data
   * @returns Updated task
   */
  public static async updateTask(
    taskId: string,
    userId: string,
    taskData: UpdateTaskRequest
  ): Promise<Task> {
    try {
      return await TaskModel.update(taskId, userId, taskData);
    } catch (error) {
      logger.error("Update task error", { error, taskId, userId });
      throw error;
    }
  }

  /**
   * Toggle task completion status
   * @param taskId - Task ID
   * @param userId - User ID
   * @returns Updated task
   */
  public static async toggleTaskCompletion(taskId: string, userId: string): Promise<Task> {
    try {
      return await TaskModel.toggleCompletion(taskId, userId);
    } catch (error) {
      logger.error("Toggle task completion error", { error, taskId, userId });
      throw error;
    }
  }

  /**
   * Delete a task
   * @param taskId - Task ID
   * @param userId - User ID
   * @returns Success status
   */
  public static async deleteTask(taskId: string, userId: string): Promise<boolean> {
    try {
      return await TaskModel.delete(taskId, userId);
    } catch (error) {
      logger.error("Delete task error", { error, taskId, userId });
      throw error;
    }
  }

  /**
   * Get all task categories for a user
   * @param userId - User ID
   * @returns Array of unique categories
   */
  public static async getTaskCategories(userId: string): Promise<string[]> {
    try {
      return await TaskModel.getCategories(userId);
    } catch (error) {
      logger.error("Get task categories error", { error, userId });
      throw error;
    }
  }
}
