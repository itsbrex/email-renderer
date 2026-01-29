'use client';

import { ResizablePanel, ResizablePanelGroup } from './ui/resizable';
import { AnalysisPanel } from './analysis-panel';
import { useEditor } from '@/hooks/use-editor';
import { PreviewPanel } from './preview-panel';
import { EditorPanel } from './editor-panel';

export default function DesktopLayout() {
  const { showAnalysis } = useEditor();

  return (
    <div className="hidden flex-1 overflow-hidden md:flex">
      <ResizablePanelGroup className="flex flex-1 overflow-hidden">
        <ResizablePanel defaultSize={70}>
          <EditorPanel />
        </ResizablePanel>

        <ResizablePanel defaultSize={30}>
          <PreviewPanel />
        </ResizablePanel>

        {showAnalysis && (
          <ResizablePanel defaultSize={20}>
            <AnalysisPanel />
          </ResizablePanel>
        )}
      </ResizablePanelGroup>
    </div>
  );
}
