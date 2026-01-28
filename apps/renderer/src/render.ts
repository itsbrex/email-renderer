import {
  GmailWebRenderer,
  AppleMailRenderer,
  OutlookWinRenderer,
  YahooMailRenderer,
} from '@email-renderer/clients';
import { chromium, webkit, type Browser, type BrowserContext } from 'playwright';
import type { ClientId, RenderResult, EngineType } from '@email-renderer/types';

let chromiumBrowser: Browser | null = null;
let webkitBrowser: Browser | null = null;

async function getChromiumBrowser(): Promise<Browser> {
  if (!chromiumBrowser) {
    console.log('[RENDER] Initializing Chromium browser...');
    chromiumBrowser = await chromium.launch({
      headless: true,
    });
    console.log('[RENDER] Chromium browser initialized');
  }
  return chromiumBrowser;
}

async function getWebkitBrowser(): Promise<Browser> {
  if (!webkitBrowser) {
    console.log('[RENDER] Initializing WebKit browser...');
    webkitBrowser = await webkit.launch({
      headless: true,
    });
    console.log('[RENDER] WebKit browser initialized');
  }
  return webkitBrowser;
}

async function getBrowserForEngine(engine: EngineType): Promise<Browser> {
  switch (engine) {
    case 'chromium':
    case 'word':
      return getChromiumBrowser();
    case 'webkit':
      return getWebkitBrowser();
    default:
      return getChromiumBrowser();
  }
}

async function captureScreenshot(
  html: string,
  engine: EngineType,
  requestId?: string,
): Promise<{ screenshot: string; finalHtml: string }> {
  const logPrefix = requestId ? `[RENDER] ${requestId}` : '[RENDER]';
  const startTime = Date.now();

  try {
    console.log(
      `${logPrefix} - Capturing screenshot with ${engine} engine, HTML size: ${html.length} bytes`,
    );
    const browser = await getBrowserForEngine(engine);
    const context: BrowserContext = await browser.newContext({
      viewport: { width: 600, height: 800 },
      deviceScaleFactor: 2,
    });

    try {
      const page = await context.newPage();
      console.log(`${logPrefix} - Page created, setting content...`);

      await page.setContent(html, {
        waitUntil: 'networkidle',
      });

      await page.waitForTimeout(500);

      console.log(`${logPrefix} - Taking screenshot...`);
      const screenshot = await page.screenshot({
        type: 'png',
        fullPage: true,
      });

      const finalHtml = await page.content();
      const screenshotSize = screenshot.length;
      const duration = Date.now() - startTime;

      console.log(
        `${logPrefix} - Screenshot captured: ${screenshotSize} bytes, final HTML: ${finalHtml.length} bytes, duration: ${duration}ms`,
      );

      const base64Screenshot = `data:image/png;base64,${screenshot.toString('base64')}`;

      return {
        screenshot: base64Screenshot,
        finalHtml,
      };
    } finally {
      await context.close();
      console.log(`${logPrefix} - Browser context closed`);
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error(`${logPrefix} - Screenshot capture failed after ${duration}ms:`, {
      error: errorMessage,
      stack: errorStack,
    });
    throw error;
  }
}

export async function renderEmail(
  html: string,
  clients: ClientId[],
  requestId?: string,
): Promise<RenderResult[]> {
  const logPrefix = requestId ? `[RENDER] ${requestId}` : '[RENDER]';
  const results: RenderResult[] = [];

  console.log(
    `${logPrefix} - Starting render for ${clients.length} client(s): ${clients.join(', ')}`,
  );

  for (const clientId of clients) {
    const clientStartTime = Date.now();
    console.log(`${logPrefix} - Processing ${clientId}...`);

    try {
      let renderer;
      let engine: EngineType;

      switch (clientId) {
        case 'gmail-web':
          renderer = new GmailWebRenderer();
          engine = 'chromium';
          break;
        case 'apple-mail':
          renderer = new AppleMailRenderer();
          engine = 'webkit';
          break;
        case 'outlook-win':
          renderer = new OutlookWinRenderer();
          engine = 'chromium';
          break;
        case 'yahoo-mail':
          renderer = new YahooMailRenderer();
          engine = 'chromium';
          break;
        default:
          throw new Error(`Unknown client: ${clientId}`);
      }

      console.log(`${logPrefix} - ${clientId}: Renderer initialized (${engine} engine)`);
      const renderResult = await renderer.render({ html, clientId });
      console.log(
        `${logPrefix} - ${clientId}: HTML transformed, ${renderResult.warnings.length} warning(s)`,
      );

      const { screenshot, finalHtml } = await captureScreenshot(
        renderResult.finalHtml,
        engine,
        requestId,
      );

      const clientDuration = Date.now() - clientStartTime;
      console.log(`${logPrefix} - ${clientId}: Completed successfully in ${clientDuration}ms`);

      results.push({
        ...renderResult,
        screenshotUrl: screenshot,
        finalHtml,
      });
    } catch (error) {
      const clientDuration = Date.now() - clientStartTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;

      console.error(`${logPrefix} - ${clientId}: Error after ${clientDuration}ms`, {
        error: errorMessage,
        stack: errorStack,
      });

      results.push({
        clientId,
        engine: clientId === 'apple-mail' ? 'webkit' : 'chromium',
        screenshotUrl: '',
        finalHtml: '',
        warnings: [
          {
            type: 'compatibility',
            severity: 'error',
            message: `Rendering failed: ${errorMessage}`,
          },
        ],
      });
    }
  }

  const successCount = results.filter((r) => r.screenshotUrl).length;
  const errorCount = results.length - successCount;
  console.log(`${logPrefix} - Render complete: ${successCount} success, ${errorCount} error(s)`);

  return results;
}

export async function cleanup(): Promise<void> {
  if (chromiumBrowser) {
    await chromiumBrowser.close();
    chromiumBrowser = null;
  }
  if (webkitBrowser) {
    await webkitBrowser.close();
    webkitBrowser = null;
  }
}

process.on('SIGINT', async () => {
  await cleanup();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await cleanup();
  process.exit(0);
});
