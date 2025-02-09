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

const config = {
    insurers: {
        GEICO: {
            rules: {
                ARX: {
                    version: '2024.1',
                    autoCorrections: true,
                    laborRates: {
                        body: 52,
                        paint: 52,
                        frame: 65,
                        mechanical: 125
                    },
                    blendOperations: {
                        required: true,
                        maxPanels: 3
                    },
                    partTypes: {
                        preferredAftermarket: ['CAPA', 'NSF'],
                        oemExceptions: ['safety', 'structural']
                    },
                    recommendations: {
                        enabled: true,
                        priority: ['safety', 'compliance', 'cost']
                    }
                }
            },
            approvalThreshold: 0.85
        },
        // Add other insurers...
    },

    aiService: {
        modelVersions: {
            estimateAnalysis: 'v2.1',
            approvalPrediction: 'v1.8',
            autoCorrection: 'v2.0'
        },
        confidenceThreshold: 0.90,
        autoCorrectThreshold: 0.95,
        learningRate: 0.01,
        feedbackLoop: {
            enabled: true,
            interval: 3600 // 1 hour
        }
    },

    security: {
        rateLimit: {
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100 // limit each IP to 100 requests
        },
        encryption: {
            algorithm: 'aes-256-gcm',
            keyLength: 32
        }
    },

    features: {
        autoCorrection: true,
        predictiveModeling: true,
        multiInsurerValidation: true,
        realTimeValidation: true,
        proactiveRecommendations: true,
        dynamicRuleAdaptation: true
    },

    systemOverview: {
        description: 'ComplianceIQ revolutionizes insurance estimate review and compliance by integrating AI-driven automation with CCC ONE APIs. Our web-based Reviewer Dashboard offers automated corrections, real-time recommendations, and predictive approval insights, significantly reducing manual effort and improving accuracy.',
        keyFeatures: [
            'AI-Powered Estimate Review',
            'Auto-Correction & Compliance',
            'Predictive Approval Modeling',
            'Real-Time Recommendations',
            'Seamless CCC ONE Integration'
        ]
    },

    corePrinciples: [
        'Proactive, Not Reactive',
        'Insurer-Specific Customization',
        'First-Time Right',
        'Seamless Automation',
        'User-Centric'
    ]
};

export default config; 