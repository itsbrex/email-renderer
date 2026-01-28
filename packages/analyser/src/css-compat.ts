import { buildClientCompatibilityFromCanIEmail, getHTMLCompatibilityRules } from './caniemail';
import type { ClientId, Warning, ClientCompatibility } from '@email-renderer/types';

let caniemailCache: Record<ClientId, ClientCompatibility | null> = {
  'gmail-web': null,
  'apple-mail': null,
  'outlook-win': null,
  'yahoo-mail': null,
};

async function getCompatibilityRules(clientId: ClientId): Promise<ClientCompatibility | null> {
  if (!caniemailCache[clientId]) {
    try {
      const caniemailRules = await buildClientCompatibilityFromCanIEmail(clientId);
      const htmlRules = await getHTMLCompatibilityRules(clientId);

      caniemailCache[clientId] = {
        clientId,
        unsupportedProperties: caniemailRules.unsupportedProperties,
        rules: [...caniemailRules.rules, ...htmlRules],
      };
    } catch (error) {
      console.warn(`Failed to fetch caniemail data for ${clientId}:`, error);
      return null;
    }
  }

  return caniemailCache[clientId];
}

function extractStyleContent(html: string): string {
  const styleBlocks: string[] = [];

  const styleTagRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let match;
  while ((match = styleTagRegex.exec(html)) !== null) {
    styleBlocks.push(match[1]);
  }

  const inlineStyleRegex = /style="([^"]*)"/gi;
  while ((match = inlineStyleRegex.exec(html)) !== null) {
    styleBlocks.push(match[1]);
  }

  return styleBlocks.join('\n');
}

export async function checkCSSCompatibility(html: string, clientId: ClientId): Promise<Warning[]> {
  const warnings: Warning[] = [];
  const rules = await getCompatibilityRules(clientId);

  if (!rules) {
    return warnings;
  }

  const styleContent = extractStyleContent(html);
  const allContent = html + '\n' + styleContent;

  for (const property of rules.unsupportedProperties) {
    const regex = new RegExp(`${property.replace(/-/g, '\\-')}\\s*:`, 'gi');
    if (regex.test(allContent)) {
      warnings.push({
        type: 'unsupported-css',
        severity: 'warning',
        message: `CSS property "${property}" is not fully supported in ${clientId}`,
        property,
      });
    }
  }

  for (const rule of rules.rules) {
    const pattern =
      typeof rule.pattern === 'string' ? new RegExp(rule.pattern, 'gi') : rule.pattern;

    if (pattern.test(allContent)) {
      warnings.push({
        type: 'compatibility',
        severity: rule.severity,
        message: rule.message,
      });
    }
  }

  return warnings;
}
