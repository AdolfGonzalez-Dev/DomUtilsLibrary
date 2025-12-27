import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.js',
    'dom': 'src/dom/index.ts',
    'events': 'src/events/index.ts',
    'traverse': 'src/traverse/index.ts',
    'content': 'src/content/index.ts',
    'create': 'src/create/index.ts',
    'form': 'src/form/index.js',
    'reactive': 'src/reactive/signals.js'
  },
  outDir: 'dist',
  format: ['esm'],
  clean: true,
  globalName: 'DOMUtils',
  dts: true,
  sourcemap: true,
  minify: false,
  target: 'es2020',
  splitting: false,
  bundle: false,
  treeshake: true,
});