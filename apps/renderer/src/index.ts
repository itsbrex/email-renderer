import { serve } from '@hono/node-server';
import { app } from './server';
import 'dotenv/config';

const port = parseInt(process.env.PORT || '3001', 10);

console.log(`Starting renderer worker on port ${port}...`);

serve({
  fetch: app.fetch,
  port,
});

console.log(`Renderer worker running at http://localhost:${port}`);
