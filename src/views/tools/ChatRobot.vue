<script setup lang="ts">
import LeftChatList from '@/components/LeftChatList.vue';
import MiddleContent from '@/components/MiddleContent.vue';
import { ref } from 'vue';

// 1. 历史记录
// 2. langgraph
// 3. documentChain

const currentSessionId = ref('');
const leftChatListRef = ref<InstanceType<typeof LeftChatList> | null>(null);

function handleSessionChange(sessionId: string) {
  currentSessionId.value = sessionId;
}

function addConversation(data: { sessionId: string; content: string }) {
  if (leftChatListRef.value) {
    leftChatListRef.value.handleAddConversation(data);
  }
}

</script>

<template>
    <div style="display: flex; height: 100%;width: 100%;">
      <div style="height: 100%;width: 280px;">
        <LeftChatList ref="leftChatListRef" @session-change="handleSessionChange"/>
      </div>
      <div style="height: 100%;width: calc(100% - 280px);">
        <MiddleContent :session-id="currentSessionId" :add-conversation="addConversation"/>
      </div>
    </div>
</template>

<style scoped>

</style>