import { type LogOutputChannel, type OutputChannel, window } from 'vscode'
import { useDisposable } from './useDisposable'

/**
 * @reactive `window.createOutputChannel`
 * @category view
 */
export function useOutputChannel(name: string, options: { log: true }): LogOutputChannel
export function useOutputChannel(name: string, languageId?: string): OutputChannel
export function useOutputChannel(name: string, languageIdOrOptions?: string | { log: true }) {
  return useDisposable(window.createOutputChannel(name, <string>languageIdOrOptions))
}
