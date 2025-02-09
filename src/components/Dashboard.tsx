import React, { useEffect, useState } from 'react';
import { EstimateForm } from './EstimateForm';
import { EstimateList } from './EstimateList';
import { complianceService } from '../services/compliance-service';
import { ServiceManager } from '../services/core/ServiceManager';

interface DashboardProps {
  userId: string;
}

interface DashboardMetrics {
  totalEstimates: number;
  complianceRate: number;
  pendingReviews: number;
}

export function Dashboard({ userId }: DashboardProps) {
  const [metrics, setMetrics] = useState({
    totalEstimates: 0,
    complianceRate: 0,
    pendingReviews: 0
  });

  const [estimates, setEstimates] = useState([]);

  useEffect(() => {
    fetchDashboardData(userId);
    async function fetchEstimates() {
      const serviceManager = ServiceManager.getInstance();
      const estimatesData = await serviceManager.getEstimates();
      setEstimates(estimatesData);
    }
    fetchEstimates();
  }, [userId]);

  const fetchDashboardData = async (userId: string) => {
    try {
      // Add API call to fetch dashboard data
      const response = await fetch(`/api/dashboard/${userId}`);
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-3 gap-6">
        <MetricCard title="Total Estimates" value={metrics.totalEstimates} />
        <MetricCard title="Compliance Rate" value={`${metrics.complianceRate}%`} />
        <MetricCard title="Pending Reviews" value={metrics.pendingReviews} />
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Upload New Estimate</h2>
        <EstimateForm />
      </div>

      <div>
        <h2 className="text-lg font-medium mb-4">Recent Estimates</h2>
        <EstimateList />
      </div>

      <div>
        <h2 className="text-lg font-medium mb-4">All Estimates</h2>
        <ul>
          {estimates.map((estimate) => (
            <li key={estimate.id}>
              {estimate.vehicle.make} {estimate.vehicle.model} - {estimate.status}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: number | string;
}

function MetricCard({ title, value }: MetricCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
} 