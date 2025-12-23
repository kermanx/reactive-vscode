import type { Ref } from '@reactive-vscode/reactivity'
import type { MementoItemRef } from './useMementoItem'
import { extensionContext } from '../utils'
import { useMementoItem } from './useMementoItem'

/**
 * @reactive `ExtensionContext.workspaceState`
 * @category extension
 */
export function useWorkspaceState<T>(key: string): MementoItemRef<T>
export function useWorkspaceState<T>(key: string, defaultValue: T): Ref<T>
export function useWorkspaceState<T>(key: string, defaultValue?: any) {
  return useMementoItem<T>(extensionContext.value!.workspaceState, key, defaultValue)
}
