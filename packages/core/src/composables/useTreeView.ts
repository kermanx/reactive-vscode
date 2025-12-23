import type { MaybeRefOrGetter } from '@reactive-vscode/reactivity'
import type { TreeDataProvider, TreeItem, TreeView, TreeViewOptions } from 'vscode'
import type { Awaitable, EventListener } from '../utils'
import { shallowRef, toValue, watch } from '@reactive-vscode/reactivity'
import { window } from 'vscode'
import { useDisposable } from './useDisposable'
import { useEventEmitter } from './useEventEmitter'
import { useReactiveEvents } from './useReactiveEvents'
import { useReactiveOptions } from './useReactiveOptions'
import { useViewVisibility } from './useViewVisibility'

export interface TreeViewNode {
  readonly children?: Awaitable<this[]>
  readonly treeItem: TreeItem | Thenable<TreeItem>
}

export type TreeViewProps<T>
  = & Omit<TreeViewOptions<T>, 'treeDataProvider'>
    & Pick<TreeDataProvider<T>, 'resolveTreeItem'>
    & {
      /**
       * @see {@linkcode TreeView.onDidExpandElement}
       */
      onDidExpandElement?: EventListener<TreeView<T>['onDidExpandElement']>

      /**
       * @see {@linkcode TreeView.onDidCollapseElement}
       */
      onDidCollapseElement?: EventListener<TreeView<T>['onDidCollapseElement']>

      /**
       * @see {@linkcode TreeView.onDidChangeSelection}
       */
      onDidChangeSelection?: EventListener<TreeView<T>['onDidChangeSelection']>

      /**
       * @see {@linkcode TreeView.onDidChangeVisibility}
       */
      onDidChangeVisibility?: EventListener<TreeView<T>['onDidChangeVisibility']>

      /**
       * @see {@linkcode TreeView.onDidChangeCheckboxState}
       */
      onDidChangeCheckboxState?: EventListener<TreeView<T>['onDidChangeCheckboxState']>

      /**
       * @see {@linkcode TreeView.message}
       */
      message?: MaybeRefOrGetter<TreeView<T>['message']>

      /**
       * @see {@linkcode TreeView.title}
       */
      title?: MaybeRefOrGetter<TreeView<T>['title']>

      /**
       * @see {@linkcode TreeView.description}
       */
      description?: MaybeRefOrGetter<TreeView<T>['description']>

      /**
       * @see {@linkcode TreeView.badge}
       */
      badge?: MaybeRefOrGetter<TreeView<T>['badge']>
    }

/**
 * Register a tree view. See `vscode::window.createTreeView`.
 *
 * @category view
 */
export function useTreeView<T extends TreeViewNode>(
  viewId: string,
  treeData: MaybeRefOrGetter<Awaitable<T[]>>,
  options: TreeViewProps<T> = {},
) {
  const changeEventEmitter = useEventEmitter<void>()
  const childrenToParentMap = new WeakMap<T, T>()
  const view = useDisposable(window.createTreeView<T>(viewId, {
    ...options,
    treeDataProvider: {
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
      resolveTreeItem: options.resolveTreeItem,
    },
  }))

  watch(treeData, () => changeEventEmitter.fire())

  useReactiveOptions(view, options, [
    'message',
    'title',
    'description',
    'badge',
  ])

  useReactiveEvents(view, options, [
    'onDidExpandElement',
    'onDidCollapseElement',
    'onDidChangeSelection',
    'onDidChangeVisibility',
    'onDidChangeCheckboxState',
  ])

  const selection = shallowRef(view.selection)
  useDisposable(view.onDidChangeSelection((e) => {
    selection.value = e.selection
  }))

  return {
    view,
    /**
     * @see {@linkcode TreeView.selection}
     */
    selection,
    /**
     * @see {@linkcode TreeView.visible}
     */
    visible: useViewVisibility(view),
    /**
     * @see {@linkcode TreeView.reveal}
     */
    reveal: view.reveal.bind(view),
  }
}
