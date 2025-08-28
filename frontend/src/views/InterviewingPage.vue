<template>
  <div class="interviewing-page iflytek-enhanced">
    <!-- iFlytek Spark 面试界面头部 -->
    <header class="interview-header iflytek-style">
      <div class="interview-header-content">
        <!-- 左侧：面试信息 -->
        <div class="interview-info iflytek-layout">
          <div class="interview-title-section">
            <h1 class="interview-title">
              <span class="title-icon">🎯</span>
              iFlytek Spark AI智能面试
            </h1>
            <div class="interview-subtitle">智能多模态面试系统 • 专业技术评估</div>
          </div>
          <div class="interview-meta iflytek-meta">
            <div class="meta-item">
              <el-icon class="meta-icon"><User /></el-icon>
              <span class="meta-label">候选人</span>
              <span class="meta-value">{{ candidateInfo.name }}</span>
            </div>
            <div class="meta-item">
              <el-icon class="meta-icon"><House /></el-icon>
              <span class="meta-label">职位</span>
              <span class="meta-value">{{ candidateInfo.position }}</span>
            </div>
            <div class="meta-item">
              <el-icon class="meta-icon"><Clock /></el-icon>
              <span class="meta-label">用时</span>
              <span class="meta-value">{{ formatTime(elapsedTime) }}</span>
            </div>
          </div>
        </div>

        <!-- 右侧：状态和控制 -->
        <div class="interview-status iflytek-controls">
          <div class="status-indicator-group">
            <div class="status-indicator" :class="{ active: isRecording }">
              <div class="status-dot spark-pulse"></div>
              <span class="status-text">{{ isRecording ? 'AI助手活跃中' : 'AI助手待机' }}</span>
            </div>
            <div class="ai-assistance-status">
              <el-icon class="assistance-icon"><Star /></el-icon>
              <span>实时辅助: {{ aiAssistanceCount }} 次</span>
            </div>
          </div>

          <div class="interview-progress iflytek-progress">
            <div class="progress-header">
              <span class="progress-text">面试进度</span>
              <span class="progress-numbers">{{ currentQuestion }}/{{ totalQuestions }}</span>
            </div>
            <div class="progress-bar enhanced-progress">
              <div class="progress-fill spark-progress-bar" :style="{ width: progressPercent + '%' }"></div>
              <div class="progress-glow"></div>
            </div>
            <div class="progress-time-estimate">
              预计剩余: {{ estimatedTimeLeft }}
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- iFlytek Spark 智能面试主区域 -->
    <main class="interview-main spark-main">
      <div class="interview-layout spark-layout">
        <!-- 左侧: 候选人交互区域 -->
        <section class="candidate-section spark-candidate">
          <div class="interaction-container spark-interaction">
            <!-- 面试界面 -->
            <div class="interview-frame">
              <div class="interview-placeholder">
                <div class="placeholder-content">
                  <el-icon class="placeholder-icon"><User /></el-icon>
                  <h3>iFlytek Spark 智能面试进行中</h3>
                  <p>请专注于回答问题，AI正在进行实时智能分析</p>
                </div>
              </div>

              <!-- 面试状态叠加层 -->
              <div class="video-overlay spark-overlay">
                <!-- AI分析状态指示器 -->
                <div class="ai-analysis-indicators">
                  <div class="analysis-item" :class="{ active: textAnalysisActive }">
                    <el-icon><Document /></el-icon>
                    <span>文本分析</span>
                  </div>
                </div>

                <!-- 实时AI提示框 -->
                <div class="ai-realtime-hints" v-if="showAiHints">
                  <div class="hint-header">
                    <el-icon><Star /></el-icon>
                    <span>iFlytek AI智能提示</span>
                    <div class="hint-status">
                      <span class="hint-level">第{{ currentHintCount }}级提示</span>
                      <span class="hint-remaining">剩余{{ maxHintCount - currentHintCount }}次</span>
                    </div>
                  </div>
                  <div class="hint-content">
                    <div class="hint-text">{{ currentAiHint }}</div>
                    <div class="hint-actions">
                      <button class="hint-action-btn" @click="showAiHints = false">
                        <el-icon><Check /></el-icon>
                        知道了
                      </button>
                      <button
                        class="hint-action-btn secondary"
                        @click="getAiHint"
                        :disabled="currentHintCount >= maxHintCount"
                      >
                        <el-icon><Refresh /></el-icon>
                        更多提示
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- AI助手控制栏 -->
              <div class="ai-controls">
                <button class="control-btn spark-tertiary" @click="toggleAiAssistance">
                  <el-icon class="control-icon"><Setting /></el-icon>
                  <span>AI助手</span>
                </button>
              </div>
            </div>

            <!-- iFlytek Spark 候选人信息卡片 -->
            <div class="candidate-info-card spark-card">
              <div class="card-header">
                <div class="candidate-avatar">
                  <img :src="candidateInfo.avatar || '/images/default-avatar.png'" :alt="candidateInfo.name" />
                </div>
                <div class="candidate-basic">
                  <h3 class="candidate-name">{{ candidateInfo.name }}</h3>
                  <p class="candidate-position">{{ candidateInfo.position }}</p>
                  <div class="candidate-company">
                    <el-icon><House /></el-icon>
                    <span>{{ candidateInfo.company || '待定' }}</span>
                  </div>
                </div>
              </div>

              <!-- 技能标签 -->
              <div class="candidate-skills">
                <div class="skills-header">
                  <el-icon><Star /></el-icon>
                  <span>核心技能</span>
                </div>
                <div class="skills-tags">
                  <span v-for="skill in candidateInfo.skills" :key="skill" class="skill-tag spark-enhanced">
                    {{ skill }}
                  </span>
                </div>
              </div>

              <!-- iFlytek Spark 实时评分 -->
              <div class="realtime-scoring">
                <div class="scoring-header">
                  <el-icon><TrendCharts /></el-icon>
                  <span>iFlytek Spark 实时评分</span>
                </div>
                <div class="scoring-metrics">
                  <div class="metric-item" v-for="metric in realtimeMetrics" :key="metric.name">
                    <span class="metric-name">{{ metric.name }}</span>
                    <div class="metric-bar">
                      <div class="metric-fill" :style="{ width: metric.score + '%', backgroundColor: metric.color }"></div>
                    </div>
                    <span class="metric-score">{{ metric.score }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 右侧: iFlytek Spark AI分析和控制区域 -->
        <section class="analysis-section spark-analysis">
          <!-- iFlytek Spark AI面试官对话区域 -->
          <div class="ai-interviewer-panel spark-panel">
            <div class="panel-header">
              <div class="interviewer-avatar">
                <div class="avatar-icon">
                  <el-icon><Cpu /></el-icon>
                </div>
                <div class="avatar-status" :class="{ active: aiInterviewerActive }"></div>
              </div>
              <div class="interviewer-info">
                <h3 class="interviewer-title">iFlytek Spark AI面试官</h3>
                <p class="interviewer-status">{{ aiInterviewerStatus }}</p>
              </div>
              <div class="question-counter">
                <span class="counter-text">第 {{ currentQuestion }} 题</span>
                <span class="counter-total">共 {{ totalQuestions }} 题</span>
              </div>
            </div>

            <!-- 问题展示区域 -->
            <div class="question-content spark-question">
              <div class="question-text-area">
                <div class="question-text">
                  {{ currentQuestionData.text }}
                </div>

                <!-- iFlytek Spark AI思考过程展示 -->
                <AIThinkingProcess
                  :thinking-text="aiThinkingProcess"
                  :answer-text="aiAnswerText"
                  :is-visible="showAiThinking"
                  :auto-collapse="true"
                  @thinking-complete="onThinkingComplete"
                  @answer-complete="onAnswerComplete"
                />

                <!-- 智能提示区域 -->
                <div class="intelligent-hints" v-if="intelligentHints.length > 0">
                  <div class="hints-header">
                    <el-icon><Star /></el-icon>
                    <span>智能提示</span>
                  </div>
                  <div class="hints-list">
                    <div v-for="hint in intelligentHints" :key="hint.id" class="hint-item">
                      <span class="hint-type">{{ hint.type }}</span>
                      <span class="hint-text">{{ hint.text }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 问题类型和难度指示 -->
              <div class="question-metadata">
                <div class="question-type">
                  <el-icon><Document /></el-icon>
                  <span>{{ currentQuestionData.type }}</span>
                </div>
                <div class="question-difficulty">
                  <el-icon><Star /></el-icon>
                  <span>难度: {{ currentQuestionData.difficulty }}</span>
                </div>
                <div class="question-domain">
                  <IntelligentIcons :type="currentQuestionData.domain" size="small" />
                  <span>{{ currentQuestionData.domainName }}</span>
                </div>
              </div>
            </div>

            <!-- 智能回答输入区域 -->
            <div class="answer-input-section" v-if="!isProcessingAnswer">
              <div class="input-header">
                <h4>您的回答</h4>
                <div class="input-tips">
                  <el-icon><Star /></el-icon>
                  <span>建议包含：技术细节、项目经验、解决方案、效果评估</span>
                </div>
              </div>

              <el-input
                v-model="currentCandidateAnswer"
                type="textarea"
                :rows="8"
                placeholder="请详细描述您的技术经验和项目实践...

💡 回答建议：
• 具体的技术栈和工具
• 遇到的挑战和问题
• 您的解决方案和思路
• 最终的效果和收获

AI面试官会根据您的回答质量智能决定是否需要追问或进入下一话题。"
                :disabled="isProcessingAnswer"
                class="answer-textarea"
                @input="handleAnswerInput"
              />

              <div class="input-actions">
                <div class="answer-stats">
                  <span class="char-count">{{ currentCandidateAnswer.length }} 字符</span>
                  <span class="quality-hint" v-if="currentCandidateAnswer.length > 0">
                    {{ getAnswerQualityHint() }}
                  </span>
                </div>
                <div class="submit-actions">
                  <el-button
                    @click="clearAnswer"
                    :disabled="isProcessingAnswer || !currentCandidateAnswer"
                  >
                    清空
                  </el-button>
                  <el-button
                    type="primary"
                    @click="submitAnswer"
                    :disabled="isProcessingAnswer || currentCandidateAnswer.length < 20"
                    :loading="isProcessingAnswer"
                  >
                    <el-icon><ArrowRight /></el-icon>
                    提交回答
                  </el-button>
                </div>
              </div>
            </div>

            <!-- 处理中状态 -->
            <div class="processing-answer" v-if="isProcessingAnswer">
              <div class="processing-content">
                <el-icon class="rotating"><Loading /></el-icon>
                <h4>AI正在分析您的回答...</h4>
                <p>{{ aiInterviewerStatus }}</p>
              </div>
            </div>
          </div>

          <!-- 讯飞星火多模态分析面板 -->
          <div class="spark-multimodal-panel">
            <div class="spark-status-header">
              <div class="status-indicator" :class="{ active: isSparkInitialized }">
                <div class="status-dot"></div>
                <span>{{ sparkStatus }}</span>
              </div>
              <div class="processing-indicator" v-if="isProcessingMultimodal">
                <el-icon class="rotating"><Loading /></el-icon>
                <span>多模态分析中...</span>
              </div>
            </div>

            <MultimodalAnalysisPanel
              :analysis-data="realTimeAnalysis"
              :is-analyzing="isProcessingMultimodal"
              @toggle-real-time="handleToggleRealTime"
              @request-analysis="handleRequestAnalysis"
            />
          </div>

          <!-- 增强的实时反馈面板 - 基于面试猫优势 -->
          <RealTimeFeedbackPanel
            :is-active="isRealTimeFeedbackActive"
            :current-question="currentQuestion"
            :total-questions="totalQuestions"
            :elapsed-time="elapsedTime"
            @toggle-feedback="handleToggleFeedback"
            @apply-suggestion="handleApplySuggestion"
            @quick-action="handleQuickAction"
          />

          <!-- iFlytek Spark 实时分析面板 -->
          <div class="realtime-analysis-panel">
            <div class="analysis-tabs">
              <button
                v-for="tab in analysisTabs"
                :key="tab.id"
                class="tab-btn"
                :class="{ active: activeAnalysisTab === tab.id }"
                @click="setActiveAnalysisTab(tab.id)"
              >
                <el-icon><component :is="tab.icon" /></el-icon>
                <span>{{ tab.name }}</span>
              </button>
            </div>

            <div class="analysis-content">




              <!-- 内容分析 -->
              <div v-if="activeAnalysisTab === 'content'" class="analysis-content-tab">
                <div class="content-keywords">
                  <h4>关键词识别</h4>
                  <div class="keywords-cloud">
                    <span v-for="keyword in contentKeywords" :key="keyword.word"
                          class="keyword-tag" :style="{ fontSize: keyword.size + 'px' }">
                      {{ keyword.word }}
                    </span>
                  </div>
                </div>
                <div class="content-structure">
                  <h4>回答结构</h4>
                  <div class="structure-analysis">
                    <div class="structure-item">
                      <span class="structure-label">逻辑性</span>
                      <div class="structure-score">{{ contentStructure.logic }}%</div>
                    </div>
                    <div class="structure-item">
                      <span class="structure-label">完整性</span>
                      <div class="structure-score">{{ contentStructure.completeness }}%</div>
                    </div>
                    <div class="structure-item">
                      <span class="structure-label">专业性</span>
                      <div class="structure-score">{{ contentStructure.professionalism }}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- iFlytek Spark 控制按钮区域 -->
          <div class="interview-controls spark-controls-panel">
            <div class="control-actions spark-actions">
              <button class="control-action-btn primary spark-enhanced" @click="nextQuestion">
                <el-icon><ArrowRight /></el-icon>
                <span>下一题</span>
                <div class="btn-glow"></div>
              </button>
              <button class="control-action-btn secondary spark-enhanced" @click="pauseInterview">
                <el-icon><Clock /></el-icon>
                <span>暂停面试</span>
              </button>
              <button class="control-action-btn tertiary spark-enhanced" @click="getAiHint">
                <el-icon><Setting /></el-icon>
                <span>AI提示</span>
              </button>
              <button class="control-action-btn danger spark-enhanced" @click="endInterview">
                <el-icon><Close /></el-icon>
                <span>结束面试</span>
              </button>
            </div>

            <!-- 快捷操作 -->
            <div class="quick-actions-panel">
              <div class="actions-header">
                <el-icon><Setting /></el-icon>
                <h4>快捷操作</h4>
              </div>
              <div class="actions-content">
                <!-- 问题导航 -->
                <div class="question-navigation">
                  <div class="nav-title">
                    <el-icon><Document /></el-icon>
                    问题导航
                  </div>
                  <div class="question-buttons">
                    <el-button
                      v-for="n in totalQuestions"
                      :key="n"
                      :type="n === currentQuestion ? 'primary' : (n < currentQuestion ? 'success' : 'default')"
                      :disabled="n > currentQuestion + 1"
                      size="small"
                      @click="jumpToQuestion(n)"
                      class="question-nav-btn"
                    >
                      {{ n }}
                    </el-button>
                  </div>
                </div>

                <!-- 面试控制 -->
                <div class="interview-control">
                  <div class="nav-title">
                    <el-icon><Setting /></el-icon>
                    面试控制
                  </div>
                  <div class="control-buttons">
                    <el-button size="small" @click="pauseInterview" type="warning">
                      暂停面试
                    </el-button>
                    <el-button size="small" @click="endInterview" type="danger">
                      结束面试
                    </el-button>
                  </div>
                </div>

                <!-- 快速操作 -->
                <div class="quick-operations">
                  <div class="nav-title">
                    <el-icon><Star /></el-icon>
                    快速操作
                  </div>
                  <div class="operation-buttons">
                    <el-button size="small" @click="submitAnswer" type="primary" :disabled="!currentCandidateAnswer.trim()">
                      <el-icon><ArrowRight /></el-icon>
                      提交回答
                    </el-button>
                    <el-button size="small" @click="skipQuestion">
                      跳过问题
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- 增强的面试时间轴 -->
      <section class="interview-timeline-section">
        <EnhancedInterviewTimeline
          :interview-data="interviewTimelineData"
          :real-time-mode="true"
        />
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElNotification } from 'element-plus'
import {
  User, House, Timer, Star, Loading,
  Document, ArrowRight, Setting,
  Close, View, TrendCharts, Clock,
  Check, Refresh
} from '@element-plus/icons-vue'
import IntelligentIcons from '@/components/UI/IntelligentIcons.vue'
// DayeeStyleIcons 组件已移除
import enhancedIflytekSparkService from '@/services/enhancedIflytekSparkService'
import MultimodalAnalysisPanel from '@/components/Interview/MultimodalAnalysisPanel.vue'
import RealTimeFeedbackPanel from '@/components/Enhanced/RealTimeFeedbackPanel.vue'
import EnhancedInterviewTimeline from '@/components/Enhanced/EnhancedInterviewTimeline.vue'
import AIThinkingProcess from '@/components/Interview/AIThinkingProcess.vue'
import intelligentAnswerEvaluator from '@/services/intelligentAnswerEvaluator.js'
import dynamicQuestionController from '@/services/dynamicQuestionController.js'
import enhancedAIThinkingService from '@/services/enhancedAIThinkingService.js'

const router = useRouter()

// 讯飞星火服务相关
const sparkSession = ref(null)
const isSparkInitialized = ref(false)
const sparkStatus = ref('初始化中...')
const realTimeAnalysisEnabled = ref(true)

// 响应式数据
const candidateVideo = ref(null)
const isRecording = ref(true)
const isMuted = ref(false)
const currentQuestion = ref(1)
const totalQuestions = ref(10)
const elapsedTime = ref(0)
const aiAssistanceCount = ref(3)
const estimatedTimeLeft = ref('15分钟')

// 实时反馈相关
const isRealTimeFeedbackActive = ref(true)

// AI分析状态
const textAnalysisActive = ref(true)
const aiInterviewerActive = ref(true)
const aiInterviewerStatus = ref('正在分析候选人回答...')

// AI提示和思考 - 集成讯飞星火
const showAiHints = ref(false)
const currentAiHint = ref('建议从项目背景开始介绍，然后详述技术难点和解决方案')
const showAiThinking = ref(false)
const aiThinkingProcess = ref('')
const aiAnswerText = ref('')

// AI提示系统优化
const maxHintCount = ref(5) // 每题最多5次提示
const currentHintCount = ref(0) // 当前题目已使用提示次数
const hintHistory = ref([]) // 提示历史记录
const hintLevel = ref(1) // 提示级别：1-方向提示，2-技术要点，3-具体示例

// 智能对话逻辑相关数据
const currentCandidateAnswer = ref('')
const lastEvaluation = ref(null)
const interviewContext = ref({
  questionCount: 0,
  followUpCount: 0,
  currentTopic: null,
  evaluationHistory: []
})
const isProcessingAnswer = ref(false)

// 多模态输入数据
const currentVideoData = ref(null)
const currentTextInput = ref('')
const isProcessingMultimodal = ref(false)

// 实时分析结果
const realTimeAnalysis = ref({
  overallScore: 0,
  technicalCompetency: 0,
  communicationSkills: 0,
  confidenceLevel: 0,
  lastUpdated: null
})



// 候选人信息 - 增强版
const candidateInfo = ref({
  name: '张三',
  position: 'AI算法工程师',
  company: '字节跳动',
  avatar: '/images/candidate-avatar.svg',
  skills: ['Python', 'TensorFlow', '机器学习', '深度学习', 'PyTorch', 'NLP']
})

// 当前问题数据 - 增强版
const currentQuestionData = ref({
  text: '请介绍一下您在机器学习方面的项目经验，特别是在深度学习模型优化方面的实践。',
  type: '技术深度',
  difficulty: '中等',
  domain: 'ai',
  domainName: 'AI技术'
})

// 智能提示
const intelligentHints = ref([
  { id: 1, type: '结构建议', text: '可以按照项目背景→技术挑战→解决方案→效果的结构回答' },
  { id: 2, type: '关键词', text: '模型优化、性能提升、算法改进' },
  { id: 3, type: '深入点', text: '可以详述具体的优化技术和量化效果' }
])

// 实时评分指标
const realtimeMetrics = ref([
  { name: '技术深度', score: 85, color: '#1890ff' },
  { name: '表达能力', score: 78, color: '#52c41a' },
  { name: '逻辑思维', score: 82, color: '#722ed1' },
  { name: '项目经验', score: 90, color: '#fa8c16' }
])

// 分析面板
const activeAnalysisTab = ref('content')
const analysisTabs = ref([
  { id: 'content', name: '内容分析', icon: 'Document' }
])



// 内容分析数据
const contentKeywords = ref([
  { word: '机器学习', size: 18 },
  { word: '深度学习', size: 16 },
  { word: '模型优化', size: 14 },
  { word: 'TensorFlow', size: 12 },
  { word: '算法', size: 15 },
  { word: '项目经验', size: 13 }
])

const contentStructure = ref({
  logic: 85,
  completeness: 78,
  professionalism: 92
})

// 面试时间轴数据
const interviewTimelineData = ref({
  duration: 30,
  candidateId: candidateInfo.value.name,
  interviewType: 'technical',
  position: candidateInfo.value.position
})

// 计算属性
const progressPercent = computed(() => {
  return (currentQuestion.value / totalQuestions.value) * 100
})

// 讯飞星火初始化和核心方法
const initializeSparkService = async () => {
  try {
    sparkStatus.value = '正在初始化讯飞星火大模型...'

    // 初始化面试会话
    const candidateProfile = {
      name: candidateInfo.value.name,
      position: candidateInfo.value.position,
      skills: candidateInfo.value.skills,
      domain: currentQuestionData.value.domain
    }

    sparkSession.value = await enhancedIflytekSparkService.initializeInterviewSession(
      candidateProfile,
      'comprehensive'
    )

    isSparkInitialized.value = true
    sparkStatus.value = 'iFlytek星火大模型已就绪'

    // 生成第一个问题
    await generateNextQuestion()

    ElNotification.success({
      title: '✅ 讯飞星火大模型已连接',
      message: 'AI面试官已准备就绪，开始智能面试体验',
      duration: 3000
    })

    console.log('✅ 讯飞星火服务初始化成功')
  } catch (error) {
    console.error('❌ 讯飞星火初始化失败:', error)
    sparkStatus.value = '初始化失败，使用备用模式'
    ElMessage.warning('讯飞星火连接失败，已切换到备用模式')
  }
}

const generateNextQuestion = async () => {
  if (!sparkSession.value) return

  try {
    aiInterviewerStatus.value = '正在生成下一个问题...'
    showAiThinking.value = true

    // 设置详细的思考过程
    aiThinkingProcess.value = `让我分析一下当前的面试情况：

1. 候选人背景分析：
   - 应聘职位：${candidateInfo.value.position}
   - 技术领域：${currentQuestionData.value.domainName}
   - 当前进度：第${currentQuestion.value}题

2. 问题设计思路：
   - 基于候选人的技术背景，我需要设计一个既能考察核心技能又不过于困难的问题
   - 考虑到这是${currentQuestionData.value.domainName}领域，我会重点关注实际项目经验
   - 问题应该具有一定的开放性，让候选人能够展示自己的思维过程

3. 评估重点：
   - 技术深度和广度
   - 问题解决能力
   - 表达和沟通能力
   - 实际项目经验`

    const questionContext = {
      previousAnswers: [], // 可以存储之前的回答
      difficulty: 'medium',
      domain: currentQuestionData.value.domain,
      candidateProfile: candidateInfo.value,
      questionNumber: currentQuestion.value
    }

    const questionResponse = await enhancedIflytekSparkService.generateInterviewQuestion(
      sparkSession.value.sessionId,
      questionContext
    )

    // 设置AI的回答文本
    aiAnswerText.value = `基于以上分析，我为您准备了这个问题：

"${questionResponse.question}"

这个问题的设计考虑：
• 能够考察您在${currentQuestionData.value.domainName}方面的实际经验
• 具有一定的技术深度，需要您展示具体的解决方案
• 开放性设计，让您能够结合自己的项目经历来回答

请您详细描述相关的项目经验，包括遇到的技术挑战和解决方案。`

    // 更新问题数据
    currentQuestionData.value = {
      text: questionResponse.question,
      type: questionResponse.type,
      difficulty: questionResponse.difficulty,
      domain: currentQuestionData.value.domain,
      domainName: currentQuestionData.value.domainName,
      expectedKeywords: questionResponse.expectedKeywords,
      evaluationCriteria: questionResponse.evaluationCriteria
    }

    aiInterviewerStatus.value = '问题已生成，等待候选人回答'

    console.log('✅ 智能问题生成成功:', questionResponse.question)
  } catch (error) {
    console.error('❌ 问题生成失败:', error)
    aiInterviewerStatus.value = '问题生成失败，使用预设问题'

    // 设置备用的思考过程和回答
    aiThinkingProcess.value = `系统检测到网络连接问题，我将使用预设的高质量问题：

1. 问题选择依据：
   - 针对${currentQuestionData.value.domainName}领域的核心技能
   - 适合当前面试进度和难度
   - 能够有效评估候选人的技术能力

2. 评估标准：
   - 技术理解的深度
   - 实际应用经验
   - 问题分析和解决能力`

    aiAnswerText.value = `虽然遇到了网络问题，但我已经为您准备了一个精心设计的问题。这个问题能够很好地评估您在${currentQuestionData.value.domainName}方面的能力。

请您详细回答，展示您的技术深度和项目经验。`

    updateQuestionData() // 使用备用问题
  }
}

// 方法
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 实时反馈处理方法
const handleToggleFeedback = (enabled) => {
  isRealTimeFeedbackActive.value = enabled
  console.log('实时反馈状态:', enabled ? '启用' : '禁用')

  if (enabled) {
    ElMessage.success('实时反馈已启用')
  } else {
    ElMessage.info('实时反馈已暂停')
  }
}

const handleApplySuggestion = (suggestion) => {
  console.log('应用建议:', suggestion)

  // 根据建议类型执行相应操作
  switch (suggestion.type) {
    case 'improvement':
      ElNotification({
        title: '改进建议',
        message: suggestion.text,
        type: 'warning',
        duration: 5000
      })
      break
    case 'strength':
      ElNotification({
        title: '优势保持',
        message: suggestion.text,
        type: 'success',
        duration: 3000
      })
      break
    case 'tip':
      ElNotification({
        title: '小贴士',
        message: suggestion.text,
        type: 'info',
        duration: 4000
      })
      break
  }
}

const handleQuickAction = (action) => {
  console.log('执行快速操作:', action)

  switch (action.id) {
    case 'pause':
      toggleRecording()
      break
    case 'hint':
      showAiHints.value = !showAiHints.value
      if (showAiHints.value) {
        currentAiHint.value = '建议从具体项目经验入手回答这个问题'
      }
      break
    case 'refresh':
      // 重新分析当前状态
      handleRequestAnalysis()
      break
  }
}

// 基础控制方法
const toggleRecording = async () => {
  isRecording.value = !isRecording.value

  if (isRecording.value) {
    aiInterviewerStatus.value = '正在分析候选人回答...'
    await startMultimodalRecording()
  } else {
    aiInterviewerStatus.value = 'AI助手待机中'
    await stopMultimodalRecording()
  }
}



const stopMultimodalRecording = async () => {
  try {
    // 处理收集到的数据
    if (currentVideoData.value || currentTextInput.value) {
      await processMultimodalInput()
    }

    textAnalysisActive.value = false

    console.log('✅ 多模态录制已停止')
  } catch (error) {
    console.error('❌ 多模态录制停止失败:', error)
  }
}



const toggleMute = () => {
  isMuted.value = !isMuted.value
}

const toggleAiAssistance = () => {
  showAiHints.value = !showAiHints.value
  if (showAiHints.value) {
    aiAssistanceCount.value++
  }
}

const nextQuestion = async () => {
  if (currentQuestion.value < totalQuestions.value) {
    currentQuestion.value++

    // 重置AI提示相关状态
    currentHintCount.value = 0
    hintHistory.value = []
    showAiHints.value = false

    // 使用讯飞星火生成下一个问题
    if (isSparkInitialized.value) {
      await generateNextQuestion()
    } else {
      // 备用方案：使用预设问题
      updateQuestionData()
    }

    // 重置分析状态
    resetAnalysisState()

    // 清空当前输入
    currentTextInput.value = ''
    currentVideoData.value = null
  }
}

const pauseInterview = () => {
  isRecording.value = false
  aiInterviewerStatus.value = '面试已暂停'
}

const endInterview = () => {
  router.push('/report')
}

// 新增方法
const setActiveAnalysisTab = (tabId) => {
  activeAnalysisTab.value = tabId
}

const getAiHint = async () => {
  try {
    // 检查提示次数限制
    if (currentHintCount.value >= maxHintCount.value) {
      ElMessage.warning(`本题提示次数已用完（${maxHintCount.value}/${maxHintCount.value}）`)
      return
    }

    showAiHints.value = true
    aiAssistanceCount.value++
    currentHintCount.value++

    // 根据提示次数确定提示级别和内容
    const hintLevel = Math.min(currentHintCount.value, 3)

    if (sparkSession.value && isSparkInitialized.value) {
      // 使用讯飞星火生成智能提示
      const currentContext = {
        question: currentQuestionData.value.text,
        candidateResponse: currentTextInput.value,
        analysisResults: realTimeAnalysis.value,
        questionNumber: currentQuestion.value,
        hintLevel: hintLevel,
        hintCount: currentHintCount.value,
        previousHints: hintHistory.value
      }

      const hintResponse = await enhancedIflytekSparkService.generateProgressiveHint(
        sparkSession.value.sessionId,
        currentContext
      )

      currentAiHint.value = hintResponse.hint
      hintHistory.value.push({
        level: hintLevel,
        content: hintResponse.hint,
        timestamp: new Date().toLocaleTimeString()
      })

      console.log('✅ AI智能提示生成成功:', hintResponse.hint)
    } else {
      // 备用递进式提示
      const progressiveHints = getProgressiveHints(hintLevel)
      currentAiHint.value = progressiveHints[currentQuestionData.value.domain] || progressiveHints.general

      hintHistory.value.push({
        level: hintLevel,
        content: currentAiHint.value,
        timestamp: new Date().toLocaleTimeString()
      })
    }

    // 显示剩余提示次数
    ElMessage.info(`AI提示已生成（剩余 ${maxHintCount.value - currentHintCount.value} 次）`)

  } catch (error) {
    console.error('❌ AI提示生成失败:', error)
    currentAiHint.value = '建议从具体的项目经验开始回答，详述技术细节和解决方案'
  }
}

// 获取递进式提示内容
const getProgressiveHints = (level) => {
  const hintTemplates = {
    1: { // 方向提示
      ai: '可以从机器学习算法选择、数据处理流程或模型优化等方面来回答',
      bigdata: '建议从数据架构设计、处理技术选型或性能优化等角度展开',
      iot: '可以考虑从硬件选型、通信协议或数据采集等维度来阐述',
      general: '建议明确回答的主要方向，可以从技术选型、实现方案或优化策略等角度切入'
    },
    2: { // 技术要点
      ai: '具体说明算法原理、特征工程方法、模型训练过程和评估指标的选择',
      bigdata: '详述数据存储方案、计算框架使用、数据质量保证和实时处理机制',
      iot: '阐述传感器配置、网络架构设计、数据传输协议和边缘计算应用',
      general: '深入技术细节，包括核心技术原理、关键实现步骤和技术难点解决方案'
    },
    3: { // 具体示例
      ai: '举例说明：比如在推荐系统中如何处理冷启动问题，使用了哪些特征，模型效果如何提升',
      bigdata: '举例说明：比如在实时数据处理中如何保证数据一致性，处理了多大规模的数据，性能提升了多少',
      iot: '举例说明：比如在智能家居项目中如何实现设备互联，解决了哪些通信延迟问题，系统稳定性如何',
      general: '提供具体的项目案例，包括遇到的实际问题、采用的解决方案和最终取得的成果'
    }
  }

  return hintTemplates[level] || hintTemplates[1]
}



// 处理多模态输入
const processMultimodalInput = async () => {
  if (!sparkSession.value || isProcessingMultimodal.value) return

  try {
    isProcessingMultimodal.value = true
    aiInterviewerStatus.value = '正在进行多模态分析...'

    const inputData = {
      text: currentTextInput.value,
      audio: null, // 语音功能已禁用
      video: currentVideoData.value
    }

    const analysisResult = await enhancedIflytekSparkService.analyzeTextPrimaryInput(
      sparkSession.value.sessionId,
      inputData
    )

    // 更新实时分析结果
    realTimeAnalysis.value = {
      overallScore: analysisResult.overallScore,
      technicalCompetency: analysisResult.technicalCompetency,
      communicationSkills: analysisResult.communicationSkills,
      confidenceLevel: analysisResult.confidenceLevel,
      lastUpdated: new Date().toISOString()
    }

    // 更新各项指标
    realtimeMetrics.value = [
      { name: '技术深度', score: analysisResult.technicalCompetency, color: '#1890ff' },
      { name: '表达能力', score: analysisResult.communicationSkills, color: '#52c41a' },
      { name: '逻辑思维', score: Math.floor(analysisResult.overallScore * 0.9), color: '#722ed1' },
      { name: '项目经验', score: Math.floor(analysisResult.technicalCompetency * 1.1), color: '#fa8c16' }
    ]

    // 更新AI思考过程
    if (analysisResult.nextQuestionSuggestion) {
      aiThinkingProcess.value = `分析完成：${analysisResult.nextQuestionSuggestion}`
    }

    aiInterviewerStatus.value = '多模态分析完成'
    console.log('✅ 多模态分析完成:', analysisResult)

  } catch (error) {
    console.error('❌ 多模态分析失败:', error)
    aiInterviewerStatus.value = '分析失败，请重试'
  } finally {
    isProcessingMultimodal.value = false
  }
}

// 多模态分析面板事件处理
const handleToggleRealTime = (enabled) => {
  realTimeAnalysisEnabled.value = enabled
  console.log('🔄 实时分析模式:', enabled ? '已启用' : '已禁用')

  if (enabled && isRecording.value) {
    // 重新启动实时分析
    startMultimodalRecording()
  } else if (!enabled) {
    // 停止实时分析
    stopMultimodalRecording()
  }
}

const handleRequestAnalysis = async () => {
  if (!sparkSession.value) {
    ElMessage.warning('请先初始化讯飞星火服务')
    return
  }

  try {
    // 手动触发多模态分析
    await processMultimodalInput()
    ElMessage.success('多模态分析完成')
  } catch (error) {
    console.error('❌ 手动分析失败:', error)
    ElMessage.error('分析失败，请重试')
  }
}

const repeatQuestion = () => {
  // 重复当前问题
  console.log('重复问题')
}

const skipQuestion = () => {
  nextQuestion()
}

const saveProgress = () => {
  // 保存当前进度
  console.log('保存进度')
}

// AI思考过程回调方法
const onThinkingComplete = () => {
  console.log('AI思考过程完成')
  // 可以在这里触发下一步操作
}

const onAnswerComplete = () => {
  console.log('AI回答完成')
  // 可以在这里更新状态或触发其他操作
}

// 智能回答处理方法
const processIntelligentAnswer = async (candidateAnswer) => {
  if (!candidateAnswer || candidateAnswer.trim().length < 5) {
    ElMessage.warning('请提供更详细的回答')
    return
  }

  try {
    isProcessingAnswer.value = true
    aiInterviewerStatus.value = '正在分析您的回答...'

    // 记录候选人回答
    currentCandidateAnswer.value = candidateAnswer

    // 使用增强AI思考服务生成完整的思考过程和回答
    const thinkingResult = enhancedAIThinkingService.generateThinkingProcess(
      candidateAnswer,
      currentQuestionData.value.text,
      currentQuestionData.value.domain || 'ai',
      interviewContext.value
    )

    // 更新评估历史
    lastEvaluation.value = thinkingResult.evaluation
    interviewContext.value.evaluationHistory.push(thinkingResult.evaluation)

    // 显示AI思考过程
    showAiThinking.value = true
    aiThinkingProcess.value = thinkingResult.thinkingProcess
    aiAnswerText.value = thinkingResult.aiResponse

    // 使用动态问题控制器决定下一步
    const nextAction = dynamicQuestionController.decideNextAction(
      candidateAnswer,
      currentQuestionData.value.text,
      currentQuestionData.value.domain || 'ai'
    )

    // 更新面试上下文
    interviewContext.value.questionCount++
    if (nextAction.action === 'follow_up') {
      interviewContext.value.followUpCount++
    } else {
      interviewContext.value.followUpCount = 0
    }

    // 根据评分决定下一步行动
    const evaluation = thinkingResult.evaluation

    // 🎯 新的70分自动推进逻辑
    if (evaluation.autoAdvance && evaluation.overallScore >= 70) {
      // 显示自动推进提示
      setTimeout(() => {
        ElNotification({
          title: '🎉 回答优秀，自动推进',
          message: `您的回答获得了 ${evaluation.overallScore} 分，已达到通过标准，AI面试官将自动进入下一个问题。`,
          type: 'success',
          duration: 4000,
          position: 'top-right'
        })
      }, 2000)

      // 自动推进到下一题
      setTimeout(async () => {
        await executeNextAction(nextAction)
      }, 4000) // 给用户更多时间查看评分结果
    } else {
      // 常规流程：等待AI思考完成后决定下一步
      setTimeout(async () => {
        await executeNextAction(nextAction)
      }, 3000)
    }

    console.log('✅ 智能回答处理完成:', {
      evaluation: thinkingResult.evaluation,
      nextAction: nextAction.action,
      autoAdvance: evaluation.autoAdvance,
      score: evaluation.overallScore
    })

  } catch (error) {
    console.error('❌ 智能回答处理失败:', error)
    ElMessage.error('回答分析失败，请重试')
  } finally {
    isProcessingAnswer.value = false
  }
}

// 执行下一步行动
const executeNextAction = async (actionResult) => {
  try {
    switch (actionResult.action) {
      case 'transition':
        // 过渡到下一个问题
        await transitionToNextQuestion(actionResult)
        break
      case 'follow_up':
        // 追问当前话题
        await askFollowUpQuestion(actionResult)
        break
      case 'deep_dive':
        // 深入探讨
        await deepDiveCurrentTopic(actionResult)
        break
      default:
        // 继续当前流程
        aiInterviewerStatus.value = '请继续回答或等待下一个问题'
    }
  } catch (error) {
    console.error('❌ 执行下一步行动失败:', error)
    aiInterviewerStatus.value = '系统处理中，请稍候...'
  }
}

// 过渡到下一个问题 - 增强版避免重复提问
const transitionToNextQuestion = async (actionResult) => {
  aiInterviewerStatus.value = '正在准备下一个技术话题...'

  // 记录已讨论的话题，避免重复
  if (!interviewContext.value.discussedTopics) {
    interviewContext.value.discussedTopics = []
  }

  // 添加当前话题到已讨论列表
  const currentTopic = extractTopicFromQuestion(currentQuestionData.value.text)
  if (currentTopic && !interviewContext.value.discussedTopics.includes(currentTopic)) {
    interviewContext.value.discussedTopics.push(currentTopic)
  }

  // 更新问题数据
  currentQuestionData.value.text = actionResult.nextQuestion
  currentQuestion.value++

  // 显示过渡提示
  if (actionResult.autoTransition) {
    ElMessage.success({
      message: `🎯 回答达到${actionResult.evaluation?.overallScore || 70}分，自动进入下一话题`,
      duration: 3000
    })
  } else {
    ElMessage.success('很好！让我们继续下一个技术话题')
  }

  // 重置AI思考状态，准备新的思考过程
  setTimeout(() => {
    showAiThinking.value = false
    aiThinkingProcess.value = ''
    aiAnswerText.value = ''
    aiInterviewerStatus.value = '新问题已准备就绪，请开始回答'
  }, 2000)
}

// 从问题中提取话题关键词
const extractTopicFromQuestion = (question) => {
  const topicKeywords = [
    '机器学习', '深度学习', '神经网络', '算法', '数据结构',
    '系统设计', '架构', '性能优化', '数据库', '缓存',
    '分布式', '微服务', '容器', 'Docker', 'Kubernetes',
    '前端', '后端', 'API', '网络', '安全'
  ]

  for (const keyword of topicKeywords) {
    if (question.includes(keyword)) {
      return keyword
    }
  }
  return null
}

// 追问当前话题 - 智能避免重复
const askFollowUpQuestion = async (actionResult) => {
  aiInterviewerStatus.value = '正在分析回答，准备针对性追问...'

  // 检查是否已经追问过相同内容
  const evaluation = actionResult.evaluation
  const followUpReason = getFollowUpReason(evaluation)

  // 更新为追问问题
  currentQuestionData.value.text = actionResult.nextQuestion

  // 显示追问原因
  ElMessage.info({
    message: `💡 ${followUpReason}，让我们深入探讨一下`,
    duration: 3000
  })

  // 保持AI思考过程可见，但更新内容
  setTimeout(() => {
    aiThinkingProcess.value = actionResult.thinkingProcess || generateFollowUpThinking(evaluation)
    aiAnswerText.value = actionResult.aiResponse || generateFollowUpResponse(evaluation)
  }, 1000)

  aiInterviewerStatus.value = '等待您的补充回答'
}

// 获取追问原因
const getFollowUpReason = (evaluation) => {
  if (evaluation.technicalDepth < 60) {
    return '技术深度有待提升'
  } else if (evaluation.exampleRichness < 60) {
    return '需要更多实际案例'
  } else if (evaluation.completeness < 60) {
    return '回答需要更完整'
  } else {
    return '想了解更多细节'
  }
}

// 生成追问思考过程
const generateFollowUpThinking = (evaluation) => {
  return `让我分析一下候选人的回答：

📊 当前评分：${evaluation.overallScore}分
• 技术深度：${evaluation.technicalDepth}分
• 实际经验：${evaluation.exampleRichness}分
• 表达清晰度：${evaluation.completeness}分

🎯 追问策略：
基于当前回答的薄弱环节，我需要通过针对性追问来帮助候选人更好地展示技术能力。`
}

// 生成追问回复
const generateFollowUpResponse = (evaluation) => {
  const reason = getFollowUpReason(evaluation)
  return `基于您刚才的回答，我想${reason}。让我们深入探讨一些具体的技术细节，这将帮助我更全面地评估您的技术能力。`
}

// 深入探讨当前话题
const deepDiveCurrentTopic = async (actionResult) => {
  aiInterviewerStatus.value = '深入探讨中...'

  // 更新为深入问题
  currentQuestionData.value.text = actionResult.nextQuestion

  setTimeout(() => {
    aiThinkingProcess.value = actionResult.thinkingProcess
    aiAnswerText.value = actionResult.aiResponse
  }, 1000)

  aiInterviewerStatus.value = '期待您更深入的技术分享'
}

// 回答输入处理方法
const handleAnswerInput = () => {
  // 可以在这里添加实时提示逻辑
}

const getAnswerQualityHint = () => {
  const length = currentCandidateAnswer.value.length
  if (length < 50) return '建议提供更详细的描述'
  if (length < 150) return '可以补充更多技术细节'
  if (length < 300) return '内容不错，可以添加具体实例'
  return '回答很详细，AI会进行深度分析'
}

const clearAnswer = () => {
  currentCandidateAnswer.value = ''
  ElMessage.info('已清空回答内容')
}

const submitAnswer = async () => {
  if (!currentCandidateAnswer.value || currentCandidateAnswer.value.trim().length < 20) {
    ElMessage.warning('请提供至少20个字符的详细回答')
    return
  }

  try {
    await processIntelligentAnswer(currentCandidateAnswer.value)
    // 提交后清空输入框，准备下一轮
    currentCandidateAnswer.value = ''
  } catch (error) {
    console.error('提交回答失败:', error)
    ElMessage.error('提交失败，请重试')
  }
}

// 跳转到指定问题
const jumpToQuestion = (questionNumber) => {
  if (questionNumber <= currentQuestion.value + 1 && questionNumber >= 1) {
    currentQuestion.value = questionNumber
    updateQuestionData()
    currentCandidateAnswer.value = ''
    ElMessage.success(`已跳转到第 ${questionNumber} 题`)
  } else {
    ElMessage.warning('无法跳转到该问题')
  }
}



const updateQuestionData = () => {
  const questions = [
    {
      text: '请介绍一下您在机器学习方面的项目经验，特别是在深度学习模型优化方面的实践。',
      type: '技术深度',
      difficulty: '中等',
      domain: 'ai',
      domainName: 'AI技术'
    },
    {
      text: '在大数据处理方面，您有哪些实际的项目经验？请详细描述数据处理流程。',
      type: '实践经验',
      difficulty: '中等',
      domain: 'bigdata',
      domainName: '大数据'
    },
    {
      text: '物联网系统架构设计中，您认为最重要的考虑因素是什么？',
      type: '系统设计',
      difficulty: '困难',
      domain: 'iot',
      domainName: '物联网'
    }
  ]

  if (currentQuestion.value <= questions.length) {
    currentQuestionData.value = questions[currentQuestion.value - 1]
  }
}

const resetAnalysisState = () => {
  // 重置分析状态
  textAnalysisActive.value = false

  // 延迟激活分析
  setTimeout(() => {
    textAnalysisActive.value = true
  }, 1000)
}

// 定时器引用
let timer = null

// 生命周期
onMounted(async () => {
  // 启动计时器
  timer = setInterval(() => {
    elapsedTime.value++

    // 更新预计剩余时间
    const remaining = Math.max(0, (totalQuestions.value - currentQuestion.value) * 3 * 60 - elapsedTime.value)
    const remainingMins = Math.floor(remaining / 60)
    estimatedTimeLeft.value = `${remainingMins}分钟`

    // 模拟实时数据更新
    updateRealtimeData()
  }, 1000)

  // 初始化讯飞星火服务
  await initializeSparkService()



  // 初始化分析状态
  resetAnalysisState()
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }



  console.log('🧹 面试组件资源已清理')
})

const updateRealtimeData = () => {
  // 模拟实时指标更新
  realtimeMetrics.value.forEach(metric => {
    metric.score = Math.max(0, Math.min(100, metric.score + (Math.random() - 0.5) * 2))
  })


}
</script>

<style scoped>
/* 使用简化的样式系统 */

/* ===== 图标字体协调性标准 ===== */
/* 基础图标尺寸 - 与相邻文字协调 */
.el-icon {
  vertical-align: middle;
  transition: all 0.3s ease;
}

/* 元数据区域图标 - 14px文字匹配 */
.meta-item .el-icon {
  font-size: 14px;
  margin-right: 6px;
}

/* 面板标题图标 - 16px文字匹配 */
.panel-header .el-icon,
.skills-header .el-icon,
.scoring-header .el-icon,
.thinking-header .el-icon,
.hints-header .el-icon {
  font-size: 16px;
  margin-right: 8px;
}

/* 控制按钮图标 - 14px文字匹配 */
.control-btn .el-icon {
  font-size: 14px;
  margin-right: 6px;
}

/* 大型控制按钮图标 */
.control-action-btn .el-icon {
  font-size: 16px;
  margin-right: 8px;
}

/* 快捷按钮图标 - 纯图标按钮 */
.quick-btn .el-icon {
  font-size: 18px;
}

/* 状态指示图标 */
.ai-assistance-status .el-icon,
.hint-header .el-icon {
  font-size: 14px;
  margin-right: 4px;
}

/* 候选人信息区域图标 */
.candidate-company .el-icon {
  font-size: 13px;
  margin-right: 4px;
}

/* 问题元数据图标 */
.question-type .el-icon,
.question-difficulty .el-icon {
  font-size: 12px;
  margin-right: 4px;
}

/* 分析标签页图标 */
.analysis-tab .el-icon {
  font-size: 14px;
  margin-right: 6px;
}

/* 头像区域图标 */
.avatar-icon .el-icon {
  font-size: 20px;
}

/* iFlytek Spark 优化的面试页面 */
.interviewing-page.iflytek-enhanced {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%);
  color: #2c3e50;
  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
  overflow-x: hidden;
}

/* 头部样式 - iFlytek Spark 品牌风格 */
.interview-header.iflytek-style {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  padding: 16px 0;
  border-bottom: 1px solid rgba(24, 144, 255, 0.1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
  min-height: 80px;
}

.interview-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  gap: 24px;
  min-height: 64px;
}

.interview-info.iflytek-layout {
  flex: 1;
  min-width: 0;
}

.interview-title-section {
  margin-bottom: 16px;
}

.interview-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 6px 0;
  color: #1890ff;
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  font-size: 20px;
}

.interview-subtitle {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.interview-meta.iflytek-meta {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(24, 144, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(24, 144, 255, 0.1);
}

.meta-label {
  font-size: 14px;
  color: var(--text-muted-high-contrast, #5a6c7d);
  font-weight: 500;
}

.meta-value {
  font-size: 14px;
  color: var(--text-primary-high-contrast, #1a1a1a);
  font-weight: 600;
}

/* iFlytek Spark 状态控制区域 */
.interview-status.iflytek-controls {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 400px;
}

.status-indicator-group {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  border: 1px solid rgba(24, 144, 255, 0.2);
  transition: all 0.3s ease;
  white-space: nowrap;
}

.status-indicator.active {
  border-color: #52c41a;
  background: rgba(82, 196, 26, 0.1);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #d9d9d9;
  transition: all 0.3s ease;
}

.status-indicator.active .status-dot {
  background: #52c41a;
}

.status-text {
  font-size: 12px;
  font-weight: 500;
  color: #2c3e50;
}

.ai-assistance-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #1890ff;
  font-weight: 500;
}

.interview-progress.iflytek-progress {
  background: rgba(255, 255, 255, 0.9);
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(24, 144, 255, 0.1);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-text {
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
}

.progress-numbers {
  font-size: 14px;
  color: #1890ff;
  font-weight: 600;
}

.progress-bar.enhanced-progress {
  height: 8px;
  background: #f0f2f5;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #1890ff, #40a9ff);
  border-radius: 4px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.progress-glow {
  position: absolute;
  top: 0;
  right: 0;
  width: 20px;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5));
  animation: progressGlow 2s ease-in-out infinite;
}

@keyframes progressGlow {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}

.progress-time-estimate {
  font-size: 12px;
  color: #7f8c8d;
  text-align: right;
}

/* iFlytek Spark 主面试区域 */
.interview-main.spark-main {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  flex: 1;
  overflow-y: auto;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: calc(100vh - 120px);
}

.interview-layout.spark-layout {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 32px;
  min-height: calc(100vh - 200px);
  align-items: start;
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  overflow: hidden; /* 防止内容溢出 */
}

/* iFlytek Spark 候选人区域 */
.candidate-section.spark-candidate {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 0; /* 防止flex子项溢出 */
}

.interaction-container.spark-interaction {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(24, 144, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 400px;
  max-height: 650px;
  overflow: hidden;
}

/* iFlytek Spark AI分析区域 */
.analysis-section.spark-analysis {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 0; /* 防止flex子项溢出 */
  max-height: calc(100vh - 240px);
  overflow-y: auto;
  /* 确保在小屏幕上能够正确显示 */
  flex-shrink: 1;
  min-width: 0;
}

/* 布局协调优化 */
.interviewing-page.iflytek-enhanced {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f8f9fa;
}

/* 确保内容区域合理分配空间 */
.interview-frame {
  flex: 1;
  min-height: 300px;
  max-height: 400px;
  overflow: hidden;
  border-radius: 12px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 问题内容区域优化 */
.question-content.spark-question {
  flex: 1;
  min-height: 200px;
  overflow-y: auto;
  padding: 16px;
  background: rgba(248, 249, 250, 0.8);
  border-radius: 12px;
  margin-top: 16px;
}

.video-frame.spark-frame {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
  margin-bottom: 16px;
}

.candidate-video {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 12px;
}

.video-overlay.spark-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
}

.ai-analysis-indicators {
  display: flex;
  gap: 12px;
  align-self: flex-end;
}

.analysis-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 20px;
  color: white;
  font-size: 12px;
  opacity: 0.6;
  transition: all 0.3s ease;
}

.analysis-item.active {
  opacity: 1;
  background: rgba(24, 144, 255, 0.8);
}

.ai-realtime-hints {
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  border: 1px solid rgba(24, 144, 255, 0.2);
  border-radius: 12px;
  padding: 16px;
  color: #333;
  max-width: 400px;
  align-self: flex-start;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.1);
}

.hint-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  font-weight: 600;
  color: #1890ff;
}

.hint-header > div:first-child {
  display: flex;
  align-items: center;
  gap: 8px;
}

.hint-status {
  display: flex;
  gap: 12px;
  font-size: 12px;
  font-weight: 500;
}

.hint-level {
  background: rgba(24, 144, 255, 0.1);
  color: #1890ff;
  padding: 2px 8px;
  border-radius: 12px;
}

.hint-remaining {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  padding: 2px 8px;
  border-radius: 12px;
}

.hint-content {
  color: #333;
}

.hint-text {
  line-height: 1.6;
  font-size: 14px;
  margin-bottom: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  border-left: 3px solid #1890ff;
}

.hint-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.hint-action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.hint-action-btn:not(.secondary) {
  background: #1890ff;
  color: white;
}

.hint-action-btn.secondary {
  background: rgba(24, 144, 255, 0.1);
  color: #1890ff;
}

.hint-action-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
}

.hint-action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.video-controls.offermore-controls {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.control-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px;
}

.control-btn.primary {
  background: #1890ff;
  color: white;
}

.control-btn.primary:hover {
  background: #40a9ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}

.control-btn.secondary {
  background: #f0f2f5;
  color: #5a6c7d;
}

.control-btn.secondary:hover {
  background: #e6f7ff;
  color: #1890ff;
}

.control-btn.tertiary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.control-btn.tertiary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* iFlytek Spark 候选人信息卡片 */
.candidate-info-card.spark-card {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(24, 144, 255, 0.1);
  min-height: 300px;
  max-height: 400px;
  overflow-y: auto;
}

.card-header {
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
  align-items: flex-start;
  padding-bottom: 8px;
  min-height: 60px;
  box-sizing: border-box;
}

.candidate-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #1890ff;
}

.candidate-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.candidate-basic {
  flex: 1;
}

.candidate-name {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 4px 0;
}

.candidate-position {
  font-size: 14px;
  color: #1890ff;
  font-weight: 500;
  margin: 0 0 6px 0;
}

.candidate-company {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #7f8c8d;
}

.candidate-skills {
  margin-bottom: 20px;
}

.skills-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 12px;
}

.skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag.enhanced {
  padding: 6px 12px;
  background: linear-gradient(135deg, #e6f7ff, #bae7ff);
  color: #1890ff;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid rgba(24, 144, 255, 0.2);
  transition: all 0.3s ease;
}

.skill-tag.enhanced:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
}

/* 实时评分 - Offermore特色 */
.realtime-scoring {
  border-top: 1px solid #f0f2f5;
  padding-top: 16px;
}

.scoring-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 12px;
}

.scoring-metrics {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.metric-name {
  font-size: 12px;
  color: #7f8c8d;
  min-width: 60px;
}

.metric-bar {
  flex: 1;
  height: 6px;
  background: #f0f2f5;
  border-radius: 3px;
  overflow: hidden;
}

.metric-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.metric-score {
  font-size: 12px;
  font-weight: 600;
  color: #2c3e50;
  min-width: 35px;
  text-align: right;
}

/* 分析区域 - Offermore风格 */
.analysis-section.offermore-analysis {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 讯飞星火多模态分析面板 */
.spark-multimodal-panel {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  border: 1px solid rgba(24, 144, 255, 0.2);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.1);
}

.spark-status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(24, 144, 255, 0.1);
}

.spark-status-header .status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.spark-status-header .status-indicator.active {
  color: #1890ff;
}

.spark-status-header .status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #d9d9d9;
  transition: all 0.3s;
}

.spark-status-header .status-indicator.active .status-dot {
  background: #1890ff;
  box-shadow: 0 0 8px rgba(24, 144, 255, 0.5);
}

.processing-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #1890ff;
}

.processing-indicator .rotating {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.ai-interviewer-panel.spark-panel {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(24, 144, 255, 0.1);
  min-height: 500px;
  max-height: 700px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 8px;
  min-height: 48px;
  box-sizing: border-box;
}

.interviewer-avatar {
  position: relative;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #1890ff, #40a9ff);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.avatar-status {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #d9d9d9;
  border: 2px solid white;
  transition: all 0.3s ease;
}

.avatar-status.active {
  background: #52c41a;
}

.interviewer-info {
  flex: 1;
}

.interviewer-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 6px 0;
  line-height: 1.4;
  word-wrap: break-word;
}

.interviewer-status {
  font-size: 13px;
  color: #7f8c8d;
  margin: 0;
}

.question-counter {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.counter-text {
  font-size: 16px;
  font-weight: 600;
  color: #1890ff;
}

.counter-total {
  font-size: 12px;
  color: #7f8c8d;
}

.question-content.offermore-question {
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
}

.question-text-area {
  margin-bottom: 16px;
}

.question-text {
  font-size: 16px;
  line-height: 1.6;
  color: #2c3e50;
  margin-bottom: 16px;
}

.ai-thinking-process {
  background: rgba(24, 144, 255, 0.05);
  border-left: 4px solid #1890ff;
  padding: 12px 16px;
  border-radius: 0 8px 8px 0;
  margin-bottom: 16px;
}

.thinking-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #1890ff;
  margin-bottom: 8px;
}

.thinking-content {
  font-size: 14px;
  color: #5a6c7d;
  line-height: 1.5;
}

.intelligent-hints {
  background: rgba(250, 173, 20, 0.05);
  border-left: 4px solid #fa8c16;
  padding: 12px 16px;
  border-radius: 0 8px 8px 0;
}

.hints-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #fa8c16;
  margin-bottom: 8px;
}

.hints-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hint-item {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.hint-type {
  font-size: 12px;
  background: #fa8c16;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
  white-space: nowrap;
}

.hint-text {
  font-size: 13px;
  color: #5a6c7d;
  line-height: 1.4;
}

.question-metadata {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.question-type,
.question-difficulty,
.question-domain {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #7f8c8d;
  padding: 4px 8px;
  background: #f0f2f5;
  border-radius: 6px;
}

/* 实时分析面板 */
.realtime-analysis-panel {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(24, 144, 255, 0.1);
}

.analysis-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
  background: #f0f2f5;
  padding: 4px;
  border-radius: 8px;
}

.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  color: #7f8c8d;
  transition: all 0.3s ease;
}

.tab-btn.active {
  background: white;
  color: #1890ff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.analysis-content {
  min-height: 200px;
}



.metric {
  text-align: center;
  flex: 1;
}

.metric-label {
  display: block;
  font-size: 12px;
  color: #7f8c8d;
  margin-bottom: 4px;
}

.metric-value {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
}

/* 表情分析 */
.analysis-expression {
  padding: 16px 0;
}

.expression-chart {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.emotion-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.emotion-name {
  font-size: 13px;
  color: #2c3e50;
  min-width: 40px;
}

.emotion-bar {
  flex: 1;
  height: 8px;
  background: #f0f2f5;
  border-radius: 4px;
  overflow: hidden;
}

.emotion-fill {
  height: 100%;
  background: linear-gradient(90deg, #52c41a, #73d13d);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.emotion-value {
  font-size: 12px;
  font-weight: 600;
  color: #2c3e50;
  min-width: 35px;
  text-align: right;
}

/* 内容分析 */
.analysis-content-tab {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.content-keywords h4,
.content-structure h4 {
  font-size: 14px;
  color: #2c3e50;
  margin: 0 0 12px 0;
}

.keywords-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.keyword-tag {
  padding: 4px 8px;
  background: linear-gradient(135deg, #e6f7ff, #bae7ff);
  color: #1890ff;
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.keyword-tag:hover {
  transform: scale(1.05);
}

.structure-analysis {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.structure-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.structure-label {
  font-size: 13px;
  color: #7f8c8d;
  min-width: 60px;
}

.structure-score {
  font-size: 14px;
  font-weight: 600;
  color: #52c41a;
}

/* 控制按钮区域 - Offermore风格增强 */
.interview-controls.offermore-controls-panel {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(24, 144, 255, 0.1);
}

.control-actions.enhanced-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.control-action-btn.enhanced {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 20px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.control-action-btn.primary.enhanced {
  background: linear-gradient(135deg, #1890ff, #40a9ff);
  color: white;
}

.control-action-btn.primary.enhanced:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(24, 144, 255, 0.3);
}

.control-action-btn.secondary.enhanced {
  background: #f0f2f5;
  color: #5a6c7d;
}

.control-action-btn.secondary.enhanced:hover {
  background: #e6f7ff;
  color: #1890ff;
  transform: translateY(-1px);
}

.control-action-btn.tertiary.enhanced {
  background: linear-gradient(135deg, #722ed1, #9254de);
  color: white;
}

.control-action-btn.tertiary.enhanced:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(114, 46, 209, 0.3);
}

.control-action-btn.danger.enhanced {
  background: linear-gradient(135deg, #ff4d4f, #ff7875);
  color: white;
}

.control-action-btn.danger.enhanced:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 77, 79, 0.3);
}

.btn-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.control-action-btn.enhanced:hover .btn-glow {
  left: 100%;
}

/* 快捷操作面板样式 */
.quick-actions-panel {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(24, 144, 255, 0.1);
  box-shadow: 0 4px 16px rgba(24, 144, 255, 0.08);
  margin-top: 16px;
}

.actions-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f2f5;
}

.actions-header h4 {
  margin: 0;
  color: #1890ff;
  font-size: 16px;
  font-weight: 600;
  font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
}

.actions-header .el-icon {
  color: #1890ff;
  font-size: 18px;
}

.actions-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.question-navigation,
.interview-control,
.quick-operations {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 16px;
}

.nav-title {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
  font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
}

.nav-title .el-icon {
  color: #1890ff;
  font-size: 16px;
}

.question-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
  gap: 8px;
  max-width: 100%;
}

.question-nav-btn {
  min-width: 40px;
  height: 32px;
  font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
}

.control-buttons,
.operation-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.control-buttons .el-button,
.operation-buttons .el-button {
  font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
  flex: 1;
  min-width: 100px;
}

/* 响应式设计 - 使用响应式框架 */
@media (max-width: 1200px) {
  .interview-layout.offermore-layout {
    grid-template-columns: 1fr;
    gap: var(--space-responsive-xl);
  }

  .interview-header-content {
    flex-direction: column;
    gap: var(--space-responsive-lg);
  }

  .interview-meta.offermore-meta {
    justify-content: center;
    gap: var(--space-responsive-md);
  }

  .panel-header h3 {
    font-size: var(--font-lg);
  }

  .control-action-btn {
    min-height: var(--btn-height-md);
    font-size: var(--font-sm);
  }
}

@media (max-width: 768px) {
  .interview-main.offermore-main {
    padding: var(--space-responsive-lg);
  }

  .control-actions.enhanced-actions {
    grid-template-columns: 1fr;
    gap: var(--space-responsive-md);
  }

  .video-controls.offermore-controls {
    flex-direction: column;
    gap: var(--space-responsive-sm);
  }

  .analysis-tabs {
    flex-direction: column;
    gap: var(--space-responsive-sm);
  }

  .tab-btn {
    justify-content: flex-start;
    padding: var(--space-responsive-md);
    font-size: var(--font-sm);
  }

  .interview-header {
    padding: var(--space-responsive-md);
  }

  .interview-title {
    font-size: var(--font-xl);
  }

  .candidate-info h3 {
    font-size: var(--font-lg);
  }

  .control-action-btn {
    min-height: var(--btn-height-sm);
    font-size: var(--font-xs);
    padding: 0 var(--space-responsive-sm);
  }
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ff4444;
}

.status-indicator.active .status-dot {
  background: #44ff44;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.progress-bar {
  width: 200px;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #44ff44;
  transition: width 0.3s ease;
}

.interview-main {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.interview-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  height: calc(100vh - 140px);
}

.candidate-section, .analysis-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.video-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.video-frame {
  position: relative;
  flex: 1;
  border-radius: 8px;
  overflow: hidden;
}

.candidate-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-controls {
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
  display: flex;
  gap: 10px;
  justify-content: center;
}

.control-btn {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
}

.control-btn:hover {
  background: rgba(0, 0, 0, 0.9);
}

.candidate-info-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 15px;
}

.candidate-name {
  margin: 0 0 5px 0;
  font-size: 18px;
}

.candidate-position {
  margin: 0 0 10px 0;
  opacity: 0.8;
}

.candidate-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.question-panel {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.question-title {
  margin: 0;
  font-size: 18px;
}

.question-number {
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 14px;
}

.question-text {
  font-size: 16px;
  line-height: 1.6;
}

.interview-controls {
  margin-top: auto;
}

.control-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.control-action-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.control-action-btn.primary {
  background: #4CAF50;
  color: white;
}

.control-action-btn.secondary {
  background: #FF9800;
  color: white;
}

.control-action-btn.danger {
  background: #f44336;
  color: white;
}

.control-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* ===== 响应式图标设计 - 使用响应式框架 ===== */
@media (max-width: 768px) {
  .panel-header .el-icon,
  .control-action-btn .el-icon {
    font-size: var(--icon-sm);
    width: var(--icon-sm);
    height: var(--icon-sm);
  }

  .quick-btn .el-icon {
    font-size: var(--icon-base);
    width: var(--icon-base);
    height: var(--icon-base);
  }

  .avatar-icon .el-icon {
    font-size: var(--icon-lg);
    width: var(--icon-lg);
    height: var(--icon-lg);
  }

  .status-dot {
    width: var(--space-responsive-sm);
    height: var(--space-responsive-sm);
  }
}

@media (max-width: 480px) {
  .el-icon {
    font-size: var(--icon-xs);
    width: var(--icon-xs);
    height: var(--icon-xs);
  }

  .panel-header .el-icon,
  .control-action-btn .el-icon {
    font-size: var(--icon-xs);
    width: var(--icon-xs);
    height: var(--icon-xs);
  }

  .quick-btn .el-icon {
    font-size: var(--icon-sm);
    width: var(--icon-sm);
    height: var(--icon-sm);
  }

  .avatar-icon .el-icon {
    font-size: var(--icon-base);
    width: var(--icon-base);
    height: var(--icon-base);
  }

  .interview-main.offermore-main {
    padding: var(--space-responsive-md);
  }

  .interview-title {
    font-size: var(--font-lg);
  }

  .candidate-info h3 {
    font-size: var(--font-base);
  }

  .control-action-btn {
    min-height: var(--btn-height-sm);
    font-size: var(--font-xs);
    padding: 0 var(--space-responsive-xs);
  }
}

/* ===== 可访问性增强 ===== */
/* 确保按钮有足够的点击区域 */
.quick-btn {
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 图标悬停效果 */
.el-icon:hover {
  transform: scale(1.05);
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .el-icon {
    filter: contrast(1.5);
  }
}

/* 减少动画偏好支持 */
@media (prefers-reduced-motion: reduce) {
  .el-icon {
    transition: none;
  }

  .el-icon:hover {
    transform: none;
  }
}

/* 面试时间轴区域样式 */
.interview-timeline-section {
  margin-top: 32px;
  padding: 0 24px;
  background: #f8f9fa;
  border-radius: 16px 16px 0 0;
}

/* ===== iFlytek Spark 响应式设计优化 ===== */

/* 半屏显示优化 - 针对窗口宽度在 800px-1200px 之间 */
@media (max-width: 1200px) and (min-width: 800px) {
  .interview-layout.spark-layout {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 16px;
    min-height: auto;
  }

  .quick-actions-panel {
    position: sticky;
    bottom: 0;
    z-index: 10;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(10px);
    border-top: 1px solid rgba(24, 144, 255, 0.1);
    margin-top: 8px;
    padding: 12px;
    max-width: 100%;
    overflow: hidden;
  }

  .actions-content {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 8px;
    max-width: 100%;
  }

  .actions-section {
    min-width: 0; /* 允许flex项目收缩 */
    overflow: hidden;
  }

  .question-buttons {
    grid-template-columns: repeat(auto-fit, minmax(28px, 1fr));
    gap: 3px;
    max-height: 80px;
    overflow-y: auto;
    max-width: 100%;
  }

  .question-nav-btn {
    min-width: 28px;
    max-width: 35px;
    height: 26px;
    font-size: 10px;
    padding: 0 2px;
    white-space: nowrap;
    overflow: hidden;
  }

  .control-actions.enhanced-actions {
    grid-template-columns: 1fr 1fr;
    gap: 6px;
  }

  .control-action-btn {
    min-width: 0;
    padding: 6px 8px;
    font-size: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .control-action-btn span {
    display: none; /* 在半屏模式下隐藏文字，只显示图标 */
  }

  .submit-actions {
    gap: 6px;
  }

  .submit-btn {
    padding: 8px 12px;
    font-size: 11px;
    min-width: 0;
    flex: 1;
  }
}

@media (max-width: 1200px) {
  .interview-layout.spark-layout {
    grid-template-columns: 1fr;
    gap: 24px;
    min-height: auto;
    padding: 16px;
  }

  .interview-header-content {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
    min-height: auto;
  }

  .interview-status.iflytek-controls {
    max-width: none;
  }

  .status-indicator-group {
    justify-content: center;
  }

  .candidate-info-card.spark-card,
  .ai-interviewer-panel.spark-panel {
    max-height: none;
    min-height: auto;
  }
}

@media (max-width: 768px) {
  .interview-main.spark-main {
    padding: var(--space-responsive-md);
  }

  .interview-header.iflytek-style {
    padding: var(--space-responsive-md) 0;
  }

  .interview-header-content {
    padding: 0 var(--space-responsive-md);
    min-height: auto;
  }

  .interview-title {
    font-size: var(--font-xl);
  }

  .interview-meta.iflytek-meta {
    gap: var(--space-responsive-sm);
  }

  .meta-item {
    padding: var(--space-responsive-sm) var(--space-responsive-md);
    font-size: var(--font-sm);
  }

  .interview-timeline-section {
    margin-top: var(--space-responsive-lg);
    padding: 0 var(--space-responsive-md);
  }
}

  .interaction-container.spark-interaction,
  .candidate-info-card.spark-card {
    padding: 16px;
  }

  .interview-timeline-section {
    margin-top: 24px;
    padding: 0 16px;
  }
}

@media (max-width: 480px) {
  .interview-title {
    font-size: var(--font-lg);
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-responsive-sm);
  }

  .interview-meta.iflytek-meta {
    flex-direction: column;
    gap: var(--space-responsive-sm);
  }

  .status-indicator-group {
    flex-direction: column;
    gap: var(--space-responsive-sm);
  }

  .interview-progress.iflytek-progress {
    padding: var(--space-responsive-sm);
  }

  .interview-main.spark-main {
    padding: var(--space-responsive-sm);
  }

  .interview-header-content {
    padding: 0 var(--space-responsive-sm);
  }

  .meta-item {
    padding: var(--space-responsive-xs) var(--space-responsive-sm);
    font-size: var(--font-xs);
  }
}

/* 大屏幕优化 */
@media (min-width: 1200px) {
  .interview-layout.spark-layout {
    gap: var(--space-responsive-2xl);
  }

  .interview-title {
    font-size: var(--font-3xl);
  }

  .control-action-btn {
    min-height: var(--btn-height-lg);
    font-size: var(--font-base);
  }

  .panel-header h3 {
    font-size: var(--font-xl);
  }
}

/* 智能回答输入区域样式 */
.answer-input-section {
  margin-top: 24px;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(24, 144, 255, 0.1);
  box-shadow: 0 4px 16px rgba(24, 144, 255, 0.08);
}

.input-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.input-header h4 {
  margin: 0;
  color: #1890ff;
  font-size: 16px;
  font-weight: 600;
  font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
}

.input-tips {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 12px;
  font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
}

.input-tips .el-icon {
  color: #faad14;
}

.answer-textarea {
  margin-bottom: 16px;
}

.answer-textarea .el-textarea__inner {
  font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
  font-size: 14px;
  line-height: 1.6;
  border: 1px solid rgba(24, 144, 255, 0.2);
  border-radius: 8px;
  padding: 16px;
  resize: vertical;
  min-height: 200px;
}

.answer-textarea .el-textarea__inner:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.answer-stats {
  display: flex;
  gap: 16px;
  align-items: center;
}

.char-count {
  color: #999;
  font-size: 12px;
  font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
}

.quality-hint {
  color: #1890ff;
  font-size: 12px;
  font-weight: 500;
  font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
}

.submit-actions {
  display: flex;
  gap: 12px;
}

.submit-actions .el-button {
  font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
}

/* 处理中状态样式 */
.processing-answer {
  margin-top: 24px;
  background: linear-gradient(135deg, rgba(24, 144, 255, 0.05), rgba(102, 126, 234, 0.05));
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  border: 1px solid rgba(24, 144, 255, 0.1);
}

.processing-content h4 {
  margin: 16px 0 8px 0;
  color: #1890ff;
  font-size: 16px;
  font-weight: 600;
  font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
}

.processing-content p {
  margin: 0;
  color: #666;
  font-size: 14px;
  font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
}

.processing-content .el-icon {
  font-size: 24px;
  color: #1890ff;
}

.rotating {
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 响应式设计优化 - 修复半屏显示问题 */
@media (max-width: 1400px) {
  .quick-actions-panel {
    padding: 16px;
  }

  .question-buttons {
    grid-template-columns: repeat(auto-fit, minmax(35px, 1fr));
    gap: 6px;
  }

  .question-nav-btn {
    min-width: 35px;
    height: 30px;
    font-size: 12px;
  }
}

@media (max-width: 1200px) {
  .interview-layout.spark-layout {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .quick-actions-panel {
    margin-top: 12px;
  }

  .actions-content {
    gap: 16px;
  }

  .question-buttons {
    grid-template-columns: repeat(auto-fit, minmax(32px, 1fr));
    gap: 4px;
  }

  .control-buttons,
  .operation-buttons {
    flex-direction: column;
    gap: 6px;
  }

  .control-buttons .el-button,
  .operation-buttons .el-button {
    min-width: auto;
    width: 100%;
  }
}

@media (max-width: 768px) {
  .answer-input-section {
    padding: 16px;
    margin-top: 16px;
  }

  .input-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .input-actions {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .answer-stats {
    justify-content: center;
  }

  .submit-actions {
    justify-content: center;
  }

  .quick-actions-panel {
    padding: 12px;
    margin-top: 8px;
  }

  .actions-header h4 {
    font-size: 14px;
  }

  .question-buttons {
    grid-template-columns: repeat(auto-fit, minmax(28px, 1fr));
    gap: 3px;
  }

  .question-nav-btn {
    min-width: 28px;
    height: 28px;
    font-size: 11px;
  }

  .nav-title {
    font-size: 12px;
    margin-bottom: 8px;
  }

  .question-navigation,
  .interview-control,
  .quick-operations {
    padding: 12px;
  }
}

@media (max-width: 480px) {
  .quick-actions-panel {
    padding: 8px;
  }

  .actions-content {
    gap: 12px;
  }

  .question-buttons {
    grid-template-columns: repeat(5, 1fr);
    gap: 2px;
  }

  .question-nav-btn {
    min-width: 24px;
    height: 24px;
    font-size: 10px;
  }

  .control-buttons .el-button,
  .operation-buttons .el-button {
    font-size: 12px;
    padding: 6px 12px;
  }
}
</style>
