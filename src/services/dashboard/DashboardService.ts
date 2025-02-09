import { AuthService } from '../core/AuthService';
import { DatabaseService } from '../database/DatabaseService';
import { TelemetryService } from '../telemetry/TelemetryService';
import { LoggingService } from '../logging/LoggingService';
import { aiService } from '../ai/AIService';

export interface DashboardMetrics {
  totalEstimates: number;
  complianceRate: number;
  pendingReviews: number;
  recentEstimates: any[];
}

export class DashboardService {
  private logger = LoggingService.getInstance();
  private telemetry = TelemetryService.getInstance();

  constructor(
    private authService = AuthService,
    private dbService = DatabaseService.getInstance()
  ) {}

  async initialize() {
    this.logger.log({ level: 'INFO', message: 'Dashboard service initialized' });
  }

  async shutdown() {
    this.logger.log({ level: 'INFO', message: 'Dashboard service shutdown' });
  }

  async getDashboardMetrics(userId: string): Promise<DashboardMetrics> {
    const metricsStart = Date.now();

    try {
      this.telemetry.trackEvent('dashboard_metrics_requested', { userId });

      // Verify user access
      const user = this.authService.getCurrentUser();
      if (!user || user.id !== userId) {
        throw new Error('Unauthorized access');
      }

      // Fetch estimates
      const estimates = await this.dbService.getEstimates(userId);

      // Calculate metrics
      const metrics = {
        totalEstimates: estimates.length,
        complianceRate: this.calculateComplianceRate(estimates),
        pendingReviews: this.countPendingReviews(estimates),
        recentEstimates: this.getRecentEstimates(estimates)
      };

      // Calculate metrics duration
      const metricsDuration = Date.now() - metricsStart;

      // Log and track successful metrics retrieval
      this.logger.log({
        level: 'INFO',
        message: 'Dashboard metrics retrieved successfully',
        context: { 
          userId,
          duration: metricsDuration,
          totalEstimates: metrics.totalEstimates
        }
      });

      this.telemetry.trackEvent('dashboard_metrics_retrieved', { 
        userId,
        duration: metricsDuration
      });

      return metrics;
    } catch (error) {
      // Log and track error
      this.logger.log({
        level: 'ERROR',
        message: 'Failed to retrieve dashboard metrics',
        context: { 
          userId,
          error: error.message
        }
      });

      this.telemetry.trackEvent('dashboard_metrics_failed', { 
        userId,
        errorMessage: error.message
      });

      throw error;
    }
  }

  private calculateComplianceRate(estimates: any[]): number {
    const compliantEstimates = estimates.filter(est => est.status === 'COMPLIANT');
    return estimates.length > 0 
      ? (compliantEstimates.length / estimates.length) * 100
      : 0;
  }

  private countPendingReviews(estimates: any[]): number {
    return estimates.filter(est => est.status === 'PENDING_REVIEW').length;
  }

  private getRecentEstimates(estimates: any[], count = 5): any[] {
    return estimates
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, count);
  }

  async getAIPoweredInsights(userId: string) {
    try {
      const insights = await aiService.getDashboardInsights(userId);
      return insights;
    } catch (error) {
      throw new Error(`AI-powered insights retrieval failed: ${error.message}`);
    }
  }

  async getContextualSuggestions(estimateId: string) {
    try {
      const suggestions = await aiService.getContextualSuggestions(estimateId);
      return suggestions;
    } catch (error) {
      throw new Error(`Contextual suggestions retrieval failed: ${error.message}`);
    }
  }
}

export const dashboardService = new DashboardService(); 