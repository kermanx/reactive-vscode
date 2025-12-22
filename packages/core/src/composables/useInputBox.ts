import type { MaybeRef, MaybeRefOrGetter } from '@reactive-vscode/reactivity'
import type { InputBoxValidationMessage, QuickInputButton } from 'vscode'
import type { QuickInputOptions } from './useQuickInputOptions'
import { shallowRef, watchEffect } from '@reactive-vscode/reactivity'
import { window } from 'vscode'
import { useDisposable } from './useDisposable'
import { useQuickInputOptions } from './useQuickInputOptions'
import { useReactiveEvents } from './useReactiveEvents'
import { useReactiveOptions } from './useReactiveOptions'

export interface InputBoxOptions extends QuickInputOptions {
  /**
   * The current input value.
   *
   * If provided as a ref, the value will be kept in sync with the input box's value, just like `v-model`.
   */
  value?: MaybeRef<string>

  /**
   * Selection range in the input value.
   *
   * Defined as tuple of two numbers where the first is the inclusive start index and the second the
   * exclusive end index. When `undefined` the whole pre-filled value will be selected, when empty
   * (start equals end) only the cursor will be set, otherwise the defined range will be selected.
   *
   * This property does not get updated when the user types or makes a selection, but it can be updated
   * by the extension.
   */
  valueSelection?: MaybeRefOrGetter<readonly [number, number] | undefined>

  /**
   * Optional placeholder text shown when no value has been input.
   */
  placeholder?: MaybeRefOrGetter<string | undefined>

  /**
   * Determines if the input value should be hidden. Defaults to `false`.
   */
  password?: MaybeRefOrGetter<boolean>

  /**
   * An event signaling when the value has changed.
   */
  onDidChangeValue?: (value: string) => void

  /**
   * An event signaling when the user indicated acceptance of the input value.
   */
  onDidAccept?: () => void

  /**
   * Buttons for actions in the UI.
   */
  buttons?: MaybeRefOrGetter<readonly QuickInputButton[]>

  /**
   * An event signaling when a button was triggered.
   */
  onDidTriggerButton?: (button: QuickInputButton) => void

  /**
   * An optional prompt text providing some ask or explanation to the user.
   */
  prompt?: MaybeRefOrGetter<string | undefined>

  /**
   * An optional validation message indicating a problem with the current input value.
   *
   * By setting a string, the InputBox will use a default {@link InputBoxValidationSeverity} of Error.
   * Returning `undefined` clears the validation message.
   */
  validationMessage?: MaybeRefOrGetter<string | InputBoxValidationMessage | undefined>
}

/**
 * @reactive `window.createInputBox`
 */
export function useInputBox(
  options: InputBoxOptions = {},
) {
  const InputBox = useDisposable(window.createInputBox())

  useQuickInputOptions(InputBox, options)

  useReactiveOptions(InputBox, options, [
    'valueSelection',
    'placeholder',
    'password',
    'buttons',
    'prompt',
    'validationMessage',
  ])

  useReactiveEvents(InputBox, options, [
    'onDidChangeValue',
    'onDidAccept',
    'onDidTriggerButton',
  ])

  const value = shallowRef(options.value ?? InputBox.value)
  InputBox.onDidChangeValue(v => value.value = v)
  watchEffect(() => InputBox.value = value.value)

  return {
    ...InputBox,
    value,
  }
}
