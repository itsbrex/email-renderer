"use client"

import { useMemo } from "react"
import { PreviewCard } from "./preview-card"
import type { RenderResult, ClientId } from "@email-renderer/types"
import { ALL_CLIENTS } from "../lib/constants"

interface PreviewPanelProps {
  results: RenderResult[]
  isLoading: boolean
}

export function PreviewPanel({ results, isLoading }: PreviewPanelProps) {
  const resultMap = useMemo(() => {
    const map = new Map<ClientId, RenderResult>()
    for (const result of results) {
      map.set(result.clientId, result)
    }
    return map
  }, [results])

  return (
    <div className="flex flex-col bg-zinc-900 overflow-hidden h-full">
      <div className="shrink-0 h-9 bg-zinc-800 border-b border-zinc-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span className="text-sm text-zinc-300 font-medium">Preview</span>
        </div>
        {results.length > 0 && (
          <span className="text-xs text-zinc-500">{results.length} clients</span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-2">
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
  )
}
