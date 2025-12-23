import { computed, shallowRef } from '@reactive-vscode/reactivity'
import { window } from 'vscode'
import { defineService } from '../utils'
import { useDisposable } from './useDisposable'

/**
 * @reactive `window.visibleTextEditors`
 * @category editor
 */
export const useVisibleTextEditors = defineService(() => {
  const visibleTextEditors = shallowRef(window.visibleTextEditors)

  useDisposable(window.onDidChangeVisibleTextEditors((ev) => {
    visibleTextEditors.value = ev
  }))

  return computed(() => visibleTextEditors.value)
})
