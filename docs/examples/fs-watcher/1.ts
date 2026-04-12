import { defineExtension, reactive, useCommands, useFileSystemWatcher } from 'reactive-vscode'
import { window } from 'vscode'

export = defineExtension(() => {
  const globs = reactive(new Set(['src/**/*', 'docs/**/*']))
  const watcher = useFileSystemWatcher(globs)
  watcher.onDidChange(uri => window.showInformationMessage(`File changed: ${uri}`))

  useCommands({
    'demo.add-watch-dir': async () => {
      const value = await window.showInputBox({ prompt: 'Enter a glob' })
      if (value)
        globs.add(value)
    },
    'demo.remove-watch-dir': async () => {
      const value = await window.showInputBox({ prompt: 'Enter a glob' })
      if (value)
        globs.delete(value)
    },
  })
})
