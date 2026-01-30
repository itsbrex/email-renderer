import commonjsPlugin from '@babel/plugin-transform-modules-commonjs';
import { BASE_TAILWIND_CONFIG } from '@/lib/constants';
import * as EmailComponents from '@react-email/components';
import typescriptPreset from '@babel/preset-typescript';
import { pretty, render } from '@react-email/render';
import reactPreset from '@babel/preset-react';
import { transformSync } from '@babel/core';
import React from 'react';

export async function convertReactEmailToHtml(
  code: string,
  options: { prettify?: boolean } = {},
): Promise<string> {
  const { prettify = false } = options;

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

  return prettify ? await pretty(html) : html;
}
