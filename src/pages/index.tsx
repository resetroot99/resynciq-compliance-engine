import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@auth0/nextjs-auth0';
import { LoadingScreen } from '../components/common/LoadingScreen';

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading) {
      const basePath = process.env.NODE_ENV === 'production' ? '/resynciq-compliance-engine' : '';
      const redirectPath = router.query.redirect || '/dashboard';
      router.replace(user ? `${basePath}${redirectPath}` : `${basePath}/login?redirect=${redirectPath}`);
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoadingScreen />
    </div>
  );
} 