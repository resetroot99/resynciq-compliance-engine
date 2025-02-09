import { useState, useEffect } from 'react';
import { fetchApi } from '../lib/api';
import { notificationService } from '../services/notification-service';

interface Estimate {
  id: string;
  status: string;
  compliance: number;
  createdAt: string;
}

export function useEstimates() {
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEstimates();
  }, []);

  async function fetchEstimates() {
    try {
      const data = await fetchApi<Estimate[]>('/estimates');
      setEstimates(data);
    } catch (error) {
      notificationService.notify(error.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  return { estimates, loading, refetch: fetchEstimates };
} 