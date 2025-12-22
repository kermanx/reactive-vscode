import type { ComputedRef } from '@reactive-vscode/reactivity'
import type { ExtensionTerminalOptions, Terminal, TerminalOptions, TerminalState } from 'vscode'
import { window } from 'vscode'
import { useDisposable } from './useDisposable'
import { useTerminalState } from './useTerminalState'

interface UseTerminalReturn extends Omit<Terminal, 'state' | 'dispose'> {
  terminal: Terminal
  state: ComputedRef<TerminalState>
}

/**
 * @category terminal
 * @reactive `window.createTerminal()`
 */
export function useTerminal(name?: string, shellPath?: string, shellArgs?: readonly string[] | string): UseTerminalReturn
export function useTerminal(options: TerminalOptions): UseTerminalReturn
export function useTerminal(options: ExtensionTerminalOptions): UseTerminalReturn
export function useTerminal(...args: any[]): UseTerminalReturn {
  const terminal = useDisposable(window.createTerminal(...args))

  return {
    terminal,
    get name() {
      return terminal.name
    },
    get processId() {
      return terminal.processId
    },
    get creationOptions() {
      return terminal.creationOptions
    },
    get exitStatus() {
      return terminal.exitStatus
    },
    get shellIntegration() {
      return terminal.shellIntegration
    },
    sendText: terminal.sendText.bind(terminal),
    show: terminal.show.bind(terminal),
    hide: terminal.hide.bind(terminal),
    state: useTerminalState(terminal),
  }
}
