import { computed, shallowRef } from '@reactive-vscode/reactivity'
import { window } from 'vscode'
import { defineService } from '../utils'
import { useDisposable } from './useDisposable'

/**
 * @reactive `window.state`
 */
export const useWindowState = defineService(() => {
  const windowState = shallowRef(window.state)

  useDisposable(window.onDidChangeWindowState((ev) => {
    windowState.value = ev
  }))

  return {
    focused: computed(() => windowState.value.focused),
    active: computed(() => windowState.value.active),
  }
})
