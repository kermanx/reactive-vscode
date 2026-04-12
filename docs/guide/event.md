# Events

Although most of the VSCode APIs are covered by <ReactiveVscode />, sometimes you still need to create or listen to the primitive  [VSCode events](https://code.visualstudio.com/api/references/vscode-api#events).

`reactive::useEvent` converts a raw event to an auto-disposed event:

```ts
import { defineExtension, useEvent } from 'reactive-vscode'
import { workspace } from 'vscode'

const onDidCreateFiles = useEvent(workspace.onDidCreateFiles)

export = defineExtension(() => {
  // No need to dispose the event
  onDidCreateFiles((e) => {
    console.log('Files created:', e.files)
  })
})
```

`reactive::useEventEmitter` creates a friendly event emitter which still extends `vscode::EventEmitter`:

<!-- eslint-disable import/first -->
```ts
import type { Event } from 'vscode'

declare function someVscodeApi(options: { onSomeEvent: Event<string> }): void
// ---cut---
import { defineExtension, useEventEmitter } from 'reactive-vscode'

export = defineExtension(() => {
  const myEvent = useEventEmitter<string>([/* optional listenrs */])

  someVscodeApi({
    onSomeEvent: myEvent.event,
  })

  myEvent.event((msg) => {
    console.log('Received message:', msg)
  })

  myEvent.fire('Hello, World!')
})
```

You can also convert a raw event to a friendly event emitter:

```ts {6}
import { defineExtension, useEventEmitter } from 'reactive-vscode'
import { EventEmitter } from 'vscode'

export = defineExtension(() => {
  const rawEvent = new EventEmitter<string>()
  const myEvent = useEventEmitter(rawEvent, [/* optional listenrs */])
})
```
