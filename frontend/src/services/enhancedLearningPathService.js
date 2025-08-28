/**
 * 增强学习路径服务
 * Enhanced Learning Path Service
 * 
 * 提供智能化、个性化的学习路径推荐服务
 * 集成iFlytek Spark LLM技术，支持六维能力评估
 */

import request from '@/utils/request'

class EnhancedLearningPathService {
  constructor() {
    this.domains = this.initializeDomains()
    this.pathTypes = this.initializePathTypes()
    this.resources = this.initializeResources()
  }

  /**
   * 初始化技术领域数据
   */
  initializeDomains() {
    return {
      '人工智能': {
        id: 'ai',
        name: '人工智能',
        description: '机器学习、深度学习、自然语言处理等前沿AI技术',
        icon: 'cpu',
        color: '#4c51bf',
        subDomains: ['机器学习', '深度学习', '计算机视觉', '自然语言处理', 'iFlytek语音技术'],
        positions: ['AI算法工程师', 'ML工程师', 'AI产品经理', 'AI研究员', '数据科学家'],
        skillLevels: {
          '初级': { months: 6, weeklyHours: 15 },
          '中级': { months: 12, weeklyHours: 20 },
          '高级': { months: 18, weeklyHours: 25 }
        }
      },
      '大数据': {
        id: 'bigdata',
        name: '大数据',
        description: '大数据处理、分析、挖掘和可视化技术',
        icon: 'data-analysis',
        color: '#f093fb',
        subDomains: ['数据工程', '数据分析', '数据挖掘', '实时计算', '数据可视化'],
        positions: ['大数据工程师', '数据分析师', '数据架构师', '大数据产品经理', 'BI工程师'],
        skillLevels: {
          '初级': { months: 4, weeklyHours: 12 },
          '中级': { months: 10, weeklyHours: 18 },
          '高级': { months: 16, weeklyHours: 22 }
        }
      },
      '物联网': {
        id: 'iot',
        name: '物联网',
        description: '嵌入式开发、传感器技术、边缘计算等IoT技术',
        icon: 'connection',
        color: '#a8edea',
        subDomains: ['嵌入式开发', '传感器技术', '无线通信', '边缘计算', '物联网安全'],
        positions: ['IoT工程师', '嵌入式工程师', '硬件工程师', 'IoT产品经理', '系统架构师'],
        skillLevels: {
          '初级': { months: 5, weeklyHours: 14 },
          '中级': { months: 11, weeklyHours: 19 },
          '高级': { months: 17, weeklyHours: 24 }
        }
      }
    }
  }

  /**
   * 初始化学习路径类型
   */
  initializePathTypes() {
    return {
      'quick_boost': {
        name: '快速提升',
        description: '针对薄弱环节，快速提升核心技能',
        duration: '2-4个月',
        intensity: '高强度',
        focus: '专项突破',
        color: '#ff6b6b'
      },
      'comprehensive': {
        name: '全面发展',
        description: '系统性学习，全面提升技术能力',
        duration: '6-12个月',
        intensity: '中等强度',
        focus: '全栈发展',
        color: '#4ecdc4'
      },
      'specialized': {
        name: '专项突破',
        description: '深度专精某一技术方向',
        duration: '8-18个月',
        intensity: '深度学习',
        focus: '专家级',
        color: '#45b7d1'
      }
    }
  }

  /**
   * 初始化学习资源
   */
  initializeResources() {
    return {
      books: {
        '人工智能': [
          { title: '机器学习实战', author: 'Peter Harrington', level: '初级', rating: 4.5 },
          { title: '深度学习', author: 'Ian Goodfellow', level: '中级', rating: 4.8 },
          { title: '统计学习方法', author: '李航', level: '高级', rating: 4.7 },
          { title: 'iFlytek语音技术开发指南', author: '科大讯飞', level: '中级', rating: 4.6 }
        ],
        '大数据': [
          { title: 'Hadoop权威指南', author: 'Tom White', level: '初级', rating: 4.4 },
          { title: 'Spark快速大数据分析', author: 'Holden Karau', level: '中级', rating: 4.6 },
          { title: '大数据架构师指南', author: '刘春辉', level: '高级', rating: 4.5 }
        ],
        '物联网': [
          { title: '物联网技术导论', author: '刘云浩', level: '初级', rating: 4.3 },
          { title: '嵌入式系统设计', author: 'Frank Vahid', level: '中级', rating: 4.5 },
          { title: '边缘计算技术与应用', author: '施巍松', level: '高级', rating: 4.4 }
        ]
      },
      courses: {
        '人工智能': [
          { title: 'Andrew Ng机器学习课程', platform: 'Coursera', duration: '11周', level: '初级' },
          { title: 'CS231n深度学习计算机视觉', platform: 'Stanford', duration: '16周', level: '中级' },
          { title: 'iFlytek开发者训练营', platform: '科大讯飞', duration: '8周', level: '中级' }
        ],
        '大数据': [
          { title: 'Hadoop生态系统', platform: 'Udacity', duration: '12周', level: '初级' },
          { title: 'Spark大数据处理', platform: '极客时间', duration: '10周', level: '中级' }
        ],
        '物联网': [
          { title: 'IoT基础与应用', platform: 'edX', duration: '8周', level: '初级' },
          { title: '嵌入式Linux开发', platform: '慕课网', duration: '14周', level: '中级' }
        ]
      },
      tools: {
        '人工智能': ['Python', 'TensorFlow', 'PyTorch', 'Jupyter', 'iFlytek SDK'],
        '大数据': ['Hadoop', 'Spark', 'Kafka', 'Elasticsearch', 'Tableau'],
        '物联网': ['Arduino', 'Raspberry Pi', 'MQTT', 'Node-RED', 'FreeRTOS']
      }
    }
  }

  /**
   * 根据六维能力评估生成个性化学习路径
   */
  async generatePersonalizedPath(assessmentData) {
    try {
      // 调用后端增强API
      const response = await request.post('/api/v1/enhanced-learning-paths/personalized', {
        domain: assessmentData.domain,
        position: assessmentData.position,
        skill_level: assessmentData.skillLevel,
        path_type: this.recommendPathType(assessmentData.sixDimensionScores, assessmentData.skillLevel),
        six_dimension_scores: assessmentData.sixDimensionScores,
        session_id: assessmentData.sessionId,
        preferences: assessmentData.preferences || {}
      })

      if (response.success) {
        return response.data
      } else {
        throw new Error(response.message || '生成学习路径失败')
      }
    } catch (error) {
      console.error('调用后端API失败，使用本地生成:', error)

      // 如果API调用失败，使用本地逻辑作为备用方案
      return this.generateLocalPath(assessmentData)
    }
  }

  /**
   * 本地生成学习路径（备用方案）
   */
  generateLocalPath(assessmentData) {
    const {
      domain,
      position,
      skillLevel,
      sixDimensionScores,
      sessionId
    } = assessmentData

    // 分析薄弱环节
    const weakAreas = this.analyzeWeakAreas(sixDimensionScores)

    // 生成学习模块
    const modules = this.generateLearningModules(domain, skillLevel, weakAreas)

    // 推荐学习路径类型
    const recommendedPathType = this.recommendPathType(sixDimensionScores, skillLevel)

    // 计算学习时间
    const timeline = this.calculateTimeline(modules, skillLevel)

    return {
      id: `path_${Date.now()}`,
      title: `${domain}${position}学习路径`,
      domain,
      position,
      skillLevel,
      pathType: recommendedPathType,
      weakAreas,
      modules,
      timeline,
      resources: this.getRecommendedResources(domain, skillLevel),
      createdAt: new Date().toISOString(),
      sessionId
    }
  }

  /**
   * 分析六维能力薄弱环节
   */
  analyzeWeakAreas(scores) {
    const dimensions = [
      { key: 'technical', name: '技术能力', threshold: 70 },
      { key: 'communication', name: '沟通表达', threshold: 75 },
      { key: 'logic', name: '逻辑思维', threshold: 70 },
      { key: 'problemSolving', name: '问题解决', threshold: 75 },
      { key: 'learning', name: '学习适应', threshold: 70 },
      { key: 'teamwork', name: '团队协作', threshold: 75 }
    ]

    return dimensions
      .filter(dim => scores[dim.key] < dim.threshold)
      .map(dim => ({
        dimension: dim.key,
        name: dim.name,
        score: scores[dim.key],
        improvement: dim.threshold - scores[dim.key]
      }))
      .sort((a, b) => b.improvement - a.improvement)
  }

  /**
   * 推荐学习路径类型
   */
  recommendPathType(scores, skillLevel) {
    const avgScore = Object.values(scores).reduce((sum, score) => sum + score, 0) / 6
    
    if (avgScore < 60) {
      return 'comprehensive' // 全面发展
    } else if (avgScore > 80) {
      return 'specialized' // 专项突破
    } else {
      return 'quick_boost' // 快速提升
    }
  }

  /**
   * 生成学习模块
   */
  generateLearningModules(domain, skillLevel, weakAreas) {
    const baseModules = this.getBaseModules(domain, skillLevel)
    const enhancedModules = this.enhanceModulesForWeakAreas(baseModules, weakAreas)

    return enhancedModules.map((module, index) => ({
      ...module,
      id: `module_${index + 1}`,
      order: index + 1,
      status: 'not_started'
    }))
  }

  /**
   * 获取基础学习模块
   */
  getBaseModules(domain, skillLevel) {
    const moduleTemplates = {
      '人工智能': {
        '初级': [
          {
            title: 'Python编程基础',
            description: '掌握Python语法、数据结构和面向对象编程',
            duration: 40,
            difficulty: 'beginner',
            objectives: ['Python语法掌握', '数据结构理解', 'OOP概念'],
            concepts: ['变量与数据类型', '控制流', '函数与模块', '类与对象'],
            projects: ['计算器程序', '文件处理工具', '简单爬虫'],
            assessment: ['编程练习', '项目作品', '代码审查']
          },
          {
            title: '机器学习入门',
            description: '理解机器学习基本概念和常用算法',
            duration: 60,
            difficulty: 'beginner',
            objectives: ['ML基本概念', '监督学习算法', '模型评估'],
            concepts: ['监督学习', '无监督学习', '特征工程', '模型评估'],
            projects: ['房价预测', '鸢尾花分类', '客户聚类'],
            assessment: ['理论测试', '算法实现', '项目报告']
          },
          {
            title: 'iFlytek语音技术基础',
            description: '学习科大讯飞语音识别和合成技术',
            duration: 30,
            difficulty: 'beginner',
            objectives: ['语音识别原理', 'TTS技术', 'SDK使用'],
            concepts: ['语音信号处理', 'ASR技术', 'TTS技术', 'API调用'],
            projects: ['语音助手', '语音转文字工具', '智能客服'],
            assessment: ['技术文档', 'Demo演示', '集成测试']
          }
        ],
        '中级': [
          {
            title: '深度学习框架',
            description: '掌握TensorFlow/PyTorch深度学习开发',
            duration: 80,
            difficulty: 'intermediate',
            objectives: ['神经网络原理', '框架使用', '模型优化'],
            concepts: ['神经网络', '反向传播', '优化算法', '正则化'],
            projects: ['图像分类器', '文本情感分析', '推荐系统'],
            assessment: ['模型性能', '代码质量', '创新性']
          },
          {
            title: '计算机视觉应用',
            description: '图像处理、目标检测和图像识别技术',
            duration: 70,
            difficulty: 'intermediate',
            objectives: ['图像处理', '目标检测', '特征提取'],
            concepts: ['卷积神经网络', 'YOLO算法', '图像增强', '特征匹配'],
            projects: ['人脸识别系统', '车牌识别', '医学影像分析'],
            assessment: ['算法精度', '实时性能', '应用场景']
          }
        ],
        '高级': [
          {
            title: '大模型与AGI',
            description: '大语言模型、多模态AI和通用人工智能',
            duration: 100,
            difficulty: 'advanced',
            objectives: ['Transformer架构', '多模态融合', 'AGI理论'],
            concepts: ['注意力机制', '预训练模型', '微调技术', '多模态学习'],
            projects: ['智能对话系统', '多模态内容生成', 'AI助手'],
            assessment: ['论文阅读', '模型创新', '系统设计']
          }
        ]
      },
      '大数据': {
        '初级': [
          {
            title: 'Hadoop生态系统',
            description: '分布式存储和计算基础',
            duration: 50,
            difficulty: 'beginner',
            objectives: ['HDFS理解', 'MapReduce编程', '集群管理'],
            concepts: ['分布式存储', 'MapReduce', 'YARN', 'Hive'],
            projects: ['日志分析系统', '数据仓库搭建', '批处理任务'],
            assessment: ['集群搭建', '程序开发', '性能优化']
          }
        ],
        '中级': [
          {
            title: 'Spark大数据处理',
            description: '内存计算和实时数据处理',
            duration: 60,
            difficulty: 'intermediate',
            objectives: ['Spark Core', 'Spark SQL', 'Streaming'],
            concepts: ['RDD操作', 'DataFrame', '流处理', '机器学习'],
            projects: ['实时推荐系统', '流式数据分析', 'ETL管道'],
            assessment: ['代码效率', '系统设计', '实时性能']
          }
        ]
      },
      '物联网': {
        '初级': [
          {
            title: '嵌入式系统基础',
            description: '微控制器编程和硬件接口',
            duration: 45,
            difficulty: 'beginner',
            objectives: ['单片机编程', '传感器接口', '通信协议'],
            concepts: ['ARM架构', 'GPIO控制', 'I2C/SPI', 'UART通信'],
            projects: ['温度监控系统', '智能灯控', '环境监测站'],
            assessment: ['硬件调试', '程序功能', '系统稳定性']
          }
        ]
      }
    }

    return moduleTemplates[domain]?.[skillLevel] || []
  }

  /**
   * 根据薄弱环节增强模块
   */
  enhanceModulesForWeakAreas(modules, weakAreas) {
    return modules.map(module => {
      const enhancedModule = { ...module }

      // 根据薄弱环节添加特定内容
      weakAreas.forEach(area => {
        switch (area.dimension) {
          case 'communication':
            enhancedModule.communicationFocus = [
              '技术文档写作',
              '代码注释规范',
              '项目演示技巧'
            ]
            break
          case 'teamwork':
            enhancedModule.teamworkFocus = [
              '代码协作规范',
              '版本控制使用',
              '团队沟通技巧'
            ]
            break
          case 'problemSolving':
            enhancedModule.problemSolvingFocus = [
              '调试技巧',
              '性能优化',
              '故障排查'
            ]
            break
        }
      })

      return enhancedModule
    })
  }

  /**
   * 计算学习时间线
   */
  calculateTimeline(modules, skillLevel) {
    const totalHours = modules.reduce((sum, module) => sum + module.duration, 0)
    const weeklyHours = this.getWeeklyHours(skillLevel)
    const totalWeeks = Math.ceil(totalHours / weeklyHours)

    return {
      totalHours,
      totalWeeks,
      weeklyHours,
      estimatedCompletion: this.addWeeks(new Date(), totalWeeks),
      milestones: this.generateMilestones(modules, weeklyHours)
    }
  }

  /**
   * 获取每周学习时间
   */
  getWeeklyHours(skillLevel) {
    const hours = {
      '初级': 15,
      '中级': 20,
      '高级': 25
    }
    return hours[skillLevel] || 20
  }

  /**
   * 添加周数到日期
   */
  addWeeks(date, weeks) {
    const result = new Date(date)
    result.setDate(result.getDate() + weeks * 7)
    return result.toISOString().split('T')[0]
  }

  /**
   * 生成学习里程碑
   */
  generateMilestones(modules, weeklyHours) {
    let currentWeek = 0
    return modules.map(module => {
      const moduleWeeks = Math.ceil(module.duration / weeklyHours)
      currentWeek += moduleWeeks
      return {
        moduleId: module.id,
        title: module.title,
        targetWeek: currentWeek,
        targetDate: this.addWeeks(new Date(), currentWeek)
      }
    })
  }

  /**
   * 获取推荐资源
   */
  async getRecommendedResources(domain, skillLevel) {
    try {
      const response = await request.get('/api/v1/enhanced-learning-paths/resources', {
        params: { domain, skill_level: skillLevel }
      })

      if (response.success) {
        return response.data
      }
    } catch (error) {
      console.error('获取推荐资源失败，使用本地数据:', error)
    }

    // 备用方案：使用本地数据
    return {
      books: this.resources.books[domain]?.filter(book =>
        book.level === skillLevel || book.level === '通用'
      ) || [],
      courses: this.resources.courses[domain] || [],
      tools: this.resources.tools[domain] || []
    }
  }

  /**
   * 获取可用领域和路径类型
   */
  async getAvailableDomainsAndTypes() {
    try {
      const response = await request.get('/api/v1/enhanced-learning-paths/domains')

      if (response.success) {
        return response.data
      }
    } catch (error) {
      console.error('获取领域信息失败，使用本地数据:', error)
    }

    // 备用方案：使用本地数据
    return {
      domains: Object.keys(this.domains),
      path_types: this.pathTypes
    }
  }

  /**
   * 更新学习进度
   */
  async updateLearningProgress(pathId, moduleId, progress, status, notes = null) {
    try {
      const response = await request.put(`/api/v1/enhanced-learning-paths/${pathId}/progress`, {
        module_id: moduleId,
        progress,
        status,
        notes
      })

      return response.success
    } catch (error) {
      console.error('更新学习进度失败:', error)
      return false
    }
  }

  /**
   * 获取学习路径详情
   */
  async getLearningPathDetail(pathId) {
    try {
      const response = await request.get(`/api/v1/enhanced-learning-paths/${pathId}`)

      if (response.success) {
        return response.data
      }
    } catch (error) {
      console.error('获取学习路径详情失败:', error)
    }

    return null
  }
}

export default new EnhancedLearningPathService()
