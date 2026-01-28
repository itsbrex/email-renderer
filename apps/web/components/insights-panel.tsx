"use client"

import * as React from "react"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,

} from "./ui/accordion"
import type { AnalysisResult, Warning, ClientId } from "@email-renderer/types"
import { EMAIL_CLIENTS } from "@email-renderer/types"

interface InsightsPanelProps {
  analyses: AnalysisResult[]
  isLoading: boolean
}

const severityConfig = {
  error: {
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    text: "text-red-400",
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  warning: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  info: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    text: "text-blue-400",
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
}

function WarningItem({ warning }: { warning: Warning }) {
  const config = severityConfig[warning.severity]

  return (
    <div className={`rounded border p-2.5 mb-2 ${config.bg} ${config.border}`}>
      <div className={`flex items-start gap-2 ${config.text}`}>
        {config.icon}
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-medium uppercase tracking-wide opacity-60">
            {warning.type.replace("-", " ")}
          </span>
          <p className="text-xs mt-0.5 text-zinc-300">{warning.message}</p>
          {(warning.selector || warning.property) && (
            <div className="mt-1.5 text-[10px] font-mono text-zinc-500 space-y-0.5">
              {warning.selector && <div>Selector: {warning.selector}</div>}
              {warning.property && <div>Property: {warning.property}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ClientInsights({ analysis }: { analysis: AnalysisResult }) {
  const clientInfo = EMAIL_CLIENTS[analysis.clientId]
  const warningCount = analysis.warnings.length
  const errorCount = analysis.warnings.filter(w => w.severity === "error").length

  const severityOrder: Record<Warning["severity"], number> = {
    info: 0,
    warning: 1,
    error: 2,
  }

  const sortedWarnings = React.useMemo(() => {
    return [...analysis.warnings].sort((a, b) => {
      return severityOrder[a.severity] - severityOrder[b.severity]
    })
  }, [analysis.warnings])

  return (
    <AccordionItem value={analysis.clientId} className="border-b border-zinc-700/50">
      <AccordionTrigger className="px-3 py-2 hover:bg-zinc-800/50 hover:no-underline text-sm">
        <div className="flex items-center gap-2 w-full">
          <span className="font-medium text-zinc-200">{clientInfo.name}</span>
          <div className="flex items-center gap-1.5 ml-auto mr-2">
            {errorCount > 0 && (
              <span className="flex items-center gap-1 text-[10px] text-red-400">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errorCount}
              </span>
            )}
            {warningCount > 0 && warningCount !== errorCount && (
              <span className="flex items-center gap-1 text-[10px] text-amber-400">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {warningCount - errorCount}
              </span>
            )}
            {warningCount === 0 && (
              <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                OK
              </span>
            )}
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-3 pb-3">
        <div className="space-y-3">
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500 mb-2">Compatibility Issues</h4>
            {sortedWarnings.length > 0 ? (
              sortedWarnings.map((warning, i) => (
                <WarningItem key={i} warning={warning} />
              ))
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                No compatibility issues found
              </div>
            )}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

export function InsightsPanel({ analyses, isLoading }: InsightsPanelProps) {
  const CLIENT_ORDER: ClientId[] = ["gmail-web", "apple-mail", "outlook-win", "yahoo-mail"]

  const sortedAnalyses = React.useMemo(() => {
    const analysisMap = new Map(analyses.map((a) => [a.clientId, a]))
    return CLIENT_ORDER.map((id) => analysisMap.get(id)).filter(Boolean) as AnalysisResult[]
  }, [analyses])

  return (
    <div className="h-full">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-full text-zinc-500">
          <svg className="w-6 h-6 animate-spin mb-2" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-xs">Analysing...</span>
        </div>
      ) : sortedAnalyses.length > 0 ? (
        <Accordion className="w-full" defaultValue={sortedAnalyses[0]?.clientId ? [sortedAnalyses[0].clientId] : []}>
          {sortedAnalyses.map((analysis) => (
            <ClientInsights key={analysis.clientId} analysis={analysis} />
          ))}
        </Accordion>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-zinc-500 p-4">
          <svg className="w-8 h-8 mb-2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span className="text-xs text-center">Click Run to analyse<br />email compatibility</span>
        </div>
      )}
    </div>
  )
}
