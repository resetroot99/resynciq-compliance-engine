import { Analytics } from '../../types/analytics';
import { formatNumber, formatPercentage } from '../../utils/format';

interface Props {
  data: Analytics['overview'];
}

export default function OverviewCards({ data }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card
        title="Total Estimates"
        value={formatNumber(data.totalEstimates)}
        icon="📊"
      />
      <Card
        title="Compliance Score"
        value={formatPercentage(data.averageComplianceScore)}
        icon="✅"
      />
      <Card
        title="Processing Time"
        value={`${data.processingTime}s`}
        icon="⚡"
      />
      <Card
        title="Completion Rate"
        value={formatPercentage(
          data.estimatesByStatus.COMPLETED?.percentage || 0
        )}
        icon="🎯"
      />
    </div>
  );
}

function Card({ title, value, icon }: { title: string; value: string; icon: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
    </div>
  );
} 