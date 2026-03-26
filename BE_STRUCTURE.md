# Backend Structure (BE\_STRUCTURE)

This document briefly describes the purpose of each directory and key files. This architecture is designed to be **loose, easy to maintain, and decoupled**.

## Directory Overview

-   `src/config/`: System definitions (Database connection, Environment variables, Logging).
-   `src/controllers/`: HTTP Layer. Extracts data from requests and triggers services. **NO business logic here.**
-   `src/middlewares/`: Express middlewares (Authentication, Request Validation, Error Handling).
-   `src/models/`: Mongoose Database Models / Schemas.
-   `src/routes/`: Express routers. Binds paths to validation schemas and controllers.
-   `src/services/`: Core business logic layer. **NO HTTP request/response objects here.** Fully decoupled.
-   `src/utils/`: Reusable, pure helper functions (JWT signing, custom AppErrors).

---

## Key Files & Purposes

### Roots

-   `server.ts`: Entry point. Connects to DB and starts the Express server.
-   `app.ts`: Core Express configuration (Global security middlewares, Body parsers, Main Route mounting, Error Handler).

### config/

-   `env.ts`: Zod-based strict environment variable validation to fail fast on boot.
-   `logger.ts`: Winston logger setup (Console for dev, Daily file rotation for prod).
-   `db.ts`: Mongoose connection logic with retry listeners.

### controllers/

-   `authController.ts`: `req/res` handlers for User Authentication. Instantly delegates to `authService`.

### middlewares/

-   `validate.ts`: Reusable Zod schema validator interceptor for `req.body`, `req.query`, and `req.params`.
-   `auth.ts`: `protect` (verifies JWT) and `restrictTo` (Role-based access). Sets `req.user`.
-   `errorHandler.ts`: Global catching middleware. Transforms Mongoose errors and custom `AppError`s to clean JSON.
-   `rateLimiter.ts`: Basic request rate limiters to prevent spam/brute-force.

### models/

-   `User.ts`: Mongoose schema for the User. Includes pre-save hooks (bcrypt hashing) and auth methods.

### routes/

-   `index.ts`: The main router aggregator. Mounts feature routes (e.g., `/api/v1/auth`).
-   `authRoutes.ts`: Maps endpoints like `POST /login` -> `authLimiter` -> `validate(loginSchema)` -> `authController.login`.

### services/

-   `authService.ts`: Core algorithms. Validates users mapping against the DB, creates tokens, handles password rules. Defers completely from Express. Throws structured `AppError` on failure.

### utils/

-   `AppError.ts`: Custom `Error` extension class for returning clean operational error codes.
-   `catchAsync.ts`: Promise resolution wrapper to eradicate `try/catch` clutter in controllers.
-   `apiResponse.ts`: Uniform JSON response formatters (`sendSuccess`, `sendError`).