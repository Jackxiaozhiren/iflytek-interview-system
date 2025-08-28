/**
 * 图标增强工具函数
 * Icon Enhancement Utilities
 * 
 * 为现有组件批量添加增强图标样式类
 */

/**
 * 根据技术领域获取对应的主题类名
 * @param {string} domain - 技术领域 (ai, data, iot, interview)
 * @returns {string} 主题类名
 */
export function getThemeClass(domain) {
  const themeMap = {
    'ai': 'ai',
    'artificial': 'ai',
    'machine': 'ai',
    'data': 'data',
    'bigdata': 'data',
    'analytics': 'data',
    'iot': 'iot',
    'internet': 'iot',
    'device': 'iot',
    'interview': 'interview',
    'assessment': 'interview',
    'evaluation': 'interview'
  }
  
  return themeMap[domain.toLowerCase()] || 'interview'
}

/**
 * 根据内容自动检测技术领域
 * @param {string} content - 文本内容
 * @returns {string} 检测到的技术领域
 */
export function detectDomain(content) {
  const text = content.toLowerCase()
  
  // AI相关关键词
  if (text.includes('ai') || text.includes('机器学习') || text.includes('深度学习') || 
      text.includes('neural') || text.includes('算法') || text.includes('模型')) {
    return 'ai'
  }
  
  // 大数据相关关键词
  if (text.includes('数据') || text.includes('分析') || text.includes('spark') || 
      text.includes('hadoop') || text.includes('实时') || text.includes('计算')) {
    return 'data'
  }
  
  // IoT相关关键词
  if (text.includes('iot') || text.includes('物联网') || text.includes('传感器') || 
      text.includes('设备') || text.includes('连接') || text.includes('边缘')) {
    return 'iot'
  }
  
  // 默认为面试评估
  return 'interview'
}

/**
 * 为图标元素添加增强样式类
 * @param {HTMLElement} iconElement - 图标元素
 * @param {Object} options - 配置选项
 */
export function enhanceIcon(iconElement, options = {}) {
  const {
    size = 'md',
    theme = 'interview',
    style = 'default', // default, outline, soft
    interactive = true
  } = options
  
  if (!iconElement) return
  
  // 添加基础增强类
  iconElement.classList.add('icon-enhanced')
  
  // 添加尺寸类
  iconElement.classList.add(`icon-${size}`)
  
  // 添加主题类
  iconElement.classList.add(theme)
  
  // 添加样式类
  if (style !== 'default') {
    iconElement.classList.add(style)
  }
  
  // 添加交互效果
  if (interactive) {
    iconElement.style.cursor = 'pointer'
    
    // 添加悬停效果
    iconElement.addEventListener('mouseenter', () => {
      iconElement.style.transform = 'translateY(-2px) scale(1.05)'
    })
    
    iconElement.addEventListener('mouseleave', () => {
      iconElement.style.transform = 'translateY(0) scale(1)'
    })
    
    // 添加点击效果
    iconElement.addEventListener('mousedown', () => {
      iconElement.style.transform = 'translateY(0) scale(0.95)'
    })
    
    iconElement.addEventListener('mouseup', () => {
      iconElement.style.transform = 'translateY(-2px) scale(1.05)'
    })
  }
}

/**
 * 批量增强页面中的图标
 * @param {HTMLElement} container - 容器元素
 * @param {Object} options - 配置选项
 */
export function enhancePageIcons(container = document, options = {}) {
  const {
    autoDetectTheme = true,
    defaultTheme = 'interview',
    defaultSize = 'md'
  } = options
  
  // 查找所有 el-icon 元素
  const iconElements = container.querySelectorAll('.el-icon, [class*="el-icon"]')
  
  iconElements.forEach(iconElement => {
    // 跳过已经增强的图标
    if (iconElement.classList.contains('icon-enhanced')) {
      return
    }
    
    let theme = defaultTheme
    
    // 自动检测主题
    if (autoDetectTheme) {
      // 检查父元素的类名
      const parentClasses = iconElement.parentElement?.className || ''
      const grandParentClasses = iconElement.parentElement?.parentElement?.className || ''
      const contextText = iconElement.parentElement?.textContent || ''
      
      // 从类名检测主题
      if (parentClasses.includes('ai') || grandParentClasses.includes('ai')) {
        theme = 'ai'
      } else if (parentClasses.includes('data') || grandParentClasses.includes('data')) {
        theme = 'data'
      } else if (parentClasses.includes('iot') || grandParentClasses.includes('iot')) {
        theme = 'iot'
      } else if (contextText) {
        theme = detectDomain(contextText)
      }
    }
    
    enhanceIcon(iconElement, {
      theme,
      size: defaultSize,
      interactive: true
    })
  })
}

/**
 * 为按钮添加增强样式
 * @param {HTMLElement} buttonElement - 按钮元素
 * @param {Object} options - 配置选项
 */
export function enhanceButton(buttonElement, options = {}) {
  const {
    theme = 'interview',
    autoDetectTheme = true
  } = options
  
  if (!buttonElement) return
  
  let finalTheme = theme
  
  // 自动检测主题
  if (autoDetectTheme) {
    const buttonText = buttonElement.textContent || ''
    const parentClasses = buttonElement.parentElement?.className || ''
    
    if (parentClasses.includes('ai') || detectDomain(buttonText) === 'ai') {
      finalTheme = 'ai'
    } else if (parentClasses.includes('data') || detectDomain(buttonText) === 'data') {
      finalTheme = 'data'
    } else if (parentClasses.includes('iot') || detectDomain(buttonText) === 'iot') {
      finalTheme = 'iot'
    }
  }
  
  // 添加增强样式类
  buttonElement.classList.add('btn-enhanced', finalTheme)
}

/**
 * 批量增强页面中的按钮
 * @param {HTMLElement} container - 容器元素
 * @param {Object} options - 配置选项
 */
export function enhancePageButtons(container = document, options = {}) {
  const buttonSelectors = [
    'button:not(.btn-enhanced)',
    '.el-button:not(.btn-enhanced)',
    '[role="button"]:not(.btn-enhanced)'
  ]
  
  buttonSelectors.forEach(selector => {
    const buttons = container.querySelectorAll(selector)
    buttons.forEach(button => {
      enhanceButton(button, options)
    })
  })
}

/**
 * 初始化页面增强
 * @param {Object} options - 配置选项
 */
export function initPageEnhancements(options = {}) {
  const {
    enhanceIcons = true,
    enhanceButtons = true,
    autoDetectTheme = true,
    observeChanges = true
  } = options
  
  // 等待DOM加载完成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initPageEnhancements(options)
    })
    return
  }
  
  // 增强现有元素
  if (enhanceIcons) {
    enhancePageIcons(document, { autoDetectTheme })
  }
  
  if (enhanceButtons) {
    enhancePageButtons(document, { autoDetectTheme })
  }
  
  // 监听DOM变化
  if (observeChanges && window.MutationObserver) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (enhanceIcons) {
              enhancePageIcons(node, { autoDetectTheme })
            }
            if (enhanceButtons) {
              enhancePageButtons(node, { autoDetectTheme })
            }
          }
        })
      })
    })
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  }
}

/**
 * WCAG 2.1 AA 对比度验证
 * @param {string} foreground - 前景色 (hex)
 * @param {string} background - 背景色 (hex)
 * @returns {Object} 验证结果
 */
export function validateContrast(foreground, background) {
  // 将hex转换为RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }
  
  // 计算相对亮度
  const getLuminance = (rgb) => {
    const { r, g, b } = rgb
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }
  
  const fgRgb = hexToRgb(foreground)
  const bgRgb = hexToRgb(background)
  
  if (!fgRgb || !bgRgb) {
    return { valid: false, ratio: 0, error: 'Invalid color format' }
  }
  
  const fgLuminance = getLuminance(fgRgb)
  const bgLuminance = getLuminance(bgRgb)
  
  const ratio = (Math.max(fgLuminance, bgLuminance) + 0.05) / 
                (Math.min(fgLuminance, bgLuminance) + 0.05)
  
  return {
    valid: ratio >= 4.5,
    ratio: Math.round(ratio * 100) / 100,
    level: ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'Fail'
  }
}

export default {
  getThemeClass,
  detectDomain,
  enhanceIcon,
  enhancePageIcons,
  enhanceButton,
  enhancePageButtons,
  initPageEnhancements,
  validateContrast
}
