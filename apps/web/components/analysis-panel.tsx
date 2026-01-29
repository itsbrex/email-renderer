'use client';

import { InsightsPanel } from './insights-panel';
import { useEditor } from '@/hooks/use-editor';

export function AnalysisPanel() {
  const { analyses, isLoading, setShowAnalysis } = useEditor();

  return (
    <div className="flex h-full flex-col border-zinc-800 md:border-l">
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-zinc-800 bg-zinc-800 px-4">
        <span className="text-sm font-medium text-zinc-300">Analysis</span>
        <button
          onClick={() => setShowAnalysis(false)}
          className="hidden text-zinc-500 hover:text-zinc-300 md:block"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        <InsightsPanel analyses={analyses} isLoading={isLoading} />
      </div>
    </div>
  );
}
