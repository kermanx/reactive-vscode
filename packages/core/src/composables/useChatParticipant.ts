import type { MaybeRef, MaybeRefOrGetter } from '@reactive-vscode/reactivity'
import type { ChatFollowupProvider, ChatRequestHandler, IconPath } from 'vscode'
import { unref, watchEffect } from '@reactive-vscode/reactivity'
import { chat } from 'vscode'
import { createKeyedComposable } from '../utils'
import { useDisposable } from './useDisposable'
import { useEvent } from './useEvent'
import { useReactiveOptions } from './useReactiveOptions'

export interface ChatParticipantOptions {
  iconPath?: MaybeRefOrGetter<IconPath>
  followupProvider?: MaybeRef<ChatFollowupProvider>
}

/**
 * @reactive `chat.createChatParticipant`
 * @category chat
 */
export const useChatParticipant = createKeyedComposable((
  id: string,
  handler: MaybeRef<ChatRequestHandler>,
  options: ChatParticipantOptions = {},
) => {
  const participant = useDisposable(chat.createChatParticipant(id, unref(handler)))

  useReactiveOptions(participant, options, [
    'iconPath',
  ])

  if (options.followupProvider !== undefined) {
    watchEffect(() => {
      participant.followupProvider = unref(options.followupProvider)
    })
  }

  watchEffect(() => {
    participant.requestHandler = unref(handler)
  })

  return {
    onDidReceiveFeedback: useEvent(participant.onDidReceiveFeedback),
  }
}, id => id)
