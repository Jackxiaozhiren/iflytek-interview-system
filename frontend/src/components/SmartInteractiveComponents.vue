<template>
  <div class="smart-components">
    <!-- 智能按钮组件 -->
    <div class="component-section">
      <h3 class="section-title">智能按钮系统</h3>
      <div class="smart-buttons">
        <!-- 主要操作按钮 - 根据面试状态动态变化 -->
        <el-button 
          :type="primaryButton.type"
          :size="primaryButton.size"
          :loading="primaryButton.loading"
          :disabled="primaryButton.disabled"
          @click="handlePrimaryAction"
          class="primary-action-btn"
        >
          <el-icon>
            <component :is="primaryButton.icon" />
          </el-icon>
          {{ primaryButton.text }}
        </el-button>

        <!-- 辅助操作按钮 -->
        <el-button 
          v-for="button in secondaryButtons" 
          :key="button.id"
          :type="button.type"
          :size="button.size"
          :disabled="button.disabled"
          @click="handleSecondaryAction(button)"
          class="secondary-action-btn"
        >
          <el-icon>
            <component :is="button.icon" />
          </el-icon>
          {{ button.text }}
          <el-badge v-if="button.badge" :value="button.badge" class="button-badge" />
        </el-button>
      </div>
    </div>

    <!-- 智能图表组件 -->
    <div class="component-section">
      <h3 class="section-title">动态数据图表</h3>
      <el-row :gutter="24">
        <!-- 技能雷达图 -->
        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
              <div class="chart-header">
                <span>技能评估雷达图</span>
                <el-dropdown @command="handleRadarAction">
                  <el-button size="small" text>
                    <el-icon><MoreFilled /></el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="export">导出图表</el-dropdown-item>
                      <el-dropdown-item command="fullscreen">全屏查看</el-dropdown-item>
                      <el-dropdown-item command="compare">对比分析</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </template>
            <VChart :option="skillRadarOption" class="radar-chart" />
            <div class="chart-insights">
              <div class="insight-item" v-for="insight in radarInsights" :key="insight.id">
                <el-icon :style="{ color: insight.color }">
                  <component :is="insight.icon" />
                </el-icon>
                <span>{{ insight.text }}</span>
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- 表现趋势图 -->
        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
              <div class="chart-header">
                <span>表现趋势分析</span>
                <el-segmented 
                  v-model="trendPeriod" 
                  :options="trendPeriodOptions"
                  size="small"
                  @change="updateTrendChart"
                />
              </div>
            </template>
            <VChart :option="trendChartOption" class="trend-chart" />
            <div class="trend-summary">
              <div class="summary-item">
                <span class="summary-label">趋势方向:</span>
                <el-tag :type="trendDirection.type" size="small">
                  <el-icon><component :is="trendDirection.icon" /></el-icon>
                  {{ trendDirection.text }}
                </el-tag>
              </div>
              <div class="summary-item">
                <span class="summary-label">改进幅度:</span>
                <span class="summary-value" :style="{ color: improvementColor }">
                  {{ improvementPercentage }}%
                </span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 智能提示系统 -->
    <div class="component-section">
      <h3 class="section-title">个性化智能提示</h3>
      <div class="smart-hints">
        <div 
          v-for="hint in personalizedHints" 
          :key="hint.id"
          class="hint-card"
          :class="hint.priority"
        >
          <div class="hint-header">
            <div class="hint-icon" :style="{ background: hint.color + '20', color: hint.color }">
              <el-icon>
                <component :is="hint.icon" />
              </el-icon>
            </div>
            <div class="hint-meta">
              <div class="hint-title">{{ hint.title }}</div>
              <div class="hint-category">{{ hint.category }}</div>
            </div>
            <div class="hint-actions">
              <el-button size="small" text @click="applyHint(hint)">
                <el-icon><Check /></el-icon>
                应用
              </el-button>
              <el-button size="small" text @click="dismissHint(hint)">
                <el-icon><Close /></el-icon>
                忽略
              </el-button>
            </div>
          </div>
          <div class="hint-content">
            <p>{{ hint.description }}</p>
            <div class="hint-example" v-if="hint.example">
              <strong>示例:</strong> {{ hint.example }}
            </div>
          </div>
          <div class="hint-footer">
            <div class="hint-confidence">
              <span>置信度: </span>
              <el-progress 
                :percentage="hint.confidence" 
                :show-text="false" 
                :stroke-width="4"
                class="confidence-bar"
              />
              <span class="confidence-value">{{ hint.confidence }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 智能控件组 -->
    <div class="component-section">
      <h3 class="section-title">自适应控件</h3>
      <div class="smart-controls">
        <!-- 难度调节器 -->
        <el-card class="control-card">
          <template #header>
            <span>面试难度调节</span>
          </template>
          <div class="difficulty-control">
            <el-slider
              v-model="interviewDifficulty"
              :min="1"
              :max="5"
              :marks="difficultyMarks"
              :format-tooltip="formatDifficultyTooltip"
              @change="handleDifficultyChange"
              class="difficulty-slider"
            />
            <div class="difficulty-description">
              {{ difficultyDescription }}
            </div>
          </div>
        </el-card>

        <!-- 学习偏好设置 -->
        <el-card class="control-card">
          <template #header>
            <span>学习偏好</span>
          </template>
          <div class="preference-control">
            <el-radio-group v-model="learningPreference" @change="handlePreferenceChange">
              <el-radio-button
                v-for="pref in learningPreferences"
                :key="pref.value"
                :value="pref.value"
              >
                <el-icon><component :is="pref.icon" /></el-icon>
                {{ pref.label }}
              </el-radio-button>
            </el-radio-group>
            <div class="preference-description">
              {{ preferenceDescription }}
            </div>
          </div>
        </el-card>

        <!-- 反馈频率控制 -->
        <el-card class="control-card">
          <template #header>
            <span>反馈频率</span>
          </template>
          <div class="feedback-control">
            <el-switch
              v-model="realTimeFeedback"
              active-text="实时反馈"
              inactive-text="阶段反馈"
              @change="handleFeedbackModeChange"
            />
            <el-input-number
              v-model="feedbackInterval"
              :min="1"
              :max="10"
              :disabled="!realTimeFeedback"
              @change="handleIntervalChange"
              class="interval-input"
            />
            <span class="interval-unit">分钟</span>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 智能状态指示器 -->
    <div class="component-section">
      <h3 class="section-title">实时状态监控</h3>
      <div class="status-indicators">
        <div 
          v-for="indicator in statusIndicators" 
          :key="indicator.id"
          class="status-card"
          :class="indicator.status"
        >
          <div class="status-icon">
            <el-icon :size="24">
              <component :is="indicator.icon" />
            </el-icon>
          </div>
          <div class="status-info">
            <div class="status-label">{{ indicator.label }}</div>
            <div class="status-value">{{ indicator.value }}</div>
            <div class="status-trend" :class="indicator.trend">
              <el-icon><component :is="indicator.trendIcon" /></el-icon>
              {{ indicator.trendText }}
            </div>
          </div>
          <div class="status-action" v-if="indicator.actionable">
            <el-button size="small" @click="handleStatusAction(indicator)">
              {{ indicator.actionText }}
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useIntervieweeStore } from '@/stores/intervieweeStore.js'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { RadarChart, LineChart } from 'echarts/charts'
import { 
  TitleComponent, 
  TooltipComponent, 
  LegendComponent,
  GridComponent 
} from 'echarts/components'
import {
  VideoPlay, Document, Setting, Refresh, MoreFilled, Check, Close,
  TrendCharts, ArrowUp, ArrowDown, Star, Warning, InfoFilled,
  Eye, Headset, Timer, Signal, Cpu, Network, Battery
} from '@element-plus/icons-vue'

// 注册ECharts组件
use([
  CanvasRenderer,
  RadarChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

const interviewee = useIntervieweeStore()

// 响应式数据
const trendPeriod = ref('week')
const interviewDifficulty = ref(3)
const learningPreference = ref('visual')
const realTimeFeedback = ref(true)
const feedbackInterval = ref(5)

// 主要操作按钮 - 根据面试状态动态变化
const primaryButton = computed(() => {
  const stage = interviewee.interviewProgress.currentStage
  const completion = interviewee.completionRate
  
  if (stage === 'not_started') {
    return {
      text: '开始面试',
      type: 'primary',
      size: 'large',
      icon: 'VideoPlay',
      loading: false,
      disabled: false
    }
  } else if (stage === 'in_progress') {
    return {
      text: completion < 100 ? '继续面试' : '完成面试',
      type: 'primary',
      size: 'large',
      icon: completion < 100 ? 'VideoPlay' : 'Check',
      loading: false,
      disabled: false
    }
  } else if (stage === 'completed') {
    return {
      text: '查看报告',
      type: 'success',
      size: 'large',
      icon: 'Document',
      loading: false,
      disabled: false
    }
  }
  
  return {
    text: '重新开始',
    type: 'warning',
    size: 'large',
    icon: 'Refresh',
    loading: false,
    disabled: false
  }
})

// 辅助操作按钮
const secondaryButtons = computed(() => [
  {
    id: 'settings',
    text: '设置',
    type: 'default',
    size: 'default',
    icon: 'Setting',
    disabled: false,
    badge: null
  },
  {
    id: 'hints',
    text: 'AI提示',
    type: 'warning',
    size: 'default',
    icon: 'Star',
    disabled: interviewee.realtimeState.aiHintUsage >= 5,
    badge: 5 - interviewee.realtimeState.aiHintUsage
  },
  {
    id: 'practice',
    text: '模拟练习',
    type: 'info',
    size: 'default',
    icon: 'Document',
    disabled: false,
    badge: null
  }
])

// 技能雷达图配置
const skillRadarOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: (params) => {
      return `${params.name}: ${params.value}分`
    }
  },
  radar: {
    indicator: [
      { name: '专业知识', max: 100 },
      { name: '技能匹配', max: 100 },
      { name: '语言表达', max: 100 },
      { name: '逻辑思维', max: 100 },
      { name: '创新能力', max: 100 },
      { name: '抗压能力', max: 100 }
    ],
    radius: '70%',
    axisName: {
      color: '#666',
      fontSize: 12
    },
    splitLine: {
      lineStyle: {
        color: '#e6e6e6'
      }
    }
  },
  series: [{
    type: 'radar',
    data: [{
      value: [
        interviewee.skillAssessment.skillScores.professionalKnowledge,
        interviewee.skillAssessment.skillScores.skillMatching,
        interviewee.skillAssessment.skillScores.languageExpression,
        interviewee.skillAssessment.skillScores.logicalThinking,
        interviewee.skillAssessment.skillScores.innovationAbility,
        interviewee.skillAssessment.skillScores.stressResistance
      ],
      name: '当前能力',
      areaStyle: {
        color: interviewee.adaptiveUITheme.primary + '20'
      },
      lineStyle: {
        color: interviewee.adaptiveUITheme.primary,
        width: 2
      },
      symbol: 'circle',
      symbolSize: 6
    }]
  }]
}))

// 雷达图洞察
const radarInsights = computed(() => [
  {
    id: 1,
    icon: 'TrendCharts',
    color: '#52c41a',
    text: '专业知识是您的最大优势'
  },
  {
    id: 2,
    icon: 'Warning',
    color: '#faad14',
    text: '建议加强项目管理能力'
  }
])

// 趋势图配置
const trendPeriodOptions = [
  { label: '周', value: 'week' },
  { label: '月', value: 'month' },
  { label: '季', value: 'quarter' }
]

const trendChartOption = computed(() => {
  const history = interviewee.performanceHistory.scoreHistory
  return {
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        const data = params[0]
        return `${data.name}<br/>评分: ${data.value}分`
      }
    },
    xAxis: {
      type: 'category',
      data: history.map(item => item.date),
      axisLine: {
        lineStyle: {
          color: '#e6e6e6'
        }
      }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLine: {
        lineStyle: {
          color: '#e6e6e6'
        }
      }
    },
    series: [{
      type: 'line',
      data: history.map(item => item.score),
      smooth: true,
      lineStyle: {
        color: interviewee.adaptiveUITheme.primary,
        width: 3
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: interviewee.adaptiveUITheme.primary + '40'
          }, {
            offset: 1,
            color: interviewee.adaptiveUITheme.primary + '10'
          }]
        }
      },
      symbol: 'circle',
      symbolSize: 8
    }]
  }
})

// 趋势方向
const trendDirection = computed(() => {
  const trend = interviewee.performanceHistory.improvementTrend
  if (trend === 'upward') {
    return {
      type: 'success',
      icon: 'ArrowUp',
      text: '上升趋势'
    }
  } else if (trend === 'downward') {
    return {
      type: 'danger',
      icon: 'ArrowDown',
      text: '下降趋势'
    }
  }
  return {
    type: 'info',
    icon: 'TrendCharts',
    text: '稳定趋势'
  }
})

const improvementPercentage = computed(() => {
  const history = interviewee.performanceHistory.scoreHistory
  if (history.length < 2) return 0
  
  const latest = history[history.length - 1].score
  const previous = history[history.length - 2].score
  return Math.round(((latest - previous) / previous) * 100)
})

const improvementColor = computed(() => {
  const improvement = improvementPercentage.value
  return improvement > 0 ? '#52c41a' : improvement < 0 ? '#f5222d' : '#666'
})

// 个性化提示
const personalizedHints = computed(() => [
  {
    id: 1,
    title: '回答深度优化',
    category: '表达技巧',
    description: '您的回答逻辑清晰，但可以增加更多具体的项目案例来支撑观点',
    example: '可以描述具体的项目背景、遇到的挑战和解决方案',
    icon: 'Star',
    color: '#1890ff',
    priority: 'high',
    confidence: 85
  },
  {
    id: 2,
    title: '技术深度拓展',
    description: '建议在AI算法原理方面进行更深入的阐述',
    icon: 'Cpu',
    color: '#52c41a',
    priority: 'medium',
    confidence: 78
  }
])

// 难度标记
const difficultyMarks = {
  1: '入门',
  2: '初级',
  3: '中级',
  4: '高级',
  5: '专家'
}

const difficultyDescription = computed(() => {
  const descriptions = {
    1: '基础概念和简单应用，适合初学者',
    2: '常见技术问题，需要一定实践经验',
    3: '综合性问题，需要理论与实践结合',
    4: '复杂场景分析，需要深入理解',
    5: '前沿技术和创新思维，专家级挑战'
  }
  return descriptions[interviewDifficulty.value]
})

// 学习偏好
const learningPreferences = [
  { value: 'visual', label: '视觉', icon: 'Eye' },
  { value: 'auditory', label: '听觉', icon: 'Headset' },
  { value: 'reading', label: '阅读', icon: 'Document' }
]

const preferenceDescription = computed(() => {
  const descriptions = {
    visual: '通过图表、图像和视觉演示学习效果最佳',
    auditory: '通过语音讲解和讨论学习效果最佳',
    reading: '通过文字材料和文档学习效果最佳'
  }
  return descriptions[learningPreference.value]
})

// 状态指示器
const statusIndicators = computed(() => [
  {
    id: 'attention',
    label: '专注度',
    value: `${Math.round(interviewee.realtimeState.attentionLevel * 100)}%`,
    icon: 'Eye',
    status: interviewee.realtimeState.attentionLevel > 0.8 ? 'good' : 'warning',
    trend: 'up',
    trendIcon: 'ArrowUp',
    trendText: '保持良好',
    actionable: false
  },
  {
    id: 'engagement',
    label: '参与度',
    value: `${Math.round(interviewee.realtimeState.engagementScore * 100)}%`,
    icon: 'Signal',
    status: interviewee.realtimeState.engagementScore > 0.9 ? 'excellent' : 'good',
    trend: 'up',
    trendIcon: 'ArrowUp',
    trendText: '表现优秀',
    actionable: false
  },
  {
    id: 'connection',
    label: '网络状态',
    value: '稳定',
    icon: 'Network',
    status: 'good',
    trend: 'stable',
    trendIcon: 'TrendCharts',
    trendText: '连接正常',
    actionable: false
  }
])

// 方法
const handlePrimaryAction = () => {
  console.log('执行主要操作:', primaryButton.value.text)
}

const handleSecondaryAction = (button) => {
  console.log('执行辅助操作:', button.text)
}

const handleRadarAction = (command) => {
  console.log('雷达图操作:', command)
}

const updateTrendChart = (period) => {
  console.log('更新趋势图周期:', period)
}

const applyHint = (hint) => {
  console.log('应用提示:', hint.title)
}

const dismissHint = (hint) => {
  console.log('忽略提示:', hint.title)
}

const handleDifficultyChange = (value) => {
  console.log('难度调整:', value)
  interviewee.updateRealtimeState({
    preferredDifficulty: value
  })
}

const handlePreferenceChange = (value) => {
  console.log('学习偏好变更:', value)
}

const handleFeedbackModeChange = (value) => {
  console.log('反馈模式变更:', value)
}

const handleIntervalChange = (value) => {
  console.log('反馈间隔变更:', value)
}

const handleStatusAction = (indicator) => {
  console.log('状态操作:', indicator.label)
}

const formatDifficultyTooltip = (value) => {
  return difficultyMarks[value]
}

// 生命周期
onMounted(() => {
  console.log('智能交互组件已加载')
})

// 监听器
watch(() => interviewee.skillAssessment.overallScore, (newScore) => {
  console.log('技能评分更新，重新生成图表:', newScore)
})
</script>

<style scoped>
.smart-components {
  padding: 20px;
  background: #f5f7fa;
}

.component-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
}

.smart-buttons {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 24px;
}

.primary-action-btn {
  min-width: 140px;
}

.secondary-action-btn {
  position: relative;
}

.button-badge {
  position: absolute;
  top: -8px;
  right: -8px;
}

.chart-card {
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.radar-chart, .trend-chart {
  height: 300px;
}

.chart-insights {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.insight-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 13px;
}

.trend-summary {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.summary-label {
  font-size: 13px;
  color: #666;
}

.summary-value {
  font-weight: 600;
}

.smart-hints {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 16px;
}

.hint-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #1890ff;
}

.hint-card.high {
  border-left-color: #f5222d;
}

.hint-card.medium {
  border-left-color: #faad14;
}

.hint-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.hint-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hint-meta {
  flex: 1;
}

.hint-title {
  font-weight: 600;
  margin-bottom: 4px;
}

.hint-category {
  font-size: 12px;
  color: #666;
}

.hint-actions {
  display: flex;
  gap: 8px;
}

.hint-content p {
  margin: 0 0 8px 0;
  line-height: 1.5;
}

.hint-example {
  background: #f8f9fa;
  padding: 8px;
  border-radius: 6px;
  font-size: 13px;
  margin-top: 8px;
}

.hint-footer {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.hint-confidence {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.confidence-bar {
  flex: 1;
}

.confidence-value {
  font-weight: 600;
  color: #1890ff;
}

.smart-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.control-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.difficulty-control {
  padding: 20px 0;
}

.difficulty-slider {
  margin-bottom: 16px;
}

.difficulty-description {
  font-size: 13px;
  color: #666;
  text-align: center;
}

.preference-control {
  text-align: center;
}

.preference-description {
  margin-top: 12px;
  font-size: 13px;
  color: #666;
}

.feedback-control {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
}

.interval-input {
  width: 80px;
}

.interval-unit {
  font-size: 13px;
  color: #666;
}

.status-indicators {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.status-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
}

.status-card.good {
  border-left: 4px solid #52c41a;
}

.status-card.excellent {
  border-left: 4px solid #1890ff;
}

.status-card.warning {
  border-left: 4px solid #faad14;
}

.status-icon {
  color: #1890ff;
}

.status-info {
  flex: 1;
}

.status-label {
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;
}

.status-value {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 4px;
}

.status-trend {
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-trend.up {
  color: #52c41a;
}

.status-trend.down {
  color: #f5222d;
}

.status-trend.stable {
  color: #666;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .smart-buttons {
    flex-direction: column;
    align-items: stretch;
  }
  
  .smart-hints {
    grid-template-columns: 1fr;
  }
  
  .smart-controls {
    grid-template-columns: 1fr;
  }
  
  .status-indicators {
    grid-template-columns: 1fr;
  }
}
</style>
