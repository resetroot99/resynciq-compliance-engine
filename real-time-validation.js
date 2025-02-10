const VALIDATION_RULES = {
    labor: {
        minRate: 50,
        maxRate: 200,
        maxHours: 100
    },
    parts: {
        maxMarkup: 1.5,
        requiredFields: ['partNumber', 'description', 'price']
    },
    operations: {
        requiredFields: ['description', 'hours', 'rate']
    }
};

class ValidationError extends Error {
    constructor(message, type) {
        super(message);
        this.type = type;
        this.name = "ValidationError";
    }
}

class RealTimeValidationService {
    static async validateEstimate(estimateData, type = 'all') {
        try {
            const validations = [];

            if (type === 'all' || type === 'labor') {
                validations.push(this.validateLaborRates(estimateData.laborRates));
            }
            if (type === 'all' || type === 'parts') {
                validations.push(this.validateParts(estimateData.parts));
            }
            if (type === 'all' || type === 'operations') {
                validations.push(this.validateOperations(estimateData.operations));
            }

            const results = await Promise.all(validations);
            return this.aggregateResults(results);
        } catch (error) {
            ErrorHandler.showError(error);
            throw error;
        }
    }

    static async validateLaborRates(laborRates) {
        if (!laborRates || !Array.isArray(laborRates)) {
            throw new ValidationError('Invalid labor rates format', 'LABOR');
        }
        const response = await fetch(`${CONFIG.API_BASE_URL}/validate/labor-rates`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AuthService.getToken()}`
            },
            body: JSON.stringify({ laborRates })
        });

        return response.json();
    }

    static async validateParts(parts) {
        const response = await fetch(`${CONFIG.API_BASE_URL}/validate/parts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AuthService.getToken()}`
            },
            body: JSON.stringify({ parts })
        });

        return response.json();
    }

    static async validateOperations(operations) {
        const response = await fetch(`${CONFIG.API_BASE_URL}/validate/operations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AuthService.getToken()}`
            },
            body: JSON.stringify({ operations })
        });

        return response.json();
    }

    static aggregateResults(results) {
        const aggregated = {
            isValid: true,
            warnings: [],
            errors: [],
            details: {}
        };

        results.forEach(result => {
            aggregated.isValid = aggregated.isValid && result.isValid;
            aggregated.warnings.push(...(result.warnings || []));
            aggregated.errors.push(...(result.errors || []));
            aggregated.details = { ...aggregated.details, ...result.details };
        });

        return aggregated;
    }

    static async validateEstimateTotals(estimate) {
        const { subtotal, tax, total } = estimate;
        if (subtotal <= 0 || tax < 0 || total <= 0) {
            throw new ValidationError('Invalid estimate totals', 'TOTALS');
        }
        if (Math.abs(total - (subtotal + tax)) > 0.01) {
            throw new ValidationError('Total does not match subtotal + tax', 'TOTALS');
        }
    }

    static async validateEstimateMetadata(metadata) {
        const requiredFields = ['estimateId', 'userId', 'companyId', 'createdAt'];
        for (const field of requiredFields) {
            if (!metadata[field]) {
                throw new ValidationError(`Missing required field: ${field}`, 'METADATA');
            }
        }
    }

    static async validatePhotos(photos) {
        if (!Array.isArray(photos)) {
            throw new ValidationError('Photos must be an array', 'PHOTOS');
        }
        if (photos.length < 3) {
            throw new ValidationError('At least 3 photos required', 'PHOTOS');
        }
    }

    static logValidation(validationType, result) {
        console.log('Validation Log:', {
            type: validationType,
            result,
            timestamp: new Date().toISOString()
        });
    }

    static async validateVehicleData(vehicle) {
        const requiredFields = ['make', 'model', 'year', 'vin'];
        for (const field of requiredFields) {
            if (!vehicle[field]) {
                throw new ValidationError(`Missing vehicle field: ${field}`, 'VEHICLE');
            }
        }
        
        if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vehicle.vin)) {
            throw new ValidationError('Invalid VIN format', 'VEHICLE');
        }
    }

    static async reportValidationError(error, context) {
        await fetch('/api/validation/errors', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AuthService.getToken()}`
            },
            body: JSON.stringify({
                error: error.message,
                type: error.type,
                context,
                timestamp: new Date().toISOString()
            })
        });
    }

    // Add caching
    const cache = new Map();
    const CACHE_TTL = 60 * 1000; // 1 minute

    static async getCachedValidation(key, validationFn) {
        if (cache.has(key)) {
            const { timestamp, result } = cache.get(key);
            if (Date.now() - timestamp < CACHE_TTL) {
                return result;
            }
        }
        
        const result = await validationFn();
        cache.set(key, { timestamp: Date.now(), result });
        return result;
    }

    // Add rate limiting
    const rateLimits = new Map();

    static checkRateLimit(userId) {
        const now = Date.now();
        const userLimits = rateLimits.get(userId) || { count: 0, lastRequest: now };
        
        if (now - userLimits.lastRequest < 1000) { // 1 second window
            if (userLimits.count >= 10) {
                throw new ValidationError('Rate limit exceeded', 'RATE_LIMIT');
            }
            userLimits.count++;
        } else {
            userLimits.count = 1;
            userLimits.lastRequest = now;
        }
        
        rateLimits.set(userId, userLimits);
    }
}

export default RealTimeValidationService; 