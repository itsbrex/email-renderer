'use server';

import type { RenderResponse, ClientId } from '@email-renderer/types';

const RENDERER_URL = process.env.RENDERER_URL || 'http://localhost:3001';
const RENDERER_API_KEY = process.env.RENDERER_API_KEY;
const VALID_CLIENTS: ClientId[] = ['gmail-web', 'apple-mail', 'outlook-win', 'yahoo-mail'];

export async function renderHtml(html: string, clients: ClientId[]) {
  if (!html || typeof html !== 'string') {
    throw new Error("Missing or invalid 'html' field");
  }

  if (!clients || !Array.isArray(clients)) {
    throw new Error("Missing or invalid 'clients' field");
  }

  const invalidClients = clients.filter((id: unknown) => !VALID_CLIENTS.includes(id as ClientId));

  if (invalidClients.length > 0) {
    throw new Error(`Invalid client IDs: ${invalidClients.join(', ')}`);
  }

  if (!RENDERER_API_KEY) {
    throw new Error('RENDERER_API_KEY is not configured');
  }

  const response = await fetch(`${RENDERER_URL}/render`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RENDERER_API_KEY}`,
    },
    body: JSON.stringify({ html, clients }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Renderer error:', errorText);
    throw new Error('Render service error');
  }

  const data: RenderResponse = await response.json();
  return data;
}
