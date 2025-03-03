# Authentication

Authentication endpoints for managing user accounts and sessions.

## Sign Up
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

## Sign In
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

## Forgot Password
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