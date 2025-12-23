import type { MaybeRefOrGetter } from '@reactive-vscode/reactivity'
import type { Selection, TextEditor, TextEditorSelectionChangeKind } from 'vscode'
import type { MaybeNullableRefOrGetter } from '../utils'
import { computed } from '@reactive-vscode/reactivity'
import { useTextEditorSelections } from './useTextEditorSelections'

/**
 * @reactive {@linkcode TextEditor.selection}
 * @category editor
 */
export function useTextEditorSelection(textEditor: MaybeNullableRefOrGetter<TextEditor>, acceptKind?: MaybeRefOrGetter<(TextEditorSelectionChangeKind | undefined)[]>) {
  const selections = useTextEditorSelections(textEditor, acceptKind)

  return computed<Selection | undefined>({
    get() {
      return selections.value[0]
    },
    set(newSelection) {
      selections.value = newSelection ? [newSelection] : []
    },
  })
}
