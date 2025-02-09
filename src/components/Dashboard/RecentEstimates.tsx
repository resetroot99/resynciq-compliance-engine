import { useStore } from '../../store';
import { formatDate, formatPercentage } from '../../utils/format';
import Link from 'next/link';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

export function RecentEstimates() {
  const { estimates } = useStore();
  const recentEstimates = estimates.slice(0, 5);

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Recent Estimates</h3>
        <Link
          href="/estimates"
          className="text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          View all
        </Link>
      </div>
      <div className="border-t border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Compliance Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentEstimates.map((estimate) => (
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