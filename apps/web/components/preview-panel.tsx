'use client';

import type { ClientId } from '@email-renderer/types';
import { useEditor } from '@/hooks/use-editor';
import { ALL_CLIENTS } from '../lib/constants';
import { PreviewCard } from './preview-card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useMemo } from 'react';
import { track } from '@/lib/track';

export function PreviewPanel() {
  const { results, isLoading, totalWarnings, totalErrors, showAnalysis, setShowAnalysis } =
    useEditor();

  const resultMap = useMemo(() => {
    const map = new Map<ClientId, (typeof results)[number]>();
    for (const result of results) {
      map.set(result.clientId, result);
    }
    return map;
  }, [results]);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-zinc-900">
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-zinc-800 bg-zinc-800 pr-1 pl-4">
        <div className="flex items-center gap-2">
          <svg
            className="h-4 w-4 text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          <span className="text-sm font-medium text-zinc-300">Preview</span>
        </div>
        <Button
          onClick={() => {
            const next = !showAnalysis;
            track('analysis_toggled', { show: next });
            setShowAnalysis(next);
          }}
          size="sm"
          className="hidden md:flex"
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
          Analysis
          <div className="ml-1 flex items-center gap-1">
            {totalErrors > 0 && (
              <Badge variant="secondary" className="border-0 bg-red-500/20 text-red-400">
                {totalErrors}
              </Badge>
            )}
            {totalWarnings > 0 && (
              <Badge variant="secondary" className="border-0 bg-amber-500/20 text-amber-400">
                {totalWarnings}
              </Badge>
            )}
          </div>
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2 p-2">
          {(ALL_CLIENTS as readonly ClientId[]).map((clientId) => (
            <PreviewCard
              key={clientId}
              clientId={clientId}
              result={resultMap.get(clientId)}
              isLoading={isLoading}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
