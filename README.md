# Next.js Full-Stack Application Template

This is a comprehensive template for a Next.js full-stack application with Express-like API structure, MongoDB integration with Mongoose, authentication, and proper environment variable handling.

## Features

- **Modern Next.js App Router**: Utilizing the latest Next.js features
- **Express-like API Structure**: Clean API route organization with proper HTTP method handling
- **MongoDB with Mongoose**: Robust database integration with schemas and validation
- **Complete Authentication System**: JWT-based auth with secure cookie handling
- **Environment Variable Management**: Secure configuration with client/server separation
- **TypeScript**: Full type safety throughout the application
- **RESTful API Design**: Consistent API responses with proper status codes
- **Protected Routes**: Middleware for securing routes based on authentication status
- **Responsive UI**: Built with Tailwind CSS for modern, responsive design

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- MongoDB instance (local or cloud-based like MongoDB Atlas)

### Installation

1. Clone this repository or use it as a template:

```bash
git clone https://github.com/yourusername/nextjs-fullstack-app.git
cd nextjs-fullstack-app
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create your `.env.local` file based on `.env.example`:

```bash
cp .env.example .env.local
```

4. Update the environment variables in `.env.local` with your values:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_string
COOKIE_NAME=your_app_cookie_name
```

5. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure Explained

The application follows a clean architecture pattern:

### API Routes

API routes are organized in an Express-like structure under `src/app/api`:

- **api/auth/**: Authentication endpoints (login, logout, register)
- **api/users/**: User management endpoints with CRUD operations

Each API endpoint follows RESTful conventions and returns consistent JSON responses with appropriate status codes.

### Database Layer

- **lib/db.ts**: MongoDB connection utility with connection pooling
- **models/**: Mongoose schemas with validation and type safety
- **types/**: TypeScript interfaces for database models and API requests/responses

### Authentication

- **lib/auth.ts**: JWT token generation, verification, and cookie management
- **middleware.ts**: Route protection based on authentication status
- **hooks/useAuth.ts**: React hook for frontend authentication management

### Frontend

- **app/**: Next.js App Router for page routing
- **components/**: Reusable React components
- **hooks/**: Custom React hooks for shared functionalities

## API Documentation

### Authentication Endpoints

#### Register a new user

```
POST /api/auth/register
Body: { "name": "User Name", "email": "user@example.com", "password": "password123" }
```

#### Login

```
POST /api/auth/login
Body: { "email": "user@example.com", "password": "password123" }
```

#### Logout

```
POST /api/auth/logout
```

#### Get current user

```
GET /api/auth/me
```

### User Endpoints

#### Get all users (paginated)

```
GET /api/users?page=1&limit=10
```

#### Get user by ID

```
GET /api/users/userId
```

#### Create new user (admin only)

```
POST /api/users
Body: { "name": "User Name", "email": "user@example.com", "password": "password123", "role": "user" }
```

#### Update user

```
PATCH /api/users/userId
Body: { "name": "Updated Name" }
```

#### Delete user

```
DELETE /api/users/userId
```

## Environment Variables

The application uses environment variables for configuration, with a clear separation between client-side and server-side variables:

- **Server-side only**: `MONGODB_URI`, `JWT_SECRET` (prefixed without `NEXT_PUBLIC_`)
- **Client-accessible**: Variables prefixed with `NEXT_PUBLIC_`

## Deployment

This application can be deployed to any platform that supports Next.js applications:

- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/)
- [AWS Amplify](https://aws.amazon.com/amplify/)

Remember to set up your environment variables in your deployment platform.

## Project Structure

```
nextjs-app/
├── .env.local                  # Environment variables (not committed to git)
├── .env.example                # Example environment variables (safe to commit)
├── .gitignore                  # Git ignore file
├── package.json                # Project dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── public/                     # Static assets
├── src/
│   ├── app/                    # App Router pages and layout
│   │   ├── (auth)/             # Authentication related pages
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── page.tsx            # Home page
│   │   └── layout.tsx          # Root layout
│   ├── components/             # React components
│   │   ├── ui/                 # UI components
│   │   ├── forms/              # Form components
│   │   └── layout/             # Layout components
│   ├── hooks/                  # Custom React hooks
│   │   └── useAuth.ts
│   ├── lib/                    # Utility functions and libraries
│   │   ├── auth.ts             # Authentication utilities
│   │   └── db.ts               # Database connection utility
│   ├── models/                 # Mongoose models
│   │   └── User.ts
│   ├── types/                  # TypeScript type definitions
│   │   └── index.ts
│   ├── config/                 # Configuration files
│   │   └── config.ts           # App configuration
│   └── app/                    # API routes
│       ├── api/
│           ├── auth/
│           │   ├── login/route.ts
│           │   ├── logout/route.ts
│           │   └── register/route.ts
│           └── users/
│               └── [[...params]]/route.ts  # Handles all user CRUD operations
```
