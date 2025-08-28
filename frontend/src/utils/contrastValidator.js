/**
 * WCAG 2.1 AA 对比度验证工具
 * WCAG 2.1 AA Contrast Validation Tool
 * 
 * 验证色彩组合是否符合无障碍标准
 */

/**
 * 将十六进制颜色转换为RGB
 * @param {string} hex - 十六进制颜色值
 * @returns {Object|null} RGB对象或null
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

/**
 * 将RGB颜色转换为十六进制
 * @param {number} r - 红色值 (0-255)
 * @param {number} g - 绿色值 (0-255)
 * @param {number} b - 蓝色值 (0-255)
 * @returns {string} 十六进制颜色值
 */
function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

/**
 * 计算颜色的相对亮度
 * @param {Object} rgb - RGB颜色对象
 * @returns {number} 相对亮度值
 */
function getLuminance(rgb) {
  const { r, g, b } = rgb
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

/**
 * 计算两个颜色之间的对比度
 * @param {string} color1 - 第一个颜色 (hex)
 * @param {string} color2 - 第二个颜色 (hex)
 * @returns {number} 对比度比值
 */
function getContrastRatio(color1, color2) {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)
  
  if (!rgb1 || !rgb2) {
    throw new Error('Invalid color format')
  }
  
  const lum1 = getLuminance(rgb1)
  const lum2 = getLuminance(rgb2)
  
  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)
  
  return (brightest + 0.05) / (darkest + 0.05)
}

/**
 * 验证颜色组合是否符合WCAG标准
 * @param {string} foreground - 前景色 (hex)
 * @param {string} background - 背景色 (hex)
 * @param {string} level - 验证级别 ('AA' 或 'AAA')
 * @param {string} size - 文字大小 ('normal' 或 'large')
 * @returns {Object} 验证结果
 */
export function validateContrast(foreground, background, level = 'AA', size = 'normal') {
  try {
    const ratio = getContrastRatio(foreground, background)
    
    // WCAG 2.1 标准
    const standards = {
      'AA': {
        normal: 4.5,
        large: 3.0
      },
      'AAA': {
        normal: 7.0,
        large: 4.5
      }
    }
    
    const requiredRatio = standards[level][size]
    const passed = ratio >= requiredRatio
    
    return {
      passed,
      ratio: Math.round(ratio * 100) / 100,
      requiredRatio,
      level,
      size,
      grade: ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'Fail',
      foreground,
      background
    }
  } catch (error) {
    return {
      passed: false,
      error: error.message,
      foreground,
      background
    }
  }
}

/**
 * 批量验证主题色彩组合
 * @param {Object} theme - 主题色彩配置
 * @returns {Array} 验证结果数组
 */
export function validateThemeColors(theme) {
  const results = []
  
  // 定义需要验证的色彩组合
  const combinations = [
    { fg: theme.primary, bg: '#ffffff', name: '主色 + 白色背景' },
    { fg: '#ffffff', bg: theme.primary, name: '白色文字 + 主色背景' },
    { fg: theme.text, bg: '#ffffff', name: '文字色 + 白色背景' },
    { fg: theme.text, bg: theme.light, name: '文字色 + 浅色背景' },
    { fg: '#ffffff', bg: theme.dark, name: '白色文字 + 深色背景' },
    { fg: theme.secondary, bg: '#ffffff', name: '次要色 + 白色背景' },
    { fg: '#ffffff', bg: theme.secondary, name: '白色文字 + 次要色背景' }
  ]
  
  combinations.forEach(combo => {
    if (combo.fg && combo.bg) {
      const result = validateContrast(combo.fg, combo.bg)
      results.push({
        ...result,
        name: combo.name,
        combination: combo
      })
    }
  })
  
  return results
}

/**
 * 验证所有模块主题的色彩合规性
 * @returns {Object} 所有主题的验证结果
 */
export function validateAllThemes() {
  const themes = {
    ai: {
      primary: '#0066cc',
      secondary: '#4c51bf',
      accent: '#3b82f6',
      light: '#eff6ff',
      dark: '#1e40af',
      text: '#1e3a8a'
    },
    data: {
      primary: '#10b981',
      secondary: '#059669',
      accent: '#34d399',
      light: '#ecfdf5',
      dark: '#047857',
      text: '#064e3b'
    },
    iot: {
      primary: '#f59e0b',
      secondary: '#d97706',
      accent: '#fbbf24',
      light: '#fffbeb',
      dark: '#b45309',
      text: '#92400e'
    },
    interview: {
      primary: '#8b5cf6',
      secondary: '#7c3aed',
      accent: '#a78bfa',
      light: '#f5f3ff',
      dark: '#6d28d9',
      text: '#581c87'
    }
  }
  
  const results = {}
  
  Object.keys(themes).forEach(themeName => {
    results[themeName] = validateThemeColors(themes[themeName])
  })
  
  return results
}

/**
 * 生成对比度验证报告
 * @param {Object} validationResults - 验证结果
 * @returns {string} HTML格式的报告
 */
export function generateContrastReport(validationResults) {
  let html = `
    <div class="contrast-report">
      <h2>WCAG 2.1 AA 对比度验证报告</h2>
      <div class="report-summary">
        <p>生成时间: ${new Date().toLocaleString('zh-CN')}</p>
      </div>
  `
  
  Object.keys(validationResults).forEach(themeName => {
    const themeResults = validationResults[themeName]
    const passedCount = themeResults.filter(r => r.passed).length
    const totalCount = themeResults.length
    
    html += `
      <div class="theme-section">
        <h3>${themeName.toUpperCase()} 主题验证结果</h3>
        <div class="theme-summary">
          <span class="pass-rate ${passedCount === totalCount ? 'perfect' : passedCount > totalCount * 0.8 ? 'good' : 'warning'}">
            通过率: ${passedCount}/${totalCount} (${Math.round(passedCount / totalCount * 100)}%)
          </span>
        </div>
        <div class="combinations">
    `
    
    themeResults.forEach(result => {
      const statusClass = result.passed ? 'passed' : 'failed'
      html += `
        <div class="combination ${statusClass}">
          <div class="combination-info">
            <span class="name">${result.name}</span>
            <span class="ratio">对比度: ${result.ratio}:1</span>
            <span class="grade grade-${result.grade.toLowerCase()}">${result.grade}</span>
          </div>
          <div class="color-preview">
            <div class="color-sample" style="background: ${result.background}; color: ${result.foreground};">
              示例文字 Sample Text
            </div>
          </div>
        </div>
      `
    })
    
    html += `
        </div>
      </div>
    `
  })
  
  html += `
    </div>
    <style>
      .contrast-report {
        font-family: 'Microsoft YaHei', sans-serif;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
      }
      .theme-section {
        margin-bottom: 30px;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 20px;
      }
      .pass-rate.perfect { color: #10b981; }
      .pass-rate.good { color: #f59e0b; }
      .pass-rate.warning { color: #ef4444; }
      .combination {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        margin: 10px 0;
        border-radius: 4px;
      }
      .combination.passed { background: #f0fdf4; border-left: 4px solid #10b981; }
      .combination.failed { background: #fef2f2; border-left: 4px solid #ef4444; }
      .grade-aaa { background: #10b981; color: white; padding: 2px 6px; border-radius: 4px; }
      .grade-aa { background: #f59e0b; color: white; padding: 2px 6px; border-radius: 4px; }
      .grade-fail { background: #ef4444; color: white; padding: 2px 6px; border-radius: 4px; }
      .color-sample {
        padding: 8px 12px;
        border-radius: 4px;
        font-weight: 500;
      }
    </style>
  `
  
  return html
}

/**
 * 在控制台输出验证结果
 * @param {Object} validationResults - 验证结果
 */
export function logContrastResults(validationResults) {
  console.group('🎨 WCAG 2.1 AA 对比度验证结果')
  
  Object.keys(validationResults).forEach(themeName => {
    const themeResults = validationResults[themeName]
    const passedCount = themeResults.filter(r => r.passed).length
    const totalCount = themeResults.length
    
    console.group(`${themeName.toUpperCase()} 主题 (${passedCount}/${totalCount} 通过)`)
    
    themeResults.forEach(result => {
      const status = result.passed ? '✅' : '❌'
      const message = `${status} ${result.name}: ${result.ratio}:1 (${result.grade})`
      
      if (result.passed) {
        console.log(`%c${message}`, 'color: #10b981')
      } else {
        console.warn(`%c${message}`, 'color: #ef4444')
      }
    })
    
    console.groupEnd()
  })
  
  console.groupEnd()
}

/**
 * 自动修复不合规的颜色组合
 * @param {string} foreground - 前景色
 * @param {string} background - 背景色
 * @param {number} targetRatio - 目标对比度
 * @returns {Object} 修复后的颜色组合
 */
export function fixContrastRatio(foreground, background, targetRatio = 4.5) {
  const fgRgb = hexToRgb(foreground)
  const bgRgb = hexToRgb(background)
  
  if (!fgRgb || !bgRgb) {
    throw new Error('Invalid color format')
  }
  
  // 简单的修复策略：调整前景色的亮度
  let adjustedFg = { ...fgRgb }
  let currentRatio = getContrastRatio(foreground, background)
  
  // 如果对比度不够，尝试调整前景色
  if (currentRatio < targetRatio) {
    const bgLuminance = getLuminance(bgRgb)
    
    // 如果背景较亮，将前景色调暗
    if (bgLuminance > 0.5) {
      while (currentRatio < targetRatio && adjustedFg.r > 0) {
        adjustedFg.r = Math.max(0, adjustedFg.r - 10)
        adjustedFg.g = Math.max(0, adjustedFg.g - 10)
        adjustedFg.b = Math.max(0, adjustedFg.b - 10)
        currentRatio = getContrastRatio(rgbToHex(adjustedFg.r, adjustedFg.g, adjustedFg.b), background)
      }
    } else {
      // 如果背景较暗，将前景色调亮
      while (currentRatio < targetRatio && adjustedFg.r < 255) {
        adjustedFg.r = Math.min(255, adjustedFg.r + 10)
        adjustedFg.g = Math.min(255, adjustedFg.g + 10)
        adjustedFg.b = Math.min(255, adjustedFg.b + 10)
        currentRatio = getContrastRatio(rgbToHex(adjustedFg.r, adjustedFg.g, adjustedFg.b), background)
      }
    }
  }
  
  return {
    original: { foreground, background },
    fixed: {
      foreground: rgbToHex(adjustedFg.r, adjustedFg.g, adjustedFg.b),
      background
    },
    ratio: currentRatio
  }
}

export default {
  validateContrast,
  validateThemeColors,
  validateAllThemes,
  generateContrastReport,
  logContrastResults,
  fixContrastRatio
}
