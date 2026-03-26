import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middlewares/validate';
import { protect } from '../middlewares/auth';
import { authLimiter } from '../middlewares/rateLimiter';
import * as authController from '../controllers/authController';

const router = Router();

// Validation Schemas
const registerSchema = z.object({
  body: z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

// Routes
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);

// Protected routes
router.get('/me', protect, authController.getMe);

export default router;
