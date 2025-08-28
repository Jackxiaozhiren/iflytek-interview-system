<template>
  <div class="brand-consistency-checker">
    <div class="checker-header">
      <h3 class="checker-title">
        <el-icon><Setting /></el-icon>
        iFlytek品牌一致性检查
      </h3>
      <div class="checker-controls">
        <el-button @click="runFullCheck" type="primary" :loading="isChecking">
          <el-icon><Search /></el-icon>
          {{ isChecking ? '检查中...' : '开始检查' }}
        </el-button>
        <el-button @click="exportReport" :disabled="!lastCheckResult">
          <el-icon><Download /></el-icon>
          导出报告
        </el-button>
      </div>
    </div>

    <!-- 检查结果概览 -->
    <div v-if="lastCheckResult" class="check-overview">
      <div class="overview-stats">
        <div class="stat-card">
          <div class="stat-icon success">
            <el-icon><CircleCheck /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ lastCheckResult.summary.complianceRate }}%</div>
            <div class="stat-label">品牌合规率</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon info">
            <el-icon><Document /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ lastCheckResult.summary.totalElements }}</div>
            <div class="stat-label">检查元素</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" :class="lastCheckResult.summary.violations > 0 ? 'warning' : 'success'">
            <el-icon><Warning /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ lastCheckResult.summary.violations }}</div>
            <div class="stat-label">违规项目</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon success">
            <el-icon><Star /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ lastCheckResult.summary.compliantElements }}</div>
            <div class="stat-label">合规元素</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 详细检查结果 -->
    <div v-if="lastCheckResult" class="check-details">
      <el-tabs v-model="activeTab" type="border-card">
        <el-tab-pane label="颜色合规性" name="color">
          <div class="compliance-section">
            <h4>颜色使用检查</h4>
            <div class="compliance-grid">
              <div 
                v-for="(item, index) in lastCheckResult.details.colorCompliance.slice(0, 10)" 
                :key="index"
                class="compliance-item"
                :class="{ compliant: item.hasValidBrandColor && item.hasGoodContrast }"
              >
                <div class="item-header">
                  <span class="element-tag">{{ item.element }}</span>
                  <el-icon v-if="item.hasValidBrandColor && item.hasGoodContrast" class="status-icon success">
                    <Check />
                  </el-icon>
                  <el-icon v-else class="status-icon error">
                    <Close />
                  </el-icon>
                </div>
                <div class="item-details">
                  <div class="detail-item">
                    <span>品牌色彩:</span>
                    <el-tag :type="item.hasValidBrandColor ? 'success' : 'danger'" size="small">
                      {{ item.hasValidBrandColor ? '合规' : '不合规' }}
                    </el-tag>
                  </div>
                  <div class="detail-item">
                    <span>对比度:</span>
                    <el-tag :type="item.hasGoodContrast ? 'success' : 'danger'" size="small">
                      {{ item.hasGoodContrast ? '符合WCAG' : '不符合' }}
                    </el-tag>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="字体合规性" name="font">
          <div class="compliance-section">
            <h4>字体使用检查</h4>
            <div class="compliance-grid">
              <div 
                v-for="(item, index) in lastCheckResult.details.fontCompliance.slice(0, 10)" 
                :key="index"
                class="compliance-item"
                :class="{ compliant: item.usesBrandFont }"
              >
                <div class="item-header">
                  <span class="element-tag">{{ item.element }}</span>
                  <el-icon v-if="item.usesBrandFont" class="status-icon success">
                    <Check />
                  </el-icon>
                  <el-icon v-else class="status-icon error">
                    <Close />
                  </el-icon>
                </div>
                <div class="item-details">
                  <div class="detail-item">
                    <span>品牌字体:</span>
                    <el-tag :type="item.usesBrandFont ? 'success' : 'danger'" size="small">
                      {{ item.usesBrandFont ? 'Microsoft YaHei' : '非品牌字体' }}
                    </el-tag>
                  </div>
                  <div class="detail-item">
                    <span>字体回退:</span>
                    <el-tag :type="item.hasProperFallback ? 'success' : 'warning'" size="small">
                      {{ item.hasProperFallback ? '已设置' : '未设置' }}
                    </el-tag>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="组件合规性" name="component">
          <div class="compliance-section">
            <h4>组件结构检查</h4>
            <div class="compliance-grid">
              <div 
                v-for="(item, index) in lastCheckResult.details.componentCompliance.slice(0, 10)" 
                :key="index"
                class="compliance-item"
                :class="{ compliant: item.hasProperStructure && item.hasAccessibilityAttributes }"
              >
                <div class="item-header">
                  <span class="element-tag">{{ item.element }}</span>
                  <el-icon v-if="item.hasProperStructure && item.hasAccessibilityAttributes" class="status-icon success">
                    <Check />
                  </el-icon>
                  <el-icon v-else class="status-icon error">
                    <Close />
                  </el-icon>
                </div>
                <div class="item-details">
                  <div class="detail-item">
                    <span>结构规范:</span>
                    <el-tag :type="item.hasProperStructure ? 'success' : 'danger'" size="small">
                      {{ item.hasProperStructure ? '规范' : '不规范' }}
                    </el-tag>
                  </div>
                  <div class="detail-item">
                    <span>无障碍:</span>
                    <el-tag :type="item.hasAccessibilityAttributes ? 'success' : 'warning'" size="small">
                      {{ item.hasAccessibilityAttributes ? '已设置' : '需改进' }}
                    </el-tag>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="改进建议" name="recommendations">
          <div class="recommendations-section">
            <h4>品牌一致性改进建议</h4>
            <div v-if="lastCheckResult.recommendations.length === 0" class="no-recommendations">
              <el-icon><CircleCheck /></el-icon>
              <p>恭喜！您的系统完全符合iFlytek品牌规范</p>
            </div>
            <div v-else class="recommendations-list">
              <div 
                v-for="(rec, index) in lastCheckResult.recommendations" 
                :key="index"
                class="recommendation-item"
                :class="rec.priority"
              >
                <div class="rec-icon">
                  <el-icon v-if="rec.priority === 'high'">
                    <Warning />
                  </el-icon>
                  <el-icon v-else-if="rec.priority === 'medium'">
                    <InfoFilled />
                  </el-icon>
                  <el-icon v-else>
                    <CircleCheck />
                  </el-icon>
                </div>
                <div class="rec-content">
                  <div class="rec-type">{{ getRecommendationType(rec.type) }}</div>
                  <div class="rec-message">{{ rec.message }}</div>
                  <div class="rec-priority">
                    <el-tag :type="getPriorityType(rec.priority)" size="small">
                      {{ getPriorityText(rec.priority) }}
                    </el-tag>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 实时监控开关 -->
    <div class="real-time-monitoring">
      <div class="monitoring-header">
        <h4>实时品牌合规监控</h4>
        <el-switch
          v-model="isRealTimeMonitoring"
          @change="toggleRealTimeMonitoring"
          active-text="已启用"
          inactive-text="已禁用"
        />
      </div>
      <div v-if="isRealTimeMonitoring" class="monitoring-status">
        <el-icon class="monitoring-icon"><View /></el-icon>
        <span>正在实时监控品牌一致性...</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'
import { 
  Setting, Search, Download, CircleCheck, Document, Warning, 
  Star, Check, Close, InfoFilled, View
} from '@element-plus/icons-vue'
import iflytekBrandConsistency from '../../utils/iflytekBrandConsistency'

export default {
  name: 'BrandConsistencyChecker',
  components: {
    Setting, Search, Download, CircleCheck, Document, Warning,
    Star, Check, Close, InfoFilled, View
  },
  setup() {
    const isChecking = ref(false)
    const lastCheckResult = ref(null)
    const activeTab = ref('color')
    const isRealTimeMonitoring = ref(false)
    let monitoringInterval = null

    // 运行完整检查
    const runFullCheck = async () => {
      isChecking.value = true
      
      try {
        ElMessage.info('正在进行品牌一致性检查...')
        
        // 模拟检查过程
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        const result = iflytekBrandConsistency.performFullComplianceCheck()
        lastCheckResult.value = result
        
        ElNotification({
          title: '品牌一致性检查完成',
          message: `合规率: ${result.summary.complianceRate}%，发现 ${result.summary.violations} 个违规项`,
          type: result.summary.violations === 0 ? 'success' : 'warning',
          duration: 4000
        })
        
        console.log('🎨 品牌一致性检查结果:', result)
        
      } catch (error) {
        ElMessage.error('检查过程中发生错误')
        console.error('品牌一致性检查错误:', error)
      } finally {
        isChecking.value = false
      }
    }

    // 导出报告
    const exportReport = () => {
      if (!lastCheckResult.value) return
      
      const reportData = {
        title: 'iFlytek品牌一致性检查报告',
        timestamp: new Date().toISOString(),
        ...lastCheckResult.value
      }
      
      const blob = new Blob([JSON.stringify(reportData, null, 2)], {
        type: 'application/json'
      })
      
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `iflytek-brand-consistency-report-${Date.now()}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      ElMessage.success('报告已导出')
    }

    // 切换实时监控
    const toggleRealTimeMonitoring = (enabled) => {
      if (enabled) {
        startRealTimeMonitoring()
      } else {
        stopRealTimeMonitoring()
      }
    }

    // 开始实时监控
    const startRealTimeMonitoring = () => {
      ElNotification({
        title: '实时监控已启动',
        message: '正在监控品牌一致性变化',
        type: 'info'
      })
      
      monitoringInterval = setInterval(() => {
        // 简化的实时检查
        const quickCheck = iflytekBrandConsistency.performFullComplianceCheck()
        if (quickCheck.summary.violations > 0) {
          ElMessage.warning(`发现 ${quickCheck.summary.violations} 个品牌合规问题`)
        }
      }, 30000) // 每30秒检查一次
    }

    // 停止实时监控
    const stopRealTimeMonitoring = () => {
      if (monitoringInterval) {
        clearInterval(monitoringInterval)
        monitoringInterval = null
      }
      
      ElNotification({
        title: '实时监控已停止',
        type: 'info'
      })
    }

    // 获取建议类型文本
    const getRecommendationType = (type) => {
      const typeMap = {
        color: '颜色规范',
        font: '字体规范',
        accessibility: '无障碍性',
        spacing: '间距规范',
        component: '组件规范'
      }
      return typeMap[type] || type
    }

    // 获取优先级类型
    const getPriorityType = (priority) => {
      const typeMap = {
        high: 'danger',
        medium: 'warning',
        low: 'success'
      }
      return typeMap[priority] || 'info'
    }

    // 获取优先级文本
    const getPriorityText = (priority) => {
      const textMap = {
        high: '高优先级',
        medium: '中优先级',
        low: '低优先级'
      }
      return textMap[priority] || priority
    }

    onMounted(() => {
      // 组件加载时进行一次快速检查
      setTimeout(() => {
        runFullCheck()
      }, 1000)
    })

    onUnmounted(() => {
      if (monitoringInterval) {
        clearInterval(monitoringInterval)
      }
    })

    return {
      isChecking,
      lastCheckResult,
      activeTab,
      isRealTimeMonitoring,
      runFullCheck,
      exportReport,
      toggleRealTimeMonitoring,
      getRecommendationType,
      getPriorityType,
      getPriorityText
    }
  }
}
</script>

<style scoped>
.brand-consistency-checker {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.checker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.checker-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.checker-controls {
  display: flex;
  gap: 12px;
}

.check-overview {
  margin-bottom: 32px;
}

.overview-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-icon.success {
  background: linear-gradient(135deg, #52c41a, #73d13d);
}

.stat-icon.info {
  background: linear-gradient(135deg, #1890ff, #40a9ff);
}

.stat-icon.warning {
  background: linear-gradient(135deg, #faad14, #ffc53d);
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

.check-details {
  margin-bottom: 32px;
}

.compliance-section h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.compliance-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.compliance-item {
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 2px solid #e8e8e8;
  transition: all 0.3s ease;
}

.compliance-item.compliant {
  border-color: #52c41a;
  background: rgba(82, 196, 26, 0.05);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.element-tag {
  background: #1890ff;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-family: monospace;
}

.status-icon.success {
  color: #52c41a;
}

.status-icon.error {
  color: #ff4d4f;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.recommendations-section h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.no-recommendations {
  text-align: center;
  padding: 40px;
  color: #52c41a;
}

.no-recommendations .el-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recommendation-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 4px solid #e8e8e8;
}

.recommendation-item.high {
  border-left-color: #ff4d4f;
}

.recommendation-item.medium {
  border-left-color: #faad14;
}

.recommendation-item.low {
  border-left-color: #52c41a;
}

.rec-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: rgba(24, 144, 255, 0.1);
  color: #1890ff;
}

.rec-content {
  flex: 1;
}

.rec-type {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.rec-message {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
  margin-bottom: 8px;
}

.real-time-monitoring {
  border-top: 1px solid #f0f0f0;
  padding-top: 24px;
}

.monitoring-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.monitoring-header h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.monitoring-status {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1890ff;
  font-size: 14px;
}

.monitoring-icon {
  animation: pulse 2s infinite;
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
  .checker-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .checker-controls {
    justify-content: space-between;
  }
  
  .overview-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .compliance-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .overview-stats {
    grid-template-columns: 1fr;
  }
}
</style>
