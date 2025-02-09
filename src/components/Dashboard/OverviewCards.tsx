import { useStore } from '../../store';
import { formatNumber, formatPercentage } from '../../utils/format';
import {
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

export function OverviewCards() {
  const { estimates } = useStore();

  const stats = {
    totalEstimates: estimates.length,
    complianceRate: estimates.reduce((acc, est) => acc + (est.compliance.score || 0), 0) / estimates.length,
    pendingReview: estimates.filter(est => est.status === 'PROCESSING').length,
    averageProcessingTime: 120, // In seconds
  };

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Estimates"
        value={formatNumber(stats.totalEstimates)}
        icon={DocumentTextIcon}
        trend={+10}
      />
      <StatCard
        title="Compliance Rate"
        value={formatPercentage(stats.complianceRate)}
        icon={CheckCircleIcon}
        trend={+5}
      />
      <StatCard
        title="Pending Review"
        value={stats.pendingReview.toString()}
        icon={ExclamationCircleIcon}
        trend={-2}
      />
      <StatCard
        title="Avg. Processing Time"
        value={`${stats.averageProcessingTime}s`}
        icon={ClockIcon}
        trend={-15}
      />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<any>;
  trend: number;
}

function StatCard({ title, value, icon: Icon, trend }: StatCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{value}</div>
                <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                  trend > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {trend > 0 ? '+' : ''}{trend}%
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
} 