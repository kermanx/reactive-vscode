import type { MaybeRefOrGetter } from '@reactive-vscode/reactivity'
import type { Webview, WebviewOptions, WebviewPanel, WebviewPanelOptions } from 'vscode'
import type { EventListener } from '../utils'
import { computed, shallowRef, toValue, watchEffect } from '@reactive-vscode/reactivity'
import { window } from 'vscode'
import { useDisposable } from './useDisposable'
import { useReactiveEvents } from './useReactiveEvents'
import { useReactiveOptions } from './useReactiveOptions'

export interface WebviewPanelProps extends WebviewPanelOptions, WebviewOptions {
  /**
   * @see {@linkcode WebviewPanel.title}
   */
  title?: MaybeRefOrGetter<WebviewPanel['title']>

  /**
   * @see {@linkcode WebviewPanel.iconPath}
   */
  iconPath?: MaybeRefOrGetter<WebviewPanel['iconPath']>

  /**
   * @see {@linkcode WebviewPanel.onDidChangeViewState}
   */
  onDidChangeViewState?: EventListener<WebviewPanel['onDidChangeViewState']>

  /**
   * @see {@linkcode WebviewPanel.onDidDispose}
   */
  onDidDispose?: EventListener<WebviewPanel['onDidDispose']>

  /**
   * @see {@linkcode Webview.options}
   */
  webviewOptions?: MaybeRefOrGetter<WebviewOptions>

  /**
   * @see {@linkcode Webview.onDidReceiveMessage}
   */
  onDidReceiveMessage?: EventListener<Webview['onDidReceiveMessage']>
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
  options: WebviewPanelProps = {},
) {
  const panel = useDisposable(window.createWebviewPanel(
    viewType,
    toValue(title),
    showOptions,
    options,
  ))
  const webview = panel.webview

  useReactiveOptions(panel, options, [
    'title',
    'iconPath',
  ])

  useReactiveEvents(panel, options, [
    'onDidChangeViewState',
    'onDidDispose',
  ])

  const forceReload = shallowRef(0)
  watchEffect(() => {
    webview.html = `${toValue(html)}<!--${forceReload.value}-->`
  })

  useReactiveOptions(webview, { options: options.webviewOptions }, [
    'options',
  ])

  useReactiveEvents(webview, options, [
    'onDidReceiveMessage',
  ])

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
    /**
     * @see {@linkcode WebviewPanel.viewColumn}
     */
    viewColumn: computed(() => viewColumn.value),
    /**
     * @see {@linkcode WebviewPanel.active}
     */
    active: computed(() => active.value),
    /**
     * @see {@linkcode WebviewPanel.visible}
     */
    visible: computed(() => visible.value),
    /**
     * @see {@linkcode WebviewPanel.reveal}
     */
    reveal: panel.reveal.bind(panel),
    /**
     * @see {@linkcode Webview.postMessage}
     */
    postMessage: webview.postMessage.bind(webview),
    /**
     * @see {@linkcode Webview.asWebviewUri}
     */
    asWebviewUri: webview.asWebviewUri.bind(webview),
    /**
     * Force reload the webview content.
     */
    forceReload: () => { forceReload.value++ },
  }
}
