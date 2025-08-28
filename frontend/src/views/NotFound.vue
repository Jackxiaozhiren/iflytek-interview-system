<template>
  <div class="ai-not-found">
    <div class="ai-not-found-content">
      <div class="ai-not-found-icon">
        <el-icon><WarningFilled /></el-icon>
      </div>
      <h1 class="ai-not-found-title">404</h1>
      <h2 class="ai-not-found-subtitle">页面未找到</h2>
      <p class="ai-not-found-description">
        抱歉，您访问的页面不存在或已被移动。
      </p>
      <div class="ai-not-found-actions">
        <button class="ai-btn ai-btn-primary" @click="goHome">
          <el-icon><House /></el-icon>
          返回首页
        </button>
        <button class="ai-btn ai-btn-secondary" @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          返回上页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import {
  House, ArrowLeft, OfficeBuilding, User, Grid,
  Message, Phone, WarningFilled
} from '@element-plus/icons-vue'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
.ai-not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  padding: var(--space-6);
}

.ai-not-found-content {
  text-align: center;
  max-width: 500px;
}

.ai-not-found-icon {
  font-size: 80px;
  color: var(--warning-color);
  margin-bottom: var(--space-6);
}

.ai-not-found-title {
  font-size: var(--text-8xl);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-4);
}

.ai-not-found-subtitle {
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: var(--space-4);
}

.ai-not-found-description {
  font-size: var(--text-lg);
  color: var(--text-tertiary);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-8);
}

.ai-not-found-actions {
  display: flex;
  gap: var(--space-4);
  justify-content: center;
  flex-wrap: wrap;
}
</style>
