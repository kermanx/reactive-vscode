import type { MaybeRefOrGetter } from '@reactive-vscode/reactivity'
import { toValue, watchEffect } from '@reactive-vscode/reactivity'

export function useReactiveOptions<T extends object>(
  target: T,
  options: {
    [K in keyof T]?: MaybeRefOrGetter<T[K]>;
  },
  keys: (keyof T)[],
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
