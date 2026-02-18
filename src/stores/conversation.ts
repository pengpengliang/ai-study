import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ConversationItem } from 'vue-element-plus-x/types/Conversations';

// 获取当前日期，格式为 yyyy-mm-dd
function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const useConversationStore = defineStore('conversation', () => {
  const isNewSession = ref(false)
  // 会话列表
  const conversationList = ref<ConversationItem<{ id: string; label: string }>[]>([]);

  // 当前选中的会话ID
  const currentSessionId = ref('');

  function changeIsNewSession(value: boolean) {
    isNewSession.value = value
  }

  // 生成会话ID
  function createSessionId() {
    currentSessionId.value = `${new Date().getTime()}`;
  }

  // 添加新会话
  function addConversation(content: string) {
    conversationList.value.push({
      id: currentSessionId.value,
      label: content,
      group: getCurrentDate(),
    });
  }

  // 切换会话
  function switchConversation(sessionId: string) {
    changeIsNewSession(false)
    currentSessionId.value = sessionId;
  }

  // 删除会话
  function deleteConversation(sessionId: string) {
    const index = conversationList.value.findIndex(item => item.id === sessionId);
    if (index !== -1) {
      conversationList.value.splice(index, 1);
      // 如果删除的是当前会话，清空当前会话ID
      if (currentSessionId.value === sessionId) {
        currentSessionId.value = conversationList.value.length > 0 ? conversationList.value[0].id : '';
      }
    }
  }

  return {
    conversationList,
    currentSessionId,
    isNewSession,
    changeIsNewSession,
    createSessionId,
    addConversation,
    switchConversation,
    deleteConversation
  };
});
