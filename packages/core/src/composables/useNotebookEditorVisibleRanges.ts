import type { NotebookEditor } from 'vscode'
import type { MaybeNullableRefOrGetter } from '../utils'
import { computed, isRef, shallowRef, toValue, watch } from '@reactive-vscode/reactivity'
import { window } from 'vscode'
import { useDisposable } from './useDisposable'

/**
 * @reactive {@linkcode NotebookEditor.visibleRanges}
 * @category editor
 */
export function useNotebookEditorVisibleRanges(notebookEditor: MaybeNullableRefOrGetter<NotebookEditor>) {
  const ranges = shallowRef(toValue(notebookEditor)?.visibleRanges ?? [])

  if (isRef(notebookEditor) || typeof notebookEditor === 'function') {
    watch(notebookEditor, (notebookEditor) => {
      ranges.value = notebookEditor?.visibleRanges ?? []
    })
  }

  useDisposable(window.onDidChangeNotebookEditorVisibleRanges((ev) => {
    if (ev.notebookEditor === toValue(notebookEditor)) {
      ranges.value = ev.visibleRanges
    }
  }))

  return computed(() => ranges.value)
}
