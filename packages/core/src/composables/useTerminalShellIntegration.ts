import type { ComputedRef, MaybeRefOrGetter } from '@reactive-vscode/reactivity'
import type { Terminal, TerminalShellIntegration } from 'vscode'
import type { MaybeNullableRefOrGetter } from '../utils'
import { computed, isRef, shallowRef, toValue, watch } from '@reactive-vscode/reactivity'
import { window } from 'vscode'
import { useDisposable } from './useDisposable'

/**
 * @reactive {@linkcode Terminal.shellIntegration}
 * @category terminal
 */
export function useTerminalShellIntegration(terminal: MaybeRefOrGetter<Terminal>): ComputedRef<TerminalShellIntegration>
export function useTerminalShellIntegration(terminal: MaybeNullableRefOrGetter<Terminal>): ComputedRef<TerminalShellIntegration | undefined>
export function useTerminalShellIntegration(terminal: MaybeNullableRefOrGetter<Terminal>) {
  const shellIntegration = shallowRef(toValue(terminal)?.shellIntegration)

  if (isRef(terminal) || typeof terminal === 'function') {
    watch(terminal, (terminal) => {
      shellIntegration.value = terminal?.shellIntegration
    })
  }

  useDisposable(window.onDidChangeTerminalShellIntegration((ev) => {
    if (ev.terminal === toValue(terminal))
      shellIntegration.value = ev.shellIntegration
  }))

  return computed(() => shellIntegration.value)
}
