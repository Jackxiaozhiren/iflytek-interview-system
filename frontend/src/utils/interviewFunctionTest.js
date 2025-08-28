/**
 * 面试功能测试工具
 * 专门测试AI提示和面试官反馈功能
 */

import enhancedIflytekSparkService from '@/services/enhancedIflytekSparkService'

/**
 * 测试AI提示功能
 */
export async function testAiHintFunction() {
  const results = {
    testName: 'AI提示功能测试',
    timestamp: new Date().toISOString(),
    success: false,
    details: {},
    error: null
  }

  try {
    // 模拟面试上下文
    const context = {
      question: '请详细说明您在深度学习模型优化方面的实践经验，包括具体的优化策略。',
      candidateResponse: '我在项目中使用了一些优化方法',
      analysisResults: {
        overallScore: 65,
        technicalCompetency: 60
      },
      questionNumber: 1
    }

    console.log('🧪 开始测试AI提示功能...')
    console.log('📝 测试上下文:', context)

    // 调用AI提示方法
    const hint = await enhancedIflytekSparkService.generateRealTimeHint(
      'test_session_' + Date.now(),
      context
    )

    console.log('✅ AI提示生成成功:', hint)

    // 验证返回结果结构
    const hasRequiredFields = !!(
      hint &&
      hint.hint &&
      hint.type &&
      hint.urgency &&
      hint.timing
    )

    if (hasRequiredFields) {
      results.success = true
      results.details = {
        hint: hint.hint,
        type: hint.type,
        urgency: hint.urgency,
        timing: hint.timing,
        hintLength: hint.hint.length,
        isConstructive: hint.type === 'constructive'
      }
      console.log('✅ AI提示功能测试通过')
    } else {
      results.error = '返回结果缺少必需字段'
      console.log('❌ AI提示功能测试失败: 返回结果结构不完整')
    }

  } catch (error) {
    results.error = error.message
    console.error('❌ AI提示功能测试异常:', error)
  }

  return results
}

/**
 * 测试文本分析功能
 */
export async function testTextAnalysisFunction() {
  const results = {
    testName: '文本分析功能测试',
    timestamp: new Date().toISOString(),
    success: false,
    details: {},
    error: null
  }

  try {
    // 模拟分析输入
    const analysisData = {
      text: '我在机器学习项目中使用了TensorFlow框架，实现了一个深度神经网络模型。通过数据预处理、模型调优和超参数优化，最终将模型准确率从85%提升到92%。在项目中，我主要负责算法设计和性能优化，使用了批量归一化、dropout等正则化技术来防止过拟合。',
      domain: 'ai'
    }

    console.log('🧪 开始测试文本分析功能...')
    console.log('📝 测试输入:', analysisData.text.substring(0, 50) + '...')

    // 调用文本分析方法
    const analysis = await enhancedIflytekSparkService.analyzeTextPrimaryInput(
      'test_session_' + Date.now(),
      analysisData
    )

    console.log('✅ 文本分析完成:', analysis)

    // 验证返回结果结构
    const hasRequiredFields = !!(
      analysis &&
      typeof analysis.overallScore === 'number' &&
      analysis.textAnalysis &&
      analysis.recommendations &&
      analysis.strengthAreas &&
      analysis.improvementAreas
    )

    if (hasRequiredFields) {
      results.success = true
      results.details = {
        overallScore: analysis.overallScore,
        technicalCompetency: analysis.technicalCompetency,
        communicationSkills: analysis.communicationSkills,
        keywordsCount: analysis.textAnalysis?.keywords?.length || 0,
        recommendationsCount: analysis.recommendations?.length || 0,
        hasSemanticAnalysis: !!analysis.semanticAnalysis,
        hasProfessionalDepth: !!analysis.professionalDepth,
        hasInnovativeThinking: !!analysis.innovativeThinking
      }
      console.log('✅ 文本分析功能测试通过')
    } else {
      results.error = '返回结果缺少必需字段'
      console.log('❌ 文本分析功能测试失败: 返回结果结构不完整')
    }

  } catch (error) {
    results.error = error.message
    console.error('❌ 文本分析功能测试异常:', error)
  }

  return results
}

/**
 * 测试实时智能助手功能
 */
export async function testRealTimeAssistanceFunction() {
  const results = {
    testName: '实时智能助手功能测试',
    timestamp: new Date().toISOString(),
    success: false,
    details: {},
    error: null
  }

  try {
    // 模拟助手上下文
    const context = {
      questionType: 'technical',
      responseTime: 25,
      candidateState: 'normal',
      currentAnswer: '我使用了一些机器学习算法',
      difficulty: 'medium'
    }

    console.log('🧪 开始测试实时智能助手功能...')
    console.log('📝 测试上下文:', context)

    // 调用实时智能助手方法
    const assistance = await enhancedIflytekSparkService.provideRealTimeAssistance(
      'test_session_' + Date.now(),
      context
    )

    console.log('✅ 实时智能助手响应:', assistance)

    // 验证返回结果结构
    const hasRequiredFields = !!(
      assistance &&
      assistance.guidance &&
      assistance.intelligentSuggestions &&
      assistance.answerStructure &&
      assistance.keyPoints
    )

    if (hasRequiredFields) {
      results.success = true
      results.details = {
        assistanceType: assistance.assistanceType,
        guidance: assistance.guidance,
        suggestionsCount: assistance.intelligentSuggestions?.length || 0,
        answerStructure: assistance.answerStructure,
        keyPointsCount: assistance.keyPoints?.length || 0,
        confidenceLevel: assistance.confidenceLevel,
        hasTimeManagement: !!assistance.timeManagementAlerts,
        hasConfidenceBooster: !!assistance.confidenceBooster
      }
      console.log('✅ 实时智能助手功能测试通过')
    } else {
      results.error = '返回结果缺少必需字段'
      console.log('❌ 实时智能助手功能测试失败: 返回结果结构不完整')
    }

  } catch (error) {
    results.error = error.message
    console.error('❌ 实时智能助手功能测试异常:', error)
  }

  return results
}

/**
 * 运行所有面试功能测试
 */
export async function runAllInterviewFunctionTests() {
  console.group('🎯 面试功能完整测试')
  
  const testResults = {
    timestamp: new Date().toISOString(),
    totalTests: 3,
    passedTests: 0,
    failedTests: 0,
    tests: []
  }

  // 测试1: AI提示功能
  const hintTest = await testAiHintFunction()
  testResults.tests.push(hintTest)
  if (hintTest.success) testResults.passedTests++
  else testResults.failedTests++

  // 测试2: 文本分析功能
  const analysisTest = await testTextAnalysisFunction()
  testResults.tests.push(analysisTest)
  if (analysisTest.success) testResults.passedTests++
  else testResults.failedTests++

  // 测试3: 实时智能助手功能
  const assistanceTest = await testRealTimeAssistanceFunction()
  testResults.tests.push(assistanceTest)
  if (assistanceTest.success) testResults.passedTests++
  else testResults.failedTests++

  // 输出总结
  console.log(`\n📊 测试总结: ${testResults.passedTests}/${testResults.totalTests} 通过`)
  
  if (testResults.passedTests === testResults.totalTests) {
    console.log('🎉 所有面试功能测试通过！')
  } else {
    console.log('⚠️ 部分测试失败，需要检查相关功能')
  }

  console.groupEnd()
  
  return testResults
}

/**
 * 模拟完整的面试流程测试
 */
export async function simulateCompleteInterviewFlow() {
  console.group('🎭 完整面试流程模拟测试')
  
  const flowResults = {
    timestamp: new Date().toISOString(),
    steps: [],
    success: false,
    error: null
  }

  try {
    // 步骤1: 初始化会话
    console.log('1️⃣ 初始化面试会话...')
    const session = await enhancedIflytekSparkService.initializeInterviewSession(
      {
        name: '测试候选人',
        position: 'AI工程师',
        skills: ['机器学习', '深度学习'],
        domain: 'ai'
      },
      'comprehensive'
    )
    flowResults.steps.push({ step: 'session_init', success: !!session.sessionId, data: session })

    // 步骤2: 生成问题
    console.log('2️⃣ 生成面试问题...')
    const question = await enhancedIflytekSparkService.generateNextQuestion(
      session.sessionId,
      { domain: 'ai', difficulty: 'medium', questionNumber: 1 }
    )
    flowResults.steps.push({ step: 'question_generation', success: !!question.question, data: question })

    // 步骤3: 分析回答
    console.log('3️⃣ 分析候选人回答...')
    const analysis = await enhancedIflytekSparkService.analyzeTextPrimary({
      text: '我在深度学习项目中使用了CNN和RNN模型，通过数据增强和正则化技术提升了模型性能。',
      domain: 'ai'
    })
    flowResults.steps.push({ step: 'answer_analysis', success: !!analysis.overallScore, data: analysis })

    // 步骤4: 获取AI提示
    console.log('4️⃣ 获取AI智能提示...')
    const hint = await enhancedIflytekSparkService.generateRealTimeHint(
      session.sessionId,
      { question: question.question, candidateResponse: '我需要一些提示' }
    )
    flowResults.steps.push({ step: 'ai_hint', success: !!hint.hint, data: hint })

    // 检查所有步骤是否成功
    const allStepsSuccessful = flowResults.steps.every(step => step.success)
    flowResults.success = allStepsSuccessful

    if (allStepsSuccessful) {
      console.log('🎉 完整面试流程模拟成功！')
    } else {
      console.log('⚠️ 面试流程中有步骤失败')
    }

  } catch (error) {
    flowResults.error = error.message
    console.error('❌ 面试流程模拟异常:', error)
  }

  console.groupEnd()
  return flowResults
}

export default {
  testAiHintFunction,
  testTextAnalysisFunction,
  testRealTimeAssistanceFunction,
  runAllInterviewFunctionTests,
  simulateCompleteInterviewFlow
}
