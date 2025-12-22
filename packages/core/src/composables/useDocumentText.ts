import type { TextDocument } from 'vscode'
import type { MaybeNullableRefOrGetter } from '../utils'
import { isRef, shallowRef, toValue, watch } from '@reactive-vscode/reactivity'
import { workspace } from 'vscode'
import { useDisposable } from './useDisposable'

/**
 * @reactive `TextDocument.getText`
 * @category document
 */
export function useDocumentText(doc: MaybeNullableRefOrGetter<TextDocument>) {
  const text = shallowRef(toValue(doc)?.getText())

  if (isRef(doc) || typeof doc === 'function') {
    watch(doc, (doc) => {
      text.value = doc?.getText()
    })
  }

  useDisposable(workspace.onDidChangeTextDocument((ev) => {
    if (ev.document === toValue(doc))
      text.value = ev.document.getText()
  }))

  return text
}
