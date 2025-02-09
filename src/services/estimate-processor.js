import { notificationService } from './notification-service';
import { OEMService } from './oem-service';
import { PartsService } from './parts-service';
import { PhotoValidationService } from './photo-validation-service';

export class EstimateProcessor {
  constructor() {
    this.oemService = new OEMService();
    this.partsService = new PartsService();
    this.photoService = new PhotoValidationService();
  }

  async processEstimate(estimateData) {
    const result = {
      compliance: {
        score: 0,
        issues: [],
        recommendations: []
      },
      pricing: {
        parts: [],
        labor: [],
        materials: [],
        total: 0
      },
      operations: {
        required: [],
        missing: [],
        invalid: []
      },
      photos: {
        required: [],
        missing: [],
        quality: []
      }
    };

    try {
      // Parallel processing for better performance
      const [
        complianceResult,
        pricingResult,
        operationsResult,
        photosResult
      ] = await Promise.all([
        this.validateCompliance(estimateData),
        this.checkPricing(estimateData),
        this.validateOperations(estimateData),
        this.verifyPhotos(estimateData)
      ]);

      // Merge results
      Object.assign(result.compliance, complianceResult);
      Object.assign(result.pricing, pricingResult);
      Object.assign(result.operations, operationsResult);
      Object.assign(result.photos, photosResult);

      // Calculate final compliance score
      result.compliance.score = this.calculateComplianceScore(result);

      return result;
    } catch (error) {
      notificationService.notify('Error processing estimate', 'error');
      throw error;
    }
  }

  async validateCompliance(data) {
    const drpRules = await this.getDRPRules(data.insurerId);
    const oemProcedures = await this.oemService.getProcedures(data.vehicleInfo);
    
    return {
      drpCompliance: this.checkDRPCompliance(data, drpRules),
      oemCompliance: this.checkOEMCompliance(data, oemProcedures),
      regulatoryCompliance: await this.checkRegulatoryCompliance(data)
    };
  }

  async checkPricing(data) {
    const partsResults = await this.partsService.validatePricing(data.parts);
    const laborRates = await this.validateLaborRates(data);
    
    return {
      parts: partsResults,
      labor: laborRates,
      materials: this.calculateMaterials(data),
      sublet: this.validateSublet(data)
    };
  }

  async validateOperations(data) {
    // Validate:
    // - Repair procedures
    // - Labor times
    // - Included operations
    // - Required operations
  }

  async verifyPhotos(data) {
    // Check:
    // - Required photos
    // - Photo quality
    // - Documentation completeness
    // - Damage verification
  }
}

export const estimateProcessor = new EstimateProcessor(); 