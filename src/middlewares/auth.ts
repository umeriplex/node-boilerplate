import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt';
import { UnauthorizedError, ForbiddenError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';
import User from '../models/User';

export interface AuthRequest extends Request {
  user?: any; // Replace with actual UI/DB Types
}

/**
 * Protect routes: verify JWT token and attach user to req
 */
export const protect = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new UnauthorizedError('You are not logged in! Please log in to get access.');
  }

  const decoded = verifyToken(token);

  // Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    throw new UnauthorizedError('The user belonging to this token no longer exists.');
  }

  // Grant access to protected route
  req.user = currentUser;
  next();
});

/**
 * Restrict routes to specific roles
 */
export const restrictTo = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ForbiddenError('You do not have permission to perform this action');
    }
    next();
  };
};
