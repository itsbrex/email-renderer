import type { RenderInput, RenderResult, Warning } from '@email-renderer/types';
import { transformWithCanIEmail } from './transformers/caniemail-transformer';
import { transformForWord } from './transformers/outlook-word';
import { BaseRenderer, type BaseRendererConfig } from './base';

export class OutlookWinRenderer extends BaseRenderer {
  id = 'outlook-win' as const;
  name = 'Outlook Windows (Word-style simulation)';
  engine = 'word' as const;

  constructor(config?: BaseRendererConfig) {
    super(config);
  }

  getCssResets(): string {
    return `
      body {
        margin: 0;
        padding: 0;
        font-family: Calibri, Arial, sans-serif;
        font-size: 11pt;
        line-height: 1.5;
      }
      table {
        border-collapse: collapse;
      }
      img {
        -ms-interpolation-mode: bicubic;
      }
    `;
  }

  async render(input: RenderInput): Promise<RenderResult> {
    const { html: caniemailHtml, warnings: caniemailWarnings } = await transformWithCanIEmail(
      input.html,
      this.id,
    );
    const { html: transformedHtml, warnings: wordWarnings } = transformForWord(caniemailHtml);
    const wrappedHtml = this.wrapHtmlWithResets(transformedHtml);

    const simulationWarning: Warning = {
      type: 'compatibility',
      severity: 'info',
      message:
        'This is a simulation of Outlook Windows rendering. Actual Word rendering engine may produce different results.',
    };

    return {
      clientId: this.id,
      engine: this.engine,
      screenshotUrl: '',
      finalHtml: wrappedHtml,
      warnings: [simulationWarning, ...caniemailWarnings, ...wordWarnings],
    };
  }
}
