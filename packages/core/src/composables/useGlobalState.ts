import type { Ref } from '@reactive-vscode/reactivity'
import type { MementoItemRef } from './useMementoItem'
import { extensionContext } from '../utils'
import { useMementoItem } from './useMementoItem'

/**
 * @reactive `ExtensionContext.globalState`
 * @category extension
 */
export function useGlobalState<T>(key: string): MementoItemRef<T>
export function useGlobalState<T>(key: string, defaultValue: T): Ref<T>
export function useGlobalState<T>(key: string, defaultValue?: any) {
  return useMementoItem<T>(extensionContext.value!.globalState, key, defaultValue)
}
