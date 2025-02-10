export class ErrorHandler {
    static showError(error) {
        console.error('Error:', {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
    }

    static logError(error, context = {}) {
        // Implement error logging to external service
        console.error('Logged Error:', {
            error: error.message,
            context,
            timestamp: new Date().toISOString()
        });
    }
} 