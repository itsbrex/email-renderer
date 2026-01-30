'use server';

import type { ClientId, RenderResponse } from '@email-renderer/types';
import { convertReactEmailToHtml } from '@/lib/convert-react-email';
import { ALL_CLIENTS } from '@/lib/constants';

const RENDERER_URL = process.env.RENDERER_URL || 'http://localhost:3001';
const RENDERER_API_KEY = process.env.RENDERER_API_KEY;

export async function renderReactEmail(reactEmailCode: string, clients: ClientId[]) {
  if (!reactEmailCode || typeof reactEmailCode !== 'string') {
    throw new Error("Missing or invalid 'reactEmailCode' field");
  }

  const jsxCode = reactEmailCode.trim();
  if (!jsxCode) {
    throw new Error('React Email code cannot be empty');
  }

  if (!clients || !Array.isArray(clients)) {
    throw new Error("Missing or invalid 'clients' field");
  }

  const invalidClients = clients.filter((id: unknown) => !ALL_CLIENTS.includes(id as ClientId));

  if (invalidClients.length > 0) {
    throw new Error(`Invalid client IDs: ${invalidClients.join(', ')}`);
  }

  let html: string;
  try {
    html = await convertReactEmailToHtml(jsxCode, { prettify: true });
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to convert React Email code');
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

  return {
    ...data,
    convertedHtml: html,
  };
}
