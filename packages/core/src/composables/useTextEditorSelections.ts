import type { MaybeRefOrGetter } from '@reactive-vscode/reactivity'
import type { TextEditor, TextEditorSelectionChangeKind } from 'vscode'
import type { MaybeNullableRefOrGetter } from '../utils'
import { computed, isRef, shallowRef, toValue, watch } from '@reactive-vscode/reactivity'
import { window } from 'vscode'
import { useDisposable } from './useDisposable'

/**
 * @reactive `TextEditor.selections`
 * @category editor
 */
export function useTextEditorSelections(textEditor: MaybeNullableRefOrGetter<TextEditor>, acceptKind?: MaybeRefOrGetter<(TextEditorSelectionChangeKind | undefined)[]>) {
  const selections = shallowRef(toValue(textEditor)?.selections ?? [])

  if (isRef(textEditor) || typeof textEditor === 'function') {
    watch(textEditor, (textEditor) => {
      selections.value = textEditor?.selections ?? []
    })
  }

  useDisposable(window.onDidChangeTextEditorSelection((ev) => {
    if (ev.textEditor === toValue(textEditor)) {
      const kinds = toValue(acceptKind)
      if (!kinds || kinds.includes(ev.kind)) {
        selections.value = ev.selections
      }
    }
  }))

  return computed({
    get() {
      return selections.value
    },
    set(newSelections) {
      selections.value = newSelections
      const editor = toValue(textEditor)
      if (editor)
        editor.selections = newSelections
    },
  })
}
