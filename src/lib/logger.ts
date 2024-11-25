import { config } from '../config';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  error?: Error;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private readonly maxLogs = 1000;

  private constructor() {
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
    window.addEventListener('error', this.handleError);
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    this.error('Unhandled Promise Rejection:', event.reason);
  };

  private handleError = (event: ErrorEvent) => {
    this.error('Uncaught Error:', event.error);
  };

  private formatLog(level: LogLevel, message: string, data?: any, error?: Error): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      error,
    };
  }

  private addLog(entry: LogEntry) {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    if (config.MODE === 'development') {
      console[entry.level](
        `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}`,
        entry.data || '',
        entry.error || ''
      );
    }

    // In production, send logs to a service
    if (config.MODE === 'production') {
      this.shipLogs(entry);
    }
  }

  private shipLogs(entry: LogEntry) {
    // Send logs to your logging service
    // This is just an example - implement your own logging service integration
    const logData = {
      ...entry,
      app: config.APP_NAME,
      version: config.APP_VERSION,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // Example: Send to logging endpoint
    fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logData),
    }).catch(error => {
      console.error('Failed to ship logs:', error);
    });
  }

  debug(message: string, data?: any) {
    this.addLog(this.formatLog('debug', message, data));
  }

  info(message: string, data?: any) {
    this.addLog(this.formatLog('info', message, data));
  }

  warn(message: string, data?: any) {
    this.addLog(this.formatLog('warn', message, data));
  }

  error(message: string, error?: Error, data?: any) {
    this.addLog(this.formatLog('error', message, data, error));
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = Logger.getInstance();