import { computed, shallowRef } from '@reactive-vscode/reactivity'
import { workspace } from 'vscode'
import { defineService } from '../utils'
import { useDisposable } from './useDisposable'

/**
 * @reactive `workspace.workspaceFolders`
 */
export const useWorkspaceFolders = defineService(() => {
  const folders = shallowRef(workspace.workspaceFolders)

  useDisposable(workspace.onDidChangeWorkspaceFolders(() => {
    folders.value = workspace.workspaceFolders
  }))

  return computed(() => folders.value)
})
