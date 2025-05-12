import { HttpError } from './HttpError';

export class ConflictError extends HttpError {
  constructor(message = 'Conflict', errors?: any) {
    super(message, 409, errors);
  }
}
