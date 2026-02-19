/**
 * Better Error Handling System
 * Provides user-friendly error messages and structured error responses
 */

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    userFriendlyMessage: string;
    suggestion: string;
    retryable: boolean;
    waitTime?: number;
  };
}

export interface SuccessResponse<T> {
  success: true;
  data: T;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

// Error codes and their user-friendly messages
const ERROR_MESSAGES: Record<string, { userMessage: string; suggestion: string; retryable: boolean }> = {
  'LLM_INVOKE_FAILED': {
    userMessage: 'The AI service is temporarily busy. Please try again in a moment.',
    suggestion: 'Try asking a simpler question or wait a few seconds before retrying.',
    retryable: true,
  },
  'DATABASE_ERROR': {
    userMessage: 'Unable to access the database. Please try again later.',
    suggestion: 'Check your internet connection and try again.',
    retryable: true,
  },
  'TIMEOUT_ERROR': {
    userMessage: 'The request took too long to process. Please try with a shorter question.',
    suggestion: 'Try asking a more specific or concise question.',
    retryable: true,
  },
  'NETWORK_ERROR': {
    userMessage: 'Network error. Please check your internet connection.',
    suggestion: 'Check your connection and try again.',
    retryable: true,
  },
  'INVALID_INPUT': {
    userMessage: 'The input provided is invalid. Please check your question.',
    suggestion: 'Make sure your question is clear and complete.',
    retryable: false,
  },
  'RATE_LIMIT': {
    userMessage: 'Too many requests. Please wait a moment before trying again.',
    suggestion: 'Wait 60 seconds before making another request.',
    retryable: true,
  },
  'UNAUTHORIZED': {
    userMessage: 'You are not authorized to perform this action.',
    suggestion: 'Please log in and try again.',
    retryable: false,
  },
  'NOT_FOUND': {
    userMessage: 'The requested resource was not found.',
    suggestion: 'Check the topic or conversation ID and try again.',
    retryable: false,
  },
  'INTERNAL_SERVER_ERROR': {
    userMessage: 'An unexpected error occurred. Our team has been notified.',
    suggestion: 'Please try again later or contact support if the problem persists.',
    retryable: true,
  },
};

/**
 * Create a structured error response
 */
export function createErrorResponse(
  code: string,
  message: string,
  customMessage?: string
): ErrorResponse {
  const errorConfig = ERROR_MESSAGES[code] || ERROR_MESSAGES['INTERNAL_SERVER_ERROR'];

  return {
    success: false,
    error: {
      code,
      message,
      userFriendlyMessage: customMessage || errorConfig.userMessage,
      suggestion: errorConfig.suggestion,
      retryable: errorConfig.retryable,
      waitTime: code === 'RATE_LIMIT' ? 60 : undefined,
    },
  };
}

/**
 * Create a structured success response
 */
export function createSuccessResponse<T>(data: T): SuccessResponse<T> {
  return {
    success: true,
    data,
  };
}

/**
 * Handle errors and convert to user-friendly responses
 */
export function handleError(error: any, defaultCode: string = 'INTERNAL_SERVER_ERROR'): ErrorResponse {
  if (error instanceof Error) {
    const message = error.message;

    if (message.includes('timeout')) {
      return createErrorResponse('TIMEOUT_ERROR', message);
    }
    if (message.includes('network')) {
      return createErrorResponse('NETWORK_ERROR', message);
    }
    if (message.includes('database')) {
      return createErrorResponse('DATABASE_ERROR', message);
    }
    if (message.includes('LLM')) {
      return createErrorResponse('LLM_INVOKE_FAILED', message);
    }
    if (message.includes('unauthorized')) {
      return createErrorResponse('UNAUTHORIZED', message);
    }
    if (message.includes('not found')) {
      return createErrorResponse('NOT_FOUND', message);
    }
  }

  return createErrorResponse(defaultCode, String(error));
}

/**
 * Retry logic with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: any;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

/**
 * Validate input and return error if invalid
 */
export function validateInput(input: any, rules: Record<string, (val: any) => boolean>): ErrorResponse | null {
  for (const [field, validator] of Object.entries(rules)) {
    if (!validator(input[field])) {
      return createErrorResponse('INVALID_INPUT', `Invalid value for field: ${field}`);
    }
  }

  return null;
}
