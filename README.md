# Enterprise Secure Node.js Boilerplate

A fully robust, ultra-secure, and production-ready enterprise backend boilerplate built with Node.js, Express, TypeScript, and MongoDB.

## Features (Pro Max)
*   **Highly Secure**: Built-in protection with `helmet` (HTTP headers), exactly configured `cors`, and `express-rate-limit` (Granular logic for API vs Auth).
*   **Fail-Fast Environment Validation**: Uses `zod` to validate `process.env` before the server even starts. Missing `.env` variables crash instantly with strict typings.
*   **Bulletproof Validation**: `zod`-based middleware validates `req.body`, `req.query`, and `req.params`, sending standardized errors before hitting controllers.
*   **Advanced Global Error Handling**: Custom `AppError` class alongside an intelligent global error middleware. Automatically transforms Mongoose Validation/Cast errors and JWT verification errors into clean, user-friendly JSON (with stack traces safely hidden in production).
*   **Unified Responses**: `sendSuccess` and `sendError` utilities guarantee a strict `{ status, message, data/error }` JSON format across the entire application.
*   **Automated Logging**: Configured `winston` combined with `morgan` and `winston-daily-rotate-file` ensures logs map cleanly to daily files capping out at optimal memory footprints safely.
*   **Cleaner Controllers**: `catchAsync` wrapper removes the need for repetitive `try/catch` visual clutter across your controllers.
*   **Production Configured Database**: MongoDB connection utilizes resilient retry logic and detached event listeners.

## Architecture & Design
This boilerplate enforces a strict, loosely-coupled 3-layer architecture (Routes -> Controllers -> Services) to keep business logic isolated from HTTP transport details.

**For a detailed breakdown of the exact folder structure, design patterns, and every file's purpose, please see the [BE_STRUCTURE.md](./BE_STRUCTURE.md) file.**


## Getting Started

1.  **Clone / Copy this directory**
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Setup**:
    ```bash
    cp .env.example .env
    ```
    Populate `.env` with actual DB URIs and secure JWT secrets.
4.  **Run in Development**:
    ```bash
    npm run dev
    ```
5.  **Build for Production**:
    ```bash
    npm run build
    npm start
    ```
