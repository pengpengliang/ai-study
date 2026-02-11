<script setup>
import { ChatOpenAI} from "@langchain/openai";
import { onMounted } from 'vue';

const model = new ChatOpenAI({
  model: "gpt-4.1",
  configuration: {
    base_url: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    apiKey: "sk-a51637d1003e4f34b02ffb4def151e95",
  },
});

// 使用onMounted钩子执行异步操作
onMounted(async () => {
  // Basic usage
  const response = await model.invoke(
    "What was a positive news story from today?"
  );
  console.log(response)
});
</script>

<template>
  <div>123</div>
</template>

