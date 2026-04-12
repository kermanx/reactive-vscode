import type { NotebookEditor, NotebookRange } from 'vscode'
import type { MaybeNullableRefOrGetter } from '../utils'
import { computed } from '@reactive-vscode/reactivity'
import { useNotebookEditorSelections } from './useNotebookEditorSelections'

/**
 * @reactive {@linkcode NotebookEditor.selection}
 * @category editor
 */
export function useNotebookEditorSelection(notebookEditor: MaybeNullableRefOrGetter<NotebookEditor>) {
  const selections = useNotebookEditorSelections(notebookEditor)

  return computed<NotebookRange | undefined>({
    get() {
      return selections.value[0]
    },
    set(newSelection) {
      selections.value = newSelection ? [newSelection] : []
    },
  })
}
