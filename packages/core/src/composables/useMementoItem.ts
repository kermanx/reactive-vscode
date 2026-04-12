import type { WritableComputedRef } from '@reactive-vscode/reactivity'
import type { Memento } from 'vscode'
import { computed, shallowRef } from '@reactive-vscode/reactivity'

export type MementoItemRef<T> = WritableComputedRef<T, T | undefined> & {
  /**
   * Update the memento value. Compared to directly setting the `value`, this method
   * returns a promise that resolves when the value has been stored.
   *
   * If `undefined` is passed, the key will be deleted from the memento.
   *
   * @see {@linkcode Memento.update}
   */
  update: (newValue: T | undefined) => Promise<void>
}

/**
 * @internal
 */
export function useMementoItem<T>(memento: Memento, key: string): MementoItemRef<T | undefined>
export function useMementoItem<T>(memento: Memento, key: string, defaultValue: T): MementoItemRef<T>
export function useMementoItem<T>(memento: Memento, key: string, defaultValue?: any) {
  const value = shallowRef(memento.get<T>(key, defaultValue))

  const result = computed({
    get() {
      return value.value
    },
    set(newValue: T | undefined) {
      result.update(newValue)
    },
  }) as MementoItemRef<T | undefined>

  result.update = async (newValue: T | undefined) => {
    value.value = newValue === undefined ? defaultValue : newValue
    await memento.update(key, newValue)
  }

  return result
}
