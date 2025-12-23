import type { Disposable, Event } from 'vscode'
import { useDisposable } from './useDisposable'

/**
 * @category utilities
 * @reactive `Event`
 */
export function useEvent<T>(event: Event<T>, listeners?: ((e: T) => any)[]): Event<T> {
  const wrapped = (listener: (e: T) => any, thisArgs?: any, disposables?: Disposable[]) => {
    return useDisposable(event(listener, thisArgs, disposables))
  }

  listeners?.forEach(listener => wrapped(listener))

  return wrapped
}
