import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Navigation from '../common/Navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth0();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">ReSyncIQ</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {user?.email}
              </div>
              <button
                onClick={() => logout({ returnTo: window.location.origin })}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Navigation />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
      
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © 2024 ReSyncIQ. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
} 