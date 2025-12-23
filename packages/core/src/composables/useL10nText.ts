import type { ComputedRef, MaybeRefOrGetter } from '@reactive-vscode/reactivity'
import { computed, toRaw, toValue } from '@reactive-vscode/reactivity'
import { l10n } from 'vscode'

/**
 * @reactive `l10n.t`
 */
export function useL10nText(message: MaybeRefOrGetter<string>, ...args: MaybeRefOrGetter<string | number | boolean>[]): ComputedRef<string>
export function useL10nText(message: MaybeRefOrGetter<string>, args: MaybeRefOrGetter<Record<string, any>>): ComputedRef<string>
export function useL10nText(message: MaybeRefOrGetter<string>, ...args: MaybeRefOrGetter<string | number | boolean>[] | [MaybeRefOrGetter<Record<string, any>>]) {
  return computed(() => {
    const arg0 = toValue(args[0])
    return typeof arg0 === 'object'
      ? l10n.t(toValue(message), toRaw(arg0))
      : l10n.t(toValue(message), ...(args as MaybeRefOrGetter<string | number | boolean>[]).map(toValue))
  })
}
