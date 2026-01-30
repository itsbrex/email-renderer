'use server';

import commonjsPlugin from '@babel/plugin-transform-modules-commonjs';
import { BASE_TAILWIND_CONFIG } from '@/lib/constants';
import * as EmailComponents from '@react-email/components';
import typescriptPreset from '@babel/preset-typescript';
import { render } from '@react-email/render';
import reactPreset from '@babel/preset-react';
import { transformSync } from '@babel/core';
import type { EditorMode } from '@email-renderer/types';
import { Resend } from 'resend';
import React from 'react';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

type SendTestEmailResult =
  | { success: true; id: string }
  | { success: false; error: string };

async function convertReactEmailToHtml(code: string): Promise<string> {
  let processedCode = code;

  processedCode = processedCode.replace(
    /import\s+.*?\s+from\s+['"][^'"]*tailwind\.config['"];?/g,
    `const tailwindConfig = ${JSON.stringify(BASE_TAILWIND_CONFIG)};`,
  );

  processedCode = processedCode.replace(/process\.env\.(\w+)/g, (match, envVar) => {
    return `(typeof process !== 'undefined' && process.env && process.env.${envVar}) || ''`;
  });

  const result = transformSync(processedCode, {
    presets: [
      [typescriptPreset, { isTSX: true, allExtensions: true }],
      [reactPreset, { runtime: 'classic' }],
    ],
    plugins: [[commonjsPlugin, { loose: true }]],
    filename: 'email.tsx',
  });

  if (!result?.code) {
    throw new Error('Failed to transform TSX code');
  }

  const requireFn = (id: string) => {
    if (id === 'react') return React;
    if (id === '@react-email/components') return EmailComponents;
    if (id.includes('tailwind.config')) return BASE_TAILWIND_CONFIG;
    throw new Error(
      `Cannot find module '${id}'. Only 'react' and '@react-email/components' are supported.`,
    );
  };

  const processEnv = {
    VERCEL_URL: process.env.VERCEL_URL || '',
    NODE_ENV: process.env.NODE_ENV || 'development',
  };

  const moduleObj = { exports: {} };
  const exportsObj = moduleObj.exports;
  const processObj = { env: processEnv };

  const func = new Function(
    'require',
    'React',
    'EmailComponents',
    'module',
    'exports',
    'process',
    `${result.code}\nreturn module.exports.default || module.exports;`,
  );

  const Component = func(requireFn, React, EmailComponents, moduleObj, exportsObj, processObj);

  if (!Component || typeof Component !== 'function') {
    throw new Error('Code must export a default React component function');
  }

  const props = Component.PreviewProps || {};
  return await render(React.createElement(Component, props));
}

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
