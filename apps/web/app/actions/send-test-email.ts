'use server';

import { convertReactEmailToHtml } from '@/lib/convert-react-email';
import type { EditorMode } from '@email-renderer/types';
import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

type SendTestEmailResult =
  | { success: true; id: string }
  | { success: false; error: string };

export async function sendTestEmail(
  to: string,
  subject: string,
  content: string,
  editorMode: EditorMode,
): Promise<SendTestEmailResult> {
  if (!RESEND_API_KEY) {
    return { success: false, error: 'RESEND_API_KEY is not configured' };
  }

  if (!to || !to.includes('@')) {
    return { success: false, error: 'Invalid email address' };
  }

  if (!subject.trim()) {
    return { success: false, error: 'Subject is required' };
  }

  if (!content.trim()) {
    return { success: false, error: 'Email content is empty' };
  }

  let html: string;

  if (editorMode === 'react-email') {
    try {
      html = await convertReactEmailToHtml(content);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to convert React Email code',
      };
    }
  } else {
    html = content;
  }

  const resend = new Resend(RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: RESEND_FROM_EMAIL,
    to,
    subject,
    html,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, id: data?.id || '' };
}
