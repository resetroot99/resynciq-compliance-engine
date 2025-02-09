import { ConfigUtil } from '../../utils/ConfigUtil';

export interface LogEntry {
  timestamp: Date;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
  context?: any;
}

export class LoggingService {
  private static instance: LoggingService;
  private logs: LogEntry[] = [];

  private constructor() {}

  static getInstance(): LoggingService {
    if (!this.instance) {
      this.instance = new LoggingService();
    }
    return this.instance;
  }

  log(entry: Omit<LogEntry, 'timestamp'>) {
    const logEntry: LogEntry = {
      ...entry,
      timestamp: new Date()
    };

    // Console logging
    switch (entry.level) {
      case 'ERROR':
        console.error(JSON.stringify(logEntry));
        break;
      case 'WARN':
        console.warn(JSON.stringify(logEntry));
        break;
      case 'DEBUG':
        if (ConfigUtil.get('ENVIRONMENT') === 'development') {
          console.debug(JSON.stringify(logEntry));
        }
        break;
      default:
        console.log(JSON.stringify(logEntry));
    }

    // Store log entry
    this.logs.push(logEntry);

    // Optional: Send to external logging service
    this.sendToExternalLoggingService(logEntry);
  }

  private async sendToExternalLoggingService(entry: LogEntry) {
    // Implement external logging (e.g., Sentry, LogRocket)
    try {
      // Placeholder for external logging
    } catch (error) {
      console.error('Failed to send log to external service', error);
    }
  }

  getLogs(filter?: Partial<LogEntry>): LogEntry[] {
    if (!filter) return this.logs;

    return this.logs.filter(log => 
      Object.entries(filter).every(([key, value]) => log[key] === value)
    );
  }

  clearLogs() {
    this.logs = [];
  }
}

export const loggingService = LoggingService.getInstance(); 