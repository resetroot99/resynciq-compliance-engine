import { NotificationService } from './NotificationService';
import { LoggerService } from './LoggerService';

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user' | 'manager';
  permissions: string[];
}

export class AuthService {
  private currentUser: User | null = null;
  
  constructor(
    private notificationService = new NotificationService(),
    private logger = new LoggerService()
  ) {}

  async login(email: string, password: string): Promise<User> {
    try {
      // Implement actual authentication logic
      const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const userData = await response.json();
      this.currentUser = userData;

      await this.notificationService.notifyProcessComplete({
        userId: userData.id,
        userEmail: userData.email,
        message: 'Successful login'
      });

      this.logger.log(`User ${email} logged in successfully`);
      return userData;
    } catch (error) {
      this.logger.error(error);
      await this.notificationService.notifyError(error);
      throw error;
    }
  }

  async logout() {
    try {
      await fetch('/api/logout', { method: 'POST' });
      this.currentUser = null;
      this.logger.log('User logged out');
    } catch (error) {
      this.logger.error(error);
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  hasPermission(requiredPermission: string): boolean {
    return this.currentUser?.permissions.includes(requiredPermission) || false;
  }
}

export const authService = new AuthService(); 