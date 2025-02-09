import { useEffect, useRef } from 'react';

type MessageHandler = (data: any) => void;

export function useWebSocket(companyId: string, onMessage: MessageHandler) {
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Create WebSocket connection
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    ws.current = new WebSocket(wsUrl);

    // Subscribe to company updates
    ws.current.onopen = () => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({
          type: 'subscribe',
          companyId
        }));
      }
    };

    // Handle incoming messages
    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    };

    // Handle errors
    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Cleanup on unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [companyId, onMessage]);

  return ws.current;
} 