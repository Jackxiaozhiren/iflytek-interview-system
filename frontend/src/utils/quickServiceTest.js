/**
 * 快速服务测试工具
 * 用于验证修复后的iFlytek星火大模型服务功能
 */

import enhancedIflytekSparkService from '@/services/enhancedIflytekSparkService'

/**
 * 快速测试所有核心功能
 */
export async function quickTestAllFeatures() {
  const results = {
    timestamp: new Date().toISOString(),
    tests: [],
    summary: {
      total: 0,
      passed: 0,
      failed: 0
    }
  }

  // 测试1: 服务初始化
  try {
    const service = enhancedIflytekSparkService
    const hasConfig = !!service.config
    const hasCapabilities = !!service.capabilities
    const hasEnterpriseFeatures = !!service.enterpriseManagement
    
    results.tests.push({
      name: '服务初始化',
      passed: hasConfig && hasCapabilities && hasEnterpriseFeatures,
      details: { hasConfig, hasCapabilities, hasEnterpriseFeatures }
    })
  } catch (error) {
    results.tests.push({
      name: '服务初始化',
      passed: false,
      error: error.message
    })
  }

  // 测试2: 会话创建
  try {
    const candidateProfile = {
      name: '测试候选人',
      position: 'AI工程师',
      skills: ['机器学习'],
      domain: 'ai'
    }
    
    const session = await enhancedIflytekSparkService.initializeInterviewSession(
      candidateProfile,
      'comprehensive'
    )
    
    results.tests.push({
      name: '会话创建',
      passed: !!(session && session.sessionId),
      details: { sessionId: session?.sessionId, mode: session?.mode }
    })
  } catch (error) {
    results.tests.push({
      name: '会话创建',
      passed: false,
      error: error.message
    })
  }

  // 测试3: 文本分析
  try {
    const testInput = {
      text: '我使用TensorFlow实现了深度学习模型',
      domain: 'ai'
    }
    
    const analysis = await enhancedIflytekSparkService.analyzeTextPrimary(testInput)
    
    results.tests.push({
      name: '文本分析',
      passed: !!(analysis && typeof analysis.overallScore === 'number'),
      details: { 
        hasScore: !!analysis?.overallScore,
        hasSemanticAnalysis: !!analysis?.semanticAnalysis,
        hasProfessionalDepth: !!analysis?.professionalDepth
      }
    })
  } catch (error) {
    results.tests.push({
      name: '文本分析',
      passed: false,
      error: error.message
    })
  }

  // 测试4: 问题生成
  try {
    const context = {
      domain: 'ai',
      difficulty: 'medium',
      questionNumber: 1
    }
    
    const question = await enhancedIflytekSparkService.generateNextQuestion('test_session', context)
    
    results.tests.push({
      name: '问题生成',
      passed: !!(question && question.question),
      details: { 
        hasQuestion: !!question?.question,
        hasType: !!question?.type,
        hasDifficulty: !!question?.difficulty
      }
    })
  } catch (error) {
    results.tests.push({
      name: '问题生成',
      passed: false,
      error: error.message
    })
  }

  // 测试5: 实时智能助手
  try {
    const context = {
      questionType: 'technical',
      responseTime: 25,
      candidateState: 'normal'
    }
    
    const assistance = await enhancedIflytekSparkService.provideRealTimeAssistance('test_session', context)
    
    results.tests.push({
      name: '实时智能助手',
      passed: !!(assistance && assistance.guidance),
      details: { 
        hasGuidance: !!assistance?.guidance,
        hasIntelligentSuggestions: !!assistance?.intelligentSuggestions,
        hasAnswerStructure: !!assistance?.answerStructure
      }
    })
  } catch (error) {
    results.tests.push({
      name: '实时智能助手',
      passed: false,
      error: error.message
    })
  }

  // 测试6: 批量处理
  try {
    const batchConfig = {
      interviews: [
        { id: 'test1', candidateId: 'candidate1' },
        { id: 'test2', candidateId: 'candidate2' }
      ]
    }
    
    const batchResult = await enhancedIflytekSparkService.processBatchInterviews(batchConfig)
    
    results.tests.push({
      name: '批量处理',
      passed: !!(batchResult && batchResult.batchId),
      details: { 
        hasBatchId: !!batchResult?.batchId,
        processedCount: batchResult?.processedCount,
        hasResults: !!batchResult?.results
      }
    })
  } catch (error) {
    results.tests.push({
      name: '批量处理',
      passed: false,
      error: error.message
    })
  }

  // 测试7: 数据驱动洞察
  try {
    const analysisRequest = {
      dataScope: 'technical',
      timeRange: '30days'
    }
    
    const insights = await enhancedIflytekSparkService.generateDataDrivenInsights(analysisRequest)
    
    results.tests.push({
      name: '数据驱动洞察',
      passed: !!(insights && insights.insights),
      details: { 
        hasInsights: !!insights?.insights,
        hasPredictions: !!insights?.predictions,
        hasRecommendations: !!insights?.recommendations
      }
    })
  } catch (error) {
    results.tests.push({
      name: '数据驱动洞察',
      passed: false,
      error: error.message
    })
  }

  // 计算总结
  results.summary.total = results.tests.length
  results.summary.passed = results.tests.filter(test => test.passed).length
  results.summary.failed = results.summary.total - results.summary.passed

  return results
}

/**
 * 测试方法存在性
 */
export function testMethodExistence() {
  const requiredMethods = [
    'initializeInterviewSession',
    'analyzeTextPrimary',
    'generateNextQuestion',
    'provideRealTimeAssistance',
    'processBatchInterviews',
    'generateDataDrivenInsights',

    'generateSessionId',
    'generateBatchId'
  ]

  const results = {
    total: requiredMethods.length,
    existing: 0,
    missing: [],
    methods: {}
  }

  requiredMethods.forEach(methodName => {
    const exists = typeof enhancedIflytekSparkService[methodName] === 'function'
    results.methods[methodName] = exists
    
    if (exists) {
      results.existing++
    } else {
      results.missing.push(methodName)
    }
  })

  return results
}

/**
 * 显示测试结果
 */
export function displayTestResults(results) {
  console.group('🧪 iFlytek星火大模型服务测试结果')
  
  console.log(`📊 总体结果: ${results.summary.passed}/${results.summary.total} 通过`)
  
  results.tests.forEach(test => {
    if (test.passed) {
      console.log(`✅ ${test.name}: 通过`)
      if (test.details) {
        console.log('   详情:', test.details)
      }
    } else {
      console.log(`❌ ${test.name}: 失败`)
      if (test.error) {
        console.log('   错误:', test.error)
      }
      if (test.details) {
        console.log('   详情:', test.details)
      }
    }
  })
  
  console.groupEnd()
  
  return results.summary.failed === 0
}

export default {
  quickTestAllFeatures,
  testMethodExistence,
  displayTestResults
}
