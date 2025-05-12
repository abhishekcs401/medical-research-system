import { HttpError } from './HttpError';

export class UnauthorizedError extends HttpError {
  constructor(message = 'Unauthorized', errors?: any) {
    super(message, 401, errors);
  }
}
