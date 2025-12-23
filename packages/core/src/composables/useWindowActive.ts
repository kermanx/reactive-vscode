import { defineService } from '../utils'
import { useWindowState } from './useWindowState'

/**
 * @reactive `window.state.active`
 */
export const useWindowActive = defineService(() => {
  return useWindowState().active
})
