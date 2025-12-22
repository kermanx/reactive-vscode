import type { Event } from 'vscode'

/**
 * @internal
 */
export function useReactiveEvents<T extends object, const K extends keyof T>(
  target: T,
  handlers: {
    [k in K]?: T[k] extends Event<infer U> ? (event: U) => void : never;
  },
  keys: readonly K[],
) {
  for (const key of keys) {
    const handler = handlers[key]
    if (handler != null) {
      (target[key] as Event<any>)(handler)
    }
  }
}
