import { defineExtension, useCommand, useIsDarkTheme, useLogger, watchEffect } from 'reactive-vscode'
import { window } from 'vscode'
import { message } from './configs'
import { calledTimes } from './states'
import { useDemoTreeView } from './treeView'
import { useDemoWebviewView } from './webviewView'

const logger = useLogger('Reactive VSCode')

export const { activate, deactivate } = defineExtension(() => {
  logger.info('Extension Activated')
  logger.show()

  useCommand('reactive-vscode-demo.helloWorld', () => {
    window.showInformationMessage(message.value)
    calledTimes.value++
  })

  const isDark = useIsDarkTheme()
  watchEffect(() => {
    logger.info('Is Dark Theme:', isDark.value)
  })

  useDemoTreeView()
  useDemoWebviewView()
})
