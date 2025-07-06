export default (publisher: string, identifier: string, displayName: string, coreVersion: string) => `{
  "publisher": "${publisher}",
  "name": "${identifier}",
  "displayName": "${displayName}",
  "type": "module",
  "version": "0.0.1",
  "private": true,
  "categories": [
    "Other"
  ],
  "main": "./dist/extension.js",
  "engines": {
    "vscode": "^1.100.0"
  },
  "activationEvents": [
    "onStartupFinished"
  ],
  "contributes": {
    "commands": [
      {
        "command": "${identifier}.helloWorld",
        "title": "Hello World"
      }
    ],
    "configuration": {
      "title": "${displayName}",
      "properties": {
        "${identifier}.message": {
          "type": "string",
          "default": "Hello World",
          "description": "The message to show in the notification"
        }
      }
    }
  },
  "scripts": {
    "build": "tsdown --env.NODE_ENV production",
    "dev": "tsdown --watch ./src --env.NODE_ENV development",
    "typecheck": "tsc --noEmit",
    "vscode:prepublish": "pnpm run build"
  },
  "devDependencies": {
    "@types/node": "22.x",
    "@types/vscode": "^1.101.0",
    "reactive-vscode": "${coreVersion}",
    "tsdown": "^0.12.8",
    "typescript": "^5.8.3"
  }
}
`
