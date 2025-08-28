<template>
  <div class="personalized-dashboard">
    <!-- 个性化欢迎区域 -->
    <div class="welcome-section" :style="{ background: adaptiveTheme.gradient }">
      <div class="welcome-content">
        <div class="avatar-section">
          <el-avatar :size="80" :src="interviewee.basicInfo.avatar" class="user-avatar">
            <el-icon><User /></el-icon>
          </el-avatar>
          <div class="online-indicator" v-if="interviewee.realtimeState.isOnline"></div>
        </div>
        
        <div class="greeting-section">
          <h2 class="personalized-greeting">{{ interviewee.personalizedGreeting }}</h2>
          <div class="status-badges">
            <el-tag :type="skillLevelTag.type" size="large" class="skill-badge">
              {{ skillLevelTag.label }}
            </el-tag>
            <el-tag :color="adaptiveTheme.primary" size="large" class="domain-badge">
              {{ domainLabel }}
            </el-tag>
          </div>
        </div>
        
        <div class="progress-section">
          <div class="progress-info">
            <span class="progress-label">面试进度</span>
            <span class="progress-value">{{ interviewee.completionRate }}%</span>
          </div>
          <el-progress 
            :percentage="interviewee.completionRate" 
            :color="progressColor"
            :stroke-width="8"
            class="main-progress"
          />
        </div>
      </div>
    </div>

    <!-- 个性化仪表板网格 -->
    <div class="dashboard-grid">
      <!-- 实时表现卡片 -->
      <el-card class="dashboard-card performance-card">
        <template #header>
          <div class="card-header">
            <el-icon><TrendCharts /></el-icon>
            <span>实时表现</span>
          </div>
        </template>
        
        <div class="performance-metrics">
          <div class="metric-item">
            <div class="metric-value">{{ interviewee.skillAssessment.overallScore }}</div>
            <div class="metric-label">综合评分</div>
            <div class="metric-trend" :class="trendClass">
              <el-icon><ArrowUp v-if="isImproving" /><ArrowDown v-else /></el-icon>
              {{ trendText }}
            </div>
          </div>
          
          <div class="metric-item">
            <div class="metric-value">{{ interviewee.realtimeState.engagementScore * 100 }}%</div>
            <div class="metric-label">参与度</div>
          </div>
          
          <div class="metric-item">
            <div class="metric-value">{{ interviewee.realtimeState.attentionLevel * 100 }}%</div>
            <div class="metric-label">专注度</div>
          </div>
        </div>
      </el-card>

      <!-- 技能雷达图 -->
      <el-card class="dashboard-card skills-card">
        <template #header>
          <div class="card-header">
            <el-icon><Grid /></el-icon>
            <span>技能分析</span>
          </div>
        </template>
        
        <div class="skills-radar">
          <VChart :option="skillsRadarOption" class="radar-chart" />
        </div>
      </el-card>

      <!-- 个性化建议 -->
      <el-card class="dashboard-card recommendations-card">
        <template #header>
          <div class="card-header">
            <el-icon><MagicStick /></el-icon>
            <span>智能建议</span>
          </div>
        </template>
        
        <div class="recommendations-list">
          <div 
            v-for="tip in personalizedTips" 
            :key="tip.id"
            class="recommendation-item"
            :class="tip.priority"
          >
            <div class="recommendation-icon">
              <el-icon><Star /></el-icon>
            </div>
            <div class="recommendation-content">
              <div class="recommendation-title">{{ tip.title }}</div>
              <div class="recommendation-desc">{{ tip.description }}</div>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 学习路径 -->
      <el-card class="dashboard-card learning-card">
        <template #header>
          <div class="card-header">
            <el-icon><Reading /></el-icon>
            <span>学习路径</span>
          </div>
        </template>
        
        <div class="learning-path">
          <div 
            v-for="step in learningSteps" 
            :key="step.id"
            class="learning-step"
            :class="{ completed: step.completed, current: step.current }"
          >
            <div class="step-indicator">
              <el-icon v-if="step.completed"><CircleCheck /></el-icon>
              <el-icon v-else-if="step.current"><Clock /></el-icon>
              <span v-else class="step-number">{{ step.order }}</span>
            </div>
            <div class="step-content">
              <div class="step-title">{{ step.title }}</div>
              <div class="step-progress">
                <el-progress :percentage="step.progress" :show-text="false" :stroke-width="4" />
              </div>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 历史趋势 -->
      <el-card class="dashboard-card trend-card">
        <template #header>
          <div class="card-header">
            <el-icon><TrendCharts /></el-icon>
            <span>表现趋势</span>
          </div>
        </template>
        
        <div class="trend-chart">
          <VChart :option="trendChartOption" class="line-chart" />
        </div>
      </el-card>

      <!-- 快速操作 -->
      <el-card class="dashboard-card actions-card">
        <template #header>
          <div class="card-header">
            <el-icon><Operation /></el-icon>
            <span>快速操作</span>
          </div>
        </template>
        
        <div class="quick-actions">
          <el-button 
            v-for="action in quickActions" 
            :key="action.id"
            :type="action.type"
            :icon="action.icon"
            class="action-button"
            @click="handleQuickAction(action)"
          >
            {{ action.label }}
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useIntervieweeStore } from '@/stores/intervieweeStore.js'
import { useRealtimePersonalization } from '@/composables/useRealtimePersonalization.js'
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
  User, TrendCharts, ArrowUp, ArrowDown, Grid, MagicStick,
  Star, Reading, CircleCheck, Clock, Operation
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

// 使用面试者状态和实时个性化
const interviewee = useIntervieweeStore()
const { realtimeMetrics, uiAdaptation, triggerUIAdaptation } = useRealtimePersonalization()

// 计算属性
const adaptiveTheme = computed(() => interviewee.adaptiveUITheme)

const skillLevelTag = computed(() => {
  const level = interviewee.skillLevel
  return {
    type: level.level === 'expert' ? 'success' : 
          level.level === 'senior' ? 'primary' : 
          level.level === 'middle' ? 'warning' : 'info',
    label: level.label
  }
})

const domainLabel = computed(() => {
  const domainMap = {
    ai: 'AI人工智能',
    bigdata: '大数据',
    iot: '物联网',
    general: '综合技术'
  }
  return domainMap[interviewee.skillAssessment.technicalDomain] || '综合技术'
})

const progressColor = computed(() => {
  const rate = interviewee.completionRate
  if (rate >= 80) return '#52c41a'
  if (rate >= 60) return '#1890ff'
  if (rate >= 40) return '#faad14'
  return '#f5222d'
})

const isImproving = computed(() => {
  return interviewee.performanceHistory.improvementTrend === 'upward'
})

const trendClass = computed(() => ({
  'trend-up': isImproving.value,
  'trend-down': !isImproving.value
}))

const trendText = computed(() => {
  return isImproving.value ? '上升趋势' : '需要改进'
})

// 个性化提示
const personalizedTips = computed(() => [
  {
    id: 1,
    title: '回答深度建议',
    description: '建议在技术问题回答中增加更多实践案例',
    priority: 'high'
  },
  {
    id: 2,
    title: '沟通技巧',
    description: '可以适当放慢语速，让表达更加清晰',
    priority: 'medium'
  },
  {
    id: 3,
    title: '知识拓展',
    description: '建议了解最新的AI技术发展趋势',
    priority: 'low'
  }
])

// 学习步骤
const learningSteps = computed(() => [
  {
    id: 1,
    order: 1,
    title: '基础知识巩固',
    progress: 100,
    completed: true,
    current: false
  },
  {
    id: 2,
    order: 2,
    title: '项目实践经验',
    progress: 65,
    completed: false,
    current: true
  },
  {
    id: 3,
    order: 3,
    title: '高级技能提升',
    progress: 0,
    completed: false,
    current: false
  }
])

// 快速操作
const quickActions = computed(() => [
  {
    id: 'continue',
    label: interviewee.interviewProgress.currentStage === 'completed' ? '查看报告' : '继续面试',
    type: 'primary',
    icon: interviewee.interviewProgress.currentStage === 'completed' ? 'Document' : 'VideoPlay'
  },
  {
    id: 'practice',
    label: '模拟练习',
    type: 'success',
    icon: 'Reading'
  },
  {
    id: 'feedback',
    label: '获取反馈',
    type: 'warning',
    icon: 'ChatDotRound'
  }
])

// 技能雷达图配置
const skillsRadarOption = computed(() => ({
  tooltip: {
    trigger: 'item'
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
    radius: '60%',
    axisName: {
      color: '#666',
      fontSize: 12
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
        color: adaptiveTheme.value.primary + '20'
      },
      lineStyle: {
        color: adaptiveTheme.value.primary
      }
    }]
  }]
}))

// 趋势图配置
const trendChartOption = computed(() => ({
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: interviewee.performanceHistory.scoreHistory.map(item => item.date)
  },
  yAxis: {
    type: 'value',
    min: 0,
    max: 100
  },
  series: [{
    type: 'line',
    data: interviewee.performanceHistory.scoreHistory.map(item => item.score),
    smooth: true,
    lineStyle: {
      color: adaptiveTheme.value.primary
    },
    areaStyle: {
      color: adaptiveTheme.value.primary + '20'
    }
  }]
}))

// 快速操作处理
const handleQuickAction = (action) => {
  switch (action.id) {
    case 'continue':
      if (interviewee.interviewProgress.currentStage === 'completed') {
        // 跳转到报告页面
        console.log('跳转到报告页面')
      } else {
        // 继续面试
        console.log('继续面试')
      }
      break
    case 'practice':
      console.log('开始模拟练习')
      break
    case 'feedback':
      console.log('获取反馈')
      break
  }
}

// 生命周期
onMounted(() => {
  // 生成个性化推荐
  interviewee.generatePersonalizedRecommendations()
})

// 监听状态变化
watch(() => interviewee.skillAssessment.overallScore, (newScore) => {
  console.log('综合评分更新:', newScore)
})
</script>

<style scoped>
.personalized-dashboard {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.welcome-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  color: white;
}

.welcome-content {
  display: flex;
  align-items: center;
  gap: 24px;
}

.avatar-section {
  position: relative;
}

.user-avatar {
  border: 4px solid rgba(255, 255, 255, 0.3);
}

.online-indicator {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 16px;
  height: 16px;
  background: #52c41a;
  border: 2px solid white;
  border-radius: 50%;
}

.greeting-section {
  flex: 1;
}

.personalized-greeting {
  margin: 0 0 12px 0;
  font-size: 24px;
  font-weight: 600;
}

.status-badges {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.progress-section {
  min-width: 200px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
}

.dashboard-card {
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #333;
}

.performance-metrics {
  display: flex;
  justify-content: space-around;
  text-align: center;
}

.metric-item {
  flex: 1;
}

.metric-value {
  font-size: 28px;
  font-weight: 600;
  color: #1890ff;
  margin-bottom: 4px;
}

.metric-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.metric-trend {
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.trend-up {
  color: #52c41a;
}

.trend-down {
  color: #f5222d;
}

.radar-chart, .line-chart {
  height: 200px;
}

.recommendations-list {
  space-y: 12px;
}

.recommendation-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  background: #fafafa;
  margin-bottom: 12px;
}

.recommendation-item.high {
  border-left: 4px solid #f5222d;
}

.recommendation-item.medium {
  border-left: 4px solid #faad14;
}

.recommendation-item.low {
  border-left: 4px solid #52c41a;
}

.recommendation-icon {
  color: #1890ff;
}

.recommendation-title {
  font-weight: 600;
  margin-bottom: 4px;
}

.recommendation-desc {
  font-size: 12px;
  color: #666;
}

.learning-path {
  space-y: 16px;
}

.learning-step {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}

.step-indicator {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  color: #666;
  font-size: 14px;
  font-weight: 600;
}

.learning-step.completed .step-indicator {
  background: #52c41a;
  color: white;
}

.learning-step.current .step-indicator {
  background: #1890ff;
  color: white;
}

.step-content {
  flex: 1;
}

.step-title {
  font-weight: 500;
  margin-bottom: 8px;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-button {
  width: 100%;
  justify-content: flex-start;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .welcome-content {
    flex-direction: column;
    text-align: center;
  }
  
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .performance-metrics {
    flex-direction: column;
    gap: 16px;
  }
}
</style>
