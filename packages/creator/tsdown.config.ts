import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./index.ts'],
  outDir: './dist',
  format: ['esm'],
  target: 'node18',
  clean: true,
  minify: true,
})
