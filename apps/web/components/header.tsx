'use client';

import { SendTestEmailDialog } from './send-test-email-dialog';
import { useEditor } from '@/hooks/use-editor';

export function Header() {
  const { rendererStatus, retryConnection } = useEditor();

  return (
    <header className="pl flex h-12 shrink-0 items-center justify-between border-b border-zinc-800 bg-zinc-800 pr-1 pl-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <svg
            className="h-5 w-5 text-indigo-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <span className="font-semibold text-white">Email Renderer</span>
        </div>
        <div className="h-4 w-px bg-zinc-700" />
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${
              rendererStatus === 'connected'
                ? 'bg-emerald-500'
                : rendererStatus === 'checking'
                  ? 'animate-pulse bg-yellow-500'
                  : 'bg-red-500'
            }`}
          />
          <span className="text-xs text-zinc-400">
            {rendererStatus === 'connected'
              ? 'Connected'
              : rendererStatus === 'checking'
                ? 'Checking...'
                : 'Disconnected'}
          </span>
          {rendererStatus === 'disconnected' && (
            <button
              onClick={retryConnection}
              className="text-zinc-400 transition-colors hover:text-white"
              title="Retry connection"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      <SendTestEmailDialog />
    </header>
  );
}
