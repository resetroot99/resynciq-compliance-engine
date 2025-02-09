export const mockEstimates = [
  {
    id: 'est_1',
    status: 'completed',
    uploadedAt: '2024-02-20T10:30:00Z',
    vehicleInfo: {
      make: 'Toyota',
      model: 'Camry',
      year: 2022,
      vin: '1HGCM82633A123456'
    },
    aiAnalysis: {
      damageDetected: true,
      damageLocations: ['front_bumper', 'hood', 'left_headlight'],
      severityScore: 0.85,
      recommendedRepairs: [
        { part: 'front_bumper', action: 'replace', confidence: 0.95 },
        { part: 'hood', action: 'repair', confidence: 0.82 },
        { part: 'left_headlight', action: 'replace', confidence: 0.98 }
      ],
      estimatedCosts: {
        parts: 2450.75,
        labor: 1280.00,
        paint: 850.00,
        total: 4580.75
      },
      complianceIssues: [
        {
          type: 'labor_rate',
          severity: 'warning',
          description: 'Labor rate exceeds regional average by 8%',
          recommendation: 'Review and adjust labor rates to match regional standards'
        }
      ],
      photoAnalysis: {
        qualityScore: 0.92,
        missingAngles: [],
        blurryImages: false,
        lightingIssues: false
      }
    },
    insuranceInfo: {
      provider: 'State Farm',
      claimNumber: 'SF-2024-123456',
      adjuster: 'Jane Smith',
      policyNumber: 'POL-987654'
    },
    timeline: [
      { timestamp: '2024-02-20T10:30:00Z', event: 'Estimate Uploaded' },
      { timestamp: '2024-02-20T10:30:05Z', event: 'AI Analysis Started' },
      { timestamp: '2024-02-20T10:30:45Z', event: 'AI Analysis Completed' },
      { timestamp: '2024-02-20T10:31:00Z', event: 'Compliance Check Completed' }
    ]
  },
  {
    id: 'est_2',
    status: 'processing',
    uploadedAt: '2024-02-19T15:45:00Z',
    aiAnalysis: null
  },
  {
    id: 'est_3',
    status: 'completed',
    uploadedAt: '2024-02-18T09:15:00Z',
    aiAnalysis: {
      damageDetected: true,
      damageLocations: ['rear_quarter_panel', 'tail_light'],
      severityScore: 0.65,
      recommendedRepairs: ['repair_quarter_panel', 'replace_tail_light']
    }
  }
];

export const mockUser = {
  name: 'John Smith',
  email: 'john@example.com',
  picture: 'https://via.placeholder.com/40',
  role: 'Senior Estimator',
  company: 'Premier Auto Body',
  preferences: {
    notifications: true,
    autoProcessing: true,
    darkMode: false
  },
  stats: {
    estimatesProcessed: 1247,
    averageAccuracy: 0.96,
    responseTime: 1.1
  }
};

export const mockAnalytics = {
  complianceScore: 98.5,
  estimatesProcessed: 147,
  processingTime: 1.2,
  monthlyTrends: {
    complianceScores: [95, 96, 97, 96.5, 98, 98.5],
    processingVolumes: [120, 135, 142, 138, 145, 147],
    averageProcessingTimes: [1.8, 1.6, 1.5, 1.4, 1.3, 1.2]
  },
  commonIssues: [
    { name: 'Labor Rate Discrepancy', percentage: 32, trend: 'decreasing' },
    { name: 'Missing Photos', percentage: 28, trend: 'stable' },
    { name: 'Parts Pricing', percentage: 24, trend: 'increasing' },
    { name: 'Documentation', percentage: 18, trend: 'stable' },
    { name: 'Paint Time', percentage: 15, trend: 'decreasing' }
  ],
  vehicleStats: {
    topMakes: [
      { make: 'Toyota', count: 45 },
      { make: 'Honda', count: 38 },
      { make: 'Ford', count: 32 }
    ],
    averageVehicleAge: 3.5,
    mostCommonRepairs: [
      { repair: 'Bumper Replacement', count: 78 },
      { repair: 'Panel Repair', count: 65 },
      { repair: 'Paint Work', count: 112 }
    ]
  },
  performanceMetrics: {
    aiAccuracy: 0.96,
    averageResponseTime: 1.2,
    userSatisfaction: 0.94,
    estimateAcceptanceRate: 0.89
  }
};

export const mockComplianceRules = [
  {
    id: 'rule_1',
    name: 'Labor Rate Compliance',
    description: 'Ensures labor rates fall within acceptable regional ranges',
    category: 'Pricing',
    severity: 'warning',
    parameters: {
      maxDeviation: 0.15,
      regionalRates: {
        bodywork: 65,
        paint: 72,
        mechanical: 85
      }
    }
  },
  // ... more rules
]; 