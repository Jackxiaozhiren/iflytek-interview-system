<template>
  <div class="candidate-portal">
    <!-- 候选人专属导航 -->
    <header class="candidate-header">
      <div class="header-container">
        <div class="logo-section">
          <img src="/images/iflytek-spark-logo.svg" alt="iFlytek Spark" class="logo" />
          <span class="portal-title">AI面试助手</span>
        </div>
        
        <div class="user-section">
          <div class="user-info">
            <span class="welcome-text">欢迎回来，</span>
            <span class="user-name">{{ candidateInfo.name }}</span>
          </div>
          <el-avatar :size="40" :src="candidateInfo.avatar" />
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="portal-main">
      <div class="main-container">
        <!-- 快速行动区域 -->
        <section class="quick-actions-section">
          <div class="section-header">
            <h2 class="section-title">开始您的AI面试之旅</h2>
            <p class="section-subtitle">智能化面试体验，助您展现最佳状态</p>
          </div>
          
          <div class="actions-grid">
            <div class="action-card primary-action" @click="startInterview">
              <div class="card-icon">
                <el-icon :size="32"><VideoCamera /></el-icon>
              </div>
              <h3 class="card-title">开始AI面试</h3>
              <p class="card-description">与iFlytek Spark AI面试官进行实时对话</p>
              <div class="card-footer">
                <el-button type="primary" size="large" class="action-btn">
                  立即开始
                  <el-icon><ArrowRight /></el-icon>
                </el-button>
              </div>
            </div>
            
            <div class="action-card" @click="practiceMode">
              <div class="card-icon practice-icon">
                <el-icon :size="32"><Reading /></el-icon>
              </div>
              <h3 class="card-title">面试练习</h3>
              <p class="card-description">模拟面试场景，提升表达能力</p>
              <div class="card-footer">
                <el-button size="large" class="secondary-btn">
                  开始练习
                </el-button>
              </div>
            </div>
            
            <div class="action-card" @click="viewReports">
              <div class="card-icon report-icon">
                <el-icon :size="32"><Grid /></el-icon>
              </div>
              <h3 class="card-title">面试报告</h3>
              <p class="card-description">查看详细的AI分析和改进建议</p>
              <div class="card-footer">
                <el-button size="large" class="secondary-btn">
                  查看报告
                </el-button>
              </div>
            </div>
          </div>
        </section>

        <!-- 个人面试状态 -->
        <section class="status-section">
          <div class="status-grid">
            <div class="status-card">
              <div class="status-header">
                <h4 class="status-title">面试进度</h4>
                <el-icon class="status-icon"><TrendCharts /></el-icon>
              </div>
              <div class="status-content">
                <div class="progress-info">
                  <span class="progress-text">已完成 {{ interviewStats.completed }} / {{ interviewStats.total }} 场面试</span>
                  <el-progress 
                    :percentage="(interviewStats.completed / interviewStats.total * 100)" 
                    :stroke-width="8"
                    color="#1890ff"
                  />
                </div>
              </div>
            </div>
            
            <div class="status-card">
              <div class="status-header">
                <h4 class="status-title">综合评分</h4>
                <el-icon class="status-icon"><Medal /></el-icon>
              </div>
              <div class="status-content">
                <div class="score-display">
                  <span class="score-value">{{ interviewStats.averageScore }}</span>
                  <span class="score-label">平均分</span>
                </div>
                <div class="score-trend">
                  <el-icon class="trend-up"><CaretTop /></el-icon>
                  <span class="trend-text">较上次提升 5分</span>
                </div>
              </div>
            </div>
            
            <div class="status-card">
              <div class="status-header">
                <h4 class="status-title">技能匹配度</h4>
                <el-icon class="status-icon"><Star /></el-icon>
              </div>
              <div class="status-content">
                <div class="skill-tags">
                  <el-tag 
                    v-for="skill in candidateInfo.topSkills" 
                    :key="skill.name"
                    :type="skill.level === 'high' ? 'success' : skill.level === 'medium' ? 'warning' : 'info'"
                    class="skill-tag"
                  >
                    {{ skill.name }}
                  </el-tag>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- AI助手建议 -->
        <section class="ai-suggestions-section">
          <div class="suggestions-header">
            <h3 class="suggestions-title">
              <el-icon><Cpu /></el-icon>
              AI智能建议
            </h3>
            <p class="suggestions-subtitle">基于您的面试表现，AI为您提供个性化改进建议</p>
          </div>
          
          <div class="suggestions-grid">
            <div class="suggestion-card" v-for="suggestion in aiSuggestions" :key="suggestion.id">
              <div class="suggestion-icon" :class="suggestion.type">
                <el-icon><component :is="suggestion.icon" /></el-icon>
              </div>
              <div class="suggestion-content">
                <h4 class="suggestion-title">{{ suggestion.title }}</h4>
                <p class="suggestion-description">{{ suggestion.description }}</p>
                <div class="suggestion-action">
                  <el-button size="small" type="primary" text>
                    查看详情
                    <el-icon><ArrowRight /></el-icon>
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 学习资源推荐 -->
        <section class="learning-section">
          <div class="section-header">
            <h3 class="section-title">个性化学习路径</h3>
            <p class="section-subtitle">根据您的技能评估结果，推荐最适合的学习内容</p>
          </div>
          
          <div class="learning-grid">
            <div class="learning-card" v-for="course in recommendedCourses" :key="course.id">
              <div class="course-image">
                <img :src="course.image" :alt="course.title" />
                <div class="course-badge">{{ course.difficulty }}</div>
              </div>
              <div class="course-content">
                <h4 class="course-title">{{ course.title }}</h4>
                <p class="course-description">{{ course.description }}</p>
                <div class="course-meta">
                  <span class="course-duration">
                    <el-icon><Clock /></el-icon>
                    {{ course.duration }}
                  </span>
                  <span class="course-rating">
                    <el-icon><Star /></el-icon>
                    {{ course.rating }}
                  </span>
                </div>
                <el-button type="primary" size="small" class="course-btn">
                  开始学习
                </el-button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  VideoCamera, Reading, Grid, ArrowRight, TrendCharts, 
  Medal, Star, CaretTop, Cpu, Clock, Microphone, ChatDotRound, 
  Document 
} from '@element-plus/icons-vue'

const router = useRouter()

// 候选人信息
const candidateInfo = ref({
  name: '张三',
  avatar: '/images/candidate-avatar.svg',
  topSkills: [
    { name: 'Python', level: 'high' },
    { name: '机器学习', level: 'high' },
    { name: '深度学习', level: 'medium' },
    { name: 'TensorFlow', level: 'medium' }
  ]
})

// 面试统计数据
const interviewStats = ref({
  completed: 3,
  total: 5,
  averageScore: 87
})

// AI建议
const aiSuggestions = ref([
  {
    id: 1,
    type: 'voice',
    icon: 'Microphone',
    title: '语音表达优化',
    description: '建议在回答技术问题时语速稍微放慢，增加停顿以便思考'
  },
  {
    id: 2,
    type: 'content',
    icon: 'ChatDotRound',
    title: '内容结构改进',
    description: '可以采用STAR法则（情境-任务-行动-结果）来组织回答'
  },
  {
    id: 3,
    type: 'knowledge',
    icon: 'Document',
    title: '知识点补强',
    description: '建议加强对深度学习优化算法的理解和实践经验'
  }
])

// 推荐课程
const recommendedCourses = ref([
  {
    id: 1,
    title: '深度学习进阶实战',
    description: '从理论到实践，掌握深度学习核心算法',
    image: '/images/ai-chapter-1.jpg',
    difficulty: '中级',
    duration: '8小时',
    rating: '4.8'
  },
  {
    id: 2,
    title: '面试技巧与沟通艺术',
    description: '提升面试表现，掌握专业沟通技巧',
    image: '/images/placeholder-demo.svg',
    difficulty: '初级',
    duration: '4小时',
    rating: '4.9'
  }
])

// 方法
const startInterview = () => {
  router.push('/interview-selection')
}

const practiceMode = () => {
  router.push('/practice-mode')
}

const viewReports = () => {
  router.push('/reports')
}
</script>

<style scoped>
.candidate-portal {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%);
}

/* 候选人专属导航 */
.candidate-header {
  background: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  height: 32px;
  width: auto;
}

.portal-title {
  font-size: 18px;
  font-weight: 600;
  color: #1890ff;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-info {
  text-align: right;
}

.welcome-text {
  color: #64748b;
  font-size: 14px;
}

.user-name {
  color: #2c3e50;
  font-weight: 600;
  font-size: 16px;
}

/* 主要内容区域 */
.portal-main {
  padding: 40px 0;
}

.main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* 快速行动区域 */
.quick-actions-section {
  margin-bottom: 60px;
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 12px;
}

.section-subtitle {
  font-size: 1.125rem;
  color: #64748b;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.action-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
  cursor: pointer;
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.primary-action {
  background: linear-gradient(135deg, #1890ff 0%, #0066cc 100%);
  color: white;
}

.primary-action .card-title,
.primary-action .card-description {
  color: white;
}

.card-icon {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: white;
}

.practice-icon {
  background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
}

.report-icon {
  background: linear-gradient(135deg, #722ed1 0%, #531dab 100%);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 12px;
}

.card-description {
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 24px;
}

.action-btn {
  background: white;
  color: #1890ff;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
}

.secondary-btn {
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
}

/* 状态卡片 */
.status-section {
  margin-bottom: 60px;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.status-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.status-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.status-title {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.status-icon {
  color: #1890ff;
}

.progress-text {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 12px;
  display: block;
}

.score-display {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 12px;
}

.score-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1890ff;
}

.score-label {
  color: #64748b;
  font-size: 14px;
}

.score-trend {
  display: flex;
  align-items: center;
  gap: 4px;
}

.trend-up {
  color: #52c41a;
}

.trend-text {
  font-size: 14px;
  color: #52c41a;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  border-radius: 6px;
}

/* AI建议区域 */
.ai-suggestions-section {
  margin-bottom: 60px;
}

.suggestions-header {
  margin-bottom: 32px;
}

.suggestions-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.suggestions-subtitle {
  color: #64748b;
}

.suggestions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.suggestion-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  gap: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.suggestion-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.suggestion-icon.voice {
  background: linear-gradient(135deg, #1890ff 0%, #0066cc 100%);
}

.suggestion-icon.content {
  background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
}

.suggestion-icon.knowledge {
  background: linear-gradient(135deg, #722ed1 0%, #531dab 100%);
}

.suggestion-title {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
}

.suggestion-description {
  color: #64748b;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 12px;
}

/* 学习资源 */
.learning-section {
  margin-bottom: 60px;
}

.learning-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.learning-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.learning-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.course-image {
  position: relative;
  height: 160px;
  overflow: hidden;
}

.course-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #1890ff;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.course-content {
  padding: 20px;
}

.course-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
}

.course-description {
  color: #64748b;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 16px;
}

.course-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  font-size: 14px;
  color: #64748b;
}

.course-duration,
.course-rating {
  display: flex;
  align-items: center;
  gap: 4px;
}

.course-btn {
  width: 100%;
  border-radius: 6px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .actions-grid,
  .status-grid,
  .suggestions-grid,
  .learning-grid {
    grid-template-columns: 1fr;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .main-container {
    padding: 0 16px;
  }
}
</style>
