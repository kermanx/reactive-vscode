import type { MaybeRef } from '@reactive-vscode/reactivity'
import type { commands } from 'vscode'
import type { Nullable } from '../utils'
import type { TextEditorCommandCallback } from './useTextEditorCommand'
import { useTextEditorCommand } from './useTextEditorCommand'

/**
 * @reactive {@linkcode commands.registerTextEditorCommand}
 * @category commands
 */
export function useTextEditorCommands(commands: Record<string, MaybeRef<Nullable<TextEditorCommandCallback>>>) {
  for (const [command, callback] of Object.entries(commands)) {
    useTextEditorCommand(command, callback)
  }
}
