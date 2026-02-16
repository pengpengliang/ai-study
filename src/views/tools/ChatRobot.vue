<script setup lang="ts">
import LeftChatList from '@/components/LeftChatList.vue';
import MiddleContent from '@/components/MiddleContent.vue';

// 1. 历史记录
// 2. langgraph
// 3. documentChain

</script>

<template>
    <div style="display: flex; height: 100%;width: 100%;">
      <div style="height: 100%;width: 280px;">
        <LeftChatList/>
      </div>
      <div style="height: 100%;width: calc(100% - 280px);">
        <MiddleContent/>
      </div>
    </div>
</template>

<style scoped>

</style>