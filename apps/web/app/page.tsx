"use client"

import { useState, useCallback, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import type { RenderResult, AnalysisResult } from "@email-renderer/types"
import {
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Header } from "../components/header"
import { EditorPanel } from "../components/editor-panel"
import { PreviewPanel } from "../components/preview-panel"
import { AnalysisPanel } from "../components/analysis-panel"
import { ALL_CLIENTS, DEFAULT_EMAIL, DEFAULT_REACT_EMAIL } from "../lib/constants"
import { renderHtml } from "./actions/render"
import { renderReactEmail } from "./actions/react-email"
import { analyseEmailAction } from "./actions/analyse"
import { checkRendererHealth } from "./actions/health"

type RendererStatus = "checking" | "connected" | "disconnected"
type EditorMode = "html" | "react-email"
type MobileTab = "html" | "previews" | "analysis"

export default function Page() {
  const searchParams = useSearchParams()
  const showReactEmail = searchParams.get("reactEmail") === "true"
  const [editorMode, setEditorMode] = useState<EditorMode>("html")
  const [html, setHtml] = useState(DEFAULT_EMAIL)
  const [reactEmailCode, setReactEmailCode] = useState(DEFAULT_REACT_EMAIL)
  const [results, setResults] = useState<RenderResult[]>([])
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [rendererStatus, setRendererStatus] = useState<RendererStatus>("checking")
  const [mobileTab, setMobileTab] = useState<MobileTab>("html")

  const checkRendererStatus = useCallback(async () => {
    setRendererStatus("checking")
    try {
      const healthData = await checkRendererHealth()
      setRendererStatus(healthData.status)
    } catch {
      setRendererStatus("disconnected")
    }
  }, [])

  useEffect(() => {
    checkRendererStatus()
    const interval = setInterval(checkRendererStatus, 30000)
    return () => clearInterval(interval)
  }, [checkRendererStatus])

  useEffect(() => {
    if (!showReactEmail && editorMode === "react-email") {
      setEditorMode("html")
    }
  }, [showReactEmail, editorMode])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const totalWarnings = analyses.reduce((sum, a) => sum + a.warnings.filter(w => w.severity === "warning").length, 0)
  const totalErrors = analyses.reduce((sum, a) => sum + a.warnings.filter(w => w.severity === "error").length, 0)

  const handleRender = async () => {
    setIsLoading(true)
    setError(null)

    try {
      let renderData

      if (editorMode === "react-email") {
        renderData = await renderReactEmail(reactEmailCode, [...ALL_CLIENTS])
      } else {
        renderData = await renderHtml(html, [...ALL_CLIENTS])
      }

      setResults(renderData.results)

      const htmlToAnalyse =
        editorMode === "react-email" ? renderData.convertedHtml || html : html

      try {
        const analyseData = await analyseEmailAction(htmlToAnalyse, renderData.results)
        setAnalyses(analyseData.analyses)
      } catch (analyseErr) {
        console.error("Analysis error:", analyseErr)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("Render error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-zinc-900">
      <Header
        rendererStatus={rendererStatus}
        onRetryConnection={checkRendererStatus}
        showAnalysis={showAnalysis}
      />

      <div className="hidden md:flex flex-1 overflow-hidden">
        <ResizablePanelGroup className="flex-1 flex overflow-hidden">
          <ResizablePanel defaultSize={70}>
            <EditorPanel
              editorMode={editorMode}
              onEditorModeChange={setEditorMode}
              html={html}
              reactEmailCode={reactEmailCode}
              onHtmlChange={setHtml}
              onReactEmailChange={setReactEmailCode}
              onRender={handleRender}
              isLoading={isLoading}
              rendererStatus={rendererStatus}
              showReactEmail={showReactEmail}
            />
          </ResizablePanel>

          <ResizablePanel defaultSize={30}>
            <PreviewPanel results={results} isLoading={isLoading} totalWarnings={totalWarnings}
              totalErrors={totalErrors} onToggleAnalysis={() => setShowAnalysis(!showAnalysis)} />
          </ResizablePanel>

          {showAnalysis && (
            <ResizablePanel defaultSize={20}>
              <AnalysisPanel
                analyses={analyses}
                isLoading={isLoading}
                onClose={() => setShowAnalysis(false)}
              />
            </ResizablePanel>
          )}
        </ResizablePanelGroup>
      </div>

      <div className="flex md:hidden flex-1 overflow-hidden">
        <Tabs value={mobileTab} onValueChange={(value) => setMobileTab(value as MobileTab)} className="flex flex-col h-full w-full gap-0">
          <TabsList variant="line" className="shrink-0 h-9 bg-zinc-800 border-b border-zinc-800 rounded-none px-2 w-full">
            <TabsTrigger value="html" className="flex-1 text-zinc-400 data-active:text-white data-active:after:bg-white data-active:after:h-0.5">
              <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              HTML
            </TabsTrigger>
            <TabsTrigger value="previews" className="flex-1 text-zinc-400 data-active:text-white data-active:after:bg-white data-active:after:h-0.5">
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Previews
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex-1 text-zinc-400 data-active:text-white data-active:after:bg-white data-active:after:h-0.5">
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Analysis
            </TabsTrigger>
          </TabsList>
          <TabsContent value="html" className="flex-1 m-0 p-0 overflow-hidden">
            <EditorPanel
              editorMode={editorMode}
              onEditorModeChange={setEditorMode}
              html={html}
              reactEmailCode={reactEmailCode}
              onHtmlChange={setHtml}
              onReactEmailChange={setReactEmailCode}
              onRender={handleRender}
              isLoading={isLoading}
              rendererStatus={rendererStatus}
              showReactEmail={showReactEmail}
            />
          </TabsContent>
          <TabsContent value="previews" className="flex-1 m-0 p-0 overflow-hidden">
            <PreviewPanel results={results} isLoading={isLoading} totalWarnings={totalWarnings}
              totalErrors={totalErrors} onToggleAnalysis={() => setShowAnalysis(!showAnalysis)} />
          </TabsContent>
          <TabsContent value="analysis" className="flex-1 m-0 p-0 overflow-hidden">
            <AnalysisPanel
              analyses={analyses}
              isLoading={isLoading}
              onClose={() => { }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
