import type { ClientId, EmailClientRenderer } from '@email-renderer/types';
import { OutlookWinRenderer } from './outlook-win';
import { YahooMailRenderer } from './yahoo-mail';
import { AppleMailRenderer } from './apple-mail';
import type { BaseRendererConfig } from './base';
import { GmailWebRenderer } from './gmail-web';

const rendererMap: Record<ClientId, new (config?: BaseRendererConfig) => EmailClientRenderer> = {
  'gmail-web': GmailWebRenderer,
  'apple-mail': AppleMailRenderer,
  'outlook-win': OutlookWinRenderer,
  'yahoo-mail': YahooMailRenderer,
};

export function createRenderer(
  clientId: ClientId,
  config?: BaseRendererConfig,
): EmailClientRenderer {
  const RendererClass = rendererMap[clientId];
  if (!RendererClass) {
    throw new Error(`Unknown client ID: ${clientId}`);
  }
  return new RendererClass(config);
}

export function getRenderer(clientId: ClientId): EmailClientRenderer {
  return createRenderer(clientId);
}

export function getAllRenderers(config?: BaseRendererConfig): EmailClientRenderer[] {
  return Object.keys(rendererMap).map((id) => createRenderer(id as ClientId, config));
}
