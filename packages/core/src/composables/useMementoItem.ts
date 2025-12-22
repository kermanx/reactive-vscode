import type { Ref } from '@reactive-vscode/reactivity'
import type { Memento } from 'vscode'
import { shallowRef } from '@reactive-vscode/reactivity'

/**
 * @internal
 */
export type UseMementoItemReturnWithoutDefault<T> = Ref<T | undefined> & {
  /**
   * Set the memento value. Compared to directly setting the `value`, this method
   * returns a promise that resolves when the value has been stored.
   *
   * If `undefined` is passed, the key will be deleted from the memento.
   */
  set: (newValue: T | undefined) => Promise<void>
}

export function useMementoItem<T>(memento: Memento, key: string): UseMementoItemReturnWithoutDefault<T>
export function useMementoItem<T>(memento: Memento, key: string, defaultValue: T): Ref<T>
export function useMementoItem<T>(memento: Memento, key: string, defaultValue?: any) {
  const value = shallowRef(memento.get<T>(key, defaultValue))

  // @ts-expect-error - extra methods on ref
  value.set = async (newValue: T | undefined) => {
    value.value = newValue
    await memento.update(key, newValue)
  }

  return value
}
