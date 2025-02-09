import { useState, useEffect } from 'react';
import { useMockAuth } from '../utils/mockAuth';
import DashboardLayout from '../components/layouts/DashboardLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { Estimate } from '../types';
import { getEstimates } from '../utils/mockApi';
import Link from 'next/link';

export default function Estimates() {
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useMockAuth();

  useEffect(() => {
    if (isAuthenticated) {
      getEstimates()
        .then(data => {
          setEstimates(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [isAuthenticated]);

  return (
    <ErrorBoundary>
      <ProtectedRoute>
        <DashboardLayout>
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className="text-2xl font-semibold text-gray-900">Estimates</h1>
                <p className="mt-2 text-sm text-gray-700">
                  A list of all estimates uploaded for compliance validation.
                </p>
              </div>
            </div>
            
            {loading ? (
              <div className="mt-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="mt-8 text-red-600">{error}</div>
            ) : (
              <div className="mt-8 flex flex-col">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead>
                        <tr>
                          <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">ID</th>
                          <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                          <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Uploaded</th>
                          <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {estimates.map((estimate) => (
                          <tr key={estimate.id}>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{estimate.id}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                estimate.status === 'completed' ? 'bg-green-100 text-green-800' :
                                estimate.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {estimate.status}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {new Date(estimate.uploadedAt).toLocaleDateString()}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <Link
                                href={`/estimates/${estimate.id}`}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                View Details
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    </ErrorBoundary>
  );
} 