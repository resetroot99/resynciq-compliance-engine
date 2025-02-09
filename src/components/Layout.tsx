import React from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import Link from 'next/link';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/">
                <a className="flex items-center">
                  <span className="text-xl font-bold">ReSyncIQ</span>
                </a>
              </Link>
            </div>
            <div className="flex items-center">
              {user ? (
                <Link href="/api/auth/logout">
                  <a className="text-gray-700">Logout</a>
                </Link>
              ) : (
                <Link href="/api/auth/login">
                  <a className="text-gray-700">Login</a>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4">{children}</main>
    </div>
  );
} 