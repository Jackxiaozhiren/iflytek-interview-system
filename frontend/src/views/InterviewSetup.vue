<template>
  <div class="interview-setup">
    <div class="setup-header">
      <h1 class="setup-title">面试设置</h1>
      <p class="setup-subtitle">配置您的面试参数和环境</p>
    </div>

    <div class="setup-content">
      <div class="setup-form">
        <el-form :model="setupForm" label-width="120px">
          <el-form-item label="面试时长">
            <el-select v-model="setupForm.duration" placeholder="选择面试时长">
              <el-option label="30分钟" value="30" />
              <el-option label="45分钟" value="45" />
              <el-option label="60分钟" value="60" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="问题数量">
            <el-input-number v-model="setupForm.questionCount" :min="5" :max="20" />
          </el-form-item>
          
          <el-form-item label="启用摄像头">
            <el-switch v-model="setupForm.enableCamera" />
          </el-form-item>
          
          <el-form-item label="启用麦克风">
            <el-switch v-model="setupForm.enableMicrophone" />
          </el-form-item>
        </el-form>
      </div>

      <div class="setup-actions">
        <el-button @click="goBack">返回</el-button>
        <el-button type="primary" @click="startInterview">开始面试</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const setupForm = ref({
  duration: '45',
  questionCount: 10,
  enableCamera: true,
  enableMicrophone: true
})

const goBack = () => {
  router.go(-1)
}

const startInterview = () => {
  router.push('/interview-room')
}
</script>

<style scoped>
.interview-setup {
  min-height: 100vh;
  background: var(--iflytek-bg-secondary);
  padding: 24px;
}

.setup-header {
  text-align: center;
  margin-bottom: 40px;
}

.setup-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--iflytek-text-primary);
  margin: 0 0 8px 0;
}

.setup-subtitle {
  color: var(--iflytek-text-secondary);
  margin: 0;
}

.setup-content {
  max-width: 600px;
  margin: 0 auto;
  background: var(--iflytek-bg-primary);
  border-radius: 12px;
  padding: 32px;
  box-shadow: var(--iflytek-shadow-sm);
}

.setup-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 32px;
}
</style>
