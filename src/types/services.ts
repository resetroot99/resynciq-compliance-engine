export interface VehicleInfo {
  make: string;
  model: string;
  year: number;
  vin: string;
}

export interface ComplianceIssue {
  ruleId: string;
  message: string;
  severity: 'INFO' | 'WARNING' | 'ERROR';
}

export interface ComplianceCheck {
  score: number;
  issues: ComplianceIssue[];
}

export interface EstimateAnalysis {
  id: string;
  status: 'UPLOADED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  fileUrl: string;
  vehicleInfo: VehicleInfo;
  compliance: ComplianceCheck;
  aiAnalysis: {
    analysis: string;
    timestamp: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AIAnalysisResult {
  vehicleInfo: VehicleInfo;
  damageAnalysis: DamageAnalysis;
  costBreakdown: CostBreakdown;
  confidence: number;
}

export interface DamageAnalysis {
  locations: string[];
  severity: number;
  recommendations: string[];
}

export interface CostBreakdown {
  parts: number;
  labor: number;
  paint: number;
  total: number;
} 