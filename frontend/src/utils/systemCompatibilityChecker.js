/**
 * 系统兼容性检查工具
 * 验证新组件与现有系统的兼容性、iFlytek品牌风格一致性、中文本地化完整性
 */

import { ElMessage, ElNotification } from 'element-plus'

class SystemCompatibilityChecker {
  constructor() {
    this.checkResults = {
      brandConsistency: { status: 'pending', issues: [] },
      chineseLocalization: { status: 'pending', issues: [] },
      componentCompatibility: { status: 'pending', issues: [] },
      responsiveDesign: { status: 'pending', issues: [] },
      accessibility: { status: 'pending', issues: [] }
    }
  }

  /**
   * 🔍 运行完整的兼容性检查
   */
  async runFullCompatibilityCheck() {
    console.log('🔍 开始运行系统兼容性检查...')
    
    try {
      // 1. 检查iFlytek品牌风格一致性
      await this.checkBrandConsistency()
      
      // 2. 检查中文本地化完整性
      await this.checkChineseLocalization()
      
      // 3. 检查组件兼容性
      await this.checkComponentCompatibility()
      
      // 4. 检查响应式设计
      await this.checkResponsiveDesign()
      
      // 5. 检查可访问性
      await this.checkAccessibility()
      
      return this.generateCompatibilityReport()
      
    } catch (error) {
      console.error('❌ 兼容性检查失败:', error)
      throw error
    }
  }

  /**
   * 🎨 检查iFlytek品牌风格一致性
   */
  async checkBrandConsistency() {
    console.log('🎨 检查iFlytek品牌风格一致性...')
    
    const issues = []
    
    // 检查主要品牌色彩
    const brandColors = ['#667eea', '#764ba2', '#1890ff', '#52c41a']
    const elements = document.querySelectorAll('*')
    
    let colorUsageFound = false
    elements.forEach(el => {
      const computedStyle = window.getComputedStyle(el)
      const bgColor = computedStyle.backgroundColor
      const color = computedStyle.color
      const borderColor = computedStyle.borderColor
      
      brandColors.forEach(brandColor => {
        if (bgColor.includes(brandColor) || color.includes(brandColor) || borderColor.includes(brandColor)) {
          colorUsageFound = true
        }
      })
    })
    
    if (!colorUsageFound) {
      issues.push('未发现iFlytek品牌色彩的使用')
    }
    
    // 检查字体使用
    const chineseFonts = ['Microsoft YaHei', 'SimHei', 'PingFang SC']
    const bodyFont = window.getComputedStyle(document.body).fontFamily
    
    let chineseFontFound = false
    chineseFonts.forEach(font => {
      if (bodyFont.includes(font)) {
        chineseFontFound = true
      }
    })
    
    if (!chineseFontFound) {
      issues.push('未使用推荐的中文字体')
    }
    
    // 检查iFlytek标识
    const iflytekElements = document.querySelectorAll('[class*="iflytek"], [id*="iflytek"]')
    if (iflytekElements.length === 0) {
      issues.push('页面中缺少iFlytek品牌标识')
    }
    
    this.checkResults.brandConsistency = {
      status: issues.length === 0 ? 'passed' : 'warning',
      issues
    }
  }

  /**
   * 🇨🇳 检查中文本地化完整性
   */
  async checkChineseLocalization() {
    console.log('🇨🇳 检查中文本地化完整性...')
    
    const issues = []
    
    // 检查页面标题
    const title = document.title
    if (!this.containsChinese(title)) {
      issues.push('页面标题未使用中文')
    }
    
    // 检查主要文本内容
    const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, button, label')
    let chineseTextCount = 0
    let totalTextCount = 0
    
    textElements.forEach(el => {
      const text = el.textContent.trim()
      if (text.length > 0) {
        totalTextCount++
        if (this.containsChinese(text)) {
          chineseTextCount++
        }
      }
    })
    
    const chineseRatio = totalTextCount > 0 ? (chineseTextCount / totalTextCount) * 100 : 0
    if (chineseRatio < 70) {
      issues.push(`中文内容比例偏低: ${chineseRatio.toFixed(1)}%`)
    }
    
    // 检查表单标签
    const labels = document.querySelectorAll('label')
    labels.forEach(label => {
      const text = label.textContent.trim()
      if (text.length > 0 && !this.containsChinese(text)) {
        issues.push(`表单标签未中文化: "${text}"`)
      }
    })
    
    // 检查按钮文本
    const buttons = document.querySelectorAll('button')
    buttons.forEach(button => {
      const text = button.textContent.trim()
      if (text.length > 0 && !this.containsChinese(text) && !this.isIconOnly(text)) {
        issues.push(`按钮文本未中文化: "${text}"`)
      }
    })
    
    this.checkResults.chineseLocalization = {
      status: issues.length === 0 ? 'passed' : 'warning',
      issues,
      chineseRatio: chineseRatio.toFixed(1)
    }
  }

  /**
   * 🧩 检查组件兼容性
   */
  async checkComponentCompatibility() {
    console.log('🧩 检查组件兼容性...')
    
    const issues = []
    
    // 检查Vue组件
    const vueElements = document.querySelectorAll('[data-v-]')
    if (vueElements.length === 0) {
      issues.push('未检测到Vue组件')
    }
    
    // 检查Element Plus组件
    const elElements = document.querySelectorAll('[class*="el-"]')
    if (elElements.length === 0) {
      issues.push('未检测到Element Plus组件')
    }
    
    // 检查控制台错误
    const originalError = console.error
    const errors = []
    console.error = (...args) => {
      errors.push(args.join(' '))
      originalError.apply(console, args)
    }
    
    // 等待一段时间收集错误
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.error = originalError
    
    if (errors.length > 0) {
      issues.push(`检测到${errors.length}个控制台错误`)
    }
    
    this.checkResults.componentCompatibility = {
      status: issues.length === 0 ? 'passed' : 'failed',
      issues,
      errorCount: errors.length
    }
  }

  /**
   * 📱 检查响应式设计
   */
  async checkResponsiveDesign() {
    console.log('📱 检查响应式设计...')
    
    const issues = []
    
    // 检查viewport meta标签
    const viewport = document.querySelector('meta[name="viewport"]')
    if (!viewport) {
      issues.push('缺少viewport meta标签')
    }
    
    // 检查媒体查询
    const stylesheets = Array.from(document.styleSheets)
    let mediaQueriesFound = false
    
    try {
      stylesheets.forEach(sheet => {
        if (sheet.cssRules) {
          Array.from(sheet.cssRules).forEach(rule => {
            if (rule.type === CSSRule.MEDIA_RULE) {
              mediaQueriesFound = true
            }
          })
        }
      })
    } catch (e) {
      // 跨域样式表无法访问，这是正常的
    }
    
    if (!mediaQueriesFound) {
      issues.push('未检测到媒体查询')
    }
    
    // 检查水平滚动
    const hasHorizontalScroll = document.body.scrollWidth > window.innerWidth
    if (hasHorizontalScroll) {
      issues.push('页面存在水平滚动')
    }
    
    this.checkResults.responsiveDesign = {
      status: issues.length === 0 ? 'passed' : 'warning',
      issues
    }
  }

  /**
   * ♿ 检查可访问性
   */
  async checkAccessibility() {
    console.log('♿ 检查可访问性...')
    
    const issues = []
    
    // 检查图片alt属性
    const images = document.querySelectorAll('img')
    images.forEach(img => {
      if (!img.alt) {
        issues.push('图片缺少alt属性')
      }
    })
    
    // 检查表单标签关联
    const inputs = document.querySelectorAll('input, select, textarea')
    inputs.forEach(input => {
      if (!input.labels || input.labels.length === 0) {
        if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
          issues.push('表单控件缺少标签')
        }
      }
    })
    
    // 检查颜色对比度（简化检查）
    const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6')
    let lowContrastCount = 0
    
    textElements.forEach(el => {
      const style = window.getComputedStyle(el)
      const color = style.color
      const bgColor = style.backgroundColor
      
      // 简化的对比度检查
      if (color === 'rgb(128, 128, 128)' || color.includes('lightgray')) {
        lowContrastCount++
      }
    })
    
    if (lowContrastCount > 0) {
      issues.push(`发现${lowContrastCount}个可能的低对比度文本`)
    }
    
    this.checkResults.accessibility = {
      status: issues.length === 0 ? 'passed' : 'warning',
      issues
    }
  }

  /**
   * 📊 生成兼容性报告
   */
  generateCompatibilityReport() {
    const totalChecks = Object.keys(this.checkResults).length
    const passedChecks = Object.values(this.checkResults).filter(r => r.status === 'passed').length
    const warningChecks = Object.values(this.checkResults).filter(r => r.status === 'warning').length
    const failedChecks = Object.values(this.checkResults).filter(r => r.status === 'failed').length
    
    const overallStatus = failedChecks > 0 ? 'failed' : warningChecks > 0 ? 'warning' : 'passed'
    
    const report = {
      timestamp: new Date().toISOString(),
      overallStatus,
      summary: {
        totalChecks,
        passedChecks,
        warningChecks,
        failedChecks,
        successRate: Math.round((passedChecks / totalChecks) * 100)
      },
      details: this.checkResults,
      recommendations: this.generateRecommendations()
    }

    // 显示结果通知
    ElNotification({
      title: overallStatus === 'passed' ? '✅ 兼容性检查通过' : 
             overallStatus === 'warning' ? '⚠️ 兼容性检查有警告' : '❌ 兼容性检查失败',
      message: `成功率: ${report.summary.successRate}% (${passedChecks}/${totalChecks})`,
      type: overallStatus === 'passed' ? 'success' : overallStatus === 'warning' ? 'warning' : 'error',
      duration: 5000
    })

    return report
  }

  /**
   * 💡 生成改进建议
   */
  generateRecommendations() {
    const recommendations = []
    
    Object.entries(this.checkResults).forEach(([category, result]) => {
      if (result.status === 'failed') {
        recommendations.push(`❌ ${category}: 需要立即修复`)
      } else if (result.status === 'warning') {
        recommendations.push(`⚠️ ${category}: 建议改进`)
      } else {
        recommendations.push(`✅ ${category}: 检查通过`)
      }
      
      result.issues.forEach(issue => {
        recommendations.push(`  - ${issue}`)
      })
    })
    
    return recommendations
  }

  /**
   * 🔧 辅助方法
   */
  containsChinese(text) {
    return /[\u4e00-\u9fff]/.test(text)
  }

  isIconOnly(text) {
    // 检查是否只包含图标字符或很短的英文
    return text.length <= 2 || /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/.test(text)
  }
}

// 创建单例实例
const systemCompatibilityChecker = new SystemCompatibilityChecker()

export default systemCompatibilityChecker
