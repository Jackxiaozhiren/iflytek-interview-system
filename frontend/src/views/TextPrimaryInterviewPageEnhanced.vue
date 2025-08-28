<template>
  <div class="text-primary-interview-page">
    <!-- 顶部导航栏 -->
    <header class="interview-header">
      <div class="header-content">
        <div class="header-left">
          <el-icon class="logo-icon"><Star /></el-icon>
          <h1>iFlytek星火智能面试</h1>
          <span class="interview-mode">文本优先模式</span>
        </div>
        <div class="header-right">
          <div class="interview-progress">
            <span>问题进度: {{ currentQuestion }}/{{ totalQuestions }}</span>
            <el-progress :percentage="(currentQuestion / totalQuestions) * 100" :show-text="false" />
          </div>
          <div class="interview-timer">
            <el-icon><Timer /></el-icon>
            <span>{{ formatTime(elapsedTime) }}</span>
          </div>
          <el-button type="primary" @click="endInterview">
            结束面试
          </el-button>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="interview-main">
      <div class="interview-layout">
        <!-- 左侧: 文本对话区域 -->
        <section class="conversation-section">
          <div class="conversation-container">
            <!-- 对话历史 -->
            <div class="conversation-history">
              <div class="conversation-header">
                <div class="header-info">
                  <el-icon><Document /></el-icon>
                  <h3>面试对话</h3>
                  <span class="mode-indicator">文本优先</span>
                </div>
              </div>

              <!-- 消息列表 -->
              <div class="messages-container" ref="messagesContainer">
                <div v-for="(message, index) in conversationHistory" :key="index"
                     class="message-item"
                     :class="{ 'ai-message': message.type === 'ai', 'user-message': message.type === 'user' }">
                  
                  <div class="message-avatar">
                    <el-icon v-if="message.type === 'ai'">
                      <User v-if="!message.isThinking" />
                      <Loading v-else class="thinking-icon" />
                    </el-icon>
                    <el-icon v-else><Star /></el-icon>
                  </div>
                  
                  <div class="message-content">
                    <div class="message-header">
                      <span class="message-sender">{{ message.sender }}</span>
                      <span class="message-time">{{ message.timestamp }}</span>
                    </div>

                    <!-- 思考过程状态指示器 -->
                    <div v-if="message.isThinking" class="thinking-indicator">
                      <el-icon class="thinking-icon"><Loading /></el-icon>
                      <span>{{ message.content }}</span>
                    </div>

                    <!-- 增强的可折叠思考过程 -->
                    <div v-if="message.hasThinkingProcess && message.thinkingProcess"
                         class="thinking-process-container enhanced-thinking">
                      <el-collapse v-model="message.thinkingExpanded" class="thinking-collapse">
                        <el-collapse-item name="thinking">
                          <template #title>
                            <div class="thinking-summary">
                              <div class="thinking-icon-wrapper">
                                <el-icon class="thinking-main-icon"><Cpu /></el-icon>
                              </div>
                              <div class="thinking-title-content">
                                <span class="thinking-title">🧠 AI思考过程分析</span>
                                <span v-if="message.thinkingExpanded?.includes('thinking')"
                                      class="thinking-subtitle">点击查看详细的分析步骤和评估要点</span>
                              </div>
                              <div class="thinking-status">
                                <el-tag size="small" :type="message.thinkingExpanded?.includes('thinking') ? 'success' : 'info'">
                                  {{ message.thinkingExpanded?.includes('thinking') ? '已展开' : '点击展开' }}
                                </el-tag>
                              </div>
                            </div>
                          </template>
                          
                          <div class="thinking-content">
                            <div class="thinking-steps">
                              <div v-for="(step, index) in parseThinkingSteps(message.thinkingProcess)" 
                                   :key="index" class="thinking-step">
                                <div class="step-header">
                                  <span class="step-number">{{ index + 1 }}</span>
                                  <span class="step-title">{{ step.title }}</span>
                                </div>
                                <div class="step-content">{{ step.content }}</div>
                              </div>
                            </div>
                          </div>
                        </el-collapse-item>
                      </el-collapse>
                    </div>

                    <!-- 主要回复内容 -->
                    <div v-if="!message.isThinking" class="message-text">
                      <div v-if="message.isTyping" class="typing-text">
                        {{ message.displayedContent }}
                        <span class="typing-cursor">|</span>
                      </div>
                      <div v-else-if="message.hasThinkingProcess && message.finalResponse" class="final-response">
                        {{ message.finalResponse }}
                      </div>
                      <div v-else-if="message.displayedContent" class="displayed-content">
                        {{ message.displayedContent }}
                      </div>
                      <div v-else class="default-content">
                        {{ message.content }}
                      </div>
                    </div>

                    <!-- 分析标签 -->
                    <div v-if="message.analysis && !message.isThinking"
                         class="message-analysis">
                      <div class="analysis-tags">
                        <span class="score-tag">评分: {{ message.analysis.score }}</span>
                        <span class="keywords-tag">关键词: {{ (message.analysis.keywords || []).join(', ') || '无' }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 回答输入区域 -->
            <div class="answer-input-panel">
              <div class="input-header">
                <span class="input-label">您的回答</span>
                <el-tag v-if="currentTextInput.length > 0" type="info" size="small">
                  {{ currentTextInput.length }} 字符
                </el-tag>
              </div>
              
              <div class="input-container">
                <el-input
                  v-model="currentTextInput"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入您的回答..."
                  @keydown.ctrl.enter="submitAnswer"
                  class="answer-textarea"
                />
                
                <el-button 
                  type="primary" 
                  @click="submitAnswer"
                  :disabled="!currentTextInput.trim()"
                  class="submit-btn">
                  <el-icon><Promotion /></el-icon>
                  提交回答
                </el-button>
              </div>

              <div class="input-footer">
                <div class="input-actions">
                  <el-button size="small" @click="clearInput" v-if="currentTextInput.length > 0">
                    <el-icon><Delete /></el-icon>
                    清空
                  </el-button>
                  <el-button size="small" @click="nextQuestion" v-if="currentQuestion < totalQuestions">
                    <el-icon><Right /></el-icon>
                    跳过问题
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 右侧: 当前问题和快捷操作面板 -->
        <section class="question-control-section">
          <!-- 面试问题面板 -->
          <div class="current-question-panel">
            <div class="question-header">
              <div class="header-left">
                <el-icon class="question-icon"><InfoFilled /></el-icon>
                <span class="question-title">面试问题</span>
                <el-tag type="info" size="small">{{ currentQuestion }}/{{ totalQuestions }}</el-tag>
              </div>
              <div class="question-actions">
                <el-button size="small" @click="getAiHint" :disabled="aiAssistanceCount <= 0">
                  <el-icon><Star /></el-icon>
                  AI提示 ({{ aiAssistanceCount }})
                </el-button>
              </div>
            </div>
            <div class="question-content">
              <div class="question-text-container">
                <p class="question-text">{{ currentQuestionData.text }}</p>
              </div>
              <div class="question-meta">
                <el-tag type="primary" size="small">
                  <el-icon><Document /></el-icon>
                  {{ currentQuestionData.type }}
                </el-tag>
                <el-tag type="warning" size="small">
                  难度: {{ currentQuestionData.difficulty }}
                </el-tag>
                <el-tag type="success" size="small">
                  {{ currentQuestionData.domainName }}
                </el-tag>
              </div>
            </div>
          </div>

          <!-- 题目选择面板 -->
          <div class="question-navigation-panel">
            <div class="nav-header">
              <el-icon><QuestionFilled /></el-icon>
              <h4>题目导航</h4>
            </div>
            <div class="question-buttons">
              <el-button
                v-for="n in totalQuestions"
                :key="n"
                :type="n === currentQuestion ? 'primary' : (n < currentQuestion ? 'success' : 'default')"
                :disabled="n > currentQuestion + 1"
                size="small"
                @click="jumpToQuestion(n)"
                class="question-nav-btn">
                {{ n }}
              </el-button>
            </div>
          </div>

          <!-- 实时评分面板 -->
          <div class="scoring-panel">
            <div class="panel-header">
              <el-icon><Document /></el-icon>
              <h4>实时评分</h4>
              <el-tag :type="getScoreType(conversationScoring.currentQuestionScore)" size="small">
                对话{{ conversationScoring.currentQuestionScore || 0 }}分
              </el-tag>
            </div>
            <div class="panel-content">
              <div class="score-breakdown">
                <div class="score-item">
                  <span class="score-name">技术能力</span>
                  <div class="score-bar">
                    <div class="score-fill" :style="{ width: (realTimeAnalysis.technicalCompetency || 0) + '%' }"></div>
                  </div>
                  <span class="score-value">{{ realTimeAnalysis.technicalCompetency || 0 }}</span>
                </div>
                <div class="score-item">
                  <span class="score-name">沟通技巧</span>
                  <div class="score-bar">
                    <div class="score-fill" :style="{ width: (realTimeAnalysis.communicationSkills || 0) + '%' }"></div>
                  </div>
                  <span class="score-value">{{ realTimeAnalysis.communicationSkills || 0 }}</span>
                </div>
                <div class="score-item">
                  <span class="score-name">逻辑思维</span>
                  <div class="score-bar">
                    <div class="score-fill" :style="{ width: (realTimeAnalysis.logicalThinking || 0) + '%' }"></div>
                  </div>
                  <span class="score-value">{{ realTimeAnalysis.logicalThinking || 0 }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElNotification, ElMessageBox } from 'element-plus'
import {
  User, Timer, Star, Loading, Document, ArrowRight, Setting, Close,
  InfoFilled, Tools, Promotion, Plus, Delete, Right, QuestionFilled,
  Cpu, Operation, VideoPause, VideoPlay, SwitchButton
} from '@element-plus/icons-vue'

// 导入服务
import { enhancedIflytekSparkService } from '@/services/enhanced-iflytek-spark'

const router = useRouter()

// 基础面试数据
const currentQuestion = ref(1)
const totalQuestions = ref(10)
const elapsedTime = ref(0)
const aiAssistanceCount = ref(3)

// 当前问题数据
const currentQuestionData = ref({
  text: '请简单介绍一下您在人工智能领域的项目经验，特别是在机器学习模型开发方面的实践。',
  type: '技术深度',
  difficulty: 'medium',
  domain: 'ai',
  domainName: 'AI算法'
})

// 对话历史
const conversationHistory = ref([])

// 输入相关
const currentTextInput = ref('')
const messagesContainer = ref(null)

// AI分析相关
const realTimeAnalysis = ref({
  technicalCompetency: 0,
  communicationSkills: 0,
  logicalThinking: 0,
  contentQuality: 0,
  expressionAbility: 0,
  learningAbility: 0
})

// 对话流程综合评分系统
const conversationScoring = ref({
  currentQuestionScore: 0,
  fluencyMetrics: {
    responseTime: [],
    topicContinuity: 0,
    interactionQuality: 0,
    averageResponseTime: 0
  },
  answerHistory: [],
  conversationFlow: {
    totalTurns: 0,
    meaningfulTurns: 0,
    topicDepth: 0,
    conceptsCovered: new Set(),
    followUpQuestions: 0,
    clarificationsAsked: 0,
    buildOnPrevious: 0
  }
})

// 面试状态
const interviewState = ref({
  conversationRounds: 0,
  consecutiveUnknownAnswers: 0,
  consecutiveSimilarResponses: 0,
  hasProvidedAnswer: false,
  timeoutWarningShown: false,
  shouldTransitionToNext: false,
  currentQuestionSatisfied: false,
  isPaused: false
})
