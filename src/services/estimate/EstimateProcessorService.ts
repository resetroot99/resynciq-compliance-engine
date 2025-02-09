import { ValidationService } from '../core/ValidationService';
import { PhotoService } from '../core/PhotoService';
import { ADASService } from '../core/ADASService';
import { LoggingService } from '../logging/LoggingService';
import { TelemetryService } from '../telemetry/TelemetryService';
import { NotificationService } from '../notification/NotificationService';
import { DatabaseService } from '../database/DatabaseService';
import { aiService } from '../ai/AIService';

export class EstimateProcessorService {
  private logger = LoggingService.getInstance();
  private telemetry = TelemetryService.getInstance();

  constructor(
    private validationService = new ValidationService(),
    private photoService = new PhotoService(),
    private adasService = new ADASService(),
    private notificationService = new NotificationService(),
    private dbService = DatabaseService.getInstance()
  ) {}

  async processEstimate(estimateData: any) {
    const processingStart = Date.now();

    try {
      this.telemetry.trackEvent('estimate_processing_started', { 
        estimateId: estimateData.id,
        timestamp: new Date().toISOString()
      });

      // AI-powered analysis
      const [estimateAnalysis, photoAnalysis, adasValidation] = await Promise.all([
        aiService.analyzeEstimate(estimateData),
        aiService.analyzePhotos(estimateData.photos),
        aiService.validateADAS(estimateData.vehicle)
      ]);

      // 1. Validate Estimate
      const validationResults = await this.validationService.validateEstimate(estimateData);

      // 2. Save processed estimate
      const savedEstimate = await this.dbService.saveEstimate({
        ...estimateData,
        validationResults,
        photoAnalysis,
        adasRequirements: adasValidation
      });

      // 5. Calculate processing duration
      const processingDuration = Date.now() - processingStart;

      // 6. Log and track successful processing
      this.logger.log({
        level: 'INFO',
        message: 'Estimate processed successfully',
        context: { 
          estimateId: estimateData.id,
          duration: processingDuration,
          validationStatus: validationResults.status,
          photoAnalysisStatus: photoAnalysis.status
        }
      });

      this.telemetry.trackEvent('estimate_processing_completed', { 
        estimateId: estimateData.id,
        duration: processingDuration
      });

      // 7. Notify relevant parties
      await this.notificationService.sendEstimateNotification(
        estimateData.id,
        'PROCESSED',
        {
          email: estimateData.userEmail,
          userId: estimateData.userId
        }
      );

      return savedEstimate;
    } catch (error) {
      // Log and track error
      this.logger.log({
        level: 'ERROR',
        message: 'Estimate processing failed',
        context: { 
          estimateId: estimateData.id,
          error: error.message
        }
      });

      this.telemetry.trackEvent('estimate_processing_failed', { 
        estimateId: estimateData.id,
        errorMessage: error.message
      });

      // Notify about processing failure
      await this.notificationService.sendEstimateNotification(
        estimateData.id,
        'PROCESSING_FAILED',
        {
          email: estimateData.userEmail,
          userId: estimateData.userId
        }
      );

      throw error;
    }
  }

  async getEstimate(estimateId: string) {
    try {
      this.telemetry.trackEvent('estimate_retrieval_started', { estimateId });

      const estimate = await this.dbService.getEstimate(estimateId);

      this.telemetry.trackEvent('estimate_retrieval_completed', { estimateId });

      return estimate;
    } catch (error) {
      this.logger.log({
        level: 'ERROR',
        message: 'Failed to retrieve estimate',
        context: { estimateId, error: error.message }
      });

      this.telemetry.trackEvent('estimate_retrieval_failed', { 
        estimateId,
        errorMessage: error.message
      });

      throw error;
    }
  }

  async processUpload(file: File | string, type: 'pdf' | 'ems') {
    try {
      // Step 1: Process the uploaded file
      const processedEstimate = await aiService.processEstimate(file, type);

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

  async processEstimateWithAI(estimateData: any) {
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

export const estimateProcessorService = new EstimateProcessorService(); 