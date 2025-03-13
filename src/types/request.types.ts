/**
 * User registration request
 */
export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  avatar?: string;
}

/**
 * User login request
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * User profile update request
 */
export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  avatar?: string;
}

/**
 * Task creation request
 */
export interface CreateTaskRequest {
  title: string;
  description?: string;
  due_date?: string;
  priority?: "low" | "medium" | "high";
  status?: "pending" | "in_progress" | "completed";
  category?: string;
  is_completed?: boolean;
}

/**
 * Task update request
 */
export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  due_date?: string;
  priority?: "low" | "medium" | "high";
  status?: "pending" | "in_progress" | "completed";
  category?: string;
  is_completed?: boolean;
}

/**
 * Task filter request
 */
export interface TaskFilterRequest {
  status?: "pending" | "in_progress" | "completed";
  priority?: "low" | "medium" | "high";
  category?: string;
  sort_by?: "title" | "due_date" | "priority" | "status" | "category" | "created_at" | "updated_at";
  sort_order?: "asc" | "desc";
  page?: number;
  limit?: number;
}

/**
 * Event creation request
 */
export interface CreateEventRequest {
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  color?: string;
  is_all_day?: boolean;
  reminder?: string;
}

/**
 * Event update request
 */
export interface UpdateEventRequest {
  title?: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  color?: string;
  is_all_day?: boolean;
  reminder?: string;
} 