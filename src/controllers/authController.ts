import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/apiResponse';
import * as authService from '../services/authService';
import { AuthRequest } from '../middlewares/auth';

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const register = catchAsync(async (req: Request, res: Response) => {
  const data = await authService.registerUser(req.body);

  sendSuccess(res, 201, 'User registered successfully', data);
});

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const login = catchAsync(async (req: Request, res: Response) => {
  const data = await authService.loginUser(req.body);

  sendSuccess(res, 200, 'Login successful', data);
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
export const getMe = catchAsync(async (req: AuthRequest, res: Response) => {
  // req.user is populated by protect middleware
  sendSuccess(res, 200, 'User profile retrieved successfully', {
    user: req.user,
  });
});
