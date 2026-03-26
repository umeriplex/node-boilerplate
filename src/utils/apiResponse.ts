import { Response } from 'express';

interface SuccessResponseFormat<T> {
  status: 'success';
  message: string;
  data: T | null;
}

interface ErrorResponseFormat {
  status: 'error';
  message: string;
  error?: any;
}

/**
 * Send a standardized JSON success response
 */
export const sendSuccess = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T | null = null
): Response<SuccessResponseFormat<T>> => {
  return res.status(statusCode).json({
    status: 'success',
    message,
    data,
  });
};

/**
 * Send a standardized JSON error response
 */
export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  error?: any
): Response<ErrorResponseFormat> => {
  const payload: ErrorResponseFormat = {
    status: 'error',
    message,
  };

  if (error !== undefined) {
    payload.error = error;
  }

  return res.status(statusCode).json(payload);
};
