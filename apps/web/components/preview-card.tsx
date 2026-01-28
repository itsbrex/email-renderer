"use client"

import * as React from "react"
import {
  Badge,
} from "./ui/badge"
import { Skeleton } from "./ui/skeleton"
import type { RenderResult } from "@email-renderer/types"
import { EMAIL_CLIENTS } from "@email-renderer/types"

interface PreviewCardProps {
  result?: RenderResult
  isLoading: boolean
  clientId: "gmail-web" | "apple-mail" | "outlook-win" | "yahoo-mail"
}

const clientIcons: Record<string, React.ReactNode> = {
  "gmail-web": (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
    </svg>
  ),
  "apple-mail": (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  ),
  "outlook-win": (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.88 12.04q0 .45-.11.87-.1.41-.33.74-.22.33-.58.52-.37.2-.87.2t-.85-.2q-.35-.21-.57-.55-.22-.33-.33-.75-.1-.42-.1-.86t.1-.87q.1-.43.34-.76.22-.34.59-.54.36-.2.87-.2t.86.2q.35.21.57.55.22.34.31.77.1.43.1.88zM24 12v9.38q0 .46-.33.8-.33.32-.8.32H7.13q-.46 0-.8-.33-.32-.33-.32-.8V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h6.5V2.55q0-.44.3-.75.3-.3.75-.3h12.9q.44 0 .75.3.3.3.3.75V12zm-6-8.25v3h3v-3zm0 4.5v3h3v-3zm0 4.5v1.83l3.05-1.83zm-5.25-9v3h3.75v-3zm0 4.5v3h3.75v-3zm0 4.5v2.03l2.41 1.5 1.34-.8v-2.73zM9 3.75V6h2l.13.01.12.04v-2.3zM5.98 15.98q.9 0 1.6-.3.7-.32 1.19-.86.48-.55.73-1.28.25-.74.25-1.61 0-.83-.25-1.55-.24-.71-.71-1.24t-1.15-.83q-.68-.3-1.55-.3-.92 0-1.64.3-.71.3-1.2.85-.5.54-.75 1.3-.25.74-.25 1.63 0 .85.26 1.56.26.72.74 1.23.48.52 1.17.81.69.3 1.56.3zM7.5 21h12.39L12 16.08V17q0 .41-.3.7-.29.3-.7.3H7.5zm15-.13v-7.24l-5.9 3.54Z" />
    </svg>
  ),
  "yahoo-mail": (
    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"><path d="M223.8 141.1l-56.7 143.2-56-143.2-96.1 0 105.8 249.1-38.6 89.8 94.2 0 140.9-338.9-93.6 0zM329.2 276.9a58.2 58.2 0 1 0 0 116.4 58.2 58.2 0 1 0 0-116.4zM394.7 32l-93 223.5 104.8 0 92.6-223.5-104.4 0z" /></svg>
  ),
}

const clientColors: Record<string, string> = {
  "gmail-web": "text-red-400",
  "apple-mail": "text-zinc-300",
  "outlook-win": "text-blue-400",
  "yahoo-mail": "text-purple-400",
}

const engineBadges: Record<string, { bg: string; text: string, border: string }> = {
  chromium: { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-400" },
  webkit: { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-400" },
  word: { bg: "bg-orange-500/20", text: "text-orange-400", border: "border-orange-400" },
}

export function PreviewCard({ result, isLoading, clientId }: PreviewCardProps) {
  const clientInfo = EMAIL_CLIENTS[clientId]
  const engineStyle = engineBadges[clientInfo.engine]

  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-800 overflow-hidden">
      <div className="flex items-center justify-between pl-3 pr-2 py-2 border-b border-zinc-700 bg-zinc-800">
        <div className="flex items-center gap-2">
          <span className={clientColors[clientId]}>{clientIcons[clientId]}</span>
          <span className="text-sm font-medium text-zinc-200">{clientInfo.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`text-xs px-2 py-0.5 ${engineStyle.bg} ${engineStyle.text} ${engineStyle.border}`}>
            {clientInfo.engine}
          </Badge>
          {clientInfo.simulated && (
            <Badge variant="outline" className="text-xs border-amber-400 bg-amber-500/10 text-amber-400">
              simulated
            </Badge>
          )}
        </div>
      </div>

      <div className="bg-zinc-900/50">
        {isLoading ? (
          <div className="p-3">
            <Skeleton className="w-full h-[200px] rounded bg-zinc-800" />
          </div>
        ) : result?.screenshotUrl ? (
          <div className="overflow-hidden bg-white">
            <img
              src={result.screenshotUrl}
              alt={`${clientInfo.name} preview`}
              className="w-full h-auto"
            />
          </div>
        ) : (
          <div className="h-[200px] flex flex-col items-center justify-center text-zinc-500 p-4">
            <svg className="w-10 h-10 mb-2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-xs">Click Run to preview</span>
          </div>
        )}
      </div>
    </div>
  )
}
