import type { TextEditor } from 'vscode'
import type { MaybeNullableRefOrGetter } from '../utils'
import { computed, isRef, shallowRef, toValue, watch } from '@reactive-vscode/reactivity'
import { window } from 'vscode'
import { useDisposable } from './useDisposable'

/**
 * @reactive `TextEditor.viewColumn`
 * @category editor
 */
export function useTextEditorViewColumn(textEditor: MaybeNullableRefOrGetter<TextEditor>) {
  const viewColumn = shallowRef(toValue(textEditor)?.viewColumn)

  if (isRef(textEditor) || typeof textEditor === 'function') {
    watch(textEditor, (textEditor) => {
      viewColumn.value = textEditor?.viewColumn
    })
  }

  useDisposable(window.onDidChangeTextEditorViewColumn((ev) => {
    if (ev.textEditor === toValue(textEditor)) {
      viewColumn.value = ev.viewColumn
    }
  }))

  return computed(() => viewColumn.value)
}
