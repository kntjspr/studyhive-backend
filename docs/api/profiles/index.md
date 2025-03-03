# Profile Management

Endpoints for managing user profiles and preferences.

## Get Profile
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

## Update Profile
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