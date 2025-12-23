import type { ComputedRef, Ref, ShallowRef, WritableComputedRef } from '@reactive-vscode/reactivity'
import type { Event } from 'vscode'

export type Nullable<T> = T | null | undefined

export type MaybeNullableRefOrGetter<T> = T
  | Ref<Nullable<T>>
  | ShallowRef<Nullable<T>>
  | WritableComputedRef<Nullable<T>>
  | ComputedRef<Nullable<T>>
  | (() => Nullable<T>)

export type Awaitable<T> = T | Promise<T>

export type EventListener<T extends Event<any>> = T extends Event<infer U> ? (e: U) => any : never
