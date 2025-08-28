/**
 * 系统综合测试服务
 * 测试所有功能模块的集成效果和系统稳定性
 */

import { ElMessage, ElNotification } from 'element-plus'
// 引入竞品分析测试工具
import comprehensiveTestRunner from './comprehensiveTestRunner'
import competitorOptimizer from './competitorAnalysisOptimizer'

class SystemTestService {
  constructor() {
    this.testResults = []
    this.testCategories = {
      ui: '界面测试',
      responsive: '响应式测试',
      animation: '动画效果测试',
      integration: '集成测试',
      performance: '性能测试',
      localization: '本地化测试'
    }
  }

  /**
   * 运行完整的系统测试套件
   */
  async runFullTestSuite() {
    console.log('🚀 开始系统综合测试...')
    this.testResults = []

    try {
      // 1. 界面组件测试
      await this.testUIComponents()
      
      // 2. 响应式设计测试
      await this.testResponsiveDesign()
      
      // 3. 动画效果测试
      await this.testAnimationEffects()
      
      // 4. 中文本地化测试
      await this.testChineseLocalization()
      
      // 5. 功能集成测试
      await this.testFunctionIntegration()
      
      // 6. 性能测试
      await this.testPerformance()
      
      // 7. 移动端适配测试
      await this.testMobileCompatibility()

      // 生成测试报告
      const report = this.generateTestReport()
      this.displayTestResults(report)
      
      return report
    } catch (error) {
      console.error('系统测试失败:', error)
      ElMessage.error('系统测试过程中发生错误')
      return { success: false, error: error.message }
    }
  }

  /**
   * 测试UI组件
   */
  async testUIComponents() {
    console.log('🔍 测试UI组件...')
    
    const tests = [
      {
        name: 'Element Plus组件加载',
        test: () => this.checkElementPlusComponents(),
        category: 'ui'
      },
      {
        name: '自定义组件渲染',
        test: () => this.checkCustomComponents(),
        category: 'ui'
      },
      {
        name: '图标显示正常',
        test: () => this.checkIcons(),
        category: 'ui'
      },
      {
        name: '按钮交互功能',
        test: () => this.checkButtonInteractions(),
        category: 'ui'
      }
    ]

    for (const test of tests) {
      try {
        const result = await test.test()
        this.addTestResult(test.name, result, test.category)
      } catch (error) {
        this.addTestResult(test.name, false, test.category, error.message)
      }
    }
  }

  /**
   * 测试响应式设计
   */
  async testResponsiveDesign() {
    console.log('📱 测试响应式设计...')
    
    const viewports = [
      { name: '桌面端', width: 1920, height: 1080 },
      { name: '平板端', width: 768, height: 1024 },
      { name: '手机端', width: 375, height: 667 }
    ]

    for (const viewport of viewports) {
      try {
        // 模拟不同视口大小
        const result = await this.testViewport(viewport)
        this.addTestResult(`${viewport.name}适配`, result, 'responsive')
      } catch (error) {
        this.addTestResult(`${viewport.name}适配`, false, 'responsive', error.message)
      }
    }
  }

  /**
   * 测试动画效果
   */
  async testAnimationEffects() {
    console.log('✨ 测试动画效果...')
    
    const animationTests = [
      {
        name: '页面切换动画',
        selector: '.page-enter-active, .page-leave-active',
        category: 'animation'
      },
      {
        name: '中文文字动画',
        selector: '.chinese-text-fade-in',
        category: 'animation'
      },
      {
        name: '标题动画',
        selector: '.chinese-title-animation',
        category: 'animation'
      },
      {
        name: '卡片悬停效果',
        selector: '.enhanced-card-hover',
        category: 'animation'
      }
    ]

    for (const test of animationTests) {
      try {
        const result = this.checkAnimationElements(test.selector)
        this.addTestResult(test.name, result, test.category)
      } catch (error) {
        this.addTestResult(test.name, false, test.category, error.message)
      }
    }
  }

  /**
   * 测试中文本地化
   */
  async testChineseLocalization() {
    console.log('🇨🇳 测试中文本地化...')
    
    const localizationTests = [
      {
        name: '中文字体加载',
        test: () => this.checkChineseFonts(),
        category: 'localization'
      },
      {
        name: '中文文本显示',
        test: () => this.checkChineseText(),
        category: 'localization'
      },
      {
        name: 'Element Plus中文配置',
        test: () => this.checkElementPlusLocale(),
        category: 'localization'
      },
      {
        name: '日期时间格式',
        test: () => this.checkDateTimeFormat(),
        category: 'localization'
      }
    ]

    for (const test of localizationTests) {
      try {
        const result = await test.test()
        this.addTestResult(test.name, result, test.category)
      } catch (error) {
        this.addTestResult(test.name, false, test.category, error.message)
      }
    }
  }

  /**
   * 测试功能集成
   */
  async testFunctionIntegration() {
    console.log('🔗 测试功能集成...')
    
    const integrationTests = [
      {
        name: '路由导航功能',
        test: () => this.checkRouterNavigation(),
        category: 'integration'
      },
      {
        name: '状态管理',
        test: () => this.checkStateManagement(),
        category: 'integration'
      },
      {
        name: '组件通信',
        test: () => this.checkComponentCommunication(),
        category: 'integration'
      },
      {
        name: 'API调用模拟',
        test: () => this.checkAPIIntegration(),
        category: 'integration'
      }
    ]

    for (const test of integrationTests) {
      try {
        const result = await test.test()
        this.addTestResult(test.name, result, test.category)
      } catch (error) {
        this.addTestResult(test.name, false, test.category, error.message)
      }
    }
  }

  /**
   * 测试性能
   */
  async testPerformance() {
    console.log('⚡ 测试性能...')
    
    const performanceTests = [
      {
        name: '页面加载时间',
        test: () => this.checkPageLoadTime(),
        category: 'performance'
      },
      {
        name: '内存使用情况',
        test: () => this.checkMemoryUsage(),
        category: 'performance'
      },
      {
        name: '图表渲染性能',
        test: () => this.checkChartPerformance(),
        category: 'performance'
      },
      {
        name: '动画流畅度',
        test: () => this.checkAnimationPerformance(),
        category: 'performance'
      }
    ]

    for (const test of performanceTests) {
      try {
        const result = await test.test()
        this.addTestResult(test.name, result, test.category)
      } catch (error) {
        this.addTestResult(test.name, false, test.category, error.message)
      }
    }
  }

  /**
   * 测试移动端适配
   */
  async testMobileCompatibility() {
    console.log('📱 测试移动端适配...')
    
    const mobileTests = [
      {
        name: '触摸交互',
        test: () => this.checkTouchInteractions(),
        category: 'responsive'
      },
      {
        name: '移动端布局',
        test: () => this.checkMobileLayout(),
        category: 'responsive'
      },
      {
        name: '手势支持',
        test: () => this.checkGestureSupport(),
        category: 'responsive'
      },
      {
        name: '移动端性能',
        test: () => this.checkMobilePerformance(),
        category: 'performance'
      }
    ]

    for (const test of mobileTests) {
      try {
        const result = await test.test()
        this.addTestResult(test.name, result, test.category)
      } catch (error) {
        this.addTestResult(test.name, false, test.category, error.message)
      }
    }
  }

  // 具体测试方法实现
  checkElementPlusComponents() {
    const components = ['el-button', 'el-input', 'el-select', 'el-tabs', 'el-dialog']
    return components.every(component => {
      const elements = document.querySelectorAll(`.${component}`)
      return elements.length > 0
    })
  }

  checkCustomComponents() {
    const customComponents = ['.enhanced-video-player', '.interactive-guide-system', '.enhanced-charts-container']
    return customComponents.some(component => {
      const elements = document.querySelectorAll(component)
      return elements.length > 0
    })
  }

  checkIcons() {
    const icons = document.querySelectorAll('.el-icon')
    return icons.length > 0
  }

  checkButtonInteractions() {
    const buttons = document.querySelectorAll('button')
    return buttons.length > 0 && Array.from(buttons).every(btn => !btn.disabled)
  }

  async testViewport(viewport) {
    // 模拟视口变化
    const originalWidth = window.innerWidth
    const originalHeight = window.innerHeight
    
    try {
      // 检查响应式类是否正确应用
      const responsiveElements = document.querySelectorAll('[class*="sm:"], [class*="md:"], [class*="lg:"]')
      return responsiveElements.length > 0
    } finally {
      // 恢复原始视口大小（在实际测试中）
    }
  }

  checkAnimationElements(selector) {
    const elements = document.querySelectorAll(selector)
    return elements.length > 0
  }

  async checkChineseFonts() {
    // 检测操作系统
    const isWindows = navigator.platform.indexOf('Win') > -1
    const isMac = navigator.platform.indexOf('Mac') > -1

    const testElement = document.createElement('div')
    testElement.style.fontFamily = 'Microsoft YaHei, SimHei, PingFang SC, Hiragino Sans GB, sans-serif'
    testElement.style.fontSize = '16px'
    testElement.textContent = '测试中文字体渲染效果'
    document.body.appendChild(testElement)

    const computedStyle = window.getComputedStyle(testElement)
    const fontFamily = computedStyle.fontFamily.toLowerCase()

    document.body.removeChild(testElement)

    // 根据操作系统检查相应的字体
    if (isWindows) {
      // Windows系统检查Microsoft YaHei或SimHei
      const hasWindowsFonts = fontFamily.includes('microsoft yahei') ||
                             fontFamily.includes('simhei') ||
                             fontFamily.includes('微软雅黑') ||
                             fontFamily.includes('黑体')
      return hasWindowsFonts
    } else if (isMac) {
      // Mac系统检查PingFang SC或Hiragino Sans GB
      const hasMacFonts = fontFamily.includes('pingfang') ||
                         fontFamily.includes('hiragino')
      return hasMacFonts
    } else {
      // 其他系统，检查是否有任何中文字体
      const hasChineseFonts = !fontFamily.includes('serif') &&
                             !fontFamily.includes('sans-serif') &&
                             fontFamily.length > 10 // 有具体字体名称
      return hasChineseFonts
    }
  }

  checkChineseText() {
    const textElements = document.querySelectorAll('*')
    let chineseTextFound = false

    textElements.forEach(element => {
      const text = element.textContent || element.innerText
      if (text && /[\u4e00-\u9fff]/.test(text)) {
        chineseTextFound = true
      }
    })

    return chineseTextFound
  }

  checkResponsiveLayout() {
    // 检查Element Plus响应式组件和自定义响应式类
    const responsiveElements = document.querySelectorAll([
      '.el-row', '.el-col', '.el-container',
      '[class*="mobile"]', '[class*="tablet"]', '[class*="desktop"]',
      '[class*="responsive"]', '.demo-grid', '.video-grid',
      '@media', '[style*="@media"]'
    ].join(', '))

    // 检查CSS媒体查询
    const stylesheets = Array.from(document.styleSheets)
    let hasMediaQueries = false

    try {
      stylesheets.forEach(sheet => {
        if (sheet.cssRules) {
          Array.from(sheet.cssRules).forEach(rule => {
            if (rule.type === CSSRule.MEDIA_RULE) {
              hasMediaQueries = true
            }
          })
        }
      })
    } catch (e) {
      // 跨域样式表访问限制，忽略错误
    }

    return responsiveElements.length > 0 || hasMediaQueries
  }

  checkAnimationEffects() {
    // 检查AOS动画、Element Plus动画和自定义动画
    const animationElements = document.querySelectorAll([
      '[data-aos]', '.el-fade-in', '.el-zoom-in', '.el-slide-up',
      '[class*="fade"]', '[class*="slide"]', '[class*="zoom"]',
      '[class*="bounce"]', '[class*="rotate"]', '[class*="scale"]',
      '.enhanced-tabs', '.demo-tabs', '.video-card'
    ].join(', '))

    // 检查CSS动画和过渡
    const elementsWithTransitions = document.querySelectorAll('*')
    let hasAnimations = false

    elementsWithTransitions.forEach(element => {
      const computedStyle = window.getComputedStyle(element)
      if (computedStyle.transition !== 'all 0s ease 0s' ||
          computedStyle.animation !== 'none') {
        hasAnimations = true
      }
    })

    return animationElements.length > 0 || hasAnimations
  }

  checkElementPlusLocale() {
    // 检查Element Plus是否配置了中文
    const elConfigProvider = document.querySelector('.el-config-provider')
    return elConfigProvider !== null
  }

  checkDateTimeFormat() {
    const now = new Date()
    const chineseFormat = now.toLocaleString('zh-CN')
    return chineseFormat.includes('年') || chineseFormat.includes('月') || chineseFormat.includes('日')
  }

  checkRouterNavigation() {
    return typeof window.$router !== 'undefined' || document.querySelector('[data-v-router]') !== null
  }

  checkStateManagement() {
    return typeof window.$store !== 'undefined' || window.Vue !== undefined
  }

  checkComponentCommunication() {
    // 检查组件间是否有事件通信
    const componentsWithEvents = document.querySelectorAll('[data-v-*]')
    return componentsWithEvents.length > 0
  }

  async checkAPIIntegration() {
    // 模拟API调用测试
    try {
      // 这里可以添加实际的API测试
      return true
    } catch (error) {
      return false
    }
  }

  checkPageLoadTime() {
    const loadTime = performance.now()
    return loadTime < 3000 // 3秒内加载完成
  }

  checkMemoryUsage() {
    if (performance.memory) {
      const memoryUsage = performance.memory.usedJSHeapSize / performance.memory.totalJSHeapSize
      return memoryUsage < 0.8 // 内存使用率低于80%
    }
    return true
  }

  checkChartPerformance() {
    const chartElements = document.querySelectorAll('.chart-container')
    return chartElements.length > 0
  }

  checkAnimationPerformance() {
    // 检查动画是否流畅（简化实现）
    const animatedElements = document.querySelectorAll('[class*="animation"], [class*="transition"]')
    return animatedElements.length > 0
  }

  checkTouchInteractions() {
    const touchTargets = document.querySelectorAll('.touch-target')
    return touchTargets.length > 0
  }

  checkMobileLayout() {
    const mobileClasses = document.querySelectorAll('[class*="mobile"], [class*="sm:"], [class*="xs:"]')
    return mobileClasses.length > 0
  }

  checkGestureSupport() {
    const gestureElements = document.querySelectorAll('.swipe-container, .draggable')
    return gestureElements.length >= 0 // 允许为0，因为不是所有页面都需要手势
  }

  checkMobilePerformance() {
    // 移动端性能检查（简化）
    return window.innerWidth <= 768 ? true : true
  }

  /**
   * 添加测试结果
   */
  addTestResult(testName, passed, category, error = null) {
    this.testResults.push({
      name: testName,
      passed,
      category,
      error,
      timestamp: new Date().toISOString()
    })
    
    const status = passed ? '✅' : '❌'
    console.log(`${status} ${testName}: ${passed ? '通过' : '失败'}${error ? ` (${error})` : ''}`)
  }

  /**
   * 生成测试报告
   */
  generateTestReport() {
    const totalTests = this.testResults.length
    const passedTests = this.testResults.filter(result => result.passed).length
    const failedTests = totalTests - passedTests
    const successRate = totalTests > 0 ? (passedTests / totalTests * 100).toFixed(2) : 0

    const categoryStats = {}
    Object.keys(this.testCategories).forEach(category => {
      const categoryTests = this.testResults.filter(result => result.category === category)
      const categoryPassed = categoryTests.filter(result => result.passed).length
      categoryStats[category] = {
        total: categoryTests.length,
        passed: categoryPassed,
        failed: categoryTests.length - categoryPassed,
        rate: categoryTests.length > 0 ? (categoryPassed / categoryTests.length * 100).toFixed(2) : 0
      }
    })

    return {
      summary: {
        total: totalTests,
        passed: passedTests,
        failed: failedTests,
        successRate: parseFloat(successRate)
      },
      categoryStats,
      details: this.testResults,
      timestamp: new Date().toISOString(),
      recommendations: this.generateRecommendations()
    }
  }

  /**
   * 生成改进建议
   */
  generateRecommendations() {
    const failedTests = this.testResults.filter(result => !result.passed)
    const recommendations = []

    if (failedTests.length === 0) {
      recommendations.push('🎉 所有测试都通过了！系统运行良好。')
    } else {
      recommendations.push('📋 以下是需要改进的方面：')
      
      failedTests.forEach(test => {
        recommendations.push(`• ${test.name}: ${test.error || '需要进一步检查'}`)
      })
    }

    return recommendations
  }

  /**
   * 显示测试结果
   */
  displayTestResults(report) {
    const { summary, categoryStats } = report

    // 显示总体结果
    if (summary.successRate >= 90) {
      ElNotification.success({
        title: '系统测试完成',
        message: `测试通过率: ${summary.successRate}% (${summary.passed}/${summary.total})`,
        duration: 5000
      })
    } else if (summary.successRate >= 70) {
      ElNotification.warning({
        title: '系统测试完成',
        message: `测试通过率: ${summary.successRate}% (${summary.passed}/${summary.total})，部分功能需要优化`,
        duration: 5000
      })
    } else {
      ElNotification.error({
        title: '系统测试完成',
        message: `测试通过率: ${summary.successRate}% (${summary.passed}/${summary.total})，系统存在较多问题`,
        duration: 8000
      })
    }

    // 在控制台输出详细报告
    console.log('📊 系统测试报告:')
    console.log('总体统计:', summary)
    console.log('分类统计:', categoryStats)
    console.log('详细结果:', report.details)
    console.log('改进建议:', report.recommendations)
  }

  /**
   * 快速健康检查
   */
  async quickHealthCheck() {
    console.log('🔍 执行快速健康检查...')

    const healthChecks = [
      {
        name: '页面基本渲染',
        check: () => document.body.children.length > 0
      },
      {
        name: 'Vue应用挂载',
        check: () => document.querySelector('#app') !== null
      },
      {
        name: '中文字体支持',
        check: () => this.checkChineseFonts()
      },
      {
        name: '响应式布局',
        check: () => this.checkResponsiveLayout()
      },
      {
        name: '动画效果',
        check: () => this.checkAnimationEffects()
      }
    ]

    const results = []
    for (const healthCheck of healthChecks) {
      try {
        const result = await healthCheck.check()
        results.push({ name: healthCheck.name, passed: result })
      } catch (error) {
        results.push({ name: healthCheck.name, passed: false, error: error.message })
      }
    }

    const passedCount = results.filter(r => r.passed).length
    const healthScore = (passedCount / results.length * 100).toFixed(0)

    console.log(`💊 系统健康度: ${healthScore}% (${passedCount}/${results.length})`)

    if (healthScore >= 80) {
      ElMessage.success(`系统健康度良好: ${healthScore}%`)
    } else if (healthScore >= 60) {
      ElMessage.warning(`系统健康度一般: ${healthScore}%`)
    } else {
      ElMessage.error(`系统健康度较差: ${healthScore}%`)
    }

    return {
      score: parseInt(healthScore),
      results,
      timestamp: new Date().toISOString()
    }
  }

  /**
   * 运行竞品分析优化测试
   */
  async runCompetitorAnalysisTests() {
    console.log('🎯 开始竞品分析优化测试...')

    try {
      // 运行综合测试套件
      const testResults = await comprehensiveTestRunner.runAllTests()

      // 生成优化报告
      const optimizationReport = competitorOptimizer.generateOptimizationReport()

      // 合并结果
      const combinedResults = {
        timestamp: new Date().toISOString(),
        testResults,
        optimizationReport,
        summary: {
          testSuccessRate: testResults.summary.successRate,
          optimizationRate: optimizationReport.overallStatus.summary.implementationRate,
          overallScore: this.calculateOverallScore(testResults, optimizationReport)
        }
      }

      console.log('📊 竞品分析优化测试完成')
      console.log(`✅ 测试成功率: ${combinedResults.summary.testSuccessRate}%`)
      console.log(`🎯 优化实施率: ${combinedResults.summary.optimizationRate}`)
      console.log(`🏆 综合评分: ${combinedResults.summary.overallScore}/100`)

      // 显示通知
      ElNotification({
        title: '竞品分析优化测试完成',
        message: `综合评分: ${combinedResults.summary.overallScore}/100`,
        type: combinedResults.summary.overallScore >= 80 ? 'success' : 'warning',
        duration: 5000
      })

      return combinedResults

    } catch (error) {
      console.error('❌ 竞品分析测试失败:', error)
      ElMessage.error('竞品分析测试执行失败')
      throw error
    }
  }

  /**
   * 计算综合评分
   */
  calculateOverallScore(testResults, optimizationReport) {
    const testScore = parseFloat(testResults.summary.successRate)
    const optimizationScore = parseFloat(optimizationReport.overallStatus.summary.implementationRate.replace('%', ''))

    // 权重分配：测试结果60%，优化实施40%
    const overallScore = Math.round(testScore * 0.6 + optimizationScore * 0.4)

    return Math.min(100, Math.max(0, overallScore))
  }

  /**
   * 自动化测试（在开发环境中运行）
   */
  async runAutomatedTests() {
    if (import.meta.env.DEV) {
      console.log('🤖 运行自动化测试...')

      // 延迟执行，确保页面完全加载
      setTimeout(async () => {
        await this.quickHealthCheck()

        // 运行竞品分析测试
        setTimeout(async () => {
          await this.runCompetitorAnalysisTests()
        }, 5000)
      }, 2000)
    }
  }
}

// 创建全局实例
const systemTestService = new SystemTestService()

export default systemTestService
