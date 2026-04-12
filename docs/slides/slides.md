---
theme: default
background: https://cover.sli.dev
title: Reactive VSCode
info: |
  ## Slidev Starter Template
  Presentation slides for developers.

  Learn more at [Sli.dev](https://sli.dev)
mdc: true
---

# VSCode Extension Development

with reactive-vscode

---

# What can extensions do?

- **Extending the Workbench**: Add custom components & views in the UI
- **Language Extensions**/**Debugger**: Support a new programming language
- **Themes**/**Snippets**/**Keymaps**
- **AI**: Agent, Tools
- **Packs**

---

# The architecture of VSCode

<div />

![](https://code.visualstudio.com/assets/blogs/2022/11/28/process-model-after-sandboxing.png){.h-100}


- https://code.visualstudio.com/blogs/2022/11/28/vscode-sandbox

---

# Runtimes

- Node.js (Extension Host)

- Web Worker (Extension Host on VSCode Web)

- Browser (Webview)

---

![](https://code.visualstudio.com/assets/api/ux-guidelines/examples/architecture-containers.png){.fixed.top-0.h-full}

- https://code.visualstudio.com/api/ux-guidelines/overview

---
layout: fact
---

VSCode Extensions are UI Applications

---

# Why Reactive?

<div />

Fact: $\text{UI} = f(\text{State})$

- Show the toolbar if the active document is a Markdown file.

  ```ts
  function f(state) {
    return {
      showToolbar: state.isMarkdown,
    }
  }

  UI = f(state) // ?
  ```

<p />

Fact: $\text{State}' = \delta(\text{State}, \text{Event})$

- When the active document changes, update the state.

  ```ts
  onActiveDocumentChange((doc) => {
    state.isMarkdown = doc.languageId === 'markdown'
  })
  ```

---

# Vanilla Approach

```ts
const state = {
  isMarkdown: false,
}

onActiveDocumentChange((doc) => {
  const before = state.isMarkdown
  state.isMarkdown = doc.languageId === 'markdown'
  if (state.isMarkdown !== before) {
    if (state.isMarkdown)
      UI.toolbar.show()
    else
      UI.toolbar.hide()
  }
})
```

---

# Diff Approach

```ts
const state = {
  isMarkdown: false,
}

UI.renderer = (state) => {
  return {
    showToolbar: state.isMarkdown,
  }
}

onActiveDocumentChange((doc) => {
  state.isMarkdown = doc.languageId === 'markdown'
  UI.diffAndUpdate()
})
```

---

# Reactive Approach

```ts
const state = reactive({
  isMarkdown: false,
})

const toolbarVisible = computed(() => state.isMarkdown)

UI.useToolbar(toolbarVisible) // <-- reactive-vscode

onActiveDocumentChange((doc) => {
  state.isMarkdown = doc.languageId === 'markdown'
})
```

---

# Reactivity Basics

<div />

Think as "Connections"

<div grid grid-cols-2 gap-4>
<div>

<Reactivity />

<div text-xl ml-8 mt-8>

$\text{UI} = f(\text{State})$ 

</div>

Functional instead of imperative

</div>
<div>

```ts
import { ref, computed } from 'reactive-vscode'

const x = ref(2)
const y = ref(4)

const x2 = computed(() => x.value * x.value)
const y2 = computed(() => y.value * y.value)

const sum = computed(() => x2.value + y2.value)
```

<div mt-18 text-xl>

```ts
import { reactive } from 'reactive-vscode'

const state = reactive({ ... })

const UI = computed(() => f(state))
```

</div>
</div>
</div>

---

# Reactivity Basics

<div />

Side-effects

Beyond pure computation, side-effects are needed to interact with the outside world.

```ts
import { ref, computed, watch, watchEffect } from 'reactive-vscode'

const counter = ref(0)

watch(counter, (newVal) => {
  console.log(`Counter changed: ${newVal}`)
})

watchEffect(() => {
  item.text = `Counter: ${counter.value}`
})
```

---

# Reactivity Basics

<div />

Effect scopes

```ts
import { EffectScope, effectScope, watch, onScopeDispose } from 'reactive-vscode'

const users = new Map<string, EffectScope>()

function userJoin(name: string) {
  const scope = effectScope(true)
  users.set(name, scope)
  return scope.run(() => {
    watch( ... )
    onScopeDispose( ... )
  })
}

function userLeave(name: string) {
  const scope = users.get(name)
  if (scope) {
    scope.stop()
    users.delete(name)
  }
}
```


---

# Extension Basics

- Essentially a **Node.js package**
  - Node.js and NPM
  - `package.json` describes the extension
    - `main` field: the entry file
    - `activationEvents` field: when to activate the extension
    - `contributes` field: what the extension contributes

- The entry file exports:
  - `activate` function: startup
  - `deactivate` function: cleanup

- `vscode` module provides the VSCode API

  ```ts
  import { workspace, window, commands } from 'vscode'
  ```

---

# The Entry File

```ts
import { defineExtension } from 'reactive-vscode'

export const { activate, deactivate } = defineExtension(() => {
  // Runs in a effect scope
  // Which cleans up automatically on deactivate
})
```

---

# Define a Service

<div />

The service is a new effect scope, which

- Runs once when called
- Lives until the extension is deactivated

```ts
import { defineService } from 'reactive-vscode'

const useMyView = defineService(() => {
  // ...
})

const useMyCommands = defineService(() => {
  const myView = useMyView()
  // ...
})

export const { activate, deactivate } = defineExtension(() => {
  useMyView()
  useMyCommands()
})
```

---

# Example: Command Handler

```ts
import { defineService } from 'reactive-vscode'
import { window } from 'vscode'

export const useMyCommands = defineService(() => {
  const counter = ref(0)

  useCommands({
    'myExtension.increment': () => {
      counter.value++
      window.showInformationMessage(`Counter: ${counter.value}`)
    },
    'myExtension.decrement': () => {
      counter.value--
      window.showInformationMessage(`Counter: ${counter.value}`)
    },
  })
})
```

---

# Example: Configuration

---

# Example: Tree View

---

# Composable Paradigm



---

# Extra: Language Tooling

