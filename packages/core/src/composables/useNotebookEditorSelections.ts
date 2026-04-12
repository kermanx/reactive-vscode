import type { NotebookEditor } from 'vscode'
import type { MaybeNullableRefOrGetter } from '../utils'
import { computed, isRef, shallowRef, toValue, watch } from '@reactive-vscode/reactivity'
import { window } from 'vscode'
import { useDisposable } from './useDisposable'

/**
 * @reactive {@linkcode NotebookEditor.selections}
 * @category editor
 */
export function useNotebookEditorSelections(notebookEditor: MaybeNullableRefOrGetter<NotebookEditor>) {
  const selections = shallowRef(toValue(notebookEditor)?.selections ?? [])

  if (isRef(notebookEditor) || typeof notebookEditor === 'function') {
    watch(notebookEditor, (notebookEditor) => {
      selections.value = notebookEditor?.selections ?? []
    })
  }

  useDisposable(window.onDidChangeNotebookEditorSelection((ev) => {
    if (ev.notebookEditor === toValue(notebookEditor)) {
      selections.value = ev.selections
    }
  }))

  return computed({
    get() {
      return selections.value
    },
    set(newSelections) {
      selections.value = newSelections
      const editor = toValue(notebookEditor)
      if (editor)
        editor.selections = newSelections
    },
  })
}
