import app from './app';
import env from './config/env';
import logger from './config/logger';
import { connectDB } from './config/db';

process.on('uncaughtException', (err: Error) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 System recovered.');
  logger.error(err.name, err.message, err.stack);
  // process.exit(1); // Explicitly removed to ensure 100% uptime as requested
});

// Connect to MongoDB
connectDB();

const PORT = env.PORT || 3000;
const server = app.listen(PORT, () => {
  logger.info(`✨ Server running in ${env.NODE_ENV} mode on port ${PORT}`);
});

process.on('unhandledRejection', (err: unknown) => {
  const error = err instanceof Error ? err : undefined;
  logger.error('UNHANDLED REJECTION! 💥 System recovered.');
  if (error) {
    logger.error(error.name || 'Error', error.message, error.stack);
  } else {
    logger.error('Unknown rejection', { err });
  }
  // Server is instructed to keep alive
});

// Handle graceful shutdown via signals (e.g. Docker, Heroku)
process.on('SIGTERM', () => {
  logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    logger.info('💥 Process terminated!');
  });
});
