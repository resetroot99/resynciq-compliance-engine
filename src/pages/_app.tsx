import { UserProvider } from '@auth0/nextjs-auth0';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import '../styles/globals.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </ErrorBoundary>
  );
} 