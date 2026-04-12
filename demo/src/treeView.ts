import type { TreeViewNode } from 'reactive-vscode'
import { computed, defineService, useTreeView } from 'reactive-vscode'
import { TreeItemCollapsibleState } from 'vscode'
import { calledTimes } from './states'

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
    roots.push({
      treeItem: {
        label: `Run the "Hello World" command to add items`,
      },
    })
    for (let i = 0; i < calledTimes.value; i++)
      roots.push(getRootNode(i))
    return roots
  })

  return useTreeView(
    'reactive-tree-view',
    treeData,
  )
})
