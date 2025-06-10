export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: any;
  userId?: string;
  component?: string;
  action?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private isDevelopment = process.env.NODE_ENV === 'development';

  private createLogEntry(level: LogLevel, message: string, context?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      userId: this.getCurrentUserId(),
      component: this.getComponentFromStack(),
      action: context?.action,
    };
  }

  private getCurrentUserId(): string | undefined {
    try {
      // Try to get user ID from auth context or localStorage
      const userStr = localStorage.getItem('supabase.auth.token');
      if (userStr) {
        const authData = JSON.parse(userStr);
        return authData?.user?.id;
      }
    } catch (error) {
      // Silently fail if we can't get user ID
    }
    return undefined;
  }

  private getComponentFromStack(): string | undefined {
    try {
      const stack = new Error().stack;
      if (stack) {
        const lines = stack.split('\n');
        // Look for React component names in the stack
        for (const line of lines) {
          const match = line.match(/at (\w+)/);
          if (match && match[1] && match[1] !== 'Logger' && match[1] !== 'Object') {
            return match[1];
          }
        }
      }
    } catch (error) {
      // Silently fail if we can't parse stack
    }
    return undefined;
  }

  private addLog(entry: LogEntry) {
    this.logs.push(entry);
    
    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output in development
    if (this.isDevelopment) {
      const style = this.getConsoleStyle(entry.level);
      console.log(
        `%c[${LogLevel[entry.level]}] ${entry.message}`,
        style,
        entry.context || ''
      );
    }

    // Send critical errors to monitoring service in production
    if (entry.level === LogLevel.ERROR && !this.isDevelopment) {
      this.sendToMonitoring(entry);
    }
  }

  private getConsoleStyle(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG:
        return 'color: #6b7280';
      case LogLevel.INFO:
        return 'color: #3b82f6';
      case LogLevel.WARN:
        return 'color: #f59e0b; font-weight: bold';
      case LogLevel.ERROR:
        return 'color: #ef4444; font-weight: bold';
      default:
        return '';
    }
  }

  private async sendToMonitoring(entry: LogEntry) {
    try {
      // In a real app, you'd send to a service like Sentry, LogRocket, etc.
      // For now, we'll just store in localStorage for debugging
      const existingErrors = JSON.parse(localStorage.getItem('app_errors') || '[]');
      existingErrors.push(entry);
      localStorage.setItem('app_errors', JSON.stringify(existingErrors.slice(-50)));
    } catch (error) {
      console.error('Failed to send error to monitoring:', error);
    }
  }

  debug(message: string, context?: any) {
    this.addLog(this.createLogEntry(LogLevel.DEBUG, message, context));
  }

  info(message: string, context?: any) {
    this.addLog(this.createLogEntry(LogLevel.INFO, message, context));
  }

  warn(message: string, context?: any) {
    this.addLog(this.createLogEntry(LogLevel.WARN, message, context));
  }

  error(message: string, context?: any) {
    this.addLog(this.createLogEntry(LogLevel.ERROR, message, context));
  }

  // Specific logging methods for common scenarios
  apiError(endpoint: string, error: any, context?: any) {
    this.error(`API Error: ${endpoint}`, {
      ...context,
      action: 'api_call',
      endpoint,
      error: error.message || error,
      stack: error.stack,
    });
  }

  userAction(action: string, context?: any) {
    this.info(`User Action: ${action}`, {
      ...context,
      action: 'user_interaction',
    });
  }

  componentError(component: string, error: any, context?: any) {
    this.error(`Component Error: ${component}`, {
      ...context,
      action: 'component_error',
      component,
      error: error.message || error,
      stack: error.stack,
    });
  }

  // Get logs for debugging
  getLogs(level?: LogLevel): LogEntry[] {
    if (level !== undefined) {
      return this.logs.filter(log => log.level >= level);
    }
    return [...this.logs];
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
  }

  // Export logs for support
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const logger = new Logger();