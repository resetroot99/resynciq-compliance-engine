import { useRouter } from 'next/router';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { EstimateDetails } from '../../components/estimates/EstimateDetails';
import { ComplianceResults } from '../../components/estimates/ComplianceResults';
import { AIAnalysis } from '../../components/estimates/AIAnalysis';
import { useStore } from '../../store';
import { useEffect } from 'react';
import { fetchEstimateById } from '../../services/estimateService';

export default function EstimateDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { selectedEstimate, setSelectedEstimate } = useStore();

  useEffect(() => {
    if (id && typeof id === 'string') {
      fetchEstimateById(id).then(setSelectedEstimate);
    }
  }, [id, setSelectedEstimate]);

  if (!selectedEstimate) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <EstimateDetails estimate={selectedEstimate} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ComplianceResults results={selectedEstimate.compliance} />
          <AIAnalysis analysis={selectedEstimate.aiAnalysis} />
        </div>
      </div>
    </DashboardLayout>
  );
} 