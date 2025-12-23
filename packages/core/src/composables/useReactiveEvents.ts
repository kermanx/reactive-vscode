import type { Event } from 'vscode'
import type { MaybeNullableRefOrGetter } from '../utils'
import { isRef, toValue, watchEffect } from '@reactive-vscode/reactivity'

/**
 * @internal
 */
export function useReactiveEvents<T extends object, const K extends keyof T>(
  target: MaybeNullableRefOrGetter<T>,
  handlers: {
    [k in K]?: T[k] extends Event<infer U> ? (event: U) => void : never;
  },
  keys: readonly K[],
) {
  if (isRef(target) || typeof target === 'function') {
    watchEffect(() => {
      const t = toValue(target)
      if (t != null) {
        useReactiveEvents(t, handlers, keys)
      }
    })
    return
  }

  for (const key of keys) {
    const handler = handlers[key]
    if (handler != null) {
      (target[key] as Event<any>)(handler)
    }
  }
}
