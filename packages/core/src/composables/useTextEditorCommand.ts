import type { MaybeRef } from '@reactive-vscode/reactivity'
import type { Nullable } from '../utils'
import { isRef, watchEffect } from '@reactive-vscode/reactivity'
import { commands } from 'vscode'
import { useDisposable } from './useDisposable'

export type TextEditorCommandCallback = Parameters<typeof commands.registerTextEditorCommand>[1]

/**
 * Register a text editor command. See `vscode::commands.registerTextEditorCommand`.
 *
 * @category commands
 */
export function useTextEditorCommand(command: string, callback: MaybeRef<Nullable<TextEditorCommandCallback>>) {
  if (isRef(callback)) {
    watchEffect((onCleanup) => {
      if (callback.value) {
        const disposable = commands.registerTextEditorCommand(command, callback.value)
        onCleanup(() => disposable.dispose())
      }
    })
  }
  else if (callback) {
    useDisposable(commands.registerTextEditorCommand(command, callback))
  }
}
