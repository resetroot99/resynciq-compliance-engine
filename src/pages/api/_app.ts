import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { initializeWebSocket } from '../../lib/websocket';
import { startAnalyticsRefreshJob } from '../../jobs/refreshAnalytics';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  initializeWebSocket(server);
  startAnalyticsRefreshJob();

  server.listen(3000, () => {
    console.log('> Ready on http://localhost:3000');
  });
}); 