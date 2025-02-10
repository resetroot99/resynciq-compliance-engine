import { AuthService } from '../security/AuthService';
import { ErrorHandler } from '../utils/ErrorHandler';
import { CONFIG } from '../config/config';
import { ValidationError } from '../utils/errors';

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
            Object.assign(aggregated.details, result.details || {});
        });

        return aggregated;
    }

    // Add all other methods...
}

export default RealTimeValidationService; 