import { defineExtension, defineLogger, useCommand, useIsDarkTheme, watchEffect } from 'reactive-vscode'
import { window } from 'vscode'
import { configs } from './configs'
import { calledTimes } from './states'
import { useDemoTreeView } from './treeView'
import { useDemoWebviewView } from './webviewView'

const logger = defineLogger('Reactive VSCode')

export = defineExtension(() => {
  logger.info('Extension Activated')
  logger.show()

  useCommand('reactive-vscode-demo.helloWorld', () => {
    window.showInformationMessage(configs.message)
    calledTimes.value++
  })

  const isDark = useIsDarkTheme()
  watchEffect(() => {
    logger.info('Is Dark Theme:', isDark.value)
  })

  useDemoTreeView()
  useDemoWebviewView()
})
