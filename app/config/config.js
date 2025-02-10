export const CONFIG = {
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000/api',
    VALIDATION_TIMEOUT: parseInt(process.env.VALIDATION_TIMEOUT) || 5000,
    MAX_RETRIES: parseInt(process.env.MAX_RETRIES) || 3,
    CACHE_TTL: parseInt(process.env.CACHE_TTL) || 60000,
    NOTIFICATION_ENCRYPTION_KEY: process.env.NOTIFICATION_ENCRYPTION_KEY || 'default-encryption-key',
    AI_SERVICE_URL: process.env.AI_SERVICE_URL || 'http://localhost:5000',
    RULES_SERVICE_URL: process.env.RULES_SERVICE_URL || 'http://localhost:5001'
}; 