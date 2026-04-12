/// <reference types="vitest/config" />
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    include: ['./test/**/*.test.ts'],
    alias: {
      vscode: resolve('./test/mock/vscode.ts'),
    },
  },
})
