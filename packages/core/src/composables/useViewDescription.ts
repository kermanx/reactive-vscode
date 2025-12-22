import type { MaybeRefOrGetter } from '@reactive-vscode/reactivity'
import type { TreeView, WebviewView } from 'vscode'
import type { Nullable } from '../utils/types'
import { toValue, watchEffect } from '@reactive-vscode/reactivity'

type ViewWithDescription = Pick<TreeView<unknown> | WebviewView, 'description'>

/**
 * Reactively set the description of a view (`vscode::TreeView` or `vscode::WebviewView`).
 *
 * @category view
 */
export function useViewDescription(
  view: MaybeRefOrGetter<Nullable<ViewWithDescription>>,
  description: MaybeRefOrGetter<string | undefined>,
) {
  watchEffect(() => {
    const viewValue = toValue(view)
    if (viewValue) {
      viewValue.description = toValue(description)
    }
  })
}
