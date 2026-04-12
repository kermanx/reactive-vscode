import type { Awaitable } from './types'

type OnDeactivateCb = () => Awaitable<void>

/**
 * @internal
 */
export const deactivateCbs: OnDeactivateCb[] = []

/**
 * Registers a callback to be called when the extension is deactivated.
 *
 * @category lifecycle
 */
export function onDeactivate(fn: OnDeactivateCb) {
  deactivateCbs.push(fn)
}
