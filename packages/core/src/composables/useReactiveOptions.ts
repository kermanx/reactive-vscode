import type { MaybeRefOrGetter } from '@reactive-vscode/reactivity'
import type { MaybeNullableRefOrGetter } from '../utils'
import { toValue, watchEffect } from '@reactive-vscode/reactivity'

/**
 * @internal
 */
export function useReactiveOptions<T extends object, const K extends keyof T>(
  target: MaybeNullableRefOrGetter<T>,
  options: {
    [k in K]?: MaybeRefOrGetter<T[k]>;
  },
  keys: readonly K[],
) {
  for (const key of keys) {
    const value = options[key]
    if (value !== undefined) {
      watchEffect(() => {
        const t = toValue(target)
        if (t != null) {
          t[key] = toValue(value) as any
        }
      })
    }
  }
}
