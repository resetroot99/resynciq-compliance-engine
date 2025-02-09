import express from 'express';
import { createServer } from 'http';
import next from 'next';
import { PrismaClient } from '@prisma/client';
import { initializeWebSocket } from '../lib/websocket';
import { startAnalyticsRefreshJob } from '../jobs/refreshAnalytics';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const prisma = new PrismaClient();

app.prepare().then(() => {
  const server = express();
  const httpServer = createServer(server);

  // API Routes
  server.use('/api', require('./api').default);

  // Next.js handler
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  // Initialize WebSocket
  initializeWebSocket(httpServer);

  // Start background jobs
  startAnalyticsRefreshJob();

  const port = process.env.PORT || 3000;
  httpServer.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
}); 