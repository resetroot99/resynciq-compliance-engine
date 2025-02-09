import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Analytics } from '../../types/analytics';

interface Props {
  data: Analytics['compliance'];
}

export default function ComplianceChart({ data }: Props) {
  const chartData = useMemo(() => ({
    labels: data.trendData.map(d => d.month),
    datasets: [
      {
        label: 'Compliance Score',
        data: data.trendData.map(d => d.averageScore),
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.1
      }
    ]
  }), [data.trendData]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Compliance Trends</h2>
      <div className="h-64">
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                max: 100
              }
            }
          }}
        />
      </div>
      <div className="mt-6">
        <h3 className="text-md font-semibold mb-2">Common Issues</h3>
        <div className="space-y-2">
          {data.commonIssues.map((issue, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2 bg-gray-50 rounded"
            >
              <span className="flex items-center">
                {issue.severity === 'ERROR' ? '🔴' : '⚠️'} {issue.type}
              </span>
              <span className="text-sm text-gray-600">
                {issue.count} occurrences
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 