class EstimateDetailService {
    static async getEstimateDetails(estimateId) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/estimates/${estimateId}`, {
                headers: {
                    'Authorization': `Bearer ${AuthService.getToken()}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch estimate details');
            }

            return response.json();
        } catch (error) {
            ErrorHandler.showError(error);
            throw error;
        }
    }

    static async updateEstimate(estimateId, updates) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/estimates/${estimateId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AuthService.getToken()}`
                },
                body: JSON.stringify(updates)
            });

            if (!response.ok) {
                throw new Error('Failed to update estimate');
            }

            return response.json();
        } catch (error) {
            ErrorHandler.showError(error);
            throw error;
        }
    }

    static formatEstimateData(data) {
        return {
            id: data.id,
            timestamp: new Date(data.timestamp).toLocaleString(),
            status: data.status,
            aiConfidence: data.aiAnalysis?.confidence || 0,
            laborRates: this.formatLaborRates(data.laborRates),
            parts: this.formatParts(data.parts),
            operations: this.formatOperations(data.operations),
            total: this.calculateTotal(data)
        };
    }

    private static formatLaborRates(rates) {
        return rates.map(rate => ({
            ...rate,
            formattedRate: `$${rate.rate.toFixed(2)}/hr`
        }));
    }

    private static formatParts(parts) {
        return parts.map(part => ({
            ...part,
            formattedPrice: `$${part.price.toFixed(2)}`
        }));
    }

    private static formatOperations(operations) {
        return operations.map(op => ({
            ...op,
            formattedCost: `$${(op.hours * op.rate).toFixed(2)}`
        }));
    }

    private static calculateTotal(data) {
        const laborTotal = data.operations.reduce((sum, op) => sum + (op.hours * op.rate), 0);
        const partsTotal = data.parts.reduce((sum, part) => sum + part.price, 0);
        return laborTotal + partsTotal;
    }
} 