<template>
  <div class="interactive-enhancer">
    <!-- 浮动操作面板 -->
    <div class="floating-action-panel" :class="{ 'panel-expanded': isPanelExpanded }">
      <div class="panel-toggle" @click="togglePanel">
        <el-icon class="toggle-icon">
          <component :is="isPanelExpanded ? 'Close' : 'Setting'" />
        </el-icon>
      </div>
      
      <transition name="panel-slide">
        <div v-if="isPanelExpanded" class="panel-content">
          <div class="panel-section">
            <h4 class="section-title">
              <el-icon><Download /></el-icon>
              快速导出
            </h4>
            <div class="export-controls">
              <div class="format-selector">
                <el-radio-group v-model="exportFormat" size="small">
                  <el-radio-button label="pdf">PDF</el-radio-button>
                  <el-radio-button label="excel">Excel</el-radio-button>
                </el-radio-group>
              </div>
              <el-button
                size="small"
                type="primary"
                @click="quickExport"
                :loading="isExporting"
              >
                <el-icon><Download /></el-icon>
                一键导出
              </el-button>
            </div>
          </div>

          <div class="panel-section">
            <h4 class="section-title">
              <el-icon><Refresh /></el-icon>
              数据刷新
            </h4>
            <div class="refresh-controls">
              <div class="refresh-status">
                <span class="status-text">{{ refreshStatus }}</span>
                <span class="last-update">{{ lastUpdateTime }}</span>
              </div>
              <el-button
                size="small"
                type="success"
                @click="refreshData"
                :loading="isRefreshing"
              >
                <el-icon><Refresh /></el-icon>
                立即刷新
              </el-button>
            </div>
          </div>

          <div class="panel-section">
            <h4 class="section-title">
              <el-icon><View /></el-icon>
              视图切换
            </h4>
            <div class="view-toggle">
              <el-radio-group v-model="currentView" size="small" @change="switchView">
                <el-radio-button label="table">
                  <el-icon><Grid /></el-icon>
                  表格视图
                </el-radio-button>
                <el-radio-button label="chart">
                  <el-icon><TrendCharts /></el-icon>
                  图表视图
                </el-radio-button>
              </el-radio-group>
            </div>
          </div>

          <div class="panel-section">
            <h4 class="section-title">
              <el-icon><Filter /></el-icon>
              筛选设置
            </h4>
            <div class="filter-controls">
              <div class="time-range">
                <el-select v-model="timeRange" size="small" placeholder="选择时间范围">
                  <el-option label="最近7天" value="7d" />
                  <el-option label="最近30天" value="30d" />
                  <el-option label="最近3个月" value="3m" />
                  <el-option label="自定义" value="custom" />
                </el-select>
              </div>
              <el-button
                size="small"
                type="warning"
                @click="applyFilters"
                :loading="isFiltering"
              >
                <el-icon><Filter /></el-icon>
                应用筛选
              </el-button>
            </div>
          </div>

          <div class="panel-section">
            <h4 class="section-title">
              <el-icon><Share /></el-icon>
              分享链接
            </h4>
            <div class="share-controls">
              <div class="permission-selector">
                <el-select v-model="sharePermission" size="small" placeholder="选择权限">
                  <el-option label="仅查看" value="view" />
                  <el-option label="可编辑" value="edit" />
                  <el-option label="管理员" value="admin" />
                </el-select>
              </div>
              <el-button
                size="small"
                type="info"
                @click="generateShareLink"
                :loading="isGeneratingLink"
              >
                <el-icon><Share /></el-icon>
                生成链接
              </el-button>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- 智能提示气泡 -->
    <transition-group name="bubble" tag="div" class="smart-bubbles">
      <div 
        v-for="bubble in activeBubbles" 
        :key="bubble.id"
        class="smart-bubble"
        :style="{ 
          left: bubble.x + 'px', 
          top: bubble.y + 'px',
          background: bubble.color 
        }"
        @click="handleBubbleClick(bubble)"
      >
        <el-icon class="bubble-icon">
          <component :is="bubble.icon" />
        </el-icon>
        <span class="bubble-text">{{ bubble.text }}</span>
      </div>
    </transition-group>

    <!-- 进度指示器 -->
    <div class="progress-indicator" v-if="showProgress">
      <div class="progress-ring">
        <svg class="progress-svg" width="60" height="60">
          <circle
            class="progress-circle-bg"
            cx="30"
            cy="30"
            r="25"
            fill="none"
            stroke="#e6f7ff"
            stroke-width="4"
          />
          <circle
            class="progress-circle"
            cx="30"
            cy="30"
            r="25"
            fill="none"
            stroke="#1890ff"
            stroke-width="4"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="progressOffset"
          />
        </svg>
        <div class="progress-text">{{ Math.round(progressValue) }}%</div>
      </div>
      <div class="progress-label">{{ progressLabel }}</div>
    </div>

    <!-- 快捷键提示 -->
    <div class="keyboard-shortcuts" v-if="showShortcuts">
      <div class="shortcuts-header">
        <h4>快捷键</h4>
        <el-button size="small" text @click="hideShortcuts">
          <el-icon><Close /></el-icon>
        </el-button>
      </div>
      <div class="shortcuts-list">
        <div class="shortcut-item" v-for="shortcut in shortcuts" :key="shortcut.key">
          <kbd class="shortcut-key">{{ shortcut.key }}</kbd>
          <span class="shortcut-desc">{{ shortcut.description }}</span>
        </div>
      </div>
    </div>

    <!-- 反馈收集器 -->
    <div class="feedback-collector" v-if="showFeedbackCollector">
      <div class="feedback-header">
        <h4>体验反馈</h4>
        <el-button size="small" text @click="closeFeedbackCollector">
          <el-icon><Close /></el-icon>
        </el-button>
      </div>
      <div class="feedback-content">
        <el-rate v-model="feedbackRating" size="large" />
        <el-input
          v-model="feedbackText"
          type="textarea"
          placeholder="请分享您的使用体验和建议..."
          :rows="3"
          maxlength="200"
          show-word-limit
        />
        <div class="feedback-actions">
          <el-button size="small" @click="submitFeedback" type="primary">
            提交反馈
          </el-button>
        </div>
      </div>
    </div>

    <!-- 性能监控器 -->
    <div class="performance-monitor" v-if="showPerformanceMonitor">
      <div class="monitor-header">
        <el-icon><TrendCharts /></el-icon>
        <span>性能监控</span>
      </div>
      <div class="monitor-metrics">
        <div class="metric-item">
          <span class="metric-label">加载时间</span>
          <span class="metric-value">{{ performanceMetrics.loadTime }}ms</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">渲染时间</span>
          <span class="metric-value">{{ performanceMetrics.renderTime }}ms</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">内存使用</span>
          <span class="metric-value">{{ performanceMetrics.memoryUsage }}MB</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'
import {
  Setting, Close, Download, Refresh, View, Share, Filter, Grid,
  TrendCharts
} from '@element-plus/icons-vue'

// Props
const props = defineProps({
  enableSmartBubbles: {
    type: Boolean,
    default: true
  },
  enableProgressIndicator: {
    type: Boolean,
    default: true
  },
  enablePerformanceMonitor: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits([
  'smart-analysis', 'generate-insights', 'export-report', 
  'share-report', 'print-report', 'feedback-submitted'
])

// 响应式数据
const isPanelExpanded = ref(false)
const isExporting = ref(false)
const isRefreshing = ref(false)
const isFiltering = ref(false)
const isGeneratingLink = ref(false)
const exportFormat = ref('pdf')
const currentView = ref('table')
const timeRange = ref('30d')
const sharePermission = ref('view')
const refreshStatus = ref('数据已同步')
const lastUpdateTime = ref('刚刚')
const showProgress = ref(false)
const progressValue = ref(0)
const progressLabel = ref('')
const showShortcuts = ref(false)
const showFeedbackCollector = ref(false)
const showPerformanceMonitor = ref(props.enablePerformanceMonitor)
const feedbackRating = ref(5)
const feedbackText = ref('')

// 智能气泡数据
const activeBubbles = ref([])
const bubbleIdCounter = ref(0)

// 快捷键数据
const shortcuts = ref([
  { key: 'Ctrl + E', description: '快速导出' },
  { key: 'Ctrl + R', description: '刷新数据' },
  { key: 'Ctrl + T', description: '切换视图' },
  { key: 'Ctrl + F', description: '应用筛选' },
  { key: 'Ctrl + S', description: '生成分享链接' },
  { key: 'F1', description: '显示帮助' }
])

// 性能监控数据
const performanceMetrics = ref({
  loadTime: 0,
  renderTime: 0,
  memoryUsage: 0
})

// 计算属性
const circumference = computed(() => 2 * Math.PI * 25)
const progressOffset = computed(() => {
  return circumference.value - (progressValue.value / 100) * circumference.value
})

// 方法
const togglePanel = () => {
  isPanelExpanded.value = !isPanelExpanded.value
}

const quickExport = async () => {
  isExporting.value = true
  showProgress.value = true
  progressLabel.value = `正在导出${exportFormat.value.toUpperCase()}格式...`

  try {
    // 模拟导出过程
    for (let i = 0; i <= 100; i += 20) {
      progressValue.value = i
      await new Promise(resolve => setTimeout(resolve, 300))
    }

    emit('export-report', { format: exportFormat.value })
    ElMessage.success(`${exportFormat.value.toUpperCase()}报告导出成功`)

    // 添加成功气泡
    addSmartBubble({
      text: '导出完成',
      icon: 'Check',
      color: '#52c41a',
      x: Math.random() * (window.innerWidth - 200),
      y: Math.random() * (window.innerHeight - 100)
    })

  } catch (error) {
    ElMessage.error('导出失败，请重试')
  } finally {
    isExporting.value = false
    showProgress.value = false
    progressValue.value = 0
  }
}

const refreshData = async () => {
  isRefreshing.value = true
  refreshStatus.value = '正在刷新...'
  showProgress.value = true
  progressLabel.value = '正在更新数据...'

  try {
    for (let i = 0; i <= 100; i += 25) {
      progressValue.value = i
      await new Promise(resolve => setTimeout(resolve, 200))
    }

    refreshStatus.value = '数据已同步'
    lastUpdateTime.value = new Date().toLocaleTimeString()
    ElMessage.success('数据刷新完成')

    // 添加成功气泡
    addSmartBubble({
      text: '数据已更新',
      icon: 'Check',
      color: '#52c41a',
      x: Math.random() * (window.innerWidth - 200),
      y: Math.random() * (window.innerHeight - 100)
    })

  } catch (error) {
    refreshStatus.value = '刷新失败'
    ElMessage.error('数据刷新失败')
  } finally {
    isRefreshing.value = false
    showProgress.value = false
    progressValue.value = 0
  }
}

const switchView = (view) => {
  currentView.value = view
  ElMessage.info(view === 'table' ? '已切换到表格视图' : '已切换到图表视图')

  // 添加视图切换气泡
  addSmartBubble({
    text: `${view === 'table' ? '表格' : '图表'}视图`,
    icon: view === 'table' ? 'Grid' : 'TrendCharts',
    color: '#1890ff',
    x: Math.random() * (window.innerWidth - 200),
    y: Math.random() * (window.innerHeight - 100)
  })
}

const applyFilters = async () => {
  isFiltering.value = true
  showProgress.value = true
  progressLabel.value = '正在应用筛选条件...'

  try {
    for (let i = 0; i <= 100; i += 33) {
      progressValue.value = i
      await new Promise(resolve => setTimeout(resolve, 150))
    }

    ElMessage.success('筛选条件已应用')

  } catch (error) {
    ElMessage.error('筛选应用失败')
  } finally {
    isFiltering.value = false
    showProgress.value = false
    progressValue.value = 0
  }
}

const generateShareLink = async () => {
  isGeneratingLink.value = true
  showProgress.value = true
  progressLabel.value = '正在生成分享链接...'

  try {
    for (let i = 0; i <= 100; i += 50) {
      progressValue.value = i
      await new Promise(resolve => setTimeout(resolve, 200))
    }

    const shareUrl = `${window.location.origin}/shared-report/${Date.now()}?permission=${sharePermission.value}`

    // 复制到剪贴板
    await navigator.clipboard.writeText(shareUrl)
    ElMessage.success('分享链接已复制到剪贴板')

    // 添加成功气泡
    addSmartBubble({
      text: '链接已生成',
      icon: 'Check',
      color: '#52c41a',
      x: Math.random() * (window.innerWidth - 200),
      y: Math.random() * (window.innerHeight - 100)
    })

  } catch (error) {
    ElMessage.error('链接生成失败')
  } finally {
    isGeneratingLink.value = false
    showProgress.value = false
    progressValue.value = 0
  }
}

const exportReport = () => {
  emit('export-report')
  ElMessage.success('报告导出中...')
}

const shareReport = () => {
  emit('share-report')
  ElMessage.success('分享链接已生成')
}

const printReport = () => {
  emit('print-report')
  window.print()
}

const addSmartBubble = (bubbleData) => {
  if (!props.enableSmartBubbles) return
  
  const bubble = {
    id: bubbleIdCounter.value++,
    ...bubbleData,
    timestamp: Date.now()
  }
  
  activeBubbles.value.push(bubble)
  
  // 自动移除气泡
  setTimeout(() => {
    removeBubble(bubble.id)
  }, 5000)
}

const removeBubble = (bubbleId) => {
  const index = activeBubbles.value.findIndex(b => b.id === bubbleId)
  if (index > -1) {
    activeBubbles.value.splice(index, 1)
  }
}

const handleBubbleClick = (bubble) => {
  ElNotification({
    title: '智能提示',
    message: bubble.text,
    type: 'info',
    duration: 3000
  })
  removeBubble(bubble.id)
}

const hideShortcuts = () => {
  showShortcuts.value = false
}

const closeFeedbackCollector = () => {
  showFeedbackCollector.value = false
}

const submitFeedback = () => {
  if (feedbackRating.value === 0) {
    ElMessage.warning('请先进行评分')
    return
  }
  
  const feedback = {
    rating: feedbackRating.value,
    text: feedbackText.value,
    timestamp: new Date().toISOString()
  }
  
  emit('feedback-submitted', feedback)
  ElMessage.success('感谢您的反馈！')
  
  // 重置表单
  feedbackRating.value = 5
  feedbackText.value = ''
  showFeedbackCollector.value = false
}

const updatePerformanceMetrics = () => {
  if (!showPerformanceMonitor.value) return
  
  // 模拟性能数据
  performanceMetrics.value = {
    loadTime: Math.round(performance.now()),
    renderTime: Math.round(Math.random() * 50 + 10),
    memoryUsage: Math.round(Math.random() * 100 + 50)
  }
}

// 键盘事件处理
const handleKeydown = (event) => {
  if (event.ctrlKey) {
    switch (event.key) {
      case 'e':
        event.preventDefault()
        quickExport()
        break
      case 'r':
        event.preventDefault()
        refreshData()
        break
      case 't':
        event.preventDefault()
        switchView(currentView.value === 'table' ? 'chart' : 'table')
        break
      case 'f':
        event.preventDefault()
        applyFilters()
        break
      case 's':
        event.preventDefault()
        generateShareLink()
        break
    }
  } else if (event.key === 'F1') {
    event.preventDefault()
    showShortcuts.value = !showShortcuts.value
  }
}

// 生命周期
onMounted(() => {
  console.log('🎨 交互体验增强器已加载')
  
  // 添加键盘事件监听
  document.addEventListener('keydown', handleKeydown)
  
  // 更新性能指标
  updatePerformanceMetrics()
  
  // 定期更新性能指标
  const performanceInterval = setInterval(updatePerformanceMetrics, 5000)
  
  // 显示欢迎气泡
  setTimeout(() => {
    addSmartBubble({
      text: 'iFlytek报告中心已就绪',
      icon: 'Star',
      color: '#1890ff',
      x: 100,
      y: 100
    })
  }, 1000)
  
  // 清理定时器
  onUnmounted(() => {
    clearInterval(performanceInterval)
  })
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// 暴露方法给父组件
defineExpose({
  addSmartBubble,
  showFeedbackCollector: () => { showFeedbackCollector.value = true },
  showShortcuts: () => { showShortcuts.value = true },
  quickExport,
  refreshData,
  switchView,
  applyFilters,
  generateShareLink
})
</script>

<style scoped>
.interactive-enhancer {
  position: relative;
  z-index: 1000;
}

/* 浮动操作面板 */
.floating-action-panel {
  position: fixed;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  z-index: 1001;
}

.panel-toggle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.panel-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
}

.toggle-icon {
  color: white;
  font-size: 20px;
  transition: transform 0.3s ease;
}

.panel-expanded .toggle-icon {
  transform: rotate(180deg);
}

.panel-content {
  padding: 20px;
  min-width: 280px;
  max-width: 320px;
}

.panel-section {
  margin-bottom: 24px;
}

.panel-section:last-child {
  margin-bottom: 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 12px 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #2d3748;
}

.export-controls,
.refresh-controls,
.filter-controls,
.share-controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.format-selector,
.view-toggle {
  display: flex;
  justify-content: center;
}

.refresh-status {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 3px solid var(--iflytek-primary);
}

.status-text {
  font-size: 0.85rem;
  font-weight: 600;
  color: #2c3e50;
}

.last-update {
  font-size: 0.75rem;
  color: #7f8c8d;
}

.time-range,
.permission-selector {
  width: 100%;
}

/* 面板滑动动画 */
.panel-slide-enter-active,
.panel-slide-leave-active {
  transition: all 0.3s ease;
}

.panel-slide-enter-from,
.panel-slide-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* 智能气泡 */
.smart-bubbles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 999;
}

.smart-bubble {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #1890ff;
  color: white;
  border-radius: 24px;
  box-shadow: 0 4px 16px rgba(24, 144, 255, 0.3);
  cursor: pointer;
  pointer-events: auto;
  transition: all 0.3s ease;
  animation: bubbleFloat 3s ease-in-out infinite;
}

.smart-bubble:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 24px rgba(24, 144, 255, 0.4);
}

.bubble-icon {
  font-size: 16px;
}

.bubble-text {
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
}

@keyframes bubbleFloat {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

/* 气泡动画 */
.bubble-enter-active {
  transition: all 0.5s ease;
}

.bubble-leave-active {
  transition: all 0.3s ease;
}

.bubble-enter-from {
  opacity: 0;
  transform: scale(0.5) translateY(20px);
}

.bubble-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(-20px);
}

/* 进度指示器 */
.progress-indicator {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  z-index: 1002;
}

.progress-ring {
  position: relative;
  width: 60px;
  height: 60px;
}

.progress-svg {
  transform: rotate(-90deg);
}

.progress-circle {
  transition: stroke-dashoffset 0.3s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.9rem;
  font-weight: 600;
  color: #1890ff;
}

.progress-label {
  font-size: 0.9rem;
  color: #4a5568;
  text-align: center;
}

/* 快捷键提示 */
.keyboard-shortcuts {
  position: fixed;
  top: 20px;
  left: 20px;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  z-index: 1001;
  min-width: 280px;
}

.shortcuts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
}

.shortcuts-header h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
}

.shortcuts-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.shortcut-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.shortcut-key {
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 0.8rem;
  font-family: monospace;
  color: #4a5568;
  min-width: 80px;
  text-align: center;
}

.shortcut-desc {
  font-size: 0.9rem;
  color: #4a5568;
}

/* 反馈收集器 */
.feedback-collector {
  position: fixed;
  bottom: 20px;
  left: 20px;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  z-index: 1001;
  min-width: 320px;
}

.feedback-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
}

.feedback-header h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
}

.feedback-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feedback-actions {
  display: flex;
  justify-content: flex-end;
}

/* 性能监控器 */
.performance-monitor {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border-radius: 8px;
  padding: 12px;
  font-size: 0.8rem;
  z-index: 1001;
  min-width: 200px;
}

.monitor-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-weight: 600;
}

.monitor-metrics {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric-label {
  color: #cbd5e0;
}

.metric-value {
  font-weight: 600;
  color: #68d391;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .floating-action-panel {
    right: 10px;
  }

  .panel-content {
    min-width: 260px;
    max-width: 280px;
  }

  .keyboard-shortcuts,
  .feedback-collector {
    left: 10px;
    right: 10px;
    min-width: auto;
  }

  .performance-monitor {
    right: 10px;
    bottom: 10px;
  }
}

/* 全局样式修饰符 */
:global(.animations-disabled *) {
  animation: none !important;
  transition: none !important;
}

:global(.tooltips-disabled .el-tooltip) {
  display: none !important;
}

:global(.dark-mode) {
  background-color: #1a202c;
  color: #e2e8f0;
}

:global(.dark-mode .floating-action-panel),
:global(.dark-mode .keyboard-shortcuts),
:global(.dark-mode .feedback-collector),
:global(.dark-mode .progress-indicator) {
  background: #2d3748;
  color: #e2e8f0;
}
</style>
