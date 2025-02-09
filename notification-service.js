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
        // Implement notification validation
    }

    async deliverNotification(notification) {
        // Implement notification delivery
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
}

export const notificationService = new NotificationService(); 