import { useState, useCallback } from 'react';
import { useErrorHandler } from './useErrorHandler';
import { logger } from '../utils/logger';

interface AsyncOperationState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseAsyncOperationOptions {
  component?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  retryCount?: number;
  retryDelay?: number;
}

export const useAsyncOperation = <T = any>(options: UseAsyncOperationOptions = {}) => {
  const {
    component = 'AsyncOperation',
    onSuccess,
    onError,
    retryCount = 0,
    retryDelay = 1000
  } = options;

  const [state, setState] = useState<AsyncOperationState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const { handleError } = useErrorHandler({ component });

  const execute = useCallback(async (
    asyncFn: () => Promise<T>,
    context?: any
  ): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    let lastError: any;
    let attempts = 0;
    const maxAttempts = retryCount + 1;

    while (attempts < maxAttempts) {
      try {
        logger.info(`${component}: Starting async operation`, {
          ...context,
          attempt: attempts + 1,
          maxAttempts,
        });

        const result = await asyncFn();
        
        setState({
          data: result,
          loading: false,
          error: null,
        });

        logger.info(`${component}: Async operation completed successfully`, {
          ...context,
          attempt: attempts + 1,
        });

        onSuccess?.(result);
        return result;

      } catch (error) {
        lastError = error;
        attempts++;

        logger.warn(`${component}: Async operation failed`, {
          ...context,
          attempt: attempts,
          maxAttempts,
          error: error.message || error,
        });

        if (attempts < maxAttempts) {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
    }

    // All attempts failed
    const errorMessage = handleError(lastError, context);
    setState({
      data: null,
      loading: false,
      error: errorMessage,
    });

    onError?.(lastError);
    return null;
  }, [component, retryCount, retryDelay, handleError, onSuccess, onError]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
};