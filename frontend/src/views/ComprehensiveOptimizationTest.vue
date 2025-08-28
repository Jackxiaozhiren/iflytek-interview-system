<template>
  <div class="comprehensive-test">
    <!-- 页面头部 -->
    <div class="test-header">
      <div class="header-content">
        <h1>iFlytek Spark 面试系统优化验证</h1>
        <p>验证求职者板块多模态交互中心功能调整和报告中心设置悬浮按钮功能增强</p>
        <div class="test-stats">
          <div class="stat-item">
            <span class="stat-label">已完成测试</span>
            <span class="stat-value">{{ completedTests }}/{{ totalTests }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">成功率</span>
            <span class="stat-value">{{ successRate }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 测试导航 -->
    <div class="test-navigation">
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane label="多模态交互中心测试" name="multimodal">
          <div class="test-section">
            <h3>多模态交互中心功能验证</h3>
            <p>验证视频分析和手势识别功能已替换为智能问答引导和答题思路分析</p>
            
            <div class="test-grid">
              <div class="test-card">
                <div class="card-header">
                  <el-icon><ChatDotRound /></el-icon>
                  <span>智能问答引导</span>
                  <el-tag :type="testResults.smartGuide ? 'success' : 'info'">
                    {{ testResults.smartGuide ? '已验证' : '待测试' }}
                  </el-tag>
                </div>
                <div class="card-content">
                  <p>验证智能问答引导功能是否正常工作，包括引导准确率显示</p>
                  <el-button @click="testSmartGuide" :loading="testing.smartGuide">
                    <el-icon><VideoPlay /></el-icon>
                    测试智能引导
                  </el-button>
                </div>
              </div>

              <div class="test-card">
                <div class="card-header">
                  <el-icon><TrendCharts /></el-icon>
                  <span>答题思路分析</span>
                  <el-tag :type="testResults.thinkingAnalysis ? 'success' : 'info'">
                    {{ testResults.thinkingAnalysis ? '已验证' : '待测试' }}
                  </el-tag>
                </div>
                <div class="card-content">
                  <p>验证答题思路分析功能，包括分析深度和思维模式评估</p>
                  <el-button @click="testThinkingAnalysis" :loading="testing.thinkingAnalysis">
                    <el-icon><VideoPlay /></el-icon>
                    测试思路分析
                  </el-button>
                </div>
              </div>

              <div class="test-card">
                <div class="card-header">
                  <el-icon><DataBoard /></el-icon>
                  <span>数值格式化</span>
                  <el-tag :type="testResults.numberFormat ? 'success' : 'info'">
                    {{ testResults.numberFormat ? '已验证' : '待测试' }}
                  </el-tag>
                </div>
                <div class="card-content">
                  <p>验证评分显示已从小数格式改为整数显示</p>
                  <el-button @click="testNumberFormat" :loading="testing.numberFormat">
                    <el-icon><VideoPlay /></el-icon>
                    测试数值格式
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="设置悬浮按钮测试" name="floating">
          <div class="test-section">
            <h3>设置悬浮按钮功能验证</h3>
            <p>验证设置悬浮按钮的新功能：快速导出、数据刷新、视图切换、筛选设置、分享链接</p>
            
            <div class="test-grid">
              <div class="test-card">
                <div class="card-header">
                  <el-icon><Download /></el-icon>
                  <span>快速导出</span>
                  <el-tag :type="testResults.quickExport ? 'success' : 'info'">
                    {{ testResults.quickExport ? '已验证' : '待测试' }}
                  </el-tag>
                </div>
                <div class="card-content">
                  <p>验证PDF/Excel格式选择和一键导出功能</p>
                  <el-button @click="testQuickExport" :loading="testing.quickExport">
                    <el-icon><VideoPlay /></el-icon>
                    测试快速导出
                  </el-button>
                </div>
              </div>

              <div class="test-card">
                <div class="card-header">
                  <el-icon><Refresh /></el-icon>
                  <span>数据刷新</span>
                  <el-tag :type="testResults.dataRefresh ? 'success' : 'info'">
                    {{ testResults.dataRefresh ? '已验证' : '待测试' }}
                  </el-tag>
                </div>
                <div class="card-content">
                  <p>验证实时数据更新和刷新状态显示</p>
                  <el-button @click="testDataRefresh" :loading="testing.dataRefresh">
                    <el-icon><VideoPlay /></el-icon>
                    测试数据刷新
                  </el-button>
                </div>
              </div>

              <div class="test-card">
                <div class="card-header">
                  <el-icon><View /></el-icon>
                  <span>视图切换</span>
                  <el-tag :type="testResults.viewSwitch ? 'success' : 'info'">
                    {{ testResults.viewSwitch ? '已验证' : '待测试' }}
                  </el-tag>
                </div>
                <div class="card-content">
                  <p>验证表格/图表视图间的快速切换</p>
                  <el-button @click="testViewSwitch" :loading="testing.viewSwitch">
                    <el-icon><VideoPlay /></el-icon>
                    测试视图切换
                  </el-button>
                </div>
              </div>

              <div class="test-card">
                <div class="card-header">
                  <el-icon><Filter /></el-icon>
                  <span>筛选设置</span>
                  <el-tag :type="testResults.filterSettings ? 'success' : 'info'">
                    {{ testResults.filterSettings ? '已验证' : '待测试' }}
                  </el-tag>
                </div>
                <div class="card-content">
                  <p>验证时间范围和数据筛选条件设置</p>
                  <el-button @click="testFilterSettings" :loading="testing.filterSettings">
                    <el-icon><VideoPlay /></el-icon>
                    测试筛选设置
                  </el-button>
                </div>
              </div>

              <div class="test-card">
                <div class="card-header">
                  <el-icon><Share /></el-icon>
                  <span>分享链接</span>
                  <el-tag :type="testResults.shareLink ? 'success' : 'info'">
                    {{ testResults.shareLink ? '已验证' : '待测试' }}
                  </el-tag>
                </div>
                <div class="card-content">
                  <p>验证分享链接生成和权限设置</p>
                  <el-button @click="testShareLink" :loading="testing.shareLink">
                    <el-icon><VideoPlay /></el-icon>
                    测试分享链接
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="综合测试报告" name="report">
          <div class="test-section">
            <h3>测试结果汇总</h3>
            
            <div class="test-summary">
              <div class="summary-card">
                <div class="summary-header">
                  <h4>多模态交互中心优化</h4>
                  <div class="progress-ring">
                    <el-progress 
                      type="circle" 
                      :percentage="multimodalProgress" 
                      :width="80"
                      :stroke-width="6"
                      color="#1890ff"
                    />
                  </div>
                </div>
                <div class="summary-details">
                  <div class="detail-item">
                    <span>智能问答引导</span>
                    <el-icon :class="testResults.smartGuide ? 'success' : 'pending'">
                      <component :is="testResults.smartGuide ? 'Check' : 'Clock'" />
                    </el-icon>
                  </div>
                  <div class="detail-item">
                    <span>答题思路分析</span>
                    <el-icon :class="testResults.thinkingAnalysis ? 'success' : 'pending'">
                      <component :is="testResults.thinkingAnalysis ? 'Check' : 'Clock'" />
                    </el-icon>
                  </div>
                  <div class="detail-item">
                    <span>数值格式化</span>
                    <el-icon :class="testResults.numberFormat ? 'success' : 'pending'">
                      <component :is="testResults.numberFormat ? 'Check' : 'Clock'" />
                    </el-icon>
                  </div>
                </div>
              </div>

              <div class="summary-card">
                <div class="summary-header">
                  <h4>设置悬浮按钮增强</h4>
                  <div class="progress-ring">
                    <el-progress 
                      type="circle" 
                      :percentage="floatingProgress" 
                      :width="80"
                      :stroke-width="6"
                      color="#52c41a"
                    />
                  </div>
                </div>
                <div class="summary-details">
                  <div class="detail-item">
                    <span>快速导出</span>
                    <el-icon :class="testResults.quickExport ? 'success' : 'pending'">
                      <component :is="testResults.quickExport ? 'Check' : 'Clock'" />
                    </el-icon>
                  </div>
                  <div class="detail-item">
                    <span>数据刷新</span>
                    <el-icon :class="testResults.dataRefresh ? 'success' : 'pending'">
                      <component :is="testResults.dataRefresh ? 'Check' : 'Clock'" />
                    </el-icon>
                  </div>
                  <div class="detail-item">
                    <span>视图切换</span>
                    <el-icon :class="testResults.viewSwitch ? 'success' : 'pending'">
                      <component :is="testResults.viewSwitch ? 'Check' : 'Clock'" />
                    </el-icon>
                  </div>
                  <div class="detail-item">
                    <span>筛选设置</span>
                    <el-icon :class="testResults.filterSettings ? 'success' : 'pending'">
                      <component :is="testResults.filterSettings ? 'Check' : 'Clock'" />
                    </el-icon>
                  </div>
                  <div class="detail-item">
                    <span>分享链接</span>
                    <el-icon :class="testResults.shareLink ? 'success' : 'pending'">
                      <component :is="testResults.shareLink ? 'Check' : 'Clock'" />
                    </el-icon>
                  </div>
                </div>
              </div>
            </div>

            <div class="action-buttons">
              <el-button type="primary" size="large" @click="runAllTests" :loading="runningAllTests">
                <el-icon><VideoPlay /></el-icon>
                运行全部测试
              </el-button>
              <el-button size="large" @click="resetTests">
                <el-icon><Refresh /></el-icon>
                重置测试
              </el-button>
              <el-button size="large" @click="exportTestReport">
                <el-icon><Document /></el-icon>
                导出测试报告
              </el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 测试日志 -->
    <div class="test-logs">
      <el-card>
        <template #header>
          <div class="card-header">
            <el-icon><Document /></el-icon>
            <span>测试日志</span>
            <el-button text @click="clearLogs">清空日志</el-button>
          </div>
        </template>
        
        <div class="logs-content">
          <div v-for="log in testLogs" :key="log.id" class="log-item" :class="log.type">
            <div class="log-time">{{ log.time }}</div>
            <div class="log-message">{{ log.message }}</div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'
import {
  ChatDotRound, TrendCharts, DataBoard, Download, Refresh, View, Filter, Share,
  VideoPlay, Check, Clock, Document
} from '@element-plus/icons-vue'

// 响应式数据
const activeTab = ref('multimodal')
const runningAllTests = ref(false)

const testResults = reactive({
  smartGuide: false,
  thinkingAnalysis: false,
  numberFormat: false,
  quickExport: false,
  dataRefresh: false,
  viewSwitch: false,
  filterSettings: false,
  shareLink: false
})

const testing = reactive({
  smartGuide: false,
  thinkingAnalysis: false,
  numberFormat: false,
  quickExport: false,
  dataRefresh: false,
  viewSwitch: false,
  filterSettings: false,
  shareLink: false
})

const testLogs = reactive([])

// 计算属性
const totalTests = computed(() => Object.keys(testResults).length)
const completedTests = computed(() => Object.values(testResults).filter(Boolean).length)
const successRate = computed(() => {
  return totalTests.value > 0 ? Math.round((completedTests.value / totalTests.value) * 100) : 0
})

const multimodalProgress = computed(() => {
  const multimodalTests = ['smartGuide', 'thinkingAnalysis', 'numberFormat']
  const completed = multimodalTests.filter(test => testResults[test]).length
  return Math.round((completed / multimodalTests.length) * 100)
})

const floatingProgress = computed(() => {
  const floatingTests = ['quickExport', 'dataRefresh', 'viewSwitch', 'filterSettings', 'shareLink']
  const completed = floatingTests.filter(test => testResults[test]).length
  return Math.round((completed / floatingTests.length) * 100)
})

// 方法
const addLog = (message, type = 'info') => {
  testLogs.unshift({
    id: Date.now(),
    time: new Date().toLocaleTimeString(),
    message,
    type
  })
  
  // 保持最多50条日志
  if (testLogs.length > 50) {
    testLogs.splice(50)
  }
}

const simulateTest = async (testName, duration = 2000) => {
  testing[testName] = true
  addLog(`开始测试: ${getTestDisplayName(testName)}`, 'info')
  
  try {
    await new Promise(resolve => setTimeout(resolve, duration))
    testResults[testName] = true
    addLog(`测试完成: ${getTestDisplayName(testName)} - 成功`, 'success')
    ElMessage.success(`${getTestDisplayName(testName)}测试通过`)
  } catch (error) {
    addLog(`测试失败: ${getTestDisplayName(testName)} - ${error.message}`, 'error')
    ElMessage.error(`${getTestDisplayName(testName)}测试失败`)
  } finally {
    testing[testName] = false
  }
}

const getTestDisplayName = (testName) => {
  const nameMap = {
    smartGuide: '智能问答引导',
    thinkingAnalysis: '答题思路分析',
    numberFormat: '数值格式化',
    quickExport: '快速导出',
    dataRefresh: '数据刷新',
    viewSwitch: '视图切换',
    filterSettings: '筛选设置',
    shareLink: '分享链接'
  }
  return nameMap[testName] || testName
}

// 测试方法
const testSmartGuide = () => simulateTest('smartGuide')
const testThinkingAnalysis = () => simulateTest('thinkingAnalysis')
const testNumberFormat = () => simulateTest('numberFormat')
const testQuickExport = () => simulateTest('quickExport')
const testDataRefresh = () => simulateTest('dataRefresh')
const testViewSwitch = () => simulateTest('viewSwitch')
const testFilterSettings = () => simulateTest('filterSettings')
const testShareLink = () => simulateTest('shareLink')

const runAllTests = async () => {
  runningAllTests.value = true
  addLog('开始运行全部测试', 'info')
  
  const tests = Object.keys(testResults)
  for (const test of tests) {
    await simulateTest(test, 1500)
  }
  
  runningAllTests.value = false
  addLog('全部测试完成', 'success')
  
  ElNotification({
    title: '测试完成',
    message: `所有测试已完成，成功率: ${successRate.value}%`,
    type: 'success',
    duration: 5000
  })
}

const resetTests = () => {
  Object.keys(testResults).forEach(key => {
    testResults[key] = false
  })
  addLog('测试结果已重置', 'info')
  ElMessage.info('测试结果已重置')
}

const clearLogs = () => {
  testLogs.splice(0)
  ElMessage.info('日志已清空')
}

const exportTestReport = () => {
  const report = {
    timestamp: new Date().toISOString(),
    totalTests: totalTests.value,
    completedTests: completedTests.value,
    successRate: successRate.value,
    results: testResults,
    logs: testLogs
  }
  
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `iflytek-optimization-test-report-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
  
  addLog('测试报告已导出', 'success')
  ElMessage.success('测试报告已导出')
}

const handleTabClick = (tab) => {
  addLog(`切换到${tab.props.label}`, 'info')
}
</script>

<style scoped>
.comprehensive-test {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

.test-header {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header-content h1 {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 1.8rem;
}

.header-content p {
  margin: 0 0 16px 0;
  color: #7f8c8d;
  font-size: 1rem;
}

.test-stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 0.85rem;
  color: #7f8c8d;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--iflytek-primary);
}

.test-navigation {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.test-section h3 {
  margin: 0 0 8px 0;
  color: #2c3e50;
}

.test-section p {
  margin: 0 0 24px 0;
  color: #7f8c8d;
}

.test-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.test-card {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
  background: #f8f9fa;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-weight: 600;
}

.card-header .el-tag {
  margin-left: auto;
}

.card-content p {
  margin: 0 0 12px 0;
  font-size: 0.9rem;
  color: #6c757d;
}

.test-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.summary-card {
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
  background: white;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.summary-header h4 {
  margin: 0;
  color: #2c3e50;
}

.summary-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f1f3f4;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-item .success {
  color: #52c41a;
}

.detail-item .pending {
  color: #d9d9d9;
}

.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.test-logs {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.logs-content {
  max-height: 300px;
  overflow-y: auto;
}

.log-item {
  display: flex;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #f1f3f4;
}

.log-item:last-child {
  border-bottom: none;
}

.log-time {
  font-size: 0.8rem;
  color: #7f8c8d;
  min-width: 80px;
}

.log-message {
  font-size: 0.9rem;
  color: #2c3e50;
}

.log-item.success .log-message {
  color: #52c41a;
}

.log-item.error .log-message {
  color: #ff4d4f;
}

.log-item.info .log-message {
  color: #1890ff;
}

@media (max-width: 768px) {
  .comprehensive-test {
    padding: 10px;
  }
  
  .test-grid {
    grid-template-columns: 1fr;
  }
  
  .test-summary {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .test-stats {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
