import type { MaybeRefOrGetter } from '@reactive-vscode/reactivity'
import type { TreeView, WebviewView } from 'vscode'
import type { Nullable } from '../utils/types'
import { toValue, watchEffect } from '@reactive-vscode/reactivity'

type ViewWithTitle = Pick<TreeView<unknown> | WebviewView, 'title'>

/**
 * Reactively set the title of a view (`vscode::TreeView` or `vscode::WebviewView`).
 *
 * @category view
 */
export function useViewTitle(
  view: MaybeRefOrGetter<Nullable<ViewWithTitle>>,
  title: MaybeRefOrGetter<string | undefined>,
) {
  watchEffect(() => {
    const viewValue = toValue(view)
    if (viewValue) {
      viewValue.title = toValue(title)
    }
  })
}
