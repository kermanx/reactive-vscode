import { computed, shallowRef } from '@reactive-vscode/reactivity'
import { env } from 'vscode'
import { defineService } from '../utils'
import { useDisposable } from './useDisposable'

/**
 * @reactive {@linkcode env.logLevel}
 */
export const useLogLevel = defineService(() => {
  const logLevel = shallowRef(env.logLevel)

  useDisposable(env.onDidChangeLogLevel((ev) => {
    logLevel.value = ev
  }))

  return computed(() => logLevel.value)
})
