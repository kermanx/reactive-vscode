import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/extension.ts'],
  format: ['cjs'],
  target: 'node22',
  minify: false,
  sourcemap: true,
  external: [
    'vscode',
  ],
  define: {
    __DEV__: 'true',
  },
})
