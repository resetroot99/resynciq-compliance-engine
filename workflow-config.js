const GEICO_ARX_WORKFLOW = {
    APPROVAL_THRESHOLDS: {
        CONFIDENCE_MIN: 0.85,      // Minimum confidence for auto-approval
        SAVINGS_MIN: 100,          // Minimum savings to flag for review
        BLEND_CONFIDENCE: 0.9,     // Required confidence for blend decisions
        STRUCTURAL_CONFIDENCE: 0.95 // Required confidence for structural repairs
    },

    REVIEW_TRIGGERS: {
        LABOR_VARIANCE: 0.2,       // 20% variance from guidelines
        PARTS_MARKUP: 0.25,        // 25% markup limit
        OPERATION_COUNT: 15,       // Operations count threshold
        TOTAL_HOURS: 40           // Total hours threshold
    },

    AUTOMATION_RULES: {
        AUTO_APPROVE: {
            MAX_TOTAL: 2500,       // Maximum estimate total for auto-approval
            MAX_OPERATIONS: 8,      // Maximum operations for auto-approval
            REQUIRED_SCORE: 95     // Minimum compliance score
        },
        AUTO_REJECT: {
            INVALID_OPERATIONS: true,
            EXCESSIVE_MARKUP: true,
            MISSING_PHOTOS: true
        }
    }
}; 