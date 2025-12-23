import { defineConfig } from 'reactive-vscode'

export const config = defineConfig<{
  message: string
  test: {
    x: number[]
    y: object
  }
}>('reactive-vscode-demo')
