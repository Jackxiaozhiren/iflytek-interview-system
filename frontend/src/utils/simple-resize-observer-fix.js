/**
 * 简化的ResizeObserver错误修复工具
 * 专注于错误捕获和静默处理，不修改原生API
 */

class SimpleResizeObserverFix {
  constructor() {
    this.isActive = false
    this.errorCount = 0
    this.lastErrorTime = null
  }

  /**
   * 初始化错误处理
   */
  init() {
    if (this.isActive) return

    this.setupGlobalErrorHandling()
    this.isActive = true
    
    console.log('🔧 简化ResizeObserver错误处理已启用')
  }

  /**
   * 设置全局错误处理
   */
  setupGlobalErrorHandling() {
    // 捕获全局JavaScript错误
    window.addEventListener('error', (event) => {
      if (this.isResizeObserverError(event.message)) {
        this.handleError(event)
        event.preventDefault()
        return false
      }
    })

    // 捕获未处理的Promise错误
    window.addEventListener('unhandledrejection', (event) => {
      if (this.isResizeObserverError(event.reason?.message || event.reason)) {
        this.handleError(event)
        event.preventDefault()
      }
    })

    // 重写console.error来过滤ResizeObserver错误
    const originalConsoleError = console.error
    console.error = (...args) => {
      const message = args.join(' ')
      if (this.isResizeObserverError(message)) {
        this.handleError({ message })
        return // 完全静默处理，不输出到控制台
      }
      originalConsoleError.apply(console, args)
    }

    // 重写console.warn来过滤ResizeObserver警告
    const originalConsoleWarn = console.warn
    console.warn = (...args) => {
      try {
        const message = args.map(arg =>
          typeof arg === 'string' ? arg :
          typeof arg === 'object' ? JSON.stringify(arg) :
          String(arg)
        ).join(' ')

        if (this.isResizeObserverError(message)) {
          this.handleError({ message })
          return // 完全静默处理，不输出到控制台
        }
      } catch (error) {
        // 如果转换失败，直接调用原始方法
      }
      originalConsoleWarn.apply(console, args)
    }
  }

  /**
   * 检查是否为ResizeObserver错误
   */
  isResizeObserverError(message) {
    if (!message || typeof message !== 'string') return false
    
    const errorPatterns = [
      'ResizeObserver loop completed with undelivered notifications',
      'ResizeObserver loop limit exceeded',
      'ResizeObserver callback threw an exception'
    ]

    return errorPatterns.some(pattern => message.includes(pattern))
  }

  /**
   * 处理ResizeObserver错误
   */
  handleError(event) {
    this.errorCount++
    this.lastErrorTime = new Date()

    // 完全静默处理，不输出任何日志
    // 这样可以避免在控制台看到任何ResizeObserver相关的错误信息
  }

  /**
   * 获取状态信息
   */
  getStatus() {
    return {
      isActive: this.isActive,
      errorCount: this.errorCount,
      lastErrorTime: this.lastErrorTime,
      lastErrorTimeString: this.lastErrorTime ? this.lastErrorTime.toLocaleString() : null
    }
  }

  /**
   * 重置错误计数
   */
  resetErrorCount() {
    this.errorCount = 0
    this.lastErrorTime = null
    console.log('🔄 ResizeObserver错误计数已重置')
  }
}

// 创建全局实例
const simpleResizeObserverFix = new SimpleResizeObserverFix()

// 自动初始化
if (typeof window !== 'undefined') {
  simpleResizeObserverFix.init()
  
  // 设置全局引用
  window.simpleResizeObserverFix = simpleResizeObserverFix

  // 提供全局调试函数
  window.checkResizeObserverFix = () => {
    const status = simpleResizeObserverFix.getStatus()
    console.log('📊 ResizeObserver错误处理状态:', status)
    return status
  }

  window.resetResizeObserverErrors = () => {
    simpleResizeObserverFix.resetErrorCount()
  }
}

export default simpleResizeObserverFix
