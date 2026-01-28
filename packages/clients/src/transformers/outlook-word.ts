import type { Warning } from '@email-renderer/types';
import juice from 'juice';

const UNSUPPORTED_CSS_PROPERTIES = [
  'display:\\s*flex',
  'display:\\s*grid',
  'display:\\s*inline-flex',
  'display:\\s*inline-grid',
  'position:\\s*fixed',
  'position:\\s*sticky',
  'background-image',
  'background-size',
  'background-position',
  'border-radius',
  'box-shadow',
  'text-shadow',
  'opacity',
  'transform',
  'transition',
  'animation',
  'filter',
  'clip-path',
  'object-fit',
  'object-position',
];

const UNSUPPORTED_PROPERTIES_REGEX = new RegExp(UNSUPPORTED_CSS_PROPERTIES.join('|'), 'gi');

function detectUnsupportedProperties(html: string): Warning[] {
  const warnings: Warning[] = [];
  const styleMatches = html.match(/style="[^"]*"/g) || [];

  for (const styleAttr of styleMatches) {
    const matches = styleAttr.match(UNSUPPORTED_PROPERTIES_REGEX);
    if (matches) {
      for (const match of matches) {
        const property = match.split(':')[0].trim();
        if (!warnings.some((w) => w.property === property)) {
          warnings.push({
            type: 'unsupported-css',
            severity: 'warning',
            message: `CSS property "${property}" is not supported in Outlook and will be removed.`,
            property,
          });
        }
      }
    }
  }

  return warnings;
}

function stripUnsupportedCSS(html: string): string {
  return html.replace(/style="([^"]*)"/g, (match, styles) => {
    const cleanedStyles = styles
      .split(';')
      .filter((style: string) => {
        const trimmed = style.trim();
        if (!trimmed) return false;
        return !UNSUPPORTED_PROPERTIES_REGEX.test(trimmed);
      })
      .join(';');

    return cleanedStyles ? `style="${cleanedStyles}"` : '';
  });
}

function addMsoConditionals(html: string): string {
  const msoStart = '<!--[if mso]>';
  const msoEnd = '<![endif]-->';

  if (!html.includes('<!--[if mso]>')) {
    return html.replace(
      '</head>',
      `
      ${msoStart}
      <style type="text/css">
        body, table, td {
          font-family: Calibri, Arial, sans-serif !important;
        }
        table {
          border-collapse: collapse;
        }
      </style>
      ${msoEnd}
      </head>`,
    );
  }

  return html;
}

export function transformForWord(html: string): {
  html: string;
  warnings: Warning[];
} {
  const warnings = detectUnsupportedProperties(html);

  let transformed = juice(html, {
    preserveMediaQueries: false,
    preserveFontFaces: true,
    preserveImportant: true,
    applyStyleTags: true,
    removeStyleTags: true,
    applyAttributesTableElements: true,
  });

  transformed = stripUnsupportedCSS(transformed);

  transformed = addMsoConditionals(transformed);

  if (html.includes('display:') && html.match(/display:\s*(flex|grid)/i)) {
    warnings.push({
      type: 'compatibility',
      severity: 'warning',
      message:
        'Flexbox and Grid layouts have been stripped. Consider using table-based layouts for Outlook compatibility.',
    });
  }

  return { html: transformed, warnings };
}
