import { EstimateAnalysis } from '../types/services';

export const mockEstimate: EstimateAnalysis = {
  id: 'est_01HGXR2P4WNVB',
  status: 'COMPLETED',
  fileUrl: 'https://raw.githubusercontent.com/resetroot99/resynciq-compliance-engine/main/public/sample-estimate.pdf',
  vehicleInfo: {
    make: 'Toyota',
    model: 'Camry',
    year: 2022,
    vin: 'JT2BF22K1W0123456'
  },
  compliance: {
    score: 0.85,
    issues: [
      {
        ruleId: 'LABOR_RATE_001',
        message: 'Body labor rate ($85/hr) exceeds regional average ($72/hr) by 18%',
        severity: 'WARNING'
      },
      {
        ruleId: 'PARTS_OEM_002',
        message: 'Aftermarket front bumper specified without customer authorization',
        severity: 'ERROR'
      },
      {
        ruleId: 'BLEND_TIME_003',
        message: 'Paint blend time for right fender appears insufficient',
        severity: 'WARNING'
      }
    ]
  },
  aiAnalysis: {
    analysis: `Moderate front-end collision damage analysis:
    - Primary Impact: Front bumper, hood, and right fender
    - Structural Damage: Minor radiator support deformation
    - Required Parts: OEM hood, aftermarket bumper, right fender
    - Paint Work: Hood, right fender with adjacent panel blend
    - Labor Hours: 22.5 total (12.5 body, 10.0 paint)
    - Recommendations: Consider OEM bumper, verify structural measurements`,
    timestamp: new Date('2024-02-15T14:23:45Z').toISOString()
  },
  createdAt: new Date('2024-02-15T14:20:00Z').toISOString(),
  updatedAt: new Date('2024-02-15T14:25:00Z').toISOString()
};

export const mockEstimates: EstimateAnalysis[] = [
  mockEstimate,
  {
    ...mockEstimate,
    id: 'est_01HGXR2P4WNVC',
    status: 'PROCESSING',
    vehicleInfo: {
      make: 'Honda',
      model: 'Accord',
      year: 2023,
      vin: '1HGCV1F34NA123456'
    },
    createdAt: new Date('2024-02-15T15:30:00Z').toISOString(),
    updatedAt: new Date('2024-02-15T15:30:00Z').toISOString()
  },
  {
    ...mockEstimate,
    id: 'est_01HGXR2P4WNVD',
    status: 'COMPLETED',
    vehicleInfo: {
      make: 'Tesla',
      model: 'Model 3',
      year: 2024,
      vin: '5YJ3E1EA8PF123456'
    },
    compliance: {
      score: 0.92,
      issues: [
        {
          ruleId: 'CALIBRATION_001',
          message: 'ADAS calibration required but not included in estimate',
          severity: 'ERROR'
        }
      ]
    },
    aiAnalysis: {
      analysis: `Minor rear collision damage analysis:
      - Primary Impact: Rear bumper and trunk lid
      - Structural Damage: None detected
      - Required Parts: OEM rear bumper, OEM trunk lid
      - Paint Work: Rear bumper and trunk with quarter panel blend
      - Labor Hours: 18.0 total (8.0 body, 10.0 paint)
      - Special Notes: ADAS recalibration required for parking sensors`,
      timestamp: new Date('2024-02-14T09:15:00Z').toISOString()
    },
    createdAt: new Date('2024-02-14T09:10:00Z').toISOString(),
    updatedAt: new Date('2024-02-14T09:20:00Z').toISOString()
  }
]; 