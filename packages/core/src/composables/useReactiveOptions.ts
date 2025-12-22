import type { MaybeRefOrGetter } from '@reactive-vscode/reactivity'
import { toValue, watchEffect } from '@reactive-vscode/reactivity'

/**
 * @internal
 */
export function useReactiveOptions<T extends object, const K extends keyof T>(
  target: T,
  options: {
    [k in K]?: MaybeRefOrGetter<T[k]>;
  },
  keys: readonly K[],
) {
  for (const key of keys) {
    const value = options[key]
    if (value !== undefined) {
      watchEffect(() => {
        target[key] = toValue(value) as any
      })
    }
  }
}
