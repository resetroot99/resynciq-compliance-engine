import { aiService } from '../services/ai/AIService';
import { insurerService } from '../services/insurer/InsurerService';
import config from '../config';

class EstimateProcessor {
    async processEstimate(estimateData, insurerId) {
        try {
            // 1. Initial AI Analysis
            const analysis = await aiService.analyzeEstimate(estimateData);

            // 2. Apply Insurer-Specific Rules
            const insurerRules = await insurerService.getRules(insurerId);
            const complianceResult = await this.validateCompliance(estimateData, insurerRules);

            // 3. Auto-Corrections
            let correctedEstimate = estimateData;
            if (analysis.confidence >= config.aiService.autoCorrectThreshold) {
                correctedEstimate = await this.applyAutoCorrections(estimateData, insurerRules);
            }

            // 4. Predictive Approval Modeling
            const approvalPrediction = await aiService.predictApproval(correctedEstimate, insurerId);

            // 5. Generate Recommendations
            const recommendations = await this.generateRecommendations(
                correctedEstimate,
                complianceResult,
                approvalPrediction
            );

            return {
                originalEstimate: estimateData,
                correctedEstimate,
                analysis,
                complianceResult,
                approvalPrediction,
                recommendations,
                autoCorrections: this.getAppliedCorrections(estimateData, correctedEstimate)
            };
        } catch (error) {
            console.error('Estimate processing failed:', error);
            throw error;
        }
    }

    async applyAutoCorrections(estimate, rules) {
        const corrections = await aiService.generateCorrections(estimate, rules);
        return corrections.reduce((correctedEstimate, correction) => {
            return this.applyCorrection(correctedEstimate, correction);
        }, estimate);
    }

    async generateRecommendations(estimate, compliance, prediction) {
        const recommendations = [];

        // Add high-impact recommendations first
        if (prediction.approvalProbability < config.insurers[estimate.insurerId].approvalThreshold) {
            recommendations.push(...await this.getApprovalOptimizations(estimate));
        }

        // Add compliance-based recommendations
        recommendations.push(...this.getComplianceRecommendations(compliance));

        return recommendations.sort((a, b) => b.impact - a.impact);
    }

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

    async processEstimateWithAI(estimateData) {
        try {
            // Step 1: Process the estimate with AI
            const processedEstimate = await aiService.processEstimate(estimateData);

            // Step 2: Get compliance check
            const compliance = await aiService.getComplianceCheck(processedEstimate.id);

            // Step 3: Get approval prediction
            const prediction = await aiService.getApprovalPrediction(processedEstimate.id);

            // Step 4: Apply auto-corrections
            const correctedEstimate = await aiService.applyAutoCorrections(processedEstimate.id);

            // Step 5: Get review recommendations
            const recommendations = await aiService.getReviewRecommendations(processedEstimate.id);

            return {
                ...processedEstimate,
                compliance,
                prediction,
                corrections: correctedEstimate,
                recommendations
            };
        } catch (error) {
            // ... error handling ...
        }
    }
}

export const estimateProcessor = new EstimateProcessor(); 