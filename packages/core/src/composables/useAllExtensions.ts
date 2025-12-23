import { computed, shallowRef } from '@reactive-vscode/reactivity'
import { extensions } from 'vscode'
import { defineService } from '../utils'
import { useDisposable } from './useDisposable'

/**
 * @reactive `extensions.all`
 * @category extension
 */
export const useAllExtensions = defineService(() => {
  const allExtensions = shallowRef(extensions.all)

  useDisposable(extensions.onDidChange(() => {
    allExtensions.value = extensions.all
  }))

  return computed(() => allExtensions.value)
})
