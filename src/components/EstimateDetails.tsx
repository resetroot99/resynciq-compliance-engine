import React from 'react';
import { formatDistance } from 'date-fns';

interface EstimateDetailsProps {
  estimate: {
    id: string;
    status: string;
    compliance: number;
    createdAt: string;
    vehicleInfo?: {
      make: string;
      model: string;
      year: number;
      vin: string;
    };
    issues?: Array<{
      id: string;
      message: string;
      severity: 'info' | 'warning' | 'error';
    }>;
  };
}

export function EstimateDetails({ estimate }: EstimateDetailsProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-medium">Estimate Details</h3>
          <p className="text-sm text-gray-500">
            Created {formatDistance(new Date(estimate.createdAt), new Date(), { addSuffix: true })}
          </p>
        </div>
        <div className="text-right">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
            ${estimate.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
              estimate.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'}`}>
            {estimate.status}
          </span>
        </div>
      </div>

      {estimate.vehicleInfo && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-500">Vehicle Information</h4>
          <div className="mt-2 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Make</p>
              <p className="font-medium">{estimate.vehicleInfo.make}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Model</p>
              <p className="font-medium">{estimate.vehicleInfo.model}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Year</p>
              <p className="font-medium">{estimate.vehicleInfo.year}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">VIN</p>
              <p className="font-medium">{estimate.vehicleInfo.vin}</p>
            </div>
          </div>
        </div>
      )}

      {estimate.issues && estimate.issues.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-500">Issues</h4>
          <div className="mt-2 space-y-2">
            {estimate.issues.map(issue => (
              <div
                key={issue.id}
                className={`p-3 rounded ${
                  issue.severity === 'error' ? 'bg-red-50 text-red-700' :
                  issue.severity === 'warning' ? 'bg-yellow-50 text-yellow-700' :
                  'bg-blue-50 text-blue-700'
                }`}
              >
                {issue.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 