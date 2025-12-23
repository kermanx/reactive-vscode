import { defineConfigs } from 'reactive-vscode'

export const configs = defineConfigs<{
  message: string
  test: {
    x: number[]
    y: object
  }
}>('reactive-vscode-demo')
