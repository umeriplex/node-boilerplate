import 'express-async-errors';
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import env from './config/env';
import logger from './config/logger';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import basicAuth from 'express-basic-auth';
import { errorHandler } from './middlewares/errorHandler';
import { apiLimiter } from './middlewares/rateLimiter';
import { NotFoundError } from './utils/AppError';
import routes from './routes';

const app: Application = express();

// Set security HTTP headers
app.use(helmet());

// CORS config
app.use(
  cors({
    origin: env.ALLOWED_ORIGINS.includes('*') ? '*' : env.ALLOWED_ORIGINS,
    credentials: true,
  })
);

// Logging
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
}

// Global API rate limiter
app.use('/api', apiLimiter);

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Swagger Documentation
if (env.NODE_ENV === 'production') {
  app.use(
    '/api-docs',
    basicAuth({
      users: { [env.SWAGGER_USER]: env.SWAGGER_PASSWORD },
      challenge: true,
      unauthorizedResponse: 'Unauthorized Access',
    }),
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
  );
} else {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// Base API Routes
app.use('/api/v1', routes);

// Handle unhandled routes (404)
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError(`Can't find ${req.originalUrl} on this server!`));
});

// Global Error Handler Middleware
app.use(errorHandler);

export default app;
