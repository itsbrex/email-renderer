'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnalysisPanel } from './analysis-panel';
import { PreviewPanel } from './preview-panel';
import { EditorPanel } from './editor-panel';
import { track } from '@/lib/track';

export default function MobileLayout() {
  return (
    <div className="flex flex-1 overflow-hidden md:hidden">
      <Tabs
        className="flex h-full w-full flex-col gap-0"
        defaultValue="html"
        onValueChange={(value) => track('mobile_tab_switched', { tab: value })}
      >
        <TabsList
          variant="line"
          className="h-9 w-full shrink-0 rounded-none border-b border-zinc-800 bg-zinc-800 px-2"
        >
          <TabsTrigger
            value="html"
            className="flex-1 text-zinc-400 data-active:text-white data-active:after:h-0.5 data-active:after:bg-white"
          >
            <svg className="mr-1.5 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            HTML
          </TabsTrigger>
          <TabsTrigger
            value="previews"
            className="flex-1 text-zinc-400 data-active:text-white data-active:after:h-0.5 data-active:after:bg-white"
          >
            <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            Previews
          </TabsTrigger>
          <TabsTrigger
            value="analysis"
            className="flex-1 text-zinc-400 data-active:text-white data-active:after:h-0.5 data-active:after:bg-white"
          >
            <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
            Analysis
          </TabsTrigger>
        </TabsList>
        <TabsContent value="html" className="m-0 flex-1 overflow-hidden p-0">
          <EditorPanel />
        </TabsContent>
        <TabsContent value="previews" className="m-0 flex-1 overflow-hidden p-0">
          <PreviewPanel />
        </TabsContent>
        <TabsContent value="analysis" className="m-0 flex-1 overflow-hidden p-0">
          <AnalysisPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
