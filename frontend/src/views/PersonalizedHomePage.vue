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
        <div
          class="operation-card ai-assistant"
          @click="openAIAssistant"
        >
          <div class="operation-icon">
            <el-icon><Cpu /></el-icon>
          </div>
          <div class="operation-content">
            <h4>AI助手</h4>
            <p>招聘效率优化</p>
          </div>
        </div>

        <div
          class="operation-card practice-mode"
          @click="startPracticeMode"
        >
          <div class="operation-icon">
            <el-icon><Monitor /></el-icon>
          </div>
          <div class="operation-content">
            <h4>模拟练习</h4>
            <p>无评分的面试体验</p>
          </div>
        </div>

        <div
          class="operation-card get-feedback"
          @click="getFeedback"
        >
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

    <!-- 智能推荐区域 -->
    <div class="recommendations-section">
      <el-row :gutter="24">
        <!-- 下一步建议 -->
        <el-col :span="8">
          <el-card class="recommendation-card">
            <template #header>
              <div class="card-header">
                <el-icon><Compass /></el-icon>
                <span>下一步建议</span>
              </div>
            </template>
            
            <div class="next-steps">
              <div 
                v-for="step in nextSteps" 
                :key="step.id"
                class="step-item"
                @click="handleStepClick(step)"
              >
                <div class="step-icon" :style="{ background: step.color + '20', color: step.color }">
                  <el-icon :size="20">
                    <component :is="step.icon" />
                  </el-icon>
                </div>
                <div class="step-content">
                  <div class="step-title">{{ step.title }}</div>
                  <div class="step-desc">{{ step.description }}</div>
                  <div class="step-priority" :class="step.priority">
                    {{ priorityLabel(step.priority) }}
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- 推荐学习部分优化 -->
        <el-col :span="8">
          <el-card class="recommendation-card enhanced-learning-card">
            <template #header>
              <div class="card-header">
                <el-icon><Reading /></el-icon>
                <span>推荐学习</span>
                <el-button size="small" text @click="refreshLearningResources">
                  <el-icon><Refresh /></el-icon>
                </el-button>
              </div>
            </template>

            <div class="learning-resources">
              <div
                v-for="resource in enhancedLearningResources"
                :key="resource.id"
                class="resource-item enhanced-resource"
                @click="openLearningResource(resource)"
              >
                <div class="resource-thumbnail">
                  <div class="resource-image" :style="{ backgroundImage: `url(${resource.thumbnail})` }">
                    <div class="resource-overlay">
                      <el-icon class="play-icon"><VideoPlay /></el-icon>
                    </div>
                  </div>
                  <div class="resource-type" :class="resource.typeClass">{{ resource.type }}</div>
                  <div class="resource-difficulty" :class="resource.difficulty">
                    {{ getDifficultyLabel(resource.difficulty) }}
                  </div>
                </div>
                <div class="resource-info">
                  <div class="resource-title">{{ resource.title }}</div>
                  <div class="resource-provider">{{ resource.provider }}</div>
                  <div class="resource-stats">
                    <span class="resource-duration">
                      <el-icon><Clock /></el-icon>
                      {{ resource.duration }}
                    </span>
                    <span class="resource-progress" v-if="resource.progress">
                      {{ resource.progress }}%
                    </span>
                  </div>
                  <div class="resource-match">
                    <span>匹配度: </span>
                    <el-progress
                      :percentage="resource.matchScore"
                      :show-text="false"
                      :stroke-width="4"
                      :color="getProgressColor(resource.matchScore)"
                      class="match-progress"
                    />
                    <span class="match-score">{{ resource.matchScore }}%</span>
                  </div>
                  <div class="resource-tags">
                    <el-tag
                      v-for="tag in resource.tags"
                      :key="tag"
                      size="small"
                      class="resource-tag"
                    >
                      {{ tag }}
                    </el-tag>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- 面试技巧 -->
        <el-col :span="8">
          <el-card class="recommendation-card">
            <template #header>
              <div class="card-header">
                <el-icon><ChatDotRound /></el-icon>
                <span>面试技巧</span>
              </div>
            </template>
            
            <div class="interview-tips">
              <div 
                v-for="tip in interviewTips" 
                :key="tip.id"
                class="tip-item"
              >
                <div class="tip-category" :style="{ background: tip.categoryColor }">
                  {{ tip.category }}
                </div>
                <div class="tip-content">
                  <div class="tip-title">{{ tip.title }}</div>
                  <div class="tip-description">{{ tip.description }}</div>
                </div>
                <div class="tip-actions">
                  <el-button size="small" text @click="markAsRead(tip)">
                    <el-icon><View /></el-icon>
                    已读
                  </el-button>
                  <el-button size="small" text @click="saveForLater(tip)">
                    <el-icon><Star /></el-icon>
                    收藏
                  </el-button>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 个性化统计面板 -->
    <div class="stats-section">
      <el-row :gutter="24">
        <el-col :span="6" v-for="stat in personalizedStats" :key="stat.id">
          <el-card class="stat-card" :class="stat.trend">
            <div class="stat-content">
              <div class="stat-icon" :style="{ background: stat.color + '20', color: stat.color }">
                <el-icon :size="24">
                  <component :is="stat.icon" />
                </el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ stat.value }}</div>
                <div class="stat-label">{{ stat.label }}</div>
                <div class="stat-change" :class="stat.trend">
                  <el-icon><ArrowUp v-if="stat.trend === 'up'" /><ArrowDown v-else /></el-icon>
                  {{ stat.change }}
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 底部快速入口功能完善 -->
    <div class="quick-entry-section enhanced-quick-entry">
      <h3 class="section-title">
        <el-icon><Grid /></el-icon>
        快速入口
      </h3>
      <div class="quick-entries-grid">
        <div
          class="entry-card interview-entry"
          @click="goToInterview"
        >
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

        <div
          class="entry-card reports-entry"
          @click="goToReports"
        >
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

        <div
          class="entry-card skills-entry"
          @click="goToSkillAnalysis"
        >
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

        <div
          class="entry-card settings-entry"
          @click="goToPersonalSettings"
        >
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElNotification, ElMessageBox } from 'element-plus'
import { useIntervieweeStore } from '@/stores/intervieweeStore.js'
import enhancedIflytekSparkService from '@/services/enhancedIflytekSparkService.js'
import {
  Reading, ChatDotRound, Star, Compass,
  VideoPlay, Document, Grid, Setting, Operation,
  Clock, TrendCharts, User, Cpu, Refresh, Loading,
  Monitor
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

// 增强的学习资源
const enhancedLearningResources = ref([
  {
    id: 1,
    title: '深度学习进阶课程',
    provider: 'iFlytek学院',
    type: '视频课程',
    typeClass: 'video-course',
    difficulty: 'advanced',
    duration: '8小时',
    progress: 95,
    matchScore: 95,
    thumbnail: '/images/ai-chapter-1.jpg',
    tags: ['深度学习', 'TensorFlow', 'PyTorch'],
    learningPath: 'ai-advanced'
  },
  {
    id: 2,
    title: '项目管理实战',
    provider: 'iFlytek商学院',
    type: '实战项目',
    typeClass: 'practical-project',
    difficulty: 'intermediate',
    duration: '6小时',
    progress: 78,
    matchScore: 78,
    thumbnail: '/images/case-product.jpg',
    tags: ['项目管理', '敏捷开发', 'Scrum'],
    learningPath: 'management'
  },
  {
    id: 3,
    title: 'AI算法优化技巧',
    provider: 'iFlytek研究院',
    type: '技术文档',
    typeClass: 'technical-doc',
    difficulty: 'expert',
    duration: '4小时',
    progress: 88,
    matchScore: 88,
    thumbnail: '/images/case-algorithm.jpg',
    tags: ['算法优化', '性能调优', '机器学习'],
    learningPath: 'ai-expert'
  }
])

// 下一步建议
const nextSteps = computed(() => [
  {
    id: 1,
    title: '继续面试',
    description: '完成剩余4个问题，预计需要15分钟',
    icon: 'VideoPlay',
    color: '#1890ff',
    priority: 'high',
    action: 'continue_interview'
  },
  {
    id: 2,
    title: '技能提升',
    description: '针对项目管理能力进行专项训练',
    icon: 'TrendCharts',
    color: '#52c41a',
    priority: 'medium',
    action: 'skill_training'
  },
  {
    id: 3,
    title: '模拟练习',
    description: '进行AI领域的模拟面试练习',
    icon: 'Reading',
    color: '#faad14',
    priority: 'low',
    action: 'mock_interview'
  }
])

// 学习资源推荐
const learningResources = computed(() => [
  {
    id: 1,
    title: '深度学习进阶课程',
    provider: 'iFlytek学院',
    type: '视频课程',
    thumbnail: '/images/course-dl.jpg',
    matchScore: 95,
    duration: '40小时'
  },
  {
    id: 2,
    title: '项目管理实战',
    provider: 'iFlytek商学院',
    type: '实战项目',
    thumbnail: '/images/course-pm.jpg',
    matchScore: 78,
    duration: '2周'
  },
  {
    id: 3,
    title: 'AI算法优化技巧',
    provider: 'iFlytek研究院',
    type: '技术文档',
    thumbnail: '/images/doc-ai.jpg',
    matchScore: 88,
    duration: '3小时'
  }
])

// 面试技巧
const interviewTips = computed(() => [
  {
    id: 1,
    category: '回答技巧',
    categoryColor: '#1890ff',
    title: 'STAR法则应用',
    description: '使用情境-任务-行动-结果的结构来回答行为问题'
  },
  {
    id: 2,
    category: '沟通技巧',
    categoryColor: '#52c41a',
    title: '技术概念解释',
    description: '用通俗易懂的语言解释复杂的技术概念'
  },
  {
    id: 3,
    category: '心理调节',
    categoryColor: '#faad14',
    title: '缓解紧张情绪',
    description: '通过深呼吸和积极心理暗示来保持冷静'
  }
])

// 个性化统计
const personalizedStats = computed(() => [
  {
    id: 1,
    label: '面试完成度',
    value: `${interviewee.completionRate}%`,
    icon: 'Clock',
    color: '#1890ff',
    trend: 'up',
    change: '+15%'
  },
  {
    id: 2,
    label: '技能匹配度',
    value: `${interviewee.skillAssessment.skillScores.skillMatching}%`,
    icon: 'Trophy',
    color: '#52c41a',
    trend: 'up',
    change: '+8%'
  },
  {
    id: 3,
    label: '表现排名',
    value: 'Top 25%',
    icon: 'TrendCharts',
    color: '#faad14',
    trend: 'up',
    change: '+5位'
  },
  {
    id: 4,
    label: '改进建议',
    value: '3项',
    icon: 'Notification',
    color: '#f5222d',
    trend: 'down',
    change: '-1项'
  }
])

// 快速入口
const quickEntries = computed(() => [
  {
    id: 1,
    title: '继续面试',
    description: '完成您的AI算法工程师面试',
    icon: 'VideoPlay',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    badge: interviewee.interviewProgress.totalQuestions - interviewee.interviewProgress.answeredQuestions,
    badgeType: 'primary',
    route: '/text-interview'
  },
  {
    id: 2,
    title: '查看报告',
    description: '分析您的面试表现和技能评估',
    icon: 'Document',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    route: '/report-center'
  },
  {
    id: 3,
    title: '技能分析',
    description: '深入了解您的技能优势和改进空间',
    icon: 'Grid',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    route: '/skill-analysis'
  },
  {
    id: 4,
    title: '个人设置',
    description: '自定义您的面试偏好和通知设置',
    icon: 'Setting',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    route: '/settings'
  }
])

// 方法
const priorityLabel = (priority) => {
  const labels = {
    high: '高优先级',
    medium: '中优先级',
    low: '低优先级'
  }
  return labels[priority] || '普通'
}

const handleStepClick = (step) => {
  console.log('执行步骤:', step.action)
  // 根据不同的action执行相应的操作
}

const handleEntryClick = (entry) => {
  if (entry.route) {
    router.push(entry.route)
  }
}

const markAsRead = (tip) => {
  console.log('标记为已读:', tip.id)
}

const saveForLater = (tip) => {
  console.log('收藏技巧:', tip.id)
}

// 配置变化处理
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

// AI助手功能
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

// 快速操作功能
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

// 学习资源功能
const refreshLearningResources = () => {
  ElMessage.success('学习资源已刷新')
}

const openLearningResource = (resource) => {
  console.log('打开学习资源:', resource.title)
  router.push(`/learning-path/${resource.learningPath}`)
}

// 底部快速入口功能
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

const getDifficultyLabel = (difficulty) => {
  const labels = { beginner: '入门', intermediate: '中级', advanced: '高级', expert: '专家' }
  return labels[difficulty] || difficulty
}

const getProgressColor = (percentage) => {
  if (percentage >= 90) return '#67c23a'
  if (percentage >= 70) return '#e6a23c'
  return '#f56c6c'
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

// 生命周期
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

/* 顶部状态栏样式 */
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

/* AI助手功能样式 */
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

/* AI分析结果样式 */
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

/* 快速操作样式 */
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

.continue-interview {
  background: linear-gradient(135deg, #1890ff, #40a9ff);
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

/* 增强学习资源样式 */
.enhanced-learning-card {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.enhanced-resource {
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  background: white;
}

.enhanced-resource:hover {
  border-color: #1890ff;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);
  transform: translateY(-2px);
}

.resource-image {
  width: 100%;
  height: 120px;
  background-size: cover;
  background-position: center;
  background-color: #f0f0f0;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.resource-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.enhanced-resource:hover .resource-overlay {
  opacity: 1;
}

.play-icon {
  color: white;
  font-size: 32px;
}

.resource-type {
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: white;
}

.video-course {
  background: #1890ff;
}

.practical-project {
  background: #52c41a;
}

.technical-doc {
  background: #722ed1;
}

.resource-difficulty {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: white;
}

.resource-difficulty.beginner {
  background: #52c41a;
}

.resource-difficulty.intermediate {
  background: #fa8c16;
}

.resource-difficulty.advanced {
  background: #f5222d;
}

.resource-difficulty.expert {
  background: #722ed1;
}

.resource-stats {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 8px 0;
  font-size: 12px;
  color: #666;
}

.resource-duration {
  display: flex;
  align-items: center;
  gap: 4px;
}

.resource-progress {
  color: #1890ff;
  font-weight: 500;
}

.resource-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 8px;
}

.resource-tag {
  font-size: 10px;
}

/* 底部快速入口样式 */
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

.recommendations-section {
  padding: 0 20px 24px;
}

.recommendation-card {
  height: 400px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #333;
}

.next-steps {
  height: 320px;
  overflow-y: auto;
}

.step-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 12px;
  background: #fafafa;
  cursor: pointer;
  transition: all 0.3s ease;
}

.step-item:hover {
  background: #f0f8ff;
  transform: translateY(-2px);
}

.step-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-content {
  flex: 1;
}

.step-title {
  font-weight: 600;
  margin-bottom: 4px;
}

.step-desc {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.step-priority {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 12px;
  display: inline-block;
}

.step-priority.high {
  background: #fff2f0;
  color: #f5222d;
}

.step-priority.medium {
  background: #fffbe6;
  color: #faad14;
}

.step-priority.low {
  background: #f6ffed;
  color: #52c41a;
}

.learning-resources, .interview-tips {
  height: 320px;
  overflow-y: auto;
}

.resource-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 12px;
  background: #fafafa;
}

.resource-thumbnail {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
}

.resource-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.resource-type {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 10px;
  text-align: center;
  padding: 2px;
}

.resource-info {
  flex: 1;
}

.resource-title {
  font-weight: 600;
  margin-bottom: 4px;
  font-size: 13px;
}

.resource-provider {
  font-size: 11px;
  color: #666;
  margin-bottom: 8px;
}

.resource-match {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
}

.match-progress {
  flex: 1;
}

.match-score {
  font-weight: 600;
  color: #1890ff;
}

.tip-item {
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 12px;
  background: #fafafa;
}

.tip-category {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  color: white;
  margin-bottom: 8px;
}

.tip-title {
  font-weight: 600;
  margin-bottom: 4px;
  font-size: 13px;
}

.tip-description {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.tip-actions {
  display: flex;
  gap: 8px;
}

.stats-section {
  padding: 0 20px 24px;
}

.stat-card {
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.stat-change {
  font-size: 11px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-change.up {
  color: #52c41a;
}

.stat-change.down {
  color: #f5222d;
}

.quick-entry-section {
  padding: 0 20px 40px;
}

.section-title {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.quick-entries {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.entry-item {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 120px;
}

.entry-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.entry-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.9;
}

.entry-content {
  position: relative;
  padding: 20px;
  color: white;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
}

.entry-info {
  flex: 1;
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

.entry-badge {
  position: absolute;
  top: 12px;
  right: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .recommendations-section .el-col,
  .stats-section .el-col {
    margin-bottom: 20px;
  }
  
  .quick-entries {
    grid-template-columns: 1fr;
  }
}
</style>
