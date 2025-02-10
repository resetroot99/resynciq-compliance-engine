import { AuthService } from '../security/AuthService';
import { aiService } from '../ai/AIService';
import { insurerService } from '../insurer/InsurerService';
import { securityService } from '../security/SecurityService';

class NotificationService {
    constructor() {
        this.encryptionKey = process.env.NOTIFICATION_ENCRYPTION_KEY;
    }

    async sendNotification(userId, type, message) {
        try {
            const encryptedMessage = await this.encryptMessage(message);
            await this.validateNotification(userId, type);
            
            return await this.deliverNotification({
                userId,
                type,
                message: encryptedMessage,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Notification failed:', error);
            throw error;
        }
    }

    async encryptMessage(message) {
        return await securityService.encrypt(message, this.encryptionKey);
    }

    async validateNotification(userId, type) {
        if (!userId || !type) {
            throw new Error('Invalid notification parameters');
        }
        
        const validTypes = ['INFO', 'WARNING', 'ERROR', 'AI_UPDATE', 'RULE_UPDATE'];
        if (!validTypes.includes(type)) {
            throw new Error(`Invalid notification type: ${type}`);
        }
    }

    async deliverNotification(notification) {
        try {
            const response = await fetch('/api/notifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AuthService.getToken()}`
                },
                body: JSON.stringify(notification)
            });
            
            if (!response.ok) {
                throw new Error('Failed to deliver notification');
            }
        } catch (error) {
            throw new Error(`Notification delivery failed: ${error.message}`);
        }
    }

    // Add all other methods...
}

export const notificationService = new NotificationService(); 