import type { MaybeRef, MaybeRefOrGetter } from '@reactive-vscode/reactivity'
import type { ChatParticipant, ChatRequestHandler } from 'vscode'
import type { EventListener } from '../utils'
import { isRef, unref, watch } from '@reactive-vscode/reactivity'
import { chat } from 'vscode'
import { useDisposable } from './useDisposable'
import { useReactiveEvents } from './useReactiveEvents'
import { useReactiveOptions } from './useReactiveOptions'

export interface ChatParticipantOptions {
  /**
   * @see {@linkcode ChatParticipant.iconPath}
   */
  iconPath?: MaybeRefOrGetter<ChatParticipant['iconPath']>

  /**
   * @see {@linkcode ChatParticipant.followupProvider}
   */
  followupProvider?: MaybeRefOrGetter<ChatParticipant['followupProvider']>

  /**
   * @see {@linkcode ChatParticipant.onDidReceiveFeedback}
   */
  onDidReceiveFeedback?: EventListener<ChatParticipant['onDidReceiveFeedback']>
}

/**
 * @reactive `chat.createChatParticipant`
 * @category chat
 */
export function useChatParticipant(
  id: string,
  handler: MaybeRef<ChatRequestHandler>,
  options: ChatParticipantOptions = {},
) {
  const participant = useDisposable(chat.createChatParticipant(id, unref(handler)))

  useReactiveOptions(participant, options, [
    'iconPath',
    'followupProvider',
  ])

  useReactiveEvents(participant, options, [
    'onDidReceiveFeedback',
  ])

  if (isRef(handler)) {
    watch(handler, (handler) => {
      participant.requestHandler = handler
    })
  }

  return participant
}
