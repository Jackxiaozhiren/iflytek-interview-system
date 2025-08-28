<template>
  <div class="multimodal-interaction-hub">
    <!-- 多模态交互控制中心 -->
    <div class="interaction-control-center">
      <div class="center-header">
        <h3>iFlytek Spark 多模态交互中心</h3>
        <div class="interaction-status">
          <el-tag :type="getInteractionStatusType()" size="large">
            {{ interactionStatus.text }}
          </el-tag>
        </div>
      </div>

      <!-- 模态切换控制 -->
      <div class="modality-switcher">
        <div class="switcher-header">
          <h4>交互模式选择</h4>
          <div class="active-modalities">
            <el-tag 
              v-for="modality in activeModalities" 
              :key="modality"
              :type="getModalityType(modality)"
              size="small"
            >
              {{ getModalityName(modality) }}
            </el-tag>
          </div>
        </div>
        
        <div class="modality-controls">
          <div class="control-group">


            <div class="control-item" :class="{ active: modalityStates.smartGuide }">
              <el-switch
                v-model="modalityStates.smartGuide"
                @change="toggleModality('smartGuide')"
                active-color="var(--iflytek-primary)"
              />
              <div class="control-info">
                <el-icon><ChatDotRound /></el-icon>
                <span>智能问答引导</span>
              </div>
              <div class="control-metrics" v-if="modalityStates.smartGuide">
                <small>引导准确率: {{ Math.round(smartGuideMetrics.accuracy) }}%</small>
              </div>
            </div>

            <div class="control-item" :class="{ active: modalityStates.text }">
              <el-switch
                v-model="modalityStates.text"
                @change="toggleModality('text')"
                active-color="var(--iflytek-primary)"
              />
              <div class="control-info">
                <el-icon><Document /></el-icon>
                <span>文本理解</span>
              </div>
              <div class="control-metrics" v-if="modalityStates.text">
                <small>理解度: {{ Math.round(textMetrics.understanding) }}%</small>
              </div>
            </div>

            <div class="control-item" :class="{ active: modalityStates.thinkingAnalysis }">
              <el-switch
                v-model="modalityStates.thinkingAnalysis"
                @change="toggleModality('thinkingAnalysis')"
                active-color="var(--iflytek-primary)"
              />
              <div class="control-info">
                <el-icon><TrendCharts /></el-icon>
                <span>答题思路分析</span>
              </div>
              <div class="control-metrics" v-if="modalityStates.thinkingAnalysis">
                <small>分析深度: {{ Math.round(thinkingAnalysisMetrics.depth) }}%</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 实时多模态融合分析 -->
    <div class="multimodal-fusion-analysis">
      <div class="fusion-header">
        <h4>实时多模态融合分析</h4>
        <div class="fusion-confidence">
          <span class="confidence-label">融合置信度</span>
          <div class="confidence-meter">
            <div class="confidence-fill" :style="{ width: fusionConfidence + '%' }"></div>
          </div>
          <span class="confidence-value">{{ fusionConfidence }}%</span>
        </div>
      </div>

      <div class="fusion-visualization">
        <!-- 语音波形与情感分析 -->
        <div class="fusion-panel voice-emotion-panel" v-if="modalityStates.voice">
          <div class="panel-header">
            <el-icon><Microphone /></el-icon>
            <span>语音情感融合</span>
          </div>
          <div class="panel-content">
            <div class="voice-waveform-enhanced">
              <div class="waveform-container">
                <div class="wave-bar" v-for="i in 12" :key="i"></div>
              </div>
              <div class="emotion-overlay">
                <div class="emotion-indicator" 
                     v-for="emotion in voiceEmotions" 
                     :key="emotion.name"
                     :style="{ opacity: emotion.intensity / 100 }">
                  <span class="emotion-name">{{ emotion.name }}</span>
                  <span class="emotion-value">{{ emotion.intensity }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 智能问答引导面板 -->
        <div class="fusion-panel smart-guide-panel" v-if="modalityStates.smartGuide">
          <div class="panel-header">
            <el-icon><ChatDotRound /></el-icon>
            <span>iFlytek Spark 智能引导</span>
          </div>
          <div class="panel-content">
            <div class="smart-guide-container">
              <div class="guide-questions">
                <div class="question-item"
                     v-for="question in smartGuideQuestions"
                     :key="question.type">
                  <div class="question-type">{{ question.type }}</div>
                  <div class="question-text">{{ question.question }}</div>
                  <div class="question-confidence">置信度: {{ question.confidence }}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 答题思路分析面板 -->
        <div class="fusion-panel thinking-analysis-panel" v-if="modalityStates.thinkingAnalysis">
          <div class="panel-header">
            <el-icon><TrendCharts /></el-icon>
            <span>答题思路分析</span>
          </div>
          <div class="panel-content">
            <div class="thinking-patterns-container">
              <div class="pattern-item"
                   v-for="pattern in thinkingPatterns"
                   :key="pattern.pattern">
                <div class="pattern-name">{{ pattern.pattern }}</div>
                <div class="pattern-score-bar">
                  <div class="score-fill" :style="{ width: pattern.score + '%' }"></div>
                  <span class="score-text">{{ pattern.score }}分</span>
                </div>
                <div class="pattern-description">{{ pattern.description }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 文本语义与关键词分析 -->
        <div class="fusion-panel text-semantic-panel" v-if="modalityStates.text">
          <div class="panel-header">
            <el-icon><Document /></el-icon>
            <span>文本语义融合</span>
          </div>
          <div class="panel-content">
            <div class="semantic-cloud">
              <div class="keyword-cloud">
                <span 
                  v-for="keyword in semanticKeywords" 
                  :key="keyword.word"
                  class="keyword-bubble"
                  :style="{ 
                    fontSize: (keyword.weight * 20 + 12) + 'px',
                    color: getKeywordColor(keyword.sentiment)
                  }"
                >
                  {{ keyword.word }}
                </span>
              </div>
              <div class="sentiment-analysis">
                <div class="sentiment-meter">
                  <div class="sentiment-bar positive" :style="{ width: sentimentScores.positive + '%' }">
                    <span>积极 {{ sentimentScores.positive }}%</span>
                  </div>
                  <div class="sentiment-bar neutral" :style="{ width: sentimentScores.neutral + '%' }">
                    <span>中性 {{ sentimentScores.neutral }}%</span>
                  </div>
                  <div class="sentiment-bar negative" :style="{ width: sentimentScores.negative + '%' }">
                    <span>消极 {{ sentimentScores.negative }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>

    <!-- 智能交互建议 -->
    <div class="intelligent-interaction-suggestions">
      <div class="suggestions-header">
        <h4>智能交互建议</h4>
        <div class="suggestion-mode">
          <el-switch
            v-model="suggestionMode.realtime"
            active-text="实时建议"
            inactive-text="定时建议"
          />
        </div>
      </div>

      <div class="suggestions-grid">
        <div class="suggestion-card" v-for="suggestion in interactionSuggestions" :key="suggestion.id">
          <div class="suggestion-type">
            <el-tag :type="suggestion.type">{{ suggestion.category }}</el-tag>
          </div>
          <div class="suggestion-content">
            <h5>{{ suggestion.title }}</h5>
            <p>{{ suggestion.description }}</p>
          </div>
          <div class="suggestion-actions">
            <el-button size="small" type="primary" @click="applySuggestion(suggestion)">
              应用建议
            </el-button>
            <el-button size="small" @click="dismissSuggestion(suggestion)">
              忽略
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 交互质量评估 -->
    <div class="interaction-quality-assessment">
      <div class="assessment-header">
        <h4>交互质量评估</h4>
        <div class="overall-quality">
          <span class="quality-score">{{ overallQuality.score }}</span>
          <span class="quality-level">{{ overallQuality.level }}</span>
        </div>
      </div>

      <div class="quality-metrics">
        <div class="metric-item" v-for="metric in qualityMetrics" :key="metric.name">
          <div class="metric-header">
            <span class="metric-name">{{ metric.name }}</span>
            <span class="metric-value">{{ Math.round(metric.value) }}%</span>
          </div>
          <div class="metric-progress">
            <div class="progress-bar" :style="{ 
              width: metric.value + '%', 
              backgroundColor: getQualityColor(metric.value) 
            }"></div>
          </div>
          <div class="metric-trend">
            <el-icon :class="{ 'trend-up': metric.trend > 0, 'trend-down': metric.trend < 0 }">
              <component :is="metric.trend > 0 ? 'ArrowUp' : metric.trend < 0 ? 'ArrowDown' : 'Minus'" />
            </el-icon>
            <span>{{ Math.round(Math.abs(metric.trend)) }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import {
  Microphone, Document, ChatDotRound, TrendCharts
} from '@element-plus/icons-vue'

// 交互状态管理
const interactionStatus = reactive({
  active: false,
  text: '待激活'
})

// 模态状态管理
const modalityStates = reactive({
  voice: true,
  smartGuide: true,
  text: true,
  thinkingAnalysis: false
})

// 活跃模态计算
const activeModalities = computed(() => {
  return Object.keys(modalityStates).filter(key => modalityStates[key])
})

// 各模态性能指标
const voiceMetrics = reactive({
  recognition: 94
})

const smartGuideMetrics = reactive({
  accuracy: 92
})

const textMetrics = reactive({
  understanding: 92
})

const thinkingAnalysisMetrics = reactive({
  depth: 88
})

// 融合置信度
const fusionConfidence = ref(91)

// 语音情感数据
const voiceEmotions = reactive([
  { name: '自信', intensity: 85 },
  { name: '专业', intensity: 92 },
  { name: '紧张', intensity: 15 },
  { name: '友好', intensity: 78 }
])

// 行为热力图数据
const behaviorHeatmap = reactive(
  Array.from({ length: 64 }, (_, i) => ({
    id: i,
    intensity: Math.random() * 100
  }))
)

const behaviorLabels = reactive([
  { name: '语音表达', color: '#2ecc71' },
  { name: '智能引导', color: '#3498db' },
  { name: '文本理解', color: '#f39c12' },
  { name: '思路分析', color: '#e74c3c' }
])

// 语义关键词数据
const semanticKeywords = reactive([
  { word: '技术架构', weight: 0.9, sentiment: 'positive' },
  { word: '团队协作', weight: 0.7, sentiment: 'positive' },
  { word: '项目管理', weight: 0.8, sentiment: 'neutral' },
  { word: '性能优化', weight: 0.6, sentiment: 'positive' },
  { word: '挑战困难', weight: 0.5, sentiment: 'negative' },
  { word: '解决方案', weight: 0.8, sentiment: 'positive' },
  { word: '学习成长', weight: 0.7, sentiment: 'positive' }
])

// 情感分析得分
const sentimentScores = reactive({
  positive: 65,
  neutral: 25,
  negative: 10
})

// 智能问答引导数据
const smartGuideQuestions = reactive([
  { type: '技术深入', question: '能否详细说明这个技术的核心原理？', confidence: 92 },
  { type: '经验探索', question: '在实际项目中是如何应用的？', confidence: 87 },
  { type: '问题解决', question: '遇到的主要挑战是什么？', confidence: 78 }
])

// 答题思路分析数据
const thinkingPatterns = reactive([
  { pattern: '逻辑结构', score: 85, description: '回答逻辑清晰' },
  { pattern: '深度分析', score: 78, description: '技术深度良好' },
  { pattern: '实践结合', score: 92, description: '理论实践结合好' }
])

// 交互建议
const suggestionMode = reactive({
  realtime: true
})

const interactionSuggestions = reactive([
  {
    id: 1,
    type: 'primary',
    category: '语音优化',
    title: '建议放慢语速',
    description: '当前语速略快，建议适当放慢以提高表达清晰度'
  },
  {
    id: 2,
    type: 'warning',
    category: '视觉交互',
    title: '增加眼神交流',
    description: '建议更多地看向摄像头，增强与面试官的眼神交流'
  },
  {
    id: 3,
    type: 'success',
    category: '内容表达',
    title: '技术描述优秀',
    description: '技术概念表达清晰，逻辑性强，继续保持'
  }
])

// 交互质量评估
const overallQuality = reactive({
  score: 87,
  level: '优秀'
})

const qualityMetrics = reactive([
  { name: '语音清晰度', value: 92, trend: 3 },
  { name: '视觉表现', value: 85, trend: -2 },
  { name: '内容质量', value: 89, trend: 5 },
  { name: '交互自然度', value: 83, trend: 1 }
])

// 方法定义
const getInteractionStatusType = () => {
  return interactionStatus.active ? 'success' : 'info'
}

const getModalityType = (modality) => {
  const typeMap = {
    voice: 'primary',
    smartGuide: 'success',
    text: 'warning',
    thinkingAnalysis: 'info'
  }
  return typeMap[modality] || 'info'
}

const getModalityName = (modality) => {
  const nameMap = {
    voice: '语音',
    smartGuide: '智能引导',
    text: '文本',
    thinkingAnalysis: '思路分析'
  }
  return nameMap[modality] || modality
}

const toggleModality = (modality) => {
  console.log(`切换模态: ${modality}`, modalityStates[modality])
  updateInteractionStatus()
}

const updateInteractionStatus = () => {
  const activeCount = activeModalities.value.length
  if (activeCount === 0) {
    interactionStatus.active = false
    interactionStatus.text = '已停用'
  } else if (activeCount === 1) {
    interactionStatus.active = true
    interactionStatus.text = '单模态激活'
  } else {
    interactionStatus.active = true
    interactionStatus.text = `多模态融合 (${activeCount})`
  }
}

const getCellColor = (intensity) => {
  const alpha = intensity / 100
  return `rgba(33, 111, 255, ${alpha})`
}

const getKeywordColor = (sentiment) => {
  const colorMap = {
    positive: '#2ecc71',
    neutral: '#95a5a6',
    negative: '#e74c3c'
  }
  return colorMap[sentiment] || '#95a5a6'
}

const getQualityColor = (value) => {
  if (value >= 90) return '#2ecc71'
  if (value >= 80) return '#f39c12'
  if (value >= 70) return '#e67e22'
  return '#e74c3c'
}

const applySuggestion = (suggestion) => {
  console.log('应用建议:', suggestion)
  // 移除已应用的建议
  const index = interactionSuggestions.findIndex(s => s.id === suggestion.id)
  if (index > -1) {
    interactionSuggestions.splice(index, 1)
  }
}

const dismissSuggestion = (suggestion) => {
  const index = interactionSuggestions.findIndex(s => s.id === suggestion.id)
  if (index > -1) {
    interactionSuggestions.splice(index, 1)
  }
}

// 动画和实时更新
let animationInterval = null

onMounted(() => {
  updateInteractionStatus()

  // 启动实时数据更新
  animationInterval = setInterval(() => {
    // 更新语音波形
    const waveBars = document.querySelectorAll('.wave-bar')
    waveBars.forEach((bar, index) => {
      const height = Math.random() * 40 + 10
      bar.style.height = height + 'px'
    })

    // 更新融合置信度
    fusionConfidence.value = Math.max(80, Math.min(98, fusionConfidence.value + (Math.random() - 0.5) * 4))

    // 更新情感强度
    voiceEmotions.forEach(emotion => {
      emotion.intensity = Math.max(10, Math.min(100, emotion.intensity + (Math.random() - 0.5) * 6))
    })

    // 更新行为热力图
    behaviorHeatmap.forEach(cell => {
      cell.intensity = Math.max(0, Math.min(100, cell.intensity + (Math.random() - 0.5) * 10))
    })

    // 更新质量指标
    qualityMetrics.forEach(metric => {
      const oldValue = metric.value
      const newValue = Math.max(60, Math.min(100, metric.value + (Math.random() - 0.5) * 3))
      metric.value = Math.round(newValue) // 确保显示整数
      metric.trend = metric.value - oldValue
    })

    // 更新整体质量
    const avgQuality = qualityMetrics.reduce((sum, metric) => sum + metric.value, 0) / qualityMetrics.length
    overallQuality.score = Math.round(avgQuality)

    if (overallQuality.score >= 90) overallQuality.level = '卓越'
    else if (overallQuality.score >= 80) overallQuality.level = '优秀'
    else if (overallQuality.score >= 70) overallQuality.level = '良好'
    else overallQuality.level = '需改进'

  }, 1500)

  // 智能引导问题更新
  setInterval(() => {
    if (modalityStates.smartGuide) {
      // 更新智能引导准确率
      smartGuideMetrics.accuracy = Math.max(85, Math.min(98, smartGuideMetrics.accuracy + (Math.random() - 0.5) * 3))
    }

    if (modalityStates.thinkingAnalysis) {
      // 更新思路分析深度
      thinkingAnalysisMetrics.depth = Math.max(80, Math.min(95, thinkingAnalysisMetrics.depth + (Math.random() - 0.5) * 4))

      // 更新思维模式分析
      thinkingPatterns.forEach(pattern => {
        pattern.score = Math.max(70, Math.min(100, pattern.score + (Math.random() - 0.5) * 5))
      })
    }
  }, 3000)
})

onUnmounted(() => {
  if (animationInterval) {
    clearInterval(animationInterval)
  }
})
</script>

<style scoped>
.multimodal-interaction-hub {
  padding: 24px;
  background: #f8f9fa;
  min-height: 100vh;
}

/* 交互控制中心样式 */
.interaction-control-center {
  background: white;
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.center-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.center-header h3 {
  font-size: 24px;
  color: #2c3e50;
  margin: 0;
}

/* 模态切换控制样式 */
.modality-switcher {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 24px;
}

.switcher-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.switcher-header h4 {
  font-size: 18px;
  color: #2c3e50;
  margin: 0;
}

.active-modalities {
  display: flex;
  gap: 8px;
}

.modality-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.control-item {
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.control-item.active {
  border-color: var(--iflytek-primary);
  box-shadow: 0 4px 20px rgba(33, 111, 255, 0.15);
}

.control-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 12px 0;
  font-weight: 600;
  color: #2c3e50;
}

.control-metrics {
  margin-top: 8px;
}

.control-metrics small {
  color: #7f8c8d;
  font-size: 12px;
}

/* 多模态融合分析样式 */
.multimodal-fusion-analysis {
  background: white;
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.fusion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.fusion-header h4 {
  font-size: 20px;
  color: #2c3e50;
  margin: 0;
}

.fusion-confidence {
  display: flex;
  align-items: center;
  gap: 12px;
}

.confidence-label {
  font-size: 14px;
  color: #7f8c8d;
}

.confidence-meter {
  width: 120px;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.confidence-fill {
  height: 100%;
  background: var(--iflytek-gradient-primary);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.confidence-value {
  font-weight: 700;
  color: var(--iflytek-primary);
}

.fusion-visualization {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.fusion-panel {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 24px;
  border-left: 4px solid transparent;
  transition: all 0.3s ease;
}

.fusion-panel:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.voice-emotion-panel {
  border-left-color: var(--iflytek-primary);
}

.text-semantic-panel {
  border-left-color: #f39c12;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  font-weight: 600;
  color: #2c3e50;
}

/* 语音波形增强样式 */
.voice-waveform-enhanced {
  position: relative;
}

.waveform-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 80px;
  margin-bottom: 20px;
}

.wave-bar {
  width: 6px;
  height: 20px;
  background: var(--iflytek-gradient-primary);
  border-radius: 3px;
  animation: wave-pulse 1.5s ease-in-out infinite;
}

.wave-bar:nth-child(1) { animation-delay: 0s; }
.wave-bar:nth-child(2) { animation-delay: 0.1s; }
.wave-bar:nth-child(3) { animation-delay: 0.2s; }
.wave-bar:nth-child(4) { animation-delay: 0.3s; }
.wave-bar:nth-child(5) { animation-delay: 0.4s; }
.wave-bar:nth-child(6) { animation-delay: 0.5s; }
.wave-bar:nth-child(7) { animation-delay: 0.6s; }
.wave-bar:nth-child(8) { animation-delay: 0.7s; }
.wave-bar:nth-child(9) { animation-delay: 0.8s; }
.wave-bar:nth-child(10) { animation-delay: 0.9s; }
.wave-bar:nth-child(11) { animation-delay: 1.0s; }
.wave-bar:nth-child(12) { animation-delay: 1.1s; }

@keyframes wave-pulse {
  0%, 100% { height: 20px; }
  50% { height: 60px; }
}

.emotion-overlay {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.emotion-indicator {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 8px 12px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.emotion-name {
  font-size: 12px;
  color: #2c3e50;
}

.emotion-value {
  font-size: 12px;
  font-weight: 700;
  color: var(--iflytek-primary);
}

/* 行为热力图样式 */
.behavior-heatmap {
  text-align: center;
}

.heatmap-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 2px;
  margin-bottom: 20px;
  padding: 16px;
  background: white;
  border-radius: 8px;
}

.heatmap-cell {
  width: 20px;
  height: 20px;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.behavior-labels {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.label-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.label-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.label-text {
  font-size: 12px;
  color: #2c3e50;
}

/* 语义云样式 */
.semantic-cloud {
  text-align: center;
}

.keyword-cloud {
  min-height: 120px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  margin-bottom: 20px;
}

.keyword-bubble {
  padding: 6px 12px;
  border-radius: 20px;
  background: rgba(33, 111, 255, 0.1);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.keyword-bubble:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.sentiment-analysis {
  background: white;
  border-radius: 8px;
  padding: 16px;
}

.sentiment-meter {
  display: flex;
  height: 24px;
  border-radius: 12px;
  overflow: hidden;
  background: #e9ecef;
}

.sentiment-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: white;
  transition: width 0.3s ease;
}

.sentiment-bar.positive {
  background: #2ecc71;
}

.sentiment-bar.neutral {
  background: #95a5a6;
}

.sentiment-bar.negative {
  background: #e74c3c;
}

/* 智能问答引导样式 */
.smart-guide-panel .panel-content {
  padding: 20px;
}

.smart-guide-container {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 16px;
}

.guide-questions {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.question-item {
  background: white;
  border-radius: 8px;
  padding: 16px;
  border-left: 4px solid var(--iflytek-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.question-type {
  font-size: 12px;
  color: var(--iflytek-primary);
  font-weight: 600;
  margin-bottom: 8px;
}

.question-text {
  font-size: 14px;
  color: #2c3e50;
  margin-bottom: 8px;
  line-height: 1.5;
}

.question-confidence {
  font-size: 12px;
  color: #7f8c8d;
}

/* 答题思路分析样式 */
.thinking-analysis-panel .panel-content {
  padding: 20px;
}

.thinking-patterns-container {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 16px;
}

.pattern-item {
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.pattern-item:last-child {
  margin-bottom: 0;
}

.pattern-name {
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
}

.pattern-score-bar {
  position: relative;
  background: #ecf0f1;
  border-radius: 10px;
  height: 20px;
  margin-bottom: 8px;
  overflow: hidden;
}

.score-fill {
  background: linear-gradient(90deg, var(--iflytek-primary), #3498db);
  height: 100%;
  border-radius: 10px;
  transition: width 0.3s ease;
}

.score-text {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.pattern-description {
  font-size: 12px;
  color: #7f8c8d;
}

/* 移除手势识别相关样式 */
/* 手势识别样式已移除，替换为智能引导和思路分析功能 */

/* 智能交互建议样式 */
.intelligent-interaction-suggestions {
  background: white;
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.suggestions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.suggestions-header h4 {
  font-size: 18px;
  color: #2c3e50;
  margin: 0;
}

.suggestions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.suggestion-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  border-left: 4px solid transparent;
  transition: all 0.3s ease;
}

.suggestion-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.suggestion-type {
  margin-bottom: 12px;
}

.suggestion-content h5 {
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 8px;
}

.suggestion-content p {
  font-size: 14px;
  color: #7f8c8d;
  line-height: 1.5;
  margin-bottom: 16px;
}

.suggestion-actions {
  display: flex;
  gap: 8px;
}

/* 交互质量评估样式 */
.interaction-quality-assessment {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.assessment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.assessment-header h4 {
  font-size: 18px;
  color: #2c3e50;
  margin: 0;
}

.overall-quality {
  text-align: center;
}

.quality-score {
  display: block;
  font-size: 32px;
  font-weight: 700;
  color: var(--iflytek-primary);
  margin-bottom: 4px;
}

.quality-level {
  font-size: 14px;
  color: #7f8c8d;
}

.quality-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.metric-item {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.metric-name {
  font-size: 14px;
  color: #2c3e50;
  font-weight: 600;
}

.metric-value {
  font-size: 16px;
  font-weight: 700;
  color: var(--iflytek-primary);
}

.metric-progress {
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.metric-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}

.trend-up {
  color: #2ecc71;
}

.trend-down {
  color: #e74c3c;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .multimodal-interaction-hub {
    padding: 16px;
  }

  .interaction-control-center,
  .multimodal-fusion-analysis,
  .intelligent-interaction-suggestions,
  .interaction-quality-assessment {
    padding: 20px;
  }

  .modality-controls {
    grid-template-columns: 1fr;
  }

  .fusion-visualization {
    grid-template-columns: 1fr;
  }

  .suggestions-grid {
    grid-template-columns: 1fr;
  }

  .quality-metrics {
    grid-template-columns: 1fr;
  }

  .center-header,
  .fusion-header,
  .suggestions-header,
  .assessment-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .fusion-confidence {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
