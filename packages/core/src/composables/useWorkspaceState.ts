import type { Ref } from '@reactive-vscode/reactivity'
import type { UseMementoItemReturnWithoutDefault } from './useMementoItem'
import { extensionContext } from '../utils'
import { useMementoItem } from './useMementoItem'

export function useWorkspaceState<T>(key: string): UseMementoItemReturnWithoutDefault<T>
export function useWorkspaceState<T>(key: string, defaultValue: T): Ref<T>
export function useWorkspaceState<T>(key: string, defaultValue?: any) {
  return useMementoItem<T>(extensionContext.value!.workspaceState, key, defaultValue)
}
