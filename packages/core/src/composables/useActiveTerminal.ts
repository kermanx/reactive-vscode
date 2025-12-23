import { shallowRef } from '@reactive-vscode/reactivity'
import { window } from 'vscode'
import { defineService } from '../utils'
import { useDisposable } from './useDisposable'

/**
 * @reactive `window.activeTerminal`
 * @category terminal
 */
export const useActiveTerminal = defineService(() => {
  const activeTerminal = shallowRef(window.activeTerminal)

  useDisposable(window.onDidChangeActiveTerminal((terminal) => {
    activeTerminal.value = terminal
  }))

  return activeTerminal
})
