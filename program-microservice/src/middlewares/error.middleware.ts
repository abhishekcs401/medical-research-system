import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { BadRequestError } from '../errors/BadRequestError';
import { ConflictError } from '../errors/ConflictError';
import { CustomError } from '../errors/CustomError';
import { HttpError } from '../errors/HttpError';
import { NotFoundError } from '../errors/NotFoundError';
import { ValidationError } from '../errors/ValidationError';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { HttpStatus } from '../errors/HttpStatus';

// 👇 Explicitly define as ErrorRequestHandler to satisfy Express types
export const globalErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error('Global Error Handler:', err);

  if (err instanceof BadRequestError) {
    res.status(err.statusCode).json({ message: err.message, errors: err.errors || null });
    return;
  }

  if (err instanceof ConflictError) {
    res.status(err.statusCode).json({ message: err.message, errors: err.errors || null });
    return;
  }

  if (err instanceof CustomError) {
    res.status(err.statusCode).json({ message: err.message, errors: err.errors || null });
    return;
  }

  if (err instanceof HttpError) {
    res.status(err.statusCode).json({ message: err.message, errors: err.errors || null });
    return;
  }

  if (err instanceof NotFoundError) {
    res.status(err.statusCode).json({ message: err.message, errors: err.errors || null });
    return;
  }

  if (err instanceof ValidationError) {
    res.status(err.statusCode).json({ message: err.message, errors: err.errors || null });
    return;
  }

  if (err instanceof UnauthorizedError) {
    res.status(err.statusCode).json({ message: err.message, errors: err.errors || null });
    return;
  }

  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    message: 'Internal Server Error',
  });
};
