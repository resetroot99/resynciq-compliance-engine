// API Configuration
const CONFIG = {
    API_BASE_URL: 'http://localhost:3000/api',
    ENDPOINTS: {
        upload: '/estimates/upload',
        analyze: '/estimates/analyze',
        queue: '/estimates/queue',
        process: '/estimates/process',
        recommendations: '/estimates/recommendations',
        compliance: '/estimates/compliance'
    },
    AI_CONFIDENCE_THRESHOLD: 0.85,
    UPLOAD_MAX_SIZE: 10 * 1024 * 1024, // 10MB
    SUPPORTED_FORMATS: ['.pdf', '.ems'],
    OCR: {
        CONFIDENCE_THRESHOLD: 0.85,
        SUPPORTED_LANGUAGES: ['eng'],
        PDF_EXTRACTION_MODE: 'accurate'
    },
    AI_MODELS: {
        LABOR_RATE: '/models/labor-rate',
        PARTS_VALIDATION: '/models/parts',
        OPERATIONS: '/models/operations',
        PREDICTIVE_APPROVAL: '/models/approval'
    },
    LEARNING_FEEDBACK: {
        ENABLED: true,
        COLLECTION_INTERVAL: 1000 * 60 * 5 // 5 minutes
    }
};

// Feature flags
const FEATURES = {
    AI_ANALYSIS: true,
    REAL_TIME_VALIDATION: true,
    CCC_INTEGRATION: false, // Coming soon
    AUTO_UPDATES: false,     // Coming soon
    OCR_EXTRACTION: true,
    PREDICTIVE_MODELING: true,
    AUTO_CORRECTION: true,
    LEARNING_FEEDBACK: true
}; 