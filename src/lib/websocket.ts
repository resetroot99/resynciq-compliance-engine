import { Server as HTTPServer } from 'http';
import { Server as WebSocketServer } from 'ws';
import { Analytics } from '../types/analytics';

let wss: WebSocketServer;

export function initializeWebSocket(server: HTTPServer) {
  wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === 'subscribe' && data.companyId) {
          // @ts-ignore
          ws.companyId = data.companyId;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
  });
}

export function broadcastAnalyticsUpdate(companyId: string, analytics: Analytics) {
  if (!wss) return;

  wss.clients.forEach((client) => {
    // @ts-ignore
    if (client.companyId === companyId) {
      client.send(JSON.stringify({
        type: 'analytics_update',
        data: analytics
      }));
    }
  });
} 