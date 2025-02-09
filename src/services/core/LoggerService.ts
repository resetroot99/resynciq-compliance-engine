export class LoggerService {
  async log(info: any) {
    console.log('INFO:', info);
    // Additional logging logic (e.g., to a file or external service)
  }

  async error(error: any) {
    console.error('ERROR:', error);
    // Additional error logging logic
  }

  async warn(warning: any) {
    console.warn('WARNING:', warning);
    // Additional warning logging logic
  }
} 