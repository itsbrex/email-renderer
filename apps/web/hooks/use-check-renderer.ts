'use client';

import type { RendererStatus } from '@email-renderer/types';
import { checkRendererHealth } from '@/app/actions/health';
import { useCallback, useEffect, useState } from 'react';

export function useCheckRenderer() {
  const [status, setStatus] = useState<RendererStatus>('checking');

  const check = useCallback(async () => {
    setStatus('checking');
    try {
      const healthData = await checkRendererHealth();
      setStatus(healthData.status);
    } catch {
      setStatus('disconnected');
    }
  }, []);

  useEffect(() => {
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, [check]);

  return { status, retry: check };
}
