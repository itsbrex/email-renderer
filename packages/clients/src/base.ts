import type {
  ClientId,
  EngineType,
  RenderInput,
  RenderResult,
  EmailClientRenderer,
  Warning,
} from '@email-renderer/types';

export interface BaseRendererConfig {
  containerWidth?: number;
  containerHeight?: number;
  deviceScaleFactor?: number;
}

export abstract class BaseRenderer implements EmailClientRenderer {
  abstract id: ClientId;
  abstract name: string;
  abstract engine: EngineType;

  protected config: BaseRendererConfig;

  constructor(config: BaseRendererConfig = {}) {
    this.config = {
      containerWidth: 600,
      containerHeight: 800,
      deviceScaleFactor: 2,
      ...config,
    };
  }

  abstract render(input: RenderInput): Promise<RenderResult>;

  abstract getCssResets(): string;

  protected wrapHtmlWithResets(html: string): string {
    const resets = this.getCssResets();

    if (html.includes('</head>')) {
      return html.replace('</head>', `<style>${resets}</style></head>`);
    }

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>${resets}</style>
</head>
<body>
${html}
</body>
</html>`;
  }

  protected createEmptyResult(warnings: Warning[] = []): RenderResult {
    return {
      clientId: this.id,
      engine: this.engine,
      screenshotUrl: '',
      finalHtml: '',
      warnings,
    };
  }
}
