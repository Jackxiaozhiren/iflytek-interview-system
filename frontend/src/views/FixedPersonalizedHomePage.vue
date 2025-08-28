<template>
  <div class="personalized-home">
    <!-- 顶部状态栏配置功能 -->
    <div class="top-status-bar">
      <el-card class="status-config-card">
        <div class="status-config-content">
          <div class="user-greeting">
            <div class="greeting-text">
              <h2>下午好，{{ currentUser.name }}！您已完成60%的面试，即将进入最后阶段！</h2>
              <div class="progress-info">
                <span>面试进度</span>
                <el-progress :percentage="60" :stroke-width="8" class="progress-bar" />
                <span class="progress-text">60%</span>
              </div>
            </div>
            <div class="user-avatar">
              <el-avatar :size="60" :src="currentUser.avatar">
                <el-icon><User /></el-icon>
              </el-avatar>
              <el-tag :type="currentUser.level === '高级' ? 'success' : 'primary'" class="level-tag">
                {{ currentUser.level }}
              </el-tag>
            </div>
          </div>
          
          <!-- 配置选择器 -->
          <div class="config-selectors">
            <div class="selector-group">
              <label>候选人等级：</label>
              <el-select v-model="selectedLevel" @change="onLevelChange" placeholder="选择等级">
                <el-option label="初级" value="junior" />
                <el-option label="中级" value="intermediate" />
                <el-option label="高级" value="senior" />
                <el-option label="专家级" value="expert" />
              </el-select>
            </div>
            <div class="selector-group">
              <label>面试岗位：</label>
              <el-select v-model="selectedPosition" @change="onPositionChange" placeholder="选择岗位">
                <el-option label="AI工程师" value="ai" />
                <el-option label="大数据工程师" value="bigdata" />
                <el-option label="物联网工程师" value="iot" />
                <el-option label="全栈工程师" value="fullstack" />
                <el-option label="DevOps工程师" value="devops" />
              </el-select>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 职位管理中心 - AI助手功能 -->
    <div class="position-management-center">
      <el-card class="ai-assistant-card">
        <template #header>
          <div class="card-header">
            <div class="header-content">
              <el-icon class="header-icon"><Cpu /></el-icon>
              <div class="header-text">
                <h3>iFlytek星火大模型</h3>
                <p>智能招聘管理助手，为您提供专业的职位管理建议</p>
              </div>
            </div>
            <el-button type="primary" @click="refreshAIServices" :loading="refreshing">
              <el-icon><Refresh /></el-icon>
              刷新服务
            </el-button>
          </div>
        </template>
        
        <div class="ai-assistant-grid">
          <div 
            class="assistant-card" 
            v-for="assistant in aiAssistants" 
            :key="assistant.id"
            @click="handleAssistantClick(assistant)"
            :class="{ 'loading': assistant.loading }"
          >
            <div class="assistant-icon">
              <el-icon :size="32">
                <component :is="assistant.icon" />
              </el-icon>
            </div>
            <div class="assistant-content">
              <h4 class="assistant-title">{{ assistant.title }}</h4>
              <p class="assistant-desc">{{ assistant.description }}</p>
            </div>
            <div class="assistant-status" v-if="assistant.loading">
              <el-icon class="is-loading"><Loading /></el-icon>
            </div>
          </div>
        </div>
        
        <!-- AI分析结果显示区域 -->
        <div v-if="aiAnalysisResult" class="ai-analysis-result">
          <div class="analysis-header">
            <el-icon><Star /></el-icon>
            <span>AI分析结果</span>
          </div>
          <div class="analysis-content">
            <div class="analysis-summary">
              <h4>{{ aiAnalysisResult.summary }}</h4>
            </div>
            <div class="analysis-insights">
              <h5>核心洞察</h5>
              <ul>
                <li v-for="insight in aiAnalysisResult.insights" :key="insight">{{ insight }}</li>
              </ul>
            </div>
            <div class="analysis-recommendations" v-if="aiAnalysisResult.recommendations">
              <h5>智能推荐</h5>
              <div class="recommendation-list">
                <el-tag 
                  v-for="rec in aiAnalysisResult.recommendations" 
                  :key="rec.id"
                  :type="rec.type"
                  class="recommendation-tag"
                  @click="handleRecommendationClick(rec)"
                >
                  {{ rec.text }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 快速操作模块 -->
    <div class="quick-operations-section">
      <h3 class="section-title">
        <el-icon><Operation /></el-icon>
        快速操作
      </h3>
      <div class="quick-operations-grid">
        <div class="operation-card ai-assistant" @click="openAIAssistant">
          <div class="operation-icon">
            <el-icon><Cpu /></el-icon>
          </div>
          <div class="operation-content">
            <h4>AI助手</h4>
            <p>招聘效率优化</p>
          </div>
        </div>
        
        <div class="operation-card practice-mode" @click="startPracticeMode">
          <div class="operation-icon">
            <el-icon><Monitor /></el-icon>
          </div>
          <div class="operation-content">
            <h4>模拟练习</h4>
            <p>无评分的面试体验</p>
          </div>
        </div>
        
        <div class="operation-card get-feedback" @click="getFeedback">
          <div class="operation-icon">
            <el-icon><ChatDotRound /></el-icon>
          </div>
          <div class="operation-content">
            <h4>获取反馈</h4>
            <p>查看详细分析报告</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部快速入口功能完善 -->
    <div class="quick-entry-section enhanced-quick-entry">
      <h3 class="section-title">
        <el-icon><Grid /></el-icon>
        快速入口
      </h3>
      <div class="quick-entries-grid">
        <div class="entry-card interview-entry" @click="goToInterview">
          <div class="entry-background"></div>
          <div class="entry-content">
            <div class="entry-icon">
              <el-icon :size="32"><VideoPlay /></el-icon>
            </div>
            <div class="entry-info">
              <div class="entry-title">智能面试</div>
              <div class="entry-desc">开始您的AI智能面试体验</div>
            </div>
          </div>
        </div>

        <div class="entry-card reports-entry" @click="goToReports">
          <div class="entry-background"></div>
          <div class="entry-content">
            <div class="entry-icon">
              <el-icon :size="32"><Document /></el-icon>
            </div>
            <div class="entry-info">
              <div class="entry-title">面试报告</div>
              <div class="entry-desc">查看详细的面试分析报告</div>
            </div>
          </div>
        </div>

        <div class="entry-card skills-entry" @click="goToSkillAnalysis">
          <div class="entry-background"></div>
          <div class="entry-content">
            <div class="entry-icon">
              <el-icon :size="32"><TrendCharts /></el-icon>
            </div>
            <div class="entry-info">
              <div class="entry-title">技能分析</div>
              <div class="entry-desc">查看六维能力雷达图和评估</div>
            </div>
          </div>
        </div>

        <div class="entry-card settings-entry" @click="goToPersonalSettings">
          <div class="entry-background"></div>
          <div class="entry-content">
            <div class="entry-icon">
              <el-icon :size="32"><Setting /></el-icon>
            </div>
            <div class="entry-info">
              <div class="entry-title">个人设置</div>
              <div class="entry-desc">管理个人信息和面试偏好</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElNotification, ElMessageBox } from 'element-plus'
import { useIntervieweeStore } from '@/stores/intervieweeStore.js'
import enhancedIflytekSparkService from '@/services/enhancedIflytekSparkService.js'
import {
  VideoPlay, Document, Grid, Setting, Operation,
  TrendCharts, User, Cpu, Refresh, Loading,
  Monitor, ChatDotRound, Star
} from '@element-plus/icons-vue'

const router = useRouter()
const interviewee = useIntervieweeStore()

// 响应式数据
const selectedLevel = ref('senior')
const selectedPosition = ref('ai')
const refreshing = ref(false)
const aiAnalysisResult = ref(null)

// 当前用户信息
const currentUser = ref({
  name: '张三',
  level: '高级',
  avatar: '/images/default-avatar.png'
})

// AI助手配置
const aiAssistants = ref([
  {
    id: 'position-trends',
    title: '职位趋势分析',
    description: '分析当前职位市场趋势和技能需求',
    icon: 'TrendCharts',
    loading: false,
    method: 'generatePositionTrendsInsights'
  },
  {
    id: 'recruitment-optimization',
    title: '招聘效率优化',
    description: '基于数据分析提供招聘流程优化建议',
    icon: 'Setting',
    loading: false,
    method: 'generateRecruitmentOptimizationInsights'
  },
  {
    id: 'candidate-matching',
    title: '候选人匹配',
    description: '智能匹配最适合的候选人和职位',
    icon: 'User',
    loading: false,
    method: 'generateCandidateMatchingInsights'
  },
  {
    id: 'market-insights',
    title: '市场洞察',
    description: '获取行业薪资水平和竞争态势分析',
    icon: 'Document',
    loading: false,
    method: 'generateMarketInsights'
  }
])

// 方法实现
const onLevelChange = (level) => {
  console.log('候选人等级变更:', level)
  ElMessage.success(`已切换到${getLevelLabel(level)}模式`)
  updateGlobalParameters()
}

const onPositionChange = (position) => {
  console.log('面试岗位变更:', position)
  ElMessage.success(`已切换到${getPositionLabel(position)}岗位`)
  updateGlobalParameters()
}

const updateGlobalParameters = () => {
  const params = {
    level: selectedLevel.value,
    position: selectedPosition.value,
    difficulty: getDifficultyByLevel(selectedLevel.value),
    evaluationCriteria: getEvaluationCriteria(selectedPosition.value)
  }
  interviewee.updateInterviewConfig(params)
  console.log('全局参数已更新:', params)
}

const handleAssistantClick = async (assistant) => {
  console.log('点击AI助手:', assistant.title)
  assistant.loading = true
  aiAnalysisResult.value = null
  
  try {
    const analysisRequest = {
      type: assistant.id.replace('-', '_'),
      dataScope: 'position_management',
      currentFilters: { level: selectedLevel.value, position: selectedPosition.value },
      positionData: generateMockPositionData()
    }
    
    const result = await enhancedIflytekSparkService.getFallbackDataInsights(analysisRequest)
    aiAnalysisResult.value = result
    
    ElNotification.success({
      title: 'AI分析完成',
      message: `${assistant.title}分析已完成`,
      duration: 3000
    })
  } catch (error) {
    console.error('AI助手分析失败:', error)
    ElMessage.error('AI分析失败，请稍后重试')
  } finally {
    assistant.loading = false
  }
}

const refreshAIServices = async () => {
  refreshing.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    aiAnalysisResult.value = null
    ElMessage.success('AI服务已刷新')
  } catch (error) {
    ElMessage.error('刷新失败')
  } finally {
    refreshing.value = false
  }
}

const handleRecommendationClick = (recommendation) => {
  console.log('点击推荐:', recommendation)
  ElMessage.info(`正在执行: ${recommendation.text}`)
}

const openAIAssistant = () => {
  console.log('打开AI助手')
  ElMessageBox.confirm(
    'AI助手将为您提供招聘效率优化建议，包括面试流程优化、候选人筛选策略、评估标准制定等功能。',
    'AI助手 - 招聘效率优化',
    {
      confirmButtonText: '立即体验',
      cancelButtonText: '稍后使用',
      type: 'info'
    }
  ).then(() => {
    // 跳转到AI助手页面
    router.push('/ai-recruitment-assistant')
  }).catch(() => {
    ElMessage.info('您可以随时通过快速操作访问AI助手')
  })
}

const startPracticeMode = () => {
  router.push('/practice-interview')
}

const getFeedback = () => {
  router.push('/reports')
}

const goToInterview = () => {
  router.push('/interview-selection')
}

const goToReports = () => {
  router.push('/reports')
}

const goToSkillAnalysis = () => {
  router.push('/skill-assessment')
}

const goToPersonalSettings = () => {
  router.push('/personal-settings')
}

// 工具函数
const getLevelLabel = (level) => {
  const labels = { junior: '初级', intermediate: '中级', senior: '高级', expert: '专家级' }
  return labels[level] || level
}

const getPositionLabel = (position) => {
  const labels = { ai: 'AI工程师', bigdata: '大数据工程师', iot: '物联网工程师', fullstack: '全栈工程师', devops: 'DevOps工程师' }
  return labels[position] || position
}

const getDifficultyByLevel = (level) => {
  const mapping = { junior: 'beginner', intermediate: 'intermediate', senior: 'advanced', expert: 'expert' }
  return mapping[level] || 'intermediate'
}

const getEvaluationCriteria = (position) => {
  return {
    ai: ['算法理解', '模型设计', '数据处理', '创新思维'],
    bigdata: ['架构设计', '数据处理', '性能优化', '业务理解'],
    iot: ['系统设计', '硬件理解', '协议掌握', '安全意识'],
    fullstack: ['前端技能', '后端技能', '系统设计', '项目经验'],
    devops: ['自动化', '监控', '容器化', '云原生']
  }[position] || []
}

const generateMockPositionData = () => {
  return [
    { id: 1, domain: selectedPosition.value, status: 'active', urgent: false },
    { id: 2, domain: selectedPosition.value, status: 'active', urgent: true }
  ]
}

onMounted(() => {
  updateGlobalParameters()
  interviewee.updateRealtimeState({
    lastInteraction: new Date(),
    currentActivity: 'browsing_dashboard'
  })
})
</script>

<style scoped>
.personalized-home {
  background: #f5f7fa;
  min-height: 100vh;
  padding: 24px;
}

.top-status-bar {
  margin-bottom: 24px;
}

.status-config-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
}

.status-config-content {
  padding: 24px;
}

.user-greeting {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.greeting-text h2 {
  margin: 0 0 16px 0;
  color: white;
  font-size: 24px;
}

.progress-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  width: 200px;
}

.progress-text {
  font-weight: bold;
  font-size: 18px;
}

.user-avatar {
  position: relative;
  text-align: center;
}

.level-tag {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
}

.config-selectors {
  display: flex;
  gap: 24px;
  flex-wrap: wrap; /* 响应式换行 */
}

.selector-group {
  display: flex;
  align-items: center;
  gap: 12px; /* 增加间距 */
  min-width: 200px; /* 确保最小宽度 */
}

.selector-group label {
  color: white;
  font-weight: 500;
  min-width: 90px; /* 增加标签宽度 */
  font-size: 14px;
  white-space: nowrap; /* 防止标签文字换行 */
}

/* 选择框样式优化 */
.selector-group .el-select {
  min-width: 140px; /* 设置选择框最小宽度 */
  width: 140px; /* 固定宽度确保中文显示完整 */
}

.selector-group .el-select .el-input__wrapper {
  height: 36px; /* 增加高度 */
  padding: 0 12px; /* 增加内边距 */
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.selector-group .el-select .el-input__wrapper:hover {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.selector-group .el-select .el-input__wrapper.is-focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.selector-group .el-select .el-input__inner {
  height: 34px;
  line-height: 34px;
  font-size: 14px;
  font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
  color: #333;
  text-align: left;
  padding: 0;
}

.selector-group .el-select .el-input__suffix {
  height: 34px;
  line-height: 34px;
}

.selector-group .el-select .el-select__caret {
  color: #666;
  font-size: 14px;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .config-selectors {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .selector-group {
    min-width: auto;
    width: 100%;
    max-width: 300px;
  }

  .selector-group .el-select {
    width: 120px;
    min-width: 120px;
  }

  .selector-group label {
    min-width: 80px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .config-selectors {
    gap: 12px;
  }

  .selector-group {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .selector-group label {
    min-width: auto;
    font-size: 12px;
  }

  .selector-group .el-select {
    width: 100px;
    min-width: 100px;
  }
}

.position-management-center {
  margin-bottom: 24px;
}

.ai-assistant-card {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  color: #1890ff;
  font-size: 24px;
}

.header-text h3 {
  margin: 0 0 4px 0;
  color: #1890ff;
}

.header-text p {
  margin: 0;
  color: #666;
}

.ai-assistant-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.assistant-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border: 2px solid #e8e8e8;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.assistant-card:hover {
  border-color: #1890ff;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);
  transform: translateY(-2px);
}

.assistant-card.loading {
  opacity: 0.7;
  cursor: not-allowed;
}

.assistant-icon {
  color: #1890ff;
  background: rgba(24, 144, 255, 0.1);
  padding: 12px;
  border-radius: 50%;
}

.assistant-content {
  flex: 1;
}

.assistant-title {
  margin: 0 0 4px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.assistant-desc {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.assistant-status {
  color: #1890ff;
}

.ai-analysis-result {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  border-left: 4px solid #1890ff;
}

.analysis-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  color: #1890ff;
  font-weight: 600;
}

.analysis-summary h4 {
  margin: 0 0 12px 0;
  color: #333;
}

.analysis-insights h5 {
  margin: 16px 0 8px 0;
  color: #333;
}

.analysis-insights ul {
  margin: 0;
  padding-left: 20px;
}

.analysis-insights li {
  margin-bottom: 4px;
  color: #666;
}

.analysis-recommendations h5 {
  margin: 16px 0 8px 0;
  color: #333;
}

.recommendation-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.recommendation-tag {
  cursor: pointer;
  transition: all 0.2s ease;
}

.recommendation-tag:hover {
  transform: scale(1.05);
}

.quick-operations-section {
  margin-bottom: 24px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.quick-operations-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.operation-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  font-weight: 500;
}

.operation-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.ai-assistant {
  background: linear-gradient(135deg, #722ed1, #9254de);
}

.practice-mode {
  background: linear-gradient(135deg, #52c41a, #73d13d);
}

.get-feedback {
  background: linear-gradient(135deg, #fa8c16, #ffa940);
}

.operation-icon {
  font-size: 24px;
}

.operation-content h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
}

.operation-content p {
  margin: 0;
  opacity: 0.9;
  font-size: 14px;
}

.enhanced-quick-entry {
  margin-bottom: 24px;
}

.quick-entries-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.entry-card {
  position: relative;
  height: 120px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.entry-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.entry-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.9;
}

.interview-entry .entry-background {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.reports-entry .entry-background {
  background: linear-gradient(135deg, #f093fb, #f5576c);
}

.skills-entry .entry-background {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
}

.settings-entry .entry-background {
  background: linear-gradient(135deg, #43e97b, #38f9d7);
}

.entry-content {
  position: relative;
  z-index: 1;
  padding: 20px;
  color: white;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.entry-icon {
  margin-bottom: 8px;
}

.entry-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.entry-desc {
  font-size: 12px;
  opacity: 0.9;
}
</style>
