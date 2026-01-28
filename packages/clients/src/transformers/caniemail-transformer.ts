import {
  buildClientCompatibilityFromCanIEmail,
  getHTMLCompatibilityRules,
} from '@email-renderer/analyser';
import type { ClientId, Warning, CSSCompatibilityRule } from '@email-renderer/types';
import * as cheerio from 'cheerio';

interface TransformResult {
  html: string;
  warnings: Warning[];
}

interface CSSPropertyMatch {
  property: string;
  value: string;
  fullMatch: string;
}

function parseCSSProperty(propertyText: string): CSSPropertyMatch | null {
  const match = propertyText.match(/^\s*([^:]+):\s*(.+?)\s*$/);
  if (!match) return null;

  const property = match[1].trim().toLowerCase();
  const value = match[2].trim();

  return {
    property,
    value,
    fullMatch: propertyText.trim(),
  };
}

function extractCSSProperties(cssText: string): CSSPropertyMatch[] {
  const properties: CSSPropertyMatch[] = [];
  const declarations = cssText.split(';');

  for (const declaration of declarations) {
    const parsed = parseCSSProperty(declaration);
    if (parsed) {
      properties.push(parsed);
    }
  }

  return properties;
}

function normalizeCSSPropertyName(property: string): string {
  return property.toLowerCase().trim();
}

function matchesRule(property: string, rule: CSSCompatibilityRule): boolean {
  const pattern = typeof rule.pattern === 'string' ? new RegExp(rule.pattern, 'gi') : rule.pattern;
  const testString = `${property}:`;
  return pattern.test(testString);
}

function transformCSS(
  html: string,
  clientId: ClientId,
  compatibility: Awaited<ReturnType<typeof buildClientCompatibilityFromCanIEmail>>,
): { html: string; warnings: Warning[] } {
  const warnings: Warning[] = [];
  const $ = cheerio.load(html, { decodeEntities: false });

  const unsupportedSet = new Set(
    compatibility.unsupportedProperties.map((p: string) => normalizeCSSPropertyName(p)),
  );

  const propertyRuleMap = new Map<string, CSSCompatibilityRule>();
  for (const rule of compatibility.rules) {
    const patternStr = typeof rule.pattern === 'string' ? rule.pattern : rule.pattern.source;
    const propertyMatch = patternStr.match(/([a-zA-Z-]+)\\s*:/);
    if (propertyMatch) {
      const property = propertyMatch[1].replace(/\\-/g, '-');
      propertyRuleMap.set(normalizeCSSPropertyName(property), rule);
    }
  }

  $('*[style]').each((_index: number, element: any) => {
    const $el = $(element);
    const styleAttr = $el.attr('style');
    if (!styleAttr) return;

    const properties = extractCSSProperties(styleAttr);
    const supportedProperties: string[] = [];
    const tagName = $el.get(0)?.tagName?.toLowerCase() || '';

    for (const prop of properties) {
      const normalizedProp = normalizeCSSPropertyName(prop.property);

      if (unsupportedSet.has(normalizedProp)) {
        const rule = propertyRuleMap.get(normalizedProp);
        warnings.push({
          type: 'unsupported-css',
          severity: 'error',
          message:
            rule?.message ||
            `CSS property "${prop.property}" is not supported in ${clientId} and will be removed.`,
          property: prop.property,
          selector: tagName,
        });
        continue;
      }

      for (const rule of compatibility.rules) {
        if (matchesRule(prop.property, rule) && rule.severity === 'warning') {
          warnings.push({
            type: 'unsupported-css',
            severity: 'warning',
            message: rule.message,
            property: prop.property,
            selector: tagName,
          });
          break;
        }
      }

      supportedProperties.push(prop.fullMatch);
    }

    if (supportedProperties.length === 0) {
      $el.removeAttr('style');
    } else {
      $el.attr('style', supportedProperties.join('; '));
    }
  });

  $('style').each((_index: number, element: any) => {
    const $style = $(element);
    const cssText = $style.html() || '';
    if (!cssText.trim()) return;

    const rules: string[] = [];
    const cssRules = cssText.split('}');

    for (const rule of cssRules) {
      if (!rule.trim()) continue;

      const [selectorPart, ...declarations] = rule.split('{');
      if (!selectorPart || declarations.length === 0) continue;

      const selector = selectorPart.trim();
      const declarationsText = declarations.join('{');
      const properties = extractCSSProperties(declarationsText);
      const supportedProperties: string[] = [];

      for (const prop of properties) {
        const normalizedProp = normalizeCSSPropertyName(prop.property);

        if (unsupportedSet.has(normalizedProp)) {
          const rule = propertyRuleMap.get(normalizedProp);
          warnings.push({
            type: 'unsupported-css',
            severity: 'error',
            message:
              rule?.message ||
              `CSS property "${prop.property}" is not supported in ${clientId} and will be removed.`,
            property: prop.property,
            selector,
          });
          continue;
        }

        for (const rule of compatibility.rules) {
          if (matchesRule(prop.property, rule) && rule.severity === 'warning') {
            warnings.push({
              type: 'unsupported-css',
              severity: 'warning',
              message: rule.message,
              property: prop.property,
              selector,
            });
            break;
          }
        }

        supportedProperties.push(prop.fullMatch);
      }

      if (supportedProperties.length > 0) {
        rules.push(`${selector} { ${supportedProperties.join('; ')} }`);
      }
    }

    if (rules.length === 0) {
      $style.remove();
    } else {
      $style.html(rules.join('\n'));
    }
  });

  return { html: $.html(), warnings };
}

function extractElementNameFromPattern(pattern: RegExp | string): string | null {
  const patternStr = typeof pattern === 'string' ? pattern : pattern.source;
  const match = patternStr.match(/<([a-zA-Z][a-zA-Z0-9-]*)/);
  return match ? match[1].toLowerCase() : null;
}

function transformHTML(
  html: string,
  clientId: ClientId,
  htmlRules: CSSCompatibilityRule[],
): { html: string; warnings: Warning[] } {
  const warnings: Warning[] = [];
  const $ = cheerio.load(html, { decodeEntities: false });

  for (const rule of htmlRules) {
    const elementName = extractElementNameFromPattern(rule.pattern);
    if (!elementName) continue;

    $(elementName).each((_index: number, element: any) => {
      const $el = $(element);
      const tagName = $el.get(0)?.tagName?.toLowerCase();

      if (rule.severity === 'error') {
        warnings.push({
          type: 'removed-node',
          severity: 'error',
          message: rule.message,
          selector: tagName,
        });
        $el.remove();
      } else {
        warnings.push({
          type: 'compatibility',
          severity: rule.severity,
          message: rule.message,
          selector: tagName,
        });
      }
    });
  }

  return { html: $.html(), warnings };
}

export async function transformWithCanIEmail(
  html: string,
  clientId: ClientId,
): Promise<TransformResult> {
  const [compatibility, htmlRules] = await Promise.all([
    buildClientCompatibilityFromCanIEmail(clientId),
    getHTMLCompatibilityRules(clientId),
  ]);

  const cssResult = transformCSS(html, clientId, compatibility);
  const htmlResult = transformHTML(cssResult.html, clientId, htmlRules);

  return {
    html: htmlResult.html,
    warnings: [...cssResult.warnings, ...htmlResult.warnings],
  };
}
