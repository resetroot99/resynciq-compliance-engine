import { EstimateProcessor } from './EstimateProcessor';
import { NotificationService } from './NotificationService';
import { ValidationService } from './ValidationService';
import { PhotoService } from './PhotoService';
import { ADASService } from './ADASService';

export class ServiceManager {
  private static instance: ServiceManager;
  
  private constructor(
    private estimateProcessor: EstimateProcessor,
    private notificationService: NotificationService,
    private validationService: ValidationService,
    private photoService: PhotoService,
    private adasService: ADASService
  ) {}

  static getInstance(): ServiceManager {
    if (!ServiceManager.instance) {
      ServiceManager.instance = new ServiceManager(
        new EstimateProcessor(),
        new NotificationService(),
        new ValidationService(),
        new PhotoService(),
        new ADASService()
      );
    }
    return ServiceManager.instance;
  }

  async processEstimate(estimateData: any) {
    try {
      // 1. Initial Validation
      await this.validationService.validateEstimate(estimateData);

      // 2. Photo Analysis
      const photoAnalysis = await this.photoService.analyzePhotos(estimateData.photos);

      // 3. ADAS Requirements
      const adasRequirements = await this.adasService.checkRequirements(estimateData);

      // 4. Process Estimate
      const result = await this.estimateProcessor.process({
        ...estimateData,
        photoAnalysis,
        adasRequirements
      });

      // 5. Notify relevant parties
      await this.notificationService.notifyProcessComplete(result);

      return result;
    } catch (error) {
      this.notificationService.notifyError(error);
      throw error;
    }
  }
} 