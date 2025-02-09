class PredictiveModelService {
    static async analyzeEstimate(estimateData) {
        try {
            // Get historical data for comparison
            const historicalData = await this.getHistoricalData(estimateData.insurer);
            
            // Run predictive analysis
            const prediction = await this.runPredictionModel(estimateData, historicalData);
            
            // Get compliance status
            const compliance = await ComplianceService.validateEstimate(estimateData);
            
            return {
                prediction,
                compliance,
                confidence: this.calculateConfidence(prediction, compliance)
            };
        } catch (error) {
            ErrorHandler.showError(error);
            throw error;
        }
    }

    static async getHistoricalData(insurer) {
        const response = await fetch(`${CONFIG.API_BASE_URL}/historical-data/${insurer}`);
        return response.json();
    }

    static async runPredictionModel(estimate, historicalData) {
        const modelInput = this.prepareModelInput(estimate, historicalData);
        
        const response = await fetch(`${CONFIG.API_BASE_URL}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(modelInput)
        });

        return response.json();
    }

    static calculateConfidence(prediction, compliance) {
        // Weighted scoring based on multiple factors
        const weights = {
            laborRates: 0.3,
            partsPrice: 0.3,
            operations: 0.2,
            compliance: 0.2
        };

        return {
            overall: prediction.score * weights.laborRates +
                    prediction.partsScore * weights.partsPrice +
                    prediction.operationsScore * weights.operations +
                    (compliance.isCompliant ? 1 : 0) * weights.compliance,
            factors: {
                laborRates: prediction.score,
                partsPrice: prediction.partsScore,
                operations: prediction.operationsScore,
                compliance: compliance.isCompliant ? 1 : 0
            }
        };
    }

    static prepareModelInput(estimate, historicalData) {
        return {
            estimate: {
                laborRates: estimate.laborRates,
                parts: estimate.parts,
                operations: estimate.operations
            },
            historical: historicalData,
            metadata: {
                insurer: estimate.insurer,
                region: estimate.region,
                timestamp: new Date().toISOString()
            }
        };
    }
} 