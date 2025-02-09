import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Analytics } from '../../types/analytics';
import { formatNumber } from '../../utils/format';

interface Props {
  data: Analytics['vehicles'];
}

export default function VehicleStats({ data }: Props) {
  const chartData = useMemo(() => ({
    labels: data.yearDistribution.map(d => d.range),
    datasets: [{
      label: 'Vehicles by Year',
      data: data.yearDistribution.map(d => d.count),
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 1
    }]
  }), [data.yearDistribution]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Vehicle Age Distribution</h2>
        <div className="h-64">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1
                  }
                }
              }
            }}
          />
        </div>
        <div className="mt-4 text-center text-gray-600">
          Average Vehicle Age: {data.averageAge} years
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Popular Vehicle Models</h2>
        <div className="space-y-4">
          {data.popularVehicles.map((vehicle, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded"
            >
              <div>
                <span className="font-medium">{vehicle.make}</span>
                <span className="text-gray-500"> {vehicle.model}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {formatNumber(vehicle.count)} estimates
                </span>
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: index === 0 ? '#60A5FA' :
                      index === 1 ? '#34D399' : '#A78BFA'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 