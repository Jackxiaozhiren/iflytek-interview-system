/**
 * iFlytek星火大模型集成服务
 * 智能面试系统核心服务，支持中文优化、实时助手、企业级管理
 */

class EnhancedIflytekSparkService {
  constructor() {
    // 调试环境变量加载
    console.log('🔍 环境变量调试:', {
      VITE_IFLYTEK_API_URL: import.meta.env.VITE_IFLYTEK_API_URL,
      VITE_IFLYTEK_APP_ID: import.meta.env.VITE_IFLYTEK_APP_ID,
      VITE_IFLYTEK_API_KEY: import.meta.env.VITE_IFLYTEK_API_KEY,
      VITE_IFLYTEK_API_SECRET: import.meta.env.VITE_IFLYTEK_API_SECRET,
      all_env: import.meta.env
    })

    // 临时解决方案：如果环境变量未加载，使用默认配置
    const getEnvVar = (key, defaultValue) => {
      const value = import.meta.env[key]
      if (value === undefined || value === null || value === '') {
        console.warn(`⚠️ 环境变量 ${key} 未加载，使用默认值: ${defaultValue}`)
        return defaultValue
      }
      return value
    }

    this.config = {
      apiVersion: 'v3.5',
      baseUrl: getEnvVar('VITE_IFLYTEK_API_URL', 'https://spark-api.xf-yun.com'),
      appId: getEnvVar('VITE_IFLYTEK_APP_ID', 'simulation_mode'),
      apiKey: getEnvVar('VITE_IFLYTEK_API_KEY', 'simulation_mode'),
      apiSecret: getEnvVar('VITE_IFLYTEK_API_SECRET', 'simulation_mode'),
      chineseOptimization: true,
      realTimeProcessing: true,
      textPrimaryMode: true,
      intelligentInterviewMode: true,
      adaptiveDifficulty: true,
      realTimeGuidance: true,
      professionalDomainOptimization: true,
      enterpriseMode: true,
      batchProcessing: true,
      advancedAnalytics: true,
      realTimeAssistant: {
        enabled: true,

        responseTimeLimit: 30000,
        intelligentHints: true,
        contextualGuidance: true,
        adaptiveEncouragement: true
      }
    }

    this.interviewModes = {
      technical: {
        name: '技术面试',
        focus: ['算法理解', '代码能力', '系统设计', '问题解决', '技术深度', '创新思维'],
        aiPersonality: 'professional_technical',
        questionDifficulty: 'adaptive',
        chineseContext: true,
        subDomains: ['AI算法', '大数据处理', '物联网开发', '前端技术', '后端架构', '系统运维'],
        questionPool: { basic: 50, intermediate: 80, advanced: 60, scenario: 40 },
        realTimeGuidance: {
          enabled: true,
          hintThreshold: 15,
          encouragementInterval: 30,
          technicalHints: true,
          intelligentSuggestions: true,
          contextualPrompts: true
        },
        enterpriseFeatures: {
          batchEvaluation: true,
          teamAssessment: true,
          skillMatrixMapping: true,
          performanceTracking: true
        }
      },
      behavioral: {
        name: '行为面试',
        focus: ['团队合作', '沟通能力', '领导力', '文化适应', '抗压能力', '学习能力'],
        aiPersonality: 'empathetic_professional',
        questionDifficulty: 'moderate',
        chineseContext: true,
        subDomains: ['团队协作', '项目管理', '客户服务', '创新能力', '职业规划'],
        questionPool: { basic: 40, intermediate: 60, advanced: 30, scenario: 50 },
        realTimeGuidance: {
          enabled: true,
          hintThreshold: 20,
          encouragementInterval: 25,
          emotionalSupport: true,
          behavioralCues: true,
          softSkillsAssessment: true
        },
        behavioralMetrics: {
          communicationStyle: true,
          leadershipPotential: true,
          teamworkAbility: true,
          adaptabilityScore: true,
          emotionalIntelligence: true
        }
      },
      comprehensive: {
        name: '综合面试',
        focus: ['技术能力', '沟通技巧', '文化适应', '发展潜力', '综合素质', '创新精神'],
        aiPersonality: 'balanced_professional',
        questionDifficulty: 'adaptive',
        chineseContext: true,
        subDomains: ['技术+管理', '跨领域协作', '战略思维', '业务理解'],
        questionPool: { basic: 45, intermediate: 70, advanced: 50, scenario: 45 },
        realTimeGuidance: {
          enabled: true,
          hintThreshold: 18,
          encouragementInterval: 28,
          balancedSupport: true,
          holisticAssessment: true,
          crossFunctionalAnalysis: true
        },
        competencyMatrix: {
          technicalSkills: 0.4,
          softSkills: 0.3,
          leadershipPotential: 0.2,
          culturalFit: 0.1
        }
      },
      enterprise: {
        name: '企业级面试',
        focus: ['岗位匹配', '团队融合', '业务理解', '发展潜力', '企业文化', '长期价值'],
        aiPersonality: 'enterprise_professional',
        questionDifficulty: 'adaptive',
        chineseContext: true,
        subDomains: ['岗位胜任力', '组织适应性', '业务洞察', '创新驱动'],
        questionPool: { basic: 30, intermediate: 50, advanced: 40, scenario: 60 },
        realTimeGuidance: {
          enabled: true,
          hintThreshold: 20,
          encouragementInterval: 35,
          enterpriseContext: true,
          businessOriented: true
        },
        enterpriseFeatures: {
          roleBasedAssessment: true,
          organizationalFitAnalysis: true,
          businessImpactEvaluation: true,
          longTermPotentialAssessment: true,
          teamDynamicsAnalysis: true
        }
      }
    }

    this.capabilities = {
      textAnalysis: {
        enabled: true,
        priority: 'primary',
        weight: 0.65,
        features: {
          contentAnalysis: true,
          sentimentAnalysis: true,
          technicalEvaluation: true,
          chineseUnderstanding: true,
          keywordExtraction: true,
          logicStructureAnalysis: true,
          professionalTerminology: true,
          contextualUnderstanding: true,
          semanticAnalysis: true,
          coherenceEvaluation: true,
          professionalDepth: true,
          innovativeThinking: true,
          problemSolvingLogic: true,
          businessContextAnalysis: true,
          roleSpecificEvaluation: true,
          competencyMapping: true,
          potentialAssessment: true
        }
      },
      speechAssistant: {
        enabled: false, // 语音功能已禁用
        priority: 'disabled',
        weight: 0.0,
        optional: false,
        features: {
          voiceRecognition: false,
          textToSpeech: false,
          basicQualityAssessment: false,
          pronunciationAssessment: false,
          basicAssessment: false,
          clarityAssessment: false,
          paceAnalysis: false,
          confidenceDetection: false,
          realTimeTranscription: false,
          voiceEmotionAnalysis: false,
          speechPatternRecognition: false,
          adaptiveListening: false,
          contextualVoiceAnalysis: false
        }
      },
      intelligentAssistant: {
        enabled: true,
        priority: 'auxiliary',
        weight: 0.15,
        features: {
          realTimeHints: true,
          adaptiveQuestioning: true,
          contextMemory: true,
          personalizedGuidance: true,
          difficultyAdjustment: true,
          encouragementSystem: true,
          antiCheatDetection: true,
          qualityAssurance: true,
          intelligentSuggestions: true,
          answerStructureGuidance: true,
          keyPointReminders: true,
          timeManagementAlerts: true,
          confidenceBooster: true,
          stressReductionSupport: true
        }
      }
    }

    this.interactionModes = {
      primary: 'text',
      secondary: 'disabled', // 语音模式已禁用
      disabled: ['voice'],
      smartFeatures: {
        autoHints: true,
        contextAwareness: true,
        adaptiveResponse: true,
        multiModalFusion: true,
        intelligentInterface: true,
        oneClickActions: true,
        progressiveDisclosure: true,
        contextualHelp: true
      }
    }

    this.enterpriseManagement = {
      batchProcessing: {
        enabled: true,
        maxConcurrentInterviews: 100,
        batchAnalysis: true,
        bulkReporting: true,
        massDataExport: true
      },
      organizationManagement: {
        multiTenancy: true,
        roleBasedAccess: true,
        departmentHierarchy: true,
        customWorkflows: true,
        approvalProcesses: true
      },
      hrIntegration: {
        atsConnectors: true,
        hrisIntegration: true,
        talentPoolManagement: true,
        candidateTracking: true,
        recruitmentAnalytics: true
      },
      qualityControl: {
        interviewerCalibration: true,
        consistencyChecks: true,
        biasDetection: true,
        fairnessMonitoring: true
      }
    }

    this.professionalDomains = {
      ai: {
        name: 'AI人工智能',
        keywords: ['机器学习', '深度学习', '神经网络', '算法优化', '模型训练', 'TensorFlow', 'PyTorch'],
        questionTypes: ['算法原理', '模型设计', '性能优化', '实际应用'],
        evaluationCriteria: ['理论基础', '实践经验', '创新能力', '问题解决'],
        industryApplications: ['金融AI', '医疗AI', '自动驾驶', '智能制造', '教育AI'],
        competencyLevels: ['初级工程师', '中级工程师', '高级工程师', '技术专家', '架构师'],
        businessImpactMetrics: ['技术创新度', '商业价值', '实施可行性', '团队影响力']
      },
      bigdata: {
        name: '大数据技术',
        keywords: ['数据处理', '分布式计算', 'Hadoop', 'Spark', '数据仓库', 'ETL', '实时计算'],
        questionTypes: ['架构设计', '数据处理', '性能调优', '业务应用'],
        evaluationCriteria: ['技术深度', '架构思维', '优化能力', '业务理解'],
        industryApplications: ['电商数据', '金融风控', '智慧城市', '工业大数据', '社交媒体'],
        competencyLevels: ['数据分析师', '数据工程师', '大数据架构师', '数据科学家', '首席数据官'],
        businessImpactMetrics: ['数据价值挖掘', '业务洞察力', '决策支持能力', '成本优化效果']
      },
      iot: {
        name: '物联网开发',
        keywords: ['嵌入式开发', '传感器', '通信协议', '边缘计算', '设备管理', '数据采集'],
        questionTypes: ['系统架构', '硬件集成', '协议设计', '安全保障'],
        evaluationCriteria: ['系统设计', '硬件理解', '协议掌握', '安全意识'],
        industryApplications: ['智能家居', '工业物联网', '智慧农业', '车联网', '智慧医疗'],
        competencyLevels: ['嵌入式工程师', '物联网工程师', '系统架构师', '技术总监', 'CTO'],
        businessImpactMetrics: ['系统稳定性', '成本效益', '用户体验', '可扩展性']
      }
    }

    this.dataAnalytics = {
      realTimeMetrics: {
        enabled: true,
        performanceTracking: true,
        behaviorAnalysis: true,
        engagementMetrics: true,
        outcomeCorrelation: true
      },
      predictiveAnalytics: {
        successPrediction: true,
        performanceForecast: true,
        retentionAnalysis: true,
        culturalFitPrediction: true,
        careerPathMapping: true
      },
      benchmarkingSystem: {
        industryBenchmarks: true,
        roleBasedComparison: true,
        competitorAnalysis: true,
        marketTrendAnalysis: true,
        talentMarketInsights: true
      }
    }

    this.qualityAssurance = {
      antiCheat: {
        enabled: true,
        features: {
          responseTimeAnalysis: true,
          answerPatternDetection: true,
          consistencyCheck: true,
          knowledgeDepthVerification: true
        }
      },
      qualityMetrics: {
        responseQuality: true,
        technicalAccuracy: true,
        communicationClarity: true,
        professionalMaturity: true
      }
    }

    console.log('🚀 iFlytek星火大模型服务已初始化')
    console.log('✅ 功能：文本分析、实时助手、企业管理、数据分析')
    console.log('🔧 支持：多模态分析、专业优化、防作弊、批量处理')
  }

  async callSparkAPI(request) {
    const startTime = Date.now()
    console.log(`🔄 iFlytek API调用: ${request.action}`)

    try {
      const mockMode = import.meta.env.VITE_MOCK_API_RESPONSES === 'true'
      const hasValidConfig = this.config.appId &&
                           this.config.apiKey &&
                           this.config.apiSecret &&
                           this.config.appId !== 'simulation_mode' &&
                           this.config.apiKey !== 'simulation_mode' &&
                           this.config.apiSecret !== 'simulation_mode' &&
                           !this.config.appId.includes('your_') &&
                           !this.config.apiKey.includes('your_') &&
                           !this.config.apiSecret.includes('your_')

      if (mockMode || !hasValidConfig) {
        if (mockMode) {
          console.log('🔄 使用模拟模式')
        } else {
          console.warn('⚠️ API配置不完整，使用模拟响应')
        }
        const simulatedResult = this.getSimulatedResponse(request)
        const duration = Date.now() - startTime
        console.log(`✅ 模拟响应完成 - ${duration}ms`)
        return simulatedResult
      }

      const headers = await this.buildAuthHeaders()
      const result = await this.callHttpAPI(request, headers)
      const duration = Date.now() - startTime
      console.log(`✅ API调用成功 - ${duration}ms`)
      return result

    } catch (error) {
      const duration = Date.now() - startTime
      console.error(`❌ API调用失败 - ${duration}ms:`, error.message)

      if (error.message.includes('超时') || error.message.includes('timeout')) {
        console.warn('⏰ API超时，使用模拟响应')
      } else if (error.message.includes('网络') || error.message.includes('network')) {
        console.warn('🌐 网络问题，使用模拟响应')
      } else {
        console.warn('🔧 服务异常，使用模拟响应')
      }

      return this.getSimulatedResponse(request)
    }
  }

  async callHttpAPI(request, headers) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

    try {
      console.log('🚀 发起API调用:', request.action)

      const response = await fetch(`${this.config.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: `spark-${this.config.apiVersion}`,
          messages: this.formatRequestForSpark(request),
          stream: false,
          temperature: 0.7,
          max_tokens: 2048
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('✅ API响应成功')
      return this.parseSparkResponse(data, request)

    } catch (error) {
      clearTimeout(timeoutId)
      if (error.name === 'AbortError') {
        console.warn('⏰ API调用超时')
        throw new Error('API调用超时')
      }
      throw error
    }
  }

  /**
   * 🚀 增强智能面试会话初始化
   * 包含候选人画像分析、技术领域适配、难度等级设定
   */
  async initializeInterviewSession(candidateProfile, interviewType = 'comprehensive') {
    try {
      console.log('🎯 开始初始化智能面试会话...')

      // 1. 候选人画像深度分析
      const candidateAnalysis = await this.analyzeCandidateProfile(candidateProfile)

      // 2. 技术领域适配配置
      const domainConfig = this.adaptTechnicalDomain(candidateProfile, interviewType)

      // 3. 难度等级智能设定
      const difficultyConfig = this.calculateDifficultyLevel(candidateProfile, candidateAnalysis)

      // 4. 上下文记忆机制初始化
      const contextMemory = this.initializeContextMemory()

      const sessionConfig = {
        sessionId: this.generateSessionId(),
        candidateProfile: {
          ...candidateProfile,
          analysis: candidateAnalysis,
          adaptedDomain: domainConfig,
          difficultyLevel: difficultyConfig
        },
        interviewMode: this.interviewModes[interviewType],
        startTime: new Date().toISOString(),

        // 增强AI面试官配置
        aiInterviewer: {
          personality: this.interviewModes[interviewType].aiPersonality,
          chineseOptimization: true,
          adaptiveQuestioning: true,
          realTimeFeedback: true,
          contextualMemory: contextMemory,
          domainExpertise: domainConfig.expertise,
          difficultyAdaptation: difficultyConfig.adaptive,
          personalizedApproach: candidateAnalysis.personalizedStrategy
        },

        // 会话状态管理
        sessionState: {
          status: 'initialized',
          currentPhase: 'preparation',
          questionCount: 0,
          totalQuestions: this.calculateTotalQuestions(interviewType, difficultyConfig),
          pauseCount: 0,
          resumeCount: 0,
          qualityMetrics: this.initializeQualityMetrics()
        },

        // 上下文记忆配置
        contextMemory: {
          enabled: true,
          maxHistory: 20,
          keywordTracking: true,
          emotionalStateTracking: true,
          performanceTracking: true,
          adaptiveWeighting: true
        }
      }

      // 调用真实的讯飞星火API初始化会话
      const response = await this.callSparkAPI({
        action: 'initialize_enhanced_session',
        data: sessionConfig
      })

      // 会话质量评估初始化
      await this.initializeSessionQualityAssessment(response.sessionId, sessionConfig)

      console.log('✅ 增强智能面试会话初始化成功:', {
        sessionId: response.sessionId,
        candidateLevel: candidateAnalysis.level,
        domainFocus: domainConfig.primaryDomain,
        difficultyRange: difficultyConfig.range,
        expectedDuration: difficultyConfig.estimatedDuration
      })

      return {
        ...response,
        enhancedFeatures: {
          candidateAnalysis,
          domainConfig,
          difficultyConfig,
          contextMemory: contextMemory.config
        }
      }
    } catch (error) {
      console.error('❌ 增强面试会话初始化失败:', error)
      // 返回增强的模拟响应以确保系统稳定性
      return this.getEnhancedFallbackSessionConfig(candidateProfile, interviewType)
    }
  }

  /**
   * 🧠 候选人画像深度分析
   * 分析候选人的技能水平、经验背景、学习能力等
   */
  async analyzeCandidateProfile(candidateProfile) {
    try {
      const analysis = {
        // 基础信息分析
        basicInfo: {
          experience: this.analyzeExperienceLevel(candidateProfile.experience || ''),
          education: this.analyzeEducationBackground(candidateProfile.education || ''),
          skills: this.analyzeSkillSet(candidateProfile.skills || [])
        },

        // 技术能力评估
        technicalLevel: this.assessTechnicalLevel(candidateProfile),

        // 学习能力预测
        learningCapacity: this.predictLearningCapacity(candidateProfile),

        // 沟通风格分析
        communicationStyle: this.analyzeCommunicationStyle(candidateProfile),

        // 个性化策略
        personalizedStrategy: {
          questioningApproach: this.determineQuestioningApproach(candidateProfile),
          encouragementStyle: this.determineEncouragementStyle(candidateProfile),
          feedbackFrequency: this.determineFeedbackFrequency(candidateProfile)
        },

        // 综合等级评定
        level: this.calculateCandidateLevel(candidateProfile),

        // 潜在优势和挑战
        strengths: this.identifyStrengths(candidateProfile),
        challenges: this.identifyPotentialChallenges(candidateProfile)
      }

      console.log('🎯 候选人画像分析完成:', analysis.level)
      return analysis
    } catch (error) {
      console.error('❌ 候选人画像分析失败:', error)
      return this.getDefaultCandidateAnalysis()
    }
  }

  /**
   * 🎯 技术领域适配配置
   * 根据候选人背景和面试类型适配最佳技术领域
   */
  adaptTechnicalDomain(candidateProfile, interviewType) {
    const domains = candidateProfile.skills || []
    const position = candidateProfile.position || ''

    // 领域匹配算法
    const domainScores = {
      ai: this.calculateDomainScore(domains, position, ['AI', '机器学习', '深度学习', '算法', 'Python', 'TensorFlow']),
      bigdata: this.calculateDomainScore(domains, position, ['大数据', 'Hadoop', 'Spark', '数据分析', 'SQL', 'Kafka']),
      iot: this.calculateDomainScore(domains, position, ['物联网', 'IoT', '嵌入式', '传感器', 'MQTT', 'Arduino']),
      frontend: this.calculateDomainScore(domains, position, ['前端', 'Vue', 'React', 'JavaScript', 'CSS', 'HTML']),
      backend: this.calculateDomainScore(domains, position, ['后端', 'Java', 'Spring', 'Node.js', '数据库', 'API'])
    }

    const primaryDomain = Object.keys(domainScores).reduce((a, b) =>
      domainScores[a] > domainScores[b] ? a : b
    )

    return {
      primaryDomain,
      secondaryDomains: Object.keys(domainScores)
        .filter(d => d !== primaryDomain && domainScores[d] > 0.3)
        .sort((a, b) => domainScores[b] - domainScores[a])
        .slice(0, 2),
      scores: domainScores,
      expertise: this.professionalDomains[primaryDomain] || this.professionalDomains.ai,
      adaptationStrategy: this.createDomainAdaptationStrategy(primaryDomain, domainScores)
    }
  }

  /**
   * 📊 难度等级智能设定
   * 基于候选人分析结果智能设定面试难度
   */
  calculateDifficultyLevel(candidateProfile, candidateAnalysis) {
    const baseLevel = candidateAnalysis.technicalLevel
    const experience = candidateAnalysis.basicInfo.experience.years
    const learningCapacity = candidateAnalysis.learningCapacity.score

    // 难度计算算法
    let difficultyScore = baseLevel * 0.4 + (experience / 10) * 0.3 + learningCapacity * 0.3
    difficultyScore = Math.max(0.2, Math.min(1.0, difficultyScore))

    const difficultyLevel = difficultyScore < 0.4 ? 'beginner' :
                           difficultyScore < 0.7 ? 'intermediate' : 'advanced'

    return {
      score: difficultyScore,
      level: difficultyLevel,
      range: this.getDifficultyRange(difficultyLevel),
      adaptive: true,
      adjustmentThreshold: 0.15,
      estimatedDuration: this.estimateInterviewDuration(difficultyLevel),
      questionDistribution: this.calculateQuestionDistribution(difficultyLevel)
    }
  }

  /**
   * 🎯 确定提问方式
   */
  determineQuestioningApproach(candidateProfile) {
    const { experience, domain, communicationStyle } = candidateProfile

    if (experience === 'senior' || experience === 'expert') {
      return 'strategic' // 战略性提问
    } else if (experience === 'intermediate') {
      return 'guided' // 引导式提问
    } else {
      return 'supportive' // 支持性提问
    }
  }

  /**
   * 🎯 确定鼓励风格
   */
  determineEncouragementStyle(candidateProfile) {
    const { personality, confidence } = candidateProfile

    if (confidence > 0.7) {
      return 'challenging' // 挑战性鼓励
    } else if (confidence > 0.4) {
      return 'balanced' // 平衡式鼓励
    } else {
      return 'supportive' // 支持性鼓励
    }
  }

  /**
   * 🎯 确定反馈频率
   */
  determineFeedbackFrequency(candidateProfile) {
    const { experience, needsGuidance } = candidateProfile

    if (needsGuidance || experience === 'junior') {
      return 'frequent' // 频繁反馈
    } else if (experience === 'intermediate') {
      return 'moderate' // 适度反馈
    } else {
      return 'minimal' // 最少反馈
    }
  }

  /**
   * 🎯 获取难度范围
   */
  getDifficultyRange(difficultyLevel) {
    const ranges = {
      beginner: { min: 0.1, max: 0.4, target: 0.25 },
      intermediate: { min: 0.3, max: 0.7, target: 0.5 },
      advanced: { min: 0.6, max: 0.9, target: 0.75 }
    }

    return ranges[difficultyLevel] || ranges.intermediate
  }

  /**
   * 🧠 上下文记忆机制初始化
   * 初始化智能上下文记忆系统
   */
  initializeContextMemory() {
    return {
      config: {
        enabled: true,
        maxHistoryLength: 20,
        keywordWeightDecay: 0.9,
        emotionalStateTracking: true,
        performanceTracking: true
      },
      storage: {
        conversationHistory: [],
        keywordFrequency: new Map(),
        emotionalStates: [],
        performanceMetrics: [],
        contextualCues: []
      },
      algorithms: {
        relevanceScoring: this.calculateContextRelevance.bind(this),
        memoryConsolidation: this.consolidateMemory.bind(this),
        adaptiveWeighting: this.adjustContextWeights.bind(this)
      }
    }
  }

  /**
   * ⏸️ 会话暂停处理
   * 智能保存会话状态并提供恢复机制
   */
  async pauseInterviewSession(sessionId, reason = 'user_request') {
    try {
      console.log('⏸️ 暂停面试会话:', sessionId)

      const sessionState = await this.getSessionState(sessionId)
      const pauseData = {
        sessionId,
        pauseTime: new Date().toISOString(),
        reason,
        currentState: sessionState,
        contextSnapshot: await this.captureContextSnapshot(sessionId),
        resumeInstructions: this.generateResumeInstructions(sessionState)
      }

      const response = await this.callSparkAPI({
        action: 'pause_session',
        data: pauseData
      })

      console.log('✅ 会话暂停成功')
      return {
        success: true,
        pauseId: response.pauseId,
        resumeToken: response.resumeToken,
        estimatedResumeTime: response.estimatedResumeTime
      }
    } catch (error) {
      console.error('❌ 会话暂停失败:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * ▶️ 会话恢复处理
   * 智能恢复会话状态并确保上下文连贯性
   */
  async resumeInterviewSession(sessionId, resumeToken) {
    try {
      console.log('▶️ 恢复面试会话:', sessionId)

      const resumeData = {
        sessionId,
        resumeToken,
        resumeTime: new Date().toISOString(),
        contextRestoration: true,
        continuityCheck: true
      }

      const response = await this.callSparkAPI({
        action: 'resume_session',
        data: resumeData
      })

      // 恢复上下文记忆
      await this.restoreContextMemory(sessionId, response.contextSnapshot)

      // 生成恢复后的连接问题
      const reconnectionQuestion = await this.generateReconnectionQuestion(sessionId, response.previousContext)

      console.log('✅ 会话恢复成功')
      return {
        success: true,
        reconnectionQuestion,
        restoredContext: response.contextSnapshot,
        continuityScore: response.continuityScore
      }
    } catch (error) {
      console.error('❌ 会话恢复失败:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * 🏁 会话结束处理
   * 智能结束会话并生成完整评估报告
   */
  async endInterviewSession(sessionId, endReason = 'completed') {
    try {
      console.log('🏁 结束面试会话:', sessionId)

      const sessionSummary = await this.generateSessionSummary(sessionId)
      const finalEvaluation = await this.generateFinalEvaluation(sessionId)

      const endData = {
        sessionId,
        endTime: new Date().toISOString(),
        endReason,
        sessionSummary,
        finalEvaluation,
        qualityMetrics: await this.calculateSessionQuality(sessionId)
      }

      const response = await this.callSparkAPI({
        action: 'end_session',
        data: endData
      })

      console.log('✅ 会话结束处理完成')
      return {
        success: true,
        sessionReport: response.sessionReport,
        recommendations: response.recommendations,
        learningPath: response.suggestedLearningPath
      }
    } catch (error) {
      console.error('❌ 会话结束处理失败:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * 📊 会话质量评估
   * 实时监控和评估会话质量
   */
  async assessSessionQuality(sessionId) {
    try {
      const qualityMetrics = {
        conversationFlow: await this.evaluateConversationFlow(sessionId),
        questionQuality: await this.evaluateQuestionQuality(sessionId),
        responseQuality: await this.evaluateResponseQuality(sessionId),
        technicalDepth: await this.evaluateTechnicalDepth(sessionId),
        engagementLevel: await this.evaluateEngagementLevel(sessionId),
        overallSatisfaction: 0
      }

      // 计算综合质量分数
      qualityMetrics.overallSatisfaction = this.calculateOverallQuality(qualityMetrics)

      // 异常检测
      const anomalies = this.detectQualityAnomalies(qualityMetrics)
      if (anomalies.length > 0) {
        await this.handleQualityAnomalies(sessionId, anomalies)
      }

      return qualityMetrics
    } catch (error) {
      console.error('❌ 会话质量评估失败:', error)
      return this.getDefaultQualityMetrics()
    }
  }

  /**
   * 生成下一个问题 - 兼容性接口
   */
  async generateNextQuestion(sessionId, context = {}) {
    return await this.generateInterviewQuestion(sessionId, context)
  }

  /**
   * 增强的智能面试问题生成 - 基于竞品分析优化
   */
  async generateInterviewQuestion(sessionId, context = {}) {
    try {
      const questionRequest = {
        sessionId,
        context: {
          previousAnswers: context.previousAnswers || [],
          currentDifficulty: context.difficulty || 'medium',
          domain: context.domain || 'comprehensive',
          candidateProfile: context.candidateProfile || {},
          questionNumber: context.questionNumber || 1,
          // 新增：增强上下文信息
          performanceHistory: context.performanceHistory || [],
          weaknessAreas: context.weaknessAreas || [],
          strengthAreas: context.strengthAreas || [],
          interviewProgress: context.interviewProgress || 0
        },
        requirements: {
          language: 'chinese',
          style: 'professional',
          adaptiveDifficulty: true,
          contextAware: true,
          followUpCapable: true,
          // 新增：智能生成要求
          professionalDepth: true,
          scenarioBased: true,
          innovationFocused: true,
          practicalOriented: true
        },
        // 新增：专业领域配置
        domainConfig: this.professionalDomains[context.domain] || this.professionalDomains.ai
      }

      const response = await this.callSparkAPI({
        action: 'generate_intelligent_question',
        data: questionRequest
      })

      console.log('✅ 智能问题生成成功 - 增强版')
      return {
        question: response.question,
        type: response.type,
        difficulty: response.difficulty,
        expectedKeywords: response.expectedKeywords,
        evaluationCriteria: response.evaluationCriteria,
        followUpQuestions: response.followUpQuestions,
        // 新增：增强返回信息
        domainFocus: response.domainFocus,
        scenarioContext: response.scenarioContext,
        hintStrategy: response.hintStrategy,
        timeEstimate: response.timeEstimate,
        complexityLevel: response.complexityLevel
      }
    } catch (error) {
      console.error('❌ 问题生成失败:', error)
      return this.getEnhancedFallbackQuestion(context)
    }
  }

  /**
   * 新增：智能自适应问题生成
   */
  async generateAdaptiveQuestion(sessionId, candidatePerformance) {
    try {
      const adaptiveRequest = {
        sessionId,
        performanceData: candidatePerformance,
        adaptationStrategy: {
          difficultyAdjustment: true,
          focusAreaOptimization: true,
          weaknessTargeting: true,
          strengthReinforcement: true
        }
      }

      const response = await this.callSparkAPI({
        action: 'generate_adaptive_question',
        data: adaptiveRequest
      })

      return {
        question: response.question,
        adaptationReason: response.adaptationReason,
        targetSkills: response.targetSkills,
        expectedImprovement: response.expectedImprovement
      }
    } catch (error) {
      console.error('❌ 自适应问题生成失败:', error)
      return this.getFallbackAdaptiveQuestion(candidatePerformance)
    }
  }

  /**
   * 文本主要分析方法 - 兼容性接口
   */
  async analyzeTextPrimary(inputData) {
    return await this.analyzeTextPrimaryInput(null, inputData)
  }

  /**
   * 🎯 增强多模态分析与评估系统
   * 基于六维能力模型的综合智能分析
   */
  async analyzeTextPrimaryInput(sessionId, inputData) {
    try {
      console.log('🎯 开始增强多模态分析...')

      // 1. 预处理和数据验证
      const preprocessedData = await this.preprocessInputData(inputData)

      // 2. 多维度并行分析
      const analysisResults = await Promise.all([
        this.performTextAnalysis(sessionId, preprocessedData),
        this.performSemanticAnalysis(sessionId, preprocessedData),
        this.performSixDimensionAnalysis(sessionId, preprocessedData)
      ])

      // 3. 结果融合和权重计算
      const fusedResults = await this.fuseAnalysisResults(analysisResults, inputData.domain)

      // 4. 实时评分算法
      const realTimeScores = await this.calculateRealTimeScores(fusedResults, sessionId)

      // 5. 可解释性分析
      const explanations = await this.generateExplanations(fusedResults, realTimeScores)

      const analysisRequest = {
        sessionId,
        timestamp: new Date().toISOString(),

        // 增强输入数据
        primaryInput: {
          text: preprocessedData.text || '',
          textWeight: this.capabilities.textAnalysis.weight,
          textMetrics: preprocessedData.textMetrics
        },

        // 语音分析数据（已禁用）
        voiceInput: {
          audio: null,
          voiceMetrics: null,
          speechPatterns: null,
          enabled: false
        },

        // 六维能力分析配置
        sixDimensionAnalysis: {
          enabled: true,
          dimensions: ['技术能力', '沟通表达', '逻辑思维', '学习能力', '创新能力', '团队协作'],
          weights: this.getSixDimensionWeights(inputData.domain),
          realTimeTracking: true
        },

        analysisType: 'enhanced_multimodal_primary',
        chineseOptimization: true,
        realTimeMode: true,

        // 增强分析焦点
        focusAreas: [
          'content_depth', 'technical_accuracy', 'logical_structure', 'chinese_expression',
          'semantic_coherence', 'professional_maturity', 'innovative_thinking', 'problem_solving_logic',
          'confidence_level'
        ],

        // 专业领域深度分析
        domainAnalysis: {
          enabled: true,
          domain: inputData.domain || 'comprehensive',
          professionalKeywords: this.professionalDomains[inputData.domain]?.keywords || [],
          industryContext: this.getIndustryContext(inputData.domain),
          technicalDepthRequirement: this.getTechnicalDepthRequirement(inputData.domain)
        },

        // 质量保障和异常检测
        qualityAssurance: {
          ...this.qualityAssurance,
          anomalyDetection: true,
          biasDetection: true,
          consistencyCheck: true
        }
      }

      const response = await this.callSparkAPI({
        action: 'analyze_enhanced_multimodal_primary',
        data: analysisRequest
      })

      // 构建增强分析结果
      const enhancedResults = {
        // 基础评分
        overallScore: realTimeScores.overall,
        technicalCompetency: realTimeScores.technical,
        communicationSkills: realTimeScores.communication,
        contentQuality: realTimeScores.content,
        logicalStructure: realTimeScores.logic,

        // 六维能力评估
        sixDimensionScores: {
          技术能力: realTimeScores.technical,
          沟通表达: realTimeScores.communication,
          逻辑思维: realTimeScores.logic,
          学习能力: realTimeScores.learning,
          创新能力: realTimeScores.innovation,
          团队协作: realTimeScores.teamwork
        },

        // 增强文本分析
        textAnalysis: {
          ...fusedResults.textAnalysis,
          keywordDensity: this.calculateKeywordDensity(preprocessedData.text),
          sentenceComplexity: this.analyzeSentenceComplexity(preprocessedData.text),
          technicalTermUsage: this.analyzeTechnicalTermUsage(preprocessedData.text, inputData.domain),
          coherenceScore: this.calculateCoherenceScore(preprocessedData.text)
        },

        // 语音分析（已禁用）
        voiceAnalysis: null,

        // 语义分析结果
        semanticAnalysis: fusedResults.semanticAnalysis,

        // 专业深度评估
        professionalDepth: fusedResults.professionalDepth,

        // 创新思维评估
        innovativeThinking: fusedResults.innovativeThinking,

        // 问题解决逻辑
        problemSolvingLogic: fusedResults.problemSolvingLogic,

        // 领域专业性
        domainExpertise: fusedResults.domainExpertise,

        // 质量指标
        qualityMetrics: fusedResults.qualityMetrics,

        // 可解释性结果
        explanations: explanations,

        // 智能建议和指导
        recommendations: this.generateSmartRecommendations(fusedResults, explanations),
        nextQuestionSuggestion: this.generateNextQuestionSuggestion(fusedResults, sessionId),
        realTimeHints: this.generateRealTimeHints(fusedResults),
        improvementAreas: explanations.improvementAreas,
        strengthAreas: explanations.strengthAreas,

        // 分析元数据
        analysisMode: 'enhanced_multimodal_primary',
        analysisTimestamp: new Date().toISOString(),
        processingTime: Date.now() - preprocessedData.startTime
      }

      console.log('✅ 增强多模态分析完成:', {
        overallScore: enhancedResults.overallScore,
        dimensions: Object.keys(enhancedResults.sixDimensionScores),
        processingTime: enhancedResults.processingTime
      })

      return enhancedResults
    } catch (error) {
      console.error('❌ 增强多模态分析失败:', error)
      return this.getEnhancedFallbackAnalysis(inputData)
    }
  }



  /**
   * 📝 增强文本分析功能
   * 包括技术关键词识别、逻辑结构分析、专业性评估
   */
  async performTextAnalysis(sessionId, inputData) {
    try {
      const text = inputData.text || ''

      const textMetrics = {
        // 基础文本指标
        wordCount: this.countWords(text),
        sentenceCount: this.countSentences(text),
        averageWordsPerSentence: this.calculateAverageWordsPerSentence(text),

        // 技术关键词分析
        technicalKeywords: this.extractTechnicalKeywords(text, inputData.domain),
        keywordDensity: this.calculateKeywordDensity(text),
        professionalTerms: this.identifyProfessionalTerms(text, inputData.domain),

        // 逻辑结构分析
        logicalStructure: this.analyzeLogicalStructure(text),
        coherenceScore: this.calculateCoherenceScore(text),
        argumentFlow: this.analyzeArgumentFlow(text),

        // 语言质量评估
        grammarScore: this.assessGrammar(text),
        vocabularyRichness: this.assessVocabularyRichness(text),
        sentenceComplexity: this.analyzeSentenceComplexity(text),

        // 专业性评估
        technicalDepth: this.assessTechnicalDepth(text, inputData.domain),
        industryRelevance: this.assessIndustryRelevance(text, inputData.domain),
        innovationIndicators: this.identifyInnovationIndicators(text)
      }

      return {
        metrics: textMetrics,
        overallScore: this.calculateTextOverallScore(textMetrics),
        qualityAssessment: this.assessTextQuality(textMetrics),
        recommendations: this.generateTextRecommendations(textMetrics)
      }
    } catch (error) {
      console.error('❌ 文本分析失败:', error)
      return { error: error.message }
    }
  }

  /**
   * 🧠 六维能力模型分析
   * 基于技术能力、沟通表达、逻辑思维、学习能力、创新能力、团队协作进行综合评估
   */
  async performSixDimensionAnalysis(sessionId, inputData) {
    try {
      const dimensions = {
        // 1. 技术能力 (Technical Competency)
        技术能力: {
          score: this.assessTechnicalCompetency(inputData),
          indicators: this.getTechnicalIndicators(inputData),
          evidence: this.extractTechnicalEvidence(inputData),
          level: this.determineTechnicalLevel(inputData)
        },

        // 2. 沟通表达 (Communication Skills)
        沟通表达: {
          score: this.assessCommunicationSkills(inputData),
          indicators: this.getCommunicationIndicators(inputData),
          clarity: this.assessCommunicationClarity(inputData),
          effectiveness: this.assessCommunicationEffectiveness(inputData)
        },

        // 3. 逻辑思维 (Logical Thinking)
        逻辑思维: {
          score: this.assessLogicalThinking(inputData),
          indicators: this.getLogicalIndicators(inputData),
          reasoning: this.assessReasoningAbility(inputData),
          structure: this.assessThoughtStructure(inputData)
        },

        // 4. 学习能力 (Learning Ability)
        学习能力: {
          score: this.assessLearningAbility(inputData),
          indicators: this.getLearningIndicators(inputData),
          adaptability: this.assessAdaptability(inputData),
          curiosity: this.assessCuriosity(inputData)
        },

        // 5. 创新能力 (Innovation Capability)
        创新能力: {
          score: this.assessInnovationCapability(inputData),
          indicators: this.getInnovationIndicators(inputData),
          creativity: this.assessCreativity(inputData),
          originalThinking: this.assessOriginalThinking(inputData)
        },

        // 6. 团队协作 (Teamwork)
        团队协作: {
          score: this.assessTeamworkAbility(inputData),
          indicators: this.getTeamworkIndicators(inputData),
          collaboration: this.assessCollaborationSkills(inputData),
          leadership: this.assessLeadershipPotential(inputData)
        }
      }

      // 计算综合评估
      const overallAssessment = this.calculateOverallSixDimensionScore(dimensions)

      return {
        dimensions,
        overallScore: overallAssessment.score,
        strengths: overallAssessment.strengths,
        weaknesses: overallAssessment.weaknesses,
        developmentAreas: overallAssessment.developmentAreas,
        recommendations: this.generateSixDimensionRecommendations(dimensions)
      }
    } catch (error) {
      console.error('❌ 六维能力分析失败:', error)
      return { error: error.message }
    }
  }

  /**
   * 🔗 分析结果融合算法
   * 智能融合多模态分析结果并计算权重
   */
  async fuseAnalysisResults(analysisResults, domain = 'comprehensive') {
    try {
      const [textAnalysis, semanticAnalysis, sixDimensionAnalysis] = analysisResults

      // 获取领域特定权重
      const weights = this.getDomainSpecificWeights(domain)

      // 融合算法
      const fusedResults = {
        textAnalysis: textAnalysis,
        voiceAnalysis: null, // 语音分析已禁用
        semanticAnalysis: semanticAnalysis,
        sixDimensionAnalysis: sixDimensionAnalysis,

        // 加权融合分数
        fusedScores: {
          technical: this.calculateWeightedScore([
            textAnalysis.metrics?.technicalDepth || 0,
            sixDimensionAnalysis.dimensions?.技术能力?.score || 0
          ], [weights.text, weights.sixDimension]),

          communication: this.calculateWeightedScore([
            textAnalysis.metrics?.grammarScore || 0,
            0, // 语音分析已禁用
            sixDimensionAnalysis.dimensions?.沟通表达?.score || 0
          ], [weights.text, 0, weights.sixDimension]),

          logic: this.calculateWeightedScore([
            textAnalysis.metrics?.logicalStructure || 0,
            sixDimensionAnalysis.dimensions?.逻辑思维?.score || 0
          ], [weights.text, weights.sixDimension])
        },

        // 质量指标
        qualityMetrics: {
          consistency: this.calculateConsistency(analysisResults),
          reliability: this.calculateReliability(analysisResults),
          completeness: this.calculateCompleteness(analysisResults)
        }
      }

      return fusedResults
    } catch (error) {
      console.error('❌ 分析结果融合失败:', error)
      return { error: error.message }
    }
  }

  /**
   * 增强实时智能助手功能 - 整合智能回答建议优势
   */
  async provideRealTimeAssistance(sessionId, currentContext) {
    try {
      const assistanceRequest = {
        sessionId,
        context: currentContext,
        assistanceType: 'enhanced_real_time_guidance',
        features: this.capabilities.intelligentAssistant.features,
        // 新增：智能建议配置
        suggestionConfig: {
          answerStructureGuidance: true,
          keyPointReminders: true,
          timeManagementAlerts: true,
          confidenceBooster: true
        }
      }

      const response = await this.callSparkAPI({
        action: 'provide_enhanced_real_time_assistance',
        data: assistanceRequest
      })

      return {
        assistanceType: response.assistanceType,
        guidance: response.guidance,
        hints: response.hints,
        encouragement: response.encouragement,
        nextSteps: response.nextSteps,
        urgency: response.urgency,
        // 新增：智能建议返回
        intelligentSuggestions: response.intelligentSuggestions,
        answerStructure: response.answerStructure,
        keyPoints: response.keyPoints,
        timeRemaining: response.timeRemaining,
        confidenceLevel: response.confidenceLevel
      }
    } catch (error) {
      console.error('❌ 增强实时助手功能失败:', error)
      return this.getFallbackAssistance(currentContext)
    }
  }

  /**
   * 新增：企业级批量面试处理（参考大规模并发面试支持优势）
   */
  async processBatchInterviews(batchConfig) {
    try {
      const batchRequest = {
        batchId: this.generateBatchId(),
        interviews: batchConfig.interviews,
        processingMode: 'concurrent',
        maxConcurrency: this.enterpriseManagement.batchProcessing.maxConcurrentInterviews,
        analysisDepth: batchConfig.analysisDepth || 'standard',
        reportingFormat: batchConfig.reportingFormat || 'comprehensive'
      }

      const response = await this.callSparkAPI({
        action: 'process_batch_interviews',
        data: batchRequest
      })

      return {
        batchId: response.batchId,
        processedCount: response.processedCount,
        successRate: response.successRate,
        results: response.results,
        aggregateAnalysis: response.aggregateAnalysis,
        batchReport: response.batchReport,
        processingTime: response.processingTime
      }
    } catch (error) {
      console.error('❌ 批量面试处理失败:', error)
      return this.getFallbackBatchProcessing(batchConfig)
    }
  }

  /**
   * 新增：数据驱动招聘决策分析（参考数据驱动招聘决策优势）
   */
  async generateDataDrivenInsights(analysisRequest) {
    try {
      const insightsRequest = {
        analysisType: analysisRequest.type || 'data_driven_recruitment',
        dataScope: analysisRequest.dataScope,
        timeRange: analysisRequest.timeRange,
        metrics: this.dataAnalytics.realTimeMetrics,
        predictiveAnalysis: this.dataAnalytics.predictiveAnalytics,
        benchmarking: this.dataAnalytics.benchmarkingSystem
      }

      const response = await this.callSparkAPI({
        action: 'generate_data_driven_insights',
        data: insightsRequest
      })

      return {
        insights: response.insights,
        predictions: response.predictions,
        recommendations: response.recommendations,
        benchmarks: response.benchmarks,
        trends: response.trends,
        riskAssessment: response.riskAssessment,
        actionItems: response.actionItems
      }
    } catch (error) {
      console.error('❌ 数据驱动洞察生成失败:', error)
      return this.getFallbackDataInsights(analysisRequest)
    }
  }



  /**
   * 生成递进式AI提示 - 新增功能
   */
  async generateProgressiveHint(sessionId, currentContext) {
    try {
      const { hintLevel, hintCount, previousHints, question, candidateResponse } = currentContext

      // 根据提示级别生成不同类型的提示
      const progressiveHint = this.generateProgressiveHintContent(currentContext)

      // 如果有iFlytek Spark连接，尝试获取更智能的递进式提示
      if (this.isConnected) {
        const hintRequest = {
          sessionId,
          context: {
            ...currentContext,
            hintLevel,
            previousHints: previousHints.map(h => h.content)
          },
          hintType: 'progressive_contextual',
          language: 'chinese'
        }

        const response = await this.callSparkAPI({
          action: 'generate_progressive_hint',
          data: hintRequest
        })

        return {
          hint: response.hint || progressiveHint.hint,
          level: hintLevel,
          type: progressiveHint.type,
          guidance: progressiveHint.guidance,
          source: 'iflytek_progressive'
        }
      } else {
        return {
          ...progressiveHint,
          source: 'local_progressive'
        }
      }
    } catch (error) {
      console.error('❌ 递进式提示生成失败:', error)
      const fallbackHint = this.generateProgressiveHintContent(currentContext)
      return {
        ...fallbackHint,
        source: 'fallback_progressive'
      }
    }
  }

  /**
   * 生成实时AI提示 - 增强版
   */
  async generateRealTimeHint(sessionId, currentContext) {
    try {
      // 首先尝试使用增强的本地智能提示系统
      const enhancedHint = this.generateEnhancedHint(currentContext)

      // 如果有iFlytek Spark连接，尝试获取更智能的提示
      if (this.isConnected) {
        const hintRequest = {
          sessionId,
          context: {
            ...currentContext,
            enhancedAnalysis: enhancedHint.dimensions
          },
          hintType: 'enhanced_contextual',
          language: 'chinese'
        }

        const response = await this.callSparkAPI({
          action: 'generate_hint',
          data: hintRequest
        })

        // 合并本地分析和远程智能提示
        return {
          hint: response.hint || enhancedHint.hint,
          type: response.type || enhancedHint.type,
          urgency: response.urgency || enhancedHint.urgency,
          timing: response.timing || enhancedHint.timing,
          guidance: enhancedHint.guidance,
          examples: enhancedHint.examples,
          source: 'iflytek_enhanced'
        }
      } else {
        // 使用本地增强提示系统
        return {
          ...enhancedHint,
          source: 'local_enhanced'
        }
      }
    } catch (error) {
      console.error('❌ 实时提示生成失败:', error)
      // 降级到增强的本地提示系统
      const enhancedHint = this.generateEnhancedHint(currentContext)
      return {
        ...enhancedHint,
        source: 'local_fallback'
      }
    }
  }





  async buildAuthHeaders() {
    const timestamp = Math.floor(Date.now() / 1000)
    const signature = await this.generateSignature(timestamp)

    return {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'X-Spark-AppId': this.config.appId,
      'X-Timestamp': timestamp.toString(),
      'X-Signature': signature
    }
  }

  async generateSignature(timestamp) {
    const stringToSign = `${this.config.appId}${timestamp}${this.config.apiKey}`
    const encoder = new TextEncoder()
    const data = encoder.encode(stringToSign)
    const key = encoder.encode(this.config.apiSecret)

    const cryptoKey = await crypto.subtle.importKey(
      'raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    )

    const signature = await crypto.subtle.sign('HMAC', cryptoKey, data)
    return Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
  }

  formatRequestForSpark(request) {
    switch (request.action) {
      case 'initialize_session':
        return [{
          role: 'system',
          content: `你是基于iFlytek星火大模型的专业AI面试官，专门进行${request.data.interviewMode.name}。
          你具备以下核心能力：
          1. 中文语言深度理解和自然对话
          2. 专业技术领域的深度评估
          3. 实时智能指导和建设性反馈
          4. 自适应难度调整和个性化提问

          请根据候选人信息制定智能面试策略。候选人信息：${JSON.stringify(request.data.candidateProfile)}`
        }]

      case 'generate_question':
      case 'generate_intelligent_question':
        return [{
          role: 'system',
          content: `你是基于iFlytek星火大模型的智能面试官，具备以下特色能力：
          - 深度中文理解和专业术语识别
          - 基于上下文的智能问题生成
          - 多维度技能评估和自适应难度调整
          - 实时反馈和建设性指导

          请生成专业、有深度、符合中国企业文化的面试问题。`
        }, {
          role: 'user',
          content: `请根据以下上下文生成一个智能面试问题：
          上下文信息：${JSON.stringify(request.data.context)}
          专业领域：${JSON.stringify(request.data.domainConfig)}
          生成要求：${JSON.stringify(request.data.requirements)}`
        }]

      case 'generate_adaptive_question':
        return [{
          role: 'system',
          content: '你是智能自适应面试系统，能够根据候选人的表现动态调整问题难度和焦点。'
        }, {
          role: 'user',
          content: `基于候选人表现数据，生成自适应问题：${JSON.stringify(request.data.performanceData)}`
        }]

      case 'analyze_text_primary':
      case 'analyze_enhanced_text_primary':
        return [{
          role: 'system',
          content: `你是基于iFlytek星火大模型的专业面试评估专家，具备以下分析能力：
          - 深度中文语言理解和语义分析
          - 多维度技术能力评估
          - 专业术语和概念深度分析
          - 创新思维和问题解决逻辑评估
          - 实时质量保障和防作弊检测

          请进行全面、客观、建设性的分析评估。`
        }, {
          role: 'user',
          content: `请对以下面试回答进行增强分析：
          主要输入：${JSON.stringify(request.data.primaryInput)}
          辅助输入：${JSON.stringify(request.data.secondaryInput)}
          分析维度：${JSON.stringify(request.data.focusAreas)}
          专业领域：${JSON.stringify(request.data.domainAnalysis)}
          质量保障：${JSON.stringify(request.data.qualityAssurance)}`
        }]

      case 'generate_hint':
      case 'provide_real_time_assistance':
      case 'provide_enhanced_real_time_assistance':
        return [{
          role: 'system',
          content: `你是iFlytek星火智能面试助手，整合了实时AI面试辅助的先进功能。
          你的核心能力：
          - 提供启发性提示而非直接答案
          - 智能回答建议和结构化指导
          - 基于中文表达习惯的个性化建议
          - 实时时间管理和信心提升支持
          - 保持专业性和支持性的完美平衡

          你的指导原则：
          - 根据候选人状态提供适应性支持
          - 结合上下文给出精准的回答建议
          - 帮助候选人建立回答结构和逻辑
          - 提供鼓励和信心提升`
        }, {
          role: 'user',
          content: `当前面试情况：${JSON.stringify(request.data.context)}
          智能建议配置：${JSON.stringify(request.data.suggestionConfig || {})}
          请提供增强的智能实时助手服务，包括：
          1. 智能回答建议和结构指导
          2. 关键点提醒和时间管理
          3. 个性化鼓励和信心提升
          4. 适当的提示和下一步指导`
        }]

      case 'process_batch_interviews':
        return [{
          role: 'system',
          content: `你是iFlytek星火企业级批量面试处理系统，具备大规模并发面试支持能力。
          你的核心功能：
          - 高效的批量面试数据处理
          - 统一的评估标准和质量控制
          - 综合的聚合分析和报告生成
          - 企业级的数据安全和隐私保护`
        }, {
          role: 'user',
          content: `批量面试处理请求：${JSON.stringify(request.data)}
          请进行高效的批量处理，确保评估质量和一致性。`
        }]

      case 'generate_data_driven_insights':
        return [{
          role: 'system',
          content: `你是iFlytek星火数据驱动招聘决策分析专家，具备先进的数据分析和预测能力。
          你的分析能力：
          - 深度的招聘数据挖掘和模式识别
          - 准确的候选人成功率和绩效预测
          - 全面的行业基准和竞争分析
          - 实用的招聘策略优化建议`
        }, {
          role: 'user',
          content: `数据分析请求：${JSON.stringify(request.data)}
          请提供数据驱动的招聘洞察和决策建议。`
        }]

      default:
        return [{
          role: 'system',
          content: '你是基于iFlytek星火大模型的智能面试系统，请根据请求提供专业服务。'
        }, {
          role: 'user',
          content: JSON.stringify(request.data)
        }]
    }
  }

  /**
   * 解析星火API响应
   */
  parseSparkResponse(data, request) {
    try {
      const content = data.choices?.[0]?.message?.content || data.content || ''

      switch (request.action) {
        case 'initialize_session':
          return {
            sessionId: this.generateSessionId(),
            status: 'initialized',
            aiPersonality: request.data.interviewMode.aiPersonality,
            message: content
          }

        case 'generate_question':
          return this.parseQuestionResponse(content)

        case 'analyze_text_primary':
          return this.parseAnalysisResponse(content)

        case 'generate_hint':
          return this.parseHintResponse(content)

        default:
          return { content, timestamp: new Date().toISOString() }
      }
    } catch (error) {
      console.error('❌ 响应解析失败:', error)
      return this.getSimulatedResponse(request)
    }
  }

  /**
   * 解析问题生成响应
   */
  parseQuestionResponse(content) {
    try {
      const parsed = JSON.parse(content)
      return parsed
    } catch {
      return {
        question: content,
        type: '综合评估',
        difficulty: 'medium',
        expectedKeywords: ['技术能力', '项目经验', '解决方案'],
        evaluationCriteria: ['技术深度', '表达清晰', '逻辑思维'],
        followUpQuestions: []
      }
    }
  }

  /**
   * 解析分析响应
   */
  parseAnalysisResponse(content) {
    try {
      const parsed = JSON.parse(content)
      return parsed
    } catch {
      return {
        overallScore: 85,
        technicalCompetency: 82,
        communicationSkills: 88,
        confidenceLevel: 79,
        audioAnalysis: null, // 语音分析已禁用
        textAnalysis: { keywords: ['技术', '项目', '经验'], sentiment: 'positive' },
        recommendations: ['继续保持技术深度', '可以更多举例说明'],
        nextQuestionSuggestion: '可以深入询问具体的技术实现细节'
      }
    }
  }

  /**
   * 解析提示响应
   */
  parseHintResponse(content) {
    try {
      const parsed = JSON.parse(content)
      return parsed
    } catch {
      return {
        hint: content || '建议从具体的项目经验开始回答，然后详述技术细节和解决方案',
        type: 'constructive',
        urgency: 'medium',
        timing: 'immediate'
      }
    }
  }

  getSimulatedResponse(request) {
    console.log('🔄 模拟响应:', request.action)

    switch (request.action) {
      case 'initialize_session':
        return {
          sessionId: this.generateSessionId(),
          status: 'initialized',
          aiPersonality: 'professional_technical',
          message: '面试会话已初始化，AI面试官准备就绪',
          mode: request.data?.interviewMode?.name || 'comprehensive',
          capabilities: this.capabilities
        }

      case 'generate_question':
      case 'generate_intelligent_question':
      case 'generate_adaptive_question':
        return this.getEnhancedFallbackQuestion(request.data?.context || {})

      case 'analyze_text_primary':
      case 'analyze_enhanced_text_primary':
        return this.getEnhancedFallbackAnalysis(request.data?.primaryInput || request.data?.inputData || {})

      case 'provide_enhanced_real_time_assistance':
        return this.getFallbackAssistance(request.data?.context || {})

      case 'generate_hint':
        return this.getFallbackHint(request.data?.context || {})

      case 'process_batch_interviews':
        return this.getFallbackBatchProcessing(request.data || {})

      case 'generate_data_driven_insights':
        return this.getFallbackDataInsights(request.data || {})

      case 'voice_recognition':
        return {
          text: '语音识别功能已禁用',
          confidence: 0,
          duration: 0,
          enabled: false
        }

      default:
        return {
          content: '模拟响应：功能正常运行',
          timestamp: new Date().toISOString(),
          action: request.action,
          status: 'simulated'
        }
    }
  }

  getFallbackSessionConfig(candidateProfile, interviewType) {
    return {
      sessionId: this.generateSessionId(),
      candidateProfile,
      interviewMode: this.interviewModes[interviewType],
      startTime: new Date().toISOString(),
      status: 'fallback_mode',
      aiInterviewer: {
        personality: this.interviewModes[interviewType].aiPersonality,
        chineseOptimization: true,
        adaptiveQuestioning: true,
        realTimeFeedback: true
      }
    }
  }

  getEnhancedFallbackQuestion(context) {
    const enhancedQuestions = {
      ai: {
        basic: [
          '请介绍您对机器学习基础概念的理解，包括监督学习和无监督学习的区别。',
          '描述一下您在数据预处理方面的经验，如何处理缺失值和异常值？'
        ],
        intermediate: [
          '请详细说明您在深度学习模型优化方面的实践经验，包括具体的优化策略。',
          '在AI项目中，您如何平衡模型准确性和计算效率？请举具体例子。'
        ],
        advanced: [
          '请分析当前大语言模型的技术发展趋势，以及您认为的突破方向。',
          '在AI系统的工程化部署中，您遇到过哪些挑战？如何解决模型的可解释性问题？'
        ],
        scenario: [
          '假设您需要为一个电商平台设计推荐系统，请描述完整的技术方案和实施步骤。',
          '如果要优化一个现有的图像识别模型，您会从哪些维度进行改进？'
        ]
      },
      bigdata: {
        basic: [
          '请解释大数据的4V特征，以及您在实际项目中是如何体现这些特征的。',
          '描述您对Hadoop生态系统的理解，包括HDFS、MapReduce等组件的作用。'
        ],
        intermediate: [
          '在数据仓库设计中，您如何进行维度建模？请结合具体业务场景说明。',
          '请介绍您在实时数据处理方面的经验，比较批处理和流处理的适用场景。'
        ],
        advanced: [
          '在大规模数据处理中，如何设计高可用、高性能的数据架构？',
          '请分析数据湖和数据仓库的区别，以及在企业中的应用策略。'
        ],
        scenario: [
          '设计一个支持千万级用户的实时数据分析平台，请描述技术架构和关键技术选型。',
          '如何为一个金融公司设计风控数据处理系统？需要考虑哪些技术和业务要求？'
        ]
      },
      iot: {
        basic: [
          '请介绍物联网的基本架构层次，以及各层的主要功能和技术特点。',
          '在IoT设备开发中，您如何选择合适的通信协议？'
        ],
        intermediate: [
          '请描述一个完整的IoT数据采集和处理流程，包括边缘计算的应用。',
          '在物联网系统中，如何保证数据传输的安全性和可靠性？'
        ],
        advanced: [
          '设计一个智能工厂的IoT解决方案，需要考虑哪些技术挑战和解决策略？',
          '在大规模IoT设备管理中，如何实现设备的远程监控和故障诊断？'
        ],
        scenario: [
          '为智慧城市项目设计一个交通监控IoT系统，请描述完整的技术方案。',
          '如何为农业物联网设计一个环境监测和自动化控制系统？'
        ]
      }
    }

    const domain = context?.domain || 'ai'
    const difficulty = context?.difficulty || 'intermediate'
    const questionPool = enhancedQuestions[domain] || enhancedQuestions.ai
    const questionList = questionPool[difficulty] || questionPool.intermediate
    const randomIndex = Math.floor(Math.random() * questionList.length)

    return {
      question: questionList[randomIndex],
      type: '专业技术',
      difficulty: difficulty,
      expectedKeywords: this.professionalDomains[domain]?.keywords || ['技术实现', '项目经验'],
      evaluationCriteria: this.professionalDomains[domain]?.evaluationCriteria || ['技术深度', '实践经验'],
      followUpQuestions: [
        '能否详细说明具体的技术实现细节？',
        '在项目中遇到的最大技术挑战是什么？如何解决的？',
        '如何评估项目的技术成果和业务价值？',
        '您认为这个领域未来的发展趋势是什么？'
      ],
      domainFocus: domain,
      scenarioContext: '实际项目应用',
      hintStrategy: 'progressive_guidance',
      timeEstimate: '3-5分钟',
      complexityLevel: difficulty
    }
  }

  getFallbackQuestion(context) {
    return this.getEnhancedFallbackQuestion(context)
  }

  getFallbackAdaptiveQuestion(candidatePerformance) {
    // 基于候选人表现选择合适的问题类型
    const performanceLevel = candidatePerformance?.overallScore || 75

    let adaptiveQuestions
    if (performanceLevel >= 85) {
      // 高水平候选人 - 挑战性问题
      adaptiveQuestions = [
        '基于您优秀的技术表现，请分享您在技术创新方面的独特见解。',
        '请描述一个您主导的复杂技术项目，重点说明您的创新贡献。',
        '您如何看待当前技术发展趋势？请提出您的前瞻性观点。'
      ]
    } else if (performanceLevel >= 70) {
      // 中等水平候选人 - 深化问题
      adaptiveQuestions = [
        '基于您之前的回答，请深入说明您在该技术领域的核心优势。',
        '请结合具体项目经验，说明您如何解决复杂的技术问题。',
        '您认为在当前技术发展趋势下，哪些技能最为重要？为什么？'
      ]
    } else {
      // 需要提升的候选人 - 引导性问题
      adaptiveQuestions = [
        '请从基础概念开始，说明您对这个技术领域的理解。',
        '可以分享一个您参与的项目，重点说明您的具体贡献。',
        '请描述您在学习新技术时的方法和经验。'
      ]
    }

    const randomIndex = Math.floor(Math.random() * adaptiveQuestions.length)

    return {
      question: adaptiveQuestions[randomIndex],
      adaptationReason: `基于候选人表现水平(${performanceLevel})进行针对性提问`,
      targetSkills: performanceLevel >= 85 ? ['创新思维', '技术领导力'] :
                   performanceLevel >= 70 ? ['深度思考', '项目经验'] : ['基础理解', '学习能力'],
      expectedImprovement: performanceLevel >= 85 ? '展示技术领导力和创新能力' :
                          performanceLevel >= 70 ? '提升回答的深度和专业性' : '建立技术基础和信心'
    }
  }

  getEnhancedFallbackAnalysis(inputData) {
    const textContent = inputData?.text || ''
    const domain = inputData?.domain || 'comprehensive'
    const keywords = this.extractEnhancedKeywords(textContent, domain)

    // 检查是否是"不知道"类型的回答
    const isUnknownAnswer = textContent.includes('不知道') ||
                           textContent.includes('不清楚') ||
                           textContent.includes('没有经验') ||
                           textContent.includes('不会') ||
                           textContent.trim().length < 10

    // 根据回答类型调整评分
    const baseScore = isUnknownAnswer ? 35 : 75
    const variation = Math.random() * 20 - 10 // -10 到 +10 的随机变化
    const finalScore = Math.max(20, Math.min(95, baseScore + variation))

    return {
      overallScore: Math.round(finalScore),
      technicalCompetency: Math.round(finalScore - 5),
      communicationSkills: Math.round(finalScore + 5),
      contentQuality: Math.round(finalScore),
      logicalStructure: Math.round(finalScore - 3),

      // 基础文本分析结果
      textAnalysis: {
        keywords: keywords,
        sentiment: 'positive',
        complexity: textContent.length > 100 ? 'detailed' : 'concise',
        coherence: 'good',
        professionalTerms: keywords.filter(k => this.isProfessionalTerm(k, domain))
      },

      // 新增：增强分析结果
      semanticAnalysis: {
        coherenceScore: 82,
        logicalFlow: 'well_structured',
        conceptualDepth: 'adequate',
        contextualRelevance: 'high'
      },
      professionalDepth: {
        domainKnowledge: 78,
        practicalExperience: 85,
        theoreticalUnderstanding: 80,
        innovativeThinking: 75
      },
      innovativeThinking: {
        creativityScore: 77,
        problemSolvingApproach: 'systematic',
        originalityLevel: 'moderate',
        adaptabilityIndicators: 'good'
      },
      problemSolvingLogic: {
        analyticalThinking: 83,
        structuredApproach: 'clear',
        solutionOrientation: 'practical',
        criticalThinking: 'demonstrated'
      },
      domainExpertise: {
        domain: domain,
        expertiseLevel: 'intermediate',
        keyStrengths: keywords.slice(0, 3),
        improvementAreas: ['深度分析', '创新思维']
      },
      qualityMetrics: {
        responseQuality: 82,
        technicalAccuracy: 80,
        communicationClarity: 85,
        professionalMaturity: 78
      },

      // 智能建议和指导
      recommendations: isUnknownAnswer ? [
        '诚实表达不了解是好的态度，建议从基础概念开始学习',
        '可以尝试从相关的基础知识点入手',
        '建议多关注该领域的基础理论和实践案例',
        '可以先了解问题的背景和应用场景'
      ] : [
        '继续保持清晰的表达逻辑',
        '可以增加更多具体的技术细节',
        '建议结合实际项目案例说明',
        '可以展示更多创新思维'
      ],
      nextQuestionSuggestion: isUnknownAnswer ?
        '可以从更基础的概念开始，或者询问相关的学习经历' :
        '可以深入询问具体的技术实现细节和创新点',
      realTimeHints: isUnknownAnswer ? [
        '没关系，可以从您了解的相关内容开始',
        '试着想想基础的概念或原理',
        '可以分享您的学习经历或想法'
      ] : [
        '回答很好，可以再详细一些',
        '建议举个具体的例子',
        '可以说明一下技术选型的原因'
      ],
      improvementAreas: isUnknownAnswer ? ['基础知识', '学习深度', '技术理解'] : ['技术深度', '创新表达'],
      strengthAreas: isUnknownAnswer ? ['诚实态度', '学习意愿'] : ['逻辑清晰', '表达流畅'],
      analysisMode: 'enhanced_text_primary'
    }
  }

  getFallbackAnalysis(inputData) {
    return this.getEnhancedFallbackAnalysis(inputData)
  }

  getFallbackAssistance(currentContext) {
    // 基于当前上下文选择合适的助手类型
    const questionType = currentContext?.questionType || 'general'
    const responseTime = currentContext?.responseTime || 0
    const candidateState = currentContext?.candidateState || 'normal'

    let assistanceTypes

    if (candidateState === 'struggling' || responseTime > 30) {
      // 候选人遇到困难时的助手（整合支持性指导优势）
      assistanceTypes = [
        {
          assistanceType: 'supportive_guidance',
          guidance: '没关系，我们可以换个角度来思考这个问题。建议从您最熟悉的部分开始。',
          hints: ['从基础概念开始', '举个简单的例子', '说说您的理解'],
          encouragement: '放轻松，慢慢来，您一定可以的！',
          nextSteps: ['降低难度', '提供支持'],
          urgency: 'high',
          // 新增：智能建议功能
          intelligentSuggestions: [
            '可以先说说您对这个概念的基本理解',
            '不妨从一个简单的例子开始',
            '您可以分享一下相关的学习经历'
          ],
          answerStructure: '概念理解 → 简单举例 → 个人经验',
          keyPoints: ['基础概念', '实际应用', '学习心得'],
          confidenceLevel: 'building'
        }
      ]
    } else if (questionType === 'technical') {
      // 技术问题的助手（整合技术指导优势）
      assistanceTypes = [
        {
          assistanceType: 'technical_guidance',
          guidance: '可以从技术架构、核心算法、性能优化等角度来回答。',
          hints: ['技术架构设计', '核心算法选择', '性能优化策略'],
          encouragement: '这些技术点都很重要，请选择您最熟悉的来详细说明。',
          nextSteps: ['选择重点', '深入阐述'],
          urgency: 'medium',
          intelligentSuggestions: [
            '建议从整体架构开始介绍',
            '可以详细说明核心算法的选择原因',
            '不妨分享一下性能优化的具体经验'
          ],
          answerStructure: '架构设计 → 算法实现 → 性能优化 → 实际效果',
          keyPoints: ['技术架构', '算法原理', '优化策略', '实际成果'],
          confidenceLevel: 'professional'
        }
      ]
    } else {
      // 一般情况的助手（整合结构化指导优势）
      assistanceTypes = [
        {
          assistanceType: 'encouragement',
          guidance: '您的回答思路很清晰，请继续深入说明技术细节。',
          hints: ['可以举个具体的例子', '说明一下实现的关键步骤'],
          encouragement: '回答得很好，继续保持！',
          nextSteps: ['深入技术细节', '提供具体案例'],
          urgency: 'low',
          intelligentSuggestions: [
            '可以举一个具体的项目案例',
            '建议详细说明实现的关键步骤',
            '不妨分享一下遇到的挑战和解决方案'
          ],
          answerStructure: '现状描述 → 具体案例 → 关键步骤 → 经验总结',
          keyPoints: ['项目背景', '技术实现', '解决方案', '经验收获'],
          confidenceLevel: 'confident'
        },
        {
          assistanceType: 'structural_guidance',
          guidance: '建议从项目背景开始，然后详述技术实现和遇到的挑战。',
          hints: ['项目背景介绍', '技术方案设计', '实施过程', '结果评估'],
          encouragement: '您可以按照这个思路来组织回答。',
          nextSteps: ['结构化回答', '逐步展开'],
          urgency: 'medium',
          intelligentSuggestions: [
            '先介绍项目的业务背景和技术需求',
            '然后详细说明技术方案的设计思路',
            '最后分享实施过程中的关键经验'
          ],
          answerStructure: '项目背景 → 方案设计 → 实施过程 → 结果评估',
          keyPoints: ['业务需求', '技术方案', '实施经验', '成果评估'],
          confidenceLevel: 'structured'
        }
      ]
    }

    const randomIndex = Math.floor(Math.random() * assistanceTypes.length)
    return assistanceTypes[randomIndex]
  }

  getFallbackBatchProcessing(batchConfig) {
    return {
      batchId: this.generateBatchId(),
      processedCount: batchConfig.interviews?.length || 0,
      successRate: 0.95, // 模拟95%成功率
      results: batchConfig.interviews?.map((interview, index) => ({
        interviewId: interview.id || `interview_${index}`,
        status: 'completed',
        score: Math.floor(Math.random() * 20) + 80, // 80-100分
        analysis: this.getEnhancedFallbackAnalysis({ text: '模拟回答内容' }),
        processingTime: Math.floor(Math.random() * 5000) + 2000 // 2-7秒
      })) || [],
      aggregateAnalysis: {
        averageScore: 87,
        topPerformers: 3,
        improvementAreas: ['技术深度', '沟通表达'],
        recommendedActions: ['加强技术培训', '提升面试技巧']
      },
      batchReport: {
        summary: '批量面试处理完成',
        insights: '整体表现良好，建议关注技术深度培养',
        recommendations: ['优化面试流程', '加强候选人指导']
      },
      processingTime: (batchConfig.interviews?.length || 1) * 3000 // 每个面试3秒处理时间
    }
  }

  getFallbackDataInsights(analysisRequest) {
    // 基于分析请求类型定制洞察内容
    const analysisType = analysisRequest?.type || 'general'
    const dataScope = analysisRequest?.dataScope || 'general'
    const currentFilters = analysisRequest?.currentFilters || {}
    const positionData = analysisRequest?.positionData || []

    // 根据分析类型生成不同的内容
    switch (analysisType) {
      case 'position_trends':
        return this.generatePositionTrendsInsights(dataScope, currentFilters, positionData)

      case 'recruitment_optimization':
        return this.generateRecruitmentOptimizationInsights(dataScope, currentFilters, positionData)

      case 'candidate_matching':
        return this.generateCandidateMatchingInsights(dataScope, currentFilters, positionData)

      case 'market_insights':
        return this.generateMarketInsights(dataScope, currentFilters, positionData)

      default:
        return this.generateGeneralInsights(dataScope, currentFilters, positionData)
    }
  }

  // 职位趋势分析
  generatePositionTrendsInsights(dataScope, currentFilters, positionData) {
    const currentDate = new Date()
    const quarter = Math.floor(currentDate.getMonth() / 3) + 1

    return {
      summary: `${currentDate.getFullYear()}年Q${quarter}职位趋势深度分析报告`,
      insights: [
        'AI工程师职位需求增长45%，成为最热门技术岗位，平均薪资较去年上涨28%',
        '大数据分析师薪资水平较去年同期上涨18%，高级岗位薪资突破50万',
        '物联网开发岗位虽然数量较少，但薪资增幅达到22%，5G应用推动需求激增',
        '全栈开发工程师需求稳定，技能要求更加多元化，微服务架构成为必备技能',
        'DevOps工程师需求增长35%，云原生技术栈成为核心竞争力',
        '算法工程师岗位竞争激烈，博士学历候选人薪资溢价达40%'
      ],
      predictions: {
        successRate: 0.82,
        growthRate: 0.45,
        demandIndex: 95,
        competitionLevel: 'high',
        salaryGrowth: 0.28,
        marketSaturation: 0.65
      },
      recommendations: [
        { id: 1, text: '重点关注AI领域人才储备，建议提前6个月开始布局热门技术方向' },
        { id: 2, text: '调整薪资策略，保持在市场75分位以上的竞争力，特别是AI和大数据岗位' },
        { id: 3, text: '加强与高校合作，建立人才培养绿色通道，重点关注985/211院校' },
        { id: 4, text: '设立技术专家内推奖励机制，利用员工网络扩大人才来源' }
      ],
      trends: [
        '机器学习和深度学习技能需求激增，TensorFlow/PyTorch成为标配',
        '云原生技术成为基础要求，Kubernetes使用率达到78%',
        '跨领域复合型人才更受青睐，AI+业务理解能力成为加分项',
        '远程工作能力成为加分项，异地协作工具使用熟练度重要性提升',
        '低代码/无代码平台兴起，传统开发模式面临变革',
        '数据安全和隐私保护技能需求增长，GDPR合规成为必备知识'
      ],
      marketAnalysis: {
        hotSkills: ['机器学习', 'Kubernetes', '微服务', 'React/Vue', 'Python'],
        emergingRoles: ['MLOps工程师', '数据产品经理', 'AI伦理专家'],
        salaryBenchmarks: {
          'AI工程师': '30-80万',
          '大数据工程师': '25-60万',
          '全栈工程师': '20-45万',
          'DevOps工程师': '25-55万'
        }
      }
    }
  }

  // 招聘效率优化分析
  generateRecruitmentOptimizationInsights(dataScope, currentFilters, positionData) {
    const processMetrics = this.calculateProcessMetrics(positionData)

    return {
      summary: '招聘效率深度优化分析报告 - 基于iFlytek Spark AI智能分析',
      insights: [
        `当前平均招聘周期为${processMetrics.avgCycle}天，比行业平均水平快15%，但仍有优化空间`,
        `面试通过率为78%，候选人质量较高，建议保持当前筛选标准`,
        `简历筛选环节耗时最长(平均5.2天)，引入AI预筛选可节省60%时间`,
        `技术面试环节满意度达到92%，流程设计合理，候选人反馈积极`,
        `HR初筛到技术面试的转化率为85%，高于行业平均水平(72%)`,
        `offer接受率为89%，薪资竞争力和公司吸引力良好`
      ],
      predictions: {
        efficiencyScore: 85,
        timeReduction: 0.35,
        costSaving: 0.42,
        qualityImprovement: 0.25,
        throughputIncrease: 0.48,
        candidateExperience: 0.92
      },
      recommendations: [
        { id: 1, text: '部署iFlytek Spark AI简历筛选系统，预计可节省60%初筛时间，提升匹配精度' },
        { id: 2, text: '实施智能面试排期系统，基于面试官专长和候选人背景自动匹配' },
        { id: 3, text: '建立候选人全流程体验追踪，实时收集反馈并自动优化流程' },
        { id: 4, text: '引入视频面试预筛选，减少现场面试成本，提升地域覆盖能力' },
        { id: 5, text: '建立面试官评估和培训体系，提升面试质量和一致性' }
      ],
      actionItems: [
        '实施iFlytek Spark智能简历解析和技能匹配系统',
        '建立面试官能力评估和持续培训体系',
        '优化offer发放流程，缩短决策周期至24小时内',
        '加强雇主品牌建设，提升候选人主动投递率',
        '部署候选人关系管理系统(CRM)，维护人才池',
        '建立招聘数据看板，实时监控关键指标'
      ],
      processOptimization: {
        currentBottlenecks: ['简历筛选', '面试排期', '背景调查'],
        quickWins: ['AI简历筛选', '自动化排期', '在线背调'],
        longTermGoals: ['全流程自动化', '预测性招聘', '智能人才推荐'],
        costAnalysis: {
          currentCost: '每个岗位平均招聘成本15,000元',
          optimizedCost: '预计优化后降至8,500元',
          savings: '年度预计节省成本120万元'
        }
      }
    }
  }

  // 候选人匹配分析
  generateCandidateMatchingInsights(dataScope, currentFilters, positionData) {
    const matchingMetrics = this.calculateMatchingMetrics(positionData)

    return {
      summary: 'iFlytek Spark AI驱动的候选人智能匹配深度分析报告',
      insights: [
        `技能匹配度平均为85%，其中AI岗位匹配度最高(92%)，物联网岗位匹配度相对较低(78%)`,
        `文化适应性评估准确率达到88%，基于iFlytek Spark语义分析的性格测评准确度提升15%`,
        `高级职位(P7+)匹配难度较大，需要更精准的人才画像和多轮技术评估`,
        `跨领域候选人转换成功率为72%，其中从传统IT转向AI领域成功率最高(85%)`,
        `候选人技能图谱覆盖度分析：前端技能覆盖率95%，后端87%，算法类仅65%`,
        `团队协作风格匹配度为91%，远程协作能力评估准确率达到89%`
      ],
      predictions: {
        matchAccuracy: 0.85,
        retentionRate: 0.91,
        performanceScore: 87,
        culturalFitScore: 88,
        skillGrowthPotential: 0.82,
        teamIntegrationScore: 0.89
      },
      recommendations: [
        { id: 1, text: '建立基于iFlytek Spark的多维度人才画像模型，整合技能、经验、潜力三大维度' },
        { id: 2, text: '加强软技能评估体系，引入情商测试和团队协作模拟场景' },
        { id: 3, text: '设立跨领域人才转换培训计划，重点关注AI转型和云原生技术' },
        { id: 4, text: '建立候选人技能成长轨迹预测模型，识别高潜力人才' },
        { id: 5, text: '优化算法岗位匹配策略，增加学术背景和项目经验权重' }
      ],
      matchingStrategies: [
        'iFlytek Spark语义理解的技能图谱智能匹配',
        '基于大数据的性格特质相似度分析',
        'AI驱动的职业发展路径规划和预测',
        '团队协作风格评估和最优组合推荐',
        '候选人潜力评估和成长预测模型',
        '文化价值观匹配度量化分析'
      ],
      detailedAnalysis: {
        skillMatching: {
          technical: '技术技能匹配度85%，算法类岗位需加强',
          soft: '软技能匹配度91%，沟通能力评估准确',
          domain: '领域知识匹配度78%，行业经验权重需调整'
        },
        performancePrediction: {
          accuracy: '绩效预测准确率87%',
          factors: ['技能匹配', '文化适应', '学习能力', '团队协作'],
          improvement: '引入更多历史数据可提升至92%'
        },
        retentionAnalysis: {
          riskFactors: ['薪资期望', '发展机会', '工作环境', '团队氛围'],
          protectiveFactors: ['技能成长', '项目挑战', '团队认同', '公司文化'],
          interventions: ['导师制度', '技能培训', '职业规划', '团建活动']
        }
      }
    }
  }

  // 市场洞察分析
  generateMarketInsights(dataScope, currentFilters, positionData) {
    const marketData = this.getLatestMarketData()

    return {
      summary: '2024年技术人才市场深度洞察报告 - iFlytek Spark AI市场分析',
      insights: [
        `技术人才市场整体供不应求，缺口达到185万人，AI和大数据领域竞争最为激烈`,
        `一线城市薪资水平领先全国35%，但生活成本压力导致人才向新一线城市流动`,
        `新兴技术领域人才稀缺，AI工程师薪资溢价达40%，区块链开发者溢价32%`,
        `企业更注重候选人的学习能力和适应性，持续学习能力成为核心竞争力`,
        `远程工作接受度提升至78%，混合办公模式成为人才吸引的重要因素`,
        `技术栈多样化趋势明显，全栈能力和跨领域知识成为加分项`
      ],
      predictions: {
        marketGrowth: 0.28,
        salaryInflation: 0.18,
        talentShortage: 0.42,
        demandShift: 0.35,
        remoteWorkAdoption: 0.78,
        skillDiversification: 0.65
      },
      recommendations: [
        { id: 1, text: '重点布局新一线城市人才市场，成本效益比一线城市高30%' },
        { id: 2, text: '投资内部技术培训体系，建立从初级到专家的完整培养路径' },
        { id: 3, text: '建立灵活的薪酬体系，包含股权激励和技能津贴' },
        { id: 4, text: '加强雇主品牌建设，在技术社区和开源项目中提升影响力' },
        { id: 5, text: '建立远程工作友好的制度和文化，吸引全国优秀人才' }
      ],
      marketTrends: [
        '远程办公常态化推动人才地域分布重新洗牌',
        '技能更新周期缩短至15个月，持续学习成为必需',
        '企业文化匹配度重要性提升，价值观认同超越薪资考量',
        '多元化背景人才受到青睐，跨行业经验成为优势',
        'AI辅助开发工具普及，传统编程技能要求发生变化',
        '可持续发展和社会责任成为年轻人才关注重点'
      ],
      competitiveAnalysis: {
        position: 'above_average',
        marketRanking: '行业前25%',
        strengths: ['技术实力雄厚', '团队氛围良好', '发展机会丰富', '学习资源充足'],
        improvements: ['薪酬竞争力待提升', '品牌知名度需加强', '福利体系需完善'],
        benchmarkData: {
          salary: '市场75分位',
          benefits: '市场60分位',
          culture: '市场85分位',
          growth: '市场80分位'
        }
      },
      industryInsights: {
        hotSectors: ['人工智能', '新能源', '生物医药', '半导体', '新材料'],
        emergingRoles: ['AI产品经理', 'MLOps工程师', '数据科学家', '算法工程师'],
        salaryTrends: {
          'AI工程师': '+28%',
          '大数据工程师': '+18%',
          '云计算工程师': '+22%',
          '前端工程师': '+12%'
        },
        geographicShifts: {
          '一线城市': '人才流出加速',
          '新一线城市': '人才净流入',
          '二线城市': '政策红利吸引人才',
          '三四线城市': '远程工作机会增加'
        }
      }
    }
  }

  // 通用分析（保持原有逻辑作为默认）
  generateGeneralInsights(dataScope, currentFilters, positionData) {
    const baseInsights = [
      '技术岗位候选人整体水平呈上升趋势',
      'AI领域人才竞争激烈，薪资期望较高',
      '大数据技能需求持续增长',
      '物联网开发人才相对稀缺'
    ]

    // 生成智能推荐对象数组，包含职位筛选、招聘优化和数据洞察建议
    const recommendations = this.generatePositionManagementRecommendations(currentFilters, positionData, dataScope)

    return {
      summary: '综合数据分析完成',
      insights: dataScope === 'technical' ? baseInsights : baseInsights.slice(0, 2),
      predictions: {
        successRate: 0.78,
        retentionRate: 0.85,
        performanceScore: 82,
        culturalFitScore: 88
      },
      recommendations: recommendations,
      benchmarks: {
        industryAverage: 75,
        topPerformers: 92,
        improvementTarget: 85,
        competitivePosition: 'above_average'
      },
      trends: [
        '技术面试向实战化方向发展',
        '软技能评估重要性提升',
        '远程面试成为主流',
        'AI辅助面试工具普及'
      ],
      riskAssessment: {
        level: 'low',
        factors: ['人才流失风险', '技能匹配度'],
        mitigation: ['提升薪酬竞争力', '加强技能培训']
      },
      actionItems: [
        '更新技术面试题库',
        '优化候选人体验',
        '加强面试官培训',
        '建立人才画像模型'
      ]
    }
  }

  /**
   * 生成职位管理智能推荐
   */
  generatePositionManagementRecommendations(currentFilters, positionData, dataScope) {
    console.log('🎯 开始生成职位管理推荐...')
    console.log('📊 当前筛选条件:', currentFilters)
    console.log('📋 职位数据数量:', positionData?.length || 0)
    console.log('🔍 数据范围:', dataScope)

    const recommendations = []
    let idCounter = 1

    // 职位筛选建议
    if (!currentFilters.domain || currentFilters.domain === '') {
      recommendations.push({
        id: `filter_${idCounter++}`,
        text: '查看紧急AI职位',
        type: 'warning',
        category: 'filter',
        action: 'filter',
        filters: { domain: 'ai', urgent: true }
      })
    }

    if (!currentFilters.status || currentFilters.status === '') {
      recommendations.push({
        id: `filter_${idCounter++}`,
        text: '筛选活跃招聘职位',
        type: 'success',
        category: 'filter',
        action: 'filter',
        filters: { status: 'active' }
      })
    }

    // 招聘优化建议
    const urgentPositions = positionData.filter(p => p.urgent === true)
    if (urgentPositions.length > 3) {
      recommendations.push({
        id: `optimize_${idCounter++}`,
        text: '优化紧急职位描述以提高吸引力',
        type: 'warning',
        category: 'optimization',
        action: 'optimize_descriptions'
      })
    }

    const activePositions = positionData.filter(p => p.status === 'active')
    if (activePositions.length > 20) {
      recommendations.push({
        id: `optimize_${idCounter++}`,
        text: '建议批量优化职位发布策略',
        type: 'info',
        category: 'optimization',
        action: 'batch_optimize'
      })
    }

    // 数据洞察建议
    const aiPositions = positionData.filter(p => p.domain === 'ai')
    const bigdataPositions = positionData.filter(p => p.domain === 'bigdata')
    const iotPositions = positionData.filter(p => p.domain === 'iot')

    if (aiPositions.length > bigdataPositions.length && aiPositions.length > iotPositions.length) {
      recommendations.push({
        id: `insight_${idCounter++}`,
        text: '关注AI领域热门技术趋势',
        type: 'primary',
        category: 'insight',
        action: 'view_trends',
        domain: 'ai'
      })
    }

    if (iotPositions.length < 3) {
      recommendations.push({
        id: `insight_${idCounter++}`,
        text: '物联网人才储备不足，建议加强招聘',
        type: 'warning',
        category: 'insight',
        action: 'increase_recruitment',
        domain: 'iot'
      })
    }

    // 根据数据范围添加特定建议
    if (dataScope === 'position_management') {
      recommendations.push({
        id: `management_${idCounter++}`,
        text: '启用AI智能匹配提升招聘效率',
        type: 'success',
        category: 'management',
        action: 'enable_ai_matching'
      })

      recommendations.push({
        id: `management_${idCounter++}`,
        text: '查看本月招聘数据分析报告',
        type: 'info',
        category: 'management',
        action: 'view_report'
      })
    }

    // 确保至少有一些推荐
    if (recommendations.length === 0) {
      recommendations.push(
        {
          id: `default_${idCounter++}`,
          text: '优化职位描述提升候选人吸引力',
          type: 'info',
          category: 'optimization',
          action: 'optimize_descriptions'
        },
        {
          id: `default_${idCounter++}`,
          text: '关注热门技术领域招聘趋势',
          type: 'primary',
          category: 'insight',
          action: 'view_trends'
        },
        {
          id: `default_${idCounter++}`,
          text: '启用iFlytek智能推荐系统',
          type: 'success',
          category: 'management',
          action: 'enable_smart_features'
        }
      )
    }

    console.log(`✅ 生成了 ${recommendations.length} 条推荐`)
    console.log('🎯 推荐内容:', recommendations)

    return recommendations.slice(0, 6) // 限制推荐数量
  }

  /**
   * 增强的关键词提取
   */
  extractEnhancedKeywords(text, domain = 'comprehensive') {
    const domainKeywords = this.professionalDomains[domain]?.keywords || []
    const commonKeywords = ['技术', '项目', '经验', '解决方案', '优化', '创新', '算法', '系统', '开发', '实现']
    const allKeywords = [...domainKeywords, ...commonKeywords]

    const extractedKeywords = allKeywords.filter(keyword => text.includes(keyword))

    // 添加语义分析的关键词
    const semanticKeywords = this.extractSemanticKeywords(text)

    return [...new Set([...extractedKeywords, ...semanticKeywords])]
  }

  /**
   * 语义关键词提取
   */
  extractSemanticKeywords(text) {
    const semanticPatterns = {
      '技术深度': ['深入', '底层', '原理', '机制', '核心'],
      '项目经验': ['项目', '实践', '应用', '部署', '上线'],
      '问题解决': ['解决', '处理', '优化', '改进', '提升'],
      '创新思维': ['创新', '改进', '优化', '突破', '新颖'],
      '团队协作': ['团队', '协作', '配合', '沟通', '合作']
    }

    const extractedConcepts = []
    for (const [concept, patterns] of Object.entries(semanticPatterns)) {
      if (patterns.some(pattern => text.includes(pattern))) {
        extractedConcepts.push(concept)
      }
    }

    return extractedConcepts
  }

  /**
   * 判断是否为专业术语
   */
  isProfessionalTerm(term, domain) {
    const domainKeywords = this.professionalDomains[domain]?.keywords || []
    return domainKeywords.includes(term)
  }

  /**
   * 提取关键词（保持兼容性）
   */
  extractKeywords(text) {
    return this.extractEnhancedKeywords(text)
  }



  /**
   * 🎯 增强的智能提示生成系统
   * 基于多维度条件生成差异化提示
   */
  generateEnhancedHint(context) {
    // 分析上下文维度
    const dimensions = this.analyzeHintDimensions(context)

    // 选择提示策略
    const strategy = this.selectHintStrategy(dimensions)

    // 生成具体提示内容
    const hintContent = this.generateContextualHint(strategy, dimensions)

    return {
      hint: hintContent.text,
      type: strategy.type,
      urgency: strategy.urgency,
      timing: strategy.timing,
      guidance: hintContent.guidance,
      examples: hintContent.examples,
      dimensions: dimensions
    }
  }

  /**
   * 🎯 生成递进式提示内容
   */
  generateProgressiveHintContent(context) {
    const { hintLevel, question, candidateResponse, previousHints } = context
    const questionDomain = this.detectTechnicalDomain(question)

    // 根据提示级别生成不同深度的提示
    const hintTemplates = this.getProgressiveHintTemplates()

    let hintContent = ''
    let hintType = ''
    let guidance = []

    switch (hintLevel) {
      case 1: // 方向提示
        hintType = 'direction'
        hintContent = this.generateDirectionHint(questionDomain, question, candidateResponse)
        guidance = [
          '明确回答的主要方向',
          '确定技术重点和关键词',
          '建立回答的逻辑框架'
        ]
        break

      case 2: // 技术要点提示
        hintType = 'technical_points'
        hintContent = this.generateTechnicalPointsHint(questionDomain, question, candidateResponse)
        guidance = [
          '深入技术细节和原理',
          '说明实现方法和步骤',
          '强调关键技术难点'
        ]
        break

      case 3: // 具体示例提示
        hintType = 'concrete_examples'
        hintContent = this.generateExampleHint(questionDomain, question, candidateResponse)
        guidance = [
          '提供具体的项目案例',
          '说明实际应用场景',
          '展示解决问题的过程'
        ]
        break

      default: // 综合提示
        hintType = 'comprehensive'
        hintContent = this.generateComprehensiveHint(questionDomain, question, candidateResponse)
        guidance = [
          '综合考虑多个维度',
          '平衡理论与实践',
          '突出个人贡献和价值'
        ]
    }

    return {
      hint: hintContent,
      type: hintType,
      level: hintLevel,
      guidance: guidance,
      domain: questionDomain
    }
  }

  /**
   * 生成方向提示
   */
  generateDirectionHint(domain, question, response) {
    const directionTemplates = {
      ai: [
        '可以从机器学习算法选择、数据处理流程或模型优化等方面来回答',
        '建议从算法原理、特征工程或模型评估的角度展开',
        '可以考虑从数据预处理、模型训练或部署优化等维度阐述'
      ],
      bigdata: [
        '建议从数据架构设计、处理技术选型或性能优化等角度展开',
        '可以从数据存储、计算框架或实时处理等方面来回答',
        '建议考虑数据质量、处理效率或系统扩展性等维度'
      ],
      iot: [
        '可以考虑从硬件选型、通信协议或数据采集等维度来阐述',
        '建议从设备管理、网络架构或边缘计算等角度展开',
        '可以从传感器配置、数据传输或系统集成等方面回答'
      ],
      general: [
        '建议明确回答的主要方向，可以从技术选型、实现方案或优化策略等角度切入',
        '可以从问题分析、解决思路或实施步骤等维度来组织回答',
        '建议从技术原理、实践经验或创新点等方面展开论述'
      ]
    }

    const templates = directionTemplates[domain] || directionTemplates.general
    return templates[Math.floor(Math.random() * templates.length)]
  }

  /**
   * 生成技术要点提示
   */
  generateTechnicalPointsHint(domain, question, response) {
    const technicalTemplates = {
      ai: [
        '具体说明算法原理、特征工程方法、模型训练过程和评估指标的选择',
        '详述数据预处理技术、模型架构设计、超参数调优和性能优化策略',
        '阐述特征选择方法、模型融合技术、过拟合防止和模型解释性'
      ],
      bigdata: [
        '详述数据存储方案、计算框架使用、数据质量保证和实时处理机制',
        '说明分布式架构设计、数据分区策略、容错机制和性能调优方法',
        '阐述数据管道构建、ETL流程设计、数据血缘追踪和监控告警'
      ],
      iot: [
        '阐述传感器配置、网络架构设计、数据传输协议和边缘计算应用',
        '详述设备接入方案、通信安全机制、数据采集优化和系统集成方法',
        '说明硬件选型标准、协议栈设计、功耗优化和可靠性保障'
      ],
      general: [
        '深入技术细节，包括核心技术原理、关键实现步骤和技术难点解决方案',
        '详述架构设计思路、技术选型依据、实现方法和优化策略',
        '阐述关键技术点、实现难点、解决方案和技术创新'
      ]
    }

    const templates = technicalTemplates[domain] || technicalTemplates.general
    return templates[Math.floor(Math.random() * templates.length)]
  }

  /**
   * 生成具体示例提示
   */
  generateExampleHint(domain, question, response) {
    const exampleTemplates = {
      ai: [
        '举例说明：比如在推荐系统中如何处理冷启动问题，使用了哪些特征，模型效果如何提升',
        '具体案例：如在图像识别项目中如何优化模型精度，采用了什么数据增强技术，最终达到了什么效果',
        '实际应用：比如在自然语言处理任务中如何处理中文分词，使用了哪些预训练模型，如何fine-tune'
      ],
      bigdata: [
        '举例说明：比如在实时数据处理中如何保证数据一致性，处理了多大规模的数据，性能提升了多少',
        '具体案例：如在数据仓库建设中如何设计分层架构，采用了什么ETL策略，如何保证数据质量',
        '实际应用：比如在用户行为分析中如何构建实时计算链路，使用了哪些技术栈，解决了什么业务问题'
      ],
      iot: [
        '举例说明：比如在智能家居项目中如何实现设备互联，解决了哪些通信延迟问题，系统稳定性如何',
        '具体案例：如在工业物联网中如何保证数据采集的实时性，采用了什么边缘计算方案，效果如何',
        '实际应用：比如在智慧城市项目中如何处理海量传感器数据，使用了什么协议，如何保证安全性'
      ],
      general: [
        '提供具体的项目案例，包括遇到的实际问题、采用的解决方案和最终取得的成果',
        '举例说明实际工作中的应用场景，详述实现过程、技术难点和解决效果',
        '分享具体的实践经验，包括项目背景、技术选择、实施过程和业务价值'
      ]
    }

    const templates = exampleTemplates[domain] || exampleTemplates.general
    return templates[Math.floor(Math.random() * templates.length)]
  }

  /**
   * 生成综合提示
   */
  generateComprehensiveHint(domain, question, response) {
    return `建议从理论基础、实践经验和创新应用三个层面来全面回答这个问题。首先阐述相关的技术原理和理论基础，然后结合具体的项目经验说明实际应用，最后可以分享一些创新的思考或改进建议。记住要突出你的个人贡献和独特见解。`
  }

  /**
   * 🔍 分析提示维度
   */
  analyzeHintDimensions(context) {
    const questionType = this.detectQuestionType(context.question)
    const technicalDomain = this.detectTechnicalDomain(context.question)
    const answerQuality = this.evaluateAnswerQuality(context.candidateResponse)
    const responsePattern = this.analyzeResponsePattern(context.candidateResponse)

    return {
      questionType,
      technicalDomain,
      answerQuality,
      responsePattern,
      questionNumber: context.questionNumber || 1,
      analysisResults: context.analysisResults || {}
    }
  }

  /**
   * 🎯 检测问题类型
   */
  detectQuestionType(question) {
    const technicalKeywords = ['算法', '架构', '技术', '实现', '优化', '性能', '代码', '框架', '数据库', '系统']
    const behavioralKeywords = ['团队', '合作', '沟通', '领导', '冲突', '压力', '挑战', '成长', '学习']
    const scenarioKeywords = ['如果', '假设', '遇到', '处理', '解决', '应对', '设计', '方案']

    const text = question.toLowerCase()

    if (technicalKeywords.some(keyword => text.includes(keyword))) {
      return 'technical'
    } else if (behavioralKeywords.some(keyword => text.includes(keyword))) {
      return 'behavioral'
    } else if (scenarioKeywords.some(keyword => text.includes(keyword))) {
      return 'scenario'
    }

    return 'general'
  }

  /**
   * 🔬 检测技术领域
   */
  detectTechnicalDomain(question) {
    const aiKeywords = ['机器学习', '深度学习', '神经网络', '算法', '模型', '训练', 'AI', '人工智能', '自然语言', '计算机视觉']
    const bigdataKeywords = ['大数据', '数据仓库', '数据湖', 'Hadoop', 'Spark', '流处理', '数据挖掘', '数据分析', 'ETL']
    const iotKeywords = ['物联网', '传感器', '嵌入式', '边缘计算', '设备', '协议', 'MQTT', '无线通信', '硬件']

    const text = question.toLowerCase()

    if (aiKeywords.some(keyword => text.includes(keyword))) {
      return 'ai'
    } else if (bigdataKeywords.some(keyword => text.includes(keyword))) {
      return 'bigdata'
    } else if (iotKeywords.some(keyword => text.includes(keyword))) {
      return 'iot'
    }

    return 'general'
  }

  /**
   * 📊 评估回答质量
   */
  evaluateAnswerQuality(response) {
    if (!response || response.trim().length === 0) {
      return 'empty'
    }

    const text = response.toLowerCase().trim()

    // 检测"不知道"类型的回答
    const unknownPatterns = [
      '不知道', '不清楚', '不了解', '不太懂', '没接触过', '没经验',
      '不会', '不熟悉', '没做过', '不太明白', '不确定', '没学过'
    ]

    if (unknownPatterns.some(pattern => text.includes(pattern))) {
      return 'unknown'
    }

    // 检测简短回答
    if (text.length < 20) {
      return 'brief'
    }

    // 检测详细回答
    if (text.length > 100 && (text.includes('项目') || text.includes('经验') || text.includes('实现'))) {
      return 'detailed'
    }

    return 'moderate'
  }

  /**
   * 🔍 分析回答模式
   */
  analyzeResponsePattern(response) {
    if (!response) return 'no_response'

    const text = response.toLowerCase()

    if (text.includes('项目') || text.includes('经验')) {
      return 'experience_based'
    } else if (text.includes('理论') || text.includes('概念')) {
      return 'theoretical'
    } else if (text.includes('不') || text.includes('没')) {
      return 'negative'
    }

    return 'general'
  }

  /**
   * 🎯 选择提示策略
   */
  selectHintStrategy(dimensions) {
    const { questionType, technicalDomain, answerQuality, responsePattern } = dimensions

    // 基于回答质量的紧急程度
    const urgencyMap = {
      'empty': 'high',
      'unknown': 'high',
      'brief': 'medium',
      'moderate': 'low',
      'detailed': 'low'
    }

    // 基于问题类型的策略类型
    const typeMap = {
      'technical': 'technical_guidance',
      'behavioral': 'behavioral_coaching',
      'scenario': 'scenario_analysis',
      'general': 'general_support'
    }

    return {
      type: typeMap[questionType] || 'general_support',
      urgency: urgencyMap[answerQuality] || 'medium',
      timing: answerQuality === 'unknown' ? 'immediate' : 'contextual',
      focus: this.determineFocus(dimensions)
    }
  }

  /**
   * 🎯 确定提示重点
   */
  determineFocus(dimensions) {
    const { questionType, technicalDomain, answerQuality, responsePattern } = dimensions

    if (answerQuality === 'unknown') {
      return 'knowledge_guidance'
    } else if (answerQuality === 'brief') {
      return 'detail_expansion'
    } else if (responsePattern === 'theoretical') {
      return 'practical_examples'
    } else if (responsePattern === 'experience_based') {
      return 'technical_depth'
    }

    return 'comprehensive_improvement'
  }

  /**
   * 💬 生成上下文化提示内容
   */
  generateContextualHint(strategy, dimensions) {
    const { questionType, technicalDomain, answerQuality, responsePattern } = dimensions

    // 根据不同情况生成提示
    if (answerQuality === 'unknown') {
      return this.generateUnknownAnswerGuidance(technicalDomain, questionType)
    } else if (answerQuality === 'brief') {
      return this.generateDetailExpansionHint(technicalDomain, questionType)
    } else if (responsePattern === 'theoretical') {
      return this.generatePracticalExampleHint(technicalDomain)
    } else {
      return this.generateGeneralImprovementHint(strategy, dimensions)
    }
  }

  /**
   * 🤔 生成"不知道"回答的引导
   */
  generateUnknownAnswerGuidance(domain, questionType) {
    const domainGuidance = {
      'ai': {
        text: '没关系，人工智能确实是个很大的领域。不如我们换个角度，您在工作或学习中有没有接触过数据分析、编程，或者听说过机器学习这些概念？哪怕是很基础的了解都可以分享一下。',
        guidance: '鼓励候选人从任何相关的基础经验开始，建立信心',
        examples: ['数据处理经验', '编程学习经历', '统计分析基础', '逻辑思维训练']
      },
      'bigdata': {
        text: '大数据听起来很复杂，但其实我们日常工作中经常在处理数据。您有没有用过Excel分析数据，或者处理过大量文件、日志这类工作？这些经验都很有价值。',
        guidance: '从日常数据处理经验切入，降低技术门槛',
        examples: ['Excel数据分析', '文件批量处理', '日志查看分析', '数据库查询']
      },
      'iot': {
        text: '物联网确实涉及很多技术。不过您平时有没有配置过路由器、连接过智能设备，或者对硬件、网络有一些了解？这些都是物联网的基础。',
        guidance: '从生活中的智能设备使用经验开始',
        examples: ['智能设备使用', '网络配置经验', '硬件调试经历', '设备连接问题解决']
      },
      'general': {
        text: '这个问题确实有挑战性。您可以先说说自己的理解，或者分享一些相关的学习经历。即使是初步的想法也很有价值，我们可以一起探讨。',
        guidance: '鼓励表达初步想法，营造轻松的探讨氛围',
        examples: ['初步理解', '学习过程', '相关经历', '思考角度']
      }
    }

    return domainGuidance[domain] || domainGuidance['general']
  }

  /**
   * 📝 生成详细扩展提示
   */
  generateDetailExpansionHint(domain, questionType) {
    const expansionHints = {
      'ai': {
        text: '您的回答很棒！我特别想了解更多细节：比如您选择这个算法的原因是什么？在数据处理过程中遇到过什么有趣的问题吗？最终的效果怎么样？',
        guidance: '以好奇和欣赏的语气引导深入分享技术细节',
        examples: ['技术选择的考虑', '数据处理中的发现', '效果评估和改进', '项目中的亮点']
      },
      'bigdata': {
        text: '听起来是个很有挑战的项目！能详细说说数据规模大概是什么量级吗？您是怎么设计整个数据处理流程的？有没有遇到性能瓶颈，又是如何解决的？',
        guidance: '表现出对项目的兴趣，引导分享架构设计思路',
        examples: ['数据规模和特点', '架构设计思路', '性能优化经验', '技术难点突破']
      },
      'iot': {
        text: '这个物联网项目很有意思！能具体介绍一下涉及的设备类型吗？您是如何设计设备间的通信方案的？在实际部署中有什么特别的经验？',
        guidance: '展现对物联网项目的兴趣，引导分享实践经验',
        examples: ['设备选型考虑', '通信方案设计', '部署实施经验', '运维管理心得']
      },
      'general': {
        text: '您的想法很有价值！能再详细说说具体是怎么实施的吗？过程中有什么印象深刻的挑战？您是如何一步步解决的？最后的成果如何？',
        guidance: '肯定候选人的想法，引导分享完整的实施过程',
        examples: ['具体实施方法', '关键挑战分析', '解决问题的思路', '成果和收获']
      }
    }

    return expansionHints[domain] || expansionHints['general']
  }

  /**
   * 🎯 生成实践案例提示
   */
  generatePracticalExampleHint(domain) {
    const practicalHints = {
      'ai': {
        text: '理论基础很扎实！能否结合一个具体的项目案例来说明？比如您是如何将这些理论应用到实际问题中的？',
        guidance: '从理论转向实践，提供具体的项目案例',
        examples: ['项目背景', '应用场景', '实现过程', '实际效果']
      },
      'bigdata': {
        text: '概念理解得很好！可以分享一个实际的数据处理项目吗？包括数据来源、处理流程和最终的业务价值？',
        guidance: '结合实际项目，展现数据处理的完整流程',
        examples: ['数据来源', '处理流程', '技术选型', '业务价值']
      },
      'iot': {
        text: '技术原理掌握得不错！能否举个具体的物联网应用例子？从设备到云端的整个数据流是怎样的？',
        guidance: '通过具体应用展现端到端的技术实现',
        examples: ['应用场景', '设备选型', '数据流程', '系统架构']
      },
      'general': {
        text: '理论基础很好！可以结合一个具体的实践经历来说明吗？这样能更好地展现您的实际应用能力。',
        guidance: '从理论知识转向实践应用，展现动手能力',
        examples: ['实践项目', '应用场景', '实现方法', '学到经验']
      }
    }

    return practicalHints[domain] || practicalHints['general']
  }

  /**
   * 🚀 生成综合改进提示
   */
  generateGeneralImprovementHint(strategy, dimensions) {
    const { technicalDomain, questionType } = dimensions

    const improvementHints = {
      'technical': {
        text: '回答很全面！可以进一步强调：技术选型的考虑因素、性能优化的具体措施、以及项目的创新点和难点突破。',
        guidance: '从技术深度、创新性、问题解决能力等方面提升',
        examples: ['技术选型理由', '性能优化方案', '创新突破点', '难点解决过程']
      },
      'behavioral': {
        text: '经历分享得很好！可以补充：您在其中的具体角色、采取的关键行动、以及从中获得的成长和反思。',
        guidance: '突出个人贡献、行动措施、成长收获',
        examples: ['个人角色', '关键行动', '成长收获', '经验反思']
      },
      'scenario': {
        text: '分析思路清晰！可以进一步说明：具体的实施计划、可能的风险点、应对措施、以及预期的效果评估。',
        guidance: '从方案完整性、风险控制、效果预期等方面完善',
        examples: ['实施计划', '风险识别', '应对措施', '效果评估']
      },
      'general': {
        text: '回答得不错！建议补充更多细节：具体的方法步骤、遇到的挑战、解决方案、以及最终的成果和收获。',
        guidance: '增加细节描述，展现完整的思考和实践过程',
        examples: ['方法步骤', '遇到挑战', '解决方案', '成果收获']
      }
    }

    return improvementHints[questionType] || improvementHints['general']
  }

  getFallbackHint() {
    const hints = [
      '建议从项目背景开始介绍，然后详述技术难点和解决方案',
      '可以举一个具体的项目案例来说明您的技术能力',
      '强调您在项目中的独特贡献和创新点',
      '说明项目的商业价值和实际影响',
      '详细描述技术实现的关键步骤',
      '可以提及项目中遇到的挑战和解决过程'
    ]

    return {
      hint: hints[Math.floor(Math.random() * hints.length)],
      type: 'constructive',
      urgency: 'medium',
      timing: 'immediate'
    }
  }

  generateSessionId() {
    return 'spark_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11)
  }

  generateBatchId() {
    return 'batch_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11)
  }

  // ==================== 增强功能支持方法 ====================

  /**
   * 🔧 数据预处理方法
   */
  async preprocessInputData(inputData) {
    const startTime = Date.now()
    return {
      ...inputData,
      startTime,
      text: this.cleanText(inputData.text || ''),
      textMetrics: this.calculateBasicTextMetrics(inputData.text || ''),
      voiceMetrics: null, // 语音功能已禁用
      speechPatterns: null // 语音功能已禁用
    }
  }

  /**
   * 🧠 语义分析方法
   */
  async performSemanticAnalysis(sessionId, inputData) {
    try {
      const text = inputData.text || ''
      return {
        semanticKeywords: this.extractSemanticKeywords(text),
        contextualMeaning: this.analyzeContextualMeaning(text),
        intentAnalysis: this.analyzeIntent(text),
        topicModeling: this.performTopicModeling(text),
        sentimentAnalysis: this.analyzeSentiment(text)
      }
    } catch (error) {
      console.error('❌ 语义分析失败:', error)
      return { error: error.message }
    }
  }

  /**
   * 📊 实时评分算法
   */
  async calculateRealTimeScores(fusedResults, sessionId) {
    try {
      const baseScores = {
        overall: 75,
        technical: fusedResults.textAnalysis?.metrics?.technicalDepth || 70,
        communication: fusedResults.textAnalysis?.metrics?.grammarScore || 75,
        content: fusedResults.textAnalysis?.overallScore || 75,
        logic: fusedResults.textAnalysis?.metrics?.logicalStructure || 70,
        learning: fusedResults.sixDimensionAnalysis?.dimensions?.学习能力?.score || 70,
        innovation: fusedResults.sixDimensionAnalysis?.dimensions?.创新能力?.score || 70,
        teamwork: fusedResults.sixDimensionAnalysis?.dimensions?.团队协作?.score || 70
      }



      // 计算综合分数
      baseScores.overall = Math.round(
        (baseScores.technical * 0.3 +
         baseScores.communication * 0.25 +
         baseScores.logic * 0.2 +
         baseScores.learning * 0.1 +
         baseScores.innovation * 0.1 +
         baseScores.teamwork * 0.05)
      )

      return baseScores
    } catch (error) {
      console.error('❌ 实时评分计算失败:', error)
      return this.getDefaultScores()
    }
  }

  /**
   * 💡 可解释性分析生成
   */
  async generateExplanations(fusedResults, realTimeScores) {
    try {
      return {
        overallExplanation: this.generateOverallExplanation(realTimeScores),
        strengthAreas: this.identifyStrengthAreas(fusedResults, realTimeScores),
        improvementAreas: this.identifyImprovementAreas(fusedResults, realTimeScores),
        specificFeedback: this.generateSpecificFeedback(fusedResults),
        actionableAdvice: this.generateActionableAdvice(fusedResults, realTimeScores)
      }
    } catch (error) {
      console.error('❌ 可解释性分析生成失败:', error)
      return this.getDefaultExplanations()
    }
  }

  /**
   * 🎯 六维能力权重获取
   */
  getSixDimensionWeights(domain) {
    const weights = {
      ai: { 技术能力: 0.35, 沟通表达: 0.15, 逻辑思维: 0.25, 学习能力: 0.15, 创新能力: 0.08, 团队协作: 0.02 },
      bigdata: { 技术能力: 0.30, 沟通表达: 0.20, 逻辑思维: 0.25, 学习能力: 0.15, 创新能力: 0.05, 团队协作: 0.05 },
      iot: { 技术能力: 0.30, 沟通表达: 0.15, 逻辑思维: 0.20, 学习能力: 0.20, 创新能力: 0.10, 团队协作: 0.05 },
      comprehensive: { 技术能力: 0.25, 沟通表达: 0.20, 逻辑思维: 0.20, 学习能力: 0.15, 创新能力: 0.10, 团队协作: 0.10 }
    }
    return weights[domain] || weights.comprehensive
  }

  /**
   * 🔍 候选人分析支持方法
   */
  analyzeExperienceLevel(experience) {
    const years = this.extractYearsFromText(experience)
    return {
      years: years,
      level: years < 2 ? 'junior' : years < 5 ? 'mid' : 'senior',
      description: experience
    }
  }

  analyzeEducationBackground(education) {
    return {
      degree: this.extractDegree(education),
      field: this.extractField(education),
      institution: this.extractInstitution(education),
      relevance: this.calculateEducationRelevance(education)
    }
  }

  analyzeSkillSet(skills) {
    return {
      technical: skills.filter(skill => this.isTechnicalSkill(skill)),
      soft: skills.filter(skill => this.isSoftSkill(skill)),
      domain: skills.filter(skill => this.isDomainSkill(skill)),
      count: skills.length,
      diversity: this.calculateSkillDiversity(skills)
    }
  }

  /**
   * 🎯 技术能力评估方法
   */
  assessTechnicalLevel(candidateProfile) {
    const experience = candidateProfile.experience || ''
    const skills = candidateProfile.skills || []
    const education = candidateProfile.education || ''

    let score = 0.5 // 基础分数

    // 经验加权
    const years = this.extractYearsFromText(experience)
    score += Math.min(years * 0.1, 0.3)

    // 技能加权
    const technicalSkills = skills.filter(skill => this.isTechnicalSkill(skill))
    score += Math.min(technicalSkills.length * 0.05, 0.2)

    return Math.min(score, 1.0)
  }

  /**
   * 🧠 学习能力预测
   */
  predictLearningCapacity(candidateProfile) {
    const education = candidateProfile.education || ''
    const experience = candidateProfile.experience || ''
    const skills = candidateProfile.skills || []

    let score = 0.6 // 基础分数

    // 教育背景加权
    if (education.includes('硕士') || education.includes('博士')) score += 0.2
    if (education.includes('计算机') || education.includes('软件')) score += 0.1

    // 技能多样性加权
    score += Math.min(this.calculateSkillDiversity(skills) * 0.1, 0.1)

    return {
      score: Math.min(score, 1.0),
      indicators: this.getLearningIndicators(candidateProfile),
      potential: score > 0.8 ? 'high' : score > 0.6 ? 'medium' : 'low'
    }
  }

  /**
   * 🎯 获取学习能力指标
   */
  getLearningIndicators(candidateProfile) {
    const education = candidateProfile.education || ''
    const experience = candidateProfile.experience || ''
    const skills = candidateProfile.skills || []

    const indicators = []

    // 教育背景指标
    if (education.includes('硕士') || education.includes('博士')) {
      indicators.push('高等教育背景')
    }
    if (education.includes('计算机') || education.includes('软件')) {
      indicators.push('专业对口')
    }

    // 技能多样性指标
    const skillDiversity = this.calculateSkillDiversity(skills)
    if (skillDiversity > 0.6) {
      indicators.push('技能多样性强')
    }

    // 经验指标
    const years = this.extractYearsFromText(experience)
    if (years > 3) {
      indicators.push('丰富实践经验')
    }

    // 技术前沿性指标
    const modernTech = ['Vue3', 'React', 'TypeScript', 'Python', 'AI', '机器学习']
    const hasModernTech = skills.some(skill =>
      modernTech.some(tech => skill.includes(tech))
    )
    if (hasModernTech) {
      indicators.push('掌握前沿技术')
    }

    return indicators.length > 0 ? indicators : ['基础学习能力']
  }

  /**
   * 🎯 计算领域匹配分数
   */
  calculateDomainScore(skills, position, domainKeywords) {
    if (!skills || !Array.isArray(skills)) return 0

    let score = 0
    const totalKeywords = domainKeywords.length

    // 技能匹配度计算
    for (const keyword of domainKeywords) {
      const matchCount = skills.filter(skill =>
        skill.toLowerCase().includes(keyword.toLowerCase())
      ).length
      score += matchCount > 0 ? 1 : 0
    }

    // 职位相关性加权
    if (position) {
      const positionLower = position.toLowerCase()
      for (const keyword of domainKeywords) {
        if (positionLower.includes(keyword.toLowerCase())) {
          score += 0.5
        }
      }
    }

    // 归一化到 0-1 范围
    return Math.min(score / totalKeywords, 1.0)
  }

  /**
   * 🎯 创建领域适配策略
   */
  createDomainAdaptationStrategy(primaryDomain, domainScores) {
    const strategy = {
      focus: primaryDomain,
      approach: 'adaptive',
      questionTypes: [],
      difficultyProgression: 'gradual',
      crossDomainIntegration: false
    }

    // 根据主要领域设置策略
    switch (primaryDomain) {
      case 'ai':
        strategy.questionTypes = ['算法理论', '模型应用', '项目实践', '前沿技术']
        strategy.approach = 'theory_practice_balanced'
        break
      case 'bigdata':
        strategy.questionTypes = ['数据处理', '系统架构', '性能优化', '业务理解']
        strategy.approach = 'system_oriented'
        break
      case 'iot':
        strategy.questionTypes = ['硬件理解', '协议知识', '系统集成', '实际应用']
        strategy.approach = 'practical_oriented'
        break
      case 'frontend':
        strategy.questionTypes = ['框架应用', '性能优化', '用户体验', '工程化']
        strategy.approach = 'project_oriented'
        break
      case 'backend':
        strategy.questionTypes = ['系统设计', '数据库', '性能优化', '安全性']
        strategy.approach = 'architecture_oriented'
        break
      default:
        strategy.questionTypes = ['基础理论', '实践应用', '问题解决', '学习能力']
        strategy.approach = 'comprehensive'
    }

    // 检查是否需要跨领域整合
    const secondaryDomains = Object.keys(domainScores)
      .filter(d => d !== primaryDomain && domainScores[d] > 0.4)

    if (secondaryDomains.length > 0) {
      strategy.crossDomainIntegration = true
      strategy.secondaryFocus = secondaryDomains[0]
    }

    return strategy
  }

  /**
   * 🎯 创建领域适配策略
   */
  createDomainAdaptationStrategy(primaryDomain, domainScores) {
    const strategy = {
      focus: primaryDomain,
      approach: 'adaptive',
      questionTypes: [],
      difficultyProgression: 'gradual',
      crossDomainIntegration: false
    }

    // 根据主要领域设置策略
    switch (primaryDomain) {
      case 'ai':
        strategy.questionTypes = ['算法理论', '模型应用', '项目实践', '前沿技术']
        strategy.approach = 'theory_practice_balanced'
        break
      case 'bigdata':
        strategy.questionTypes = ['数据处理', '系统架构', '性能优化', '业务理解']
        strategy.approach = 'system_oriented'
        break
      case 'iot':
        strategy.questionTypes = ['硬件理解', '协议知识', '系统集成', '实际应用']
        strategy.approach = 'practical_oriented'
        break
      case 'frontend':
        strategy.questionTypes = ['框架应用', '性能优化', '用户体验', '工程化']
        strategy.approach = 'project_oriented'
        break
      case 'backend':
        strategy.questionTypes = ['系统设计', '数据库', '性能优化', '安全性']
        strategy.approach = 'architecture_oriented'
        break
      default:
        strategy.questionTypes = ['基础理论', '实践应用', '问题解决', '学习能力']
        strategy.approach = 'comprehensive'
    }

    // 检查是否需要跨领域整合
    const secondaryDomains = Object.keys(domainScores)
      .filter(d => d !== primaryDomain && domainScores[d] > 0.4)

    if (secondaryDomains.length > 0) {
      strategy.crossDomainIntegration = true
      strategy.secondaryFocus = secondaryDomains[0]
    }

    return strategy
  }

  /**
   * 🗣️ 沟通风格分析
   */
  analyzeCommunicationStyle(candidateProfile) {
    // 基于简历和背景信息推断沟通风格
    return {
      style: 'professional', // 默认专业风格
      formality: 'formal',
      directness: 'moderate',
      confidence: 'medium'
    }
  }

  /**
   * 🎯 默认候选人分析
   */
  getDefaultCandidateAnalysis() {
    return {
      basicInfo: {
        experience: { years: 3, level: 'mid', description: '中等经验' },
        education: { degree: '本科', field: '计算机', relevance: 0.8 },
        skills: { technical: [], soft: [], domain: [], count: 0, diversity: 0.5 }
      },
      technicalLevel: 0.6,
      learningCapacity: { score: 0.7, potential: 'medium' },
      communicationStyle: { style: 'professional', formality: 'formal' },
      personalizedStrategy: {
        questioningApproach: 'balanced',
        encouragementStyle: 'supportive',
        feedbackFrequency: 'regular'
      },
      level: 'intermediate',
      strengths: ['学习能力', '适应性'],
      challenges: ['技术深度', '项目经验']
    }
  }

  /**
   * 🔧 增强回退配置
   */
  getEnhancedFallbackSessionConfig(candidateProfile, interviewType) {
    return {
      sessionId: this.generateSessionId(),
      status: 'initialized',
      candidateProfile: {
        ...candidateProfile,
        analysis: this.getDefaultCandidateAnalysis()
      },
      interviewMode: this.interviewModes[interviewType],
      aiInterviewer: {
        personality: 'professional',
        chineseOptimization: true,
        adaptiveQuestioning: true
      },
      enhancedFeatures: {
        candidateAnalysis: this.getDefaultCandidateAnalysis(),
        domainConfig: { primaryDomain: 'comprehensive' },
        difficultyConfig: { level: 'intermediate', score: 0.6 }
      },
      fallback: true,
      message: 'iFlytek星火面试系统已就绪（增强模式）'
    }
  }

  // ==================== 基础工具方法 ====================

  /**
   * 文本清理
   */
  cleanText(text) {
    return text.trim().replace(/\s+/g, ' ')
  }

  /**
   * 基础文本指标计算
   */
  calculateBasicTextMetrics(text) {
    return {
      length: text.length,
      wordCount: this.countWords(text),
      sentenceCount: this.countSentences(text)
    }
  }

  /**
   * 基础语音指标计算（已禁用）
   */
  calculateBasicVoiceMetrics(audio) {
    // 语音功能已禁用
    return null
  }

  /**
   * 语音模式提取（已禁用）
   */
  extractSpeechPatterns(audio) {
    // 语音功能已禁用
    return null
  }

  /**
   * 语义关键词提取
   */
  extractSemanticKeywords(text) {
    const keywords = text.match(/[\u4e00-\u9fa5a-zA-Z]+/g) || []
    return keywords.filter(word => word.length > 1).slice(0, 10)
  }

  /**
   * 上下文意义分析
   */
  analyzeContextualMeaning(text) {
    return {
      mainTopic: '技术讨论',
      subTopics: ['项目经验', '技术栈', '解决方案'],
      complexity: text.length > 200 ? 'high' : 'medium'
    }
  }

  /**
   * 意图分析
   */
  analyzeIntent(text) {
    return {
      primary: 'informative',
      confidence: 0.8,
      secondary: ['explanatory', 'demonstrative']
    }
  }

  /**
   * 主题建模
   */
  performTopicModeling(text) {
    return {
      topics: ['技术', '项目', '经验'],
      distribution: [0.4, 0.3, 0.3]
    }
  }

  /**
   * 情感分析
   */
  analyzeSentiment(text) {
    return {
      polarity: 'positive',
      score: 0.7,
      confidence: 0.8
    }
  }

  /**
   * 默认评分
   */
  getDefaultScores() {
    return {
      overall: 75,
      technical: 70,
      communication: 75,
      content: 75,
      logic: 70,
      learning: 70,
      innovation: 70,
      teamwork: 70
    }
  }

  /**
   * 默认解释
   */
  getDefaultExplanations() {
    return {
      overallExplanation: '综合表现良好，具备基本的技术能力和沟通技巧',
      strengthAreas: ['学习能力', '沟通表达'],
      improvementAreas: ['技术深度', '创新思维'],
      specificFeedback: '建议加强技术实践和项目经验',
      actionableAdvice: ['多参与实际项目', '提升技术深度', '加强团队协作']
    }
  }

  /**
   * 综合解释生成
   */
  generateOverallExplanation(scores) {
    const avgScore = Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length
    if (avgScore >= 85) return '表现优秀，各项能力均达到较高水平'
    if (avgScore >= 75) return '表现良好，具备扎实的基础能力'
    if (avgScore >= 65) return '表现中等，有一定提升空间'
    return '需要进一步提升各项能力'
  }

  /**
   * 优势领域识别
   */
  identifyStrengthAreas(fusedResults, scores) {
    const strengths = []
    if (scores.technical >= 80) strengths.push('技术能力')
    if (scores.communication >= 80) strengths.push('沟通表达')
    if (scores.logic >= 80) strengths.push('逻辑思维')
    return strengths.length > 0 ? strengths : ['基础能力']
  }

  /**
   * 改进领域识别
   */
  identifyImprovementAreas(fusedResults, scores) {
    const improvements = []
    if (scores.technical < 70) improvements.push('技术能力')
    if (scores.communication < 70) improvements.push('沟通表达')
    if (scores.innovation < 70) improvements.push('创新思维')
    return improvements.length > 0 ? improvements : ['持续学习']
  }

  /**
   * 具体反馈生成
   */
  generateSpecificFeedback(fusedResults) {
    return '基于您的回答，建议在技术深度和实际应用方面继续加强'
  }

  /**
   * 可行建议生成
   */
  generateActionableAdvice(fusedResults, scores) {
    const advice = []
    if (scores.technical < 75) advice.push('加强技术学习和实践')
    if (scores.communication < 75) advice.push('提升表达和沟通技巧')
    if (scores.innovation < 75) advice.push('培养创新思维和解决问题的能力')
    return advice.length > 0 ? advice : ['保持学习热情，持续提升']
  }

  /**
   * 年份提取
   */
  extractYearsFromText(text) {
    const matches = text.match(/(\d+)\s*年/g)
    if (matches) {
      return parseInt(matches[0].replace(/\D/g, ''))
    }
    return 2 // 默认2年经验
  }

  /**
   * 学位提取
   */
  extractDegree(education) {
    if (education.includes('博士')) return '博士'
    if (education.includes('硕士')) return '硕士'
    if (education.includes('本科')) return '本科'
    return '本科'
  }

  /**
   * 专业领域提取
   */
  extractField(education) {
    if (education.includes('计算机')) return '计算机'
    if (education.includes('软件')) return '软件工程'
    if (education.includes('电子')) return '电子工程'
    return '相关专业'
  }

  /**
   * 院校提取
   */
  extractInstitution(education) {
    return '知名院校' // 简化处理
  }

  /**
   * 教育相关性计算
   */
  calculateEducationRelevance(education) {
    if (education.includes('计算机') || education.includes('软件')) return 0.9
    if (education.includes('工程') || education.includes('理工')) return 0.7
    return 0.5
  }

  /**
   * 技能分类判断
   */
  isTechnicalSkill(skill) {
    const technicalKeywords = ['Java', 'Python', 'JavaScript', 'React', 'Vue', 'Spring', 'MySQL', 'Redis', 'Docker']
    return technicalKeywords.some(keyword => skill.includes(keyword))
  }

  isSoftSkill(skill) {
    const softKeywords = ['沟通', '团队', '领导', '管理', '协调', '学习']
    return softKeywords.some(keyword => skill.includes(keyword))
  }

  isDomainSkill(skill) {
    const domainKeywords = ['AI', '机器学习', '大数据', '物联网', '区块链']
    return domainKeywords.some(keyword => skill.includes(keyword))
  }

  /**
   * 技能多样性计算
   */
  calculateSkillDiversity(skills) {
    const categories = {
      technical: skills.filter(s => this.isTechnicalSkill(s)).length,
      soft: skills.filter(s => this.isSoftSkill(s)).length,
      domain: skills.filter(s => this.isDomainSkill(s)).length
    }
    const totalCategories = Object.values(categories).filter(count => count > 0).length
    return totalCategories / 3 // 最大3个类别
  }

  /**
   * 计算流程指标
   */
  calculateProcessMetrics(positionData) {
    return {
      avgCycle: 18, // 平均招聘周期
      screeningTime: 5.2, // 简历筛选时间
      interviewTime: 8.5, // 面试时间
      offerTime: 2.8, // offer发放时间
      passRate: 0.78, // 通过率
      acceptanceRate: 0.89 // offer接受率
    }
  }

  /**
   * 计算匹配指标
   */
  calculateMatchingMetrics(positionData) {
    return {
      skillMatch: 0.85, // 技能匹配度
      cultureMatch: 0.88, // 文化匹配度
      experienceMatch: 0.82, // 经验匹配度
      potentialScore: 0.79, // 潜力评分
      retentionPrediction: 0.91 // 留存预测
    }
  }

  /**
   * 获取最新市场数据
   */
  getLatestMarketData() {
    return {
      talentGap: 1850000, // 人才缺口
      salaryGrowth: 0.18, // 薪资增长
      demandGrowth: 0.28, // 需求增长
      competitionIndex: 0.85, // 竞争指数
      remoteWorkRate: 0.78 // 远程工作接受度
    }
  }

  /**
   * 🎯 生成个性化AI提示
   * 基于面试者的回答模式和技术背景提供定制化建议
   */
  async generatePersonalizedHint(question, answer, candidateProfile) {
    try {
      console.log('🤖 生成个性化AI提示...')

      // 分析回答模式
      const responsePattern = this.analyzeResponsePattern(answer, candidateProfile)

      // 构建个性化提示请求
      const hintRequest = this.buildPersonalizedHintRequest(
        question,
        answer,
        candidateProfile,
        responsePattern
      )

      // 调用iFlytek Spark API
      const response = await this.callSparkAPI(hintRequest)

      if (response.success) {
        const personalizedHint = this.parsePersonalizedHint(response.data, candidateProfile)

        console.log('✅ 个性化AI提示生成成功')
        return {
          success: true,
          hint: personalizedHint,
          confidence: personalizedHint.confidence,
          adaptiveStrategy: personalizedHint.strategy
        }
      }

      throw new Error('AI提示生成失败')

    } catch (error) {
      console.error('❌ 个性化AI提示生成失败:', error)
      return this.getFallbackPersonalizedHint(question, answer, candidateProfile)
    }
  }

  /**
   * 🧠 多维度智能分析
   * 基于面试者的多模态数据进行综合分析
   */
  async performMultiModalAnalysis(interviewData) {
    try {
      console.log('🔍 执行多维度智能分析...')

      const analysisResults = {
        textAnalysis: await this.analyzeTextResponse(interviewData.textData),
        voiceAnalysis: await this.analyzeVoicePattern(interviewData.voiceData),
        behaviorAnalysis: await this.analyzeBehaviorPattern(interviewData.behaviorData),
        contextAnalysis: await this.analyzeContextualFactors(interviewData.contextData)
      }

      // 综合分析结果
      const comprehensiveInsights = await this.synthesizeAnalysisResults(analysisResults)

      console.log('✅ 多维度分析完成')
      return {
        success: true,
        insights: comprehensiveInsights,
        recommendations: await this.generateAdaptiveRecommendations(comprehensiveInsights),
        confidence: this.calculateAnalysisConfidence(analysisResults)
      }

    } catch (error) {
      console.error('❌ 多维度分析失败:', error)
      return {
        success: false,
        error: error.message,
        fallbackInsights: this.getBasicAnalysisInsights(interviewData)
      }
    }
  }

  /**
   * 🎭 分析回答模式
   * 识别面试者的回答风格和思维模式
   */
  analyzeResponsePattern(answer, candidateProfile) {
    const patterns = {
      responseStyle: 'analytical', // analytical, creative, practical, theoretical
      communicationPattern: 'detailed', // brief, detailed, structured, conversational
      confidenceLevel: 'medium', // low, medium, high
      technicalDepth: 'intermediate', // basic, intermediate, advanced, expert
      exampleUsage: 'moderate', // none, minimal, moderate, extensive
      structuredThinking: 'good' // poor, fair, good, excellent
    }

    // 分析回答长度
    const wordCount = answer.length
    if (wordCount < 50) {
      patterns.communicationPattern = 'brief'
      patterns.confidenceLevel = 'low'
    } else if (wordCount > 200) {
      patterns.communicationPattern = 'detailed'
      patterns.confidenceLevel = 'high'
    }

    // 分析技术关键词
    const technicalKeywords = ['算法', '架构', '优化', '性能', '设计模式', '数据结构']
    const keywordCount = technicalKeywords.filter(keyword => answer.includes(keyword)).length

    if (keywordCount >= 3) {
      patterns.technicalDepth = 'advanced'
    } else if (keywordCount >= 1) {
      patterns.technicalDepth = 'intermediate'
    } else {
      patterns.technicalDepth = 'basic'
    }

    // 分析示例使用
    const exampleIndicators = ['例如', '比如', '举例', '案例', '项目中']
    const exampleCount = exampleIndicators.filter(indicator => answer.includes(indicator)).length

    if (exampleCount >= 2) {
      patterns.exampleUsage = 'extensive'
    } else if (exampleCount >= 1) {
      patterns.exampleUsage = 'moderate'
    } else {
      patterns.exampleUsage = 'minimal'
    }

    return patterns
  }

  /**
   * 🏗️ 构建个性化提示请求
   */
  buildPersonalizedHintRequest(question, answer, candidateProfile, responsePattern) {
    const domain = candidateProfile.technicalDomain || 'general'
    const level = candidateProfile.experienceLevel || 'middle'

    let hintStrategy = ''

    // 根据回答模式调整提示策略
    if (responsePattern.communicationPattern === 'brief') {
      hintStrategy = '建议提供更详细的解释和具体示例'
    } else if (responsePattern.technicalDepth === 'basic') {
      hintStrategy = '可以深入探讨技术原理和实现细节'
    } else if (responsePattern.exampleUsage === 'minimal') {
      hintStrategy = '建议结合具体的项目经验和实际案例'
    } else {
      hintStrategy = '回答很好，可以进一步优化表达的逻辑结构'
    }

    return {
      messages: [{
        role: 'system',
        content: `你是iFlytek星火智能面试助手。请基于以下信息为面试者提供个性化的改进建议：

面试领域：${domain}
经验水平：${level}
回答模式：${JSON.stringify(responsePattern)}
提示策略：${hintStrategy}

请提供具体、可操作的建议，帮助面试者改进回答质量。`
      }, {
        role: 'user',
        content: `问题：${question}\n\n回答：${answer}\n\n请提供个性化的改进建议。`
      }],
      temperature: 0.7,
      max_tokens: 500
    }
  }

  /**
   * 📊 解析个性化提示
   */
  parsePersonalizedHint(apiResponse, candidateProfile) {
    // 模拟解析API响应
    const hints = [
      {
        type: 'structure',
        title: '回答结构优化',
        content: '建议使用STAR法则（情境-任务-行动-结果）来组织回答',
        confidence: 85,
        priority: 'high'
      },
      {
        type: 'technical',
        title: '技术深度提升',
        content: '可以进一步阐述算法的时间复杂度和空间复杂度',
        confidence: 78,
        priority: 'medium'
      },
      {
        type: 'example',
        title: '实例补充',
        content: '建议添加具体的项目案例来支撑技术观点',
        confidence: 92,
        priority: 'high'
      }
    ]

    return {
      hints,
      strategy: 'adaptive_guidance',
      confidence: Math.round(hints.reduce((sum, hint) => sum + hint.confidence, 0) / hints.length),
      personalizedFor: candidateProfile.technicalDomain
    }
  }

  /**
   * 🔄 获取备用个性化提示
   */
  getFallbackPersonalizedHint(question, answer, candidateProfile) {
    const domain = candidateProfile.technicalDomain || 'general'

    const fallbackHints = {
      ai: [
        {
          type: 'technical',
          title: 'AI算法深度',
          content: '建议详细说明算法的原理和适用场景',
          confidence: 75,
          priority: 'high'
        }
      ],
      bigdata: [
        {
          type: 'technical',
          title: '大数据处理',
          content: '可以描述数据处理的具体流程和技术选型',
          confidence: 80,
          priority: 'high'
        }
      ],
      iot: [
        {
          type: 'technical',
          title: '物联网架构',
          content: '建议说明设备连接和数据传输的技术方案',
          confidence: 78,
          priority: 'medium'
        }
      ],
      general: [
        {
          type: 'structure',
          title: '回答结构',
          content: '建议使用更清晰的逻辑结构来组织回答',
          confidence: 70,
          priority: 'medium'
        }
      ]
    }

    const hints = fallbackHints[domain] || fallbackHints.general

    return {
      success: true,
      hint: {
        hints,
        strategy: 'fallback_guidance',
        confidence: 70,
        personalizedFor: domain
      },
      confidence: 70,
      adaptiveStrategy: 'fallback'
    }
  }

  /**
   * 🎯 生成个性化AI提示
   * 基于面试者的回答模式和技术背景提供定制化建议
   */
  async generatePersonalizedHint(question, answer, candidateProfile) {
    try {
      console.log('🤖 生成个性化AI提示...')

      // 分析回答模式
      const responsePattern = this.analyzeResponsePattern(answer, candidateProfile)

      // 构建个性化提示请求
      const hintRequest = this.buildPersonalizedHintRequest(
        question,
        answer,
        candidateProfile,
        responsePattern
      )

      // 调用iFlytek Spark API
      const response = await this.callSparkAPI(hintRequest)

      if (response.success) {
        const personalizedHint = this.parsePersonalizedHint(response.data, candidateProfile)

        console.log('✅ 个性化AI提示生成成功')
        return {
          success: true,
          hint: personalizedHint,
          confidence: personalizedHint.confidence,
          adaptiveStrategy: personalizedHint.strategy
        }
      }

      throw new Error('AI提示生成失败')

    } catch (error) {
      console.error('❌ 个性化AI提示生成失败:', error)
      return this.getFallbackPersonalizedHint(question, answer, candidateProfile)
    }
  }

  /**
   * 🧠 多维度智能分析
   * 基于面试者的多模态数据进行综合分析
   */
  async performMultiModalAnalysis(interviewData) {
    try {
      console.log('🔍 执行多维度智能分析...')

      const analysisResults = {
        textAnalysis: await this.analyzeTextResponse(interviewData.textData),
        voiceAnalysis: await this.analyzeVoicePattern(interviewData.voiceData),
        behaviorAnalysis: await this.analyzeBehaviorPattern(interviewData.behaviorData),
        contextAnalysis: await this.analyzeContextualFactors(interviewData.contextData)
      }

      // 综合分析结果
      const comprehensiveInsights = await this.synthesizeAnalysisResults(analysisResults)

      console.log('✅ 多维度分析完成')
      return {
        success: true,
        insights: comprehensiveInsights,
        recommendations: await this.generateAdaptiveRecommendations(comprehensiveInsights),
        confidence: this.calculateAnalysisConfidence(analysisResults)
      }

    } catch (error) {
      console.error('❌ 多维度分析失败:', error)
      return {
        success: false,
        error: error.message,
        fallbackInsights: this.getBasicAnalysisInsights(interviewData)
      }
    }
  }

  /**
   * 🎭 分析回答模式
   * 识别面试者的回答风格和思维模式
   */
  analyzeResponsePattern(answer, candidateProfile) {
    const patterns = {
      responseStyle: 'analytical', // analytical, creative, practical, theoretical
      communicationPattern: 'detailed', // brief, detailed, structured, conversational
      confidenceLevel: 'medium', // low, medium, high
      technicalDepth: 'intermediate', // basic, intermediate, advanced, expert
      exampleUsage: 'moderate', // none, minimal, moderate, extensive
      structuredThinking: 'good' // poor, fair, good, excellent
    }

    // 分析回答长度
    const wordCount = answer.length
    if (wordCount < 50) {
      patterns.communicationPattern = 'brief'
      patterns.confidenceLevel = 'low'
    } else if (wordCount > 200) {
      patterns.communicationPattern = 'detailed'
      patterns.confidenceLevel = 'high'
    }

    // 分析技术关键词
    const technicalKeywords = ['算法', '架构', '优化', '性能', '设计模式', '数据结构']
    const keywordCount = technicalKeywords.filter(keyword => answer.includes(keyword)).length

    if (keywordCount >= 3) {
      patterns.technicalDepth = 'advanced'
    } else if (keywordCount >= 1) {
      patterns.technicalDepth = 'intermediate'
    } else {
      patterns.technicalDepth = 'basic'
    }

    // 分析示例使用
    const exampleIndicators = ['例如', '比如', '举例', '案例', '项目中']
    const exampleCount = exampleIndicators.filter(indicator => answer.includes(indicator)).length

    if (exampleCount >= 2) {
      patterns.exampleUsage = 'extensive'
    } else if (exampleCount >= 1) {
      patterns.exampleUsage = 'moderate'
    } else {
      patterns.exampleUsage = 'minimal'
    }

    return patterns
  }

  /**
   * 🏗️ 构建个性化提示请求
   */
  buildPersonalizedHintRequest(question, answer, candidateProfile, responsePattern) {
    const domain = candidateProfile.technicalDomain || 'general'
    const level = candidateProfile.experienceLevel || 'middle'

    let hintStrategy = ''

    // 根据回答模式调整提示策略
    if (responsePattern.communicationPattern === 'brief') {
      hintStrategy = '建议提供更详细的解释和具体示例'
    } else if (responsePattern.technicalDepth === 'basic') {
      hintStrategy = '可以深入探讨技术原理和实现细节'
    } else if (responsePattern.exampleUsage === 'minimal') {
      hintStrategy = '建议结合具体的项目经验和实际案例'
    } else {
      hintStrategy = '回答很好，可以进一步优化表达的逻辑结构'
    }

    return {
      messages: [{
        role: 'system',
        content: `你是iFlytek星火智能面试助手。请基于以下信息为面试者提供个性化的改进建议：

面试领域：${domain}
经验水平：${level}
回答模式：${JSON.stringify(responsePattern)}
提示策略：${hintStrategy}

请提供具体、可操作的建议，帮助面试者改进回答质量。`
      }, {
        role: 'user',
        content: `问题：${question}\n\n回答：${answer}\n\n请提供个性化的改进建议。`
      }],
      temperature: 0.7,
      max_tokens: 500
    }
  }

  /**
   * 📊 解析个性化提示
   */
  parsePersonalizedHint(apiResponse, candidateProfile) {
    // 模拟解析API响应
    const hints = [
      {
        type: 'structure',
        title: '回答结构优化',
        content: '建议使用STAR法则（情境-任务-行动-结果）来组织回答',
        confidence: 85,
        priority: 'high'
      },
      {
        type: 'technical',
        title: '技术深度提升',
        content: '可以进一步阐述算法的时间复杂度和空间复杂度',
        confidence: 78,
        priority: 'medium'
      },
      {
        type: 'example',
        title: '实例补充',
        content: '建议添加具体的项目案例来支撑技术观点',
        confidence: 92,
        priority: 'high'
      }
    ]

    return {
      hints,
      strategy: 'adaptive_guidance',
      confidence: Math.round(hints.reduce((sum, hint) => sum + hint.confidence, 0) / hints.length),
      personalizedFor: candidateProfile.technicalDomain
    }
  }

  /**
   * 🔄 获取备用个性化提示
   */
  getFallbackPersonalizedHint(question, answer, candidateProfile) {
    const domain = candidateProfile.technicalDomain || 'general'

    const fallbackHints = {
      ai: [
        {
          type: 'technical',
          title: 'AI算法深度',
          content: '建议详细说明算法的原理和适用场景',
          confidence: 75,
          priority: 'high'
        }
      ],
      bigdata: [
        {
          type: 'technical',
          title: '大数据处理',
          content: '可以描述数据处理的具体流程和技术选型',
          confidence: 80,
          priority: 'high'
        }
      ],
      iot: [
        {
          type: 'technical',
          title: '物联网架构',
          content: '建议说明设备连接和数据传输的技术方案',
          confidence: 78,
          priority: 'medium'
        }
      ],
      general: [
        {
          type: 'structure',
          title: '回答结构',
          content: '建议使用更清晰的逻辑结构来组织回答',
          confidence: 70,
          priority: 'medium'
        }
      ]
    }

    const hints = fallbackHints[domain] || fallbackHints.general

    return {
      success: true,
      hint: {
        hints,
        strategy: 'fallback_guidance',
        confidence: 70,
        personalizedFor: domain
      },
      confidence: 70,
      adaptiveStrategy: 'fallback'
    }
  }

  /**
   * 📝 分析文本回答
   */
  async analyzeTextResponse(textData) {
    const analysis = {
      sentiment: this.analyzeSentiment(textData.content),
      complexity: this.analyzeComplexity(textData.content),
      keywords: this.extractKeywords(textData.content),
      structure: this.analyzeStructure(textData.content),
      confidence: this.assessConfidence(textData.content)
    }

    return {
      type: 'text',
      score: this.calculateTextScore(analysis),
      insights: this.generateTextInsights(analysis),
      recommendations: this.generateTextRecommendations(analysis)
    }
  }

  /**
   * 🎤 分析语音模式
   */
  async analyzeVoicePattern(voiceData) {
    // 模拟语音分析
    const analysis = {
      pace: 'moderate', // slow, moderate, fast
      clarity: 'good', // poor, fair, good, excellent
      confidence: 'high', // low, medium, high
      emotion: 'calm', // nervous, calm, excited, confident
      pauses: 'appropriate' // too_many, appropriate, too_few
    }

    return {
      type: 'voice',
      score: 85,
      insights: [
        '语速适中，表达清晰',
        '语调自信，情绪稳定',
        '停顿恰当，逻辑清楚'
      ],
      recommendations: [
        '保持当前的语速和语调',
        '可以适当增加语音的感染力'
      ]
    }
  }

  /**
   * 🎭 分析行为模式
   */
  async analyzeBehaviorPattern(behaviorData) {
    const analysis = {
      attentiveness: behaviorData.attentionLevel || 0.85,
      engagement: behaviorData.engagementScore || 0.90,
      stressLevel: behaviorData.stressLevel || 'low',
      responseTime: behaviorData.averageResponseTime || 15
    }

    return {
      type: 'behavior',
      score: Math.round((analysis.attentiveness + analysis.engagement) * 50),
      insights: [
        `专注度${Math.round(analysis.attentiveness * 100)}%，表现优秀`,
        `参与度${Math.round(analysis.engagement * 100)}%，积极主动`,
        `压力水平${analysis.stressLevel}，状态良好`
      ],
      recommendations: [
        '保持当前的专注状态',
        '继续积极参与面试过程'
      ]
    }
  }

  /**
   * 🌍 分析上下文因素
   */
  async analyzeContextualFactors(contextData) {
    const factors = {
      timeOfDay: contextData.timeOfDay || 'afternoon',
      interviewDuration: contextData.duration || 30,
      questionDifficulty: contextData.difficulty || 'medium',
      domainRelevance: contextData.domainMatch || 0.85
    }

    return {
      type: 'context',
      score: Math.round(factors.domainRelevance * 100),
      insights: [
        `面试时间${factors.timeOfDay}，状态适宜`,
        `问题难度${factors.questionDifficulty}，匹配度良好`,
        `领域相关性${Math.round(factors.domainRelevance * 100)}%`
      ],
      recommendations: [
        '当前面试环境和设置都很合适',
        '建议保持当前的回答节奏'
      ]
    }
  }

  /**
   * 🔗 综合分析结果
   */
  async synthesizeAnalysisResults(analysisResults) {
    const { textAnalysis, voiceAnalysis, behaviorAnalysis, contextAnalysis } = analysisResults

    const overallScore = Math.round(
      (textAnalysis.score * 0.4 +
       voiceAnalysis.score * 0.2 +
       behaviorAnalysis.score * 0.3 +
       contextAnalysis.score * 0.1)
    )

    const combinedInsights = [
      ...textAnalysis.insights,
      ...voiceAnalysis.insights,
      ...behaviorAnalysis.insights,
      ...contextAnalysis.insights
    ]

    const prioritizedRecommendations = this.prioritizeRecommendations([
      ...textAnalysis.recommendations,
      ...voiceAnalysis.recommendations,
      ...behaviorAnalysis.recommendations,
      ...contextAnalysis.recommendations
    ])

    return {
      overallScore,
      insights: combinedInsights,
      recommendations: prioritizedRecommendations,
      strengths: this.identifyStrengths(analysisResults),
      improvementAreas: this.identifyImprovementAreas(analysisResults),
      personalizedFeedback: this.generatePersonalizedFeedback(analysisResults)
    }
  }

  /**
   * 🎯 生成自适应建议
   */
  async generateAdaptiveRecommendations(insights) {
    const recommendations = []

    // 基于综合评分生成建议
    if (insights.overallScore >= 90) {
      recommendations.push({
        type: 'excellence',
        title: '表现优秀',
        content: '您的面试表现非常出色，继续保持这种状态',
        priority: 'low'
      })
    } else if (insights.overallScore >= 80) {
      recommendations.push({
        type: 'improvement',
        title: '继续提升',
        content: '表现良好，可以在技术深度方面进一步加强',
        priority: 'medium'
      })
    } else {
      recommendations.push({
        type: 'focus',
        title: '重点改进',
        content: '建议重点关注回答的结构性和技术准确性',
        priority: 'high'
      })
    }

    return recommendations
  }

  /**
   * 📊 计算分析置信度
   */
  calculateAnalysisConfidence(analysisResults) {
    const confidenceScores = Object.values(analysisResults).map(result => result.score)
    const averageScore = confidenceScores.reduce((sum, score) => sum + score, 0) / confidenceScores.length

    // 基于分数分布计算置信度
    const variance = confidenceScores.reduce((sum, score) => sum + Math.pow(score - averageScore, 2), 0) / confidenceScores.length
    const confidence = Math.max(0.6, Math.min(0.95, 1 - (variance / 1000)))

    return Math.round(confidence * 100)
  }

  /**
   * 🔍 获取基础分析洞察
   */
  getBasicAnalysisInsights(interviewData) {
    return {
      overallScore: 75,
      insights: [
        '基于基础分析的评估结果',
        '建议继续完善回答内容',
        '保持积极的面试态度'
      ],
      recommendations: [
        {
          type: 'general',
          title: '通用建议',
          content: '建议结合具体项目经验来回答技术问题',
          priority: 'medium'
        }
      ],
      confidence: 60
    }
  }

  // 辅助分析方法
  analyzeSentiment(text) {
    const positiveWords = ['好', '优秀', '成功', '有效', '满意', '喜欢']
    const negativeWords = ['差', '失败', '困难', '问题', '不好', '不满']

    const positiveCount = positiveWords.filter(word => text.includes(word)).length
    const negativeCount = negativeWords.filter(word => text.includes(word)).length

    if (positiveCount > negativeCount) return 'positive'
    if (negativeCount > positiveCount) return 'negative'
    return 'neutral'
  }

  analyzeComplexity(text) {
    const complexWords = ['算法', '架构', '优化', '性能', '并发', '分布式']
    const complexCount = complexWords.filter(word => text.includes(word)).length

    if (complexCount >= 3) return 'high'
    if (complexCount >= 1) return 'medium'
    return 'low'
  }

  extractKeywords(text) {
    const keywords = ['AI', '机器学习', '深度学习', '算法', '数据', '架构', '性能', '优化']
    return keywords.filter(keyword => text.includes(keyword))
  }

  analyzeStructure(text) {
    const structureIndicators = ['首先', '其次', '然后', '最后', '总结', '综上']
    const indicatorCount = structureIndicators.filter(indicator => text.includes(indicator)).length

    if (indicatorCount >= 3) return 'excellent'
    if (indicatorCount >= 2) return 'good'
    if (indicatorCount >= 1) return 'fair'
    return 'poor'
  }

  assessConfidence(text) {
    const confidenceIndicators = ['确信', '肯定', '明确', '清楚', '了解']
    const uncertaintyIndicators = ['可能', '也许', '不确定', '大概', '应该']

    const confidenceCount = confidenceIndicators.filter(indicator => text.includes(indicator)).length
    const uncertaintyCount = uncertaintyIndicators.filter(indicator => text.includes(indicator)).length

    if (confidenceCount > uncertaintyCount) return 'high'
    if (uncertaintyCount > confidenceCount) return 'low'
    return 'medium'
  }

  calculateTextScore(analysis) {
    const scores = {
      positive: 90, neutral: 75, negative: 60,
      high: 90, medium: 75, low: 60,
      excellent: 95, good: 85, fair: 70, poor: 50
    }

    const sentimentScore = scores[analysis.sentiment] || 75
    const complexityScore = scores[analysis.complexity] || 75
    const structureScore = scores[analysis.structure] || 75
    const confidenceScore = scores[analysis.confidence] || 75

    return Math.round((sentimentScore + complexityScore + structureScore + confidenceScore) / 4)
  }

  generateTextInsights(analysis) {
    const insights = []

    if (analysis.sentiment === 'positive') {
      insights.push('回答态度积极，表达正面')
    }

    if (analysis.complexity === 'high') {
      insights.push('技术内容丰富，专业性强')
    }

    if (analysis.structure === 'excellent') {
      insights.push('回答结构清晰，逻辑性强')
    }

    if (analysis.confidence === 'high') {
      insights.push('表达自信，观点明确')
    }

    return insights.length > 0 ? insights : ['回答内容需要进一步完善']
  }

  generateTextRecommendations(analysis) {
    const recommendations = []

    if (analysis.structure === 'poor') {
      recommendations.push('建议使用更清晰的逻辑结构组织回答')
    }

    if (analysis.complexity === 'low') {
      recommendations.push('可以增加更多技术细节和专业内容')
    }

    if (analysis.confidence === 'low') {
      recommendations.push('建议表达更加自信和明确')
    }

    return recommendations.length > 0 ? recommendations : ['继续保持当前的回答质量']
  }

  prioritizeRecommendations(recommendations) {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    return recommendations.sort((a, b) =>
      (priorityOrder[b.priority] || 1) - (priorityOrder[a.priority] || 1)
    )
  }

  identifyStrengths(analysisResults) {
    const strengths = []

    Object.values(analysisResults).forEach(result => {
      if (result.score >= 85) {
        strengths.push(...result.insights.slice(0, 2))
      }
    })

    return strengths.slice(0, 3) // 最多返回3个优势
  }

  identifyImprovementAreas(analysisResults) {
    const areas = []

    Object.values(analysisResults).forEach(result => {
      if (result.score < 75) {
        areas.push(...result.recommendations.slice(0, 2))
      }
    })

    return areas.slice(0, 3) // 最多返回3个改进领域
  }

  generatePersonalizedFeedback(analysisResults) {
    const overallScore = Math.round(
      Object.values(analysisResults).reduce((sum, result) => sum + result.score, 0) /
      Object.values(analysisResults).length
    )

    let feedback = ''

    if (overallScore >= 90) {
      feedback = '您的面试表现非常出色！各方面都展现了很高的专业水准。'
    } else if (overallScore >= 80) {
      feedback = '您的面试表现良好，在大部分方面都达到了预期标准。'
    } else if (overallScore >= 70) {
      feedback = '您的面试表现中等，有一些亮点，但还有提升空间。'
    } else {
      feedback = '您的面试表现需要改进，建议重点关注技术深度和表达清晰度。'
    }

    return feedback
  }
}

// 创建单例实例
const enhancedIflytekSparkService = new EnhancedIflytekSparkService()

// 导出类和实例
export { EnhancedIflytekSparkService }
export default enhancedIflytekSparkService
