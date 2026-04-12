import { computed, shallowRef } from '@reactive-vscode/reactivity'
import { debug } from 'vscode'
import { defineService } from '../utils'
import { useDisposable } from './useDisposable'

/**
 * @reactive {@linkcode debug.activeDebugSession}
 */
export const useActiveDebugSession = defineService(() => {
  const session = shallowRef(debug.activeDebugSession)

  useDisposable(debug.onDidChangeActiveDebugSession((ev) => {
    session.value = ev
  }))

  return computed(() => session.value)
})
