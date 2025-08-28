<template>
  <div class="text-primary-analysis-panel">
    <!-- 分析模式指示器 -->
    <div class="analysis-mode-header">
      <div class="mode-info">
        <el-icon class="mode-icon"><Document /></el-icon>
        <h3>文本优先分析</h3>
        <span class="mode-badge">Text Primary</span>
      </div>
      <div class="analysis-status" :class="{ active: isAnalyzing }">
        <div class="status-dot"></div>
        <span>{{ isAnalyzing ? '分析中...' : '待机' }}</span>
      </div>
    </div>

    <!-- 综合评分概览 -->
    <div class="score-overview-section">
      <div class="section-header">
        <el-icon><TrendCharts /></el-icon>
        <h4>综合评分</h4>
        <span class="last-updated">{{ lastUpdated }}</span>
      </div>
      
      <div class="score-display">
        <div class="overall-score">
          <div class="score-circle">
            <div class="score-number">{{ overallScore }}</div>
            <div class="score-label">总分</div>
          </div>
        </div>
        
        <div class="score-breakdown">
          <div class="score-item">
            <div class="score-header">
              <span class="score-name">技术能力</span>
              <span class="score-value">{{ technicalScore }}</span>
            </div>
            <div class="score-bar">
              <div class="score-fill technical" :style="{ width: technicalScore + '%' }"></div>
            </div>
          </div>
          
          <div class="score-item">
            <div class="score-header">
              <span class="score-name">沟通技巧</span>
              <span class="score-value">{{ communicationScore }}</span>
            </div>
            <div class="score-bar">
              <div class="score-fill communication" :style="{ width: communicationScore + '%' }"></div>
            </div>
          </div>
          
          <div class="score-item">
            <div class="score-header">
              <span class="score-name">内容质量</span>
              <span class="score-value">{{ contentQuality }}</span>
            </div>
            <div class="score-bar">
              <div class="score-fill content" :style="{ width: contentQuality + '%' }"></div>
            </div>
          </div>
          
          <div class="score-item">
            <div class="score-header">
              <span class="score-name">逻辑结构</span>
              <span class="score-value">{{ logicalStructure }}</span>
            </div>
            <div class="score-bar">
              <div class="score-fill logical" :style="{ width: logicalStructure + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 文本分析详情 -->
    <div class="text-analysis-section">
      <div class="section-header">
        <el-icon><Document /></el-icon>
        <h4>文本分析详情</h4>
        <el-button size="small" @click="refreshAnalysis" :loading="isAnalyzing">
          刷新分析
        </el-button>
      </div>
      
      <div class="analysis-content">
        <!-- 关键词云 -->
        <div class="keywords-cloud">
          <div class="keywords-header">
            <span class="keywords-title">技术关键词</span>
            <span class="keywords-count">{{ extractedKeywords.length }} 个</span>
          </div>
          <div class="keywords-container">
            <span v-for="keyword in extractedKeywords" 
                  :key="keyword.word" 
                  class="keyword-tag"
                  :style="{ fontSize: keyword.size + 'px', opacity: keyword.weight }">
              {{ keyword.word }}
            </span>
          </div>
        </div>
        
        <!-- 文本质量指标 -->
        <div class="text-metrics">
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-icon">
                <el-icon><Reading /></el-icon>
              </div>
              <div class="metric-info">
                <div class="metric-value">{{ textComplexity }}</div>
                <div class="metric-label">复杂度</div>
              </div>
            </div>
            
            <div class="metric-card">
              <div class="metric-icon">
                <el-icon><ChatDotRound /></el-icon>
              </div>
              <div class="metric-info">
                <div class="metric-value">{{ sentimentScore }}</div>
                <div class="metric-label">情感倾向</div>
              </div>
            </div>
            
            <div class="metric-card">
              <div class="metric-icon">
                <el-icon><Star /></el-icon>
              </div>
              <div class="metric-info">
                <div class="metric-value">{{ professionalTerms }}</div>
                <div class="metric-label">专业术语</div>
              </div>
            </div>
            
            <div class="metric-card">
              <div class="metric-icon">
                <el-icon><Connection /></el-icon>
              </div>
              <div class="metric-info">
                <div class="metric-value">{{ coherenceScore }}</div>
                <div class="metric-label">连贯性</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>



    <!-- 分析历史趋势 -->
    <div class="analysis-trend-section">
      <div class="section-header">
        <el-icon><TrendCharts /></el-icon>
        <h4>表现趋势</h4>
      </div>
      
      <div class="trend-chart">
        <div class="trend-line">
          <div v-for="(point, index) in trendData" 
               :key="index" 
               class="trend-point"
               :style="{ 
                 left: (index / (trendData.length - 1)) * 100 + '%',
                 bottom: point.score + '%'
               }"
               :title="`问题${index + 1}: ${point.score}分`">
          </div>
        </div>
        <div class="trend-labels">
          <span class="trend-label">问题1</span>
          <span class="trend-label">当前</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { 
  Document, TrendCharts, Reading, ChatLineRound, 
  Star, Connection, Microphone, Bulb, InfoFilled, DataLine 
} from '@element-plus/icons-vue'

// Props
const props = defineProps({
  analysisData: {
    type: Object,
    default: () => ({
      overallScore: 0,
      technicalCompetency: 0,
      communicationSkills: 0,
      contentQuality: 0,
      logicalStructure: 0,
      textAnalysis: null,
      audioAnalysis: null,
      lastUpdated: null
    })
  },
  voiceEnabled: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['refresh-analysis', 'generate-recommendations'])

// 响应式数据
const isAnalyzing = ref(false)

// 计算属性
const overallScore = computed(() => props.analysisData.overallScore || 0)
const technicalScore = computed(() => props.analysisData.technicalCompetency || 0)
const communicationScore = computed(() => props.analysisData.communicationSkills || 0)
const contentQuality = computed(() => props.analysisData.contentQuality || 0)
const logicalStructure = computed(() => props.analysisData.logicalStructure || 0)

const lastUpdated = computed(() => {
  return props.analysisData.lastUpdated ? 
    `更新于 ${props.analysisData.lastUpdated}` : 
    '暂未分析'
})

// 文本分析相关
const extractedKeywords = computed(() => {
  const keywords = props.analysisData.textAnalysis?.keywords || []
  return keywords.map((word, index) => ({
    word,
    size: 12 + Math.random() * 8,
    weight: 0.6 + Math.random() * 0.4
  }))
})

const textComplexity = computed(() => {
  return props.analysisData.textAnalysis?.complexity || '适中'
})

const sentimentScore = computed(() => {
  return props.analysisData.textAnalysis?.sentiment || '积极'
})

const professionalTerms = computed(() => {
  return props.analysisData.textAnalysis?.professionalTerms || 0
})

const coherenceScore = computed(() => {
  return props.analysisData.textAnalysis?.coherence || '良好'
})



// 趋势数据
const trendData = ref([
  { score: 75 },
  { score: 82 },
  { score: 78 },
  { score: 85 }
])

// 方法
const refreshAnalysis = () => {
  isAnalyzing.value = true
  emit('refresh-analysis')
  setTimeout(() => {
    isAnalyzing.value = false
  }, 2000)
}



// 监听分析数据变化
watch(() => props.analysisData, (newData) => {
  if (newData.overallScore > 0) {
    // 更新趋势数据
    trendData.value.push({ score: newData.overallScore })
    if (trendData.value.length > 10) {
      trendData.value.shift()
    }
  }
}, { deep: true })
</script>

<style scoped>
.text-primary-analysis-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.analysis-mode-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.mode-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mode-icon {
  color: #1890ff;
  font-size: 20px;
}

.mode-info h3 {
  margin: 0;
  color: #262626;
  font-size: 18px;
}

.mode-badge {
  padding: 4px 8px;
  background: #e6f7ff;
  color: #1890ff;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.analysis-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #8c8c8c;
}

.analysis-status.active {
  color: #1890ff;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #d9d9d9;
  transition: all 0.3s;
}

.analysis-status.active .status-dot {
  background: #1890ff;
  box-shadow: 0 0 8px rgba(24, 144, 255, 0.5);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-header h4 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  color: #262626;
  font-size: 16px;
}

.last-updated {
  font-size: 12px;
  color: #8c8c8c;
}

.score-display {
  display: flex;
  gap: 24px;
  align-items: center;
}

.overall-score {
  flex-shrink: 0;
}

.score-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1890ff, #40a9ff);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
}

.score-number {
  font-size: 28px;
  font-weight: bold;
  line-height: 1;
}

.score-label {
  font-size: 12px;
  opacity: 0.9;
}

.score-breakdown {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.score-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.score-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.score-name {
  font-size: 14px;
  color: #262626;
}

.score-value {
  font-size: 14px;
  font-weight: 500;
  color: #1890ff;
}

.score-bar {
  height: 6px;
  background: #f5f5f5;
  border-radius: 3px;
  overflow: hidden;
}

.score-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s;
}

.score-fill.technical {
  background: linear-gradient(90deg, #1890ff, #40a9ff);
}

.score-fill.communication {
  background: linear-gradient(90deg, #52c41a, #73d13d);
}

.score-fill.content {
  background: linear-gradient(90deg, #fa8c16, #ffa940);
}

.score-fill.logical {
  background: linear-gradient(90deg, #722ed1, #9254de);
}

.keywords-cloud {
  margin-bottom: 20px;
}

.keywords-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.keywords-title {
  font-weight: 500;
  color: #262626;
}

.keywords-count {
  font-size: 12px;
  color: #8c8c8c;
}

.keywords-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  min-height: 60px;
}

.keyword-tag {
  padding: 4px 8px;
  background: #e6f7ff;
  color: #1890ff;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.3s;
}

.keyword-tag:hover {
  background: #1890ff;
  color: white;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.metric-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #fafafa;
  border-radius: 8px;
}

.metric-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e6f7ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1890ff;
}

.metric-info {
  flex: 1;
}

.metric-value {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  line-height: 1;
}

.metric-label {
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 2px;
}

.voice-metrics-simple {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.voice-metric {
  display: flex;
  align-items: center;
  gap: 12px;
}

.metric-label {
  width: 60px;
  font-size: 14px;
  color: #262626;
}

.metric-bar-simple {
  flex: 1;
  height: 6px;
  background: #f5f5f5;
  border-radius: 3px;
  overflow: hidden;
}

.metric-fill-simple {
  height: 100%;
  background: linear-gradient(90deg, #1890ff, #40a9ff);
  border-radius: 3px;
  transition: width 0.3s;
}

.metric-value-simple {
  width: 50px;
  text-align: right;
  font-size: 14px;
  font-weight: 500;
  color: #262626;
}

.metric-display {
  flex: 1;
  text-align: center;
}

.recommendations-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recommendation-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: #f6ffed;
  border-radius: 8px;
  border-left: 3px solid #52c41a;
}

.recommendation-icon {
  color: #52c41a;
  margin-top: 2px;
}

.recommendation-text {
  flex: 1;
  color: #262626;
  line-height: 1.5;
}

.no-recommendations {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px;
  color: #8c8c8c;
  font-size: 14px;
}

.trend-chart {
  position: relative;
  height: 80px;
  background: #fafafa;
  border-radius: 8px;
  padding: 16px;
}

.trend-line {
  position: relative;
  height: 40px;
  border-bottom: 1px solid #d9d9d9;
}

.trend-point {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #1890ff;
  border-radius: 50%;
  transform: translate(-50%, 50%);
  cursor: pointer;
}

.trend-point:hover {
  background: #40a9ff;
  transform: translate(-50%, 50%) scale(1.2);
}

.trend-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
}

.trend-label {
  font-size: 12px;
  color: #8c8c8c;
}
</style>
