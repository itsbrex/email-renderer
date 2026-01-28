'use server';

const RENDERER_URL = process.env.RENDERER_URL || 'http://localhost:3001';

export async function checkRendererHealth() {
  try {
    const response = await fetch(RENDERER_URL, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      return { status: 'disconnected' as const };
    }

    const data = await response.json();
    return {
      status: 'connected' as const,
      renderer: data,
    };
  } catch {
    return { status: 'disconnected' as const };
  }
}
