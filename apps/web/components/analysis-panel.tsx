"use client"

import { InsightsPanel } from "./insights-panel"
import type { AnalysisResult } from "@email-renderer/types"

interface AnalysisPanelProps {
  analyses: AnalysisResult[]
  isLoading: boolean
  onClose: () => void
}

export function AnalysisPanel({ analyses, isLoading, onClose }: AnalysisPanelProps) {
  return (
    <div className="md:border-l border-zinc-800 flex flex-col h-full">
      <div className="shrink-0 h-9 bg-zinc-800 border-b border-zinc-800 flex items-center justify-between px-4">
        <span className="text-sm text-zinc-300 font-medium">Analysis</span>
        <button
          onClick={onClose}
          className="hidden md:block text-zinc-500 hover:text-zinc-300"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        <InsightsPanel analyses={analyses} isLoading={isLoading} />
      </div>
    </div>
  )
}
