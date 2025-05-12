export default `import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/extension.ts'],
  format: ['cjs'],
  target: 'node18',
  minify: true,
  external: [
    'vscode',
  ],
})
`
