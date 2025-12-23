import type { MaybeRefOrGetter } from '@reactive-vscode/reactivity'
import type { Uri, Webview, WebviewOptions, WebviewView, WebviewViewResolveContext } from 'vscode'
import type { EventListener } from '../utils'
import { computed, shallowRef, toValue, watchEffect } from '@reactive-vscode/reactivity'
import { window } from 'vscode'
import { useDisposable } from './useDisposable'
import { useReactiveEvents } from './useReactiveEvents'
import { useReactiveOptions } from './useReactiveOptions'
import { useViewVisibility } from './useViewVisibility'

type WebviewCreationOptions = (Parameters<typeof window.registerWebviewViewProvider>[2] & {})['webviewOptions'] & {}

export interface WebviewViewProps extends WebviewCreationOptions {
  /**
   * @see {@linkcode WebviewView.title}
   */
  title?: MaybeRefOrGetter<WebviewView['title']>

  /**
   * @see {@linkcode WebviewView.description}
   */
  description?: MaybeRefOrGetter<WebviewView['description']>

  /**
   * @see {@linkcode WebviewView.badge}
   */
  badge?: MaybeRefOrGetter<WebviewView['badge']>

  /**
   * @see {@linkcode WebviewViewOptions.onDidDispose}
   */
  onDidDispose?: EventListener<WebviewView['onDidDispose']>

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
 * @reactive {@linkcode window.registerWebviewViewProvider}
 * @category view
 */
export function useWebviewView(
  viewId: string,
  html: MaybeRefOrGetter<string>,
  options: WebviewViewProps = {},
) {
  const view = shallowRef<WebviewView>()
  const webview = computed(() => view.value?.webview)
  const context = shallowRef<WebviewViewResolveContext>()
  useDisposable(window.registerWebviewViewProvider(
    viewId,
    {
      resolveWebviewView(viewArg, contextArg) {
        view.value = viewArg
        context.value = contextArg
      },
    },
    {
      webviewOptions: {
        retainContextWhenHidden: options.retainContextWhenHidden,
      },
    },
  ))

  const forceReloadId = shallowRef(0)
  watchEffect(() => {
    if (view.value) {
      view.value.webview.html = `${toValue(html)}<!--${forceReloadId.value}-->`
    }
  })

  useReactiveOptions(view, options, [
    'title',
    'description',
    'badge',
  ])

  useReactiveEvents(view, options, [
    'onDidDispose',
  ])

  useReactiveOptions(webview, { options: options.webviewOptions }, [
    'options',
  ])

  useReactiveEvents(webview, options, [
    'onDidReceiveMessage',
  ])

  return {
    view: computed(() => view.value),
    /**
     * @see {@linkcode WebviewView.webview}
     */
    webview,
    /**
     * Additional metadata about the view being resolved.
     */
    context: computed(() => context.value),
    /**
     * @see {@linkcode WebviewView.visible}
     */
    visible: useViewVisibility(view),
    /**
     * @see {@linkcode WebviewView.show}
     */
    show: (preserveFocus?: boolean) => view.value?.show(preserveFocus),
    /**
     * @see {@linkcode Webview.postMessage}
     */
    postMessage: (message: any) => view.value?.webview.postMessage(message),
    /**
     * @see {@linkcode Webview.asWebviewUri}
     */
    asWebviewUri: (resource: Uri) => webview.value?.asWebviewUri(resource),
    /**
     * Force reload the webview content.
     */
    forceReload: () => { forceReloadId.value++ },
  }
}
