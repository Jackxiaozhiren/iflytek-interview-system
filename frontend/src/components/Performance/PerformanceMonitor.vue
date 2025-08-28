<template>
  <div class="performance-monitor">
    <!-- 性能概览 -->
    <div class="performance-overview">
      <h3 class="section-title">系统性能监控</h3>
      <div class="metrics-grid">
        <div class="metric-card" :class="getMetricStatus(performanceData.cpu_usage)">
          <div class="metric-icon">
            <el-icon><Cpu /></el-icon>
          </div>
          <div class="metric-content">
            <div class="metric-value">{{ performanceData.cpu_usage?.toFixed(1) || 0 }}%</div>
            <div class="metric-label">CPU使用率</div>
          </div>
        </div>

        <div class="metric-card" :class="getMetricStatus(performanceData.memory_usage)">
          <div class="metric-icon">
            <el-icon><TrendCharts /></el-icon>
          </div>
          <div class="metric-content">
            <div class="metric-value">{{ performanceData.memory_usage?.toFixed(1) || 0 }}%</div>
            <div class="metric-label">内存使用率</div>
          </div>
        </div>

        <div class="metric-card" :class="getResponseTimeStatus(performanceData.response_time_avg)">
          <div class="metric-icon">
            <el-icon><Timer /></el-icon>
          </div>
          <div class="metric-content">
            <div class="metric-value">{{ performanceData.response_time_avg?.toFixed(2) || 0 }}s</div>
            <div class="metric-label">平均响应时间</div>
          </div>
        </div>

        <div class="metric-card" :class="getCacheHitStatus(performanceData.cache_hit_rate)">
          <div class="metric-icon">
            <el-icon><DataBoard /></el-icon>
          </div>
          <div class="metric-content">
            <div class="metric-value">{{ performanceData.cache_hit_rate?.toFixed(1) || 0 }}%</div>
            <div class="metric-label">缓存命中率</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 性能图表 -->
    <div class="performance-charts">
      <div class="chart-container">
        <h4>CPU和内存使用趋势</h4>
        <div class="chart-placeholder" ref="systemChart">
          <canvas ref="systemCanvas" width="400" height="200"></canvas>
        </div>
      </div>

      <div class="chart-container">
        <h4>响应时间趋势</h4>
        <div class="chart-placeholder" ref="responseChart">
          <canvas ref="responseCanvas" width="400" height="200"></canvas>
        </div>
      </div>
    </div>

    <!-- 前端性能指标 -->
    <div class="frontend-performance">
      <h4>前端性能指标</h4>
      <div class="frontend-metrics">
        <div class="frontend-metric">
          <label>首次内容绘制 (FCP):</label>
          <span class="metric-value" :class="getFCPStatus(frontendMetrics.firstContentfulPaint)">
            {{ formatTime(frontendMetrics.firstContentfulPaint) }}
          </span>
          <div class="metric-score">评分: {{ frontendScores.fcp || 0 }}</div>
        </div>

        <div class="frontend-metric">
          <label>最大内容绘制 (LCP):</label>
          <span class="metric-value" :class="getLCPStatus(frontendMetrics.largestContentfulPaint)">
            {{ formatTime(frontendMetrics.largestContentfulPaint) }}
          </span>
          <div class="metric-score">评分: {{ frontendScores.lcp || 0 }}</div>
        </div>

        <div class="frontend-metric">
          <label>首次输入延迟 (FID):</label>
          <span class="metric-value" :class="getFIDStatus(frontendMetrics.firstInputDelay)">
            {{ formatTime(frontendMetrics.firstInputDelay) }}
          </span>
          <div class="metric-score">评分: {{ frontendScores.fid || 0 }}</div>
        </div>

        <div class="frontend-metric">
          <label>累积布局偏移 (CLS):</label>
          <span class="metric-value" :class="getCLSStatus(frontendMetrics.cumulativeLayoutShift)">
            {{ frontendMetrics.cumulativeLayoutShift?.toFixed(3) || 0 }}
          </span>
          <div class="metric-score">评分: {{ frontendScores.cls || 0 }}</div>
        </div>
      </div>

      <div class="overall-score">
        <div class="score-circle" :class="getOverallScoreClass(frontendScores.overall)">
          <div class="score-value">{{ frontendScores.overall || 0 }}</div>
          <div class="score-label">总体评分</div>
        </div>
      </div>
    </div>

    <!-- 优化建议 -->
    <div class="optimization-recommendations" v-if="recommendations.length > 0">
      <h4>优化建议</h4>
      <div class="recommendations-list">
        <div 
          v-for="(rec, index) in recommendations"
          :key="index"
          class="recommendation-item"
          :class="rec.priority"
        >
          <div class="recommendation-header">
            <div class="recommendation-title">{{ rec.title }}</div>
            <el-tag :type="getPriorityType(rec.priority)" size="small">
              {{ getPriorityText(rec.priority) }}
            </el-tag>
          </div>
          <div class="recommendation-description">{{ rec.description }}</div>
          <div class="recommendation-actions">
            <ul>
              <li v-for="action in rec.actions" :key="action">{{ action }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 控制面板 -->
    <div class="control-panel">
      <div class="control-buttons">
        <el-button 
          type="primary" 
          @click="refreshMetrics"
          :loading="isLoading"
          icon="Refresh"
        >
          刷新数据
        </el-button>
        <el-button 
          type="success" 
          @click="optimizeSystem"
          :loading="isOptimizing"
          icon="Tools"
        >
          系统优化
        </el-button>
        <el-button 
          type="warning" 
          @click="clearCache"
          icon="Delete"
        >
          清理缓存
        </el-button>
        <el-button 
          type="info" 
          @click="downloadReport"
          icon="Download"
        >
          下载报告
        </el-button>
      </div>

      <div class="auto-refresh">
        <el-switch
          v-model="autoRefresh"
          @change="toggleAutoRefresh"
          active-text="自动刷新"
          inactive-text="手动刷新"
        />
        <el-select v-model="refreshInterval" size="small" style="width: 100px; margin-left: 10px">
          <el-option label="5秒" :value="5000" />
          <el-option label="10秒" :value="10000" />
          <el-option label="30秒" :value="30000" />
          <el-option label="1分钟" :value="60000" />
        </el-select>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Cpu, TrendCharts, Timer, DataBoard, Loading, Setting, Close, ArrowDown, Odometer, Refresh, Tools, Delete, Download } from '@element-plus/icons-vue'
import { request } from '@/api/request'
import frontendPerformanceService from '@/services/frontendPerformanceService'

export default {
  name: 'PerformanceMonitor',
  components: {
    Cpu,
    Odometer,
    Timer,
    DataBoard,
    Refresh,
    Tools,
    Delete,
    Download
  },
  setup() {
    const performanceData = reactive({
      cpu_usage: 0,
      memory_usage: 0,
      response_time_avg: 0,
      cache_hit_rate: 0,
      active_requests: 0,
      error_rate: 0
    })
    
    const frontendMetrics = reactive({
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      firstInputDelay: 0,
      cumulativeLayoutShift: 0,
      pageLoadTime: 0
    })
    
    const frontendScores = reactive({
      fcp: 0,
      lcp: 0,
      fid: 0,
      cls: 0,
      overall: 0
    })
    
    const recommendations = ref([])
    const isLoading = ref(false)
    const isOptimizing = ref(false)
    const autoRefresh = ref(false)
    const refreshInterval = ref(30000)
    
    let refreshTimer = null
    let systemChart = null
    let responseChart = null
    
    // 获取性能数据
    const fetchPerformanceData = async () => {
      try {
        const response = await request({
          url: '/api/v1/performance/system-metrics',
          method: 'get'
        })
        
        if (response.success && response.data) {
          Object.assign(performanceData, response.data)
        }
      } catch (error) {
        console.error('获取性能数据失败:', error)
      }
    }
    
    // 获取前端性能数据
    const fetchFrontendMetrics = () => {
      const report = frontendPerformanceService.getPerformanceReport()
      Object.assign(frontendMetrics, report.metrics)
      Object.assign(frontendScores, report.scores)
      recommendations.value = report.recommendations
    }
    
    // 刷新所有指标
    const refreshMetrics = async () => {
      isLoading.value = true
      try {
        await Promise.all([
          fetchPerformanceData(),
          fetchFrontendMetrics()
        ])
        ElMessage.success('性能数据刷新成功')
      } catch (error) {
        ElMessage.error('刷新失败: ' + error.message)
      } finally {
        isLoading.value = false
      }
    }
    
    // 系统优化
    const optimizeSystem = async () => {
      isOptimizing.value = true
      try {
        // 数据库优化
        await request({
          url: '/api/v1/performance/optimize/database',
          method: 'post'
        })
        
        // 内存优化
        await request({
          url: '/api/v1/performance/optimize/memory',
          method: 'post'
        })
        
        ElMessage.success('系统优化完成')
        await refreshMetrics()
      } catch (error) {
        ElMessage.error('系统优化失败: ' + error.message)
      } finally {
        isOptimizing.value = false
      }
    }
    
    // 清理缓存
    const clearCache = async () => {
      try {
        await request({
          url: '/api/v1/performance/cache/clear',
          method: 'post'
        })
        ElMessage.success('缓存清理完成')
        await refreshMetrics()
      } catch (error) {
        ElMessage.error('缓存清理失败: ' + error.message)
      }
    }
    
    // 下载报告
    const downloadReport = async () => {
      try {
        const response = await request({
          url: '/api/v1/performance/report',
          method: 'get'
        })
        
        const blob = new Blob([JSON.stringify(response.data, null, 2)], {
          type: 'application/json'
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `performance-report-${new Date().toISOString().slice(0, 10)}.json`
        a.click()
        URL.revokeObjectURL(url)
        
        ElMessage.success('报告下载成功')
      } catch (error) {
        ElMessage.error('报告下载失败: ' + error.message)
      }
    }
    
    // 切换自动刷新
    const toggleAutoRefresh = (enabled) => {
      if (enabled) {
        refreshTimer = setInterval(refreshMetrics, refreshInterval.value)
      } else {
        if (refreshTimer) {
          clearInterval(refreshTimer)
          refreshTimer = null
        }
      }
    }
    
    // 状态判断函数
    const getMetricStatus = (value) => {
      if (value > 90) return 'critical'
      if (value > 70) return 'warning'
      return 'good'
    }
    
    const getResponseTimeStatus = (value) => {
      if (value > 2) return 'critical'
      if (value > 1) return 'warning'
      return 'good'
    }
    
    const getCacheHitStatus = (value) => {
      if (value < 50) return 'critical'
      if (value < 80) return 'warning'
      return 'good'
    }
    
    const getFCPStatus = (value) => {
      if (value > 3000) return 'critical'
      if (value > 1800) return 'warning'
      return 'good'
    }
    
    const getLCPStatus = (value) => {
      if (value > 4000) return 'critical'
      if (value > 2500) return 'warning'
      return 'good'
    }
    
    const getFIDStatus = (value) => {
      if (value > 300) return 'critical'
      if (value > 100) return 'warning'
      return 'good'
    }
    
    const getCLSStatus = (value) => {
      if (value > 0.25) return 'critical'
      if (value > 0.1) return 'warning'
      return 'good'
    }
    
    const getOverallScoreClass = (score) => {
      if (score >= 90) return 'excellent'
      if (score >= 70) return 'good'
      if (score >= 50) return 'fair'
      return 'poor'
    }
    
    const getPriorityType = (priority) => {
      const types = {
        high: 'danger',
        medium: 'warning',
        low: 'info'
      }
      return types[priority] || 'info'
    }
    
    const getPriorityText = (priority) => {
      const texts = {
        high: '高优先级',
        medium: '中优先级',
        low: '低优先级'
      }
      return texts[priority] || priority
    }
    
    const formatTime = (ms) => {
      if (ms < 1000) return `${ms.toFixed(0)}ms`
      return `${(ms / 1000).toFixed(2)}s`
    }
    
    onMounted(async () => {
      await refreshMetrics()
      
      // 启动前端性能监控
      frontendPerformanceService.initializePerformanceMonitoring()
    })
    
    onUnmounted(() => {
      if (refreshTimer) {
        clearInterval(refreshTimer)
      }
      frontendPerformanceService.cleanup()
    })
    
    return {
      performanceData,
      frontendMetrics,
      frontendScores,
      recommendations,
      isLoading,
      isOptimizing,
      autoRefresh,
      refreshInterval,
      refreshMetrics,
      optimizeSystem,
      clearCache,
      downloadReport,
      toggleAutoRefresh,
      getMetricStatus,
      getResponseTimeStatus,
      getCacheHitStatus,
      getFCPStatus,
      getLCPStatus,
      getFIDStatus,
      getCLSStatus,
      getOverallScoreClass,
      getPriorityType,
      getPriorityText,
      formatTime
    }
  }
}
</script>

<style scoped>
.performance-monitor {
  padding: var(--spacing-lg);
  background: var(--bg-secondary);
  min-height: 100vh;
}

.section-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

/* 性能概览 */
.performance-overview {
  margin-bottom: var(--spacing-2xl);
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-2xl);
}

.metric-card {
  background: var(--bg-primary);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-base);
  box-shadow: var(--shadow-base);
  transition: all var(--transition-base);
  border-left: 4px solid var(--success-color);
}

.metric-card.warning {
  border-left-color: var(--warning-color);
}

.metric-card.critical {
  border-left-color: var(--error-color);
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.metric-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xl);
}

.metric-card.warning .metric-icon {
  background: var(--warning-color);
}

.metric-card.critical .metric-icon {
  background: var(--error-color);
}

.metric-content {
  flex: 1;
}

.metric-value {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.metric-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

/* 性能图表 */
.performance-charts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-2xl);
}

.chart-container {
  background: var(--bg-primary);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-base);
}

.chart-container h4 {
  font-size: var(--font-size-lg);
  color: var(--text-primary);
  margin-bottom: var(--spacing-base);
  text-align: center;
}

.chart-placeholder {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-tertiary);
  border-radius: var(--border-radius-base);
}

/* 前端性能指标 */
.frontend-performance {
  background: var(--bg-primary);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-base);
  margin-bottom: var(--spacing-2xl);
}

.frontend-performance h4 {
  font-size: var(--font-size-lg);
  color: var(--text-primary);
  margin-bottom: var(--spacing-base);
  text-align: center;
}

.frontend-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-base);
  margin-bottom: var(--spacing-lg);
}

.frontend-metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm);
  background: var(--bg-tertiary);
  border-radius: var(--border-radius-base);
}

.frontend-metric label {
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
}

.frontend-metric .metric-value {
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-base);
}

.frontend-metric .metric-value.good {
  color: var(--success-color);
}

.frontend-metric .metric-value.warning {
  color: var(--warning-color);
}

.frontend-metric .metric-value.critical {
  color: var(--error-color);
}

.metric-score {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}

.overall-score {
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-lg);
}

.score-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 4px solid var(--success-color);
  background: var(--bg-secondary);
}

.score-circle.good {
  border-color: var(--warning-color);
}

.score-circle.fair {
  border-color: var(--error-color);
}

.score-circle.poor {
  border-color: #ff4d4f;
}

.score-value {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
}

.score-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-top: var(--spacing-xs);
}

/* 优化建议 */
.optimization-recommendations {
  background: var(--bg-primary);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-base);
  margin-bottom: var(--spacing-2xl);
}

.optimization-recommendations h4 {
  font-size: var(--font-size-lg);
  color: var(--text-primary);
  margin-bottom: var(--spacing-base);
  text-align: center;
}

.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-base);
}

.recommendation-item {
  padding: var(--spacing-base);
  border-radius: var(--border-radius-base);
  border-left: 4px solid var(--info-color);
  background: var(--bg-tertiary);
}

.recommendation-item.high {
  border-left-color: var(--error-color);
}

.recommendation-item.medium {
  border-left-color: var(--warning-color);
}

.recommendation-item.low {
  border-left-color: var(--info-color);
}

.recommendation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xs);
}

.recommendation-title {
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.recommendation-description {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
  line-height: var(--line-height-relaxed);
}

.recommendation-actions ul {
  margin: 0;
  padding-left: var(--spacing-base);
  color: var(--text-secondary);
}

.recommendation-actions li {
  margin-bottom: var(--spacing-xs);
  line-height: var(--line-height-relaxed);
}

/* 控制面板 */
.control-panel {
  background: var(--bg-primary);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-base);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-base);
}

.control-buttons {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.auto-refresh {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .performance-monitor {
    padding: var(--spacing-base);
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .performance-charts {
    grid-template-columns: 1fr;
  }

  .frontend-metrics {
    grid-template-columns: 1fr;
  }

  .control-panel {
    flex-direction: column;
    align-items: stretch;
  }

  .control-buttons {
    justify-content: center;
  }

  .auto-refresh {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .metric-card {
    flex-direction: column;
    text-align: center;
  }

  .frontend-metric {
    flex-direction: column;
    gap: var(--spacing-xs);
    text-align: center;
  }

  .recommendation-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }
}
</style>
