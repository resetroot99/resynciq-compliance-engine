import { performanceMonitor } from '../services/performance/PerformanceMonitorService';

export class PerformanceUtil {
  static startMeasure(label: string) {
    performanceMonitor.startMeasure(label);
  }

  static endMeasure(label: string) {
    return performanceMonitor.endMeasure(label);
  }

  static measureAsync<T>(label: string, asyncFn: () => Promise<T>): Promise<T> {
    return performanceMonitor.measureAsync(label, asyncFn);
  }
} 