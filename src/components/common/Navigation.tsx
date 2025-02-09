import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navigation() {
  const router = useRouter();
  
  const isActive = (path: string) => router.pathname === path;
  
  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link 
              href="/"
              className={`${isActive('/') ? 'text-white' : 'text-gray-300'} hover:text-white px-3 py-2 rounded-md text-sm font-medium`}
            >
              Dashboard
            </Link>
            <Link 
              href="/estimates"
              className={`${isActive('/estimates') ? 'text-white' : 'text-gray-300'} hover:text-white px-3 py-2 rounded-md text-sm font-medium`}
            >
              Estimates
            </Link>
            <Link 
              href="/analytics"
              className={`${isActive('/analytics') ? 'text-white' : 'text-gray-300'} hover:text-white px-3 py-2 rounded-md text-sm font-medium`}
            >
              Analytics
            </Link>
            <Link 
              href="/settings"
              className={`${isActive('/settings') ? 'text-white' : 'text-gray-300'} hover:text-white px-3 py-2 rounded-md text-sm font-medium`}
            >
              Settings
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 