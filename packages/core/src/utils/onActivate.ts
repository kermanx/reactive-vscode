import type { ExtensionContext } from 'vscode'
import { extensionContext } from './defineExtension'

type OnActivateCb = (context: ExtensionContext) => void

/**
 * @internal
 */
export const activateCbs: OnActivateCb[] = []

/**
 * Registers a callback to be called after the extension has been activated.
 *
 * @category lifecycle
 */
export function onActivate(fn: OnActivateCb) {
  if (extensionContext.value) {
    fn(extensionContext.value)
  }
  else {
    activateCbs.push(fn)
  }
}
