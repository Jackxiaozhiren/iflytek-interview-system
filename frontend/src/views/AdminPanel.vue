<template>
  <div class="admin-panel">
    <!-- 管理员面板头部 -->
    <div class="panel-header">
      <div class="header-content">
        <div class="header-info">
          <h1 class="panel-title">系统管理</h1>
          <p class="panel-subtitle">iFlytek 多模态面试评估系统 - 管理员控制台</p>
        </div>
        <div class="header-actions">
          <el-button type="primary" @click="refreshSystem">
            <el-icon><Refresh /></el-icon>
            刷新系统
          </el-button>
          <el-button @click="exportLogs">
            <el-icon><Download /></el-icon>
            导出日志
          </el-button>
        </div>
      </div>
    </div>

    <!-- 系统状态卡片 -->
    <div class="status-grid">
      <div class="status-card system-health">
        <div class="status-icon">
          <el-icon><TrendCharts /></el-icon>
        </div>
        <div class="status-content">
          <div class="status-value">{{ systemStatus.health }}%</div>
          <div class="status-label">系统健康度</div>
        </div>
        <div class="status-indicator" :class="getHealthStatus(systemStatus.health)"></div>
      </div>
      
      <div class="status-card cpu-usage">
        <div class="status-icon">
          <el-icon><Cpu /></el-icon>
        </div>
        <div class="status-content">
          <div class="status-value">{{ systemStatus.cpu }}%</div>
          <div class="status-label">CPU使用率</div>
        </div>
        <div class="status-indicator" :class="getCpuStatus(systemStatus.cpu)"></div>
      </div>
      
      <div class="status-card memory-usage">
        <div class="status-icon">
          <el-icon><Odometer /></el-icon>
        </div>
        <div class="status-content">
          <div class="status-value">{{ systemStatus.memory }}%</div>
          <div class="status-label">内存使用率</div>
        </div>
        <div class="status-indicator" :class="getMemoryStatus(systemStatus.memory)"></div>
      </div>
      
      <div class="status-card active-users">
        <div class="status-icon">
          <el-icon><User /></el-icon>
        </div>
        <div class="status-content">
          <div class="status-value">{{ systemStatus.activeUsers }}</div>
          <div class="status-label">在线用户</div>
        </div>
        <div class="status-indicator online"></div>
      </div>
    </div>

    <!-- 管理功能区域 -->
    <div class="admin-content">
      <!-- 左侧管理菜单 -->
      <div class="admin-sidebar">
        <div class="sidebar-menu">
          <div 
            v-for="menu in adminMenus" 
            :key="menu.key"
            class="menu-item"
            :class="{ active: activeMenu === menu.key }"
            @click="setActiveMenu(menu.key)"
          >
            <el-icon><component :is="menu.icon" /></el-icon>
            <span>{{ menu.label }}</span>
          </div>
        </div>
      </div>

      <!-- 右侧内容区域 -->
      <div class="admin-main">
        <!-- 用户管理 -->
        <div v-if="activeMenu === 'users'" class="admin-section">
          <div class="section-header">
            <h3>用户管理</h3>
            <el-button type="primary" @click="addUser">添加用户</el-button>
          </div>
          <div class="users-table">
            <el-table :data="users" style="width: 100%">
              <el-table-column prop="name" label="姓名" width="120" />
              <el-table-column prop="email" label="邮箱" width="200" />
              <el-table-column prop="role" label="角色" width="100">
                <template #default="{ row }">
                  <el-tag :type="getRoleType(row.role)">{{ getRoleText(row.role) }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" width="100">
                <template #default="{ row }">
                  <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
                    {{ row.status === 'active' ? '活跃' : '禁用' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="lastLogin" label="最后登录" width="180" />
              <el-table-column label="操作" width="200">
                <template #default="{ row }">
                  <el-button size="small" @click="editUser(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteUser(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <!-- 系统设置 -->
        <div v-if="activeMenu === 'settings'" class="admin-section">
          <div class="section-header">
            <h3>系统设置</h3>
          </div>
          <div class="settings-form">
            <el-form :model="systemSettings" label-width="120px">
              <el-form-item label="系统名称">
                <el-input v-model="systemSettings.systemName" />
              </el-form-item>
              <el-form-item label="最大用户数">
                <el-input-number v-model="systemSettings.maxUsers" :min="1" :max="10000" />
              </el-form-item>
              <el-form-item label="会话超时">
                <el-input-number v-model="systemSettings.sessionTimeout" :min="5" :max="1440" />
                <span style="margin-left: 8px;">分钟</span>
              </el-form-item>
              <el-form-item label="启用邮件通知">
                <el-switch v-model="systemSettings.emailNotification" />
              </el-form-item>
              <el-form-item label="启用短信通知">
                <el-switch v-model="systemSettings.smsNotification" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveSettings">保存设置</el-button>
                <el-button @click="resetSettings">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>

        <!-- 系统日志 -->
        <div v-if="activeMenu === 'logs'" class="admin-section">
          <div class="section-header">
            <h3>系统日志</h3>
            <div class="log-filters">
              <el-select v-model="logLevel" placeholder="日志级别" style="width: 120px;">
                <el-option label="全部" value="all" />
                <el-option label="错误" value="error" />
                <el-option label="警告" value="warning" />
                <el-option label="信息" value="info" />
              </el-select>
              <el-button @click="clearLogs">清空日志</el-button>
            </div>
          </div>
          <div class="logs-container">
            <div 
              v-for="log in filteredLogs" 
              :key="log.id"
              class="log-item"
              :class="log.level"
            >
              <div class="log-time">{{ formatTime(log.timestamp) }}</div>
              <div class="log-level">{{ log.level.toUpperCase() }}</div>
              <div class="log-message">{{ log.message }}</div>
            </div>
          </div>
        </div>

        <!-- 数据统计 -->
        <div v-if="activeMenu === 'analytics'" class="admin-section">
          <div class="section-header">
            <h3>数据统计</h3>
          </div>
          <div class="analytics-charts">
            <div class="chart-container">
              <h4>用户活跃度</h4>
              <div class="chart-placeholder">
                <el-icon><TrendCharts /></el-icon>
                <p>用户活跃度图表</p>
              </div>
            </div>
            <div class="chart-container">
              <h4>系统性能</h4>
              <div class="chart-placeholder">
                <el-icon><TrendCharts /></el-icon>
                <p>系统性能图表</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import {
  Refresh, Download, TrendCharts, Cpu, Odometer, User, Setting, Document, Bell
} from '@element-plus/icons-vue'

// 响应式数据
const activeMenu = ref('users')
const logLevel = ref('all')

const systemStatus = reactive({
  health: 98,
  cpu: 45,
  memory: 62,
  activeUsers: 156
})

const systemSettings = reactive({
  systemName: 'iFlytek 多模态面试评估系统',
  maxUsers: 1000,
  sessionTimeout: 30,
  emailNotification: true,
  smsNotification: false
})

const adminMenus = ref([
  { key: 'users', label: '用户管理', icon: 'User' },
  { key: 'settings', label: '系统设置', icon: 'Setting' },
  { key: 'logs', label: '系统日志', icon: 'Document' },
  { key: 'analytics', label: '数据统计', icon: 'TrendCharts' }
])

const users = ref([
  {
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-01-15 10:30:00'
  },
  {
    id: 2,
    name: '李四',
    email: 'lisi@example.com',
    role: 'hr',
    status: 'active',
    lastLogin: '2024-01-15 09:15:00'
  },
  {
    id: 3,
    name: '王五',
    email: 'wangwu@example.com',
    role: 'candidate',
    status: 'inactive',
    lastLogin: '2024-01-14 16:45:00'
  }
])

const logs = ref([
  {
    id: 1,
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    level: 'info',
    message: '用户张三登录系统'
  },
  {
    id: 2,
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    level: 'warning',
    message: 'CPU使用率超过80%'
  },
  {
    id: 3,
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    level: 'error',
    message: '数据库连接失败'
  }
])

// 计算属性
const filteredLogs = computed(() => {
  if (logLevel.value === 'all') {
    return logs.value
  }
  return logs.value.filter(log => log.level === logLevel.value)
})

// 方法
const refreshSystem = () => {
  console.log('刷新系统')
}

const exportLogs = () => {
  console.log('导出日志')
}

const setActiveMenu = (menu) => {
  activeMenu.value = menu
}

const addUser = () => {
  console.log('添加用户')
}

const editUser = (id) => {
  console.log('编辑用户:', id)
}

const deleteUser = (id) => {
  console.log('删除用户:', id)
}

const saveSettings = () => {
  console.log('保存设置')
}

const resetSettings = () => {
  console.log('重置设置')
}

const clearLogs = () => {
  logs.value = []
}

const getHealthStatus = (health) => {
  if (health >= 90) return 'excellent'
  if (health >= 70) return 'good'
  if (health >= 50) return 'warning'
  return 'danger'
}

const getCpuStatus = (cpu) => {
  if (cpu < 50) return 'good'
  if (cpu < 80) return 'warning'
  return 'danger'
}

const getMemoryStatus = (memory) => {
  if (memory < 60) return 'good'
  if (memory < 85) return 'warning'
  return 'danger'
}

const getRoleType = (role) => {
  const typeMap = {
    admin: 'danger',
    hr: 'warning',
    candidate: 'primary'
  }
  return typeMap[role] || 'info'
}

const getRoleText = (role) => {
  const textMap = {
    admin: '管理员',
    hr: 'HR',
    candidate: '候选人'
  }
  return textMap[role] || '未知'
}

const formatTime = (date) => {
  return date.toLocaleString('zh-CN')
}

onMounted(() => {
  console.log('管理员面板已加载')
})
</script>

<style scoped>
.admin-panel {
  min-height: 100vh;
  background: var(--iflytek-bg-secondary);
  padding: 24px;
}

.panel-header {
  background: var(--iflytek-bg-primary);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: var(--iflytek-shadow-sm);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--iflytek-text-primary);
  margin: 0 0 8px 0;
}

.panel-subtitle {
  color: var(--iflytek-text-secondary);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.status-card {
  background: var(--iflytek-bg-primary);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: var(--iflytek-shadow-sm);
  position: relative;
  transition: all 0.3s ease;
}

.status-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--iflytek-shadow-md);
}

.status-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--iflytek-gradient-primary);
  color: white;
  font-size: 24px;
}

.status-value {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--iflytek-text-primary);
  margin-bottom: 4px;
}

.status-label {
  color: var(--iflytek-text-secondary);
  font-size: var(--font-size-sm);
}

.status-indicator {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.status-indicator.excellent {
  background: #52c41a;
}

.status-indicator.good {
  background: #1890ff;
}

.status-indicator.warning {
  background: #faad14;
}

.status-indicator.danger {
  background: #ff4d4f;
}

.status-indicator.online {
  background: #52c41a;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.admin-content {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 24px;
}

.admin-sidebar {
  background: var(--iflytek-bg-primary);
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--iflytek-shadow-sm);
  height: fit-content;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 8px;
  color: var(--iflytek-text-secondary);
}

.menu-item:hover {
  background: var(--iflytek-bg-secondary);
  color: var(--iflytek-text-primary);
}

.menu-item.active {
  background: var(--iflytek-primary);
  color: white;
}

.admin-main {
  background: var(--iflytek-bg-primary);
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--iflytek-shadow-sm);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--iflytek-border-secondary);
}

.section-header h3 {
  margin: 0;
  color: var(--iflytek-text-primary);
  font-weight: var(--font-weight-semibold);
}

.log-filters {
  display: flex;
  gap: 12px;
  align-items: center;
}

.logs-container {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid var(--iflytek-border-secondary);
  border-radius: 8px;
  padding: 16px;
}

.log-item {
  display: flex;
  gap: 16px;
  padding: 8px 0;
  border-bottom: 1px solid var(--iflytek-border-tertiary);
  font-family: monospace;
  font-size: var(--font-size-sm);
}

.log-item:last-child {
  border-bottom: none;
}

.log-time {
  color: var(--iflytek-text-tertiary);
  min-width: 150px;
}

.log-level {
  min-width: 60px;
  font-weight: var(--font-weight-bold);
}

.log-item.error .log-level {
  color: #ff4d4f;
}

.log-item.warning .log-level {
  color: #faad14;
}

.log-item.info .log-level {
  color: #1890ff;
}

.log-message {
  flex: 1;
  color: var(--iflytek-text-primary);
}

.analytics-charts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.chart-container {
  border: 1px solid var(--iflytek-border-secondary);
  border-radius: 8px;
  padding: 20px;
}

.chart-container h4 {
  margin: 0 0 16px 0;
  color: var(--iflytek-text-primary);
}

.chart-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--iflytek-text-tertiary);
}

.chart-placeholder .el-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

@media (max-width: 1024px) {
  .admin-content {
    grid-template-columns: 1fr;
  }
  
  .admin-sidebar {
    order: 2;
  }
  
  .sidebar-menu {
    display: flex;
    gap: 8px;
    overflow-x: auto;
  }
  
  .menu-item {
    white-space: nowrap;
    margin-bottom: 0;
  }
}

@media (max-width: 768px) {
  .admin-panel {
    padding: 16px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .status-grid {
    grid-template-columns: 1fr;
  }
  
  .analytics-charts {
    grid-template-columns: 1fr;
  }
}
</style>
