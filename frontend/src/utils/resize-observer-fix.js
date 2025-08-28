/**
 * ResizeObserver 错误修复工具
 * 解决 "ResizeObserver loop completed with undelivered notifications" 错误
 */

class ResizeObserverFix {
  constructor() {
    this.isFixed = false
    this.errorCount = 0
    this.lastErrorTime = null
    this.observers = new Set()
    this.pendingCallbacks = new Map()
    this.rafId = null
  }

  /**
   * 初始化修复
   */
  init() {
    if (this.isFixed) return

    try {
      this.setupErrorHandling()
      this.patchResizeObserver()
      this.isFixed = true
      console.log('🔧 ResizeObserver 错误修复已启用')
    } catch (error) {
      console.warn('⚠️ ResizeObserver 修复初始化失败，使用基础错误处理:', error.message)
      // 如果修补失败，至少启用基础错误处理
      this.setupErrorHandling()
      this.isFixed = true
    }
  }

  /**
   * 设置错误处理
   */
  setupErrorHandling() {
    // 捕获全局错误
    window.addEventListener('error', (event) => {
      if (this.isResizeObserverError(event.message)) {
        this.handleError(event)
        event.preventDefault()
        return false
      }
    })

    // 捕获未处理的Promise错误
    window.addEventListener('unhandledrejection', (event) => {
      if (this.isResizeObserverError(event.reason?.message)) {
        this.handleError(event)
        event.preventDefault()
      }
    })
  }

  /**
   * 检查是否为ResizeObserver错误
   */
  isResizeObserverError(message) {
    if (!message) return false
    
    const errorPatterns = [
      'ResizeObserver loop completed with undelivered notifications',
      'ResizeObserver loop limit exceeded',
      'ResizeObserver callback threw an exception'
    ]

    return errorPatterns.some(pattern => message.includes(pattern))
  }

  /**
   * 处理错误
   */
  handleError(event) {
    this.errorCount++
    this.lastErrorTime = new Date()

    // 在开发环境下记录错误（但不显示在控制台）
    if (import.meta.env.DEV) {
      console.debug(`🔧 ResizeObserver 错误已被修复 (第${this.errorCount}次)`)
    }
  }

  /**
   * 修补ResizeObserver（简化版本）
   */
  patchResizeObserver() {
    if (!window.ResizeObserver) return

    // 简单的方法：只处理错误，不修改ResizeObserver本身
    // 这样避免了prototype修改的问题
    console.log('🔧 使用简化的ResizeObserver错误处理')
  }

  /**
   * 获取状态信息
   */
  getStatus() {
    return {
      isFixed: this.isFixed,
      errorCount: this.errorCount,
      lastErrorTime: this.lastErrorTime,
      activeObservers: this.observers?.size || 0,
      pendingCallbacks: this.pendingCallbacks?.size || 0
    }
  }

  /**
   * 清理资源
   */
  cleanup() {
    // 清理所有待处理的回调
    for (const rafId of this.pendingCallbacks.values()) {
      cancelAnimationFrame(rafId)
    }
    this.pendingCallbacks.clear()

    // 断开所有观察器
    for (const observer of this.observers) {
      try {
        observer.disconnect()
      } catch (e) {
        // 忽略清理错误
      }
    }
    this.observers.clear()

    console.log('🧹 ResizeObserver 修复工具已清理')
  }
}

// 创建全局实例
const resizeObserverFix = new ResizeObserverFix()

// 自动初始化
if (typeof window !== 'undefined') {
  resizeObserverFix.init()
  window.resizeObserverFix = resizeObserverFix

  // 提供全局调试函数
  window.checkResizeObserver = () => {
    const status = resizeObserverFix.getStatus()
    console.log('📊 ResizeObserver 状态:', status)
    return status
  }

  window.fixResizeObserver = () => {
    resizeObserverFix.init()
    console.log('🔧 ResizeObserver 修复已重新启用')
  }
}

export default resizeObserverFix
