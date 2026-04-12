import type { TreeViewNode } from 'reactive-vscode'
import { computed, defineService, useTreeView } from 'reactive-vscode'
import { TreeItemCollapsibleState } from 'vscode'

export const useDemoTreeView = defineService(() => {
  function getRootNode(index: number) {
    return {
      children: [
        getChildNode(index * 10 + 1),
        getChildNode(index * 10 + 2),
      ],
      treeItem: {
        label: `Root ${index}`,
        collapsibleState: TreeItemCollapsibleState.Expanded,
      },
    }
  }

  function getChildNode(index: number) {
    return {
      treeItem: {
        label: `Child ${index}`,
        collapsibleState: TreeItemCollapsibleState.None,
      },
    }
  }

  const treeData = computed(() => {
    const roots: TreeViewNode[] = []
    for (let i = 1; i < 5; i++)
      roots.push(getRootNode(i))
    return roots
  })

  const view = useTreeView(
    'reactive-tree-view',
    treeData,
    {
      title: () => `Tree with ${treeData.value.length} roots`,
    },
  )

  // return anything you want to expose
  return view
})
