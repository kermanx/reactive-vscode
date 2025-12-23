import type { MaybeRefOrGetter } from '@reactive-vscode/reactivity'
import type { FileSystemWatcher, GlobPattern, Uri } from 'vscode'
import { computed, onScopeDispose, readonly, shallowReactive, toValue, watch } from '@reactive-vscode/reactivity'
import { workspace } from 'vscode'
import { useEventEmitter } from './useEventEmitter'

/**
 * @reactive `workspace.createFileSystemWatcher`
 */
export function useFileSystemWatcher(
  globPatterns: MaybeRefOrGetter<GlobPattern | readonly GlobPattern[] | ReadonlySet<GlobPattern>>,
  handlers: {
    onDidCreate?: false | ((ev: Uri) => void)
    onDidChange?: false | ((ev: Uri) => void)
    onDidDelete?: false | ((ev: Uri) => void)
  } = {},
) {
  const watchers = shallowReactive(new Map<GlobPattern, FileSystemWatcher>())
  const createEmitter = useEventEmitter<Uri>()
  const changeEmitter = useEventEmitter<Uri>()
  const deleteEmitter = useEventEmitter<Uri>()

  const patterns = computed(() => {
    const patterns = toValue(globPatterns)
    return patterns instanceof Set
      ? patterns
      : new Set(
          Array.isArray(patterns)
            ? patterns
            : [patterns],
        )
  })

  function updateWatchers() {
    const newPatterns = patterns.value
    for (const [pattern, watcher] of watchers) {
      if (!newPatterns.has(pattern)) {
        watcher.dispose()
        watchers.delete(pattern)
      }
    }
    for (const pattern of newPatterns) {
      if (!watchers.has(pattern)) {
        const w = workspace.createFileSystemWatcher(
          pattern,
          handlers.onDidCreate === false,
          handlers.onDidChange === false,
          handlers.onDidDelete === false,
        )
        w.onDidCreate(createEmitter.fire)
        w.onDidChange(changeEmitter.fire)
        w.onDidDelete(deleteEmitter.fire)
        watchers.set(pattern, w)
      }
    }
  }

  function clearWatchers() {
    for (const watcher of watchers.values()) {
      watcher.dispose()
    }
    watchers.clear()
  }

  updateWatchers()
  watch(patterns, updateWatchers)
  onScopeDispose(clearWatchers)

  if (typeof handlers.onDidCreate === 'function') {
    createEmitter.event(handlers.onDidCreate)
  }
  if (typeof handlers.onDidChange === 'function') {
    changeEmitter.event(handlers.onDidChange)
  }
  if (typeof handlers.onDidDelete === 'function') {
    deleteEmitter.event(handlers.onDidDelete)
  }

  return {
    watchers: readonly(watchers),
    /**
     * @see {@link FileSystemWatcher.onDidCreate}
     */
    onDidCreate: createEmitter.event,
    /**
     * @see {@link FileSystemWatcher.onDidChange}
     */
    onDidChange: changeEmitter.event,
    /**
     * @see {@link FileSystemWatcher.onDidDelete}
     */
    onDidDelete: deleteEmitter.event,
  }
}
