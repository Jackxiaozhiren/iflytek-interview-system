<template>
  <div class="question-preview">
    <div class="page-header">
      <h1>面试题目预览</h1>
      <p>查看和管理面试题库</p>
    </div>
    <div class="content">
      <div class="question-list">
        <div v-for="question in questions" :key="question.id" class="question-item">
          <h3>{{ question.title }}</h3>
          <p>{{ question.description }}</p>
          <div class="question-meta">
            <span class="difficulty">{{ question.difficulty }}</span>
            <span class="domain">{{ question.domain }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const questions = ref([
  {
    id: 1,
    title: '请介绍一下深度学习的基本概念',
    description: '包括神经网络、反向传播等核心概念',
    difficulty: '中等',
    domain: 'AI'
  },
  {
    id: 2,
    title: '如何设计一个高并发系统',
    description: '从架构、数据库、缓存等方面考虑',
    difficulty: '困难',
    domain: '系统设计'
  }
])
</script>

<style scoped>
.question-preview {
  min-height: 100vh;
  background: var(--iflytek-bg-secondary);
  padding: 24px;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
}

.content {
  max-width: 800px;
  margin: 0 auto;
}

.question-item {
  background: var(--iflytek-bg-primary);
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: var(--iflytek-shadow-sm);
}

.question-item h3 {
  margin: 0 0 12px 0;
  color: var(--iflytek-text-primary);
}

.question-item p {
  margin: 0 0 16px 0;
  color: var(--iflytek-text-secondary);
}

.question-meta {
  display: flex;
  gap: 12px;
}

.difficulty,
.domain {
  background: var(--iflytek-primary);
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: var(--font-size-xs);
}
</style>
