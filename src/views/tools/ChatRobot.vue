<script setup lang="ts">
import LeftChatList from '@/components/LeftChatList.vue';
import MiddleContent from '@/components/MiddleContent.vue';
import { ref } from 'vue';

// 1. 历史记录
// 2. langgraph
// 3. documentChain
const middleContentRef = ref<typeof MiddleContent>();

function clearList() {
  if (middleContentRef.value) {
    middleContentRef.value.clearList();
  }
}
</script>

<template>
    <div style="display: flex; height: 100%;width: 100%;">
      <div style="height: 100%;width: 280px;">
        <LeftChatList @clearList="clearList"/>
      </div>
      <div style="height: 100%;width: calc(100% - 280px);">
        <MiddleContent ref="middleContentRef"/>
      </div>
    </div>
</template>

<style scoped>

</style>