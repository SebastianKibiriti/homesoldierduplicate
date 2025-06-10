import { useCallback } from 'react';
import { logger } from '../utils/logger';

interface ErrorHandlerOptions {
  component?: string;
  fallbackMessage?: string;
  showToast?: boolean;
  logLevel?: 'error' | 'warn';
}

export const useErrorHandler = (options: ErrorHandlerOptions = {}) => {
  const {
    component = 'Unknown',
    fallbackMessage = 'An unexpected error occurred',
    showToast = true,
    logLevel = 'error'
  } = options;

  const handleError = useCallback((error: any, context?: any) => {
    const errorMessage = error?.message || error?.toString() || fallbackMessage;
    
    // Log the error
    if (logLevel === 'error') {
      logger.componentError(component, error, context);
    } else {
      logger.warn(`${component}: ${errorMessage}`, { ...context, error });
    }

    // Show user-friendly message
    if (showToast && typeof window !== 'undefined') {
      // In a real app, you'd use a toast library
      console.error(`${component}: ${errorMessage}`);
    }

    return errorMessage;
  }, [component, fallbackMessage, showToast, logLevel]);

  const handleAsyncError = useCallback(async (
    asyncFn: () => Promise<any>,
    context?: any
  ) => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error, context);
      throw error; // Re-throw so calling code can handle it
    }
  }, [handleError]);

  return { handleError, handleAsyncError };
};