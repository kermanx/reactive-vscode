import type { ComputedRef, Ref, ShallowRef, WritableComputedRef } from '@reactive-vscode/reactivity'

export type Nullable<T> = T | null | undefined

export type MaybeNullableRefOrGetter<T> = T
  | Ref<Nullable<T>>
  | ShallowRef<Nullable<T>>
  | WritableComputedRef<Nullable<T>>
  | ComputedRef<Nullable<T>>
  | (() => Nullable<T>)

export type Awaitable<T> = T | Promise<T>

// Should be `WatchSource | ... | any`
export type AnyWatchSource = any
