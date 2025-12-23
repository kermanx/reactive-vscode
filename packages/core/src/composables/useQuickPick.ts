import type { MaybeRef, MaybeRefOrGetter } from '@reactive-vscode/reactivity'
import type { QuickInputButton, QuickPick, QuickPickItem, QuickPickItemButtonEvent } from 'vscode'
import type { QuickInputOptions } from './useQuickInputOptions'
import { shallowRef, watchEffect } from '@reactive-vscode/reactivity'
import { window } from 'vscode'
import { useDisposable } from './useDisposable'
import { useQuickInputOptions } from './useQuickInputOptions'
import { useReactiveEvents } from './useReactiveEvents'
import { useReactiveOptions } from './useReactiveOptions'

export interface QuickPickProps<T extends QuickPickItem> extends QuickInputOptions {
  /**
   * The current value of the filter text.
   *
   * If provided as a ref, the value will be kept in sync with the quick pick's value, just like `v-model`.
   */
  value?: MaybeRef<string>

  /**
   * Optional placeholder shown in the filter textbox when no filter has been entered.
   */
  placeholder?: MaybeRefOrGetter<string | undefined>

  /**
   * An event signaling when the value of the filter text has changed.
   */
  onDidChangeValue?: (value: string) => void

  /**
   * An event signaling when the user indicated acceptance of the selected item(s).
   */
  onDidAccept?: () => void

  /**
   * Buttons for actions in the UI.
   */
  buttons?: MaybeRefOrGetter<readonly QuickInputButton[]>

  /**
   * An event signaling when a button was triggered.
   *
   * This event fires for buttons stored in the {@link QuickPick.buttons buttons} array. This event does
   * not fire for buttons on a {@link QuickPickItem}.
   */
  onDidTriggerButton?: (button: QuickInputButton) => void

  /**
   * An event signaling when a button in a particular {@link QuickPickItem} was triggered.
   *
   * This event does not fire for buttons in the title bar which are part of {@link QuickPick.buttons buttons}.
   */
  onDidTriggerItemButton?: (event: QuickPickItemButtonEvent<T>) => void

  /**
   * Items to pick from. This can be read and updated by the extension.
   */
  items?: MaybeRefOrGetter<readonly T[]>

  /**
   * If multiple items can be selected at the same time. Defaults to false.
   */
  canSelectMany?: MaybeRefOrGetter<boolean>

  /**
   * If the filter text should also be matched against the description of the items. Defaults to false.
   */
  matchOnDescription?: MaybeRefOrGetter<boolean>

  /**
   * If the filter text should also be matched against the detail of the items. Defaults to false.
   */
  matchOnDetail?: MaybeRefOrGetter<boolean>

  /**
   * An optional flag to maintain the scroll position of the quick pick when the quick pick items are updated. Defaults to false.
   */
  keepScrollPosition?: MaybeRefOrGetter<boolean>

  /**
   * Items to pick from. This can be read and updated by the extension.
   */
  activeItems?: MaybeRef<readonly T[]>

  /**
   * An event signaling when the active items have changed.
   *
   * If provided as a ref, the value will be kept in sync with the quick pick's value, just like `v-model`.
   */
  onDidChangeActive?: (items: readonly T[]) => void

  /**
   * Initial selected items. This can be read and updated by the extension.
   */
  selectedItems?: MaybeRef<readonly T[]>

  /**
   * An event signaling when the selected items have changed.
   *
   * If provided as a ref, the value will be kept in sync with the quick pick's value, just like `v-model`.
   */
  onDidChangeSelection?: (items: readonly T[]) => void
}

/**
 * Creates a customizable quick pick UI.
 *
 * @reactive {@linkcode window.createQuickPick}
 */
export function useQuickPick<T extends QuickPickItem>(
  options: QuickPickProps<T> = {},
) {
  const quickPick = useDisposable(window.createQuickPick<T>())

  useQuickInputOptions(quickPick, options)

  useReactiveOptions(quickPick, options, [
    'items',
    'buttons',
    'title',
    'step',
    'totalSteps',
    'enabled',
    'busy',
    'ignoreFocusOut',
    'placeholder',
    'canSelectMany',
    'matchOnDescription',
    'matchOnDetail',
    'keepScrollPosition',
  ])

  useReactiveEvents(quickPick, options, [
    'onDidChangeValue',
    'onDidAccept',
    'onDidTriggerButton',
    'onDidTriggerItemButton',
    'onDidChangeActive',
    'onDidChangeSelection',
  ])

  const value = shallowRef(options.value ?? quickPick.value)
  quickPick.onDidChangeValue(v => value.value = v)
  watchEffect(() => quickPick.value = value.value)

  const activeItems = shallowRef(options.activeItems ?? quickPick.activeItems)
  quickPick.onDidChangeActive(items => activeItems.value = items)
  watchEffect(() => quickPick.activeItems = activeItems.value)

  const selectedItems = shallowRef(options.selectedItems ?? quickPick.selectedItems)
  quickPick.onDidChangeSelection(items => selectedItems.value = items)
  watchEffect(() => quickPick.selectedItems = selectedItems.value)

  return {
    ...quickPick,
    /**
     * @see {@linkcode QuickPick.value}
     */
    value,
    /**
     * @see {@linkcode QuickPick.activeItems}
     */
    activeItems,
    /**
     * @see {@linkcode QuickPick.selectedItems}
     */
    selectedItems,
  }
}
