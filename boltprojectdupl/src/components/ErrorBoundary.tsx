import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Copy, Download } from 'lucide-react';
import * as Sentry from '@sentry/react';
import { logger } from '../utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showErrorDetails?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId?: string;
  eventId?: string;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return { 
      hasError: true, 
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Capture error with Sentry and get event ID
    const eventId = Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
      tags: {
        errorBoundary: true,
      },
    });

    // Log the error with detailed context
    logger.error('ErrorBoundary caught an error', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      sentryEventId: eventId,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    });
    
    this.setState({
      error,
      errorInfo,
      eventId,
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    logger.info('ErrorBoundary: User clicked reset', {
      errorId: this.state.errorId,
      sentryEventId: this.state.eventId,
    });
    
    this.setState({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined,
      errorId: undefined,
      eventId: undefined,
    });
  };

  handleGoHome = () => {
    logger.info('ErrorBoundary: User clicked go home', {
      errorId: this.state.errorId,
      sentryEventId: this.state.eventId,
    });
    
    window.location.href = '/';
  };

  handleCopyError = () => {
    if (this.state.error) {
      const errorDetails = {
        errorId: this.state.errorId,
        sentryEventId: this.state.eventId,
        message: this.state.error.message,
        stack: this.state.error.stack,
        componentStack: this.state.errorInfo?.componentStack,
        url: window.location.href,
        timestamp: new Date().toISOString(),
      };
      
      navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2));
      logger.info('ErrorBoundary: Error details copied to clipboard');
    }
  };

  handleDownloadLogs = () => {
    const logs = logger.exportLogs();
    const blob = new Blob([logs], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-logs-${this.state.errorId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    logger.info('ErrorBoundary: Logs downloaded');
  };

  handleReportFeedback = () => {
    if (this.state.eventId) {
      Sentry.showReportDialog({ eventId: this.state.eventId });
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const showDetails = this.props.showErrorDetails ?? process.env.NODE_ENV === 'development';

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              Oops! Something went wrong
            </h1>
            
            <p className="text-gray-600 mb-6 text-center">
              We encountered an unexpected error. Our team has been automatically notified and will look into it.
            </p>

            {this.state.errorId && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Error ID:</strong> {this.state.errorId}
                </p>
                {this.state.eventId && (
                  <p className="text-sm text-gray-600">
                    <strong>Report ID:</strong> {this.state.eventId}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Please include these IDs when contacting support.
                </p>
              </div>
            )}

            {showDetails && this.state.error && (
              <details className="mb-6">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 mb-2">
                  Technical Details
                </summary>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="mb-3">
                    <h4 className="font-semibold text-red-600 text-sm">Error Message:</h4>
                    <p className="text-sm font-mono text-gray-800">{this.state.error.message}</p>
                  </div>
                  
                  {this.state.error.stack && (
                    <div className="mb-3">
                      <h4 className="font-semibold text-red-600 text-sm">Stack Trace:</h4>
                      <pre className="text-xs font-mono text-gray-600 overflow-auto max-h-32 bg-white p-2 rounded border">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  )}
                  
                  {this.state.errorInfo?.componentStack && (
                    <div>
                      <h4 className="font-semibold text-red-600 text-sm">Component Stack:</h4>
                      <pre className="text-xs font-mono text-gray-600 overflow-auto max-h-32 bg-white p-2 rounded border">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </button>

              {this.state.eventId && (
                <button
                  onClick={this.handleReportFeedback}
                  className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Report Issue
                </button>
              )}

              {showDetails && (
                <>
                  <button
                    onClick={this.handleCopyError}
                    className="flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Error
                  </button>
                  
                  <button
                    onClick={this.handleDownloadLogs}
                    className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Logs
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;