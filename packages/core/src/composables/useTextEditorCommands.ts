import type { MaybeRef } from '@reactive-vscode/reactivity'
import type { Nullable } from '../utils'
import type { TextEditorCommandCallback } from './useTextEditorCommand'
import { useTextEditorCommand } from './useTextEditorCommand'

/**
 * Register multiple text editor commands. See `vscode::commands.registerTextEditorCommand`.
 *
 * @category commands
 */
export function useTextEditorCommands(commands: Record<string, MaybeRef<Nullable<TextEditorCommandCallback>>>) {
  for (const [command, callback] of Object.entries(commands)) {
    useTextEditorCommand(command, callback)
  }
}
