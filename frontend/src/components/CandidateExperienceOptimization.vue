<template>
  <div class="candidate-experience-optimization">
    <!-- 功能导航标签 -->
    <div class="experience-navigation">
      <el-tabs v-model="activeTab" type="card" @tab-change="onTabChange">
        <el-tab-pane label="面试准备助手" name="interview-prep">
          <template #label>
            <div class="tab-label">
              <el-icon><Reading /></el-icon>
              <span>面试准备助手</span>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane label="实时指导" name="real-time-guidance">
          <template #label>
            <div class="tab-label">
              <el-icon><QuestionFilled /></el-icon>
              <span>实时指导</span>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane label="技能提升" name="skill-improvement">
          <template #label>
            <div class="tab-label">
              <el-icon><TrendCharts /></el-icon>
              <span>技能提升</span>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 面试准备助手 -->
    <div v-if="activeTab === 'interview-prep'" class="feature-panel interview-prep-panel">
      <div class="panel-header">
        <h4>iFlytek Spark 面试准备助手</h4>
        <div class="prep-status">
          <el-progress 
            :percentage="preparationProgress" 
            :color="getProgressColor(preparationProgress)"
            :show-text="false"
          />
          <span class="progress-text">准备进度: {{ preparationProgress }}%</span>
        </div>
      </div>

      <!-- 准备计划概览 -->
      <div class="preparation-overview">
        <div class="overview-cards">
          <div class="prep-card" v-for="card in prepCards" :key="card.name">
            <div class="prep-icon" :style="{ backgroundColor: card.color }">
              <el-icon>
                <component :is="card.icon" />
              </el-icon>
            </div>
            <div class="prep-content">
              <div class="prep-value">{{ card.value }}</div>
              <div class="prep-label">{{ card.name }}</div>
              <div class="prep-status" :class="card.status">{{ card.statusText }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 个性化准备计划 -->
      <div class="personalized-plan">
        <div class="plan-header">
          <h5>个性化准备计划</h5>
          <div class="plan-controls">
            <el-select v-model="selectedPosition" placeholder="选择目标职位" @change="updatePlan">
              <el-option label="前端工程师" value="frontend" />
              <el-option label="后端工程师" value="backend" />
              <el-option label="全栈工程师" value="fullstack" />
              <el-option label="算法工程师" value="algorithm" />
            </el-select>
            <el-button type="primary" @click="generateCustomPlan">
              <el-icon><Star /></el-icon>
              AI定制计划
            </el-button>
          </div>
        </div>

        <div class="plan-timeline">
          <div class="timeline-item" v-for="(item, index) in preparationPlan" :key="item.id">
            <div class="timeline-marker" :class="{ completed: item.completed, current: item.current }">
              <span class="marker-number">{{ index + 1 }}</span>
            </div>
            <div class="timeline-content">
              <div class="timeline-header">
                <h6>{{ item.title }}</h6>
                <div class="timeline-meta">
                  <el-tag :type="getDifficultyType(item.difficulty)" size="small">
                    {{ item.difficulty }}
                  </el-tag>
                  <span class="timeline-duration">{{ item.duration }}</span>
                </div>
              </div>
              <div class="timeline-description">{{ item.description }}</div>
              <div class="timeline-resources">
                <div class="resource-item" v-for="resource in item.resources" :key="resource.name">
                  <el-icon>
                    <component :is="resource.icon" />
                  </el-icon>
                  <span>{{ resource.name }}</span>
                </div>
              </div>
              <div class="timeline-actions">
                <el-button v-if="!item.completed" size="small" type="primary" @click="startPrepItem(item)">
                  {{ item.current ? '继续学习' : '开始准备' }}
                </el-button>
                <el-button v-else size="small" disabled>
                  <el-icon><Check /></el-icon>
                  已完成
                </el-button>
                <el-button size="small" @click="viewPrepDetails(item)">
                  查看详情
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 模拟面试练习 -->
      <div class="mock-interview">
        <div class="mock-header">
          <h5>模拟面试练习</h5>
          <div class="mock-stats">
            <span class="stat-item">
              <el-icon><Trophy /></el-icon>
              已完成: {{ mockStats.completed }}次
            </span>
            <span class="stat-item">
              <el-icon><Star /></el-icon>
              平均分: {{ mockStats.averageScore }}
            </span>
          </div>
        </div>

        <div class="mock-scenarios">
          <div class="scenario-card" v-for="scenario in mockScenarios" :key="scenario.id">
            <div class="scenario-header">
              <div class="scenario-title">
                <h6>{{ scenario.title }}</h6>
                <el-tag :type="getScenarioType(scenario.type)">{{ scenario.typeText }}</el-tag>
              </div>
              <div class="scenario-difficulty">
                <el-rate v-model="scenario.difficulty" disabled show-score />
              </div>
            </div>
            <div class="scenario-details">
              <div class="scenario-description">{{ scenario.description }}</div>
              <div class="scenario-features">
                <el-tag v-for="feature in scenario.features" :key="feature" size="small">
                  {{ feature }}
                </el-tag>
              </div>
            </div>
            <div class="scenario-stats">
              <div class="stat-item">
                <span class="stat-label">预计时长:</span>
                <span class="stat-value">{{ scenario.duration }}分钟</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">参与人数:</span>
                <span class="stat-value">{{ scenario.participants }}人</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">通过率:</span>
                <span class="stat-value">{{ scenario.passRate }}%</span>
              </div>
            </div>
            <div class="scenario-actions">
              <el-button type="primary" @click="startMockInterview(scenario)">
                开始模拟面试
              </el-button>
              <el-button @click="viewScenarioDetails(scenario)">
                查看详情
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 实时指导 -->
    <div v-if="activeTab === 'real-time-guidance'" class="feature-panel guidance-panel">
      <div class="panel-header">
        <h4>实时面试指导系统</h4>
        <div class="guidance-status">
          <el-tag :type="guidanceStatus.type" size="large">
            {{ guidanceStatus.text }}
          </el-tag>
        </div>
      </div>

      <!-- 实时监测面板 -->
      <div class="real-time-monitoring">
        <div class="monitoring-header">
          <h5>实时表现监测</h5>
          <div class="monitoring-controls">
            <el-switch v-model="monitoringEnabled" active-text="开启监测" />
            <el-button size="small" @click="calibrateSystem">
              <el-icon><Setting /></el-icon>
              校准系统
            </el-button>
          </div>
        </div>

        <div class="monitoring-grid">
          <!-- 语音表现监测 -->
          <div class="monitor-card speech-monitor">
            <div class="monitor-header">
              <el-icon><Microphone /></el-icon>
              <span>语音表现</span>
            </div>
            <div class="monitor-content">
              <div class="voice-waveform">
                <div class="wave-bar" v-for="i in 8" :key="i"></div>
              </div>
              <div class="speech-metrics">
                <div class="metric-item">
                  <span class="metric-label">语速:</span>
                  <div class="metric-indicator" :class="getSpeechSpeedClass(speechMetrics.speed)">
                    {{ speechMetrics.speed }}字/分
                  </div>
                </div>
                <div class="metric-item">
                  <span class="metric-label">音量:</span>
                  <div class="metric-indicator" :class="getVolumeClass(speechMetrics.volume)">
                    {{ speechMetrics.volume }}%
                  </div>
                </div>
                <div class="metric-item">
                  <span class="metric-label">清晰度:</span>
                  <div class="metric-indicator" :class="getClarityClass(speechMetrics.clarity)">
                    {{ speechMetrics.clarity }}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 视觉表现监测 -->
          <div class="monitor-card visual-monitor">
            <div class="monitor-header">
              <el-icon><VideoCamera /></el-icon>
              <span>视觉表现</span>
            </div>
            <div class="monitor-content">
              <div class="visual-feedback">
                <div class="feedback-item" v-for="feedback in visualFeedback" :key="feedback.type">
                  <div class="feedback-icon" :class="feedback.status">
                    <el-icon>
                      <component :is="feedback.icon" />
                    </el-icon>
                  </div>
                  <div class="feedback-text">
                    <span class="feedback-label">{{ feedback.label }}</span>
                    <span class="feedback-value">{{ feedback.value }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 内容质量监测 -->
          <div class="monitor-card content-monitor">
            <div class="monitor-header">
              <el-icon><Document /></el-icon>
              <span>回答质量</span>
            </div>
            <div class="monitor-content">
              <div class="content-analysis">
                <div class="analysis-circle">
                  <div class="circle-progress" :style="{ '--progress': contentQuality.overall + '%' }">
                    <span class="circle-text">{{ contentQuality.overall }}%</span>
                    <small>综合评分</small>
                  </div>
                </div>
                <div class="quality-breakdown">
                  <div class="quality-item" v-for="item in contentQuality.breakdown" :key="item.name">
                    <span class="quality-name">{{ item.name }}</span>
                    <div class="quality-bar">
                      <div class="quality-fill" :style="{ 
                        width: item.score + '%', 
                        backgroundColor: getQualityColor(item.score) 
                      }"></div>
                    </div>
                    <span class="quality-score">{{ item.score }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 智能提示系统 -->
      <div class="intelligent-hints">
        <div class="hints-header">
          <h5>智能提示与建议</h5>
          <div class="hints-mode">
            <el-radio-group v-model="hintsMode" size="small">
              <el-radio-button value="gentle">温和提示</el-radio-button>
              <el-radio-button value="active">主动建议</el-radio-button>
              <el-radio-button value="silent">静默模式</el-radio-button>
            </el-radio-group>
          </div>
        </div>

        <div class="hints-container">
          <div class="hint-card" v-for="hint in currentHints" :key="hint.id">
            <div class="hint-header">
              <div class="hint-type" :class="hint.priority">
                <el-icon>
                  <component :is="hint.icon" />
                </el-icon>
              </div>
              <div class="hint-meta">
                <span class="hint-category">{{ hint.category }}</span>
                <span class="hint-time">{{ formatTime(hint.timestamp) }}</span>
              </div>
            </div>
            <div class="hint-content">
              <h6>{{ hint.title }}</h6>
              <p>{{ hint.message }}</p>
            </div>
            <div class="hint-actions">
              <el-button size="small" type="primary" @click="applyHint(hint)">
                应用建议
              </el-button>
              <el-button size="small" @click="dismissHint(hint)">
                忽略
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 技能提升 -->
    <div v-if="activeTab === 'skill-improvement'" class="feature-panel skill-panel">
      <div class="panel-header">
        <h4>个性化技能提升计划</h4>
        <div class="skill-level">
          <span class="level-label">当前水平:</span>
          <el-rate v-model="currentSkillLevel" disabled show-text />
        </div>
      </div>

      <!-- 技能评估报告 -->
      <div class="skill-assessment">
        <div class="assessment-header">
          <h5>技能评估报告</h5>
          <div class="assessment-date">
            <span>最近评估: {{ lastAssessmentDate }}</span>
            <el-button size="small" type="primary" @click="startNewAssessment">
              重新评估
            </el-button>
          </div>
        </div>

        <div class="skill-radar">
          <div class="radar-chart">
            <svg viewBox="0 0 300 300" class="radar-svg">
              <!-- 雷达网格 -->
              <g class="radar-grid">
                <circle v-for="i in 5" :key="i" 
                        cx="150" cy="150" 
                        :r="i * 25" 
                        stroke="#e9ecef" 
                        stroke-width="1" 
                        fill="none" />
                <g v-for="(axis, index) in skillAxes" :key="axis.name">
                  <line x1="150" y1="150" 
                        :x2="axis.x" :y2="axis.y" 
                        stroke="#e9ecef" 
                        stroke-width="1" />
                  <text :x="axis.labelX" :y="axis.labelY" 
                        text-anchor="middle" 
                        class="axis-label">
                    {{ axis.name }}
                  </text>
                </g>
              </g>
              <!-- 技能数据 -->
              <polygon :points="skillPolygon" 
                       fill="rgba(33, 111, 255, 0.3)" 
                       stroke="var(--iflytek-primary)" 
                       stroke-width="2" />
              <g v-for="(point, index) in skillPoints" :key="index">
                <circle :cx="point.x" :cy="point.y" r="4" 
                        fill="var(--iflytek-primary)" />
              </g>
            </svg>
          </div>
          <div class="skill-legend">
            <div class="legend-item" v-for="(skill, index) in skillData" :key="skill.name">
              <span class="legend-color"></span>
              <span class="legend-text">{{ skill.name }}: {{ skill.score }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 学习路径推荐 -->
      <div class="learning-path">
        <div class="path-header">
          <h5>智能学习路径</h5>
          <div class="path-filter">
            <el-select v-model="learningFilter.timeframe" placeholder="学习周期">
              <el-option label="1个月" value="1month" />
              <el-option label="3个月" value="3months" />
              <el-option label="6个月" value="6months" />
            </el-select>
            <el-select v-model="learningFilter.intensity" placeholder="学习强度">
              <el-option label="轻松" value="light" />
              <el-option label="适中" value="moderate" />
              <el-option label="密集" value="intensive" />
            </el-select>
          </div>
        </div>

        <div class="learning-modules">
          <div class="module-card" v-for="module in learningModules" :key="module.id">
            <div class="module-header">
              <div class="module-icon" :style="{ backgroundColor: module.color }">
                <el-icon>
                  <component :is="module.icon" />
                </el-icon>
              </div>
              <div class="module-info">
                <h6>{{ module.title }}</h6>
                <div class="module-meta">
                  <span class="module-duration">{{ module.duration }}</span>
                  <span class="module-difficulty">{{ module.difficulty }}</span>
                </div>
              </div>
              <div class="module-progress">
                <el-progress 
                  :percentage="module.progress" 
                  type="circle" 
                  :width="50"
                  :show-text="false"
                />
                <small>{{ module.progress }}%</small>
              </div>
            </div>
            <div class="module-content">
              <div class="module-description">{{ module.description }}</div>
              <div class="module-skills">
                <el-tag v-for="skill in module.skills" :key="skill" size="small">
                  {{ skill }}
                </el-tag>
              </div>
            </div>
            <div class="module-actions">
              <el-button type="primary" @click="startLearningModule(module)">
                {{ module.progress > 0 ? '继续学习' : '开始学习' }}
              </el-button>
              <el-button @click="viewModuleDetails(module)">
                查看详情
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'
import {
  Reading, Guide, TrendCharts, MagicStick, Check, Trophy, Star,
  Microphone, VideoCamera, Document, Setting, Clock, Notebook
} from '@element-plus/icons-vue'

// 基础状态
const activeTab = ref('interview-prep')
const selectedPosition = ref('frontend')
const monitoringEnabled = ref(true)
const hintsMode = ref('active')
const currentSkillLevel = ref(3)
const lastAssessmentDate = ref('2024-01-15')

// 准备进度
const preparationProgress = ref(68)

// 准备卡片数据
const prepCards = reactive([
  {
    name: '知识点掌握',
    value: '85%',
    status: 'good',
    statusText: '良好',
    color: '#2ecc71',
    icon: 'Notebook'
  },
  {
    name: '模拟练习',
    value: '12次',
    status: 'excellent',
    statusText: '优秀',
    color: '#3498db',
    icon: 'Trophy'
  },
  {
    name: '薄弱环节',
    value: '3个',
    status: 'attention',
    statusText: '需关注',
    color: '#f39c12',
    icon: 'Warning'
  },
  {
    name: '预计通过率',
    value: '78%',
    status: 'good',
    statusText: '良好',
    color: '#e74c3c',
    icon: 'TrendCharts'
  }
])

// 准备计划数据
const preparationPlan = reactive([
  {
    id: 1,
    title: 'JavaScript基础知识复习',
    description: '复习ES6+语法、原型链、闭包等核心概念',
    difficulty: '简单',
    duration: '2小时',
    completed: true,
    current: false,
    resources: [
      { name: 'MDN文档', icon: 'Document' },
      { name: '在线练习', icon: 'TrendCharts' },
      { name: '视频教程', icon: 'VideoPlay' }
    ]
  },
  {
    id: 2,
    title: 'Vue.js框架深入理解',
    description: '掌握Vue3 Composition API、响应式原理、组件设计模式',
    difficulty: '中等',
    duration: '4小时',
    completed: false,
    current: true,
    resources: [
      { name: '官方文档', icon: 'Document' },
      { name: '实战项目', icon: 'FolderOpened' },
      { name: '源码分析', icon: 'View' }
    ]
  },
  {
    id: 3,
    title: '算法与数据结构',
    description: '常见算法题型练习，时间复杂度分析',
    difficulty: '困难',
    duration: '6小时',
    completed: false,
    current: false,
    resources: [
      { name: 'LeetCode', icon: 'TrendCharts' },
      { name: '算法书籍', icon: 'Reading' },
      { name: '视频讲解', icon: 'VideoPlay' }
    ]
  }
])

// 模拟面试统计
const mockStats = reactive({
  completed: 8,
  averageScore: 4.2
})

// 模拟面试场景
const mockScenarios = reactive([
  {
    id: 1,
    title: '技术基础面试',
    type: 'technical',
    typeText: '技术面',
    description: '考察JavaScript、Vue.js等前端技术基础',
    difficulty: 3,
    duration: 45,
    participants: 1247,
    passRate: 78,
    features: ['代码编写', '概念解释', '项目经验']
  },
  {
    id: 2,
    title: '算法编程挑战',
    type: 'algorithm',
    typeText: '算法面',
    description: '在线编程解决算法问题，考察编程思维',
    difficulty: 4,
    duration: 60,
    participants: 892,
    passRate: 65,
    features: ['算法设计', '代码实现', '复杂度分析']
  },
  {
    id: 3,
    title: '项目经验分享',
    type: 'project',
    typeText: '项目面',
    description: '深入讨论项目经验，技术选型和解决方案',
    difficulty: 3,
    duration: 30,
    participants: 1563,
    passRate: 82,
    features: ['项目介绍', '技术难点', '团队协作']
  }
])

// 实时指导状态
const guidanceStatus = reactive({
  type: 'success',
  text: '系统正常运行'
})

// 语音指标
const speechMetrics = reactive({
  speed: 180,
  volume: 75,
  clarity: 88
})

// 视觉反馈
const visualFeedback = reactive([
  {
    type: 'eye-contact',
    label: '眼神交流',
    value: '良好',
    status: 'good',
    icon: 'View'
  },
  {
    type: 'posture',
    label: '坐姿端正',
    value: '优秀',
    status: 'excellent',
    icon: 'User'
  },
  {
    type: 'expression',
    label: '表情自然',
    value: '需改善',
    status: 'attention',
    icon: 'Smile'
  }
])

// 内容质量
const contentQuality = reactive({
  overall: 82,
  breakdown: [
    { name: '相关性', score: 85 },
    { name: '深度', score: 78 },
    { name: '逻辑性', score: 88 },
    { name: '创新性', score: 75 }
  ]
})

// 智能提示
const currentHints = reactive([
  {
    id: 1,
    category: '语音表达',
    title: '语速建议',
    message: '当前语速略快，建议适当放慢以提高表达清晰度',
    priority: 'medium',
    icon: 'Microphone',
    timestamp: new Date()
  },
  {
    id: 2,
    category: '内容深度',
    title: '技术细节',
    message: '可以增加更多技术实现细节，展示深度理解',
    priority: 'high',
    icon: 'Document',
    timestamp: new Date()
  }
])

// 学习过滤器
const learningFilter = reactive({
  timeframe: '3months',
  intensity: 'moderate'
})

// 技能数据
const skillData = reactive([
  { name: 'JavaScript', score: 85 },
  { name: 'Vue.js', score: 78 },
  { name: '算法思维', score: 72 },
  { name: '系统设计', score: 65 },
  { name: '项目经验', score: 80 },
  { name: '沟通表达', score: 75 }
])

// 技能雷达图轴
const skillAxes = reactive([
  { name: 'JavaScript', angle: 0, x: 275, y: 150, labelX: 285, labelY: 155 },
  { name: 'Vue.js', angle: 60, x: 212.5, y: 66.5, labelX: 220, labelY: 55 },
  { name: '算法思维', angle: 120, x: 87.5, y: 66.5, labelX: 80, labelY: 55 },
  { name: '系统设计', angle: 180, x: 25, y: 150, labelX: 15, labelY: 155 },
  { name: '项目经验', angle: 240, x: 87.5, y: 233.5, labelX: 80, labelY: 245 },
  { name: '沟通表达', angle: 300, x: 212.5, y: 233.5, labelX: 220, labelY: 245 }
])

// 学习模块
const learningModules = reactive([
  {
    id: 1,
    title: 'Vue.js进阶开发',
    description: '深入学习Vue3 Composition API、状态管理、性能优化',
    duration: '4周',
    difficulty: '中级',
    progress: 35,
    color: '#4fc08d',
    icon: 'TrendCharts',
    skills: ['Vue3', 'Composition API', 'Pinia', '性能优化']
  },
  {
    id: 2,
    title: '算法与数据结构',
    description: '系统学习常用算法和数据结构，提升编程思维',
    duration: '6周',
    difficulty: '高级',
    progress: 0,
    color: '#f39c12',
    icon: 'TrendCharts',
    skills: ['算法设计', '数据结构', '复杂度分析', '编程思维']
  },
  {
    id: 3,
    title: '前端工程化实践',
    description: '学习现代前端工程化工具和最佳实践',
    duration: '3周',
    difficulty: '中级',
    progress: 60,
    color: '#3498db',
    icon: 'Setting',
    skills: ['Webpack', 'Vite', 'CI/CD', '代码规范']
  }
])

// 计算属性
const skillPoints = computed(() => {
  return skillAxes.map((axis, index) => {
    const score = skillData[index].score
    const radius = (score / 100) * 125
    const angle = (axis.angle - 90) * (Math.PI / 180)

    return {
      x: 150 + radius * Math.cos(angle),
      y: 150 + radius * Math.sin(angle)
    }
  })
})

const skillPolygon = computed(() => {
  return skillPoints.value.map(point => `${point.x},${point.y}`).join(' ')
})

// 方法定义
const onTabChange = (tabName) => {
  console.log('切换到标签:', tabName)
}

const getProgressColor = (progress) => {
  if (progress >= 80) return '#2ecc71'
  if (progress >= 60) return '#f39c12'
  return '#e74c3c'
}

const getDifficultyType = (difficulty) => {
  const typeMap = {
    '简单': 'success',
    '中等': 'warning',
    '困难': 'danger'
  }
  return typeMap[difficulty] || 'info'
}

const getScenarioType = (type) => {
  const typeMap = {
    'technical': 'primary',
    'algorithm': 'warning',
    'project': 'success'
  }
  return typeMap[type] || 'info'
}

const getSpeechSpeedClass = (speed) => {
  if (speed < 150) return 'slow'
  if (speed > 200) return 'fast'
  return 'normal'
}

const getVolumeClass = (volume) => {
  if (volume < 50) return 'low'
  if (volume > 80) return 'high'
  return 'normal'
}

const getClarityClass = (clarity) => {
  if (clarity >= 85) return 'excellent'
  if (clarity >= 70) return 'good'
  return 'poor'
}

const getQualityColor = (score) => {
  if (score >= 85) return '#2ecc71'
  if (score >= 70) return '#f39c12'
  return '#e74c3c'
}

const formatTime = (timestamp) => {
  return timestamp.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 面试准备方法
const updatePlan = () => {
  console.log('更新准备计划，目标职位:', selectedPosition.value)
}

const generateCustomPlan = () => {
  console.log('生成AI定制计划')
}

const startPrepItem = (item) => {
  console.log('开始准备项目:', item.title)
  item.current = true
}

const viewPrepDetails = (item) => {
  console.log('查看准备详情:', item.title)
}

const startMockInterview = (scenario) => {
  console.log('开始模拟面试:', scenario.title)
}

const viewScenarioDetails = (scenario) => {
  console.log('查看场景详情:', scenario.title)
}

// 实时指导方法
const calibrateSystem = () => {
  console.log('校准系统')
}

const applyHint = (hint) => {
  console.log('应用提示:', hint.title)
  const index = currentHints.findIndex(h => h.id === hint.id)
  if (index > -1) {
    currentHints.splice(index, 1)
  }
}

const dismissHint = (hint) => {
  console.log('忽略提示:', hint.title)
  const index = currentHints.findIndex(h => h.id === hint.id)
  if (index > -1) {
    currentHints.splice(index, 1)
  }
}

// 技能提升方法
const startNewAssessment = () => {
  console.log('开始新的技能评估')
}

const startLearningModule = (module) => {
  console.log('🎓 开始学习模块:', module.title)

  try {
    // 显示成功消息
    ElMessage.success(`正在启动 ${module.title} 学习模块...`)

    // 根据模块类型跳转到相应的学习页面
    switch (module.id) {
      case 1:
        ElNotification.success({
          title: '🚀 Vue.js进阶开发',
          message: '开始您的Vue.js学习之旅！',
          duration: 3000
        })
        // 可以跳转到具体的学习页面
        // router.push('/learning-modules/vue-advanced')
        break
      case 2:
        ElNotification.success({
          title: '📊 算法与数据结构',
          message: '开始算法学习！',
          duration: 3000
        })
        // router.push('/learning-modules/algorithms')
        break
      case 3:
        ElNotification.success({
          title: '🔧 前端工程化实践',
          message: '开始工程化学习！',
          duration: 3000
        })
        // router.push('/learning-modules/frontend-engineering')
        break
      default:
        ElMessage.info(`${module.title} 学习模块正在开发中...`)
    }

    // 更新学习进度（模拟）
    if (module.progress === 0) {
      module.progress = 5 // 开始学习后设置初始进度
    }
  } catch (error) {
    console.error('❌ 启动学习模块失败:', error)
    ElMessage.error('启动学习模块失败，请重试')
  }
}

const viewModuleDetails = (module) => {
  console.log('查看模块详情:', module.title)
}

onMounted(() => {
  console.log('候选人体验优化组件已加载')

  // 启动实时数据更新
  setInterval(() => {
    if (monitoringEnabled.value) {
      // 更新语音波形
      const waveBars = document.querySelectorAll('.wave-bar')
      waveBars.forEach(bar => {
        const height = Math.random() * 30 + 5
        bar.style.height = height + 'px'
      })

      // 更新语音指标
      speechMetrics.speed = Math.max(120, Math.min(220, speechMetrics.speed + (Math.random() - 0.5) * 10))
      speechMetrics.volume = Math.max(40, Math.min(90, speechMetrics.volume + (Math.random() - 0.5) * 8))
      speechMetrics.clarity = Math.max(60, Math.min(95, speechMetrics.clarity + (Math.random() - 0.5) * 6))

      // 更新内容质量
      contentQuality.overall = Math.max(60, Math.min(95, contentQuality.overall + (Math.random() - 0.5) * 4))
      contentQuality.breakdown.forEach(item => {
        item.score = Math.max(60, Math.min(95, item.score + (Math.random() - 0.5) * 5))
      })
    }
  }, 2000)
})
</script>

<style scoped>
.candidate-experience-optimization {
  padding: 24px;
  background: #f8f9fa;
  min-height: 100vh;
}

/* 功能导航标签样式 */
.experience-navigation {
  margin-bottom: 32px;
}

.tab-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

/* 通用面板样式 */
.feature-panel {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f0f0f0;
}

.panel-header h4 {
  font-size: 24px;
  color: #2c3e50;
  margin: 0;
}

/* 面试准备助手样式 */
.prep-status {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-text {
  font-size: 14px;
  color: #7f8c8d;
  font-weight: 600;
}

.preparation-overview {
  margin-bottom: 32px;
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.prep-card {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
}

.prep-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.prep-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.prep-content {
  flex: 1;
}

.prep-value {
  font-size: 24px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 4px;
}

.prep-label {
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 8px;
}

.prep-status {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 12px;
}

.prep-status.good {
  background: rgba(46, 204, 113, 0.2);
  color: #2ecc71;
}

.prep-status.excellent {
  background: rgba(52, 152, 219, 0.2);
  color: #3498db;
}

.prep-status.attention {
  background: rgba(243, 156, 18, 0.2);
  color: #f39c12;
}

/* 个性化准备计划样式 */
.personalized-plan {
  margin-bottom: 32px;
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.plan-header h5 {
  font-size: 18px;
  color: #2c3e50;
  margin: 0;
}

.plan-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.plan-timeline {
  position: relative;
}

.plan-timeline::before {
  content: '';
  position: absolute;
  left: 20px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e9ecef;
}

.timeline-item {
  display: flex;
  gap: 20px;
  margin-bottom: 32px;
  position: relative;
}

.timeline-marker {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}

.timeline-marker.completed {
  background: #2ecc71;
}

.timeline-marker.current {
  background: var(--iflytek-primary);
  box-shadow: 0 0 0 4px rgba(33, 111, 255, 0.2);
}

.marker-number {
  font-size: 14px;
  font-weight: 700;
  color: white;
}

.timeline-content {
  flex: 1;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.timeline-header h6 {
  font-size: 16px;
  color: #2c3e50;
  margin: 0;
}

.timeline-meta {
  display: flex;
  gap: 12px;
  align-items: center;
}

.timeline-duration {
  font-size: 12px;
  color: #7f8c8d;
}

.timeline-description {
  font-size: 14px;
  color: #7f8c8d;
  line-height: 1.5;
  margin-bottom: 16px;
}

.timeline-resources {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.resource-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #2c3e50;
  background: white;
  padding: 6px 12px;
  border-radius: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.timeline-actions {
  display: flex;
  gap: 8px;
}

/* 模拟面试样式 */
.mock-interview {
  margin-bottom: 32px;
}

.mock-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.mock-header h5 {
  font-size: 18px;
  color: #2c3e50;
  margin: 0;
}

.mock-stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #7f8c8d;
}

.mock-scenarios {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
}

.scenario-card {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 24px;
  border-left: 4px solid var(--iflytek-primary);
  transition: all 0.3s ease;
}

.scenario-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.scenario-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.scenario-title h6 {
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 8px;
}

.scenario-details {
  margin-bottom: 16px;
}

.scenario-description {
  font-size: 14px;
  color: #7f8c8d;
  line-height: 1.5;
  margin-bottom: 12px;
}

.scenario-features {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.scenario-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 12px;
}

.stat-label {
  color: #95a5a6;
}

.stat-value {
  color: #2c3e50;
  font-weight: 600;
}

.scenario-actions {
  display: flex;
  gap: 8px;
}

/* 实时指导样式 */
.guidance-status {
  display: flex;
  align-items: center;
  gap: 12px;
}

.real-time-monitoring {
  margin-bottom: 32px;
}

.monitoring-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.monitoring-header h5 {
  font-size: 18px;
  color: #2c3e50;
  margin: 0;
}

.monitoring-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.monitoring-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.monitor-card {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
}

.monitor-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.monitor-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  font-weight: 600;
  color: #2c3e50;
}

/* 语音监测样式 */
.voice-waveform {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 60px;
  margin-bottom: 20px;
}

.wave-bar {
  width: 4px;
  height: 10px;
  background: var(--iflytek-gradient-primary);
  border-radius: 2px;
  animation: wave-pulse 1.5s ease-in-out infinite;
}

.wave-bar:nth-child(1) { animation-delay: 0s; }
.wave-bar:nth-child(2) { animation-delay: 0.2s; }
.wave-bar:nth-child(3) { animation-delay: 0.4s; }
.wave-bar:nth-child(4) { animation-delay: 0.6s; }
.wave-bar:nth-child(5) { animation-delay: 0.8s; }
.wave-bar:nth-child(6) { animation-delay: 1.0s; }
.wave-bar:nth-child(7) { animation-delay: 1.2s; }
.wave-bar:nth-child(8) { animation-delay: 1.4s; }

@keyframes wave-pulse {
  0%, 100% { height: 10px; }
  50% { height: 40px; }
}

.speech-metrics {
  space-y: 12px;
}

.metric-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.metric-label {
  font-size: 14px;
  color: #7f8c8d;
}

.metric-indicator {
  font-size: 14px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 8px;
}

.metric-indicator.normal {
  background: rgba(46, 204, 113, 0.2);
  color: #2ecc71;
}

.metric-indicator.slow,
.metric-indicator.fast,
.metric-indicator.low,
.metric-indicator.high {
  background: rgba(243, 156, 18, 0.2);
  color: #f39c12;
}

.metric-indicator.excellent {
  background: rgba(52, 152, 219, 0.2);
  color: #3498db;
}

.metric-indicator.good {
  background: rgba(46, 204, 113, 0.2);
  color: #2ecc71;
}

.metric-indicator.poor {
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
}

/* 视觉反馈样式 */
.visual-feedback {
  space-y: 16px;
}

.feedback-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.feedback-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.feedback-icon.excellent {
  background: #2ecc71;
}

.feedback-icon.good {
  background: #3498db;
}

.feedback-icon.attention {
  background: #f39c12;
}

.feedback-text {
  flex: 1;
}

.feedback-label {
  display: block;
  font-size: 14px;
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 4px;
}

.feedback-value {
  font-size: 12px;
  color: #7f8c8d;
}

/* 内容质量分析样式 */
.content-analysis {
  text-align: center;
}

.analysis-circle {
  margin-bottom: 20px;
}

.circle-progress {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: conic-gradient(var(--iflytek-primary) var(--progress, 0%), #e9ecef 0%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: 0 auto;
}

.circle-progress::before {
  content: '';
  position: absolute;
  width: 75px;
  height: 75px;
  background: white;
  border-radius: 50%;
}

.circle-text {
  font-size: 18px;
  font-weight: 700;
  color: var(--iflytek-primary);
  z-index: 1;
}

.circle-progress small {
  font-size: 10px;
  color: #7f8c8d;
  z-index: 1;
}

.quality-breakdown {
  space-y: 12px;
}

.quality-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.quality-name {
  min-width: 60px;
  font-size: 12px;
  color: #2c3e50;
}

.quality-bar {
  flex: 1;
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
  overflow: hidden;
}

.quality-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.quality-score {
  min-width: 35px;
  font-size: 12px;
  font-weight: 600;
  color: var(--iflytek-primary);
  text-align: right;
}

/* 智能提示样式 */
.intelligent-hints {
  margin-bottom: 32px;
}

.hints-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.hints-header h5 {
  font-size: 18px;
  color: #2c3e50;
  margin: 0;
}

.hints-container {
  space-y: 16px;
}

.hint-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  border-left: 4px solid transparent;
  transition: all 0.3s ease;
}

.hint-card:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.hint-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.hint-type {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.hint-type.high {
  background: #e74c3c;
}

.hint-type.medium {
  background: #f39c12;
}

.hint-type.low {
  background: #3498db;
}

.hint-meta {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hint-category {
  font-size: 12px;
  color: #7f8c8d;
  font-weight: 600;
}

.hint-time {
  font-size: 11px;
  color: #95a5a6;
}

.hint-content h6 {
  font-size: 14px;
  color: #2c3e50;
  margin-bottom: 8px;
}

.hint-content p {
  font-size: 13px;
  color: #7f8c8d;
  line-height: 1.4;
  margin-bottom: 16px;
}

.hint-actions {
  display: flex;
  gap: 8px;
}

/* 技能提升样式 */
.skill-level {
  display: flex;
  align-items: center;
  gap: 12px;
}

.level-label {
  font-size: 14px;
  color: #7f8c8d;
}

.skill-assessment {
  margin-bottom: 32px;
}

.assessment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.assessment-header h5 {
  font-size: 18px;
  color: #2c3e50;
  margin: 0;
}

.assessment-date {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #7f8c8d;
}

.skill-radar {
  display: flex;
  gap: 32px;
  align-items: center;
}

.radar-chart {
  flex: 1;
  max-width: 300px;
}

.radar-svg {
  width: 100%;
  height: 300px;
}

.axis-label {
  font-size: 12px;
  fill: #2c3e50;
  font-weight: 600;
}

.skill-legend {
  flex: 1;
  space-y: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--iflytek-primary);
}

.legend-text {
  font-size: 14px;
  color: #2c3e50;
}

/* 学习路径样式 */
.learning-path {
  margin-bottom: 32px;
}

.path-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.path-header h5 {
  font-size: 18px;
  color: #2c3e50;
  margin: 0;
}

.path-filter {
  display: flex;
  gap: 12px;
}

.learning-modules {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
}

.module-card {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
}

.module-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.module-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.module-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.module-info {
  flex: 1;
}

.module-info h6 {
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 8px;
}

.module-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #7f8c8d;
}

.module-progress {
  text-align: center;
}

.module-progress small {
  font-size: 10px;
  color: #7f8c8d;
  margin-top: 4px;
  display: block;
}

.module-content {
  margin-bottom: 20px;
}

.module-description {
  font-size: 14px;
  color: #7f8c8d;
  line-height: 1.5;
  margin-bottom: 12px;
}

.module-skills {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.module-actions {
  display: flex;
  gap: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .candidate-experience-optimization {
    padding: 16px;
  }

  .feature-panel {
    padding: 20px;
  }

  .panel-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .prep-status,
  .guidance-status,
  .skill-level {
    flex-direction: column;
    gap: 8px;
  }

  .overview-cards {
    grid-template-columns: 1fr;
  }

  .plan-header,
  .mock-header,
  .monitoring-header,
  .hints-header,
  .assessment-header,
  .path-header {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }

  .plan-controls,
  .monitoring-controls,
  .path-filter {
    flex-direction: column;
    width: 100%;
  }

  .timeline-item {
    flex-direction: column;
    gap: 12px;
  }

  .timeline-marker {
    align-self: center;
  }

  .timeline-header {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }

  .timeline-meta {
    justify-content: center;
  }

  .timeline-resources {
    justify-content: center;
  }

  .timeline-actions,
  .scenario-actions,
  .hint-actions,
  .module-actions {
    flex-direction: column;
  }

  .mock-scenarios,
  .monitoring-grid,
  .learning-modules {
    grid-template-columns: 1fr;
  }

  .scenario-header {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }

  .scenario-stats {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }

  .mock-stats {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }

  .speech-metrics {
    text-align: center;
  }

  .metric-item {
    flex-direction: column;
    gap: 4px;
    text-align: center;
  }

  .feedback-item {
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }

  .quality-item {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }

  .hint-header {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }

  .hint-meta {
    flex-direction: column;
    gap: 4px;
  }

  .skill-radar {
    flex-direction: column;
    gap: 20px;
  }

  .assessment-date {
    flex-direction: column;
    gap: 8px;
  }

  .module-header {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .module-meta {
    justify-content: center;
  }
}

/* 动画效果 */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.prep-card,
.scenario-card,
.monitor-card,
.hint-card,
.module-card {
  animation: slideInUp 0.3s ease-out;
}

/* 进度条动画 */
@keyframes progressFill {
  from {
    width: 0%;
  }
  to {
    width: var(--target-width);
  }
}

.quality-fill {
  animation: progressFill 1s ease-out;
}

/* 雷达图动画 */
@keyframes radarScan {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.radar-svg {
  animation: radarScan 0.8s ease-out;
}

/* 提示卡片优先级样式 */
.hint-card {
  border-left-color: #3498db;
}

.hint-card:has(.hint-type.high) {
  border-left-color: #e74c3c;
}

.hint-card:has(.hint-type.medium) {
  border-left-color: #f39c12;
}

/* 悬浮效果增强 */
.prep-card:hover,
.scenario-card:hover,
.monitor-card:hover,
.module-card:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

/* 状态指示器 */
.status-indicator {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
}

.status-indicator.active {
  background: #2ecc71;
  animation: pulse 2s infinite;
}

.status-indicator.inactive {
  background: #95a5a6;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
