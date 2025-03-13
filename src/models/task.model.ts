import { v4 as uuidv4 } from "uuid";
import supabase from "../config/supabase";
import { Task } from "../types/model.types";
import { CreateTaskRequest, UpdateTaskRequest, TaskFilterRequest } from "../types/request.types";
import { BadRequestError, NotFoundError } from "../utils/errors";

/**
 * Task model
 * Handles database operations for tasks
 */
export class TaskModel {
  /**
   * Create a new task
   * @param userId - User ID
   * @param taskData - Task creation data
   * @returns Created task
   */
  public static async create(userId: string, taskData: CreateTaskRequest): Promise<Task> {
    try {
      // Generate UUID
      const taskId = uuidv4();

      // Create task
      const { data, error } = await supabase.from("tasks").insert({
        id: taskId,
        user_id: userId,
        title: taskData.title,
        description: taskData.description,
        due_date: taskData.due_date,
        priority: taskData.priority || "medium",
        status: taskData.status || "pending",
        category: taskData.category,
        is_completed: taskData.is_completed || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }).select("*").single();

      if (error) {
        throw new BadRequestError(error.message);
      }

      return data as Task;
    } catch (error) {
      if (error instanceof BadRequestError) {
        throw error;
      }
      throw new BadRequestError("Failed to create task");
    }
  }

  /**
   * Get task by ID
   * @param taskId - Task ID
   * @param userId - User ID
   * @returns Task data
   */
  public static async getById(taskId: string, userId: string): Promise<Task> {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", taskId)
        .eq("user_id", userId)
        .single();

      if (error || !data) {
        throw new NotFoundError("Task not found");
      }

      return data as Task;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new BadRequestError("Failed to get task");
    }
  }

  /**
   * Get all tasks for a user with filtering and sorting
   * @param userId - User ID
   * @param filter - Filter and sort options
   * @returns Array of tasks and pagination info
   */
  public static async getAll(
    userId: string,
    filter: TaskFilterRequest
  ): Promise<{ tasks: Task[]; total: number; page: number; limit: number; totalPages: number }> {
    try {
      // Default values
      const page = filter.page || 1;
      const limit = filter.limit || 10;
      const sortBy = filter.sort_by || "created_at";
      const sortOrder = filter.sort_order || "desc";
      
      // Calculate range for pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      // Start query
      let query = supabase
        .from("tasks")
        .select("*", { count: "exact" })
        .eq("user_id", userId);

      // Apply filters
      if (filter.status) {
        query = query.eq("status", filter.status);
      }
      
      if (filter.priority) {
        query = query.eq("priority", filter.priority);
      }
      
      if (filter.category) {
        query = query.eq("category", filter.category);
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === "asc" });

      // Apply pagination
      query = query.range(from, to);

      // Execute query
      const { data, error, count } = await query;

      if (error) {
        throw new BadRequestError(error.message);
      }

      const totalCount = count || 0;
      const totalPages = Math.ceil(totalCount / limit);

      return {
        tasks: data as Task[],
        total: totalCount,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      if (error instanceof BadRequestError) {
        throw error;
      }
      throw new BadRequestError("Failed to get tasks");
    }
  }

  /**
   * Update a task
   * @param taskId - Task ID
   * @param userId - User ID
   * @param taskData - Task update data
   * @returns Updated task
   */
  public static async update(
    taskId: string,
    userId: string,
    taskData: UpdateTaskRequest
  ): Promise<Task> {
    try {
      // Check if task exists
      const task = await this.getById(taskId, userId);

      // Update task
      const { data, error } = await supabase
        .from("tasks")
        .update({
          ...taskData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", taskId)
        .eq("user_id", userId)
        .select("*")
        .single();

      if (error) {
        throw new BadRequestError(error.message);
      }

      return data as Task;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new BadRequestError("Failed to update task");
    }
  }

  /**
   * Toggle task completion status
   * @param taskId - Task ID
   * @param userId - User ID
   * @returns Updated task
   */
  public static async toggleCompletion(taskId: string, userId: string): Promise<Task> {
    try {
      // Get current task
      const task = await this.getById(taskId, userId);

      // Toggle completion status
      const { data, error } = await supabase
        .from("tasks")
        .update({
          is_completed: !task.is_completed,
          status: !task.is_completed ? "completed" : "pending",
          updated_at: new Date().toISOString(),
        })
        .eq("id", taskId)
        .eq("user_id", userId)
        .select("*")
        .single();

      if (error) {
        throw new BadRequestError(error.message);
      }

      return data as Task;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new BadRequestError("Failed to toggle task completion");
    }
  }

  /**
   * Delete a task
   * @param taskId - Task ID
   * @param userId - User ID
   * @returns Success status
   */
  public static async delete(taskId: string, userId: string): Promise<boolean> {
    try {
      // Check if task exists
      await this.getById(taskId, userId);

      // Delete task
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId)
        .eq("user_id", userId);

      if (error) {
        throw new BadRequestError(error.message);
      }

      return true;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new BadRequestError("Failed to delete task");
    }
  }

  /**
   * Get all task categories for a user
   * @param userId - User ID
   * @returns Array of unique categories
   */
  public static async getCategories(userId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("category")
        .eq("user_id", userId)
        .not("category", "is", null);

      if (error) {
        throw new BadRequestError(error.message);
      }

      // Extract unique categories
      const categories = data
        .map((task) => task.category)
        .filter((category, index, self) => self.indexOf(category) === index);

      return categories;
    } catch (error) {
      throw new BadRequestError("Failed to get task categories");
    }
  }
} 