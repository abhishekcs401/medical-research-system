import { HttpError } from './HttpError';

export class ForbiddenError extends HttpError {
  constructor(message = 'Forbidden', errors?: any) {
    super(message, 403, errors);
  }
}
