import type vscode from 'vscode'

export class Position implements vscode.Position {
  constructor(public line: number, public character: number) {
  }

  isBefore(other: Position): boolean {
    return this.line < other.line || (this.line === other.line && this.character < other.character)
  }

  isBeforeOrEqual(other: Position): boolean {
    return this.line < other.line || (this.line === other.line && this.character <= other.character)
  }

  isAfter(other: Position): boolean {
    return this.line > other.line || (this.line === other.line && this.character > other.character)
  }

  isAfterOrEqual(other: Position): boolean {
    return this.line > other.line || (this.line === other.line && this.character >= other.character)
  }

  isEqual(other: Position): boolean {
    return this.line === other.line && this.character === other.character
  }

  compareTo(other: Position): number {
    if (this.line < other.line || (this.line === other.line && this.character < other.character)) {
      return -1
    }
    if (this.line > other.line || (this.line === other.line && this.character > other.character)) {
      return 1
    }
    return 0
  }

  translate(lineDelta?: number, characterDelta?: number): Position
  translate(change: { lineDelta?: number, characterDelta?: number }): Position
  translate(lineDeltaOrChange: number | { lineDelta?: number, characterDelta?: number } = 0, characterDelta = 0): Position {
    return typeof lineDeltaOrChange === 'object'
      ? new Position(
          (lineDeltaOrChange.lineDelta ?? 0) + this.line,
          (lineDeltaOrChange.characterDelta ?? 0) + this.character,
        )
      : new Position(
          lineDeltaOrChange + this.line,
          characterDelta + this.character,
        )
  }

  with(line?: number, character?: number): Position
  with(change: { line?: number, character?: number }): Position
  with(lineOrChange?: number | { line?: number, character?: number }, character?: number): Position {
    return typeof lineOrChange === 'object'
      ? new Position(
          lineOrChange.line ?? this.line,
          lineOrChange.character ?? this.character,
        )
      : new Position(
          lineOrChange ?? this.line,
          character ?? this.character,
        )
  }
}
