import { defineConfig, defineExtension, useActiveTextEditor, useEditorDecorations } from 'reactive-vscode'

const config = defineConfig<{ decorations: boolean }>('demo')

export = defineExtension(() => {
  const editor = useActiveTextEditor()
  useEditorDecorations(
    editor,
    {
      backgroundColor: 'red',
    },
    () => config.decorations ? [/* ... Caclulated ranges ... */] : [],
  )
})
