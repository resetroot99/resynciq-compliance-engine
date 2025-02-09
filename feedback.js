class LearningFeedback {
    static initialize() {
        if (!FEATURES.LEARNING_FEEDBACK) return;
        
        setInterval(() => this.collectFeedback(), CONFIG.LEARNING_FEEDBACK.COLLECTION_INTERVAL);
    }
    
    static async collectFeedback() {
        const actions = this.getReviewerActions();
        if (actions.length > 0) {
            await AIService.submitFeedback(actions);
        }
    }
    
    static getReviewerActions() {
        // Collect reviewer actions from localStorage
        const actions = JSON.parse(localStorage.getItem('reviewer_actions') || '[]');
        localStorage.removeItem('reviewer_actions');
        return actions;
    }
    
    static logAction(action) {
        if (!FEATURES.LEARNING_FEEDBACK) return;
        
        const actions = JSON.parse(localStorage.getItem('reviewer_actions') || '[]');
        actions.push({
            ...action,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('reviewer_actions', JSON.stringify(actions));
    }
} 