export default (identifier: string, displayName: string) => ({
  extension: `import { defineExtension, useCommand, useIsDarkTheme, watchEffect } from 'reactive-vscode'
import { window } from 'vscode'
import { config } from './config'
import { logger } from './utils'

export = defineExtension(() => {
  logger.info('Extension Activated')

  useCommand('${identifier}.helloWorld', () => {
    window.showInformationMessage(config.message)
  })

  const isDark = useIsDarkTheme()
  watchEffect(() => {
    logger.info('Is Dark Theme:', isDark.value)
  })
})
`,
  config: `import { defineConfig } from 'reactive-vscode'

export const config = defineConfig<{
  message: string
}>('${identifier}')
`,
  utils: `import { defineLogger } from 'reactive-vscode'

export const logger = defineLogger('${displayName}')
`,
})
