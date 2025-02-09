import { Layout } from '../components/Layout';
import { Dashboard } from '../components/Dashboard';
import { EstimateForm } from '../components/EstimateForm';
import { Notifications } from '../components/Notifications';
import { useUser } from '@auth0/nextjs-auth0';

export default function Home() {
  const { user, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;

  if (!user) {
    return (
      <Layout>
        <div className="text-center">
          <h1 className="text-4xl font-bold">Welcome to ReSyncIQ</h1>
          <p className="mt-4">Please log in to continue</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Dashboard userId={user.sub} />
      <div className="mt-8">
        <EstimateForm />
      </div>
      <Notifications />
    </Layout>
  );
} 