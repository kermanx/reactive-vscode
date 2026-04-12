import type { ExtensionContext } from 'vscode'
import { effectScope, shallowRef } from '@reactive-vscode/reactivity'
import { activateCbs } from './onActivate'
import { deactivateCbs } from './onDeactivate'

export const extensionContext = shallowRef<ExtensionContext | null>(null!)

/**
 * @internal
 */
export const extensionScope = effectScope()

/**
 * Define a new extension.
 *
 * @category lifecycle
 */
export function defineExtension<T>(setup: (context: ExtensionContext) => T) {
  return {
    activate: (context: ExtensionContext) => {
      extensionContext.value = context
      return extensionScope.run(() => {
        activateCbs.forEach(fn => fn(context))
        return setup(context)
      })
    },
    deactivate: async () => {
      await Promise.allSettled(deactivateCbs.map(fn => fn()))
      extensionScope.stop()
    },
  }
}
