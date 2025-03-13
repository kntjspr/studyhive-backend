# StudyHive Backend API

A robust and scalable backend API for the StudyHive application, built with Node.js, Express, TypeScript, and Supabase.

## Features

- **User Management**: Registration, authentication, profile management
- **Task Management**: Create, read, update, delete tasks with priorities and statuses
- **Event Scheduling**: Calendar events with reminders and notifications
- **Security**: JWT authentication, rate limiting, input validation
- **Error Handling**: Comprehensive error handling and logging

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Logging**: Winston
- **Testing**: Jest

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/studyhive-backend.git
   cd studyhive-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your Supabase credentials and other configuration.

5. Initialize the database:
   **On Windows:**
   ```bash
   init-db.bat
   ```

   **On Linux/Mac:**
   ```bash
   chmod +x init-db.sh
   ./init-db.sh
   ```

   Alternatively, you can run:
   ```bash
   npm run init-db
   ```

### Running the Application

#### Using Scripts

For convenience, we've included scripts to build and run the application:

**On Windows:**
```bash
# Production mode
start.bat

# Development mode with hot-reloading
dev.bat
```

**On Linux/Mac:**
```bash
# Make scripts executable
chmod +x start.sh dev.sh

# Production mode
./start.sh

# Development mode with hot-reloading
./dev.sh
```

#### Using npm Commands

Alternatively, you can use npm commands directly:

```bash
# Start development server with hot-reloading
npm run dev

# Build the project
npm run build

# Start production server
npm start
```

### API Documentation

The API will be available at `http://localhost:5000` by default.

#### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get tokens
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout and invalidate tokens

#### User Endpoints

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/avatar` - Upload user avatar

#### Task Endpoints

- `POST /api/tasks` - Create a new task
- `GET /api/tasks` - Get all tasks for the user
- `GET /api/tasks/:taskId` - Get a specific task
- `PUT /api/tasks/:taskId` - Update a task
- `DELETE /api/tasks/:taskId` - Delete a task
- `PUT /api/tasks/:taskId/complete` - Mark a task as complete

#### Event Endpoints

- `POST /api/events` - Create a new event
- `GET /api/events` - Get all events for the user
- `GET /api/events/:eventId` - Get a specific event
- `PUT /api/events/:eventId` - Update an event
- `DELETE /api/events/:eventId` - Delete an event

## Development

### Scripts

- `npm run dev` - Start the development server with hot-reload
- `npm run build` - Build the project for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

### Project Structure

```
src/
├── config/           # Configuration files
├── controllers/      # Request handlers
├── database/         # Database connection and models
├── middleware/       # Express middleware
├── models/           # Data models
├── routes/           # API routes
├── services/         # Business logic
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
├── app.ts            # Express app setup
└── server.ts         # Server entry point
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

# StudyHive API Documentation

This repository contains the backend API for the StudyHive application, a comprehensive study management platform.

## API Documentation

### Postman Collection

A Postman collection is included in this repository to help you test and interact with the API endpoints. The collection includes all available endpoints with example request bodies and parameters.

#### Importing the Collection

1. Download [Postman](https://www.postman.com/downloads/) if you haven't already
2. Open Postman
3. Click on "Import" in the top left corner
4. Select "File" and choose the `postman_collection.json` file from this repository
5. The collection will be imported with all endpoints and environment variables

#### Setting Up Environment Variables

The collection uses the following environment variables:

- `baseUrl`: The base URL of the API (default: `http://localhost:5000`)
- `accessToken`: Your JWT access token (obtained after login)
- `refreshToken`: Your JWT refresh token (obtained after login)

To set up these variables:

1. In Postman, click on "Environments" in the sidebar
2. Click "Import" and select the `postman_environment.json` file from this repository
3. The environment will be imported with predefined variables
4. Select the "StudyHive API Environment" from the dropdown in the top right corner

Alternatively, you can create the environment manually:

1. In Postman, click on "Environments" in the sidebar
2. Click "Create Environment" and name it "StudyHive API Environment"
3. Add the variables mentioned above with their initial values
4. Click "Save"
5. Select the environment from the dropdown in the top right corner

#### Authentication Flow

1. Register a new user using the "Register" endpoint
2. Login with the registered credentials using the "Login" endpoint
3. The response will contain an access token and a refresh token
4. Copy the access token and set it as the value for the `accessToken` environment variable
5. Use the refresh token in the "Refresh Token" endpoint when your access token expires

#### Testing Endpoints

All authenticated endpoints require a valid JWT token. The token is automatically included in the request headers when you set the `accessToken` environment variable.

## API Endpoints

### Authentication

- **POST /api/auth/register**: Register a new user
- **POST /api/auth/login**: Login with email and password
- **POST /api/auth/refresh-token**: Get a new access token using a refresh token
- **POST /api/auth/logout**: Logout and invalidate the refresh token

### User Management

- **GET /api/users/profile**: Get the current user's profile
- **PUT /api/users/profile**: Update the current user's profile
- **POST /api/users/avatar**: Upload a profile avatar

### Task Management

- **POST /api/tasks**: Create a new task
- **GET /api/tasks**: Get all tasks with optional filters
- **GET /api/tasks/:id**: Get a specific task by ID
- **PUT /api/tasks/:id**: Update a task
- **DELETE /api/tasks/:id**: Delete a task
- **PUT /api/tasks/:id/complete**: Toggle task completion status

### Event Management

- **POST /api/events**: Create a new event
- **GET /api/events**: Get all events with optional date range filtering
- **GET /api/events/:id**: Get a specific event by ID
- **PUT /api/events/:id**: Update an event
- **DELETE /api/events/:id**: Delete an event

### Health Check

- **GET /health**: Check if the API server is running

## Running the API Locally

1. Clone this repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Start the server: `npm run dev`
5. The API will be available at `http://localhost:5000`

## Error Handling

All API endpoints return appropriate HTTP status codes:

- `200 OK`: The request was successful
- `201 Created`: A new resource was created successfully
- `400 Bad Request`: The request was invalid or cannot be served
- `401 Unauthorized`: Authentication is required or failed
- `403 Forbidden`: The authenticated user doesn't have permission
- `404 Not Found`: The requested resource doesn't exist
- `500 Internal Server Error`: An error occurred on the server 