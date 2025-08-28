<template>
  <div class="interviewing-page-fixed">
    <!-- 面试头部 -->
    <header class="interview-header">
      <div class="header-container">
        <div class="interview-info">
          <h1 class="interview-title">
            <el-icon class="title-icon"><VideoCamera /></el-icon>
            iFlytek AI智能面试
          </h1>
          <div class="interview-meta">
            <span class="meta-item">
              <el-icon><User /></el-icon>
              {{ candidateInfo.name }}
            </span>
            <span class="meta-item">
              <el-icon><House /></el-icon>
              {{ candidateInfo.position }}
            </span>
            <span class="meta-item">
              <el-icon><Clock /></el-icon>
              {{ formatTime(elapsedTime) }}
            </span>
          </div>
        </div>
        
        <div class="interview-status">
          <div class="status-item">
            <span class="status-label">题目进度</span>
            <span class="status-value">{{ currentQuestion }}/{{ totalQuestions }}</span>
          </div>
          <div class="status-item">
            <span class="status-label">AI助手</span>
            <span class="status-value">{{ aiAssistanceCount }}次</span>
          </div>
        </div>
      </div>
    </header>

    <!-- 面试主体区域 -->
    <main class="interview-main">
      <div class="interview-container">
        <!-- 左侧：候选人视频区域 -->
        <section class="candidate-section">
          <div class="video-container">
            <div class="video-placeholder">
              <el-icon class="video-icon"><User /></el-icon>
              <h3>智能面试进行中</h3>
              <p>请专注于回答问题，系统正在进行智能分析</p>
            </div>
            
            <!-- 视频控制 -->
            <div class="video-controls">
              <el-button 
                :type="isRecording ? 'danger' : 'primary'"
                circle
                @click="toggleRecording"
              >
                <el-icon><VideoCamera /></el-icon>
              </el-button>
              <el-button 
                :type="isMuted ? 'warning' : 'primary'"
                circle
                @click="toggleMute"
              >
                <el-icon><Microphone /></el-icon>
              </el-button>
            </div>
          </div>

          <!-- 实时评分 -->
          <div class="realtime-score">
            <h4>实时评分</h4>
            <div class="score-item">
              <span>技术能力</span>
              <el-progress :percentage="85" color="#1890ff" />
            </div>
            <div class="score-item">
              <span>沟通技巧</span>
              <el-progress :percentage="88" color="#52c41a" />
            </div>
            <div class="score-item">
              <span>逻辑思维</span>
              <el-progress :percentage="79" color="#722ed1" />
            </div>
          </div>
        </section>

        <!-- 右侧：问题和AI分析区域 -->
        <section class="question-section">
          <!-- 当前问题 -->
          <div class="current-question">
            <div class="question-header">
              <div class="question-info">
                <el-icon><Document /></el-icon>
                <span>第 {{ currentQuestion }} 题</span>
                <el-tag type="primary" size="small">{{ questionDifficulty }}</el-tag>
              </div>
              <div class="question-timer">
                <el-icon><Clock /></el-icon>
                <span>{{ formatTime(questionTime) }}</span>
              </div>
            </div>
            
            <div class="question-content">
              <h3>{{ currentQuestionData.title }}</h3>
              <p>{{ currentQuestionData.description }}</p>
            </div>
          </div>

          <!-- AI分析面板 -->
          <div class="ai-analysis-panel">
            <div class="analysis-tabs">
              <el-button 
                v-for="tab in analysisTabs"
                :key="tab.id"
                :type="activeTab === tab.id ? 'primary' : 'default'"
                size="small"
                @click="setActiveTab(tab.id)"
              >
                <el-icon><component :is="tab.icon" /></el-icon>
                {{ tab.name }}
              </el-button>
            </div>
            
            <div class="analysis-content">
              <div v-if="activeTab === 'voice'" class="voice-analysis">
                <h4>语音分析</h4>
                <div class="analysis-item">
                  <span>流畅度</span>
                  <span class="score">94%</span>
                </div>
                <div class="analysis-item">
                  <span>语速适中</span>
                  <span class="score">88%</span>
                </div>
                <div class="analysis-item">
                  <span>音调稳定</span>
                  <span class="score">91%</span>
                </div>
              </div>
              
              <div v-if="activeTab === 'text'" class="text-analysis">
                <h4>文本分析</h4>
                <div class="analysis-item">
                  <span>关键词匹配</span>
                  <span class="score">87%</span>
                </div>
                <div class="analysis-item">
                  <span>逻辑结构</span>
                  <span class="score">85%</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 控制按钮 -->
          <div class="interview-controls">
            <el-button type="primary" @click="nextQuestion">
              <el-icon><ArrowRight /></el-icon>
              下一题
            </el-button>
            <el-button @click="pauseInterview">
              <el-icon><VideoPause /></el-icon>
              暂停
            </el-button>
            <el-button @click="getAiHint">
              <el-icon><Star /></el-icon>
              AI提示
            </el-button>
            <el-button type="danger" @click="endInterview">
              <el-icon><Close /></el-icon>
              结束面试
            </el-button>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  VideoCamera, Microphone, User, House, Clock, Document, 
  ArrowRight, VideoPause, Star, Close, Setting
} from '@element-plus/icons-vue'

const router = useRouter()

// 响应式数据
const candidateInfo = reactive({
  name: '张三',
  position: 'AI算法工程师'
})

const isRecording = ref(true)
const isMuted = ref(false)
const currentQuestion = ref(1)
const totalQuestions = ref(10)
const elapsedTime = ref(0)
const questionTime = ref(0)
const aiAssistanceCount = ref(3)
const questionDifficulty = ref('中级')
const activeTab = ref('voice')

const currentQuestionData = reactive({
  title: '请详细说明您在深度学习模型优化方面的实践经验',
  description: '请结合具体项目案例，说明您是如何进行模型优化的，包括使用的技术手段、遇到的挑战以及最终的效果。'
})

const analysisTabs = ref([
  { id: 'voice', name: '语音分析', icon: 'Microphone' },
  { id: 'text', name: '文本分析', icon: 'Document' }
])

// 方法
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const toggleRecording = () => {
  isRecording.value = !isRecording.value
}

const toggleMute = () => {
  isMuted.value = !isMuted.value
}

const setActiveTab = (tabId) => {
  activeTab.value = tabId
}

const nextQuestion = () => {
  if (currentQuestion.value < totalQuestions.value) {
    currentQuestion.value++
    questionTime.value = 0
  }
}

const pauseInterview = () => {
  console.log('暂停面试')
}

const getAiHint = () => {
  if (aiAssistanceCount.value > 0) {
    aiAssistanceCount.value--
    console.log('获取AI提示')
  }
}

const endInterview = () => {
  router.push('/interview-result')
}

// 生命周期
onMounted(() => {
  // 启动计时器
  setInterval(() => {
    elapsedTime.value++
    questionTime.value++
  }, 1000)
})
</script>

<style scoped>
/* iFlytek 品牌色彩变量 */
.interviewing-page-fixed {
  --iflytek-primary: #1890ff;
  --iflytek-secondary: #667eea;
  --iflytek-accent: #764ba2;
  --iflytek-success: #52c41a;
  --iflytek-warning: #faad14;
  --iflytek-error: #ff4d4f;
  --text-primary: #333333;
  --text-secondary: #666666;
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --border-color: #e8e8e8;
  --shadow-light: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-medium: 0 4px 16px rgba(0, 0, 0, 0.15);
}

/* 页面主容器 */
.interviewing-page-fixed {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
}

/* 头部样式 */
.interview-header {
  background: linear-gradient(135deg, var(--iflytek-primary) 0%, var(--iflytek-secondary) 100%);
  color: white;
  padding: 20px 0;
  box-shadow: var(--shadow-medium);
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.interview-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  font-size: 28px;
}

.interview-meta {
  display: flex;
  gap: 24px;
  font-size: 14px;
  opacity: 0.9;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.interview-status {
  display: flex;
  gap: 24px;
}

.status-item {
  text-align: center;
}

.status-label {
  display: block;
  font-size: 12px;
  opacity: 0.8;
  margin-bottom: 4px;
}

.status-value {
  display: block;
  font-size: 18px;
  font-weight: 600;
}

/* 主体区域 */
.interview-main {
  padding: 30px 0;
}

.interview-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  align-items: start;
}

/* 候选人区域 */
.candidate-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.video-container {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--shadow-light);
  border: 1px solid var(--border-color);
  position: relative;
}

.video-placeholder {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 60px 20px;
  text-align: center;
  margin-bottom: 16px;
}

.video-icon {
  font-size: 48px;
  color: var(--iflytek-primary);
  margin-bottom: 16px;
}

.video-placeholder h3 {
  margin: 0 0 8px 0;
  color: var(--text-primary);
  font-size: 18px;
}

.video-placeholder p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 14px;
}

.video-controls {
  display: flex;
  justify-content: center;
  gap: 12px;
}

/* 实时评分 */
.realtime-score {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--shadow-light);
  border: 1px solid var(--border-color);
}

.realtime-score h4 {
  margin: 0 0 16px 0;
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 600;
}

.score-item {
  margin-bottom: 16px;
}

.score-item:last-child {
  margin-bottom: 0;
}

.score-item span {
  display: block;
  margin-bottom: 8px;
  color: var(--text-secondary);
  font-size: 14px;
}

/* 问题区域 */
.question-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.current-question {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--shadow-light);
  border: 1px solid var(--border-color);
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
}

.question-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-secondary);
}

.question-timer {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--text-secondary);
}

.question-content h3 {
  margin: 0 0 12px 0;
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
}

.question-content p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.6;
}

/* AI分析面板 */
.ai-analysis-panel {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--shadow-light);
  border: 1px solid var(--border-color);
}

.analysis-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.analysis-content h4 {
  margin: 0 0 16px 0;
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 600;
}

.analysis-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.analysis-item:last-child {
  border-bottom: none;
}

.analysis-item span:first-child {
  color: var(--text-secondary);
  font-size: 14px;
}

.analysis-item .score {
  color: var(--iflytek-primary);
  font-weight: 600;
  font-size: 14px;
}

/* 控制按钮 */
.interview-controls {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .interview-container {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 0 16px;
  }

  .interview-meta {
    flex-direction: column;
    gap: 8px;
  }

  .interview-status {
    flex-direction: column;
    gap: 12px;
  }

  .interview-controls {
    justify-content: center;
  }
}
</style>
