class AutoCorrection {
    static async applyCorrections(estimateData, corrections) {
        try {
            // Apply each correction based on type
            for (const correction of corrections) {
                switch (correction.type) {
                    case 'labor_rate':
                        estimateData = await this.correctLaborRate(estimateData, correction);
                        break;
                    case 'parts_price':
                        estimateData = await this.correctPartsPrice(estimateData, correction);
                        break;
                    case 'operation_time':
                        estimateData = await this.correctOperationTime(estimateData, correction);
                        break;
                }
            }

            // Log the auto-corrections for learning
            LearningFeedback.logAction({
                type: 'auto_correction',
                corrections,
                estimateId: estimateData.id
            });

            return estimateData;
        } catch (error) {
            ErrorHandler.showError(error);
            throw error;
        }
    }

    static async correctLaborRate(estimate, correction) {
        const { operationId, suggestedRate } = correction;
        estimate.operations = estimate.operations.map(op => {
            if (op.id === operationId) {
                return { ...op, rate: suggestedRate };
            }
            return op;
        });
        return estimate;
    }

    static async correctPartsPrice(estimate, correction) {
        const { partId, suggestedPrice } = correction;
        estimate.parts = estimate.parts.map(part => {
            if (part.id === partId) {
                return { ...part, price: suggestedPrice };
            }
            return part;
        });
        return estimate;
    }

    static async correctOperationTime(estimate, correction) {
        const { operationId, suggestedTime } = correction;
        estimate.operations = estimate.operations.map(op => {
            if (op.id === operationId) {
                return { ...op, hours: suggestedTime };
            }
            return op;
        });
        return estimate;
    }
} 