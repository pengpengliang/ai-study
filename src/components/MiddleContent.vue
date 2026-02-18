<script setup lang="ts">
import { defineExpose, ref,type Ref, watch } from 'vue';
import {Sender, BubbleList} from 'vue-element-plus-x'
import { ChatOpenAI} from "@langchain/openai";
import { MessagesPlaceholder, ChatPromptTemplate } from "@langchain/core/prompts"
import { RunnableWithMessageHistory } from "@langchain/core/runnables"
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history"
// import { ChatMessageHistory } from "@langchain/community/stores/message/in_memory";
// import { setVerbose, getVerbose } from "@langchain/core/globals";
// setVerbose(true)
import type {
  BubbleListItemProps,
  BubbleListProps
} from 'vue-element-plus-x/types/BubbleList';
import { useConversationStore } from '@/stores/conversation';
type listType = BubbleListItemProps & {
  key: number;
  role: 'user' | 'ai';
};

const conversationStore = useConversationStore();

// 当会话ID变化时，清空当前会话的历史记录
watch(() => conversationStore.currentSessionId, async (newSessionId:string, oldSessionId:string) => {
  if (oldSessionId && !conversationStore.isNewSession) {
    console.log('watch')
    const historyMsg = await getMessageHistoryBySessionId(newSessionId);
    chatList.value = handleHistoryMessageToList(historyMsg);
  }

});

// 示例调用
const chatList: Ref<BubbleListProps<listType>['list']> = ref([]);
const senderValue = ref('');
const senderLoading = ref(false);
const store = new Map();

async function getMessageHistory(sessionId: string) {
  if (store.has(sessionId)) {
    return store.get(sessionId);
  }
  const newHistory = new InMemoryChatMessageHistory();
  store.set(sessionId, newHistory);

  return newHistory;
}
const model = new ChatOpenAI({
  model: "qwen-flash",
  configuration: {
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
  },
  apiKey: import.meta.env.VITE_API_KEY,
})

// MessagesPlaceholder 用于告诉模型在哪里插入历史消息
  const prompt = ChatPromptTemplate.fromMessages([
    new MessagesPlaceholder("history"), // 历史消息的占位符
    ["human", "{input}"], // 用户当前输入的占位符
  ]);

  // 3. 构建核心链
  const chain = prompt.pipe(model);

   // 4. 创建带记忆功能的可运行对象
  // 它需要一个获取历史记录的函数
  const withMessageHistory = new RunnableWithMessageHistory({
    runnable: chain, // 传入核心链pnpm
    // 这个函数根据 sessionId 返回一个消息历史存储实例
    getMessageHistory,
    // 指定输入和历史消息在链中的键名
    inputMessagesKey: "input",
    historyMessagesKey: "history",
  });

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
    key: Date.now() + Math.random(), // 更安全的 key
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

function isNewSession(sessionId: string) {
  return !store.has(sessionId) && conversationStore.isNewSession;
}

async function getMessageHistoryBySessionId(sessionId: string) {
  const historyAfter = await withMessageHistory.getMessageHistory(sessionId);
  return historyAfter;
}

function handleHistoryMessageToList(historyMsg: { messages: any[]; }) {
  const list = historyMsg.messages.map((item) => {
    return createMessage(item.type === 'human' ? 'user' : 'ai', item.content, false, false);
  });
  return list;
}

async function chat(sessionId: string, message: string) {
  const isNew = isNewSession(sessionId);
  const config = { configurable: { sessionId } }; // 配置会话ID
  const response = await withMessageHistory.invoke({input: message}, config);
  // 如果是新建的会话，调用addConversation方法
  if (isNew) {
    // 检查当前sessionId是否是新建的
    conversationStore.addConversation(message);
  }

  return response;
}

async function handleSubmit(value: string) {
  if (!value.trim()) return; // 空值保护
  senderLoading.value = true;
  try {
    // 添加用户消息
    chatList.value.push(createMessage('user', value));
    console.log(chatList.value)
    senderValue.value = '';
    if (!conversationStore.currentSessionId || conversationStore.isNewSession) {
      conversationStore.changeIsNewSession(true)
      conversationStore.createSessionId()
    } else {
      conversationStore.changeIsNewSession(false)
    }

    // 调用模型
    const response = await chat(conversationStore.currentSessionId, value);
    // 添加 AI 回复
    chatList.value.push(createMessage('ai', response.content as string));
  } catch (error) {
    console.error('模型调用失败:', error);
    chatList.value.push(createMessage('ai', '抱歉，服务暂时不可用，请稍后再试。'));
  } finally {
    senderLoading.value = false;
  }
}

function clearList() {
  console.log('clearList')
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