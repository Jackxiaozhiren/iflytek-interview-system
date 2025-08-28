<template>
  <div class="anti-cheat-system enhanced-chart" :class="getSystemThemeClass()">
    <!-- 系统头部 -->
    <div class="system-header">
      <h2 class="system-title">
        <div class="chart-icon">
          <el-icon><Lock /></el-icon>
        </div>
        智能防作弊监控系统
      </h2>
      <p class="system-subtitle">基于多模态AI技术的全方位作弊检测</p>
    </div>

    <!-- 实时监控状态 -->
    <div class="monitoring-status">
      <div class="status-indicator" :class="{ 'active': isMonitoring }">
        <div class="indicator-light"></div>
        <span>{{ isMonitoring ? '监控中' : '未启动' }}</span>
      </div>
      <div class="monitoring-stats">
        <span>检测准确率：<strong>{{ detectionAccuracy }}%</strong></span>
        <span>当前风险等级：<el-tag :type="getRiskLevelType()">{{ currentRiskLevel }}</el-tag></span>
      </div>
    </div>

    <!-- 检测模块 -->
    <div class="detection-modules">
      <h3>
        <el-icon><TrendCharts /></el-icon>
        检测模块状态
      </h3>
      <div class="modules-grid grid grid-cols-2 grid-gap-lg">
        <div 
          v-for="module in detectionModules"
          :key="module.id"
          class="module-card"
          :class="[module.theme, { 'active': module.enabled, 'alert': module.alertCount > 0 }]"
        >
          <div class="module-header">
            <div class="module-icon multimodal-icon" :class="module.iconClass">
              <el-icon><component :is="module.icon" /></el-icon>
            </div>
            <div class="module-info">
              <h4>{{ module.name }}</h4>
              <p>{{ module.description }}</p>
            </div>
            <el-switch v-model="module.enabled" @change="toggleModule(module)" />
          </div>
          
          <div class="module-stats">
            <div class="stat-item">
              <span class="stat-label">检测次数</span>
              <span class="stat-value">{{ module.detectionCount }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">异常发现</span>
              <span class="stat-value alert">{{ module.alertCount }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">准确率</span>
              <span class="stat-value">{{ module.accuracy }}%</span>
            </div>
          </div>

          <div class="module-progress">
            <el-progress 
              :percentage="module.confidence" 
              :color="getConfidenceColor(module.confidence)"
              :show-text="false"
              :stroke-width="6"
            />
            <span class="confidence-text">置信度: {{ module.confidence }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 实时警报 -->
    <div class="alert-panel" v-if="recentAlerts.length > 0">
      <h3>
        <el-icon><Warning /></el-icon>
        实时警报
        <el-badge :value="recentAlerts.length" class="alert-badge" />
      </h3>
      <div class="alerts-list">
        <div 
          v-for="alert in recentAlerts"
          :key="alert.id"
          class="alert-item"
          :class="alert.severity"
          v-motion-slide-visible-once-left
        >
          <div class="alert-icon">
            <el-icon><component :is="getAlertIcon(alert.type)" /></el-icon>
          </div>
          <div class="alert-content">
            <h5>{{ alert.title }}</h5>
            <p>{{ alert.description }}</p>
            <span class="alert-time">{{ formatTime(alert.timestamp) }}</span>
          </div>
          <div class="alert-actions">
            <el-button size="small" type="primary" @click="handleAlert(alert)">
              处理
            </el-button>
            <el-button size="small" @click="dismissAlert(alert.id)">
              忽略
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 检测历史统计 -->
    <div class="detection-history">
      <h3>
        <el-icon><TrendCharts /></el-icon>
        检测历史统计
      </h3>
      <div class="history-charts">
        <div class="chart-container">
          <h4>24小时检测趋势</h4>
          <div class="trend-chart">
            <canvas ref="trendCanvas" width="400" height="200"></canvas>
          </div>
        </div>
        <div class="chart-container">
          <h4>作弊类型分布</h4>
          <div class="distribution-chart">
            <div 
              v-for="type in cheatTypeDistribution"
              :key="type.name"
              class="distribution-item"
            >
              <span class="type-name">{{ type.name }}</span>
              <div class="type-bar">
                <div 
                  class="type-fill"
                  :style="{ width: type.percentage + '%', background: type.color }"
                ></div>
              </div>
              <span class="type-percentage">{{ type.percentage }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 系统配置 -->
    <div class="system-config">
      <h3>
        <el-icon><Setting /></el-icon>
        系统配置
      </h3>
      <div class="config-options">
        <div class="config-group">
          <h4>检测敏感度</h4>
          <el-radio-group v-model="detectionSensitivity">
            <el-radio value="low">低敏感度</el-radio>
            <el-radio value="medium">中等敏感度</el-radio>
            <el-radio value="high">高敏感度</el-radio>
          </el-radio-group>
        </div>
        <div class="config-group">
          <h4>自动处理</h4>
          <el-checkbox v-model="autoHandleAlerts">自动处理低风险警报</el-checkbox>
          <el-checkbox v-model="autoBlockSuspicious">自动阻止可疑行为</el-checkbox>
          <el-checkbox v-model="realTimeNotification">实时通知管理员</el-checkbox>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <el-button 
        type="primary" 
        size="large" 
        @click="toggleMonitoring"
        :loading="isToggling"
      >
        <el-icon><component :is="isMonitoring ? VideoPause : VideoPlay" /></el-icon>
        {{ isMonitoring ? '停止监控' : '开始监控' }}
      </el-button>
      <el-button size="large" @click="exportReport">
        <el-icon><Download /></el-icon>
        导出报告
      </el-button>
      <el-button size="large" @click="resetSystem">
        <el-icon><Refresh /></el-icon>
        重置系统
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  Lock, TrendCharts, Warning, Setting, VideoPlay, VideoPause, Download, Refresh, User, VideoCamera, Document, Connection, Timer
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 响应式数据
const isMonitoring = ref(false)
const isToggling = ref(false)
const detectionAccuracy = ref(96.8)
const currentRiskLevel = ref('低风险')
const detectionSensitivity = ref('medium')
const autoHandleAlerts = ref(true)
const autoBlockSuspicious = ref(false)
const realTimeNotification = ref(true)

// 检测模块
const detectionModules = ref([
  {
    id: 1,
    name: '人脸识别检测',
    description: '检测身份替换和多人作弊',
    icon: 'User',
    iconClass: 'ai-icon pulse',
    theme: 'ai-theme',
    enabled: true,
    detectionCount: 1247,
    alertCount: 3,
    accuracy: 98.5,
    confidence: 95
  },
  {
    id: 2,
    name: '视频行为分析',
    description: '监控异常行为和环境变化',
    icon: 'VideoCamera',
    iconClass: 'video-icon scanning',
    theme: 'bigdata-theme',
    enabled: true,
    detectionCount: 856,
    alertCount: 7,
    accuracy: 94.2,
    confidence: 88
  },
  {
    id: 3,
    name: '音频异常检测',
    description: '识别背景噪音和多人对话',
    icon: 'Connection',
    iconClass: 'iot-icon',
    theme: 'iot-theme',
    enabled: true,
    detectionCount: 642,
    alertCount: 2,
    accuracy: 92.8,
    confidence: 91
  },
  {
    id: 4,
    name: '屏幕监控',
    description: '检测截屏、录屏和窗口切换',
    icon: 'TrendCharts',
    iconClass: 'assessment-icon analyzing',
    theme: 'interview-theme',
    enabled: false,
    detectionCount: 485,
    alertCount: 12,
    accuracy: 89.6,
    confidence: 85
  }
])

// 实时警报
const recentAlerts = ref([
  {
    id: 1,
    type: 'face_change',
    title: '人脸变化检测',
    description: '候选人张三在面试过程中检测到人脸特征变化',
    severity: 'high',
    timestamp: Date.now() - 300000
  },
  {
    id: 2,
    type: 'background_noise',
    title: '背景噪音异常',
    description: '检测到疑似多人对话的背景声音',
    severity: 'medium',
    timestamp: Date.now() - 600000
  },
  {
    id: 3,
    type: 'screen_capture',
    title: '屏幕截图检测',
    description: '候选人李四尝试进行屏幕截图操作',
    severity: 'low',
    timestamp: Date.now() - 900000
  }
])

// 作弊类型分布
const cheatTypeDistribution = ref([
  { name: '身份替换', percentage: 35, color: '#ef4444' },
  { name: '屏幕截图', percentage: 28, color: '#f59e0b' },
  { name: '多人协助', percentage: 20, color: '#8b5cf6' },
  { name: '环境作弊', percentage: 12, color: '#06b6d4' },
  { name: '其他异常', percentage: 5, color: '#64748b' }
])

// 计算属性
const getRiskLevelType = () => {
  const levelMap = {
    '低风险': 'success',
    '中风险': 'warning',
    '高风险': 'danger'
  }
  return levelMap[currentRiskLevel.value] || 'info'
}

const getSystemThemeClass = () => {
  return 'chart-interview-theme'
}

// 方法
const getConfidenceColor = (confidence) => {
  if (confidence >= 90) return '#10b981'
  if (confidence >= 70) return '#f59e0b'
  return '#ef4444'
}

const getAlertIcon = (type) => {
  const iconMap = {
    'face_change': 'User',
    'background_noise': 'Connection',
    'screen_capture': 'TrendCharts',
    'window_switch': 'Document'
  }
  return iconMap[type] || 'Warning'
}

const formatTime = (timestamp) => {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  const hours = Math.floor(minutes / 60)
  return `${hours}小时前`
}

const toggleModule = (module) => {
  ElMessage.success(`${module.enabled ? '启用' : '禁用'}了${module.name}`)
}

const toggleMonitoring = async () => {
  isToggling.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    isMonitoring.value = !isMonitoring.value
    ElMessage.success(`监控系统已${isMonitoring.value ? '启动' : '停止'}`)
  } finally {
    isToggling.value = false
  }
}

const handleAlert = (alert) => {
  ElMessageBox.confirm(
    `确定要处理这个${alert.severity === 'high' ? '高风险' : alert.severity === 'medium' ? '中风险' : '低风险'}警报吗？`,
    '处理警报',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    dismissAlert(alert.id)
    ElMessage.success('警报已处理')
  })
}

const dismissAlert = (alertId) => {
  const index = recentAlerts.value.findIndex(alert => alert.id === alertId)
  if (index > -1) {
    recentAlerts.value.splice(index, 1)
  }
}

const exportReport = () => {
  ElMessage.success('正在生成检测报告...')
}

const resetSystem = () => {
  ElMessageBox.confirm(
    '确定要重置防作弊系统吗？这将清除所有历史数据。',
    '重置系统',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('系统已重置')
  })
}

// 生命周期
onMounted(() => {
  // 模拟实时数据更新
  const updateInterval = setInterval(() => {
    if (isMonitoring.value) {
      // 更新检测数据
      detectionModules.value.forEach(module => {
        if (module.enabled) {
          module.detectionCount += Math.floor(Math.random() * 3)
          if (Math.random() < 0.1) {
            module.alertCount += 1
          }
        }
      })
    }
  }, 5000)

  onUnmounted(() => {
    clearInterval(updateInterval)
  })
})
</script>

<style scoped>
.anti-cheat-system {
  padding: 2rem;
  margin: 2rem 0;
}

.system-header {
  text-align: center;
  margin-bottom: 2rem;
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

.monitoring-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
}

.indicator-light {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ef4444;
  animation: pulse 2s infinite;
}

.status-indicator.active .indicator-light {
  background: #10b981;
}

.monitoring-stats {
  display: flex;
  gap: 2rem;
  font-size: 0.9rem;
}

.detection-modules,
.alert-panel,
.detection-history,
.system-config {
  margin-bottom: 2rem;
}

.detection-modules h3,
.alert-panel h3,
.detection-history h3,
.system-config h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.module-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.module-card.active {
  border-color: var(--theme-primary);
}

.module-card.alert {
  border-color: #ef4444;
  background: #fef2f2;
}

.module-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.module-info {
  flex: 1;
}

.module-info h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.module-info p {
  color: #64748b;
  font-size: 0.9rem;
}

.module-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
}

.stat-item {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 0.8rem;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2d3748;
}

.stat-value.alert {
  color: #ef4444;
}

.module-progress {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.confidence-text {
  font-size: 0.8rem;
  color: #64748b;
  white-space: nowrap;
}

.alert-badge {
  margin-left: 0.5rem;
}

.alerts-list {
  max-height: 400px;
  overflow-y: auto;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-left: 4px solid #64748b;
}

.alert-item.high {
  border-left-color: #ef4444;
  background: #fef2f2;
}

.alert-item.medium {
  border-left-color: #f59e0b;
  background: #fffbeb;
}

.alert-item.low {
  border-left-color: #06b6d4;
  background: #f0f9ff;
}

.alert-content {
  flex: 1;
}

.alert-content h5 {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.alert-content p {
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.alert-time {
  font-size: 0.8rem;
  color: #9ca3af;
}

.history-charts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.chart-container {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.distribution-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.type-name {
  width: 80px;
  font-size: 0.9rem;
}

.type-bar {
  flex: 1;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.type-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.type-percentage {
  width: 40px;
  text-align: right;
  font-size: 0.8rem;
  color: #64748b;
}

.config-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.config-group h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@media (max-width: 768px) {
  .monitoring-status {
    flex-direction: column;
    gap: 1rem;
  }
  
  .history-charts,
  .config-options {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>
