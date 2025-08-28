<template>
  <div class="simple-evaluation-demo">
    <div class="demo-header">
      <h1>🎯 AI智能评估演示</h1>
      <p class="subtitle">基于iFlytek Spark的多维度智能评估系统</p>
    </div>

    <div class="demo-content">
      <!-- 功能介绍 -->
      <el-row :gutter="24" class="feature-section">
        <el-col :span="8">
          <el-card class="feature-card">
            <template #header>
              <div class="card-header">
                <el-icon><TrendCharts /></el-icon>
                <span>实时评估</span>
              </div>
            </template>
            <p>基于iFlytek Spark大模型的实时能力评估，提供六维度专业分析</p>
          </el-card>
        </el-col>
        
        <el-col :span="8">
          <el-card class="feature-card">
            <template #header>
              <div class="card-header">
                <el-icon><DataBoard /></el-icon>
                <span>智能分析</span>
              </div>
            </template>
            <p>多模态数据融合分析，包含文本、语音、行为等多维度数据</p>
          </el-card>
        </el-col>
        
        <el-col :span="8">
          <el-card class="feature-card">
            <template #header>
              <div class="card-header">
                <el-icon><Document /></el-icon>
                <span>专业报告</span>
              </div>
            </template>
            <p>生成详细的评估报告，为招聘决策提供科学依据</p>
          </el-card>
        </el-col>
      </el-row>

      <!-- 演示控制 -->
      <div class="demo-controls">
        <el-button 
          type="primary" 
          size="large"
          :icon="isRunning ? VideoPause : VideoPlay"
          @click="toggleDemo"
          :loading="isLoading"
        >
          {{ isRunning ? '停止演示' : '开始演示' }}
        </el-button>
        
        <el-button
          v-if="hasResults"
          type="success"
          :icon="Document"
          @click="generateReport"
        >
          生成报告
        </el-button>

        <el-button
          v-if="hasResults"
          type="warning"
          :icon="RefreshRight"
          @click="resetEvaluation"
        >
          重置评估
        </el-button>
      </div>

      <!-- 演示结果 -->
      <div v-if="isRunning || hasResults" class="demo-results">
        <el-card>
          <template #header>
            <div class="card-header">
              <el-icon><TrendCharts /></el-icon>
              <span>评估结果</span>
              <el-tag v-if="isRunning" type="success" size="small">
                <el-icon><Loading /></el-icon>
                实时分析中
              </el-tag>
            </div>
          </template>
          
          <div class="evaluation-metrics">
            <el-row :gutter="16">
              <el-col :span="12" v-for="metric in metrics" :key="metric.name">
                <div class="metric-item">
                  <div class="metric-header">
                    <span class="metric-name">{{ metric.name }}</span>
                    <span class="metric-score">{{ Math.round(metric.score) }}分</span>
                  </div>
                  <el-progress
                    :percentage="Math.round(metric.score)"
                    :color="getProgressColor(metric.score)"
                    :show-text="false"
                  />
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </div>

      <!-- 使用说明 -->
      <div class="demo-instructions">
        <el-alert
          title="演示说明"
          type="info"
          :closable="false"
        >
          <p>这是iFlytek Spark智能评估系统的演示页面。点击"开始演示"体验AI实时评估功能。</p>
          <p>系统将模拟真实面试场景，展示多维度能力评估过程。</p>
        </el-alert>
      </div>
    </div>

    <!-- 评估报告模态框 -->
    <el-dialog
      v-model="showReportModal"
      title="📊 iFlytek Spark 智能评估报告"
      width="800px"
      :before-close="() => showReportModal = false"
    >
      <div class="evaluation-report">
        <!-- 报告头部 -->
        <div class="report-header">
          <el-row :gutter="24">
            <el-col :span="12">
              <div class="report-info">
                <p><strong>候选人：</strong>{{ evaluationReport.candidateName }}</p>
                <p><strong>应聘职位：</strong>{{ evaluationReport.position }}</p>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="report-info">
                <p><strong>评估日期：</strong>{{ evaluationReport.evaluationDate }}</p>
                <p><strong>综合评分：</strong>
                  <span class="overall-score" :class="getScoreClass(evaluationReport.overallScore)">
                    {{ evaluationReport.overallScore }}分
                  </span>
                </p>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 推荐结论 -->
        <div class="report-section">
          <h4>📋 推荐结论</h4>
          <el-tag
            :type="getRecommendationType(evaluationReport.recommendation)"
            size="large"
            class="recommendation-tag"
          >
            {{ evaluationReport.recommendation }}
          </el-tag>
        </div>

        <!-- 详细分析 -->
        <div class="report-section">
          <h4>🔍 详细分析</h4>
          <p class="analysis-text">{{ evaluationReport.detailedAnalysis }}</p>
        </div>

        <!-- 各维度评分 -->
        <div class="report-section">
          <h4>📈 各维度评分</h4>
          <div class="metrics-summary">
            <el-row :gutter="16">
              <el-col :span="12" v-for="metric in metrics" :key="metric.name">
                <div class="metric-summary-item">
                  <span class="metric-name">{{ metric.name }}</span>
                  <span class="metric-score" :class="getScoreClass(metric.score)">
                    {{ Math.round(metric.score) }}分
                  </span>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>

        <!-- 优势能力 -->
        <div class="report-section" v-if="evaluationReport.strengths.length > 0">
          <h4>💪 优势能力</h4>
          <ul class="strengths-list">
            <li v-for="strength in evaluationReport.strengths" :key="strength">
              <el-icon class="success-icon"><SuccessFilled /></el-icon>
              {{ strength }}
            </li>
          </ul>
        </div>

        <!-- 改进建议 -->
        <div class="report-section" v-if="evaluationReport.improvements.length > 0">
          <h4>🎯 改进建议</h4>
          <ul class="improvements-list">
            <li v-for="improvement in evaluationReport.improvements" :key="improvement">
              <el-icon class="warning-icon"><WarningFilled /></el-icon>
              {{ improvement }}
            </li>
          </ul>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showReportModal = false">关闭</el-button>
          <el-button type="primary" @click="downloadReport">
            <el-icon><Download /></el-icon>
            下载报告
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  VideoPlay, VideoPause, Loading, Document, TrendCharts, DataBoard,
  RefreshRight, Download, SuccessFilled, WarningFilled
} from '@element-plus/icons-vue'

// 响应式数据
const isRunning = ref(false)
const isLoading = ref(false)
const hasResults = ref(false)
const showReportModal = ref(false)

// 评估指标
const metrics = ref([
  { name: '技术能力', score: 0, targetScore: 85, isComplete: false },
  { name: '逻辑思维', score: 0, targetScore: 78, isComplete: false },
  { name: '沟通表达', score: 0, targetScore: 92, isComplete: false },
  { name: '学习能力', score: 0, targetScore: 88, isComplete: false },
  { name: '团队协作', score: 0, targetScore: 76, isComplete: false },
  { name: '创新思维', score: 0, targetScore: 82, isComplete: false }
])

// 评估报告数据
const evaluationReport = ref({
  candidateName: '张三',
  position: '前端开发工程师',
  evaluationDate: new Date().toLocaleDateString('zh-CN'),
  overallScore: 0,
  recommendation: '',
  strengths: [],
  improvements: [],
  detailedAnalysis: ''
})

// 切换演示状态
const toggleDemo = async () => {
  if (isRunning.value) {
    // 停止演示
    isRunning.value = false
    ElMessage.success('演示已停止')
  } else {
    // 开始演示
    isLoading.value = true
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      isRunning.value = true
      hasResults.value = true
      
      // 模拟实时评分
      simulateRealTimeScoring()
      
      ElMessage.success('演示已开始，正在进行实时评估...')
    } finally {
      isLoading.value = false
    }
  }
}

// 模拟实时评分
const simulateRealTimeScoring = () => {
  const interval = setInterval(() => {
    if (!isRunning.value) {
      clearInterval(interval)
      return
    }

    let allComplete = true
    metrics.value.forEach(metric => {
      if (!metric.isComplete) {
        const increment = Math.random() * 3 + 1 // 1-4分的增长
        metric.score = Math.min(metric.targetScore, metric.score + increment)

        // 当接近目标分数时，标记为完成
        if (metric.score >= metric.targetScore - 0.5) {
          metric.score = metric.targetScore
          metric.isComplete = true
        } else {
          allComplete = false
        }
      }
    })

    // 如果所有指标都达到目标，停止评分
    if (allComplete) {
      clearInterval(interval)
      generateFinalReport()
      ElMessage.success('评估完成！所有维度分析已完成')
    }
  }, 800)

  // 15秒后强制停止（防止无限循环）
  setTimeout(() => {
    if (isRunning.value) {
      isRunning.value = false
      clearInterval(interval)
      generateFinalReport()
      ElMessage.success('演示完成！评估结果已生成')
    }
  }, 15000)
}

// 生成最终报告数据
const generateFinalReport = () => {
  const totalScore = metrics.value.reduce((sum, metric) => sum + metric.score, 0)
  const averageScore = Math.round(totalScore / metrics.value.length)

  evaluationReport.value.overallScore = averageScore

  // 根据分数生成建议
  if (averageScore >= 85) {
    evaluationReport.value.recommendation = '优秀候选人，强烈推荐录用'
    evaluationReport.value.detailedAnalysis = '候选人在各项能力维度表现优异，具备出色的综合素质，能够胜任岗位要求并有潜力承担更高职责。'
  } else if (averageScore >= 75) {
    evaluationReport.value.recommendation = '良好候选人，推荐录用'
    evaluationReport.value.detailedAnalysis = '候选人整体表现良好，具备岗位所需的核心能力，经过适当培训后能够很好地胜任工作。'
  } else if (averageScore >= 65) {
    evaluationReport.value.recommendation = '一般候选人，谨慎考虑'
    evaluationReport.value.detailedAnalysis = '候选人基本符合岗位要求，但在某些关键能力上还需要进一步提升，建议加强培训和指导。'
  } else {
    evaluationReport.value.recommendation = '不推荐录用'
    evaluationReport.value.detailedAnalysis = '候选人在多个关键能力维度表现不足，可能难以胜任当前岗位要求。'
  }

  // 生成优势和改进建议
  evaluationReport.value.strengths = metrics.value
    .filter(metric => metric.score >= 80)
    .map(metric => `${metric.name}表现优秀 (${Math.round(metric.score)}分)`)

  evaluationReport.value.improvements = metrics.value
    .filter(metric => metric.score < 75)
    .map(metric => `${metric.name}有待提升 (${Math.round(metric.score)}分)`)
}

// 生成报告
const generateReport = () => {
  if (!hasResults.value) {
    ElMessage.warning('请先完成评估演示')
    return
  }

  generateFinalReport()
  showReportModal.value = true
  ElMessage.success('评估报告已生成！')
}

// 下载报告
const downloadReport = () => {
  // 创建报告内容
  const reportContent = `
iFlytek Spark 智能面试评估报告

候选人：${evaluationReport.value.candidateName}
应聘职位：${evaluationReport.value.position}
评估日期：${evaluationReport.value.evaluationDate}

综合评分：${evaluationReport.value.overallScore}分
推荐结论：${evaluationReport.value.recommendation}

详细分析：
${evaluationReport.value.detailedAnalysis}

各维度评分：
${metrics.value.map(metric => `${metric.name}：${Math.round(metric.score)}分`).join('\n')}

优势能力：
${evaluationReport.value.strengths.join('\n')}

改进建议：
${evaluationReport.value.improvements.join('\n')}

---
报告生成时间：${new Date().toLocaleString('zh-CN')}
评估系统：iFlytek Spark 多模态智能面试系统
  `.trim()

  // 创建下载链接
  const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `iFlytek_评估报告_${evaluationReport.value.candidateName}_${new Date().toISOString().split('T')[0]}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  ElMessage.success('报告下载成功！')
}

// 重置评估
const resetEvaluation = () => {
  metrics.value.forEach(metric => {
    metric.score = 0
    metric.isComplete = false
  })
  hasResults.value = false
  showReportModal.value = false
  ElMessage.info('评估已重置')
}

// 获取进度条颜色
const getProgressColor = (score) => {
  if (score >= 80) return '#67c23a'
  if (score >= 60) return '#e6a23c'
  return '#f56c6c'
}

// 获取分数样式类
const getScoreClass = (score) => {
  if (score >= 85) return 'score-excellent'
  if (score >= 75) return 'score-good'
  if (score >= 65) return 'score-average'
  return 'score-poor'
}

// 获取推荐类型
const getRecommendationType = (recommendation) => {
  if (recommendation.includes('强烈推荐')) return 'success'
  if (recommendation.includes('推荐')) return 'success'
  if (recommendation.includes('谨慎')) return 'warning'
  return 'danger'
}
</script>

<style scoped>
.simple-evaluation-demo {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.demo-header {
  text-align: center;
  margin-bottom: 40px;
}

.demo-header h1 {
  color: #1890ff;
  margin-bottom: 16px;
  font-size: 32px;
}

.subtitle {
  color: #666;
  font-size: 16px;
}

.feature-section {
  margin-bottom: 40px;
}

.feature-card {
  height: 160px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.demo-controls {
  text-align: center;
  margin: 40px 0;
}

.demo-controls .el-button {
  margin: 0 8px;
}

.demo-results {
  margin: 40px 0;
}

.evaluation-metrics {
  padding: 20px 0;
}

.metric-item {
  margin-bottom: 20px;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.metric-name {
  font-weight: 500;
  color: #333;
}

.metric-score {
  font-weight: 600;
  color: #1890ff;
}

.demo-instructions {
  margin-top: 40px;
}

.demo-instructions p {
  margin: 8px 0;
}

/* 评估报告样式 */
.evaluation-report {
  padding: 16px 0;
}

.report-header {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.report-info p {
  margin: 8px 0;
  font-size: 14px;
}

.overall-score {
  font-size: 18px;
  font-weight: bold;
}

.score-excellent { color: #67c23a; }
.score-good { color: #409eff; }
.score-average { color: #e6a23c; }
.score-poor { color: #f56c6c; }

.report-section {
  margin-bottom: 24px;
}

.report-section h4 {
  color: #1890ff;
  margin-bottom: 12px;
  font-size: 16px;
  border-left: 4px solid #1890ff;
  padding-left: 12px;
}

.recommendation-tag {
  font-size: 14px;
  padding: 8px 16px;
}

.analysis-text {
  line-height: 1.6;
  color: #666;
  background: #f8f9fa;
  padding: 16px;
  border-radius: 6px;
  margin: 0;
}

.metrics-summary {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 16px;
}

.metric-summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.metric-summary-item:last-child {
  border-bottom: none;
}

.strengths-list, .improvements-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.strengths-list li, .improvements-list li {
  display: flex;
  align-items: center;
  padding: 8px 0;
  font-size: 14px;
}

.success-icon {
  color: #67c23a;
  margin-right: 8px;
}

.warning-icon {
  color: #e6a23c;
  margin-right: 8px;
}

.dialog-footer {
  text-align: right;
}
</style>
