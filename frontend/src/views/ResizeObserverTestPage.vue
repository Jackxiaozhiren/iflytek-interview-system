<template>
  <div class="resize-observer-test">
    <div class="test-header">
      <h1>ResizeObserver 错误修复测试</h1>
      <p>此页面用于测试和验证ResizeObserver错误修复效果</p>
    </div>

    <div class="test-controls">
      <el-button @click="checkStatus" type="primary">
        <el-icon><TrendCharts /></el-icon>
        检查修复状态
      </el-button>
      <el-button @click="triggerResize" type="warning">
        <el-icon><Refresh /></el-icon>
        触发尺寸变化
      </el-button>
      <el-button @click="createObservers" type="success">
        <el-icon><Plus /></el-icon>
        创建观察器
      </el-button>
      <el-button @click="clearTest" type="danger">
        <el-icon><Delete /></el-icon>
        清理测试
      </el-button>
      <el-button @click="resetErrorCount" type="info">
        <el-icon><Refresh /></el-icon>
        重置错误计数
      </el-button>
    </div>

    <div class="test-status">
      <el-card>
        <template #header>
          <span>修复状态</span>
        </template>
        <div class="status-grid">
          <div class="status-item">
            <span class="status-label">错误处理:</span>
            <el-tag :type="status.isFixed ? 'success' : 'danger'">
              {{ status.isFixed ? '已启用' : '未启用' }}
            </el-tag>
          </div>
          <div class="status-item">
            <span class="status-label">错误计数:</span>
            <span class="status-value">{{ status.errorCount }}</span>
          </div>
          <div class="status-item">
            <span class="status-label">活跃观察器:</span>
            <span class="status-value">{{ status.activeObservers }}</span>
          </div>
          <div class="status-item">
            <span class="status-label">待处理回调:</span>
            <span class="status-value">{{ status.pendingCallbacks }}</span>
          </div>
        </div>
      </el-card>
    </div>

    <div class="test-areas">
      <el-row :gutter="24">
        <el-col :span="8">
          <el-card>
            <template #header>
              <span>动态尺寸测试</span>
            </template>
            <div 
              ref="resizeBox1" 
              class="resize-box"
              :style="{ width: box1Width + 'px', height: box1Height + 'px' }"
            >
              <p>尺寸: {{ box1Width }} x {{ box1Height }}</p>
              <p>观察次数: {{ box1ResizeCount }}</p>
            </div>
            <div class="box-controls">
              <el-slider v-model="box1Width" :min="100" :max="400" />
              <el-slider v-model="box1Height" :min="100" :max="300" />
            </div>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card>
            <template #header>
              <span>表格组件测试</span>
            </template>
            <el-table 
              ref="testTable"
              :data="tableData" 
              style="width: 100%"
              height="200"
            >
              <el-table-column prop="name" label="名称" />
              <el-table-column prop="value" label="值" />
            </el-table>
            <el-button @click="addTableData" size="small" style="margin-top: 10px;">
              添加数据
            </el-button>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card>
            <template #header>
              <span>图表组件测试</span>
            </template>
            <div ref="chartContainer" style="width: 100%; height: 200px;"></div>
            <el-button @click="updateChart" size="small" style="margin-top: 10px;">
              更新图表
            </el-button>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="test-logs">
      <el-card>
        <template #header>
          <span>测试日志</span>
          <el-button @click="clearLogs" size="small" style="float: right;">清空日志</el-button>
        </template>
        <div class="logs-container">
          <div v-for="(log, index) in logs" :key="index" class="log-item">
            <span class="log-time">{{ log.time }}</span>
            <span class="log-message">{{ log.message }}</span>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { TrendCharts, Refresh, Plus, Delete } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

// 状态数据
const status = reactive({
  isFixed: false,
  errorCount: 0,
  activeObservers: 0,
  pendingCallbacks: 0,
  lastErrorTime: null
})

// 测试数据
const box1Width = ref(200)
const box1Height = ref(150)
const box1ResizeCount = ref(0)

const tableData = ref([
  { name: '测试项1', value: '值1' },
  { name: '测试项2', value: '值2' }
])

const logs = ref([])

// DOM引用
const resizeBox1 = ref(null)
const testTable = ref(null)
const chartContainer = ref(null)

// 图表实例
let chart = null
let resizeObserver1 = null

// 方法
const addLog = (message) => {
  logs.value.unshift({
    time: new Date().toLocaleTimeString(),
    message
  })
  if (logs.value.length > 50) {
    logs.value = logs.value.slice(0, 50)
  }
}

const checkStatus = () => {
  if (window.checkResizeObserverFix) {
    const currentStatus = window.checkResizeObserverFix()
    Object.assign(status, {
      isFixed: currentStatus.isActive,
      errorCount: currentStatus.errorCount,
      activeObservers: 0, // 简化版本不跟踪观察器
      pendingCallbacks: 0, // 简化版本不跟踪回调
      lastErrorTime: currentStatus.lastErrorTime
    })
    addLog('状态检查完成')
    ElMessage.success('状态已更新')
  } else {
    ElMessage.error('ResizeObserver修复工具未找到')
  }
}

const triggerResize = () => {
  box1Width.value = Math.floor(Math.random() * 300) + 100
  box1Height.value = Math.floor(Math.random() * 200) + 100
  
  if (chart) {
    setTimeout(() => {
      chart.resize()
    }, 100)
  }
  
  addLog('触发尺寸变化')
}

const createObservers = () => {
  if (resizeBox1.value && !resizeObserver1) {
    resizeObserver1 = new ResizeObserver((entries) => {
      box1ResizeCount.value++
      addLog(`Box1 尺寸变化: ${entries[0].contentRect.width}x${entries[0].contentRect.height}`)
    })
    resizeObserver1.observe(resizeBox1.value)
    addLog('创建ResizeObserver')
  }
}

const clearTest = () => {
  if (resizeObserver1) {
    resizeObserver1.disconnect()
    resizeObserver1 = null
  }
  
  box1ResizeCount.value = 0
  addLog('清理测试环境')
  ElMessage.success('测试环境已清理')
}

const addTableData = () => {
  const index = tableData.value.length + 1
  tableData.value.push({
    name: `测试项${index}`,
    value: `值${index}`
  })
  addLog('添加表格数据')
}

const updateChart = () => {
  if (chart) {
    const data = Array.from({ length: 6 }, () => Math.floor(Math.random() * 100))
    chart.setOption({
      series: [{
        data
      }]
    })
    addLog('更新图表数据')
  }
}

const clearLogs = () => {
  logs.value = []
}

const resetErrorCount = () => {
  if (window.resetResizeObserverErrors) {
    window.resetResizeObserverErrors()
    checkStatus()
    addLog('错误计数已重置')
    ElMessage.success('错误计数已重置')
  } else {
    ElMessage.error('重置功能不可用')
  }
}

// 初始化图表
const initChart = () => {
  if (chartContainer.value) {
    chart = echarts.init(chartContainer.value)
    chart.setOption({
      title: { text: '测试图表' },
      xAxis: { type: 'category', data: ['A', 'B', 'C', 'D', 'E', 'F'] },
      yAxis: { type: 'value' },
      series: [{
        type: 'bar',
        data: [10, 20, 30, 40, 50, 60]
      }]
    })
  }
}

// 生命周期
onMounted(() => {
  nextTick(() => {
    checkStatus()
    initChart()
    createObservers()
    addLog('测试页面已加载')
  })
})

onUnmounted(() => {
  clearTest()
  if (chart) {
    chart.dispose()
  }
})
</script>

<style scoped>
.resize-observer-test {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.test-header {
  text-align: center;
  margin-bottom: 24px;
}

.test-header h1 {
  color: #1890ff;
  margin-bottom: 8px;
}

.test-controls {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
}

.test-status {
  margin-bottom: 24px;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-label {
  font-weight: 500;
  color: #666;
}

.status-value {
  font-weight: 600;
  color: #1890ff;
}

.test-areas {
  margin-bottom: 24px;
}

.resize-box {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  transition: all 0.3s ease;
  margin-bottom: 12px;
}

.box-controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.test-logs {
  margin-top: 24px;
}

.logs-container {
  max-height: 300px;
  overflow-y: auto;
}

.log-item {
  display: flex;
  gap: 12px;
  padding: 4px 0;
  border-bottom: 1px solid #f0f0f0;
}

.log-time {
  color: #999;
  font-size: 12px;
  min-width: 80px;
}

.log-message {
  color: #333;
  font-size: 14px;
}
</style>
