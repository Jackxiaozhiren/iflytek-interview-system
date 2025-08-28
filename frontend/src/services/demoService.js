/**
 * 🎯 iFlytek Spark 智能面试系统 - 演示服务
 * 提供系统演示、功能展示、交互指导等服务
 * 专注于文本和语音交互的智能面试体验
 */

// 基础演示数据
export const basicDemoData = {
  systemOverview: {
    title: 'iFlytek Spark 智能面试系统',
    description: '基于讯飞星火大模型的智能面试评估平台',
    version: '2.0.0',
    lastUpdate: '2024-06-15',
    features: [
      '智能问题生成',
      '文本语义分析',
      '语音识别与分析',
      '实时评估反馈',
      '个性化学习路径',
      '专业报告生成',
      '数据可视化分析'
    ],
    supportedDomains: ['人工智能', '大数据', '物联网', '软件开发', '产品管理'],
    technicalHighlights: [
      '讯飞星火大模型驱动',
      '实时语音识别与分析',
      '智能文本语义理解',
      '多维度能力评估',
      '自适应难度调整',
      '企业级安全保障'
    ]
  },
  
  performanceMetrics: {
    responseTime: '< 200ms',
    accuracy: '95.8%',
    userSatisfaction: '4.8/5.0',
    systemUptime: '99.9%',
    concurrentUsers: '10,000+',
    dataProcessed: '1TB+/day'
  }
};

// 模拟数据生成器
export const generateMockData = {
  // 生成模拟语音分析数据
  speechAnalysis: () => ({
    confidence: Math.random() * 0.3 + 0.7, // 0.7-1.0
    fluency: Math.random() * 0.2 + 0.8,    // 0.8-1.0
    clarity: Math.random() * 0.25 + 0.75,  // 0.75-1.0
    pace: Math.random() * 0.3 + 0.7,       // 0.7-1.0
    volume: Math.random() * 0.2 + 0.8,     // 0.8-1.0
    keywords: ['机器学习', '深度学习', '神经网络', '算法优化', '数据处理'],
    emotions: {
      confidence: Math.random() * 0.4 + 0.6,
      nervousness: Math.random() * 0.3,
      enthusiasm: Math.random() * 0.3 + 0.7
    }
  }),

  // 生成模拟文本分析数据
  textAnalysis: () => ({
    technicalAccuracy: Math.random() * 0.3 + 0.7,
    logicalStructure: Math.random() * 0.25 + 0.75,
    vocabularyRichness: Math.random() * 0.2 + 0.8,
    responseCompleteness: Math.random() * 0.3 + 0.7,
    keywordMatching: Math.random() * 0.35 + 0.65,
    sentimentAnalysis: {
      positive: Math.random() * 0.4 + 0.6,
      neutral: Math.random() * 0.3 + 0.2,
      negative: Math.random() * 0.2
    },
    complexityScore: Math.random() * 0.3 + 0.7
  })
};

// 功能演示数据
export const featuresDemos = [
  {
    id: 'text-interview',
    title: '智能文本面试',
    icon: 'Document',
    description: '基于iFlytek Spark大模型的智能文本对话面试系统，提供完整的面试体验',
    category: '核心功能',
    difficulty: '入门',
    estimatedTime: '15-20分钟',
    highlights: [
      '真实iFlytek Spark LLM集成',
      '智能问题动态生成',
      '实时语义分析与评估',
      '上下文理解与记忆',
      '个性化反馈与指导',
      '多轮深度对话支持',
      '专业能力评估报告'
    ],
    technicalSpecs: {
      model: 'iFlytek Spark 3.5',
      responseTime: '< 500ms',
      accuracy: '96.2%',
      languages: '中文优化',
      features: '文本优先模式'
    }
  },

  {
    id: 'ai-evaluation',
    title: 'AI智能评估',
    icon: 'TrendCharts',
    description: '多维度智能评估系统，提供专业的能力分析报告',
    category: '评估分析',
    difficulty: '中级',
    estimatedTime: '6分钟',
    highlights: [
      '六大核心能力评估',
      '实时分析反馈',
      '个性化建议',
      '学习路径推荐',
      '可视化报告'
    ],
    technicalSpecs: {
      dimensions: '6个核心维度',
      algorithms: '机器学习+规则引擎',
      accuracy: '94.5%',
      reportFormat: 'PDF/HTML'
    }
  }
];

// 交互式演示步骤
export const interactiveSteps = [
  {
    id: 'step-1',
    title: '系统初始化',
    description: '登录系统，选择面试领域和岗位类型',
    duration: '2分钟',
    timeRange: '0:00 - 2:00',
    actions: ['用户注册/登录', '选择技术领域', '配置面试参数', '系统环境检测'],
    expectedOutcome: '完成系统配置，准备开始面试',
    tips: '建议选择您最熟悉的技术领域，这样能更好地展示专业能力'
  },
  {
    id: 'step-2',
    title: '智能问答对话',
    description: '与AI面试官进行多轮智能对话，展示专业知识和思维能力',
    duration: '8分钟',
    timeRange: '2:00 - 10:00',
    actions: ['AI问题生成', '候选人回答', '实时语义分析', '追问和深入', '知识点考查'],
    expectedOutcome: '完成核心技术问题的问答，展示专业水平',
    tips: '回答要条理清晰，可以结合具体项目经验来说明'
  },
  {
    id: 'step-3',
    title: '能力评估分析',
    description: '系统进行多维度能力分析，生成详细的评估报告',
    duration: '3分钟',
    timeRange: '10:00 - 13:00',
    actions: ['数据分析处理', '能力维度评分', '优势劣势识别', '改进建议生成', '学习路径推荐'],
    expectedOutcome: '获得专业的能力评估报告和个性化建议',
    tips: '仔细查看评估结果，重点关注改进建议和学习路径'
  }
];

// 演示场景配置
export const demoScenarios = {
  quickDemo: {
    title: '快速体验',
    description: '5分钟快速体验核心功能',
    duration: '5分钟',
    steps: ['step-1', 'step-2'],
    targetAudience: '初次使用者'
  },
  fullDemo: {
    title: '完整演示',
    description: '完整体验所有功能模块',
    duration: '15分钟',
    steps: ['step-1', 'step-2', 'step-3'],
    targetAudience: '深度用户'
  },
  technicalDemo: {
    title: '技术深度体验',
    description: '专注于技术能力评估的深度体验',
    duration: '12分钟',
    steps: ['step-1', 'step-2', 'step-3'],
    targetAudience: '技术专家'
  }
};

// 演示服务类
export class DemoService {
  // 获取功能演示数据
  static getFeatures(category = null) {
    if (category) {
      return featuresDemos.filter(feature => feature.category === category)
    }
    return featuresDemos
  }

  // 获取交互步骤
  static getInteractiveSteps() {
    return interactiveSteps
  }

  // 获取演示场景
  static getDemoScenarios() {
    return demoScenarios
  }

  // 获取演示统计信息
  static getDemoStats() {
    return {
      totalFeatures: featuresDemos.length,
      totalSteps: interactiveSteps.length,
      categories: [...new Set(featuresDemos.map(f => f.category))],
      difficulties: [...new Set(featuresDemos.map(f => f.difficulty))],
      estimatedTotalTime: featuresDemos.reduce((total, feature) => {
        const time = parseInt(feature.estimatedTime) || 0;
        return total + time;
      }, 0)
    }
  }

  // 搜索演示内容
  static searchDemo(keyword) {
    const results = {
      features: [],
      steps: []
    }

    if (keyword && keyword.trim()) {
      const lowerKeyword = keyword.toLowerCase()

      results.features = featuresDemos.filter(feature =>
        feature.title.toLowerCase().includes(lowerKeyword) ||
        feature.description.toLowerCase().includes(lowerKeyword)
      )

      results.steps = interactiveSteps.filter(step =>
        step.title.toLowerCase().includes(lowerKeyword) ||
        step.description.toLowerCase().includes(lowerKeyword)
      )
    }

    return results
  }

  // 获取推荐内容
  static getRecommendations(userLevel = 'beginner') {
    const levelMap = {
      beginner: '入门',
      intermediate: '中级',
      advanced: '高级'
    }
    const targetLevel = levelMap[userLevel] || '入门'

    return {
      features: featuresDemos.filter(f => f.difficulty === targetLevel).slice(0, 3),
      steps: interactiveSteps.filter(s => s.difficulty === targetLevel).slice(0, 3)
    }
  }

  // 获取演示进度
  static getDemoProgress(completedItems = []) {
    const totalItems = featuresDemos.length + interactiveSteps.length
    const completedCount = completedItems.length
    const progress = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0

    return {
      total: totalItems,
      completed: completedCount,
      remaining: totalItems - completedCount,
      progress: progress,
      nextRecommendation: this.getNextRecommendation(completedItems)
    }
  }

  // 获取下一个推荐项目
  static getNextRecommendation(completedItems = []) {
    const allItems = [
      ...featuresDemos.map(f => ({ ...f, type: 'feature' })),
      ...interactiveSteps.map(s => ({ ...s, type: 'step' }))
    ]

    const completedIds = completedItems.map(item => item.id || item)
    const remainingItems = allItems.filter(item => !completedIds.includes(item.id))

    if (remainingItems.length === 0) {
      return null
    }

    // 优先推荐入门级别的内容
    const beginnerItems = remainingItems.filter(item => item.difficulty === '入门')
    if (beginnerItems.length > 0) {
      return beginnerItems[0]
    }

    return remainingItems[0]
  }
}

// 默认导出
export default DemoService
