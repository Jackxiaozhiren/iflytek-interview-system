<template>
  <div class="assessment-result-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-container">
        <div class="header-content">
          <h1>评估结果</h1>
          <p>您的{{ assessmentTitle }}已完成</p>
        </div>
        <div class="header-actions">
          <el-button @click="goBack">
            <el-icon><ArrowLeft /></el-icon>
            返回评估中心
          </el-button>
        </div>
      </div>
    </div>

    <!-- 结果概览 -->
    <div class="result-overview">
      <div class="overview-container">
        <div class="score-display">
          <div class="score-circle">
            <div class="score-value">{{ score }}</div>
            <div class="score-label">分</div>
          </div>
          <div class="score-info">
            <h2>{{ getScoreLevel(score).title }}</h2>
            <p>{{ getScoreLevel(score).description }}</p>
          </div>
        </div>
        
        <div class="result-stats">
          <div class="stat-item">
            <div class="stat-icon">
              <el-icon><Trophy /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ score }}/100</div>
              <div class="stat-label">总得分</div>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">
              <el-icon><Timer /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ formatTime(timeSpent) }}</div>
              <div class="stat-label">用时</div>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">
              <el-icon><Star /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ getScoreLevel(score).rank }}</div>
              <div class="stat-label">排名</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 详细分析 -->
    <div class="detailed-analysis">
      <div class="analysis-container">
        <div class="analysis-section">
          <h3>能力分析</h3>
          <div class="ability-chart">
            <div class="chart-container" ref="abilityChartRef"></div>
          </div>
        </div>
        
        <div class="analysis-section">
          <h3>答题统计</h3>
          <div class="answer-stats">
            <div class="stats-grid">
              <div class="stats-item correct">
                <div class="stats-number">{{ correctAnswers }}</div>
                <div class="stats-label">正确</div>
              </div>
              <div class="stats-item incorrect">
                <div class="stats-number">{{ incorrectAnswers }}</div>
                <div class="stats-label">错误</div>
              </div>
              <div class="stats-item skipped">
                <div class="stats-number">{{ skippedAnswers }}</div>
                <div class="stats-label">未答</div>
              </div>
            </div>
            <div class="accuracy-bar">
              <div class="accuracy-label">正确率</div>
              <el-progress 
                :percentage="accuracy" 
                :stroke-width="12"
                :color="getAccuracyColor(accuracy)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 改进建议 -->
    <div class="improvement-suggestions">
      <div class="suggestions-container">
        <h3>改进建议</h3>
        <div class="suggestions-list">
          <div 
            v-for="suggestion in suggestions" 
            :key="suggestion.id"
            class="suggestion-item"
          >
            <div class="suggestion-icon" :class="suggestion.type">
              <el-icon><component :is="suggestion.icon" /></el-icon>
            </div>
            <div class="suggestion-content">
              <h4>{{ suggestion.title }}</h4>
              <p>{{ suggestion.description }}</p>
              <div class="suggestion-actions">
                <el-button size="small" @click="viewSuggestionDetail(suggestion)">
                  查看详情
                </el-button>
                <el-button size="small" type="primary" @click="startLearning(suggestion)">
                  开始学习
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="result-actions">
      <div class="actions-container">
        <el-button size="large" @click="retakeAssessment">
          <el-icon><Refresh /></el-icon>
          重新评估
        </el-button>
        <el-button size="large" type="primary" @click="shareResult">
          <el-icon><Share /></el-icon>
          分享结果
        </el-button>
        <el-button size="large" @click="downloadReport">
          <el-icon><Download /></el-icon>
          下载报告
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElNotification } from 'element-plus'
import {
  ArrowLeft, Trophy, Timer, Star, Refresh, Share, Download,
  TrendCharts, Cpu, ChatDotRound, Grid
} from '@element-plus/icons-vue'
import * as echarts from 'echarts'

const router = useRouter()
const route = useRoute()

// 响应式数据
const score = ref(parseInt(route.query.score) || 85)
const assessmentType = ref(route.query.type || 'technical')
const timeSpent = ref(2400) // 40分钟，单位秒
const abilityChartRef = ref(null)

// 评估标题映射
const assessmentTitles = {
  technical: '技术能力评估',
  communication: '沟通表达评估',
  leadership: '领导力评估',
  'problem-solving': '问题解决评估'
}

const assessmentTitle = computed(() => {
  return assessmentTitles[assessmentType.value] || '技能评估'
})

// 答题统计
const totalQuestions = ref(25)
const correctAnswers = computed(() => Math.round(score.value / 100 * totalQuestions.value))
const incorrectAnswers = computed(() => totalQuestions.value - correctAnswers.value - skippedAnswers.value)
const skippedAnswers = ref(2)
const accuracy = computed(() => Math.round((correctAnswers.value / (totalQuestions.value - skippedAnswers.value)) * 100))

// 能力数据
const abilityData = ref([
  { name: '专业知识', value: score.value + Math.random() * 10 - 5 },
  { name: '实践能力', value: score.value + Math.random() * 10 - 5 },
  { name: '逻辑思维', value: score.value + Math.random() * 10 - 5 },
  { name: '学习能力', value: score.value + Math.random() * 10 - 5 },
  { name: '创新思维', value: score.value + Math.random() * 10 - 5 },
  { name: '沟通表达', value: score.value + Math.random() * 10 - 5 }
])

// 改进建议
const suggestions = ref([
  {
    id: 1,
    type: 'strength',
    icon: 'TrendCharts',
    title: '继续保持技术优势',
    description: '您在技术能力方面表现出色，建议继续深入学习前沿技术，保持技术领先优势。'
  },
  {
    id: 2,
    type: 'improvement',
    icon: 'ChatDotRound',
    title: '提升沟通表达能力',
    description: '建议多参与技术分享和团队讨论，提高技术方案的表达和沟通能力。'
  },
  {
    id: 3,
    type: 'learning',
    icon: 'Grid',
    title: '加强系统设计思维',
    description: '建议学习大型系统架构设计，提升从整体角度思考和解决问题的能力。'
  }
])

// 方法
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}分${remainingSeconds}秒`
}

const getScoreLevel = (score) => {
  if (score >= 90) {
    return {
      title: '优秀',
      description: '您的表现非常出色，技能水平达到了优秀标准',
      rank: 'Top 10%',
      color: '#52c41a'
    }
  } else if (score >= 80) {
    return {
      title: '良好',
      description: '您的表现良好，具备扎实的技能基础',
      rank: 'Top 30%',
      color: '#1890ff'
    }
  } else if (score >= 70) {
    return {
      title: '中等',
      description: '您的技能水平中等，还有提升空间',
      rank: 'Top 60%',
      color: '#faad14'
    }
  } else {
    return {
      title: '待提升',
      description: '建议加强学习，提升相关技能',
      rank: 'Top 80%',
      color: '#ff4d4f'
    }
  }
}

const getAccuracyColor = (accuracy) => {
  if (accuracy >= 90) return '#52c41a'
  if (accuracy >= 80) return '#1890ff'
  if (accuracy >= 70) return '#faad14'
  return '#ff4d4f'
}

const initAbilityChart = () => {
  if (!abilityChartRef.value) return
  
  const chart = echarts.init(abilityChartRef.value)
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    radar: {
      indicator: abilityData.value.map(item => ({
        name: item.name,
        max: 100
      })),
      radius: '70%',
      splitNumber: 4,
      splitLine: {
        lineStyle: {
          color: '#e6f7ff'
        }
      },
      splitArea: {
        areaStyle: {
          color: ['rgba(24, 144, 255, 0.1)', 'rgba(24, 144, 255, 0.05)']
        }
      },
      axisLine: {
        lineStyle: {
          color: '#1890ff'
        }
      }
    },
    series: [{
      type: 'radar',
      data: [{
        value: abilityData.value.map(item => Math.max(0, Math.min(100, item.value))),
        name: '能力评估',
        areaStyle: {
          color: 'rgba(24, 144, 255, 0.3)'
        },
        lineStyle: {
          color: '#1890ff',
          width: 2
        },
        itemStyle: {
          color: '#1890ff'
        }
      }]
    }]
  }
  
  chart.setOption(option)
  
  // 响应式调整
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

const goBack = () => {
  router.push('/skill-assessment')
}

const retakeAssessment = () => {
  router.push(`/assessment-exam?type=${assessmentType.value}`)
}

const shareResult = () => {
  // 生成分享链接
  const shareUrl = `${window.location.origin}/assessment-result?score=${score.value}&type=${assessmentType.value}`
  
  // 复制到剪贴板
  navigator.clipboard.writeText(shareUrl).then(() => {
    ElNotification({
      title: '分享成功',
      message: '评估结果链接已复制到剪贴板',
      type: 'success'
    })
  }).catch(() => {
    ElMessage.error('复制失败，请手动复制链接')
  })
}

const downloadReport = () => {
  ElMessage.success('报告下载功能开发中...')
}

const viewSuggestionDetail = (suggestion) => {
  ElMessage.info(`查看${suggestion.title}详情`)
}

const startLearning = (suggestion) => {
  ElMessage.success(`开始学习${suggestion.title}`)
  router.push('/learning-path')
}

// 生命周期
onMounted(() => {
  // 确保能力数据在合理范围内
  abilityData.value = abilityData.value.map(item => ({
    ...item,
    value: Math.max(60, Math.min(100, item.value))
  }))
  
  // 初始化图表
  setTimeout(() => {
    initAbilityChart()
  }, 100)
})
</script>

<style scoped>
.assessment-result-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.page-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 20px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h1 {
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.header-content p {
  color: #666;
  margin: 0;
}

.result-overview {
  padding: 40px 0;
}

.overview-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 40px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
}

.score-display {
  display: flex;
  align-items: center;
  gap: 32px;
}

.score-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1890ff, #667eea);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
}

.score-value {
  font-size: 36px;
  font-weight: 600;
}

.score-label {
  font-size: 14px;
  opacity: 0.9;
}

.score-info h2 {
  font-size: 32px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.score-info p {
  color: #666;
  font-size: 16px;
  margin: 0;
}

.result-stats {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #1890ff, #667eea);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
}

.stat-label {
  color: #666;
  font-size: 14px;
}

.detailed-analysis {
  padding: 40px 0;
}

.analysis-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.analysis-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 32px;
}

.analysis-section h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 24px;
}

.chart-container {
  height: 300px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.stats-item {
  text-align: center;
  padding: 20px;
  border-radius: 12px;
}

.stats-item.correct {
  background: #f6ffed;
  color: #52c41a;
}

.stats-item.incorrect {
  background: #fff2f0;
  color: #ff4d4f;
}

.stats-item.skipped {
  background: #f0f9ff;
  color: #1890ff;
}

.stats-number {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 4px;
}

.stats-label {
  font-size: 14px;
  opacity: 0.8;
}

.accuracy-bar {
  display: flex;
  align-items: center;
  gap: 16px;
}

.accuracy-label {
  font-weight: 600;
  color: #1a1a1a;
  min-width: 60px;
}

.improvement-suggestions {
  padding: 40px 0;
}

.suggestions-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 32px;
}

.suggestions-container h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 24px;
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.suggestion-item {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
}

.suggestion-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  flex-shrink: 0;
}

.suggestion-icon.strength {
  background: #52c41a;
}

.suggestion-icon.improvement {
  background: #faad14;
}

.suggestion-icon.learning {
  background: #1890ff;
}

.suggestion-content h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.suggestion-content p {
  color: #666;
  margin-bottom: 16px;
  line-height: 1.5;
}

.suggestion-actions {
  display: flex;
  gap: 8px;
}

.result-actions {
  padding: 40px 0;
}

.actions-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: center;
  gap: 20px;
}

@media (max-width: 768px) {
  .overview-container {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .score-display {
    justify-content: center;
  }
  
  .analysis-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .actions-container {
    flex-direction: column;
    align-items: center;
  }
}
</style>
