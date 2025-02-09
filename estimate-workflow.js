class EstimateWorkflow {
    static async processNewEstimate(file) {
        try {
            UIState.setProcessingState('Analyzing estimate...');

            // Extract and validate data
            const extractedData = await EstimateProcessor.processNewEstimate(file);
            
            // Run AI analysis
            const analysis = await this.runCompleteAnalysis(extractedData);
            
            // Update UI with results
            await UIState.updateAllViews(extractedData, analysis);
            
            // Log for learning
            await this.logEstimateProcessing(extractedData, analysis);

            return {
                extractedData,
                analysis
            };
        } catch (error) {
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
            UIState.setProcessingState(`Finalizing estimate (${action})...`);

            const result = await EstimateService.processEstimate(estimateId, action);
            
            // Update queue
            await QueueService.updateQueueItem(estimateId, { status: action });
            
            // Log action
            await LearningFeedback.logAction({
                type: 'estimate_finalization',
                estimateId,
                action,
                timestamp: new Date().toISOString()
            });

            return result;
        } catch (error) {
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