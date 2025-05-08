import type { OutputChannel } from 'vscode'
import { useOutputChannel } from '../composables/useOutputChannel'

export function getDefaultLoggerPrefix(type: string) {
  const date = new Date()
  const year = String(date.getFullYear()).padStart(4, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  const second = String(date.getSeconds()).padStart(2, '0')
  const millisecond = String(date.getMilliseconds()).padStart(3, '0')
  return `${year}-${month}-${day} ${hour}:${minute}:${second}.${millisecond} [${type}] `
}

export interface UseLoggerOptions {
  outputChannel?: OutputChannel
  getPrefix?: ((type: string) => string) | null
}

/**
 * Creates a logger that writes to the output channel.
 *
 * @category view
 */
export function useLogger(name: string, options: UseLoggerOptions = {}) {
  const outputChannel = options.outputChannel ?? useOutputChannel(name, { log: true })

  const createLoggerFunc = (type: string) => (...message: any[]) => {
    outputChannel.appendLine((options.getPrefix?.(type) ?? '') + message.join(' '))
  }

  return {
    outputChannel,
    createLoggerFunc,
    info: createLoggerFunc('INFO'),
    warn: createLoggerFunc('WARN'),
    error: createLoggerFunc('ERROR'),
    append: outputChannel.append.bind(outputChannel),
    appendLine: outputChannel.appendLine.bind(outputChannel),
    replace: outputChannel.replace.bind(outputChannel),
    clear: outputChannel.clear.bind(outputChannel),
    show: outputChannel.show.bind(outputChannel),
    hide: outputChannel.hide.bind(outputChannel),
  }
}
