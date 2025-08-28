/**
 * AI响应调试工具
 * 用于测试和调试AI面试官响应延迟问题
 */

import enhancedIflytekSparkService from '@/services/enhancedIflytekSparkService'

class AIResponseDebugger {
  constructor() {
    this.testResults = []
    this.isDebugging = false
  }

  /**
   * 开始调试AI响应功能
   */
  async startDebugging() {
    if (this.isDebugging) {
      console.warn('⚠️ 调试已在进行中')
      return
    }

    this.isDebugging = true
    this.testResults = []
    
    console.log('🔍 开始AI响应功能调试...')
    console.log('=' .repeat(50))

    try {
      // 测试1: 初始化会话
      await this.testSessionInitialization()
      
      // 测试2: 问题生成
      await this.testQuestionGeneration()
      
      // 测试3: 文本分析
      await this.testTextAnalysis()
      
      // 测试4: AI提示生成
      await this.testHintGeneration()
      
      // 测试5: 实时助手
      await this.testRealTimeAssistance()
      
      // 生成调试报告
      this.generateDebugReport()
      
    } catch (error) {
      console.error('❌ 调试过程中出现错误:', error)
    } finally {
      this.isDebugging = false
    }
  }

  /**
   * 测试会话初始化
   */
  async testSessionInitialization() {
    console.log('🧪 测试1: 会话初始化')
    const startTime = Date.now()
    
    try {
      const candidateProfile = {
        name: '测试候选人',
        position: 'AI工程师',
        experience: '3年',
        skills: ['机器学习', '深度学习', 'Python']
      }

      const session = await enhancedIflytekSparkService.initializeInterviewSession(
        candidateProfile,
        'technical'
      )

      const duration = Date.now() - startTime
      
      this.testResults.push({
        test: '会话初始化',
        status: 'success',
        duration: duration,
        result: session
      })

      console.log(`✅ 会话初始化成功 - 耗时: ${duration}ms`)
      console.log('📋 会话信息:', session.sessionId)
      
      return session

    } catch (error) {
      const duration = Date.now() - startTime
      
      this.testResults.push({
        test: '会话初始化',
        status: 'error',
        duration: duration,
        error: error.message
      })

      console.error(`❌ 会话初始化失败 - 耗时: ${duration}ms, 错误:`, error.message)
      throw error
    }
  }

  /**
   * 测试问题生成
   */
  async testQuestionGeneration() {
    console.log('\n🧪 测试2: 问题生成')
    const startTime = Date.now()
    
    try {
      const context = {
        domain: 'ai',
        difficulty: 'medium',
        questionNumber: 1,
        candidateProfile: { experience: '3年' }
      }

      const question = await enhancedIflytekSparkService.generateInterviewQuestion(
        'test_session_' + Date.now(),
        context
      )

      const duration = Date.now() - startTime
      
      this.testResults.push({
        test: '问题生成',
        status: 'success',
        duration: duration,
        result: question
      })

      console.log(`✅ 问题生成成功 - 耗时: ${duration}ms`)
      console.log('❓ 生成的问题:', question.question?.substring(0, 100) + '...')
      
      return question

    } catch (error) {
      const duration = Date.now() - startTime
      
      this.testResults.push({
        test: '问题生成',
        status: 'error',
        duration: duration,
        error: error.message
      })

      console.error(`❌ 问题生成失败 - 耗时: ${duration}ms, 错误:`, error.message)
    }
  }

  /**
   * 测试文本分析
   */
  async testTextAnalysis() {
    console.log('\n🧪 测试3: 文本分析')
    const startTime = Date.now()
    
    try {
      const inputData = {
        text: '我在机器学习项目中使用了TensorFlow框架，实现了一个深度神经网络模型。通过数据预处理、模型调优和超参数优化，最终将模型准确率从85%提升到92%。在项目中，我主要负责算法设计和性能优化。',
        domain: 'ai'
      }

      const analysis = await enhancedIflytekSparkService.analyzeTextPrimaryInput(
        'test_session_' + Date.now(),
        inputData
      )

      const duration = Date.now() - startTime
      
      this.testResults.push({
        test: '文本分析',
        status: 'success',
        duration: duration,
        result: analysis
      })

      console.log(`✅ 文本分析成功 - 耗时: ${duration}ms`)
      console.log('📊 分析结果:', {
        score: analysis.overallScore,
        keywords: analysis.textAnalysis?.keywords?.slice(0, 3)
      })
      
      return analysis

    } catch (error) {
      const duration = Date.now() - startTime
      
      this.testResults.push({
        test: '文本分析',
        status: 'error',
        duration: duration,
        error: error.message
      })

      console.error(`❌ 文本分析失败 - 耗时: ${duration}ms, 错误:`, error.message)
    }
  }

  /**
   * 测试AI提示生成
   */
  async testHintGeneration() {
    console.log('\n🧪 测试4: AI提示生成')
    const startTime = Date.now()
    
    try {
      const context = {
        question: '请介绍您对机器学习的理解',
        candidateResponse: '我不太清楚',
        questionNumber: 1
      }

      const hint = await enhancedIflytekSparkService.generateRealTimeHint(
        'test_session_' + Date.now(),
        context
      )

      const duration = Date.now() - startTime
      
      this.testResults.push({
        test: 'AI提示生成',
        status: 'success',
        duration: duration,
        result: hint
      })

      console.log(`✅ AI提示生成成功 - 耗时: ${duration}ms`)
      console.log('💡 生成的提示:', hint.hint?.substring(0, 100) + '...')
      
      return hint

    } catch (error) {
      const duration = Date.now() - startTime
      
      this.testResults.push({
        test: 'AI提示生成',
        status: 'error',
        duration: duration,
        error: error.message
      })

      console.error(`❌ AI提示生成失败 - 耗时: ${duration}ms, 错误:`, error.message)
    }
  }

  /**
   * 测试实时助手
   */
  async testRealTimeAssistance() {
    console.log('\n🧪 测试5: 实时助手')
    const startTime = Date.now()
    
    try {
      const context = {
        questionType: 'technical',
        responseTime: 25,
        candidateState: 'struggling'
      }

      const assistance = await enhancedIflytekSparkService.provideRealTimeAssistance(
        'test_session_' + Date.now(),
        context
      )

      const duration = Date.now() - startTime
      
      this.testResults.push({
        test: '实时助手',
        status: 'success',
        duration: duration,
        result: assistance
      })

      console.log(`✅ 实时助手成功 - 耗时: ${duration}ms`)
      console.log('🤝 助手类型:', assistance.assistanceType)
      
      return assistance

    } catch (error) {
      const duration = Date.now() - startTime
      
      this.testResults.push({
        test: '实时助手',
        status: 'error',
        duration: duration,
        error: error.message
      })

      console.error(`❌ 实时助手失败 - 耗时: ${duration}ms, 错误:`, error.message)
    }
  }

  /**
   * 生成调试报告
   */
  generateDebugReport() {
    console.log('\n📋 AI响应功能调试报告')
    console.log('=' .repeat(50))
    
    const successCount = this.testResults.filter(r => r.status === 'success').length
    const errorCount = this.testResults.filter(r => r.status === 'error').length
    const totalTests = this.testResults.length
    
    console.log(`📊 测试统计:`)
    console.log(`   总测试数: ${totalTests}`)
    console.log(`   成功: ${successCount} (${Math.round(successCount/totalTests*100)}%)`)
    console.log(`   失败: ${errorCount} (${Math.round(errorCount/totalTests*100)}%)`)
    
    console.log('\n⏱️ 性能分析:')
    this.testResults.forEach(result => {
      const status = result.status === 'success' ? '✅' : '❌'
      console.log(`   ${status} ${result.test}: ${result.duration}ms`)
    })
    
    if (errorCount > 0) {
      console.log('\n🚨 错误详情:')
      this.testResults
        .filter(r => r.status === 'error')
        .forEach(result => {
          console.log(`   ❌ ${result.test}: ${result.error}`)
        })
    }
    
    console.log('\n💡 建议:')
    if (errorCount === 0) {
      console.log('   🎉 所有测试通过！AI响应功能正常工作。')
    } else {
      console.log('   🔧 存在错误，建议检查网络连接和API配置。')
      console.log('   📝 查看上述错误详情进行针对性修复。')
    }
    
    console.log('=' .repeat(50))
  }

  /**
   * 快速测试单个功能
   */
  async quickTest(testName) {
    console.log(`🚀 快速测试: ${testName}`)
    
    switch (testName) {
      case 'session':
        return await this.testSessionInitialization()
      case 'question':
        return await this.testQuestionGeneration()
      case 'analysis':
        return await this.testTextAnalysis()
      case 'hint':
        return await this.testHintGeneration()
      case 'assistance':
        return await this.testRealTimeAssistance()
      default:
        console.error('❌ 未知的测试名称:', testName)
        return null
    }
  }
}

// 创建全局调试器实例
const aiResponseDebugger = new AIResponseDebugger()

// 导出调试器和便捷方法
export default aiResponseDebugger

// 便捷的全局调试方法
export const debugAIResponse = () => aiResponseDebugger.startDebugging()
export const quickTestAI = (testName) => aiResponseDebugger.quickTest(testName)

// 在开发环境下添加到全局对象
if (import.meta.env.DEV) {
  window.debugAIResponse = debugAIResponse
  window.quickTestAI = quickTestAI
  window.aiResponseDebugger = aiResponseDebugger
}
