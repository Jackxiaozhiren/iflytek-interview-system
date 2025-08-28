<template>
  <div class="voice-analysis-demo">
    <div class="demo-header">
      <h4>iFlytek语音分析实时演示</h4>
      <div class="demo-controls">
        <el-button
          type="primary"
          :icon="isRecording ? VideoPause : Microphone"
          @click="toggleRecording"
          :loading="isProcessing"
        >
          {{ isRecording ? '停止录音' : '开始录音' }}
        </el-button>
      </div>
    </div>

    <div class="demo-content">
      <!-- 音频波形显示 -->
      <div class="waveform-container">
        <div class="waveform-title">音频波形</div>
        <div class="waveform-display">
          <div 
            class="wave-bar" 
            v-for="(height, index) in waveformData" 
            :key="index"
            :style="{ height: height + '%' }"
            :class="{ 'active': isRecording }"
          ></div>
        </div>
      </div>

      <!-- 实时转写结果 -->
      <div class="transcription-container">
        <div class="transcription-title">实时语音转写</div>
        <div class="transcription-text">
          {{ transcriptionText || '点击开始录音按钮开始语音识别...' }}
        </div>
        <div class="transcription-confidence" v-if="confidence">
          识别置信度: <span class="confidence-value">{{ confidence }}%</span>
        </div>
      </div>

      <!-- 情感分析结果 -->
      <div class="emotion-analysis">
        <div class="analysis-title">情感分析</div>
        <div class="emotion-grid">
          <div 
            class="emotion-item" 
            v-for="emotion in emotionData" 
            :key="emotion.name"
          >
            <div class="emotion-name">{{ emotion.name }}</div>
            <div class="emotion-bar">
              <div 
                class="emotion-fill" 
                :style="{ width: emotion.value + '%', backgroundColor: emotion.color }"
              ></div>
            </div>
            <div class="emotion-value">{{ emotion.value }}%</div>
          </div>
        </div>
      </div>

      <!-- 语音特征分析 -->
      <div class="voice-features">
        <div class="analysis-title">语音特征</div>
        <div class="features-grid">
          <div class="feature-card" v-for="feature in voiceFeatures" :key="feature.name">
            <div class="feature-icon">
              <el-icon><component :is="feature.icon" /></el-icon>
            </div>
            <div class="feature-content">
              <div class="feature-name">{{ feature.name }}</div>
              <div class="feature-value">{{ feature.value }}</div>
              <div class="feature-status" :class="feature.status">{{ feature.description }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Microphone, VideoPause, TrendCharts, Timer, Promotion } from '@element-plus/icons-vue'

const isRecording = ref(false)
const isProcessing = ref(false)
const transcriptionText = ref('')
const confidence = ref(0)
const waveformData = ref(Array(50).fill(0).map(() => Math.random() * 100))
const waveformInterval = ref(null)

const emotionData = ref([
  { name: '积极', value: 75, color: '#52c41a' },
  { name: '自信', value: 68, color: '#1890ff' },
  { name: '紧张', value: 25, color: '#faad14' },
  { name: '焦虑', value: 15, color: '#ff4d4f' },
  { name: '平静', value: 80, color: '#722ed1' }
])

const voiceFeatures = ref([
  {
    name: '语速',
    value: '150 字/分钟',
    description: '适中',
    status: 'good',
    icon: 'Timer'
  },
  {
    name: '音量',
    value: '65 dB',
    description: '清晰',
    status: 'good',
    icon: 'Promotion'
  },
  {
    name: '流畅度',
    value: '92%',
    description: '优秀',
    status: 'excellent',
    icon: 'TrendCharts'
  },
  {
    name: '停顿频率',
    value: '2.3 次/分钟',
    description: '正常',
    status: 'good',
    icon: 'Timer'
  }
])

const demoTexts = [
  '我对这个职位非常感兴趣，因为它与我的专业背景高度匹配。',
  '在之前的工作中，我积累了丰富的项目管理经验。',
  '我相信我的技能和经验能够为公司带来价值。',
  '我希望能够在这个平台上继续学习和成长。'
]

const toggleRecording = () => {
  if (isRecording.value) {
    stopRecording()
  } else {
    startRecording()
  }
}

const startRecording = () => {
  isRecording.value = true
  isProcessing.value = true
  
  // 模拟录音过程
  setTimeout(() => {
    isProcessing.value = false
    simulateTranscription()
  }, 1000)
  
  // 开始波形动画
  startWaveformAnimation()
}

const stopRecording = () => {
  isRecording.value = false
  stopWaveformAnimation()
  
  // 模拟最终处理
  isProcessing.value = true
  setTimeout(() => {
    isProcessing.value = false
    updateEmotionAnalysis()
  }, 500)
}

const simulateTranscription = () => {
  const randomText = demoTexts[Math.floor(Math.random() * demoTexts.length)]
  let currentText = ''
  let index = 0
  
  const typeInterval = setInterval(() => {
    if (index < randomText.length) {
      currentText += randomText[index]
      transcriptionText.value = currentText
      confidence.value = Math.min(95, 60 + (index / randomText.length) * 35)
      index++
    } else {
      clearInterval(typeInterval)
    }
  }, 100)
}

const startWaveformAnimation = () => {
  waveformInterval.value = setInterval(() => {
    waveformData.value = waveformData.value.map(() => 
      Math.random() * (isRecording.value ? 100 : 20)
    )
  }, 100)
}

const stopWaveformAnimation = () => {
  if (waveformInterval.value) {
    clearInterval(waveformInterval.value)
    waveformInterval.value = null
  }
}

const updateEmotionAnalysis = () => {
  emotionData.value = emotionData.value.map(emotion => ({
    ...emotion,
    value: Math.max(5, Math.min(95, emotion.value + (Math.random() - 0.5) * 20))
  }))
}

onMounted(() => {
  // 初始化波形动画
  startWaveformAnimation()
})

onUnmounted(() => {
  stopWaveformAnimation()
})
</script>

<style scoped>
.voice-analysis-demo {
  padding: 24px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.demo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.demo-header h4 {
  margin: 0;
  color: #1a202c;
  font-size: 1.2rem;
}

.demo-content {
  display: grid;
  gap: 24px;
}

/* 波形显示 */
.waveform-container {
  background: #f8fafc;
  padding: 20px;
  border-radius: 8px;
}

.waveform-title {
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 16px;
}

.waveform-display {
  display: flex;
  align-items: end;
  gap: 2px;
  height: 80px;
  background: #1a202c;
  border-radius: 4px;
  padding: 8px;
}

.wave-bar {
  flex: 1;
  background: #64748b;
  border-radius: 1px;
  transition: all 0.1s ease;
  min-height: 2px;
}

.wave-bar.active {
  background: #1890ff;
}

/* 转写结果 */
.transcription-container {
  background: #f0f9ff;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #1890ff;
}

.transcription-title {
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 12px;
}

.transcription-text {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #1a202c;
  min-height: 60px;
  margin-bottom: 12px;
}

.transcription-confidence {
  font-size: 0.9rem;
  color: #64748b;
}

.confidence-value {
  font-weight: 600;
  color: #1890ff;
}

/* 情感分析 */
.emotion-analysis {
  background: #fef7f0;
  padding: 20px;
  border-radius: 8px;
}

.analysis-title {
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 16px;
}

.emotion-grid {
  display: grid;
  gap: 12px;
}

.emotion-item {
  display: grid;
  grid-template-columns: 80px 1fr 60px;
  align-items: center;
  gap: 12px;
}

.emotion-name {
  font-size: 0.9rem;
  color: #64748b;
}

.emotion-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.emotion-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.emotion-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1a202c;
  text-align: right;
}

/* 语音特征 */
.voice-features {
  background: #f0fdf4;
  padding: 20px;
  border-radius: 8px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.feature-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  width: 40px;
  height: 40px;
  background: #e2e8f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1890ff;
}

.feature-content {
  flex: 1;
}

.feature-name {
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 4px;
}

.feature-value {
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 4px;
}

.feature-status {
  font-size: 0.8rem;
  padding: 2px 8px;
  border-radius: 12px;
  display: inline-block;
}

.feature-status.excellent {
  background: #dcfce7;
  color: #166534;
}

.feature-status.good {
  background: #dbeafe;
  color: #1e40af;
}

.feature-status.normal {
  background: #fef3c7;
  color: #92400e;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .demo-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .emotion-item {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
