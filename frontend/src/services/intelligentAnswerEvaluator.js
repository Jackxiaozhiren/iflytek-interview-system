/**
 * 智能回答评估服务
 * 用于评估候选人回答的完整性、技术深度和实例丰富度
 */

class IntelligentAnswerEvaluator {
  constructor() {
    // 技术关键词库
    this.technicalKeywords = {
      ai: [
        'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'pandas', 'numpy',
        '神经网络', '深度学习', '机器学习', '算法', '模型', '训练', '优化',
        'cnn', 'rnn', 'lstm', 'transformer', 'bert', 'gpt', '自然语言处理',
        '计算机视觉', '数据预处理', '特征工程', '模型评估', '过拟合', '正则化'
      ],
      bigdata: [
        'hadoop', 'spark', 'kafka', 'elasticsearch', 'hive', 'hbase', 'flink',
        '大数据', '数据仓库', '数据湖', '实时计算', '离线计算', '数据管道',
        'etl', '数据清洗', '数据建模', '分布式', '集群', '性能优化'
      ],
      iot: [
        'mqtt', '传感器', '嵌入式', 'arduino', 'raspberry pi', '物联网',
        '边缘计算', '协议', '通信', '数据采集', '设备管理', '云平台'
      ]
    }

    // 项目经验指标词
    this.projectIndicators = [
      '项目', '开发', '实现', '设计', '架构', '优化', '解决', '遇到', '挑战',
      '问题', '方案', '效果', '提升', '改进', '负责', '参与', '团队', '合作'
    ]

    // 技术深度指标词
    this.depthIndicators = [
      '原理', '机制', '底层', '源码', '算法', '复杂度', '性能', '瓶颈',
      '调优', '监控', '测试', '部署', '运维', '扩展', '维护', '重构'
    ]

    // 具体实例指标词
    this.exampleIndicators = [
      '比如', '例如', '具体', '实际', '案例', '经历', '经验', '遇到过',
      '处理过', '解决过', '使用过', '应用过', '实践', '操作'
    ]
  }

  /**
   * 评估回答质量
   * @param {string} answer - 候选人的回答
   * @param {string} domain - 技术领域 (ai/bigdata/iot)
   * @param {string} questionType - 问题类型
   * @returns {Object} 评估结果
   */
  evaluateAnswer(answer, domain = 'ai', questionType = 'technical') {
    if (!answer || answer.trim().length < 10) {
      return this.createEvaluationResult(0, 0, 0, 0, '回答过于简短')
    }

    const answerLower = answer.toLowerCase()
    const answerChinese = answer

    // 1. 技术深度评估
    const technicalDepth = this.evaluateTechnicalDepth(answerLower, answerChinese, domain)
    
    // 2. 完整性评估
    const completeness = this.evaluateCompleteness(answerChinese)
    
    // 3. 实例丰富度评估
    const exampleRichness = this.evaluateExampleRichness(answerChinese)
    
    // 4. 综合评分
    const overallScore = this.calculateOverallScore(technicalDepth, completeness, exampleRichness)
    
    // 5. 生成评估建议
    const suggestion = this.generateSuggestion(technicalDepth, completeness, exampleRichness, overallScore)

    return this.createEvaluationResult(
      overallScore,
      technicalDepth,
      completeness,
      exampleRichness,
      suggestion
    )
  }

  /**
   * 评估技术深度 - 增强版
   */
  evaluateTechnicalDepth(answerLower, answerChinese, domain) {
    let score = 0
    const domainKeywords = this.technicalKeywords[domain] || this.technicalKeywords.ai

    // 1. 技术关键词评估 (35分)
    let keywordScore = 0
    let uniqueKeywords = new Set()

    domainKeywords.forEach(keyword => {
      if (answerLower.includes(keyword) || answerChinese.includes(keyword)) {
        uniqueKeywords.add(keyword)
      }
    })

    // 根据关键词数量和多样性评分
    const keywordCount = uniqueKeywords.size
    if (keywordCount >= 5) keywordScore = 35
    else if (keywordCount >= 3) keywordScore = 25
    else if (keywordCount >= 2) keywordScore = 15
    else if (keywordCount >= 1) keywordScore = 8

    score += keywordScore

    // 2. 技术深度指标评估 (30分)
    const enhancedDepthIndicators = [
      { pattern: /具体实现|代码实现|技术实现|实现方案/, weight: 8 },
      { pattern: /架构设计|系统架构|技术架构|设计模式/, weight: 8 },
      { pattern: /性能优化|调优|瓶颈|效率提升/, weight: 7 },
      { pattern: /算法选择|数据结构|复杂度|时间复杂度|空间复杂度/, weight: 7 },
      { pattern: /技术选型|框架选择|工具对比|方案对比/, weight: 6 },
      { pattern: /问题解决|故障排查|调试|错误处理/, weight: 6 },
      { pattern: /最佳实践|经验总结|踩坑|注意事项/, weight: 5 }
    ]

    let depthScore = 0
    enhancedDepthIndicators.forEach(indicator => {
      if (indicator.pattern.test(answerChinese)) {
        depthScore += indicator.weight
      }
    })
    score += Math.min(depthScore, 30)

    // 3. 具体技术细节评估 (20分)
    let detailScore = 0

    // 代码相关
    if (/代码|函数|方法|类|接口|API/.test(answerChinese)) {
      detailScore += 5
    }

    // 配置和参数
    if (/配置|参数|设置|环境变量|配置文件/.test(answerChinese)) {
      detailScore += 4
    }

    // 工具和框架具体使用
    if (/使用.*工具|采用.*框架|基于.*技术|通过.*实现/.test(answerChinese)) {
      detailScore += 4
    }

    // 版本和兼容性
    if (/版本|兼容|升级|迁移/.test(answerChinese)) {
      detailScore += 3
    }

    // 监控和日志
    if (/监控|日志|指标|埋点|追踪/.test(answerChinese)) {
      detailScore += 4
    }

    score += Math.min(detailScore, 20)

    // 4. 量化数据和效果评估 (15分)
    let quantitativeScore = 0

    // 性能数据
    if (/\d+%|提升.*\d+|降低.*\d+|优化.*\d+/.test(answerChinese)) {
      quantitativeScore += 8
    }

    // 具体数字和指标
    if (/QPS|TPS|延迟|吞吐量|内存|CPU|磁盘/.test(answerChinese)) {
      quantitativeScore += 4
    }

    // 时间相关
    if (/毫秒|秒|分钟|小时|天/.test(answerChinese)) {
      quantitativeScore += 3
    }

    score += Math.min(quantitativeScore, 15)

    return Math.min(score, 100)
  }

  /**
   * 评估回答完整性
   */
  evaluateCompleteness(answer) {
    let score = 0
    
    // 基础长度评估
    const length = answer.length
    if (length > 500) score += 30
    else if (length > 300) score += 20
    else if (length > 150) score += 10

    // 结构化程度评估
    const structureIndicators = ['首先', '其次', '然后', '最后', '第一', '第二', '第三']
    let structureCount = 0
    structureIndicators.forEach(indicator => {
      if (answer.includes(indicator)) structureCount++
    })
    score += Math.min(structureCount * 10, 30)

    // 问题解决完整性
    const solutionIndicators = ['问题', '解决', '方案', '结果', '效果']
    let solutionCount = 0
    solutionIndicators.forEach(indicator => {
      if (answer.includes(indicator)) solutionCount++
    })
    score += Math.min(solutionCount * 8, 40)

    return Math.min(score, 100)
  }

  /**
   * 评估实例丰富度 - 增强版
   */
  evaluateExampleRichness(answer) {
    let score = 0

    // 1. 项目经验指标 (30分)
    const projectPatterns = [
      { pattern: /项目|系统|平台|产品/, weight: 6 },
      { pattern: /开发|设计|实现|构建/, weight: 5 },
      { pattern: /负责|参与|主导|承担/, weight: 5 },
      { pattern: /团队|协作|合作/, weight: 4 },
      { pattern: /上线|部署|发布|交付/, weight: 5 }
    ]

    let projectScore = 0
    projectPatterns.forEach(pattern => {
      if (pattern.pattern.test(answer)) {
        projectScore += pattern.weight
      }
    })
    score += Math.min(projectScore, 30)

    // 2. 具体实例指标 (35分)
    const examplePatterns = [
      { pattern: /比如|例如|举例|案例/, weight: 8 },
      { pattern: /曾经|之前|以前|当时/, weight: 6 },
      { pattern: /遇到.*问题|碰到.*困难|面临.*挑战/, weight: 8 },
      { pattern: /解决了|处理了|优化了|改进了/, weight: 8 },
      { pattern: /效果|结果|成果|收益/, weight: 5 }
    ]

    let exampleScore = 0
    examplePatterns.forEach(pattern => {
      if (pattern.pattern.test(answer)) {
        exampleScore += pattern.weight
      }
    })
    score += Math.min(exampleScore, 35)

    // 3. 技术栈和工具提及 (25分)
    const techStackPatterns = [
      /使用.*[A-Za-z]+/g,  // 英文技术名称
      /采用.*[技术|框架|工具|平台]/g,
      /基于.*[系统|架构|方案]/g,
      /通过.*[方法|手段|工具]/g
    ]

    let techMentions = 0
    techStackPatterns.forEach(pattern => {
      const matches = answer.match(pattern)
      if (matches) {
        techMentions += matches.length
      }
    })
    score += Math.min(techMentions * 5, 25)

    // 4. 数据和指标提及 (10分)
    const dataPatterns = [
      /\d+%/g,  // 百分比
      /\d+[倍|次|个|台|人]/g,  // 数量
      /提升.*\d+|降低.*\d+|减少.*\d+|增加.*\d+/g,  // 改进数据
      /性能|效率|速度|时间|成本/g  // 效果指标
    ]

    let dataScore = 0
    dataPatterns.forEach(pattern => {
      const matches = answer.match(pattern)
      if (matches) {
        dataScore += matches.length * 2
      }
    })
    score += Math.min(dataScore, 10)

    return Math.min(score, 100)
  }

  /**
   * 计算综合评分 - 按照新的评分标准
   * 技术深度(30%)、实际应用经验(25%)、问题解决能力(25%)、表达清晰度(20%)
   */
  calculateOverallScore(technicalDepth, completeness, exampleRichness) {
    // 重新映射评分维度
    const technicalScore = technicalDepth // 技术深度 30%
    const practicalExperience = exampleRichness // 实际应用经验 25%
    const problemSolving = this.calculateProblemSolvingScore(completeness, technicalDepth) // 问题解决能力 25%
    const expressionClarity = completeness // 表达清晰度 20%

    // 新的加权平均：技术深度30%，实际应用经验25%，问题解决能力25%，表达清晰度20%
    return Math.round(
      technicalScore * 0.30 +
      practicalExperience * 0.25 +
      problemSolving * 0.25 +
      expressionClarity * 0.20
    )
  }

  /**
   * 计算问题解决能力评分
   */
  calculateProblemSolvingScore(completeness, technicalDepth) {
    // 问题解决能力 = 完整性 * 0.6 + 技术深度 * 0.4
    return Math.round(completeness * 0.6 + technicalDepth * 0.4)
  }

  /**
   * 生成评估建议 - 基于新的70分阈值
   */
  generateSuggestion(technicalDepth, completeness, exampleRichness, overallScore) {
    if (overallScore >= 85) {
      return '🎉 优秀回答：技术深度扎实，实际经验丰富，问题解决思路清晰，表达准确。自动进入下一个问题。'
    } else if (overallScore >= 70) {
      return '✅ 良好回答：达到通过标准，技术能力得到充分展示。自动进入下一个问题。'
    } else if (overallScore >= 55) {
      if (technicalDepth < 60) {
        return '🔍 需要追问：技术深度有待提升，建议询问具体的技术实现细节和原理。'
      } else if (exampleRichness < 50) {
        return '🔍 需要追问：缺乏实际应用经验，建议询问具体项目案例和实践经历。'
      } else {
        return '🔍 需要追问：问题解决思路不够清晰，建议引导候选人详细说明解决方案。'
      }
    } else {
      return '⚠️ 回答质量较低：建议重新引导问题，提供更具体的提示帮助候选人展示能力。'
    }
  }

  /**
   * 创建评估结果对象 - 基于新的70分阈值
   */
  createEvaluationResult(overall, technical, completeness, examples, suggestion) {
    return {
      overallScore: overall,
      technicalDepth: technical,
      completeness: completeness,
      exampleRichness: examples,
      suggestion: suggestion,
      timestamp: new Date().toISOString(),
      shouldContinue: overall >= 70, // 70分以上自动通过并进入下一题
      needsFollowUp: overall < 70 && overall >= 45, // 45-69分需要追问
      shouldRestart: overall < 45, // 45分以下建议重新开始
      autoAdvance: overall >= 70, // 新增：是否自动推进
      passThreshold: 70, // 新增：通过阈值
      // 新的评分维度
      practicalExperience: examples, // 实际应用经验
      problemSolving: this.calculateProblemSolvingScore(completeness, technical), // 问题解决能力
      expressionClarity: completeness // 表达清晰度
    }
  }

  /**
   * 获取详细的评估分析
   */
  getDetailedAnalysis(evaluationResult, answer) {
    const analysis = {
      strengths: [],
      weaknesses: [],
      recommendations: []
    }

    // 分析优势
    if (evaluationResult.technicalDepth >= 70) {
      analysis.strengths.push('技术理解深入，展现了扎实的专业基础')
    }
    if (evaluationResult.completeness >= 70) {
      analysis.strengths.push('回答结构清晰，逻辑完整')
    }
    if (evaluationResult.exampleRichness >= 70) {
      analysis.strengths.push('实例丰富，具有实际项目经验')
    }

    // 分析不足
    if (evaluationResult.technicalDepth < 60) {
      analysis.weaknesses.push('技术深度有待提升，建议补充具体实现细节')
    }
    if (evaluationResult.completeness < 60) {
      analysis.weaknesses.push('回答不够完整，建议按照问题-分析-解决-结果的结构组织')
    }
    if (evaluationResult.exampleRichness < 60) {
      analysis.weaknesses.push('缺乏具体实例，建议结合实际项目经验说明')
    }

    // 生成建议
    if (evaluationResult.shouldContinue) {
      analysis.recommendations.push('回答质量良好，可以进入下一个技术话题')
    } else if (evaluationResult.needsFollowUp) {
      analysis.recommendations.push('建议针对薄弱环节进行深入追问')
    } else {
      analysis.recommendations.push('建议重新引导问题，帮助候选人更好地展示能力')
    }

    return analysis
  }
}

export default new IntelligentAnswerEvaluator()
