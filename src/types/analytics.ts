export interface Analytics {
  overview: {
    totalEstimates: number;
    averageComplianceScore: number;
    estimatesByStatus: Record<string, StatusCount>;
    processingTime: number;
  };
  compliance: {
    commonIssues: ComplianceIssue[];
    trendData: ComplianceTrend[];
    riskAreas: RiskArea[];
  };
  vehicles: VehicleAnalytics;
  performance: PerformanceMetrics;
}

interface StatusCount {
  count: number;
  percentage: number;
}

interface ComplianceIssue {
  type: string;
  severity: 'INFO' | 'WARNING' | 'ERROR';
  count: number;
}

interface ComplianceTrend {
  month: string;
  averageScore: number;
}

interface RiskArea {
  type: string;
  count: number;
  severity: 'WARNING' | 'ERROR';
  impact: number;
  riskScore: number;
}

interface VehicleAnalytics {
  popularVehicles: PopularVehicle[];
  averageAge: number;
  yearDistribution: YearDistribution[];
}

interface PopularVehicle {
  make: string;
  model: string;
  count: number;
}

interface YearDistribution {
  range: string;
  count: number;
}

interface PerformanceMetrics {
  userPerformance: UserPerformance[];
  monthlyVolume: MonthlyVolume[];
  estimateAcceptanceRate: number;
}

interface UserPerformance {
  name: string;
  role: string;
  estimateCount: number;
  averageScore: number;
}

interface MonthlyVolume {
  month: string;
  count: number;
} 