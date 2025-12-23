import { computed, shallowRef } from '@reactive-vscode/reactivity'
import { env } from 'vscode'
import { defineService } from '../utils'
import { useDisposable } from './useDisposable'

/**
 * @reactive `env.shell`
 */
export const useEnvShell = defineService(() => {
  const defaultShell = shallowRef(env.shell)

  useDisposable(env.onDidChangeShell((ev) => {
    defaultShell.value = ev
  }))

  return computed(() => defaultShell.value)
})
