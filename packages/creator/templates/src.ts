export default (identifier: string, displayName: string) => ({
  extension: `import { defineExtension, useCommand, useIsDarkTheme, watchEffect } from 'reactive-vscode'
import { window } from 'vscode'
import { message } from './configs'
import { logger } from './utils'

export const { activate, deactivate } = defineExtension(() => {
  logger.info('Extension Activated')

  useCommand('${identifier}.helloWorld', () => {
    window.showInformationMessage(message.value)
  })

  const isDark = useIsDarkTheme()
  watchEffect(() => {
    logger.info('Is Dark Theme:', isDark.value)
  })
})
`,
  configs: `import { defineConfigs } from 'reactive-vscode'

export const { message } = defineConfigs('${identifier}', {
  message: 'string',
})
`,
  utils: `import { defineLogger } from 'reactive-vscode'

export const logger = defineLogger('${displayName}')
`,
})
