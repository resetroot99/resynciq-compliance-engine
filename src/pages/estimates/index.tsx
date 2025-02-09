import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { EstimateList } from '../../components/estimates/EstimateList';
import { EstimateFilters } from '../../components/estimates/EstimateFilters';
import { UploadButton } from '../../components/estimates/UploadButton';
import { useStore } from '../../store';
import { useState } from 'react';

export default function Estimates() {
  const [isUploading, setIsUploading] = useState(false);
  const { filters, updateFilters } = useStore();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Estimates</h1>
          <UploadButton
            isUploading={isUploading}
            setIsUploading={setIsUploading}
          />
        </div>

        <EstimateFilters
          filters={filters}
          onChange={updateFilters}
        />

        <EstimateList />
      </div>
    </DashboardLayout>
  );
} 