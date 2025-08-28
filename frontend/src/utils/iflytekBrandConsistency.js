/**
 * 🎨 iFlytek品牌一致性检查工具
 * 确保所有竞品分析功能都符合iFlytek品牌标准
 */

class IflytekBrandConsistency {
  constructor() {
    this.brandColors = {
      primary: '#1890ff',
      secondary: '#667eea',
      accent: '#764ba2',
      success: '#52c41a',
      warning: '#faad14',
      error: '#ff4d4f',
      info: '#1890ff'
    }
    
    this.brandFonts = {
      primary: 'Microsoft YaHei',
      fallback: ['PingFang SC', 'Hiragino Sans GB', 'SimHei', 'sans-serif']
    }
    
    this.brandGuidelines = {
      logoUsage: {
        minSize: '24px',
        clearSpace: '8px',
        placement: 'top-left'
      },
      typography: {
        headings: 'Microsoft YaHei',
        body: 'Microsoft YaHei',
        code: 'Consolas, Monaco, monospace'
      },
      spacing: {
        unit: '8px',
        small: '8px',
        medium: '16px',
        large: '24px',
        xlarge: '32px'
      },
      borderRadius: {
        small: '4px',
        medium: '8px',
        large: '12px',
        xlarge: '16px'
      },
      shadows: {
        light: '0 2px 8px rgba(0, 0, 0, 0.06)',
        medium: '0 4px 20px rgba(0, 0, 0, 0.08)',
        heavy: '0 8px 30px rgba(0, 0, 0, 0.12)'
      }
    }
    
    this.complianceChecks = []
    this.violations = []
  }

  /**
   * 检查颜色合规性
   */
  checkColorCompliance(element) {
    const computedStyle = window.getComputedStyle(element)
    const backgroundColor = computedStyle.backgroundColor
    const color = computedStyle.color
    
    const checks = {
      hasValidBrandColor: this.isValidBrandColor(backgroundColor) || this.isValidBrandColor(color),
      hasGoodContrast: this.checkContrastRatio(backgroundColor, color),
      followsColorScheme: this.followsBrandColorScheme(element)
    }
    
    return checks
  }

  /**
   * 检查是否为有效的品牌颜色
   */
  isValidBrandColor(color) {
    if (!color || color === 'rgba(0, 0, 0, 0)' || color === 'transparent') {
      return true // 透明色允许
    }
    
    const brandColorValues = Object.values(this.brandColors)
    const rgbColor = this.convertToRgb(color)
    
    return brandColorValues.some(brandColor => {
      const brandRgb = this.convertToRgb(brandColor)
      return this.colorsAreSimilar(rgbColor, brandRgb)
    })
  }

  /**
   * 检查对比度比例
   */
  checkContrastRatio(backgroundColor, textColor) {
    if (!backgroundColor || !textColor) return true
    
    const bgLuminance = this.getLuminance(backgroundColor)
    const textLuminance = this.getLuminance(textColor)
    
    const contrastRatio = (Math.max(bgLuminance, textLuminance) + 0.05) / 
                         (Math.min(bgLuminance, textLuminance) + 0.05)
    
    return contrastRatio >= 4.5 // WCAG AA标准
  }

  /**
   * 检查字体合规性
   */
  checkFontCompliance(element) {
    const computedStyle = window.getComputedStyle(element)
    const fontFamily = computedStyle.fontFamily
    
    const checks = {
      usesBrandFont: this.usesBrandFont(fontFamily),
      hasProperFallback: this.hasProperFontFallback(fontFamily),
      appropriateSize: this.hasAppropriateFontSize(computedStyle.fontSize)
    }
    
    return checks
  }

  /**
   * 检查是否使用品牌字体
   */
  usesBrandFont(fontFamily) {
    const primaryFont = this.brandFonts.primary
    return fontFamily.includes(primaryFont)
  }

  /**
   * 检查字体回退
   */
  hasProperFontFallback(fontFamily) {
    const fallbackFonts = this.brandFonts.fallback
    return fallbackFonts.some(fallback => fontFamily.includes(fallback))
  }

  /**
   * 检查字体大小是否合适
   */
  hasAppropriateFontSize(fontSize) {
    const size = parseInt(fontSize)
    return size >= 12 && size <= 72 // 合理的字体大小范围
  }

  /**
   * 检查间距合规性
   */
  checkSpacingCompliance(element) {
    const computedStyle = window.getComputedStyle(element)
    
    const checks = {
      margin: this.isValidSpacing(computedStyle.margin),
      padding: this.isValidSpacing(computedStyle.padding),
      gap: this.isValidSpacing(computedStyle.gap)
    }
    
    return checks
  }

  /**
   * 检查是否为有效间距
   */
  isValidSpacing(spacing) {
    if (!spacing || spacing === '0px') return true
    
    const spacingUnit = 8 // 8px基础单位
    const spacingValue = parseInt(spacing)
    
    return spacingValue % spacingUnit === 0
  }

  /**
   * 检查组件合规性
   */
  checkComponentCompliance(element) {
    const tagName = element.tagName.toLowerCase()
    const className = element.className
    
    const checks = {
      hasProperStructure: this.hasProperComponentStructure(element),
      followsNamingConvention: this.followsNamingConvention(className),
      hasAccessibilityAttributes: this.hasAccessibilityAttributes(element)
    }
    
    return checks
  }

  /**
   * 检查组件结构
   */
  hasProperComponentStructure(element) {
    // 检查是否有适当的语义化标签
    const semanticTags = ['header', 'nav', 'main', 'section', 'article', 'aside', 'footer']
    const hasSemanticParent = element.closest(semanticTags.join(','))
    
    return hasSemanticParent !== null
  }

  /**
   * 检查命名约定
   */
  followsNamingConvention(className) {
    if (!className) return true
    
    // 检查是否遵循BEM或其他约定
    const validPatterns = [
      /^[a-z][a-z0-9-]*$/, // kebab-case
      /^[a-z][a-zA-Z0-9]*$/, // camelCase
      /^[a-z][a-z0-9-]*__[a-z][a-z0-9-]*$/, // BEM block__element
      /^[a-z][a-z0-9-]*--[a-z][a-z0-9-]*$/ // BEM block--modifier
    ]
    
    const classes = className.split(' ')
    return classes.every(cls => 
      validPatterns.some(pattern => pattern.test(cls)) || 
      cls.startsWith('el-') // Element Plus类名
    )
  }

  /**
   * 检查无障碍属性
   */
  hasAccessibilityAttributes(element) {
    const interactiveElements = ['button', 'a', 'input', 'select', 'textarea']
    
    if (!interactiveElements.includes(element.tagName.toLowerCase())) {
      return true // 非交互元素不需要特殊检查
    }
    
    const hasAriaLabel = element.hasAttribute('aria-label')
    const hasAriaDescribedBy = element.hasAttribute('aria-describedby')
    const hasTitle = element.hasAttribute('title')
    const hasAltText = element.hasAttribute('alt')
    
    return hasAriaLabel || hasAriaDescribedBy || hasTitle || hasAltText
  }

  /**
   * 执行全面的品牌合规性检查
   */
  performFullComplianceCheck() {
    const results = {
      timestamp: new Date().toISOString(),
      summary: {
        totalElements: 0,
        compliantElements: 0,
        violations: 0,
        complianceRate: 0
      },
      details: {
        colorCompliance: [],
        fontCompliance: [],
        spacingCompliance: [],
        componentCompliance: []
      },
      recommendations: []
    }
    
    // 检查所有可见元素
    const allElements = document.querySelectorAll('*')
    results.summary.totalElements = allElements.length
    
    allElements.forEach((element, index) => {
      if (this.isElementVisible(element)) {
        const colorCheck = this.checkColorCompliance(element)
        const fontCheck = this.checkFontCompliance(element)
        const spacingCheck = this.checkSpacingCompliance(element)
        const componentCheck = this.checkComponentCompliance(element)
        
        const elementResult = {
          element: element.tagName.toLowerCase(),
          className: element.className,
          id: element.id,
          colorCompliance: colorCheck,
          fontCompliance: fontCheck,
          spacingCompliance: spacingCheck,
          componentCompliance: componentCheck,
          isCompliant: this.isElementCompliant(colorCheck, fontCheck, spacingCheck, componentCheck)
        }
        
        if (elementResult.isCompliant) {
          results.summary.compliantElements++
        } else {
          results.summary.violations++
          this.generateRecommendations(elementResult, results.recommendations)
        }
        
        // 存储详细结果（仅存储前100个以避免过大）
        if (index < 100) {
          results.details.colorCompliance.push({
            element: elementResult.element,
            ...colorCheck
          })
          results.details.fontCompliance.push({
            element: elementResult.element,
            ...fontCheck
          })
          results.details.spacingCompliance.push({
            element: elementResult.element,
            ...spacingCheck
          })
          results.details.componentCompliance.push({
            element: elementResult.element,
            ...componentCheck
          })
        }
      }
    })
    
    results.summary.complianceRate = 
      (results.summary.compliantElements / results.summary.totalElements * 100).toFixed(2)
    
    return results
  }

  /**
   * 检查元素是否可见
   */
  isElementVisible(element) {
    const style = window.getComputedStyle(element)
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           style.opacity !== '0'
  }

  /**
   * 判断元素是否合规
   */
  isElementCompliant(colorCheck, fontCheck, spacingCheck, componentCheck) {
    const colorCompliant = Object.values(colorCheck).every(Boolean)
    const fontCompliant = Object.values(fontCheck).every(Boolean)
    const spacingCompliant = Object.values(spacingCheck).every(Boolean)
    const componentCompliant = Object.values(componentCheck).every(Boolean)
    
    return colorCompliant && fontCompliant && spacingCompliant && componentCompliant
  }

  /**
   * 生成改进建议
   */
  generateRecommendations(elementResult, recommendations) {
    if (!elementResult.colorCompliance.hasValidBrandColor) {
      recommendations.push({
        type: 'color',
        message: `元素 ${elementResult.element} 使用了非品牌颜色，建议使用iFlytek品牌色彩方案`,
        priority: 'high'
      })
    }
    
    if (!elementResult.fontCompliance.usesBrandFont) {
      recommendations.push({
        type: 'font',
        message: `元素 ${elementResult.element} 未使用Microsoft YaHei字体，建议更新字体设置`,
        priority: 'medium'
      })
    }
    
    if (!elementResult.componentCompliance.hasAccessibilityAttributes) {
      recommendations.push({
        type: 'accessibility',
        message: `交互元素 ${elementResult.element} 缺少无障碍属性，建议添加aria-label或title`,
        priority: 'high'
      })
    }
  }

  /**
   * 工具方法：颜色转换
   */
  convertToRgb(color) {
    // 简化的颜色转换，实际应用中可能需要更复杂的实现
    if (color.startsWith('#')) {
      const hex = color.slice(1)
      const r = parseInt(hex.slice(0, 2), 16)
      const g = parseInt(hex.slice(2, 4), 16)
      const b = parseInt(hex.slice(4, 6), 16)
      return { r, g, b }
    }
    return { r: 0, g: 0, b: 0 }
  }

  /**
   * 工具方法：颜色相似性检查
   */
  colorsAreSimilar(color1, color2, threshold = 30) {
    const rDiff = Math.abs(color1.r - color2.r)
    const gDiff = Math.abs(color1.g - color2.g)
    const bDiff = Math.abs(color1.b - color2.b)
    
    return rDiff <= threshold && gDiff <= threshold && bDiff <= threshold
  }

  /**
   * 工具方法：获取亮度
   */
  getLuminance(color) {
    const rgb = this.convertToRgb(color)
    const { r, g, b } = rgb
    
    const rsRGB = r / 255
    const gsRGB = g / 255
    const bsRGB = b / 255
    
    const rLin = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4)
    const gLin = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4)
    const bLin = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4)
    
    return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin
  }

  /**
   * 检查品牌色彩方案
   */
  followsBrandColorScheme(element) {
    // 检查元素是否遵循iFlytek品牌色彩方案
    const computedStyle = window.getComputedStyle(element)
    const backgroundColor = computedStyle.backgroundColor
    const color = computedStyle.color
    const borderColor = computedStyle.borderColor
    
    const colors = [backgroundColor, color, borderColor].filter(c => c && c !== 'rgba(0, 0, 0, 0)')
    
    return colors.length === 0 || colors.every(c => this.isValidBrandColor(c))
  }
}

// 创建全局实例
const iflytekBrandConsistency = new IflytekBrandConsistency()

// 导出实例和类
export default iflytekBrandConsistency
export { IflytekBrandConsistency }
