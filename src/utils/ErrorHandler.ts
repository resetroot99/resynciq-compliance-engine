export class AppError extends Error {
  constructor(
    public message: string, 
    public code: string, 
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleError(error: any) {
  // Centralized error handling logic
  console.error('Unhandled Error:', error);

  // You could add more sophisticated error handling here
  // Such as sending error reports, logging, etc.

  return new AppError(
    error.message || 'An unexpected error occurred',
    error.code || 'UNKNOWN_ERROR'
  );
} 