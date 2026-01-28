"use client"

import { Button } from "./ui/button"
import { Badge } from "./ui/badge"

type RendererStatus = "checking" | "connected" | "disconnected"

interface HeaderProps {
  rendererStatus: RendererStatus
  onRetryConnection: () => void
  showAnalysis: boolean
  onToggleAnalysis: () => void
  totalWarnings: number
}

export function Header({
  rendererStatus,
  onRetryConnection,
  onToggleAnalysis,
  totalWarnings,
}: HeaderProps) {
  return (
    <header className="shrink-0 h-12 border-b border-zinc-800 bg-zinc-800 flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="font-semibold text-white">Email Renderer</span>
        </div>
        <div className="h-4 w-px bg-zinc-700" />
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${rendererStatus === "connected" ? "bg-emerald-500" :
            rendererStatus === "checking" ? "bg-yellow-500 animate-pulse" :
              "bg-red-500"
            }`} />
          <span className="text-xs text-zinc-400">
            {rendererStatus === "connected" ? "Connected" :
              rendererStatus === "checking" ? "Checking..." :
                "Disconnected"}
          </span>
          {rendererStatus === "disconnected" && (
            <button
              onClick={onRetryConnection}
              className="text-zinc-400 hover:text-white transition-colors"
              title="Retry connection"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="hidden md:flex items-center gap-3">
        <Button
          onClick={onToggleAnalysis}
          size="sm"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          Analysis
          {totalWarnings > 0 && (
            <Badge variant="secondary" className="ml-2 bg-amber-500/20 text-amber-400 border-0">
              {totalWarnings}
            </Badge>
          )}
        </Button>
      </div>
    </header>
  )
}
