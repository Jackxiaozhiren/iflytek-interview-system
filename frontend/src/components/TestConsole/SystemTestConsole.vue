<template>
  <div class="system-test-console">
    <!-- 测试控制台头部 -->
    <div class="console-header">
      <h2 class="console-title">
        <el-icon><TrendCharts /></el-icon>
        系统测试控制台
      </h2>
      <div class="console-actions">
        <el-button 
          type="primary" 
          @click="runQuickCheck" 
          :loading="quickCheckLoading"
          class="test-btn"
        >
          <el-icon><Star /></el-icon>
          快速检查
        </el-button>
        <el-button 
          type="success" 
          @click="runFullTest" 
          :loading="fullTestLoading"
          class="test-btn"
        >
          <el-icon><CircleCheck /></el-icon>
          完整测试
        </el-button>
        <el-button 
          @click="clearResults"
          class="test-btn"
        >
          <el-icon><Close /></el-icon>
          清空结果
        </el-button>
      </div>
    </div>

    <!-- 系统健康状态 -->
    <div class="health-status" v-if="healthStatus">
      <div class="status-card">
        <div class="status-header">
          <h3>系统健康度</h3>
          <div class="health-score" :class="getHealthScoreClass(healthStatus.score)">
            {{ healthStatus.score }}%
          </div>
        </div>
        <div class="status-details">
          <div 
            v-for="result in healthStatus.results" 
            :key="result.name"
            class="status-item"
            :class="{ 'status-passed': result.passed, 'status-failed': !result.passed }"
          >
            <el-icon v-if="result.passed" class="status-icon success"><Check /></el-icon>
            <el-icon v-else class="status-icon error"><Close /></el-icon>
            <span class="status-name">{{ result.name }}</span>
            <span v-if="result.error" class="status-error">{{ result.error }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 测试进度 -->
    <div class="test-progress" v-if="testProgress.show">
      <el-progress 
        :percentage="testProgress.percentage" 
        :status="testProgress.status"
        :stroke-width="12"
      >
        <template #default="{ percentage }">
          <span class="progress-text">{{ testProgress.text }} {{ percentage }}%</span>
        </template>
      </el-progress>
    </div>

    <!-- 测试结果 -->
    <div class="test-results" v-if="testReport">
      <div class="results-header">
        <h3>测试报告</h3>
        <div class="results-summary">
          <div class="summary-item">
            <span class="summary-label">总测试数</span>
            <span class="summary-value">{{ testReport.summary.total }}</span>
          </div>
          <div class="summary-item success">
            <span class="summary-label">通过</span>
            <span class="summary-value">{{ testReport.summary.passed }}</span>
          </div>
          <div class="summary-item error">
            <span class="summary-label">失败</span>
            <span class="summary-value">{{ testReport.summary.failed }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">成功率</span>
            <span class="summary-value">{{ testReport.summary.successRate }}%</span>
          </div>
        </div>
      </div>

      <!-- 分类统计 -->
      <div class="category-stats">
        <h4>分类统计</h4>
        <div class="stats-grid">
          <div 
            v-for="(stats, category) in testReport.categoryStats" 
            :key="category"
            class="stat-card"
          >
            <div class="stat-header">
              <span class="stat-title">{{ getCategoryName(category) }}</span>
              <span class="stat-rate" :class="getStatRateClass(stats.rate)">
                {{ stats.rate }}%
              </span>
            </div>
            <div class="stat-details">
              <div class="stat-bar">
                <div 
                  class="stat-fill success" 
                  :style="{ width: (stats.passed / stats.total * 100) + '%' }"
                ></div>
                <div 
                  class="stat-fill error" 
                  :style="{ width: (stats.failed / stats.total * 100) + '%' }"
                ></div>
              </div>
              <div class="stat-numbers">
                <span class="stat-passed">{{ stats.passed }}</span>
                <span class="stat-separator">/</span>
                <span class="stat-total">{{ stats.total }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 详细结果 -->
      <div class="detailed-results">
        <h4>详细结果</h4>
        <el-collapse v-model="activeCollapse">
          <el-collapse-item 
            v-for="category in Object.keys(testReport.categoryStats)" 
            :key="category"
            :title="`${getCategoryName(category)} (${testReport.categoryStats[category].passed}/${testReport.categoryStats[category].total})`"
            :name="category"
          >
            <div class="test-list">
              <div 
                v-for="test in getTestsByCategory(category)" 
                :key="test.name"
                class="test-item"
                :class="{ 'test-passed': test.passed, 'test-failed': !test.passed }"
              >
                <div class="test-info">
                  <el-icon v-if="test.passed" class="test-icon success"><Check /></el-icon>
                  <el-icon v-else class="test-icon error"><Close /></el-icon>
                  <span class="test-name">{{ test.name }}</span>
                  <span class="test-time">{{ formatTime(test.timestamp) }}</span>
                </div>
                <div v-if="test.error" class="test-error">
                  <el-icon><Warning /></el-icon>
                  {{ test.error }}
                </div>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>

      <!-- 改进建议 -->
      <div class="recommendations" v-if="testReport.recommendations.length > 0">
        <h4>改进建议</h4>
        <div class="recommendation-list">
          <div 
            v-for="(recommendation, index) in testReport.recommendations" 
            :key="index"
            class="recommendation-item"
          >
            <el-icon><Star /></el-icon>
            <span>{{ recommendation }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  TrendCharts, Star, CircleCheck, Close, Check, Warning
} from '@element-plus/icons-vue'
import systemTestService from '@/services/systemTestService'

// 响应式数据
const quickCheckLoading = ref(false)
const fullTestLoading = ref(false)
const healthStatus = ref(null)
const testReport = ref(null)
const activeCollapse = ref([])

const testProgress = ref({
  show: false,
  percentage: 0,
  status: '',
  text: '准备测试...'
})

// 方法
const runQuickCheck = async () => {
  quickCheckLoading.value = true
  testProgress.value.show = true
  testProgress.value.percentage = 0
  testProgress.value.text = '执行快速健康检查...'

  try {
    testProgress.value.percentage = 50
    const result = await systemTestService.quickHealthCheck()
    
    testProgress.value.percentage = 100
    testProgress.value.status = result.score >= 80 ? 'success' : result.score >= 60 ? 'warning' : 'exception'
    testProgress.value.text = '快速检查完成'
    
    healthStatus.value = result
    
    setTimeout(() => {
      testProgress.value.show = false
    }, 2000)
    
  } catch (error) {
    console.error('快速检查失败:', error)
    ElMessage.error('快速检查失败')
    testProgress.value.status = 'exception'
    testProgress.value.text = '检查失败'
  } finally {
    quickCheckLoading.value = false
  }
}

const runFullTest = async () => {
  fullTestLoading.value = true
  testProgress.value.show = true
  testProgress.value.percentage = 0
  testProgress.value.text = '开始完整系统测试...'

  try {
    // 模拟测试进度
    const progressSteps = [
      { percentage: 10, text: '测试UI组件...' },
      { percentage: 25, text: '测试响应式设计...' },
      { percentage: 40, text: '测试动画效果...' },
      { percentage: 55, text: '测试中文本地化...' },
      { percentage: 70, text: '测试功能集成...' },
      { percentage: 85, text: '测试性能指标...' },
      { percentage: 95, text: '生成测试报告...' }
    ]

    for (const step of progressSteps) {
      testProgress.value.percentage = step.percentage
      testProgress.value.text = step.text
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    const result = await systemTestService.runFullTestSuite()
    
    testProgress.value.percentage = 100
    testProgress.value.status = result.summary.successRate >= 80 ? 'success' : 
                               result.summary.successRate >= 60 ? 'warning' : 'exception'
    testProgress.value.text = '完整测试完成'
    
    testReport.value = result
    
    setTimeout(() => {
      testProgress.value.show = false
    }, 2000)
    
  } catch (error) {
    console.error('完整测试失败:', error)
    ElMessage.error('完整测试失败')
    testProgress.value.status = 'exception'
    testProgress.value.text = '测试失败'
  } finally {
    fullTestLoading.value = false
  }
}

const clearResults = () => {
  healthStatus.value = null
  testReport.value = null
  testProgress.value.show = false
  ElMessage.info('测试结果已清空')
}

// 辅助方法
const getHealthScoreClass = (score) => {
  if (score >= 80) return 'health-excellent'
  if (score >= 60) return 'health-good'
  return 'health-poor'
}

const getCategoryName = (category) => {
  const categoryNames = {
    ui: '界面测试',
    responsive: '响应式测试',
    animation: '动画效果测试',
    integration: '集成测试',
    performance: '性能测试',
    localization: '本地化测试'
  }
  return categoryNames[category] || category
}

const getStatRateClass = (rate) => {
  if (rate >= 80) return 'rate-excellent'
  if (rate >= 60) return 'rate-good'
  return 'rate-poor'
}

const getTestsByCategory = (category) => {
  if (!testReport.value) return []
  return testReport.value.details.filter(test => test.category === category)
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('zh-CN')
}
</script>

<style scoped>
.system-test-console {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.console-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.console-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.console-actions {
  display: flex;
  gap: 12px;
}

.test-btn {
  display: flex;
  align-items: center;
  gap: 6px;
}

.health-status {
  margin-bottom: 24px;
}

.status-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.health-score {
  font-size: 2rem;
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 8px;
}

.health-excellent {
  background: #f0f9ff;
  color: #52c41a;
}

.health-good {
  background: #fffbf0;
  color: #faad14;
}

.health-poor {
  background: #fff2f0;
  color: #ff4d4f;
}

.status-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 12px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  background: #f8f9fa;
}

.status-passed {
  background: #f6ffed;
  border-left: 3px solid #52c41a;
}

.status-failed {
  background: #fff2f0;
  border-left: 3px solid #ff4d4f;
}

.status-icon.success {
  color: #52c41a;
}

.status-icon.error {
  color: #ff4d4f;
}

.test-progress {
  margin-bottom: 24px;
}

.progress-text {
  font-size: 0.9rem;
  color: #666;
}

.test-results {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.results-summary {
  display: flex;
  gap: 20px;
}

.summary-item {
  text-align: center;
}

.summary-label {
  display: block;
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 4px;
}

.summary-value {
  display: block;
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.summary-item.success .summary-value {
  color: #52c41a;
}

.summary-item.error .summary-value {
  color: #ff4d4f;
}

.category-stats {
  margin-bottom: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 12px;
}

.stat-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.stat-title {
  font-weight: bold;
  color: #333;
}

.stat-rate {
  font-weight: bold;
}

.rate-excellent {
  color: #52c41a;
}

.rate-good {
  color: #faad14;
}

.rate-poor {
  color: #ff4d4f;
}

.stat-bar {
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
  display: flex;
}

.stat-fill.success {
  background: #52c41a;
}

.stat-fill.error {
  background: #ff4d4f;
}

.stat-numbers {
  text-align: center;
  font-size: 0.9rem;
  color: #666;
}

.detailed-results {
  margin-bottom: 24px;
}

.test-list {
  padding: 12px 0;
}

.test-item {
  padding: 8px 12px;
  margin-bottom: 8px;
  border-radius: 6px;
  background: #f8f9fa;
}

.test-passed {
  background: #f6ffed;
  border-left: 3px solid #52c41a;
}

.test-failed {
  background: #fff2f0;
  border-left: 3px solid #ff4d4f;
}

.test-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.test-icon.success {
  color: #52c41a;
}

.test-icon.error {
  color: #ff4d4f;
}

.test-name {
  flex: 1;
  font-weight: 500;
}

.test-time {
  font-size: 0.8rem;
  color: #999;
}

.test-error {
  margin-top: 8px;
  padding: 8px;
  background: #fff2f0;
  border-radius: 4px;
  color: #ff4d4f;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 6px;
}

.recommendations {
  margin-top: 24px;
}

.recommendation-list {
  margin-top: 12px;
}

.recommendation-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 0;
  color: #666;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .console-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .console-actions {
    justify-content: center;
  }

  .results-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .results-summary {
    justify-content: space-around;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .status-details {
    grid-template-columns: 1fr;
  }
}
</style>
