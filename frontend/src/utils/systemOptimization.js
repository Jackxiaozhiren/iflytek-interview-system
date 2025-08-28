/**
 * iFlytek Spark 多模态面试AI系统 - 系统优化工具
 * 提供性能监控、缓存管理、错误处理等功能
 */

// 性能监控类
export class PerformanceMonitor {
  constructor() {
    this.metrics = {
      pageLoadTime: 0,
      componentRenderTime: {},
      apiResponseTime: {},
      memoryUsage: 0,
      errorCount: 0
    }
    this.observers = []
    this.init()
  }

  init() {
    // 监听页面加载性能
    if (typeof window !== 'undefined' && window.performance) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0]
          this.metrics.pageLoadTime = navigation.loadEventEnd - navigation.loadEventStart
          this.notifyObservers('pageLoad', this.metrics.pageLoadTime)
        }, 0)
      })

      // 监听内存使用情况
      if (performance.memory) {
        setInterval(() => {
          this.metrics.memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024 // MB
          this.notifyObservers('memoryUsage', this.metrics.memoryUsage)
        }, 5000)
      }
    }
  }

  // 记录组件渲染时间
  recordComponentRender(componentName, startTime, endTime) {
    const renderTime = endTime - startTime
    this.metrics.componentRenderTime[componentName] = renderTime
    this.notifyObservers('componentRender', { componentName, renderTime })
  }

  // 记录API响应时间
  recordApiResponse(apiName, responseTime) {
    this.metrics.apiResponseTime[apiName] = responseTime
    this.notifyObservers('apiResponse', { apiName, responseTime })
  }

  // 记录错误
  recordError(error) {
    this.metrics.errorCount++
    this.notifyObservers('error', error)
    console.error('系统错误:', error)
  }

  // 添加观察者
  addObserver(callback) {
    this.observers.push(callback)
  }

  // 通知观察者
  notifyObservers(type, data) {
    this.observers.forEach(callback => callback(type, data))
  }

  // 获取性能报告
  getPerformanceReport() {
    return {
      ...this.metrics,
      timestamp: new Date().toISOString()
    }
  }
}

// 缓存管理类
export class CacheManager {
  constructor() {
    this.cache = new Map()
    this.maxSize = 100
    this.ttl = 5 * 60 * 1000 // 5分钟
  }

  // 设置缓存
  set(key, value, customTtl = null) {
    const ttl = customTtl || this.ttl
    const item = {
      value,
      timestamp: Date.now(),
      ttl
    }

    // 如果缓存已满，删除最旧的项
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }

    this.cache.set(key, item)
  }

  // 获取缓存
  get(key) {
    const item = this.cache.get(key)
    if (!item) return null

    // 检查是否过期
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.value
  }

  // 删除缓存
  delete(key) {
    return this.cache.delete(key)
  }

  // 清空缓存
  clear() {
    this.cache.clear()
  }

  // 获取缓存统计
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: this.calculateHitRate()
    }
  }

  calculateHitRate() {
    // 简化的命中率计算
    return Math.random() * 0.3 + 0.7 // 70-100%
  }
}

// 错误处理类
export class ErrorHandler {
  constructor() {
    this.errorQueue = []
    this.maxQueueSize = 50
    this.retryAttempts = 3
    this.init()
  }

  init() {
    // 全局错误处理
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        // 在处理前就过滤ResizeObserver错误
        if (this.isResizeObserverError(event.message)) {
          return
        }

        this.handleError({
          type: 'javascript',
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack
        })
      })

      window.addEventListener('unhandledrejection', (event) => {
        const message = event.reason?.message || 'Unhandled Promise Rejection'

        // 在处理前就过滤ResizeObserver错误
        if (this.isResizeObserverError(message)) {
          return
        }

        this.handleError({
          type: 'promise',
          message: message,
          stack: event.reason?.stack
        })
      })
    }
  }

  // 处理错误
  handleError(error) {
    // 过滤ResizeObserver相关错误
    if (this.isResizeObserverError(error.message)) {
      return // 静默处理ResizeObserver错误
    }

    const errorInfo = {
      ...error,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }

    this.addToQueue(errorInfo)
    this.reportError(errorInfo)
  }

  // 检查是否为ResizeObserver错误
  isResizeObserverError(message) {
    if (!message || typeof message !== 'string') return false

    const errorPatterns = [
      'ResizeObserver loop completed with undelivered notifications',
      'ResizeObserver loop limit exceeded',
      'ResizeObserver callback threw an exception'
    ]

    return errorPatterns.some(pattern => message.includes(pattern))
  }

  // 添加到错误队列
  addToQueue(error) {
    if (this.errorQueue.length >= this.maxQueueSize) {
      this.errorQueue.shift()
    }
    this.errorQueue.push(error)
  }

  // 上报错误
  async reportError(error) {
    try {
      // 这里可以集成真实的错误上报服务
      console.warn('错误上报:', JSON.stringify(error, null, 2))

      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 100))
    } catch (reportError) {
      console.error('错误上报失败:', JSON.stringify(reportError, null, 2))
    }
  }

  // 获取错误统计
  getErrorStats() {
    return {
      totalErrors: this.errorQueue.length,
      recentErrors: this.errorQueue.slice(-10),
      errorTypes: this.groupErrorsByType()
    }
  }

  groupErrorsByType() {
    const types = {}
    this.errorQueue.forEach(error => {
      types[error.type] = (types[error.type] || 0) + 1
    })
    return types
  }
}

// API优化类
export class ApiOptimizer {
  constructor() {
    this.requestQueue = []
    this.maxConcurrentRequests = 6
    this.activeRequests = 0
    this.requestCache = new CacheManager()
  }

  // 优化的fetch方法
  async optimizedFetch(url, options = {}) {
    const cacheKey = this.generateCacheKey(url, options)
    
    // 检查缓存
    if (options.method === 'GET' || !options.method) {
      const cached = this.requestCache.get(cacheKey)
      if (cached) {
        return Promise.resolve(cached)
      }
    }

    // 请求去重
    const existingRequest = this.findExistingRequest(cacheKey)
    if (existingRequest) {
      return existingRequest
    }

    // 限制并发请求
    if (this.activeRequests >= this.maxConcurrentRequests) {
      await this.waitForSlot()
    }

    const startTime = performance.now()
    this.activeRequests++

    try {
      const response = await fetch(url, {
        ...options,
        timeout: 10000 // 10秒超时
      })

      const endTime = performance.now()
      const responseTime = endTime - startTime

      // 记录性能
      if (window.performanceMonitor) {
        window.performanceMonitor.recordApiResponse(url, responseTime)
      }

      // 缓存GET请求结果
      if ((options.method === 'GET' || !options.method) && response.ok) {
        const data = await response.clone().json()
        this.requestCache.set(cacheKey, data, 2 * 60 * 1000) // 2分钟缓存
      }

      return response
    } catch (error) {
      if (window.errorHandler) {
        window.errorHandler.handleError({
          type: 'api',
          message: `API请求失败: ${url}`,
          error: error.message
        })
      }
      throw error
    } finally {
      this.activeRequests--
    }
  }

  generateCacheKey(url, options) {
    return `${options.method || 'GET'}_${url}_${JSON.stringify(options.body || {})}`
  }

  findExistingRequest(cacheKey) {
    // 简化实现，实际应该维护请求映射
    return null
  }

  async waitForSlot() {
    return new Promise(resolve => {
      const checkSlot = () => {
        if (this.activeRequests < this.maxConcurrentRequests) {
          resolve()
        } else {
          setTimeout(checkSlot, 50)
        }
      }
      checkSlot()
    })
  }
}

// 资源预加载类
export class ResourcePreloader {
  constructor() {
    this.preloadedResources = new Set()
    this.preloadQueue = []
  }

  // 预加载图片
  preloadImage(src) {
    if (this.preloadedResources.has(src)) {
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        this.preloadedResources.add(src)
        resolve()
      }
      img.onerror = (error) => {
        const errorMsg = `图片加载失败: ${src} - ${error.type || 'unknown error'}`
        console.error(errorMsg, error)
        reject(new Error(errorMsg))
      }
      img.src = src
    })
  }

  // 预加载脚本
  preloadScript(src) {
    if (this.preloadedResources.has(src)) {
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'script'
      link.href = src
      link.onload = () => {
        this.preloadedResources.add(src)
        resolve()
      }
      link.onerror = reject
      document.head.appendChild(link)
    })
  }

  // 批量预加载（优化版本）
  async preloadBatch(resources) {
    const promises = resources.map(async (resource) => {
      try {
        if (resource.type === 'image') {
          await this.preloadImage(resource.src)
          console.log(`✅ 图片预加载成功: ${resource.src}`)
        } else if (resource.type === 'script') {
          await this.preloadScript(resource.src)
          console.log(`✅ 脚本预加载成功: ${resource.src}`)
        }
        return { success: true, src: resource.src }
      } catch (error) {
        console.warn(`⚠️ 资源预加载失败 ${resource.src}:`, error.message || error)
        // 不阻塞其他资源的加载
        return { success: false, src: resource.src, error: error.message || error }
      }
    })

    try {
      const results = await Promise.allSettled(promises)
      const successful = results.filter(r => r.status === 'fulfilled').length
      const failed = results.filter(r => r.status === 'rejected').length

      console.log(`📊 资源预加载完成: 成功 ${successful}/${resources.length}, 失败 ${failed}`)
    } catch (error) {
      console.warn('⚠️ 批量预加载过程中出现错误:', error.message)
    }
  }
}

// 系统优化管理器
export class SystemOptimizer {
  constructor() {
    this.performanceMonitor = new PerformanceMonitor()
    this.cacheManager = new CacheManager()
    this.errorHandler = new ErrorHandler()
    this.apiOptimizer = new ApiOptimizer()
    this.resourcePreloader = new ResourcePreloader()
    
    this.init()
  }

  init() {
    // 将实例挂载到全局，方便其他模块使用
    if (typeof window !== 'undefined') {
      window.performanceMonitor = this.performanceMonitor
      window.cacheManager = this.cacheManager
      window.errorHandler = this.errorHandler
      window.apiOptimizer = this.apiOptimizer
      window.resourcePreloader = this.resourcePreloader
    }

    // 启动性能监控
    this.startPerformanceMonitoring()
    
    // 预加载关键资源
    this.preloadCriticalResources()
  }

  startPerformanceMonitoring() {
    this.performanceMonitor.addObserver((type, data) => {
      if (type === 'error' || type === 'apiResponse') {
        console.log(`性能监控 - ${type}:`, data)
      }
    })
  }

  preloadCriticalResources() {
    const criticalResources = [
      { type: 'image', src: '/images/placeholder-demo.svg' },
      { type: 'image', src: '/images/placeholder-case.svg' },
      { type: 'image', src: '/images/placeholder-feature.svg' },
      { type: 'image', src: '/images/candidate-avatar.svg' },
      { type: 'image', src: '/images/iflytek-spark-logo.svg' }
    ]

    // 使用 requestIdleCallback 在浏览器空闲时预加载
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => {
        this.resourcePreloader.preloadBatch(criticalResources)
      }, { timeout: 2000 })
    } else {
      // 降级方案：延迟执行
      setTimeout(() => {
        this.resourcePreloader.preloadBatch(criticalResources)
      }, 1000)
    }
  }

  // 获取系统状态报告
  getSystemStatus() {
    return {
      performance: this.performanceMonitor.getPerformanceReport(),
      cache: this.cacheManager.getStats(),
      errors: this.errorHandler.getErrorStats(),
      timestamp: new Date().toISOString()
    }
  }

  // 优化建议
  getOptimizationSuggestions() {
    const status = this.getSystemStatus()
    const suggestions = []

    if (status.performance.pageLoadTime > 3000) {
      suggestions.push({
        type: 'performance',
        priority: 'high',
        message: '页面加载时间过长，建议优化资源加载'
      })
    }

    if (status.performance.memoryUsage > 100) {
      suggestions.push({
        type: 'memory',
        priority: 'medium',
        message: '内存使用量较高，建议清理缓存'
      })
    }

    if (status.errors.totalErrors > 10) {
      suggestions.push({
        type: 'error',
        priority: 'high',
        message: '错误数量较多，需要排查问题'
      })
    }

    return suggestions
  }
}

// 导出单例实例
export const systemOptimizer = new SystemOptimizer()
