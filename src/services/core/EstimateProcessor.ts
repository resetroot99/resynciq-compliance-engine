import { ValidationService } from './ValidationService';
import { PhotoService } from './PhotoService';
import { ADASService } from './ADASService';

export class EstimateProcessor {
  constructor(
    private validationService = new ValidationService(),
    private photoService = new PhotoService(),
    private adasService = new ADASService()
  ) {}

  async process(estimateData: any) {
    // 1. Validate Estimate
    const validationResults = await this.validationService.validateEstimate(estimateData);

    // 2. Analyze Photos
    const photoAnalysis = await this.photoService.analyzePhotos(estimateData.photos);

    // 3. Check ADAS Requirements
    const adasRequirements = await this.adasService.checkRequirements(estimateData);

    // 4. Compile Results
    return {
      validationResults,
      photoAnalysis,
      adasRequirements
    };
  }
} 