<template>
  <div class="text-primary-interview-page">
    <!-- 顶部导航栏 -->
    <header class="interview-header">
      <div class="header-content">
        <div class="header-left">
          <el-icon class="logo-icon"><Star /></el-icon>
          <h1>iFlytek星火智能面试</h1>
          <span class="interview-mode">文本优先模式</span>
        </div>
        <div class="header-right">
          <div class="interview-progress">
            <span>问题进度: {{ currentQuestion }}/{{ totalQuestions }}</span>
            <el-progress :percentage="(currentQuestion / totalQuestions) * 100" :show-text="false" />
          </div>
          <div class="interview-timer">
            <el-icon><Timer /></el-icon>
            <span>{{ formatTime(elapsedTime) }}</span>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="interview-main">
      <div class="interview-layout">
        <!-- 左侧: 文本对话区域 -->
        <section class="conversation-section">
          <div class="conversation-container">
            <!-- 对话历史 -->
            <div class="conversation-history">
              <div class="conversation-header">
                <div class="header-info">
                  <el-icon><Document /></el-icon>
                  <h3>面试对话</h3>
                  <el-tag type="primary" size="small">{{ messages.length }} 条消息</el-tag>
                </div>
              </div>

              <!-- 消息列表 -->
              <div class="messages-container" ref="messagesContainer">
                <div v-for="(message, index) in messages"
                     :key="index"
                     class="message-item"
                     :class="{
                       'user-message': message.sender === 'user',
                       'ai-message': message.sender === 'interviewer'
                     }">
                  <div class="message-avatar">
                    <el-icon v-if="message.sender === 'user'"><User /></el-icon>
                    <el-icon v-else><Star /></el-icon>
                  </div>
                  <div class="message-content">
                    <div class="message-header">
                      <span class="message-sender">{{ message.sender }}</span>
                      <span class="message-time">{{ message.timestamp }}</span>
                    </div>
                    <div class="message-text">{{ message.content }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 回答输入区域 -->
            <div class="answer-input-panel">
              <div class="input-container">
                <el-input
                  v-model="currentTextInput"
                  type="textarea"
                  :rows="4"
                  placeholder="请在此输入您的回答..."
                  class="answer-textarea"
                  @keydown.ctrl.enter="submitAnswer"
                />
                <div class="input-actions">
                  <el-button
                    type="primary"
                    @click="submitAnswer"
                    :disabled="!currentTextInput.trim()"
                  >
                    <el-icon><Promotion /></el-icon>
                    提交回答
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 右侧: 当前问题面板 -->
        <section class="question-control-section">
          <div class="current-question-panel">
            <div class="question-header">
              <div class="header-left">
                <el-icon class="question-icon"><InfoFilled /></el-icon>
                <span class="question-title">面试问题</span>
                <el-tag type="info" size="small">{{ currentQuestion }}/{{ totalQuestions }}</el-tag>
              </div>
            </div>
            <div class="question-content">
              <p class="question-text">{{ currentQuestionData.text }}</p>
            </div>
          </div>

          <!-- 候选人信息面板 -->
          <div class="candidate-info-panel">
            <div class="panel-header">
              <el-icon><User /></el-icon>
              <h4>候选人信息</h4>
            </div>
            <div class="panel-content">
              <div class="info-item">
                <span class="label">姓名:</span>
                <span class="value">{{ candidateInfo.name }}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Star, Timer, Document, User, InfoFilled, Promotion
} from '@element-plus/icons-vue'

const router = useRouter()

// 基础状态
const currentTextInput = ref('')
const messages = ref([])
const currentQuestion = ref(1)
const totalQuestions = ref(10)
const elapsedTime = ref(0)

// 当前问题数据
const currentQuestionData = ref({
  text: '请详细说明您在深度学习模型优化方面的实践经验'
})

// 候选人信息
const candidateInfo = ref({
  name: '张三'
})

// 计算属性
const formatTime = computed(() => {
  return (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
})

// 方法
const submitAnswer = async () => {
  if (!currentTextInput.value.trim()) return

  // 添加用户消息
  const userMessage = {
    sender: 'user',
    content: currentTextInput.value,
    timestamp: new Date().toLocaleTimeString()
  }
  messages.value.push(userMessage)

  // 清空输入
  currentTextInput.value = ''

  // 模拟AI回复
  setTimeout(() => {
    const aiResponse = {
      sender: 'interviewer',
      content: '很好的回答！请继续详细说明。',
      timestamp: new Date().toLocaleTimeString()
    }
    messages.value.push(aiResponse)
  }, 1000)
}

// 生命周期
onMounted(() => {
  // 添加欢迎消息
  messages.value.push({
    sender: 'interviewer',
    content: '您好！欢迎参加iFlytek星火智能面试。',
    timestamp: new Date().toLocaleTimeString()
  })

  // 启动计时器
  setInterval(() => {
    elapsedTime.value++
  }, 1000)
})
</script>

<style scoped>
.text-primary-interview-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
}

.interview-header {
  background: rgba(255, 255, 255, 0.95);
  padding: 16px 24px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo-icon {
  font-size: 28px;
  color: #1890ff;
}

.header-left h1 {
  margin: 0;
  font-size: 24px;
  color: #1a1a1a;
}

.interview-mode {
  background: linear-gradient(135deg, #1890ff, #722ed1);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.interview-timer {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  color: #1890ff;
}

.interview-main {
  flex: 1;
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.interview-layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 24px;
  height: calc(100vh - 120px);
}

.conversation-section {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 16px;
  overflow: hidden;
}

.conversation-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.conversation-history {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.conversation-header {
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-info h3 {
  margin: 0;
  font-size: 18px;
  color: #1a1a1a;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.user-message {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  background: linear-gradient(135deg, #1890ff, #722ed1);
  color: white;
}

.message-content {
  flex: 1;
  max-width: calc(100% - 60px);
}

.message-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 12px;
  color: #999;
}

.message-text {
  background: #f8f9fa;
  padding: 12px 16px;
  border-radius: 12px;
  line-height: 1.6;
  color: #1a1a1a;
}

.user-message .message-text {
  background: linear-gradient(135deg, #1890ff, #722ed1);
  color: white;
}

.answer-input-panel {
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
  padding: 20px 24px;
}

.input-actions {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}

.question-control-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.current-question-panel,
.candidate-info-panel {
  background: white;
  border-radius: 16px;
  overflow: hidden;
}

.question-header,
.panel-header {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
  display: flex;
  align-items: center;
  gap: 12px;
}

.question-header h4,
.panel-header h4 {
  margin: 0;
  font-size: 16px;
  color: #1a1a1a;
}

.question-content,
.panel-content {
  padding: 20px;
}

.question-text {
  font-size: 16px;
  line-height: 1.6;
  color: #1a1a1a;
  margin: 0;
}

.info-item {
  display: flex;
  gap: 8px;
}

.info-item .label {
  font-size: 12px;
  color: #999;
}

.info-item .value {
  font-size: 14px;
  color: #1a1a1a;
}
</style>
