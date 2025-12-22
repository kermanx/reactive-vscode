import type { ComputedRef } from '@reactive-vscode/reactivity'
import type { TreeView, WebviewView } from 'vscode'
import type { MaybeNullableRefOrGetter } from '../utils/types'
import { computed, isRef, ref, toValue, watch, watchEffect } from '@reactive-vscode/reactivity'

type ViewWithVisibility = Pick<TreeView<unknown> | WebviewView, 'visible' | 'onDidChangeVisibility'>

/**
 * Reactively get the visibility of a view (`vscode::TreeView` or `vscode::WebviewView`).
 *
 * @category view
 */
export function useViewVisibility(view: MaybeNullableRefOrGetter<ViewWithVisibility>): ComputedRef<boolean> {
  const visible = ref(toValue(view)?.visible)

  if (isRef(view) || typeof view === 'function') {
    watch(view, (newView) => {
      visible.value = newView?.visible
    })
  }

  watchEffect((onCleanup) => {
    const viewValue = toValue(view)
    if (viewValue) {
      const disposable = viewValue.onDidChangeVisibility(() => {
        visible.value = viewValue.visible
      })
      onCleanup(() => disposable.dispose())
    }
  })

  return computed(() => !!visible.value)
}
