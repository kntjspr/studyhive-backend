# Study Groups

Endpoints for managing study groups and group membership.

## Create Group
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

## Get Group
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

## Join Group
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

## Leave Group
```http
DELETE /groups/{id}/members
```

Leave a study group.

**Parameters:**
- `id` (path) - UUID of the group

**Response:** `204 No Content` 