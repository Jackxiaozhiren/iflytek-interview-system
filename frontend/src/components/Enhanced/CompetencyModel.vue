<template>
  <div class="competency-model enhanced-chart" :class="getSystemThemeClass()">
    <!-- 系统头部 -->
    <div class="system-header">
      <h2 class="system-title">
        <div class="chart-icon">
          <el-icon><Star /></el-icon>
        </div>
        胜任力评估模型
      </h2>
      <p class="system-subtitle">基于iFlytek Spark的AI+HR专家共建模型，覆盖30+能力素质项</p>
    </div>

    <!-- 模型选择器 -->
    <div class="model-selector">
      <h3>
        <el-icon><Cpu /></el-icon>
        选择评估模型
      </h3>
      <div class="models-grid grid grid-auto-fit-md grid-gap-lg">
        <div 
          v-for="model in competencyModels"
          :key="model.id"
          class="model-card"
          :class="[model.theme, { 'selected': selectedModel === model.id }]"
          @click="selectModel(model)"
        >
          <div class="model-header">
            <div class="model-icon multimodal-icon" :class="model.iconClass">
              <el-icon><component :is="model.icon" /></el-icon>
            </div>
            <div class="model-info">
              <h4>{{ model.name }}</h4>
              <p>{{ model.description }}</p>
            </div>
          </div>
          
          <div class="model-stats">
            <div class="stat-row">
              <span>能力维度：</span>
              <strong>{{ model.dimensions }}项</strong>
            </div>
            <div class="stat-row">
              <span>准确率：</span>
              <strong>{{ model.accuracy }}%</strong>
            </div>
            <div class="stat-row">
              <span>适用岗位：</span>
              <strong>{{ model.positions }}+</strong>
            </div>
          </div>

          <div class="model-progress">
            <el-progress 
              :percentage="model.maturity" 
              :color="getMaturityColor(model.maturity)"
              :show-text="false"
              :stroke-width="6"
            />
            <span class="maturity-text">模型成熟度: {{ model.maturity }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 能力维度展示 -->
    <div class="competency-dimensions" v-if="currentModel">
      <h3>
        <el-icon><TrendCharts /></el-icon>
        {{ currentModel.name }} - 能力维度详情
      </h3>
      <div class="dimensions-container">
        <!-- 六维雷达图 -->
        <div class="radar-section">
          <div class="radar-chart-container">
            <svg class="competency-radar" viewBox="0 0 300 300">
              <!-- 网格线 -->
              <g class="radar-grid">
                <circle v-for="i in 5" :key="i" 
                        :cx="150" :cy="150" 
                        :r="i * 25" 
                        fill="none" 
                        stroke="#e2e8f0" 
                        stroke-width="1"/>
                <!-- 轴线 -->
                <line v-for="(dimension, index) in currentModel.dimensions" 
                      :key="index"
                      x1="150" y1="150"
                      :x2="150 + Math.cos((index * 60 - 90) * Math.PI / 180) * 125"
                      :y2="150 + Math.sin((index * 60 - 90) * Math.PI / 180) * 125"
                      stroke="#cbd5e0" 
                      stroke-width="1"/>
              </g>
              
              <!-- 数据区域 -->
              <polygon 
                :points="getRadarPoints()" 
                :fill="currentModel.color + '40'"
                :stroke="currentModel.color"
                stroke-width="2"
                class="radar-area"
              />
              
              <!-- 数据点 -->
              <circle v-for="(point, index) in getRadarPointsArray()" 
                      :key="index"
                      :cx="point.x" 
                      :cy="point.y" 
                      r="4"
                      :fill="currentModel.color"
                      stroke="white"
                      stroke-width="2"
                      class="radar-point"/>
            </svg>
            
            <!-- 维度标签 -->
            <div class="radar-labels">
              <div v-for="(dimension, index) in currentModel.dimensions" 
                   :key="index"
                   class="radar-label"
                   :style="getLabelPosition(index)">
                {{ dimension.name }}
              </div>
            </div>
          </div>
        </div>

        <!-- 维度详情列表 -->
        <div class="dimensions-list">
          <div 
            v-for="(dimension, index) in currentModel.dimensions"
            :key="dimension.id"
            class="dimension-item"
            :class="dimension.theme"
          >
            <div class="dimension-header">
              <div class="dimension-icon">
                <el-icon><component :is="dimension.icon" /></el-icon>
              </div>
              <div class="dimension-info">
                <h5>{{ dimension.name }}</h5>
                <p>{{ dimension.description }}</p>
              </div>
              <div class="dimension-score">
                <span class="score-value">{{ dimension.score }}</span>
                <span class="score-max">/10</span>
              </div>
            </div>
            
            <div class="dimension-progress">
              <el-progress 
                :percentage="dimension.score * 10" 
                :color="getDimensionColor(dimension.score)"
                :show-text="false"
                :stroke-width="8"
              />
            </div>
            
            <div class="dimension-details">
              <div class="detail-item">
                <span>权重：</span>
                <strong>{{ dimension.weight }}%</strong>
              </div>
              <div class="detail-item">
                <span>重要性：</span>
                <el-rate 
                  v-model="dimension.importance" 
                  disabled 
                  show-score 
                  text-color="#ff9900"
                  score-template="{value}"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 评估结果 -->
    <div class="assessment-results" v-if="currentModel">
      <h3>
        <el-icon><DataBoard /></el-icon>
        综合评估结果
      </h3>
      <div class="results-summary">
        <div class="overall-score">
          <div class="score-circle">
            <div class="score-number">{{ overallScore }}</div>
            <div class="score-label">综合得分</div>
          </div>
          <div class="score-level" :class="getScoreLevelClass()">
            {{ getScoreLevel() }}
          </div>
        </div>
        
        <div class="score-breakdown">
          <h4>得分分解</h4>
          <div class="breakdown-items">
            <div v-for="category in scoreBreakdown" :key="category.name" class="breakdown-item">
              <span class="category-name">{{ category.name }}</span>
              <div class="category-bar">
                <div 
                  class="category-fill"
                  :style="{ width: category.percentage + '%', background: category.color }"
                ></div>
              </div>
              <span class="category-score">{{ category.score }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>



    <!-- 操作按钮 -->
    <div class="action-buttons">
      <el-button type="primary" size="large" @click="startAssessment" :loading="isAssessing">
        <el-icon><VideoPlay /></el-icon>
        开始评估
      </el-button>
      <el-button size="large" @click="exportReport">
        <el-icon><Download /></el-icon>
        导出报告
      </el-button>
      <el-button size="large" @click="customizeModel">
        <el-icon><Setting /></el-icon>
        自定义模型
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  Star, Cpu, TrendCharts, Grid, Promotion, VideoPlay, Download, Setting, User, Connection, Document, Timer, Trophy
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 响应式数据
const selectedModel = ref(1)
const isAssessing = ref(false)

// 胜任力模型
const competencyModels = ref([
  {
    id: 1,
    name: 'AI技术专家模型',
    description: '专为AI技术岗位设计的综合能力评估模型',
    icon: 'Cpu',
    iconClass: 'ai-icon pulse',
    theme: 'ai-theme',
    color: '#0066cc',
    dimensions: 6,
    accuracy: 96.8,
    positions: 150,
    maturity: 95,
    dimensions: [
      { id: 1, name: '技术能力', description: '编程技能、算法理解、技术深度', score: 8.5, weight: 25, importance: 5, icon: 'Cpu', theme: 'ai-theme' },
      { id: 2, name: '沟通表达', description: '语言表达、逻辑清晰、团队协作', score: 7.2, weight: 20, importance: 4, icon: 'User', theme: 'bigdata-theme' },
      { id: 3, name: '逻辑思维', description: '问题分析、解决方案、思维敏捷', score: 8.8, weight: 20, importance: 5, icon: 'Connection', theme: 'iot-theme' },
      { id: 4, name: '创新能力', description: '创新思维、技术前瞻、解决复杂问题', score: 7.6, weight: 15, importance: 4, icon: 'Star', theme: 'interview-theme' },
      { id: 5, name: '学习能力', description: '快速学习、适应变化、持续成长', score: 8.1, weight: 10, importance: 4, icon: 'Document', theme: 'ai-theme' },
      { id: 6, name: '团队协作', description: '团队合作、领导力、项目管理', score: 6.9, weight: 10, importance: 3, icon: 'Trophy', theme: 'bigdata-theme' }
    ]
  },
  {
    id: 2,
    name: '大数据工程师模型',
    description: '针对大数据处理和分析岗位的专业评估',
    icon: 'DataBoard',
    iconClass: 'bigdata-icon',
    theme: 'bigdata-theme',
    color: '#059669',
    dimensions: 6,
    accuracy: 94.2,
    positions: 120,
    maturity: 88,
    dimensions: [
      { id: 1, name: '数据处理', description: '数据清洗、ETL、数据建模', score: 8.2, weight: 30, importance: 5, icon: 'DataBoard', theme: 'bigdata-theme' },
      { id: 2, name: '技术架构', description: '分布式系统、架构设计', score: 7.8, weight: 25, importance: 5, icon: 'TrendCharts', theme: 'ai-theme' },
      { id: 3, name: '业务理解', description: '业务需求、数据价值挖掘', score: 7.1, weight: 15, importance: 4, icon: 'Document', theme: 'iot-theme' },
      { id: 4, name: '工具熟练度', description: 'Hadoop、Spark等工具使用', score: 8.6, weight: 15, importance: 4, icon: 'Setting', theme: 'interview-theme' },
      { id: 5, name: '问题解决', description: '性能优化、故障排查', score: 7.9, weight: 10, importance: 4, icon: 'Connection', theme: 'ai-theme' },
      { id: 6, name: '沟通协调', description: '跨部门协作、需求沟通', score: 6.8, weight: 5, importance: 3, icon: 'User', theme: 'bigdata-theme' }
    ]
  }
])

// 计算属性
const currentModel = computed(() => {
  return competencyModels.value.find(model => model.id === selectedModel.value)
})

const overallScore = computed(() => {
  if (!currentModel.value) return 0
  const weightedSum = currentModel.value.dimensions.reduce((sum, dim) => {
    return sum + (dim.score * dim.weight / 100)
  }, 0)
  return Math.round(weightedSum * 10) / 10
})

const scoreBreakdown = computed(() => {
  if (!currentModel.value) return []
  return [
    { name: '技术能力', score: 8.5, percentage: 85, color: '#0066cc' },
    { name: '软技能', score: 7.2, percentage: 72, color: '#059669' },
    { name: '经验匹配', score: 8.1, percentage: 81, color: '#ea580c' },
    { name: '发展潜力', score: 7.6, percentage: 76, color: '#7c3aed' }
  ]
})

const improvementSuggestions = ref([
  {
    id: 1,
    title: '加强沟通表达能力',
    description: '建议参加技术分享会，提升技术表达和团队协作能力',
    priority: 'high',
    icon: 'User'
  },
  {
    id: 2,
    title: '深化业务理解',
    description: '建议多参与业务需求讨论，提升业务敏感度',
    priority: 'medium',
    icon: 'Document'
  },
  {
    id: 3,
    title: '扩展技术栈',
    description: '建议学习新兴技术，保持技术前瞻性',
    priority: 'low',
    icon: 'Cpu'
  }
])

// 方法
const getSystemThemeClass = () => {
  return 'chart-interview-theme'
}

const getMaturityColor = (maturity) => {
  if (maturity >= 90) return '#10b981'
  if (maturity >= 70) return '#f59e0b'
  return '#ef4444'
}

const getDimensionColor = (score) => {
  if (score >= 8) return '#10b981'
  if (score >= 6) return '#f59e0b'
  return '#ef4444'
}

const getScoreLevelClass = () => {
  const score = overallScore.value
  if (score >= 8.5) return 'excellent'
  if (score >= 7.5) return 'good'
  if (score >= 6.5) return 'average'
  return 'below-average'
}

const getScoreLevel = () => {
  const score = overallScore.value
  if (score >= 8.5) return '优秀'
  if (score >= 7.5) return '良好'
  if (score >= 6.5) return '一般'
  return '待提升'
}

const getPriorityType = (priority) => {
  const typeMap = {
    'high': 'danger',
    'medium': 'warning',
    'low': 'info'
  }
  return typeMap[priority] || 'info'
}

const getPriorityText = (priority) => {
  const textMap = {
    'high': '高优先级',
    'medium': '中优先级',
    'low': '低优先级'
  }
  return textMap[priority] || '普通'
}

const getRadarPoints = () => {
  if (!currentModel.value) return ''
  return currentModel.value.dimensions.map((dim, index) => {
    const angle = (index * 60 - 90) * Math.PI / 180
    const radius = (dim.score / 10) * 125
    const x = 150 + Math.cos(angle) * radius
    const y = 150 + Math.sin(angle) * radius
    return `${x},${y}`
  }).join(' ')
}

const getRadarPointsArray = () => {
  if (!currentModel.value) return []
  return currentModel.value.dimensions.map((dim, index) => {
    const angle = (index * 60 - 90) * Math.PI / 180
    const radius = (dim.score / 10) * 125
    return {
      x: 150 + Math.cos(angle) * radius,
      y: 150 + Math.sin(angle) * radius
    }
  })
}

const getLabelPosition = (index) => {
  const angle = (index * 60 - 90) * Math.PI / 180
  const radius = 140
  const x = 150 + Math.cos(angle) * radius
  const y = 150 + Math.sin(angle) * radius
  return {
    left: `${(x / 300) * 100}%`,
    top: `${(y / 300) * 100}%`,
    transform: 'translate(-50%, -50%)'
  }
}

const selectModel = (model) => {
  selectedModel.value = model.id
  ElMessage.success(`已选择${model.name}`)
}

const startAssessment = () => {
  isAssessing.value = true
  ElMessage.success('正在启动胜任力评估...')
  
  setTimeout(() => {
    isAssessing.value = false
    ElMessage.success('评估完成！')
  }, 3000)
}

const exportReport = () => {
  ElMessage.success('正在生成胜任力评估报告...')
}

const customizeModel = () => {
  ElMessage.info('打开模型自定义面板...')
}
</script>

<style scoped>
.competency-model {
  padding: 2rem;
  margin: 2rem 0;
}

.system-header {
  text-align: center;
  margin-bottom: 3rem;
}

.system-title {
  font-size: 2rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.system-subtitle {
  color: #64748b;
  font-size: 1.1rem;
}

.model-selector,
.competency-dimensions,
.assessment-results,
.improvement-suggestions {
  margin-bottom: 3rem;
}

.model-selector h3,
.competency-dimensions h3,
.assessment-results h3,
.improvement-suggestions h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.model-card {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 2px solid transparent;
  cursor: pointer;
}

.model-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.model-card.selected {
  border-color: var(--theme-primary);
  box-shadow: 0 8px 25px var(--theme-shadow);
}

.model-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.model-info {
  flex: 1;
}

.model-info h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.model-info p {
  color: #64748b;
  font-size: 0.9rem;
}

.model-stats {
  margin-bottom: 1rem;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.model-progress {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.maturity-text {
  font-size: 0.8rem;
  color: #64748b;
  white-space: nowrap;
}

.dimensions-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

.radar-section {
  display: flex;
  justify-content: center;
}

.radar-chart-container {
  position: relative;
  width: 300px;
  height: 300px;
}

.competency-radar {
  width: 100%;
  height: 100%;
}

.radar-labels {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.radar-label {
  position: absolute;
  font-size: 0.8rem;
  font-weight: 500;
  color: #4a5568;
  background: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
}

.dimension-item {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-left: 4px solid var(--theme-primary);
}

.dimension-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.dimension-info {
  flex: 1;
}

.dimension-info h5 {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.dimension-info p {
  color: #64748b;
  font-size: 0.8rem;
}

.dimension-score {
  text-align: right;
}

.score-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--theme-primary);
}

.score-max {
  color: #64748b;
  font-size: 0.9rem;
}

.dimension-progress {
  margin: 0.5rem 0;
}

.dimension-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
}

.results-summary {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 3rem;
  align-items: center;
}

.overall-score {
  text-align: center;
}

.score-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-secondary) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  margin: 0 auto 1rem;
}

.score-number {
  font-size: 2rem;
  font-weight: 700;
}

.score-label {
  font-size: 0.8rem;
}

.score-level {
  font-size: 1.1rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 20px;
}

.score-level.excellent {
  background: #dcfce7;
  color: #166534;
}

.score-level.good {
  background: #fef3c7;
  color: #92400e;
}

.score-level.average {
  background: #dbeafe;
  color: #1e40af;
}

.score-level.below-average {
  background: #fee2e2;
  color: #991b1b;
}

.breakdown-items {
  space-y: 1rem;
}

.breakdown-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.category-name {
  width: 80px;
  font-size: 0.9rem;
}

.category-bar {
  flex: 1;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.category-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.category-score {
  width: 40px;
  text-align: right;
  font-weight: 600;
}

.suggestion-item {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #64748b;
}

.suggestion-item.high {
  border-left-color: #ef4444;
}

.suggestion-item.medium {
  border-left-color: #f59e0b;
}

.suggestion-item.low {
  border-left-color: #06b6d4;
}

.suggestion-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.suggestion-content {
  flex: 1;
}

.suggestion-content h5 {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.suggestion-content p {
  color: #64748b;
  font-size: 0.9rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .dimensions-container,
  .results-summary {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>
