export class HttpError extends Error {
  public statusCode: number;
  public errors?: any;

  constructor(message: string, statusCode = 500, errors?: any) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;

    this.name = this.constructor.name;

    // Capture the stack trace for better error reporting
    Error.captureStackTrace(this, this.constructor);
  }
}
