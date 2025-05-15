# Views

Views are an important part of a VSCode extension. There are two types of views in VSCode: [Tree View](https://code.visualstudio.com/api/extension-guides/tree-view) and [Webview](https://code.visualstudio.com/api/extension-guides/webview). Please read the [official UX guidelines](https://code.visualstudio.com/api/ux-guidelines/views) for a basic understanding.

## Define in Manifest <NonProprietary />

As described in the [official documentation](https://code.visualstudio.com/api/references/contribution-points#contributes.viewsContainers), first, you need view containers to be defined in the `contributes.viewsContainers.[viewContainerType]` section in the `package.json`. Then you can define your views in the `contributes.views.[viewContainerId]` section.

```json [package.json]
{
  "contributes": {
    "viewsContainers": {
      "activitybar": [
        {
          "id": "package-explorer",
          "title": "Package Explorer",
          "icon": "resources/package-explorer.svg"
        }
      ]
    },
    "views": {
      "package-explorer": [
        {
          "id": "package-dependencies",
          "name": "Dependencies"
        },
        {
          "id": "package-outline",
          "name": "Outline"
        }
      ]
    }
  }
}
```

![Custom views container](https://code.visualstudio.com/assets/api/references/contribution-points/custom-views-container.png)

## Register Tree View

[Tree views](https://code.visualstudio.com/api/extension-guides/tree-view) are used to display hierarchical data. You can define a tree view by using the `reactive::useTreeView` function.

Here is an example of a tree view:

<<< @/snippets/treeView.ts {35-41}

Then you can call the `useDemoTreeView` function every where to register the tree view and get the returned value:

```ts {2,5}
import { defineExtension } from 'reactive-vscode'
import { useDemoTreeView } from './treeView'

export = defineExtension(() => {
  const demoTreeView = useDemoTreeView()
  // ...
})
```

The `children` property in nodes is used to define the children of the node. The `treeItem` property is required and is used to define the tree item of the node. It should be a `vscode::TreeItem` object, or a promise that resolves to a `vscode::TreeItem` object.

If you want to trigger an update based on some reactive values that aren't tracked in `treeData`, you can pass them to the `watchSource` option.

::: details About `reactive::createSingletonComposable`
`reactive::createSingletonComposable` is a helper function to create a singleton composable. It will only create the composable once and return the same instance every time it is called.
:::

::: warning
For the above example, `useDemoTreeView` should **not** be called at the top-level in the module, because the extension context is not available at that time. Instead, you should **always** call it in the `setup` function.
:::

## Register Webview

[Webviews](https://code.visualstudio.com/api/extension-guides/webview) are used to display web content in the editor. You can define a webview by using the `reactive::useWebviewView` function.

Here is an example of a webview:

<<< @/snippets/webviewView.ts

The time to call `useDemoWebviewView` is the same as the tree view in the previous section.

There is also `reactive::useWebviewPanel` composable to create a webview panel. The usage is similar to `reactive::useWebviewView`.
