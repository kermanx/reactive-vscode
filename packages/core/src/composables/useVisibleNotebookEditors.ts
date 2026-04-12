import { computed, shallowRef } from '@reactive-vscode/reactivity'
import { window } from 'vscode'
import { defineService } from '../utils'
import { useDisposable } from './useDisposable'

/**
 * @reactive {@linkcode window.visibleNotebookEditors}
 * @category editor
 */
export const useVisibleNotebookEditors = defineService(() => {
  const visibleNotebookEditors = shallowRef(window.visibleNotebookEditors)

  useDisposable(window.onDidChangeVisibleNotebookEditors((ev) => {
    visibleNotebookEditors.value = ev
  }))

  return computed(() => visibleNotebookEditors.value)
})
