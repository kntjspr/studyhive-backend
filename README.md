# StudyHive Backend API

Backend API service for the StudyHive mobile application.

## Tech Stack

- Node.js + Express
- TypeScript
- Supabase (Database & Authentication)

## Prerequisites

- Node.js (v16 or higher)
- pnpm
- Supabase account and project

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Copy `.env.example` to `.env` and update with your Supabase credentials:
   ```bash
   cp .env.example .env
   ```
4. Update the environment variables in `.env`:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_ANON_KEY`: Your Supabase anonymous key
   - `PORT`: API server port (default: 3000)
   - `FRONTEND_URL`: Your frontend application URL (for password reset)

## Development

Start the development server:
```bash
pnpm dev
```

## Build

Build the project:
```bash
pnpm build
```

## API Endpoints

### Authentication

- `POST /auth/signup`
  - Request body:
    ```json
    {
      "email": "user@example.com",
      "password": "securepassword",
      "fullName": "John Doe"
    }
    ```

- `POST /auth/signin`
  - Request body:
    ```json
    {
      "email": "user@example.com",
      "password": "securepassword"
    }
    ```

- `POST /auth/forgot-password`
  - Request body:
    ```json
    {
      "email": "user@example.com"
    }
    ```

## Supabase Setup

1. Create a new Supabase project
2. Enable Email authentication in Authentication settings
3. Create a new table `profiles` with the following schema:
   ```sql
   create table profiles (
     id uuid references auth.users on delete cascade,
     email text unique,
     full_name text,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null,
     updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
     primary key (id)
   );
   ```
4. Set up Row Level Security (RLS) policies for the `profiles` table
