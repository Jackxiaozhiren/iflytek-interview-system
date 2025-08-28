/**
 * 讯飞星火大模型集成测试工具
 * 用于验证API连接和功能正常性
 */

import enhancedIflytekSparkService from '@/services/enhancedIflytekSparkService'

class IflytekSparkTester {
  constructor() {
    this.testResults = {
      apiConnection: null,
      sessionInitialization: null,
      questionGeneration: null,
      multimodalAnalysis: null,
      voiceProcessing: null,
      videoProcessing: null,
      realTimeHints: null,
      overall: null
    }
  }

  /**
   * 运行完整测试套件
   */
  async runFullTestSuite() {
    console.log('🧪 开始讯飞星火大模型集成测试...')
    
    try {
      // 1. 测试API连接
      await this.testApiConnection()
      
      // 2. 测试会话初始化
      await this.testSessionInitialization()
      
      // 3. 测试问题生成
      await this.testQuestionGeneration()
      
      // 4. 测试多模态分析
      await this.testMultimodalAnalysis()
      
      // 5. 测试语音处理
      await this.testVoiceProcessing()
      
      // 6. 测试视频处理
      await this.testVideoProcessing()
      
      // 7. 测试实时提示
      await this.testRealTimeHints()
      
      // 生成测试报告
      this.generateTestReport()
      
    } catch (error) {
      console.error('❌ 测试套件执行失败:', error)
      this.testResults.overall = 'FAILED'
    }
  }

  /**
   * 测试API连接
   */
  async testApiConnection() {
    console.log('🔗 测试API连接...')
    
    try {
      const testRequest = {
        action: 'test_connection',
        data: { message: 'Hello iFlytek Spark' }
      }
      
      const response = await enhancedIflytekSparkService.callSparkAPI(testRequest)
      
      if (response && response.content) {
        this.testResults.apiConnection = 'PASSED'
        console.log('✅ API连接测试通过')
      } else {
        this.testResults.apiConnection = 'FAILED'
        console.log('❌ API连接测试失败')
      }
    } catch (error) {
      this.testResults.apiConnection = 'FAILED'
      console.error('❌ API连接测试异常:', error)
    }
  }

  /**
   * 测试会话初始化
   */
  async testSessionInitialization() {
    console.log('🎯 测试会话初始化...')
    
    try {
      const candidateProfile = {
        name: '测试候选人',
        position: 'AI算法工程师',
        skills: ['Python', 'TensorFlow', '机器学习'],
        domain: 'ai'
      }
      
      const session = await enhancedIflytekSparkService.initializeInterviewSession(
        candidateProfile,
        'comprehensive'
      )
      
      if (session && session.sessionId) {
        this.testResults.sessionInitialization = 'PASSED'
        this.testSessionId = session.sessionId
        console.log('✅ 会话初始化测试通过, SessionID:', session.sessionId)
      } else {
        this.testResults.sessionInitialization = 'FAILED'
        console.log('❌ 会话初始化测试失败')
      }
    } catch (error) {
      this.testResults.sessionInitialization = 'FAILED'
      console.error('❌ 会话初始化测试异常:', error)
    }
  }

  /**
   * 测试问题生成
   */
  async testQuestionGeneration() {
    console.log('❓ 测试问题生成...')
    
    if (!this.testSessionId) {
      this.testResults.questionGeneration = 'SKIPPED'
      console.log('⏭️ 跳过问题生成测试（会话未初始化）')
      return
    }
    
    try {
      const questionContext = {
        previousAnswers: [],
        difficulty: 'medium',
        domain: 'ai',
        candidateProfile: { name: '测试候选人' },
        questionNumber: 1
      }
      
      const question = await enhancedIflytekSparkService.generateInterviewQuestion(
        this.testSessionId,
        questionContext
      )
      
      if (question && question.question) {
        this.testResults.questionGeneration = 'PASSED'
        console.log('✅ 问题生成测试通过:', question.question.substring(0, 50) + '...')
      } else {
        this.testResults.questionGeneration = 'FAILED'
        console.log('❌ 问题生成测试失败')
      }
    } catch (error) {
      this.testResults.questionGeneration = 'FAILED'
      console.error('❌ 问题生成测试异常:', error)
    }
  }

  /**
   * 测试多模态分析
   */
  async testMultimodalAnalysis() {
    console.log('🎭 测试多模态分析...')
    
    if (!this.testSessionId) {
      this.testResults.multimodalAnalysis = 'SKIPPED'
      console.log('⏭️ 跳过多模态分析测试（会话未初始化）')
      return
    }
    
    try {
      const inputData = {
        text: '我在机器学习项目中使用了TensorFlow框架，实现了一个图像分类模型',
        audio: null, // 模拟音频数据
        video: null  // 模拟视频数据
      }
      
      const analysis = await enhancedIflytekSparkService.analyzeTextPrimaryInput(
        this.testSessionId,
        inputData
      )
      
      if (analysis && analysis.overallScore !== undefined) {
        this.testResults.multimodalAnalysis = 'PASSED'
        console.log('✅ 多模态分析测试通过, 综合评分:', analysis.overallScore)
      } else {
        this.testResults.multimodalAnalysis = 'FAILED'
        console.log('❌ 多模态分析测试失败')
      }
    } catch (error) {
      this.testResults.multimodalAnalysis = 'FAILED'
      console.error('❌ 多模态分析测试异常:', error)
    }
  }

  /**
   * 测试语音处理（已禁用）
   */
  async testVoiceProcessing() {
    console.log('🎤 语音处理功能已禁用，跳过测试...')
    this.testResults.voiceProcessing = 'DISABLED'
    console.log('⏭️ 语音处理功能已禁用')
  }

  /**
   * 测试视频处理
   */
  async testVideoProcessing() {
    console.log('📹 测试视频处理...')
    
    if (!this.testSessionId) {
      this.testResults.videoProcessing = 'SKIPPED'
      console.log('⏭️ 跳过视频处理测试（会话未初始化）')
      return
    }
    
    try {
      const testVideoData = 'mock_video_data' // 模拟视频数据
      
      // 视频处理功能已移除，跳过测试
      this.testResults.videoProcessing = 'SKIPPED'
      console.log('⏭️ 视频处理功能已移除，跳过测试')
    } catch (error) {
      this.testResults.videoProcessing = 'FAILED'
      console.error('❌ 视频处理测试异常:', error)
    }
  }

  /**
   * 测试实时提示
   */
  async testRealTimeHints() {
    console.log('💡 测试实时提示...')
    
    if (!this.testSessionId) {
      this.testResults.realTimeHints = 'SKIPPED'
      console.log('⏭️ 跳过实时提示测试（会话未初始化）')
      return
    }
    
    try {
      const currentContext = {
        question: '请介绍您的项目经验',
        candidateResponse: '我做过一些项目',
        analysisResults: { overallScore: 75 },
        questionNumber: 1
      }
      
      const hint = await enhancedIflytekSparkService.generateRealTimeHint(
        this.testSessionId,
        currentContext
      )
      
      if (hint && hint.hint) {
        this.testResults.realTimeHints = 'PASSED'
        console.log('✅ 实时提示测试通过:', hint.hint.substring(0, 30) + '...')
      } else {
        this.testResults.realTimeHints = 'FAILED'
        console.log('❌ 实时提示测试失败')
      }
    } catch (error) {
      this.testResults.realTimeHints = 'FAILED'
      console.error('❌ 实时提示测试异常:', error)
    }
  }

  /**
   * 生成测试报告
   */
  generateTestReport() {
    console.log('\n📊 讯飞星火大模型集成测试报告')
    console.log('=' .repeat(50))
    
    const results = this.testResults
    let passedCount = 0
    let totalCount = 0
    
    Object.entries(results).forEach(([testName, result]) => {
      if (testName !== 'overall') {
        totalCount++
        if (result === 'PASSED') {
          passedCount++
          console.log(`✅ ${testName}: ${result}`)
        } else if (result === 'FAILED') {
          console.log(`❌ ${testName}: ${result}`)
        } else if (result === 'SKIPPED') {
          console.log(`⏭️ ${testName}: ${result}`)
        }
      }
    })
    
    const successRate = (passedCount / totalCount * 100).toFixed(1)
    this.testResults.overall = successRate >= 70 ? 'PASSED' : 'FAILED'
    
    console.log('=' .repeat(50))
    console.log(`📈 测试通过率: ${passedCount}/${totalCount} (${successRate}%)`)
    console.log(`🎯 整体状态: ${this.testResults.overall}`)
    
    if (this.testResults.overall === 'PASSED') {
      console.log('🎉 讯飞星火大模型集成测试通过！')
    } else {
      console.log('⚠️ 讯飞星火大模型集成存在问题，请检查配置和网络连接')
    }
    
    return this.testResults
  }

  /**
   * 快速健康检查
   */
  async quickHealthCheck() {
    console.log('🏥 执行快速健康检查...')
    
    try {
      await this.testApiConnection()
      await this.testSessionInitialization()
      
      const isHealthy = this.testResults.apiConnection === 'PASSED' && 
                       this.testResults.sessionInitialization === 'PASSED'
      
      if (isHealthy) {
        console.log('✅ 系统健康状态良好')
        return true
      } else {
        console.log('❌ 系统健康状态异常')
        return false
      }
    } catch (error) {
      console.error('❌ 健康检查失败:', error)
      return false
    }
  }
}

// 创建测试实例
const iflytekSparkTester = new IflytekSparkTester()

// 导出测试工具
export default iflytekSparkTester

// 在开发环境下自动运行快速健康检查
if (import.meta.env.DEV && import.meta.env.VUE_APP_DEBUG_MODE === 'true') {
  setTimeout(() => {
    iflytekSparkTester.quickHealthCheck()
  }, 2000)
}
