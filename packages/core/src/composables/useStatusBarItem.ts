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

  /**
   * @see {@linkcode StatusBarItem.name}
   */
  name?: MaybeRefOrGetter<StatusBarItem['name']>

  /**
   * @see {@linkcode StatusBarItem.text}
   */
  text?: MaybeRefOrGetter<StatusBarItem['text']>

  /**
   * @see {@linkcode StatusBarItem.tooltip}
   */
  tooltip?: MaybeRefOrGetter<StatusBarItem['tooltip']>

  /**
   * @see {@linkcode StatusBarItem.color}
   */
  color?: MaybeRefOrGetter<StatusBarItem['color']>

  /**
   * @see {@linkcode StatusBarItem.backgroundColor}
   */
  backgroundColor?: MaybeRefOrGetter<StatusBarItem['backgroundColor']>

  /**
   * @see {@linkcode StatusBarItem.command}
   */
  command?: MaybeRefOrGetter<StatusBarItem['command']>

  /**
   * @see {@linkcode StatusBarItem.accessibilityInformation}
   */
  accessibilityInformation?: MaybeRefOrGetter<StatusBarItem['accessibilityInformation']>

  /**
   * Whether the status bar item is visible
   */
  visible?: MaybeRefOrGetter<boolean>
}

/**
 * @reactive {@linkcode window.createStatusBarItem}
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
