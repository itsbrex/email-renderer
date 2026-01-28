import { transformWithCanIEmail } from './transformers/caniemail-transformer';
import type { RenderInput, RenderResult } from '@email-renderer/types';
import { BaseRenderer, type BaseRendererConfig } from './base';
import { GMAIL_CSS_RESETS } from './css-resets';

export class GmailWebRenderer extends BaseRenderer {
  id = 'gmail-web' as const;
  name = 'Gmail Web';
  engine = 'chromium' as const;

  constructor(config?: BaseRendererConfig) {
    super(config);
  }

  getCssResets(): string {
    return GMAIL_CSS_RESETS;
  }

  async render(input: RenderInput): Promise<RenderResult> {
    const { html: transformedHtml, warnings } = await transformWithCanIEmail(input.html, this.id);
    const wrappedHtml = this.wrapHtmlWithResets(transformedHtml);

    return {
      clientId: this.id,
      engine: this.engine,
      screenshotUrl: '',
      finalHtml: wrappedHtml,
      warnings,
    };
  }
}
