'use server';

import type { AnalyseResponse, RenderResult } from '@email-renderer/types';
import { analyseEmail } from '@email-renderer/analyser';

export async function analyseEmailAction(
  originalHtml: string,
  results: RenderResult[],
): Promise<AnalyseResponse> {
  if (!originalHtml || typeof originalHtml !== 'string') {
    throw new Error("Missing or invalid 'originalHtml' field");
  }

  if (!results || !Array.isArray(results)) {
    throw new Error("Missing or invalid 'results' field");
  }

  const analyses = await analyseEmail(originalHtml, results);
  return { analyses };
}
