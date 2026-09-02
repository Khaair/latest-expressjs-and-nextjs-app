export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errors?: Record<string, string[]>;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode = 500,
    errors?: Record<string, string[]>,
    isOperational = true,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict', errors?: Record<string, string[]>) {
    super(message, 409, errors);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad request', errors?: Record<string, string[]>) {
    super(message, 400, errors);
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message = 'Too many requests') {
    super(message, 429);
  }
}
