import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useUser } from '@auth0/nextjs-auth0';
import { LoadingScreen } from '../common/LoadingScreen';
import { useRouter } from 'next/router';

interface Props {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: Props) {
  const { user, isLoading } = useUser();
  const router = useRouter();

  if (isLoading) return <LoadingScreen />;
  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
} 