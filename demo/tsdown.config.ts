import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/extension.ts'],
  format: ['esm'],
  target: 'node20',
  minify: true,
  external: [
    'vscode',
  ],
  define: {
    __DEV__: 'true',
  },
})
