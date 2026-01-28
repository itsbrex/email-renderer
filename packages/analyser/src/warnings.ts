import type { ClientId, Warning, RenderResult, AnalysisResult } from '@email-renderer/types';
import { checkCSSCompatibility } from './css-compat';

export async function generateWarnings(
  originalHtml: string,
  clientId: ClientId,
): Promise<Warning[]> {
  const cssWarnings = await checkCSSCompatibility(originalHtml, clientId);
  return cssWarnings;
}

export async function analyseEmail(
  originalHtml: string,
  results: RenderResult[],
): Promise<AnalysisResult[]> {
  const analysisPromises = results.map(async (result) => {
    const warnings = [
      ...(await generateWarnings(originalHtml, result.clientId)),
      ...result.warnings,
    ];

    return {
      clientId: result.clientId,
      diff: {
        removedNodes: [],
        removedAttributes: [],
        modifiedStyles: [],
      },
      warnings,
    };
  });

  return Promise.all(analysisPromises);
}
