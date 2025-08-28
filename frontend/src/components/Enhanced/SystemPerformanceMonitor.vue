<template>
  <div class="system-performance-monitor">
    <div class="monitor-header">
      <h3 class="monitor-title">
        <el-icon><TrendCharts /></el-icon>
        系统性能监控
      </h3>
      <div class="monitor-controls">
        <el-switch
          v-model="isMonitoring"
          @change="toggleMonitoring"
          active-text="监控中"
          inactive-text="已停止"
        />
        <el-button @click="generateReport" type="primary" size="small">
          <el-icon><Document /></el-icon>
          生成报告
        </el-button>
      </div>
    </div>

    <!-- 竞品功能集成状态 -->
    <div class="integration-status">
      <h4 class="section-title">竞品功能集成状态</h4>
      <div class="status-grid">
        <div class="status-card" :class="{ active: integrationStatus.offermore }">
          <div class="status-icon">
            <el-icon><Star /></el-icon>
          </div>
          <div class="status-info">
            <h5>面试猫功能</h5>
            <p>实时AI辅助</p>
            <span class="status-badge" :class="integrationStatus.offermore ? 'success' : 'inactive'">
              {{ integrationStatus.offermore ? '已集成' : '未启用' }}
            </span>
          </div>
        </div>

        <div class="status-card" :class="{ active: integrationStatus.dayee }">
          <div class="status-icon">
            <el-icon><Lock /></el-icon>
          </div>
          <div class="status-info">
            <h5>用友大易功能</h5>
            <p>防作弊机制</p>
            <span class="status-badge" :class="integrationStatus.dayee ? 'success' : 'inactive'">
              {{ integrationStatus.dayee ? '已集成' : '未启用' }}
            </span>
          </div>
        </div>

        <div class="status-card" :class="{ active: integrationStatus.hina }">
          <div class="status-icon">
            <el-icon><DataBoard /></el-icon>
          </div>
          <div class="status-info">
            <h5>海纳AI功能</h5>
            <p>数据驱动决策</p>
            <span class="status-badge" :class="integrationStatus.hina ? 'success' : 'inactive'">
              {{ integrationStatus.hina ? '已集成' : '未启用' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 性能指标 -->
    <div class="performance-metrics">
      <h4 class="section-title">性能指标</h4>
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-icon">
            <el-icon><Timer /></el-icon>
          </div>
          <div class="metric-content">
            <div class="metric-value">{{ performanceData.loadTime }}ms</div>
            <div class="metric-label">页面加载时间</div>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon">
            <el-icon><Cpu /></el-icon>
          </div>
          <div class="metric-content">
            <div class="metric-value">{{ performanceData.memoryUsage }}MB</div>
            <div class="metric-label">内存使用</div>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon">
            <el-icon><Connection /></el-icon>
          </div>
          <div class="metric-content">
            <div class="metric-value">{{ performanceData.apiResponseTime }}ms</div>
            <div class="metric-label">API响应时间</div>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon">
            <el-icon><TrendCharts /></el-icon>
          </div>
          <div class="metric-content">
            <div class="metric-value">{{ performanceData.fps }}fps</div>
            <div class="metric-label">渲染帧率</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 优化建议 -->
    <div class="optimization-suggestions" v-if="suggestions.length > 0">
      <h4 class="section-title">优化建议</h4>
      <div class="suggestions-list">
        <div 
          v-for="suggestion in suggestions" 
          :key="suggestion.id"
          class="suggestion-item"
          :class="suggestion.priority"
        >
          <div class="suggestion-icon">
            <el-icon>
              <component :is="getSuggestionIcon(suggestion.priority)" />
            </el-icon>
          </div>
          <div class="suggestion-content">
            <h5>{{ suggestion.title }}</h5>
            <p>{{ suggestion.description }}</p>
            <div class="suggestion-actions">
              <el-button size="small" @click="applySuggestion(suggestion)">
                应用建议
              </el-button>
              <el-button size="small" link @click="dismissSuggestion(suggestion.id)">
                忽略
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 实时日志 -->
    <div class="real-time-logs" v-if="isMonitoring">
      <h4 class="section-title">实时日志</h4>
      <div class="logs-container">
        <div 
          v-for="log in recentLogs" 
          :key="log.id"
          class="log-entry"
          :class="log.level"
        >
          <span class="log-time">{{ formatTime(log.timestamp) }}</span>
          <span class="log-level">{{ log.level.toUpperCase() }}</span>
          <span class="log-message">{{ log.message }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'
import {
  TrendCharts, Document, Star, Lock, Grid, Timer, Cpu, Connection, Warning, InfoFilled, CircleCheck
} from '@element-plus/icons-vue'
import { useIntelligentFeatures } from '../../composables/useIntelligentFeatures'
import competitorOptimizer from '../../services/competitorAnalysisOptimizer'

export default {
  name: 'SystemPerformanceMonitor',
  components: {
    Monitor, Document, Star, Lock, DataAnalysis, Timer,
    Cpu, Connection, TrendCharts, Warning, InfoFilled, CircleCheck
  },
  setup() {
    const { getIntegrationStatus } = useIntelligentFeatures()
    
    const isMonitoring = ref(false)
    const performanceData = reactive({
      loadTime: 0,
      memoryUsage: 0,
      apiResponseTime: 0,
      fps: 60
    })
    
    const suggestions = ref([
      {
        id: 1,
        title: '启用组件懒加载',
        description: '通过懒加载减少初始包大小，提升页面加载速度',
        priority: 'high',
        category: 'performance'
      },
      {
        id: 2,
        title: '优化图片资源',
        description: '使用WebP格式和适当的压缩比例优化图片',
        priority: 'medium',
        category: 'optimization'
      },
      {
        id: 3,
        title: '启用CDN加速',
        description: '使用CDN分发静态资源，提升全球访问速度',
        priority: 'low',
        category: 'infrastructure'
      }
    ])
    
    const recentLogs = ref([])
    let monitoringInterval = null

    const integrationStatus = computed(() => getIntegrationStatus.value.details)

    // 切换监控状态
    const toggleMonitoring = (value) => {
      if (value) {
        startMonitoring()
      } else {
        stopMonitoring()
      }
    }

    // 开始监控
    const startMonitoring = () => {
      addLog('info', '性能监控已启动')
      
      monitoringInterval = setInterval(() => {
        updatePerformanceData()
      }, 2000)
      
      ElNotification({
        title: '监控已启动',
        message: '正在实时监控系统性能',
        type: 'success'
      })
    }

    // 停止监控
    const stopMonitoring = () => {
      if (monitoringInterval) {
        clearInterval(monitoringInterval)
        monitoringInterval = null
      }
      
      addLog('info', '性能监控已停止')
      
      ElNotification({
        title: '监控已停止',
        type: 'info'
      })
    }

    // 更新性能数据
    const updatePerformanceData = () => {
      // 模拟性能数据更新
      performanceData.loadTime = Math.floor(Math.random() * 500) + 200
      performanceData.memoryUsage = Math.floor(Math.random() * 50) + 20
      performanceData.apiResponseTime = Math.floor(Math.random() * 200) + 50
      performanceData.fps = Math.floor(Math.random() * 10) + 55

      // 检查性能阈值
      if (performanceData.loadTime > 1000) {
        addLog('warning', `页面加载时间过长: ${performanceData.loadTime}ms`)
      }
      
      if (performanceData.memoryUsage > 100) {
        addLog('error', `内存使用过高: ${performanceData.memoryUsage}MB`)
      }
    }

    // 添加日志
    const addLog = (level, message) => {
      const log = {
        id: Date.now(),
        timestamp: new Date(),
        level,
        message
      }
      
      recentLogs.value.unshift(log)
      
      // 保持最近50条日志
      if (recentLogs.value.length > 50) {
        recentLogs.value = recentLogs.value.slice(0, 50)
      }
    }

    // 格式化时间
    const formatTime = (timestamp) => {
      return timestamp.toLocaleTimeString()
    }

    // 获取建议图标
    const getSuggestionIcon = (priority) => {
      const iconMap = {
        high: 'Warning',
        medium: 'InfoFilled',
        low: 'CircleCheck'
      }
      return iconMap[priority] || 'InfoFilled'
    }

    // 应用建议
    const applySuggestion = (suggestion) => {
      ElMessage.success(`正在应用建议: ${suggestion.title}`)
      addLog('info', `应用优化建议: ${suggestion.title}`)
      
      // 移除已应用的建议
      const index = suggestions.value.findIndex(s => s.id === suggestion.id)
      if (index > -1) {
        suggestions.value.splice(index, 1)
      }
    }

    // 忽略建议
    const dismissSuggestion = (suggestionId) => {
      const index = suggestions.value.findIndex(s => s.id === suggestionId)
      if (index > -1) {
        suggestions.value.splice(index, 1)
      }
    }

    // 生成报告
    const generateReport = () => {
      const report = competitorOptimizer.generateOptimizationReport()
      
      ElNotification({
        title: '报告生成完成',
        message: '系统优化报告已生成，请查看控制台',
        type: 'success'
      })
      
      console.log('🎯 竞品分析优化报告:', report)
      addLog('info', '系统优化报告已生成')
    }

    onMounted(() => {
      addLog('info', '性能监控组件已加载')
    })

    onUnmounted(() => {
      if (monitoringInterval) {
        clearInterval(monitoringInterval)
      }
    })

    return {
      isMonitoring,
      performanceData,
      suggestions,
      recentLogs,
      integrationStatus,
      toggleMonitoring,
      generateReport,
      formatTime,
      getSuggestionIcon,
      applySuggestion,
      dismissSuggestion
    }
  }
}
</script>

<style scoped>
.system-performance-monitor {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.monitor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.monitor-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.monitor-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.integration-status {
  margin-bottom: 32px;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.status-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.status-card.active {
  background: rgba(24, 144, 255, 0.05);
  border-color: rgba(24, 144, 255, 0.2);
}

.status-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #1890ff, #667eea);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.status-info h5 {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #1a1a1a;
}

.status-info p {
  font-size: 12px;
  color: #666;
  margin: 0 0 8px 0;
}

.status-badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.status-badge.success {
  background: rgba(82, 196, 26, 0.1);
  color: #52c41a;
}

.status-badge.inactive {
  background: rgba(0, 0, 0, 0.1);
  color: #666;
}

.performance-metrics {
  margin-bottom: 32px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.metric-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
}

.metric-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.metric-value {
  font-size: 20px;
  font-weight: 700;
  color: #1890ff;
}

.metric-label {
  font-size: 12px;
  color: #666;
}

.optimization-suggestions {
  margin-bottom: 32px;
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.suggestion-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 4px solid #e8e8e8;
}

.suggestion-item.high {
  border-left-color: #ff4d4f;
}

.suggestion-item.medium {
  border-left-color: #faad14;
}

.suggestion-item.low {
  border-left-color: #52c41a;
}

.suggestion-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: rgba(24, 144, 255, 0.1);
  color: #1890ff;
}

.suggestion-content h5 {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #1a1a1a;
}

.suggestion-content p {
  font-size: 12px;
  color: #666;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.suggestion-actions {
  display: flex;
  gap: 8px;
}

.real-time-logs {
  margin-bottom: 0;
}

.logs-container {
  max-height: 200px;
  overflow-y: auto;
  background: #1a1a1a;
  border-radius: 6px;
  padding: 12px;
}

.log-entry {
  display: flex;
  gap: 12px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  margin-bottom: 4px;
  color: #ccc;
}

.log-time {
  color: #666;
  min-width: 80px;
}

.log-level {
  min-width: 60px;
  font-weight: 600;
}

.log-entry.info .log-level {
  color: #1890ff;
}

.log-entry.warning .log-level {
  color: #faad14;
}

.log-entry.error .log-level {
  color: #ff4d4f;
}

.log-message {
  flex: 1;
}

@media (max-width: 768px) {
  .status-grid,
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .monitor-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .monitor-controls {
    justify-content: space-between;
  }
}
</style>
