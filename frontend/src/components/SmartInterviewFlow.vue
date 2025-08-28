<template>
  <div class="smart-interview-flow">
    <!-- 智能面试流程控制台 -->
    <div class="flow-console">
      <div class="console-header">
        <h3>iFlytek Spark 智能面试流程</h3>
        <div class="flow-status">
          <el-tag :type="getStatusType(currentFlow.status)" size="large">
            {{ currentFlow.statusText }}
          </el-tag>
        </div>
      </div>

      <!-- 流程进度指示器 -->
      <div class="flow-progress">
        <el-steps :active="currentStep" align-center>
          <el-step 
            v-for="(step, index) in flowSteps" 
            :key="index"
            :title="step.title"
            :description="step.description"
            :status="getStepStatus(index)"
          >
            <template #icon>
              <el-icon>
                <component :is="step.icon" />
              </el-icon>
            </template>
          </el-step>
        </el-steps>
      </div>
    </div>

    <!-- 自适应问题生成器 -->
    <div class="adaptive-question-generator">
      <div class="generator-header">
        <h4>自适应问题生成</h4>
        <div class="generation-stats">
          <span class="stat-item">
            <el-icon><TrendCharts /></el-icon>
            适配度: {{ questionAdaptation.matchRate }}%
          </span>
          <span class="stat-item">
            <el-icon><Timer /></el-icon>
            生成时间: {{ questionAdaptation.generateTime }}ms
          </span>
        </div>
      </div>

      <div class="question-preview">
        <div class="current-question">
          <div class="question-meta">
            <el-tag type="primary">{{ currentQuestion.category }}</el-tag>
            <el-tag type="warning">难度: {{ currentQuestion.difficulty }}</el-tag>
            <el-tag type="info">预计时长: {{ currentQuestion.duration }}分钟</el-tag>
          </div>
          <div class="question-content">
            <p>{{ currentQuestion.content }}</p>
          </div>
          <div class="question-hints" v-if="currentQuestion.hints.length > 0">
            <h5>智能提示关键词:</h5>
            <div class="hints-list">
              <el-tag 
                v-for="hint in currentQuestion.hints" 
                :key="hint"
                size="small"
                effect="plain"
              >
                {{ hint }}
              </el-tag>
            </div>
          </div>
        </div>

        <div class="question-actions">
          <el-button type="primary" @click="generateNextQuestion">
            <el-icon><Refresh /></el-icon>
            生成下一题
          </el-button>
          <el-button type="success" @click="startAnswering">
            <el-icon><VideoPlay /></el-icon>
            开始回答
          </el-button>
        </div>
      </div>
    </div>

    <!-- 实时能力评估面板 -->
    <div class="realtime-assessment">
      <div class="assessment-header">
        <h4>实时能力评估</h4>
        <div class="assessment-mode">
          <el-switch
            v-model="assessmentMode.realtime"
            active-text="实时评估"
            inactive-text="延迟评估"
          />
        </div>
      </div>

      <div class="assessment-grid">
        <!-- 语音分析 -->
        <div class="assessment-card speech-analysis">
          <div class="card-header">
            <el-icon><Microphone /></el-icon>
            <span>语音表达分析</span>
          </div>
          <div class="analysis-content">
            <div class="metric-item">
              <span class="metric-label">语速适中度</span>
              <el-progress 
                :percentage="speechMetrics.speedScore" 
                :color="getScoreColor(speechMetrics.speedScore)"
                :show-text="false"
              />
              <span class="metric-value">{{ speechMetrics.speedScore }}%</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">表达清晰度</span>
              <el-progress 
                :percentage="speechMetrics.clarityScore" 
                :color="getScoreColor(speechMetrics.clarityScore)"
                :show-text="false"
              />
              <span class="metric-value">{{ speechMetrics.clarityScore }}%</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">逻辑连贯性</span>
              <el-progress 
                :percentage="speechMetrics.logicScore" 
                :color="getScoreColor(speechMetrics.logicScore)"
                :show-text="false"
              />
              <span class="metric-value">{{ speechMetrics.logicScore }}%</span>
            </div>
          </div>
        </div>

        <!-- 视频行为分析 -->
        <div class="assessment-card behavior-analysis">
          <div class="card-header">
            <el-icon><VideoCamera /></el-icon>
            <span>行为表现分析</span>
          </div>
          <div class="analysis-content">
            <div class="behavior-radar">
              <div class="radar-center">
                <span class="overall-score">{{ behaviorMetrics.overallScore }}</span>
                <small>综合评分</small>
              </div>
              <div class="behavior-indicators">
                <div class="indicator-item" v-for="indicator in behaviorMetrics.indicators" :key="indicator.name">
                  <span class="indicator-name">{{ indicator.name }}</span>
                  <div class="indicator-bar">
                    <div 
                      class="indicator-fill" 
                      :style="{ width: indicator.value + '%', backgroundColor: getIndicatorColor(indicator.value) }"
                    ></div>
                  </div>
                  <span class="indicator-value">{{ indicator.value }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 内容质量分析 -->
        <div class="assessment-card content-analysis">
          <div class="card-header">
            <el-icon><Document /></el-icon>
            <span>回答内容分析</span>
          </div>
          <div class="analysis-content">
            <div class="content-metrics">
              <div class="metric-circle">
                <div class="circle-progress" :style="{ '--progress': contentMetrics.relevanceScore + '%' }">
                  <span class="circle-text">{{ contentMetrics.relevanceScore }}%</span>
                  <small>相关性</small>
                </div>
              </div>
              <div class="metric-circle">
                <div class="circle-progress" :style="{ '--progress': contentMetrics.depthScore + '%' }">
                  <span class="circle-text">{{ contentMetrics.depthScore }}%</span>
                  <small>深度</small>
                </div>
              </div>
              <div class="metric-circle">
                <div class="circle-progress" :style="{ '--progress': contentMetrics.innovationScore + '%' }">
                  <span class="circle-text">{{ contentMetrics.innovationScore }}%</span>
                  <small>创新性</small>
                </div>
              </div>
            </div>
            <div class="content-keywords">
              <h5>关键词匹配:</h5>
              <div class="keywords-match">
                <span 
                  v-for="keyword in contentMetrics.keywords" 
                  :key="keyword.word"
                  class="keyword-match"
                  :class="{ 'matched': keyword.matched }"
                >
                  {{ keyword.word }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 智能追问机制 -->
    <div class="smart-followup">
      <div class="followup-header">
        <h4>智能追问机制</h4>
        <div class="followup-status">
          <el-badge :value="followupQueue.length" type="primary">
            <el-button size="small">待追问</el-button>
          </el-badge>
        </div>
      </div>

      <div class="followup-suggestions">
        <div class="suggestion-item" v-for="suggestion in followupSuggestions" :key="suggestion.id">
          <div class="suggestion-header">
            <el-tag :type="suggestion.priority === 'high' ? 'danger' : suggestion.priority === 'medium' ? 'warning' : 'info'">
              {{ suggestion.priorityText }}
            </el-tag>
            <span class="suggestion-trigger">基于: {{ suggestion.trigger }}</span>
          </div>
          <div class="suggestion-content">
            <p>{{ suggestion.question }}</p>
          </div>
          <div class="suggestion-actions">
            <el-button size="small" type="primary" @click="useFollowup(suggestion)">
              使用此追问
            </el-button>
            <el-button size="small" @click="modifyFollowup(suggestion)">
              修改后使用
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 面试总结与建议 -->
    <div class="interview-summary" v-if="showSummary">
      <div class="summary-header">
        <h4>面试总结与建议</h4>
        <div class="summary-score">
          <span class="final-score">{{ interviewSummary.finalScore }}</span>
          <small>综合评分</small>
        </div>
      </div>

      <div class="summary-content">
        <div class="strengths-weaknesses">
          <div class="strengths">
            <h5>优势表现</h5>
            <ul>
              <li v-for="strength in interviewSummary.strengths" :key="strength">
                <el-icon><Check /></el-icon>
                {{ strength }}
              </li>
            </ul>
          </div>
          <div class="weaknesses">
            <h5>改进建议</h5>
            <ul>
              <li v-for="weakness in interviewSummary.weaknesses" :key="weakness">
                <el-icon><Warning /></el-icon>
                {{ weakness }}
              </li>
            </ul>
          </div>
        </div>

        <div class="recommendation">
          <h5>iFlytek Spark 智能建议</h5>
          <div class="recommendation-content">
            <p>{{ interviewSummary.recommendation }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import {
  TrendCharts, Timer, Refresh, VideoPlay, Microphone, VideoCamera,
  Document, Check, Warning, User, Setting
} from '@element-plus/icons-vue'

// 流程状态管理
const currentStep = ref(0)
const currentFlow = reactive({
  status: 'preparing',
  statusText: '准备中'
})

// 流程步骤定义
const flowSteps = reactive([
  { title: '候选人准备', description: '系统检测与环境准备', icon: 'User' },
  { title: '智能问题生成', description: '基于简历自适应生成问题', icon: 'Setting' },
  { title: '实时面试进行', description: '多模态交互与实时评估', icon: 'VideoCamera' },
  { title: '智能追问分析', description: '深度挖掘与能力验证', icon: 'TrendCharts' },
  { title: '综合评估报告', description: '生成详细评估与建议', icon: 'Document' }
])

// 自适应问题生成
const questionAdaptation = reactive({
  matchRate: 92,
  generateTime: 156
})

const currentQuestion = reactive({
  category: '技术能力',
  difficulty: '中等',
  duration: 3,
  content: '请描述一下您在项目中遇到的最具挑战性的技术问题，以及您是如何解决的？',
  hints: ['问题分析', '解决方案', '技术选型', '结果验证', '经验总结']
})

// 评估模式设置
const assessmentMode = reactive({
  realtime: true
})

// 语音分析指标
const speechMetrics = reactive({
  speedScore: 85,
  clarityScore: 92,
  logicScore: 78
})

// 行为分析指标
const behaviorMetrics = reactive({
  overallScore: 86,
  indicators: [
    { name: '眼神交流', value: 88 },
    { name: '肢体语言', value: 82 },
    { name: '表情自然', value: 90 },
    { name: '坐姿端正', value: 85 }
  ]
})

// 内容分析指标
const contentMetrics = reactive({
  relevanceScore: 89,
  depthScore: 76,
  innovationScore: 83,
  keywords: [
    { word: '架构设计', matched: true },
    { word: '性能优化', matched: true },
    { word: '团队协作', matched: false },
    { word: '项目管理', matched: true }
  ]
})

// 追问队列和建议
const followupQueue = reactive([])
const followupSuggestions = reactive([
  {
    id: 1,
    priority: 'high',
    priorityText: '高优先级',
    trigger: '技术深度不足',
    question: '您刚才提到的解决方案，能否详细说明具体的技术实现细节？'
  },
  {
    id: 2,
    priority: 'medium',
    priorityText: '中优先级',
    trigger: '团队协作提及',
    question: '在解决这个问题的过程中，您是如何与团队成员协作的？'
  }
])

// 面试总结
const showSummary = ref(false)
const interviewSummary = reactive({
  finalScore: 82,
  strengths: [
    '技术基础扎实，能够清晰表达技术概念',
    '问题分析能力强，思路清晰有条理',
    '学习能力突出，对新技术有敏锐度'
  ],
  weaknesses: [
    '在团队协作方面的表达可以更具体',
    '项目管理经验需要进一步积累',
    '可以增加更多实际案例的分享'
  ],
  recommendation: '候选人具备良好的技术基础和学习能力，建议重点关注其团队协作和项目管理能力的培养。整体表现符合岗位要求，建议进入下一轮面试。'
})

// 计算属性和方法
const getStatusType = (status) => {
  const statusMap = {
    'preparing': 'info',
    'in-progress': 'primary',
    'completed': 'success',
    'paused': 'warning',
    'error': 'danger'
  }
  return statusMap[status] || 'info'
}

const getStepStatus = (index) => {
  if (index < currentStep.value) return 'finish'
  if (index === currentStep.value) return 'process'
  return 'wait'
}

const getScoreColor = (score) => {
  if (score >= 90) return '#2ecc71'
  if (score >= 80) return '#f39c12'
  if (score >= 70) return '#e67e22'
  return '#e74c3c'
}

const getIndicatorColor = (value) => {
  if (value >= 85) return 'var(--iflytek-primary)'
  if (value >= 70) return '#f39c12'
  return '#e74c3c'
}

// 交互方法
const generateNextQuestion = () => {
  // 模拟问题生成
  const questions = [
    {
      category: '项目经验',
      difficulty: '困难',
      duration: 5,
      content: '请详细介绍您负责的最复杂的项目，包括技术架构、团队规模和您的具体贡献。',
      hints: ['项目背景', '技术架构', '团队协作', '个人贡献', '项目成果']
    },
    {
      category: '算法思维',
      difficulty: '中等',
      duration: 4,
      content: '如何优化一个处理大量数据的算法？请从时间复杂度和空间复杂度两个角度分析。',
      hints: ['算法分析', '复杂度优化', '数据结构', '性能测试', '实际应用']
    }
  ]

  const randomQuestion = questions[Math.floor(Math.random() * questions.length)]
  Object.assign(currentQuestion, randomQuestion)

  // 更新适配度
  questionAdaptation.matchRate = 88 + Math.floor(Math.random() * 10)
  questionAdaptation.generateTime = 120 + Math.floor(Math.random() * 80)
}

const startAnswering = () => {
  currentFlow.status = 'in-progress'
  currentFlow.statusText = '面试进行中'
  currentStep.value = 2
}

const useFollowup = (suggestion) => {
  followupQueue.push(suggestion)
  // 移除已使用的建议
  const index = followupSuggestions.findIndex(s => s.id === suggestion.id)
  if (index > -1) {
    followupSuggestions.splice(index, 1)
  }
}

const modifyFollowup = (suggestion) => {
  // 这里可以打开编辑对话框
  console.log('修改追问:', suggestion)
}

// 生命周期
onMounted(() => {
  // 启动实时数据更新
  setInterval(() => {
    if (assessmentMode.realtime && currentFlow.status === 'in-progress') {
      // 模拟实时数据更新
      speechMetrics.speedScore = Math.max(60, Math.min(100, speechMetrics.speedScore + (Math.random() - 0.5) * 6))
      speechMetrics.clarityScore = Math.max(60, Math.min(100, speechMetrics.clarityScore + (Math.random() - 0.5) * 4))
      speechMetrics.logicScore = Math.max(60, Math.min(100, speechMetrics.logicScore + (Math.random() - 0.5) * 5))

      behaviorMetrics.indicators.forEach(indicator => {
        indicator.value = Math.max(60, Math.min(100, indicator.value + (Math.random() - 0.5) * 3))
      })
      behaviorMetrics.overallScore = Math.round(
        behaviorMetrics.indicators.reduce((sum, ind) => sum + ind.value, 0) / behaviorMetrics.indicators.length
      )

      contentMetrics.relevanceScore = Math.max(60, Math.min(100, contentMetrics.relevanceScore + (Math.random() - 0.5) * 4))
      contentMetrics.depthScore = Math.max(60, Math.min(100, contentMetrics.depthScore + (Math.random() - 0.5) * 6))
      contentMetrics.innovationScore = Math.max(60, Math.min(100, contentMetrics.innovationScore + (Math.random() - 0.5) * 5))
    }
  }, 2000)

  // 模拟面试流程推进
  setTimeout(() => {
    currentStep.value = 1
    currentFlow.status = 'preparing'
    currentFlow.statusText = '问题生成中'
  }, 3000)
})
</script>

<style scoped>
.smart-interview-flow {
  padding: 24px;
  background: #f8f9fa;
  min-height: 100vh;
}

/* 流程控制台样式 */
.flow-console {
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
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

.flow-progress {
  margin-top: 24px;
}

/* 自适应问题生成器样式 */
.adaptive-question-generator {
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.generator-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.generator-header h4 {
  font-size: 18px;
  color: #2c3e50;
  margin: 0;
}

.generation-stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #7f8c8d;
}

.question-preview {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
}

.current-question {
  margin-bottom: 24px;
}

.question-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.question-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 16px;
  border-left: 4px solid var(--iflytek-primary);
}

.question-content p {
  font-size: 16px;
  line-height: 1.6;
  color: #2c3e50;
  margin: 0;
}

.question-hints h5 {
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 12px;
}

.hints-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.question-actions {
  display: flex;
  gap: 12px;
}

/* 实时评估面板样式 */
.realtime-assessment {
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.assessment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.assessment-header h4 {
  font-size: 18px;
  color: #2c3e50;
  margin: 0;
}

.assessment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
}

.assessment-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.assessment-card:hover {
  border-color: var(--iflytek-primary);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  font-weight: 600;
  color: #2c3e50;
}

.analysis-content {
  space-y: 16px;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.metric-label {
  min-width: 80px;
  font-size: 14px;
  color: #7f8c8d;
}

.metric-value {
  min-width: 40px;
  font-weight: 600;
  color: var(--iflytek-primary);
}

/* 行为分析雷达图样式 */
.behavior-radar {
  text-align: center;
}

.radar-center {
  margin-bottom: 20px;
}

.overall-score {
  display: block;
  font-size: 32px;
  font-weight: 700;
  color: var(--iflytek-primary);
  margin-bottom: 4px;
}

.radar-center small {
  font-size: 12px;
  color: #7f8c8d;
}

.behavior-indicators {
  space-y: 12px;
}

.indicator-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.indicator-name {
  min-width: 60px;
  font-size: 12px;
  color: #2c3e50;
}

.indicator-bar {
  flex: 1;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.indicator-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.indicator-value {
  min-width: 35px;
  font-size: 12px;
  font-weight: 600;
  text-align: right;
}

/* 内容分析圆形进度样式 */
.content-metrics {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.metric-circle {
  text-align: center;
}

.circle-progress {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: conic-gradient(var(--iflytek-primary) var(--progress, 0%), #e9ecef 0%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 8px;
}

.circle-progress::before {
  content: '';
  position: absolute;
  width: 60px;
  height: 60px;
  background: white;
  border-radius: 50%;
}

.circle-text {
  font-size: 16px;
  font-weight: 700;
  color: var(--iflytek-primary);
  z-index: 1;
}

.circle-progress small {
  font-size: 10px;
  color: #7f8c8d;
  z-index: 1;
}

.content-keywords h5 {
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 12px;
}

.keywords-match {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.keyword-match {
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  background: #e9ecef;
  color: #7f8c8d;
  transition: all 0.3s ease;
}

.keyword-match.matched {
  background: var(--iflytek-primary);
  color: white;
}

/* 智能追问机制样式 */
.smart-followup {
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.followup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.followup-header h4 {
  font-size: 18px;
  color: #2c3e50;
  margin: 0;
}

.followup-suggestions {
  space-y: 16px;
}

.suggestion-item {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  border-left: 4px solid transparent;
  transition: all 0.3s ease;
}

.suggestion-item:hover {
  border-left-color: var(--iflytek-primary);
  transform: translateX(4px);
}

.suggestion-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.suggestion-trigger {
  font-size: 12px;
  color: #7f8c8d;
}

.suggestion-content p {
  font-size: 14px;
  color: #2c3e50;
  margin-bottom: 16px;
  line-height: 1.5;
}

.suggestion-actions {
  display: flex;
  gap: 8px;
}

/* 面试总结样式 */
.interview-summary {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.summary-header h4 {
  font-size: 18px;
  color: #2c3e50;
  margin: 0;
}

.summary-score {
  text-align: center;
}

.final-score {
  display: block;
  font-size: 36px;
  font-weight: 700;
  color: var(--iflytek-primary);
  margin-bottom: 4px;
}

.summary-score small {
  font-size: 12px;
  color: #7f8c8d;
}

.summary-content {
  space-y: 24px;
}

.strengths-weaknesses {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 24px;
}

.strengths h5,
.weaknesses h5 {
  font-size: 16px;
  margin-bottom: 16px;
  color: #2c3e50;
}

.strengths ul,
.weaknesses ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.strengths li,
.weaknesses li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 14px;
  line-height: 1.5;
}

.strengths li {
  color: #2ecc71;
}

.weaknesses li {
  color: #e67e22;
}

.recommendation {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
  border-left: 4px solid var(--iflytek-primary);
}

.recommendation h5 {
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 16px;
}

.recommendation-content p {
  font-size: 14px;
  line-height: 1.6;
  color: #2c3e50;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .smart-interview-flow {
    padding: 16px;
  }

  .flow-console,
  .adaptive-question-generator,
  .realtime-assessment,
  .smart-followup,
  .interview-summary {
    padding: 20px;
  }

  .assessment-grid {
    grid-template-columns: 1fr;
  }

  .strengths-weaknesses {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .generation-stats {
    flex-direction: column;
    gap: 8px;
  }

  .question-actions {
    flex-direction: column;
  }

  .content-metrics {
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
}

/* 动画效果 */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.assessment-card.speech-analysis:hover {
  animation: pulse 2s infinite;
}

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

.suggestion-item {
  animation: slideIn 0.3s ease-out;
}
</style>
