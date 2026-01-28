import { defineConfig } from 'tsup';

const nodeBuiltins = [
  'buffer',
  'stream',
  'util',
  'path',
  'fs',
  'crypto',
  'url',
  'http',
  'https',
  'zlib',
  'events',
  'os',
  'net',
  'tls',
  'dns',
  'child_process',
  'module',
];

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  outDir: 'dist',
  clean: true,
  platform: 'node',
  target: 'node20',
  banner: {
    js: `import { createRequire } from 'module'; const require = createRequire(import.meta.url);`,
  },
  esbuildOptions(options) {
    options.banner = {
      js: `import { createRequire } from 'module'; const require = createRequire(import.meta.url);`,
    };
    options.conditions = ['node', 'import', 'require'];
  },
  external: ['playwright', 'juice', ...nodeBuiltins],
  noExternal: ['@email-renderer/clients', '@email-renderer/types'],
});
