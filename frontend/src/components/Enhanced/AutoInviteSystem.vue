<template>
  <div class="auto-invite-system enhanced-chart" :class="getSystemThemeClass()">
    <!-- 系统头部 -->
    <div class="system-header">
      <h2 class="system-title">
        <div class="chart-icon">
          <el-icon><ChatDotRound /></el-icon>
        </div>
        智能邀约系统
      </h2>
      <p class="system-subtitle">基于iFlytek Spark的AI自动筛选与邀约</p>
    </div>

    <!-- 邀约流程展示 -->
    <div class="invite-process">
      <div class="process-steps">
        <div 
          v-for="(step, index) in inviteSteps" 
          :key="step.id"
          class="process-step"
          :class="[step.theme, { 'active': currentStep >= index + 1, 'completed': currentStep > index + 1 }]"
          v-motion-slide-visible-once-right
          :delay="index * 200"
        >
          <div class="step-icon multimodal-icon" :class="step.iconClass">
            <el-icon><component :is="step.icon" /></el-icon>
          </div>
          <div class="step-content">
            <h4>{{ step.title }}</h4>
            <p>{{ step.description }}</p>
            <div class="step-stats">
              <span class="stat-item">
                <el-icon><User /></el-icon>
                {{ step.candidateCount }}人
              </span>
              <span class="stat-item">
                <el-icon><Timer /></el-icon>
                {{ step.avgTime }}
              </span>
            </div>
          </div>
          <div class="step-arrow" v-if="index < inviteSteps.length - 1">
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>
      </div>
    </div>

    <!-- 智能筛选配置 -->
    <div class="screening-config">
      <h3>
        <el-icon><Setting /></el-icon>
        智能筛选配置
      </h3>
      <div class="config-grid grid grid-cols-2 grid-gap-lg">
        <div class="config-card">
          <h4>岗位匹配模型</h4>
          <div class="model-selector">
            <el-select v-model="selectedModel" placeholder="选择匹配模型">
              <el-option
                v-for="model in matchingModels"
                :key="model.value"
                :label="model.label"
                :value="model.value"
              />
            </el-select>
          </div>
          <div class="model-accuracy">
            <span>匹配准确率：</span>
            <el-progress 
              :percentage="getCurrentModelAccuracy()" 
              :color="getAccuracyColor(getCurrentModelAccuracy())"
              :show-text="true"
            />
          </div>
        </div>

        <div class="config-card">
          <h4>筛选条件设置</h4>
          <div class="criteria-list">
            <div 
              v-for="criteria in screeningCriteria" 
              :key="criteria.id"
              class="criteria-item"
            >
              <el-checkbox v-model="criteria.enabled">{{ criteria.name }}</el-checkbox>
              <el-slider 
                v-if="criteria.enabled"
                v-model="criteria.weight"
                :min="0"
                :max="100"
                :show-tooltip="true"
                class="criteria-weight"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 邀约模板管理 -->
    <div class="invite-templates">
      <h3>
        <el-icon><Document /></el-icon>
        邀约模板管理
      </h3>
      <div class="templates-grid grid grid-auto-fit-md grid-gap-lg">
        <div 
          v-for="template in inviteTemplates"
          :key="template.id"
          class="template-card"
          :class="template.theme"
          @click="selectTemplate(template)"
        >
          <div class="template-header">
            <h4>{{ template.name }}</h4>
            <el-tag :type="template.status === 'active' ? 'success' : 'info'">
              {{ template.status === 'active' ? '使用中' : '草稿' }}
            </el-tag>
          </div>
          <div class="template-preview">
            <p>{{ template.preview }}</p>
          </div>
          <div class="template-stats">
            <span>发送率：{{ template.sendRate }}%</span>
            <span>回复率：{{ template.replyRate }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 实时监控面板 -->
    <div class="monitoring-panel">
      <h3>
        <el-icon><TrendCharts /></el-icon>
        实时邀约监控
      </h3>
      <div class="monitoring-metrics data-metrics">
        <div class="metric-item">
          <div class="metric-value">{{ realTimeStats.totalInvites }}</div>
          <div class="metric-label">今日邀约</div>
          <div class="metric-change up">
            <el-icon><ArrowUp /></el-icon>
            +{{ realTimeStats.inviteGrowth }}%
          </div>
        </div>
        <div class="metric-item">
          <div class="metric-value">{{ realTimeStats.responseRate }}%</div>
          <div class="metric-label">回复率</div>
          <div class="metric-change" :class="realTimeStats.responseGrowth > 0 ? 'up' : 'down'">
            <el-icon><component :is="realTimeStats.responseGrowth > 0 ? ArrowUp : ArrowDown" /></el-icon>
            {{ Math.abs(realTimeStats.responseGrowth) }}%
          </div>
        </div>
        <div class="metric-item">
          <div class="metric-value">{{ realTimeStats.completionRate }}%</div>
          <div class="metric-label">完成率</div>
          <div class="metric-change up">
            <el-icon><ArrowUp /></el-icon>
            +{{ realTimeStats.completionGrowth }}%
          </div>
        </div>
        <div class="metric-item">
          <div class="metric-value">{{ realTimeStats.avgScore }}</div>
          <div class="metric-label">平均得分</div>
          <div class="metric-change up">
            <el-icon><ArrowUp /></el-icon>
            +{{ realTimeStats.scoreGrowth }}
          </div>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <el-button type="primary" size="large" @click="startAutoInvite" :loading="isProcessing">
        <el-icon><VideoPlay /></el-icon>
        启动自动邀约
      </el-button>
      <el-button size="large" @click="viewDetailedReport">
        <el-icon><DataBoard /></el-icon>
        查看详细报告
      </el-button>
      <el-button size="large" @click="configureSettings">
        <el-icon><Setting /></el-icon>
        高级设置
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  Message, User, Timer, ArrowRight, Setting, Document, TrendCharts, VideoPlay, Grid, ArrowUp, ArrowDown, Cpu, Connection, Star
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 响应式数据
const currentStep = ref(1)
const selectedModel = ref('ai-advanced')
const isProcessing = ref(false)

// 邀约流程步骤
const inviteSteps = ref([
  {
    id: 1,
    title: 'AI智能筛选',
    description: '基于iFlytek Spark分析简历匹配度',
    icon: 'Cpu',
    iconClass: 'ai-icon pulse',
    theme: 'ai-theme',
    candidateCount: 1250,
    avgTime: '2分钟'
  },
  {
    id: 2,
    title: '自动邀约发送',
    description: '个性化邀约消息智能生成',
    icon: 'Message',
    iconClass: 'text-icon flowing',
    theme: 'bigdata-theme',
    candidateCount: 856,
    avgTime: '30秒'
  },
  {
    id: 3,
    title: '候选人响应',
    description: '实时跟踪回复状态',
    icon: 'User',
    iconClass: 'iot-icon',
    theme: 'iot-theme',
    candidateCount: 642,
    avgTime: '4小时'
  },
  {
    id: 4,
    title: '面试安排',
    description: '自动安排面试时间',
    icon: 'Timer',
    iconClass: 'assessment-icon analyzing',
    theme: 'interview-theme',
    candidateCount: 485,
    avgTime: '1天'
  }
])

// 匹配模型
const matchingModels = ref([
  { label: 'AI高级模型 (推荐)', value: 'ai-advanced' },
  { label: '大数据分析模型', value: 'bigdata-model' },
  { label: 'IoT专业模型', value: 'iot-model' },
  { label: '综合评估模型', value: 'comprehensive-model' }
])

// 筛选条件
const screeningCriteria = ref([
  { id: 1, name: '学历匹配', enabled: true, weight: 85 },
  { id: 2, name: '工作经验', enabled: true, weight: 90 },
  { id: 3, name: '技能匹配', enabled: true, weight: 95 },
  { id: 4, name: '地理位置', enabled: false, weight: 60 },
  { id: 5, name: '薪资期望', enabled: true, weight: 70 }
])

// 邀约模板
const inviteTemplates = ref([
  {
    id: 1,
    name: 'AI技术岗位模板',
    theme: 'ai-theme',
    status: 'active',
    preview: '您好！我们对您的AI技术背景很感兴趣...',
    sendRate: 95,
    replyRate: 68
  },
  {
    id: 2,
    name: '大数据工程师模板',
    theme: 'bigdata-theme',
    status: 'draft',
    preview: '您在大数据领域的经验令人印象深刻...',
    sendRate: 88,
    replyRate: 72
  },
  {
    id: 3,
    name: 'IoT开发者模板',
    theme: 'iot-theme',
    status: 'active',
    preview: '我们正在寻找IoT领域的专业人才...',
    sendRate: 92,
    replyRate: 65
  }
])

// 实时统计数据
const realTimeStats = ref({
  totalInvites: 1247,
  inviteGrowth: 15.2,
  responseRate: 68.5,
  responseGrowth: 3.8,
  completionRate: 85.2,
  completionGrowth: 7.1,
  avgScore: 8.6,
  scoreGrowth: 0.3
})

// 计算属性
const getCurrentModelAccuracy = () => {
  const accuracyMap = {
    'ai-advanced': 95,
    'bigdata-model': 88,
    'iot-model': 82,
    'comprehensive-model': 90
  }
  return accuracyMap[selectedModel.value] || 85
}

const getAccuracyColor = (accuracy) => {
  if (accuracy >= 90) return '#10b981'
  if (accuracy >= 80) return '#f59e0b'
  return '#ef4444'
}

const getSystemThemeClass = () => {
  return 'chart-ai-theme'
}

// 方法
const selectTemplate = (template) => {
  ElMessage.success(`已选择模板：${template.name}`)
}

const startAutoInvite = () => {
  isProcessing.value = true
  ElMessage.success('正在启动自动邀约系统...')
  
  setTimeout(() => {
    isProcessing.value = false
    currentStep.value = 4
    ElMessage.success('自动邀约系统启动成功！')
  }, 2000)
}

const viewDetailedReport = () => {
  ElMessage.info('正在生成详细报告...')
}

const configureSettings = () => {
  ElMessage.info('打开高级设置面板...')
}

// 生命周期
onMounted(() => {
  // 模拟步骤进度
  const timer = setInterval(() => {
    if (currentStep.value < inviteSteps.value.length) {
      currentStep.value++
    } else {
      clearInterval(timer)
    }
  }, 3000)
})
</script>

<style scoped>
.auto-invite-system {
  padding: 2rem;
  margin: 2rem 0;
}

.system-header {
  text-align: center;
  margin-bottom: 3rem;
}

.system-title {
  font-size: 2rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.system-subtitle {
  color: #64748b;
  font-size: 1.1rem;
}

.invite-process {
  margin-bottom: 3rem;
}

.process-steps {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.process-step {
  flex: 1;
  min-width: 200px;
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
  border: 2px solid transparent;
}

.process-step.active {
  border-color: var(--theme-primary);
  transform: translateY(-5px);
  box-shadow: 0 8px 25px var(--theme-shadow);
}

.process-step.completed {
  background: var(--theme-light);
}

.step-content h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 1rem 0 0.5rem;
}

.step-content p {
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.step-stats {
  display: flex;
  gap: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  color: #64748b;
}

.step-arrow {
  position: absolute;
  right: -15px;
  top: 50%;
  transform: translateY(-50%);
  color: #cbd5e0;
  font-size: 1.2rem;
}

.screening-config,
.invite-templates,
.monitoring-panel {
  margin-bottom: 2rem;
}

.screening-config h3,
.invite-templates h3,
.monitoring-panel h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.config-card,
.template-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.config-card:hover,
.template-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.template-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.template-preview {
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.template-stats {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #64748b;
}

.criteria-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.criteria-weight {
  flex: 1;
}

.model-accuracy {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.metric-change.up {
  color: #10b981;
}

.metric-change.down {
  color: #ef4444;
}

@media (max-width: 768px) {
  .process-steps {
    flex-direction: column;
  }
  
  .step-arrow {
    display: none;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>
