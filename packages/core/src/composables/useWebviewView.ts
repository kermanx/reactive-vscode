import type { MaybeRefOrGetter } from '@reactive-vscode/reactivity'
import type { ViewBadge, WebviewOptions, WebviewView, WebviewViewResolveContext } from 'vscode'
import { computed, ref as shallowRef, toValue, watchEffect } from '@reactive-vscode/reactivity'
import { window } from 'vscode'
import { useDisposable } from './useDisposable'
import { useViewBadge } from './useViewBadge'
import { useViewDescription } from './useViewDescription'
import { useViewTitle } from './useViewTitle'

export interface WebviewViewRegisterOptions {
  retainContextWhenHidden?: boolean
  onDidReceiveMessage?: (message: any) => void
  webviewOptions?: MaybeRefOrGetter<WebviewOptions>
  title?: MaybeRefOrGetter<string | undefined>
  description?: MaybeRefOrGetter<string | undefined>
  badge?: MaybeRefOrGetter<ViewBadge | undefined>
}

/**
 * Register a webview view. See `vscode::window.registerWebviewViewProvider`.
 *
 * @category view
 */
export function useWebviewView(
  viewId: string,
  html: MaybeRefOrGetter<string>,
  options?: WebviewViewRegisterOptions,
) {
  const view = shallowRef<WebviewView>()
  const context = shallowRef<WebviewViewResolveContext>()
  useDisposable(window.registerWebviewViewProvider(
    viewId,
    {
      resolveWebviewView(viewArg, contextArg) {
        view.value = viewArg
        context.value = contextArg
        if (options?.onDidReceiveMessage) {
          viewArg.webview.onDidReceiveMessage(options.onDidReceiveMessage)
        }
      },
    },
    {
      webviewOptions: {
        retainContextWhenHidden: options?.retainContextWhenHidden,
      },
    },
  ))

  const forceRefreshId = shallowRef(0)

  function forceRefresh() {
    forceRefreshId.value++
  }

  watchEffect(() => {
    if (view.value) {
      view.value.webview.html = `${toValue(html)}<!--${forceRefreshId.value}-->`
    }
  })

  const webviewOptions = options?.webviewOptions
  if (webviewOptions) {
    watchEffect(() => {
      if (view.value) {
        view.value.webview.options = toValue(webviewOptions)
      }
    })
  }

  if (options?.title) {
    useViewTitle(view, options.title)
  }
  if (options?.description) {
    useViewDescription(view, options.description)
  }
  if (options?.badge) {
    useViewBadge(view, options.badge)
  }

  function postMessage(message: any) {
    return view.value?.webview.postMessage(message)
  }

  return {
    view: computed(() => view.value),
    webview: computed(() => view.value?.webview),
    context: computed(() => context.value),
    postMessage,
    forceRefresh,
  }
}
