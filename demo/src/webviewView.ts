import { computed, defineService, useWebviewView } from 'reactive-vscode'
import { configs } from './configs'
import { calledTimes } from './states'

export const useDemoWebviewView = defineService(() => {
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
  <h1>Webview View</h1>
  <p>${configs.message} for ${calledTimes.value} times</p>
  <p><a href="command:reactive-vscode-demo.helloWorld">Say Hello World</a></p>
  <div style="display:flex; flex-wrap:wrap;">
    <input type="text" placeholder="Greeting Message" />
    <button onclick="updateMessage()">Update Message</button>
  </div>
  `)

  return useWebviewView(
    'reactive-webview-view',
    html,
    {
      webviewOptions: {
        enableScripts: true,
        enableCommandUris: true,
      },
      onDidReceiveMessage(ev) {
        if (ev.type === 'updateMessage')
          configs.message = ev.message
      },
    },
  )
})
