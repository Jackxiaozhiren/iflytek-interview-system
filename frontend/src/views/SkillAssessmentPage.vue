<template>
  <div class="skill-assessment-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-container">
        <div class="header-content">
          <div class="page-title">
            <el-icon class="title-icon"><Trophy /></el-icon>
            <h1>技能评估</h1>
          </div>
          <p class="page-subtitle">全面评估您的专业技能水平，获得个性化提升建议</p>
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
        <!-- 评估概览 -->
        <div class="assessment-overview">
          <div class="overview-card">
            <div class="overview-content">
              <h2>技能评估中心</h2>
              <p>通过AI智能评估，了解您的技能水平和发展方向</p>
              <div class="overview-stats">
                <div class="stat-item">
                  <div class="stat-value">{{ completedAssessments }}</div>
                  <div class="stat-label">已完成评估</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">{{ averageScore }}</div>
                  <div class="stat-label">平均得分</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">{{ skillLevel }}</div>
                  <div class="stat-label">技能等级</div>
                </div>
              </div>
            </div>
            <div class="overview-actions">
              <el-button type="primary" size="large" @click="startNewAssessment">
                <el-icon><Trophy /></el-icon>
                开始新评估
              </el-button>
            </div>
          </div>
        </div>

        <!-- 评估类型选择 -->
        <div class="assessment-types">
          <div class="section-header">
            <h2>选择评估类型</h2>
            <p>根据您的需求选择合适的技能评估</p>
          </div>
          
          <div class="types-grid">
            <div 
              v-for="type in assessmentTypes" 
              :key="type.id"
              class="type-card"
              @click="selectAssessmentType(type)"
            >
              <div class="type-icon">
                <el-icon><component :is="type.icon" /></el-icon>
              </div>
              <div class="type-content">
                <h3>{{ type.title }}</h3>
                <p>{{ type.description }}</p>
                <div class="type-meta">
                  <span class="duration">{{ type.duration }}</span>
                  <span class="difficulty">{{ type.difficulty }}</span>
                  <span class="questions">{{ type.questionCount }}题</span>
                </div>
              </div>
              <div class="type-status">
                <el-tag v-if="type.completed" type="success">已完成</el-tag>
                <el-tag v-else type="info">未开始</el-tag>
              </div>
            </div>
          </div>
        </div>

        <!-- 技能雷达图 -->
        <div class="skill-radar">
          <div class="section-header">
            <h2>技能分析图</h2>
            <p>直观了解您的技能分布和强弱项</p>
          </div>
          
          <div class="radar-container">
            <div class="radar-chart">
              <div ref="skillRadarChart" class="chart-container"></div>
            </div>
            <div class="radar-legend">
              <h4>技能维度</h4>
              <div class="legend-items">
                <div v-for="skill in skillDimensions" :key="skill.id" class="legend-item">
                  <div class="legend-color" :style="{ backgroundColor: skill.color }"></div>
                  <div class="legend-info">
                    <div class="legend-name">{{ skill.name }}</div>
                    <div class="legend-score">{{ skill.score }}/100</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 评估历史 -->
        <div class="assessment-history">
          <div class="section-header">
            <h2>评估历史</h2>
            <p>查看您的技能评估记录和成长轨迹</p>
          </div>
          
          <div class="history-table">
            <div class="table-header">
              <div class="header-cell">评估类型</div>
              <div class="header-cell">完成时间</div>
              <div class="header-cell">得分</div>
              <div class="header-cell">等级</div>
              <div class="header-cell">操作</div>
            </div>
            <div class="table-body">
              <div v-for="record in assessmentHistory" :key="record.id" class="table-row">
                <div class="table-cell">
                  <div class="assessment-info">
                    <el-icon><component :is="record.icon" /></el-icon>
                    <span>{{ record.type }}</span>
                  </div>
                </div>
                <div class="table-cell">{{ formatDate(record.date) }}</div>
                <div class="table-cell">
                  <div class="score-badge" :class="getScoreLevel(record.score)">
                    {{ record.score }}分
                  </div>
                </div>
                <div class="table-cell">
                  <el-tag :type="getLevelType(record.level)">{{ record.level }}</el-tag>
                </div>
                <div class="table-cell">
                  <el-button text size="small" @click="viewReport(record.id)">查看报告</el-button>
                  <el-button text size="small" type="primary" @click="retakeAssessment(record)">重新评估</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 提升建议 -->
        <div class="improvement-suggestions">
          <div class="section-header">
            <h2>提升建议</h2>
            <p>基于AI分析的个性化技能提升建议</p>
          </div>
          
          <div class="suggestions-grid">
            <div v-for="suggestion in improvementSuggestions" :key="suggestion.id" class="suggestion-card">
              <div class="suggestion-header">
                <div class="suggestion-icon" :class="suggestion.priority">
                  <el-icon><component :is="suggestion.icon" /></el-icon>
                </div>
                <div class="suggestion-meta">
                  <h4>{{ suggestion.title }}</h4>
                  <div class="suggestion-priority">{{ suggestion.priority }}</div>
                </div>
              </div>
              <div class="suggestion-content">
                <p>{{ suggestion.description }}</p>
                <div class="suggestion-actions">
                  <el-button size="small" @click="viewSuggestionDetail(suggestion)">查看详情</el-button>
                  <el-button size="small" type="primary" @click="startLearning(suggestion)">开始学习</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 评估确认对话框 -->
    <el-dialog
      v-model="showAssessmentDialog"
      :title="`开始${selectedAssessment?.title || '评估'}`"
      width="500px"
      center
    >
      <div v-if="selectedAssessment" class="assessment-dialog">
        <div class="dialog-header">
          <div class="assessment-icon">
            <el-icon><component :is="selectedAssessment.icon" /></el-icon>
          </div>
          <div class="assessment-info">
            <h3>{{ selectedAssessment.title }}</h3>
            <p>{{ selectedAssessment.description }}</p>
          </div>
        </div>

        <div class="dialog-content">
          <div class="assessment-details">
            <div class="detail-item">
              <el-icon><Timer /></el-icon>
              <span>评估时长: {{ selectedAssessment.duration }}</span>
            </div>
            <div class="detail-item">
              <el-icon><Document /></el-icon>
              <span>题目数量: {{ selectedAssessment.questionCount }}题</span>
            </div>
            <div class="detail-item">
              <el-icon><Star /></el-icon>
              <span>难度等级: {{ selectedAssessment.difficulty }}</span>
            </div>
          </div>

          <div class="assessment-tips">
            <h4>评估须知</h4>
            <ul>
              <li>请确保网络连接稳定，避免中途断网</li>
              <li>评估过程中请专注答题，避免切换页面</li>
              <li>每道题目都有时间限制，请合理分配时间</li>
              <li>提交后无法修改答案，请仔细检查</li>
            </ul>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showAssessmentDialog = false">取消</el-button>
          <el-button type="primary" @click="startAssessment">
            开始评估
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Trophy, ArrowLeft, TrendCharts, Star, Cpu,
  Document, Grid, Timer, InfoFilled, ChatDotRound
} from '@element-plus/icons-vue'
import * as echarts from 'echarts'

const router = useRouter()

// 响应式数据
const completedAssessments = ref(5)
const averageScore = ref(87)
const skillLevel = ref('高级')
const skillRadarChart = ref(null)
const showAssessmentDialog = ref(false)
const selectedAssessment = ref(null)

// 评估类型
const assessmentTypes = reactive([
  {
    id: 'technical',
    title: '技术能力评估',
    description: '评估编程、算法、系统设计等技术技能',
    icon: 'Cpu',
    duration: '45分钟',
    difficulty: '中高级',
    questionCount: 25,
    completed: true
  },
  {
    id: 'communication',
    title: '沟通表达评估',
    description: '评估口语表达、文字沟通、演讲能力',
    icon: 'ChatDotRound',
    duration: '30分钟',
    difficulty: '中级',
    questionCount: 20,
    completed: false
  },
  {
    id: 'leadership',
    title: '领导力评估',
    description: '评估团队管理、决策能力、影响力',
    icon: 'Star',
    duration: '35分钟',
    difficulty: '高级',
    questionCount: 18,
    completed: false
  },
  {
    id: 'problem-solving',
    title: '问题解决评估',
    description: '评估逻辑思维、分析能力、创新思维',
    icon: 'Grid',
    duration: '40分钟',
    difficulty: '中高级',
    questionCount: 22,
    completed: true
  }
])

// 技能维度
const skillDimensions = reactive([
  { id: 1, name: '技术能力', score: 92, color: '#1890ff' },
  { id: 2, name: '沟通表达', score: 85, color: '#52c41a' },
  { id: 3, name: '逻辑思维', score: 88, color: '#faad14' },
  { id: 4, name: '学习能力', score: 90, color: '#722ed1' },
  { id: 5, name: '团队协作', score: 82, color: '#eb2f96' },
  { id: 6, name: '创新思维', score: 79, color: '#13c2c2' }
])

// 评估历史
const assessmentHistory = reactive([
  {
    id: 1,
    type: '技术能力评估',
    icon: 'Cpu',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    score: 92,
    level: '高级'
  },
  {
    id: 2,
    type: '问题解决评估',
    icon: 'Grid',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    score: 88,
    level: '中高级'
  },
  {
    id: 3,
    type: '沟通表达评估',
    icon: 'ChatDotRound',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
    score: 85,
    level: '中高级'
  }
])

// 提升建议
const improvementSuggestions = reactive([
  {
    id: 1,
    title: '加强算法基础',
    description: '建议深入学习动态规划和图算法，提升算法解题能力',
    icon: 'Cpu',
    priority: '高优先级'
  },
  {
    id: 2,
    title: '提升沟通技巧',
    description: '建议参加演讲训练，提高技术方案的表达和沟通能力',
    icon: 'ChatDotRound',
    priority: '中优先级'
  },
  {
    id: 3,
    title: '学习系统设计',
    description: '建议学习分布式系统设计，提升架构设计能力',
    icon: 'Grid',
    priority: '高优先级'
  }
])

// 方法
const startNewAssessment = () => {
  ElMessage.info('请先选择评估类型')
}

const selectAssessmentType = (type) => {
  selectedAssessment.value = type
  showAssessmentDialog.value = true
}

const startAssessment = () => {
  if (!selectedAssessment.value) return

  // 更新评估状态为进行中
  const assessment = assessmentTypes.find(a => a.id === selectedAssessment.value.id)
  if (assessment) {
    assessment.status = 'in-progress'
  }

  showAssessmentDialog.value = false
  ElMessage.success(`开始${selectedAssessment.value.title}`)

  // 跳转到评估页面
  router.push(`/assessment-exam?type=${selectedAssessment.value.id}`)
}

const formatDate = (date) => {
  return date.toLocaleDateString('zh-CN')
}

const getScoreLevel = (score) => {
  if (score >= 90) return 'excellent'
  if (score >= 80) return 'good'
  if (score >= 70) return 'average'
  return 'poor'
}

const getLevelType = (level) => {
  const levelMap = {
    '高级': 'success',
    '中高级': 'warning',
    '中级': 'info',
    '初级': 'danger'
  }
  return levelMap[level] || 'info'
}

const viewReport = (recordId) => {
  router.push(`/assessment-report?id=${recordId}`)
}

const retakeAssessment = (record) => {
  ElMessage.info(`重新开始${record.type}`)
}

const viewSuggestionDetail = (suggestion) => {
  ElMessage.info(`查看${suggestion.title}详情`)
}

const startLearning = (suggestion) => {
  ElMessage.success(`开始学习${suggestion.title}`)
  router.push('/learning-path')
}

// 初始化技能雷达图
const initSkillRadarChart = () => {
  if (!skillRadarChart.value) return

  const chart = echarts.init(skillRadarChart.value)
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    radar: {
      indicator: skillDimensions.map(skill => ({
        name: skill.name,
        max: 100
      })),
      radius: '70%',
      splitNumber: 5,
      splitLine: {
        lineStyle: {
          color: '#e6f7ff'
        }
      },
      splitArea: {
        areaStyle: {
          color: ['rgba(24, 144, 255, 0.1)', 'rgba(24, 144, 255, 0.05)']
        }
      },
      axisLine: {
        lineStyle: {
          color: '#1890ff'
        }
      },
      name: {
        textStyle: {
          color: '#1a1a1a',
          fontSize: 12
        }
      }
    },
    series: [{
      type: 'radar',
      data: [{
        value: skillDimensions.map(skill => skill.score),
        name: '当前技能水平',
        areaStyle: {
          color: 'rgba(24, 144, 255, 0.3)'
        },
        lineStyle: {
          color: '#1890ff',
          width: 2
        },
        itemStyle: {
          color: '#1890ff'
        }
      }]
    }]
  }

  chart.setOption(option)

  // 响应式调整
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

// 生命周期
onMounted(() => {
  // 延迟初始化图表，确保DOM已渲染
  setTimeout(() => {
    initSkillRadarChart()
  }, 100)
})
</script>

<style scoped>
.skill-assessment-page {
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

.assessment-overview {
  margin-bottom: 60px;
}

.overview-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.overview-content h2 {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.overview-content p {
  color: #666;
  margin-bottom: 24px;
}

.overview-stats {
  display: flex;
  gap: 40px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #1890ff;
  margin-bottom: 4px;
}

.stat-label {
  color: #666;
  font-size: 14px;
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

.types-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 60px;
}

.type-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.type-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.type-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #1890ff, #667eea);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.type-icon .el-icon {
  font-size: 24px;
  color: white;
}

.type-content h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.type-content p {
  color: #666;
  margin-bottom: 16px;
  line-height: 1.5;
}

.type-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #999;
}

.type-status {
  position: absolute;
  top: 16px;
  right: 16px;
}

.radar-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 32px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
  margin-bottom: 60px;
}

.chart-container {
  height: 300px;
  width: 100%;
}

.radar-legend h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.legend-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
}

.legend-name {
  color: #1a1a1a;
}

.legend-score {
  color: #666;
  font-weight: 600;
}

.history-table {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 60px;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
  background: #f8f9fa;
  padding: 16px 24px;
  font-weight: 600;
  color: #1a1a1a;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
}

.table-row:last-child {
  border-bottom: none;
}

.assessment-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.score-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.score-badge.excellent {
  background: #f6ffed;
  color: #52c41a;
}

.score-badge.good {
  background: #fff7e6;
  color: #faad14;
}

.score-badge.average {
  background: #f0f9ff;
  color: #1890ff;
}

.score-badge.poor {
  background: #fff2f0;
  color: #ff4d4f;
}

.suggestions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.suggestion-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 24px;
}

.suggestion-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.suggestion-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.suggestion-icon.高优先级 {
  background: #ff4d4f;
}

.suggestion-icon.中优先级 {
  background: #faad14;
}

.suggestion-icon.低优先级 {
  background: #52c41a;
}

.suggestion-meta h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.suggestion-priority {
  font-size: 12px;
  color: #666;
}

.suggestion-content p {
  color: #666;
  margin-bottom: 16px;
  line-height: 1.5;
}

.suggestion-actions {
  display: flex;
  gap: 8px;
}

/* 评估对话框样式 */
.assessment-dialog {
  padding: 20px 0;
}

.dialog-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.assessment-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #1890ff, #667eea);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.assessment-info h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.assessment-info p {
  color: #666;
  margin: 0;
  font-size: 14px;
}

.assessment-details {
  margin-bottom: 24px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: #666;
  font-size: 14px;
}

.detail-item .el-icon {
  color: #1890ff;
}

.assessment-tips h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 12px;
}

.assessment-tips ul {
  margin: 0;
  padding-left: 20px;
  color: #666;
  font-size: 14px;
  line-height: 1.6;
}

.assessment-tips li {
  margin-bottom: 8px;
}

@media (max-width: 768px) {
  .overview-card {
    flex-direction: column;
    gap: 24px;
    text-align: center;
  }

  .overview-stats {
    justify-content: center;
  }

  .radar-container {
    grid-template-columns: 1fr;
  }

  .table-header, .table-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .table-header {
    display: none;
  }

  .table-row {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
