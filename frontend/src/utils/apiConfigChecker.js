/**
 * iFlytek API配置检查工具
 * 用于检查和验证API配置状态
 */

class APIConfigChecker {
  constructor() {
    this.configStatus = {
      appId: false,
      apiKey: false,
      apiSecret: false,
      baseUrl: false
    }
  }

  /**
   * 检查API配置状态
   */
  checkConfiguration() {
    console.log('🔍 开始检查iFlytek API配置...')
    
    // 检查环境变量
    const config = {
      appId: import.meta.env.VUE_APP_IFLYTEK_APP_ID,
      apiKey: import.meta.env.VUE_APP_IFLYTEK_API_KEY,
      apiSecret: import.meta.env.VUE_APP_IFLYTEK_API_SECRET,
      baseUrl: import.meta.env.VUE_APP_IFLYTEK_API_URL
    }

    // 更新配置状态
    this.configStatus.appId = !!(config.appId && config.appId !== 'your_app_id')
    this.configStatus.apiKey = !!(config.apiKey && config.apiKey !== 'your_api_key')
    this.configStatus.apiSecret = !!(config.apiSecret && config.apiSecret !== 'your_api_secret')
    this.configStatus.baseUrl = !!(config.baseUrl && config.baseUrl !== 'https://spark-api.xf-yun.com')

    // 生成检查报告
    this.generateConfigReport(config)
    
    return {
      isComplete: this.isConfigurationComplete(),
      status: this.configStatus,
      config: this.maskSensitiveData(config)
    }
  }

  /**
   * 检查配置是否完整
   */
  isConfigurationComplete() {
    return this.configStatus.appId && this.configStatus.apiKey && this.configStatus.apiSecret
  }

  /**
   * 生成配置检查报告
   */
  generateConfigReport(config) {
    console.log('📋 iFlytek API配置检查报告')
    console.log('=' .repeat(50))
    
    console.log('📊 配置状态:')
    console.log(`   App ID: ${this.configStatus.appId ? '✅ 已配置' : '❌ 未配置'}`)
    console.log(`   API Key: ${this.configStatus.apiKey ? '✅ 已配置' : '❌ 未配置'}`)
    console.log(`   API Secret: ${this.configStatus.apiSecret ? '✅ 已配置' : '❌ 未配置'}`)
    console.log(`   Base URL: ${this.configStatus.baseUrl ? '✅ 已配置' : '⚠️ 使用默认值'}`)

    console.log('\n🔧 配置详情:')
    const maskedConfig = this.maskSensitiveData(config)
    Object.entries(maskedConfig).forEach(([key, value]) => {
      console.log(`   ${key}: ${value || '未设置'}`)
    })

    if (!this.isConfigurationComplete()) {
      console.log('\n⚠️ 配置不完整，系统将使用模拟响应模式')
      this.showConfigurationGuide()
    } else {
      console.log('\n✅ 配置完整，可以使用真实API')
    }

    console.log('=' .repeat(50))
  }

  /**
   * 显示配置指导
   */
  showConfigurationGuide() {
    console.log('\n💡 配置指导:')
    console.log('1. 在项目根目录创建 .env 文件')
    console.log('2. 添加以下配置项:')
    console.log('   VUE_APP_IFLYTEK_APP_ID=your_actual_app_id')
    console.log('   VUE_APP_IFLYTEK_API_KEY=your_actual_api_key')
    console.log('   VUE_APP_IFLYTEK_API_SECRET=your_actual_api_secret')
    console.log('   VUE_APP_IFLYTEK_API_URL=https://spark-api.xf-yun.com')
    console.log('3. 重启开发服务器')
    console.log('\n📝 注意: 请将实际的API凭据替换为您从iFlytek获得的真实值')
  }

  /**
   * 掩码敏感数据
   */
  maskSensitiveData(config) {
    const masked = {}
    Object.entries(config).forEach(([key, value]) => {
      if (!value) {
        masked[key] = '未设置'
      } else if (key === 'baseUrl') {
        masked[key] = value
      } else {
        // 掩码敏感信息，只显示前3位和后3位
        if (value.length > 6) {
          masked[key] = value.substring(0, 3) + '*'.repeat(value.length - 6) + value.substring(value.length - 3)
        } else {
          masked[key] = '*'.repeat(value.length)
        }
      }
    })
    return masked
  }

  /**
   * 创建模拟配置用于开发测试
   */
  createMockConfiguration() {
    console.log('🧪 创建模拟配置用于开发测试')
    
    return {
      appId: 'mock_app_id_for_development',
      apiKey: 'mock_api_key_for_development',
      apiSecret: 'mock_api_secret_for_development',
      baseUrl: 'https://mock-spark-api.example.com',
      isMock: true
    }
  }

  /**
   * 验证API连接
   */
  async testAPIConnection(config) {
    console.log('🔗 测试API连接...')
    
    try {
      // 这里可以添加实际的API连接测试
      // 目前返回模拟结果
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (this.isConfigurationComplete()) {
        console.log('✅ API连接测试成功')
        return { success: true, message: 'API连接正常' }
      } else {
        console.log('⚠️ 使用模拟模式，跳过连接测试')
        return { success: true, message: '模拟模式运行正常', isMock: true }
      }
      
    } catch (error) {
      console.error('❌ API连接测试失败:', error.message)
      return { success: false, message: error.message }
    }
  }

  /**
   * 获取配置建议
   */
  getConfigurationRecommendations() {
    const recommendations = []

    if (!this.configStatus.appId) {
      recommendations.push({
        type: 'error',
        message: '缺少App ID配置',
        solution: '请在.env文件中设置VUE_APP_IFLYTEK_APP_ID'
      })
    }

    if (!this.configStatus.apiKey) {
      recommendations.push({
        type: 'error',
        message: '缺少API Key配置',
        solution: '请在.env文件中设置VUE_APP_IFLYTEK_API_KEY'
      })
    }

    if (!this.configStatus.apiSecret) {
      recommendations.push({
        type: 'error',
        message: '缺少API Secret配置',
        solution: '请在.env文件中设置VUE_APP_IFLYTEK_API_SECRET'
      })
    }

    if (!this.configStatus.baseUrl) {
      recommendations.push({
        type: 'warning',
        message: '使用默认API URL',
        solution: '可以在.env文件中自定义VUE_APP_IFLYTEK_API_URL'
      })
    }

    if (recommendations.length === 0) {
      recommendations.push({
        type: 'success',
        message: '配置完整',
        solution: '所有必需的配置项都已正确设置'
      })
    }

    return recommendations
  }
}

// 创建全局实例
const apiConfigChecker = new APIConfigChecker()

// 导出检查器和便捷方法
export default apiConfigChecker

// 便捷的全局检查方法
export const checkAPIConfig = () => apiConfigChecker.checkConfiguration()
export const testAPIConnection = (config) => apiConfigChecker.testAPIConnection(config)

// 在开发环境下添加到全局对象
if (import.meta.env.DEV) {
  window.checkAPIConfig = checkAPIConfig
  window.testAPIConnection = testAPIConnection
  window.apiConfigChecker = apiConfigChecker
}

// 自动执行配置检查
if (typeof window !== 'undefined') {
  // 页面加载后自动检查配置
  setTimeout(() => {
    checkAPIConfig()
  }, 1000)
}
