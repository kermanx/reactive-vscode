import type { TextEditor } from 'vscode'
import type { MaybeNullableRefOrGetter } from '../utils'
import { computed, isRef, shallowRef, toValue, watch } from '@reactive-vscode/reactivity'
import { window } from 'vscode'
import { useDisposable } from './useDisposable'

/**
 * @reactive `TextEditor.visibleRanges`
 * @category editor
 */
export function useTextEditorVisibleRanges(textEditor: MaybeNullableRefOrGetter<TextEditor>) {
  const ranges = shallowRef(toValue(textEditor)?.visibleRanges ?? [])

  if (isRef(textEditor) || typeof textEditor === 'function') {
    watch(textEditor, (textEditor) => {
      ranges.value = textEditor?.visibleRanges ?? []
    })
  }

  useDisposable(window.onDidChangeTextEditorVisibleRanges((ev) => {
    if (ev.textEditor === toValue(textEditor)) {
      ranges.value = ev.visibleRanges
    }
  }))

  return computed(() => ranges.value)
}
