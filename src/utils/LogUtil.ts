import { loggingService } from '../services/logging/LoggingService';

export class LogUtil {
  static info(message: string, context?: any) {
    loggingService.log({ level: 'INFO', message, context });
  }

  static warn(message: string, context?: any) {
    loggingService.log({ level: 'WARN', message, context });
  }

  static error(message: string, context?: any) {
    loggingService.log({ level: 'ERROR', message, context });
  }

  static debug(message: string, context?: any) {
    loggingService.log({ level: 'DEBUG', message, context });
  }
} 