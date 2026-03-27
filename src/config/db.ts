import mongoose from 'mongoose';
import logger from './logger';
import env from './env';

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);

    // Auto-reconnect listeners
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Retrying...');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });
  } catch (error) {
    const err = error as Error;
    logger.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
};
