import {
  type WatchOptions as BaseWatchOptions,
  type DebuggerOptions,
  type ReactiveMarker,
  type WatchCallback,
  type WatchEffect,
  type WatchHandle,
  type WatchSource,
  watch as baseWatch,
} from '@vue/reactivity'
import { type SchedulerJob, SchedulerJobFlags, queueJob } from './scheduler'
import { EMPTY_OBJ, extend, isFunction } from '@vue/shared'
import { callWithAsyncErrorHandling } from './errorHandling'
import { warn } from './warning'

export type {
  WatchHandle,
  WatchStopHandle,
  WatchEffect,
  WatchSource,
  WatchCallback,
  OnCleanup,
} from '@vue/reactivity'

type MaybeUndefined<T, I> = I extends true ? T | undefined : T

type MapSources<T, Immediate> = {
  [K in keyof T]: T[K] extends WatchSource<infer V>
    ? MaybeUndefined<V, Immediate>
    : T[K] extends object
      ? MaybeUndefined<T[K], Immediate>
      : never
}

export interface WatchEffectOptions extends DebuggerOptions {
  flush?: 'pre' | 'sync'
}

export interface WatchOptions<Immediate = boolean> extends WatchEffectOptions {
  immediate?: Immediate
  deep?: boolean | number
  once?: boolean
}

// Simple effect.
export function watchEffect(
  effect: WatchEffect,
  options?: WatchEffectOptions,
): WatchHandle {
  return doWatch(effect, null, options)
}

export function watchSyncEffect(
  effect: WatchEffect,
  options?: DebuggerOptions,
): WatchHandle {
  return doWatch(
    effect,
    null,
    __DEV__
      ? extend({}, options as WatchEffectOptions, { flush: 'sync' })
      : { flush: 'sync' },
  )
}

export type MultiWatchSources = (WatchSource<unknown> | object)[]

// overload: single source + cb
export function watch<T, Immediate extends Readonly<boolean> = false>(
  source: WatchSource<T>,
  cb: WatchCallback<T, MaybeUndefined<T, Immediate>>,
  options?: WatchOptions<Immediate>,
): WatchHandle

// overload: reactive array or tuple of multiple sources + cb
export function watch<
  T extends Readonly<MultiWatchSources>,
  Immediate extends Readonly<boolean> = false,
>(
  sources: readonly [...T] | T,
  cb: [T] extends [ReactiveMarker]
    ? WatchCallback<T, MaybeUndefined<T, Immediate>>
    : WatchCallback<MapSources<T, false>, MapSources<T, Immediate>>,
  options?: WatchOptions<Immediate>,
): WatchHandle

// overload: array of multiple sources + cb
export function watch<
  T extends MultiWatchSources,
  Immediate extends Readonly<boolean> = false,
>(
  sources: [...T],
  cb: WatchCallback<MapSources<T, false>, MapSources<T, Immediate>>,
  options?: WatchOptions<Immediate>,
): WatchHandle

// overload: watching reactive object w/ cb
export function watch<
  T extends object,
  Immediate extends Readonly<boolean> = false,
>(
  source: T,
  cb: WatchCallback<T, MaybeUndefined<T, Immediate>>,
  options?: WatchOptions<Immediate>,
): WatchHandle

// implementation
export function watch<T = any, Immediate extends Readonly<boolean> = false>(
  source: T | WatchSource<T>,
  cb: any,
  options?: WatchOptions<Immediate>,
): WatchHandle {
  if (__DEV__ && !isFunction(cb)) {
    warn(
      `\`watch(fn, options?)\` signature has been moved to a separate API. ` +
        `Use \`watchEffect(fn, options?)\` instead. \`watch\` now only ` +
        `supports \`watch(source, cb, options?) signature.`,
    )
  }
  return doWatch(source as any, cb, options)
}

function doWatch(
  source: WatchSource | WatchSource[] | WatchEffect | object,
  cb: WatchCallback | null,
  options: WatchOptions = EMPTY_OBJ,
): WatchHandle {
  const { immediate, deep, flush, once } = options

  if (__DEV__ && !cb) {
    if (immediate !== undefined) {
      warn(
        `watch() "immediate" option is only respected when using the ` +
          `watch(source, callback, options?) signature.`,
      )
    }
    if (deep !== undefined) {
      warn(
        `watch() "deep" option is only respected when using the ` +
          `watch(source, callback, options?) signature.`,
      )
    }
    if (once !== undefined) {
      warn(
        `watch() "once" option is only respected when using the ` +
          `watch(source, callback, options?) signature.`,
      )
    }
  }

  const baseWatchOptions: BaseWatchOptions = extend({}, options)

  if (__DEV__) baseWatchOptions.onWarn = warn

  // @ts-expect-error internal typedef
  baseWatchOptions.call = (fn, type, args) =>
    callWithAsyncErrorHandling(fn, null, type, args)

  // scheduler
  let isPre = false
  if (flush !== 'sync') {
    // default: 'pre'
    isPre = true
    baseWatchOptions.scheduler = (job, isFirstRun) => {
      if (isFirstRun) {
        job()
      } else {
        queueJob(job)
      }
    }
  }

  // @ts-expect-error internal typedef
  baseWatchOptions.augmentJob = (job: SchedulerJob) => {
    // important: mark the job as a watcher callback so that scheduler knows
    // it is allowed to self-trigger (#1727)
    if (cb) {
      job.flags! |= SchedulerJobFlags.ALLOW_RECURSE
    }
    if (isPre) {
      job.flags! |= SchedulerJobFlags.PRE
    }
  }

  const watchHandle = baseWatch(source, cb, baseWatchOptions)

  return watchHandle
}

export function createPathGetter(
  ctx: any,
  path: string,
): () => WatchSource | WatchSource[] | WatchEffect | object {
  const segments = path.split('.')
  return (): WatchSource | WatchSource[] | WatchEffect | object => {
    let cur = ctx
    for (let i = 0; i < segments.length && cur; i++) {
      cur = cur[segments[i] as keyof typeof cur]
    }
    return cur
  }
}
