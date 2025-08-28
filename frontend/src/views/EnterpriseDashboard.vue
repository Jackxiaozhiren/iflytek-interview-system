<template>
  <div class="enterprise-dashboard enterprise-gradient">
    <!-- 企业端导航头部 -->
    <div class="enterprise-header gradient-hero-bg">
      <div class="optimized-container">
        <div class="header-container symmetric-layout">
          <div class="brand-section">
            <div class="brand-logo">
              <router-link to="/" class="brand-link">
                <img src="/images/iflytek-spark-logo.svg" alt="iFlytek Spark" class="logo-image" />
                <div class="brand-text-group">
                  <span class="brand-text optimized-title-h3" style="color: white;">iFlytek 企业招聘中心</span>
                  <div class="brand-subtitle optimized-text" style="color: rgba(255,255,255,0.9);">AI驱动的智能招聘管理平台</div>
                </div>
              </router-link>
            </div>
          </div>
          <div class="header-actions">
            <el-button type="primary" size="large" @click.stop.prevent="createBatchInterview">
              <el-icon><Plus /></el-icon>
              批量创建面试
            </el-button>
            <el-button @click.stop.prevent="managePositions">
              <el-icon><Setting /></el-icon>
              职位管理
            </el-button>
            <el-button @click.stop.prevent="viewReports">
              <el-icon><Grid /></el-icon>
              数据报表
            </el-button>

          </div>
        </div>
      </div>
    </div>

    <!-- 核心数据概览 -->
    <div class="enterprise-overview section-spacing gradient-fade-top">
      <div class="optimized-container">
        <div class="overview-title content-center">
          <h2 class="optimized-title-h2">招聘数据概览</h2>
          <p class="optimized-text">实时掌握企业招聘全局数据</p>
        </div>
        <div class="stats-grid equal-height-cards optimized-grid-4">
          <div class="stat-card primary optimized-card">
            <div class="stat-header">
              <el-icon class="stat-icon"><User /></el-icon>
              <span class="stat-trend up">+12%</span>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.totalCandidates }}</div>
              <div class="stat-label">候选人总数</div>
              <div class="stat-detail">本月新增 {{ stats.newCandidates }} 人</div>
            </div>
          </div>

          <div class="stat-card success">
            <div class="stat-header">
              <el-icon class="stat-icon"><VideoCamera /></el-icon>
              <span class="stat-trend up">+8%</span>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.totalInterviews }}</div>
              <div class="stat-label">面试总场次</div>
              <div class="stat-detail">今日进行 {{ stats.todayInterviews }} 场</div>
            </div>
          </div>

          <div class="stat-card warning">
            <div class="stat-header">
              <el-icon class="stat-icon"><TrendCharts /></el-icon>
              <span class="stat-trend up">+5%</span>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.avgScore }}分</div>
              <div class="stat-label">平均面试得分</div>
              <div class="stat-detail">较上月提升 {{ stats.scoreImprovement }}%</div>
            </div>
          </div>

          <div class="stat-card info">
            <div class="stat-header">
              <el-icon class="stat-icon"><Trophy /></el-icon>
              <span class="stat-trend up">+15%</span>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.passRate }}%</div>
              <div class="stat-label">面试通过率</div>
              <div class="stat-detail">优秀候选人 {{ stats.excellentCandidates }} 人</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 企业级功能模块 -->
    <div class="enterprise-modules">
      <div class="modules-container">
        <!-- 批量招聘管理 -->
        <div class="module-section">
          <div class="module-header">
            <h3>批量招聘管理</h3>
            <p>高效管理大规模招聘需求</p>
          </div>
          <div class="module-grid">
            <div class="module-card" @click="navigateTo('/batch-interview-setup')">
              <div class="module-icon batch">
                <el-icon><User /></el-icon>
              </div>
              <div class="module-content">
                <h4>批量面试</h4>
                <p>一键创建多场面试，支持同时面试多个候选人</p>
                <div class="module-stats">
                  <span>本月已创建 {{ batchStats.totalBatches }} 批次</span>
                </div>
              </div>
            </div>

            <div class="module-card" @click="navigateTo('/position-management')">
              <div class="module-icon position">
                <el-icon><Setting /></el-icon>
              </div>
              <div class="module-content">
                <h4>职位管理</h4>
                <p>统一管理企业所有招聘职位和要求</p>
                <div class="module-stats">
                  <span>活跃职位 {{ positionStats.activePositions }} 个</span>
                </div>
              </div>
            </div>

            <div class="module-card" @click="navigateTo('/candidate-pool')">
              <div class="module-icon pool">
                <el-icon><Collection /></el-icon>
              </div>
              <div class="module-content">
                <h4>人才库管理</h4>
                <p>建立企业专属人才库，长期维护候选人关系</p>
                <div class="module-stats">
                  <span>人才库 {{ talentPoolStats.totalTalents }} 人</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 功能模块状态指示器 -->
        <div class="module-section status-section">
          <div class="module-header">
            <h3>iFlytek Spark AI功能状态</h3>
            <p>实时监控各功能模块的AI集成状态</p>
          </div>
          <div class="status-grid">
            <div class="status-card">
              <div class="status-icon success">
                <el-icon><Star /></el-icon>
              </div>
              <div class="status-content">
                <h4>批量面试管理</h4>
                <p>AI智能分析已就绪</p>
                <el-tag type="success" size="small">已集成</el-tag>
              </div>
            </div>
            <div class="status-card">
              <div class="status-icon success">
                <el-icon><Star /></el-icon>
              </div>
              <div class="status-content">
                <h4>职位管理系统</h4>
                <p>AI助手功能正常</p>
                <el-tag type="success" size="small">已集成</el-tag>
              </div>
            </div>
            <div class="status-card">
              <div class="status-icon success">
                <el-icon><Star /></el-icon>
              </div>
              <div class="status-content">
                <h4>数据报表分析</h4>
                <p>AI洞察分析可用</p>
                <el-tag type="success" size="small">已集成</el-tag>
              </div>
            </div>
          </div>
        </div>

        <!-- 快速操作面板 -->
        <div class="module-section quick-actions-section">
          <div class="module-header">
            <h3>快速操作</h3>
            <p>一键访问常用功能，提升工作效率</p>
          </div>
          <div class="quick-actions-grid">
            <el-button
              type="primary"
              size="large"
              @click.stop="createBatchInterview"
              class="quick-action-btn"
            >
              <el-icon><Plus /></el-icon>
              <span>创建批量面试</span>
            </el-button>
            <el-button
              type="success"
              size="large"
              @click.stop="managePositions"
              class="quick-action-btn"
            >
              <el-icon><Setting /></el-icon>
              <span>管理职位</span>
            </el-button>
            <el-button
              type="warning"
              size="large"
              @click.stop="viewReports"
              class="quick-action-btn"
            >
              <el-icon><Grid /></el-icon>
              <span>查看报表</span>
            </el-button>
            <el-button
              type="info"
              size="large"
              @click="navigateTo('/candidate-pool')"
              class="quick-action-btn"
            >
              <el-icon><Collection /></el-icon>
              <span>人才库</span>
            </el-button>
          </div>
        </div>

        <!-- AI数据分析与可视化 -->
        <div class="module-section ai-analytics-section">
          <div class="module-header">
            <h3>AI数据分析与可视化</h3>
            <p>基于iFlytek Spark的深度数据洞察和智能报告</p>
          </div>
          <div class="analytics-container">
            <AIDataAnalytics />
          </div>
        </div>

        <!-- 数据分析与报表 -->
        <div class="module-section">
          <div class="module-header">
            <h3>数据分析与报表</h3>
            <p>深度洞察招聘数据，优化招聘策略</p>
          </div>
          <div class="analytics-grid">
            <div class="analytics-card">
              <div class="analytics-header">
                <h4>招聘漏斗分析</h4>
                <el-button text @click="viewFullReport('funnel')">查看详情</el-button>
              </div>
              <div class="analytics-content">
                <div class="funnel-stage" v-for="stage in funnelData" :key="stage.name">
                  <div class="stage-info">
                    <span class="stage-name">{{ stage.name }}</span>
                    <span class="stage-count">{{ stage.count }}</span>
                  </div>
                  <div class="stage-bar">
                    <div class="stage-progress" :style="{ width: stage.percentage + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="analytics-card">
              <div class="analytics-header">
                <h4>技能评估分布</h4>
                <el-button text @click="viewFullReport('skills')">查看详情</el-button>
              </div>
              <div class="analytics-content">
                <div class="skill-distribution">
                  <div class="skill-item" v-for="skill in skillDistribution" :key="skill.name">
                    <div class="skill-info">
                      <span class="skill-name">{{ skill.name }}</span>
                      <span class="skill-score">{{ skill.avgScore }}分</span>
                    </div>
                    <div class="skill-bar">
                      <div class="skill-progress" :style="{ width: (skill.avgScore / 100) * 100 + '%' }"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 智能面试流程管理 -->
        <div class="module-section smart-flow-section">
          <div class="module-header">
            <h3>智能面试流程管理</h3>
            <p>iFlytek Spark驱动的自适应面试流程</p>
          </div>
          <div class="flow-management-container">
            <SmartInterviewFlow />
          </div>
        </div>

        <!-- 多模态交互中心 -->
        <div class="module-section multimodal-hub-section">
          <div class="module-header">
            <h3>多模态交互监控中心</h3>
            <p>实时监控和优化面试交互体验</p>
          </div>
          <div class="multimodal-container">
            <MultimodalInteractionHub />
          </div>
        </div>

        <!-- iFlytek Spark AI能力展示 -->
        <div class="module-section ai-showcase-section">
          <div class="module-header">
            <h3>iFlytek Spark AI核心能力</h3>
            <p>展示领先的多模态AI面试技术优势</p>
          </div>
          <div class="ai-capabilities-grid">

            <!-- 视频分析能力 -->
            <div class="capability-card video-capability">
              <div class="capability-header">
                <div class="capability-icon">
                  <el-icon><VideoCamera /></el-icon>
                </div>
                <div class="capability-info">
                  <h4>视频情绪分析</h4>
                  <p>多维度情绪状态识别</p>
                </div>
              </div>
              <div class="capability-demo">
                <div class="emotion-indicators-mini">
                  <div class="emotion-item" v-for="emotion in aiMetrics.emotions" :key="emotion.name">
                    <span class="emotion-name">{{ emotion.name }}</span>
                    <div class="emotion-progress">
                      <div class="emotion-fill" :style="{ width: emotion.value + '%' }"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 智能评估能力 -->
            <div class="capability-card assessment-capability">
              <div class="capability-header">
                <div class="capability-icon">
                  <el-icon><TrendCharts /></el-icon>
                </div>
                <div class="capability-info">
                  <h4>智能能力评估</h4>
                  <p>12维度全方位分析</p>
                </div>
              </div>
              <div class="capability-demo">
                <div class="assessment-overview">
                  <div class="assessment-score">
                    <span class="score-value">{{ aiMetrics.overallScore }}</span>
                    <span class="score-label">综合评分</span>
                  </div>
                  <div class="assessment-dimensions">
                    <div class="dimension" v-for="dim in aiMetrics.dimensions" :key="dim.name">
                      <span class="dim-name">{{ dim.name }}</span>
                      <span class="dim-score">{{ dim.score }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 个性化智能推荐 -->
        <div class="module-section recommendation-section">
          <div class="module-header">
            <h3>个性化智能推荐系统</h3>
            <p>基于iFlytek Spark的智能候选人和策略推荐</p>
          </div>
          <div class="recommendation-container">
            <PersonalizedRecommendationEngine user-type="enterprise" />
          </div>
        </div>

        <!-- 智能推荐与洞察 -->
        <div class="module-section insights-section">
          <div class="module-header">
            <div class="header-title">
              <h3>AI智能洞察</h3>
              <p>基于iFlytek Spark的智能分析与建议</p>
            </div>
            <div class="header-actions">
              <el-button type="primary" size="small" @click="refreshInsights">
                <el-icon><Refresh /></el-icon>
                刷新洞察
              </el-button>
            </div>
          </div>
          <div class="insights-container">
            <div class="insights-grid">
              <div class="insight-card trend-card">
                <div class="insight-header">
                  <div class="insight-icon trend-icon">
                    <el-icon><TrendCharts /></el-icon>
                  </div>
                  <div class="insight-title-section">
                    <h4>招聘趋势预测</h4>
                    <span class="insight-priority high">高优先级</span>
                  </div>
                </div>
                <div class="insight-content">
                  <p>基于历史数据分析，预计下月AI领域候选人需求将增长25%</p>
                  <div class="insight-metrics">
                    <div class="metric-item">
                      <span class="metric-label">预测增长</span>
                      <span class="metric-value positive">+25%</span>
                    </div>
                    <div class="metric-item">
                      <span class="metric-label">置信度</span>
                      <span class="metric-value">87%</span>
                    </div>
                  </div>
                  <div class="insight-action">
                    <el-button text type="primary" size="small">
                      查看详细预测
                      <el-icon><ArrowRight /></el-icon>
                    </el-button>
                  </div>
                </div>
              </div>

              <div class="insight-card recommendation-card">
                <div class="insight-header">
                  <div class="insight-icon recommendation-icon">
                    <el-icon><Star /></el-icon>
                  </div>
                  <div class="insight-title-section">
                    <h4>优质候选人推荐</h4>
                    <span class="insight-priority medium">中优先级</span>
                  </div>
                </div>
                <div class="insight-content">
                  <p>系统为您推荐了3位高匹配度的AI工程师候选人</p>
                  <div class="insight-metrics">
                    <div class="metric-item">
                      <span class="metric-label">推荐数量</span>
                      <span class="metric-value">3位</span>
                    </div>
                    <div class="metric-item">
                      <span class="metric-label">匹配度</span>
                      <span class="metric-value positive">92%</span>
                    </div>
                  </div>
                  <div class="insight-action">
                    <el-button text type="primary" size="small">
                      查看推荐
                      <el-icon><ArrowRight /></el-icon>
                    </el-button>
                  </div>
                </div>
              </div>

              <div class="insight-card warning-card">
                <div class="insight-header">
                  <div class="insight-icon warning-icon">
                    <el-icon><Warning /></el-icon>
                  </div>
                  <div class="insight-title-section">
                    <h4>面试质量提醒</h4>
                    <span class="insight-priority high">高优先级</span>
                  </div>
                </div>
                <div class="insight-content">
                  <p>检测到部分面试官评分标准不一致，建议进行标准化培训</p>
                  <div class="insight-metrics">
                    <div class="metric-item">
                      <span class="metric-label">影响面试</span>
                      <span class="metric-value warning">15场</span>
                    </div>
                    <div class="metric-item">
                      <span class="metric-label">偏差程度</span>
                      <span class="metric-value warning">±12%</span>
                    </div>
                  </div>
                  <div class="insight-action">
                    <el-button text type="primary" size="small">
                      查看详情
                      <el-icon><ArrowRight /></el-icon>
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 企业端专业功能 -->
        <div class="module-section professional-features-section">
          <div class="module-header">
            <h3>企业端专业功能</h3>
            <p>批量面试管理、团队协作、人才库运营一体化解决方案</p>
          </div>
          <div class="professional-container">
            <EnterpriseProfessionalFeatures />
          </div>
        </div>

        <!-- 系统集成监控 -->
        <div class="module-section system-monitor-section">
          <div class="module-header">
            <h3>系统集成与性能监控</h3>
            <p>实时监控系统性能，确保最佳用户体验</p>
          </div>
          <div class="system-monitor-container">
            <SystemIntegrationMonitor />
          </div>
        </div>

        <!-- 最近活动 -->
        <div class="module-section">
          <div class="module-header">
            <h3>最近活动</h3>
            <p>实时跟踪招聘进展</p>
          </div>
          <div class="activity-timeline">
            <div class="timeline-item" v-for="activity in recentActivities" :key="activity.id">
              <div class="timeline-dot" :class="activity.type"></div>
              <div class="timeline-content">
                <div class="activity-title">{{ activity.title }}</div>
                <div class="activity-description">{{ activity.description }}</div>
                <div class="activity-time">{{ formatTime(activity.timestamp) }}</div>
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
import { ElMessage } from 'element-plus'
import SmartInterviewFlow from '../components/SmartInterviewFlow.vue'
import MultimodalInteractionHub from '../components/MultimodalInteractionHub.vue'
import AIDataAnalytics from '../components/AIDataAnalytics.vue'
import PersonalizedRecommendationEngine from '../components/PersonalizedRecommendationEngine.vue'
import EnterpriseProfessionalFeatures from '../components/EnterpriseProfessionalFeatures.vue'
import SystemIntegrationMonitor from '../components/SystemIntegrationMonitor.vue'
import {
  Plus, User, VideoCamera, TrendCharts, Clock,
  Setting, Grid, Document, VideoPlay,
  Collection, Star, Warning, Refresh, ArrowRight
} from '@element-plus/icons-vue'

const router = useRouter()

// 企业端核心数据
const stats = reactive({
  totalCandidates: 2456,
  newCandidates: 186,
  totalInterviews: 1834,
  todayInterviews: 23,
  avgScore: 85.6,
  scoreImprovement: 8.2,
  passRate: 68.5,
  excellentCandidates: 342
})

// 批量招聘统计
const batchStats = reactive({
  totalBatches: 45,
  activeBatches: 12,
  completedBatches: 33
})

// 职位管理统计
const positionStats = reactive({
  activePositions: 28,
  totalPositions: 156,
  urgentPositions: 5
})

// 人才库统计
const talentPoolStats = reactive({
  totalTalents: 8934,
  activeTalents: 2341,
  newTalents: 234
})

// 招聘漏斗数据
const funnelData = reactive([
  { name: '简历投递', count: 2456, percentage: 100 },
  { name: '初步筛选', count: 1834, percentage: 74.7 },
  { name: 'AI面试', count: 1245, percentage: 50.7 },
  { name: '人工复试', count: 687, percentage: 28.0 },
  { name: '最终录用', count: 234, percentage: 9.5 }
])

// 技能分布数据
const skillDistribution = reactive([
  { name: 'AI算法', avgScore: 82.5 },
  { name: '大数据处理', avgScore: 78.3 },
  { name: 'IoT开发', avgScore: 75.8 },
  { name: '系统架构', avgScore: 80.2 },
  { name: '项目管理', avgScore: 77.9 }
])

// 最近活动
const recentActivities = reactive([
  {
    id: 1,
    type: 'interview',
    title: '张三完成AI工程师面试',
    description: '综合得分85分，建议进入下一轮',
    timestamp: new Date(Date.now() - 1000 * 60 * 30)
  },
  {
    id: 2,
    type: 'batch',
    title: '批量面试任务创建成功',
    description: '为大数据开发岗位创建了15场面试',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2)
  },
  {
    id: 3,
    type: 'position',
    title: '新增IoT架构师职位',
    description: '职位要求已更新，开始接收简历',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4)
  }
])

// AI能力指标数据
const aiMetrics = reactive({
  speechAccuracy: 98.5,
  responseTime: 156,
  overallScore: 85,
  emotions: [
    { name: '自信', value: 85 },
    { name: '专业', value: 92 },
    { name: '紧张', value: 15 },
    { name: '友好', value: 88 }
  ],
  dimensions: [
    { name: '技术能力', score: 88 },
    { name: '沟通表达', score: 92 },
    { name: '逻辑思维', score: 85 },
    { name: '学习能力', score: 90 }
  ]
})

// 企业端方法
const createBatchInterview = (event) => {
  console.log('🎯 点击批量创建面试按钮')
  console.log('🎯 事件对象:', event)
  console.log('🎯 当前路由:', router.currentRoute.value.path)
  console.log('🎯 准备跳转到:', '/batch-interview-setup')

  // 阻止事件冒泡和默认行为
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }

  // 延迟执行路由跳转，确保事件处理完成
  setTimeout(() => {
    console.log('🎯 执行路由跳转')
    router.push('/batch-interview-setup').then(() => {
      console.log('✅ 路由跳转成功')
    }).catch((error) => {
      console.error('❌ 路由跳转失败:', error)
    })
  }, 100)
}

const managePositions = (event) => {
  console.log('🎯 点击职位管理按钮')
  console.log('🎯 事件对象:', event)
  console.log('🎯 当前路由:', router.currentRoute.value.path)
  console.log('🎯 准备跳转到:', '/position-management')

  // 阻止事件冒泡和默认行为
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }

  // 延迟执行路由跳转
  setTimeout(() => {
    console.log('🎯 执行路由跳转')
    router.push('/position-management').then(() => {
      console.log('✅ 路由跳转成功')
    }).catch((error) => {
      console.error('❌ 路由跳转失败:', error)
    })
  }, 100)
}

const viewReports = (event) => {
  console.log('🎯 点击数据报表按钮')
  console.log('🎯 事件对象:', event)
  console.log('🎯 当前路由:', router.currentRoute.value.path)
  console.log('🎯 准备跳转到:', '/enterprise-reports')

  // 阻止事件冒泡和默认行为
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }

  // 延迟执行路由跳转
  setTimeout(() => {
    console.log('🎯 执行路由跳转')
    router.push('/enterprise-reports').then(() => {
      console.log('✅ 路由跳转成功')
    }).catch((error) => {
      console.error('❌ 路由跳转失败:', error)
    })
  }, 100)
}

const navigateTo = (path) => {
  console.log('🎯 navigateTo 方法调用，跳转到:', path)
  router.push(path)
}

// 刷新洞察数据
const refreshInsights = () => {
  console.log('🔄 刷新AI洞察数据')
  // 这里可以添加实际的数据刷新逻辑
  ElMessage.success('洞察数据已刷新')
}



const viewFullReport = (type) => {
  router.push(`/reports/${type}`)
}

const formatTime = (date) => {
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 60) {
    return `${minutes}分钟前`
  } else if (hours < 24) {
    return `${hours}小时前`
  } else {
    return `${days}天前`
  }
}

onMounted(() => {
  console.log('企业端管理中心已加载')

  // 启动AI演示动画
  setTimeout(() => {
    // AI指标数据动画
    setInterval(() => {
      aiMetrics.speechAccuracy = 98.5 + (Math.random() - 0.5) * 0.8
      aiMetrics.responseTime = 156 + Math.floor((Math.random() - 0.5) * 30)
      aiMetrics.overallScore = 85 + Math.floor((Math.random() - 0.5) * 8)

      // 情绪数据动画
      aiMetrics.emotions.forEach(emotion => {
        emotion.value = Math.max(10, Math.min(95, emotion.value + (Math.random() - 0.5) * 8))
      })

      // 维度评分动画
      aiMetrics.dimensions.forEach(dim => {
        dim.score = Math.max(70, Math.min(95, dim.score + (Math.random() - 0.5) * 4))
      })
    }, 3000)
  }, 1000)
})
</script>

<style scoped>
/* 导入优化系统 */
@import '@/styles/gradient-background-system.css';
@import '@/styles/layout-optimization.css';

.enterprise-dashboard {
  min-height: 100vh;
}

/* 企业端头部样式 - 响应式优化 */
.enterprise-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: var(--space-responsive-xl) 0;
  margin-bottom: var(--space-responsive-xl);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-responsive-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-responsive-md);
}

.brand-section {
  flex: 1;
}

.brand-logo {
  display: flex;
  align-items: center;
}

.brand-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
}

.brand-link:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.logo-image {
  width: var(--icon-xl);
  height: var(--icon-xl);
  margin-right: var(--space-responsive-md);
  object-fit: contain;
  /* 移除filter以显示原始的iFlytek品牌色彩 */
}

.brand-text-group {
  display: flex;
  flex-direction: column;
}

.brand-text {
  font-size: var(--font-2xl);
  font-weight: 600;
  color: #ffffff;
  line-height: 1.2;
  white-space: nowrap;
}

.brand-subtitle {
  font-size: var(--font-base);
  color: rgba(255, 255, 255, 0.8);
  margin-top: var(--space-responsive-xs);
}

.header-actions {
  display: flex;
  gap: var(--space-responsive-md);
  flex-wrap: wrap;
}

.header-actions .el-button {
  height: var(--btn-height-lg);
  padding: 0 var(--space-responsive-lg);
  font-size: var(--font-base);
  border-radius: var(--radius-md);
  white-space: nowrap;
  min-width: 120px;
}

/* 数据概览样式 - 响应式优化 */
.enterprise-overview {
  margin-bottom: var(--space-responsive-xl);
}

.overview-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-responsive-lg);
}

.overview-title {
  text-align: center;
  margin-bottom: var(--space-responsive-xl);
}

.overview-title h2 {
  font-size: var(--font-3xl);
  color: #2c3e50;
  margin-bottom: var(--space-responsive-sm);
}

.overview-title p {
  font-size: var(--font-lg);
  color: #7f8c8d;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-responsive-lg);
  margin-bottom: var(--space-responsive-xl);
}

.stat-card {
  background: white;
  border-radius: var(--radius-xl);
  padding: var(--space-responsive-lg);
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
  border-left: 4px solid #3498db;
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
  margin-bottom: var(--space-responsive-md);
}

.stat-icon {
  font-size: var(--icon-lg);
  color: #667eea;
}

.stat-trend {
  font-size: var(--font-sm);
  font-weight: 600;
  padding: var(--space-responsive-xs) var(--space-responsive-sm);
  border-radius: var(--radius-lg);
  background: #e8f5e8;
  color: #27ae60;
}

.stat-trend.up {
  background: #e8f5e8;
  color: #27ae60;
}

.stat-trend.down {
  background: #fdf2f2;
  color: #e74c3c;
}

.stat-content {
  text-align: left;
}

.stat-value {
  font-size: var(--font-4xl);
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: var(--space-responsive-sm);
  line-height: 1;
}

.stat-label {
  font-size: var(--font-lg);
  color: #7f8c8d;
  margin-bottom: var(--space-responsive-xs);
}

.stat-detail {
  font-size: var(--font-sm);
  color: #95a5a6;
}

/* 企业模块样式 - 响应式优化 */
.enterprise-modules {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-responsive-lg);
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
  background: linear-gradient(90deg, #667eea, #764ba2);
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

.module-icon.batch {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.module-icon.position {
  background: linear-gradient(135deg, #f093fb, #f5576c);
}

.module-icon.pool {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
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

/* 分析报表样式 */
.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.analytics-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.analytics-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ecf0f1;
}

.analytics-header h4 {
  font-size: 18px;
  color: #2c3e50;
}

.funnel-stage, .skill-item {
  margin-bottom: 16px;
}

.stage-info, .skill-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.stage-name, .skill-name {
  font-size: 14px;
  color: #2c3e50;
}

.stage-count, .skill-score {
  font-size: 14px;
  font-weight: 600;
  color: #667eea;
}

.stage-bar, .skill-bar {
  height: 8px;
  background: #ecf0f1;
  border-radius: 4px;
  overflow: hidden;
}

.stage-progress, .skill-progress {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 4px;
  transition: width 0.3s ease;
}

/* 智能洞察样式 - 使用更高优先级的选择器 */
.module-section.insights-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 48px !important; /* 统一与其他模块的间距 - 使用!important确保优先级 */
}

.module-section.insights-section .module-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px !important; /* 统一与其他模块的header间距 */
  padding-bottom: 16px;
  border-bottom: 1px solid #e9ecef;
  text-align: left !important; /* 覆盖默认的center对齐 */
}

.module-section.insights-section .header-title h3 {
  font-size: 28px !important; /* 统一与其他模块的字体大小 */
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 8px !important; /* 统一与其他模块的间距 */
}

.module-section.insights-section .header-title p {
  color: #7f8c8d !important; /* 统一与其他模块的颜色 */
  font-size: 16px !important; /* 统一与其他模块的字体大小 */
  margin: 0;
}

.insights-container {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  min-height: 200px; /* 确保容器有最小高度 */
}

.module-section.insights-section .insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)) !important; /* 统一与其他模块的最小宽度 */
  gap: 24px !important; /* 统一与其他模块的间距 */
}

.module-section.insights-section .insight-card {
  background: white;
  border: 1px solid #f1f5f9;
  border-radius: 16px !important; /* 统一与其他模块的圆角 */
  padding: 32px !important; /* 统一与其他模块的内边距 */
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important; /* 统一与其他模块的阴影 */
  cursor: pointer; /* 统一与其他模块的交互样式 */
}

.insight-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(135deg, #1890ff 0%, #0066cc 100%);
  transition: width 0.3s ease;
}

.module-section.insights-section .insight-card:hover {
  transform: translateY(-4px) !important; /* 统一与其他模块的hover效果 */
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15) !important; /* 统一与其他模块的hover阴影 */
  border-color: #1890ff !important;
}

.insight-card:hover::before {
  width: 6px;
}

.trend-card::before {
  background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
}

.recommendation-card::before {
  background: linear-gradient(135deg, #722ed1 0%, #531dab 100%);
}

.warning-card::before {
  background: linear-gradient(135deg, #fa8c16 0%, #d46b08 100%);
}

.insight-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 12px;
  min-height: 48px; /* 确保header有统一的最小高度 */
}

.insight-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: white;
  flex-shrink: 0;
}

.trend-icon {
  background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
}

.recommendation-icon {
  background: linear-gradient(135deg, #722ed1 0%, #531dab 100%);
}

.warning-icon {
  background: linear-gradient(135deg, #fa8c16 0%, #d46b08 100%);
}

.insight-title-section {
  flex: 1;
  min-width: 0;
}

.insight-title-section h4 {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 4px 0;
  line-height: 1.3;
}

.insight-priority {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.insight-priority.high {
  background: #fff2e8;
  color: #fa8c16;
}

.insight-priority.medium {
  background: #f6ffed;
  color: #52c41a;
}

.insight-content {
  margin-top: 12px;
  min-height: 120px; /* 确保内容区域有最小高度 */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.insight-content p {
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 16px;
  flex-grow: 1; /* 让文本内容占据可用空间 */
}

.insight-metrics {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.metric-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.metric-label {
  font-size: 11px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.metric-value {
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
}

.metric-value.positive {
  color: #52c41a;
}

.metric-value.warning {
  color: #fa8c16;
}

.insight-action {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

/* 活动时间线样式 */
.activity-timeline {
  position: relative;
  padding-left: 32px;
}

.activity-timeline::before {
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
  background: #667eea;
  border: 3px solid white;
  box-shadow: 0 0 0 2px #ecf0f1;
}

.timeline-dot.interview {
  background: #2ecc71;
}

.timeline-dot.batch {
  background: #f39c12;
}

.timeline-dot.position {
  background: #9b59b6;
}

.timeline-content {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  flex: 1;
}

.activity-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
}

.activity-description {
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 8px;
}

.activity-time {
  font-size: 12px;
  color: #95a5a6;
}

/* AI能力展示样式 */
.ai-showcase-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 40px;
}

.ai-capabilities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
}

.capability-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.capability-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.capability-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
}



.video-capability::before {
  background: var(--iflytek-gradient-accent);
}

.assessment-capability::before {
  background: var(--iflytek-gradient-secondary);
}

.capability-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.capability-icon {
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



.video-capability .capability-icon {
  background: var(--iflytek-gradient-accent);
}

.assessment-capability .capability-icon {
  background: var(--iflytek-gradient-secondary);
}

.capability-info h4 {
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 4px;
}

.capability-info p {
  font-size: 14px;
  color: #7f8c8d;
  margin: 0;
}

.capability-demo {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 16px;
  min-height: 120px;
}



.capability-metrics {
  display: flex;
  justify-content: space-around;
  gap: 16px;
}

.metric {
  text-align: center;
  background: white;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  flex: 1;
}

.metric-value {
  display: block;
  font-size: 18px;
  font-weight: 700;
  color: var(--iflytek-primary);
  margin-bottom: 4px;
}

.metric-label {
  font-size: 12px;
  color: #7f8c8d;
}

/* 情绪指标样式 */
.emotion-indicators-mini {
  space-y: 8px;
}

.emotion-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.emotion-name {
  font-size: 12px;
  color: #2c3e50;
  min-width: 40px;
}

.emotion-progress {
  flex: 1;
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
  margin-left: 8px;
  overflow: hidden;
}

.emotion-fill {
  height: 100%;
  background: linear-gradient(90deg, #43e97b, #38f9d7);
  border-radius: 3px;
  transition: width 0.3s ease;
}

/* 评估概览样式 */
.assessment-overview {
  text-align: center;
}

.assessment-score {
  margin-bottom: 16px;
}

.score-value {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: #fa709a;
  margin-bottom: 4px;
}

.score-label {
  font-size: 12px;
  color: #7f8c8d;
}

.assessment-dimensions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.dimension {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 8px 12px;
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.dim-name {
  font-size: 11px;
  color: #2c3e50;
}

.dim-score {
  font-size: 12px;
  font-weight: 700;
  color: #fa709a;
}

/* 智能流程、多模态中心、AI分析、推荐系统、专业功能和系统监控样式 */
.smart-flow-section,
.multimodal-hub-section,
.ai-analytics-section,
.recommendation-section,
.professional-features-section,
.system-monitor-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 40px;
}

.flow-management-container,
.multimodal-container,
.analytics-container,
.recommendation-container,
.professional-container,
.system-monitor-container {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.smart-flow-section .module-header h3,
.multimodal-hub-section .module-header h3,
.ai-analytics-section .module-header h3,
.recommendation-section .module-header h3,
.professional-features-section .module-header h3,
.system-monitor-section .module-header h3 {
  color: #2c3e50;
  font-size: 24px;
  margin-bottom: 8px;
}

.smart-flow-section .module-header p,
.multimodal-hub-section .module-header p,
.ai-analytics-section .module-header p,
.recommendation-section .module-header p,
.professional-features-section .module-header p,
.system-monitor-section .module-header p {
  color: #7f8c8d;
  font-size: 16px;
  margin-bottom: 24px;
}

/* 响应式设计 - 使用响应式框架 */
@media (max-width: 1024px) {
  .header-container {
    flex-wrap: wrap;
    gap: var(--space-responsive-md);
  }

  .header-actions {
    flex-wrap: wrap;
    gap: var(--space-responsive-sm);
  }

  .header-actions .el-button {
    min-width: 100px;
    font-size: var(--font-sm);
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-responsive-md);
  }

  .module-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-responsive-lg);
  }

  .module-section.insights-section {
    padding: var(--space-responsive-xl) !important;
    margin-bottom: var(--space-responsive-2xl) !important;
  }

  .module-section.insights-section .insights-grid {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: var(--space-responsive-lg) !important;
  }

  .module-section.insights-section .insight-card {
    padding: var(--space-responsive-lg) !important;
  }
}

@media (max-width: 768px) {
  .enterprise-dashboard {
    overflow-x: hidden;
  }

  .header-container {
    flex-direction: column;
    gap: var(--space-responsive-lg);
    text-align: center;
    padding: 0 var(--space-responsive-md);
  }

  .brand-text {
    font-size: var(--font-xl);
  }

  .brand-subtitle {
    font-size: var(--font-sm);
  }

  .header-actions {
    width: 100%;
    justify-content: center;
    flex-direction: column;
    gap: var(--space-responsive-sm);
  }

  .header-actions .el-button {
    width: 100%;
    max-width: 280px;
    height: var(--btn-height-md);
    font-size: var(--font-sm);
  }

  .overview-container,
  .modules-container {
    padding: 0 var(--space-responsive-md);
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: var(--space-responsive-md);
  }

  .stat-value {
    font-size: var(--font-3xl);
  }

  .overview-title h2 {
    font-size: var(--font-2xl);
  }

  .smart-flow-section,
  .multimodal-hub-section,
  .ai-analytics-section,
  .recommendation-section,
  .professional-features-section,
  .system-monitor-section {
    padding: 20px 16px;
  }

  .flow-management-container,
  .multimodal-container,
  .analytics-container,
  .recommendation-container,
  .professional-container,
  .system-monitor-container {
    padding: 16px;
  }

  .ai-capabilities-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .capability-metrics {
    flex-direction: column;
    gap: 8px;
  }

  .assessment-dimensions {
    grid-template-columns: 1fr;
    gap: 16px;
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

  .analytics-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .module-section.insights-section {
    padding: 32px !important; /* 统一与桌面端的内边距 */
    margin-bottom: 48px !important; /* 统一与桌面端的间距 */
  }

  .module-section.insights-section .module-header {
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 12px !important;
    margin-bottom: 24px !important; /* 调整移动端的header间距 */
  }

  .insights-container {
    padding: 20px;
  }

  .module-section.insights-section .insights-grid {
    grid-template-columns: 1fr !important;
    gap: 16px !important;
  }

  .module-section.insights-section .insight-card {
    padding: 20px !important; /* 统一与其他模块的移动端padding */
  }

  .insight-metrics {
    flex-direction: column;
    gap: 8px;
  }

  .metric-item {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .status-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .quick-actions-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}

/* 状态指示器样式 */
.status-section {
  margin: 32px 0;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.status-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
}

.status-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.status-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.status-icon.success {
  background: linear-gradient(135deg, #52c41a, #73d13d);
  color: white;
}

.status-content h4 {
  margin: 0 0 8px 0;
  color: #1f2937;
  font-weight: 600;
}

.status-content p {
  margin: 0 0 8px 0;
  color: #6b7280;
  font-size: 14px;
}

/* 快速操作面板样式 */
.quick-actions-section {
  margin: 32px 0;
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.quick-action-btn {
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-responsive-sm);
  border-radius: var(--radius-lg);
  font-weight: 600;
  transition: all 0.3s ease;
}

/* 超小屏幕优化 */
@media (max-width: 480px) {
  .header-container {
    padding: 0 var(--space-responsive-sm);
  }

  .brand-text {
    font-size: var(--font-lg);
  }

  .brand-subtitle {
    display: none;
  }

  .overview-container,
  .modules-container {
    padding: 0 var(--space-responsive-sm);
  }

  .stat-card {
    padding: var(--space-responsive-md);
  }

  .stat-value {
    font-size: var(--font-2xl);
  }

  .stat-icon {
    font-size: var(--icon-base);
  }

  .header-actions .el-button {
    height: var(--btn-height-sm);
    font-size: var(--font-xs);
    padding: 0 var(--space-responsive-md);
  }

  .overview-title h2 {
    font-size: var(--font-xl);
  }

  .overview-title p {
    font-size: var(--font-base);
  }
}

/* 大屏幕优化 */
@media (min-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .header-actions .el-button {
    min-width: 140px;
  }

  .stat-value {
    font-size: clamp(36px, 4vw, 42px);
  }
}

.quick-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.quick-action-btn .el-icon {
  font-size: 20px;
}

.quick-action-btn span {
  font-size: 14px;
}
</style>

<!-- 引入企业管理界面布局修复样式 -->
<style src="../styles/enterprise-dashboard-fixes.css"></style>
