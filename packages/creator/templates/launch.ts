export default `{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Run Extension",
      "type": "extensionHost",
      "request": "launch",
      "args": [
        "--extensionDevelopmentPath=\${workspaceFolder}"
      ],
      "outFiles": [
        "\${workspaceFolder}/dist/**/*.js"
      ]
    }
  ]
}
`
