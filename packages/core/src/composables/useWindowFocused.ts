import type { window } from 'vscode'
import { defineService } from '../utils'
import { useWindowState } from './useWindowState'

/**
 * @reactive {@linkcode window.state.focused}
 */
export const useWindowFocused = defineService(() => {
  return useWindowState().focused
})
