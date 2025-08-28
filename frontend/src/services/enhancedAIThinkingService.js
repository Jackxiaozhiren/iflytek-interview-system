/**
 * 增强AI思考展示服务
 * 生成真实的分析思考过程，展示AI的决策逻辑
 */

import intelligentAnswerEvaluator from './intelligentAnswerEvaluator.js'

class EnhancedAIThinkingService {
  constructor() {
    // 思考模板库
    this.thinkingTemplates = {
      answerAnalysis: {
        excellent: [
          '候选人的回答非常全面，包含了丰富的技术细节和实际项目经验',
          '回答展现了深入的技术理解和扎实的实践基础',
          '技术描述准确，项目案例具体，解决方案完整'
        ],
        good: [
          '候选人展现了良好的技术基础，但某些方面可以更深入',
          '回答基本完整，技术理解正确，需要补充一些实践细节',
          '有一定的项目经验，技术方向正确，可以进一步探讨'
        ],
        needsImprovement: [
          '候选人的回答较为简单，需要更多技术细节和实例支撑',
          '技术理解基础存在，但缺乏深度和实际应用经验',
          '回答不够具体，需要引导提供更多实践案例'
        ]
      },
      
      technicalAssessment: {
        strong: [
          '技术栈掌握扎实，能够准确描述核心概念和实现原理',
          '展现了对技术细节的深入理解和实际应用能力',
          '技术选型合理，能够分析不同方案的优劣'
        ],
        moderate: [
          '技术基础良好，但在某些细节上需要更深入的了解',
          '对主要技术概念理解正确，实际应用经验有待丰富',
          '技术方向正确，需要补充更多实现细节'
        ],
        weak: [
          '技术理解较为表面，缺乏深入的实现细节',
          '对核心概念的掌握不够扎实，需要更多学习和实践',
          '技术描述模糊，缺乏具体的应用场景'
        ]
      },
      
      nextStepStrategy: {
        continue: [
          '候选人表现优秀，可以进入下一个技术话题进行评估',
          '当前话题掌握良好，建议转向更具挑战性的技术问题',
          '基础扎实，可以探讨更高级的技术应用和架构设计'
        ],
        deepDive: [
          '需要进一步了解技术实现的具体细节和优化策略',
          '可以深入探讨项目中的技术挑战和解决方案',
          '建议询问更多关于性能优化和最佳实践的经验'
        ],
        followUp: [
          '需要补充更多具体的项目实例和技术细节',
          '建议引导候选人提供更完整的问题解决过程',
          '可以询问具体的工具使用和技术选型理由'
        ],
        guide: [
          '需要提供更具体的引导，帮助候选人更好地展示能力',
          '建议重新组织问题，从更基础的角度开始探讨',
          '可以提供一些提示，引导候选人分享相关经验'
        ]
      }
    }

    // 技术关键词分析器
    this.keywordAnalyzer = {
      ai: {
        frameworks: ['tensorflow', 'pytorch', 'keras', 'scikit-learn'],
        concepts: ['神经网络', '深度学习', '机器学习', '算法', '模型'],
        practices: ['训练', '优化', '调参', '部署', '监控']
      },
      bigdata: {
        frameworks: ['hadoop', 'spark', 'kafka', 'flink', 'elasticsearch'],
        concepts: ['大数据', '分布式', '实时计算', '数据仓库', '数据湖'],
        practices: ['etl', '数据清洗', '性能调优', '集群管理', '监控']
      },
      iot: {
        frameworks: ['mqtt', 'arduino', 'raspberry pi', 'node-red'],
        concepts: ['物联网', '传感器', '边缘计算', '协议', '设备管理'],
        practices: ['数据采集', '设备连接', '协议设计', '系统集成', '运维']
      }
    }
  }

  /**
   * 生成完整的AI思考过程
   * @param {string} candidateAnswer - 候选人回答
   * @param {string} currentQuestion - 当前问题
   * @param {string} domain - 技术领域
   * @param {Object} context - 面试上下文
   * @returns {Object} 思考过程和回答
   */
  generateThinkingProcess(candidateAnswer, currentQuestion, domain = 'ai', context = {}) {
    // 1. 评估回答质量
    const evaluation = intelligentAnswerEvaluator.evaluateAnswer(candidateAnswer, domain)
    
    // 2. 分析技术关键词
    const keywordAnalysis = this.analyzeKeywords(candidateAnswer, domain)
    
    // 3. 评估回答完整性
    const completenessAnalysis = this.analyzeCompleteness(candidateAnswer)
    
    // 4. 生成思考过程
    const thinkingProcess = this.buildThinkingProcess(
      evaluation,
      keywordAnalysis,
      completenessAnalysis,
      domain,
      context,
      candidateAnswer
    )
    
    // 5. 决定下一步策略
    const nextStepStrategy = this.determineNextStep(evaluation, context)
    
    // 6. 生成AI回答
    const aiResponse = this.generateAIResponse(evaluation, nextStepStrategy, domain)
    
    return {
      thinkingProcess,
      aiResponse,
      evaluation,
      nextStepStrategy,
      keywordAnalysis,
      shouldContinue: evaluation.shouldContinue,
      needsFollowUp: evaluation.needsFollowUp
    }
  }

  /**
   * 构建思考过程
   */
  buildThinkingProcess(evaluation, keywordAnalysis, completenessAnalysis, domain, context, candidateAnswer) {
    const sections = []

    // 1. 回答质量分析（基于具体内容）
    sections.push(this.generateAnswerAnalysisSection(evaluation, candidateAnswer))

    // 2. 技术能力评估
    sections.push(this.generateTechnicalAssessmentSection(evaluation, keywordAnalysis, domain))

    // 3. 关键信息提取
    sections.push(this.generateKeyInfoExtractionSection(keywordAnalysis, completenessAnalysis))

    // 4. 面试策略决策
    sections.push(this.generateStrategyDecisionSection(evaluation, context))

    return sections.join('\n\n')
  }

  /**
   * 生成回答质量分析部分 - 基于具体内容
   */
  generateAnswerAnalysisSection(evaluation, candidateAnswer) {
    // 分析回答中的具体技术内容
    const technicalContent = this.extractTechnicalContent(candidateAnswer)
    const projectMentions = this.extractProjectMentions(candidateAnswer)
    const problemSolving = this.extractProblemSolving(candidateAnswer)

    let qualityLevel = 'needsImprovement'
    if (evaluation.overallScore >= 85) qualityLevel = 'excellent'
    else if (evaluation.overallScore >= 75) qualityLevel = 'good'
    else if (evaluation.overallScore >= 60) qualityLevel = 'moderate'

    // 生成基于具体内容的分析
    let contentAnalysis = ''
    if (technicalContent.length > 0) {
      contentAnalysis += `\n• 技术内容识别：提到了${technicalContent.join('、')}等技术要点`
    }
    if (projectMentions.length > 0) {
      contentAnalysis += `\n• 项目经验体现：${projectMentions.join('、')}`
    }
    if (problemSolving.length > 0) {
      contentAnalysis += `\n• 问题解决能力：${problemSolving.join('、')}`
    }

    const template = this.getRandomTemplate(this.thinkingTemplates.answerAnalysis[qualityLevel])

    return `🔍 回答质量分析：
${template}${contentAnalysis}

📊 详细评分：
• 综合得分：${evaluation.overallScore}/100 ${this.getScoreEmoji(evaluation.overallScore)}
• 技术深度：${evaluation.technicalDepth}/100 ${this.getScoreEmoji(evaluation.technicalDepth)}
• 完整性：${evaluation.completeness}/100 ${this.getScoreEmoji(evaluation.completeness)}
• 实例丰富度：${evaluation.exampleRichness}/100 ${this.getScoreEmoji(evaluation.exampleRichness)}`
  }

  /**
   * 生成技术能力评估部分
   */
  generateTechnicalAssessmentSection(evaluation, keywordAnalysis, domain) {
    let techLevel = 'weak'
    if (evaluation.technicalDepth >= 75) techLevel = 'strong'
    else if (evaluation.technicalDepth >= 60) techLevel = 'moderate'

    const template = this.getRandomTemplate(this.thinkingTemplates.technicalAssessment[techLevel])
    
    return `⚙️ 技术能力评估：
${template}

🔧 技术关键词识别：
• 框架/工具：${keywordAnalysis.frameworks.length > 0 ? keywordAnalysis.frameworks.join(', ') : '未明确提及'}
• 核心概念：${keywordAnalysis.concepts.length > 0 ? keywordAnalysis.concepts.join(', ') : '概念描述不够具体'}
• 实践经验：${keywordAnalysis.practices.length > 0 ? keywordAnalysis.practices.join(', ') : '缺乏具体实践描述'}`
  }

  /**
   * 生成关键信息提取部分
   */
  generateKeyInfoExtractionSection(keywordAnalysis, completenessAnalysis) {
    return `📋 关键信息提取：
• 项目背景：${completenessAnalysis.hasProjectBackground ? '✅ 有明确描述' : '❌ 缺乏项目背景'}
• 技术挑战：${completenessAnalysis.hasChallenges ? '✅ 提及了挑战' : '❌ 未描述具体挑战'}
• 解决方案：${completenessAnalysis.hasSolutions ? '✅ 有解决方案' : '❌ 缺乏解决方案'}
• 效果评估：${completenessAnalysis.hasResults ? '✅ 有效果说明' : '❌ 未提及具体效果'}

💡 回答亮点：${this.identifyHighlights(keywordAnalysis, completenessAnalysis)}
⚠️ 需要补充：${this.identifyGaps(completenessAnalysis)}`
  }

  /**
   * 生成策略决策部分
   */
  generateStrategyDecisionSection(evaluation, context) {
    let strategy = 'guide'
    if (evaluation.shouldContinue && evaluation.overallScore >= 85) strategy = 'continue'
    else if (evaluation.shouldContinue && evaluation.overallScore >= 70) strategy = 'deepDive'
    else if (evaluation.needsFollowUp) strategy = 'followUp'

    const template = this.getRandomTemplate(this.thinkingTemplates.nextStepStrategy[strategy])
    
    return `🎯 下一步策略决策：
${template}

📈 面试进度控制：
• 当前话题深度：${this.assessTopicDepth(evaluation)}
• 建议行动：${this.getActionDescription(strategy)}
• 预期目标：${this.getExpectedOutcome(strategy)}`
  }

  /**
   * 分析关键词
   */
  analyzeKeywords(answer, domain) {
    const keywords = this.keywordAnalyzer[domain] || this.keywordAnalyzer.ai
    const answerLower = answer.toLowerCase()
    
    return {
      frameworks: keywords.frameworks.filter(fw => 
        answerLower.includes(fw) || answer.includes(fw)
      ),
      concepts: keywords.concepts.filter(concept => 
        answer.includes(concept)
      ),
      practices: keywords.practices.filter(practice => 
        answer.includes(practice)
      )
    }
  }

  /**
   * 分析完整性
   */
  analyzeCompleteness(answer) {
    return {
      hasProjectBackground: /项目|开发|系统|平台/.test(answer),
      hasChallenges: /挑战|问题|困难|瓶颈/.test(answer),
      hasSolutions: /解决|方案|方法|策略/.test(answer),
      hasResults: /效果|结果|提升|改进|优化/.test(answer),
      hasSpecificDetails: /具体|详细|比如|例如/.test(answer)
    }
  }

  /**
   * 确定下一步策略
   */
  determineNextStep(evaluation, context) {
    if (evaluation.shouldContinue && evaluation.overallScore >= 85) {
      return {
        action: 'continue',
        confidence: 'high',
        reason: '回答质量优秀，可以进入下一话题'
      }
    } else if (evaluation.shouldContinue) {
      return {
        action: 'deepDive',
        confidence: 'medium',
        reason: '基础良好，可以深入探讨'
      }
    } else if (evaluation.needsFollowUp) {
      return {
        action: 'followUp',
        confidence: 'medium',
        reason: '需要补充更多信息'
      }
    } else {
      return {
        action: 'guide',
        confidence: 'low',
        reason: '需要重新引导'
      }
    }
  }

  /**
   * 生成AI回答 - 基于具体评分的智能反馈
   */
  generateAIResponse(evaluation, strategy, domain) {
    const { overallScore, technicalDepth, completeness, exampleRichness } = evaluation

    // 75分以上自动过渡的特殊处理
    if (overallScore >= 75 && strategy.autoTransition) {
      return this.generateAutoTransitionResponse(evaluation, strategy)
    }

    // 基于具体评分生成个性化回答
    if (overallScore >= 85) {
      return this.generateExcellentResponse(evaluation, technicalDepth, completeness, exampleRichness)
    } else if (overallScore >= 75) {
      return this.generateGoodResponse(evaluation, technicalDepth, completeness, exampleRichness)
    } else if (overallScore >= 60) {
      return this.generateModerateResponse(evaluation, strategy)
    } else {
      return this.generateNeedsImprovementResponse(evaluation, strategy)
    }
  }

  /**
   * 生成自动过渡回答
   */
  generateAutoTransitionResponse(evaluation, strategy) {
    const { overallScore, technicalDepth } = evaluation
    const { transitionReason } = strategy

    const responses = {
      '全面优秀': `非常优秀的回答！您在技术深度、项目经验和问题解决能力方面都表现出色（综合${overallScore}分）。您已经充分展示了在这个技术领域的专业能力，让我们继续探讨下一个技术话题。`,
      '技术深度突出': `您的技术深度非常突出（${technicalDepth}分），展现了深厚的专业功底。虽然在某些细节上还可以补充，但您的核心技术能力已经得到充分体现。我们可以进入下一个技术领域的讨论。`,
      '追问后过渡': `很好！通过刚才的补充，您的回答更加完整了。您在这个技术领域的能力已经得到充分展示（${overallScore}分），让我们继续下一个技术话题的探讨。`
    }

    return responses[transitionReason] || responses['全面优秀']
  }

  /**
   * 生成优秀回答反馈
   */
  generateExcellentResponse(evaluation, technicalDepth, completeness, exampleRichness) {
    let specificPraise = []

    if (technicalDepth >= 85) specificPraise.push('技术理解深入透彻')
    if (completeness >= 85) specificPraise.push('回答结构完整清晰')
    if (exampleRichness >= 80) specificPraise.push('项目实例丰富具体')

    const praise = specificPraise.length > 0 ? `特别是在${specificPraise.join('、')}方面表现突出。` : ''

    return `非常优秀的回答！您展现了扎实的技术功底和丰富的实践经验（${evaluation.overallScore}分）。${praise}您已经充分证明了在这个技术领域的专业能力，让我们继续探讨下一个技术话题。`
  }

  /**
   * 生成良好回答反馈
   */
  generateGoodResponse(evaluation, technicalDepth, completeness, exampleRichness) {
    let strengthAreas = []
    let improvementAreas = []

    if (technicalDepth >= 75) strengthAreas.push('技术理解')
    else improvementAreas.push('技术细节')

    if (completeness >= 75) strengthAreas.push('回答完整性')
    else improvementAreas.push('解决方案描述')

    if (exampleRichness >= 70) strengthAreas.push('项目经验')
    else improvementAreas.push('具体实例')

    const strengthText = strengthAreas.length > 0 ? `您在${strengthAreas.join('、')}方面表现很好。` : ''

    return `很好的回答！${strengthText}您的技术能力已经得到很好的体现（${evaluation.overallScore}分），我们可以继续下一个技术话题的讨论。`
  }

  /**
   * 生成中等回答反馈
   */
  generateModerateResponse(evaluation, strategy) {
    return `您的回答有一定的技术基础（${evaluation.overallScore}分）。为了更全面地了解您的技术能力，我想进一步了解一些具体的实现细节和项目经验。`
  }

  /**
   * 生成需要改进回答反馈
   */
  generateNeedsImprovementResponse(evaluation, strategy) {
    return `感谢您的回答。为了更好地评估您的技术能力，建议您可以从具体的项目背景、技术挑战、解决方案和效果这几个方面来详细说明。`
  }

  // 辅助方法
  getRandomTemplate(templates) {
    return templates[Math.floor(Math.random() * templates.length)]
  }

  getScoreEmoji(score) {
    if (score >= 85) return '🟢'
    if (score >= 70) return '🟡'
    if (score >= 55) return '🟠'
    return '🔴'
  }

  identifyHighlights(keywordAnalysis, completenessAnalysis) {
    const highlights = []
    if (keywordAnalysis.frameworks.length > 0) highlights.push('技术栈明确')
    if (keywordAnalysis.practices.length > 0) highlights.push('实践经验丰富')
    if (completenessAnalysis.hasSpecificDetails) highlights.push('描述具体')
    if (completenessAnalysis.hasResults) highlights.push('有效果评估')
    return highlights.length > 0 ? highlights.join('、') : '需要更多技术亮点'
  }

  identifyGaps(completenessAnalysis) {
    const gaps = []
    if (!completenessAnalysis.hasProjectBackground) gaps.push('项目背景')
    if (!completenessAnalysis.hasChallenges) gaps.push('技术挑战')
    if (!completenessAnalysis.hasSolutions) gaps.push('解决方案')
    if (!completenessAnalysis.hasResults) gaps.push('效果评估')
    return gaps.length > 0 ? gaps.join('、') : '信息相对完整'
  }

  assessTopicDepth(evaluation) {
    if (evaluation.overallScore >= 85) return '深入'
    if (evaluation.overallScore >= 70) return '中等'
    if (evaluation.overallScore >= 55) return '浅层'
    return '表面'
  }

  getActionDescription(strategy) {
    const descriptions = {
      continue: '转向下一技术话题',
      deepDive: '深入当前话题',
      followUp: '追问补充信息',
      guide: '重新引导回答'
    }
    return descriptions[strategy] || '继续评估'
  }

  getExpectedOutcome(strategy) {
    const outcomes = {
      continue: '评估更多技术领域',
      deepDive: '获取更深技术细节',
      followUp: '补充关键信息',
      guide: '引导完整回答'
    }
    return outcomes[strategy] || '继续面试流程'
  }

  /**
   * 提取技术内容
   */
  extractTechnicalContent(answer) {
    const technicalTerms = []

    // 技术框架和工具
    const frameworks = answer.match(/[A-Za-z]+(?:\.js|\.py|SQL|API|SDK|Framework|Library)/g) || []
    technicalTerms.push(...frameworks)

    // 中文技术术语
    const chineseTerms = answer.match(/机器学习|深度学习|神经网络|算法|数据结构|架构设计|性能优化|数据库|缓存|负载均衡|微服务|容器化|云计算/g) || []
    technicalTerms.push(...chineseTerms)

    // 去重并限制数量
    return [...new Set(technicalTerms)].slice(0, 5)
  }

  /**
   * 提取项目提及
   */
  extractProjectMentions(answer) {
    const projectMentions = []

    // 项目相关表述
    if (/项目|系统|平台/.test(answer)) {
      projectMentions.push('有项目经验')
    }
    if (/负责|主导|参与/.test(answer)) {
      projectMentions.push('明确角色职责')
    }
    if (/团队|协作/.test(answer)) {
      projectMentions.push('团队合作经验')
    }
    if (/上线|部署|发布/.test(answer)) {
      projectMentions.push('项目交付经验')
    }

    return projectMentions
  }

  /**
   * 提取问题解决能力
   */
  extractProblemSolving(answer) {
    const problemSolving = []

    if (/遇到.*问题|碰到.*困难/.test(answer)) {
      problemSolving.push('能识别和描述问题')
    }
    if (/解决|处理|优化|改进/.test(answer)) {
      problemSolving.push('有解决方案思路')
    }
    if (/效果|结果|提升|改善/.test(answer)) {
      problemSolving.push('关注解决效果')
    }
    if (/\d+%|数据|指标/.test(answer)) {
      problemSolving.push('有量化思维')
    }

    return problemSolving
  }
}

export default new EnhancedAIThinkingService()
