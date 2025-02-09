import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Configure default styles
ChartJS.defaults.font.family = 'Inter var, sans-serif';
ChartJS.defaults.color = '#6B7280';
ChartJS.defaults.borderColor = '#E5E7EB'; 