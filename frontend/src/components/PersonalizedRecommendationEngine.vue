<template>
  <div class="personalized-recommendation-engine">
    <!-- 推荐引擎控制台 -->
    <div class="recommendation-console">
      <div class="console-header">
        <h3>iFlytek Spark 个性化推荐引擎</h3>
        <div class="engine-status">
          <el-tag :type="engineStatus.type" size="large">
            {{ engineStatus.text }}
          </el-tag>
          <div class="engine-metrics">
            <span class="metric-item">
              <el-icon><TrendCharts /></el-icon>
              匹配精度: {{ engineMetrics.accuracy }}%
            </span>
            <span class="metric-item">
              <el-icon><Timer /></el-icon>
              响应时间: {{ engineMetrics.responseTime }}ms
            </span>
          </div>
        </div>
      </div>

      <!-- 推荐模式选择 -->
      <div class="recommendation-modes">
        <div class="mode-selector">
          <el-radio-group v-model="selectedMode" @change="onModeChange">
            <el-radio-button value="intelligent">智能推荐</el-radio-button>
            <el-radio-button value="collaborative">协同过滤</el-radio-button>
            <el-radio-button value="content">内容匹配</el-radio-button>
            <el-radio-button value="hybrid">混合模式</el-radio-button>
          </el-radio-group>
        </div>
        <div class="mode-description">
          <p>{{ getModeDescription(selectedMode) }}</p>
        </div>
      </div>
    </div>

    <!-- 企业端推荐 -->
    <div class="enterprise-recommendations" v-if="userType === 'enterprise'">
      <div class="recommendations-header">
        <h4>企业智能推荐</h4>
        <div class="recommendation-filters">
          <el-select v-model="enterpriseFilter.position" placeholder="选择职位">
            <el-option label="前端工程师" value="frontend" />
            <el-option label="后端工程师" value="backend" />
            <el-option label="全栈工程师" value="fullstack" />
            <el-option label="算法工程师" value="algorithm" />
          </el-select>
          <el-select v-model="enterpriseFilter.experience" placeholder="经验要求">
            <el-option label="1-3年" value="junior" />
            <el-option label="3-5年" value="mid" />
            <el-option label="5年以上" value="senior" />
          </el-select>
        </div>
      </div>

      <div class="recommendation-sections">
        <!-- 候选人推荐 -->
        <div class="recommendation-section candidate-recommendations">
          <div class="section-header">
            <h5>优质候选人推荐</h5>
            <div class="recommendation-count">
              <el-badge :value="candidateRecommendations.length" type="primary">
                <el-button size="small">查看全部</el-button>
              </el-badge>
            </div>
          </div>
          <div class="candidates-grid">
            <div class="candidate-card" v-for="candidate in candidateRecommendations" :key="candidate.id">
              <div class="candidate-avatar">
                <img :src="candidate.avatar" :alt="candidate.name" />
                <div class="match-score">{{ candidate.matchScore }}%</div>
              </div>
              <div class="candidate-info">
                <h6>{{ candidate.name }}</h6>
                <div class="candidate-position">{{ candidate.position }}</div>
                <div class="candidate-experience">{{ candidate.experience }}年经验</div>
                <div class="candidate-skills">
                  <el-tag v-for="skill in candidate.skills.slice(0, 3)" :key="skill" size="small">
                    {{ skill }}
                  </el-tag>
                </div>
              </div>
              <div class="candidate-actions">
                <el-button size="small" type="primary" @click="inviteCandidate(candidate)">
                  邀请面试
                </el-button>
                <el-button size="small" @click="viewCandidateProfile(candidate)">
                  查看详情
                </el-button>
              </div>
              <div class="recommendation-reason">
                <small>推荐理由: {{ candidate.reason }}</small>
              </div>
            </div>
          </div>
        </div>

        <!-- 面试题目推荐 -->
        <div class="recommendation-section question-recommendations">
          <div class="section-header">
            <h5>智能题目推荐</h5>
            <div class="difficulty-filter">
              <el-radio-group v-model="questionDifficulty" size="small">
                <el-radio-button value="easy">简单</el-radio-button>
                <el-radio-button value="medium">中等</el-radio-button>
                <el-radio-button value="hard">困难</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div class="questions-list">
            <div class="question-item" v-for="question in questionRecommendations" :key="question.id">
              <div class="question-header">
                <div class="question-category">
                  <el-tag :type="getCategoryType(question.category)">{{ question.category }}</el-tag>
                </div>
                <div class="question-difficulty">
                  <el-rate v-model="question.difficulty" disabled show-score />
                </div>
              </div>
              <div class="question-content">
                <h6>{{ question.title }}</h6>
                <p>{{ question.description }}</p>
              </div>
              <div class="question-metadata">
                <div class="metadata-item">
                  <span class="metadata-label">预计时长:</span>
                  <span class="metadata-value">{{ question.duration }}分钟</span>
                </div>
                <div class="metadata-item">
                  <span class="metadata-label">通过率:</span>
                  <span class="metadata-value">{{ question.passRate }}%</span>
                </div>
                <div class="metadata-item">
                  <span class="metadata-label">使用次数:</span>
                  <span class="metadata-value">{{ question.usageCount }}</span>
                </div>
              </div>
              <div class="question-actions">
                <el-button size="small" type="primary" @click="addToInterview(question)">
                  添加到面试
                </el-button>
                <el-button size="small" @click="previewQuestion(question)">
                  预览题目
                </el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 面试策略推荐 -->
        <div class="recommendation-section strategy-recommendations">
          <div class="section-header">
            <h5>面试策略建议</h5>
          </div>
          <div class="strategies-grid">
            <div class="strategy-card" v-for="strategy in strategyRecommendations" :key="strategy.id">
              <div class="strategy-icon" :style="{ backgroundColor: strategy.color }">
                <el-icon>
                  <component :is="strategy.icon" />
                </el-icon>
              </div>
              <div class="strategy-content">
                <h6>{{ strategy.title }}</h6>
                <p>{{ strategy.description }}</p>
                <div class="strategy-benefits">
                  <div class="benefit-item" v-for="benefit in strategy.benefits" :key="benefit">
                    <el-icon><Check /></el-icon>
                    <span>{{ benefit }}</span>
                  </div>
                </div>
              </div>
              <div class="strategy-actions">
                <el-button size="small" type="primary" @click="applyStrategy(strategy)">
                  应用策略
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 候选人端推荐 -->
    <div class="candidate-recommendations-panel" v-if="userType === 'candidate'">
      <div class="recommendations-header">
        <h4>个性化学习推荐</h4>
        <div class="learning-progress">
          <span class="progress-label">学习进度</span>
          <el-progress :percentage="learningProgress" :color="getProgressColor(learningProgress)" />
        </div>
      </div>

      <div class="learning-sections">
        <!-- 技能提升推荐 -->
        <div class="learning-section skill-improvement">
          <div class="section-header">
            <h5>技能提升建议</h5>
            <div class="skill-level">
              <el-select v-model="skillLevel" placeholder="选择当前水平">
                <el-option label="初级" value="beginner" />
                <el-option label="中级" value="intermediate" />
                <el-option label="高级" value="advanced" />
              </el-select>
            </div>
          </div>
          <div class="skills-roadmap">
            <div class="roadmap-item" v-for="skill in skillRoadmap" :key="skill.id">
              <div class="roadmap-step" :class="{ completed: skill.completed, current: skill.current }">
                <div class="step-number">{{ skill.step }}</div>
                <div class="step-content">
                  <h6>{{ skill.name }}</h6>
                  <p>{{ skill.description }}</p>
                  <div class="step-resources">
                    <el-tag v-for="resource in skill.resources" :key="resource" size="small">
                      {{ resource }}
                    </el-tag>
                  </div>
                </div>
                <div class="step-actions">
                  <el-button v-if="!skill.completed" size="small" type="primary" @click="startLearning(skill)">
                    开始学习
                  </el-button>
                  <el-button v-else size="small" disabled>
                    <el-icon><Check /></el-icon>
                    已完成
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 面试准备推荐 -->
        <div class="learning-section interview-preparation">
          <div class="section-header">
            <h5>面试准备指导</h5>
          </div>
          <div class="preparation-categories">
            <div class="category-tab" v-for="category in preparationCategories" :key="category.id">
              <div class="category-header" @click="toggleCategory(category)">
                <div class="category-icon" :style="{ backgroundColor: category.color }">
                  <el-icon>
                    <component :is="category.icon" />
                  </el-icon>
                </div>
                <div class="category-info">
                  <h6>{{ category.name }}</h6>
                  <div class="category-progress">
                    <el-progress :percentage="category.progress" size="small" :show-text="false" />
                    <span class="progress-text">{{ category.progress }}%</span>
                  </div>
                </div>
                <div class="category-toggle">
                  <el-icon>
                    <component :is="category.expanded ? 'ArrowUp' : 'ArrowDown'" />
                  </el-icon>
                </div>
              </div>
              <div class="category-content" v-show="category.expanded">
                <div class="preparation-item" v-for="item in category.items" :key="item.id">
                  <div class="item-header">
                    <span class="item-title">{{ item.title }}</span>
                    <el-tag :type="item.completed ? 'success' : 'info'" size="small">
                      {{ item.completed ? '已完成' : '待完成' }}
                    </el-tag>
                  </div>
                  <div class="item-description">{{ item.description }}</div>
                  <div class="item-actions">
                    <el-button size="small" type="primary" @click="startPreparation(item)">
                      {{ item.completed ? '复习' : '开始' }}
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 职位匹配推荐 -->
        <div class="learning-section job-matching">
          <div class="section-header">
            <h5>职位匹配推荐</h5>
            <div class="matching-filter">
              <el-select v-model="jobFilter.location" placeholder="期望地点">
                <el-option label="北京" value="beijing" />
                <el-option label="上海" value="shanghai" />
                <el-option label="深圳" value="shenzhen" />
                <el-option label="杭州" value="hangzhou" />
              </el-select>
            </div>
          </div>
          <div class="job-recommendations">
            <div class="job-card" v-for="job in jobRecommendations" :key="job.id">
              <div class="job-header">
                <div class="company-logo">
                  <img :src="job.companyLogo" :alt="job.company" />
                </div>
                <div class="job-basic-info">
                  <h6>{{ job.title }}</h6>
                  <div class="company-name">{{ job.company }}</div>
                  <div class="job-location">{{ job.location }}</div>
                </div>
                <div class="match-indicator">
                  <div class="match-circle" :style="{ '--match-percentage': job.matchPercentage + '%' }">
                    <span class="match-text">{{ job.matchPercentage }}%</span>
                  </div>
                </div>
              </div>
              <div class="job-details">
                <div class="job-requirements">
                  <h6>技能要求</h6>
                  <div class="requirements-list">
                    <span 
                      v-for="req in job.requirements" 
                      :key="req.skill"
                      class="requirement-tag"
                      :class="{ matched: req.matched }"
                    >
                      {{ req.skill }}
                    </span>
                  </div>
                </div>
                <div class="job-benefits">
                  <div class="benefit-item">
                    <span class="benefit-label">薪资范围:</span>
                    <span class="benefit-value">{{ job.salary }}</span>
                  </div>
                  <div class="benefit-item">
                    <span class="benefit-label">工作经验:</span>
                    <span class="benefit-value">{{ job.experience }}</span>
                  </div>
                </div>
              </div>
              <div class="job-actions">
                <el-button size="small" type="primary" @click="applyJob(job)">
                  立即申请
                </el-button>
                <el-button size="small" @click="viewJobDetails(job)">
                  查看详情
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 推荐效果分析 -->
    <div class="recommendation-analytics">
      <div class="analytics-header">
        <h4>推荐效果分析</h4>
        <div class="analytics-controls">
          <el-date-picker
            v-model="analyticsDateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="small"
          />
        </div>
      </div>
      <div class="analytics-metrics">
        <div class="metric-card" v-for="metric in analyticsMetrics" :key="metric.name">
          <div class="metric-icon" :style="{ backgroundColor: metric.color }">
            <el-icon>
              <component :is="metric.icon" />
            </el-icon>
          </div>
          <div class="metric-content">
            <div class="metric-value">{{ metric.value }}</div>
            <div class="metric-label">{{ metric.name }}</div>
            <div class="metric-change" :class="{ positive: metric.change > 0, negative: metric.change < 0 }">
              <el-icon>
                <component :is="metric.change > 0 ? 'ArrowUp' : 'ArrowDown'" />
              </el-icon>
              {{ Math.abs(metric.change) }}%
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
  TrendCharts, Timer, Check, ArrowUp, ArrowDown, User,
  Document, Setting, Medal, Grid
} from '@element-plus/icons-vue'

// Props定义
const props = defineProps({
  userType: {
    type: String,
    default: 'enterprise' // 'enterprise' | 'candidate'
  }
})

// 基础状态
const selectedMode = ref('intelligent')
const questionDifficulty = ref('medium')
const skillLevel = ref('intermediate')
const analyticsDateRange = ref([])

// 引擎状态
const engineStatus = reactive({
  type: 'success',
  text: '运行正常'
})

const engineMetrics = reactive({
  accuracy: 94.2,
  responseTime: 156
})

// 企业端过滤器
const enterpriseFilter = reactive({
  position: 'frontend',
  experience: 'mid'
})

// 候选人端过滤器
const jobFilter = reactive({
  location: 'beijing'
})

const learningProgress = ref(68)

// 候选人推荐数据
const candidateRecommendations = reactive([
  {
    id: 1,
    name: '张小明',
    avatar: '/images/placeholder-demo.jpg',
    position: '前端工程师',
    experience: 3,
    matchScore: 92,
    skills: ['Vue.js', 'React', 'TypeScript', 'Node.js'],
    reason: '技能匹配度高，项目经验丰富'
  },
  {
    id: 2,
    name: '李小红',
    avatar: '/images/placeholder-demo.jpg',
    position: '前端工程师',
    experience: 4,
    matchScore: 88,
    skills: ['React', 'Angular', 'JavaScript', 'CSS3'],
    reason: '工作经验符合要求，技术栈匹配'
  },
  {
    id: 3,
    name: '王小华',
    avatar: '/images/placeholder-demo.jpg',
    position: '前端工程师',
    experience: 2,
    matchScore: 85,
    skills: ['Vue.js', 'JavaScript', 'HTML5', 'Webpack'],
    reason: '学习能力强，发展潜力大'
  }
])

// 题目推荐数据
const questionRecommendations = reactive([
  {
    id: 1,
    title: 'Vue.js组件通信方式',
    description: '请详细说明Vue.js中父子组件、兄弟组件之间的通信方式，并举例说明使用场景。',
    category: '前端框架',
    difficulty: 3,
    duration: 15,
    passRate: 78,
    usageCount: 245
  },
  {
    id: 2,
    title: 'JavaScript异步编程',
    description: '解释Promise、async/await的工作原理，并实现一个简单的Promise。',
    category: 'JavaScript',
    difficulty: 4,
    duration: 20,
    passRate: 65,
    usageCount: 189
  },
  {
    id: 3,
    title: '前端性能优化策略',
    description: '从多个角度分析前端性能优化的方法，包括代码层面、网络层面、渲染层面等。',
    category: '性能优化',
    difficulty: 4,
    duration: 25,
    passRate: 72,
    usageCount: 156
  }
])

// 策略推荐数据
const strategyRecommendations = reactive([
  {
    id: 1,
    title: '渐进式面试法',
    description: '从简单问题开始，逐步增加难度，帮助候选人建立信心',
    color: '#3498db',
    icon: 'TrendCharts',
    benefits: ['降低候选人紧张感', '更好评估真实水平', '提高面试体验']
  },
  {
    id: 2,
    title: '项目驱动面试',
    description: '围绕候选人的实际项目经验进行深入探讨',
    color: '#2ecc71',
    icon: 'Document',
    benefits: ['评估实际工作能力', '了解解决问题思路', '验证项目真实性']
  },
  {
    id: 3,
    title: '团队协作评估',
    description: '通过情景模拟评估候选人的团队合作能力',
    color: '#f39c12',
    icon: 'User',
    benefits: ['评估软技能', '了解沟通风格', '预测团队适应性']
  }
])

// 技能路线图数据
const skillRoadmap = reactive([
  {
    id: 1,
    step: 1,
    name: 'JavaScript基础强化',
    description: '深入理解ES6+语法、原型链、闭包等核心概念',
    resources: ['MDN文档', '在线练习', '视频教程'],
    completed: true,
    current: false
  },
  {
    id: 2,
    step: 2,
    name: 'Vue.js框架精通',
    description: '掌握Vue3 Composition API、状态管理、路由等高级特性',
    resources: ['官方文档', '实战项目', '源码分析'],
    completed: false,
    current: true
  },
  {
    id: 3,
    step: 3,
    name: '前端工程化实践',
    description: '学习Webpack、Vite等构建工具，掌握CI/CD流程',
    resources: ['工具文档', '配置实践', '最佳实践'],
    completed: false,
    current: false
  },
  {
    id: 4,
    step: 4,
    name: '性能优化专项',
    description: '深入学习前端性能优化策略和监控方法',
    resources: ['性能分析工具', '优化案例', '监控平台'],
    completed: false,
    current: false
  }
])

// 面试准备分类
const preparationCategories = reactive([
  {
    id: 1,
    name: '技术基础',
    icon: 'Setting',
    color: '#3498db',
    progress: 75,
    expanded: false,
    items: [
      {
        id: 1,
        title: 'JavaScript核心概念',
        description: '掌握变量提升、作用域、this指向等基础概念',
        completed: true
      },
      {
        id: 2,
        title: 'CSS布局技巧',
        description: '熟练使用Flexbox、Grid等现代布局方式',
        completed: false
      }
    ]
  },
  {
    id: 2,
    name: '框架应用',
    icon: 'Document',
    color: '#2ecc71',
    progress: 60,
    expanded: false,
    items: [
      {
        id: 3,
        title: 'Vue.js组件设计',
        description: '理解组件化思想，掌握组件通信方式',
        completed: false
      },
      {
        id: 4,
        title: '状态管理模式',
        description: '掌握Vuex/Pinia等状态管理工具的使用',
        completed: false
      }
    ]
  },
  {
    id: 3,
    name: '项目经验',
    icon: 'Medal',
    color: '#f39c12',
    progress: 45,
    expanded: false,
    items: [
      {
        id: 5,
        title: '项目架构设计',
        description: '能够设计合理的前端项目架构',
        completed: false
      },
      {
        id: 6,
        title: '团队协作经验',
        description: '具备良好的团队协作和沟通能力',
        completed: false
      }
    ]
  }
])

// 职位推荐数据
const jobRecommendations = reactive([
  {
    id: 1,
    title: '高级前端工程师',
    company: '阿里巴巴',
    companyLogo: '/images/placeholder-case.jpg',
    location: '杭州',
    salary: '25K-40K',
    experience: '3-5年',
    matchPercentage: 92,
    requirements: [
      { skill: 'Vue.js', matched: true },
      { skill: 'React', matched: false },
      { skill: 'TypeScript', matched: true },
      { skill: 'Node.js', matched: true }
    ]
  },
  {
    id: 2,
    title: '前端技术专家',
    company: '腾讯',
    companyLogo: '/images/placeholder-case.jpg',
    location: '深圳',
    salary: '30K-50K',
    experience: '5年以上',
    matchPercentage: 85,
    requirements: [
      { skill: 'React', matched: false },
      { skill: 'Vue.js', matched: true },
      { skill: '微前端', matched: false },
      { skill: '性能优化', matched: true }
    ]
  }
])

// 分析指标数据
const analyticsMetrics = reactive([
  {
    name: '推荐准确率',
    value: '94.2%',
    change: 5.3,
    color: '#2ecc71',
    icon: 'TrendCharts'
  },
  {
    name: '用户满意度',
    value: '4.8/5.0',
    change: 2.1,
    color: '#f39c12',
    icon: 'Medal'
  },
  {
    name: '匹配成功率',
    value: '78.5%',
    change: -1.2,
    color: '#e74c3c',
    icon: 'DataBoard'
  },
  {
    name: '响应时间',
    value: '156ms',
    change: -8.7,
    color: '#3498db',
    icon: 'Timer'
  }
])

// 计算属性
const getProgressColor = (progress) => {
  if (progress >= 80) return '#2ecc71'
  if (progress >= 60) return '#f39c12'
  return '#e74c3c'
}

// 方法定义
const getModeDescription = (mode) => {
  const descriptions = {
    intelligent: '基于iFlytek Spark AI的深度学习算法，提供最精准的个性化推荐',
    collaborative: '基于用户行为和偏好的协同过滤算法，发现相似用户的选择',
    content: '基于内容特征匹配的推荐算法，确保推荐结果的相关性',
    hybrid: '融合多种推荐算法的混合模式，提供最全面的推荐结果'
  }
  return descriptions[mode] || ''
}

const onModeChange = (mode) => {
  console.log('推荐模式切换:', mode)
  // 这里可以重新加载推荐数据
}

const getCategoryType = (category) => {
  const typeMap = {
    '前端框架': 'primary',
    'JavaScript': 'success',
    '性能优化': 'warning',
    '算法': 'danger'
  }
  return typeMap[category] || 'info'
}

// 企业端方法
const inviteCandidate = (candidate) => {
  console.log('邀请候选人:', candidate.name)
}

const viewCandidateProfile = (candidate) => {
  console.log('查看候选人详情:', candidate.name)
}

const addToInterview = (question) => {
  console.log('添加题目到面试:', question.title)
}

const previewQuestion = (question) => {
  console.log('预览题目:', question.title)
}

const applyStrategy = (strategy) => {
  console.log('应用面试策略:', strategy.title)
}

// 候选人端方法
const startLearning = (skill) => {
  console.log('开始学习:', skill.name)
}

const toggleCategory = (category) => {
  category.expanded = !category.expanded
}

const startPreparation = (item) => {
  console.log('开始准备:', item.title)
}

const applyJob = (job) => {
  console.log('申请职位:', job.title)
}

const viewJobDetails = (job) => {
  console.log('查看职位详情:', job.title)
}

onMounted(() => {
  console.log('个性化推荐引擎已加载，用户类型:', props.userType)

  // 模拟实时数据更新
  setInterval(() => {
    engineMetrics.accuracy = 94.2 + (Math.random() - 0.5) * 2
    engineMetrics.responseTime = 156 + Math.floor((Math.random() - 0.5) * 50)

    // 更新分析指标
    analyticsMetrics.forEach(metric => {
      const oldChange = metric.change
      metric.change = oldChange + (Math.random() - 0.5) * 2
    })
  }, 5000)
})
</script>

<style scoped>
.personalized-recommendation-engine {
  padding: 24px;
  background: #f8f9fa;
  min-height: 100vh;
}

/* 推荐引擎控制台样式 */
.recommendation-console {
  background: white;
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.console-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.console-header h3 {
  font-size: 24px;
  color: #2c3e50;
  margin: 0;
}

.engine-status {
  display: flex;
  align-items: center;
  gap: 24px;
}

.engine-metrics {
  display: flex;
  gap: 20px;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #7f8c8d;
}

/* 推荐模式选择样式 */
.recommendation-modes {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 24px;
}

.mode-selector {
  margin-bottom: 16px;
}

.mode-description p {
  font-size: 14px;
  color: #7f8c8d;
  line-height: 1.5;
  margin: 0;
}

/* 企业端推荐样式 */
.enterprise-recommendations {
  background: white;
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.recommendations-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.recommendations-header h4 {
  font-size: 20px;
  color: #2c3e50;
  margin: 0;
}

.recommendation-filters {
  display: flex;
  gap: 16px;
}

.recommendation-sections {
  space-y: 32px;
}

.recommendation-section {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h5 {
  font-size: 18px;
  color: #2c3e50;
  margin: 0;
}

/* 候选人推荐卡片样式 */
.candidates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
}

.candidate-card {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
  position: relative;
}

.candidate-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.candidate-avatar {
  position: relative;
  text-align: center;
  margin-bottom: 16px;
}

.candidate-avatar img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.match-score {
  position: absolute;
  top: -5px;
  right: calc(50% - 45px);
  background: var(--iflytek-primary);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.candidate-info {
  text-align: center;
  margin-bottom: 16px;
}

.candidate-info h6 {
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 8px;
}

.candidate-position {
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 4px;
}

.candidate-experience {
  font-size: 12px;
  color: #95a5a6;
  margin-bottom: 12px;
}

.candidate-skills {
  display: flex;
  justify-content: center;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.candidate-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.recommendation-reason {
  text-align: center;
  padding: 8px;
  background: rgba(33, 111, 255, 0.1);
  border-radius: 8px;
}

.recommendation-reason small {
  font-size: 12px;
  color: var(--iflytek-primary);
}

/* 题目推荐样式 */
.questions-list {
  space-y: 16px;
}

.question-item {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  border-left: 4px solid var(--iflytek-primary);
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.question-content h6 {
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 8px;
}

.question-content p {
  font-size: 14px;
  color: #7f8c8d;
  line-height: 1.5;
  margin-bottom: 16px;
}

.question-metadata {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
}

.metadata-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.metadata-label {
  font-size: 12px;
  color: #95a5a6;
}

.metadata-value {
  font-size: 12px;
  color: #2c3e50;
  font-weight: 600;
}

.question-actions {
  display: flex;
  gap: 8px;
}

/* 策略推荐样式 */
.strategies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.strategy-card {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
}

.strategy-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.strategy-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  margin-bottom: 16px;
}

.strategy-content h6 {
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 8px;
}

.strategy-content p {
  font-size: 14px;
  color: #7f8c8d;
  line-height: 1.5;
  margin-bottom: 16px;
}

.strategy-benefits {
  margin-bottom: 20px;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #2c3e50;
}

.benefit-item .el-icon {
  color: #2ecc71;
}

/* 候选人端推荐样式 */
.candidate-recommendations-panel {
  background: white;
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.learning-progress {
  display: flex;
  align-items: center;
  gap: 16px;
}

.progress-label {
  font-size: 14px;
  color: #7f8c8d;
  min-width: 60px;
}

.learning-sections {
  space-y: 32px;
}

.learning-section {
  margin-bottom: 32px;
}

/* 技能路线图样式 */
.skills-roadmap {
  space-y: 20px;
}

.roadmap-item {
  margin-bottom: 20px;
}

.roadmap-step {
  display: flex;
  align-items: center;
  gap: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  position: relative;
}

.roadmap-step.completed {
  background: rgba(46, 204, 113, 0.1);
  border-left: 4px solid #2ecc71;
}

.roadmap-step.current {
  background: rgba(33, 111, 255, 0.1);
  border-left: 4px solid var(--iflytek-primary);
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--iflytek-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex-shrink: 0;
}

.roadmap-step.completed .step-number {
  background: #2ecc71;
}

.step-content {
  flex: 1;
}

.step-content h6 {
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 8px;
}

.step-content p {
  font-size: 14px;
  color: #7f8c8d;
  line-height: 1.5;
  margin-bottom: 12px;
}

.step-resources {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.step-actions {
  flex-shrink: 0;
}

/* 面试准备分类样式 */
.preparation-categories {
  space-y: 16px;
}

.category-tab {
  background: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-header:hover {
  background: #e9ecef;
}

.category-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.category-info {
  flex: 1;
}

.category-info h6 {
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 8px;
}

.category-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-text {
  font-size: 12px;
  color: #7f8c8d;
  min-width: 35px;
}

.category-toggle {
  color: #7f8c8d;
}

.category-content {
  padding: 0 20px 20px;
  background: white;
}

.preparation-item {
  padding: 16px;
  border-bottom: 1px solid #e9ecef;
}

.preparation-item:last-child {
  border-bottom: none;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.item-title {
  font-size: 14px;
  color: #2c3e50;
  font-weight: 600;
}

.item-description {
  font-size: 12px;
  color: #7f8c8d;
  line-height: 1.4;
  margin-bottom: 12px;
}

.item-actions {
  text-align: right;
}

/* 职位匹配推荐样式 */
.job-recommendations {
  space-y: 20px;
}

.job-card {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.job-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.job-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.company-logo img {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
}

.job-basic-info {
  flex: 1;
}

.job-basic-info h6 {
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 4px;
}

.company-name {
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 2px;
}

.job-location {
  font-size: 12px;
  color: #95a5a6;
}

.match-indicator {
  text-align: center;
}

.match-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: conic-gradient(var(--iflytek-primary) var(--match-percentage, 0%), #e9ecef 0%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.match-circle::before {
  content: '';
  position: absolute;
  width: 45px;
  height: 45px;
  background: white;
  border-radius: 50%;
}

.match-text {
  font-size: 12px;
  font-weight: 700;
  color: var(--iflytek-primary);
  z-index: 1;
}

.job-details {
  margin-bottom: 20px;
}

.job-requirements h6 {
  font-size: 14px;
  color: #2c3e50;
  margin-bottom: 12px;
}

.requirements-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.requirement-tag {
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  background: #e9ecef;
  color: #7f8c8d;
  transition: all 0.3s ease;
}

.requirement-tag.matched {
  background: var(--iflytek-primary);
  color: white;
}

.job-benefits {
  display: flex;
  gap: 24px;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.benefit-label {
  font-size: 12px;
  color: #95a5a6;
}

.benefit-value {
  font-size: 12px;
  color: #2c3e50;
  font-weight: 600;
}

.job-actions {
  display: flex;
  gap: 8px;
}

/* 推荐效果分析样式 */
.recommendation-analytics {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.analytics-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.analytics-header h4 {
  font-size: 20px;
  color: #2c3e50;
  margin: 0;
}

.analytics-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
}

.metric-card {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.metric-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.metric-content {
  flex: 1;
}

.metric-value {
  font-size: 24px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 4px;
}

.metric-label {
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 8px;
}

.metric-change {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
}

.metric-change.positive {
  color: #2ecc71;
}

.metric-change.negative {
  color: #e74c3c;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .personalized-recommendation-engine {
    padding: 16px;
  }

  .recommendation-console,
  .enterprise-recommendations,
  .candidate-recommendations-panel,
  .recommendation-analytics {
    padding: 20px;
  }

  .console-header,
  .recommendations-header,
  .analytics-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .engine-metrics {
    flex-direction: column;
    gap: 8px;
  }

  .recommendation-filters {
    flex-direction: column;
    gap: 8px;
  }

  .candidates-grid {
    grid-template-columns: 1fr;
  }

  .strategies-grid {
    grid-template-columns: 1fr;
  }

  .analytics-metrics {
    grid-template-columns: 1fr;
  }

  .job-header {
    flex-direction: column;
    text-align: center;
  }

  .job-benefits {
    flex-direction: column;
    gap: 8px;
  }

  .question-metadata {
    flex-direction: column;
    gap: 8px;
  }

  .roadmap-step {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
}
</style>
