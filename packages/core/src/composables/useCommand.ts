import type { MaybeRef } from '@reactive-vscode/reactivity'
import type { Nullable } from '../utils'
import { isRef, watchEffect } from '@reactive-vscode/reactivity'
import { commands } from 'vscode'
import { useDisposable } from './useDisposable'

/**
 * @reactive {@linkcode commands.registerCommand}
 * @category commands
 */
export function useCommand(command: string, callback: MaybeRef<Nullable<(...args: any[]) => any>>) {
  if (isRef(callback)) {
    watchEffect((onCleanup) => {
      if (callback.value) {
        const disposable = commands.registerCommand(command, callback.value)
        onCleanup(() => disposable.dispose())
      }
    })
  }
  else if (callback) {
    useDisposable(commands.registerCommand(command, callback))
  }
}
