/**
 * User model
 */
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Task model
 */
export interface Task {
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
}

/**
 * Event model
 */
export interface Event {
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
}

/**
 * Meeting model
 */
export interface Meeting {
  id: string;
  host_id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  is_public: boolean;
  max_participants?: number;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
}

/**
 * Meeting participant model
 */
export interface MeetingParticipant {
  meeting_id: string;
  user_id: string;
  joined_at: string;
}

/**
 * Message model
 */
export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  is_read: boolean;
  is_group: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * File model
 */
export interface File {
  id: string;
  user_id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  file_path: string;
  created_at: string;
  updated_at: string;
}

/**
 * Study group model
 */
export interface StudyGroup {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Study group member model
 */
export interface StudyGroupMember {
  group_id: string;
  user_id: string;
  role: "owner" | "admin" | "member";
  joined_at: string;
}

/**
 * Note model
 */
export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  is_public: boolean;
  tags?: string[];
  created_at: string;
  updated_at: string;
} 