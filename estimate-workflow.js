class EstimateWorkflow {
    static async processNewEstimate(file) {
        try {
            UIState.setProcessingState('Uploading and processing estimate...');
            
            // Upload file and extract data using OCR service
            const extractedData = await OCRService.extractFromPDF(file);
            
            // Run AI analysis via predictive model service
            const analysis = await PredictiveModelService.analyzeEstimate(extractedData);
            
            // Validate the estimate data
            const validation = ValidationService.validateEstimateData(extractedData);
            if (!validation.isValid) {
                throw new Error('Validation failed: ' + validation.errors.join(', '));
            }
            
            // Store the uploaded estimate together with its metadata
            const storageResponse = await EstimateStorageService.storeEstimate(file, {
                extractedData,
                timestamp: new Date().toISOString()
            });
            
            // Refresh the uploaded estimates queue
            await QueueService.refreshQueue && QueueService.refreshQueue();
            
            UIState.clearProcessingState();
            return { extractedData, analysis, storageResponse };
        } catch (error) {
            UIState.clearProcessingState();
            ErrorHandler.showError(error);
            throw error;
        }
    }

    static async runCompleteAnalysis(estimateData) {
        const [
            laborAnalysis,
            partsValidation,
            operationsAnalysis,
            approvalPrediction,
            complianceCheck
        ] = await Promise.all([
            AIAnalysisService.analyzeLaborRates(estimateData),
            AIAnalysisService.validateParts(estimateData.parts),
            AIAnalysisService.analyzeOperations(estimateData.operations),
            AIAnalysisService.predictApproval(estimateData),
            ComplianceService.validateEstimate(estimateData)
        ]);

        return {
            laborAnalysis,
            partsValidation,
            operationsAnalysis,
            approvalPrediction,
            complianceCheck
        };
    }

    static async applyRecommendations(estimateId, recommendations) {
        try {
            UIState.setProcessingState('Applying recommendations...');

            // Get current estimate
            const currentEstimate = await EstimateService.getEstimate(estimateId);
            
            // Apply corrections
            const correctedEstimate = await AutoCorrection.applyCorrections(
                currentEstimate,
                recommendations
            );

            // Rerun analysis
            const newAnalysis = await this.runCompleteAnalysis(correctedEstimate);
            
            // Update UI
            await UIState.updateAllViews(correctedEstimate, newAnalysis);
            
            // Log changes
            await this.logCorrections(estimateId, recommendations, newAnalysis);

            return {
                correctedEstimate,
                newAnalysis
            };
        } catch (error) {
            ErrorHandler.showError(error);
            throw error;
        }
    }

    static async finalizeEstimate(estimateId, action) {
        try {
            UIState.setProcessingState(`Processing ${action}...`);
            const response = await fetch(`${CONFIG.API_BASE_URL}/estimates/${estimateId}/finalize`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AuthService.getToken()}`
                },
                body: JSON.stringify({ action })
            });
            if (!response.ok) {
                throw new Error('Failed to finalize estimate');
            }
            UIState.clearProcessingState();
            return response.json();
        } catch (error) {
            UIState.clearProcessingState();
            ErrorHandler.showError(error);
            throw error;
        }
    }

    static async logEstimateProcessing(data, analysis) {
        if (!FEATURES.LEARNING_FEEDBACK) return;

        await LearningFeedback.logAction({
            type: 'estimate_processing',
            estimateId: data.id,
            analysisResults: {
                laborConfidence: analysis.laborAnalysis.confidence,
                partsValidation: analysis.partsValidation.validatedCount,
                approvalProbability: analysis.approvalPrediction.probability
            },
            timestamp: new Date().toISOString()
        });
    }

    static async logCorrections(estimateId, recommendations, newAnalysis) {
        if (!FEATURES.LEARNING_FEEDBACK) return;

        await LearningFeedback.logAction({
            type: 'auto_corrections',
            estimateId,
            recommendations,
            newAnalysisResults: {
                laborConfidence: newAnalysis.laborAnalysis.confidence,
                approvalProbability: newAnalysis.approvalPrediction.probability
            },
            timestamp: new Date().toISOString()
        });
    }
} 