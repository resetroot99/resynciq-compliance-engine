import React from 'react';
import { useEstimates } from '../hooks/useEstimates';
import { EstimateDetails } from './EstimateDetails';

export function EstimateList() {
  const { estimates, loading, refetch } = useEstimates();

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-48 bg-gray-200 rounded-lg"/>
        ))}
      </div>
    );
  }

  if (estimates.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No estimates found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {estimates.map(estimate => (
        <EstimateDetails key={estimate.id} estimate={estimate} />
      ))}
    </div>
  );
} 