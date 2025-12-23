import type { MaybeRef } from '@reactive-vscode/reactivity'
import type { Nullable } from '../utils'
import { useCommand } from './useCommand'

/**
 * Register multiple commands. See `vscode::commands.registerCommand`.
 *
 * @category commands
 */
export function useCommands(commands: Record<string, MaybeRef<Nullable<(...args: any[]) => any>>>) {
  for (const [command, callback] of Object.entries(commands)) {
    useCommand(command, callback)
  }
}
