<template>
  <div class="learning-progress-tracker">
    <!-- 总体进度 -->
    <el-card class="overall-progress" shadow="hover">
      <template #header>
        <div class="progress-header">
          <h3>
            <el-icon><TrendCharts /></el-icon>
            学习进度总览
          </h3>
          <el-tag :type="getProgressType(overallProgress)" size="large">
            {{ overallProgress }}% 完成
          </el-tag>
        </div>
      </template>

      <div class="progress-content">
        <!-- 环形进度图 -->
        <div class="circular-progress">
          <div class="progress-circle" ref="progressCircle"></div>
          <div class="progress-stats">
            <div class="stat-item">
              <span class="stat-value">{{ completedModules }}</span>
              <span class="stat-label">已完成模块</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ totalModules }}</span>
              <span class="stat-label">总模块数</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ studyHours }}</span>
              <span class="stat-label">学习时长(h)</span>
            </div>
          </div>
        </div>

        <!-- 学习时间线 -->
        <div class="timeline-progress">
          <h4>学习时间线</h4>
          <div class="timeline-chart" ref="timelineChart"></div>
        </div>
      </div>
    </el-card>

    <!-- 模块进度详情 -->
    <el-card class="modules-progress" shadow="hover">
      <template #header>
        <div class="modules-header">
          <h3>
            <el-icon><Grid /></el-icon>
            模块学习进度
          </h3>
          <div class="filter-controls">
            <el-select v-model="statusFilter" placeholder="筛选状态" size="small">
              <el-option label="全部" value="all" />
              <el-option label="未开始" value="not_started" />
              <el-option label="进行中" value="in_progress" />
              <el-option label="已完成" value="completed" />
            </el-select>
          </div>
        </div>
      </template>

      <div class="modules-list">
        <div 
          v-for="module in filteredModules"
          :key="module.id"
          class="module-progress-item"
          :class="{ 'completed': module.status === 'completed' }"
        >
          <div class="module-info">
            <div class="module-header">
              <div class="module-status-icon">
                <el-icon v-if="module.status === 'completed'" class="completed-icon">
                  <Check />
                </el-icon>
                <el-icon v-else-if="module.status === 'in_progress'" class="progress-icon">
                  <Loading />
                </el-icon>
                <el-icon v-else class="pending-icon">
                  <Clock />
                </el-icon>
              </div>
              <div class="module-title">
                <h4>{{ module.title }}</h4>
                <div class="module-meta">
                  <el-tag size="small" :type="getStatusType(module.status)">
                    {{ getStatusText(module.status) }}
                  </el-tag>
                  <span class="module-duration">{{ module.duration }}小时</span>
                </div>
              </div>
            </div>
            
            <div class="module-progress-bar">
              <el-progress 
                :percentage="module.progress" 
                :color="getProgressColor(module.progress)"
                :show-text="false"
              />
              <span class="progress-text">{{ module.progress }}%</span>
            </div>
          </div>

          <div class="module-actions">
            <el-button 
              v-if="module.status === 'not_started'"
              size="small" 
              type="primary"
              @click="startModule(module)"
            >
              开始学习
            </el-button>
            <el-button 
              v-else-if="module.status === 'in_progress'"
              size="small" 
              type="success"
              @click="continueModule(module)"
            >
              继续学习
            </el-button>
            <el-button 
              v-else
              size="small"
              @click="reviewModule(module)"
            >
              复习回顾
            </el-button>
            
            <el-dropdown @command="handleModuleAction">
              <el-button size="small" type="info">
                更多
                <el-icon><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item :command="`detail_${module.id}`">
                    查看详情
                  </el-dropdown-item>
                  <el-dropdown-item :command="`resources_${module.id}`">
                    学习资源
                  </el-dropdown-item>
                  <el-dropdown-item :command="`notes_${module.id}`">
                    学习笔记
                  </el-dropdown-item>
                  <el-dropdown-item :command="`reset_${module.id}`" divided>
                    重置进度
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 学习统计 -->
    <el-card class="learning-stats" shadow="hover">
      <template #header>
        <h3>
          <el-icon><DataBoard /></el-icon>
          学习统计分析
        </h3>
      </template>

      <el-row :gutter="20">
        <el-col :span="12">
          <div class="stats-chart">
            <h4>每日学习时长</h4>
            <div class="daily-chart" ref="dailyChart"></div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="stats-chart">
            <h4>知识点掌握度</h4>
            <div class="knowledge-chart" ref="knowledgeChart"></div>
          </div>
        </el-col>
      </el-row>

      <div class="achievement-section">
        <h4>学习成就</h4>
        <div class="achievements-grid">
          <div 
            v-for="achievement in achievements"
            :key="achievement.id"
            class="achievement-item"
            :class="{ 'unlocked': achievement.unlocked }"
          >
            <div class="achievement-icon">{{ achievement.icon }}</div>
            <div class="achievement-info">
              <h5>{{ achievement.title }}</h5>
              <p>{{ achievement.description }}</p>
            </div>
            <div class="achievement-status">
              <el-icon v-if="achievement.unlocked" class="unlock-icon">
                <Check />
              </el-icon>
              <el-icon v-else class="lock-icon">
                <Lock />
              </el-icon>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 学习建议 -->
    <el-card class="learning-suggestions" shadow="hover">
      <template #header>
        <h3>
          <el-icon><Star /></el-icon>
          智能学习建议
        </h3>
      </template>

      <div class="suggestions-list">
        <div 
          v-for="suggestion in suggestions"
          :key="suggestion.id"
          class="suggestion-item"
          :class="`suggestion-${suggestion.type}`"
        >
          <div class="suggestion-icon">
            <el-icon><component :is="suggestion.icon" /></el-icon>
          </div>
          <div class="suggestion-content">
            <h4>{{ suggestion.title }}</h4>
            <p>{{ suggestion.description }}</p>
            <div class="suggestion-actions" v-if="suggestion.actions">
              <el-button 
                v-for="action in suggestion.actions"
                :key="action.text"
                size="small"
                :type="action.type"
                @click="handleSuggestionAction(action)"
              >
                {{ action.text }}
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import {
  TrendCharts, Grid, Star, Check, Loading, Clock,
  ArrowDown, Lock, Warning
} from '@element-plus/icons-vue'
import * as echarts from 'echarts'

// Props
const props = defineProps({
  learningPath: {
    type: Object,
    required: true
  },
  userProgress: {
    type: Object,
    default: () => ({})
  }
})

// 响应式数据
const statusFilter = ref('all')
const progressCircle = ref(null)
const timelineChart = ref(null)
const dailyChart = ref(null)
const knowledgeChart = ref(null)

// 模拟学习进度数据
const moduleProgress = ref([
  {
    id: 'module_1',
    title: 'Python编程基础',
    duration: 40,
    status: 'completed',
    progress: 100,
    startDate: '2025-01-01',
    completedDate: '2025-01-15'
  },
  {
    id: 'module_2',
    title: '机器学习入门',
    duration: 60,
    status: 'in_progress',
    progress: 65,
    startDate: '2025-01-16',
    completedDate: null
  },
  {
    id: 'module_3',
    title: 'iFlytek语音技术基础',
    duration: 30,
    status: 'not_started',
    progress: 0,
    startDate: null,
    completedDate: null
  }
])

const achievements = ref([
  {
    id: 'first_module',
    title: '初学者',
    description: '完成第一个学习模块',
    icon: '🎯',
    unlocked: true
  },
  {
    id: 'week_streak',
    title: '坚持一周',
    description: '连续学习7天',
    icon: '🔥',
    unlocked: true
  },
  {
    id: 'half_complete',
    title: '半程马拉松',
    description: '完成50%的学习内容',
    icon: '🏃',
    unlocked: false
  },
  {
    id: 'expert',
    title: '专家级',
    description: '完成所有高级模块',
    icon: '👑',
    unlocked: false
  }
])

const suggestions = ref([
  {
    id: 'daily_practice',
    type: 'tip',
    icon: 'Star',
    title: '保持每日练习',
    description: '建议每天至少学习1小时，保持学习连续性',
    actions: [
      { text: '设置提醒', type: 'primary', action: 'set_reminder' }
    ]
  },
  {
    id: 'weak_area',
    type: 'warning',
    icon: 'Warning',
    title: '重点关注薄弱环节',
    description: '您在"沟通表达"方面还有提升空间，建议多做技术分享练习',
    actions: [
      { text: '查看资源', type: 'success', action: 'view_resources' },
      { text: '加入讨论', type: 'info', action: 'join_discussion' }
    ]
  },
  {
    id: 'next_milestone',
    type: 'info',
    icon: 'Star',
    title: '下一个里程碑',
    description: '距离完成"机器学习入门"模块还需要约15小时',
    actions: [
      { text: '制定计划', type: 'primary', action: 'make_plan' }
    ]
  }
])

// 计算属性
const overallProgress = computed(() => {
  const totalProgress = moduleProgress.value.reduce((sum, module) => sum + module.progress, 0)
  return Math.round(totalProgress / moduleProgress.value.length)
})

const completedModules = computed(() => {
  return moduleProgress.value.filter(module => module.status === 'completed').length
})

const totalModules = computed(() => {
  return moduleProgress.value.length
})

const studyHours = computed(() => {
  return moduleProgress.value
    .filter(module => module.status === 'completed')
    .reduce((sum, module) => sum + module.duration, 0)
})

const filteredModules = computed(() => {
  if (statusFilter.value === 'all') {
    return moduleProgress.value
  }
  return moduleProgress.value.filter(module => module.status === statusFilter.value)
})

// 生命周期
onMounted(() => {
  nextTick(() => {
    renderCharts()
  })
})

// 方法
const getProgressType = (progress) => {
  if (progress >= 80) return 'success'
  if (progress >= 60) return 'warning'
  return 'danger'
}

const getStatusType = (status) => {
  const types = {
    'completed': 'success',
    'in_progress': 'warning',
    'not_started': 'info'
  }
  return types[status] || 'info'
}

const getStatusText = (status) => {
  const texts = {
    'completed': '已完成',
    'in_progress': '进行中',
    'not_started': '未开始'
  }
  return texts[status] || status
}

const getProgressColor = (progress) => {
  if (progress >= 80) return '#67c23a'
  if (progress >= 60) return '#e6a23c'
  return '#f56c6c'
}

const startModule = (module) => {
  module.status = 'in_progress'
  module.startDate = new Date().toISOString().split('T')[0]
  ElMessage.success(`开始学习"${module.title}"`)
}

const continueModule = (module) => {
  ElMessage.info(`继续学习"${module.title}"`)
  // 这里可以跳转到具体的学习页面
}

const reviewModule = (module) => {
  ElMessage.info(`复习"${module.title}"`)
}

const handleModuleAction = (command) => {
  const [action, moduleId] = command.split('_')
  const module = moduleProgress.value.find(m => m.id === moduleId)
  
  switch (action) {
    case 'detail':
      ElMessage.info(`查看"${module.title}"详情`)
      break
    case 'resources':
      ElMessage.info(`查看"${module.title}"学习资源`)
      break
    case 'notes':
      ElMessage.info(`查看"${module.title}"学习笔记`)
      break
    case 'reset':
      module.status = 'not_started'
      module.progress = 0
      ElMessage.warning(`已重置"${module.title}"进度`)
      break
  }
}

const handleSuggestionAction = (action) => {
  switch (action.action) {
    case 'set_reminder':
      ElMessage.success('学习提醒已设置')
      break
    case 'view_resources':
      ElMessage.info('跳转到学习资源页面')
      break
    case 'join_discussion':
      ElMessage.info('跳转到讨论区')
      break
    case 'make_plan':
      ElMessage.info('跳转到学习计划制定页面')
      break
  }
}

const renderCharts = () => {
  // 渲染环形进度图
  if (progressCircle.value) {
    const chart = echarts.init(progressCircle.value)
    const option = {
      series: [{
        type: 'pie',
        radius: ['60%', '80%'],
        center: ['50%', '50%'],
        data: [
          { value: overallProgress.value, name: '已完成' },
          { value: 100 - overallProgress.value, name: '未完成' }
        ],
        label: { show: false },
        emphasis: { disabled: true },
        color: ['#4c51bf', '#e9ecef']
      }]
    }
    chart.setOption(option)
  }

  // 渲染其他图表...
}
</script>

<style scoped>
.learning-progress-tracker {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px;
}

.progress-header,
.modules-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-header h3,
.modules-header h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}

.progress-content {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 30px;
  align-items: start;
}

.circular-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.progress-circle {
  width: 200px;
  height: 200px;
}

.progress-stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #4c51bf;
}

.stat-label {
  font-size: 0.9rem;
  color: #7f8c8d;
}

.timeline-chart {
  height: 200px;
  background: #f8f9fa;
  border-radius: 8px;
}

.modules-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.module-progress-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.module-progress-item:hover {
  border-color: #4c51bf;
  box-shadow: 0 4px 12px rgba(76, 81, 191, 0.1);
}

.module-progress-item.completed {
  background: linear-gradient(135deg, #f8f9fa 0%, #e8f5e8 100%);
  border-color: #67c23a;
}

.module-info {
  flex: 1;
}

.module-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.module-status-icon {
  font-size: 1.5rem;
}

.completed-icon {
  color: #67c23a;
}

.progress-icon {
  color: #e6a23c;
  animation: spin 1s linear infinite;
}

.pending-icon {
  color: #909399;
}

.module-title h4 {
  margin: 0 0 4px 0;
  color: #2c3e50;
}

.module-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.module-duration {
  font-size: 0.9rem;
  color: #7f8c8d;
}

.module-progress-bar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-text {
  font-size: 0.9rem;
  color: #7f8c8d;
  min-width: 40px;
}

.module-actions {
  display: flex;
  gap: 8px;
}

.stats-chart h4 {
  margin-bottom: 16px;
  color: #2c3e50;
}

.daily-chart,
.knowledge-chart {
  height: 200px;
  background: #f8f9fa;
  border-radius: 8px;
}

.achievement-section {
  margin-top: 30px;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.achievement-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.achievement-item.unlocked {
  background: linear-gradient(135deg, #f8f9fa 0%, #e8f4fd 100%);
  border-color: #409eff;
}

.achievement-icon {
  font-size: 2rem;
}

.achievement-info {
  flex: 1;
}

.achievement-info h5 {
  margin: 0 0 4px 0;
  color: #2c3e50;
}

.achievement-info p {
  margin: 0;
  font-size: 0.9rem;
  color: #7f8c8d;
}

.unlock-icon {
  color: #67c23a;
  font-size: 1.2rem;
}

.lock-icon {
  color: #909399;
  font-size: 1.2rem;
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.suggestion-item {
  display: flex;
  gap: 16px;
  padding: 20px;
  border-radius: 12px;
  border-left: 4px solid;
}

.suggestion-tip {
  background: #f0f9ff;
  border-left-color: #409eff;
}

.suggestion-warning {
  background: #fef7e0;
  border-left-color: #e6a23c;
}

.suggestion-info {
  background: #f4f4f5;
  border-left-color: #909399;
}

.suggestion-icon {
  font-size: 1.5rem;
  margin-top: 4px;
}

.suggestion-content h4 {
  margin: 0 0 8px 0;
  color: #2c3e50;
}

.suggestion-content p {
  margin: 0 0 12px 0;
  color: #7f8c8d;
  line-height: 1.6;
}

.suggestion-actions {
  display: flex;
  gap: 8px;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
