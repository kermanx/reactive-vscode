import type { Disposable } from 'vscode'
import { getCurrentScope } from '@reactive-vscode/reactivity'
import { extensionScope } from '../utils'

/**
 * Dispose the disposable when the current scope is disposed.
 *
 * @see {@linkcode Disposable}
 * @category lifecycle
 */
export function useDisposable<T extends Disposable>(disposable: T): T {
  const scope = getCurrentScope() ?? extensionScope

  // @ts-expect-error internal property
  scope.cleanups.push(disposable.dispose.bind(disposable))

  return disposable
}
