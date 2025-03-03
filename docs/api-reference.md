# StudyHive API Reference

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```http
Authorization: Bearer <access_token>
```

### Sign Up
```http
POST /auth/signup
```

Create a new user account.

**Request Body:**
```json
{
  "email": "string",
  "password": "string",
  "fullName": "string",
  "learningStyle": "visual | auditory | reading_writing | kinesthetic",
  "academicInterests": ["string"]
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "uuid",
    "email": "string",
    "fullName": "string",
    "role": "student",
    "learningStyle": "string",
    "academicInterests": ["string"]
  },
  "session": {
    "access_token": "string",
    "refresh_token": "string"
  }
}
```

### Sign In
```http
POST /auth/signin
```

Authenticate an existing user.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "uuid",
    "email": "string",
    "fullName": "string",
    "role": "string"
  },
  "session": {
    "access_token": "string",
    "refresh_token": "string"
  }
}
```

### Forgot Password
```http
POST /auth/forgot-password
```

Request a password reset email.

**Request Body:**
```json
{
  "email": "string"
}
```

**Response:** `200 OK`
```json
{
  "message": "Password reset instructions sent to email"
}
```

## Profile Management

### Get Profile
```http
GET /profiles/{id}
```

Retrieve a user's profile information.

**Parameters:**
- `id` (path) - UUID of the user

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "email": "string",
  "fullName": "string",
  "role": "string",
  "avatarUrl": "string",
  "bio": "string",
  "learningStyle": "string",
  "academicInterests": ["string"],
  "availabilitySchedule": {
    "monday": ["09:00-12:00"],
    "tuesday": ["14:00-17:00"]
  },
  "createdAt": "string",
  "updatedAt": "string"
}
```

### Update Profile
```http
PATCH /profiles/{id}
```

Update a user's profile information.

**Parameters:**
- `id` (path) - UUID of the user

**Request Body:**
```json
{
  "fullName": "string",
  "avatarUrl": "string",
  "bio": "string",
  "learningStyle": "string",
  "academicInterests": ["string"],
  "availabilitySchedule": {
    "monday": ["09:00-12:00"],
    "tuesday": ["14:00-17:00"]
  }
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "email": "string",
  "fullName": "string",
  "role": "string",
  "avatarUrl": "string",
  "bio": "string",
  "learningStyle": "string",
  "academicInterests": ["string"],
  "availabilitySchedule": {
    "monday": ["09:00-12:00"],
    "tuesday": ["14:00-17:00"]
  },
  "updatedAt": "string"
}
```

## Study Groups

### Create Group
```http
POST /groups
```

Create a new study group.

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "subjectId": "uuid",
  "maxMembers": "number",
  "meetingSchedule": {
    "monday": ["09:00-12:00"],
    "wednesday": ["14:00-17:00"]
  }
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "subject": {
    "id": "uuid",
    "name": "string"
  },
  "creator": {
    "id": "uuid",
    "fullName": "string"
  },
  "maxMembers": "number",
  "status": "active",
  "meetingSchedule": {
    "monday": ["09:00-12:00"],
    "wednesday": ["14:00-17:00"]
  },
  "createdAt": "string"
}
```

### Get Group
```http
GET /groups/{id}
```

Retrieve group details.

**Parameters:**
- `id` (path) - UUID of the group

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "subject": {
    "id": "uuid",
    "name": "string"
  },
  "members": [
    {
      "id": "uuid",
      "fullName": "string",
      "avatarUrl": "string"
    }
  ],
  "maxMembers": "number",
  "status": "string",
  "meetingSchedule": {
    "monday": ["09:00-12:00"],
    "wednesday": ["14:00-17:00"]
  }
}
```

### Join Group
```http
POST /groups/{id}/members
```

Join a study group.

**Parameters:**
- `id` (path) - UUID of the group

**Response:** `200 OK`
```json
{
  "groupId": "uuid",
  "userId": "uuid",
  "joinedAt": "string"
}
```

### Leave Group
```http
DELETE /groups/{id}/members
```

Leave a study group.

**Parameters:**
- `id` (path) - UUID of the group

**Response:** `204 No Content`

## Study Resources

### Create Resource
```http
POST /groups/{groupId}/resources
```

Create a new study resource.

**Parameters:**
- `groupId` (path) - UUID of the group

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "type": "note | link | file | quiz | flashcard",
  "content": "object",
  "url": "string"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "type": "string",
  "content": "object",
  "url": "string",
  "creator": {
    "id": "uuid",
    "fullName": "string"
  },
  "createdAt": "string"
}
```

### Get Group Resources
```http
GET /groups/{groupId}/resources
```

Retrieve all resources in a group.

**Parameters:**
- `groupId` (path) - UUID of the group
- `type` (query) - Filter by resource type

**Response:** `200 OK`
```json
{
  "resources": [
    {
      "id": "uuid",
      "title": "string",
      "description": "string",
      "type": "string",
      "url": "string",
      "creator": {
        "id": "uuid",
        "fullName": "string"
      },
      "createdAt": "string"
    }
  ]
}
```

## Study Sessions

### Schedule Session
```http
POST /groups/{groupId}/sessions
```

Schedule a new study session.

**Parameters:**
- `groupId` (path) - UUID of the group

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "startTime": "string",
  "endTime": "string",
  "meetingLink": "string"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "startTime": "string",
  "endTime": "string",
  "meetingLink": "string",
  "group": {
    "id": "uuid",
    "name": "string"
  },
  "createdAt": "string"
}
```

### Get Session
```http
GET /groups/{groupId}/sessions/{id}
```

Retrieve session details.

**Parameters:**
- `groupId` (path) - UUID of the group
- `id` (path) - UUID of the session

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "startTime": "string",
  "endTime": "string",
  "meetingLink": "string",
  "attendees": [
    {
      "id": "uuid",
      "fullName": "string",
      "status": "attending | declined | maybe"
    }
  ]
}
```

### Update Attendance
```http
PATCH /groups/{groupId}/sessions/{id}/attendance
```

Update session attendance status.

**Parameters:**
- `groupId` (path) - UUID of the group
- `id` (path) - UUID of the session

**Request Body:**
```json
{
  "status": "attending | declined | maybe"
}
```

**Response:** `200 OK`
```json
{
  "sessionId": "uuid",
  "userId": "uuid",
  "status": "string",
  "updatedAt": "string"
}
```

## Tasks

### Create Task
```http
POST /groups/{groupId}/tasks
```

Create a new task.

**Parameters:**
- `groupId` (path) - UUID of the group

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "dueDate": "string",
  "assigneeId": "uuid"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "dueDate": "string",
  "status": "pending",
  "assignee": {
    "id": "uuid",
    "fullName": "string"
  },
  "creator": {
    "id": "uuid",
    "fullName": "string"
  },
  "createdAt": "string"
}
```

### Update Task Status
```http
PATCH /groups/{groupId}/tasks/{id}
```

Update task status.

**Parameters:**
- `groupId` (path) - UUID of the group
- `id` (path) - UUID of the task

**Request Body:**
```json
{
  "status": "pending | in_progress | completed"
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "status": "string",
  "updatedAt": "string"
}
```

## Chat Messages

### Get Group Messages
```http
GET /groups/{groupId}/messages
```

Retrieve chat messages for a group.

**Parameters:**
- `groupId` (path) - UUID of the group
- `limit` (query) - Number of messages to return
- `before` (query) - Timestamp for pagination

**Response:** `200 OK`
```json
{
  "messages": [
    {
      "id": "uuid",
      "sender": {
        "id": "uuid",
        "fullName": "string",
        "avatarUrl": "string"
      },
      "content": "string",
      "createdAt": "string"
    }
  ]
}
```

### Send Message
```http
POST /groups/{groupId}/messages
```

Send a new chat message in a group.

**Parameters:**
- `groupId` (path) - UUID of the group

**Request Body:**
```json
{
  "content": "string"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "sender": {
    "id": "uuid",
    "fullName": "string",
    "avatarUrl": "string"
  },
  "content": "string",
  "createdAt": "string"
}
```

## Notifications

### Get User Notifications
```http
GET /notifications
```

Retrieve user notifications.

**Query Parameters:**
- `read` (optional) - Filter by read status
- `limit` (optional) - Number of notifications to return
- `offset` (optional) - Offset for pagination

**Response:** `200 OK`
```json
{
  "notifications": [
    {
      "id": "uuid",
      "type": "group_invite | session_reminder | resource_shared | message",
      "title": "string",
      "message": "string",
      "read": "boolean",
      "data": "object",
      "createdAt": "string"
    }
  ],
  "total": "number"
}
```

### Mark Notification as Read
```http
PATCH /notifications/{id}
```

Mark a notification as read.

**Parameters:**
- `id` (path) - UUID of the notification

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "read": true,
  "updatedAt": "string"
}
```

## Subjects

### Get All Subjects
```http
GET /subjects
```

Retrieve all available subjects.

**Response:** `200 OK`
```json
{
  "subjects": [
    {
      "id": "uuid",
      "name": "string",
      "description": "string",
      "difficultyLevel": "number"
    }
  ]
}
```

### Get Subject
```http
GET /subjects/{id}
```

Retrieve subject details.

**Parameters:**
- `id` (path) - UUID of the subject

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "difficultyLevel": "number",
  "groups": [
    {
      "id": "uuid",
      "name": "string",
      "memberCount": "number",
      "maxMembers": "number"
    }
  ]
}
``` 