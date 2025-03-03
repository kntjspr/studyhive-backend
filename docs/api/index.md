# StudyHive API Reference

Welcome to the StudyHive API documentation. This API enables you to build applications that facilitate collaborative learning through study groups, resource sharing, and interactive study sessions.

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```http
Authorization: Bearer <access_token>
```

## API Sections

- [Authentication](authentication/index.md) - User authentication and account management
- [Profiles](profiles/index.md) - User profile management
- [Study Groups](groups/index.md) - Study group creation and management
- [Study Resources](resources/index.md) - Resource sharing and management
- [Study Sessions](sessions/index.md) - Session scheduling and attendance
- [Tasks](tasks/index.md) - Task management and tracking
- [Messages](messages/index.md) - Group chat functionality
- [Notifications](notifications/index.md) - User notifications
- [Subjects](subjects/index.md) - Subject/course management

## Response Format

All responses are returned in JSON format and include appropriate HTTP status codes.

### Success Response Format
```json
{
  "data": {
    // Response data
  }
}
```

### Error Response Format
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {}
  }
}
```

## Rate Limiting

The API implements rate limiting to ensure fair usage:
- 100 requests per minute for authenticated endpoints
- 20 requests per minute for unauthenticated endpoints

## Pagination

List endpoints support pagination through query parameters:
- `limit`: Number of items per page (default: 20, max: 100)
- `offset`: Number of items to skip (for offset-based pagination)
- `cursor`: Cursor value (for cursor-based pagination)

## Versioning

The API version is included in the URL path:
```
https://api.studyhive.com/v1/
``` 