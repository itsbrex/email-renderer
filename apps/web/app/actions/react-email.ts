'use server';

import commonjsPlugin from '@babel/plugin-transform-modules-commonjs';
import type { RenderResponse, ClientId } from '@email-renderer/types';
import * as EmailComponents from '@react-email/components';
import typescriptPreset from '@babel/preset-typescript';
import { render, pretty } from '@react-email/render';
import reactPreset from '@babel/preset-react';
import { transformSync } from '@babel/core';
import React from 'react';

const RENDERER_URL = process.env.RENDERER_URL || 'http://localhost:3001';
const RENDERER_API_KEY = process.env.RENDERER_API_KEY;
const VALID_CLIENTS: ClientId[] = ['gmail-web', 'apple-mail', 'outlook-win', 'yahoo-mail'];

const BASE_TAILWIND_CONFIG = {
  content: [],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        black: '#000000',
        white: '#ffffff',
        grey: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        red: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        blue: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        green: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        yellow: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        indigo: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        mono: ['Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
      },
      fontSize: {
        xs: ['12px', { lineHeight: '16px' }],
        sm: ['14px', { lineHeight: '20px' }],
        base: ['16px', { lineHeight: '24px' }],
        lg: ['18px', { lineHeight: '28px' }],
        xl: ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
        '4xl': ['36px', { lineHeight: '40px' }],
        '5xl': ['48px', { lineHeight: '1' }],
        '6xl': ['60px', { lineHeight: '1' }],
      },
      spacing: {
        px: '1px',
        0: '0',
        0.5: '2px',
        1: '4px',
        1.5: '6px',
        2: '8px',
        2.5: '10px',
        3: '12px',
        3.5: '14px',
        4: '16px',
        5: '20px',
        6: '24px',
        7: '28px',
        8: '32px',
        9: '36px',
        10: '40px',
        11: '44px',
        12: '48px',
        14: '56px',
        16: '64px',
        20: '80px',
        24: '96px',
        28: '112px',
        32: '128px',
        36: '144px',
        40: '160px',
        44: '176px',
        48: '192px',
        52: '208px',
        56: '224px',
        60: '240px',
        64: '256px',
        72: '288px',
        80: '320px',
        96: '384px',
      },
      borderRadius: {
        none: '0',
        sm: '2px',
        DEFAULT: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
        '2xl': '16px',
        '3xl': '24px',
        full: '9999px',
      },
    },
  },
  plugins: [],
};

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
  const html = await render(React.createElement(Component, props));
  return await pretty(html);
}

export async function renderReactEmail(reactEmailCode: string, clients: ClientId[]) {
  if (!reactEmailCode || typeof reactEmailCode !== 'string') {
    throw new Error("Missing or invalid 'reactEmailCode' field");
  }

  const jsxCode = reactEmailCode.trim();
  if (!jsxCode) {
    throw new Error('React Email code cannot be empty');
  }

  if (!clients || !Array.isArray(clients)) {
    throw new Error("Missing or invalid 'clients' field");
  }

  const invalidClients = clients.filter((id: unknown) => !VALID_CLIENTS.includes(id as ClientId));

  if (invalidClients.length > 0) {
    throw new Error(`Invalid client IDs: ${invalidClients.join(', ')}`);
  }

  let html: string;
  try {
    html = await convertReactEmailToHtml(jsxCode);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to convert React Email code');
  }

  if (!RENDERER_API_KEY) {
    throw new Error('RENDERER_API_KEY is not configured');
  }

  const response = await fetch(`${RENDERER_URL}/render`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RENDERER_API_KEY}`,
    },
    body: JSON.stringify({ html, clients }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Renderer error:', errorText);
    throw new Error('Render service error');
  }

  const data: RenderResponse = await response.json();
  return {
    ...data,
    convertedHtml: html,
  };
}
