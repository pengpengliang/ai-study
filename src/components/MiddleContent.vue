<script setup lang="ts">
import {ref, type Ref, watch, shallowRef } from 'vue';
import { Sender, BubbleList } from 'vue-element-plus-x';
import type {
  BubbleListItemProps,
  BubbleListProps
} from 'vue-element-plus-x/types/BubbleList';
import { useConversationStore } from '@/stores/conversation';
import { chatService } from '@/services/chatService';

type listType = BubbleListItemProps & {
  key: number;
  role: 'user' | 'ai';
};

const conversationStore = useConversationStore();

const chatList: Ref<BubbleListProps<listType>['list']> = ref([]);
const senderValue = ref('');
const senderLoading = ref(false);

const USER_AVATAR = 'https://avatars.githubusercontent.com/u/76239030?v=4';
const AI_AVATAR = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png';

function createMessage(
  role: 'user' | 'ai',
  content: string,
  loading = false,
  typing = false
): listType {
  const isUser = role === 'user';
  return {
    key: Date.now() + Math.random(),
    role,
    placement: isUser ? 'end' : 'start',
    content,
    loading,
    shape: 'corner',
    variant: isUser ? 'outlined' : 'filled',
    isMarkdown: false,
    typing,
    isFog: true,
    avatar: isUser ? USER_AVATAR : AI_AVATAR,
    avatarSize: '24px',
    avatarGap: '12px'
  };
}

function handleHistoryMessageToList(historyMsg: { messages: any[]; }) {
  return historyMsg.messages.map((item) => {
    return createMessage(item.type === 'human' ? 'user' : 'ai', item.content, false, false);
  });
}

watch(() => conversationStore.currentSessionId, async (newSessionId: string) => {
  if (newSessionId && !conversationStore.isNewSession) {
    const historyMsg = await chatService.getMessageHistory(newSessionId);
    chatList.value = handleHistoryMessageToList(historyMsg);
  } else {
    chatList.value = [];
  }
}, { immediate: true });

async function handleSubmit(value: string) {
  if (!value.trim()) return;
  senderLoading.value = true;
  try {

    senderValue.value = '';

    if (!conversationStore.currentSessionId || conversationStore.isNewSession) {
      conversationStore.changeIsNewSession(true);
      conversationStore.createSessionId();
    } else {
      conversationStore.changeIsNewSession(false);
    }

    const response = await chatService.chat(conversationStore.currentSessionId, value);
    chatList.value.push(createMessage('user', value));
    chatList.value.push(createMessage('ai', response.content as string));

    if (conversationStore.isNewSession) {
      conversationStore.addConversation(value);
    }
  } catch (error) {
    console.error('模型调用失败:', error);
    chatList.value.push(createMessage('ai', '抱歉，服务暂时不可用，请稍后再试。'));
  } finally {
    senderLoading.value = false;
  }
}

function clearList() {
  chatList.value = [];
}

defineExpose({
  clearList,
})
</script>

<template>
    <div style="height: calc(100% - 90px);">
        <BubbleList
        :list="chatList"
        always-show-scrollbar
        btn-loading
        />
    </div>
    <div style="height: 90px; padding: 0 24px;">
        <Sender v-model="senderValue" :loading="senderLoading" variant="updown" clearable @submit="handleSubmit"/>
    </div>

</template>



<style scoped>

</style>