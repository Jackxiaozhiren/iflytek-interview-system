/**
 * 动态问题流程控制服务
 * 根据回答质量智能决定追问策略，实现问题间的自然衔接
 */

import intelligentAnswerEvaluator from './intelligentAnswerEvaluator.js'

class DynamicQuestionController {
  constructor() {
    // 问题类型定义
    this.questionTypes = {
      INITIAL: 'initial',        // 初始问题
      FOLLOW_UP: 'follow_up',    // 追问
      DEEP_DIVE: 'deep_dive',    // 深入探讨
      TRANSITION: 'transition',   // 过渡到新话题
      SUMMARY: 'summary'         // 总结
    }

    // 追问策略
    this.followUpStrategies = {
      TECHNICAL_DETAIL: 'technical_detail',     // 技术细节追问
      PROJECT_EXAMPLE: 'project_example',       // 项目实例追问
      PROBLEM_SOLVING: 'problem_solving',       // 问题解决追问
      PERFORMANCE_IMPACT: 'performance_impact', // 性能影响追问
      COMPARISON: 'comparison'                  // 对比分析追问
    }

    // 面试状态
    this.interviewState = {
      currentTopic: null,
      questionHistory: [],
      answerHistory: [],
      evaluationHistory: [],
      followUpCount: 0,
      topicDepth: 0
    }

    // 技术话题库
    this.technicalTopics = {
      ai: [
        { id: 'ml_basics', name: '机器学习基础', depth: 1 },
        { id: 'deep_learning', name: '深度学习', depth: 2 },
        { id: 'model_optimization', name: '模型优化', depth: 3 },
        { id: 'production_deployment', name: '生产部署', depth: 2 },
        { id: 'data_processing', name: '数据处理', depth: 1 }
      ],
      bigdata: [
        { id: 'data_architecture', name: '数据架构', depth: 1 },
        { id: 'stream_processing', name: '流处理', depth: 2 },
        { id: 'data_warehouse', name: '数据仓库', depth: 2 },
        { id: 'performance_tuning', name: '性能调优', depth: 3 },
        { id: 'data_governance', name: '数据治理', depth: 2 }
      ],
      iot: [
        { id: 'device_connectivity', name: '设备连接', depth: 1 },
        { id: 'edge_computing', name: '边缘计算', depth: 2 },
        { id: 'data_collection', name: '数据采集', depth: 1 },
        { id: 'protocol_design', name: '协议设计', depth: 3 },
        { id: 'system_integration', name: '系统集成', depth: 2 }
      ]
    }
  }

  /**
   * 决定下一步行动策略
   * @param {string} candidateAnswer - 候选人回答
   * @param {string} currentQuestion - 当前问题
   * @param {string} domain - 技术领域
   * @returns {Object} 行动策略
   */
  decideNextAction(candidateAnswer, currentQuestion, domain = 'ai') {
    // 评估回答质量
    const evaluation = intelligentAnswerEvaluator.evaluateAnswer(
      candidateAnswer, 
      domain, 
      this.getCurrentQuestionType()
    )

    // 记录历史
    this.recordInteraction(currentQuestion, candidateAnswer, evaluation)

    // 根据评估结果决定策略
    const strategy = this.determineStrategy(evaluation, domain)
    
    return {
      action: strategy.action,
      nextQuestion: strategy.nextQuestion,
      reasoning: strategy.reasoning,
      evaluation: evaluation,
      shouldShowThinking: true,
      thinkingProcess: this.generateThinkingProcess(evaluation, strategy),
      aiResponse: this.generateAIResponse(evaluation, strategy)
    }
  }

  /**
   * 确定策略 - 基于新的70分阈值
   */
  determineStrategy(evaluation, domain) {
    const { overallScore, shouldContinue, needsFollowUp, technicalDepth, completeness, exampleRichness } = evaluation

    // 🎯 核心阈值：70分自动过渡机制
    if (overallScore >= 70) {
      // 检查各维度是否达标
      const hasGoodTechnicalDepth = technicalDepth >= 60
      const hasGoodPracticalExp = exampleRichness >= 60
      const hasGoodExpression = completeness >= 60

      // 如果达到70分且各维度基本达标，直接过渡
      if (hasGoodTechnicalDepth && hasGoodPracticalExp && hasGoodExpression) {
        return this.createAutoTransitionStrategy(evaluation, domain, '全面达标')
      }

      // 如果总分达到80+，即使某些维度稍弱也可以过渡
      if (overallScore >= 80) {
        return this.createAutoTransitionStrategy(evaluation, domain, '总分优秀')
      }

      // 如果技术深度特别突出（80+），可以过渡
      if (technicalDepth >= 80) {
        return this.createAutoTransitionStrategy(evaluation, domain, '技术深度突出')
      }

      // 否则进行一次轻量级追问来补充薄弱环节
      if (this.followUpCount === 0) {
        return this.createTargetedFollowUpStrategy(evaluation, domain)
      } else {
        return this.createAutoTransitionStrategy(evaluation, domain, '追问后过渡')
      }
    }

    // 中等回答（55-69分）- 需要追问
    if (overallScore >= 55 && this.followUpCount < 2) {
      return this.createFollowUpStrategy(evaluation, domain)
    }

    // 回答质量较低 - 引导或转换话题
    return this.createGuidanceStrategy(evaluation, domain)
  }

  /**
   * 创建过渡策略
   */
  createTransitionStrategy(evaluation, domain) {
    const nextTopic = this.selectNextTopic(domain)
    const nextQuestion = this.generateTransitionQuestion(nextTopic, domain)
    
    return {
      action: this.questionTypes.TRANSITION,
      nextQuestion: nextQuestion,
      reasoning: `候选人回答质量优秀（${evaluation.overallScore}分），展现了良好的技术理解和实践经验。可以进入下一个技术话题：${nextTopic.name}。`
    }
  }

  /**
   * 创建深入探讨策略
   */
  createDeepDiveStrategy(evaluation, domain) {
    const strategy = this.selectFollowUpStrategy(evaluation)
    const question = this.generateDeepDiveQuestion(strategy, domain)
    
    return {
      action: this.questionTypes.DEEP_DIVE,
      nextQuestion: question,
      reasoning: `候选人回答基础良好，但可以进一步探讨${this.getStrategyDescription(strategy)}，以更全面地评估技术能力。`
    }
  }

  /**
   * 创建追问策略
   */
  createFollowUpStrategy(evaluation, domain) {
    const strategy = this.selectFollowUpStrategy(evaluation)
    const question = this.generateFollowUpQuestion(strategy, evaluation, domain)
    
    return {
      action: this.questionTypes.FOLLOW_UP,
      nextQuestion: question,
      reasoning: `候选人回答需要补充${this.getStrategyDescription(strategy)}，通过追问获取更多技术细节。`
    }
  }

  /**
   * 创建自动过渡策略（70分阈值）
   */
  createAutoTransitionStrategy(evaluation, domain, reason) {
    const nextTopic = this.selectNextTopic(domain)
    const nextQuestion = this.generateTransitionQuestion(nextTopic, domain)

    return {
      action: this.questionTypes.TRANSITION,
      nextQuestion: nextQuestion,
      reasoning: `🎯 候选人回答达到70分通过阈值（实际${evaluation.overallScore}分），${reason}。AI判断技术能力已充分展示，自动进入下一个技术话题：${nextTopic.name}。`,
      autoTransition: true,
      transitionReason: reason,
      passedThreshold: true
    }
  }

  /**
   * 创建针对性追问策略
   */
  createTargetedFollowUpStrategy(evaluation, domain) {
    const { technicalDepth, completeness, exampleRichness } = evaluation
    let targetArea = ''
    let question = ''

    // 确定最需要补充的维度
    if (technicalDepth < 70) {
      targetArea = '技术实现细节'
      question = '您提到的技术方案很好，能否详细说明一下具体的实现细节和技术选型考虑？'
    } else if (exampleRichness < 60) {
      targetArea = '项目实例'
      question = '您的技术理解很到位，能否结合一个具体的项目案例来详细说明实际应用过程？'
    } else if (completeness < 70) {
      targetArea = '解决方案完整性'
      question = '您的回答很有见地，能否补充说明一下遇到的挑战和最终的效果评估？'
    } else {
      targetArea = '深度优化'
      question = '很好的回答！最后想了解一下您在这个技术领域的优化经验和最佳实践。'
    }

    return {
      action: this.questionTypes.FOLLOW_UP,
      nextQuestion: question,
      reasoning: `候选人回答已达75分阈值，但${targetArea}维度可以进一步补充。进行一次针对性追问后将自动过渡。`,
      targetArea: targetArea
    }
  }

  /**
   * 创建引导策略
   */
  createGuidanceStrategy(evaluation, domain) {
    const guidanceQuestion = this.generateGuidanceQuestion(evaluation, domain)

    return {
      action: this.questionTypes.FOLLOW_UP,
      nextQuestion: guidanceQuestion,
      reasoning: `候选人回答需要更多引导，提供具体的提示帮助其更好地展示技术能力。`
    }
  }

  /**
   * 选择追问策略
   */
  selectFollowUpStrategy(evaluation) {
    if (evaluation.technicalDepth < 60) {
      return this.followUpStrategies.TECHNICAL_DETAIL
    }
    if (evaluation.exampleRichness < 60) {
      return this.followUpStrategies.PROJECT_EXAMPLE
    }
    if (evaluation.completeness < 60) {
      return this.followUpStrategies.PROBLEM_SOLVING
    }
    return this.followUpStrategies.PERFORMANCE_IMPACT
  }

  /**
   * 生成过渡问题
   */
  generateTransitionQuestion(topic, domain) {
    const transitionTemplates = {
      ai: {
        'deep_learning': '很好！您在机器学习方面有扎实的基础。现在让我们深入探讨深度学习：请分享一个您使用深度学习解决实际问题的项目经验，包括模型选择、训练过程和优化策略。',
        'model_optimization': '您的项目经验很丰富。接下来想了解您在模型优化方面的实践：请描述一次您对机器学习模型进行性能优化的经历，包括遇到的瓶颈和具体的优化方法。',
        'production_deployment': '技术理解很到位。现在聊聊生产环境：请介绍您将机器学习模型部署到生产环境的经验，包括架构设计、监控和维护策略。'
      },
      bigdata: {
        'stream_processing': '您对数据架构有很好的理解。让我们谈谈实时数据处理：请分享您在流处理系统设计和实现方面的经验，包括技术选型和性能考虑。',
        'performance_tuning': '很好的数据处理经验。现在想了解性能优化：请描述一次您对大数据系统进行性能调优的实际案例，包括问题定位和解决方案。'
      },
      iot: {
        'edge_computing': '您在设备连接方面经验丰富。让我们探讨边缘计算：请介绍您在边缘计算架构设计和实现方面的项目经验。',
        'system_integration': '技术基础很扎实。现在聊聊系统集成：请分享您在物联网系统集成方面的挑战和解决方案。'
      }
    }

    return transitionTemplates[domain]?.[topic.id] || 
           `很好！让我们继续探讨${topic.name}相关的技术问题。`
  }

  /**
   * 生成追问问题
   */
  generateFollowUpQuestion(strategy, evaluation, domain) {
    const templates = {
      [this.followUpStrategies.TECHNICAL_DETAIL]: [
        '能否详细说明一下具体的技术实现细节？比如使用了哪些工具、框架或算法？',
        '请深入介绍一下技术架构和关键组件的设计思路。',
        '可以具体说明一下核心算法或技术方案的实现原理吗？'
      ],
      [this.followUpStrategies.PROJECT_EXAMPLE]: [
        '能否结合一个具体的项目案例来详细说明？',
        '请分享一个您亲身参与的相关项目经验，包括您的具体职责和贡献。',
        '可以举一个实际的应用场景来说明吗？'
      ],
      [this.followUpStrategies.PROBLEM_SOLVING]: [
        '在实施过程中遇到了哪些技术挑战？您是如何解决的？',
        '请详细描述问题分析和解决的完整过程。',
        '能否说明一下遇到的主要困难和您的解决思路？'
      ],
      [this.followUpStrategies.PERFORMANCE_IMPACT]: [
        '这个方案带来了什么样的性能提升或业务价值？有具体的数据吗？',
        '能否量化说明一下优化效果和实际收益？',
        '请介绍一下性能指标的改善情况。'
      ]
    }

    const questionList = templates[strategy] || templates[this.followUpStrategies.TECHNICAL_DETAIL]
    return questionList[Math.floor(Math.random() * questionList.length)]
  }

  /**
   * 生成思考过程
   */
  generateThinkingProcess(evaluation, strategy) {
    return `让我分析一下候选人的回答质量：

📊 回答评估结果：
• 综合得分：${evaluation.overallScore}/100
• 技术深度：${evaluation.technicalDepth}/100
• 完整性：${evaluation.completeness}/100  
• 实例丰富度：${evaluation.exampleRichness}/100

🤔 分析判断：
${this.generateAnalysisThoughts(evaluation)}

📋 下一步策略：
${strategy.reasoning}

💡 面试节奏控制：
${this.generatePaceControl(evaluation, strategy)}`
  }

  /**
   * 生成AI回答
   */
  generateAIResponse(evaluation, strategy) {
    if (evaluation.overallScore >= 85) {
      return `非常好！您的回答展现了扎实的技术功底和丰富的实践经验。特别是在技术实现细节和项目经验方面，回答得很全面。

${strategy.nextQuestion}`
    } else if (evaluation.overallScore >= 70) {
      return `您的回答基础很好，技术理解到位。为了更全面地了解您的能力，我想进一步了解一些细节：

${strategy.nextQuestion}`
    } else {
      return `感谢您的回答。为了更好地评估您的技术能力，希望您能提供更多具体的信息：

${strategy.nextQuestion}`
    }
  }

  // 辅助方法
  generateAnalysisThoughts(evaluation) {
    const thoughts = []
    
    if (evaluation.technicalDepth >= 70) {
      thoughts.push('• 技术理解深入，展现了专业能力')
    } else {
      thoughts.push('• 技术深度有待提升，需要更多实现细节')
    }
    
    if (evaluation.exampleRichness >= 70) {
      thoughts.push('• 实例丰富，有实际项目经验')
    } else {
      thoughts.push('• 缺乏具体实例，需要项目案例支撑')
    }
    
    if (evaluation.completeness >= 70) {
      thoughts.push('• 回答结构完整，逻辑清晰')
    } else {
      thoughts.push('• 回答不够完整，需要补充关键信息')
    }
    
    return thoughts.join('\n')
  }

  generatePaceControl(evaluation, strategy) {
    if (strategy.action === this.questionTypes.TRANSITION) {
      return '回答质量优秀，可以推进到下一个技术话题，保持面试效率。'
    } else if (strategy.action === this.questionTypes.FOLLOW_UP) {
      return `需要适度追问以获取更多信息，当前追问次数：${this.followUpCount + 1}/2。`
    } else {
      return '继续深入探讨当前话题，挖掘候选人的技术深度。'
    }
  }

  // 状态管理方法
  recordInteraction(question, answer, evaluation) {
    this.interviewState.questionHistory.push(question)
    this.interviewState.answerHistory.push(answer)
    this.interviewState.evaluationHistory.push(evaluation)
    
    if (evaluation.needsFollowUp) {
      this.followUpCount++
    } else {
      this.followUpCount = 0
    }
  }

  selectNextTopic(domain) {
    const topics = this.technicalTopics[domain] || this.technicalTopics.ai
    return topics[Math.floor(Math.random() * topics.length)]
  }

  getCurrentQuestionType() {
    return this.followUpCount > 0 ? this.questionTypes.FOLLOW_UP : this.questionTypes.INITIAL
  }

  canDeepDive(evaluation) {
    return evaluation.technicalDepth >= 60 && evaluation.exampleRichness >= 60
  }

  getStrategyDescription(strategy) {
    const descriptions = {
      [this.followUpStrategies.TECHNICAL_DETAIL]: '技术实现细节',
      [this.followUpStrategies.PROJECT_EXAMPLE]: '具体项目实例',
      [this.followUpStrategies.PROBLEM_SOLVING]: '问题解决过程',
      [this.followUpStrategies.PERFORMANCE_IMPACT]: '性能影响和效果',
      [this.followUpStrategies.COMPARISON]: '技术对比分析'
    }
    return descriptions[strategy] || '相关技术细节'
  }

  generateGuidanceQuestion(evaluation, domain) {
    return '我理解您的想法。为了更好地展示您的技术能力，建议您可以从以下几个方面来回答：1）具体使用的技术栈和工具；2）遇到的主要挑战；3）您的解决方案；4）最终的效果和收获。请选择其中您最有经验的方面详细说明。'
  }

  generateDeepDiveQuestion(strategy, domain) {
    return this.generateFollowUpQuestion(strategy, { technicalDepth: 70 }, domain)
  }
}

export default new DynamicQuestionController()
