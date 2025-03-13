/**
 * Base response interface
 */
export interface BaseResponse {
  success: boolean;
  message: string;
}

/**
 * Authentication response
 */
export interface AuthResponse extends BaseResponse {
  data: {
    token: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      first_name: string;
      last_name: string;
      avatar?: string;
    };
  };
}

/**
 * User profile response
 */
export interface UserProfileResponse extends BaseResponse {
  data: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    avatar?: string;
    created_at: string;
    updated_at: string;
  };
}

/**
 * Task response
 */
export interface TaskResponse extends BaseResponse {
  data: {
    id: string;
    user_id: string;
    title: string;
    description?: string;
    due_date?: string;
    priority: "low" | "medium" | "high";
    status: "pending" | "in_progress" | "completed";
    category?: string;
    is_completed: boolean;
    created_at: string;
    updated_at: string;
  };
}

/**
 * Task list response
 */
export interface TaskListResponse extends BaseResponse {
  data: {
    tasks: Array<{
      id: string;
      user_id: string;
      title: string;
      description?: string;
      due_date?: string;
      priority: "low" | "medium" | "high";
      status: "pending" | "in_progress" | "completed";
      category?: string;
      is_completed: boolean;
      created_at: string;
      updated_at: string;
    }>;
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

/**
 * Task categories response
 */
export interface TaskCategoriesResponse extends BaseResponse {
  data: {
    categories: string[];
  };
}

/**
 * Event response
 */
export interface EventResponse extends BaseResponse {
  data: {
    id: string;
    user_id: string;
    title: string;
    description?: string;
    start_time: string;
    end_time: string;
    location?: string;
    color?: string;
    is_all_day: boolean;
    reminder?: string;
    created_at: string;
    updated_at: string;
  };
}

/**
 * Event list response
 */
export interface EventListResponse extends BaseResponse {
  data: {
    events: Array<{
      id: string;
      user_id: string;
      title: string;
      description?: string;
      start_time: string;
      end_time: string;
      location?: string;
      color?: string;
      is_all_day: boolean;
      reminder?: string;
      created_at: string;
      updated_at: string;
    }>;
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

/**
 * Error response
 */
export interface ErrorResponse extends BaseResponse {
  errors?: Record<string, string[]>;
} 