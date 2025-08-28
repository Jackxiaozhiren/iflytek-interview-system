/**
 * 前端性能优化服务
 * 提供前端性能监控、优化建议、资源管理等功能
 */

class FrontendPerformanceService {
  constructor() {
    this.performanceMetrics = {
      pageLoadTime: 0,
      domContentLoaded: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      firstInputDelay: 0,
      cumulativeLayoutShift: 0,
      resourceLoadTimes: {},
      memoryUsage: {},
      networkInfo: {}
    }
    
    this.resourceCache = new Map()
    this.performanceObserver = null
    this.memoryMonitor = null
    this.networkMonitor = null
    
    this.initializePerformanceMonitoring()
  }

  /**
   * 初始化性能监控
   */
  initializePerformanceMonitoring() {
    // 监控页面加载性能
    this.monitorPageLoad()
    
    // 监控Core Web Vitals
    this.monitorCoreWebVitals()
    
    // 监控资源加载
    this.monitorResourceLoading()
    
    // 监控内存使用
    this.monitorMemoryUsage()
    
    // 监控网络状态
    this.monitorNetworkStatus()
  }

  /**
   * 监控页面加载性能
   */
  monitorPageLoad() {
    if (typeof window !== 'undefined' && window.performance) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0]
          if (navigation) {
            this.performanceMetrics.pageLoadTime = navigation.loadEventEnd - navigation.fetchStart
            this.performanceMetrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart
          }
        }, 0)
      })
    }
  }

  /**
   * 监控Core Web Vitals
   */
  monitorCoreWebVitals() {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // First Contentful Paint (FCP)
      const fcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.performanceMetrics.firstContentfulPaint = entry.startTime
          }
        }
      })
      fcpObserver.observe({ entryTypes: ['paint'] })

      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        this.performanceMetrics.largestContentfulPaint = lastEntry.startTime
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.performanceMetrics.firstInputDelay = entry.processingStart - entry.startTime
        }
      })
      fidObserver.observe({ entryTypes: ['first-input'] })

      // Cumulative Layout Shift (CLS)
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        }
        this.performanceMetrics.cumulativeLayoutShift = clsValue
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })
    }
  }

  /**
   * 监控资源加载
   */
  monitorResourceLoading() {
    if (typeof window !== 'undefined' && window.performance) {
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.performanceMetrics.resourceLoadTimes[entry.name] = {
            duration: entry.duration,
            size: entry.transferSize || 0,
            type: this.getResourceType(entry.name),
            startTime: entry.startTime
          }
        }
      })
      resourceObserver.observe({ entryTypes: ['resource'] })
    }
  }

  /**
   * 监控内存使用
   */
  monitorMemoryUsage() {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const updateMemoryInfo = () => {
        this.performanceMetrics.memoryUsage = {
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
          jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
          timestamp: Date.now()
        }
      }
      
      updateMemoryInfo()
      this.memoryMonitor = setInterval(updateMemoryInfo, 30000) // 每30秒更新一次
    }
  }

  /**
   * 监控网络状态
   */
  monitorNetworkStatus() {
    if (typeof window !== 'undefined' && 'connection' in navigator) {
      const updateNetworkInfo = () => {
        const connection = navigator.connection
        this.performanceMetrics.networkInfo = {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData,
          timestamp: Date.now()
        }
      }
      
      updateNetworkInfo()
      navigator.connection.addEventListener('change', updateNetworkInfo)
    }
  }

  /**
   * 获取资源类型
   */
  getResourceType(url) {
    const extension = url.split('.').pop().toLowerCase()
    const typeMap = {
      'js': 'script',
      'css': 'stylesheet',
      'png': 'image',
      'jpg': 'image',
      'jpeg': 'image',
      'gif': 'image',
      'svg': 'image',
      'webp': 'image',
      'woff': 'font',
      'woff2': 'font',
      'ttf': 'font',
      'mp4': 'video',
      'webm': 'video',
      'mp3': 'audio',
      'wav': 'audio'
    }
    return typeMap[extension] || 'other'
  }

  /**
   * 获取性能报告
   */
  getPerformanceReport() {
    const report = {
      metrics: { ...this.performanceMetrics },
      scores: this.calculatePerformanceScores(),
      recommendations: this.generateOptimizationRecommendations(),
      resourceAnalysis: this.analyzeResourcePerformance(),
      timestamp: new Date().toISOString()
    }
    
    return report
  }

  /**
   * 计算性能评分
   */
  calculatePerformanceScores() {
    const scores = {}
    
    // FCP评分 (0-100)
    const fcp = this.performanceMetrics.firstContentfulPaint
    if (fcp <= 1800) scores.fcp = 100
    else if (fcp <= 3000) scores.fcp = 100 - ((fcp - 1800) / 1200) * 50
    else scores.fcp = 50 - Math.min(((fcp - 3000) / 3000) * 50, 50)
    
    // LCP评分 (0-100)
    const lcp = this.performanceMetrics.largestContentfulPaint
    if (lcp <= 2500) scores.lcp = 100
    else if (lcp <= 4000) scores.lcp = 100 - ((lcp - 2500) / 1500) * 50
    else scores.lcp = 50 - Math.min(((lcp - 4000) / 4000) * 50, 50)
    
    // FID评分 (0-100)
    const fid = this.performanceMetrics.firstInputDelay
    if (fid <= 100) scores.fid = 100
    else if (fid <= 300) scores.fid = 100 - ((fid - 100) / 200) * 50
    else scores.fid = 50 - Math.min(((fid - 300) / 300) * 50, 50)
    
    // CLS评分 (0-100)
    const cls = this.performanceMetrics.cumulativeLayoutShift
    if (cls <= 0.1) scores.cls = 100
    else if (cls <= 0.25) scores.cls = 100 - ((cls - 0.1) / 0.15) * 50
    else scores.cls = 50 - Math.min(((cls - 0.25) / 0.25) * 50, 50)
    
    // 总体评分
    scores.overall = Math.round((scores.fcp + scores.lcp + scores.fid + scores.cls) / 4)
    
    return scores
  }

  /**
   * 生成优化建议
   */
  generateOptimizationRecommendations() {
    const recommendations = []
    const scores = this.calculatePerformanceScores()
    
    // FCP优化建议
    if (scores.fcp < 70) {
      recommendations.push({
        category: 'loading',
        priority: 'high',
        title: '优化首次内容绘制时间',
        description: 'FCP时间过长，影响用户体验',
        actions: [
          '优化关键渲染路径',
          '减少阻塞渲染的资源',
          '使用资源预加载',
          '优化服务器响应时间'
        ]
      })
    }
    
    // LCP优化建议
    if (scores.lcp < 70) {
      recommendations.push({
        category: 'loading',
        priority: 'high',
        title: '优化最大内容绘制时间',
        description: 'LCP时间过长，需要优化主要内容加载',
        actions: [
          '优化图片加载',
          '使用CDN加速',
          '预加载关键资源',
          '优化字体加载'
        ]
      })
    }
    
    // FID优化建议
    if (scores.fid < 70) {
      recommendations.push({
        category: 'interactivity',
        priority: 'medium',
        title: '优化首次输入延迟',
        description: 'FID时间过长，影响交互响应',
        actions: [
          '减少JavaScript执行时间',
          '使用Web Workers',
          '代码分割和懒加载',
          '优化第三方脚本'
        ]
      })
    }
    
    // CLS优化建议
    if (scores.cls < 70) {
      recommendations.push({
        category: 'stability',
        priority: 'medium',
        title: '减少累积布局偏移',
        description: 'CLS值过高，页面布局不稳定',
        actions: [
          '为图片和视频设置尺寸',
          '避免在现有内容上方插入内容',
          '使用transform动画',
          '预留广告位空间'
        ]
      })
    }
    
    // 资源优化建议
    const resourceAnalysis = this.analyzeResourcePerformance()
    if (resourceAnalysis.slowResources.length > 0) {
      recommendations.push({
        category: 'resources',
        priority: 'medium',
        title: '优化资源加载',
        description: `发现${resourceAnalysis.slowResources.length}个加载缓慢的资源`,
        actions: [
          '压缩图片和资源',
          '使用现代图片格式',
          '启用资源缓存',
          '使用资源预加载'
        ]
      })
    }
    
    // 内存优化建议
    if (this.performanceMetrics.memoryUsage.usedJSHeapSize > 50 * 1024 * 1024) {
      recommendations.push({
        category: 'memory',
        priority: 'low',
        title: '优化内存使用',
        description: 'JavaScript内存使用较高',
        actions: [
          '清理未使用的变量',
          '避免内存泄漏',
          '使用对象池',
          '及时清理事件监听器'
        ]
      })
    }
    
    return recommendations
  }

  /**
   * 分析资源性能
   */
  analyzeResourcePerformance() {
    const resources = this.performanceMetrics.resourceLoadTimes
    const slowResources = []
    const largeResources = []
    const resourcesByType = {}
    
    Object.entries(resources).forEach(([url, data]) => {
      // 分类统计
      if (!resourcesByType[data.type]) {
        resourcesByType[data.type] = { count: 0, totalSize: 0, totalTime: 0 }
      }
      resourcesByType[data.type].count++
      resourcesByType[data.type].totalSize += data.size
      resourcesByType[data.type].totalTime += data.duration
      
      // 慢资源检测 (>2秒)
      if (data.duration > 2000) {
        slowResources.push({ url, ...data })
      }
      
      // 大资源检测 (>1MB)
      if (data.size > 1024 * 1024) {
        largeResources.push({ url, ...data })
      }
    })
    
    return {
      totalResources: Object.keys(resources).length,
      slowResources,
      largeResources,
      resourcesByType,
      averageLoadTime: Object.values(resources).reduce((sum, r) => sum + r.duration, 0) / Object.keys(resources).length || 0
    }
  }

  /**
   * 优化图片加载
   */
  optimizeImageLoading() {
    // 实现图片懒加载
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target
            if (img.dataset.src) {
              img.src = img.dataset.src
              img.removeAttribute('data-src')
              imageObserver.unobserve(img)
            }
          }
        })
      })
      
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img)
      })
    }
  }

  /**
   * 预加载关键资源
   */
  preloadCriticalResources(resources) {
    resources.forEach(resource => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = resource.url
      link.as = resource.type
      if (resource.type === 'font') {
        link.crossOrigin = 'anonymous'
      }
      document.head.appendChild(link)
    })
  }

  /**
   * 启用资源缓存
   */
  enableResourceCaching() {
    // 实现Service Worker缓存策略
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker注册成功:', registration)
        })
        .catch(error => {
          console.log('Service Worker注册失败:', error)
        })
    }
  }

  /**
   * 清理性能监控
   */
  cleanup() {
    if (this.performanceObserver) {
      this.performanceObserver.disconnect()
    }
    if (this.memoryMonitor) {
      clearInterval(this.memoryMonitor)
    }
    this.resourceCache.clear()
  }

  /**
   * 获取实时性能数据
   */
  getRealTimeMetrics() {
    return {
      memory: this.performanceMetrics.memoryUsage,
      network: this.performanceMetrics.networkInfo,
      timestamp: Date.now()
    }
  }
}

// 创建全局实例
const frontendPerformanceService = new FrontendPerformanceService()

export default frontendPerformanceService
