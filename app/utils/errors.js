export class ValidationError extends Error {
    constructor(message, type) {
        super(message);
        this.name = 'ValidationError';
        this.type = type;
    }
}

export class APIError extends Error {
    constructor(message, status) {
        super(message);
        this.name = 'APIError';
        this.status = status;
    }
} 