import type { ComputedRef } from '@reactive-vscode/reactivity'
import type { ExtensionTerminalOptions, Terminal, TerminalOptions, TerminalShellIntegration, TerminalState } from 'vscode'
import { window } from 'vscode'
import { useDisposable } from './useDisposable'
import { useTerminalShellIntegration } from './useTerminalShellIntegration'
import { useTerminalState } from './useTerminalState'

interface UseTerminalReturn extends Pick<Terminal, 'sendText' | 'show' | 'hide' | 'dispose'> {
  terminal: Terminal

  /**
   * @see {@linkcode Terminal.state}
   */
  state: ComputedRef<TerminalState>

  /**
   * @see {@linkcode Terminal.shellIntegration}
   */
  shellIntegration: ComputedRef<TerminalShellIntegration>
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
    state: useTerminalState(terminal),
    shellIntegration: useTerminalShellIntegration(terminal),
    sendText: terminal.sendText.bind(terminal),
    show: terminal.show.bind(terminal),
    hide: terminal.hide.bind(terminal),
    dispose: terminal.dispose.bind(terminal),
  }
}
