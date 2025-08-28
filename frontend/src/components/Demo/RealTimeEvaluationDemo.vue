<template>
  <div class="realtime-evaluation-demo">
    <div class="demo-header">
      <h3>实时评估反馈演示</h3>
      <p>基于多模态数据融合的智能评估系统</p>
    </div>

    <div class="demo-content">
      <!-- 评估控制区域 -->
      <div class="evaluation-controls">
        <el-button
          :type="isEvaluating ? 'danger' : 'primary'"
          :icon="isEvaluating ? VideoPause : VideoPlay"
          size="large"
          @click="toggleEvaluation"
          :loading="isInitializing"
        >
          {{ isEvaluating ? '停止评估' : '开始评估' }}
        </el-button>
        
        <el-button
          v-if="evaluationData.length > 0"
          type="success"
          :icon="Document"
          @click="generateReport"
        >
          生成报告
        </el-button>
        
        <el-button
          v-if="evaluationData.length > 0"
          type="warning"
          :icon="RefreshRight"
          @click="resetEvaluation"
        >
          重置评估
        </el-button>
      </div>

      <!-- 实时评估面板 -->
      <div v-if="isEvaluating || evaluationData.length > 0" class="evaluation-panel">
        <!-- 六维能力实时评分 -->
        <el-card class="capability-card">
          <template #header>
            <div class="card-header">
              <el-icon><TrendCharts /></el-icon>
              <span>六维能力实时评估</span>
              <el-tag v-if="isEvaluating" type="success" size="small">
                <el-icon><Loading /></el-icon>
                实时分析中
              </el-tag>
            </div>
          </template>

          <div class="capability-grid">
            <div
              v-for="capability in capabilities"
              :key="capability.key"
              class="capability-item"
            >
              <div class="capability-header">
                <el-icon><component :is="capability.icon" /></el-icon>
                <span class="capability-name">{{ capability.name }}</span>
              </div>
              
              <div class="capability-score">
                <el-progress
                  :percentage="capability.score"
                  :color="getScoreColor(capability.score)"
                  :stroke-width="8"
                />
                <span class="score-text">{{ capability.score }}分</span>
              </div>
              
              <div class="capability-trend">
                <span class="trend-label">趋势:</span>
                <el-icon 
                  :class="getTrendClass(capability.trend)"
                  :style="{ color: getTrendColor(capability.trend) }"
                >
                  <component :is="getTrendIcon(capability.trend)" />
                </el-icon>
                <span :style="{ color: getTrendColor(capability.trend) }">
                  {{ getTrendText(capability.trend) }}
                </span>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 实时反馈信息 -->
        <el-card class="feedback-card">
          <template #header>
            <div class="card-header">
              <el-icon><ChatDotRound /></el-icon>
              <span>实时反馈</span>
            </div>
          </template>

          <div class="feedback-timeline">
            <el-timeline>
              <el-timeline-item
                v-for="feedback in realtimeFeedback"
                :key="feedback.id"
                :timestamp="feedback.timestamp"
                :type="feedback.type"
                :icon="feedback.icon"
              >
                <div class="feedback-content">
                  <h4>{{ feedback.title }}</h4>
                  <p>{{ feedback.message }}</p>
                  <el-tag v-if="feedback.score" :type="getScoreTagType(feedback.score)" size="small">
                    评分: {{ feedback.score }}
                  </el-tag>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-card>

        <!-- 综合评估概览 -->
        <el-card class="overview-card">
          <template #header>
            <div class="card-header">
              <el-icon><DataBoard /></el-icon>
              <span>综合评估概览</span>
            </div>
          </template>

          <div class="overview-content">
            <div class="overall-score">
              <el-progress
                type="circle"
                :percentage="overallScore"
                :width="120"
                :stroke-width="10"
                :color="getScoreColor(overallScore)"
              >
                <template #default="{ percentage }">
                  <div class="score-display">
                    <span class="score-number">{{ percentage }}</span>
                    <span class="score-label">综合评分</span>
                  </div>
                </template>
              </el-progress>
            </div>

            <div class="score-breakdown">
              <div class="breakdown-item">
                <span class="breakdown-label">技术能力</span>
                <el-rate
                  :model-value="Math.round(capabilities[0].score / 20)"
                  disabled
                  show-score
                  text-color="#ff9900"
                />
              </div>
              <div class="breakdown-item">
                <span class="breakdown-label">沟通表达</span>
                <el-rate
                  :model-value="Math.round(capabilities[1].score / 20)"
                  disabled
                  show-score
                  text-color="#ff9900"
                />
              </div>
              <div class="breakdown-item">
                <span class="breakdown-label">逻辑思维</span>
                <el-rate
                  :model-value="Math.round(capabilities[2].score / 20)"
                  disabled
                  show-score
                  text-color="#ff9900"
                />
              </div>
            </div>
          </div>
        </el-card>

        <!-- 个性化建议 -->
        <el-card class="suggestions-card">
          <template #header>
            <div class="card-header">
              <el-icon><Star /></el-icon>
              <span>个性化改进建议</span>
            </div>
          </template>

          <div class="suggestions-content">
            <div
              v-for="suggestion in personalizedSuggestions"
              :key="suggestion.id"
              class="suggestion-item"
              :class="suggestion.priority"
            >
              <div class="suggestion-header">
                <el-icon><component :is="suggestion.icon" /></el-icon>
                <span class="suggestion-title">{{ suggestion.title }}</span>
                <el-tag :type="getPriorityTagType(suggestion.priority)" size="small">
                  {{ getPriorityText(suggestion.priority) }}
                </el-tag>
              </div>
              <p class="suggestion-description">{{ suggestion.description }}</p>
              <div class="suggestion-actions">
                <el-button size="small" link @click="viewSuggestionDetail(suggestion)">
                  查看详情
                </el-button>
                <el-button size="small" link @click="addToLearningPath(suggestion)">
                  加入学习路径
                </el-button>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 演示说明 -->
      <div class="demo-instructions">
        <el-alert
          title="演示说明"
          type="info"
          :closable="false"
        >
          <p>1. 点击"开始评估"启动实时评估系统</p>
          <p>2. 系统将模拟多模态数据输入（语音、视频、文本）</p>
          <p>3. 实时显示六维能力评估结果和趋势变化</p>
          <p>4. 提供即时反馈和个性化改进建议</p>
          <p>5. 可生成详细的评估报告和学习路径推荐</p>
        </el-alert>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  VideoPlay, VideoPause, Loading, Document, RefreshRight, TrendCharts, ChatDotRound, DataBoard, Star, ArrowUp, ArrowDown, Close, User, Connection, Grid, Trophy, SuccessFilled, WarningFilled, InfoFilled
} from '@element-plus/icons-vue'

// 响应式数据
const isEvaluating = ref(false)
const isInitializing = ref(false)
const evaluationData = ref([])
const realtimeFeedback = ref([])

// 评估定时器
let evaluationTimer = null
let feedbackTimer = null

// 六维能力数据
const capabilities = ref([
  {
    key: 'technical',
    name: '技术能力',
    score: 0,
    trend: 0,
    icon: Monitor
  },
  {
    key: 'communication',
    name: '沟通表达',
    score: 0,
    trend: 0,
    icon: ChatDotRound
  },
  {
    key: 'logic',
    name: '逻辑思维',
    score: 0,
    trend: 0,
    icon: Connection
  },
  {
    key: 'learning',
    name: '学习能力',
    score: 0,
    trend: 0,
    icon: User
  },
  {
    key: 'innovation',
    name: '创新思维',
    score: 0,
    trend: 0,
    icon: DataBoard
  },
  {
    key: 'teamwork',
    name: '团队协作',
    score: 0,
    trend: 0,
    icon: Trophy
  }
])

// 个性化建议
const personalizedSuggestions = ref([
  {
    id: 1,
    title: '加强技术深度',
    description: '建议深入学习核心技术栈，提升解决复杂问题的能力',
    priority: 'high',
    icon: Monitor
  },
  {
    id: 2,
    title: '改善表达方式',
    description: '可以通过更多的实例和类比来让技术解释更加清晰',
    priority: 'medium',
    icon: ChatDotRound
  },
  {
    id: 3,
    title: '增强逻辑结构',
    description: '回答问题时可以先总结要点，再逐一展开说明',
    priority: 'low',
    icon: Connection
  }
])

// 计算综合评分
const overallScore = computed(() => {
  const total = capabilities.value.reduce((sum, cap) => sum + cap.score, 0)
  return Math.round(total / capabilities.value.length)
})

// 组件卸载时清理定时器
onUnmounted(() => {
  if (evaluationTimer) clearInterval(evaluationTimer)
  if (feedbackTimer) clearInterval(feedbackTimer)
})

// 切换评估状态
const toggleEvaluation = async () => {
  if (isEvaluating.value) {
    stopEvaluation()
  } else {
    await startEvaluation()
  }
}

// 开始评估
const startEvaluation = async () => {
  isInitializing.value = true
  
  try {
    // 模拟初始化过程
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    isEvaluating.value = true
    isInitializing.value = false
    
    // 开始实时评估
    startRealtimeEvaluation()
    startRealtimeFeedback()
    
    ElMessage.success('实时评估已启动')
  } catch (error) {
    isInitializing.value = false
    ElMessage.error('启动评估失败')
  }
}

// 停止评估
const stopEvaluation = () => {
  isEvaluating.value = false
  
  if (evaluationTimer) {
    clearInterval(evaluationTimer)
    evaluationTimer = null
  }
  
  if (feedbackTimer) {
    clearInterval(feedbackTimer)
    feedbackTimer = null
  }
  
  ElMessage.success('评估已停止')
}

// 开始实时评估
const startRealtimeEvaluation = () => {
  evaluationTimer = setInterval(() => {
    capabilities.value.forEach(capability => {
      // 模拟评分变化
      const change = (Math.random() - 0.5) * 10
      const newScore = Math.max(0, Math.min(100, capability.score + change))
      
      // 计算趋势
      const trend = newScore > capability.score ? 1 : newScore < capability.score ? -1 : 0
      
      capability.score = Math.round(newScore)
      capability.trend = trend
    })
    
    // 记录评估数据
    evaluationData.value.push({
      timestamp: new Date(),
      scores: capabilities.value.map(cap => ({ ...cap }))
    })
  }, 2000)
}

// 开始实时反馈
const startRealtimeFeedback = () => {
  const feedbackMessages = [
    {
      title: '技术回答准确',
      message: '对算法复杂度的分析很到位，展现了扎实的技术基础',
      type: 'success',
      score: 85,
      icon: SuccessFilled
    },
    {
      title: '表达可以更清晰',
      message: '建议在解释技术概念时使用更多具体的例子',
      type: 'warning',
      score: 72,
      icon: WarningFilled
    },
    {
      title: '逻辑思路清晰',
      message: '问题分析的步骤很有条理，思维逻辑性强',
      type: 'success',
      score: 88,
      icon: SuccessFilled
    },
    {
      title: '需要更多互动',
      message: '可以主动询问面试官是否需要更详细的解释',
      type: 'info',
      score: 68,
      icon: InfoFilled
    }
  ]
  
  let messageIndex = 0
  
  feedbackTimer = setInterval(() => {
    if (messageIndex < feedbackMessages.length) {
      const feedback = {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        ...feedbackMessages[messageIndex]
      }
      
      realtimeFeedback.value.unshift(feedback)
      messageIndex++
      
      // 限制反馈条数
      if (realtimeFeedback.value.length > 10) {
        realtimeFeedback.value.pop()
      }
    }
  }, 5000)
}

// 生成报告
const generateReport = () => {
  ElMessage.success('正在生成详细评估报告...')
  // 这里可以跳转到报告页面或下载报告
}

// 重置评估
const resetEvaluation = () => {
  capabilities.value.forEach(capability => {
    capability.score = 0
    capability.trend = 0
  })
  evaluationData.value = []
  realtimeFeedback.value = []
  ElMessage.success('评估数据已重置')
}

// 查看建议详情
const viewSuggestionDetail = (suggestion) => {
  ElMessage.info(`查看建议详情: ${suggestion.title}`)
}

// 添加到学习路径
const addToLearningPath = (suggestion) => {
  ElMessage.success(`已添加到学习路径: ${suggestion.title}`)
}

// 工具函数
const getScoreColor = (score) => {
  if (score >= 80) return '#67c23a'
  if (score >= 60) return '#e6a23c'
  return '#f56c6c'
}

const getScoreTagType = (score) => {
  if (score >= 80) return 'success'
  if (score >= 60) return 'warning'
  return 'danger'
}

const getTrendClass = (trend) => {
  return trend > 0 ? 'trend-up' : trend < 0 ? 'trend-down' : 'trend-stable'
}

const getTrendColor = (trend) => {
  if (trend > 0) return '#67c23a'
  if (trend < 0) return '#f56c6c'
  return '#909399'
}

const getTrendIcon = (trend) => {
  if (trend > 0) return ArrowUp
  if (trend < 0) return ArrowDown
  return Close
}

const getTrendText = (trend) => {
  if (trend > 0) return '上升'
  if (trend < 0) return '下降'
  return '稳定'
}

const getPriorityTagType = (priority) => {
  switch (priority) {
    case 'high': return 'danger'
    case 'medium': return 'warning'
    case 'low': return 'info'
    default: return 'info'
  }
}

const getPriorityText = (priority) => {
  switch (priority) {
    case 'high': return '高优先级'
    case 'medium': return '中优先级'
    case 'low': return '低优先级'
    default: return '普通'
  }
}

// 暴露给父组件的事件
const emit = defineEmits(['close'])
</script>

<style scoped>
.realtime-evaluation-demo {
  padding: 20px;
  max-height: 70vh;
  overflow-y: auto;
}

.demo-header {
  text-align: center;
  margin-bottom: 30px;
}

.demo-header h3 {
  color: #1890ff;
  margin-bottom: 10px;
}

.evaluation-controls {
  text-align: center;
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
  gap: 15px;
}

.evaluation-panel {
  display: grid;
  gap: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.capability-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.capability-item {
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background: #fafafa;
}

.capability-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
}

.capability-name {
  font-weight: 500;
  font-size: 16px;
}

.capability-score {
  margin-bottom: 15px;
}

.score-text {
  margin-left: 10px;
  font-weight: bold;
  color: #1890ff;
}

.capability-trend {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
}

.trend-label {
  color: #909399;
}

.feedback-timeline {
  max-height: 400px;
  overflow-y: auto;
}

.feedback-content h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
}

.feedback-content p {
  margin: 0 0 8px 0;
  color: #606266;
  font-size: 13px;
}

.overview-content {
  display: flex;
  align-items: center;
  gap: 40px;
}

.overall-score {
  flex-shrink: 0;
}

.score-display {
  text-align: center;
}

.score-number {
  display: block;
  font-size: 24px;
  font-weight: bold;
  color: #1890ff;
}

.score-label {
  display: block;
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

.score-breakdown {
  flex: 1;
  display: grid;
  gap: 15px;
}

.breakdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.breakdown-label {
  font-weight: 500;
  min-width: 80px;
}

.suggestions-content {
  display: grid;
  gap: 15px;
}

.suggestion-item {
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #e4e7ed;
}

.suggestion-item.high {
  background: #fef0f0;
  border-left-color: #f56c6c;
}

.suggestion-item.medium {
  background: #fdf6ec;
  border-left-color: #e6a23c;
}

.suggestion-item.low {
  background: #f0f9ff;
  border-left-color: #409eff;
}

.suggestion-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.suggestion-title {
  font-weight: 500;
  flex: 1;
}

.suggestion-description {
  margin: 0 0 10px 0;
  color: #606266;
  font-size: 14px;
}

.suggestion-actions {
  display: flex;
  gap: 10px;
}

.demo-instructions {
  margin-top: 30px;
}

.demo-instructions p {
  margin: 5px 0;
}
</style>
