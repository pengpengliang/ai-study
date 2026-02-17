<script setup lang="ts">
import type { ConversationItem,ConversationMenuCommand } from 'vue-element-plus-x/types/Conversations';
import { markRaw, ref, shallowRef, defineEmits, defineExpose } from 'vue';
import { Conversations } from 'vue-element-plus-x';
import { ElMessage, ElButton } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
const menuTestItems  = ref<ConversationItem<{ id: string; label: string }>[]>([]);

const activeKey1 = ref('1');
const emit = defineEmits<{
  'session-change': [sessionId: string]
}>();

function handleMenuCommand(
  command: ConversationMenuCommand,
  item: ConversationItem
) {
  console.log('内置菜单点击事件：', command, item);
  // 直接修改 item 是否生效
  if (command === 'delete') {
    const index = menuTestItems.value.findIndex(
      itemSlef => itemSlef.key === item.key
    );

    if (index !== -1) {
      menuTestItems.value.splice(index, 1);
      console.log('删除成功');
      ElMessage.success('删除成功');
    }
  }
  if (command === 'rename') {
    item.label = '已修改';
    console.log('重命名成功');
    ElMessage.success('重命名成功');
  }
}
function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function createSessionId() {
  const sessionId = `${new Date().getTime()}`;
  emit('session-change', sessionId);
}

function handleAddConversation(data: { sessionId: string; content: string }) {
  menuTestItems.value.push({
    id: data.sessionId,
    label: data.content,
    group: getCurrentDate(),
  });
  // 自动选择新创建的会话
  activeKey1.value = data.sessionId;
}



function handleSessionSelect() {
  if (activeKey1.value) {
    emit('session-change', activeKey1.value);
  }
}

defineExpose({
  handleAddConversation
});
</script>

<template>
  <div style="height: 100%;">
    <div style="height: 32px; display: flex; align-items: center; justify-content: center;">
      <el-button type="primary" :icon="Plus" @click="createSessionId">添加新会话</el-button>
    </div>
    <div style="display: flex; flex-direction: column; gap: 12px; height: calc(100% - 32px);">
      <Conversations
        v-model:active="activeKey1"
        :items="menuTestItems "
        groupable
        :label-max-width="200"
        :show-tooltip="false"
        row-key="id"
        show-to-top-btn
        show-built-in-menu
        @menu-command="handleMenuCommand"
        @active-change="handleSessionSelect"
      />
    </div>
  </div>

</template>

<style scoped lang="less"></style>