import { HttpError } from './HttpError';

export class NotFoundError extends HttpError {
  constructor(message = 'Not Found', errors?: any) {
    super(message, 404, errors);
  }
}
