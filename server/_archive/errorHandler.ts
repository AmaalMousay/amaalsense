/**
 * Error Handler - Comprehensive Error Handling Middleware
 * 
 * يوفر معالجة شاملة للأخطاء مع logging وتتبع الأخطاء
 */

import { TRPCError } from '@trpc/server';
import { ZodError } from 'zod';

// ============================================================================
// Error Types
// ============================================================================

export enum ErrorCode {
  // Validation Errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  
  // Business Logic Errors
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  
  // External Service Errors
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  API_RATE_LIMIT = 'API_RATE_LIMIT',
  API_TIMEOUT = 'API_TIMEOUT',
  
  // System Errors
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface ErrorResponse {
  success: false;
  error: string;
  code: ErrorCode;
  details?: Record<string, any>;
  timestamp: string;
}

export interface SuccessResponse<T> {
  success: true;
  data: T;
  timestamp: string;
}

// ============================================================================
// Custom Error Class
// ============================================================================

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    public message: string,
    public statusCode: number = 400,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// ============================================================================
// Error Logger
// ============================================================================

export class ErrorLogger {
  static log(error: any, context?: string): void {
    const timestamp = new Date().toISOString();
    const contextStr = context ? `[${context}]` : '';
    
    if (error instanceof AppError) {
      console.error(`${timestamp} ${contextStr} AppError [${error.code}]:`, {
        message: error.message,
        statusCode: error.statusCode,
        details: error.details,
      });
    } else if (error instanceof ZodError) {
      console.error(`${timestamp} ${contextStr} ValidationError:`, {
        message: 'Validation failed',
        errors: (error as any).errors,
      });
    } else if (error instanceof TRPCError) {
      console.error(`${timestamp} ${contextStr} TRPCError [${error.code}]:`, {
        message: error.message,
      });
    } else if (error instanceof Error) {
      console.error(`${timestamp} ${contextStr} Error:`, {
        message: error.message,
        stack: error.stack,
      });
    } else {
      console.error(`${timestamp} ${contextStr} Unknown Error:`, error);
    }
  }

  static logWarning(message: string, context?: string): void {
    const timestamp = new Date().toISOString();
    const contextStr = context ? `[${context}]` : '';
    console.warn(`${timestamp} ${contextStr}`, message);
  }

  static logInfo(message: string, context?: string): void {
    const timestamp = new Date().toISOString();
    const contextStr = context ? `[${context}]` : '';
    console.log(`${timestamp} ${contextStr}`, message);
  }
}

// ============================================================================
// Error Handler Functions
// ============================================================================

export function handleValidationError(error: ZodError): ErrorResponse {
  const fieldErrors = (error as any).errors?.map((err: any) => ({
    field: err.path.join('.'),
    message: err.message,
    code: err.code,
  })) || [];

  return {
    success: false,
    error: 'Validation failed',
    code: ErrorCode.VALIDATION_ERROR,
    details: { fieldErrors },
    timestamp: new Date().toISOString(),
  };
}

export function handleAppError(error: AppError): ErrorResponse {
  return {
    success: false,
    error: error.message,
    code: error.code,
    details: error.details,
    timestamp: new Date().toISOString(),
  };
}

export function handleTRPCError(error: TRPCError): ErrorResponse {
  const codeMap: Record<string, ErrorCode> = {
    'PARSE_ERROR': ErrorCode.VALIDATION_ERROR,
    'BAD_REQUEST': ErrorCode.INVALID_INPUT,
    'NOT_FOUND': ErrorCode.NOT_FOUND,
    'INTERNAL_SERVER_ERROR': ErrorCode.INTERNAL_ERROR,
    'UNAUTHORIZED': ErrorCode.UNAUTHORIZED,
    'FORBIDDEN': ErrorCode.FORBIDDEN,
  };

  return {
    success: false,
    error: error.message,
    code: codeMap[error.code] || ErrorCode.UNKNOWN_ERROR,
    timestamp: new Date().toISOString(),
  };
}

export function handleGenericError(error: any): ErrorResponse {
  const message = error?.message || 'An unexpected error occurred';
  
  return {
    success: false,
    error: message,
    code: ErrorCode.UNKNOWN_ERROR,
    details: {
      originalError: error?.toString?.(),
    },
    timestamp: new Date().toISOString(),
  };
}

// ============================================================================
// Async Error Wrapper
// ============================================================================

export function asyncHandler<T extends any[], R>(
  fn: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R | ErrorResponse> => {
    try {
      return await fn(...args);
    } catch (error) {
      ErrorLogger.log(error, 'asyncHandler');
      
      if (error instanceof ZodError) {
        return handleValidationError(error);
      } else if (error instanceof AppError) {
        return handleAppError(error);
      } else if (error instanceof TRPCError) {
        return handleTRPCError(error);
      } else {
        return handleGenericError(error);
      }
    }
  };
}

// ============================================================================
// Try-Catch Wrapper
// ============================================================================

export async function tryCatch<T>(
  fn: () => Promise<T>,
  context?: string
): Promise<{ success: true; data: T } | ErrorResponse> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error) {
    ErrorLogger.log(error, context);
    
    if (error instanceof ZodError) {
      return handleValidationError(error);
    } else if (error instanceof AppError) {
      return handleAppError(error);
    } else if (error instanceof TRPCError) {
      return handleTRPCError(error);
    } else {
      return handleGenericError(error);
    }
  }
}

// ============================================================================
// Validation Helpers
// ============================================================================

export function validateRequired(value: any, fieldName: string): void {
  if (!value) {
    throw new AppError(
      ErrorCode.VALIDATION_ERROR,
      `${fieldName} is required`,
      400,
      { field: fieldName }
    );
  }
}

export function validateEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new AppError(
      ErrorCode.VALIDATION_ERROR,
      'Invalid email format',
      400,
      { field: 'email' }
    );
  }
}

export function validateLength(
  value: string,
  min: number,
  max: number,
  fieldName: string
): void {
  if (value.length < min || value.length > max) {
    throw new AppError(
      ErrorCode.VALIDATION_ERROR,
      `${fieldName} must be between ${min} and ${max} characters`,
      400,
      { field: fieldName, min, max }
    );
  }
}

export function validateRange(
  value: number,
  min: number,
  max: number,
  fieldName: string
): void {
  if (value < min || value > max) {
    throw new AppError(
      ErrorCode.VALIDATION_ERROR,
      `${fieldName} must be between ${min} and ${max}`,
      400,
      { field: fieldName, min, max }
    );
  }
}

// ============================================================================
// API Error Handlers
// ============================================================================

export function handleExternalServiceError(
  serviceName: string,
  error: any,
  retryable: boolean = false
): AppError {
  const message = `Failed to call ${serviceName}: ${error?.message || 'Unknown error'}`;
  
  return new AppError(
    ErrorCode.EXTERNAL_SERVICE_ERROR,
    message,
    503,
    {
      service: serviceName,
      retryable,
      originalError: error?.toString?.(),
    }
  );
}

export function handleAPITimeout(
  serviceName: string,
  timeout: number
): AppError {
  return new AppError(
    ErrorCode.API_TIMEOUT,
    `${serviceName} request timed out after ${timeout}ms`,
    504,
    { service: serviceName, timeout }
  );
}

export function handleAPIRateLimit(
  serviceName: string,
  retryAfter?: number
): AppError {
  return new AppError(
    ErrorCode.API_RATE_LIMIT,
    `${serviceName} rate limit exceeded`,
    429,
    { service: serviceName, retryAfter }
  );
}

// ============================================================================
// Database Error Handlers
// ============================================================================

export function handleDatabaseError(error: any): AppError {
  const message = `Database error: ${error?.message || 'Unknown error'}`;
  
  return new AppError(
    ErrorCode.DATABASE_ERROR,
    message,
    500,
    {
      originalError: error?.toString?.(),
    }
  );
}

export function handleNotFoundError(
  resource: string,
  identifier?: string
): AppError {
  const message = identifier
    ? `${resource} with id "${identifier}" not found`
    : `${resource} not found`;

  return new AppError(
    ErrorCode.NOT_FOUND,
    message,
    404,
    { resource, identifier }
  );
}

export function handleAlreadyExistsError(
  resource: string,
  identifier?: string
): AppError {
  const message = identifier
    ? `${resource} with id "${identifier}" already exists`
    : `${resource} already exists`;

  return new AppError(
    ErrorCode.ALREADY_EXISTS,
    message,
    409,
    { resource, identifier }
  );
}

// ============================================================================
// Authorization Error Handlers
// ============================================================================

export function handleUnauthorizedError(reason?: string): AppError {
  return new AppError(
    ErrorCode.UNAUTHORIZED,
    reason || 'Unauthorized access',
    401,
    { reason }
  );
}

export function handleForbiddenError(reason?: string): AppError {
  return new AppError(
    ErrorCode.FORBIDDEN,
    reason || 'Forbidden access',
    403,
    { reason }
  );
}

// ============================================================================
// Export
// ============================================================================

export const errorHandler = {
  AppError,
  ErrorLogger,
  ErrorCode,
  handleValidationError,
  handleAppError,
  handleTRPCError,
  handleGenericError,
  asyncHandler,
  tryCatch,
  validateRequired,
  validateEmail,
  validateLength,
  validateRange,
  handleExternalServiceError,
  handleAPITimeout,
  handleAPIRateLimit,
  handleDatabaseError,
  handleNotFoundError,
  handleAlreadyExistsError,
  handleUnauthorizedError,
  handleForbiddenError,
};
