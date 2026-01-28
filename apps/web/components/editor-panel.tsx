"use client"

import dynamic from "next/dynamic"
import { Button } from "./ui/button"
import { Switch } from "./ui/switch"

const CodeEditor = dynamic(
  () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
  { ssr: false }
)

type EditorMode = "html" | "react-email"

interface EditorPanelProps {
  editorMode: EditorMode
  onEditorModeChange: (mode: EditorMode) => void
  html: string
  reactEmailCode: string
  onHtmlChange: (html: string) => void
  onReactEmailChange: (code: string) => void
  onRender: () => void
  isLoading: boolean
  rendererStatus: "checking" | "connected" | "disconnected"
  showReactEmail: boolean
}

export function EditorPanel({
  editorMode,
  onEditorModeChange,
  html,
  reactEmailCode,
  onHtmlChange,
  onReactEmailChange,
  onRender,
  isLoading,
  rendererStatus,
  showReactEmail,
}: EditorPanelProps) {
  const currentValue = editorMode === "html" ? html : reactEmailCode
  const isEmpty = editorMode === "html" ? !html.trim() : !reactEmailCode.trim()

  return (
    <div className="flex flex-col md:border-r border-zinc-800 h-full">
      <div className="shrink-0 h-9 bg-zinc-800 border-b border-zinc-800 flex items-center pl-4 pr-1 justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-orange-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span className="text-sm text-zinc-300 font-medium ">HTML</span>
          {showReactEmail && (
            <>
              <Switch
                checked={editorMode === "react-email"}
                onCheckedChange={(checked) => {
                  if (showReactEmail) {
                    onEditorModeChange(checked ? "react-email" : "html")
                  }
                }}
                className="data-checked:bg-indigo-500 dark:data-checked:bg-indigo-500 data-unchecked:bg-orange-500/60 dark:data-unchecked:bg-orange-500/40 data-unchecked:*:data-[slot=switch-thumb]:bg-orange-200 data-unchecked:*:data-[slot=switch-thumb]:dark:bg-orange-300 data-checked:*:data-[slot=switch-thumb]:bg-indigo-100 data-checked:*:data-[slot=switch-thumb]:dark:bg-indigo-200"
              />
              <span className="text-sm text-zinc-300 font-medium">React Email</span>
            </>
          )}
        </div>
        <Button
          onClick={onRender}
          disabled={isLoading || isEmpty || rendererStatus !== "connected"}
          variant="secondary"
          size="sm"
          title={rendererStatus !== "connected" ? "Renderer not connected" : undefined}
        >
          {isLoading ? (
            <>
              <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Rendering...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Run
            </>
          )}
        </Button>
      </div>
      <div className="flex-1 overflow-auto">
        <CodeEditor
          value={currentValue}
          language={editorMode === "html" ? "html" : "tsx"}
          placeholder={
            editorMode === "html"
              ? "Paste your email HTML here..."
              : "Paste your React Email TSX component code here..."
          }
          onChange={(e) => {
            if (editorMode === "html") {
              onHtmlChange(e.target.value)
            } else {
              onReactEmailChange(e.target.value)
            }
          }}
          readOnly={false}
          padding={16}
          style={{
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            fontSize: 13,
            lineHeight: 1.6,
            backgroundColor: "var(--editor-bg)",
            width: "100%",
            minHeight: "100%",
            border: "none",
            outline: "none",
          }}
          data-color-mode="dark"
        />
      </div>
    </div>
  )
}
