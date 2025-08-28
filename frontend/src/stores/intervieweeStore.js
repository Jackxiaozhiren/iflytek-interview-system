/**
 * iFlytek面试系统 - 面试者个性化数据存储
 * 基于Vue 3 Composition API的响应式状态管理
 */

import { ref, reactive, computed, watch } from 'vue'
import { defineStore } from 'pinia'

export const useIntervieweeStore = defineStore('interviewee', () => {
  // 🧑‍💼 面试者基本信息
  const basicInfo = reactive({
    id: 'candidate_001',
    name: '张三',
    email: 'zhangsan@example.com',
    phone: '138****8888',
    avatar: '/images/candidate-avatar.svg',
    position: 'AI算法工程师',
    company: 'iFlytek科大讯飞',
    department: '人工智能研究院',
    experienceLevel: 'senior', // junior, middle, senior, expert
    preferredLanguage: 'zh-CN',
    timezone: 'Asia/Shanghai'
  })

  // 📊 面试进度和状态
  const interviewProgress = reactive({
    currentStage: 'in_progress', // not_started, in_progress, completed, cancelled
    totalQuestions: 10,
    answeredQuestions: 6,
    currentQuestionIndex: 6,
    startTime: new Date('2024-01-15T14:30:00'),
    endTime: null,
    duration: 0, // 分钟
    pausedTime: 0,
    interviewMode: 'text', // text, voice, video, mixed
    lastActiveTime: new Date(),
    sessionId: 'session_20240115_143000'
  })

  // 🎯 技能评估和能力分析
  const skillAssessment = reactive({
    technicalDomain: 'ai', // ai, bigdata, iot, general
    overallScore: 85,
    skillScores: {
      professionalKnowledge: 88,
      skillMatching: 82,
      languageExpression: 87,
      logicalThinking: 83,
      innovationAbility: 77,
      stressResistance: 86,
      communicationSkills: 84,
      problemSolving: 89
    },
    strengthAreas: [
      { skill: '深度学习', score: 92, level: 'expert' },
      { skill: '机器学习算法', score: 89, level: 'senior' },
      { skill: 'Python编程', score: 91, level: 'expert' },
      { skill: '数据分析', score: 85, level: 'senior' }
    ],
    improvementAreas: [
      { skill: '项目管理', score: 65, level: 'middle', priority: 'high' },
      { skill: '团队协作', score: 72, level: 'middle', priority: 'medium' },
      { skill: '英语表达', score: 68, level: 'middle', priority: 'medium' }
    ],
    recommendedLearningPath: []
  })

  // 📈 历史表现和趋势
  const performanceHistory = reactive({
    interviewCount: 3,
    averageScore: 83.5,
    scoreHistory: [
      { date: '2024-01-10', score: 78, domain: 'ai', position: 'AI工程师' },
      { date: '2024-01-12', score: 85, domain: 'ai', position: 'ML工程师' },
      { date: '2024-01-15', score: 87, domain: 'ai', position: 'AI算法工程师' }
    ],
    improvementTrend: 'upward', // upward, stable, downward
    consistencyScore: 0.85,
    bestPerformanceArea: 'technical_knowledge',
    challengingArea: 'communication'
  })

  // 🎭 行为模式和偏好
  const behaviorProfile = reactive({
    responseStyle: 'analytical', // analytical, creative, practical, theoretical
    communicationPattern: 'detailed', // brief, detailed, structured, conversational
    stressLevel: 'low', // low, medium, high
    confidenceLevel: 'high', // low, medium, high
    learningStyle: 'visual', // visual, auditory, kinesthetic, reading
    decisionMaking: 'data_driven', // intuitive, data_driven, collaborative, systematic
    preferredFeedbackType: 'constructive', // direct, constructive, encouraging, detailed
    adaptabilityScore: 0.78
  })

  // 🔄 实时状态
  const realtimeState = reactive({
    isOnline: true,
    currentActivity: 'answering_question',
    lastInteraction: new Date(),
    attentionLevel: 0.85,
    engagementScore: 0.92,
    responseTime: [], // 记录每个问题的回答时间
    hesitationCount: 2,
    clarificationRequests: 1,
    aiHintUsage: 3,
    currentMood: 'focused' // nervous, focused, confident, tired
  })

  // 💡 个性化推荐
  const personalizedRecommendations = reactive({
    nextQuestions: [],
    learningResources: [],
    interviewTips: [],
    skillDevelopmentPlan: [],
    careerSuggestions: [],
    interviewStrategy: 'adaptive' // standard, adaptive, supportive, challenging
  })

  // 📱 计算属性
  const completionRate = computed(() => {
    return Math.round((interviewProgress.answeredQuestions / interviewProgress.totalQuestions) * 100)
  })

  const skillLevel = computed(() => {
    const score = skillAssessment.overallScore
    if (score >= 90) return { level: 'expert', label: '专家级', color: '#52c41a' }
    if (score >= 80) return { level: 'senior', label: '高级', color: '#1890ff' }
    if (score >= 70) return { level: 'middle', label: '中级', color: '#faad14' }
    if (score >= 60) return { level: 'junior', label: '初级', color: '#fa8c16' }
    return { level: 'beginner', label: '入门', color: '#f5222d' }
  })

  const personalizedGreeting = computed(() => {
    const hour = new Date().getHours()
    const timeGreeting = hour < 12 ? '上午好' : hour < 18 ? '下午好' : '晚上好'
    const name = basicInfo.name
    const progress = completionRate.value
    
    if (progress === 0) {
      return `${timeGreeting}，${name}！欢迎参加iFlytek面试，让我们开始这次AI之旅吧！`
    } else if (progress < 50) {
      return `${timeGreeting}，${name}！您已完成${progress}%的面试，表现很棒，继续加油！`
    } else if (progress < 100) {
      return `${timeGreeting}，${name}！您已完成${progress}%的面试，即将进入最后阶段！`
    } else {
      return `${timeGreeting}，${name}！恭喜您完成面试，让我们来看看您的精彩表现！`
    }
  })

  const adaptiveUITheme = computed(() => {
    const domain = skillAssessment.technicalDomain
    const themes = {
      ai: {
        primary: '#667eea',
        secondary: '#764ba2',
        accent: '#f093fb',
        name: 'AI智能主题'
      },
      bigdata: {
        primary: '#4facfe',
        secondary: '#00f2fe',
        accent: '#43e97b',
        name: '大数据主题'
      },
      iot: {
        primary: '#fa709a',
        secondary: '#fee140',
        accent: '#ffecd2',
        name: '物联网主题'
      },
      general: {
        primary: '#1890ff',
        secondary: '#722ed1',
        accent: '#13c2c2',
        name: '通用主题'
      }
    }
    return themes[domain] || themes.general
  })

  // 🔄 状态更新方法
  const updateBasicInfo = (newInfo) => {
    Object.assign(basicInfo, newInfo)
  }

  const updateInterviewProgress = (progress) => {
    Object.assign(interviewProgress, progress)
    realtimeState.lastInteraction = new Date()
  }

  const updateSkillScore = (skill, score) => {
    if (skillAssessment.skillScores[skill] !== undefined) {
      skillAssessment.skillScores[skill] = score
      // 重新计算总分
      const scores = Object.values(skillAssessment.skillScores)
      skillAssessment.overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    }
  }

  const addPerformanceRecord = (record) => {
    performanceHistory.scoreHistory.push(record)
    performanceHistory.interviewCount++
    
    // 更新平均分
    const totalScore = performanceHistory.scoreHistory.reduce((sum, item) => sum + item.score, 0)
    performanceHistory.averageScore = Math.round((totalScore / performanceHistory.scoreHistory.length) * 10) / 10
  }

  const updateRealtimeState = (state) => {
    Object.assign(realtimeState, state)
    realtimeState.lastInteraction = new Date()
  }

  const updateInterviewConfig = (config) => {
    // 更新面试配置参数
    if (config.level) {
      basicInfo.experienceLevel = config.level
    }
    if (config.position) {
      basicInfo.position = config.position
    }
    if (config.difficulty) {
      // 根据难度调整面试参数
      interviewProgress.interviewMode = config.difficulty === 'expert' ? 'mixed' : 'text'
    }
    if (config.evaluationCriteria) {
      // 更新评估标准
      skillAssessment.technicalDomain = config.position || skillAssessment.technicalDomain
    }

    // 更新最后交互时间
    realtimeState.lastInteraction = new Date()

    console.log('面试配置已更新:', config)
  }

  const getLastInterviewSession = () => {
    // 获取最后一次面试会话信息
    return {
      id: interviewProgress.sessionId,
      completed: interviewProgress.currentStage === 'completed',
      progress: completionRate.value,
      startTime: interviewProgress.startTime
    }
  }

  const generatePersonalizedRecommendations = () => {
    // 基于当前表现生成个性化推荐
    const recommendations = {
      nextQuestions: generateAdaptiveQuestions(),
      learningResources: generateLearningResources(),
      interviewTips: generateInterviewTips(),
      skillDevelopmentPlan: generateSkillPlan(),
      careerSuggestions: generateCareerSuggestions()
    }
    
    Object.assign(personalizedRecommendations, recommendations)
  }

  // 🎯 辅助方法
  const generateAdaptiveQuestions = () => {
    const domain = skillAssessment.technicalDomain
    const level = skillLevel.value.level
    const weakAreas = skillAssessment.improvementAreas
    
    // 基于技术领域和能力水平生成适应性问题
    return []
  }

  const generateLearningResources = () => {
    return skillAssessment.improvementAreas.map(area => ({
      skill: area.skill,
      resources: [
        { type: 'course', title: `${area.skill}进阶课程`, provider: 'iFlytek学院' },
        { type: 'practice', title: `${area.skill}实战项目`, provider: 'iFlytek实验室' }
      ]
    }))
  }

  const generateInterviewTips = () => {
    const style = behaviorProfile.responseStyle
    const confidence = behaviorProfile.confidenceLevel
    
    const tips = []
    if (confidence === 'low') {
      tips.push('建议在回答前深呼吸，保持自信的语调')
    }
    if (style === 'theoretical') {
      tips.push('尝试结合具体的项目经验来阐述理论知识')
    }
    
    return tips
  }

  const generateSkillPlan = () => {
    return skillAssessment.improvementAreas.map(area => ({
      skill: area.skill,
      currentLevel: area.level,
      targetLevel: area.level === 'middle' ? 'senior' : 'expert',
      timeline: area.priority === 'high' ? '3个月' : '6个月',
      actions: [`参加${area.skill}培训`, `完成${area.skill}项目实践`]
    }))
  }

  const generateCareerSuggestions = () => {
    const domain = skillAssessment.technicalDomain
    const level = skillLevel.value.level
    
    return [
      { role: `${domain.toUpperCase()}高级工程师`, match: 85, reason: '技术能力匹配度高' },
      { role: `${domain.toUpperCase()}技术专家`, match: 75, reason: '需要提升项目管理能力' }
    ]
  }

  // 🔍 监听器
  watch(() => skillAssessment.overallScore, (newScore) => {
    // 分数变化时更新推荐
    generatePersonalizedRecommendations()
  })

  watch(() => interviewProgress.currentStage, (newStage) => {
    if (newStage === 'completed') {
      addPerformanceRecord({
        date: new Date().toISOString().split('T')[0],
        score: skillAssessment.overallScore,
        domain: skillAssessment.technicalDomain,
        position: basicInfo.position
      })
    }
  })

  return {
    // 状态
    basicInfo,
    interviewProgress,
    skillAssessment,
    performanceHistory,
    behaviorProfile,
    realtimeState,
    personalizedRecommendations,
    
    // 计算属性
    completionRate,
    skillLevel,
    personalizedGreeting,
    adaptiveUITheme,
    
    // 方法
    updateBasicInfo,
    updateInterviewProgress,
    updateSkillScore,
    addPerformanceRecord,
    updateRealtimeState,
    updateInterviewConfig,
    getLastInterviewSession,
    generatePersonalizedRecommendations
  }
})
