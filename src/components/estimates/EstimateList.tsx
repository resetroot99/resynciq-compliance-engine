import { useStore } from '../../store';
import { formatDate, formatPercentage } from '../../utils/format';
import Link from 'next/link';
import { CheckCircleIcon, XCircleIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { EstimateAnalysis } from '../../types/services';

export function EstimateList() {
  const { estimates, filters } = useStore();
  const [sortConfig, setSortConfig] = useState<{
    key: keyof typeof sortFunctions;
    direction: 'asc' | 'desc';
  }>({ key: 'date', direction: 'desc' });

  const sortFunctions = {
    date: (a: EstimateAnalysis, b: EstimateAnalysis) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    vehicle: (a: EstimateAnalysis, b: EstimateAnalysis) => 
      `${a.vehicleInfo.make} ${a.vehicleInfo.model}`.localeCompare(`${b.vehicleInfo.make} ${b.vehicleInfo.model}`),
    score: (a: EstimateAnalysis, b: EstimateAnalysis) => 
      b.compliance.score - a.compliance.score,
  };

  const filteredEstimates = estimates
    .filter(est => {
      if (filters.status.length && !filters.status.includes(est.status)) return false;
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        const vehicle = `${est.vehicleInfo.year} ${est.vehicleInfo.make} ${est.vehicleInfo.model}`.toLowerCase();
        if (!vehicle.includes(searchTerm)) return false;
      }
      const estDate = new Date(est.createdAt);
      if (estDate < filters.dateRange[0] || estDate > filters.dateRange[1]) return false;
      return true;
    })
    .sort((a, b) => {
      const sortFn = sortFunctions[sortConfig.key];
      return sortConfig.direction === 'asc' ? sortFn(a, b) : sortFn(b, a);
    });

  const handleSort = (key: keyof typeof sortFunctions) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const SortIcon = ({ columnKey }: { columnKey: keyof typeof sortFunctions }) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === 'asc' ? (
      <ChevronUpIcon className="h-5 w-5" />
    ) : (
      <ChevronDownIcon className="h-5 w-5" />
    );
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('vehicle')}
              >
                <div className="flex items-center">
                  Vehicle
                  <SortIcon columnKey="vehicle" />
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('score')}
              >
                <div className="flex items-center">
                  Compliance Score
                  <SortIcon columnKey="score" />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center">
                  Date
                  <SortIcon columnKey="date" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEstimates.map(estimate => (
              <tr key={estimate.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    href={`/estimates/${estimate.id}`}
                    className="text-sm font-medium text-gray-900 hover:text-blue-600"
                  >
                    {estimate.vehicleInfo.year} {estimate.vehicleInfo.make} {estimate.vehicleInfo.model}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <EstimateStatus status={estimate.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {estimate.compliance.score >= 0.8 ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    ) : (
                      <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                    )}
                    <span className="text-sm text-gray-900">
                      {formatPercentage(estimate.compliance.score)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(estimate.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EstimateStatus({ status }: { status: string }) {
  const statusStyles = {
    PROCESSING: 'bg-yellow-100 text-yellow-800',
    COMPLETED: 'bg-green-100 text-green-800',
    FAILED: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      statusStyles[status as keyof typeof statusStyles]
    }`}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
} 