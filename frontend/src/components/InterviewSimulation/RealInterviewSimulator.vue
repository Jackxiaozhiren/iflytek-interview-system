<template>
  <div class="real-interview-simulator">
    <!-- 面试准备阶段 -->
    <div v-if="currentPhase === 'preparation'" class="preparation-phase">
      <div class="preparation-header">
        <h2 class="phase-title chinese-title-animation">
          <el-icon><User /></el-icon>
          面试准备
        </h2>
        <p class="phase-description chinese-text-fade-in">
          请完善您的信息，我们将为您定制专属的面试体验
        </p>
      </div>

      <el-card class="preparation-form">
        <el-form :model="candidateProfile" label-width="120px" class="profile-form">
          <el-form-item label="技术领域">
            <el-select v-model="candidateProfile.domain" placeholder="请选择您的技术领域">
              <el-option label="人工智能" value="ai"></el-option>
              <el-option label="大数据" value="bigdata"></el-option>
              <el-option label="物联网" value="iot"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="经验水平">
            <el-radio-group v-model="candidateProfile.experience_level">
              <el-radio value="beginner">初级 (0-2年)</el-radio>
              <el-radio value="intermediate">中级 (2-5年)</el-radio>
              <el-radio value="advanced">高级 (5-8年)</el-radio>
              <el-radio value="expert">专家 (8年以上)</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="面试类型">
            <el-checkbox-group v-model="candidateProfile.interview_types">
              <el-checkbox label="technical">技术面试</el-checkbox>
              <el-checkbox label="behavioral">行为面试</el-checkbox>
              <el-checkbox label="coding">编程挑战</el-checkbox>
              <el-checkbox label="system_design">系统设计</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="设备检测">
            <div class="device-check">
              <div class="check-item">
                <el-icon :class="deviceStatus.camera ? 'success' : 'error'">
                  <VideoCamera />
                </el-icon>
                <span>摄像头</span>
                <el-button size="small" @click="testCamera">测试</el-button>
              </div>
              <div class="check-item">
                <el-icon :class="deviceStatus.microphone ? 'success' : 'error'">
                  <VideoCamera />
                </el-icon>
                <span>麦克风</span>
                <el-button size="small" @click="testMicrophone">测试</el-button>
              </div>
              <div class="check-item">
                <el-icon :class="deviceStatus.speaker ? 'success' : 'error'">
                  <VideoCamera />
                </el-icon>
                <span>扬声器</span>
                <el-button size="small" @click="testSpeaker">测试</el-button>
              </div>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="large"
              @click="startInterview"
              :disabled="!canStartInterview"
              class="start-interview-btn"
            >
              <el-icon><VideoPlay /></el-icon>
              开始iFlytek AI面试
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <!-- 面试进行阶段 -->
    <div v-else-if="currentPhase === 'interview'" class="interview-phase">
      <!-- 面试头部信息 -->
      <div class="interview-header">
        <div class="interview-info">
          <h3 class="current-phase-title">{{ currentInterviewPhase.chinese_title }}</h3>
          <p class="phase-description">{{ currentInterviewPhase.description }}</p>
        </div>
        <div class="interview-controls">
          <div class="time-display">
            <el-icon><Timer /></el-icon>
            <span>{{ formatTime(phaseTimeRemaining) }}</span>
          </div>
          <div class="progress-display">
            <span>{{ currentPhaseIndex + 1 }} / {{ interviewSimulation.phases.length }}</span>
          </div>
        </div>
      </div>

      <!-- 面试内容区域 -->
      <div class="interview-content">
        <!-- AI面试官 -->
        <div class="ai-interviewer-section">
          <div class="interviewer-avatar">
            <div class="avatar-container">
              <img src="/images/iflytek-ai-interviewer.png" alt="iFlytek AI面试官" />
              <div class="speaking-indicator" :class="{ active: aiSpeaking }"></div>
            </div>
            <div class="interviewer-info">
              <h4>iFlytek AI面试官</h4>
              <p>星火大模型V3.5驱动</p>
            </div>
          </div>

          <div class="conversation-area">
            <div class="messages-container" ref="messagesContainer">
              <div
                v-for="(message, index) in conversationHistory"
                :key="index"
                class="message-item"
                :class="message.role"
              >
                <div class="message-content">
                  <div class="message-text">{{ message.content }}</div>
                  <div class="message-time">{{ formatMessageTime(message.timestamp) }}</div>
                </div>
                <div v-if="message.analysis" class="message-analysis">
                  <el-tag size="small" type="info">AI分析</el-tag>
                  <span>{{ message.analysis }}</span>
                </div>
              </div>
            </div>

            <div class="input-area">
              <div class="recording-controls">
                <el-button
                  :type="isRecording ? 'danger' : 'primary'"
                  circle
                  size="large"
                  @click="toggleRecording"
                  class="record-btn"
                >
                  <el-icon>
                    <Microphone v-if="!isRecording" />
                    <VideoPause v-else />
                  </el-icon>
                </el-button>
                <span class="recording-status">
                  {{ isRecording ? '正在录音...' : '点击开始回答' }}
                </span>
              </div>

              <div class="text-input-area">
                <el-input
                  v-model="textInput"
                  type="textarea"
                  :rows="3"
                  placeholder="您也可以直接输入文字回答..."
                  @keydown.ctrl.enter="sendTextMessage"
                />
                <el-button @click="sendTextMessage" :disabled="!textInput.trim()">
                  发送
                </el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 候选人视频区域 -->
        <div class="candidate-video-section">
          <div class="video-container">
            <video ref="candidateVideo" autoplay muted class="candidate-video"></video>
            <div class="video-overlay">
              <div class="analysis-indicators">
                <div class="indicator" :class="analysisResults.confidence">
                  <span>自信度</span>
                  <div class="indicator-bar">
                    <div class="bar-fill" :style="{ width: analysisResults.confidenceScore + '%' }"></div>
                  </div>
                </div>
                <div class="indicator" :class="analysisResults.fluency">
                  <span>流畅度</span>
                  <div class="indicator-bar">
                    <div class="bar-fill" :style="{ width: analysisResults.fluencyScore + '%' }"></div>
                  </div>
                </div>
                <div class="indicator" :class="analysisResults.engagement">
                  <span>参与度</span>
                  <div class="indicator-bar">
                    <div class="bar-fill" :style="{ width: analysisResults.engagementScore + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 实时反馈 -->
          <div class="real-time-feedback">
            <h4>iFlytek实时分析</h4>
            <div class="feedback-items">
              <div class="feedback-item" v-for="feedback in realtimeFeedback" :key="feedback.id">
                <el-icon :class="feedback.type"><InfoFilled /></el-icon>
                <span>{{ feedback.message }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 面试阶段控制 -->
      <div class="phase-controls">
        <el-button @click="previousPhase" :disabled="currentPhaseIndex === 0">
          上一阶段
        </el-button>
        <el-button @click="pauseInterview" :type="isPaused ? 'success' : 'warning'">
          {{ isPaused ? '继续面试' : '暂停面试' }}
        </el-button>
        <el-button @click="nextPhase" :disabled="currentPhaseIndex === interviewSimulation.phases.length - 1">
          下一阶段
        </el-button>
        <el-button @click="endInterview" type="danger">
          结束面试
        </el-button>
      </div>
    </div>

    <!-- 面试结果阶段 -->
    <div v-else-if="currentPhase === 'results'" class="results-phase">
      <div class="results-header">
        <h2 class="phase-title chinese-title-animation">
          <el-icon><Star /></el-icon>
          面试评估结果
        </h2>
        <p class="phase-description chinese-text-fade-in">
          基于iFlytek星火大模型的智能分析结果
        </p>
      </div>

      <!-- 综合评分 -->
      <div class="overall-score-section">
        <el-card>
          <div class="score-display">
            <el-progress
              type="circle"
              :percentage="overallScore"
              :width="120"
              :stroke-width="8"
              :color="getScoreColor(overallScore)"
            >
              <template #default="{ percentage }">
                <span class="score-text">{{ percentage }}分</span>
              </template>
            </el-progress>
            <div class="score-details">
              <h3>综合评分</h3>
              <p>{{ getScoreLevel(overallScore) }}</p>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 详细分析 -->
      <div class="detailed-analysis">
        <el-tabs v-model="activeAnalysisTab">
          <el-tab-pane label="技术能力" name="technical">
            <TechnicalAnalysis :data="analysisData.technical" />
          </el-tab-pane>
          <el-tab-pane label="沟通表达" name="communication">
            <CommunicationAnalysis :data="analysisData.communication" />
          </el-tab-pane>
          <el-tab-pane label="实践经验" name="experience">
            <ExperienceAnalysis :data="analysisData.experience" />
          </el-tab-pane>
          <el-tab-pane label="文化适应" name="culture">
            <CultureAnalysis :data="analysisData.culture" />
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- 改进建议 -->
      <div class="improvement-suggestions">
        <el-card>
          <template #header>
            <h3>iFlytek AI建议</h3>
          </template>
          <div class="suggestions-list">
            <div
              v-for="(suggestion, index) in improvementSuggestions"
              :key="index"
              class="suggestion-item"
            >
              <el-icon class="suggestion-icon"><Star /></el-icon>
              <div class="suggestion-content">
                <h4>{{ suggestion.title }}</h4>
                <p>{{ suggestion.description }}</p>
                <div class="suggestion-actions">
                  <el-button size="small" @click="viewSuggestionDetails(suggestion)">
                    查看详情
                  </el-button>
                  <el-button size="small" type="primary" @click="startLearningPath(suggestion)">
                    开始学习
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 操作按钮 -->
      <div class="results-actions">
        <el-button size="large" @click="downloadReport">
          <el-icon><ArrowDown /></el-icon>
          下载报告
        </el-button>
        <el-button size="large" @click="shareResults">
          <el-icon><ArrowRight /></el-icon>
          分享结果
        </el-button>
        <el-button size="large" @click="retakeInterview">
          <el-icon><Loading /></el-icon>
          重新面试
        </el-button>
        <el-button size="large" type="primary" @click="goToHome">
          <el-icon><House /></el-icon>
          返回首页
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElNotification } from 'element-plus'
import {
  User, VideoCamera, VideoPlay, Timer, InfoFilled, Star, ArrowDown, ArrowRight, Loading, House
} from '@element-plus/icons-vue'
import multimodalDemoContentService from '@/services/multimodalDemoContentService'

// 组件引入
import TechnicalAnalysis from './TechnicalAnalysis.vue'
import CommunicationAnalysis from './CommunicationAnalysis.vue'
import ExperienceAnalysis from './ExperienceAnalysis.vue'
import CultureAnalysis from './CultureAnalysis.vue'

const router = useRouter()

// 响应式数据
const currentPhase = ref('preparation') // preparation, interview, results
const candidateProfile = ref({
  domain: '',
  experience_level: 'intermediate',
  interview_types: ['technical'],
  preferred_language: 'zh-CN'
})

const deviceStatus = ref({
  camera: false,
  microphone: false,
  speaker: false
})

const interviewSimulation = ref(null)
const currentPhaseIndex = ref(0)
const phaseTimeRemaining = ref(0)
const phaseTimer = ref(null)

const conversationHistory = ref([])
const isRecording = ref(false)
const aiSpeaking = ref(false)
const textInput = ref('')
const isPaused = ref(false)

const analysisResults = ref({
  confidence: 'good',
  confidenceScore: 75,
  fluency: 'excellent',
  fluencyScore: 88,
  engagement: 'good',
  engagementScore: 82
})

const realtimeFeedback = ref([
  { id: 1, type: 'success', message: '语音清晰度良好' },
  { id: 2, type: 'info', message: '建议保持眼神接触' },
  { id: 3, type: 'warning', message: '回答可以更加具体' }
])

const overallScore = ref(0)
const activeAnalysisTab = ref('technical')
const analysisData = ref({
  technical: {},
  communication: {},
  experience: {},
  culture: {}
})

const improvementSuggestions = ref([])

// 计算属性
const canStartInterview = computed(() => {
  return candidateProfile.value.domain &&
         candidateProfile.value.experience_level &&
         deviceStatus.value.camera &&
         deviceStatus.value.microphone
})

const currentInterviewPhase = computed(() => {
  if (!interviewSimulation.value || currentPhaseIndex.value >= interviewSimulation.value.phases.length) {
    return {}
  }
  return interviewSimulation.value.phases[currentPhaseIndex.value]
})

// 方法
const testCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    deviceStatus.value.camera = true
    stream.getTracks().forEach(track => track.stop())
    ElMessage.success('摄像头测试成功')
  } catch (error) {
    deviceStatus.value.camera = false
    ElMessage.error('摄像头访问失败，请检查权限设置')
  }
}

const testMicrophone = async () => {
  ElMessage.info('麦克风功能已禁用')
  deviceStatus.value.microphone = false
}

const testSpeaker = () => {
  const audio = new Audio('/audio/test-sound.mp3')
  audio.play().then(() => {
    deviceStatus.value.speaker = true
    ElMessage.success('扬声器测试成功')
  }).catch(() => {
    deviceStatus.value.speaker = false
    ElMessage.error('扬声器测试失败')
  })
}

const startInterview = async () => {
  try {
    // 生成面试模拟场景
    interviewSimulation.value = multimodalDemoContentService.createRealInterviewSimulation(candidateProfile.value)

    currentPhase.value = 'interview'
    currentPhaseIndex.value = 0

    // 启动摄像头
    await initializeCamera()

    // 开始第一阶段
    startCurrentPhase()

    ElNotification.success({
      title: '面试开始',
      message: 'iFlytek AI面试官已准备就绪，祝您面试顺利！',
      duration: 3000
    })
  } catch (error) {
    console.error('启动面试失败:', error)
    ElMessage.error('面试启动失败，请重试')
  }
}

const initializeCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    })

    if (candidateVideo.value) {
      candidateVideo.value.srcObject = stream
    }
  } catch (error) {
    console.error('摄像头初始化失败:', error)
    ElMessage.error('摄像头初始化失败')
  }
}

const startCurrentPhase = () => {
  const phase = currentInterviewPhase.value
  if (!phase) return

  phaseTimeRemaining.value = phase.duration

  // 启动计时器
  phaseTimer.value = setInterval(() => {
    if (!isPaused.value) {
      phaseTimeRemaining.value--
      if (phaseTimeRemaining.value <= 0) {
        nextPhase()
      }
    }
  }, 1000)

  // 添加AI面试官的开场白
  addAIMessage(`欢迎进入${phase.chinese_title}环节。${phase.description}`)
}

const addAIMessage = (content, analysis = null) => {
  conversationHistory.value.push({
    role: 'ai',
    content,
    analysis,
    timestamp: new Date()
  })

  nextTick(() => {
    scrollToBottom()
  })
}

const addUserMessage = (content, analysis = null) => {
  conversationHistory.value.push({
    role: 'user',
    content,
    analysis,
    timestamp: new Date()
  })

  nextTick(() => {
    scrollToBottom()
  })
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const toggleRecording = () => {
  isRecording.value = !isRecording.value

  if (isRecording.value) {
    startRecording()
  } else {
    stopRecording()
  }
}

const startRecording = () => {
  // 实现语音录制逻辑
  ElMessage.info('开始录音...')
}

const stopRecording = () => {
  // 实现语音录制停止逻辑
  ElMessage.info('录音结束，正在分析...')

  // 模拟AI分析和回复
  setTimeout(() => {
    addUserMessage('这是用户的语音回答内容', 'AI分析：回答清晰，技术理解准确')

    setTimeout(() => {
      generateAIResponse()
    }, 1000)
  }, 2000)
}

const sendTextMessage = () => {
  if (!textInput.value.trim()) return

  addUserMessage(textInput.value, 'AI分析：文字表达清晰')
  textInput.value = ''

  setTimeout(() => {
    generateAIResponse()
  }, 1000)
}

const generateAIResponse = () => {
  aiSpeaking.value = true

  const responses = [
    '很好的回答！请继续详细说明一下实现细节。',
    '您提到的这个方案很有趣，能否分享一下在实际项目中的应用经验？',
    '我理解您的观点。现在让我们讨论一个更具挑战性的场景...',
    '您的技术理解很深入。接下来我们来看一个编程问题。'
  ]

  const randomResponse = responses[Math.floor(Math.random() * responses.length)]

  setTimeout(() => {
    addAIMessage(randomResponse)
    aiSpeaking.value = false
  }, 2000)
}

const nextPhase = () => {
  if (currentPhaseIndex.value < interviewSimulation.value.phases.length - 1) {
    currentPhaseIndex.value++
    clearInterval(phaseTimer.value)
    startCurrentPhase()
  } else {
    endInterview()
  }
}

const previousPhase = () => {
  if (currentPhaseIndex.value > 0) {
    currentPhaseIndex.value--
    clearInterval(phaseTimer.value)
    startCurrentPhase()
  }
}

const pauseInterview = () => {
  isPaused.value = !isPaused.value
  ElMessage.info(isPaused.value ? '面试已暂停' : '面试已继续')
}

const endInterview = () => {
  clearInterval(phaseTimer.value)
  currentPhase.value = 'results'

  // 生成面试结果
  generateInterviewResults()

  ElNotification.success({
    title: '面试完成',
    message: '正在生成您的评估报告...',
    duration: 3000
  })
}

const generateInterviewResults = () => {
  // 模拟生成面试结果
  overallScore.value = Math.floor(Math.random() * 30) + 70 // 70-100分

  analysisData.value = {
    technical: {
      score: 85,
      strengths: ['算法理解深入', '代码实现能力强'],
      improvements: ['需要更多实际项目经验']
    },
    communication: {
      score: 78,
      strengths: ['表达清晰', '逻辑性强'],
      improvements: ['可以更加自信']
    },
    experience: {
      score: 82,
      strengths: ['有丰富的实践经验'],
      improvements: ['需要了解更多最新技术']
    },
    culture: {
      score: 88,
      strengths: ['团队合作意识强'],
      improvements: ['可以更主动地分享想法']
    }
  }

  improvementSuggestions.value = [
    {
      title: '深化算法理解',
      description: '建议学习更多高级算法和数据结构',
      learningPath: 'advanced_algorithms'
    },
    {
      title: '提升项目经验',
      description: '参与更多实际项目，积累实战经验',
      learningPath: 'project_practice'
    },
    {
      title: '增强沟通技巧',
      description: '练习技术演讲和团队协作',
      learningPath: 'communication_skills'
    }
  ]
}

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

const formatMessageTime = (timestamp) => {
  return timestamp.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getScoreColor = (score) => {
  if (score >= 90) return '#67C23A'
  if (score >= 80) return '#E6A23C'
  if (score >= 70) return '#F56C6C'
  return '#909399'
}

const getScoreLevel = (score) => {
  if (score >= 90) return '优秀'
  if (score >= 80) return '良好'
  if (score >= 70) return '中等'
  return '需要改进'
}

const downloadReport = () => {
  ElMessage.success('报告下载功能开发中...')
}

const shareResults = () => {
  ElMessage.success('结果分享功能开发中...')
}

const retakeInterview = () => {
  currentPhase.value = 'preparation'
  conversationHistory.value = []
  currentPhaseIndex.value = 0
  overallScore.value = 0
}

const goToHome = () => {
  router.push('/')
}

const viewSuggestionDetails = (suggestion) => {
  ElMessage.info(`查看${suggestion.title}详情`)
}

const startLearningPath = (suggestion) => {
  ElMessage.info(`开始${suggestion.title}学习路径`)
}

// 生命周期
onMounted(() => {
  // 自动检测设备
  testCamera()
  testMicrophone()
  testSpeaker()
})

onUnmounted(() => {
  if (phaseTimer.value) {
    clearInterval(phaseTimer.value)
  }

  // 停止摄像头
  if (candidateVideo.value && candidateVideo.value.srcObject) {
    candidateVideo.value.srcObject.getTracks().forEach(track => track.stop())
  }
})

// 引用
const candidateVideo = ref(null)
const messagesContainer = ref(null)
</script>

<style scoped>
.real-interview-simulator {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

/* 准备阶段样式 */
.preparation-phase {
  max-width: 800px;
  margin: 0 auto;
}

.preparation-header {
  text-align: center;
  margin-bottom: 40px;
}

.phase-title {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.phase-description {
  font-size: 1.1rem;
  color: #666;
  line-height: 1.6;
}

.preparation-form {
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.profile-form {
  padding: 20px;
}

.device-check {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.check-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 8px;
  min-width: 150px;
}

.check-item .el-icon.success {
  color: #67C23A;
}

.check-item .el-icon.error {
  color: #F56C6C;
}

.start-interview-btn {
  width: 100%;
  height: 50px;
  font-size: 1.1rem;
  background: linear-gradient(135deg, #4c51bf 0%, #6b21a8 100%);
  border: none;
}

/* 面试阶段样式 */
.interview-phase {
  max-width: 1400px;
  margin: 0 auto;
}

.interview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.interview-info h3 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 1.3rem;
}

.interview-controls {
  display: flex;
  align-items: center;
  gap: 20px;
}

.time-display {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  color: #4c51bf;
}

.progress-display {
  background: #f0f0f0;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
}

.interview-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 20px;
  margin-bottom: 20px;
}

/* AI面试官区域 */
.ai-interviewer-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.interviewer-avatar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.avatar-container {
  position: relative;
}

.avatar-container img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid #4c51bf;
}

.speaking-indicator {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 16px;
  height: 16px;
  background: #67C23A;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.speaking-indicator.active {
  opacity: 1;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.interviewer-info h4 {
  margin: 0 0 4px 0;
  color: #333;
}

.interviewer-info p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.conversation-area {
  height: 500px;
  display: flex;
  flex-direction: column;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 16px;
}

.message-item {
  margin-bottom: 16px;
}

.message-item.ai .message-content {
  background: #4c51bf;
  color: white;
  margin-right: 60px;
}

.message-item.user .message-content {
  background: white;
  color: #333;
  margin-left: 60px;
  border: 1px solid #e0e0e0;
}

.message-content {
  padding: 12px 16px;
  border-radius: 12px;
  position: relative;
}

.message-text {
  line-height: 1.5;
  margin-bottom: 4px;
}

.message-time {
  font-size: 0.8rem;
  opacity: 0.7;
}

.message-analysis {
  margin-top: 8px;
  padding: 8px 12px;
  background: #f0f7ff;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #1890ff;
}

.input-area {
  border-top: 1px solid #f0f0f0;
  padding-top: 16px;
}

.recording-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.record-btn {
  width: 60px;
  height: 60px;
  font-size: 24px;
}

.recording-status {
  font-weight: bold;
  color: #4c51bf;
}

.text-input-area {
  display: flex;
  gap: 12px;
}

.text-input-area .el-textarea {
  flex: 1;
}

/* 候选人视频区域 */
.candidate-video-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.video-container {
  position: relative;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 4/3;
}

.candidate-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%);
  display: flex;
  align-items: flex-end;
  padding: 16px;
}

.analysis-indicators {
  width: 100%;
}

.indicator {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  color: white;
  font-size: 0.9rem;
}

.indicator-bar {
  width: 100px;
  height: 6px;
  background: rgba(255,255,255,0.3);
  border-radius: 3px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: #67C23A;
  transition: width 0.3s ease;
}

.real-time-feedback {
  background: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.real-time-feedback h4 {
  margin: 0 0 12px 0;
  color: #333;
}

.feedback-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.feedback-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 6px;
  font-size: 0.9rem;
}

.feedback-item .el-icon {
  color: #4c51bf;
}

/* 阶段控制 */
.phase-controls {
  display: flex;
  justify-content: center;
  gap: 16px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* 结果阶段样式 */
.results-phase {
  max-width: 1200px;
  margin: 0 auto;
}

.overall-score-section {
  margin-bottom: 32px;
}

.score-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  padding: 32px;
}

.score-details {
  text-align: center;
}

.score-details h3 {
  margin: 0 0 8px 0;
  font-size: 1.5rem;
  color: #333;
}

.score-text {
  font-size: 1.5rem;
  font-weight: bold;
}

.detailed-analysis {
  margin-bottom: 32px;
}

.improvement-suggestions {
  margin-bottom: 32px;
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.suggestion-item {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
}

.suggestion-icon {
  color: #4c51bf;
  font-size: 24px;
  margin-top: 4px;
}

.suggestion-content {
  flex: 1;
}

.suggestion-content h4 {
  margin: 0 0 8px 0;
  color: #333;
}

.suggestion-content p {
  margin: 0 0 12px 0;
  color: #666;
  line-height: 1.5;
}

.suggestion-actions {
  display: flex;
  gap: 8px;
}

.results-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .real-interview-simulator {
    padding: 16px;
  }

  .interview-content {
    grid-template-columns: 1fr;
  }

  .interview-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .device-check {
    flex-direction: column;
  }

  .check-item {
    min-width: auto;
  }

  .score-display {
    flex-direction: column;
    gap: 20px;
  }

  .results-actions {
    flex-direction: column;
    align-items: center;
  }

  .results-actions .el-button {
    width: 100%;
    max-width: 300px;
  }
}

/* 中文字体优化 */
.phase-title,
.interviewer-info h4,
.suggestion-content h4 {
  font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
}

/* iFlytek品牌色彩 */
.start-interview-btn,
.record-btn[type="primary"] {
  background: linear-gradient(135deg, #4c51bf 0%, #6b21a8 100%);
  border: none;
}

.time-display,
.recording-status {
  color: #4c51bf;
}

.suggestion-icon,
.feedback-item .el-icon {
  color: #4c51bf;
}
</style>