<template>
  <div class="mobile-compatibility-enhancer" v-if="isMobileDevice">
    <!-- 移动端导航优化 -->
    <div class="mobile-nav-overlay" v-if="showMobileNav" @click="closeMobileNav">
      <div class="mobile-nav-content" @click.stop>
        <div class="mobile-nav-header">
          <h3>iFlytek智能面试</h3>
          <el-button @click="closeMobileNav" circle size="small">
            <el-icon><Close /></el-icon>
          </el-button>
        </div>
        <div class="mobile-nav-items">
          <div class="nav-item" @click="navigateTo('/')">
            <el-icon><House /></el-icon>
            <span>首页</span>
          </div>
          <div class="nav-item" @click="navigateTo('/enhanced-demo')">
            <el-icon><VideoPlay /></el-icon>
            <span>演示</span>
          </div>
          <div class="nav-item" @click="navigateTo('/interview-selection')">
            <el-icon><User /></el-icon>
            <span>面试</span>
          </div>
          <div class="nav-item" @click="navigateTo('/report')">
            <el-icon><Document /></el-icon>
            <span>报告</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 移动端快速操作栏 -->
    <div class="mobile-quick-actions" v-if="showQuickActions">
      <div class="quick-action-item" @click="toggleMobileNav">
        <el-icon><Grid /></el-icon>
        <span>菜单</span>
      </div>
      <div class="quick-action-item" @click="toggleFullscreen">
        <el-icon><View /></el-icon>
        <span>全屏</span>
      </div>
      <div class="quick-action-item" @click="adjustBrightness">
        <el-icon><Star /></el-icon>
        <span>亮度</span>
      </div>
      <div class="quick-action-item" @click="toggleOrientation">
        <el-icon><Loading /></el-icon>
        <span>旋转</span>
      </div>
    </div>

    <!-- 移动端手势提示 -->
    <div class="gesture-hints" v-if="showGestureHints">
      <div class="hint-item">
        <div class="gesture-icon">👆</div>
        <span>向上滑动查看更多</span>
      </div>
      <div class="hint-item">
        <div class="gesture-icon">👈👉</div>
        <span>左右滑动切换页面</span>
      </div>
      <div class="hint-item">
        <div class="gesture-icon">🤏</div>
        <span>双指缩放调整大小</span>
      </div>
    </div>

    <!-- 移动端性能监控 -->
    <div class="mobile-performance-monitor" v-if="showPerformanceMonitor">
      <div class="performance-item">
        <span>电池</span>
        <div class="battery-indicator" :class="batteryLevelClass">
          {{ batteryLevel }}%
        </div>
      </div>
      <div class="performance-item">
        <span>网络</span>
        <div class="network-indicator" :class="networkQualityClass">
          {{ networkQuality }}
        </div>
      </div>
      <div class="performance-item">
        <span>内存</span>
        <div class="memory-indicator" :class="memoryUsageClass">
          {{ memoryUsage }}%
        </div>
      </div>
    </div>

    <!-- 移动端输入优化 -->
    <div class="mobile-input-enhancer">
      <!-- 虚拟键盘适配 -->
      <div class="keyboard-spacer" v-if="keyboardVisible" :style="{ height: keyboardHeight + 'px' }"></div>
      
      <!-- 语音输入按钮 -->
      <div class="voice-input-fab" v-if="showVoiceInput" @click="startVoiceInput">
        <el-icon><VideoCamera /></el-icon>
      </div>
    </div>

    <!-- 移动端通知优化 -->
    <div class="mobile-notifications">
      <div 
        v-for="notification in mobileNotifications" 
        :key="notification.id"
        class="mobile-notification"
        :class="notification.type"
      >
        <div class="notification-content">
          <div class="notification-title">{{ notification.title }}</div>
          <div class="notification-message">{{ notification.message }}</div>
        </div>
        <el-button @click="dismissNotification(notification.id)" circle size="small">
          <el-icon><Close /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- 移动端加载优化 -->
    <div class="mobile-loading-overlay" v-if="showMobileLoading">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <div class="loading-text">{{ loadingText }}</div>
        <div class="loading-progress">
          <div class="progress-bar" :style="{ width: loadingProgress + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Close, House, VideoPlay, User, Document, Grid, View, 
  Star, Loading, VideoCamera
} from '@element-plus/icons-vue'
import systemPerformanceOptimizer from '@/services/systemPerformanceOptimizer'

const router = useRouter()

// 响应式数据
const isMobileDevice = ref(false)
const showMobileNav = ref(false)
const showQuickActions = ref(true)
const showGestureHints = ref(false)
const showPerformanceMonitor = ref(false)
const showVoiceInput = ref(true)
const showMobileLoading = ref(false)

const batteryLevel = ref(100)
const networkQuality = ref('4G')
const memoryUsage = ref(45)
const keyboardVisible = ref(false)
const keyboardHeight = ref(0)

const loadingText = ref('正在加载...')
const loadingProgress = ref(0)

const mobileNotifications = ref([])

// 计算属性
const batteryLevelClass = computed(() => {
  if (batteryLevel.value > 50) return 'high'
  if (batteryLevel.value > 20) return 'medium'
  return 'low'
})

const networkQualityClass = computed(() => {
  const quality = networkQuality.value
  if (quality === '5G' || quality === '4G') return 'excellent'
  if (quality === '3G') return 'good'
  return 'poor'
})

const memoryUsageClass = computed(() => {
  if (memoryUsage.value < 60) return 'normal'
  if (memoryUsage.value < 80) return 'warning'
  return 'critical'
})

// 方法
const detectMobileDevice = () => {
  const userAgent = navigator.userAgent
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
  return mobileRegex.test(userAgent)
}

const toggleMobileNav = () => {
  showMobileNav.value = !showMobileNav.value
}

const closeMobileNav = () => {
  showMobileNav.value = false
}

const navigateTo = (path) => {
  router.push(path)
  closeMobileNav()
}

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      ElMessage.error('无法进入全屏模式')
    })
  } else {
    document.exitFullscreen()
  }
}

const adjustBrightness = () => {
  // 模拟亮度调整
  ElMessage.info('亮度调整功能')
}

const toggleOrientation = () => {
  if (screen.orientation && screen.orientation.lock) {
    const currentOrientation = screen.orientation.type
    const newOrientation = currentOrientation.includes('portrait') ? 'landscape' : 'portrait'
    
    screen.orientation.lock(newOrientation).catch(err => {
      ElMessage.error('无法锁定屏幕方向')
    })
  } else {
    ElMessage.info('设备不支持屏幕方向锁定')
  }
}



const monitorBattery = () => {
  if ('getBattery' in navigator) {
    navigator.getBattery().then(battery => {
      batteryLevel.value = Math.round(battery.level * 100)
      
      battery.addEventListener('levelchange', () => {
        batteryLevel.value = Math.round(battery.level * 100)
      })
    })
  }
}

const monitorNetwork = () => {
  if ('connection' in navigator) {
    const connection = navigator.connection
    networkQuality.value = connection.effectiveType || '未知'
    
    connection.addEventListener('change', () => {
      networkQuality.value = connection.effectiveType || '未知'
    })
  }
}

const monitorMemory = () => {
  if ('memory' in performance) {
    const updateMemoryUsage = () => {
      const memory = performance.memory
      const usedPercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
      memoryUsage.value = Math.round(usedPercent)
    }
    
    updateMemoryUsage()
    setInterval(updateMemoryUsage, 5000) // 每5秒更新一次
  }
}

const setupKeyboardDetection = () => {
  const initialViewportHeight = window.visualViewport?.height || window.innerHeight
  
  const handleViewportChange = () => {
    const currentHeight = window.visualViewport?.height || window.innerHeight
    const heightDifference = initialViewportHeight - currentHeight
    
    if (heightDifference > 150) { // 键盘可能弹出
      keyboardVisible.value = true
      keyboardHeight.value = heightDifference
    } else {
      keyboardVisible.value = false
      keyboardHeight.value = 0
    }
  }
  
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', handleViewportChange)
  } else {
    window.addEventListener('resize', handleViewportChange)
  }
}

const setupGestureSupport = () => {
  let startX = 0
  let startY = 0
  
  document.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX
    startY = e.touches[0].clientY
  })
  
  document.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX
    const endY = e.changedTouches[0].clientY
    
    const deltaX = endX - startX
    const deltaY = endY - startY
    
    // 检测滑动手势
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        // 向右滑动
        handleSwipeRight()
      } else {
        // 向左滑动
        handleSwipeLeft()
      }
    } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
      if (deltaY > 0) {
        // 向下滑动
        handleSwipeDown()
      } else {
        // 向上滑动
        handleSwipeUp()
      }
    }
  })
}

const handleSwipeRight = () => {
  // 向右滑动逻辑
  console.log('向右滑动')
}

const handleSwipeLeft = () => {
  // 向左滑动逻辑
  console.log('向左滑动')
}

const handleSwipeUp = () => {
  // 向上滑动逻辑
  console.log('向上滑动')
}

const handleSwipeDown = () => {
  // 向下滑动逻辑
  console.log('向下滑动')
}

const addMobileNotification = (title, message, type = 'info') => {
  const notification = {
    id: Date.now(),
    title,
    message,
    type
  }
  
  mobileNotifications.value.push(notification)
  
  // 自动移除通知
  setTimeout(() => {
    dismissNotification(notification.id)
  }, 5000)
}

const dismissNotification = (id) => {
  const index = mobileNotifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    mobileNotifications.value.splice(index, 1)
  }
}

const showMobileLoadingWithProgress = (text = '正在加载...') => {
  showMobileLoading.value = true
  loadingText.value = text
  loadingProgress.value = 0
  
  // 模拟加载进度
  const interval = setInterval(() => {
    loadingProgress.value += 10
    if (loadingProgress.value >= 100) {
      clearInterval(interval)
      setTimeout(() => {
        showMobileLoading.value = false
      }, 500)
    }
  }, 200)
}

const hideMobileLoading = () => {
  showMobileLoading.value = false
}

const optimizeForMobile = () => {
  // 禁用双击缩放
  const viewport = document.querySelector('meta[name="viewport"]')
  if (viewport) {
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
  }
  
  // 优化触摸滚动
  document.body.style.webkitOverflowScrolling = 'touch'
  
  // 禁用文本选择（在某些情况下）
  document.body.style.webkitUserSelect = 'none'
  document.body.style.userSelect = 'none'
  
  // 优化点击延迟
  document.body.style.touchAction = 'manipulation'
}

// 生命周期
onMounted(() => {
  isMobileDevice.value = detectMobileDevice()
  
  if (isMobileDevice.value) {
    optimizeForMobile()
    setupKeyboardDetection()
    setupGestureSupport()
    monitorBattery()
    monitorNetwork()
    monitorMemory()
    
    // 显示手势提示（首次访问）
    const hasSeenHints = localStorage.getItem('mobile_gesture_hints_seen')
    if (!hasSeenHints) {
      showGestureHints.value = true
      setTimeout(() => {
        showGestureHints.value = false
        localStorage.setItem('mobile_gesture_hints_seen', 'true')
      }, 5000)
    }
    
    // 添加欢迎通知
    setTimeout(() => {
      addMobileNotification(
        '欢迎使用移动版',
        'iFlytek智能面试系统已针对移动设备优化',
        'success'
      )
    }, 1000)
  }
})

onUnmounted(() => {
  // 清理事件监听器
  if (window.visualViewport) {
    window.visualViewport.removeEventListener('resize', () => {})
  }
})

// 暴露方法给父组件
defineExpose({
  addMobileNotification,
  showMobileLoadingWithProgress,
  hideMobileLoading,
  toggleMobileNav
})
</script>

<style scoped>
.mobile-compatibility-enhancer {
  position: relative;
  z-index: 9999;
}

/* 移动端导航覆盖层 */
.mobile-nav-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10000;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
}

.mobile-nav-content {
  background: white;
  width: 280px;
  height: 100vh;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  animation: slideInLeft 0.3s ease;
}

@keyframes slideInLeft {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

.mobile-nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #4c51bf 0%, #6b21a8 100%);
  color: white;
}

.mobile-nav-header h3 {
  margin: 0;
  font-family: 'Microsoft YaHei', sans-serif;
}

.mobile-nav-items {
  padding: 20px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.nav-item:hover {
  background: #f5f5f5;
}

.nav-item .el-icon {
  font-size: 20px;
  color: #4c51bf;
}

/* 快速操作栏 */
.mobile-quick-actions {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 9998;
}

.quick-action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.3s ease;
}

.quick-action-item:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.quick-action-item .el-icon {
  font-size: 20px;
  color: #4c51bf;
  margin-bottom: 2px;
}

.quick-action-item span {
  font-size: 10px;
  color: #666;
}

/* 手势提示 */
.gesture-hints {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 20px;
  border-radius: 12px;
  z-index: 10001;
  animation: fadeInScale 0.5s ease;
}

@keyframes fadeInScale {
  from { 
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
  to { 
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

.hint-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.hint-item:last-child {
  margin-bottom: 0;
}

.gesture-icon {
  font-size: 24px;
}

/* 性能监控 */
.mobile-performance-monitor {
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.9);
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 9997;
}

.performance-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 12px;
}

.performance-item:last-child {
  margin-bottom: 0;
}

.battery-indicator.high { color: #52c41a; }
.battery-indicator.medium { color: #faad14; }
.battery-indicator.low { color: #ff4d4f; }

.network-indicator.excellent { color: #52c41a; }
.network-indicator.good { color: #faad14; }
.network-indicator.poor { color: #ff4d4f; }

.memory-indicator.normal { color: #52c41a; }
.memory-indicator.warning { color: #faad14; }
.memory-indicator.critical { color: #ff4d4f; }

/* 语音输入按钮 */
.voice-input-fab {
  position: fixed;
  bottom: 100px;
  right: 20px;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #4c51bf 0%, #6b21a8 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(76, 81, 191, 0.4);
  z-index: 9996;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.voice-input-fab .el-icon {
  font-size: 24px;
  color: white;
}

/* 移动端通知 */
.mobile-notifications {
  position: fixed;
  top: 20px;
  left: 20px;
  right: 20px;
  z-index: 10002;
}

.mobile-notification {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-bottom: 12px;
  animation: slideInDown 0.3s ease;
}

@keyframes slideInDown {
  from { 
    opacity: 0;
    transform: translateY(-20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

.mobile-notification.success {
  border-left: 4px solid #52c41a;
}

.mobile-notification.info {
  border-left: 4px solid #1890ff;
}

.mobile-notification.warning {
  border-left: 4px solid #faad14;
}

.mobile-notification.error {
  border-left: 4px solid #ff4d4f;
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-weight: bold;
  margin-bottom: 4px;
  color: #333;
}

.notification-message {
  font-size: 14px;
  color: #666;
}

/* 移动端加载覆盖层 */
.mobile-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10003;
}

.loading-content {
  text-align: center;
  padding: 40px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4c51bf;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 16px;
  color: #333;
  margin-bottom: 20px;
  font-family: 'Microsoft YaHei', sans-serif;
}

.loading-progress {
  width: 200px;
  height: 4px;
  background: #f0f0f0;
  border-radius: 2px;
  overflow: hidden;
  margin: 0 auto;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(135deg, #4c51bf 0%, #6b21a8 100%);
  transition: width 0.3s ease;
}

/* 键盘适配 */
.keyboard-spacer {
  transition: height 0.3s ease;
}

/* 中文字体优化 */
.mobile-nav-header h3,
.notification-title,
.loading-text {
  font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
}
</style>
