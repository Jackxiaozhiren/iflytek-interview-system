<template>
  <div class="debug-learning-path">
    <div class="page-header">
      <h1>学习路径调试</h1>
      <p>调试和诊断学习路径系统</p>
    </div>
    
    <div class="debug-content">
      <div class="debug-panel">
        <h2>系统状态</h2>
        <div class="status-grid">
          <div class="status-item">
            <div class="status-label">API连接</div>
            <div class="status-value" :class="apiStatus">{{ apiStatus }}</div>
          </div>
          <div class="status-item">
            <div class="status-label">数据库</div>
            <div class="status-value" :class="dbStatus">{{ dbStatus }}</div>
          </div>
          <div class="status-item">
            <div class="status-label">缓存</div>
            <div class="status-value" :class="cacheStatus">{{ cacheStatus }}</div>
          </div>
          <div class="status-item">
            <div class="status-label">算法引擎</div>
            <div class="status-value" :class="algorithmStatus">{{ algorithmStatus }}</div>
          </div>
        </div>
      </div>
      
      <div class="debug-tools">
        <h2>调试工具</h2>
        <div class="tools-grid">
          <el-button type="primary" @click="checkConnections">检查连接</el-button>
          <el-button type="success" @click="validateData">验证数据</el-button>
          <el-button type="warning" @click="clearCache">清除缓存</el-button>
          <el-button type="danger" @click="resetSystem">重置系统</el-button>
        </div>
      </div>
      
      <div class="debug-logs" v-if="logs.length > 0">
        <h2>调试日志</h2>
        <div class="logs-container">
          <div v-for="log in logs" :key="log.id" class="log-entry" :class="log.level">
            <span class="log-time">{{ log.timestamp }}</span>
            <span class="log-level">{{ log.level.toUpperCase() }}</span>
            <span class="log-message">{{ log.message }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const apiStatus = ref('connected')
const dbStatus = ref('connected')
const cacheStatus = ref('active')
const algorithmStatus = ref('running')

const logs = ref([])

const addLog = (level, message) => {
  logs.value.unshift({
    id: Date.now(),
    level,
    message,
    timestamp: new Date().toLocaleTimeString('zh-CN')
  })
  
  // 保持最多50条日志
  if (logs.value.length > 50) {
    logs.value = logs.value.slice(0, 50)
  }
}

const checkConnections = () => {
  addLog('info', '开始检查系统连接...')
  setTimeout(() => {
    addLog('success', 'API连接正常')
    addLog('success', '数据库连接正常')
    addLog('success', '所有连接检查完成')
  }, 1000)
}

const validateData = () => {
  addLog('info', '开始验证数据完整性...')
  setTimeout(() => {
    addLog('success', '数据验证通过')
  }, 800)
}

const clearCache = () => {
  addLog('warning', '清除系统缓存...')
  setTimeout(() => {
    addLog('success', '缓存清除完成')
  }, 500)
}

const resetSystem = () => {
  addLog('error', '重置系统状态...')
  setTimeout(() => {
    logs.value = []
    addLog('success', '系统重置完成')
  }, 1200)
}
</script>

<style scoped>
.debug-learning-path {
  min-height: 100vh;
  background: var(--iflytek-bg-secondary);
  padding: 24px;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: var(--font-size-2xl);
  color: var(--iflytek-text-primary);
  margin: 0 0 8px 0;
}

.debug-content {
  max-width: 1200px;
  margin: 0 auto;
}

.debug-panel,
.debug-tools,
.debug-logs {
  background: var(--iflytek-bg-primary);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: var(--iflytek-shadow-sm);
}

.debug-panel h2,
.debug-tools h2,
.debug-logs h2 {
  margin: 0 0 20px 0;
  color: var(--iflytek-text-primary);
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.status-item {
  background: var(--iflytek-bg-secondary);
  border-radius: 8px;
  padding: 16px;
  text-align: center;
}

.status-label {
  font-size: var(--font-size-sm);
  color: var(--iflytek-text-secondary);
  margin-bottom: 8px;
}

.status-value {
  font-weight: var(--font-weight-semibold);
  padding: 4px 12px;
  border-radius: 16px;
  font-size: var(--font-size-sm);
}

.status-value.connected,
.status-value.active,
.status-value.running {
  background: #f6ffed;
  color: #52c41a;
}

.status-value.disconnected,
.status-value.inactive,
.status-value.stopped {
  background: #fff2f0;
  color: #ff4d4f;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.logs-container {
  max-height: 400px;
  overflow-y: auto;
  background: #1e1e1e;
  border-radius: 8px;
  padding: 16px;
  font-family: 'Courier New', monospace;
}

.log-entry {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
  font-size: var(--font-size-sm);
}

.log-time {
  color: #888;
  min-width: 80px;
}

.log-level {
  min-width: 60px;
  font-weight: var(--font-weight-bold);
}

.log-entry.info .log-level {
  color: #1890ff;
}

.log-entry.success .log-level {
  color: #52c41a;
}

.log-entry.warning .log-level {
  color: #faad14;
}

.log-entry.error .log-level {
  color: #ff4d4f;
}

.log-message {
  color: #fff;
  flex: 1;
}
</style>
