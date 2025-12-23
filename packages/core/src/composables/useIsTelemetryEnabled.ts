import { computed, shallowRef } from '@reactive-vscode/reactivity'
import { env } from 'vscode'
import { defineService } from '../utils'
import { useDisposable } from './useDisposable'

/**
 * @reactive {@linkcode env.isTelemetryEnabled}
 */
export const useIsTelemetryEnabled = defineService(() => {
  const isTelemetryEnabled = shallowRef(env.isTelemetryEnabled)

  useDisposable(env.onDidChangeTelemetryEnabled((ev) => {
    isTelemetryEnabled.value = ev
  }))

  return computed(() => isTelemetryEnabled.value)
})
