/**
 * WCAG 2.1 AA对比度验证工具
 * 确保所有颜色组合符合4.5:1的对比度要求
 */

/**
 * 将十六进制颜色转换为RGB
 * @param {string} hex - 十六进制颜色值
 * @returns {object} RGB对象
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * 计算相对亮度
 * @param {object} rgb - RGB颜色对象
 * @returns {number} 相对亮度值
 */
function getLuminance(rgb) {
  const { r, g, b } = rgb;
  
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * 计算对比度
 * @param {string} color1 - 第一个颜色（十六进制）
 * @param {string} color2 - 第二个颜色（十六进制）
 * @returns {number} 对比度值
 */
function getContrastRatio(color1, color2) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 0;
  
  const lum1 = getLuminance(rgb1);
  const lum2 = getLuminance(rgb2);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * 验证颜色组合是否符合WCAG 2.1 AA标准
 * @param {string} backgroundColor - 背景色
 * @param {string} textColor - 文字色
 * @returns {object} 验证结果
 */
function validateContrast(backgroundColor, textColor) {
  const ratio = getContrastRatio(backgroundColor, textColor);
  const isValid = ratio >= 4.5;
  
  return {
    ratio: Math.round(ratio * 100) / 100,
    isValid,
    level: ratio >= 7 ? 'AAA' : (ratio >= 4.5 ? 'AA' : 'FAIL'),
    recommendation: isValid ? '符合WCAG 2.1 AA标准' : '需要调整颜色以提高对比度'
  };
}

/**
 * iFlytek系统颜色配置验证
 */
const iFlytekColors = {
  // 主要背景色
  primaryDark: '#1a365d',      // 深蓝色背景
  secondaryDark: '#2c5282',    // 中蓝色背景
  accentDark: '#3182ce',       // 亮蓝色背景
  
  // 文字色
  textOnDark: '#ffffff',       // 深色背景上的白色文字
  textOnLight: '#1a202c',      // 浅色背景上的深色文字
  
  // 辅助色
  success: '#22543d',          // 成功色
  warning: '#744210',          // 警告色
  error: '#742a2a',            // 错误色
  info: '#2c5282'              // 信息色
};

/**
 * 验证所有iFlytek颜色组合
 */
function validateiFlytekColors() {
  const results = [];
  
  // 验证主要颜色组合
  const combinations = [
    { bg: iFlytekColors.primaryDark, text: iFlytekColors.textOnDark, name: '主要背景+白色文字' },
    { bg: iFlytekColors.secondaryDark, text: iFlytekColors.textOnDark, name: '次要背景+白色文字' },
    { bg: iFlytekColors.accentDark, text: iFlytekColors.textOnDark, name: '强调背景+白色文字' },
    { bg: '#ffffff', text: iFlytekColors.textOnLight, name: '白色背景+深色文字' },
    { bg: iFlytekColors.success, text: iFlytekColors.textOnDark, name: '成功色背景+白色文字' },
    { bg: iFlytekColors.warning, text: iFlytekColors.textOnDark, name: '警告色背景+白色文字' },
    { bg: iFlytekColors.error, text: iFlytekColors.textOnDark, name: '错误色背景+白色文字' },
    { bg: iFlytekColors.info, text: iFlytekColors.textOnDark, name: '信息色背景+白色文字' }
  ];
  
  combinations.forEach(combo => {
    const result = validateContrast(combo.bg, combo.text);
    results.push({
      name: combo.name,
      backgroundColor: combo.bg,
      textColor: combo.text,
      ...result
    });
  });
  
  return results;
}

/**
 * 生成对比度报告
 */
function generateContrastReport() {
  const results = validateiFlytekColors();
  
  console.group('🎨 iFlytek系统颜色对比度验证报告');
  console.log('📋 WCAG 2.1 AA标准要求对比度 ≥ 4.5:1');
  console.log('📋 WCAG 2.1 AAA标准要求对比度 ≥ 7:1');
  console.log('');
  
  results.forEach(result => {
    const icon = result.isValid ? '✅' : '❌';
    const style = `background: ${result.backgroundColor}; color: ${result.textColor}; padding: 4px 8px; border-radius: 4px;`;
    
    console.log(`${icon} ${result.name}`);
    console.log(`   对比度: ${result.ratio}:1 (${result.level})`);
    console.log(`   %c示例文字`, style);
    console.log(`   建议: ${result.recommendation}`);
    console.log('');
  });
  
  const validCount = results.filter(r => r.isValid).length;
  const totalCount = results.length;
  
  console.log(`📊 总体评估: ${validCount}/${totalCount} 个颜色组合符合WCAG 2.1 AA标准`);
  console.groupEnd();
  
  return results;
}

/**
 * 实时验证DOM元素的对比度
 * @param {string} selector - CSS选择器
 */
function validateElementContrast(selector) {
  const element = document.querySelector(selector);
  if (!element) {
    console.warn(`未找到元素: ${selector}`);
    return null;
  }
  
  const styles = window.getComputedStyle(element);
  const backgroundColor = styles.backgroundColor;
  const color = styles.color;
  
  // 简化的颜色提取（仅支持rgb格式）
  const bgMatch = backgroundColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  const textMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  
  if (!bgMatch || !textMatch) {
    console.warn(`无法解析颜色: ${selector}`);
    return null;
  }
  
  const bgHex = `#${parseInt(bgMatch[1]).toString(16).padStart(2, '0')}${parseInt(bgMatch[2]).toString(16).padStart(2, '0')}${parseInt(bgMatch[3]).toString(16).padStart(2, '0')}`;
  const textHex = `#${parseInt(textMatch[1]).toString(16).padStart(2, '0')}${parseInt(textMatch[2]).toString(16).padStart(2, '0')}${parseInt(textMatch[3]).toString(16).padStart(2, '0')}`;
  
  const result = validateContrast(bgHex, textHex);
  
  console.log(`🔍 元素对比度验证: ${selector}`);
  console.log(`   背景色: ${bgHex} (${backgroundColor})`);
  console.log(`   文字色: ${textHex} (${color})`);
  console.log(`   对比度: ${result.ratio}:1 (${result.level})`);
  console.log(`   状态: ${result.isValid ? '✅ 通过' : '❌ 不通过'}`);
  
  return result;
}

// 导出函数
export {
  validateContrast,
  validateiFlytekColors,
  generateContrastReport,
  validateElementContrast,
  iFlytekColors
};

// 如果在浏览器环境中，添加到全局对象
if (typeof window !== 'undefined') {
  window.contrastValidator = {
    validateContrast,
    validateiFlytekColors,
    generateContrastReport,
    validateElementContrast,
    iFlytekColors
  };
}
