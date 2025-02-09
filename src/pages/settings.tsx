import { useState } from 'react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';
import ErrorBoundary from '../components/common/ErrorBoundary';

export default function Settings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoProcessing, setAutoProcessing] = useState(true);

  return (
    <ErrorBoundary>
      <ProtectedRoute>
        <DashboardLayout>
          <div className="px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
            
            <div className="mt-8 max-w-3xl">
              {/* General Settings */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">General Settings</h3>
                  
                  <div className="mt-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                        <p className="text-sm text-gray-500">Receive notifications for estimate updates</p>
                      </div>
                      <button
                        onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                        className={`${
                          notificationsEnabled ? 'bg-blue-600' : 'bg-gray-200'
                        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
                      >
                        <span
                          className={`${
                            notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                          } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Auto Processing</h4>
                        <p className="text-sm text-gray-500">Automatically process new estimates</p>
                      </div>
                      <button
                        onClick={() => setAutoProcessing(!autoProcessing)}
                        className={`${
                          autoProcessing ? 'bg-blue-600' : 'bg-gray-200'
                        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
                      >
                        <span
                          className={`${
                            autoProcessing ? 'translate-x-6' : 'translate-x-1'
                          } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* API Settings */}
              <div className="mt-8 bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">API Settings</h3>
                  
                  <div className="mt-6 space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">API Key</label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          type="text"
                          readOnly
                          value="sk_test_123456789"
                          className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-500"
                        />
                        <button className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                          Regenerate
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    </ErrorBoundary>
  );
} 