import { useUser } from '@auth0/nextjs-auth0';
import Link from 'next/link';
import { UserMenu } from './UserMenu';
import { NotificationsMenu } from './NotificationsMenu';
import { SearchBar } from './SearchBar';

export function Header() {
  const { user } = useUser();

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/dashboard" className="flex items-center">
              <img 
                className="h-8 w-auto" 
                src="https://raw.githubusercontent.com/resetroot99/resynciq-compliance-engine/main/public/logo.svg" 
                alt="ReSyncIQ"
              />
            </Link>
            <SearchBar />
          </div>
          <div className="flex items-center gap-4">
            <NotificationsMenu />
            <UserMenu user={user} />
          </div>
        </div>
      </div>
    </header>
  );
} 