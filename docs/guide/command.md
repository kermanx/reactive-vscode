# Commands

Commands trigger actions. Commands expose functionality to users, bind to actions in VS Code's UI, and implement internal logic.

There are some [built-in commands](https://code.visualstudio.com/api/references/commands) in VSCode, and you can also define your own commands.

## Define in Manifest <NonProprietary />

As described in the [official documentation](https://code.visualstudio.com/api/references/contribution-points#contributes.commands), you need to define the commands in the `contributes.commands` field in the `package.json`.

```json [package.json]
{
  "contributes": {
    "commands": [
      {
        "command": "extension.sayHello",
        "title": "Hello World",
        "category": "Hello",
        "icon": {
          "light": "path/to/light/icon.svg",
          "dark": "path/to/dark/icon.svg"
        }
      }
    ]
  }
}
```

## Register Commands

You can use the `reactive::useCommand` or `reactive::useCommands` function to register commands in your extension.

```ts {6-9}
import { defineExtension, ref, useCommand, watchEffect } from 'reactive-vscode'
import { window } from 'vscode'

export = defineExtension(() => {
  const helloCounter = ref(0)
  useCommand('extension.sayHello', () => {
    window.showInformationMessage('Hello World')
    helloCounter.value++
  })

  watchEffect(() => {
    if (helloCounter.value > 99)
      window.showWarningMessage('You have said hello too many times!')
  })
})
```

## Caveats

### Command Palette Visibility <NonProprietary />

Commands can be used as view actions, or be called by other extensions. In that case, commands may have params and shouldn't be called via the [Command Palette](https://code.visualstudio.com/api/ux-guidelines/command-palette). We should hide these commands from the Command Palette by setting the `contributes.menus[*].when` property to `false`:

```json
{
  "contributes": {
    "commands": [
      {
        "command": "extension.doSomething",
        "title": "This requires params"
      }
    ],
    "menus": {
      "commandPalette": [
        {
          "command": "extension.doSomething",
          "when": "false"
        }
      ]
    }
  }
}
```

See the [official documentation](https://code.visualstudio.com/api/references/contribution-points#Context-specific-visibility-of-Command-Palette-menu-items) for more information.
