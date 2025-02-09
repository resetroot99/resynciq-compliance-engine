class LearningFeedbackService {
    static async submitFeedback(data) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/ai/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AuthService.getToken()}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Failed to submit feedback');
            }

            return response.json();
        } catch (error) {
            ErrorHandler.showError(error);
            throw error;
        }
    }

    static async collectReviewerActions(estimateId) {
        try {
            const actions = await this.getStoredActions(estimateId);
            if (actions.length > 0) {
                await this.submitFeedback({
                    estimateId,
                    actions,
                    timestamp: new Date().toISOString()
                });
                await this.clearStoredActions(estimateId);
            }
        } catch (error) {
            console.error('Failed to collect reviewer actions:', error);
        }
    }

    static async logAction(action) {
        try {
            const actions = await this.getStoredActions(action.estimateId);
            actions.push({
                ...action,
                timestamp: new Date().toISOString()
            });
            await this.storeActions(action.estimateId, actions);
        } catch (error) {
            console.error('Failed to log action:', error);
        }
    }

    private static async getStoredActions(estimateId) {
        const key = `reviewer_actions_${estimateId}`;
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : [];
    }

    private static async storeActions(estimateId, actions) {
        const key = `reviewer_actions_${estimateId}`;
        localStorage.setItem(key, JSON.stringify(actions));
    }

    private static async clearStoredActions(estimateId) {
        const key = `reviewer_actions_${estimateId}`;
        localStorage.removeItem(key);
    }
} 