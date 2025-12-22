import type { MaybeRefOrGetter } from '@reactive-vscode/reactivity'
import type { QuickInput } from 'vscode'
import { toValue, watchEffect } from '@reactive-vscode/reactivity'
import { useReactiveEvents } from './useReactiveEvents'
import { useReactiveOptions } from './useReactiveOptions'

export interface QuickInputOptions {
  /**
   * An optional title.
   */
  title?: MaybeRefOrGetter<string | undefined>

  /**
   * An optional current step count.
   */
  step?: MaybeRefOrGetter<number | undefined>

  /**
   * An optional total step count.
   */
  totalSteps?: MaybeRefOrGetter<number | undefined>

  /**
   * If the UI should allow for user input. Defaults to true.
   *
   * Change this to false, e.g., while validating user input or
   * loading data for the next step in user input.
   */
  enabled?: MaybeRefOrGetter<boolean>

  /**
   * If the UI should show a progress indicator. Defaults to false.
   *
   * Change this to true, e.g., while loading more data or validating
   * user input.
   */
  busy?: MaybeRefOrGetter<boolean>

  /**
   * If the UI should stay open even when loosing UI focus. Defaults to false.
   * This setting is ignored on iPad and is always false.
   */
  ignoreFocusOut?: MaybeRefOrGetter<boolean>

  visible?: MaybeRefOrGetter<boolean>

  /**
   * An event signaling when this input UI is hidden.
   *
   * There are several reasons why this UI might have to be hidden and the extension will be notified
   * through {@link QuickInput.onDidHide onDidHide}. Examples include: an explicit call to
   * {@link QuickInput.hide hide}, the user pressing Esc, some other input UI opening, etc.
   */
  onDidHide?: () => void
}

/**
 * @internal
 */
export function useQuickInputOptions(
  quickInput: QuickInput,
  options: QuickInputOptions,
) {
  useReactiveOptions(quickInput, options, [
    'title',
    'step',
    'totalSteps',
    'enabled',
    'busy',
    'ignoreFocusOut',
  ])

  useReactiveEvents(quickInput, options, [
    'onDidHide',
  ])

  if (options.visible != null) {
    watchEffect(() => {
      if (toValue(options.visible)) {
        quickInput.show()
      }
      else {
        quickInput.hide()
      }
    })
  }
}
