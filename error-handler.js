class ErrorHandler {
    static showError(error) {
        console.error('Error:', error);
        
        const message = this.formatErrorMessage(error);
        this.displayErrorUI(message);
        
        // Log error for monitoring
        this.logError(error);
    }

    static formatErrorMessage(error) {
        if (error.response) {
            return `Server Error: ${error.response.status} - ${error.response.statusText}`;
        } else if (error.message) {
            return error.message;
        } else {
            return 'An unexpected error occurred';
        }
    }

    static displayErrorUI(message) {
        const errorContainer = document.createElement('div');
        errorContainer.className = 'error-notification';
        errorContainer.innerHTML = `
            <div class="error-content">
                <span class="error-icon">!</span>
                <span class="error-message">${message}</span>
                <button class="close-btn" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        document.body.appendChild(errorContainer);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            errorContainer.remove();
        }, 5000);
    }

    static async logError(error) {
        if (!FEATURES.ERROR_LOGGING) return;

        try {
            await fetch(`${CONFIG.API_BASE_URL}/logs/error`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AuthService.getToken()}`
                },
                body: JSON.stringify({
                    message: error.message,
                    stack: error.stack,
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent,
                    url: window.location.href
                })
            });
        } catch (e) {
            console.error('Failed to log error:', e);
        }
    }
} 