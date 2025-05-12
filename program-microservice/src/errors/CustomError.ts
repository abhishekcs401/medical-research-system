export class CustomError extends Error {
  statusCode: number;
  errors?: any[];

  constructor(message: string, statusCode: number, errors?: any[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.name = this.constructor.name;

    // Captures the stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}
