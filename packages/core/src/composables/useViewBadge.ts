import type { MaybeRefOrGetter } from '@reactive-vscode/reactivity'
import type { TreeView, ViewBadge, WebviewView } from 'vscode'
import type { Nullable } from '../utils/types'
import { toValue, watchEffect } from '@reactive-vscode/reactivity'

type ViewWithBadge = Pick<TreeView<unknown> | WebviewView, 'badge'>

/**
 * Reactively set the badge of a view (`vscode::TreeView` or `vscode::WebviewView`).
 *
 * @category view
 */
export function useViewBadge(
  view: MaybeRefOrGetter<Nullable<ViewWithBadge>>,
  badge: MaybeRefOrGetter<ViewBadge | undefined>,
) {
  watchEffect(() => {
    const viewValue = toValue(view)
    if (viewValue) {
      viewValue.badge = toValue(badge)
    }
  })
}
