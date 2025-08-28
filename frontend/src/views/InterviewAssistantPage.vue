<template>
  <div class="interview-assistant-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-container">
        <div class="header-content">
          <div class="page-title">
            <el-icon class="title-icon"><Headset /></el-icon>
            <h1>面试助手</h1>
          </div>
          <p class="page-subtitle">AI实时面试辅助，让您在面试中更加自信</p>
        </div>
        <div class="header-actions">
          <el-button @click="$router.back()">
            <el-icon><ArrowLeft /></el-icon>
            返回
          </el-button>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="page-content">
      <div class="content-container">
        <!-- 助手状态卡片 -->
        <div class="assistant-status">
          <div class="status-card">
            <div class="status-info">
              <div class="status-icon" :class="assistantStatus.type">
                <el-icon><component :is="assistantStatus.icon" /></el-icon>
              </div>
              <div class="status-content">
                <h3>{{ assistantStatus.title }}</h3>
                <p>{{ assistantStatus.description }}</p>
              </div>
            </div>
            <div class="status-actions">
              <el-button 
                v-if="!isAssistantActive" 
                type="primary" 
                size="large" 
                @click="startAssistant"
              >
                启动助手
              </el-button>
              <el-button 
                v-else 
                type="danger" 
                size="large" 
                @click="stopAssistant"
              >
                停止助手
              </el-button>
            </div>
          </div>
        </div>

        <!-- 功能介绍 -->
        <div class="features-section">
          <div class="section-header">
            <h2>AI面试助手功能</h2>
            <p>全方位的智能面试辅助，助您发挥最佳水平</p>
          </div>
          
          <div class="features-grid">
            <div v-for="feature in assistantFeatures" :key="feature.id" class="feature-card">
              <div class="feature-icon">
                <el-icon><component :is="feature.icon" /></el-icon>
              </div>
              <div class="feature-content">
                <h4>{{ feature.title }}</h4>
                <p>{{ feature.description }}</p>
                <div class="feature-status">
                  <el-switch 
                    v-model="feature.enabled" 
                    @change="toggleFeature(feature.id, feature.enabled)"
                  />
                  <span>{{ feature.enabled ? '已启用' : '已禁用' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 实时提示区域 -->
        <div v-if="isAssistantActive" class="realtime-hints">
          <div class="hints-header">
            <h3>实时智能提示</h3>
            <div class="hints-controls">
              <el-button size="small" @click="clearHints">清空提示</el-button>
              <el-button size="small" type="primary" @click="requestHint">获取提示</el-button>
            </div>
          </div>
          
          <div class="hints-content">
            <div v-if="currentHints.length === 0" class="no-hints">
              <el-icon><InfoFilled /></el-icon>
              <p>暂无提示，AI助手正在分析中...</p>
            </div>
            <div v-else class="hints-list">
              <div v-for="hint in currentHints" :key="hint.id" class="hint-item">
                <div class="hint-type" :class="hint.type">
                  <el-icon><component :is="hint.icon" /></el-icon>
                </div>
                <div class="hint-content">
                  <div class="hint-title">{{ hint.title }}</div>
                  <div class="hint-text">{{ hint.content }}</div>
                  <div class="hint-time">{{ formatTime(hint.timestamp) }}</div>
                </div>
                <div class="hint-actions">
                  <el-button text size="small" @click="useHint(hint)">采用</el-button>
                  <el-button text size="small" @click="dismissHint(hint.id)">忽略</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 使用指南 -->
        <div class="guide-section">
          <div class="section-header">
            <h2>使用指南</h2>
            <p>了解如何最有效地使用AI面试助手</p>
          </div>
          
          <div class="guide-steps">
            <div v-for="(step, index) in guideSteps" :key="step.id" class="step-item">
              <div class="step-number">{{ index + 1 }}</div>
              <div class="step-content">
                <h4>{{ step.title }}</h4>
                <p>{{ step.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 统计数据 -->
        <div class="stats-section">
          <div class="section-header">
            <h2>使用统计</h2>
            <p>查看您的面试助手使用情况</p>
          </div>
          
          <div class="stats-grid">
            <div v-for="stat in assistantStats" :key="stat.id" class="stat-card">
              <div class="stat-icon">
                <el-icon><component :is="stat.icon" /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ stat.value }}</div>
                <div class="stat-label">{{ stat.label }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Headset, ArrowLeft, InfoFilled, Check, Close,
  Microphone, ChatDotRound, TrendCharts, Star,
  Timer, Document, Trophy
} from '@element-plus/icons-vue'

const router = useRouter()

// 响应式数据
const isAssistantActive = ref(false)

// 助手状态
const assistantStatus = computed(() => {
  if (isAssistantActive.value) {
    return {
      type: 'active',
      icon: 'Check',
      title: 'AI助手已启动',
      description: '正在为您提供实时面试辅助服务'
    }
  } else {
    return {
      type: 'inactive',
      icon: 'Headset',
      title: 'AI助手待机中',
      description: '点击启动按钮开始使用智能面试辅助'
    }
  }
})

// 助手功能
const assistantFeatures = reactive([
  {
    id: 'speech-hints',
    title: '语音提示',
    description: '基于语音识别提供实时回答建议',
    icon: 'Microphone',
    enabled: true
  },
  {
    id: 'keyword-analysis',
    title: '关键词分析',
    description: '分析面试官问题的关键词，提供相关提示',
    icon: 'Document',
    enabled: true
  },
  {
    id: 'emotion-support',
    title: '情绪支持',
    description: '监测紧张情绪，提供放松建议',
    icon: 'Star',
    enabled: false
  },
  {
    id: 'time-management',
    title: '时间管理',
    description: '提醒回答时长，帮助控制节奏',
    icon: 'Timer',
    enabled: true
  }
])

// 当前提示
const currentHints = reactive([
  {
    id: 1,
    type: 'suggestion',
    icon: 'ChatDotRound',
    title: '回答建议',
    content: '建议从具体项目经验入手，详细说明您在该项目中的角色和贡献',
    timestamp: new Date()
  },
  {
    id: 2,
    type: 'keyword',
    icon: 'Document',
    title: '关键词提醒',
    content: '面试官提到了"团队协作"，您可以结合具体案例来回答',
    timestamp: new Date(Date.now() - 60000)
  }
])

// 使用指南
const guideSteps = reactive([
  {
    id: 1,
    title: '启动助手',
    description: '在面试开始前点击"启动助手"按钮，AI将开始监听和分析'
  },
  {
    id: 2,
    title: '配置功能',
    description: '根据需要开启或关闭不同的辅助功能，如语音提示、关键词分析等'
  },
  {
    id: 3,
    title: '查看提示',
    description: '面试过程中查看右侧的实时提示，获取AI的智能建议'
  },
  {
    id: 4,
    title: '采用建议',
    description: '点击"采用"按钮使用AI建议，或点击"忽略"跳过不需要的提示'
  }
])

// 统计数据
const assistantStats = reactive([
  {
    id: 'total-sessions',
    icon: 'Trophy',
    value: '12',
    label: '总使用次数'
  },
  {
    id: 'success-rate',
    icon: 'TrendCharts',
    value: '89%',
    label: '辅助成功率'
  },
  {
    id: 'avg-hints',
    icon: 'ChatDotRound',
    value: '8.5',
    label: '平均提示数'
  },
  {
    id: 'time-saved',
    icon: 'Timer',
    value: '15min',
    label: '节省思考时间'
  }
])

// 方法
const startAssistant = () => {
  isAssistantActive.value = true
  ElMessage.success('AI面试助手已启动，开始为您提供实时辅助')
}

const stopAssistant = () => {
  isAssistantActive.value = false
  ElMessage.info('AI面试助手已停止')
}

const toggleFeature = (featureId, enabled) => {
  const feature = assistantFeatures.find(f => f.id === featureId)
  if (feature) {
    ElMessage.success(`${feature.title}已${enabled ? '启用' : '禁用'}`)
  }
}

const clearHints = () => {
  currentHints.splice(0)
  ElMessage.info('已清空所有提示')
}

const requestHint = () => {
  const newHint = {
    id: Date.now(),
    type: 'suggestion',
    icon: 'ChatDotRound',
    title: 'AI建议',
    content: '建议您保持自信，用具体数据来支撑您的观点',
    timestamp: new Date()
  }
  currentHints.unshift(newHint)
  ElMessage.success('已生成新的AI提示')
}

const useHint = (hint) => {
  ElMessage.success(`已采用提示: ${hint.title}`)
  dismissHint(hint.id)
}

const dismissHint = (hintId) => {
  const index = currentHints.findIndex(h => h.id === hintId)
  if (index > -1) {
    currentHints.splice(index, 1)
  }
}

const formatTime = (timestamp) => {
  return timestamp.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}
</script>

<style scoped>
.interview-assistant-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.page-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 20px 0;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.title-icon {
  font-size: 28px;
  color: #1890ff;
}

.page-title h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
}

.page-subtitle {
  margin: 0;
  color: #666;
  font-size: 16px;
}

.page-content {
  padding: 40px 0;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.assistant-status {
  margin-bottom: 40px;
}

.status-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.status-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.status-icon.active {
  background: #52c41a;
  color: white;
}

.status-icon.inactive {
  background: #d9d9d9;
  color: #666;
}

.status-content h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.status-content p {
  color: #666;
  margin: 0;
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
}

.section-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: white;
  margin-bottom: 8px;
}

.section-header p {
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 60px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 24px;
}

.feature-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #1890ff, #667eea);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.feature-icon .el-icon {
  font-size: 24px;
  color: white;
}

.feature-content h4 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.feature-content p {
  color: #666;
  margin-bottom: 16px;
  line-height: 1.5;
}

.feature-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.realtime-hints {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 40px;
}

.hints-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.hints-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.hints-controls {
  display: flex;
  gap: 8px;
}

.no-hints {
  text-align: center;
  padding: 40px;
  color: #999;
}

.no-hints .el-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.hints-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hint-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.hint-type {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.hint-type.suggestion {
  background: #1890ff;
  color: white;
}

.hint-type.keyword {
  background: #52c41a;
  color: white;
}

.hint-content {
  flex: 1;
}

.hint-title {
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.hint-text {
  color: #666;
  margin-bottom: 8px;
  line-height: 1.4;
}

.hint-time {
  font-size: 12px;
  color: #999;
}

.hint-actions {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.guide-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 60px;
}

.step-item {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  gap: 16px;
}

.step-number {
  width: 32px;
  height: 32px;
  background: #1890ff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
}

.step-content h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.step-content p {
  color: #666;
  margin: 0;
  line-height: 1.5;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
}

.stat-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #1890ff, #667eea);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.stat-icon .el-icon {
  font-size: 24px;
  color: white;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.stat-label {
  color: #666;
  font-size: 14px;
}

@media (max-width: 768px) {
  .status-card {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .hints-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .hint-item {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
