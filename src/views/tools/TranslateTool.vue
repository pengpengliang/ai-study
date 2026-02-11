<script setup>
import { ref } from 'vue';
import { ChatOpenAI} from "@langchain/openai";
import { SystemMessagePromptTemplate, ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";

const model = new ChatOpenAI({
  model: "qwen-max-latest",
  configuration: {
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
  },
  apiKey: import.meta.env.VITE_API_KEY,
});

// 响应式数据
const text = ref('');
const language = ref('英文');
const translationResult = ref('');
const isLoading = ref(false);

// 支持的语言选项
const languageOptions = [
  { value: '英文', label: '英文' },
  { value: '中文', label: '中文' },
  { value: '日文', label: '日文' },
  { value: '韩文', label: '韩文' },
  { value: '法文', label: '法文' },
  { value: '德文', label: '德文' },
  { value: '西班牙文', label: '西班牙文' },
  { value: '葡萄牙文', label: '葡萄牙文' },
  { value: '俄文', label: '俄文' },
];

const translate = async () => {
  if (!text.value.trim()) {
    alert('请输入要翻译的中文');
    return;
  }

  isLoading.value = true;
  try {
    const message = SystemMessagePromptTemplate.fromTemplate("请将以下内容翻译成{language}");
    const chatPrompt = ChatPromptTemplate.fromMessages([
      message,
      ["human", "{text}"],
    ]);

    // 链式调用
    const chain = RunnableSequence.from([
      chatPrompt,
      model,
      new StringOutputParser(),
    ]);
    const response = await chain.invoke({
      text: text.value,
      language: language.value,
    });
    translationResult.value = response;
    console.log(response);
  } catch (error) {
    console.error('翻译失败:', error);
    alert('翻译失败，请稍后重试');
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="translation-container">
    <h2>翻译工具</h2>
    <div class="form-group">
      <label for="text-input">输入要翻译的内容：</label>
      <textarea
        id="text-input"
        v-model="text"
        placeholder="请输入要翻译的内容"
        rows="4"
        cols="50"
      ></textarea>
    </div>
    <div class="form-group">
      <label for="language-select">目标语言：</label>
      <select id="language-select" v-model="language">
        <option v-for="option in languageOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>
    <button
      @click="translate"
      :disabled="isLoading"
      class="send-button"
    >
      {{ isLoading ? '翻译中...' : '开始翻译' }}
    </button>
    <div v-if="translationResult" class="result-container">
      <h3>翻译结果：</h3>
      <p>{{ translationResult }}</p>
    </div>
  </div>
</template>

<style scoped>
.translation-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h2 {
  text-align: center;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #555;
}

textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  font-size: 16px;
}

select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.send-button {
  display: block;
  width: 100%;
  padding: 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.send-button:hover:not(:disabled) {
  background-color: #45a049;
}

.send-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.result-container {
  margin-top: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.result-container h3 {
  margin-top: 0;
  color: #333;
}

.result-container p {
  font-size: 16px;
  line-height: 1.5;
  color: #555;
}
</style>