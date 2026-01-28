import type { NormalizedEmail } from '@email-renderer/types';
import juice from 'juice';

export interface NormalizeOptions {
  inlineStyles?: boolean;
  removeComments?: boolean;
  preserveMediaQueries?: boolean;
}

const DEFAULT_OPTIONS: NormalizeOptions = {
  inlineStyles: true,
  removeComments: true,
  preserveMediaQueries: true,
};

function removeHtmlComments(html: string): string {
  return html.replace(/<!--[\s\S]*?-->/g, '');
}

function wrapInDocument(html: string): string {
  if (html.includes('<!DOCTYPE') || html.includes('<html')) {
    return html;
  }

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
${html}
</body>
</html>`;
}

export function normalizeEmail(html: string, options: NormalizeOptions = {}): NormalizedEmail {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const originalHtml = html;

  let normalized = html.trim();

  if (opts.removeComments) {
    normalized = removeHtmlComments(normalized);
  }

  normalized = wrapInDocument(normalized);

  if (opts.inlineStyles) {
    normalized = juice(normalized, {
      preserveMediaQueries: opts.preserveMediaQueries,
      preserveFontFaces: true,
      preserveImportant: true,
      applyStyleTags: true,
      removeStyleTags: false,
      applyAttributesTableElements: true,
    });
  }

  return {
    html: normalized,
    originalHtml,
  };
}
