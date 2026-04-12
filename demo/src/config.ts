import { defineConfig } from 'reactive-vscode'

export const config = defineConfig<{
  message: string
}>('reactive-vscode-demo')
