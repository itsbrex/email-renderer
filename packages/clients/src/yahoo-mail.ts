import { transformWithCanIEmail } from './transformers/caniemail-transformer';
import type { RenderInput, RenderResult } from '@email-renderer/types';
import { BaseRenderer, type BaseRendererConfig } from './base';
import { YAHOO_MAIL_CSS_RESETS } from './css-resets';

export class YahooMailRenderer extends BaseRenderer {
  id = 'yahoo-mail' as const;
  name = 'Yahoo Mail';
  engine = 'chromium' as const;

  constructor(config?: BaseRendererConfig) {
    super(config);
  }

  getCssResets(): string {
    return YAHOO_MAIL_CSS_RESETS;
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
