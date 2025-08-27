import type { MaybeRefOrGetter } from '@reactive-vscode/reactivity'
import type { TreeDataProvider, TreeItem, TreeView, TreeViewOptions, ViewBadge } from 'vscode'
import type { AnyWatchSource, Awaitable } from '../utils'
import { toValue, watch } from '@reactive-vscode/reactivity'
import { window } from 'vscode'
import { createKeyedComposable } from '../utils'
import { useDisposable } from './useDisposable'
import { useEventEmitter } from './useEventEmitter'
import { useViewBadge } from './useViewBadge'
import { useViewTitle } from './useViewTitle'

export interface TreeViewNode {
  readonly children?: Awaitable<this[]>
  readonly treeItem: TreeItem | Thenable<TreeItem>
}

export type UseTreeViewOptions<T>
  = & Omit<TreeViewOptions<T>, 'treeDataProvider'>
    & Pick<TreeDataProvider<T>, 'resolveTreeItem'>
    & {
      title?: MaybeRefOrGetter<string | undefined>
      badge?: MaybeRefOrGetter<ViewBadge | undefined>
      /**
       * Additional watch source to trigger a change event. Useful when `treeItem` is a promise.
       */
      watchSource?: AnyWatchSource
    }

/**
 * Register a tree view. See `vscode::window.createTreeView`.
 *
 * @category view
 */
export const useTreeView = createKeyedComposable(
  <T extends TreeViewNode>(
    viewId: string,
    treeData: MaybeRefOrGetter<Awaitable<T[]>>,
    options?: UseTreeViewOptions<T>,
  ): TreeView<T> => {
    const changeEventEmitter = useEventEmitter<void>()

    watch(treeData, () => changeEventEmitter.fire())

    if (options?.watchSource)
      watch(options.watchSource, () => changeEventEmitter.fire())

    const childrenToParentMap = new WeakMap<T, T>()

    const view = useDisposable(window.createTreeView(viewId, {
      ...options,
      treeDataProvider: {
        ...options,
        onDidChangeTreeData: changeEventEmitter.event,
        getTreeItem(node: T) {
          return node.treeItem
        },
        async getChildren(node?: T) {
          if (node) {
            const children = await node.children
            children?.forEach(child => childrenToParentMap.set(child, node))
            return children
          }
          return toValue(treeData)
        },
        getParent(node: T) {
          return childrenToParentMap.get(node)
        },
      },
    }))

    if (options?.title)
      useViewTitle(view, options.title)

    if (options?.badge)
      useViewBadge(view, options.badge)

    return view
  },
  viewId => viewId,
)
