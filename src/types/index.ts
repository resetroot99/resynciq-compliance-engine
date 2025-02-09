export interface EstimateData {
    id: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserData {
    id: string;
    role: 'admin' | 'user' | 'technician';
    permissions: string[];
}

export interface AIAnalysisResult {
    confidence: number;
    recommendations: string[];
    compliance: {
        score: number;
        issues: string[];
    };
}

export interface ServiceResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface Estimate {
  id: string;
  status: 'uploaded' | 'processing' | 'processed' | 'failed';
  uploadedAt: string;
  aiAnalysis?: {
    damageDetected: boolean;
    damageLocations: string[];
    severityScore: number;
    recommendedRepairs: string[];
  };
}

export interface ComplianceResult {
  compliant: boolean;
  score: number;
  issues: Array<{
    title: string;
    description: string;
    severity: 'warning' | 'error';
  }>;
  validatedAt: string;
} 