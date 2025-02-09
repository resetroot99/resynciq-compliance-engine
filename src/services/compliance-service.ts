import { fetchApi } from '../lib/api';
import { notificationService } from './notification-service';

interface ComplianceCheck {
  id: string;
  rule: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
}

interface ComplianceResult {
  score: number;
  checks: ComplianceCheck[];
  recommendations: string[];
}

export class ComplianceService {
  async checkCompliance(estimateId: string): Promise<ComplianceResult> {
    try {
      const result = await fetchApi<ComplianceResult>(`/compliance/${estimateId}`);
      
      if (result.score < 0.8) {
        notificationService.notify('Compliance issues detected', 'warning');
      }
      
      return result;
    } catch (error) {
      notificationService.notify('Failed to check compliance', 'error');
      throw error;
    }
  }

  async autoFix(estimateId: string): Promise<void> {
    try {
      await fetchApi(`/compliance/${estimateId}/fix`, { method: 'POST' });
      notificationService.notify('Auto-fix applied successfully', 'success');
    } catch (error) {
      notificationService.notify('Failed to apply auto-fix', 'error');
      throw error;
    }
  }
}

export const complianceService = new ComplianceService(); 