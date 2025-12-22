import { shallowRef } from '@reactive-vscode/reactivity'
import { window } from 'vscode'
import { defineService } from '../utils'
import { useDisposable } from './useDisposable'

/**
 * @reactive `window.activeColorTheme`
 */
export const useActiveColorTheme = defineService(() => {
  const result = shallowRef(window.activeColorTheme)

  useDisposable(window.onDidChangeActiveColorTheme((theme) => {
    result.value = theme
  }))

  return result
})
