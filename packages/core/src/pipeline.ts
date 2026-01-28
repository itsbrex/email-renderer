import type {
  ClientId,
  RenderInput,
  RenderResult,
  RenderRequest,
  RenderResponse,
} from '@email-renderer/types';
import { normalizeEmail } from './normalize';

export interface RenderPipelineOptions {
  rendererUrl: string;
}

export function createRenderPipeline(options: RenderPipelineOptions) {
  const { rendererUrl } = options;

  async function render(html: string, clients: ClientId[]): Promise<RenderResult[]> {
    const normalized = normalizeEmail(html);

    const request: RenderRequest = {
      html: normalized.html,
      clients,
    };

    const response = await fetch(`${rendererUrl}/render`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Render request failed: ${response.statusText}`);
    }

    const data: RenderResponse = await response.json();
    return data.results;
  }

  async function renderSingle(input: RenderInput): Promise<RenderResult> {
    const results = await render(input.html, [input.clientId]);
    return results[0];
  }

  return {
    render,
    renderSingle,
    normalizeEmail,
  };
}
