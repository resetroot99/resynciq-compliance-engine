import { useEffect, useCallback } from 'react';

export function useAutoRefresh(callback: () => void, interval = 300000) { // 5 minutes
  useEffect(() => {
    const timer = setInterval(callback, interval);
    return () => clearInterval(timer);
  }, [callback, interval]);
} 