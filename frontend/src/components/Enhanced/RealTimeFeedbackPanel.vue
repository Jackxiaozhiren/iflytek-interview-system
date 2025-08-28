<template>
  <div class="realtime-feedback-panel">
    <!-- 面试猫风格的实时反馈头部 -->
    <div class="feedback-header">
      <div class="header-left">
        <el-icon class="feedback-icon"><TrendCharts /></el-icon>
        <h3 class="panel-title">AI实时反馈</h3>
        <el-tag :type="feedbackStatus.type" size="small" class="status-tag">
          {{ feedbackStatus.text }}
        </el-tag>
      </div>
      <div class="header-right">
        <el-button 
          size="small" 
          :type="isRealTimeFeedbackEnabled ? 'primary' : 'default'"
          @click="toggleRealTimeFeedback"
        >
          <el-icon><component :is="isRealTimeFeedbackEnabled ? 'VideoPause' : 'VideoPlay'" /></el-icon>
          {{ isRealTimeFeedbackEnabled ? '暂停反馈' : '启动反馈' }}
        </el-button>
      </div>
    </div>

    <!-- 实时评估指标卡片 -->
    <div class="feedback-metrics">
      <div class="metrics-grid">
        <div 
          v-for="metric in realTimeMetrics" 
          :key="metric.id"
          class="metric-card"
          :class="getMetricLevelClass(metric.score)"
        >
          <div class="metric-header">
            <el-icon class="metric-icon">
              <component :is="metric.icon" />
            </el-icon>
            <span class="metric-name">{{ metric.name }}</span>
            <div class="metric-trend" :class="metric.trend">
              <el-icon>
                <component :is="getTrendIcon(metric.trend)" />
              </el-icon>
            </div>
          </div>
          <div class="metric-value">
            <span class="score-number">{{ metric.score }}</span>
            <span class="score-unit">分</span>
          </div>
          <div class="metric-progress">
            <el-progress 
              :percentage="metric.score" 
              :color="getScoreColor(metric.score)"
              :stroke-width="6"
              :show-text="false"
            />
          </div>
          <div class="metric-feedback">{{ metric.feedback }}</div>
        </div>
      </div>
    </div>

    <!-- 智能建议区域 -->
    <div class="intelligent-suggestions">
      <div class="suggestions-header">
        <el-icon><Star /></el-icon>
        <span>智能建议</span>
        <el-tag size="small" type="info">实时更新</el-tag>
      </div>
      <div class="suggestions-list">
        <div 
          v-for="suggestion in currentSuggestions" 
          :key="suggestion.id"
          class="suggestion-item"
          :class="suggestion.priority"
        >
          <div class="suggestion-icon">
            <el-icon>
              <component :is="getSuggestionIcon(suggestion.type)" />
            </el-icon>
          </div>
          <div class="suggestion-content">
            <div class="suggestion-title">{{ suggestion.title }}</div>
            <div class="suggestion-text">{{ suggestion.text }}</div>
          </div>
          <div class="suggestion-action">
            <el-button size="small" text @click="applySuggestion(suggestion)">
              应用
            </el-button>
          </div>
        </div>
      </div>
    </div>



    <!-- 面试进度和时间管理 -->
    <div class="interview-progress-section">
      <div class="section-header">
        <el-icon><Clock /></el-icon>
        <span>面试进度</span>
      </div>
      <div class="progress-content">
        <div class="progress-stats">
          <div class="stat-item">
            <span class="stat-label">当前题目</span>
            <span class="stat-value">{{ currentQuestion }}/{{ totalQuestions }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">已用时间</span>
            <span class="stat-value">{{ formatTime(elapsedTime) }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">预计剩余</span>
            <span class="stat-value">{{ estimatedTimeLeft }}</span>
          </div>
        </div>
        <div class="progress-bar-container">
          <el-progress 
            :percentage="progressPercentage" 
            :stroke-width="8"
            :color="progressColor"
          />
        </div>
      </div>
    </div>

    <!-- 快速操作按钮 -->
    <div class="quick-actions">
      <el-button 
        v-for="action in quickActions" 
        :key="action.id"
        :type="action.type"
        size="small"
        @click="executeQuickAction(action)"
      >
        <el-icon><component :is="action.icon" /></el-icon>
        {{ action.label }}
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  TrendCharts, VideoPlay, VideoPause, Star, Microphone, Clock,
  ArrowUp, ArrowDown, Minus, Check, Warning, InfoFilled,
  Refresh, Document, Setting
} from '@element-plus/icons-vue'

// Props
const props = defineProps({
  isActive: {
    type: Boolean,
    default: true
  },
  currentQuestion: {
    type: Number,
    default: 1
  },
  totalQuestions: {
    type: Number,
    default: 10
  },
  elapsedTime: {
    type: Number,
    default: 0
  }
})

// Emits
const emit = defineEmits(['toggle-feedback', 'apply-suggestion', 'quick-action'])

// 响应式数据
const isRealTimeFeedbackEnabled = ref(true)
const showVoiceAnalysis = ref(false) // 语音分析已禁用

// 实时评估指标
const realTimeMetrics = ref([
  {
    id: 'communication',
    name: '沟通表达',
    score: 85,
    trend: 'up',
    icon: 'ChatDotRound',
    feedback: '表达清晰，语速适中'
  },
  {
    id: 'technical',
    name: '技术深度',
    score: 92,
    trend: 'up',
    icon: 'Cpu',
    feedback: '技术理解深入，回答专业'
  },
  {
    id: 'logic',
    name: '逻辑思维',
    score: 88,
    trend: 'stable',
    icon: 'Grid',
    feedback: '逻辑清晰，结构完整'
  },
  {
    id: 'confidence',
    name: '自信度',
    score: 79,
    trend: 'down',
    icon: 'User',
    feedback: '可以更加自信一些'
  }
])

// 智能建议
const currentSuggestions = ref([
  {
    id: 1,
    type: 'improvement',
    priority: 'high',
    title: '语速建议',
    text: '建议适当放慢语速，让表达更加清晰'
  },
  {
    id: 2,
    type: 'strength',
    priority: 'medium',
    title: '技术优势',
    text: '技术回答很专业，继续保持这个水平'
  },
  {
    id: 3,
    type: 'tip',
    priority: 'low',
    title: '眼神交流',
    text: '可以多看镜头，增强与面试官的连接'
  }
])

// 语音指标（已禁用）
const voiceMetrics = ref({
  speed: '0字/分',
  volume: 0,
  clarity: 0
})

// 快速操作
const quickActions = ref([
  { id: 'pause', label: '暂停面试', type: 'warning', icon: 'VideoPause' },
  { id: 'hint', label: '获取提示', type: 'primary', icon: 'Star' },
  { id: 'refresh', label: '重新分析', type: 'default', icon: 'Refresh' }
])

// 计算属性
const feedbackStatus = computed(() => {
  if (!isRealTimeFeedbackEnabled.value) {
    return { type: 'info', text: '反馈已暂停' }
  }
  return { type: 'success', text: '实时分析中' }
})

const progressPercentage = computed(() => {
  return Math.round((props.currentQuestion / props.totalQuestions) * 100)
})

const progressColor = computed(() => {
  const percentage = progressPercentage.value
  if (percentage < 30) return '#f56565'
  if (percentage < 70) return '#ed8936'
  return '#48bb78'
})

const estimatedTimeLeft = computed(() => {
  const avgTimePerQuestion = props.elapsedTime / props.currentQuestion
  const remainingQuestions = props.totalQuestions - props.currentQuestion
  const estimatedSeconds = avgTimePerQuestion * remainingQuestions
  return formatTime(estimatedSeconds)
})

// 方法
const toggleRealTimeFeedback = () => {
  isRealTimeFeedbackEnabled.value = !isRealTimeFeedbackEnabled.value
  emit('toggle-feedback', isRealTimeFeedbackEnabled.value)
}

const getMetricLevelClass = (score) => {
  if (score >= 90) return 'excellent'
  if (score >= 80) return 'good'
  if (score >= 70) return 'average'
  return 'poor'
}

const getScoreColor = (score) => {
  if (score >= 90) return '#52c41a'
  if (score >= 80) return '#1890ff'
  if (score >= 70) return '#faad14'
  return '#ff4d4f'
}

const getTrendIcon = (trend) => {
  const iconMap = {
    'up': 'ArrowUp',
    'down': 'ArrowDown',
    'stable': 'Minus'
  }
  return iconMap[trend] || 'Minus'
}

const getSuggestionIcon = (type) => {
  const iconMap = {
    'improvement': 'Warning',
    'strength': 'Check',
    'tip': 'InfoFilled'
  }
  return iconMap[type] || 'InfoFilled'
}

const applySuggestion = (suggestion) => {
  emit('apply-suggestion', suggestion)
}

const executeQuickAction = (action) => {
  emit('quick-action', action)
}

const getWaveHeight = (index) => {
  // 语音波形已禁用
  return 0
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// 生命周期
let waveformTimer = null

onMounted(() => {
  // 启动波形动画
  waveformTimer = setInterval(() => {
    // 触发重新渲染波形
  }, 100)
})

onUnmounted(() => {
  if (waveformTimer) {
    clearInterval(waveformTimer)
  }
})
</script>

<style scoped>
.realtime-feedback-panel {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.feedback-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f0f0f0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.feedback-icon {
  color: #1890ff;
  font-size: 20px;
}

.panel-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #2d3748;
}

.status-tag {
  margin-left: 8px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.metric-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.metric-card.excellent {
  border-left-color: #52c41a;
}

.metric-card.good {
  border-left-color: #1890ff;
}

.metric-card.average {
  border-left-color: #faad14;
}

.metric-card.poor {
  border-left-color: #ff4d4f;
}

.metric-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.metric-icon {
  color: #1890ff;
  font-size: 16px;
}

.metric-name {
  flex: 1;
  font-size: 0.9rem;
  font-weight: 500;
  color: #4a5568;
}

.metric-trend {
  font-size: 14px;
}

.metric-trend.up {
  color: #52c41a;
}

.metric-trend.down {
  color: #ff4d4f;
}

.metric-trend.stable {
  color: #faad14;
}

.metric-value {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 8px;
}

.score-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
}

.score-unit {
  font-size: 0.8rem;
  color: #6b7280;
}

.metric-progress {
  margin-bottom: 8px;
}

.metric-feedback {
  font-size: 0.8rem;
  color: #6b7280;
  line-height: 1.4;
}

.intelligent-suggestions {
  margin-bottom: 24px;
}

.suggestions-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 3px solid transparent;
}

.suggestion-item.high {
  border-left-color: #ff4d4f;
}

.suggestion-item.medium {
  border-left-color: #faad14;
}

.suggestion-item.low {
  border-left-color: #52c41a;
}

.suggestion-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e6f7ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1890ff;
}

.suggestion-content {
  flex: 1;
}

.suggestion-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 4px;
}

.suggestion-text {
  font-size: 0.8rem;
  color: #6b7280;
  line-height: 1.4;
}

.voice-analysis-section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
}

.waveform-container {
  display: flex;
  align-items: end;
  gap: 2px;
  height: 60px;
  margin-bottom: 12px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 8px;
}

.wave-bar {
  flex: 1;
  background: linear-gradient(to top, #1890ff, #40a9ff);
  border-radius: 2px;
  min-height: 4px;
  animation: wave 2s ease-in-out infinite;
}

@keyframes wave {
  0%, 100% { transform: scaleY(0.5); }
  50% { transform: scaleY(1); }
}

.voice-metrics-mini {
  display: flex;
  gap: 16px;
}

.mini-metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.mini-metric .label {
  font-size: 0.7rem;
  color: #6b7280;
}

.mini-metric .value {
  font-size: 0.8rem;
  font-weight: 600;
  color: #2d3748;
}

.interview-progress-section {
  margin-bottom: 24px;
}

.progress-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-label {
  font-size: 0.8rem;
  color: #6b7280;
}

.stat-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2d3748;
}

.quick-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .progress-stats {
    flex-direction: column;
    gap: 8px;
  }
  
  .quick-actions {
    justify-content: center;
  }
}
</style>
