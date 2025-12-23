# Terminals

VSCode provides a powerful terminal system that allows you to run shell commands in the integrated terminal. <ReactiveVscode /> provides a set of composable functions to create and manage terminals in a reactive way.

## Create a Terminal

`reactive::useTerminal` creates a terminal via `vscode::window.createTerminal`. The params are the same as `vscode::window.createTerminal`.

```ts
import { defineExtension, useTerminal } from 'reactive-vscode'

export = defineExtension(() => {
  const {
    terminal,
    state,
    shellIntegration,
    sendText,
    show,
    hide,
  } = useTerminal('My Terminal', '/bin/bash')
})
```

### The Active Terminal

You can use `reactive::useActiveTerminal` to get the currently active terminal.

```ts
import { defineExtension, useActiveTerminal } from 'reactive-vscode'

export = defineExtension(() => {
  const activeTerminal = useActiveTerminal() // [!code highlight]
  //     ^?
})
```

### All Opened Terminals

You can use `reactive::useOpenedTerminals` to get all open terminals.

```ts
import { defineExtension, useOpenedTerminals } from 'reactive-vscode'

export = defineExtension(() => {
  const terminals = useOpenedTerminals() // [!code highlight]
  //     ^?
})
```

### Get Terminal State

You can use `reactive::useTerminalState` to get the state of an existing terminal.

```ts
import { defineExtension, useActiveTerminal, useOpenedTerminals, useTerminalState } from 'reactive-vscode'

export = defineExtension(() => {
  const activeTerminal = useActiveTerminal()
  const activeTerminalState = useTerminalState(activeTerminal) // [!code highlight]

  const allTerminals = useOpenedTerminals()
  const firstTerminalState = useTerminalState(() => allTerminals.value[0]) // [!code highlight]
  //     ^?
})
```
