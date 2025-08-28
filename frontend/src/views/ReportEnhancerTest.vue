<template>
  <div class="report-enhancer-test">
    <!-- 页面头部 -->
    <div class="test-header">
      <div class="header-content">
        <h1>报告中心设置悬浮按钮功能测试</h1>
        <p>测试增强后的InteractiveExperienceEnhancer组件功能</p>
      </div>
    </div>

    <!-- 测试内容区域 -->
    <div class="test-content">
      <!-- 模拟报告数据 -->
      <div class="mock-report-section">
        <el-card>
          <template #header>
            <div class="card-header">
              <el-icon><TrendCharts /></el-icon>
              <span>模拟报告数据</span>
              <div class="view-indicator">
                当前视图: {{ currentViewText }}
              </div>
            </div>
          </template>
          
          <!-- 表格视图 -->
          <div v-if="currentView === 'table'" class="table-view">
            <el-table :data="mockTableData" style="width: 100%">
              <el-table-column prop="name" label="候选人姓名" width="120" />
              <el-table-column prop="position" label="应聘职位" width="150" />
              <el-table-column prop="score" label="综合评分" width="100">
                <template #default="scope">
                  <el-tag :type="getScoreType(scope.row.score)">
                    {{ scope.row.score }}分
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="面试状态" width="100">
                <template #default="scope">
                  <el-tag :type="getStatusType(scope.row.status)">
                    {{ scope.row.status }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="date" label="面试时间" />
            </el-table>
          </div>

          <!-- 图表视图 -->
          <div v-else class="chart-view">
            <div class="chart-container">
              <div class="chart-placeholder">
                <el-icon size="64"><TrendCharts /></el-icon>
                <h3>评分分布图表</h3>
                <p>这里将显示候选人评分的可视化图表</p>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 功能测试面板 -->
      <div class="test-panel">
        <el-card>
          <template #header>
            <div class="card-header">
              <el-icon><Setting /></el-icon>
              <span>功能测试面板</span>
            </div>
          </template>
          
          <div class="test-controls">
            <div class="control-group">
              <h4>导出功能测试</h4>
              <div class="button-group">
                <el-button @click="testExport('pdf')" type="primary">
                  <el-icon><Document /></el-icon>
                  测试PDF导出
                </el-button>
                <el-button @click="testExport('excel')" type="success">
                  <el-icon><Grid /></el-icon>
                  测试Excel导出
                </el-button>
              </div>
            </div>

            <div class="control-group">
              <h4>视图切换测试</h4>
              <div class="button-group">
                <el-button @click="testViewSwitch" type="warning">
                  <el-icon><View /></el-icon>
                  切换视图模式
                </el-button>
              </div>
            </div>

            <div class="control-group">
              <h4>数据刷新测试</h4>
              <div class="button-group">
                <el-button @click="testRefresh" type="info">
                  <el-icon><Refresh /></el-icon>
                  测试数据刷新
                </el-button>
              </div>
            </div>

            <div class="control-group">
              <h4>筛选功能测试</h4>
              <div class="button-group">
                <el-select v-model="testTimeRange" placeholder="选择时间范围" style="width: 150px;">
                  <el-option label="最近7天" value="7d" />
                  <el-option label="最近30天" value="30d" />
                  <el-option label="最近3个月" value="3m" />
                </el-select>
                <el-button @click="testFilter" type="danger">
                  <el-icon><Filter /></el-icon>
                  应用筛选
                </el-button>
              </div>
            </div>

            <div class="control-group">
              <h4>分享链接测试</h4>
              <div class="button-group">
                <el-select v-model="testPermission" placeholder="选择权限" style="width: 120px;">
                  <el-option label="仅查看" value="view" />
                  <el-option label="可编辑" value="edit" />
                  <el-option label="管理员" value="admin" />
                </el-select>
                <el-button @click="testShareLink">
                  <el-icon><Share /></el-icon>
                  生成分享链接
                </el-button>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 测试结果显示 -->
      <div class="test-results">
        <el-card>
          <template #header>
            <div class="card-header">
              <el-icon><TrendCharts /></el-icon>
              <span>测试结果</span>
            </div>
          </template>
          
          <div class="results-content">
            <div v-for="result in testResults" :key="result.id" class="result-item">
              <div class="result-header">
                <el-tag :type="result.success ? 'success' : 'danger'">
                  {{ result.success ? '成功' : '失败' }}
                </el-tag>
                <span class="result-time">{{ result.time }}</span>
              </div>
              <div class="result-content">
                <strong>{{ result.action }}</strong>: {{ result.message }}
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 🎨 交互体验增强器 -->
    <InteractiveExperienceEnhancer
      ref="experienceEnhancer"
      :enable-smart-bubbles="true"
      :enable-progress-indicator="true"
      :enable-performance-monitor="false"
      @export-report="handleExportReport"
      @view-switched="handleViewSwitched"
      @data-refreshed="handleDataRefreshed"
      @filters-applied="handleFiltersApplied"
      @share-link-generated="handleShareLinkGenerated"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import InteractiveExperienceEnhancer from '../components/Enhanced/InteractiveExperienceEnhancer.vue'
import {
  TrendCharts, Setting, Document, Grid, View, Refresh, Filter, Share
} from '@element-plus/icons-vue'

// 响应式数据
const experienceEnhancer = ref(null)
const currentView = ref('table')
const testTimeRange = ref('30d')
const testPermission = ref('view')
const testResults = reactive([])

// 模拟表格数据
const mockTableData = ref([
  {
    name: '张三',
    position: 'AI算法工程师',
    score: 92,
    status: '已通过',
    date: '2024-01-15 14:30'
  },
  {
    name: '李四',
    position: '大数据开发工程师',
    score: 85,
    status: '待复试',
    date: '2024-01-15 15:00'
  },
  {
    name: '王五',
    position: 'IoT系统架构师',
    score: 78,
    status: '已拒绝',
    date: '2024-01-15 15:30'
  },
  {
    name: '赵六',
    position: 'AI产品经理',
    score: 88,
    status: '已通过',
    date: '2024-01-15 16:00'
  }
])

// 计算属性
const currentViewText = computed(() => {
  return currentView.value === 'table' ? '表格视图' : '图表视图'
})

// 方法
const getScoreType = (score) => {
  if (score >= 90) return 'success'
  if (score >= 80) return 'warning'
  return 'danger'
}

const getStatusType = (status) => {
  const typeMap = {
    '已通过': 'success',
    '待复试': 'warning',
    '已拒绝': 'danger'
  }
  return typeMap[status] || 'info'
}

const addTestResult = (action, message, success = true) => {
  testResults.unshift({
    id: Date.now(),
    action,
    message,
    success,
    time: new Date().toLocaleTimeString()
  })
  
  // 保持最多10条记录
  if (testResults.length > 10) {
    testResults.splice(10)
  }
}

// 测试方法
const testExport = (format) => {
  if (experienceEnhancer.value) {
    experienceEnhancer.value.quickExport()
  }
  addTestResult('导出测试', `${format.toUpperCase()}格式导出功能已触发`)
}

const testViewSwitch = () => {
  const newView = currentView.value === 'table' ? 'chart' : 'table'
  if (experienceEnhancer.value) {
    experienceEnhancer.value.switchView(newView)
  }
  currentView.value = newView
  addTestResult('视图切换', `已切换到${newView === 'table' ? '表格' : '图表'}视图`)
}

const testRefresh = () => {
  if (experienceEnhancer.value) {
    experienceEnhancer.value.refreshData()
  }
  addTestResult('数据刷新', '数据刷新功能已触发')
}

const testFilter = () => {
  if (experienceEnhancer.value) {
    experienceEnhancer.value.applyFilters()
  }
  addTestResult('筛选应用', `已应用${testTimeRange.value}时间范围筛选`)
}

const testShareLink = () => {
  if (experienceEnhancer.value) {
    experienceEnhancer.value.generateShareLink()
  }
  addTestResult('分享链接', `已生成${testPermission.value}权限的分享链接`)
}

// 事件处理
const handleExportReport = (data) => {
  addTestResult('导出完成', `${data.format}格式报告导出成功`)
}

const handleViewSwitched = (view) => {
  currentView.value = view
  addTestResult('视图切换完成', `已切换到${view === 'table' ? '表格' : '图表'}视图`)
}

const handleDataRefreshed = () => {
  addTestResult('数据刷新完成', '报告数据已更新')
}

const handleFiltersApplied = () => {
  addTestResult('筛选应用完成', '数据筛选条件已生效')
}

const handleShareLinkGenerated = () => {
  addTestResult('分享链接生成完成', '分享链接已复制到剪贴板')
}
</script>

<style scoped>
.report-enhancer-test {
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
  margin: 0;
  color: #7f8c8d;
  font-size: 1rem;
}

.test-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.mock-report-section {
  grid-row: span 2;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.view-indicator {
  margin-left: auto;
  padding: 4px 12px;
  background: var(--iflytek-primary);
  color: white;
  border-radius: 12px;
  font-size: 0.85rem;
}

.table-view {
  min-height: 300px;
}

.chart-view {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-placeholder {
  text-align: center;
  color: #7f8c8d;
}

.chart-placeholder h3 {
  margin: 16px 0 8px 0;
}

.test-controls {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.control-group h4 {
  margin: 0 0 12px 0;
  color: #2c3e50;
  font-size: 0.9rem;
}

.button-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}

.results-content {
  max-height: 400px;
  overflow-y: auto;
}

.result-item {
  padding: 12px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  margin-bottom: 8px;
  background: #f8f9fa;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.result-time {
  font-size: 0.8rem;
  color: #7f8c8d;
}

.result-content {
  font-size: 0.9rem;
  color: #2c3e50;
}

@media (max-width: 1200px) {
  .test-content {
    grid-template-columns: 1fr;
  }
  
  .mock-report-section {
    grid-row: auto;
  }
}

@media (max-width: 768px) {
  .report-enhancer-test {
    padding: 10px;
  }
  
  .button-group {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
