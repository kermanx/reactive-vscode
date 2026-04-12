import { extensionScope } from './defineExtension'

/**
 * Define a service that should only be instantiated once.
 *
 * @category lifecycle
 */
export function defineService<T>(fn: () => T): () => T {
  let running = false
  let ran = false
  let result: T | undefined
  return () => {
    if (!ran) {
      if (running) {
        throw new Error('Cannot call a singleton composable recursively.')
      }
      try {
        running = true
        result = extensionScope.run(fn)!
      }
      finally {
        running = false
        ran = true
      }
    }
    return result!
  }
}
