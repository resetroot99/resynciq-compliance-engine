import { useEffect, useState, useCallback } from 'react';
import { Analytics } from '../../types/analytics';
import OverviewCards from './OverviewCards';
import ComplianceChart from './ComplianceChart';
import VehicleStats from './VehicleStats';
import PerformanceMetrics from './PerformanceMetrics';
import { useWebSocket } from '../../hooks/useWebSocket';
import { exportAnalytics } from '../../utils/export';
import DateRangeSelector from './DateRangeSelector';
import PrintLayout from './PrintLayout';
import LoadingSkeleton from './LoadingSkeleton';
import ErrorBoundary from './ErrorBoundary';
import { useAutoRefresh } from '../../hooks/useAutoRefresh';
import { RefreshIcon } from '@heroicons/react/outline';

export default function AnalyticsDashboard({ companyId }: { companyId: string }) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    end: new Date()
  });
  const [refreshing, setRefreshing] = useState(false);

  useWebSocket(companyId, (data) => {
    if (data.type === 'analytics_update') {
      setAnalytics(data.data);
    }
  });

  const fetchAnalytics = useCallback(async () => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/analytics?' + new URLSearchParams({
        start: dateRange.start.toISOString(),
        end: dateRange.end.toISOString()
      }));
      if (!response.ok) throw new Error('Failed to fetch analytics');
      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      setError('Failed to load analytics');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  useAutoRefresh(fetchAnalytics);

  const handleExport = async (format: 'pdf' | 'csv' | 'excel') => {
    if (!analytics) return;
    await exportAnalytics(analytics, format);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <LoadingSkeleton />;
  if (error) return <div>Error: {error}</div>;
  if (!analytics) return <div>No data available</div>;

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={fetchAnalytics}
              className={`p-2 rounded-full hover:bg-gray-100 ${
                refreshing ? 'animate-spin' : ''
              }`}
              disabled={refreshing}
              title="Refresh data"
            >
              <RefreshIcon className="h-5 w-5" />
            </button>
            <button
              onClick={handlePrint}
              className="btn btn-secondary"
            >
              Print Report
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="btn btn-secondary"
            >
              Export PDF
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="btn btn-secondary"
            >
              Export CSV
            </button>
            <button
              onClick={() => handleExport('excel')}
              className="btn btn-secondary"
            >
              Export Excel
            </button>
          </div>
        </div>

        <DateRangeSelector onRangeChange={setDateRange} />

        <OverviewCards data={analytics.overview} />
        <ComplianceChart data={analytics.compliance} />
        <VehicleStats data={analytics.vehicles} />
        <PerformanceMetrics data={analytics.performance} />

        <PrintLayout data={analytics} dateRange={dateRange} />
      </div>
    </ErrorBoundary>
  );
} 