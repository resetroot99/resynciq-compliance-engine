class AIAnalysisService {
    static async analyzeLaborRates(estimateData) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.AI_MODELS.LABOR_RATE}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AuthService.getToken()}`
                },
                body: JSON.stringify(estimateData)
            });

            if (!response.ok) {
                throw new Error('Labor rate analysis failed');
            }

            return await response.json();
        } catch (error) {
            ErrorHandler.showError(error);
            throw error;
        }
    }

    static async validateParts(partsData) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.AI_MODELS.PARTS_VALIDATION}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AuthService.getToken()}`
                },
                body: JSON.stringify(partsData)
            });

            if (!response.ok) {
                throw new Error('Parts validation failed');
            }

            return await response.json();
        } catch (error) {
            ErrorHandler.showError(error);
            throw error;
        }
    }

    static async analyzeOperations(operationsData) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.AI_MODELS.OPERATIONS}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AuthService.getToken()}`
                },
                body: JSON.stringify(operationsData)
            });

            if (!response.ok) {
                throw new Error('Operations analysis failed');
            }

            return await response.json();
        } catch (error) {
            ErrorHandler.showError(error);
            throw error;
        }
    }

    static async predictApproval(estimateData) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.AI_MODELS.PREDICTIVE_APPROVAL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AuthService.getToken()}`
                },
                body: JSON.stringify(estimateData)
            });

            if (!response.ok) {
                throw new Error('Approval prediction failed');
            }

            return await response.json();
        } catch (error) {
            ErrorHandler.showError(error);
            throw error;
        }
    }

    static formatAnalysisResults(results) {
        return {
            laborRates: this.formatLaborAnalysis(results.laborRates),
            parts: this.formatPartsAnalysis(results.parts),
            operations: this.formatOperationsAnalysis(results.operations),
            approval: this.formatApprovalPrediction(results.approval)
        };
    }

    static formatLaborAnalysis(laborData) {
        return `
Labor Rate Analysis:
-------------------
Current Rate: $${laborData.currentRate}/hr
Regional Average: $${laborData.regionalAverage}/hr
Confidence: ${laborData.confidence}%

Findings:
${laborData.findings.map(f => `• ${f}`).join('\n')}
        `.trim();
    }

    static formatPartsAnalysis(partsData) {
        return `
Parts Validation:
---------------
Total Parts: ${partsData.totalParts}
Validated: ${partsData.validatedCount}
Issues Found: ${partsData.issuesCount}

Discrepancies:
${partsData.discrepancies.map(d => `• ${d}`).join('\n')}
        `.trim();
    }

    static formatOperationsAnalysis(opsData) {
        return `
Operations Review:
----------------
Total Operations: ${opsData.totalOps}
Verified: ${opsData.verifiedCount}
Flagged: ${opsData.flaggedCount}

Issues:
${opsData.issues.map(i => `• ${i}`).join('\n')}
        `.trim();
    }

    static formatApprovalPrediction(predictionData) {
        return `
Approval Prediction:
------------------
Probability: ${predictionData.probability}%
Confidence: ${predictionData.confidence}%

Risk Factors:
${predictionData.riskFactors.map(r => `• ${r}`).join('\n')}
        `.trim();
    }
} 