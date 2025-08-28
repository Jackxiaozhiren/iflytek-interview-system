<template>
  <div class="compact-text-interview-page">
    <!-- 紧凑头部 -->
    <header class="interview-header">
      <div class="header-content">
        <div class="header-left">
          <el-icon class="logo-icon"><Star /></el-icon>
          <h1>iFlytek星火智能面试</h1>
          <span class="interview-mode">文本优先模式</span>
        </div>
        <div class="header-right">
          <div class="interview-progress">
            <span>问题 {{ currentQuestion }}/{{ totalQuestions }}</span>
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
        <!-- 左侧: 对话区域 -->
        <section class="conversation-section">
          <div class="conversation-container">
            <div class="conversation-header">
              <h3>面试对话</h3>
              <span class="mode-indicator">文本优先</span>
            </div>
            
            <!-- 消息列表 -->
            <div class="messages-container" ref="messagesContainer">
              <div v-for="(message, index) in conversationHistory" :key="index" 
                   class="message-item" :class="message.type">
                <div class="message-avatar">
                  <el-icon v-if="message.type === 'ai'"><User /></el-icon>
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

            <!-- 输入区域 -->
            <div class="input-section">
              <div class="input-header">
                <span class="input-label">您的回答</span>
                <span class="char-count">{{ currentInput.length }}/1000</span>
              </div>
              <el-input
                v-model="currentInput"
                type="textarea"
                :rows="4"
                placeholder="请输入您的回答..."
                maxlength="1000"
                show-word-limit
                @keydown.ctrl.enter="submitAnswer"
              />
              <div class="input-actions">
                <el-button @click="clearInput">清空</el-button>
                <el-button type="primary" @click="submitAnswer" :loading="isSubmitting">
                  提交回答
                </el-button>
              </div>
            </div>
          </div>
        </section>

        <!-- 右侧: 分析面板 -->
        <aside class="analysis-section">
          <!-- 候选人信息 -->
          <div class="candidate-card">
            <div class="candidate-header">
              <div class="candidate-avatar">
                <el-icon><User /></el-icon>
              </div>
              <div class="candidate-info">
                <h4>{{ candidateInfo.name }}</h4>
                <p>{{ candidateInfo.position }}</p>
              </div>
            </div>
            <div class="candidate-skills">
              <el-tag v-for="skill in candidateInfo.skills" :key="skill" size="small">
                {{ skill }}
              </el-tag>
            </div>
          </div>

          <!-- 实时分析 -->
          <div class="analysis-card">
            <div class="analysis-header">
              <h4>实时分析结果</h4>
              <el-tag :type="analysisStatus.type" size="small">
                {{ analysisStatus.text }}
              </el-tag>
            </div>
            <div class="analysis-metrics">
              <div class="metric-item">
                <div class="metric-value">{{ realTimeAnalysis.technicalScore }}</div>
                <div class="metric-label">技术能力</div>
              </div>
              <div class="metric-item">
                <div class="metric-value">{{ realTimeAnalysis.communicationScore }}</div>
                <div class="metric-label">沟通能力</div>
              </div>
              <div class="metric-item">
                <div class="metric-value">{{ realTimeAnalysis.logicScore }}</div>
                <div class="metric-label">逻辑思维</div>
              </div>
              <div class="metric-item">
                <div class="metric-value">{{ realTimeAnalysis.experienceScore }}</div>
                <div class="metric-label">项目经验</div>
              </div>
            </div>
          </div>

          <!-- 当前问题 -->
          <div class="question-card">
            <div class="question-header">
              <h4>当前问题</h4>
              <el-tag type="info" size="small">{{ currentQuestionData.difficulty }}</el-tag>
            </div>
            <div class="question-content">
              <p>{{ currentQuestionData.text }}</p>
            </div>
            <div class="question-meta">
              <el-tag size="small">{{ currentQuestionData.type }}</el-tag>
              <el-tag type="success" size="small">{{ currentQuestionData.domain }}</el-tag>
            </div>
          </div>
        </aside>
      </div>
    </main>

    <!-- 底部操作栏 -->
    <footer class="interview-footer">
      <div class="footer-content">
        <div class="footer-left">
          <el-button @click="pauseInterview">暂停面试</el-button>
          <el-button @click="skipQuestion">跳过问题</el-button>
        </div>
        <div class="footer-center">
          <span class="ai-status">AI正在分析中...</span>
        </div>
        <div class="footer-right">
          <el-button type="primary" @click="nextQuestion">下一题</el-button>
          <el-button type="success" @click="finishInterview">结束面试</el-button>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { User, Timer, Star } from '@element-plus/icons-vue'

// 响应式数据
const messagesContainer = ref(null)
const currentInput = ref('')
const isSubmitting = ref(false)
const currentQuestion = ref(1)
const totalQuestions = ref(10)
const elapsedTime = ref(0)

// 候选人信息
const candidateInfo = ref({
  name: '张三',
  position: 'AI算法工程师',
  skills: ['Python', 'TensorFlow', 'PyTorch', '深度学习']
})

// 对话历史
const conversationHistory = ref([
  {
    type: 'ai',
    sender: 'AI面试官',
    content: '您好！欢迎参加iFlytek星火智能面试。请简单介绍一下您在人工智能领域的项目经验。',
    timestamp: '14:30:00'
  }
])

// 实时分析结果
const realTimeAnalysis = ref({
  technicalScore: 85,
  communicationScore: 78,
  logicScore: 82,
  experienceScore: 80
})

// 分析状态
const analysisStatus = ref({
  type: 'success',
  text: '分析完成'
})

// 当前问题数据
const currentQuestionData = ref({
  text: '请简单介绍一下您在人工智能领域的项目经验，特别是在机器学习模型开发方面的实践。',
  type: '技术深度',
  difficulty: 'medium',
  domain: 'AI算法'
})

// 方法
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const clearInput = () => {
  currentInput.value = ''
}

const submitAnswer = async () => {
  if (!currentInput.value.trim()) {
    ElMessage.warning('请输入您的回答')
    return
  }

  isSubmitting.value = true
  
  // 添加用户消息
  conversationHistory.value.push({
    type: 'user',
    sender: '候选人',
    content: currentInput.value,
    timestamp: new Date().toLocaleTimeString()
  })

  // 清空输入
  currentInput.value = ''

  // 模拟AI回复
  setTimeout(() => {
    conversationHistory.value.push({
      type: 'ai',
      sender: 'AI面试官',
      content: '感谢您的回答。请继续详细描述您在项目中遇到的技术挑战以及解决方案。',
      timestamp: new Date().toLocaleTimeString()
    })
    isSubmitting.value = false
    scrollToBottom()
  }, 2000)

  scrollToBottom()
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const pauseInterview = () => {
  ElMessage.info('面试已暂停')
}

const skipQuestion = () => {
  ElMessage.info('已跳过当前问题')
}

const nextQuestion = () => {
  if (currentQuestion.value < totalQuestions.value) {
    currentQuestion.value++
    ElMessage.success('进入下一题')
  }
}

const finishInterview = () => {
  ElMessage.success('面试已结束')
}

// 生命周期
onMounted(() => {
  // 启动计时器
  setInterval(() => {
    elapsedTime.value++
  }, 1000)
  
  scrollToBottom()
})
</script>

<style scoped>
/* 导入紧凑布局样式 */
@import '@/styles/text-interview-compact.css';

/* 页面整体布局 */
.compact-text-interview-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
}

/* 头部样式 */
.interview-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 12px 0;
  flex-shrink: 0;
}

.header-content {
  max-width: min(1200px, calc(100vw - 48px));
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 24px;
  color: #1890ff;
}

.header-left h1 {
  font-size: 1.125rem;
  margin: 0;
  color: #1f2937;
}

.interview-mode {
  background: #e0f2fe;
  color: #0277bd;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.interview-progress {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 120px;
}

.interview-progress span {
  font-size: 12px;
  color: #64748b;
}

.interview-timer {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  color: #1f2937;
}

/* 主要内容区域 */
.interview-main {
  flex: 1;
  padding: 16px 0;
}

.interview-layout {
  max-width: min(1200px, calc(100vw - 48px));
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 20px;
  height: calc(100vh - 140px);
}

/* 对话区域 */
.conversation-section {
  display: flex;
  flex-direction: column;
}

.conversation-container {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.conversation-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
}

.conversation-header h3 {
  margin: 0;
  font-size: 1rem;
  color: #1f2937;
}

.mode-indicator {
  background: #f0f9ff;
  color: #0369a1;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

/* 消息列表 */
.messages-container {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 16px;
  max-height: 400px;
}

.message-item {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px;
  border-radius: 8px;
  background: #f8fafc;
}

.message-item.ai {
  background: #f0f9ff;
}

.message-item.user {
  background: #f0fdf4;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #1890ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.message-content {
  flex: 1;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.message-sender {
  font-weight: 600;
  font-size: 14px;
  color: #1f2937;
}

.message-time {
  font-size: 12px;
  color: #64748b;
}

.message-text {
  font-size: 14px;
  line-height: 1.5;
  color: #374151;
}

/* 输入区域 */
.input-section {
  border-top: 1px solid #f1f5f9;
  padding-top: 16px;
}

.input-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.input-label {
  font-weight: 600;
  font-size: 14px;
  color: #1f2937;
}

.char-count {
  font-size: 12px;
  color: #64748b;
}

.input-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
}

/* 分析面板 */
.analysis-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
}

.candidate-card,
.analysis-card,
.question-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

/* 候选人信息卡片 */
.candidate-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.candidate-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #1890ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.candidate-info h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  color: #1f2937;
}

.candidate-info p {
  margin: 0;
  font-size: 12px;
  color: #64748b;
}

.candidate-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

/* 分析结果 */
.analysis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.analysis-header h4 {
  margin: 0;
  font-size: 14px;
  color: #1f2937;
}

.analysis-metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.metric-item {
  text-align: center;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1890ff;
  margin-bottom: 4px;
}

.metric-label {
  font-size: 12px;
  color: #64748b;
}

/* 问题卡片 */
.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.question-header h4 {
  margin: 0;
  font-size: 14px;
  color: #1f2937;
}

.question-content p {
  margin: 0 0 12px 0;
  font-size: 14px;
  line-height: 1.5;
  color: #374151;
}

.question-meta {
  display: flex;
  gap: 6px;
}

/* 底部操作栏 */
.interview-footer {
  background: white;
  border-top: 1px solid #f1f5f9;
  padding: 12px 0;
  flex-shrink: 0;
}

.footer-content {
  max-width: min(1200px, calc(100vw - 48px));
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-left,
.footer-right {
  display: flex;
  gap: 8px;
}

.footer-center {
  flex: 1;
  text-align: center;
}

.ai-status {
  font-size: 12px;
  color: #64748b;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .interview-layout {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 12px;
  }
}

@media (max-width: 768px) {
  .header-content,
  .interview-layout,
  .footer-content {
    max-width: calc(100vw - 32px);
    padding: 0 16px;
  }
  
  .conversation-container,
  .candidate-card,
  .analysis-card,
  .question-card {
    padding: 12px;
  }
  
  .analysis-metrics {
    grid-template-columns: 1fr;
  }
  
  .footer-content {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
