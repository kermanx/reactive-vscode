import type { MaybeRefOrGetter } from '@reactive-vscode/reactivity'
import type { StatusBarAlignment, StatusBarItem } from 'vscode'
import { toValue, watchEffect } from '@reactive-vscode/reactivity'
import { window } from 'vscode'
import { useDisposable } from './useDisposable'
import { useReactiveOptions } from './useReactiveOptions'

export interface UseStatusBarItemOptions {
  id?: string
  alignment?: StatusBarAlignment
  priority?: number
  name?: MaybeRefOrGetter<StatusBarItem['name']>
  text?: MaybeRefOrGetter<StatusBarItem['text']>
  tooltip?: MaybeRefOrGetter<StatusBarItem['tooltip']>
  color?: MaybeRefOrGetter<StatusBarItem['color']>
  backgroundColor?: MaybeRefOrGetter<StatusBarItem['backgroundColor']>
  command?: MaybeRefOrGetter<StatusBarItem['command']>
  accessibilityInformation?: MaybeRefOrGetter<StatusBarItem['accessibilityInformation']>
  visible?: MaybeRefOrGetter<boolean>
}

/**
 * @reactive `window.createStatusBarItem`
 */
export function useStatusBarItem(options: UseStatusBarItemOptions): StatusBarItem {
  const item = useDisposable(options.id
    ? window.createStatusBarItem(options.id, options.alignment, options.priority)
    : window.createStatusBarItem(options.alignment, options.priority))

  useReactiveOptions(item, options, [
    'name',
    'text',
    'tooltip',
    'color',
    'backgroundColor',
    'command',
    'accessibilityInformation',
  ])

  if (options.visible != null) {
    watchEffect(() => {
      if (toValue(options.visible)) {
        item.show()
      }
      else {
        item.hide()
      }
    })
  }

  return item
}
