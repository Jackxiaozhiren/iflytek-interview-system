// ECharts错误检测和修复工具
import * as echarts from 'echarts'

class EChartsErrorDetector {
  constructor() {
    this.errors = []
    this.warnings = []
    this.setupErrorHandling()
  }

  // 设置错误处理
  setupErrorHandling() {
    // 监听全局错误
    const originalError = console.error
    console.error = (...args) => {
      try {
        const message = this.safeJoinArgs(args)
        if (this.isEChartsError(message)) {
          this.errors.push({
            type: 'error',
            message,
            timestamp: new Date().toISOString(),
            stack: new Error().stack
          })
        }
      } catch (e) {
        // 如果处理失败，静默忽略以避免无限循环
      }
      originalError.apply(console, args)
    }

    // 监听警告
    const originalWarn = console.warn
    console.warn = (...args) => {
      try {
        const message = this.safeJoinArgs(args)
        if (this.isEChartsWarning(message)) {
          this.warnings.push({
            type: 'warning',
            message,
            timestamp: new Date().toISOString()
          })
        }
      } catch (e) {
        // 如果处理失败，静默忽略以避免无限循环
      }
      originalWarn.apply(console, args)
    }
  }

  // 安全地连接参数为字符串
  safeJoinArgs(args) {
    try {
      return args.map(arg => {
        if (arg === null) return 'null'
        if (arg === undefined) return 'undefined'
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg)
          } catch (e) {
            return '[Object]'
          }
        }
        return String(arg)
      }).join(' ')
    } catch (e) {
      return '[Error converting arguments to string]'
    }
  }

  // 判断是否为ECharts错误
  isEChartsError(message) {
    const echartsErrorPatterns = [
      'registers.registerChartView is not a function',
      'Can\'t get DOM width or height',
      'ECharts',
      'echarts',
      'chart',
      'registerChartView',
      'registerSeriesModel'
    ]
    return echartsErrorPatterns.some(pattern => 
      message.toLowerCase().includes(pattern.toLowerCase())
    )
  }

  // 判断是否为ECharts警告
  isEChartsWarning(message) {
    // 过滤掉容器尺寸相关的常见警告
    const ignoredPatterns = [
      '容器尺寸为0',
      '延迟初始化',
      'container size is 0'
    ]

    // 如果是被忽略的警告，不记录
    if (ignoredPatterns.some(pattern =>
      message.toLowerCase().includes(pattern.toLowerCase())
    )) {
      return false
    }

    const echartsWarningPatterns = [
      'DOM width or height',
      '图表容器',
      'chart container',
      'echarts',
      'resize',
      'DEPRECATED'
    ]
    return echartsWarningPatterns.some(pattern =>
      message.toLowerCase().includes(pattern.toLowerCase())
    )
  }

  // 检测ECharts配置
  checkEChartsConfiguration() {
    const results = {
      success: true,
      issues: []
    }

    try {
      // 检查echarts是否正确导入
      if (typeof echarts === 'undefined') {
        results.success = false
        results.issues.push('ECharts未正确导入')
      }

      // 检查基本组件是否可用
      const testContainer = document.createElement('div')
      testContainer.style.width = '100px'
      testContainer.style.height = '100px'
      document.body.appendChild(testContainer)

      try {
        const testChart = echarts.init(testContainer)
        testChart.dispose()
        document.body.removeChild(testContainer)
      } catch (error) {
        results.success = false
        results.issues.push(`ECharts初始化失败: ${error.message}`)
        document.body.removeChild(testContainer)
      }

    } catch (error) {
      results.success = false
      results.issues.push(`配置检查失败: ${error.message}`)
    }

    return results
  }

  // 检测DOM容器问题
  checkDOMContainers() {
    const containers = document.querySelectorAll('[ref*="chart"], .chart-container, [id*="chart"]')
    const results = []

    containers.forEach((container, index) => {
      const rect = container.getBoundingClientRect()
      const result = {
        element: container,
        index,
        width: rect.width,
        height: rect.height,
        visible: rect.width > 0 && rect.height > 0,
        issues: []
      }

      if (rect.width === 0) {
        result.issues.push('容器宽度为0')
      }
      if (rect.height === 0) {
        result.issues.push('容器高度为0')
      }
      if (!container.offsetParent) {
        result.issues.push('容器不可见或未渲染')
      }

      results.push(result)
    })

    return results
  }

  // 生成诊断报告
  generateDiagnosticReport() {
    const configCheck = this.checkEChartsConfiguration()
    const containerCheck = this.checkDOMContainers()

    const report = {
      timestamp: new Date().toISOString(),
      configuration: configCheck,
      containers: containerCheck,
      errors: this.errors,
      warnings: this.warnings,
      summary: {
        totalErrors: this.errors.length,
        totalWarnings: this.warnings.length,
        configurationOK: configCheck.success,
        containersOK: containerCheck.every(c => c.visible && c.issues.length === 0)
      }
    }

    return report
  }

  // 清除错误记录
  clearErrors() {
    this.errors = []
    this.warnings = []
  }

  // 输出诊断报告到控制台
  printDiagnosticReport() {
    const report = this.generateDiagnosticReport()
    
    console.log('🔍 ECharts诊断报告')
    console.log('='.repeat(50))
    console.log(`📅 时间: ${report.timestamp}`)
    console.log(`📊 总结: 错误 ${report.summary.totalErrors} 个, 警告 ${report.summary.totalWarnings} 个`)
    console.log(`⚙️ 配置状态: ${report.summary.configurationOK ? '✅ 正常' : '❌ 异常'}`)
    console.log(`📦 容器状态: ${report.summary.containersOK ? '✅ 正常' : '❌ 异常'}`)

    if (report.configuration.issues.length > 0) {
      console.log('\n❌ 配置问题:')
      report.configuration.issues.forEach(issue => console.log(`  - ${issue}`))
    }

    if (report.containers.some(c => c.issues.length > 0)) {
      console.log('\n⚠️ 容器问题:')
      report.containers.forEach((container, index) => {
        if (container.issues.length > 0) {
          console.log(`  容器 ${index + 1}: ${container.issues.join(', ')}`)
        }
      })
    }

    if (report.errors.length > 0) {
      console.log('\n🚨 错误记录:')
      report.errors.forEach(error => {
        console.log(`  [${error.timestamp}] ${error.message}`)
      })
    }

    if (report.warnings.length > 0) {
      console.log('\n⚠️ 警告记录:')
      report.warnings.forEach(warning => {
        console.log(`  [${warning.timestamp}] ${warning.message}`)
      })
    }

    return report
  }
}

// 创建全局实例
const echartsErrorDetector = new EChartsErrorDetector()

// 导出
export default echartsErrorDetector
export { EChartsErrorDetector }
