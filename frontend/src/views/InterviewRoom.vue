<template>
  <div class="interview-room">
    <!-- 面试房间头部 -->
    <div class="room-header">
      <div class="header-left">
        <h1 class="room-title">面试进行中</h1>
        <div class="interview-info">
          <span class="position">{{ interviewData.position }}</span>
          <span class="separator">•</span>
          <span class="company">{{ interviewData.company }}</span>
        </div>
      </div>
      <div class="header-right">
        <div class="timer">
          <el-icon><Clock /></el-icon>
          {{ formatTime(elapsedTime) }}
        </div>
        <el-button type="danger" @click="endInterview">
          结束面试
        </el-button>
      </div>
    </div>

    <!-- 面试主要区域 -->
    <div class="room-content">
      <!-- 视频区域 -->
      <div class="video-section">
        <div class="video-container">
          <video 
            ref="videoRef" 
            class="candidate-video" 
            autoplay 
            muted
            :class="{ recording: isRecording }"
          ></video>
          <div class="video-overlay">
            <div class="recording-indicator" v-if="isRecording">
              <div class="recording-dot"></div>
              <span>录制中</span>
            </div>
            <div class="video-controls">
              <el-button 
                :type="isCameraOn ? 'primary' : 'default'"
                circle
                @click="toggleCamera"
              >
                <el-icon><VideoCamera /></el-icon>
              </el-button>
              <el-button 
                :type="isMicOn ? 'primary' : 'default'"
                circle
                @click="toggleMic"
              >
                <el-icon><Microphone /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 问题和回答区域 -->
      <div class="qa-section">
        <!-- 当前问题 -->
        <div class="current-question">
          <div class="question-header">
            <div class="question-number">
              问题 {{ currentQuestionIndex + 1 }} / {{ questions.length }}
            </div>
            <div class="question-difficulty">
              <el-tag 
                :type="getDifficultyType(currentQuestion.difficulty)"
                size="small"
              >
                {{ getDifficultyText(currentQuestion.difficulty) }}
              </el-tag>
            </div>
          </div>
          <div class="question-content">
            <h3>{{ currentQuestion.title }}</h3>
            <p>{{ currentQuestion.description }}</p>
          </div>
          <div class="question-timer">
            <el-progress 
              :percentage="questionProgress" 
              :color="getProgressColor(questionProgress)"
              :show-text="false"
            />
            <span class="time-remaining">剩余时间: {{ formatTime(questionTimeRemaining) }}</span>
          </div>
        </div>

        <!-- 回答区域 -->
        <div class="answer-section">
          <div class="answer-tabs">
            <el-tabs v-model="activeAnswerTab" @tab-click="handleTabClick">

              
              <el-tab-pane label="文字回答" name="text">
                <div class="text-answer">
                  <el-input
                    v-model="textAnswer"
                    type="textarea"
                    :rows="8"
                    placeholder="请输入您的回答..."
                    maxlength="2000"
                    show-word-limit
                  />
                </div>
              </el-tab-pane>
              
              <el-tab-pane label="代码回答" name="code">
                <div class="code-answer">
                  <div class="code-editor">
                    <el-select v-model="selectedLanguage" placeholder="选择编程语言" style="margin-bottom: 12px;">
                      <el-option label="Python" value="python" />
                      <el-option label="JavaScript" value="javascript" />
                      <el-option label="Java" value="java" />
                      <el-option label="C++" value="cpp" />
                    </el-select>
                    <el-input
                      v-model="codeAnswer"
                      type="textarea"
                      :rows="10"
                      placeholder="请输入您的代码..."
                      class="code-textarea"
                    />
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>

          <div class="answer-actions">
            <el-button @click="skipQuestion">跳过问题</el-button>
            <el-button type="primary" @click="submitAnswer">
              提交回答
            </el-button>
            <el-button @click="nextQuestion" :disabled="currentQuestionIndex >= questions.length - 1">
              下一题
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- AI 分析面板 -->
    <div class="ai-analysis-panel" v-if="showAnalysis">
      <div class="analysis-header">
        <h3>AI 实时分析</h3>
        <el-button text @click="toggleAnalysis">
          {{ showAnalysis ? '隐藏' : '显示' }}
        </el-button>
      </div>
      <div class="analysis-content">
        <div class="analysis-item">
          <div class="analysis-label">语音质量:</div>
          <el-progress :percentage="analysisData.voiceQuality" />
        </div>
        <div class="analysis-item">
          <div class="analysis-label">表达流畅度:</div>
          <el-progress :percentage="analysisData.fluency" />
        </div>
        <div class="analysis-item">
          <div class="analysis-label">技术深度:</div>
          <el-progress :percentage="analysisData.technicalDepth" />
        </div>
        <div class="analysis-item">
          <div class="analysis-label">逻辑清晰度:</div>
          <el-progress :percentage="analysisData.logicClarity" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { 
  Clock, VideoCamera, Microphone
} from '@element-plus/icons-vue'

// 响应式数据
const interviewData = reactive({
  position: 'AI算法工程师',
  company: 'iFlytek科大讯飞',
  startTime: new Date()
})

const questions = ref([
  {
    id: 1,
    title: '请介绍一下深度学习中的反向传播算法',
    description: '请详细说明反向传播算法的原理、实现步骤以及在神经网络训练中的作用。',
    difficulty: 'medium',
    timeLimit: 300 // 5分钟
  },
  {
    id: 2,
    title: '如何优化大规模机器学习模型的训练效率？',
    description: '从算法、硬件、分布式等角度分析如何提升模型训练效率。',
    difficulty: 'hard',
    timeLimit: 600 // 10分钟
  }
])

const currentQuestionIndex = ref(0)
const elapsedTime = ref(0)
const questionTimeRemaining = ref(300)
const isRecording = ref(false)
const isCameraOn = ref(true)
const isMicOn = ref(true)
const isRecordingVoice = ref(false)
const showAnalysis = ref(true)

const activeAnswerTab = ref('voice')
const textAnswer = ref('')
const codeAnswer = ref('')
const selectedLanguage = ref('python')
const voiceTranscript = ref('')

const analysisData = reactive({
  voiceQuality: 85,
  fluency: 78,
  technicalDepth: 82,
  logicClarity: 88
})

// 计算属性
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])
const questionProgress = computed(() => {
  const timeLimit = currentQuestion.value.timeLimit
  const elapsed = timeLimit - questionTimeRemaining.value
  return Math.min((elapsed / timeLimit) * 100, 100)
})

// 方法
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const getDifficultyType = (difficulty) => {
  const typeMap = {
    easy: 'success',
    medium: 'warning',
    hard: 'danger'
  }
  return typeMap[difficulty] || 'info'
}

const getDifficultyText = (difficulty) => {
  const textMap = {
    easy: '简单',
    medium: '中等',
    hard: '困难'
  }
  return textMap[difficulty] || '未知'
}

const getProgressColor = (percentage) => {
  if (percentage < 50) return '#52c41a'
  if (percentage < 80) return '#faad14'
  return '#ff4d4f'
}

const toggleCamera = () => {
  isCameraOn.value = !isCameraOn.value
  console.log('切换摄像头:', isCameraOn.value)
}

const toggleMic = () => {
  isMicOn.value = !isMicOn.value
  console.log('切换麦克风:', isMicOn.value)
}

const toggleVoiceRecording = () => {
  isRecordingVoice.value = !isRecordingVoice.value
  if (isRecordingVoice.value) {
    console.log('开始语音录制')
    // 模拟语音转文字
    setTimeout(() => {
      voiceTranscript.value = '深度学习中的反向传播算法是一种用于训练神经网络的核心算法...'
    }, 3000)
  } else {
    console.log('停止语音录制')
  }
}

const handleTabClick = (tab) => {
  console.log('切换回答方式:', tab.name)
}

const skipQuestion = () => {
  console.log('跳过问题')
  nextQuestion()
}

const submitAnswer = () => {
  console.log('提交回答')
  // 这里可以添加提交逻辑
}

const nextQuestion = () => {
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++
    questionTimeRemaining.value = currentQuestion.value.timeLimit
    textAnswer.value = ''
    codeAnswer.value = ''
    voiceTranscript.value = ''
    console.log('下一题:', currentQuestionIndex.value + 1)
  }
}

const endInterview = () => {
  console.log('结束面试')
  // 跳转到面试结果页面
  router.push('/interview-result')
}

const toggleAnalysis = () => {
  showAnalysis.value = !showAnalysis.value
}

// 定时器
let timer = null
let questionTimer = null

onMounted(() => {
  // 启动总时间计时器
  timer = setInterval(() => {
    elapsedTime.value++
  }, 1000)
  
  // 启动问题计时器
  questionTimer = setInterval(() => {
    if (questionTimeRemaining.value > 0) {
      questionTimeRemaining.value--
    } else {
      // 时间到，自动下一题
      nextQuestion()
    }
  }, 1000)
  
  // 初始化摄像头
  initCamera()
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  if (questionTimer) clearInterval(questionTimer)
})

const initCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: true, 
      audio: true 
    })
    if (videoRef.value) {
      videoRef.value.srcObject = stream
    }
  } catch (error) {
    console.error('无法访问摄像头:', error)
  }
}

const videoRef = ref(null)
</script>

<style scoped>
.interview-room {
  min-height: 100vh;
  background: var(--iflytek-bg-secondary);
  display: flex;
  flex-direction: column;
}

.room-header {
  background: var(--iflytek-bg-primary);
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--iflytek-shadow-sm);
}

.room-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--iflytek-text-primary);
  margin: 0 0 8px 0;
}

.interview-info {
  color: var(--iflytek-text-secondary);
  font-size: var(--font-size-sm);
}

.separator {
  margin: 0 8px;
}

.timer {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--iflytek-text-primary);
  font-weight: var(--font-weight-medium);
  margin-right: 16px;
}

.room-content {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  padding: 24px;
}

.video-section {
  background: var(--iflytek-bg-primary);
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--iflytek-shadow-sm);
}

.video-container {
  position: relative;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 16/9;
}

.candidate-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.candidate-video.recording {
  border: 3px solid #ff4d4f;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 20px;
}

.recording-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.recording-dot {
  width: 8px;
  height: 8px;
  background: #ff4d4f;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.video-controls {
  display: flex;
  gap: 12px;
}

.qa-section {
  background: var(--iflytek-bg-primary);
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--iflytek-shadow-sm);
  display: flex;
  flex-direction: column;
}

.current-question {
  margin-bottom: 24px;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.question-number {
  font-weight: var(--font-weight-semibold);
  color: var(--iflytek-primary);
}

.question-content h3 {
  color: var(--iflytek-text-primary);
  margin: 0 0 12px 0;
  font-size: var(--font-size-lg);
}

.question-content p {
  color: var(--iflytek-text-secondary);
  line-height: 1.6;
  margin: 0;
}

.question-timer {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.time-remaining {
  font-size: var(--font-size-sm);
  color: var(--iflytek-text-secondary);
  white-space: nowrap;
}

.answer-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.answer-tabs {
  flex: 1;
  margin-bottom: 20px;
}

.voice-answer {
  text-align: center;
  padding: 20px;
}

.voice-controls {
  margin-bottom: 20px;
}

.waveform-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2px;
  height: 60px;
  margin-bottom: 20px;
}

.wave-bar {
  width: 3px;
  background: var(--iflytek-primary);
  border-radius: 2px;
  animation: wave 1s ease-in-out infinite;
}

.wave-bar:nth-child(odd) {
  animation-delay: 0.1s;
}

.wave-bar:nth-child(even) {
  animation-delay: 0.2s;
}

@keyframes wave {
  0%, 100% { height: 10px; }
  50% { height: 40px; }
}

.voice-transcript {
  text-align: left;
  background: var(--iflytek-bg-secondary);
  padding: 16px;
  border-radius: 8px;
}

.voice-transcript h4 {
  margin: 0 0 8px 0;
  color: var(--iflytek-text-primary);
}

.code-textarea {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
}

.answer-actions {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.ai-analysis-panel {
  position: fixed;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  width: 300px;
  background: var(--iflytek-bg-primary);
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--iflytek-shadow-lg);
  border: 1px solid var(--iflytek-border-secondary);
}

.analysis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--iflytek-border-secondary);
}

.analysis-header h3 {
  margin: 0;
  color: var(--iflytek-text-primary);
  font-size: var(--font-size-base);
}

.analysis-item {
  margin-bottom: 16px;
}

.analysis-label {
  color: var(--iflytek-text-secondary);
  font-size: var(--font-size-sm);
  margin-bottom: 8px;
}

@media (max-width: 1024px) {
  .room-content {
    grid-template-columns: 1fr;
  }
  
  .ai-analysis-panel {
    position: static;
    transform: none;
    width: 100%;
    margin-top: 24px;
  }
}

@media (max-width: 768px) {
  .room-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .interview-room {
    padding: 16px;
  }
  
  .answer-actions {
    flex-direction: column;
  }
}
</style>
