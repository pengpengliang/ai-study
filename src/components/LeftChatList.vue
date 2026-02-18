<script setup lang="ts">
import type { ConversationItem,ConversationMenuCommand } from 'vue-element-plus-x/types/Conversations';
import { defineEmits, markRaw, ref, shallowRef } from 'vue';
import { Conversations } from 'vue-element-plus-x';
import { ElMessage, ElButton } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { useConversationStore } from '@/stores/conversation';

const conversationStore = useConversationStore();

const emits = defineEmits(['clearList']);

function handleMenuCommand(
  command: ConversationMenuCommand,
  item: ConversationItem
) {
  console.log('内置菜单点击事件：', command, item);
  // 直接修改 item 是否生效
  if (command === 'delete') {
    conversationStore.deleteConversation(item.id as string);
    console.log('删除成功');
    ElMessage.success('删除成功');
  }
  if (command === 'rename') {
    item.label = '已修改';
    console.log('重命名成功');
    ElMessage.success('重命名成功');
  }
}

function handleSessionSelect(item: ConversationItem<{ id: string; label: string }>) {
  if (conversationStore.currentSessionId) {
    conversationStore.switchConversation(item.id as string);
  }
}
</script>

<template>
  <div style="height: 100%;">
    <div style="height: 32px; display: flex; align-items: center; justify-content: center;">
      <el-button type="primary" :icon="Plus" @click="emits('clearList'); conversationStore.changeIsNewSession(true)">添加新会话</el-button>
    </div>
    <div style="display: flex; flex-direction: column; gap: 12px; height: calc(100% - 32px);">
      <Conversations
        v-model:active="conversationStore.currentSessionId"
        :items="conversationStore.conversationList"
        groupable
        :label-max-width="200"
        :show-tooltip="false"
        row-key="id"
        show-to-top-btn
        show-built-in-menu
        @menu-command="handleMenuCommand"
        @change="handleSessionSelect"
      />
    </div>
  </div>

</template>

<style scoped lang="less"></style>