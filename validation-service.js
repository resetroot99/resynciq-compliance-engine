class ValidationService {
    static validateEstimateData(data) {
        const errors = [];
        const warnings = [];

        // Validate required fields
        if (!this.validateRequiredFields(data, errors)) {
            return { isValid: false, errors, warnings };
        }

        // Validate labor rates
        this.validateLaborRates(data.laborRates, errors, warnings);

        // Validate parts
        this.validateParts(data.parts, errors, warnings);

        // Validate operations
        this.validateOperations(data.operations, errors, warnings);

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }

    private static validateRequiredFields(data, errors) {
        const required = ['id', 'timestamp', 'laborRates', 'parts', 'operations'];
        const missing = required.filter(field => !data[field]);
        
        if (missing.length > 0) {
            errors.push(`Missing required fields: ${missing.join(', ')}`);
            return false;
        }
        return true;
    }

    private static validateLaborRates(rates, errors, warnings) {
        if (!Array.isArray(rates)) {
            errors.push('Labor rates must be an array');
            return;
        }

        rates.forEach((rate, index) => {
            if (!rate.type || !rate.rate) {
                errors.push(`Invalid labor rate at index ${index}`);
            }
            if (rate.rate <= 0) {
                errors.push(`Labor rate must be greater than 0 at index ${index}`);
            }
            if (rate.rate > 200) {
                warnings.push(`Unusually high labor rate at index ${index}`);
            }
        });
    }

    private static validateParts(parts, errors, warnings) {
        if (!Array.isArray(parts)) {
            errors.push('Parts must be an array');
            return;
        }

        parts.forEach((part, index) => {
            if (!part.number || !part.description || !part.price) {
                errors.push(`Invalid part at index ${index}`);
            }
            if (part.price <= 0) {
                errors.push(`Part price must be greater than 0 at index ${index}`);
            }
            if (part.price > 10000) {
                warnings.push(`Unusually high part price at index ${index}`);
            }
        });
    }

    private static validateOperations(operations, errors, warnings) {
        if (!Array.isArray(operations)) {
            errors.push('Operations must be an array');
            return;
        }

        operations.forEach((op, index) => {
            if (!op.name || !op.hours || !op.rate) {
                errors.push(`Invalid operation at index ${index}`);
            }
            if (op.hours <= 0) {
                errors.push(`Operation hours must be greater than 0 at index ${index}`);
            }
            if (op.hours > 40) {
                warnings.push(`Unusually high operation hours at index ${index}`);
            }
        });
    }

    static validateComplianceData(data) {
        // Add compliance validation logic
        return {
            isValid: true,
            errors: []
        };
    }
} 