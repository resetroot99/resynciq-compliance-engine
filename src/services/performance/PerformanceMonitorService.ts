export class PerformanceMonitorService {
  private static instance: PerformanceMonitorService;
  private performanceEntries: Map<string, number> = new Map();

  private constructor() {}

  static getInstance(): PerformanceMonitorService {
    if (!this.instance) {
      this.instance = new PerformanceMonitorService();
    }
    return this.instance;
  }

  startMeasure(label: string) {
    this.performanceEntries.set(label, performance.now());
  }

  endMeasure(label: string) {
    const startTime = this.performanceEntries.get(label);
    if (startTime) {
      const duration = performance.now() - startTime;
      console.log(`Performance: ${label} took ${duration}ms`);
      this.performanceEntries.delete(label);
      return duration;
    }
    return null;
  }

  measureAsync<T>(label: string, asyncFn: () => Promise<T>): Promise<T> {
    this.startMeasure(label);
    return asyncFn().finally(() => {
      this.endMeasure(label);
    });
  }
}

export const performanceMonitor = PerformanceMonitorService.getInstance(); 