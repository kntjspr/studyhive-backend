export enum LearningStyle {
  Visual = "visual",
  Auditory = "auditory",
  ReadingWriting = "reading_writing",
  Kinesthetic = "kinesthetic",
}

export enum UserRole {
  Student = "student",
  Admin = "admin",
}

export enum StudyGroupStatus {
  Active = "active",
  Inactive = "inactive",
  Archived = "archived",
}

export enum NotificationType {
  GroupInvite = "group_invite",
  SessionReminder = "session_reminder",
  ResourceShared = "resource_shared",
  Message = "message",
}

export enum ResourceType {
  Note = "note",
  Link = "link",
  File = "file",
  Quiz = "quiz",
  Flashcard = "flashcard",
}

export enum SessionAttendanceStatus {
  Attending = "attending",
  Declined = "declined",
  Maybe = "maybe",
}

export enum TaskStatus {
  Pending = "pending",
  InProgress = "in_progress",
  Completed = "completed",
}

export interface Profile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  bio?: string;
  learningStyle?: LearningStyle;
  academicInterests?: string[];
  availabilitySchedule?: Record<string, string[]>;
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  id: string;
  name: string;
  description?: string;
  difficultyLevel: number;
  createdAt: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  description?: string;
  subjectId: string;
  creatorId: string;
  maxMembers: number;
  status: StudyGroupStatus;
  meetingSchedule?: Record<string, string[]>;
  createdAt: string;
  updatedAt: string;
}

export interface GroupMember {
  groupId: string;
  userId: string;
  joinedAt: string;
}

export interface StudyResource {
  id: string;
  title: string;
  description?: string;
  type: ResourceType;
  content?: any;
  url?: string;
  groupId: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudySession {
  id: string;
  groupId: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  meetingLink?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SessionAttendance {
  sessionId: string;
  userId: string;
  status: SessionAttendanceStatus;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  status: TaskStatus;
  groupId: string;
  assigneeId?: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  groupId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  data?: any;
  createdAt: string;
} 