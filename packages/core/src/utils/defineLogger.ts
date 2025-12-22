import type { LogOutputChannel } from 'vscode'
import { computed, shallowRef } from '@reactive-vscode/reactivity'
import { env, window } from 'vscode'
import { useDisposable } from '../composables'
import { onActivate } from './onActivate'

const methods = [
  'append',
  'appendLine',
  'replace',
  'clear',
  'show',
  'hide',

  'trace',
  'debug',
  'info',
  'warn',
  'error',
] satisfies (keyof LogOutputChannel)[]
type MethodKey = typeof methods[number]

/**
 * Define a logger which is usable before activation.
 *
 * @category view
 */
export function defineLogger(name: string) {
  const logger = shallowRef<LogOutputChannel | null>(null)
  const logLevel = shallowRef(env.logLevel) // Defaults to env.logLevel

  const delayedOps: (() => void)[] = []

  onActivate(() => {
    const l = logger.value = useDisposable(window.createOutputChannel(name, { log: true }))

    logLevel.value = l.logLevel
    useDisposable(l.onDidChangeLogLevel((ev) => {
      logLevel.value = ev
    }))

    delayedOps.forEach(op => op())
  })

  const wrapped = {} as Pick<LogOutputChannel, MethodKey>
  for (const method of methods) {
    wrapped[method] = (...args: any[]): void => {
      if (logger.value) {
        // @ts-expect-error - spread args
        logger.value[method](...args)
      }
      else {
        // @ts-expect-error - spread args
        delayedOps.push(() => logger.value[method](...args))
      }
    }
  }

  return {
    logger: computed(() => logger.value),
    ...wrapped,
  }
}
