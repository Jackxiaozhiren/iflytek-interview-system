<template>
  <div class="enterprise-professional-features">
    <!-- 功能导航标签 -->
    <div class="features-navigation">
      <el-tabs v-model="activeTab" type="card" @tab-change="onTabChange">
        <el-tab-pane label="批量面试管理" name="batch-interview">
          <template #label>
            <div class="tab-label">
              <el-icon><User /></el-icon>
              <span>批量面试管理</span>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane label="团队协作" name="team-collaboration">
          <template #label>
            <div class="tab-label">
              <el-icon><Connection /></el-icon>
              <span>团队协作</span>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane label="人才库运营" name="talent-pool">
          <template #label>
            <div class="tab-label">
              <el-icon><DataBoard /></el-icon>
              <span>人才库运营</span>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 批量面试管理 -->
    <div v-if="activeTab === 'batch-interview'" class="feature-panel batch-interview-panel">
      <div class="panel-header">
        <h4>批量面试管理系统</h4>
        <div class="batch-actions">
          <el-button type="primary" @click="createBatchInterview">
            <el-icon><CirclePlus /></el-icon>
            创建批量面试
          </el-button>
          <el-button @click="importCandidates">
            <el-icon><Upload /></el-icon>
            批量导入候选人
          </el-button>
        </div>
      </div>

      <!-- 批量面试概览 -->
      <div class="batch-overview">
        <div class="overview-stats">
          <div class="stat-card" v-for="stat in batchStats" :key="stat.name">
            <div class="stat-icon" :style="{ backgroundColor: stat.color }">
              <el-icon>
                <component :is="stat.icon" />
              </el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.name }}</div>
              <div class="stat-trend" :class="{ positive: stat.trend > 0, negative: stat.trend < 0 }">
                <el-icon>
                  <component :is="stat.trend > 0 ? 'ArrowUp' : 'ArrowDown'" />
                </el-icon>
                {{ Math.abs(stat.trend) }}%
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 批量面试列表 -->
      <div class="batch-interviews-list">
        <div class="list-header">
          <h5>进行中的批量面试</h5>
          <div class="list-filters">
            <el-select v-model="batchFilter.status" placeholder="状态筛选" size="small">
              <el-option label="全部" value="all" />
              <el-option label="准备中" value="preparing" />
              <el-option label="进行中" value="ongoing" />
              <el-option label="已完成" value="completed" />
            </el-select>
            <el-select v-model="batchFilter.position" placeholder="职位筛选" size="small">
              <el-option label="全部职位" value="all" />
              <el-option label="前端工程师" value="frontend" />
              <el-option label="后端工程师" value="backend" />
              <el-option label="算法工程师" value="algorithm" />
            </el-select>
          </div>
        </div>

        <div class="interviews-grid">
          <div class="interview-card" v-for="interview in filteredBatchInterviews" :key="interview.id">
            <div class="interview-header">
              <div class="interview-title">
                <h6>{{ interview.title }}</h6>
                <el-tag :type="getStatusType(interview.status)" size="small">
                  {{ interview.statusText }}
                </el-tag>
              </div>
              <div class="interview-progress">
                <el-progress 
                  :percentage="interview.progress" 
                  :color="getProgressColor(interview.progress)"
                  :show-text="false"
                />
                <span class="progress-text">{{ interview.completedCount }}/{{ interview.totalCount }}</span>
              </div>
            </div>

            <div class="interview-details">
              <div class="detail-item">
                <span class="detail-label">职位:</span>
                <span class="detail-value">{{ interview.position }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">面试官:</span>
                <div class="interviewers-list">
                  <el-avatar 
                    v-for="interviewer in interview.interviewers.slice(0, 3)" 
                    :key="interviewer.id"
                    :size="24" 
                    :src="interviewer.avatar"
                  />
                  <span v-if="interview.interviewers.length > 3" class="more-count">
                    +{{ interview.interviewers.length - 3 }}
                  </span>
                </div>
              </div>
              <div class="detail-item">
                <span class="detail-label">创建时间:</span>
                <span class="detail-value">{{ formatDate(interview.createdAt) }}</span>
              </div>
            </div>

            <div class="interview-actions">
              <el-button size="small" type="primary" @click="manageBatchInterview(interview)">
                管理面试
              </el-button>
              <el-button size="small" @click="viewBatchReport(interview)">
                查看报告
              </el-button>
              <el-dropdown @command="handleBatchAction">
                <el-button size="small">
                  更多操作<el-icon class="el-icon--right"><ArrowDown /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item :command="{action: 'edit', interview}">编辑设置</el-dropdown-item>
                    <el-dropdown-item :command="{action: 'duplicate', interview}">复制面试</el-dropdown-item>
                    <el-dropdown-item :command="{action: 'export', interview}">导出数据</el-dropdown-item>
                    <el-dropdown-item :command="{action: 'archive', interview}" divided>归档面试</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 团队协作 -->
    <div v-if="activeTab === 'team-collaboration'" class="feature-panel team-collaboration-panel">
      <div class="panel-header">
        <h4>团队协作管理</h4>
        <div class="collaboration-actions">
          <el-button type="primary" @click="inviteTeamMember">
            <el-icon><User /></el-icon>
            邀请成员
          </el-button>
          <el-button @click="createTeam">
            <el-icon><CirclePlus /></el-icon>
            创建团队
          </el-button>
        </div>
      </div>

      <!-- 团队概览 -->
      <div class="team-overview">
        <div class="team-stats">
          <div class="team-stat-card" v-for="stat in teamStats" :key="stat.name">
            <div class="team-stat-icon" :style="{ backgroundColor: stat.color }">
              <el-icon>
                <component :is="stat.icon" />
              </el-icon>
            </div>
            <div class="team-stat-content">
              <div class="team-stat-value">{{ stat.value }}</div>
              <div class="team-stat-label">{{ stat.name }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 面试官分配 -->
      <div class="interviewer-assignment">
        <div class="assignment-header">
          <h5>面试官分配与调度</h5>
          <div class="assignment-controls">
            <el-button size="small" @click="autoAssignInterviewers">
              <el-icon><Star /></el-icon>
              智能分配
            </el-button>
            <el-button size="small" @click="viewScheduleCalendar">
              <el-icon><Calendar /></el-icon>
              查看日程
            </el-button>
          </div>
        </div>

        <div class="interviewers-grid">
          <div class="interviewer-card" v-for="interviewer in interviewers" :key="interviewer.id">
            <div class="interviewer-avatar">
              <el-avatar :size="60" :src="interviewer.avatar" />
              <div class="status-indicator" :class="interviewer.status"></div>
            </div>
            <div class="interviewer-info">
              <h6>{{ interviewer.name }}</h6>
              <div class="interviewer-role">{{ interviewer.role }}</div>
              <div class="interviewer-department">{{ interviewer.department }}</div>
            </div>
            <div class="interviewer-stats">
              <div class="stat-item">
                <span class="stat-label">本周面试:</span>
                <span class="stat-value">{{ interviewer.weeklyInterviews }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">评分平均:</span>
                <span class="stat-value">{{ interviewer.avgRating }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">专业领域:</span>
                <div class="expertise-tags">
                  <el-tag v-for="skill in interviewer.expertise.slice(0, 2)" :key="skill" size="small">
                    {{ skill }}
                  </el-tag>
                </div>
              </div>
            </div>
            <div class="interviewer-actions">
              <el-button size="small" type="primary" @click="assignInterview(interviewer)">
                分配面试
              </el-button>
              <el-button size="small" @click="viewInterviewerProfile(interviewer)">
                查看详情
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 协作评分系统 -->
      <div class="collaborative-scoring">
        <div class="scoring-header">
          <h5>协作评分与决策</h5>
          <div class="scoring-mode">
            <el-radio-group v-model="scoringMode" size="small">
              <el-radio-button value="independent">独立评分</el-radio-button>
              <el-radio-button value="discussion">讨论评分</el-radio-button>
              <el-radio-button value="consensus">共识评分</el-radio-button>
            </el-radio-group>
          </div>
        </div>

        <div class="scoring-sessions">
          <div class="session-card" v-for="session in scoringSessions" :key="session.id">
            <div class="session-header">
              <div class="candidate-info">
                <el-avatar :size="40" :src="session.candidate.avatar" />
                <div class="candidate-details">
                  <h6>{{ session.candidate.name }}</h6>
                  <span class="candidate-position">{{ session.candidate.position }}</span>
                </div>
              </div>
              <div class="session-status">
                <el-tag :type="getSessionStatusType(session.status)">
                  {{ session.statusText }}
                </el-tag>
              </div>
            </div>

            <div class="scoring-progress">
              <div class="progress-item" v-for="interviewer in session.interviewers" :key="interviewer.id">
                <div class="interviewer-name">{{ interviewer.name }}</div>
                <div class="score-status">
                  <el-rate 
                    v-if="interviewer.score" 
                    v-model="interviewer.score" 
                    disabled 
                    show-score 
                    text-color="#ff9900"
                  />
                  <span v-else class="pending-score">待评分</span>
                </div>
              </div>
            </div>

            <div class="session-actions">
              <el-button size="small" type="primary" @click="participateScoring(session)">
                参与评分
              </el-button>
              <el-button size="small" @click="viewScoringDetails(session)">
                查看详情
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 人才库运营 -->
    <div v-if="activeTab === 'talent-pool'" class="feature-panel talent-pool-panel">
      <div class="panel-header">
        <h4>人才库运营管理</h4>
        <div class="talent-actions">
          <el-button type="primary" @click="addTalentProfile">
            <el-icon><CirclePlus /></el-icon>
            添加人才档案
          </el-button>
          <el-button @click="importTalentData">
            <el-icon><Upload /></el-icon>
            批量导入
          </el-button>
          <el-button @click="exportTalentData">
            <el-icon><Download /></el-icon>
            导出数据
          </el-button>
        </div>
      </div>

      <!-- 人才库统计 -->
      <div class="talent-statistics">
        <div class="stats-overview">
          <div class="overview-card" v-for="overview in talentOverview" :key="overview.name">
            <div class="overview-icon" :style="{ backgroundColor: overview.color }">
              <el-icon>
                <component :is="overview.icon" />
              </el-icon>
            </div>
            <div class="overview-content">
              <div class="overview-value">{{ overview.value }}</div>
              <div class="overview-label">{{ overview.name }}</div>
              <div class="overview-change" :class="{ positive: overview.change > 0 }">
                <el-icon>
                  <component :is="overview.change > 0 ? 'ArrowUp' : 'ArrowDown'" />
                </el-icon>
                {{ Math.abs(overview.change) }}%
              </div>
            </div>
          </div>
        </div>

        <!-- 技能分布图表 -->
        <div class="skills-distribution">
          <h5>技能分布统计</h5>
          <div class="skills-chart">
            <div class="skill-bar" v-for="skill in skillsDistribution" :key="skill.name">
              <div class="skill-info">
                <span class="skill-name">{{ skill.name }}</span>
                <span class="skill-count">{{ skill.count }}人</span>
              </div>
              <div class="skill-progress">
                <div 
                  class="skill-fill" 
                  :style="{ 
                    width: (skill.count / maxSkillCount * 100) + '%',
                    backgroundColor: skill.color 
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 人才搜索与筛选 -->
      <div class="talent-search-filter">
        <div class="search-header">
          <h5>人才搜索与筛选</h5>
          <div class="search-stats">
            <span class="search-result-count">找到 {{ filteredTalents.length }} 位候选人</span>
          </div>
        </div>

        <div class="search-controls">
          <div class="search-input">
            <el-input
              v-model="searchQuery"
              placeholder="搜索姓名、技能、公司..."
              @input="onSearchInput"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>

          <div class="filter-controls">
            <el-select v-model="talentFilter.experience" placeholder="工作经验" clearable>
              <el-option label="1-3年" value="1-3" />
              <el-option label="3-5年" value="3-5" />
              <el-option label="5-8年" value="5-8" />
              <el-option label="8年以上" value="8+" />
            </el-select>

            <el-select v-model="talentFilter.education" placeholder="学历要求" clearable>
              <el-option label="本科" value="bachelor" />
              <el-option label="硕士" value="master" />
              <el-option label="博士" value="phd" />
            </el-select>

            <el-select v-model="talentFilter.location" placeholder="工作地点" clearable>
              <el-option label="北京" value="beijing" />
              <el-option label="上海" value="shanghai" />
              <el-option label="深圳" value="shenzhen" />
              <el-option label="杭州" value="hangzhou" />
            </el-select>

            <el-select v-model="talentFilter.status" placeholder="候选人状态" clearable>
              <el-option label="活跃" value="active" />
              <el-option label="求职中" value="job-seeking" />
              <el-option label="观望中" value="passive" />
            </el-select>
          </div>

          <div class="advanced-filters">
            <el-button size="small" @click="showAdvancedFilters = !showAdvancedFilters">
              <el-icon><Search /></el-icon>
              高级筛选
            </el-button>
            <el-button size="small" @click="saveSearchTemplate">
              <el-icon><Collection /></el-icon>
              保存搜索
            </el-button>
          </div>
        </div>

        <!-- 高级筛选面板 -->
        <div v-if="showAdvancedFilters" class="advanced-filter-panel">
          <div class="filter-section">
            <h6>技能要求</h6>
            <el-select v-model="advancedFilter.skills" multiple placeholder="选择技能标签">
              <el-option v-for="skill in availableSkills" :key="skill" :label="skill" :value="skill" />
            </el-select>
          </div>

          <div class="filter-section">
            <h6>薪资范围</h6>
            <el-slider
              v-model="advancedFilter.salaryRange"
              range
              :min="0"
              :max="100"
              :format-tooltip="formatSalary"
            />
          </div>

          <div class="filter-section">
            <h6>面试评分</h6>
            <el-rate v-model="advancedFilter.minRating" show-text />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import {
  UserFilled, Connection, DataBoard, Plus, Upload, Download, ArrowUp, ArrowDown,
  MagicStick, Calendar, Search, Filter, Collection, Check
} from '@element-plus/icons-vue'

// 基础状态
const activeTab = ref('batch-interview')
const searchQuery = ref('')
const showAdvancedFilters = ref(false)
const scoringMode = ref('independent')

// 批量面试相关数据
const batchFilter = reactive({
  status: 'all',
  position: 'all'
})

const batchStats = reactive([
  {
    name: '进行中面试',
    value: '12',
    trend: 8.5,
    color: '#3498db',
    icon: 'UserFilled'
  },
  {
    name: '今日完成',
    value: '28',
    trend: 15.2,
    color: '#2ecc71',
    icon: 'Check'
  },
  {
    name: '待处理',
    value: '6',
    trend: -5.3,
    color: '#f39c12',
    icon: 'Clock'
  },
  {
    name: '总候选人',
    value: '156',
    trend: 12.8,
    color: '#e74c3c',
    icon: 'DataBoard'
  }
])

const batchInterviews = reactive([
  {
    id: 1,
    title: '前端工程师批量面试 - 第3期',
    status: 'ongoing',
    statusText: '进行中',
    progress: 65,
    completedCount: 13,
    totalCount: 20,
    position: '前端工程师',
    interviewers: [
      { id: 1, avatar: '/images/placeholder-feature.jpg' },
      { id: 2, avatar: '/images/placeholder-feature.jpg' },
      { id: 3, avatar: '/images/placeholder-feature.jpg' },
      { id: 4, avatar: '/images/placeholder-feature.jpg' }
    ],
    createdAt: new Date('2024-01-15')
  },
  {
    id: 2,
    title: '算法工程师专场面试',
    status: 'preparing',
    statusText: '准备中',
    progress: 25,
    completedCount: 3,
    totalCount: 12,
    position: '算法工程师',
    interviewers: [
      { id: 5, avatar: '/images/placeholder-feature.jpg' },
      { id: 6, avatar: '/images/placeholder-feature.jpg' }
    ],
    createdAt: new Date('2024-01-18')
  },
  {
    id: 3,
    title: '后端开发团队扩招',
    status: 'completed',
    statusText: '已完成',
    progress: 100,
    completedCount: 15,
    totalCount: 15,
    position: '后端工程师',
    interviewers: [
      { id: 7, avatar: '/images/placeholder-feature.jpg' },
      { id: 8, avatar: '/images/placeholder-feature.jpg' },
      { id: 9, avatar: '/images/placeholder-feature.jpg' }
    ],
    createdAt: new Date('2024-01-10')
  }
])

// 团队协作相关数据
const teamStats = reactive([
  {
    name: '团队成员',
    value: '24',
    color: '#3498db',
    icon: 'UserFilled'
  },
  {
    name: '活跃面试官',
    value: '18',
    color: '#2ecc71',
    icon: 'Connection'
  },
  {
    name: '本周面试',
    value: '89',
    color: '#f39c12',
    icon: 'Calendar'
  },
  {
    name: '平均评分',
    value: '4.2',
    color: '#e74c3c',
    icon: 'Medal'
  }
])

const interviewers = reactive([
  {
    id: 1,
    name: '张技术总监',
    role: '技术总监',
    department: '研发部',
    avatar: '/images/placeholder-demo.jpg',
    status: 'online',
    weeklyInterviews: 8,
    avgRating: 4.5,
    expertise: ['Vue.js', 'React', 'Node.js', '系统架构']
  },
  {
    id: 2,
    name: '李高级工程师',
    role: '高级工程师',
    department: '前端团队',
    avatar: '/images/placeholder-demo.jpg',
    status: 'busy',
    weeklyInterviews: 12,
    avgRating: 4.2,
    expertise: ['JavaScript', 'TypeScript', '性能优化']
  },
  {
    id: 3,
    name: '王算法专家',
    role: '算法专家',
    department: 'AI团队',
    avatar: '/images/placeholder-demo.jpg',
    status: 'offline',
    weeklyInterviews: 6,
    avgRating: 4.8,
    expertise: ['机器学习', '深度学习', 'Python']
  }
])

const scoringSessions = reactive([
  {
    id: 1,
    candidate: {
      name: '候选人A',
      position: '前端工程师',
      avatar: '/images/placeholder-case.jpg'
    },
    status: 'in-progress',
    statusText: '评分中',
    interviewers: [
      { id: 1, name: '张总监', score: 4 },
      { id: 2, name: '李工程师', score: null },
      { id: 3, name: '王专家', score: 5 }
    ]
  },
  {
    id: 2,
    candidate: {
      name: '候选人B',
      position: '算法工程师',
      avatar: '/images/placeholder-case.jpg'
    },
    status: 'completed',
    statusText: '已完成',
    interviewers: [
      { id: 1, name: '张总监', score: 3 },
      { id: 2, name: '李工程师', score: 4 },
      { id: 3, name: '王专家', score: 4 }
    ]
  }
])

// 人才库相关数据
const talentFilter = reactive({
  experience: '',
  education: '',
  location: '',
  status: ''
})

const advancedFilter = reactive({
  skills: [],
  salaryRange: [20, 80],
  minRating: 0
})

const talentOverview = reactive([
  {
    name: '总人才数',
    value: '2,847',
    change: 12.5,
    color: '#3498db',
    icon: 'UserFilled'
  },
  {
    name: '活跃候选人',
    value: '1,256',
    change: 8.3,
    color: '#2ecc71',
    icon: 'Connection'
  },
  {
    name: '本月新增',
    value: '189',
    change: 15.7,
    color: '#f39c12',
    icon: 'Plus'
  },
  {
    name: '成功入职',
    value: '78',
    change: 22.1,
    color: '#e74c3c',
    icon: 'Medal'
  }
])

const skillsDistribution = reactive([
  { name: 'JavaScript', count: 456, color: '#f7df1e' },
  { name: 'Vue.js', count: 389, color: '#4fc08d' },
  { name: 'React', count: 342, color: '#61dafb' },
  { name: 'Python', count: 298, color: '#3776ab' },
  { name: 'Java', count: 267, color: '#ed8b00' },
  { name: 'Node.js', count: 234, color: '#339933' },
  { name: 'TypeScript', count: 198, color: '#3178c6' },
  { name: 'Go', count: 156, color: '#00add8' }
])

const availableSkills = [
  'JavaScript', 'Vue.js', 'React', 'Python', 'Java', 'Node.js',
  'TypeScript', 'Go', 'Docker', 'Kubernetes', 'AWS', 'MySQL'
]

const talents = reactive([
  {
    id: 1,
    name: '张小明',
    position: '前端工程师',
    experience: '3-5',
    education: 'bachelor',
    location: 'beijing',
    status: 'active',
    skills: ['Vue.js', 'JavaScript', 'TypeScript'],
    rating: 4.2,
    salary: 25
  },
  {
    id: 2,
    name: '李小红',
    position: '后端工程师',
    experience: '5-8',
    education: 'master',
    location: 'shanghai',
    status: 'job-seeking',
    skills: ['Java', 'Spring', 'MySQL'],
    rating: 4.5,
    salary: 35
  }
])

// 计算属性
const maxSkillCount = computed(() => {
  return Math.max(...skillsDistribution.map(skill => skill.count))
})

const filteredBatchInterviews = computed(() => {
  return batchInterviews.filter(interview => {
    const statusMatch = batchFilter.status === 'all' || interview.status === batchFilter.status
    const positionMatch = batchFilter.position === 'all' || interview.position.includes(batchFilter.position)
    return statusMatch && positionMatch
  })
})

const filteredTalents = computed(() => {
  return talents.filter(talent => {
    const queryMatch = !searchQuery.value ||
      talent.name.includes(searchQuery.value) ||
      talent.skills.some(skill => skill.includes(searchQuery.value))

    const experienceMatch = !talentFilter.experience || talent.experience === talentFilter.experience
    const educationMatch = !talentFilter.education || talent.education === talentFilter.education
    const locationMatch = !talentFilter.location || talent.location === talentFilter.location
    const statusMatch = !talentFilter.status || talent.status === talentFilter.status

    return queryMatch && experienceMatch && educationMatch && locationMatch && statusMatch
  })
})

// 方法定义
const onTabChange = (tabName) => {
  console.log('切换到标签:', tabName)
}

const getStatusType = (status) => {
  const typeMap = {
    'preparing': 'info',
    'ongoing': 'primary',
    'completed': 'success',
    'paused': 'warning',
    'cancelled': 'danger'
  }
  return typeMap[status] || 'info'
}

const getProgressColor = (progress) => {
  if (progress >= 80) return '#2ecc71'
  if (progress >= 60) return '#f39c12'
  return '#e74c3c'
}

const getSessionStatusType = (status) => {
  const typeMap = {
    'pending': 'info',
    'in-progress': 'primary',
    'completed': 'success'
  }
  return typeMap[status] || 'info'
}

const formatDate = (date) => {
  return date.toLocaleDateString('zh-CN')
}

const formatSalary = (value) => {
  return `${value}K`
}

// 批量面试方法
const createBatchInterview = () => {
  console.log('创建批量面试')
}

const importCandidates = () => {
  console.log('批量导入候选人')
}

const manageBatchInterview = (interview) => {
  console.log('管理批量面试:', interview.title)
}

const viewBatchReport = (interview) => {
  console.log('查看批量面试报告:', interview.title)
}

const handleBatchAction = (command) => {
  console.log('批量面试操作:', command.action, command.interview.title)
}

// 团队协作方法
const inviteTeamMember = () => {
  console.log('邀请团队成员')
}

const createTeam = () => {
  console.log('创建团队')
}

const autoAssignInterviewers = () => {
  console.log('智能分配面试官')
}

const viewScheduleCalendar = () => {
  console.log('查看日程日历')
}

const assignInterview = (interviewer) => {
  console.log('分配面试给:', interviewer.name)
}

const viewInterviewerProfile = (interviewer) => {
  console.log('查看面试官详情:', interviewer.name)
}

const participateScoring = (session) => {
  console.log('参与评分:', session.candidate.name)
}

const viewScoringDetails = (session) => {
  console.log('查看评分详情:', session.candidate.name)
}

// 人才库方法
const addTalentProfile = () => {
  console.log('添加人才档案')
}

const importTalentData = () => {
  console.log('批量导入人才数据')
}

const exportTalentData = () => {
  console.log('导出人才数据')
}

const onSearchInput = () => {
  console.log('搜索输入:', searchQuery.value)
}

const saveSearchTemplate = () => {
  console.log('保存搜索模板')
}

onMounted(() => {
  console.log('企业端专业功能组件已加载')
})
</script>

<style scoped>
.enterprise-professional-features {
  padding: 24px;
  background: #f8f9fa;
  min-height: 100vh;
}

/* 功能导航标签样式 */
.features-navigation {
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

/* 批量面试管理样式 */
.batch-actions,
.collaboration-actions,
.talent-actions {
  display: flex;
  gap: 12px;
}

.batch-overview {
  margin-bottom: 32px;
}

.overview-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
}

.stat-card {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 8px;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
}

.stat-trend.positive {
  color: #2ecc71;
}

.stat-trend.negative {
  color: #e74c3c;
}

/* 批量面试列表样式 */
.batch-interviews-list {
  margin-bottom: 32px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.list-header h5 {
  font-size: 18px;
  color: #2c3e50;
  margin: 0;
}

.list-filters {
  display: flex;
  gap: 12px;
}

.interviews-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.interview-card {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 24px;
  border-left: 4px solid var(--iflytek-primary);
  transition: all 0.3s ease;
}

.interview-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.interview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.interview-title h6 {
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 8px;
}

.interview-progress {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 120px;
}

.progress-text {
  font-size: 12px;
  color: #7f8c8d;
  font-weight: 600;
}

.interview-details {
  margin-bottom: 20px;
}

.detail-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.detail-label {
  font-size: 12px;
  color: #95a5a6;
  min-width: 60px;
}

.detail-value {
  font-size: 14px;
  color: #2c3e50;
  font-weight: 600;
}

.interviewers-list {
  display: flex;
  align-items: center;
  gap: 4px;
}

.more-count {
  font-size: 12px;
  color: #7f8c8d;
  margin-left: 4px;
}

.interview-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* 团队协作样式 */
.team-overview {
  margin-bottom: 32px;
}

.team-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
}

.team-stat-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
}

.team-stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.team-stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.team-stat-content {
  flex: 1;
}

.team-stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 4px;
}

.team-stat-label {
  font-size: 12px;
  color: #7f8c8d;
}

/* 面试官分配样式 */
.interviewer-assignment {
  margin-bottom: 32px;
}

.assignment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.assignment-header h5 {
  font-size: 18px;
  color: #2c3e50;
  margin: 0;
}

.assignment-controls {
  display: flex;
  gap: 8px;
}

.interviewers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.interviewer-card {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  transition: all 0.3s ease;
}

.interviewer-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.interviewer-avatar {
  position: relative;
  margin-bottom: 16px;
}

.status-indicator {
  position: absolute;
  bottom: 5px;
  right: calc(50% - 35px);
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
}

.status-indicator.online {
  background: #2ecc71;
}

.status-indicator.busy {
  background: #f39c12;
}

.status-indicator.offline {
  background: #95a5a6;
}

.interviewer-info h6 {
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 4px;
}

.interviewer-role {
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 2px;
}

.interviewer-department {
  font-size: 12px;
  color: #95a5a6;
  margin-bottom: 16px;
}

.interviewer-stats {
  margin-bottom: 20px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 12px;
}

.stat-label {
  color: #7f8c8d;
}

.stat-value {
  color: #2c3e50;
  font-weight: 600;
}

.expertise-tags {
  display: flex;
  justify-content: center;
  gap: 4px;
  flex-wrap: wrap;
}

.interviewer-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}

/* 协作评分样式 */
.collaborative-scoring {
  margin-bottom: 32px;
}

.scoring-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.scoring-header h5 {
  font-size: 18px;
  color: #2c3e50;
  margin: 0;
}

.scoring-sessions {
  space-y: 16px;
}

.session-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  border-left: 4px solid var(--iflytek-primary);
}

.session-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.candidate-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.candidate-details h6 {
  font-size: 14px;
  color: #2c3e50;
  margin-bottom: 4px;
}

.candidate-position {
  font-size: 12px;
  color: #7f8c8d;
}

.scoring-progress {
  margin-bottom: 16px;
}

.progress-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e9ecef;
}

.progress-item:last-child {
  border-bottom: none;
}

.interviewer-name {
  font-size: 14px;
  color: #2c3e50;
  font-weight: 600;
}

.pending-score {
  font-size: 12px;
  color: #f39c12;
  font-style: italic;
}

.session-actions {
  display: flex;
  gap: 8px;
}

/* 人才库运营样式 */
.talent-statistics {
  margin-bottom: 32px;
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.overview-card {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
}

.overview-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.overview-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.overview-content {
  flex: 1;
}

.overview-value {
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 4px;
}

.overview-label {
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 8px;
}

.overview-change {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: #e74c3c;
}

.overview-change.positive {
  color: #2ecc71;
}

/* 技能分布图表样式 */
.skills-distribution {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.skills-distribution h5 {
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 20px;
}

.skills-chart {
  space-y: 12px;
}

.skill-bar {
  margin-bottom: 12px;
}

.skill-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.skill-name {
  font-size: 14px;
  color: #2c3e50;
  font-weight: 600;
}

.skill-count {
  font-size: 12px;
  color: #7f8c8d;
}

.skill-progress {
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.skill-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

/* 人才搜索筛选样式 */
.talent-search-filter {
  margin-bottom: 32px;
}

.search-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.search-header h5 {
  font-size: 18px;
  color: #2c3e50;
  margin: 0;
}

.search-result-count {
  font-size: 14px;
  color: #7f8c8d;
}

.search-controls {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 300px;
}

.filter-controls {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.advanced-filters {
  display: flex;
  gap: 8px;
}

/* 高级筛选面板样式 */
.advanced-filter-panel {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
  margin-top: 16px;
  border: 1px solid #e9ecef;
}

.filter-section {
  margin-bottom: 20px;
}

.filter-section:last-child {
  margin-bottom: 0;
}

.filter-section h6 {
  font-size: 14px;
  color: #2c3e50;
  margin-bottom: 12px;
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .enterprise-professional-features {
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

  .batch-actions,
  .collaboration-actions,
  .talent-actions {
    flex-direction: column;
    width: 100%;
  }

  .overview-stats,
  .team-stats,
  .stats-overview {
    grid-template-columns: 1fr;
  }

  .interviews-grid,
  .interviewers-grid {
    grid-template-columns: 1fr;
  }

  .list-header,
  .assignment-header,
  .scoring-header,
  .search-header {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }

  .list-filters,
  .assignment-controls,
  .filter-controls {
    flex-direction: column;
    width: 100%;
  }

  .search-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input {
    min-width: auto;
  }

  .interview-header,
  .session-header {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }

  .interview-progress {
    min-width: auto;
    justify-content: center;
  }

  .interviewer-actions,
  .interview-actions,
  .session-actions {
    flex-direction: column;
  }

  .advanced-filters {
    flex-direction: column;
    width: 100%;
  }
}

/* 动画效果 */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.interview-card,
.interviewer-card,
.session-card,
.overview-card {
  animation: slideIn 0.3s ease-out;
}

/* 状态指示器动画 */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.status-indicator.online {
  animation: pulse 2s infinite;
}
</style>
