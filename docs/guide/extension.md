# Extension

It's simple to create a VSCode extension with <ReactiveVscode />. You just need to define your extension code inside the `reactive::defineExtension` function, and export the returned `activate` and `deactivate` functions.

```ts
import { defineExtension } from 'reactive-vscode'

export = defineExtension(() => {
  // Setup your extension here
})
```

::: details TypeScript Configuration <span class="i-vscode-icons:file-type-typescript-official text-2xl mt--1 ml-1"></span>
VSCode extensions should be CommonJS modules. Since `export =` statement is not allowed in ESM, you need to add this in your `tsconfig.json` to make TypeScript happy if you use a Bundler like `tsup` or `tsdown`.

```json
{
  "compilerOptions": {
    "moduleResolution": "Bundler",
    "module": "Preserve"
  }
}
```

Or you can avoid the `export =` statement in this way:

```ts
import { defineExtension } from 'reactive-vscode'

const { activate, deactivate } = defineExtension(() => {
  // Your extension code here
})
export { activate, deactivate }
```
:::

## The Setup Function

Like the `setup` function in Vue 3, the setup function in <ReactiveVscode /> is a function that defines how your extension should behave. When the extension is activated, this function will be called once.

You can do these things in the setup function:

- Register commands (via `reactive::useCommand` or `reactive::useCommands`)
- Register views (covered in [the next section](./view.md))
- Define other (reactive) logics (via `vue::watchEffect` or `vue::watch`, etc.)
- Use other composables (like `reactive::useActiveTextEditor`)

Here is an example:

<!-- eslint-disable import/first -->
```ts
import type { Ref } from 'reactive-vscode'
/**
 * Defined via `defineConfigs`
 */
declare const message: Ref<string>
// ---cut---
import { defineExtension, useCommand, useIsDarkTheme, useLogger, watchEffect } from 'reactive-vscode'
import { window } from 'vscode'
import { useDemoTreeView } from './treeView'

export = defineExtension(() => {
  const logger = useLogger('Reactive VSCode')
  logger.info('Extension Activated')
  logger.show()

  useCommand('reactive-vscode-demo.helloWorld', () => {
    window.showInformationMessage(message.value)
  })

  const isDark = useIsDarkTheme()
  watchEffect(() => {
    logger.info('Is Dark Theme:', isDark.value)
  })

  useDemoTreeView()
})
```

## The Extension Context

The [extension context](https://code.visualstudio.com/api/references/vscode-api#ExtensionContext) can be imported from `reactive-vscode`. It is a global `shallowRef` that contains the `vscode::ExtensionContext` object.

```ts
import { extensionContext } from 'reactive-vscode'

extensionContext.value?.extensionPath
//                 ^?
```

<div mt-8 />

A common use case is to get the absolute path of some resources in your extension. In this case, you can use `reactive::useAbsolutePath` as a shortcut.
