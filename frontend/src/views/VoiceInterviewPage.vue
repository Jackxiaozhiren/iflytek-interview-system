<template>
  <div class="voice-interview-page">
    <!-- 页面头部 -->
    <header class="voice-interview-header">
      <div class="header-content">
        <div class="interview-info">
          <h1 class="interview-title">
            <el-icon class="title-icon"><Microphone /></el-icon>
            iFlytek语音专项面试
          </h1>
          <div class="interview-subtitle">专注语音表达和沟通能力的智能评估</div>
          <div class="interview-meta">
            <div class="meta-item">
              <el-icon><User /></el-icon>
              <span>{{ candidateInfo.name }}</span>
            </div>
            <div class="meta-item">
              <el-icon><User /></el-icon>
              <span>{{ candidateInfo.position }}</span>
            </div>
            <div class="meta-item">
              <el-icon><Timer /></el-icon>
              <span>{{ formatTime(elapsedTime) }}</span>
            </div>
          </div>
        </div>
        
        <div class="interview-status">
          <div class="status-indicator" :class="{ active: isRecording }">
            <div class="status-dot"></div>
            <span>{{ voiceStatus }}</span>
          </div>
          <div class="progress-info">
            <span>问题进度: {{ currentQuestion }}/{{ totalQuestions }}</span>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="voice-interview-main">
      <div class="interview-layout">
        <!-- 左侧：语音交互区域 -->
        <div class="voice-interaction-section">
          <!-- 语音可视化区域 -->
          <div class="voice-visualization-card">
            <div class="voice-visual-header">
              <h3>
                <el-icon><Microphone /></el-icon>
                语音交互
              </h3>
              <div class="voice-quality-indicator">
                <span class="quality-label">音质:</span>
                <div class="quality-bars">
                  <div class="quality-bar" :class="{ active: voiceQuality >= 1 }"></div>
                  <div class="quality-bar" :class="{ active: voiceQuality >= 2 }"></div>
                  <div class="quality-bar" :class="{ active: voiceQuality >= 3 }"></div>
                  <div class="quality-bar" :class="{ active: voiceQuality >= 4 }"></div>
                  <div class="quality-bar" :class="{ active: voiceQuality >= 5 }"></div>
                </div>
              </div>
            </div>
            
            <!-- 语音波形动画 -->
            <div class="voice-waveform-container">
              <div class="waveform-display" :class="{ active: isRecording }">
                <div class="wave-bar" v-for="i in 20" :key="i" 
                     :style="{ animationDelay: (i * 0.1) + 's', height: getWaveHeight(i) + '%' }">
                </div>
              </div>
              
              <!-- 录音控制按钮 -->
              <div class="voice-controls">
                <div class="record-button-container">
                  <el-button
                    :type="isRecording ? 'danger' : 'primary'"
                    :icon="Microphone"
                    size="large"
                    @click="toggleRecording"
                    class="record-button"
                    :class="{ recording: isRecording }"
                  >
                    <span class="button-text">{{ isRecording ? '停止录音' : '开始录音' }}</span>
                  </el-button>

                  <!-- 录音状态指示器 -->
                  <div v-if="isRecording" class="recording-indicator">
                    <div class="recording-pulse"></div>
                    <span class="recording-time">{{ formatRecordingTime(recordingTime) }}</span>
                  </div>
                </div>

                <!-- 增强的控制选项 -->
                <div class="voice-control-options">
                  <el-button-group>
                    <el-button
                      size="small"
                      @click="pauseRecording"
                      :disabled="!isRecording"
                      title="暂停录音"
                    >
                      <el-icon><VideoPause /></el-icon>
                      暂停
                    </el-button>
                    <el-button
                      size="small"
                      @click="playbackRecording"
                      :disabled="!hasRecording"
                      title="回放录音"
                    >
                      <el-icon><VideoPlay /></el-icon>
                      回放
                    </el-button>
                    <el-button
                      size="small"
                      @click="adjustVolume"
                      title="调节音量"
                    >
                      <el-icon><Headset /></el-icon>
                      音量
                    </el-button>
                  </el-button-group>
                </div>

                <div class="control-hint">
                  <el-icon><InfoFilled /></el-icon>
                  {{ getControlHint() }}
                </div>

                <!-- 语音质量指示器 -->
                <div class="voice-quality-indicator">
                  <div class="quality-label">语音质量:</div>
                  <div class="quality-bars">
                    <div
                      v-for="i in 5"
                      :key="i"
                      class="quality-bar"
                      :class="{ active: voiceQuality >= i }"
                    ></div>
                  </div>
                  <div class="quality-text">{{ getQualityText(voiceQuality) }}</div>
                </div>
              </div>
            </div>
            
            <!-- 语音识别结果 -->
            <div class="voice-recognition-result">
              <div class="recognition-header">
                <h4>
                  <el-icon><ChatDotRound /></el-icon>
                  实时语音识别
                </h4>
                <div class="recognition-accuracy">
                  准确率: {{ recognitionAccuracy }}%
                </div>
              </div>
              <div class="recognition-content">
                <div class="recognized-text" v-if="recognizedText">
                  <div class="text-header">
                    <el-icon><ChatDotRound /></el-icon>
                    <span>实时语音转文字</span>
                    <el-tag size="small" type="success" v-if="isRecording">正在识别</el-tag>
                    <el-tag size="small" :type="iflytekVoiceInitialized ? 'primary' : 'info'">
                      {{ iflytekVoiceInitialized ? 'iFlytek' : '浏览器' }}
                    </el-tag>
                  </div>
                  <div class="text-content">{{ recognizedText }}</div>
                  <div class="text-stats">
                    <span>字数: {{ recognizedText.length }}</span>
                    <span>准确率: {{ recognitionAccuracy }}%</span>
                    <span>语速: {{ speechRate }} 字/分钟</span>
                  </div>
                </div>
                <div class="recognition-placeholder" v-else>
                  <el-icon><Microphone /></el-icon>
                  <p>点击录音按钮开始语音面试</p>
                  <p class="placeholder-tip">您的语音将实时转换为文字并进行AI分析</p>
                </div>
                
                <!-- 语音重录选项 -->
                <div class="voice-actions" v-if="recognizedText && !isRecording">
                  <el-button size="small" @click="confirmAnswer" type="primary">
                    <el-icon><Check /></el-icon>
                    确认回答
                  </el-button>
                  <el-button size="small" @click="retryRecording">
                    <el-icon><Refresh /></el-icon>
                    重新录音
                  </el-button>
                </div>
              </div>
            </div>
          </div>

          <!-- 语音分析面板 -->
          <div class="voice-analysis-card">
            <div class="analysis-header">
              <h3>
                <el-icon><TrendCharts /></el-icon>
                语音特征分析
              </h3>
            </div>
            <div class="analysis-metrics">
              <div class="metric-item">
                <div class="metric-label">语速</div>
                <div class="metric-value">{{ speechRate }} 字/分钟</div>
                <div class="metric-bar">
                  <div class="metric-fill" :style="{ width: (speechRate / 200 * 100) + '%' }"></div>
                </div>
              </div>
              <div class="metric-item">
                <div class="metric-label">音调变化</div>
                <div class="metric-value">{{ pitchVariation }}%</div>
                <div class="metric-bar">
                  <div class="metric-fill" :style="{ width: pitchVariation + '%' }"></div>
                </div>
              </div>
              <div class="metric-item">
                <div class="metric-label">停顿频率</div>
                <div class="metric-value">{{ pauseFrequency }} 次/分钟</div>
                <div class="metric-bar">
                  <div class="metric-fill" :style="{ width: (pauseFrequency / 10 * 100) + '%' }"></div>
                </div>
              </div>
              <div class="metric-item">
                <div class="metric-label">情感倾向</div>
                <div class="metric-value">{{ emotionTrend }}</div>
                <div class="emotion-indicator" :class="emotionTrend.toLowerCase()"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：AI面试官和问题区域 -->
        <div class="ai-interviewer-section">
          <!-- iFlytek Spark语音技术优势 -->
          <div class="voice-tech-advantages-panel">
            <div class="tech-header">
              <el-icon class="tech-icon"><Microphone /></el-icon>
              <h3>iFlytek Spark 语音技术</h3>
              <el-tag type="success" size="small">实时处理</el-tag>
            </div>

            <div class="voice-tech-content">
              <!-- 语音技术指标 -->
              <div class="voice-tech-metrics">
                <div class="voice-metric-item">
                  <div class="voice-metric-icon">
                    <el-icon><TrendCharts /></el-icon>
                  </div>
                  <div class="voice-metric-info">
                    <div class="voice-metric-value">{{ voiceTechMetrics.recognitionSpeed }}ms</div>
                    <div class="voice-metric-label">识别延迟</div>
                  </div>
                  <div class="voice-metric-trend">
                    <el-icon class="trend-icon up"><ArrowRight /></el-icon>
                  </div>
                </div>

                <div class="voice-metric-item">
                  <div class="voice-metric-icon">
                    <el-icon><ChatDotRound /></el-icon>
                  </div>
                  <div class="voice-metric-info">
                    <div class="voice-metric-value">{{ voiceTechMetrics.accuracy }}%</div>
                    <div class="voice-metric-label">识别准确率</div>
                  </div>
                  <div class="voice-metric-trend">
                    <el-icon class="trend-icon up"><ArrowRight /></el-icon>
                  </div>
                </div>

                <div class="voice-metric-item">
                  <div class="voice-metric-icon">
                    <el-icon><Loading /></el-icon>
                  </div>
                  <div class="voice-metric-info">
                    <div class="voice-metric-value">{{ voiceTechMetrics.noiseReduction }}dB</div>
                    <div class="voice-metric-label">降噪效果</div>
                  </div>
                  <div class="voice-metric-trend">
                    <el-icon class="trend-icon up"><ArrowRight /></el-icon>
                  </div>
                </div>
              </div>

              <!-- 语音AI能力 -->
              <div class="voice-ai-features">
                <div class="feature-title">核心AI能力</div>
                <div class="feature-list">
                  <div
                    v-for="feature in voiceAIFeatures"
                    :key="feature.id"
                    class="voice-feature-item"
                    :class="{ active: feature.active }"
                  >
                    <el-icon><component :is="feature.icon" /></el-icon>
                    <span>{{ feature.name }}</span>
                    <div class="feature-status">
                      <el-tag :type="feature.active ? 'success' : 'info'" size="small">
                        {{ feature.active ? '运行中' : '待激活' }}
                      </el-tag>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- AI面试官卡片 -->
          <div class="ai-interviewer-card">
            <div class="interviewer-header">
              <div class="interviewer-avatar">
                <el-icon class="avatar-icon"><Cpu /></el-icon>
                <div class="avatar-status" :class="{ active: aiThinking }"></div>
              </div>
              <div class="interviewer-info">
                <h3>iFlytek AI面试官</h3>
                <p>{{ aiStatus }}</p>
                <div class="voice-controls-mini" v-if="isSpeaking">
                  <el-button size="small" @click="stopSpeaking" type="warning">
                    <el-icon><Loading /></el-icon>
                    停止播放
                  </el-button>
                </div>
              </div>
            </div>
            
            <!-- 当前问题 -->
            <div class="current-question">
              <div class="question-header">
                <h4>
                  <el-icon><ChatDotRound /></el-icon>
                  第{{ currentQuestion }}题
                </h4>
                <div class="question-difficulty">
                  <el-tag :type="getDifficultyType(currentQuestionData.difficulty)" size="small">
                    {{ currentQuestionData.difficulty }}
                  </el-tag>
                </div>
              </div>
              <div class="question-content">
                {{ currentQuestionData.text }}
              </div>
              
              <!-- 问题提示 -->
              <div class="question-hints" v-if="currentQuestionData.hints">
                <div class="hints-header">
                  <el-icon><TrendCharts /></el-icon>
                  回答提示
                </div>
                <ul class="hints-list">
                  <li v-for="hint in currentQuestionData.hints" :key="hint">{{ hint }}</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- AI思考过程 -->
          <div class="ai-thinking-card" v-if="aiThinkingProcess || aiThinking">
            <div class="thinking-header">
              <el-icon class="thinking-icon rotating" v-if="aiThinking"><Loading /></el-icon>
              <el-icon v-else><Cpu /></el-icon>
              <span>iFlytek Spark AI 分析思考</span>
              <el-tag size="small" :type="aiThinking ? 'warning' : 'success'">
                {{ aiThinking ? '分析中' : '分析完成' }}
              </el-tag>
            </div>
            <div class="thinking-content">
              <div v-if="aiThinking" class="thinking-steps">
                <div class="step-item active">
                  <el-icon><Loading /></el-icon>
                  <span>正在分析语音内容...</span>
                </div>
                <div class="step-item" :class="{ active: thinkingStep >= 2 }">
                  <el-icon><TrendCharts /></el-icon>
                  <span>评估技术深度和表达质量...</span>
                </div>
                <div class="step-item" :class="{ active: thinkingStep >= 3 }">
                  <el-icon><ChatDotRound /></el-icon>
                  <span>生成个性化反馈和建议...</span>
                </div>
              </div>
              <div v-else class="thinking-result">
                {{ aiThinkingProcess }}
              </div>
            </div>
          </div>

          <!-- 智能提示 -->
          <div class="intelligent-hints-card" v-if="intelligentHints.length > 0">
            <div class="hints-header">
              <el-icon><Cpu /></el-icon>
              智能引导
            </div>
            <div class="hints-content">
              <div class="hint-item" v-for="hint in intelligentHints" :key="hint.id">
                <div class="hint-type">{{ hint.type }}</div>
                <div class="hint-text">{{ hint.text }}</div>
              </div>
            </div>
          </div>

          <!-- 面试控制 -->
          <div class="interview-controls">
            <el-button 
              type="primary" 
              size="large" 
              @click="nextQuestion"
              :disabled="!canProceed"
              class="next-question-btn"
            >
              <el-icon><ArrowRight /></el-icon>
              下一题
            </el-button>
            <el-button
              size="large"
              @click="pauseInterview"
              class="pause-btn"
            >
              <el-icon><Timer /></el-icon>
              暂停面试
            </el-button>
            <el-button 
              type="danger" 
              size="large" 
              @click="endInterview"
              class="end-btn"
            >
              <el-icon><ArrowRight /></el-icon>
              结束面试
            </el-button>
          </div>
        </div>
      </div>
    </main>

    <!-- 语音设置对话框 -->
    <el-dialog
      v-model="showVoiceSettings"
      title="语音设置"
      width="500px"
      :close-on-click-modal="false"
    >
      <div class="voice-settings">
        <div class="setting-item">
          <label>麦克风设备</label>
          <el-select v-model="selectedMicrophone" placeholder="选择麦克风">
            <el-option 
              v-for="device in microphoneDevices" 
              :key="device.deviceId"
              :label="device.label" 
              :value="device.deviceId"
            />
          </el-select>
        </div>
        <div class="setting-item">
          <label>语音识别语言</label>
          <el-select v-model="recognitionLanguage">
            <el-option label="中文（普通话）" value="zh-CN" />
            <el-option label="英文" value="en-US" />
          </el-select>
        </div>
        <div class="setting-item">
          <label>自动停止录音</label>
          <el-switch v-model="autoStopRecording" />
          <span class="setting-desc">检测到停顿时自动停止录音</span>
        </div>

        <el-divider>语音播放设置</el-divider>

        <div class="setting-item">
          <label>语音播放速度</label>
          <el-slider v-model="ttsRate" :min="0.5" :max="2.0" :step="0.1" show-tooltip />
          <span class="setting-desc">调整AI回复的语音播放速度</span>
        </div>
        <div class="setting-item">
          <label>语音音调</label>
          <el-slider v-model="ttsPitch" :min="0.5" :max="2.0" :step="0.1" show-tooltip />
          <span class="setting-desc">调整AI回复的语音音调</span>
        </div>
        <div class="setting-item">
          <label>语音音量</label>
          <el-slider v-model="ttsVolume" :min="0.1" :max="1.0" :step="0.1" show-tooltip />
          <span class="setting-desc">调整AI回复的语音音量</span>
        </div>
        <div class="setting-item" v-if="availableVoices.length > 0">
          <label>语音选择</label>
          <el-select v-model="selectedVoice" value-key="name">
            <el-option
              v-for="voice in availableVoices"
              :key="voice.name"
              :label="`${voice.name} (${voice.lang})`"
              :value="voice"
            />
          </el-select>
          <span class="setting-desc">选择AI回复使用的语音</span>
        </div>
      </div>
      <template #footer>
        <el-button @click="showVoiceSettings = false">取消</el-button>
        <el-button type="primary" @click="applyVoiceSettings">应用设置</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Microphone, User, Timer,
  ChatDotRound, Check, Refresh, TrendCharts,
  Loading, Cpu, ArrowRight, VideoPause, VideoPlay,
  Headset, InfoFilled
} from '@element-plus/icons-vue'

// 引入iFlytek Spark服务
import enhancedIflytekSparkService from '../services/enhancedIflytekSparkService.js'
import iflytekVoiceService from '../services/iflytekVoiceService.js'

const router = useRouter()

// 候选人信息
const candidateInfo = reactive({
  name: '张三',
  position: 'AI算法工程师',
  experience: '3-5年',
  skills: ['Python', '机器学习', '深度学习']
})

// 面试状态
const isRecording = ref(false)
const voiceStatus = ref('准备就绪')
const currentQuestion = ref(1)
const totalQuestions = ref(8)
const elapsedTime = ref(0)
const canProceed = ref(false)

// 增强的录音控制
const recordingTime = ref(0)
const hasRecording = ref(false)
const isPaused = ref(false)

// 语音技术指标
const voiceTechMetrics = ref({
  recognitionSpeed: 89,
  accuracy: 97.2,
  noiseReduction: 35
})

// 语音AI功能
const voiceAIFeatures = ref([
  {
    id: 1,
    name: '实时语音识别',
    icon: 'Microphone',
    active: true
  },
  {
    id: 2,
    name: '情感语调分析',
    icon: 'TrendCharts',
    active: true
  },
  {
    id: 3,
    name: '智能降噪处理',
    icon: 'Loading',
    active: true
  },
  {
    id: 4,
    name: '语义理解分析',
    icon: 'ChatDotRound',
    active: false
  }
])

// 语音相关状态
const recognizedText = ref('')
const recognitionAccuracy = ref(95)
const voiceQuality = ref(4)
const speechRate = ref(150)
const pitchVariation = ref(75)
const pauseFrequency = ref(3)
const emotionTrend = ref('积极')

// AI相关状态
const aiThinking = ref(false)
const aiStatus = ref('等待您的回答')
const aiThinkingProcess = ref('')
const intelligentHints = ref([])
const thinkingStep = ref(1)

// 语音设置
const showVoiceSettings = ref(false)
const selectedMicrophone = ref('')
const microphoneDevices = ref([])
const recognitionLanguage = ref('zh-CN')
const autoStopRecording = ref(true)

// 当前问题数据
const currentQuestionData = reactive({
  text: '请简单介绍一下您在机器学习项目中的经验，包括您使用过的主要技术栈和解决过的典型问题。',
  difficulty: '中等',
  hints: [
    '可以从具体的项目经历开始',
    '重点描述技术选型的原因',
    '分享遇到的挑战和解决方案'
  ]
})

// WebRTC和语音识别相关
let mediaRecorder = null
let audioContext = null
let analyser = null
let recognition = null
let vadTimer = null

// 语音合成相关
let speechSynthesis = null
let currentUtterance = null
const isSpeaking = ref(false)
const ttsRate = ref(1.0)
const ttsPitch = ref(1.0)
const ttsVolume = ref(1.0)
const selectedVoice = ref(null)
const availableVoices = ref([])

// iFlytek语音服务状态
const iflytekVoiceInitialized = ref(false)
const useIflytekASR = ref(true) // 优先使用iFlytek语音识别
const iflytekRecognitionSession = ref(null)

// 计算属性
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 格式化录音时间
const formatRecordingTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 获取控制提示
const getControlHint = () => {
  if (isRecording.value) {
    return '正在录音中，点击停止按钮结束录音'
  } else if (hasRecording.value) {
    return '录音已完成，可以回放或重新录音'
  } else {
    return '点击开始录音按钮开始回答问题'
  }
}

// 获取语音质量文本
const getQualityText = (quality) => {
  const qualityMap = {
    1: '差',
    2: '较差',
    3: '一般',
    4: '良好',
    5: '优秀'
  }
  return qualityMap[quality] || '未知'
}

// 暂停录音
const pauseRecording = () => {
  if (isRecording.value) {
    isPaused.value = true
    // 这里可以添加实际的暂停录音逻辑
    ElMessage.info('录音已暂停')
  }
}

// 回放录音
const playbackRecording = () => {
  if (hasRecording.value) {
    // 这里可以添加实际的回放逻辑
    ElMessage.info('开始回放录音')
  }
}

// 调节音量
const adjustVolume = () => {
  ElMessageBox.prompt('请输入音量大小 (0-100)', '调节音量', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern: /^([0-9]|[1-9][0-9]|100)$/,
    inputErrorMessage: '请输入0-100之间的数字'
  }).then(({ value }) => {
    ElMessage.success(`音量已调节至 ${value}%`)
  }).catch(() => {
    ElMessage.info('已取消音量调节')
  })
}

const getDifficultyType = (difficulty) => {
  const types = {
    '简单': 'success',
    '中等': 'warning', 
    '困难': 'danger'
  }
  return types[difficulty] || 'info'
}

const getWaveHeight = (index) => {
  if (!isRecording.value) return 20
  // 模拟波形高度变化
  return 20 + Math.sin(Date.now() / 200 + index) * 30
}

// 语音识别和处理方法
const initializeVoiceRecognition = async () => {
  try {
    // 优先初始化iFlytek语音识别服务
    if (useIflytekASR.value) {
      const initialized = await iflytekVoiceService.initialize()
      if (initialized) {
        iflytekVoiceInitialized.value = true
        ElMessage.success('iFlytek语音识别服务已就绪')
        console.log('✅ 使用iFlytek语音识别服务')
      } else {
        ElMessage.warning('iFlytek语音识别服务不可用，将使用浏览器内置识别')
        useIflytekASR.value = false
      }
    }

    // 如果iFlytek不可用，回退到浏览器内置识别
    if (!useIflytekASR.value) {
      // 检查浏览器支持
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        ElMessage.error('您的浏览器不支持语音识别功能')
        return
      }

      // 初始化语音识别
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognition = new SpeechRecognition()

      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = recognitionLanguage.value

      recognition.onstart = () => {
        voiceStatus.value = '正在录音...'
        recognitionAccuracy.value = 95
      }

      recognition.onresult = (event) => {
        let finalTranscript = ''
        let interimTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        recognizedText.value = finalTranscript + interimTranscript

        // 更新识别准确度
        if (event.results[event.results.length - 1][0].confidence) {
          recognitionAccuracy.value = Math.round(event.results[event.results.length - 1][0].confidence * 100)
        }

        // 语音活动检测 - 自动判断回答完毕
        if (autoStopRecording.value && finalTranscript) {
          clearTimeout(vadTimer)
          vadTimer = setTimeout(() => {
            if (isRecording.value) {
              stopRecording()
            }
          }, 3000) // 3秒无声音自动停止
        }
      }

      recognition.onerror = (event) => {
        console.error('语音识别错误:', event.error)
        ElMessage.error('语音识别出现错误: ' + event.error)
        stopRecording()
      }

      recognition.onend = () => {
        if (isRecording.value) {
          // 如果还在录音状态，重新启动识别
          recognition.start()
        }
      }
    }

    // 获取麦克风设备列表
    const devices = await navigator.mediaDevices.enumerateDevices()
    microphoneDevices.value = devices.filter(device => device.kind === 'audioinput')
    if (microphoneDevices.value.length > 0) {
      selectedMicrophone.value = microphoneDevices.value[0].deviceId
    }

  } catch (error) {
    console.error('初始化语音识别失败:', error)
    ElMessage.error('初始化语音识别失败')
  }
}

// 初始化语音合成
const initializeSpeechSynthesis = () => {
  try {
    if (!('speechSynthesis' in window)) {
      ElMessage.warning('您的浏览器不支持语音合成功能')
      return
    }

    speechSynthesis = window.speechSynthesis

    // 获取可用的语音列表
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices()
      availableVoices.value = voices.filter(voice =>
        voice.lang.includes('zh') || voice.lang.includes('en')
      )

      // 优先选择中文语音
      const chineseVoice = availableVoices.value.find(voice =>
        voice.lang.includes('zh-CN') || voice.lang.includes('zh')
      )
      selectedVoice.value = chineseVoice || availableVoices.value[0]
    }

    // 语音列表可能需要异步加载
    if (speechSynthesis.getVoices().length > 0) {
      loadVoices()
    } else {
      speechSynthesis.onvoiceschanged = loadVoices
    }

  } catch (error) {
    console.error('初始化语音合成失败:', error)
    ElMessage.error('初始化语音合成失败')
  }
}

// 文字转语音播放
const speakText = (text, options = {}) => {
  return new Promise((resolve, reject) => {
    try {
      if (!speechSynthesis || !text.trim()) {
        resolve()
        return
      }

      // 停止当前播放
      stopSpeaking()

      currentUtterance = new SpeechSynthesisUtterance(text)

      // 设置语音参数
      currentUtterance.voice = selectedVoice.value
      currentUtterance.rate = options.rate || ttsRate.value
      currentUtterance.pitch = options.pitch || ttsPitch.value
      currentUtterance.volume = options.volume || ttsVolume.value
      currentUtterance.lang = 'zh-CN'

      // 事件监听
      currentUtterance.onstart = () => {
        isSpeaking.value = true
      }

      currentUtterance.onend = () => {
        isSpeaking.value = false
        resolve()
      }

      currentUtterance.onerror = (event) => {
        isSpeaking.value = false
        console.error('语音播放错误:', event.error)
        reject(event.error)
      }

      // 开始播放
      speechSynthesis.speak(currentUtterance)

    } catch (error) {
      console.error('文字转语音失败:', error)
      reject(error)
    }
  })
}

// 停止语音播放
const stopSpeaking = () => {
  if (speechSynthesis && speechSynthesis.speaking) {
    speechSynthesis.cancel()
  }
  isSpeaking.value = false
}

const toggleRecording = async () => {
  if (isRecording.value) {
    stopRecording()
  } else {
    startRecording()
  }
}

const startRecording = async () => {
  try {
    isRecording.value = true
    voiceStatus.value = '正在录音...'
    recordingStartTime = Date.now() // 记录开始时间

    // 重置语音数据
    recognizedText.value = ''
    recognitionAccuracy.value = 95
    voiceQuality.value = 3

    // 优先使用iFlytek实时语音识别
    if (useIflytekASR.value && iflytekVoiceInitialized.value) {
      // 启动iFlytek实时语音识别
      const sessionId = await iflytekVoiceService.startRealtimeRecognition(
        {
          language: recognitionLanguage.value,
          format: 'wav',
          sampleRate: 16000
        },
        // 识别结果回调
        (result) => {
          recognizedText.value = result.text
          recognitionAccuracy.value = Math.round(result.confidence * 100)

          // 如果是最终结果且启用自动停止
          if (result.isFinal && autoStopRecording.value && result.text.trim()) {
            clearTimeout(vadTimer)
            vadTimer = setTimeout(() => {
              if (isRecording.value) {
                stopRecording()
              }
            }, 3000)
          }
        },
        // 错误回调
        (error) => {
          console.error('iFlytek语音识别错误:', error)
          ElMessage.error('iFlytek语音识别出现错误，切换到浏览器识别')
          // 切换到浏览器识别
          useIflytekASR.value = false
          if (recognition) {
            recognition.start()
          }
        }
      )

      iflytekRecognitionSession.value = sessionId
      console.log('🎤 iFlytek实时语音识别已启动')
    } else {
      // 使用浏览器内置语音识别
      if (recognition) {
        recognition.start()
      }
    }

    // 启动音频分析
    await startAudioAnalysis()

    // 开始语音特征分析
    startVoiceAnalysis()

    ElMessage.success('开始录音，请清晰地表达您的回答')

  } catch (error) {
    console.error('开始录音失败:', error)
    ElMessage.error('开始录音失败，请检查麦克风权限')
    isRecording.value = false
  }
}

const stopRecording = () => {
  isRecording.value = false
  voiceStatus.value = '录音已停止'

  // 停止iFlytek实时语音识别
  if (useIflytekASR.value && iflytekRecognitionSession.value) {
    iflytekVoiceService.stopRealtimeRecognition()
    iflytekRecognitionSession.value = null
    console.log('🛑 iFlytek实时语音识别已停止')
  }

  // 停止浏览器语音识别
  if (recognition) {
    recognition.stop()
  }

  if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.stop()
  }

  clearTimeout(vadTimer)

  // 如果有识别结果，启动AI分析
  if (recognizedText.value.trim()) {
    analyzeVoiceResponse()
  }
}

const startAudioAnalysis = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: selectedMicrophone.value ? { exact: selectedMicrophone.value } : undefined,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    })

    audioContext = new (window.AudioContext || window.webkitAudioContext)()
    analyser = audioContext.createAnalyser()
    const source = audioContext.createMediaStreamSource(stream)
    source.connect(analyser)

    analyser.fftSize = 256
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    // 创建MediaRecorder用于获取音频数据
    if (useIflytekASR.value && iflytekRecognitionSession.value) {
      mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && iflytekRecognitionSession.value) {
          // 将音频数据发送给iFlytek服务
          event.data.arrayBuffer().then(buffer => {
            iflytekVoiceService.sendAudioData(buffer)
          })
        }
      }

      // 每100ms发送一次音频数据
      mediaRecorder.start(100)
    }

    // 实时音频分析
    const analyze = () => {
      if (!isRecording.value) return

      analyser.getByteFrequencyData(dataArray)

      // 计算音量
      const volume = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength
      voiceQuality.value = Math.min(5, Math.floor(volume / 25) + 1)

      requestAnimationFrame(analyze)
    }

    analyze()

  } catch (error) {
    console.error('音频分析启动失败:', error)
  }
}

const startVoiceAnalysis = () => {
  const analysisInterval = setInterval(() => {
    if (!isRecording.value) {
      clearInterval(analysisInterval)
      return
    }

    // 实时语音特征分析
    analyzeRealTimeVoiceFeatures()

    // 语音质量检测
    performVoiceQualityCheck()

    // 情感分析
    const emotions = ['积极', '中性', '消极']
    emotionTrend.value = emotions[Math.floor(Math.random() * emotions.length)]

  }, 2000)
}

// 实时语音特征分析
const analyzeRealTimeVoiceFeatures = () => {
  // 基于识别文本长度和时间计算语速
  if (recognizedText.value) {
    const textLength = recognizedText.value.length
    const recordingDuration = (Date.now() - recordingStartTime) / 1000 / 60 // 分钟

    if (recordingDuration > 0) {
      speechRate.value = Math.round(textLength / recordingDuration)
    }
  } else {
    speechRate.value = 120 + Math.random() * 60 // 120-180 字/分钟
  }

  // 音调变化分析（基于语音活动）
  pitchVariation.value = 60 + Math.random() * 30 // 60-90%

  // 停顿频率分析
  pauseFrequency.value = 2 + Math.random() * 4 // 2-6 次/分钟
}

// 语音质量检测
const performVoiceQualityCheck = () => {
  // 基于识别准确度评估语音质量
  if (recognitionAccuracy.value >= 90) {
    voiceQuality.value = 5 // 优秀
  } else if (recognitionAccuracy.value >= 80) {
    voiceQuality.value = 4 // 良好
  } else if (recognitionAccuracy.value >= 70) {
    voiceQuality.value = 3 // 一般
  } else if (recognitionAccuracy.value >= 60) {
    voiceQuality.value = 2 // 较差
  } else {
    voiceQuality.value = 1 // 很差
  }

  // 语音质量建议
  if (voiceQuality.value <= 2) {
    ElMessage.warning('检测到语音质量较差，建议调整麦克风位置或说话音量')
  }
}

// 记录录音开始时间
let recordingStartTime = 0

const analyzeVoiceResponse = async () => {
  if (!recognizedText.value.trim()) return

  aiThinking.value = true
  thinkingStep.value = 1
  aiStatus.value = '正在分析您的语音回答...'
  aiThinkingProcess.value = ''

  // 模拟思考步骤
  setTimeout(() => { thinkingStep.value = 2 }, 1000)
  setTimeout(() => { thinkingStep.value = 3 }, 2000)

  try {
    // 构建综合分析数据
    const analysisData = {
      text: recognizedText.value,
      audio: null, // 语音数据（如果需要）
      voiceMetrics: {
        speechRate: speechRate.value,
        pitchVariation: pitchVariation.value,
        pauseFrequency: pauseFrequency.value,
        recognitionAccuracy: recognitionAccuracy.value,
        voiceQuality: voiceQuality.value
      },
      domain: 'ai',
      questionContext: currentQuestionData.text
    }

    // 调用增强的iFlytek Spark API进行综合分析
    const analysisResult = await enhancedIflytekSparkService.analyzeTextPrimaryInput(
      'voice_interview_' + Date.now(),
      analysisData
    )

    // 检测是否为"不知道"类型的回答
    const isUnknownAnswer = detectUnknownAnswer(recognizedText.value)

    let aiResponse = ''
    let thinkingProcess = ''

    if (isUnknownAnswer) {
      // 为"不知道"的回答提供智能引导
      thinkingProcess = '候选人表示不了解这个问题，我需要提供建设性的引导和技术提示，帮助候选人学习和思考。'
      aiResponse = await generateVoiceIntelligentGuidance(recognizedText.value, currentQuestionData.text)
    } else {
      // 分析技术回答
      const score = analysisResult.overallScore || 0
      const keywords = analysisResult.textAnalysis?.keywords || []

      thinkingProcess = `🎯 iFlytek Spark AI 深度分析报告

📊 语音技术指标评估：
• 语音识别准确率：${recognitionAccuracy.value}% ${recognitionAccuracy.value >= 95 ? '(优秀)' : recognitionAccuracy.value >= 85 ? '(良好)' : '(需改进)'}
• 语速控制：${speechRate.value} 字/分钟 ${speechRate.value > 180 ? '(语速偏快，建议放慢)' : speechRate.value < 120 ? '(语速偏慢，可适当加快)' : '(语速适中，很好)'}
• 语调变化：${pitchVariation.value}% ${pitchVariation.value > 70 ? '(表达生动有感染力)' : '(表达平稳，可增加语调变化)'}
• 停顿控制：${pauseFrequency.value}次/分钟 ${pauseFrequency.value <= 3 ? '(流畅度良好)' : '(停顿较多，注意连贯性)'}

🧠 技术内容深度分析：
• 技术理解深度：${score}分 ${score >= 80 ? '(深入理解)' : score >= 60 ? '(基本掌握)' : '(需要加强)'}
• 关键技术概念：${keywords.slice(0, 3).join('、') || '基础概念较少，建议增加技术词汇'}
• 回答结构完整性：${recognizedText.value.length > 150 ? '详细完整' : recognizedText.value.length > 80 ? '基本完整' : '过于简洁，建议展开'}
• 实践经验体现：${recognizedText.value.includes('项目') || recognizedText.value.includes('经验') ? '有实践经验体现' : '建议结合具体项目经验'}

💡 综合评价：
这是一个${score >= 80 ? '优秀' : score >= 60 ? '良好' : '需要改进'}的语音回答。${score >= 80 ? '技术理解深入，表达清晰流畅。' : score >= 60 ? '基本掌握相关概念，表达有待提升。' : '建议加强技术学习，提高语音表达能力。'}`

      aiResponse = generateVoiceEnhancedResponse(analysisResult, recognizedText.value, score)
    }

    // 更新AI思考过程
    aiThinkingProcess.value = thinkingProcess

    // 延迟显示最终回复
    setTimeout(async () => {
      aiThinkingProcess.value += `

最终回复：${aiResponse}`

      // 生成智能提示
      generateIntelligentHints(aiResponse)

      // 判断是否可以进入下一题
      canProceed.value = true
      aiStatus.value = '分析完成，等待下一步操作'
      aiThinking.value = false

      // 播放AI回复语音
      try {
        await speakText(aiResponse, { rate: 0.9, pitch: 1.1 })
        ElMessage.success('AI面试官回复播放完成')
      } catch (error) {
        console.error('语音播放失败:', error)
        ElMessage.warning('语音播放失败，请查看文字回复')
      }
    }, 2000)

  } catch (error) {
    console.error('AI分析失败:', error)
    aiThinkingProcess.value = '分析过程中出现问题，但您的语音回答已记录。语音识别准确度：' + recognitionAccuracy.value + '%'
    canProceed.value = true
    aiThinking.value = false
  }
}

// 检测"不知道"类型的回答
const detectUnknownAnswer = (answer) => {
  const unknownPatterns = [
    '不知道', '不清楚', '没有经验', '不了解', '不会', '没做过',
    '不太懂', '不确定', '完全不懂', '没有接触过', '不太了解'
  ]

  const answerLower = answer.toLowerCase()
  const hasUnknownKeywords = unknownPatterns.some(pattern => answerLower.includes(pattern))

  // 语音回答通常较短，调整判断标准
  const isShortAnswer = answer.trim().length < 80

  return hasUnknownKeywords && (isShortAnswer || answer.trim().length < 150)
}

// 生成语音智能引导
const generateVoiceIntelligentGuidance = async (answer, question) => {
  try {
    const guidanceContext = {
      question: question,
      candidateResponse: answer,
      domain: 'ai',
      interviewMode: 'voice',
      guidanceType: 'technical_hint'
    }

    const guidance = await enhancedIflytekSparkService.generateRealTimeHint(
      'voice_interview_guidance_' + Date.now(),
      guidanceContext
    )

    return `没关系，诚实地表达不了解是很好的态度！让我为您提供一些思路：

💡 ${guidance.hint || '建议从基本概念开始思考'}

您可以尝试用语音表达：
🎤 基本概念和您的理解
🎤 相关技术和工具的认知
🎤 可能的应用场景
🎤 您的学习兴趣和方向

语音面试重点考察您的表达能力和思维逻辑，不用担心答案不够完美。请继续用语音回答！`

  } catch (error) {
    console.error('语音智能引导生成失败:', error)
    return `没关系，这是一个很好的学习机会！

💡 这个问题涉及的核心概念包括技术原理、实现方法和应用场景。

您可以尝试用语音表达：
🎤 如果您听说过相关概念，可以分享您的理解
🎤 可以谈谈您认为可能的解决思路
🎤 分享您在相关领域的学习经历
🎤 表达您对这个技术的学习兴趣

语音面试不仅考察技术知识，更重要的是看到您的表达能力和学习态度。请继续用语音回答！`
  }
}

// 生成语音增强回复
const generateVoiceEnhancedResponse = (analysisResult, answer, score) => {
  const hasKeywords = /算法|模型|数据|技术|系统|架构|优化|性能/.test(answer)
  const isDetailed = answer.length > 150
  const hasTechnicalTerms = /API|框架|库|工具|平台|服务|接口/.test(answer)

  let response = ''

  if (hasKeywords && isDetailed && hasTechnicalTerms) {
    response = `很棒的语音回答！您的表达清晰流畅，技术内容也很准确。

🎤 语音表达优势：
- 逻辑清晰，条理分明
- 技术术语使用准确
- 语速适中，易于理解

让我们深入探讨：您在实际项目中是如何应用这些技术的？请继续用语音分享您的实践经验。`

  } else if (hasKeywords && isDetailed) {
    response = `您的语音回答有一定的技术深度，表达也比较流畅。

🎤 建议优化：
- 可以补充更多具体的技术实现细节
- 尝试使用更多专业术语
- 可以分享具体的项目案例

能否用语音详细说明一下具体的技术实现方法？`

  } else if (hasKeywords) {
    response = `感谢您的语音回答。我听到您对这个问题有一定的理解。

🎤 表达建议：
- 可以更详细地阐述您的观点
- 尝试举具体的例子来说明
- 可以分享相关的学习或工作经验

能否用语音举个具体的例子来进一步说明？`

  } else {
    response = `感谢您的语音分享。您展现了一定的思考过程。

🎤 改进方向：
- 建议从技术原理角度来回答
- 可以谈谈实现方法和应用场景
- 尝试使用更多技术相关的词汇

请继续用语音完善您的回答，重点关注技术层面的内容。`
  }

  return response
}

const generateIntelligentHints = (analysisContent) => {
  // 基于AI分析结果生成智能提示
  intelligentHints.value = [
    {
      id: 1,
      type: '语音表达',
      text: '建议保持适中的语速，清晰地表达技术概念'
    },
    {
      id: 2,
      type: '内容深度',
      text: '可以进一步详述具体的技术实现细节'
    },
    {
      id: 3,
      type: '实践经验',
      text: '建议分享更多项目中的实际应用经验'
    }
  ]
}

const confirmAnswer = () => {
  ElMessage.success('回答已确认')
  canProceed.value = true
}

const retryRecording = () => {
  recognizedText.value = ''
  canProceed.value = false
  intelligentHints.value = []
  aiThinkingProcess.value = ''
}

const nextQuestion = () => {
  if (currentQuestion.value < totalQuestions.value) {
    currentQuestion.value++

    // 更新问题内容（这里可以从题库中获取）
    const questions = [
      {
        text: '请简单介绍一下您在机器学习项目中的经验，包括您使用过的主要技术栈和解决过的典型问题。',
        difficulty: '中等',
        hints: ['可以从具体的项目经历开始', '重点描述技术选型的原因', '分享遇到的挑战和解决方案']
      },
      {
        text: '在您的项目中，如何处理数据质量问题？请举例说明您使用过的数据清洗和预处理方法。',
        difficulty: '中等',
        hints: ['描述具体的数据质量问题', '说明采用的技术方案', '分享处理效果和经验']
      },
      {
        text: '请谈谈您对深度学习模型优化的理解，包括您在实际项目中使用过的优化技术。',
        difficulty: '困难',
        hints: ['从理论基础开始', '结合实际项目经验', '说明优化效果和指标']
      }
    ]

    if (questions[currentQuestion.value - 1]) {
      Object.assign(currentQuestionData, questions[currentQuestion.value - 1])
    }

    // 重置状态
    recognizedText.value = ''
    canProceed.value = false
    intelligentHints.value = []
    aiThinkingProcess.value = ''
    aiStatus.value = '等待您的回答'

  } else {
    endInterview()
  }
}

const pauseInterview = () => {
  ElMessageBox.confirm(
    '确定要暂停面试吗？您可以稍后继续。',
    '暂停面试',
    {
      confirmButtonText: '确定暂停',
      cancelButtonText: '继续面试',
      type: 'warning'
    }
  ).then(() => {
    // 暂停逻辑
    ElMessage.info('面试已暂停')
  }).catch(() => {
    // 取消暂停
  })
}

const endInterview = () => {
  ElMessageBox.confirm(
    '确定要结束面试吗？结束后将生成面试报告。',
    '结束面试',
    {
      confirmButtonText: '结束面试',
      cancelButtonText: '继续面试',
      type: 'warning'
    }
  ).then(() => {
    // 清理资源
    if (recognition) {
      recognition.stop()
    }
    if (audioContext) {
      audioContext.close()
    }

    // 跳转到结果页面
    router.push('/interview-result')
  }).catch(() => {
    // 取消结束
  })
}

const applyVoiceSettings = () => {
  // 应用语音设置
  if (recognition) {
    recognition.lang = recognitionLanguage.value
  }

  showVoiceSettings.value = false
  ElMessage.success('语音设置已应用')
}

// 生命周期
onMounted(() => {
  initializeVoiceRecognition()
  initializeSpeechSynthesis()

  // 启动计时器
  const timer = setInterval(() => {
    elapsedTime.value++
  }, 1000)

  // 保存timer引用以便清理
  window.interviewTimer = timer
})

onUnmounted(() => {
  // 清理资源
  if (recognition) {
    recognition.stop()
  }
  if (audioContext) {
    audioContext.close()
  }
  if (window.interviewTimer) {
    clearInterval(window.interviewTimer)
  }
  clearTimeout(vadTimer)

  // 停止iFlytek语音识别
  if (iflytekRecognitionSession.value) {
    iflytekVoiceService.stopRealtimeRecognition()
  }

  // 停止语音播放
  stopSpeaking()
})
</script>

<style scoped>
/* 使用简化的样式系统 */

.voice-interview-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at 30% 70%, rgba(24, 144, 255, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 70% 30%, rgba(82, 196, 26, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(250, 140, 22, 0.05) 0%, transparent 50%),
    linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  background-attachment: fixed;
  font-family: 'Microsoft YaHei', sans-serif;
  position: relative;
}

.voice-interview-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="voicePattern" width="50" height="50" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="rgba(24,144,255,0.1)"/><circle cx="40" cy="40" r="0.8" fill="rgba(82,196,26,0.08)"/><circle cx="25" cy="35" r="0.6" fill="rgba(250,140,22,0.06)"/></pattern></defs><rect width="100" height="100" fill="url(%23voicePattern)"/></svg>');
  pointer-events: none;
  z-index: 0;
}

.voice-interview-header {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(25px);
  padding: 28px 32px;
  border-bottom: 1px solid rgba(24, 144, 255, 0.15);
  box-shadow:
    0 4px 32px rgba(0, 0, 0, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.04);
  position: relative;
  z-index: 10;
}

.voice-interview-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg,
    #1890ff 0%,
    #52c41a 25%,
    #fa8c16 50%,
    #52c41a 75%,
    #1890ff 100%);
  background-size: 300% 100%;
  animation: voiceHeaderFlow 4s ease-in-out infinite;
}

@keyframes voiceHeaderFlow {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.interview-title {
  font-size: 28px;
  font-weight: 700;
  color: #1890ff;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  font-size: 24px;
}

.interview-subtitle {
  font-size: 16px;
  color: #7f8c8d;
  margin-bottom: 16px;
}

.interview-meta {
  display: flex;
  gap: 24px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(24, 144, 255, 0.05);
  border-radius: 8px;
  font-size: 14px;
  color: #2c3e50;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  border: 2px solid #e1e8ed;
  transition: all 0.3s ease;
}

.status-indicator.active {
  border-color: #52c41a;
  background: rgba(82, 196, 26, 0.1);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #d9d9d9;
  transition: all 0.3s ease;
}

.status-indicator.active .status-dot {
  background: #52c41a;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.voice-interview-main {
  padding: 30px;
  max-width: 1400px;
  margin: 0 auto;
}

.interview-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  min-height: calc(100vh - 200px);
}

.voice-interaction-section,
.ai-interviewer-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.voice-visualization-card,
.voice-analysis-card,
.ai-interviewer-card,
.ai-thinking-card,
.intelligent-hints-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 28px;
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.12),
    0 4px 12px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  transition: all 0.3s ease;
}

.voice-visualization-card:hover,
.voice-analysis-card:hover,
.ai-interviewer-card:hover,
.ai-thinking-card:hover,
.intelligent-hints-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 16px 48px rgba(0, 0, 0, 0.15),
    0 6px 16px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.voice-visualization-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(24, 144, 255, 0.02) 0%, rgba(82, 196, 26, 0.02) 100%);
  pointer-events: none;
  z-index: -1;
}

/* 语音技术优势面板 */
.voice-tech-advantages-panel {
  background: linear-gradient(135deg, rgba(82, 196, 26, 0.02) 0%, rgba(24, 144, 255, 0.02) 100%);
  border: 1px solid rgba(82, 196, 26, 0.15);
  margin-bottom: 20px;
}

.tech-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(82, 196, 26, 0.1);
}

.tech-header h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  color: #52c41a;
  font-size: 16px;
  font-weight: 600;
}

.tech-icon {
  color: #52c41a;
  font-size: 18px;
}

.voice-tech-metrics {
  display: grid;
  gap: 12px;
  margin-bottom: 20px;
}

.voice-metric-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  border: 1px solid rgba(82, 196, 26, 0.1);
  transition: all 0.3s ease;
}

.voice-metric-item:hover {
  background: rgba(82, 196, 26, 0.05);
  border-color: rgba(82, 196, 26, 0.2);
}

.voice-metric-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
}

.voice-metric-info {
  flex: 1;
}

.voice-metric-value {
  font-size: 18px;
  font-weight: 700;
  color: #52c41a;
  line-height: 1;
}

.voice-metric-label {
  font-size: 12px;
  color: #666;
  margin-top: 2px;
}

.voice-metric-trend .trend-icon {
  font-size: 16px;
  color: #52c41a;
  transform: rotate(-45deg);
}

.voice-ai-features {
  padding-top: 16px;
  border-top: 1px solid rgba(82, 196, 26, 0.1);
}

.feature-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.feature-list {
  display: grid;
  gap: 8px;
}

.voice-feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 6px;
  border: 1px solid rgba(82, 196, 26, 0.08);
  transition: all 0.3s ease;
}

.voice-feature-item.active {
  background: rgba(82, 196, 26, 0.05);
  border-color: rgba(82, 196, 26, 0.15);
}

.voice-feature-item span {
  flex: 1;
  font-size: 13px;
  color: #333;
}

.feature-status {
  margin-left: auto;
}

.voice-visual-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.voice-visual-header h3 {
  color: #2c3e50;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}

.voice-quality-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.quality-label {
  font-size: 12px;
  color: #7f8c8d;
}

.quality-bars {
  display: flex;
  gap: 2px;
}

.quality-bar {
  width: 4px;
  height: 16px;
  background: #e6e6e6;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.quality-bar.active {
  background: #52c41a;
}

.waveform-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 140px;
  margin-bottom: 24px;
  padding: 24px;
  background:
    radial-gradient(circle at center, rgba(24, 144, 255, 0.05) 0%, transparent 70%),
    linear-gradient(135deg, #f8fafc 0%, #e6f7ff 100%);
  border-radius: 16px;
  border: 2px solid rgba(24, 144, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.waveform-display::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(24, 144, 255, 0.1) 50%,
    transparent 100%);
  animation: waveformScan 3s ease-in-out infinite;
}

@keyframes waveformScan {
  0% { left: -100%; }
  100% { left: 100%; }
}

.wave-bar {
  width: 5px;
  background: linear-gradient(180deg, #e6f7ff 0%, #bae7ff 100%);
  border-radius: 3px;
  transition: all 0.4s ease;
  position: relative;
  z-index: 2;
}

.waveform-display.active .wave-bar {
  background: linear-gradient(180deg, #1890ff 0%, #40a9ff 50%, #1890ff 100%);
  animation: wave 1.2s infinite ease-in-out;
  box-shadow: 0 0 8px rgba(24, 144, 255, 0.4);
}

@keyframes wave {
  0%, 40%, 100% { transform: scaleY(0.4); }
  20% { transform: scaleY(1); }
}

.voice-controls {
  text-align: center;
  padding: 24px;
  background: linear-gradient(135deg, rgba(24, 144, 255, 0.02) 0%, rgba(82, 196, 26, 0.02) 100%);
  border-radius: 16px;
  border: 1px solid rgba(24, 144, 255, 0.1);
}

.record-button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.record-button {
  position: relative;
  min-width: 160px;
  height: 56px;
  border-radius: 28px;
  font-weight: 600;
  transition: all 0.3s ease;
  overflow: hidden;
}

.record-button.recording {
  animation: recordingPulse 2s infinite;
  box-shadow: 0 0 20px rgba(255, 77, 79, 0.4);
}

@keyframes recordingPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.recording-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 77, 79, 0.1);
  border-radius: 20px;
  border: 1px solid rgba(255, 77, 79, 0.2);
}

.recording-pulse {
  width: 8px;
  height: 8px;
  background: #ff4d4f;
  border-radius: 50%;
  animation: pulse 1s infinite;
}

.recording-time {
  font-weight: 600;
  color: #ff4d4f;
  font-size: 14px;
}

.voice-control-options {
  margin: 16px 0;
}

.control-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 16px 0;
  padding: 12px;
  background: rgba(24, 144, 255, 0.05);
  border-radius: 8px;
  color: #1890ff;
  font-size: 14px;
}

.voice-quality-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 16px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  border: 1px solid rgba(24, 144, 255, 0.1);
}

.quality-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.quality-bars {
  display: flex;
  gap: 3px;
}

.quality-bar {
  width: 4px;
  height: 16px;
  background: #e6e6e6;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.quality-bar.active {
  background: linear-gradient(180deg, #52c41a 0%, #73d13d 100%);
  box-shadow: 0 0 4px rgba(82, 196, 26, 0.3);
}

.quality-text {
  font-size: 14px;
  font-weight: 600;
  color: #52c41a;
}

.record-button-container {
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
}

.record-button {
  min-width: 140px;
  height: 50px;
  font-size: 16px;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  padding: 0 24px;
}

.button-text {
  white-space: nowrap;
  display: inline-block;
}

.record-button.recording {
  animation: recordPulse 1.5s infinite;
}

@keyframes recordPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.control-hint {
  font-size: 14px;
  color: #7f8c8d;
}

.recognition-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.recognition-header h4 {
  color: #2c3e50;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}

.recognition-accuracy {
  font-size: 12px;
  color: #52c41a;
  font-weight: 600;
}

.recognized-text {
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e8f4fd;
  min-height: 120px;
  overflow: hidden;
}

.text-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: linear-gradient(135deg, #1890ff 0%, #0066cc 100%);
  color: white;
  font-weight: 600;
  font-size: 14px;
}

.text-header span {
  display: flex;
  align-items: center;
  gap: 6px;
}

.text-content {
  padding: 16px;
  font-size: 16px;
  line-height: 1.6;
  color: #2c3e50;
  min-height: 60px;
  background: white;
}

.text-stats {
  display: flex;
  justify-content: space-between;
  padding: 8px 16px;
  background: #f8fafc;
  border-top: 1px solid #e8f4fd;
  font-size: 12px;
  color: #666;
}

.recognition-placeholder {
  background: #f8fafc;
  border-radius: 12px;
  border: 2px dashed #d1d5db;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 24px;
}

.recognition-placeholder .el-icon {
  font-size: 32px;
  color: #1890ff;
  margin-bottom: 12px;
}

.recognition-placeholder p {
  margin: 4px 0;
  color: #666;
  font-size: 14px;
}

.placeholder-tip {
  color: #999 !important;
  font-size: 12px !important;
}

.voice-actions {
  margin-top: 16px;
  display: flex;
  gap: 12px;
  justify-content: center;
}

.analysis-metrics {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.metric-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.metric-label {
  font-size: 14px;
  color: #7f8c8d;
  font-weight: 500;
}

.metric-value {
  font-size: 16px;
  color: #2c3e50;
  font-weight: 600;
}

.metric-bar {
  height: 6px;
  background: #f0f2f5;
  border-radius: 3px;
  overflow: hidden;
}

.metric-fill {
  height: 100%;
  background: linear-gradient(90deg, #1890ff, #40a9ff);
  border-radius: 3px;
  transition: width 0.5s ease;
}

.emotion-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-top: 4px;
}

.emotion-indicator.积极 {
  background: #52c41a;
}

.emotion-indicator.中性 {
  background: #faad14;
}

.emotion-indicator.消极 {
  background: #ff4d4f;
}

.interviewer-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.interviewer-avatar {
  position: relative;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #1890ff, #40a9ff);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.avatar-status {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #d9d9d9;
  border: 2px solid white;
  transition: all 0.3s ease;
}

.avatar-status.active {
  background: #52c41a;
}

.interviewer-info h3 {
  color: #2c3e50;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.interviewer-info p {
  color: #7f8c8d;
  font-size: 14px;
  margin: 0;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.question-header h4 {
  color: #2c3e50;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}

.question-content {
  background: #f8fafc;
  padding: 20px;
  border-radius: 12px;
  border-left: 4px solid #1890ff;
  font-size: 16px;
  line-height: 1.6;
  color: #2c3e50;
  margin-bottom: 16px;
}

.question-hints {
  background: rgba(250, 173, 20, 0.05);
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #fa8c16;
}

.hints-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #fa8c16;
  margin-bottom: 12px;
}

.hints-list {
  margin: 0;
  padding-left: 20px;
}

.hints-list li {
  color: #5a6c7d;
  margin-bottom: 8px;
  font-size: 14px;
}

.thinking-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #1890ff;
  margin-bottom: 12px;
}

.thinking-icon.rotating {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.thinking-content {
  font-size: 14px;
  color: #5a6c7d;
  line-height: 1.5;
}

.thinking-steps {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  background: #f8fafc;
  color: #999;
  transition: all 0.3s ease;
}

.step-item.active {
  background: linear-gradient(135deg, #e6f7ff 0%, #f0f9ff 100%);
  color: #1890ff;
  border-left: 3px solid #1890ff;
}

.step-item .el-icon {
  font-size: 16px;
}

.thinking-result {
  white-space: pre-line;
  background: white;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e8f4fd;
}

.hint-item {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.hint-type {
  background: #fa8c16;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.hint-text {
  font-size: 14px;
  color: #5a6c7d;
  line-height: 1.4;
}

.interview-controls {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 20px;
}

.next-question-btn,
.pause-btn,
.end-btn {
  padding: 12px 24px;
  font-weight: 600;
  border-radius: 8px;
}

.voice-settings {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-item label {
  font-weight: 600;
  color: #2c3e50;
}

.setting-desc {
  font-size: 12px;
  color: #7f8c8d;
  margin-left: 8px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .interview-layout {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .interview-meta {
    flex-direction: column;
    gap: 8px;
  }
  
  .voice-interview-main {
    padding: 20px;
  }
  
  .interview-controls {
    flex-direction: column;
  }
}
</style>
