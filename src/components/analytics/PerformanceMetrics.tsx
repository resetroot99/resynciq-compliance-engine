import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Analytics } from '../../types/analytics';
import { formatPercentage } from '../../utils/format';

interface Props {
  data: Analytics['performance'];
}

export default function PerformanceMetrics({ data }: Props) {
  const volumeChartData = useMemo(() => ({
    labels: data.monthlyVolume.map(d => d.month),
    datasets: [{
      label: 'Monthly Estimates',
      data: data.monthlyVolume.map(d => d.count),
      borderColor: 'rgb(99, 102, 241)',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      fill: true,
      tension: 0.4
    }]
  }), [data.monthlyVolume]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Monthly Volume</h2>
          <div className="text-sm text-gray-600">
            Acceptance Rate: {formatPercentage(data.estimateAcceptanceRate)}
          </div>
        </div>
        <div className="h-64">
          <Line
            data={volumeChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 5
                  }
                }
              }
            }}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Team Performance</h2>
        <div className="space-y-4">
          {data.userPerformance.map((user, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium">{user.name}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    {user.role}
                  </span>
                </div>
                <span className="text-sm text-gray-600">
                  {user.estimateCount} estimates
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${user.averageScore}%` }}
                />
              </div>
              <div className="text-sm text-gray-600 text-right">
                {formatPercentage(user.averageScore)} avg. score
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 