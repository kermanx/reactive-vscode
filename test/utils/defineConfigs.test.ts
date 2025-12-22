import type { ConfigRef, ConfigType } from 'reactive-vscode'
import { defineConfigs } from 'reactive-vscode'
import { describe, expectTypeOf, it } from 'vitest'

describe('defineConfigs', () => {
  it.skip('should have correct type', () => {
    expectTypeOf(
      defineConfigs('test', {
        str: String,
        num: Number,
        bool: Boolean,
        null: null,
        arr: Array,
        obj: Object as ConfigType<{ a: number }>,
        union: [String, Number],
      }),
    ).toMatchTypeOf<{
      str: ConfigRef<string>
      num: ConfigRef<number>
      bool: ConfigRef<boolean>
      null: ConfigRef<null>
      arr: ConfigRef<any[]>
      obj: ConfigRef<{ a: number }>
      union: ConfigRef<string | number>
    }>()

    expectTypeOf(
      defineConfigs('test', {
        num: 1,
        obj: { a: 1 },
      }),
    ).toMatchTypeOf<{
      num: ConfigRef<number>
      obj: ConfigRef<{
        a: number
      }>
    }>()
  })
})
