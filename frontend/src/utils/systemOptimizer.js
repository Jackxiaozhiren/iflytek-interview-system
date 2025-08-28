/**
 * iFlytek Spark面试AI系统 - 系统优化器
 * 提供系统性能优化建议和自动修复功能
 */

export class SystemOptimizer {
  constructor() {
    this.optimizations = []
    this.autoFixEnabled = true
  }

  /**
   * 分析系统状态并提供优化建议
   */
  analyzeSystem() {
    const analysis = {
      timestamp: new Date().toISOString(),
      issues: [],
      suggestions: [],
      autoFixes: []
    }

    // 检查视频加载问题
    this.checkVideoLoading(analysis)
    
    // 检查图片懒加载
    this.checkImageLoading(analysis)
    
    // 检查字体加载
    this.checkFontLoading(analysis)
    
    // 检查组件性能
    this.checkComponentPerformance(analysis)
    
    // 检查中文本地化
    this.checkChineseLocalization(analysis)

    return analysis
  }

  /**
   * 检查视频加载问题
   */
  checkVideoLoading(analysis) {
    const videoElements = document.querySelectorAll('video')
    let hasVideoIssues = false

    videoElements.forEach(video => {
      if (video.error || video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
        hasVideoIssues = true
      }
    })

    if (hasVideoIssues) {
      analysis.issues.push({
        type: 'video',
        severity: 'warning',
        message: '部分视频文件加载失败',
        description: '检测到视频加载错误，可能影响演示效果'
      })

      analysis.suggestions.push({
        type: 'video',
        title: '视频加载优化',
        description: '建议使用界面截图作为备选方案',
        actions: [
          '检查视频文件是否存在',
          '验证视频格式兼容性',
          '启用自动回退到界面截图',
          '优化视频文件大小'
        ]
      })

      analysis.autoFixes.push({
        type: 'video',
        name: '启用视频回退机制',
        action: () => this.enableVideoFallback()
      })
    }
  }

  /**
   * 检查图片懒加载
   */
  checkImageLoading(analysis) {
    const images = document.querySelectorAll('img[loading="lazy"]')
    
    if (images.length > 0) {
      analysis.suggestions.push({
        type: 'image',
        title: '图片加载优化',
        description: '检测到懒加载图片，建议优化加载策略',
        actions: [
          '为重要图片添加预加载',
          '使用适当的占位符',
          '优化图片格式和大小',
          '实现渐进式加载'
        ]
      })

      analysis.autoFixes.push({
        type: 'image',
        name: '优化图片加载',
        action: () => this.optimizeImageLoading()
      })
    }
  }

  /**
   * 检查字体加载
   */
  checkFontLoading(analysis) {
    const fontFaces = document.fonts
    let loadedFonts = 0
    let totalFonts = 0

    fontFaces.forEach(font => {
      totalFonts++
      if (font.status === 'loaded') {
        loadedFonts++
      }
    })

    const fontLoadingRate = totalFonts > 0 ? (loadedFonts / totalFonts) * 100 : 100

    if (fontLoadingRate < 100) {
      analysis.issues.push({
        type: 'font',
        severity: 'info',
        message: `字体加载进度: ${fontLoadingRate.toFixed(1)}%`,
        description: '部分字体仍在加载中'
      })
    } else {
      analysis.suggestions.push({
        type: 'font',
        title: '字体加载完成',
        description: '所有中文字体已成功加载',
        actions: ['字体加载状态良好']
      })
    }
  }

  /**
   * 检查组件性能
   */
  checkComponentPerformance(analysis) {
    const components = document.querySelectorAll('[data-v-]')
    const componentCount = components.length

    if (componentCount > 100) {
      analysis.suggestions.push({
        type: 'performance',
        title: '组件性能优化',
        description: `检测到 ${componentCount} 个组件，建议优化渲染性能`,
        actions: [
          '启用组件懒加载',
          '使用虚拟滚动',
          '优化组件更新策略',
          '减少不必要的重渲染'
        ]
      })
    }
  }

  /**
   * 检查中文本地化
   */
  checkChineseLocalization(analysis) {
    const textNodes = this.getTextNodes()
    let chineseCount = 0
    let englishCount = 0

    textNodes.forEach(node => {
      const text = node.textContent.trim()
      if (text) {
        if (/[\u4e00-\u9fff]/.test(text)) {
          chineseCount++
        } else if (/[a-zA-Z]/.test(text)) {
          englishCount++
        }
      }
    })

    const chineseRatio = chineseCount / (chineseCount + englishCount) * 100

    if (chineseRatio < 90) {
      analysis.suggestions.push({
        type: 'localization',
        title: '中文本地化优化',
        description: `中文内容占比: ${chineseRatio.toFixed(1)}%，建议提高中文化程度`,
        actions: [
          '翻译剩余英文内容',
          '检查组件标签和提示',
          '优化中文字体显示',
          '验证日期时间格式'
        ]
      })
    }
  }

  /**
   * 获取所有文本节点
   */
  getTextNodes() {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    )

    const textNodes = []
    let node

    while (node = walker.nextNode()) {
      if (node.textContent.trim()) {
        textNodes.push(node)
      }
    }

    return textNodes
  }

  /**
   * 启用视频回退机制
   */
  enableVideoFallback() {
    const videos = document.querySelectorAll('video')
    
    videos.forEach(video => {
      if (video.error) {
        const container = video.parentElement
        const fallbackImage = container.querySelector('.interface-showcase img')
        
        if (fallbackImage) {
          video.style.display = 'none'
          fallbackImage.style.display = 'block'
          fallbackImage.style.opacity = '1'
          
          // 添加提示信息
          const notice = document.createElement('div')
          notice.className = 'video-fallback-notice'
          notice.innerHTML = `
            <div style="
              position: absolute;
              top: 10px;
              left: 10px;
              background: rgba(0,0,0,0.7);
              color: white;
              padding: 5px 10px;
              border-radius: 4px;
              font-size: 12px;
            ">
              📸 界面截图模式
            </div>
          `
          container.style.position = 'relative'
          container.appendChild(notice)
        }
      }
    })

    console.log('✅ 视频回退机制已启用')
    return true
  }

  /**
   * 优化图片加载
   */
  optimizeImageLoading() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]')
    
    lazyImages.forEach(img => {
      // 为重要图片添加预加载
      if (img.closest('.hero-section, .feature-card')) {
        img.loading = 'eager'
      }
      
      // 添加加载状态
      img.addEventListener('load', () => {
        img.style.opacity = '1'
        img.style.transition = 'opacity 0.3s ease'
      })
      
      img.addEventListener('error', () => {
        // 使用默认占位符
        img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjEwMCIgeT0iNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTkiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCI+5Zu+5YOP5Yqg6L295Lit</text></svg>'
      })
    })

    console.log('✅ 图片加载优化已应用')
    return true
  }

  /**
   * 执行自动修复
   */
  async executeAutoFixes(fixes) {
    const results = []
    
    for (const fix of fixes) {
      try {
        const result = await fix.action()
        results.push({
          name: fix.name,
          success: result,
          message: result ? '修复成功' : '修复失败'
        })
      } catch (error) {
        results.push({
          name: fix.name,
          success: false,
          message: `修复失败: ${error.message}`
        })
      }
    }
    
    return results
  }

  /**
   * 生成优化报告
   */
  generateOptimizationReport() {
    const analysis = this.analyzeSystem()
    
    const report = {
      timestamp: analysis.timestamp,
      summary: {
        totalIssues: analysis.issues.length,
        totalSuggestions: analysis.suggestions.length,
        autoFixesAvailable: analysis.autoFixes.length
      },
      details: analysis,
      recommendations: this.generateRecommendations(analysis)
    }
    
    return report
  }

  /**
   * 生成优化建议
   */
  generateRecommendations(analysis) {
    const recommendations = []
    
    if (analysis.issues.length === 0) {
      recommendations.push({
        priority: 'low',
        title: '系统运行良好',
        description: '当前系统状态良好，建议定期进行性能检查'
      })
    } else {
      const criticalIssues = analysis.issues.filter(issue => issue.severity === 'error')
      const warningIssues = analysis.issues.filter(issue => issue.severity === 'warning')
      
      if (criticalIssues.length > 0) {
        recommendations.push({
          priority: 'high',
          title: '立即处理关键问题',
          description: `发现 ${criticalIssues.length} 个关键问题需要立即处理`
        })
      }
      
      if (warningIssues.length > 0) {
        recommendations.push({
          priority: 'medium',
          title: '优化系统性能',
          description: `发现 ${warningIssues.length} 个性能优化点`
        })
      }
    }
    
    return recommendations
  }
}

// 创建全局实例
export const systemOptimizer = new SystemOptimizer()

// 自动启动系统监控
if (typeof window !== 'undefined') {
  window.systemOptimizer = systemOptimizer
  
  // 页面加载完成后自动分析
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        const report = systemOptimizer.generateOptimizationReport()
        console.log('🔧 系统优化报告:', report)
      }, 2000)
    })
  }
}
