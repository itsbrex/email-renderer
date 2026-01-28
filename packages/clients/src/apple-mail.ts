import { transformWithCanIEmail } from './transformers/caniemail-transformer';
import type { RenderInput, RenderResult } from '@email-renderer/types';
import { BaseRenderer, type BaseRendererConfig } from './base';
import { APPLE_MAIL_CSS_RESETS } from './css-resets';

export class AppleMailRenderer extends BaseRenderer {
  id = 'apple-mail' as const;
  name = 'Apple Mail';
  engine = 'webkit' as const;

  constructor(config?: BaseRendererConfig) {
    super(config);
  }

  getCssResets(): string {
    return APPLE_MAIL_CSS_RESETS;
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
