import type { ComputedRef, MaybeRefOrGetter } from '@reactive-vscode/reactivity'
import type { Terminal, TerminalState } from 'vscode'
import type { MaybeNullableRefOrGetter } from '../utils'
import { computed, isRef, shallowRef, toValue, watch } from '@reactive-vscode/reactivity'
import { window } from 'vscode'
import { useDisposable } from './useDisposable'

/**
 * @reactive {@linkcode Terminal.state}
 * @category terminal
 */
export function useTerminalState(terminal: MaybeRefOrGetter<Terminal>): ComputedRef<TerminalState>
export function useTerminalState(terminal: MaybeNullableRefOrGetter<Terminal>): ComputedRef<TerminalState | undefined>
export function useTerminalState(terminal: MaybeNullableRefOrGetter<Terminal>) {
  const state = shallowRef(toValue(terminal)?.state)

  if (isRef(terminal) || typeof terminal === 'function') {
    watch(terminal, (terminal) => {
      state.value = terminal?.state
    })
  }

  useDisposable(window.onDidChangeTerminalState((ev) => {
    if (ev === toValue(terminal))
      state.value = ev.state
  }))

  return computed(() => state.value)
}
