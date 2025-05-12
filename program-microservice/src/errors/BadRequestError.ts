import { HttpError } from './HttpError';

export class BadRequestError extends HttpError {
  constructor(message = 'Bad Request', errors?: any) {
    super(message, 400, errors);
  }
}
