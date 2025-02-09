import { useStore } from '../../store';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function ComplianceChart() {
  const { estimates } = useStore();

  // Process data for chart
  const data = {
    labels: estimates.slice(-30).map(est => new Date(est.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: 'Compliance Score',
        data: estimates.slice(-30).map(est => est.compliance.score * 100),
        fill: true,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Compliance Trend (Last 30 Days)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value: number) => `${value}%`,
        },
      },
    },
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <Line data={data} options={options} />
    </div>
  );
} 