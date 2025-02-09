type LogLevel = 'info' | 'warn' | 'error';

interface LogParams {
  [key: string]: any;
}

class Logger {
  private log(level: LogLevel, message: string, params?: LogParams) {
    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      level,
      message,
      ...params
    };

    if (process.env.NODE_ENV === 'development') {
      console.log(JSON.stringify(logData, null, 2));
    } else {
      // In production, you might want to send logs to a service
      // like DataDog, CloudWatch, etc.
    }
  }

  info(params: LogParams, message: string) {
    this.log('info', message, params);
  }

  warn(params: LogParams, message: string) {
    this.log('warn', message, params);
  }

  error(params: LogParams, message: string) {
    this.log('error', message, params);
  }
}

export default new Logger(); 