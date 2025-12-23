import { computed, shallowRef } from '@reactive-vscode/reactivity'
import { window } from 'vscode'
import { defineService } from '../utils'
import { useDisposable } from './useDisposable'

/**
 * @reactive {@linkcode window.activeTextEditor}
 * @category editor
 */
export const useActiveTextEditor = defineService(() => {
  const activeTextEditor = shallowRef(window.activeTextEditor)

  useDisposable(window.onDidChangeActiveTextEditor((editor) => {
    activeTextEditor.value = editor
  }))

  return computed(() => activeTextEditor.value)
})
