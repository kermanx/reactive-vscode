import { shallowRef } from '@reactive-vscode/reactivity'
import { window } from 'vscode'
import { defineService } from '../utils'
import { useDisposable } from './useDisposable'

/**
 * @reactive `window.activeNotebookEditor`
 * @category editor
 */
export const useActiveNotebookEditor = defineService(() => {
  const activeNotebookEditor = shallowRef(window.activeNotebookEditor)

  useDisposable(window.onDidChangeActiveNotebookEditor((editor) => {
    activeNotebookEditor.value = editor
  }))

  return activeNotebookEditor
})
