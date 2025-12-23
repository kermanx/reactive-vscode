import type { window } from 'vscode'
import { defineService } from '../utils'
import { useWindowState } from './useWindowState'

/**
 * @reactive {@linkcode window.state.active}
 */
export const useWindowActive = defineService(() => {
  return useWindowState().active
})
