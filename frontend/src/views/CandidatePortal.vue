<template>
  <div class="candidate-portal">
    <!-- 求职者端导航头部 -->
    <div class="candidate-header">
      <div class="header-container">
        <div class="brand-section">
          <div class="brand-logo">
            <el-icon class="logo-icon"><User /></el-icon>
            <span class="brand-text">iFlytek 求职者中心</span>
          </div>
          <div class="brand-subtitle">AI助力，让面试更轻松</div>
        </div>
        <div class="header-actions">
          <el-button type="primary" size="large" @click="startPracticeInterview">
            <el-icon><VideoCamera /></el-icon>
            开始练习面试
          </el-button>
          <el-button @click="viewLearningPath">
            <el-icon><Reading /></el-icon>
            学习路径
          </el-button>
          <el-button @click="viewProfile">
            <el-icon><Setting /></el-icon>
            个人设置
          </el-button>
        </div>
      </div>
    </div>

    <!-- 个人成长概览 -->
    <div class="candidate-overview">
      <div class="overview-container">
        <div class="overview-title">
          <h2>我的面试成长</h2>
          <p>跟踪您的面试技能提升进度</p>
        </div>
        <div class="stats-grid">
          <div class="stat-card primary">
            <div class="stat-header">
              <el-icon class="stat-icon"><TrendCharts /></el-icon>
              <span class="stat-trend up">+{{ candidateStats.improvementRate }}%</span>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ candidateStats.totalInterviews }}</div>
              <div class="stat-label">练习面试次数</div>
              <div class="stat-detail">本周练习 {{ candidateStats.weeklyInterviews }} 次</div>
            </div>
          </div>

          <div class="stat-card success">
            <div class="stat-header">
              <el-icon class="stat-icon"><Trophy /></el-icon>
              <span class="stat-trend up">+{{ candidateStats.scoreImprovement }}分</span>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ candidateStats.avgScore }}分</div>
              <div class="stat-label">平均面试得分</div>
              <div class="stat-detail">最高得分 {{ candidateStats.bestScore }}分</div>
            </div>
          </div>

          <div class="stat-card warning">
            <div class="stat-header">
              <el-icon class="stat-icon"><Star /></el-icon>
              <span class="stat-badge">{{ candidateStats.skillLevel }}</span>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ candidateStats.skillProgress }}%</div>
              <div class="stat-label">技能完成度</div>
              <div class="stat-detail">距离下一级还需 {{ candidateStats.nextLevelPoints }} 分</div>
            </div>
          </div>

          <div class="stat-card info">
            <div class="stat-header">
              <el-icon class="stat-icon"><Trophy /></el-icon>
              <span class="stat-trend up">+{{ candidateStats.newAchievements }}</span>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ candidateStats.achievements }}</div>
              <div class="stat-label">获得成就</div>
              <div class="stat-detail">本月新增 {{ candidateStats.monthlyAchievements }} 个</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 求职者核心功能模块 -->
    <div class="candidate-modules">
      <div class="modules-container">
        <!-- 面试练习与提升 -->
        <div class="module-section">
          <div class="module-header">
            <h3>面试练习与提升</h3>
            <p>通过AI模拟面试，提升您的面试技能</p>
          </div>
          <div class="module-grid">
            <div class="module-card" @click="navigateTo('/interview-selection')">
              <div class="module-icon practice">
                <el-icon><VideoCamera /></el-icon>
              </div>
              <div class="module-content">
                <h4>模拟面试</h4>
                <p>AI面试官一对一模拟真实面试场景</p>
                <div class="module-stats">
                  <span>已练习 {{ practiceStats.totalSessions }} 次</span>
                </div>
              </div>
            </div>

            <div class="module-card" @click="navigateTo('/interview-selection')">
              <div class="module-icon assistant">
                <el-icon><Headset /></el-icon>
              </div>
              <div class="module-content">
                <h4>实时面试辅助</h4>
                <p>面试过程中提供智能提示和建议</p>
                <div class="module-stats">
                  <span>辅助成功率 {{ assistantStats.successRate }}%</span>
                </div>
              </div>
            </div>

            <div class="module-card" @click="navigateTo('/interview-selection')">
              <div class="module-icon assessment">
                <el-icon><Trophy /></el-icon>
              </div>
              <div class="module-content">
                <h4>技能评估</h4>
                <p>全面评估您的专业技能水平</p>
                <div class="module-stats">
                  <span>当前等级 {{ skillStats.currentLevel }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 多模态交互训练 -->
        <div class="module-section multimodal-training-section">
          <div class="module-header">
            <h3>多模态面试交互训练</h3>
            <p>提升视频、手势等多维度表达能力</p>
          </div>
          <div class="training-container">
            <MultimodalInteractionHub />
          </div>
        </div>

        <!-- iFlytek Spark AI辅助功能 -->
        <div class="module-section ai-assistant-section">
          <div class="module-header">
            <h3>iFlytek Spark AI面试助手</h3>
            <p>智能AI助力，让面试更轻松自信</p>
          </div>
          <div class="ai-assistant-grid">


            <!-- 情绪状态监测 -->
            <div class="assistant-card emotion-assistant">
              <div class="assistant-header">
                <div class="assistant-icon">
                  <el-icon><VideoCamera /></el-icon>
                </div>
                <div class="assistant-info">
                  <h4>情绪状态分析</h4>
                  <p>帮助调整面试状态</p>
                </div>
              </div>
              <div class="assistant-demo">
                <div class="emotion-monitor">
                  <div class="emotion-circle">
                    <div class="emotion-score">{{ candidateAI.emotionScore }}</div>
                    <div class="emotion-label">情绪指数</div>
                  </div>
                  <div class="emotion-suggestions">
                    <div class="suggestion-item" v-for="suggestion in candidateAI.suggestions" :key="suggestion.id">
                      <el-icon class="suggestion-icon"><Check /></el-icon>
                      <span class="suggestion-text">{{ suggestion.text }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 智能答题提示 -->
            <div class="assistant-card answer-assistant">
              <div class="assistant-header">
                <div class="assistant-icon">
                  <el-icon><ChatDotRound /></el-icon>
                </div>
                <div class="assistant-info">
                  <h4>智能答题提示</h4>
                  <p>关键词提醒和思路引导</p>
                </div>
              </div>
              <div class="assistant-demo">
                <div class="answer-hints">
                  <div class="current-question">
                    <span class="question-label">当前问题类型</span>
                    <span class="question-type">{{ candidateAI.currentQuestionType }}</span>
                  </div>
                  <div class="hint-keywords">
                    <span class="keywords-label">关键词提示</span>
                    <div class="keywords-list">
                      <span class="keyword-tag" v-for="keyword in candidateAI.keywords" :key="keyword">
                        {{ keyword }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 个性化智能推荐 -->
        <div class="module-section personalized-learning-section">
          <div class="module-header">
            <h3>个性化学习与职业推荐</h3>
            <p>基于iFlytek Spark的智能学习路径和职位匹配</p>
          </div>
          <div class="personalized-container">
            <PersonalizedRecommendationEngine user-type="candidate" />
          </div>
        </div>

        <!-- 学习路径与成长 -->
        <div class="module-section">
          <div class="module-header">
            <h3>个性化学习路径</h3>
            <p>基于您的表现，AI为您定制专属学习计划</p>
          </div>
          <div class="learning-path-grid">
            <div class="learning-card">
              <div class="learning-header">
                <h4>AI算法工程师路径</h4>
                <div class="progress-info">
                  <span>进度: {{ learningPaths.ai.progress }}%</span>
                </div>
              </div>
              <div class="learning-content">
                <el-progress :percentage="learningPaths.ai.progress" :show-text="false" />
                <div class="learning-modules">
                  <div class="module-item" v-for="module in learningPaths.ai.modules" :key="module.id">
                    <el-icon class="module-icon" :class="{ completed: module.completed }">
                      <Check v-if="module.completed" />
                      <Clock v-else />
                    </el-icon>
                    <span class="module-name">{{ module.name }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="learning-card">
              <div class="learning-header">
                <h4>大数据开发路径</h4>
                <div class="progress-info">
                  <span>进度: {{ learningPaths.bigdata.progress }}%</span>
                </div>
              </div>
              <div class="learning-content">
                <el-progress :percentage="learningPaths.bigdata.progress" :show-text="false" />
                <div class="learning-modules">
                  <div class="module-item" v-for="module in learningPaths.bigdata.modules" :key="module.id">
                    <el-icon class="module-icon" :class="{ completed: module.completed }">
                      <Check v-if="module.completed" />
                      <Clock v-else />
                    </el-icon>
                    <span class="module-name">{{ module.name }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- AI智能推荐 -->
        <div class="module-section">
          <div class="module-header">
            <h3>AI智能推荐</h3>
            <p>基于您的技能和兴趣，为您推荐最适合的机会</p>
          </div>
          <div class="recommendations-grid">
            <div class="recommendation-card">
              <div class="recommendation-header">
                <el-icon class="recommendation-icon"><OfficeBuilding /></el-icon>
                <h4>职位推荐</h4>
              </div>
              <div class="recommendation-content">
                <div class="job-item" v-for="job in jobRecommendations" :key="job.id">
                  <div class="job-info">
                    <div class="job-title">{{ job.title }}</div>
                    <div class="job-company">{{ job.company }}</div>
                    <div class="job-match">匹配度: {{ job.matchScore }}%</div>
                  </div>
                  <el-button size="small" type="primary" @click="applyJob(job.id)">
                    申请
                  </el-button>
                </div>
              </div>
            </div>

            <div class="recommendation-card">
              <div class="recommendation-header">
                <el-icon class="recommendation-icon"><Reading /></el-icon>
                <h4>学习推荐</h4>
              </div>
              <div class="recommendation-content">
                <div class="learning-item" v-for="course in courseRecommendations" :key="course.id">
                  <div class="course-info">
                    <div class="course-title">{{ course.title }}</div>
                    <div class="course-description">{{ course.description }}</div>
                    <div class="course-difficulty">难度: {{ course.difficulty }}</div>
                  </div>
                  <el-button size="small" @click="startCourse(course.id)">
                    开始学习
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 候选人体验优化 -->
        <div class="module-section candidate-experience-section">
          <div class="module-header">
            <h3>候选人体验优化</h3>
            <p>面试准备助手、实时指导、技能提升一站式服务</p>
          </div>
          <div class="experience-container">
            <CandidateExperienceOptimization />
          </div>
        </div>

        <!-- 面试历史与分析 -->
        <div class="module-section">
          <div class="module-header">
            <h3>面试历史与分析</h3>
            <p>回顾您的面试表现，发现改进空间</p>
          </div>
          <div class="history-analysis">
            <div class="history-timeline">
              <div class="timeline-item" v-for="interview in recentInterviews" :key="interview.id">
                <div class="timeline-dot" :class="getScoreClass(interview.score)"></div>
                <div class="timeline-content">
                  <div class="interview-title">{{ interview.position }}</div>
                  <div class="interview-company">{{ interview.company }}</div>
                  <div class="interview-score">得分: {{ interview.score }}分</div>
                  <div class="interview-date">{{ formatTime(interview.date) }}</div>
                  <el-button text size="small" @click="viewInterviewDetail(interview.id)">
                    查看详情
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElNotification } from 'element-plus'
import MultimodalInteractionHub from '../components/MultimodalInteractionHub.vue'
import PersonalizedRecommendationEngine from '../components/PersonalizedRecommendationEngine.vue'
import CandidateExperienceOptimization from '../components/CandidateExperienceOptimization.vue'
import {
  VideoCamera, User, TrendCharts, Medal, Star, Trophy,
  PieChart, Reading, Setting, Headset, Check, Clock, Briefcase,
  ChatDotRound
} from '@element-plus/icons-vue'

const router = useRouter()

// 求职者核心数据
const candidateStats = reactive({
  totalInterviews: 23,
  weeklyInterviews: 5,
  avgScore: 83,
  bestScore: 94,
  scoreImprovement: 12,
  skillLevel: '中级',
  skillProgress: 68,
  nextLevelPoints: 320,
  achievements: 8,
  monthlyAchievements: 2,
  newAchievements: 1,
  improvementRate: 16
})

// 练习统计
const practiceStats = reactive({
  totalSessions: 23,
  weeklyGoal: 5,
  completionRate: 85
})

// 辅助统计
const assistantStats = reactive({
  successRate: 78,
  totalAssists: 156,
  avgHelpTime: 3
})

// 技能统计
const skillStats = reactive({
  currentLevel: '中级',
  totalSkills: 12,
  masteredSkills: 8
})

// 候选人AI辅助数据
const candidateAI = reactive({
  emotionScore: 85,
  currentQuestionType: '技术能力评估',
  keywords: ['算法优化', '数据结构', '时间复杂度', '系统设计'],
  suggestions: [
    { id: 1, text: '保持自然的表达' },
    { id: 2, text: '适当使用手势表达' },
    { id: 3, text: '回答要点明确' }
  ]
})

// 学习路径数据
const learningPaths = reactive({
  ai: {
    progress: 68,
    modules: [
      { id: 1, name: '机器学习基础', completed: true },
      { id: 2, name: '深度学习框架', completed: true },
      { id: 3, name: '计算机视觉', completed: false },
      { id: 4, name: '自然语言处理', completed: false }
    ]
  },
  bigdata: {
    progress: 45,
    modules: [
      { id: 1, name: 'Hadoop生态系统', completed: true },
      { id: 2, name: 'Spark数据处理', completed: false },
      { id: 3, name: '实时流处理', completed: false },
      { id: 4, name: '数据仓库设计', completed: false }
    ]
  }
})

// 职位推荐
const jobRecommendations = reactive([
  {
    id: 1,
    title: 'AI算法工程师',
    company: '腾讯科技',
    matchScore: 92,
    salary: '25-40K'
  },
  {
    id: 2,
    title: '机器学习工程师',
    company: '字节跳动',
    matchScore: 88,
    salary: '30-50K'
  },
  {
    id: 3,
    title: '深度学习研究员',
    company: '百度AI',
    matchScore: 85,
    salary: '35-60K'
  }
])

// 课程推荐
const courseRecommendations = reactive([
  {
    id: 1,
    title: 'PyTorch深度学习实战',
    description: '从零开始学习PyTorch框架',
    difficulty: '中级'
  },
  {
    id: 2,
    title: '计算机视觉项目实践',
    description: '通过实际项目掌握CV技能',
    difficulty: '高级'
  }
])

// 最近面试记录
const recentInterviews = reactive([
  {
    id: 1,
    position: 'AI算法工程师',
    company: '阿里巴巴',
    score: 85,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)
  },
  {
    id: 2,
    position: '机器学习工程师',
    company: '腾讯',
    score: 78,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5)
  },
  {
    id: 3,
    position: '数据科学家',
    company: '字节跳动',
    score: 92,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
  }
])

// 求职者端方法
const startPracticeInterview = () => {
  // 跳转到面试选择页面，与系统控制栏中"开始面试"保持一致
  router.push('/interview-selection')
}

const viewLearningPath = () => {
  router.push('/learning-path')
}

const viewProfile = () => {
  router.push('/personal-settings')
}

const navigateTo = (path) => {
  router.push(path)
}

const applyJob = (jobId) => {
  console.log('申请职位:', jobId)
  // 实际应用中会调用API
}

const startCourse = (courseId) => {
  console.log('🎓 开始学习课程:', courseId)

  try {
    // 显示成功消息
    ElMessage.success('正在启动学习课程...')

    // 根据课程ID跳转到相应的学习页面
    switch (courseId) {
      case 1:
        ElNotification.success({
          title: '🚀 Vue.js进阶开发',
          message: '开始您的Vue.js学习之旅！',
          duration: 3000
        })
        router.push('/learning-path/vue-advanced')
        break
      case 2:
        ElNotification.success({
          title: '📊 算法与数据结构',
          message: '开始算法学习！',
          duration: 3000
        })
        router.push('/learning-path/algorithms')
        break
      case 3:
        ElNotification.success({
          title: '🔧 前端工程化实践',
          message: '开始工程化学习！',
          duration: 3000
        })
        router.push('/learning-path/frontend-engineering')
        break
      default:
        ElMessage.info('该课程正在开发中...')
        router.push(`/course/${courseId}`)
    }
  } catch (error) {
    console.error('❌ 启动学习课程失败:', error)
    ElMessage.error('启动学习课程失败，请重试')
  }
}

const viewInterviewDetail = (interviewId) => {
  router.push(`/interview-detail/${interviewId}`)
}

const getScoreClass = (score) => {
  if (score >= 90) return 'excellent'
  if (score >= 80) return 'good'
  if (score >= 70) return 'average'
  return 'poor'
}

const formatTime = (date) => {
  const now = new Date()
  const diff = now - date
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) {
    return '今天'
  } else if (days === 1) {
    return '昨天'
  } else {
    return `${days}天前`
  }
}

onMounted(() => {
  console.log('求职者中心已加载')

  // 启动AI辅助动画
  setTimeout(() => {
    // AI辅助数据动画
    const statusTexts = [
      '检测到技术关键词',
      '表达逻辑清晰',
      '内容结构完整',
      '技术深度良好'
    ]

    const questionTypes = [
      '技术能力评估',
      '项目经验询问',
      '算法思维考察',
      '系统设计问题'
    ]

    let statusIndex = 0
    let questionIndex = 0

    setInterval(() => {
      statusIndex = (statusIndex + 1) % statusTexts.length
      candidateAI.emotionScore = 85 + Math.floor((Math.random() - 0.5) * 10)
    }, 2500)

    setInterval(() => {
      questionIndex = (questionIndex + 1) % questionTypes.length
      candidateAI.currentQuestionType = questionTypes[questionIndex]
    }, 4000)
  }, 1000)
})
</script>

<style scoped>
.candidate-portal {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* 求职者端头部样式 */
.candidate-header {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  padding: 32px 0;
  margin-bottom: 32px;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand-section {
  flex: 1;
}

.brand-logo {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.logo-icon {
  font-size: 32px;
  margin-right: 12px;
  color: #ffffff;
}

.brand-text {
  font-size: 28px;
  font-weight: 600;
  color: #ffffff;
}

.brand-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  margin-left: 44px;
}

.header-actions {
  display: flex;
  gap: 16px;
}

.header-actions .el-button {
  height: 44px;
  padding: 0 24px;
  font-size: 16px;
  border-radius: 8px;
}

/* 个人成长概览样式 */
.candidate-overview {
  margin-bottom: 32px;
}

.overview-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.overview-title {
  text-align: center;
  margin-bottom: 32px;
}

.overview-title h2 {
  font-size: 32px;
  color: #2c3e50;
  margin-bottom: 8px;
}

.overview-title p {
  font-size: 16px;
  color: #7f8c8d;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.stat-card.primary {
  border-left: 4px solid #4facfe;
}

.stat-card.success {
  border-left: 4px solid #2ecc71;
}

.stat-card.warning {
  border-left: 4px solid #f39c12;
}

.stat-card.info {
  border-left: 4px solid #9b59b6;
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.stat-icon {
  font-size: 24px;
  color: #4facfe;
}

.stat-trend {
  font-size: 14px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 12px;
  background: #e8f5e8;
  color: #27ae60;
}

.stat-badge {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 12px;
  background: #fff3cd;
  color: #856404;
}

.stat-content {
  text-align: left;
}

.stat-value {
  font-size: 36px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 16px;
  color: #7f8c8d;
  margin-bottom: 4px;
}

.stat-detail {
  font-size: 14px;
  color: #95a5a6;
}

/* 求职者模块样式 */
.candidate-modules {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.module-section {
  margin-bottom: 48px;
}

.module-header {
  text-align: center;
  margin-bottom: 32px;
}

.module-header h3 {
  font-size: 28px;
  color: #2c3e50;
  margin-bottom: 8px;
}

.module-header p {
  font-size: 16px;
  color: #7f8c8d;
}

.module-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
}

.module-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.module-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.module-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4facfe, #00f2fe);
}

.module-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 28px;
  color: white;
}

.module-icon.practice {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
}

.module-icon.assistant {
  background: linear-gradient(135deg, #43e97b, #38f9d7);
}

.module-icon.assessment {
  background: linear-gradient(135deg, #fa709a, #fee140);
}

.module-content h4 {
  font-size: 20px;
  color: #2c3e50;
  margin-bottom: 12px;
}

.module-content p {
  font-size: 14px;
  color: #7f8c8d;
  line-height: 1.6;
  margin-bottom: 16px;
}

.module-stats {
  font-size: 12px;
  color: #95a5a6;
  background: #f8f9fa;
  padding: 8px 12px;
  border-radius: 8px;
}

/* 学习路径样式 */
.learning-path-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.learning-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.learning-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.learning-header h4 {
  font-size: 18px;
  color: #2c3e50;
}

.progress-info {
  font-size: 14px;
  color: #4facfe;
  font-weight: 600;
}

.learning-modules {
  margin-top: 16px;
}

.module-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.3s ease;
}

.module-item:hover {
  background: #f8f9fa;
}

.module-item .module-icon {
  width: 20px;
  height: 20px;
  margin-right: 12px;
  font-size: 14px;
}

.module-item .module-icon.completed {
  color: #2ecc71;
}

.module-name {
  font-size: 14px;
  color: #2c3e50;
}

/* 推荐样式 */
.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.recommendation-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.recommendation-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ecf0f1;
}

.recommendation-icon {
  font-size: 20px;
  color: #4facfe;
  margin-right: 12px;
}

.recommendation-header h4 {
  font-size: 18px;
  color: #2c3e50;
}

.job-item, .learning-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 12px;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.job-item:hover, .learning-item:hover {
  background: #e9ecef;
  transform: translateX(4px);
}

.job-info, .course-info {
  flex: 1;
}

.job-title, .course-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
}

.job-company, .course-description {
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 4px;
}

.job-match, .course-difficulty {
  font-size: 12px;
  color: #4facfe;
  font-weight: 600;
}

/* 面试历史分析样式 */
.history-analysis {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.history-timeline {
  position: relative;
  padding-left: 32px;
}

.history-timeline::before {
  content: '';
  position: absolute;
  left: 12px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #ecf0f1;
}

.timeline-item {
  position: relative;
  margin-bottom: 24px;
  display: flex;
  align-items: flex-start;
}

.timeline-dot {
  position: absolute;
  left: -20px;
  top: 8px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #4facfe;
  border: 3px solid white;
  box-shadow: 0 0 0 2px #ecf0f1;
}

.timeline-dot.excellent {
  background: #2ecc71;
}

.timeline-dot.good {
  background: #3498db;
}

.timeline-dot.average {
  background: #f39c12;
}

.timeline-dot.poor {
  background: #e74c3c;
}

.timeline-content {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  flex: 1;
  border: 1px solid #ecf0f1;
}

.interview-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
}

.interview-company {
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 4px;
}

.interview-score {
  font-size: 14px;
  font-weight: 600;
  color: #4facfe;
  margin-bottom: 8px;
}

.interview-date {
  font-size: 12px;
  color: #95a5a6;
  margin-bottom: 8px;
}

/* AI辅助功能样式 */
.ai-assistant-section {
  background: var(--iflytek-gradient-secondary);
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 40px;
  color: white;
}

.ai-assistant-section .module-header h3 {
  color: white;
}

.ai-assistant-section .module-header p {
  color: rgba(255, 255, 255, 0.9);
}

.ai-assistant-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.assistant-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  color: #2c3e50;
}

.assistant-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.assistant-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.assistant-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 20px;
  color: white;
}



.emotion-assistant .assistant-icon {
  background: var(--iflytek-gradient-accent);
}

.answer-assistant .assistant-icon {
  background: var(--iflytek-gradient-secondary);
}

.assistant-info h4 {
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 4px;
}

.assistant-info p {
  font-size: 14px;
  color: #7f8c8d;
  margin: 0;
}

.assistant-demo {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  min-height: 140px;
}



.status-text {
  display: block;
  font-size: 14px;
  color: var(--iflytek-primary);
  font-weight: 600;
  margin-bottom: 16px;
}

.confidence-meter {
  display: flex;
  align-items: center;
  gap: 8px;
}

.confidence-label {
  font-size: 12px;
  color: #7f8c8d;
  min-width: 60px;
}

.confidence-bar {
  flex: 1;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.confidence-fill {
  height: 100%;
  background: var(--iflytek-gradient-primary);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.confidence-value {
  font-size: 12px;
  color: var(--iflytek-primary);
  font-weight: 700;
  min-width: 35px;
}

/* 情绪监测样式 */
.emotion-monitor {
  text-align: center;
}

.emotion-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #43e97b, #38f9d7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: white;
}

.emotion-score {
  font-size: 24px;
  font-weight: 700;
}

.emotion-label {
  font-size: 12px;
  opacity: 0.9;
}

.emotion-suggestions {
  space-y: 8px;
}

.suggestion-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  padding: 8px 12px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.suggestion-icon {
  color: #2ecc71;
  margin-right: 8px;
  font-size: 14px;
}

.suggestion-text {
  font-size: 13px;
  color: #2c3e50;
}

/* 答题提示样式 */
.answer-hints {
  space-y: 16px;
}

.current-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.question-label {
  font-size: 12px;
  color: #7f8c8d;
}

.question-type {
  font-size: 14px;
  color: #fa709a;
  font-weight: 600;
}

.hint-keywords {
  margin-bottom: 16px;
}

.keywords-label {
  display: block;
  font-size: 12px;
  color: #7f8c8d;
  margin-bottom: 8px;
}

.keywords-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.keyword-tag {
  background: linear-gradient(135deg, #fa709a, #fee140);
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
}

/* 多模态训练、个性化学习和体验优化区域样式 */
.multimodal-training-section,
.personalized-learning-section,
.candidate-experience-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 40px;
  color: white;
}

.multimodal-training-section .module-header h3,
.personalized-learning-section .module-header h3,
.candidate-experience-section .module-header h3 {
  color: white;
  font-size: 24px;
  margin-bottom: 8px;
}

.multimodal-training-section .module-header p,
.personalized-learning-section .module-header p,
.candidate-experience-section .module-header p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  margin-bottom: 24px;
}

.training-container,
.personalized-container,
.experience-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .header-container {
    flex-wrap: wrap;
    gap: 16px;
  }

  .header-actions {
    flex-wrap: wrap;
    gap: 12px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .module-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .candidate-portal {
    overflow-x: hidden;
  }

  .header-container {
    flex-direction: column;
    gap: 24px;
    text-align: center;
    padding: 0 16px;
  }

  .header-actions {
    width: 100%;
    justify-content: center;
    flex-direction: column;
    gap: 12px;
  }

  .header-actions .el-button {
    width: 100%;
    max-width: 280px;
  }

  .overview-container,
  .modules-container {
    padding: 0 16px;
  }

  .multimodal-training-section,
  .personalized-learning-section,
  .candidate-experience-section {
    padding: 20px 16px;
  }

  .training-container,
  .personalized-container,
  .experience-container {
    padding: 16px;
  }

  .ai-assistant-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .confidence-meter {
    flex-direction: column;
    gap: 4px;
  }

  .current-question {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .stat-card {
    padding: 20px;
  }

  .module-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .module-card {
    padding: 20px;
  }

  .learning-path-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .recommendations-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .ai-features-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .practice-modes-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>
