import type { MaybeRef, MaybeRefOrGetter } from '@reactive-vscode/reactivity'
import type { ChatFollowupProvider, ChatRequestHandler, IconPath } from 'vscode'
import { toValue, unref, watch, watchEffect } from '@reactive-vscode/reactivity'
import { chat } from 'vscode'
import { useDisposable } from './useDisposable'
import { useEvent } from './useEvent'
import { useReactiveOptions } from './useReactiveOptions'

export interface ChatParticipantOptions {
  iconPath?: MaybeRefOrGetter<IconPath>
  followupProvider?: MaybeRefOrGetter<ChatFollowupProvider>
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
  ])

  if (options.followupProvider !== undefined) {
    watchEffect(() => {
      participant.followupProvider = toValue(options.followupProvider)
    })
  }

  watch(() => unref(handler), (handler) => {
    participant.requestHandler = handler
  })

  return {
    participant,
    onDidReceiveFeedback: useEvent(participant.onDidReceiveFeedback),
  }
}
