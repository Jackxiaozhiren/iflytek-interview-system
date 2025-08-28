/**
 * 中文本地化检查工具
 * 确保所有前端组件的中文界面显示正确
 */

class ChineseLocalizationChecker {
  constructor() {
    this.issues = []
    this.checkedComponents = new Set()
    this.fontLoadStatus = {
      'Microsoft YaHei': false,
      'SimHei': false,
      'PingFang SC': false
    }
  }

  /**
   * 检查页面中文本地化状态
   */
  async checkPageLocalization() {
    console.log('🔍 开始检查中文本地化状态...')
    
    // 1. 检查字体加载状态
    await this.checkFontLoading()
    
    // 2. 检查Element Plus组件中文配置
    this.checkElementPlusLocalization()
    
    // 3. 检查页面文本内容
    this.checkPageTextContent()
    
    // 4. 检查动画效果
    this.checkAnimationEffects()
    
    // 5. 生成检查报告
    return this.generateReport()
  }

  /**
   * 检查字体加载状态
   */
  async checkFontLoading() {
    // 根据操作系统选择合适的字体进行检查
    const isWindows = navigator.platform.indexOf('Win') > -1
    const isMac = navigator.platform.indexOf('Mac') > -1

    let fonts = []
    if (isWindows) {
      fonts = ['Microsoft YaHei', 'SimHei']
    } else if (isMac) {
      fonts = ['PingFang SC', 'Hiragino Sans GB']
    } else {
      fonts = ['Microsoft YaHei', 'SimHei'] // Linux等其他系统
    }

    for (const font of fonts) {
      try {
        const fontFace = new FontFace(font, `local("${font}")`)
        await fontFace.load()
        this.fontLoadStatus[font] = true
        console.log(`✅ 字体 ${font} 加载成功`)
      } catch (error) {
        this.fontLoadStatus[font] = false

        // 只对当前系统应该有的字体报告错误
        const shouldHaveFont = (isWindows && ['Microsoft YaHei', 'SimHei'].includes(font)) ||
                              (isMac && ['PingFang SC', 'Hiragino Sans GB'].includes(font))

        if (shouldHaveFont) {
          this.issues.push({
            type: 'font',
            severity: 'warning',
            message: `字体 ${font} 加载失败`,
            suggestion: `请检查系统是否安装了 ${font} 字体`
          })
          console.warn(`⚠️ 字体 ${font} 加载失败:`, error)
        }
      }
    }
  }

  /**
   * 检查Element Plus组件中文配置
   */
  checkElementPlusLocalization() {
    // 检查Element Plus是否正确配置中文
    const elConfigProvider = document.querySelector('.el-config-provider')
    if (!elConfigProvider) {
      this.issues.push({
        type: 'element-plus',
        severity: 'error',
        message: 'Element Plus中文配置缺失',
        suggestion: '请在main.js中正确配置Element Plus中文语言包'
      })
    }

    // 检查常见Element Plus组件的中文显示
    this.checkElementPlusComponents()
  }

  /**
   * 检查Element Plus组件
   */
  checkElementPlusComponents() {
    const components = [
      { selector: '.el-button', name: '按钮' },
      { selector: '.el-input', name: '输入框' },
      { selector: '.el-select', name: '选择器' },
      { selector: '.el-date-picker', name: '日期选择器' },
      { selector: '.el-table', name: '表格' },
      { selector: '.el-pagination', name: '分页' },
      { selector: '.el-dialog', name: '对话框' },
      { selector: '.el-message', name: '消息提示' }
    ]

    components.forEach(({ selector, name }) => {
      const elements = document.querySelectorAll(selector)
      if (elements.length > 0) {
        this.checkedComponents.add(name)
        console.log(`✅ 检查到 ${name} 组件: ${elements.length} 个`)
      }
    })
  }

  /**
   * 检查页面文本内容
   */
  checkPageTextContent() {
    const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, button, label')
    let chineseTextCount = 0
    let englishTextCount = 0

    textElements.forEach(element => {
      const text = element.textContent.trim()
      if (text) {
        // 检查是否包含中文
        if (/[\u4e00-\u9fff]/.test(text)) {
          chineseTextCount++
          // 检查中文字体渲染
          this.checkChineseFontRendering(element)
        } else if (/[a-zA-Z]/.test(text)) {
          englishTextCount++
        }
      }
    })

    console.log(`📊 文本统计: 中文文本 ${chineseTextCount} 个, 英文文本 ${englishTextCount} 个`)

    // 如果中文文本比例过低，给出警告
    const chineseRatio = chineseTextCount / (chineseTextCount + englishTextCount)
    if (chineseRatio < 0.7) {
      this.issues.push({
        type: 'localization',
        severity: 'warning',
        message: `中文文本比例较低 (${Math.round(chineseRatio * 100)}%)`,
        suggestion: '建议增加更多中文界面文本，提升用户体验'
      })
    }
  }

  /**
   * 检查中文字体渲染
   */
  checkChineseFontRendering(element) {
    const computedStyle = window.getComputedStyle(element)
    const fontFamily = computedStyle.fontFamily

    // 检查是否使用了合适的中文字体
    const chineseFonts = ['Microsoft YaHei', 'SimHei', 'PingFang SC', 'Hiragino Sans GB']
    const hasChineseFont = chineseFonts.some(font => fontFamily.includes(font))

    if (!hasChineseFont) {
      this.issues.push({
        type: 'font-rendering',
        severity: 'warning',
        message: `元素未使用中文字体: ${element.tagName}`,
        suggestion: '建议为中文文本指定合适的中文字体',
        element: element
      })
    }
  }

  /**
   * 检查动画效果
   */
  checkAnimationEffects() {
    const animatedElements = document.querySelectorAll('.chinese-text-fade-in, .chinese-title-animation, .enhanced-card-hover')
    
    if (animatedElements.length === 0) {
      this.issues.push({
        type: 'animation',
        severity: 'info',
        message: '未检测到中文专用动画效果',
        suggestion: '建议为中文界面添加专用的动画效果类'
      })
    } else {
      console.log(`✨ 检测到 ${animatedElements.length} 个中文动画元素`)
    }
  }

  /**
   * 生成检查报告
   */
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalIssues: this.issues.length,
        errorCount: this.issues.filter(i => i.severity === 'error').length,
        warningCount: this.issues.filter(i => i.severity === 'warning').length,
        infoCount: this.issues.filter(i => i.severity === 'info').length
      },
      fontStatus: this.fontLoadStatus,
      checkedComponents: Array.from(this.checkedComponents),
      issues: this.issues,
      recommendations: this.generateRecommendations()
    }

    console.log('📋 中文本地化检查报告:', report)
    return report
  }

  /**
   * 生成改进建议
   */
  generateRecommendations() {
    const recommendations = []

    // 字体相关建议
    const failedFonts = Object.entries(this.fontLoadStatus)
      .filter(([font, loaded]) => !loaded)
      .map(([font]) => font)

    if (failedFonts.length > 0) {
      recommendations.push({
        category: '字体优化',
        priority: 'high',
        action: `安装或配置字体: ${failedFonts.join(', ')}`,
        impact: '提升中文文本显示效果'
      })
    }

    // 组件本地化建议
    if (this.checkedComponents.size < 5) {
      recommendations.push({
        category: '组件本地化',
        priority: 'medium',
        action: '增加更多Element Plus组件的中文配置',
        impact: '提升整体界面的中文化程度'
      })
    }

    // 动画效果建议
    const hasAnimationIssues = this.issues.some(i => i.type === 'animation')
    if (hasAnimationIssues) {
      recommendations.push({
        category: '动画效果',
        priority: 'low',
        action: '为中文界面添加专用动画效果',
        impact: '提升用户交互体验'
      })
    }

    return recommendations
  }

  /**
   * 修复常见问题
   */
  async autoFix() {
    console.log('🔧 开始自动修复中文本地化问题...')
    
    // 1. 应用中文字体到未配置的元素
    this.applyChineseFonts()
    
    // 2. 添加中文动画类
    this.addChineseAnimations()
    
    console.log('✅ 自动修复完成')
  }

  /**
   * 应用中文字体
   */
  applyChineseFonts() {
    const elements = document.querySelectorAll('*')
    elements.forEach(element => {
      const text = element.textContent
      if (text && /[\u4e00-\u9fff]/.test(text)) {
        const computedStyle = window.getComputedStyle(element)
        const fontFamily = computedStyle.fontFamily
        
        if (!fontFamily.includes('Microsoft YaHei') && !fontFamily.includes('SimHei')) {
          element.style.fontFamily = "'Microsoft YaHei', 'SimHei', sans-serif"
        }
      }
    })
  }

  /**
   * 添加中文动画
   */
  addChineseAnimations() {
    // 为标题添加动画
    const titles = document.querySelectorAll('h1, h2, h3')
    titles.forEach(title => {
      if (/[\u4e00-\u9fff]/.test(title.textContent)) {
        title.classList.add('chinese-title-animation')
      }
    })

    // 为文本添加动画
    const texts = document.querySelectorAll('p, span')
    texts.forEach(text => {
      if (/[\u4e00-\u9fff]/.test(text.textContent)) {
        text.classList.add('chinese-text-fade-in')
      }
    })
  }
}

// 创建全局实例
const chineseLocalizationChecker = new ChineseLocalizationChecker()

// 自动检查（在开发环境）
if (import.meta.env.DEV) {
  // 页面加载完成后自动检查
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        chineseLocalizationChecker.checkPageLocalization()
      }, 1000)
    })
  } else {
    setTimeout(() => {
      chineseLocalizationChecker.checkPageLocalization()
    }, 1000)
  }
}

export default chineseLocalizationChecker
