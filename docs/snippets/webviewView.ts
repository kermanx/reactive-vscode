import { computed, defineService, ref, useWebviewView } from 'reactive-vscode'

export const useDemoWebviewView = defineService(() => {
  const message = ref('')
  const html = computed(() => `
  <script>
    vscode = acquireVsCodeApi()
    function updateMessage() {
      vscode.postMessage({
        type: 'updateMessage',
        message: document.querySelector('input').value,
      })
    }
  </script>
  <p>${message.value}</p>
  <div style="display:flex; flex-wrap:wrap;">
    <input type="text" placeholder="Input Message" />
    <button onclick="updateMessage()">Update Message</button>
  </div>
  `)

  const { postMessage } = useWebviewView(
    'reactive-webview-view',
    html,
    {
      webviewOptions: {
        enableScripts: true,
        enableCommandUris: true,
      },
      onDidReceiveMessage(ev) {
        if (ev.type === 'updateMessage')
          message.value = ev.message
      },
    },
  )

  return { message, postMessage }
})
