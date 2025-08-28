<template>
  <div class="system-integration-monitor">
    <!-- 系统状态概览 -->
    <div class="system-overview">
      <div class="overview-header">
        <h3>iFlytek Spark 系统集成监控</h3>
        <div class="system-status" :class="systemStatus.level">
          <el-icon>
            <component :is="systemStatus.icon" />
          </el-icon>
          <span>{{ systemStatus.text }}</span>
        </div>
      </div>

      <div class="status-grid">
        <div class="status-card" v-for="metric in systemMetrics" :key="metric.name">
          <div class="metric-header">
            <div class="metric-icon" :style="{ backgroundColor: metric.color }">
              <el-icon>
                <component :is="metric.icon" />
              </el-icon>
            </div>
            <div class="metric-info">
              <h4>{{ metric.name }}</h4>
              <div class="metric-value" :class="metric.status">{{ metric.value }}</div>
            </div>
          </div>
          <div class="metric-chart">
            <div class="chart-line">
              <div 
                v-for="(point, index) in metric.history" 
                :key="index"
                class="chart-point"
                :style="{ 
                  left: (index / (metric.history.length - 1)) * 100 + '%',
                  bottom: (point / metric.max) * 100 + '%'
                }"
              ></div>
            </div>
          </div>
          <div class="metric-trend" :class="{ positive: metric.trend > 0, negative: metric.trend < 0 }">
            <el-icon>
              <component :is="metric.trend > 0 ? 'ArrowUp' : 'ArrowDown'" />
            </el-icon>
            {{ Math.abs(metric.trend) }}%
          </div>
        </div>
      </div>
    </div>

    <!-- 性能监控 -->
    <div class="performance-monitoring">
      <div class="monitoring-header">
        <h4>性能监控</h4>
        <div class="monitoring-controls">
          <el-switch v-model="monitoringEnabled" active-text="实时监控" />
          <el-button size="small" @click="refreshMetrics">
            <el-icon><Refresh /></el-icon>
            刷新数据
          </el-button>
        </div>
      </div>

      <div class="performance-charts">
        <!-- 页面加载性能 -->
        <div class="chart-container">
          <h5>页面加载性能</h5>
          <div class="load-performance">
            <div class="performance-bar">
              <div class="bar-segment dns" :style="{ width: loadTiming.dns + '%' }">
                <span>DNS</span>
              </div>
              <div class="bar-segment connect" :style="{ width: loadTiming.connect + '%' }">
                <span>连接</span>
              </div>
              <div class="bar-segment request" :style="{ width: loadTiming.request + '%' }">
                <span>请求</span>
              </div>
              <div class="bar-segment response" :style="{ width: loadTiming.response + '%' }">
                <span>响应</span>
              </div>
              <div class="bar-segment render" :style="{ width: loadTiming.render + '%' }">
                <span>渲染</span>
              </div>
            </div>
            <div class="timing-details">
              <div class="timing-item" v-for="(time, key) in loadTiming" :key="key">
                <span class="timing-label">{{ getTimingLabel(key) }}:</span>
                <span class="timing-value">{{ time }}ms</span>
              </div>
            </div>
          </div>
        </div>

        <!-- API响应时间 -->
        <div class="chart-container">
          <h5>API响应时间</h5>
          <div class="api-performance">
            <div class="api-list">
              <div class="api-item" v-for="api in apiMetrics" :key="api.name">
                <div class="api-info">
                  <span class="api-name">{{ api.name }}</span>
                  <span class="api-status" :class="api.status">{{ api.statusText }}</span>
                </div>
                <div class="api-timing">
                  <div class="timing-bar">
                    <div 
                      class="timing-fill" 
                      :style="{ 
                        width: (api.responseTime / maxApiTime) * 100 + '%',
                        backgroundColor: getApiColor(api.responseTime)
                      }"
                    ></div>
                  </div>
                  <span class="timing-text">{{ api.responseTime }}ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 内存使用情况 -->
        <div class="chart-container">
          <h5>内存使用情况</h5>
          <div class="memory-usage">
            <div class="memory-chart">
              <div class="memory-circle" :style="{ '--usage': memoryUsage.percentage + '%' }">
                <div class="memory-text">
                  <span class="usage-value">{{ memoryUsage.used }}MB</span>
                  <span class="usage-total">/ {{ memoryUsage.total }}MB</span>
                </div>
              </div>
            </div>
            <div class="memory-details">
              <div class="memory-item">
                <span class="memory-label">已使用:</span>
                <span class="memory-value">{{ memoryUsage.used }}MB</span>
              </div>
              <div class="memory-item">
                <span class="memory-label">可用:</span>
                <span class="memory-value">{{ memoryUsage.available }}MB</span>
              </div>
              <div class="memory-item">
                <span class="memory-label">使用率:</span>
                <span class="memory-value" :class="getMemoryClass(memoryUsage.percentage)">
                  {{ memoryUsage.percentage }}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 错误监控 -->
    <div class="error-monitoring">
      <div class="error-header">
        <h4>错误监控</h4>
        <div class="error-stats">
          <el-tag :type="errorStats.level" size="large">
            {{ errorStats.text }}
          </el-tag>
        </div>
      </div>

      <div class="error-content">
        <div class="error-summary">
          <div class="summary-item" v-for="(count, type) in errorSummary" :key="type">
            <div class="error-type">{{ getErrorTypeLabel(type) }}</div>
            <div class="error-count" :class="getErrorCountClass(count)">{{ count }}</div>
          </div>
        </div>

        <div class="recent-errors">
          <h5>最近错误</h5>
          <div class="error-list">
            <div class="error-item" v-for="error in recentErrors" :key="error.id">
              <div class="error-icon" :class="error.severity">
                <el-icon>
                  <component :is="getErrorIcon(error.type)" />
                </el-icon>
              </div>
              <div class="error-details">
                <div class="error-message">{{ error.message }}</div>
                <div class="error-meta">
                  <span class="error-time">{{ formatTime(error.timestamp) }}</span>
                  <span class="error-source">{{ error.source }}</span>
                </div>
              </div>
              <div class="error-actions">
                <el-button size="small" @click="viewErrorDetail(error)">
                  查看详情
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 缓存管理 -->
    <div class="cache-management">
      <div class="cache-header">
        <h4>缓存管理</h4>
        <div class="cache-actions">
          <el-button size="small" @click="clearCache">
            <el-icon><Delete /></el-icon>
            清空缓存
          </el-button>
          <el-button size="small" @click="optimizeCache">
            <el-icon><Setting /></el-icon>
            优化缓存
          </el-button>
        </div>
      </div>

      <div class="cache-stats">
        <div class="cache-overview">
          <div class="cache-metric" v-for="metric in cacheMetrics" :key="metric.name">
            <div class="cache-label">{{ metric.name }}</div>
            <div class="cache-value" :class="metric.status">{{ metric.value }}</div>
          </div>
        </div>

        <div class="cache-distribution">
          <h5>缓存分布</h5>
          <div class="distribution-chart">
            <div 
              v-for="item in cacheDistribution" 
              :key="item.type"
              class="distribution-bar"
            >
              <div class="bar-label">{{ item.type }}</div>
              <div class="bar-container">
                <div 
                  class="bar-fill" 
                  :style="{ 
                    width: (item.size / totalCacheSize) * 100 + '%',
                    backgroundColor: item.color 
                  }"
                ></div>
              </div>
              <div class="bar-value">{{ item.size }}KB</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 优化建议 -->
    <div class="optimization-suggestions">
      <div class="suggestions-header">
        <h4>优化建议</h4>
        <div class="suggestions-count">
          <el-badge :value="optimizationSuggestions.length" type="warning">
            <el-icon><Bell /></el-icon>
          </el-badge>
        </div>
      </div>

      <div class="suggestions-list">
        <div class="suggestion-item" v-for="suggestion in optimizationSuggestions" :key="suggestion.id">
          <div class="suggestion-priority" :class="suggestion.priority">
            <el-icon>
              <component :is="getPriorityIcon(suggestion.priority)" />
            </el-icon>
          </div>
          <div class="suggestion-content">
            <div class="suggestion-title">{{ suggestion.title }}</div>
            <div class="suggestion-description">{{ suggestion.description }}</div>
            <div class="suggestion-impact">
              <span class="impact-label">预期提升:</span>
              <span class="impact-value">{{ suggestion.impact }}</span>
            </div>
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
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import {
  ArrowUp, ArrowDown, Refresh, Delete, Setting, Notification,
  TrendCharts, Timer, Cpu, Warning, Check, Close
} from '@element-plus/icons-vue'
import { systemOptimizer } from '../utils/systemOptimization.js'

// 基础状态
const monitoringEnabled = ref(true)
const updateInterval = ref(null)

// 系统状态
const systemStatus = reactive({
  level: 'healthy',
  text: '系统运行正常',
  icon: 'Check'
})

// 系统指标
const systemMetrics = reactive([
  {
    name: '响应时间',
    value: '156ms',
    status: 'good',
    color: '#2ecc71',
    icon: 'Timer',
    trend: -5.2,
    history: [120, 135, 142, 156, 148, 152, 156],
    max: 200
  },
  {
    name: 'CPU使用率',
    value: '45%',
    status: 'normal',
    color: '#3498db',
    icon: 'TrendCharts',
    trend: 2.1,
    history: [40, 42, 45, 48, 46, 44, 45],
    max: 100
  },
  {
    name: '内存使用',
    value: '68MB',
    status: 'normal',
    color: '#f39c12',
    icon: 'Cpu',
    trend: 8.3,
    history: [55, 58, 62, 65, 66, 67, 68],
    max: 100
  },
  {
    name: '错误率',
    value: '0.2%',
    status: 'good',
    color: '#e74c3c',
    icon: 'Warning',
    trend: -12.5,
    history: [0.5, 0.4, 0.3, 0.2, 0.3, 0.2, 0.2],
    max: 1
  }
])

// 页面加载时序
const loadTiming = reactive({
  dns: 45,
  connect: 120,
  request: 85,
  response: 230,
  render: 180
})

// API性能指标
const apiMetrics = reactive([
  {
    name: '/api/interview/start',
    responseTime: 156,
    status: 'success',
    statusText: '正常'
  },
  {
    name: '/api/candidate/profile',
    responseTime: 89,
    status: 'success',
    statusText: '正常'
  },
  {
    name: '/api/analysis/report',
    responseTime: 234,
    status: 'warning',
    statusText: '较慢'
  },
  {
    name: '/api/spark/generate',
    responseTime: 445,
    status: 'error',
    statusText: '超时'
  }
])

const maxApiTime = computed(() => {
  return Math.max(...apiMetrics.map(api => api.responseTime))
})

// 内存使用情况
const memoryUsage = reactive({
  used: 68,
  total: 128,
  available: 60,
  percentage: 53
})

// 错误统计
const errorStats = reactive({
  level: 'success',
  text: '错误率较低'
})

const errorSummary = reactive({
  javascript: 2,
  api: 1,
  network: 0,
  system: 1
})

const recentErrors = reactive([
  {
    id: 1,
    type: 'javascript',
    severity: 'medium',
    message: 'Cannot read property of undefined',
    source: 'InterviewComponent.vue:45',
    timestamp: new Date(Date.now() - 5 * 60 * 1000)
  },
  {
    id: 2,
    type: 'api',
    severity: 'high',
    message: 'API请求超时: /api/spark/generate',
    source: 'SparkService.js:128',
    timestamp: new Date(Date.now() - 15 * 60 * 1000)
  },
  {
    id: 3,
    type: 'system',
    severity: 'low',
    message: '缓存清理完成',
    source: 'CacheManager.js:67',
    timestamp: new Date(Date.now() - 30 * 60 * 1000)
  }
])

// 缓存指标
const cacheMetrics = reactive([
  {
    name: '命中率',
    value: '87%',
    status: 'good'
  },
  {
    name: '缓存大小',
    value: '24MB',
    status: 'normal'
  },
  {
    name: '过期项',
    value: '12',
    status: 'warning'
  }
])

const cacheDistribution = reactive([
  {
    type: 'API响应',
    size: 8500,
    color: '#3498db'
  },
  {
    type: '图片资源',
    size: 12300,
    color: '#2ecc71'
  },
  {
    type: '用户数据',
    size: 3200,
    color: '#f39c12'
  },
  {
    type: '其他',
    size: 1800,
    color: '#95a5a6'
  }
])

const totalCacheSize = computed(() => {
  return cacheDistribution.reduce((total, item) => total + item.size, 0)
})

// 优化建议
const optimizationSuggestions = reactive([
  {
    id: 1,
    priority: 'high',
    title: 'API响应时间优化',
    description: '检测到/api/spark/generate接口响应时间过长，建议优化算法或增加缓存',
    impact: '响应时间减少40%'
  },
  {
    id: 2,
    priority: 'medium',
    title: '内存使用优化',
    description: '当前内存使用率较高，建议清理无用缓存和优化数据结构',
    impact: '内存使用减少25%'
  },
  {
    id: 3,
    priority: 'low',
    title: '缓存策略优化',
    description: '缓存命中率可以进一步提升，建议调整缓存策略',
    impact: '缓存命中率提升15%'
  }
])

// 方法定义
const getTimingLabel = (key) => {
  const labels = {
    dns: 'DNS解析',
    connect: '建立连接',
    request: '发送请求',
    response: '接收响应',
    render: '页面渲染'
  }
  return labels[key] || key
}

const getApiColor = (responseTime) => {
  if (responseTime < 100) return '#2ecc71'
  if (responseTime < 300) return '#f39c12'
  return '#e74c3c'
}

const getMemoryClass = (percentage) => {
  if (percentage < 60) return 'good'
  if (percentage < 80) return 'warning'
  return 'danger'
}

const getErrorTypeLabel = (type) => {
  const labels = {
    javascript: 'JS错误',
    api: 'API错误',
    network: '网络错误',
    system: '系统错误'
  }
  return labels[type] || type
}

const getErrorCountClass = (count) => {
  if (count === 0) return 'good'
  if (count < 5) return 'warning'
  return 'danger'
}

const getErrorIcon = (type) => {
  const icons = {
    javascript: 'Warning',
    api: 'Connection',
    network: 'Wifi',
    system: 'Setting'
  }
  return icons[type] || 'Warning'
}

const getPriorityIcon = (priority) => {
  const icons = {
    high: 'Warning',
    medium: 'Notification',
    low: 'InfoFilled'
  }
  return icons[priority] || 'InfoFilled'
}

const formatTime = (timestamp) => {
  return timestamp.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 操作方法
const refreshMetrics = () => {
  console.log('刷新系统指标')
  updateSystemMetrics()
}

const clearCache = () => {
  console.log('清空缓存')
  if (systemOptimizer.cacheManager) {
    systemOptimizer.cacheManager.clear()
  }
}

const optimizeCache = () => {
  console.log('优化缓存')
}

const viewErrorDetail = (error) => {
  console.log('查看错误详情:', error)
}

const applySuggestion = (suggestion) => {
  console.log('应用优化建议:', suggestion.title)
  const index = optimizationSuggestions.findIndex(s => s.id === suggestion.id)
  if (index > -1) {
    optimizationSuggestions.splice(index, 1)
  }
}

const dismissSuggestion = (suggestion) => {
  console.log('忽略优化建议:', suggestion.title)
  const index = optimizationSuggestions.findIndex(s => s.id === suggestion.id)
  if (index > -1) {
    optimizationSuggestions.splice(index, 1)
  }
}

// 更新系统指标
const updateSystemMetrics = () => {
  if (!monitoringEnabled.value) return

  // 模拟实时数据更新
  systemMetrics.forEach(metric => {
    // 更新历史数据
    metric.history.shift()
    const newValue = metric.history[metric.history.length - 1] + (Math.random() - 0.5) * 10
    metric.history.push(Math.max(0, Math.min(metric.max, newValue)))

    // 更新当前值
    const currentValue = metric.history[metric.history.length - 1]
    if (metric.name === '响应时间') {
      metric.value = Math.round(currentValue) + 'ms'
    } else if (metric.name === 'CPU使用率' || metric.name === '错误率') {
      metric.value = currentValue.toFixed(1) + '%'
    } else if (metric.name === '内存使用') {
      metric.value = Math.round(currentValue) + 'MB'
    }
  })

  // 更新API指标
  apiMetrics.forEach(api => {
    api.responseTime += (Math.random() - 0.5) * 20
    api.responseTime = Math.max(50, Math.min(500, api.responseTime))
    api.responseTime = Math.round(api.responseTime)
  })

  // 更新内存使用
  memoryUsage.used += (Math.random() - 0.5) * 2
  memoryUsage.used = Math.max(40, Math.min(100, memoryUsage.used))
  memoryUsage.used = Math.round(memoryUsage.used)
  memoryUsage.percentage = Math.round((memoryUsage.used / memoryUsage.total) * 100)
  memoryUsage.available = memoryUsage.total - memoryUsage.used
}

onMounted(() => {
  console.log('系统集成监控组件已加载')

  // 启动实时监控
  if (monitoringEnabled.value) {
    updateInterval.value = setInterval(updateSystemMetrics, 3000)
  }

  // 获取系统状态
  if (systemOptimizer) {
    const status = systemOptimizer.getSystemStatus()
    console.log('系统状态:', status)
  }
})

onUnmounted(() => {
  if (updateInterval.value) {
    clearInterval(updateInterval.value)
  }
})
</script>

<style scoped>
.system-integration-monitor {
  padding: 24px;
  background: #f8f9fa;
  min-height: 100vh;
}

/* 系统概览样式 */
.system-overview {
  background: white;
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.overview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.overview-header h3 {
  font-size: 24px;
  color: #2c3e50;
  margin: 0;
}

.system-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
}

.system-status.healthy {
  background: rgba(46, 204, 113, 0.2);
  color: #2ecc71;
}

.system-status.warning {
  background: rgba(243, 156, 18, 0.2);
  color: #f39c12;
}

.system-status.critical {
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.status-card {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.status-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.metric-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.metric-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.metric-info h4 {
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 8px;
}

.metric-value {
  font-size: 24px;
  font-weight: 700;
}

.metric-value.good {
  color: #2ecc71;
}

.metric-value.normal {
  color: #3498db;
}

.metric-value.warning {
  color: #f39c12;
}

.metric-value.danger {
  color: #e74c3c;
}

.metric-chart {
  height: 40px;
  position: relative;
  margin-bottom: 16px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
}

.chart-line {
  position: relative;
  height: 100%;
}

.chart-point {
  position: absolute;
  width: 4px;
  height: 4px;
  background: var(--iflytek-primary);
  border-radius: 50%;
  transform: translate(-50%, 50%);
}

.metric-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
}

.metric-trend.positive {
  color: #2ecc71;
}

.metric-trend.negative {
  color: #e74c3c;
}

/* 性能监控样式 */
.performance-monitoring {
  background: white;
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.monitoring-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.monitoring-header h4 {
  font-size: 20px;
  color: #2c3e50;
  margin: 0;
}

.monitoring-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.performance-charts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 32px;
}

.chart-container {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 24px;
}

.chart-container h5 {
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 20px;
}

/* 页面加载性能样式 */
.performance-bar {
  display: flex;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
}

.bar-segment {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: 600;
  position: relative;
}

.bar-segment.dns {
  background: #3498db;
}

.bar-segment.connect {
  background: #2ecc71;
}

.bar-segment.request {
  background: #f39c12;
}

.bar-segment.response {
  background: #e74c3c;
}

.bar-segment.render {
  background: #9b59b6;
}

.timing-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.timing-item {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.timing-label {
  color: #7f8c8d;
}

.timing-value {
  color: #2c3e50;
  font-weight: 600;
}

/* API性能样式 */
.api-list {
  space-y: 12px;
}

.api-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #e9ecef;
}

.api-item:last-child {
  border-bottom: none;
}

.api-info {
  flex: 1;
}

.api-name {
  font-size: 14px;
  color: #2c3e50;
  font-weight: 600;
  display: block;
  margin-bottom: 4px;
}

.api-status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
}

.api-status.success {
  background: rgba(46, 204, 113, 0.2);
  color: #2ecc71;
}

.api-status.warning {
  background: rgba(243, 156, 18, 0.2);
  color: #f39c12;
}

.api-status.error {
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
}

.api-timing {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 150px;
}

.timing-bar {
  flex: 1;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.timing-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.timing-text {
  font-size: 12px;
  color: #2c3e50;
  font-weight: 600;
  min-width: 50px;
}

/* 内存使用样式 */
.memory-usage {
  display: flex;
  gap: 32px;
  align-items: center;
}

.memory-chart {
  flex-shrink: 0;
}

.memory-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: conic-gradient(var(--iflytek-primary) var(--usage, 0%), #e9ecef 0%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.memory-circle::before {
  content: '';
  position: absolute;
  width: 90px;
  height: 90px;
  background: white;
  border-radius: 50%;
}

.memory-text {
  text-align: center;
  z-index: 1;
}

.usage-value {
  display: block;
  font-size: 18px;
  font-weight: 700;
  color: var(--iflytek-primary);
  margin-bottom: 4px;
}

.usage-total {
  font-size: 12px;
  color: #7f8c8d;
}

.memory-details {
  flex: 1;
  space-y: 12px;
}

.memory-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.memory-label {
  font-size: 14px;
  color: #7f8c8d;
}

.memory-value {
  font-size: 14px;
  font-weight: 600;
}

.memory-value.good {
  color: #2ecc71;
}

.memory-value.warning {
  color: #f39c12;
}

.memory-value.danger {
  color: #e74c3c;
}

/* 错误监控样式 */
.error-monitoring {
  background: white;
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.error-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.error-header h4 {
  font-size: 20px;
  color: #2c3e50;
  margin: 0;
}

.error-content {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 32px;
}

.error-summary {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.summary-item:last-child {
  margin-bottom: 0;
}

.error-type {
  font-size: 14px;
  color: #2c3e50;
  font-weight: 600;
}

.error-count {
  font-size: 16px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 8px;
}

.error-count.good {
  background: rgba(46, 204, 113, 0.2);
  color: #2ecc71;
}

.error-count.warning {
  background: rgba(243, 156, 18, 0.2);
  color: #f39c12;
}

.error-count.danger {
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
}

.recent-errors h5 {
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 20px;
}

.error-list {
  space-y: 16px;
}

.error-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
  margin-bottom: 16px;
}

.error-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.error-icon.high {
  background: #e74c3c;
}

.error-icon.medium {
  background: #f39c12;
}

.error-icon.low {
  background: #3498db;
}

.error-details {
  flex: 1;
}

.error-message {
  font-size: 14px;
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 8px;
}

.error-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #7f8c8d;
}

.error-actions {
  flex-shrink: 0;
}

/* 缓存管理样式 */
.cache-management {
  background: white;
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.cache-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.cache-header h4 {
  font-size: 20px;
  color: #2c3e50;
  margin: 0;
}

.cache-actions {
  display: flex;
  gap: 12px;
}

.cache-stats {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 32px;
}

.cache-overview {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
}

.cache-metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.cache-metric:last-child {
  margin-bottom: 0;
}

.cache-label {
  font-size: 14px;
  color: #2c3e50;
  font-weight: 600;
}

.cache-value {
  font-size: 16px;
  font-weight: 700;
}

.cache-value.good {
  color: #2ecc71;
}

.cache-value.normal {
  color: #3498db;
}

.cache-value.warning {
  color: #f39c12;
}

.cache-distribution h5 {
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 20px;
}

.distribution-chart {
  space-y: 12px;
}

.distribution-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.bar-label {
  min-width: 80px;
  font-size: 12px;
  color: #2c3e50;
  font-weight: 600;
}

.bar-container {
  flex: 1;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.bar-value {
  min-width: 60px;
  font-size: 12px;
  color: #7f8c8d;
  text-align: right;
}

/* 优化建议样式 */
.optimization-suggestions {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.suggestions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.suggestions-header h4 {
  font-size: 20px;
  color: #2c3e50;
  margin: 0;
}

.suggestions-list {
  space-y: 20px;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  background: #f8f9fa;
  border-radius: 16px;
  margin-bottom: 20px;
  border-left: 4px solid transparent;
  transition: all 0.3s ease;
}

.suggestion-item:hover {
  transform: translateX(4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.suggestion-priority {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.suggestion-priority.high {
  background: #e74c3c;
}

.suggestion-priority.medium {
  background: #f39c12;
}

.suggestion-priority.low {
  background: #3498db;
}

.suggestion-item:has(.suggestion-priority.high) {
  border-left-color: #e74c3c;
}

.suggestion-item:has(.suggestion-priority.medium) {
  border-left-color: #f39c12;
}

.suggestion-item:has(.suggestion-priority.low) {
  border-left-color: #3498db;
}

.suggestion-content {
  flex: 1;
}

.suggestion-title {
  font-size: 16px;
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 8px;
}

.suggestion-description {
  font-size: 14px;
  color: #7f8c8d;
  line-height: 1.5;
  margin-bottom: 12px;
}

.suggestion-impact {
  display: flex;
  align-items: center;
  gap: 8px;
}

.impact-label {
  font-size: 12px;
  color: #95a5a6;
}

.impact-value {
  font-size: 12px;
  color: var(--iflytek-primary);
  font-weight: 600;
}

.suggestion-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .system-integration-monitor {
    padding: 16px;
  }

  .system-overview,
  .performance-monitoring,
  .error-monitoring,
  .cache-management,
  .optimization-suggestions {
    padding: 20px;
  }

  .overview-header,
  .monitoring-header,
  .error-header,
  .cache-header,
  .suggestions-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .monitoring-controls,
  .cache-actions {
    flex-direction: column;
    width: 100%;
  }

  .status-grid {
    grid-template-columns: 1fr;
  }

  .performance-charts {
    grid-template-columns: 1fr;
  }

  .error-content,
  .cache-stats {
    grid-template-columns: 1fr;
  }

  .memory-usage {
    flex-direction: column;
    gap: 20px;
  }

  .suggestion-item {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }

  .suggestion-actions {
    flex-direction: column;
    width: 100%;
  }

  .timing-details {
    grid-template-columns: 1fr;
  }

  .api-item {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }

  .api-timing {
    min-width: auto;
    width: 100%;
  }

  .distribution-bar {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }

  .bar-container {
    order: 2;
  }

  .bar-label {
    order: 1;
    min-width: auto;
  }

  .bar-value {
    order: 3;
    min-width: auto;
    text-align: center;
  }
}

/* 动画效果 */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.chart-point {
  animation: pulse 2s infinite;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.status-card,
.chart-container,
.error-item,
.suggestion-item {
  animation: slideIn 0.3s ease-out;
}

/* 进度条动画 */
@keyframes progressFill {
  from {
    width: 0%;
  }
  to {
    width: var(--target-width);
  }
}

.timing-fill,
.bar-fill {
  animation: progressFill 1s ease-out;
}
</style>
