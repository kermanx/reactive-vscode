export default `import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/extension.ts'],
  format: ['cjs'],
  target: 'node22',
  minify: true,
  sourcemap: true,
  external: [
    'vscode',
  ],
})
`
