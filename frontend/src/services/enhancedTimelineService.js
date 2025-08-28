/**
 * 增强的面试时间轴服务
 * 生成详细的面试时间轴数据和分析内容
 */

class EnhancedTimelineService {
  constructor() {
    this.timelineTemplates = {
      excellent: {
        icon: 'Star',
        color: '#52c41a',
        bgColor: 'linear-gradient(135deg, #f6ffed, #fafafa)',
        borderColor: '#52c41a'
      },
      good: {
        icon: 'TrendCharts',
        color: '#1890ff',
        bgColor: 'linear-gradient(135deg, #e6f7ff, #fafafa)',
        borderColor: '#1890ff'
      },
      warning: {
        icon: 'Warning',
        color: '#faad14',
        bgColor: 'linear-gradient(135deg, #fffbe6, #fafafa)',
        borderColor: '#faad14'
      },
      critical: {
        icon: 'Close',
        color: '#ff4d4f',
        bgColor: 'linear-gradient(135deg, #fff2f0, #fafafa)',
        borderColor: '#ff4d4f'
      }
    }

    this.modalityIcons = {
      voice: 'Microphone',
      video: 'VideoCamera',
      text: 'ChatDotRound',
      emotion: 'Smile',
      gesture: 'Hand'
    }

    this.analysisCategories = {
      technical: '技术能力',
      communication: '沟通表达',
      emotion: '情绪状态',
      logic: '逻辑思维',
      creativity: '创新思维',
      teamwork: '团队协作',
      learning: '学习能力'
    }
  }

  /**
   * 🕒 生成增强的时间轴事件
   */
  generateEnhancedTimelineEvents(interviewData = {}) {
    const events = []
    const duration = interviewData.duration || 30 // 默认30分钟面试
    
    // 开场阶段 (0-5分钟)
    events.push(...this.generateOpeningEvents())
    
    // 技术问答阶段 (5-15分钟)
    events.push(...this.generateTechnicalEvents())
    
    // 深度讨论阶段 (15-25分钟)
    events.push(...this.generateDeepDiscussionEvents())
    
    // 收尾阶段 (25-30分钟)
    events.push(...this.generateClosingEvents())
    
    return events.map((event, index) => ({
      ...event,
      id: index + 1,
      sequence: index + 1
    }))
  }

  /**
   * 🎬 生成开场阶段事件
   */
  generateOpeningEvents() {
    return [
      {
        time: '00:02',
        duration: '2分钟',
        type: 'excellent',
        icon: 'User',
        title: '开场表现优秀',
        description: '候选人展现出良好的职业素养和沟通能力，语音清晰度高达94%，表情自然得体，文本表达准确流畅，为面试开了一个好头。整体给人留下专业、自信的第一印象。',
        score: 92,
        tags: [
          { name: '语音清晰', type: 'success' },
          { name: '表情自然', type: 'primary' },
          { name: '表达准确', type: 'success' },
          { name: '职业素养', type: 'primary' }
        ],
        modalities: [
          { type: 'voice', icon: 'Microphone', name: '语音分析', score: 94 },
          { type: 'video', icon: 'VideoCamera', name: '视频分析', score: 89 },
          { type: 'text', icon: 'ChatDotRound', name: '文本分析', score: 93 }
        ],
        analysis: [
          {
            type: 'voice',
            icon: 'Microphone',
            title: '语音质量分析',
            level: 'success',
            levelText: '优秀',
            metrics: [
              { name: '清晰度', value: 94 },
              { name: '语速适中', value: 88 },
              { name: '音调稳定', value: 91 },
              { name: '停顿合理', value: 87 }
            ],
            insights: [
              '语音清晰度达到专业水准，发音标准',
              '语速控制得当，便于理解和记录',
              '音调变化自然，体现良好的表达能力'
            ]
          },
          {
            type: 'video',
            icon: 'VideoCamera',
            title: '视觉表现分析',
            level: 'primary',
            levelText: '良好',
            metrics: [
              { name: '眼神交流', value: 89 },
              { name: '表情自然', value: 92 },
              { name: '姿态端正', value: 86 },
              { name: '专注度', value: 90 }
            ],
            insights: [
              '眼神交流自然，展现自信',
              '表情真诚，给人亲和感',
              '坐姿端正，体现专业态度'
            ]
          }
        ],
        suggestions: [
          { id: 1, content: '保持当前的优秀状态，继续展现专业素养', priority: '维持' }
        ],
        highlighted: true
      },
      {
        time: '03:45',
        duration: '3分钟',
        type: 'excellent',
        icon: 'User',
        title: '自我介绍亮点突出',
        description: '结构化表达能力强，逻辑清晰，重点突出。语音节奏控制得当，眼神交流自然，技术背景介绍专业且具体。展现出良好的自我认知和表达组织能力。',
        score: 89,
        tags: [
          { name: '结构清晰', type: 'success' },
          { name: '重点突出', type: 'primary' },
          { name: '专业表达', type: 'success' }
        ],
        modalities: [
          { type: 'text', icon: 'ChatDotRound', name: '文本分析', score: 91 },
          { type: 'voice', icon: 'Microphone', name: '语音分析', score: 88 },
          { type: 'video', icon: 'VideoCamera', name: '视频分析', score: 87 }
        ],
        analysis: [
          {
            type: 'text',
            icon: 'ChatDotRound',
            title: '内容结构分析',
            level: 'success',
            levelText: '优秀',
            metrics: [
              { name: '逻辑性', value: 91 },
              { name: '完整性', value: 89 },
              { name: '重点突出', value: 93 },
              { name: '专业性', value: 88 }
            ],
            insights: [
              '自我介绍结构完整，层次分明',
              '技术背景描述专业准确',
              '个人优势表达清晰有力'
            ]
          }
        ],
        suggestions: [
          { id: 1, content: '可以增加一些具体的项目成果数据', priority: '低优先级' }
        ]
      }
    ]
  }

  /**
   * 🔧 生成技术问答阶段事件
   */
  generateTechnicalEvents() {
    return [
      {
        time: '05:30',
        duration: '4分钟',
        type: 'excellent',
        icon: 'Cpu',
        title: '技术深度展现',
        description: '专业术语使用准确率达91%，技术理解深入，能够清晰阐述复杂概念。语音表达中体现出扎实的技术功底和实践经验，对技术原理的理解透彻。',
        score: 88,
        tags: [
          { name: '专业术语', type: 'success' },
          { name: '理解深入', type: 'primary' },
          { name: '实践经验', type: 'success' }
        ],
        modalities: [
          { type: 'text', icon: 'ChatDotRound', name: '文本分析', score: 91 },
          { type: 'voice', icon: 'Microphone', name: '语音分析', score: 86 }
        ],
        analysis: [
          {
            type: 'technical',
            icon: 'Cpu',
            title: '技术能力评估',
            level: 'success',
            levelText: '优秀',
            metrics: [
              { name: '技术深度', value: 88 },
              { name: '概念理解', value: 91 },
              { name: '实践应用', value: 85 },
              { name: '创新思维', value: 82 }
            ],
            insights: [
              '对核心技术概念理解准确',
              '能够结合实际项目经验说明',
              '展现出持续学习的技术态度'
            ]
          }
        ],
        suggestions: [
          { id: 1, content: '可以分享更多技术实践中的具体案例', priority: '中优先级' }
        ]
      },
      {
        time: '08:12',
        duration: '5分钟',
        type: 'good',
        icon: 'Project',
        title: '项目经验详述',
        description: '项目描述具体详实，技术栈掌握全面。通过具体案例展示问题解决能力，语音情感表达积极，展现出对技术工作的热情和责任心。',
        score: 85,
        tags: [
          { name: '项目详实', type: 'success' },
          { name: '技术全面', type: 'primary' },
          { name: '解决能力', type: 'success' }
        ],
        modalities: [
          { type: 'text', icon: 'ChatDotRound', name: '文本分析', score: 87 },
          { type: 'voice', icon: 'Microphone', name: '语音分析', score: 84 },
          { type: 'video', icon: 'VideoCamera', name: '视频分析', score: 83 }
        ],
        suggestions: [
          { id: 1, content: '可以更多强调个人在项目中的核心贡献', priority: '中优先级' }
        ]
      }
    ]
  }

  /**
   * 💭 生成深度讨论阶段事件
   */
  generateDeepDiscussionEvents() {
    return [
      {
        time: '12:15',
        duration: '3分钟',
        type: 'warning',
        icon: 'Warning',
        title: '压力应对能力测试',
        description: '面对复杂技术问题时出现轻微紧张，语音略有停顿，但能够快速调整状态，展现出良好的抗压能力和自我调节能力。整体应对策略合理。',
        score: 76,
        tags: [
          { name: '轻微紧张', type: 'warning' },
          { name: '快速调整', type: 'success' },
          { name: '抗压能力', type: 'primary' }
        ],
        modalities: [
          { type: 'video', icon: 'VideoCamera', name: '视频分析', score: 74 },
          { type: 'voice', icon: 'Microphone', name: '语音分析', score: 78 }
        ],
        analysis: [
          {
            type: 'emotion',
            icon: 'Smile',
            title: '情绪状态分析',
            level: 'warning',
            levelText: '需关注',
            metrics: [
              { name: '情绪稳定', value: 76 },
              { name: '压力应对', value: 78 },
              { name: '自我调节', value: 82 },
              { name: '恢复能力', value: 80 }
            ],
            insights: [
              '面对压力时有短暂的情绪波动',
              '自我调节能力较强，能快速恢复',
              '整体抗压表现在可接受范围内'
            ]
          }
        ],
        suggestions: [
          { id: 1, content: '建议加强压力情况下的情绪管理训练', priority: '中优先级' },
          { id: 2, content: '可以通过深呼吸等技巧来缓解紧张情绪', priority: '低优先级' }
        ]
      },
      {
        time: '15:48',
        duration: '4分钟',
        type: 'excellent',
        icon: 'Star',
        title: '创新思维展现',
        description: '在讨论技术方案时展现出创新思维，提出了独特的解决思路。语音表达充满自信，肢体语言积极，体现出强烈的技术探索欲望和创新潜力。',
        score: 90,
        tags: [
          { name: '创新思维', type: 'success' },
          { name: '独特思路', type: 'primary' },
          { name: '技术探索', type: 'success' }
        ],
        modalities: [
          { type: 'text', icon: 'ChatDotRound', name: '文本分析', score: 92 },
          { type: 'voice', icon: 'Microphone', name: '语音分析', score: 89 },
          { type: 'video', icon: 'VideoCamera', name: '视频分析', score: 88 }
        ],
        highlighted: true
      }
    ]
  }

  /**
   * 🏁 生成收尾阶段事件
   */
  generateClosingEvents() {
    return [
      {
        time: '25:20',
        duration: '3分钟',
        type: 'good',
        icon: 'DataBoard',
        title: '综合素质评估',
        description: '整体表现稳定，多模态数据一致性良好。技术能力、沟通表达、学习能力等各方面均达到预期水平，展现出全面的职业素养和发展潜力。',
        score: 87,
        tags: [
          { name: '表现稳定', type: 'success' },
          { name: '数据一致', type: 'primary' },
          { name: '全面素养', type: 'success' }
        ],
        modalities: [
          { type: 'voice', icon: 'Microphone', name: '语音分析', score: 87 },
          { type: 'video', icon: 'VideoCamera', name: '视频分析', score: 86 },
          { type: 'text', icon: 'ChatDotRound', name: '文本分析', score: 88 }
        ]
      },
      {
        time: '28:45',
        duration: '2分钟',
        type: 'good',
        icon: 'Star',
        title: '面试收尾表现',
        description: '面试结束阶段保持专业态度，对面试过程表示感谢，语音表达礼貌得体，展现出良好的职业礼仪和个人修养。整体给人留下积极正面的印象。',
        score: 84,
        tags: [
          { name: '专业态度', type: 'success' },
          { name: '礼貌得体', type: 'primary' },
          { name: '职业礼仪', type: 'success' }
        ],
        modalities: [
          { type: 'voice', icon: 'Microphone', name: '语音分析', score: 85 },
          { type: 'video', icon: 'VideoCamera', name: '视频分析', score: 83 }
        ]
      }
    ]
  }

  /**
   * 📊 生成时间轴统计数据
   */
  generateTimelineStatistics(events) {
    const scores = events.map(event => event.score).filter(score => score)
    const averageScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 0
    
    const peakMoments = events.filter(event => event.score >= 90 || event.highlighted).length
    const improvementAreas = events.filter(event => event.type === 'warning' || event.type === 'critical').length
    
    // 计算多模态一致性
    const modalityConsistency = this.calculateModalityConsistency(events)
    
    return {
      averageScore: parseFloat(averageScore),
      peakMoments,
      improvementAreas,
      modalityConsistency,
      totalEvents: events.length,
      excellentEvents: events.filter(e => e.type === 'excellent').length,
      goodEvents: events.filter(e => e.type === 'good').length,
      warningEvents: events.filter(e => e.type === 'warning').length
    }
  }

  /**
   * 🔄 计算多模态一致性
   */
  calculateModalityConsistency(events) {
    let totalConsistency = 0
    let validEvents = 0
    
    events.forEach(event => {
      if (event.modalities && event.modalities.length > 1) {
        const scores = event.modalities.map(m => m.score)
        const maxScore = Math.max(...scores)
        const minScore = Math.min(...scores)
        const consistency = ((maxScore - minScore) / maxScore) * 100
        totalConsistency += (100 - consistency)
        validEvents++
      }
    })
    
    return validEvents > 0 ? Math.round(totalConsistency / validEvents) : 85
  }

  /**
   * 🎯 生成进度标记点
   */
  generateProgressMarkers(duration = 30) {
    const markers = []
    const intervals = [0, 5, 10, 15, 20, 25, 30]
    const descriptions = [
      '面试开始', '自我介绍', '技术问答', '项目经验', 
      '深度讨论', '综合评估', '面试结束'
    ]
    
    intervals.forEach((time, index) => {
      if (time <= duration) {
        markers.push({
          time: `${time.toString().padStart(2, '0')}:00`,
          position: (time / duration) * 100,
          description: descriptions[index] || `${time}分钟`,
          passed: false // 这个会在组件中动态更新
        })
      }
    })
    
    return markers
  }

  /**
   * 🔍 分析事件类型分布
   */
  analyzeEventDistribution(events) {
    const distribution = {
      excellent: 0,
      good: 0,
      warning: 0,
      critical: 0
    }
    
    events.forEach(event => {
      if (distribution.hasOwnProperty(event.type)) {
        distribution[event.type]++
      }
    })
    
    return distribution
  }

  /**
   * 💡 生成改进建议
   */
  generateImprovementSuggestions(events, statistics) {
    const suggestions = []
    
    if (statistics.averageScore < 80) {
      suggestions.push({
        priority: '高优先级',
        category: '整体表现',
        content: '建议加强面试准备，提升整体表现水平'
      })
    }
    
    if (statistics.warningEvents > 2) {
      suggestions.push({
        priority: '中优先级',
        category: '压力管理',
        content: '建议加强压力情况下的情绪管理和应对能力'
      })
    }
    
    if (statistics.modalityConsistency < 85) {
      suggestions.push({
        priority: '中优先级',
        category: '表达一致性',
        content: '建议提升语音、视频、文本等多模态表达的一致性'
      })
    }
    
    return suggestions
  }
}

// 创建单例实例
const enhancedTimelineService = new EnhancedTimelineService()

export default enhancedTimelineService
