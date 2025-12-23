import type { WritableComputedRef } from '@reactive-vscode/reactivity'
import type { ExtensionContext } from 'vscode'
import { computed, shallowRef } from '@reactive-vscode/reactivity'
import { extensionContext } from '../utils'
import { useDisposable } from './useDisposable'

export type ExtensionSecretRef = WritableComputedRef<string | null | undefined, string | undefined> & {
  /**
   * Set the secret value. Compared to directly setting the `value`, this method
   * returns a promise that resolves when the secret has been stored.
   */
  set: (newValue: string) => Promise<void>
  /**
   * Remove the secret value. Compared to directly setting the `value` to `undefined`,
   * this method returns a promise that resolves when the secret has been deleted.
   */
  remove: () => Promise<void>
}

/**
 * Get a reactive secret value from the extension's secrets.
 *
 * - `null` indicates that the value has not been loaded yet.
 * - `undefined` indicates that there is no value stored for the given key.
 *
 * @reactive {@linkcode ExtensionContext.secrets}
 * @category extension
 */
export function useExtensionSecret(key: string): ExtensionSecretRef {
  const secrets = extensionContext.value!.secrets

  const value = shallowRef<string | null | undefined>(null)

  secrets.get(key).then((secret) => {
    value.value = secret
  })

  useDisposable(secrets.onDidChange(async (ev) => {
    if (ev.key === key) {
      value.value = await secrets.get(key)
    }
  }))

  const set = async (newValue: string) => {
    value.value = newValue
    await secrets.store(key, newValue)
  }

  const remove = async () => {
    value.value = undefined
    await secrets.delete(key)
  }

  const result = computed({
    get() {
      return value.value
    },
    set(newValue: string | undefined) {
      if (newValue === undefined) {
        remove()
      }
      else {
        set(newValue)
      }
    },
  }) as ExtensionSecretRef
  result.set = set
  result.remove = remove

  return result
}
