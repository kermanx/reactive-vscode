import { defineService } from '../utils'
import { useWindowState } from './useWindowState'

/**
 * @reactive `window.state.focused`
 */
export const useWindowFocused = defineService(() => {
  return useWindowState().focused
})
