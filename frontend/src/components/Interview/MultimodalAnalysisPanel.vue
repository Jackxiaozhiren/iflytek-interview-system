<template>
  <div class="multimodal-analysis-panel">
    <!-- 分析状态头部 -->
    <div class="analysis-header">
      <div class="header-left">
        <el-icon class="spark-icon"><Star /></el-icon>
        <h3>iFlytek星火多模态分析</h3>
        <div class="status-badge" :class="{ active: isAnalyzing }">
          {{ isAnalyzing ? '分析中' : '待机' }}
        </div>
      </div>
      <div class="header-right">
        <el-switch
          v-model="realTimeEnabled"
          active-text="实时分析"
          inactive-text="手动分析"
          @change="toggleRealTimeAnalysis"
        />
      </div>
    </div>

    <!-- 综合评分卡片 -->
    <div class="overall-score-card">
      <div class="score-display">
        <div class="score-number">{{ overallScore }}</div>
        <div class="score-label">综合评分</div>
      </div>
      <div class="score-breakdown">
        <div class="breakdown-item" v-for="metric in scoreMetrics" :key="metric.name">
          <span class="metric-name">{{ metric.name }}</span>
          <div class="metric-bar">
            <div 
              class="metric-fill" 
              :style="{ width: metric.score + '%', backgroundColor: metric.color }"
            ></div>
          </div>
          <span class="metric-score">{{ metric.score }}</span>
        </div>
      </div>
    </div>

    <!-- 多模态分析标签页 -->
    <el-tabs v-model="activeTab" class="analysis-tabs">




      <!-- 文本分析 -->
      <el-tab-pane label="文本分析" name="text">
        <div class="text-analysis">
          <div class="keywords-cloud">
            <h4>关键词分析</h4>
            <div class="keywords-container">
              <span 
                v-for="keyword in contentKeywords" 
                :key="keyword.word"
                class="keyword-tag"
                :style="{ fontSize: keyword.size + 'px' }"
              >
                {{ keyword.word }}
              </span>
            </div>
          </div>
          
          <div class="content-structure">
            <h4>内容结构分析</h4>
            <div class="structure-metrics">
              <div class="structure-item">
                <span class="structure-label">逻辑性</span>
                <el-progress :percentage="contentStructure.logic" :show-text="false" />
                <span class="structure-value">{{ contentStructure.logic }}%</span>
              </div>
              <div class="structure-item">
                <span class="structure-label">完整性</span>
                <el-progress :percentage="contentStructure.completeness" :show-text="false" />
                <span class="structure-value">{{ contentStructure.completeness }}%</span>
              </div>
              <div class="structure-item">
                <span class="structure-label">专业性</span>
                <el-progress :percentage="contentStructure.professionalism" :show-text="false" />
                <span class="structure-value">{{ contentStructure.professionalism }}%</span>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- AI建议和反馈 -->
    <div class="ai-feedback-section">
      <h4>
        <el-icon><Star /></el-icon>
        AI智能建议
      </h4>
      <div class="feedback-content">
        <div class="feedback-item" v-for="(feedback, index) in aiFeedback" :key="index">
          <div class="feedback-type">{{ feedback.type }}</div>
          <div class="feedback-text">{{ feedback.text }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { Star, View, User } from '@element-plus/icons-vue'

// Props
const props = defineProps({
  analysisData: {
    type: Object,
    default: () => ({})
  },
  isAnalyzing: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['toggle-real-time', 'request-analysis'])

// 响应式数据
const activeTab = ref('voice')
const realTimeEnabled = ref(true)

// 综合评分
const overallScore = computed(() => {
  return props.analysisData.overallScore || 85
})

// 评分指标
const scoreMetrics = computed(() => [
  { name: '技术能力', score: props.analysisData.technicalCompetency || 82, color: '#1890ff' },
  { name: '沟通技巧', score: props.analysisData.communicationSkills || 88, color: '#52c41a' },
  { name: '自信程度', score: props.analysisData.confidenceLevel || 79, color: '#722ed1' },
  { name: '综合表现', score: overallScore.value, color: '#fa8c16' }
])

// 语音指标
const voiceMetrics = ref({
  clarity: 88,
  speed: 180,
  volume: 75
})



// 关键词数据
const contentKeywords = ref([
  { word: '机器学习', size: 18 },
  { word: '深度学习', size: 16 },
  { word: '模型优化', size: 14 },
  { word: 'TensorFlow', size: 12 },
  { word: '算法', size: 15 },
  { word: '项目经验', size: 13 }
])

// 内容结构
const contentStructure = ref({
  logic: 85,
  completeness: 78,
  professionalism: 92
})

// AI反馈
const aiFeedback = ref([
  { type: '优势', text: '技术表达清晰，逻辑思维强' },
  { type: '建议', text: '可以增加更多具体的项目案例' },
  { type: '提醒', text: '注意语速，可以稍微放慢一些' }
])

// 方法
const toggleRealTimeAnalysis = (enabled) => {
  emit('toggle-real-time', enabled)
}

const getWaveHeight = (index) => {
  return Math.sin(index * 0.5 + Date.now() * 0.001) * 30 + 50
}

// 监听分析数据变化
watch(() => props.analysisData, (newData) => {
  if (newData.voiceAnalysis) {
    voiceMetrics.value = {
      clarity: newData.voiceAnalysis.clarity || 88,
      speed: newData.voiceAnalysis.speed || 180,
      volume: newData.voiceAnalysis.volume || 75
    }
  }
  

  
  if (newData.textAnalysis && newData.textAnalysis.keywords) {
    // 更新关键词
    contentKeywords.value = newData.textAnalysis.keywords.map((word, index) => ({
      word,
      size: 18 - index * 2
    }))
  }
}, { deep: true })

onMounted(() => {
  console.log('✅ 多模态分析面板已加载')
})
</script>

<style scoped>
.multimodal-analysis-panel {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.analysis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.spark-icon {
  color: #1890ff;
  font-size: 20px;
}

.header-left h3 {
  margin: 0;
  color: #262626;
  font-size: 18px;
  font-weight: 600;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  background: #f5f5f5;
  color: #8c8c8c;
  transition: all 0.3s;
}

.status-badge.active {
  background: #e6f7ff;
  color: #1890ff;
}

.overall-score-card {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.score-display {
  text-align: center;
}

.score-number {
  font-size: 48px;
  font-weight: bold;
  line-height: 1;
}

.score-label {
  font-size: 14px;
  opacity: 0.9;
  margin-top: 5px;
}

.score-breakdown {
  flex: 1;
}

.breakdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.metric-name {
  width: 80px;
  font-size: 14px;
}

.metric-bar {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  overflow: hidden;
}

.metric-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s;
}

.metric-score {
  width: 40px;
  text-align: right;
  font-size: 14px;
  font-weight: 500;
}

.analysis-tabs {
  margin-bottom: 20px;
}

.analysis-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.metric-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px;
  background: #fafafa;
  border-radius: 8px;
}

.metric-icon {
  font-size: 24px;
}

.metric-value {
  font-size: 20px;
  font-weight: bold;
  color: #262626;
}

.metric-label {
  font-size: 12px;
  color: #8c8c8c;
}

.voice-waveform {
  text-align: center;
}

.waveform-container {
  display: flex;
  align-items: end;
  justify-content: center;
  gap: 2px;
  height: 60px;
  margin-bottom: 10px;
}

.wave-bar {
  width: 3px;
  background: linear-gradient(to top, #1890ff, #40a9ff);
  border-radius: 2px;
  transition: height 0.1s;
}

.waveform-label {
  font-size: 12px;
  color: #8c8c8c;
}





.keywords-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.keyword-tag {
  padding: 6px 12px;
  background: #e6f7ff;
  color: #1890ff;
  border-radius: 16px;
  font-weight: 500;
  transition: all 0.3s;
}

.keyword-tag:hover {
  background: #bae7ff;
}

.structure-metrics {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.structure-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.structure-label {
  width: 80px;
  font-size: 14px;
}

.structure-value {
  width: 40px;
  text-align: right;
  font-size: 14px;
  font-weight: 500;
}

.ai-feedback-section h4 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
  color: #262626;
  font-size: 16px;
}

.feedback-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feedback-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 8px;
}

.feedback-type {
  padding: 2px 8px;
  background: #1890ff;
  color: white;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
}

.feedback-text {
  flex: 1;
  font-size: 14px;
  color: #595959;
}
</style>
