<template>
  <div class="text-interview-page text-interview-layout-fixed force-update-20241223">
    <!-- 面试头部信息 -->
    <header class="interview-header">
      <div class="header-container">
        <div class="interview-info">
          <h1 class="interview-title">
            <el-icon class="title-icon"><ChatDotRound /></el-icon>
            iFlytek AI文字面试
          </h1>
          <div class="interview-meta">
            <span class="meta-item">
              <el-icon><User /></el-icon>
              {{ candidateInfo.name }}
            </span>
            <span class="meta-item">
              <el-icon><House /></el-icon>
              {{ candidateInfo.position }}
            </span>
            <span class="meta-item">
              <el-icon><Clock /></el-icon>
              {{ formatTime(elapsedTime) }}
            </span>
          </div>
        </div>
        
        <div class="interview-status">
          <div class="status-item">
            <span class="status-label">题目进度</span>
            <span class="status-value">{{ currentQuestion }}/{{ totalQuestions }}</span>
          </div>
          <div class="status-item">
            <span class="status-label">AI助手</span>
            <span class="status-value">{{ aiAssistanceCount }}次</span>
          </div>
        </div>
      </div>
    </header>

    <!-- 面试主体区域 -->
    <main class="interview-main">
      <div class="interview-container">
        <!-- 左侧：对话区域 -->
        <section class="chat-section">
          <div class="chat-container">
            <!-- 对话历史 -->
            <div class="chat-history" ref="chatHistory">
              <div 
                v-for="(message, index) in chatMessages" 
                :key="index"
                class="message-item"
                :class="message.type"
              >
                <div class="message-avatar">
                  <el-icon v-if="message.type === 'ai'">
                    <Service />
                  </el-icon>
                  <el-icon v-else>
                    <User />
                  </el-icon>
                </div>
                <div class="message-content">
                  <div class="message-header">
                    <span class="sender-name">{{ message.sender }}</span>
                    <span class="message-time">{{ message.time }}</span>
                  </div>
                  <div class="message-text">{{ message.content }}</div>
                </div>
              </div>
            </div>

            <!-- 当前问题显示 -->
            <div class="current-question" v-if="currentQuestionData">
              <div class="question-header">
                <el-icon><Document /></el-icon>
                <span>第 {{ currentQuestion }} 题</span>
                <el-tag type="primary" size="small">{{ questionDifficulty }}</el-tag>
              </div>
              <div class="question-content">
                <h3>{{ currentQuestionData.title }}</h3>
                <p>{{ currentQuestionData.description }}</p>
              </div>
            </div>

            <!-- 输入区域 -->
            <div class="input-area">
              <div class="input-container">
                <el-input
                  v-model="userInput"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入您的回答..."
                  :disabled="isProcessing"
                  @keydown.ctrl.enter="submitAnswer"
                  class="answer-input"
                />
                <div class="input-actions">
                  <div class="input-tips">
                    <span>Ctrl + Enter 发送</span>
                    <span>{{ userInput.length }}/2000</span>
                  </div>
                  <div class="action-buttons">
                    <el-button 
                      size="small" 
                      @click="getAiHint"
                      :disabled="aiAssistanceCount <= 0"
                    >
                      <el-icon><Star /></el-icon>
                      AI提示 ({{ aiAssistanceCount }})
                    </el-button>
                    <el-button 
                      type="primary" 
                      @click="submitAnswer"
                      :loading="isProcessing"
                      :disabled="!userInput.trim()"
                    >
                      <el-icon><Promotion /></el-icon>
                      提交回答
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 右侧：分析和控制区域 -->
        <section class="analysis-section">
          <!-- 实时文本分析 -->
          <div class="text-analysis-panel">
            <h3>
              <el-icon><Grid /></el-icon>
              实时文本分析
            </h3>
            <div class="analysis-content">
              <div class="analysis-item">
                <span class="label">关键词匹配</span>
                <el-progress :percentage="textAnalysis.keywords" color="#1890ff" />
                <span class="score">{{ textAnalysis.keywords }}%</span>
              </div>
              <div class="analysis-item">
                <span class="label">逻辑结构</span>
                <el-progress :percentage="textAnalysis.logic" color="#52c41a" />
                <span class="score">{{ textAnalysis.logic }}%</span>
              </div>
              <div class="analysis-item">
                <span class="label">专业术语</span>
                <el-progress :percentage="textAnalysis.terminology" color="#722ed1" />
                <span class="score">{{ textAnalysis.terminology }}%</span>
              </div>
              <div class="analysis-item">
                <span class="label">回答完整性</span>
                <el-progress :percentage="textAnalysis.completeness" color="#fa8c16" />
                <span class="score">{{ textAnalysis.completeness }}%</span>
              </div>
            </div>
          </div>

          <!-- 实时评分 -->
          <div class="realtime-score">
            <h3>
              <el-icon><TrendCharts /></el-icon>
              实时评分
            </h3>
            <div class="score-display">
              <div class="overall-score">
                <div class="score-circle-container">
                  <el-progress
                    type="circle"
                    :percentage="overallScore"
                    :width="100"
                    :stroke-width="8"
                    color="#1890ff"
                    :show-text="false"
                  />
                  <div class="score-text-overlay">
                    <div class="score-number">{{ overallScore }}</div>
                    <div class="score-unit">分</div>
                  </div>
                </div>
                <span class="score-label">综合评分</span>
              </div>
              <div class="score-breakdown">
                <div class="score-item">
                  <span>技术能力</span>
                  <span class="score">{{ scores.technical }}/100</span>
                </div>
                <div class="score-item">
                  <span>表达能力</span>
                  <span class="score">{{ scores.communication }}/100</span>
                </div>
                <div class="score-item">
                  <span>逻辑思维</span>
                  <span class="score">{{ scores.logic }}/100</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 对话流程统计 -->
          <div class="dialogue-stats">
            <h3>
              <el-icon><Grid /></el-icon>
              对话流程分析
            </h3>
            <div class="stats-content">
              <div class="stats-row">
                <span class="stats-label">累积评分</span>
                <span class="stats-value">{{ dialogueStats.cumulativeScore }}分</span>
              </div>
              <div class="stats-row">
                <span class="stats-label">总轮次</span>
                <span class="stats-value">{{ dialogueStats.totalRounds }}</span>
              </div>
              <div class="stats-row">
                <span class="stats-label">有意义轮次</span>
                <span class="stats-value">{{ dialogueStats.meaningfulRounds }}</span>
              </div>
              <div class="stats-row">
                <span class="stats-label">概念覆盖</span>
                <span class="stats-value">{{ dialogueStats.conceptsCovered }}个</span>
              </div>
              <div class="stats-row">
                <span class="stats-label">深度层级</span>
                <span class="stats-value">{{ dialogueStats.depthLevel }}</span>
              </div>
            </div>
          </div>

          <!-- 面试控制 -->
          <div class="interview-controls">
            <h3>
              <el-icon><Setting /></el-icon>
              面试控制
            </h3>
            <div class="control-buttons">
              <el-button 
                type="primary" 
                @click="nextQuestion"
                :disabled="!canProceed"
                class="control-btn"
              >
                <el-icon><ArrowRight /></el-icon>
                下一题
              </el-button>
              <el-button 
                @click="pauseInterview"
                class="control-btn"
              >
                <el-icon><VideoPause /></el-icon>
                暂停面试
              </el-button>
              <el-button 
                type="danger" 
                @click="endInterview"
                class="control-btn"
              >
                <el-icon><Close /></el-icon>
                结束面试
              </el-button>
            </div>
          </div>


        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import {
  ChatDotRound, User, House, Clock, Service, Document, Star, Promotion, Grid, TrendCharts, Setting, ArrowRight, VideoPause, Close
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import enhancedIflytekSparkService from '../services/enhancedIflytekSparkService.js'

const router = useRouter()

// 响应式数据
const candidateInfo = reactive({
  name: '张三',
  position: 'AI算法工程师'
})

const currentQuestion = ref(1)
const totalQuestions = ref(10)
const elapsedTime = ref(0)
const aiAssistanceCount = ref(3)
const questionDifficulty = ref('中级')
const userInput = ref('')
const isProcessing = ref(false)

const canProceed = ref(false)

const currentQuestionData = reactive({
  title: '请详细说明您在深度学习模型优化方面的实践经验',
  description: '请结合具体项目案例，说明您是如何进行模型优化的，包括使用的技术手段、遇到的挑战以及最终的效果。'
})

// 对话消息
const chatMessages = ref([
  {
    type: 'ai',
    sender: 'iFlytek AI面试官',
    content: '您好！欢迎参加iFlytek AI智能面试。我是您的AI面试官，将通过文字对话的方式与您进行面试。请放松心情，如实回答问题即可。',
    time: '09:00:00'
  },
  {
    type: 'ai',
    sender: 'iFlytek AI面试官',
    content: '现在开始第一题。请仔细阅读问题，并用文字详细回答。如果需要AI提示，可以点击"AI提示"按钮。',
    time: '09:00:15'
  }
])

// 文本分析数据
const textAnalysis = reactive({
  keywords: 75,
  logic: 68,
  terminology: 82,
  completeness: 70
})

// 评分数据
const scores = reactive({
  technical: 78,
  communication: 85,
  logic: 72
})

// 对话流程统计
const dialogueStats = reactive({
  totalRounds: 3,
  meaningfulRounds: 2,
  conceptsCovered: 8,
  depthLevel: 2,
  cumulativeScore: 156
})

const overallScore = computed(() => {
  return Math.round((scores.technical + scores.communication + scores.logic) / 3)
})

// 更新对话统计
const updateDialogueStats = () => {
  dialogueStats.totalRounds = chatMessages.value.filter(msg => msg.type === 'user').length
  dialogueStats.meaningfulRounds = Math.max(1, Math.floor(dialogueStats.totalRounds * 0.8))
  dialogueStats.conceptsCovered = Math.min(15, dialogueStats.totalRounds * 2)
  dialogueStats.depthLevel = Math.min(5, Math.floor(dialogueStats.totalRounds / 2))
  dialogueStats.cumulativeScore = Math.round(overallScore.value * dialogueStats.meaningfulRounds / 10)
}

const chatHistory = ref(null)

// 方法
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const submitAnswer = async () => {
  if (!userInput.value.trim()) return

  isProcessing.value = true

  // 添加用户回答到对话历史
  const userMessage = {
    type: 'user',
    sender: candidateInfo.name,
    content: userInput.value,
    time: new Date().toLocaleTimeString()
  }
  chatMessages.value.push(userMessage)

  // 保存回答内容
  const answer = userInput.value
  userInput.value = ''

  // 滚动到底部
  await nextTick()
  scrollToBottom()

  // 检测回答类型并生成智能回复
  try {
    // 智能分析用户意图
    const userIntent = analyzeUserIntent(answer)
    const isUnknownAnswer = detectUnknownAnswer(answer)

    // 根据用户意图显示不同的思考过程
    let thinkingContent = '🤔 正在分析您的回答...'
    if (userIntent === 'request_answer') {
      thinkingContent = '🤔 我理解您希望了解标准答案，让我为您详细解答...'
    } else if (userIntent === 'request_guidance') {
      thinkingContent = '🤔 我来为您提供一些思考的方向和引导...'
    } else if (userIntent === 'express_unknown') {
      thinkingContent = '🤔 没关系，让我为您提供一些学习的思路...'
    }

    // 显示AI思考过程
    const thinkingMessage = {
      type: 'ai',
      sender: 'iFlytek AI面试官',
      content: thinkingContent,
      time: new Date().toLocaleTimeString(),
      isThinking: true
    }
    chatMessages.value.push(thinkingMessage)
    await nextTick()
    scrollToBottom()

    // 延迟处理，模拟AI思考
    setTimeout(async () => {
      try {
        let aiResponse = ''

        if (isUnknownAnswer) {
          // 为"不知道"类型的回答提供智能引导（已经根据意图差异化处理）
          aiResponse = await generateIntelligentGuidance(answer, currentQuestionData.title)
        } else {
          // 分析技术回答
          analyzeAnswer(answer)
          aiResponse = await generateEnhancedAIResponse(answer, currentQuestionData.title)
        }

        // 更新AI消息
        chatMessages.value[chatMessages.value.length - 1] = {
          type: 'ai',
          sender: 'iFlytek AI面试官',
          content: aiResponse,
          time: new Date().toLocaleTimeString(),
          isThinking: false
        }

        isProcessing.value = false
        canProceed.value = true
        await nextTick()
        scrollToBottom()

      } catch (error) {
        console.error('AI分析失败:', error)

        // 提供备用回复
        chatMessages.value[chatMessages.value.length - 1] = {
          type: 'ai',
          sender: 'iFlytek AI面试官',
          content: '感谢您的回答。让我们继续下一个问题。',
          time: new Date().toLocaleTimeString(),
          isThinking: false
        }

        isProcessing.value = false
        canProceed.value = true
        await nextTick()
        scrollToBottom()
      }
    }, 2000)

  } catch (error) {
    console.error('回答处理失败:', error)
    isProcessing.value = false
    ElMessage.error('回答处理失败，请重试')
  }
}

const analyzeAnswer = (answer) => {
  // 模拟文本分析
  textAnalysis.keywords = Math.min(100, textAnalysis.keywords + Math.random() * 20)
  textAnalysis.logic = Math.min(100, textAnalysis.logic + Math.random() * 15)
  textAnalysis.terminology = Math.min(100, textAnalysis.terminology + Math.random() * 25)
  textAnalysis.completeness = Math.min(100, textAnalysis.completeness + Math.random() * 18)
  
  // 更新评分
  scores.technical = Math.min(100, scores.technical + Math.random() * 10)
  scores.communication = Math.min(100, scores.communication + Math.random() * 12)
  scores.logic = Math.min(100, scores.logic + Math.random() * 8)

  // 更新对话统计
  updateDialogueStats()
}

// 智能分析用户意图
const analyzeUserIntent = (answer) => {
  const answerLower = answer.toLowerCase()

  // 1. 检测明确要求答案的表达
  const requestAnswerPatterns = [
    '请告诉我正确答案', '告诉我答案', '正确答案是什么', '标准答案',
    '请给出答案', '能告诉我', '请直接说', '直接告诉我',
    '答案应该是什么', '请提供答案', '给我答案'
  ]

  // 2. 检测要求引导的表达（扩展和优化）
  const requestGuidancePatterns = [
    '给我一些引导', '可以给我提示', '给我一些思路', '能否指导',
    '给我一些方向', '可以提示一下', '给我一些建议', '能给我启发',
    '我需要引导', '希望得到指导', '可以帮我分析', '得到一些指导',
    '希望得到.*指导', '希望得到.*建议', '给我.*指导', '请给我.*指导',
    '可以指导', '能指导', '指导一下', '建议一下', '提示一下'
  ]

  // 3. 检测一般不知道的表达
  const unknownPatterns = [
    '不知道', '不清楚', '没有经验', '不了解', '不会', '没做过',
    '不太懂', '不确定', '完全不懂', '没有接触过', '不太了解'
  ]

  // 使用正则表达式进行更精确的匹配
  const hasRequestAnswer = requestAnswerPatterns.some(pattern => {
    const regex = new RegExp(pattern, 'i')
    return regex.test(answerLower)
  })

  const hasRequestGuidance = requestGuidancePatterns.some(pattern => {
    const regex = new RegExp(pattern, 'i')
    return regex.test(answerLower)
  })

  const hasUnknownKeywords = unknownPatterns.some(pattern => answerLower.includes(pattern))

  // 优先级判断：明确要求答案 > 要求引导 > 一般不知道
  if (hasRequestAnswer) {
    return 'request_answer'  // 明确要求标准答案
  } else if (hasRequestGuidance) {
    return 'request_guidance'  // 要求思路引导
  } else if (hasUnknownKeywords) {
    // 对于包含"不知道"等词汇的回答，进一步判断
    if (answer.trim().length > 100) {
      // 长回答中包含不知道，可能是部分了解，检查是否有引导需求
      if (hasRequestGuidance) {
        return 'request_guidance'
      } else {
        return 'normal_answer'  // 长回答认为是正常回答
      }
    } else {
      return 'express_unknown'  // 短回答认为是不知道
    }
  } else {
    return 'normal_answer'  // 正常技术回答
  }
}

// 检测"不知道"类型的回答（保持向后兼容）
const detectUnknownAnswer = (answer) => {
  const intent = analyzeUserIntent(answer)
  return intent === 'request_answer' || intent === 'request_guidance' || intent === 'express_unknown'
}

// 生成智能引导（根据用户意图差异化回复）
const generateIntelligentGuidance = async (answer, question) => {
  try {
    // 分析用户意图
    const userIntent = analyzeUserIntent(answer)

    // 构建引导上下文
    const guidanceContext = {
      question: question,
      candidateResponse: answer,
      domain: 'ai',
      guidanceType: userIntent === 'request_answer' ? 'direct_answer' : 'technical_hint'
    }

    // 根据不同意图生成不同类型的回复
    if (userIntent === 'request_answer') {
      // 用户明确要求答案，直接提供详细的技术答案
      return await generateDirectAnswer(question, guidanceContext)
    } else if (userIntent === 'request_guidance') {
      // 用户要求引导，提供思路和方向
      return await generateGuidanceHints(question, guidanceContext)
    } else {
      // 一般性不知道，提供鼓励性引导
      return await generateEncouragingGuidance(question, guidanceContext)
    }

  } catch (error) {
    console.error('智能引导生成失败:', error)
    return generateFallbackResponse(answer)
  }
}

// 生成直接答案（用户明确要求时）
const generateDirectAnswer = async (question, context) => {
  try {
    // 调用AI服务生成详细答案
    const guidance = await enhancedIflytekSparkService.generateRealTimeHint(
      'direct_answer_' + Date.now(),
      { ...context, guidanceType: 'direct_answer' }
    )

    return `好的，我来为您提供这个问题的详细答案：

📋 **标准答案解析**

${guidance.hint || generateQuestionSpecificAnswer(question)}

**关键要点：**
• 核心技术原理和实现方法
• 实际应用场景和最佳实践
• 常见挑战和解决方案
• 性能优化和注意事项

希望这个详细的答案对您有帮助。在实际面试中，建议您结合自己的项目经验来回答会更加出色。`

  } catch (error) {
    console.error('直接答案生成失败:', error)
    return generateQuestionSpecificAnswer(question)
  }
}

// 生成引导提示（用户要求引导时）
const generateGuidanceHints = async (question, context) => {
  try {
    const guidance = await enhancedIflytekSparkService.generateRealTimeHint(
      'guidance_hints_' + Date.now(),
      { ...context, guidanceType: 'guidance_hints' }
    )

    return `当然可以！让我为您提供一些思考的方向和引导：

🧭 **思考引导**

💡 ${guidance.hint || '建议从基本概念开始，逐步深入到具体实现'}

**可以从这些角度思考：**
• **基础概念**：这个技术的核心原理是什么？
• **技术实现**：通常采用什么方法或工具来实现？
• **应用场景**：在什么情况下会使用这个技术？
• **优势特点**：相比其他方案有什么优势？

**回答建议：**
即使不完全了解，也可以分享您听说过的相关概念，或者表达您的学习思路。面试官更看重您的思考过程和学习能力。`

  } catch (error) {
    console.error('引导提示生成失败:', error)
    return `让我为您提供一些思考的方向：

🧭 **思考引导**

您可以从以下角度来分析这个问题：
• 基本概念和定义
• 技术实现方法
• 实际应用场景
• 相关工具和框架

不用担心答案不够完美，重要的是展现您的思考过程。`
  }
}

// 生成鼓励性引导（一般性不知道时）
const generateEncouragingGuidance = async (question, context) => {
  try {
    const guidance = await enhancedIflytekSparkService.generateRealTimeHint(
      'encouraging_guidance_' + Date.now(),
      context
    )

    return `没关系，诚实地表达不了解是很好的态度！让我为您提供一些思路：

💡 **学习提示**

${guidance.hint || '这个问题涉及的核心概念包括技术原理、实现方法和应用场景'}

**您可以尝试：**
• 分享您在相关领域的任何了解，哪怕是基础概念
• 表达您对这个技术的学习兴趣和计划
• 谈谈您认为可能的解决思路
• 提及您在类似场景中的经验

**记住：** 面试不仅是考察现有知识，更重要的是看到您的学习能力和思考方式。诚实和积极的学习态度往往比强行回答更有价值。`

  } catch (error) {
    console.error('鼓励性引导生成失败:', error)
    return `没关系，诚实地表达不了解是很好的态度！

💡 这个问题涉及的核心概念包括技术原理、实现方法和应用场景。

您可以尝试从以下角度思考：
• 分享您在相关领域的任何了解
• 表达您对这个技术的学习兴趣
• 谈谈您认为可能的解决思路

面试不仅是考察现有知识，更重要的是看到您的学习能力和思考方式。`
  }
}

// 生成问题特定的答案
const generateQuestionSpecificAnswer = (question) => {
  const questionLower = question.toLowerCase()

  // 深度学习模型优化相关问题
  if (questionLower.includes('深度学习') && questionLower.includes('优化')) {
    return `**深度学习模型优化的标准答案：**

**1. 模型架构优化**
• **量化技术**：INT8/FP16量化减少模型大小和推理时间
• **模型剪枝**：移除不重要的连接和神经元
• **知识蒸馏**：用大模型训练小模型，保持性能的同时减少计算量

**2. 训练优化**
• **混合精度训练**：使用FP16加速训练，关键部分保持FP32
• **梯度累积**：在有限显存下模拟大批次训练
• **学习率调度**：余弦退火、warmup等策略

**3. 推理优化**
• **批处理优化**：动态批处理和KV-Cache管理
• **算子融合**：CUDA kernel融合减少访存开销
• **投机解码**：使用小模型预测，大模型验证

**4. 系统级优化**
• **显存管理**：PagedAttention、梯度检查点
• **并行策略**：数据并行、模型并行、流水线并行
• **缓存优化**：KV-Cache、计算图优化

**实际案例：**
以67B MoE模型为例，通过8-bit量化+投机解码+动态批调度，可将首token延迟从600ms降至200ms以下，吞吐从4 QPS提升至15+ QPS。`
  }

  // 机器学习相关问题
  if (questionLower.includes('机器学习')) {
    return `**机器学习核心概念标准答案：**

**1. 基本概念**
• **监督学习**：有标签数据训练，如分类、回归
• **无监督学习**：无标签数据，如聚类、降维
• **强化学习**：通过奖励信号学习最优策略

**2. 核心算法**
• **线性模型**：线性回归、逻辑回归、SVM
• **树模型**：决策树、随机森林、GBDT、XGBoost
• **神经网络**：MLP、CNN、RNN、Transformer

**3. 模型评估**
• **评估指标**：准确率、精确率、召回率、F1-score、AUC
• **交叉验证**：k-fold、留一法、时间序列分割
• **过拟合防止**：正则化、Dropout、早停

**4. 特征工程**
• **特征选择**：过滤法、包装法、嵌入法
• **特征变换**：标准化、归一化、PCA、特征组合
• **处理缺失值**：删除、填充、插值

**5. 实际应用**
• **数据预处理**：清洗、采样、平衡
• **模型选择**：网格搜索、贝叶斯优化
• **部署监控**：A/B测试、模型漂移检测`
  }

  // 通用技术问题
  return `**技术问题标准解答框架：**

**1. 问题理解**
• 明确问题的核心要求和约束条件
• 分析问题的技术背景和应用场景

**2. 技术方案**
• 核心技术原理和实现方法
• 相关工具、框架和最佳实践
• 方案的优势和适用场景

**3. 实现细节**
• 具体的技术实现步骤
• 关键的配置和参数设置
• 常见的坑点和注意事项

**4. 性能优化**
• 性能瓶颈分析和优化策略
• 监控指标和评估方法
• 扩展性和可维护性考虑

**5. 实际经验**
• 项目中的具体应用案例
• 遇到的挑战和解决方案
• 经验总结和改进建议`
}

// 生成备用回复
const generateFallbackResponse = (answer) => {
  const userIntent = analyzeUserIntent(answer)

  if (userIntent === 'request_answer') {
    return `好的，我理解您希望了解这个问题的标准答案。让我为您提供详细的技术解答：

📋 **核心技术要点**

这个问题涉及的关键技术包括：
• 基础理论和核心概念
• 主流的实现方法和工具
• 实际应用中的最佳实践
• 性能优化和注意事项

**建议：** 在实际面试中，您可以结合自己的项目经验来回答，即使理论知识有限，实践经验也是很有价值的。`
  } else if (userIntent === 'request_guidance') {
    return `当然可以为您提供思考的方向！

🧭 **思考引导**

您可以从这些角度来分析：
• **是什么**：基本概念和定义
• **为什么**：解决什么问题，有什么优势
• **怎么做**：具体的实现方法和步骤
• **用在哪**：实际的应用场景和案例

**提示：** 即使不完全了解，也可以分享您的思考过程和学习计划，这同样能展现您的能力。`
  } else {
    return `没关系，诚实地表达不了解是很好的态度！

💡 **学习建议**

• 可以分享您在相关领域的任何了解
• 表达您对这个技术的学习兴趣
• 谈谈您认为可能的解决思路
• 提及您的学习计划和方向

**记住：** 面试官更看重您的学习能力和思考方式，诚实和积极的态度往往比强行回答更有价值。`
  }
}

// 生成增强的AI回复
const generateEnhancedAIResponse = async (answer, question) => {
  try {
    // 分析回答质量
    const hasKeywords = /算法|模型|数据|技术|系统|架构|优化|性能/.test(answer)
    const isDetailed = answer.length > 100
    const hasTechnicalTerms = /API|框架|库|工具|平台|服务|接口/.test(answer)

    let response = ''

    if (hasKeywords && isDetailed && hasTechnicalTerms) {
      response = `很棒的回答！您展现了扎实的技术功底。我特别注意到您提到的技术细节很准确。

让我们深入探讨一下：您在实际项目中是如何应用这些技术的？遇到过什么挑战，又是如何解决的？`

    } else if (hasKeywords && isDetailed) {
      response = `您的回答有一定的技术深度，思路也比较清晰。

为了更好地了解您的实践能力，能否详细说明一下具体的技术实现细节？比如使用了哪些工具或框架？`

    } else if (hasKeywords) {
      response = `感谢您的回答。我看到您对这个问题有一定的理解。

能否举个具体的例子来说明？或者分享一下您在相关项目中的实际经验？`

    } else {
      response = `感谢您的分享。您的回答展现了一定的思考过程。

建议您可以从技术原理、实现方法和应用场景等角度来进一步完善回答。`
    }

    return response

  } catch (error) {
    console.error('AI回复生成失败:', error)
    return '感谢您的回答。让我们继续下一个问题。'
  }
}

const generateAIResponse = () => {
  const responses = [
    '您的回答很详细，展现了扎实的技术基础。请继续保持这种深度的思考。',
    '回答中提到的技术点很准确，建议可以结合更多实际应用场景来说明。',
    '逻辑清晰，表达流畅。如果能补充一些具体的数据或效果会更好。',
    '很好的回答！您对这个领域的理解很深入。'
  ]

  const aiMessage = {
    type: 'ai',
    sender: 'iFlytek AI面试官',
    content: responses[Math.floor(Math.random() * responses.length)],
    time: new Date().toLocaleTimeString()
  }

  chatMessages.value.push(aiMessage)
  nextTick(() => scrollToBottom())
}

const scrollToBottom = () => {
  if (chatHistory.value) {
    chatHistory.value.scrollTop = chatHistory.value.scrollHeight
  }
}

const getAiHint = async () => {
  if (aiAssistanceCount.value <= 0) {
    ElMessage.warning('AI提示次数已用完')
    return
  }

  try {
    // 显示加载状态
    const loadingMessage = {
      type: 'ai',
      sender: 'iFlytek AI助手',
      content: '🤔 正在分析您的问题，生成智能提示...',
      time: new Date().toLocaleTimeString(),
      isLoading: true
    }
    chatMessages.value.push(loadingMessage)
    nextTick(() => scrollToBottom())

    // 构建上下文信息
    const context = {
      question: currentQuestionData.title,
      candidateResponse: userInput.value || '候选人请求提示',
      questionNumber: currentQuestion.value,
      domain: 'ai',
      difficulty: questionDifficulty.value
    }

    // 调用增强的AI提示服务
    const hintResponse = await enhancedIflytekSparkService.generateRealTimeHint(
      'text_interview_' + Date.now(),
      context
    )

    // 移除加载消息
    chatMessages.value.pop()

    // 添加智能提示消息
    const hintMessage = {
      type: 'ai',
      sender: 'iFlytek AI助手',
      content: `💡 智能提示：${hintResponse.hint || '建议从技术实现、项目经验和解决方案等角度来回答'}`,
      time: new Date().toLocaleTimeString(),
      hintType: hintResponse.type || 'general'
    }

    chatMessages.value.push(hintMessage)
    aiAssistanceCount.value--

    ElMessage.success('AI智能提示已生成')
    nextTick(() => scrollToBottom())

  } catch (error) {
    console.error('AI提示生成失败:', error)

    // 移除加载消息
    if (chatMessages.value[chatMessages.value.length - 1]?.isLoading) {
      chatMessages.value.pop()
    }

    // 提供备用提示
    const fallbackHints = [
      '建议从技术原理、实际应用和项目经验三个维度来回答',
      '可以结合具体的技术栈和工具来说明您的实践经验',
      '尝试分享遇到的技术挑战和您的解决思路',
      '可以提到相关的最佳实践和优化策略'
    ]

    const hintMessage = {
      type: 'ai',
      sender: 'iFlytek AI助手',
      content: `💡 ${fallbackHints[Math.floor(Math.random() * fallbackHints.length)]}`,
      time: new Date().toLocaleTimeString()
    }

    chatMessages.value.push(hintMessage)
    aiAssistanceCount.value--

    ElMessage.info('已提供备用提示')
    nextTick(() => scrollToBottom())
  }
}

const nextQuestion = () => {
  if (currentQuestion.value < totalQuestions.value) {
    currentQuestion.value++
    canProceed.value = false
    
    // 生成新问题
    const questions = [
      {
        title: '请描述您对机器学习算法的理解和应用经验',
        description: '请选择您最熟悉的2-3种机器学习算法，说明其原理、适用场景和您的实际应用经验。'
      },
      {
        title: '如何处理大规模数据的机器学习训练？',
        description: '请从数据预处理、分布式训练、内存优化等角度说明您的解决方案。'
      }
    ]
    
    const newQuestion = questions[Math.floor(Math.random() * questions.length)]
    currentQuestionData.title = newQuestion.title
    currentQuestionData.description = newQuestion.description
    
    // AI提出新问题
    const questionMessage = {
      type: 'ai',
      sender: 'iFlytek AI面试官',
      content: `现在进入第${currentQuestion.value}题：${newQuestion.title}`,
      time: new Date().toLocaleTimeString()
    }
    
    chatMessages.value.push(questionMessage)
    nextTick(() => scrollToBottom())
  }
}

const pauseInterview = () => {
  ElMessage.info('面试已暂停')
}

const endInterview = () => {
  router.push('/interview-result')
}



// 生命周期
onMounted(() => {
  // 启动计时器
  setInterval(() => {
    elapsedTime.value++
  }, 1000)
  
  // 初始化分析数据
  textAnalysis.keywords = 75
  textAnalysis.logic = 68
  textAnalysis.terminology = 82
  textAnalysis.completeness = 70
  
  scores.technical = 78
  scores.communication = 85
  scores.logic = 72
})
</script>

<style scoped>
/* 引入布局修复样式 */
@import '@/styles/text-interview-layout-fix.css';

/* 紧急布局修复 - 解决拥挤问题 - 强制更新 */
.text-interview-layout-fixed,
.force-update-20241223 {
  min-height: 100vh !important;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
  display: flex !important;
  flex-direction: column !important;
  overflow-x: hidden !important;
  width: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
}

.text-interview-layout-fixed .interview-header {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  padding: 12px 0;
  border-bottom: 1px solid rgba(24, 144, 255, 0.1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 100;
  flex-shrink: 0;
}

.text-interview-layout-fixed .header-container {
  max-width: 1800px !important;
  margin: 0 auto !important;
  padding: 0 80px !important;
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  gap: 40px !important;
  min-height: 80px !important;
}

.text-interview-layout-fixed .interview-main {
  flex: 1 !important;
  padding: 40px 0 !important;
  overflow-y: auto !important;
  min-height: calc(100vh - 120px) !important;
}

.text-interview-layout-fixed .interview-container {
  max-width: none !important;
  width: 100% !important;
  margin: 0 !important;
  padding: 0 100px !important;
  display: flex !important;
  flex-direction: row !important;
  gap: 120px !important;
  min-height: calc(100vh - 100px) !important;
  align-items: flex-start !important;
  box-sizing: border-box !important;
}

.text-interview-layout-fixed .chat-section {
  background: rgba(255, 255, 255, 0.98) !important;
  border-radius: 20px !important;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.1) !important;
  border: 1px solid rgba(24, 144, 255, 0.1) !important;
  overflow: hidden !important;
  height: auto !important;
  min-height: 700px !important;
  max-height: none !important;
  display: flex !important;
  flex-direction: column !important;
  margin-bottom: 40px !important;
  flex: 2 !important;
  width: auto !important;
}

.text-interview-layout-fixed .chat-history {
  flex: 1 !important;
  padding: 30px !important;
  overflow-y: auto !important;
  background: #f8f9fa !important;
  border-bottom: 1px solid #e9ecef !important;
  min-height: 350px !important;
  max-height: none !important;
  height: auto !important;
}

.text-interview-layout-fixed .analysis-section {
  display: flex !important;
  flex-direction: column !important;
  gap: 50px !important;
  overflow-y: auto !important;
  max-height: none !important;
  height: auto !important;
  padding: 30px !important;
  flex: 1 !important;
  min-width: 400px !important;
}

.text-interview-layout-fixed .text-analysis-panel,
.text-interview-layout-fixed .realtime-score,
.text-interview-layout-fixed .interview-controls,
.text-interview-layout-fixed .dialogue-stats {
  background: rgba(255, 255, 255, 0.98) !important;
  border-radius: 20px !important;
  padding: 35px !important;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.1) !important;
  border: 1px solid rgba(24, 144, 255, 0.1) !important;
  min-height: 220px !important;
  max-height: none !important;
  overflow-y: auto !important;
  margin-bottom: 20px !important;
  width: 100% !important;
}

/* 响应式优化 */
@media (max-width: 1400px) {
  .text-interview-layout-fixed .interview-container {
    flex-direction: column !important;
    gap: 40px !important;
    padding: 0 40px !important;
  }

  .text-interview-layout-fixed .analysis-section {
    display: grid !important;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)) !important;
    gap: 30px !important;
    max-height: none !important;
  }

  .text-interview-layout-fixed .chat-section {
    min-height: 600px !important;
    max-height: none !important;
    flex: none !important;
  }
}

@media (max-width: 768px) {
  .text-interview-layout-fixed .header-container {
    flex-direction: column;
    gap: 16px;
    padding: 0 16px;
    min-height: auto;
  }

  .text-interview-layout-fixed .interview-container {
    padding: 0 16px;
    gap: 16px;
  }

  .text-interview-layout-fixed .analysis-section {
    grid-template-columns: 1fr;
  }
}

.text-interview-layout-fixed .chat-section {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(24, 144, 255, 0.1);
  overflow: hidden;
  min-height: 600px;
  max-height: 700px;
  display: flex;
  flex-direction: column;
}

.text-interview-layout-fixed .chat-history {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  min-height: 400px;
  max-height: 500px;
}

.text-interview-layout-fixed .analysis-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
  max-height: calc(100vh - 200px);
  padding: 0;
}

.text-interview-layout-fixed .text-analysis-panel,
.text-interview-layout-fixed .realtime-score,
.text-interview-layout-fixed .interview-controls {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(24, 144, 255, 0.1);
  min-height: 200px;
  max-height: 300px;
  overflow-y: auto;
}

/* 响应式优化 */
@media (max-width: 1200px) {
  .text-interview-layout-fixed .interview-container {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 0 20px;
  }

  .text-interview-layout-fixed .analysis-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    max-height: none;
  }
}

/* 对话统计样式 */
.dialogue-stats {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(24, 144, 255, 0.1);
  min-height: 200px;
  max-height: 300px;
  overflow-y: auto;
}

.dialogue-stats h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #1890ff;
  display: flex;
  align-items: center;
  gap: 8px;
}

.stats-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stats-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: rgba(24, 144, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(24, 144, 255, 0.1);
}

.stats-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.stats-value {
  font-size: 14px;
  font-weight: 600;
  color: #1890ff;
}

/* 强制宽松布局 - 最高优先级 */
.force-update-20241223 .interview-container {
  max-width: none !important;
  width: 100% !important;
  margin: 0 !important;
  padding: 50px !important;
  display: block !important;
  min-height: calc(100vh - 100px) !important;
  box-sizing: border-box !important;
}

.force-update-20241223 .interview-container > * {
  margin-bottom: 50px !important;
  width: 100% !important;
  display: block !important;
}

.force-update-20241223 .chat-section {
  background: rgba(255, 255, 255, 0.98) !important;
  border-radius: 20px !important;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.1) !important;
  border: 1px solid rgba(24, 144, 255, 0.1) !important;
  overflow: hidden !important;
  height: auto !important;
  min-height: 600px !important;
  max-height: none !important;
  display: flex !important;
  flex-direction: column !important;
  margin-bottom: 50px !important;
  width: 100% !important;
  position: relative !important;
  z-index: 1 !important;
}

.force-update-20241223 .analysis-section {
  display: grid !important;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)) !important;
  gap: 40px !important;
  overflow-y: visible !important;
  max-height: none !important;
  height: auto !important;
  padding: 30px !important;
  width: 100% !important;
  position: relative !important;
  z-index: 2 !important;
}

.force-update-20241223 .text-analysis-panel,
.force-update-20241223 .realtime-score,
.force-update-20241223 .interview-controls,
.force-update-20241223 .dialogue-stats {
  background: rgba(255, 255, 255, 0.98) !important;
  border-radius: 20px !important;
  padding: 30px !important;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.1) !important;
  border: 1px solid rgba(24, 144, 255, 0.1) !important;
  min-height: 200px !important;
  max-height: none !important;
  overflow-y: visible !important;
  margin-bottom: 0 !important;
  width: 100% !important;
  position: relative !important;
  z-index: 3 !important;
}

/* 彻底重置布局 - 防止重叠 */
.force-update-20241223 * {
  position: static !important;
  float: none !important;
  clear: both !important;
}

.force-update-20241223 .interview-main {
  display: block !important;
  width: 100% !important;
  padding: 30px !important;
}

.force-update-20241223 .interview-main > * {
  display: block !important;
  width: 100% !important;
  margin-bottom: 40px !important;
  position: relative !important;
}

/* iFlytek 品牌色彩变量 */
.text-interview-page {
  --iflytek-primary: #1890ff;
  --iflytek-secondary: #667eea;
  --iflytek-accent: #764ba2;
  --iflytek-success: #52c41a;
  --iflytek-warning: #faad14;
  --iflytek-error: #ff4d4f;
  --text-primary: #333333;
  --text-secondary: #666666;
  --text-light: #999999;
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --bg-chat: #f5f7fa;
  --border-color: #e8e8e8;
  --border-light: #f0f0f0;
  --shadow-light: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-medium: 0 4px 16px rgba(0, 0, 0, 0.15);
  --radius-small: 6px;
  --radius-medium: 8px;
  --radius-large: 12px;
}

/* 页面主容器 */
.text-interview-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
  display: flex;
  flex-direction: column;
}

/* 头部样式 - 优化布局间距 */
.interview-header {
  background: rgba(255, 255, 255, 0.95);
  color: var(--text-primary);
  padding: 16px 0;
  border-bottom: 1px solid var(--border-light);
  flex-shrink: 0;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  gap: 24px;
  min-height: 64px;
}

.interview-info {
  flex: 1;
}

.interview-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text-primary);
}

.title-icon {
  font-size: 28px;
  color: var(--iflytek-primary);
}

.interview-meta {
  display: flex;
  gap: 24px;
  font-size: 14px;
  color: var(--text-secondary);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: var(--bg-primary);
  border-radius: var(--radius-small);
  border: 1px solid var(--border-light);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.meta-item:hover {
  border-color: var(--iflytek-primary);
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
}

.meta-item .el-icon {
  color: var(--iflytek-primary);
  font-size: 16px;
}

.interview-status {
  display: flex;
  gap: 16px;
}

.status-item {
  text-align: center;
  padding: 12px 20px;
  background: var(--bg-primary);
  border-radius: var(--radius-medium);
  border: 1px solid var(--border-light);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  min-width: 100px;
  transition: all 0.3s ease;
}

.status-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  border-color: var(--iflytek-primary);
}

.status-label {
  display: block;
  font-size: 12px;
  color: var(--text-light);
  margin-bottom: 6px;
  font-weight: 500;
}

.status-value {
  display: block;
  font-size: 18px;
  font-weight: 700;
  color: var(--iflytek-primary);
}

/* 主体区域 - 修复重叠问题 */
.interview-main {
  flex: 1;
  padding: 20px 0;
  overflow-y: auto;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: calc(100vh - 120px);
}

.interview-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 32px;
  min-height: calc(100vh - 140px);
  align-items: start;
  grid-template-rows: minmax(0, 1fr);
}

/* 对话区域 - 修复高度重叠问题 */
.chat-section {
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(24, 144, 255, 0.1);
  overflow: hidden;
  height: calc(100vh - 200px);
  min-height: 500px;
  max-height: 700px;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

/* 对话历史 - 修复空间分配 */
.chat-history {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background: #f8f9fa;
  border-bottom: 1px solid var(--border-light);
  min-height: 300px;
  max-height: none;
}

.message-item {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  align-items: flex-start;
}

.message-item:last-child {
  margin-bottom: 0;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 18px;
  color: white;
}

.message-item.ai .message-avatar {
  background: linear-gradient(135deg, var(--iflytek-primary), var(--iflytek-secondary));
}

.message-item.user .message-avatar {
  background: linear-gradient(135deg, var(--iflytek-success), #73d13d);
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.sender-name {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 14px;
}

.message-time {
  font-size: 12px;
  color: var(--text-light);
}

.message-text {
  background: white;
  padding: 12px 16px;
  border-radius: var(--radius-medium);
  border: 1px solid var(--border-light);
  line-height: 1.6;
  color: var(--text-primary);
  font-size: 14px;
  word-wrap: break-word;
}

.message-item.ai .message-text {
  background: linear-gradient(135deg, #e6f7ff, #f0f9ff);
  border-color: rgba(24, 144, 255, 0.2);
}

.message-item.user .message-text {
  background: linear-gradient(135deg, #f6ffed, #fcffe6);
  border-color: rgba(82, 196, 26, 0.2);
}

/* 当前问题 - 优化间距 */
.current-question {
  padding: 16px 20px;
  background: white;
  border-bottom: 1px solid var(--border-light);
  flex-shrink: 0;
}

.question-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 14px;
  color: var(--text-secondary);
}

.question-content h3 {
  margin: 0 0 8px 0;
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
}

.question-content p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.6;
}

/* 输入区域 - 优化高度设置 */
.input-area {
  padding: 20px !important;
  background: white !important;
  border-top: 1px solid var(--border-light) !important;
  min-height: 160px !important;
  max-height: 200px !important;
  flex-shrink: 0 !important;
}

.input-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.answer-input {
  font-size: 14px;
}

.answer-input :deep(.el-textarea__inner) {
  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
  line-height: 1.6;
  resize: none;
}

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.input-tips {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: var(--text-light);
}

.action-buttons {
  display: flex;
  gap: 8px;
}

/* 分析区域 - 修复重叠问题 */
.analysis-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
  max-height: calc(100vh - 200px);
  padding: 0;
}

.text-analysis-panel,
.realtime-score,
.interview-controls,
.dialogue-stats {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(24, 144, 255, 0.1);
  min-height: 180px;
  max-height: 280px;
  overflow-y: auto;
  flex-shrink: 0;
}

.text-analysis-panel h3,
.realtime-score h3,
.interview-controls h3 {
  margin: 0 0 16px 0;
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 文本分析 */
.analysis-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.analysis-item {
  display: grid;
  grid-template-columns: 80px 1fr 50px;
  gap: 12px;
  align-items: center;
}

.analysis-item .label {
  font-size: 12px;
  color: var(--text-secondary);
}

.analysis-item .score {
  font-size: 12px;
  font-weight: 600;
  color: var(--iflytek-primary);
  text-align: right;
}

/* 实时评分 */
.score-display {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.overall-score {
  text-align: center;
}

.score-circle-container {
  position: relative;
  display: inline-block;
  margin-bottom: 12px;
}

.score-text-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.score-number {
  font-size: 24px;
  font-weight: 700;
  color: var(--iflytek-primary);
  line-height: 1;
  margin-bottom: 2px;
}

.score-unit {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  line-height: 1;
}

.score-label {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  color: var(--text-secondary);
}

.score-breakdown {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.score-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.score-item span:first-child {
  color: var(--text-secondary);
}

.score-item .score {
  color: var(--iflytek-primary);
  font-weight: 600;
}

/* 控制按钮 */
.control-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-btn {
  width: 100%;
  justify-content: flex-start;
}



/* 响应式设计 */
@media (max-width: 1200px) {
  .interview-container {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 0 20px;
  }

  .analysis-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
    max-height: none;
    padding: 0;
  }

  .chat-section {
    min-height: 500px;
    max-height: 650px;
  }

  .text-analysis-panel,
  .realtime-score,
  .interview-controls,
  .dialogue-stats {
    min-height: 160px;
    max-height: 240px;
  }
}

@media (max-width: 768px) {
  .interview-header {
    padding: 12px 0;
  }

  .header-container {
    flex-direction: column;
    gap: 16px;
    text-align: center;
    padding: 0 16px;
  }

  .interview-info {
    order: 1;
  }

  .interview-status {
    order: 2;
    justify-content: center;
    gap: 12px;
  }

  .interview-meta {
    justify-content: center;
    flex-wrap: wrap;
    gap: 10px;
  }

  .meta-item {
    padding: 6px 10px;
    font-size: 12px;
  }

  .status-item {
    padding: 8px 12px;
    min-width: 70px;
  }

  .status-value {
    font-size: 14px;
  }

  .interview-container {
    padding: 0 16px;
    gap: 20px;
    grid-template-columns: 1fr;
    min-height: calc(100vh - 160px);
  }

  .chat-section {
    min-height: 400px;
    max-height: 500px;
  }

  .analysis-section {
    grid-template-columns: 1fr;
    gap: 16px;
    max-height: none;
  }

  .text-analysis-panel,
  .realtime-score,
  .interview-controls,
  .dialogue-stats {
    min-height: 140px;
    max-height: 200px;
    padding: 16px;
  }

  .input-actions {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .action-buttons {
    justify-content: center;
    gap: 12px;
  }
}

/* 滚动条样式 */
.chat-history::-webkit-scrollbar {
  width: 6px;
}

.chat-history::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.chat-history::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.chat-history::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
