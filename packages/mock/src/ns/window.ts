import type vscode from 'vscode'
import type { MockVscode } from '.'
import type { WindowNS } from '../types'
import { vi } from 'vitest'
import { EventEmitter } from '../class/EventEmitter'
import { ColorThemeKind } from '../enum/ColorThemeKind'
import { TextDocument } from '../internal/TextDocument'
import { TextEditor } from '../internal/TextEditor'
import { createState } from '../utils/state'
import { Unimplemented } from '../utils/unimplemented'

export function createMockWindow(_context: MockVscode) {
  const _init = _context._config.init.window

  return new (class implements WindowNS {
    _activeTextEditor = createState(_init.activeTextEditor)
    get activeTextEditor(): vscode.TextEditor | undefined {
      return this._activeTextEditor.value
    }
    set activeTextEditor(value: vscode.TextEditor | undefined) {
      this._activeTextEditor.update(value as TextEditor | undefined)
    }
    _onDidChangeActiveTextEditor = this._activeTextEditor.eventEmitter
    onDidChangeActiveTextEditor = this._activeTextEditor.event

    _visibleTextEditors = createState(_init.visibleTextEditors)
    get visibleTextEditors(): readonly vscode.TextEditor[] {
      return this._visibleTextEditors.value
    }
    set visibleTextEditors(value: readonly vscode.TextEditor[]) {
      this._visibleTextEditors.update(value as readonly TextEditor[])
    }
    _onDidChangeVisibleTextEditors = this._visibleTextEditors.eventEmitter
    onDidChangeVisibleTextEditors = this._visibleTextEditors.event

    _onDidChangeTextEditorSelection = new EventEmitter<vscode.TextEditorSelectionChangeEvent>()
    onDidChangeTextEditorSelection = this._onDidChangeTextEditorSelection.event

    _onDidChangeTextEditorVisibleRanges = new EventEmitter<vscode.TextEditorVisibleRangesChangeEvent>()
    onDidChangeTextEditorVisibleRanges = this._onDidChangeTextEditorVisibleRanges.event

    _onDidChangeTextEditorOptions = new EventEmitter<vscode.TextEditorOptionsChangeEvent>()
    onDidChangeTextEditorOptions = this._onDidChangeTextEditorOptions.event

    _onDidChangeTextEditorViewColumn = new EventEmitter<vscode.TextEditorViewColumnChangeEvent>()
    onDidChangeTextEditorViewColumn = this._onDidChangeTextEditorViewColumn.event

    async showTextDocument(document: vscode.TextDocument, column?: vscode.ViewColumn, preserveFocus?: boolean): Promise<vscode.TextEditor>
    async showTextDocument(document: vscode.TextDocument, options?: vscode.TextDocumentShowOptions): Promise<vscode.TextEditor>
    async showTextDocument(uri: vscode.Uri, options?: vscode.TextDocumentShowOptions): Promise<vscode.TextEditor>
    async showTextDocument(docOrUri: vscode.TextDocument | vscode.Uri, columnOrOptions?: vscode.ViewColumn | vscode.TextDocumentShowOptions, _preserveFocus?: boolean): Promise<vscode.TextEditor> {
      const document = docOrUri instanceof TextDocument ? docOrUri : await _context.workspace.openTextDocument(docOrUri as vscode.Uri)
      let editor = this._visibleTextEditors.value.find(editor => editor.document === document)
      if (!editor) {
        editor = new TextEditor(_context, document as TextDocument)
        this._visibleTextEditors.update([...this._visibleTextEditors.value, editor])
      }
      this._activeTextEditor.update(editor)
      editor._viewColumn = typeof columnOrOptions === 'number' ? columnOrOptions : columnOrOptions?.viewColumn
      editor._viewColumn = editor._viewColumn && editor._viewColumn > 0 ? editor._viewColumn : undefined
      return editor
    }

    showInformationMessage = vi.fn((..._args: any) => Unimplemented('showInformationMessage'))
    showWarningMessage = vi.fn((..._args: any) => Unimplemented('showInformationMessage'))
    showErrorMessage = vi.fn((..._args: any) => Unimplemented('showInformationMessage'))
    showQuickPick = vi.fn((..._args: any) => Unimplemented('showQuickPick'))
    showWorkspaceFolderPick = vi.fn((..._args: any) => Unimplemented('showWorkspaceFolderPick'))
    showOpenDialog = vi.fn((..._args: any) => Unimplemented('showOpenDialog'))
    showSaveDialog = vi.fn((..._args: any) => Unimplemented('showSaveDialog'))
    showInputBox = vi.fn((..._args: any) => Unimplemented('showInputBox'))
    createQuickPick = Unimplemented('TODO')
    createInputBox = Unimplemented('TODO')
    createStatusBarItem = Unimplemented('TODO')
    createOutputChannel = Unimplemented('TODO')
    createWebviewPanel = Unimplemented('TODO')
    registerWebviewPanelSerializer = Unimplemented('TODO')
    setStatusBarMessage = Unimplemented('TODO')
    withScmProgress = Unimplemented('TODO')
    withProgress = Unimplemented('TODO')
    createTerminal = Unimplemented('TODO')
    registerTreeDataProvider = Unimplemented('TODO')
    createTreeView = Unimplemented('TODO')
    registerUriHandler = Unimplemented('TODO')
    registerWebviewViewProvider = Unimplemented('TODO')
    registerCustomEditorProvider = Unimplemented('TODO')

    _windowState = createState(_init.state)
    get state(): vscode.WindowState {
      return this._windowState.value
    }
    _onDidChangeWindowState = this._windowState.eventEmitter
    onDidChangeWindowState = this._windowState.event

    _activeColorTheme = createState(_init.activeColorTheme)
    get activeColorTheme(): vscode.ColorTheme {
      return this._activeColorTheme.value
    }
    set activeColorTheme(value: vscode.ColorTheme) {
      this._activeColorTheme.update(value)
    }
    _onDidChangeActiveColorTheme = this._activeColorTheme.eventEmitter
    onDidChangeActiveColorTheme = this._activeColorTheme.event
  })()
}

export const defaultWindowInitConfig = {
  state: {
    focused: true,
    active: true,
  } as vscode.WindowState,
  activeColorTheme: {
    kind: ColorThemeKind.Dark,
  } as vscode.ColorTheme,
  activeTextEditor: undefined as TextEditor | undefined,
  visibleTextEditors: [] as readonly TextEditor[],
}

export type MockWindow = ReturnType<typeof createMockWindow>
