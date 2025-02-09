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

export interface User {
  id: string;
  auth0Id: string;
  email: string;
  name?: string;
  role: 'ADMIN' | 'MANAGER' | 'ESTIMATOR' | 'AUDITOR';
  companyId?: string;
}

export interface Estimate {
  id: string;
  status: 'UPLOADED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'PENDING_REVIEW';
  compliance: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  companyId: string;
  vehicleInfo?: VehicleInfo;
  issues?: ComplianceIssue[];
}

export interface VehicleInfo {
  make: string;
  model: string;
  year: number;
  vin: string;
}

export interface ComplianceIssue {
  id: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
  ruleId: string;
}

export interface DashboardMetrics {
  totalEstimates: number;
  complianceRate: number;
  pendingReviews: number;
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