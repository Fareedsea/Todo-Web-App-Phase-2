// T019: Global error handler utility

import { ApiError } from './api-client';
import { ApiErrorCode } from '@/types/api';

export interface ErrorHandlerResult {
  message: string;
  shouldRetry: boolean;
  shouldRedirect?: string;
}

/**
 * Global error handler that provides user-friendly messages
 * and determines appropriate error handling strategy
 */
export function handleError(error: unknown): ErrorHandlerResult {
  // Handle ApiError instances
  if (error instanceof ApiError) {
    switch (error.code) {
      case ApiErrorCode.AUTHENTICATION_ERROR:
        return {
          message: 'You need to sign in to continue.',
          shouldRetry: false,
          shouldRedirect: '/sign-in',
        };

      case ApiErrorCode.AUTHORIZATION_ERROR:
        return {
          message: 'You do not have permission to perform this action.',
          shouldRetry: false,
        };

      case ApiErrorCode.VALIDATION_ERROR:
        return {
          message: error.details
            ? Object.values(error.details).join(', ')
            : error.message || 'Invalid input. Please check your data.',
          shouldRetry: false,
        };

      case ApiErrorCode.RESOURCE_NOT_FOUND:
        return {
          message: 'The requested resource was not found.',
          shouldRetry: false,
        };

      case ApiErrorCode.DUPLICATE_RESOURCE:
        return {
          message: error.message || 'This resource already exists.',
          shouldRetry: false,
        };

      case ApiErrorCode.RATE_LIMIT_ERROR:
        return {
          message: 'Too many requests. Please try again later.',
          shouldRetry: true,
        };

      case ApiErrorCode.SERVER_ERROR:
        return {
          message: 'A server error occurred. Please try again.',
          shouldRetry: true,
        };

      case ApiErrorCode.NETWORK_ERROR:
        return {
          message: 'Network error. Please check your connection.',
          shouldRetry: true,
        };

      default:
        return {
          message: error.message || 'An unexpected error occurred.',
          shouldRetry: true,
        };
    }
  }

  // Handle generic Error instances
  if (error instanceof Error) {
    return {
      message: error.message || 'An unexpected error occurred.',
      shouldRetry: false,
    };
  }

  // Handle unknown error types
  return {
    message: 'An unexpected error occurred. Please try again.',
    shouldRetry: false,
  };
}

/**
 * Log error to console (can be extended to send to logging service)
 */
export function logError(error: unknown, context?: string): void {
  const timestamp = new Date().toISOString();
  const contextInfo = context ? `[${context}]` : '';

  if (error instanceof ApiError) {
    console.error(
      `${timestamp} ${contextInfo} API Error:`,
      {
        message: error.message,
        status: error.status,
        code: error.code,
        details: error.details,
      }
    );
  } else if (error instanceof Error) {
    console.error(
      `${timestamp} ${contextInfo} Error:`,
      {
        message: error.message,
        stack: error.stack,
      }
    );
  } else {
    console.error(
      `${timestamp} ${contextInfo} Unknown Error:`,
      error
    );
  }
}

/**
 * Format validation errors from API response
 */
export function formatValidationErrors(
  errors?: Record<string, string>
): Record<string, string> {
  if (!errors) return {};

  const formatted: Record<string, string> = {};

  Object.entries(errors).forEach(([field, message]) => {
    // Convert snake_case to camelCase for form fields
    const camelField = field.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
    formatted[camelField] = message;
  });

  return formatted;
}

/**
 * Check if error should trigger a retry
 */
export function shouldRetryRequest(error: unknown): boolean {
  if (error instanceof ApiError) {
    return [
      ApiErrorCode.SERVER_ERROR,
      ApiErrorCode.NETWORK_ERROR,
      ApiErrorCode.RATE_LIMIT_ERROR,
    ].includes(error.code as ApiErrorCode);
  }
  return false;
}

/**
 * Get retry delay in milliseconds based on attempt number
 */
export function getRetryDelay(attemptNumber: number): number {
  // Exponential backoff: 1s, 2s, 4s, 8s, etc.
  return Math.min(1000 * Math.pow(2, attemptNumber - 1), 10000);
}
