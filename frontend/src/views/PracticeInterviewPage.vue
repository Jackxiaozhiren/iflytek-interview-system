<template>
  <div class="practice-interview-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-container">
        <div class="header-content">
          <div class="page-title">
            <el-icon class="title-icon"><VideoCamera /></el-icon>
            <h1>面试练习</h1>
          </div>
          <p class="page-subtitle">通过AI模拟面试，提升您的面试技能和表现</p>
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
        <!-- 面试模式选择 -->
        <div class="interview-modes">
          <div class="section-header">
            <h2>选择面试模式</h2>
            <p>根据您的需求选择合适的面试练习模式</p>
          </div>
          
          <div class="modes-grid">
            <div 
              v-for="mode in interviewModes" 
              :key="mode.id"
              class="mode-card"
              :class="{ active: selectedMode === mode.id }"
              @click="selectMode(mode.id)"
            >
              <div class="mode-icon">
                <el-icon><component :is="mode.icon" /></el-icon>
              </div>
              <div class="mode-content">
                <h3>{{ mode.title }}</h3>
                <p>{{ mode.description }}</p>
                <div class="mode-features">
                  <span v-for="feature in mode.features" :key="feature" class="feature-tag">
                    {{ feature }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 职位选择 -->
        <div class="position-selection" v-if="selectedMode">
          <div class="section-header">
            <h2>选择目标职位</h2>
            <p>选择您要练习的职位类型，AI将为您定制相应的面试问题</p>
          </div>
          
          <div class="positions-grid">
            <div 
              v-for="position in positions" 
              :key="position.id"
              class="position-card"
              :class="{ active: selectedPosition === position.id }"
              @click="selectPosition(position.id)"
            >
              <div class="position-icon">
                <el-icon><component :is="position.icon" /></el-icon>
              </div>
              <div class="position-info">
                <h4>{{ position.title }}</h4>
                <p>{{ position.description }}</p>
                <div class="position-stats">
                  <span>难度: {{ position.difficulty }}</span>
                  <span>题目: {{ position.questionCount }}道</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 开始面试按钮 -->
        <div class="start-section" v-if="selectedMode && selectedPosition">
          <div class="start-card">
            <div class="start-content">
              <h3>准备开始面试练习</h3>
              <p>已选择: {{ getSelectedModeTitle() }} - {{ getSelectedPositionTitle() }}</p>
              <div class="interview-info">
                <div class="info-item">
                  <el-icon><Clock /></el-icon>
                  <span>预计时长: 30-45分钟</span>
                </div>
                <div class="info-item">
                  <el-icon><Document /></el-icon>
                  <span>问题数量: {{ getSelectedPosition()?.questionCount }}道</span>
                </div>
                <div class="info-item">
                  <el-icon><Star /></el-icon>
                  <span>AI实时评估反馈</span>
                </div>
              </div>
            </div>
            <div class="start-actions">
              <el-button size="large" @click="resetSelection">重新选择</el-button>
              <el-button type="primary" size="large" @click="startInterview">
                <el-icon><VideoCamera /></el-icon>
                开始面试
              </el-button>
            </div>
          </div>
        </div>

        <!-- 历史记录 -->
        <div class="history-section">
          <div class="section-header">
            <h2>练习历史</h2>
            <p>查看您的面试练习记录和成长轨迹</p>
          </div>
          
          <div class="history-list">
            <div v-for="record in practiceHistory" :key="record.id" class="history-item">
              <div class="history-info">
                <div class="history-title">{{ record.position }} - {{ record.mode }}</div>
                <div class="history-meta">
                  <span>{{ formatDate(record.date) }}</span>
                  <span>得分: {{ record.score }}分</span>
                  <span>用时: {{ record.duration }}分钟</span>
                </div>
              </div>
              <div class="history-actions">
                <el-button text @click="viewReport(record.id)">查看报告</el-button>
                <el-button text type="primary" @click="retryInterview(record)">重新练习</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  VideoCamera, ArrowLeft, Clock, Document, Star,
  Cpu, Grid, ChatDotRound, User, Microphone, TrendCharts, Service
} from '@element-plus/icons-vue'

const router = useRouter()

// 响应式数据
const selectedMode = ref(null)
const selectedPosition = ref(null)

// 面试模式
const interviewModes = reactive([
  {
    id: 'text',
    title: 'iFlytek Spark 文本面试',
    description: '基于iFlytek Spark大模型的智能文本对话面试，专注于逻辑思维和专业技能评估',
    icon: 'ChatDotRound',
    features: ['AI智能对话', '实时分析', '专业评估', '中文优化']
  }
])

// 职位选择
const positions = reactive([
  {
    id: 'ai-engineer',
    title: 'AI算法工程师',
    description: '人工智能、机器学习、深度学习相关职位',
    icon: 'Cpu',
    difficulty: '高级',
    questionCount: 15
  },
  {
    id: 'frontend-dev',
    title: '前端开发工程师',
    description: 'Web前端、移动端开发相关职位',
    icon: 'TrendCharts',
    difficulty: '中级',
    questionCount: 12
  },
  {
    id: 'backend-dev',
    title: '后端开发工程师',
    description: '服务端开发、系统架构相关职位',
    icon: 'Service',
    difficulty: '中级',
    questionCount: 14
  },
  {
    id: 'product-manager',
    title: '产品经理',
    description: '产品规划、用户体验、项目管理相关职位',
    icon: 'User',
    difficulty: '中级',
    questionCount: 10
  }
])

// 练习历史
const practiceHistory = reactive([
  {
    id: 1,
    position: 'AI算法工程师',
    mode: '语音面试',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    score: 87,
    duration: 42
  },
  {
    id: 2,
    position: '前端开发工程师',
    mode: '文本面试',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    score: 92,
    duration: 35
  },
  {
    id: 3,
    position: '大数据工程师',
    mode: '语音面试',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    score: 85,
    duration: 38
  }
])

// 方法
const selectMode = (modeId) => {
  selectedMode.value = modeId
  selectedPosition.value = null // 重置职位选择
}

const selectPosition = (positionId) => {
  selectedPosition.value = positionId
}

const getSelectedModeTitle = () => {
  return interviewModes.find(mode => mode.id === selectedMode.value)?.title || ''
}

const getSelectedPositionTitle = () => {
  return positions.find(pos => pos.id === selectedPosition.value)?.title || ''
}

const getSelectedPosition = () => {
  return positions.find(pos => pos.id === selectedPosition.value)
}

const resetSelection = () => {
  selectedMode.value = null
  selectedPosition.value = null
}

const startInterview = () => {
  const mode = getSelectedModeTitle()
  const position = getSelectedPositionTitle()

  ElMessage.success(`开始${mode} - ${position}面试练习`)

  // 直接跳转到面试页面
  const sessionId = 'practice_' + Date.now()
  router.push(`/interviewing/${sessionId}`)
}

const formatDate = (date) => {
  return date.toLocaleDateString('zh-CN')
}

const viewReport = (recordId) => {
  router.push(`/interview-result?id=${recordId}`)
}

const retryInterview = (record) => {
  ElMessage.info(`重新开始${record.position}面试练习`)
  // 设置相应的模式和职位，然后开始面试
}
</script>

<style scoped>
.practice-interview-page {
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
  font-size: 16px;
  margin: 0;
}

.modes-grid, .positions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 60px;
}

.mode-card, .position-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.mode-card:hover, .position-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.mode-card.active, .position-card.active {
  border-color: #1890ff;
  box-shadow: 0 4px 20px rgba(24, 144, 255, 0.3);
}

.mode-icon, .position-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #1890ff, #667eea);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.mode-icon .el-icon, .position-icon .el-icon {
  font-size: 24px;
  color: white;
}

.mode-content h3, .position-info h4 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.mode-content p, .position-info p {
  color: #666;
  margin-bottom: 16px;
  line-height: 1.5;
}

.mode-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.feature-tag {
  background: #f0f9ff;
  color: #1890ff;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
}

.position-stats {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #666;
}

.start-section {
  margin-bottom: 60px;
}

.start-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.start-content h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.start-content p {
  color: #666;
  margin-bottom: 16px;
}

.interview-info {
  display: flex;
  gap: 24px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 14px;
}

.start-actions {
  display: flex;
  gap: 16px;
}

.history-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 32px;
}

.history-section .section-header {
  text-align: left;
  margin-bottom: 24px;
}

.history-section .section-header h2 {
  color: #1a1a1a;
}

.history-section .section-header p {
  color: #666;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.history-title {
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.history-meta {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #666;
}

.history-actions {
  display: flex;
  gap: 8px;
}

@media (max-width: 768px) {
  .modes-grid, .positions-grid {
    grid-template-columns: 1fr;
  }
  
  .start-card {
    flex-direction: column;
    gap: 24px;
    text-align: center;
  }
  
  .interview-info {
    flex-direction: column;
    gap: 12px;
  }
  
  .history-item {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
}
</style>
