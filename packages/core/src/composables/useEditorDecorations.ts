import type { MaybeRef, MaybeRefOrGetter } from '@reactive-vscode/reactivity'
import type { DecorationOptions, DecorationRenderOptions, Disposable, Range, TextEditor, TextEditorDecorationType } from 'vscode'
import type { Awaitable, MaybeNullableRefOrGetter } from '../utils/types'
import { computed, onScopeDispose, toValue, unref } from '@reactive-vscode/reactivity'
import { window, workspace } from 'vscode'
import { useDisposable } from './useDisposable'

export interface UseEditorDecorationsOptions {
  /**
   * The triggers to update the decorations.
   *
   * @default true
   */
  watchDocumentChange?: boolean

  /**
   * Immediately trigger an update.
   *
   * @default true
   */
  immediate?: boolean
}

/**
 * Reactively set decorations on the given editor.
 *
 * @see {@linkcode TextEditor.setDecorations}
 * @category editor
 */
export function useEditorDecorations(
  editor: MaybeNullableRefOrGetter<TextEditor>,
  decorationTypeOrOptions: MaybeRefOrGetter<TextEditorDecorationType | DecorationRenderOptions>,
  decorations:
    | MaybeRef<readonly Range[] | readonly DecorationOptions[]>
    | ((editor: TextEditor) => Awaitable<readonly Range[] | readonly DecorationOptions[]>),
  options: UseEditorDecorationsOptions = {},
) {
  let decorationTypeDisposable: Disposable | undefined
  const decorationType = computed<TextEditorDecorationType>(() => {
    decorationTypeDisposable?.dispose()
    decorationTypeDisposable = undefined

    const decorationTypeOrOptionsValue = toValue(decorationTypeOrOptions)
    if ('key' in decorationTypeOrOptionsValue) {
      return decorationTypeOrOptionsValue
    }

    const decoration = window.createTextEditorDecorationType(decorationTypeOrOptionsValue)
    decorationTypeDisposable = decoration
    return decoration
  })
  onScopeDispose(() => decorationTypeDisposable?.dispose())

  const update = async () => {
    const editorValue = toValue(editor)
    if (!editorValue)
      return

    editorValue.setDecorations(
      decorationType.value,
      typeof decorations === 'function'
        ? await decorations(editorValue)
        : unref(decorations),
    )
  }

  if (options.watchDocumentChange ?? true) {
    useDisposable(workspace.onDidChangeTextDocument(async (ev) => {
      if (toValue(editor)?.document === ev.document) {
        await update()
      }
    }))
  }

  if (options.immediate ?? true) {
    update()
  }

  return {
    /**
     * Manually trigger the decoration update.
     */
    update,
  }
}
