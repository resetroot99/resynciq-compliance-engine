import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { OverviewCards } from '../../components/dashboard/OverviewCards';
import { RecentEstimates } from '../../components/dashboard/RecentEstimates';
import { ComplianceChart } from '../../components/dashboard/ComplianceChart';
import { TeamActivity } from '../../components/dashboard/TeamActivity';
import { useUser } from '@auth0/nextjs-auth0';
import { useEffect } from 'react';
import { useStore } from '../../store';
import { fetchDashboardData } from '../../services/dashboardService';

export default function Dashboard() {
  const { user } = useUser();
  const { setEstimates } = useStore();

  useEffect(() => {
    if (user) {
      fetchDashboardData().then(setEstimates);
    }
  }, [user, setEstimates]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        </div>

        <OverviewCards />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ComplianceChart />
          <TeamActivity />
        </div>

        <RecentEstimates />
      </div>
    </DashboardLayout>
  );
} 