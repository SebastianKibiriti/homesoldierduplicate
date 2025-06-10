import * as Sentry from '@sentry/react';
import React from 'react';
import { BrowserTracing } from '@sentry/tracing';
import {useLocation} from 'react-router-dom';
import {useNavigationType} from 'react-router-dom';
import {createRoutesFromChildren} from 'react-router-dom';
import {matchRoutes} from 'react-router-dom';

// Initialize Sentry
export const initSentry = () => {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  
  if (!dsn) {
    console.warn('Sentry DSN not found. Error monitoring will be disabled.');
    return;
  }

  Sentry.init({
    dsn,
    integrations: [
      new BrowserTracing({
        // Set up automatic route change tracking for React Router
        routingInstrumentation: Sentry.reactRouterV6Instrumentation(
          React.useEffect,
          useLocation,
          useNavigationType,
          createRoutesFromChildren,
          matchRoutes
        ),
      }),
    ],
    
    // Performance monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    
    // Release tracking
    release: import.meta.env.VITE_APP_VERSION || '1.0.0',
    
    // Environment
    environment: import.meta.env.MODE || 'development',
    
    // Error filtering
    beforeSend(event, hint) {
      // Filter out non-critical errors in development
      if (process.env.NODE_ENV === 'development') {
        const error = hint.originalException;
        
        // Skip certain development-only errors
        if (error && typeof error === 'object' && 'message' in error) {
          const message = error.message as string;
          if (
            message.includes('ResizeObserver loop limit exceeded') ||
            message.includes('Non-Error promise rejection captured')
          ) {
            return null;
          }
        }
      }
      
      return event;
    },
    
    // Additional configuration
    attachStacktrace: true,
    debug: process.env.NODE_ENV === 'development',
    
    // User context
    initialScope: {
      tags: {
        component: 'home-soldier-dashboard',
      },
    },
  });
};

// Enhanced error capture for Supabase operations
export const captureSupabaseError = (
  error: any,
  context: {
    operation: string;
    table?: string;
    userId?: string;
    additionalData?: Record<string, any>;
  }
) => {
  Sentry.withScope((scope) => {
    scope.setTag('error_type', 'supabase_error');
    scope.setTag('operation', context.operation);
    
    if (context.table) {
      scope.setTag('table', context.table);
    }
    
    if (context.userId) {
      scope.setUser({ id: context.userId });
    }
    
    scope.setContext('supabase_operation', {
      operation: context.operation,
      table: context.table,
      timestamp: new Date().toISOString(),
      ...context.additionalData,
    });
    
    // Extract meaningful error information
    const errorInfo = {
      message: error?.message || 'Unknown Supabase error',
      code: error?.code,
      details: error?.details,
      hint: error?.hint,
    };
    
    scope.setContext('error_details', errorInfo);
    
    Sentry.captureException(error);
  });
};

// Performance monitoring for Supabase operations
export const measureSupabaseOperation = async <T>(
  operationName: string,
  operation: () => Promise<T>,
  context?: Record<string, any>
): Promise<T> => {
  const transaction = Sentry.startTransaction({
    name: `supabase.${operationName}`,
    op: 'db.query',
  });
  
  Sentry.getCurrentHub().configureScope((scope) => {
    scope.setSpan(transaction);
    if (context) {
      scope.setContext('operation_context', context);
    }
  });
  
  try {
    const result = await operation();
    transaction.setStatus('ok');
    return result;
  } catch (error) {
    transaction.setStatus('internal_error');
    captureSupabaseError(error, {
      operation: operationName,
      ...context,
    });
    throw error;
  } finally {
    transaction.finish();
  }
};

// User context helpers
export const setSentryUser = (user: { id: string; email?: string; role?: string }) => {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    role: user.role,
  });
};

export const clearSentryUser = () => {
  Sentry.setUser(null);
};

// Breadcrumb helpers for better debugging
export const addSentryBreadcrumb = (
  message: string,
  category: string,
  level: 'info' | 'warning' | 'error' = 'info',
  data?: Record<string, any>
) => {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
    timestamp: Date.now() / 1000,
  });
};

export default Sentry;