import type { RenderRequest, RenderResponse, ClientId } from '@email-renderer/types';
import { renderEmail } from './render';
import type { Context } from 'hono';
import { cors } from 'hono/cors';
import { Hono } from 'hono';
import 'dotenv/config';

export const app = new Hono();

const API_KEY = process.env.RENDERER_API_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

app.use(
  '*',
  cors({
    origin: FRONTEND_URL,
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

const authMiddleware = async (c: Context, next: () => Promise<void>) => {
  if (c.req.path === '/') {
    return next();
  }

  if (!API_KEY) {
    console.error('[SERVER] RENDERER_API_KEY is not configured');
    return c.json({ error: 'Server configuration error' }, 500);
  }

  const authHeader = c.req.header('Authorization');
  if (!authHeader) {
    console.error('[SERVER] Missing Authorization header');
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const providedKey = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (providedKey !== API_KEY) {
    console.error('[SERVER] Invalid API key provided');
    return c.json({ error: 'Unauthorized' }, 401);
  }

  await next();
};

app.use('*', authMiddleware);

app.get('/', (c) => {
  return c.json({
    name: 'Email Renderer Worker',
    version: '0.0.1',
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

app.post('/render', async (c) => {
  const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  console.log(`[SERVER] ${requestId} - POST /render request received`);

  try {
    const body = await c.req.json<RenderRequest>();

    if (!body.html || typeof body.html !== 'string') {
      console.error(`[SERVER] ${requestId} - Missing or invalid 'html' field`);
      return c.json({ error: "Missing or invalid 'html' field" }, 400);
    }

    if (!body.clients || !Array.isArray(body.clients)) {
      console.error(`[SERVER] ${requestId} - Missing or invalid 'clients' field`);
      return c.json({ error: "Missing or invalid 'clients' field" }, 400);
    }

    const validClients: ClientId[] = ['gmail-web', 'apple-mail', 'outlook-win', 'yahoo-mail'];
    const invalidClients = body.clients.filter((id) => !validClients.includes(id as ClientId));

    if (invalidClients.length > 0) {
      console.error(`[SERVER] Invalid client IDs requested: ${invalidClients.join(', ')}`);
      return c.json({ error: `Invalid client IDs: ${invalidClients.join(', ')}` }, 400);
    }

    console.log(
      `[SERVER] ${requestId} - Render request: ${body.clients.length} client(s) - ${body.clients.join(', ')}, HTML size: ${body.html.length} bytes`,
    );
    const startTime = Date.now();

    const results = await renderEmail(body.html, body.clients as ClientId[], requestId);

    const duration = Date.now() - startTime;
    console.log(
      `[SERVER] ${requestId} - Render completed in ${duration}ms: ${results.length} result(s)`,
    );

    const response: RenderResponse = { results };
    return c.json(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error(`[SERVER] ${requestId} - Render error:`, {
      message: errorMessage,
      stack: errorStack,
      timestamp: new Date().toISOString(),
    });
    return c.json({ error: errorMessage }, 500);
  }
});

export default app;
