export default (publisher: string, identifier: string, displayName: string) => `# ${displayName}

[![Version](https://img.shields.io/visual-studio-marketplace/v/${publisher}.${identifier})](https://marketplace.visualstudio.com/items?itemName=${publisher}.${identifier}) [![Installs](https://img.shields.io/visual-studio-marketplace/i/${publisher}.${identifier})](https://marketplace.visualstudio.com/items?itemName=${publisher}.${identifier}) [![Reactive VSCode](https://img.shields.io/badge/Reactive-VSCode-%23007ACC?style=flat&labelColor=%23229863)](https://kermanx.github.io/reactive-vscode/)

A VS Code extension created with [Reactive VS Code](https://kermanx.github.io/reactive-vscode/).

## Directory Structure

* \`package.json\` - this is the manifest file in which you declare your extension and command.
* \`src/extension.ts\` - this is the main file where you write your extension.

## Get started

* Open this repository in VS Code.
* Run \`pnpm install\` to install the dependencies.
* Run \`pnpm dev\` to compile the extension and watch for changes.  
* Press \`F5\` to open a new window with your extension loaded.
* Run your command from the command palette by pressing (\`Ctrl+Shift+P\` or \`Cmd+Shift+P\` on Mac) and typing \`Hello World\`.
* Set breakpoints in your code inside \`src/extension.ts\` to debug your extension.
* Find output from your extension in the debug console.

## Make changes

* You can relaunch the extension from the debug toolbar after changing code in \`src/extension.ts\`.
* You can also reload (\`Ctrl+R\` or \`Cmd+R\` on Mac) the VS Code window with your extension to load your changes.

## Go further

* [Follow UX guidelines](https://code.visualstudio.com/api/ux-guidelines/overview) to create extensions that seamlessly integrate with VS Code's native interface and patterns.
* [Publish your extension](https://code.visualstudio.com/api/working-with-extensions/publishing-extension) on the VS Code extension marketplace.
* Automate builds by setting up [Continuous Integration](https://code.visualstudio.com/api/working-with-extensions/continuous-integration).
`
