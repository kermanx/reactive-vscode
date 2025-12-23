import { computed, shallowRef } from '@reactive-vscode/reactivity'
import { tasks } from 'vscode'
import { defineService } from '../utils'
import { useDisposable } from './useDisposable'

/**
 * @reactive `tasks.taskExecutions`
 */
export const useTaskExecutions = defineService(() => {
  const taskExecutions = shallowRef(tasks.taskExecutions)

  function update() {
    taskExecutions.value = tasks.taskExecutions
  }

  useDisposable(tasks.onDidStartTask(update))
  useDisposable(tasks.onDidEndTask(update))

  return computed(() => taskExecutions.value)
})
