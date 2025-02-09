class EstimateProcessor {
    static async processNewEstimate(file) {
        try {
            // Validate file
            if (!ValidationService.validateFileType(file)) {
                throw new Error('Invalid file type');
            }

            // Extract data
            const extractedData = await this.extractData(file);
            
            // Validate extracted data
            const validation = ValidationService.validateEstimateData(extractedData);
            if (!validation.isValid) {
                throw new Error(`Data validation failed: ${validation.errors.join(', ')}`);
            }

            // Run AI analysis
            const analysis = await AIService.analyzeLaborRates(extractedData);
            const approvalPrediction = await PredictiveModel.getApprovalProbability(extractedData);
            
            // Check compliance
            const compliance = await ComplianceService.validateEstimate(extractedData);
            
            // Apply auto-corrections if confidence is high
            let processedData = extractedData;
            if (analysis.confidence >= CONFIG.AI_CONFIDENCE_THRESHOLD) {
                processedData = await AutoCorrection.applyCorrections(extractedData, analysis.corrections);
            }

            return {
                originalData: extractedData,
                processedData,
                analysis,
                approvalPrediction,
                compliance
            };
        } catch (error) {
            ErrorHandler.showError(error);
            throw error;
        }
    }

    static async extractData(file) {
        if (file.type === 'application/pdf') {
            return OCRService.extractFromPDF(file);
        } else if (file.name.endsWith('.ems')) {
            return OCRService.processEMS(file);
        }
        throw new Error('Unsupported file type');
    }

    static async updateEstimate(estimateId, updates) {
        try {
            // Get current estimate
            const currentEstimate = await EstimateService.getEstimate(estimateId);
            
            // Apply updates
            const updatedEstimate = {
                ...currentEstimate,
                ...updates,
                lastModified: new Date().toISOString()
            };

            // Validate updates
            const validation = ValidationService.validateEstimateData(updatedEstimate);
            if (!validation.isValid) {
                throw new Error(`Update validation failed: ${validation.errors.join(', ')}`);
            }

            // Save updates
            return await EstimateService.updateEstimate(estimateId, updatedEstimate);
        } catch (error) {
            ErrorHandler.showError(error);
            throw error;
        }
    }
} 