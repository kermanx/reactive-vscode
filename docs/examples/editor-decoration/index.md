---
outline: false
---

# Editor Decoration

A simple example that adds decorations to the active editor depending on the configuration.

<ExampleFunctions :fns="[
  'defineConfig',
  'useActiveTextEditor',
  'useEditorDecorations',
]" />

::: code-group

<<< ./1.ts [<ReactiveVscode2 />]

<<< ./2.ts [Original VSCode API]

:::
