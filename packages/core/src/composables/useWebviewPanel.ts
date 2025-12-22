import type { MaybeRefOrGetter } from '@reactive-vscode/reactivity'
import type { WebviewOptions, WebviewPanel } from 'vscode'
import { computed, isRef, shallowRef, toValue, watch, watchEffect } from '@reactive-vscode/reactivity'
import { window } from 'vscode'
import { useDisposable } from './useDisposable'
import { useReactiveOptions } from './useReactiveOptions'
import { useViewTitle } from './useViewTitle'

export interface WebviewPanelRegisterOptions {
  enableFindWidget?: boolean
  retainContextWhenHidden?: boolean
  onDidReceiveMessage?: (message: any) => void
  webviewOptions?: MaybeRefOrGetter<WebviewOptions>
  iconPath?: MaybeRefOrGetter<WebviewPanel['iconPath']>
}

/**
 * Register a webview panel. See `vscode::window.createWebviewPanel`.
 *
 * @category view
 */
export function useWebviewPanel(
  viewType: string,
  title: MaybeRefOrGetter<string>,
  html: MaybeRefOrGetter<string>,
  showOptions: Parameters<typeof window.createWebviewPanel>[2],
  options?: WebviewPanelRegisterOptions,
) {
  const webviewOptions = options?.webviewOptions
  const panel = useDisposable(window.createWebviewPanel(
    viewType,
    toValue(title),
    showOptions,
    {
      enableFindWidget: options?.enableFindWidget,
      retainContextWhenHidden: options?.retainContextWhenHidden,
      ...toValue(webviewOptions),
    },
  ))
  const webview = panel.webview

  if (isRef(title) || typeof title === 'function') {
    useViewTitle(panel, title)
  }

  if (options) {
    useReactiveOptions(panel, options, [
      'iconPath',
    ])
  }

  if (options?.onDidReceiveMessage) {
    webview.onDidReceiveMessage(options.onDidReceiveMessage)
  }

  const forceRefreshId = shallowRef(0)

  function forceRefresh() {
    forceRefreshId.value++
  }

  watchEffect(() => {
    webview.html = `${toValue(html)}<!--${forceRefreshId.value}-->`
  })

  if (webviewOptions && (isRef(webviewOptions) || typeof webviewOptions === 'function')) {
    watch(webviewOptions, (webviewOptions) => {
      webview.options = webviewOptions
    })
  }

  function postMessage(message: any) {
    return webview.postMessage(message)
  }

  const viewColumn = shallowRef(panel.viewColumn)
  const active = shallowRef(panel.active)
  const visible = shallowRef(panel.visible)
  useDisposable(panel.onDidChangeViewState((ev) => {
    if (panel === ev.webviewPanel) {
      viewColumn.value = panel.viewColumn
      active.value = panel.active
      visible.value = panel.visible
    }
  }))

  return {
    panel,
    webview,
    viewColumn: computed(() => viewColumn.value),
    active: computed(() => active.value),
    visible: computed(() => visible.value),
    postMessage,
    forceRefresh,
    reveal: panel.reveal.bind(panel),
  }
}
