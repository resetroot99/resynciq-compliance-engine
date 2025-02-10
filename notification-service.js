import { aiService } from '../ai/AIService';
import { insurerService } from '../insurer/InsurerService';
import { securityService } from '../security/SecurityService';
import { AuthService } from '../security/AuthService';

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

    async sendAIUpdateNotification(userId, updateType) {
        const message = await aiService.getUpdateMessage(updateType);
        await this.sendNotification(userId, 'AI_UPDATE', message);
    }

    async sendInsurerRuleUpdateNotification(userId, insurerId) {
        const message = await insurerService.getRuleUpdateMessage(insurerId);
        await this.sendNotification(userId, 'RULE_UPDATE', message);
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

    static show(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getIcon(type)}</span>
                <span class="notification-message">${message}</span>
                <button class="close-btn" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    static getIcon(type) {
        switch (type) {
            case 'success': return '✓';
            case 'error': return '!';
            case 'warning': return '⚠';
            default: return 'i';
        }
    }

    static success(message) {
        this.show(message, 'success');
    }

    static error(message) {
        this.show(message, 'error');
    }

    static warning(message) {
        this.show(message, 'warning');
    }

    static info(message) {
        this.show(message, 'info');
    }

    async sendModelImprovementNotification(userId) {
        try {
            const message = await aiService.getImprovementMessage();
            await this.sendNotification(userId, 'MODEL_IMPROVEMENT', message);
        } catch (error) {
            throw new Error(`Model improvement notification failed: ${error.message}`);
        }
    }

    static async sendSystemUpdateNotification(userId) {
        const message = 'System update available. Please restart your application.';
        await this.sendNotification(userId, 'SYSTEM_UPDATE', message);
    }

    async deliverWithRetry(notification, retries = 3) {
        for (let i = 0; i < retries; i++) {
            try {
                return await this.deliverNotification(notification);
            } catch (error) {
                if (i === retries - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            }
        }
    }

    static async sendSecurityAlertNotification(userId) {
        const message = 'Security alert: Unusual activity detected.';
        await this.sendNotification(userId, 'SECURITY_ALERT', message);
    }

    static async sendThrottledNotification(userId, type, message, delay = 1000) {
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.sendNotification(userId, type, message);
    }

    static async updateNotificationPreferences(userId, preferences) {
        try {
            const response = await fetch('/api/notifications/preferences', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AuthService.getToken()}`
                },
                body: JSON.stringify({
                    userId,
                    preferences
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to update notification preferences');
            }
        } catch (error) {
            throw new Error(`Preference update failed: ${error.message}`);
        }
    }

    static async sendBatchNotifications(notifications) {
        const batchSize = 10;
        for (let i = 0; i < notifications.length; i += batchSize) {
            const batch = notifications.slice(i, i + batchSize);
            await Promise.all(batch.map(notification => 
                this.sendNotification(
                    notification.userId,
                    notification.type,
                    notification.message
                )
            ));
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    static getTemplate(type) {
        const templates = {
            APPROVAL: 'Your estimate has been approved',
            REJECTION: 'Your estimate requires changes',
            UPDATE: 'New system update available'
        };
        return templates[type] || 'Notification';
    }

    static async trackDelivery(notificationId) {
        await fetch(`/api/notifications/${notificationId}/track`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AuthService.getToken()}`
            }
        });
    }
}

export const notificationService = new NotificationService(); 