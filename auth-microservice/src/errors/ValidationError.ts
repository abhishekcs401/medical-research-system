import { HttpError } from './HttpError';

export class ValidationError extends HttpError {
  constructor(message: string = 'Validation Error', errors?: any) {
    super(message, 400, errors);
  }
}
