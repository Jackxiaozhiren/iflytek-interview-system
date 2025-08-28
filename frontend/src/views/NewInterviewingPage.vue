<template>
  <div class="modern-interview-page">
    <!-- 顶部状态栏 -->
    <header class="interview-header">
      <div class="header-container">
        <div class="interview-info">
          <div class="logo-section">
            <img src="/images/iflytek-spark-logo.svg" alt="iFlytek Spark" class="logo" />
            <div class="interview-title">
              <h1>iFlytek Spark AI面试</h1>
              <p>智能多模态面试系统</p>
            </div>
          </div>
        </div>
        
        <div class="interview-progress">
          <div class="progress-info">
            <span class="progress-text">题目进度</span>
            <span class="progress-value">{{ currentQuestion }}/{{ totalQuestions }}</span>
          </div>
          <el-progress 
            :percentage="progressPercentage" 
            :stroke-width="8"
            color="#1890ff"
            class="progress-bar"
          />
        </div>
        
        <div class="interview-timer">
          <div class="timer-display">
            <el-icon class="timer-icon"><Clock /></el-icon>
            <span class="timer-text">{{ formatTime(elapsedTime) }}</span>
          </div>
          <div class="timer-status">
            <span class="status-dot active"></span>
            <span class="status-text">面试进行中</span>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要面试区域 -->
    <main class="interview-main">
      <div class="main-container">
        <!-- 左侧：AI面试官区域 -->
        <section class="ai-interviewer-section">
          <div class="ai-card">
            <div class="ai-avatar">
              <div class="avatar-container">
                <el-icon class="ai-icon"><Cpu /></el-icon>
                <div class="ai-status-ring" :class="{ active: aiSpeaking }"></div>
              </div>
              <div class="ai-info">
                <h3>iFlytek Spark AI面试官</h3>
                <p>{{ aiStatus }}</p>
              </div>
            </div>
            
            <div class="question-area">
              <div class="question-header">
                <span class="question-label">当前问题</span>
                <el-tag :type="getQuestionType(currentQuestionData.difficulty)" size="small">
                  {{ currentQuestionData.difficulty }}
                </el-tag>
              </div>
              <div class="question-content">
                <p class="question-text">{{ currentQuestionData.text }}</p>
              </div>
              <div class="question-actions">
                <el-button size="small" @click="requestHint" :disabled="hintUsed">
                  <el-icon><QuestionFilled /></el-icon>
                  {{ hintUsed ? '已使用提示' : '获取提示' }}
                </el-button>
                <el-button size="small" @click="skipQuestion" type="warning">
                  <el-icon><Right /></el-icon>
                  跳过问题
                </el-button>
              </div>
            </div>
          </div>
        </section>

        <!-- 右侧：候选人交互区域 -->
        <section class="candidate-section">
          <div class="interaction-tabs">
            <el-tabs v-model="activeTab" class="interview-tabs">

              
              <el-tab-pane label="文字回答" name="text">
                <div class="text-interface">
                  <el-input
                    v-model="textAnswer"
                    type="textarea"
                    :rows="8"
                    placeholder="请在此输入您的回答..."
                    class="answer-textarea"
                  />
                  <div class="text-actions">
                    <div class="text-stats">
                      <span class="char-count">{{ textAnswer.length }}/1000</span>
                    </div>
                    <el-button type="primary" @click="submitTextAnswer" :disabled="!textAnswer.trim()">
                      <el-icon><Check /></el-icon>
                      提交回答
                    </el-button>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </section>
      </div>
    </main>

    <!-- 底部操作栏 -->
    <footer class="interview-footer">
      <div class="footer-container">
        <div class="footer-left">
          <el-button @click="pauseInterview" class="control-btn">
            <el-icon><VideoPause /></el-icon>
            暂停面试
          </el-button>
          <el-button @click="showHelp" class="control-btn">
            <el-icon><QuestionFilled /></el-icon>
            帮助
          </el-button>
        </div>
        
        <div class="footer-center">
          <div class="ai-analysis">
            <el-icon class="analysis-icon"><Grid /></el-icon>
            <span class="analysis-text">AI正在实时分析您的表现...</span>
          </div>
        </div>
        
        <div class="footer-right">
          <el-button @click="nextQuestion" type="primary" :disabled="!canProceed" class="next-btn">
            {{ isLastQuestion ? '完成面试' : '下一题' }}
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>
      </div>
    </footer>

    <!-- AI分析浮窗 -->
    <div class="ai-insights-panel" v-if="showInsights">
      <div class="insights-header">
        <h4>实时AI分析</h4>
        <el-button size="small" text @click="showInsights = false">
          <el-icon><Close /></el-icon>
        </el-button>
      </div>
      <div class="insights-content">
        <div class="insight-item" v-for="insight in currentInsights" :key="insight.id">
          <el-icon class="insight-icon" :style="{ color: insight.color }">
            <component :is="insight.icon" />
          </el-icon>
          <span class="insight-text">{{ insight.text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Clock, Cpu, Microphone, VideoPause, QuestionFilled, Right, 
  Check, Grid, ArrowRight, Close, TrendCharts, Star 
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()

// 面试状态
const currentQuestion = ref(1)
const totalQuestions = ref(10)
const elapsedTime = ref(0)

const aiSpeaking = ref(false)
const activeTab = ref('text')
const textAnswer = ref('')
const hintUsed = ref(false)
const showInsights = ref(true)
const canProceed = ref(false)

// AI状态
const aiStatus = ref('正在分析您的回答...')

// 当前问题数据
const currentQuestionData = ref({
  text: '请介绍一下您在人工智能领域的项目经验，特别是在机器学习算法优化方面的实践。',
  difficulty: '中等',
  category: 'technical'
})

// AI洞察数据
const currentInsights = ref([
  {
    id: 1,
    icon: 'TrendCharts',
    color: '#1890ff',
    text: '语音表达流畅度：85%'
  },
  {
    id: 2,
    icon: 'Star',
    color: '#52c41a',
    text: '技术深度评估：良好'
  },
  {
    id: 3,
    icon: 'Cpu',
    color: '#722ed1',
    text: '逻辑思维清晰度：优秀'
  }
])

// 计算属性
const progressPercentage = computed(() => {
  return Math.round((currentQuestion.value / totalQuestions.value) * 100)
})

const isLastQuestion = computed(() => {
  return currentQuestion.value === totalQuestions.value
})

// 方法
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const getQuestionType = (difficulty) => {
  const typeMap = {
    '简单': 'success',
    '中等': 'warning',
    '困难': 'danger'
  }
  return typeMap[difficulty] || 'info'
}



const submitTextAnswer = () => {
  if (!textAnswer.value.trim()) {
    ElMessage.warning('请输入回答内容')
    return
  }
  
  ElMessage.success('文字回答已提交')
  aiStatus.value = '正在分析您的文字回答...'
  canProceed.value = true
}

const requestHint = () => {
  if (hintUsed.value) return
  
  hintUsed.value = true
  ElMessage.info('提示：可以从项目背景、技术选型、优化过程、效果评估等角度来回答')
}

const skipQuestion = () => {
  ElMessage.warning('已跳过当前问题')
  nextQuestion()
}

const nextQuestion = () => {
  if (isLastQuestion.value) {
    // 完成面试
    router.push('/reports')
    return
  }
  
  currentQuestion.value++
  canProceed.value = false
  hintUsed.value = false
  textAnswer.value = ''

  
  // 模拟新问题
  const questions = [
    '请介绍一下您在人工智能领域的项目经验...',
    '描述一个您解决过的复杂技术问题...',
    '您如何看待AI技术的发展趋势...',
    '请分享一个团队协作的成功案例...'
  ]
  
  currentQuestionData.value.text = questions[Math.min(currentQuestion.value - 1, questions.length - 1)]
  aiStatus.value = '正在准备新问题...'
}

const pauseInterview = () => {
  ElMessage.info('面试已暂停')
}

const showHelp = () => {
  ElMessage.info('如需帮助，请联系技术支持')
}

// 定时器
let timer = null

onMounted(() => {
  timer = setInterval(() => {
    elapsedTime.value++
  }, 1000)
  
  // 模拟AI状态变化
  setTimeout(() => {
    aiSpeaking.value = true
    aiStatus.value = '正在提问...'
  }, 2000)
  
  setTimeout(() => {
    aiSpeaking.value = false
    aiStatus.value = '等待您的回答'
  }, 5000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.modern-interview-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%);
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
}

/* 顶部状态栏 */
.interview-header {
  background: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 16px 0;
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  min-height: 64px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  height: 32px;
  width: auto;
}

.interview-title h1 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 4px 0;
}

.interview-title p {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.interview-progress {
  flex: 1;
  max-width: 300px;
  margin: 0 40px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.progress-text {
  color: #64748b;
  font-size: 14px;
}

.progress-value {
  font-weight: 600;
  color: #1890ff;
}

.interview-timer {
  text-align: right;
}

.timer-display {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.timer-icon {
  color: #1890ff;
}

.timer-text {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2c3e50;
}

.timer-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #64748b;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #94a3b8;
  transition: all 0.3s ease;
}

.status-dot.active {
  background: #ef4444;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* 主要面试区域 */
.interview-main {
  flex: 1;
  padding: 24px 0;
  min-height: 0;
  overflow-y: auto;
}

.main-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: start;
  min-height: calc(100vh - 200px);
}

/* AI面试官区域 */
.ai-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  height: fit-content;
}

.ai-avatar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.avatar-container {
  position: relative;
}

.ai-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.ai-status-ring {
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border: 2px solid transparent;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.ai-status-ring.active {
  border-color: #1890ff;
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.ai-info h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 4px 0;
}

.ai-info p {
  color: #64748b;
  margin: 0;
}

.question-area {
  border-top: 1px solid #f1f5f9;
  padding-top: 16px;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.question-label {
  font-weight: 600;
  color: #2c3e50;
}

.question-content {
  margin-bottom: 24px;
}

.question-text {
  font-size: 1.125rem;
  line-height: 1.6;
  color: #2c3e50;
  margin: 0;
}

.question-actions {
  display: flex;
  gap: 12px;
}

/* 候选人交互区域 */
.candidate-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.interview-tabs {
  height: 100%;
}

.voice-interface {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.voice-visualizer {
  text-align: center;
}

.wave-container {
  display: flex;
  align-items: end;
  justify-content: center;
  gap: 4px;
  height: 60px;
  margin-bottom: 32px;
}

.wave {
  width: 4px;
  background: #1890ff;
  border-radius: 2px;
  transition: height 0.3s ease;
  animation: wave 1s ease-in-out infinite;
}

@keyframes wave {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(1.5); }
}

.voice-controls {
  margin-bottom: 16px;
}

.record-btn {
  width: 80px;
  height: 80px;
  box-shadow: 0 4px 20px rgba(24, 144, 255, 0.3);
}

.voice-hint {
  color: #64748b;
  font-size: 14px;
}

.text-interface {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.answer-textarea {
  flex: 1;
  margin-bottom: 16px;
}

.text-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.char-count {
  color: #94a3b8;
  font-size: 12px;
}

/* 底部操作栏 */
.interview-footer {
  background: white;
  border-top: 1px solid #f1f5f9;
  padding: 16px 0;
}

.footer-container {
  max-width: min(1200px, calc(100vw - 48px));
  margin: 0 auto;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-left,
.footer-right {
  display: flex;
  gap: 12px;
}

.footer-center {
  flex: 1;
  text-align: center;
}

.ai-analysis {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #64748b;
}

.analysis-icon {
  color: #1890ff;
  animation: pulse 2s infinite;
}

.next-btn {
  background: linear-gradient(135deg, #1890ff 0%, #0066cc 100%);
  border: none;
  padding: 8px 24px;
}

/* AI分析浮窗 */
.ai-insights-panel {
  position: fixed;
  top: 100px;
  right: 16px;
  width: 260px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  border: 1px solid #f1f5f9;
  z-index: 1000;
}

.insights-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f1f5f9;
}

.insights-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
}

.insights-content {
  padding: 12px 16px;
}

.insight-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.insight-item:last-child {
  margin-bottom: 0;
}

.insight-icon {
  flex-shrink: 0;
}

.insight-text {
  font-size: 14px;
  color: #64748b;
}

/* 响应式设计 */
/* 响应式设计 */
@media (max-width: 1024px) {
  .main-container {
    grid-template-columns: 1fr;
    gap: 24px;
    min-height: auto;
  }

  .header-container {
    flex-direction: column;
    gap: 16px;
    padding: 0 16px;
  }

  .interview-progress {
    max-width: 100%;
    margin: 0;
    order: 1;
  }

  .interview-timer {
    text-align: center;
    order: 2;
  }

  .ai-insights-panel {
    position: relative;
    top: auto;
    right: auto;
    width: 100%;
    margin-top: 24px;
  }
}

@media (max-width: 768px) {
  .interview-header {
    padding: 12px 0;
  }

  .header-container {
    padding: 0 16px;
    min-height: auto;
  }

  .main-container {
    padding: 0 16px;
    gap: 16px;
  }

  .ai-card {
    padding: 20px;
  }

  .interview-footer {
    padding: 12px 0;
  }

  .footer-container {
    flex-direction: column;
    gap: 12px;
    padding: 0 16px;
  }

  .footer-left,
  .footer-right {
    width: 100%;
    justify-content: center;
  }

  .footer-center {
    order: -1;
    text-align: center;
  }

  .voice-visualizer {
    padding: 20px;
  }

  .wave-container {
    height: 60px;
  }

  .record-btn {
    width: 60px;
    height: 60px;
  }
}
</style>
