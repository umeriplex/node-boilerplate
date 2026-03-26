import { Router } from 'express';
import { sendSuccess } from '../utils/apiResponse';
import authRoutes from './authRoutes';

const router = Router();

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  sendSuccess(res, 200, 'Server is healthy', {
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

// Mount modules
router.use('/auth', authRoutes);

export default router;
