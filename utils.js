// Error handling utilities
class ErrorHandler {
    static handle(error, context = '') {
        console.error(`Error in ${context}:`, error);
        
        if (error.response) {
            // API error response
            return {
                type: 'API_ERROR',
                message: error.response.data.message || 'API request failed',
                status: error.response.status
            };
        } else if (error.request) {
            // Network error
            return {
                type: 'NETWORK_ERROR',
                message: 'Network connection failed'
            };
        } else {
            // Other errors
            return {
                type: 'GENERAL_ERROR',
                message: error.message || 'An unexpected error occurred'
            };
        }
    }

    static showError(error) {
        const errorData = this.handle(error);
        // You can implement custom error UI here
        console.error(errorData);
    }
}

// Date formatting utility
const DateFormatter = {
    format(date, format = 'YYYY-MM-DD') {
        const d = new Date(date);
        return format
            .replace('YYYY', d.getFullYear())
            .replace('MM', String(d.getMonth() + 1).padStart(2, '0'))
            .replace('DD', String(d.getDate()).padStart(2, '0'));
    }
};

// Currency formatting utility
const CurrencyFormatter = {
    format(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }
}; 