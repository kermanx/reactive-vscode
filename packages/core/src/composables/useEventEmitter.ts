import type { Event } from 'vscode'
import { EventEmitter } from 'vscode'
import { useDisposable } from './useDisposable'
import { useEvent } from './useEvent'

interface UseEventEmitterReturn<T> {
  emitter: EventEmitter<T>
  event: Event<T>
  fire: EventEmitter<T>['fire']
}

/**
 * @category utilities
 * @reactive `EventEmitter`
 */
export function useEventEmitter<T>(eventEmitter?: EventEmitter<T>, listeners?: ((e: T) => any)[]): UseEventEmitterReturn<T>
export function useEventEmitter<T>(listeners: ((e: T) => any)[]): UseEventEmitterReturn<T>
export function useEventEmitter<T>(eventEmitterOrListeners?: EventEmitter<T> | ((e: T) => any)[], listeners2: ((e: T) => any)[] = []) {
  const listeners = Array.isArray(eventEmitterOrListeners) ? eventEmitterOrListeners : listeners2 ?? []
  const emitter = useDisposable(Array.isArray(eventEmitterOrListeners) || eventEmitterOrListeners == null ? new EventEmitter<T>() : eventEmitterOrListeners)
  const event = useEvent(emitter.event, listeners)

  return {
    emitter,
    event,
    fire: emitter.fire.bind(emitter),
  }
}
