import type { ComputedRef, MaybeRefOrGetter } from '@reactive-vscode/reactivity'
import { computed, toValue } from '@reactive-vscode/reactivity'
import { Uri } from 'vscode'
import { extensionContext } from '../utils'

/**
 * @reactive `ExtensionContext.asAbsolutePath`
 * @category utilities
 */
export function useAbsoluteUri(relativePath: MaybeRefOrGetter<string>): ComputedRef<Uri> {
  return computed(() => Uri.joinPath(extensionContext.value!.extensionUri, toValue(relativePath)))
}
