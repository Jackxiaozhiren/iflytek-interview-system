/**
 * 色彩对比度验证工具
 * 用于验证iFlytek Spark面试AI系统的色彩搭配是否符合WCAG 2.1 AA标准
 */

/**
 * 将十六进制颜色转换为RGB
 * @param {string} hex - 十六进制颜色值 (如 #ffffff)
 * @returns {Object} RGB对象 {r, g, b}
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
 * @param {Object} rgb - RGB对象 {r, g, b}
 * @returns {number} 相对亮度值 (0-1)
 */
function getLuminance(rgb) {
  const { r, g, b } = rgb;
  
  // 将RGB值转换为sRGB
  const rsRGB = r / 255;
  const gsRGB = g / 255;
  const bsRGB = b / 255;
  
  // 应用gamma校正
  const rLinear = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const gLinear = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const bLinear = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);
  
  // 计算相对亮度
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * 计算对比度
 * @param {string} color1 - 第一个颜色 (十六进制)
 * @param {string} color2 - 第二个颜色 (十六进制)
 * @returns {number} 对比度值
 */
function getContrastRatio(color1, color2) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) {
    throw new Error('Invalid color format');
  }
  
  const lum1 = getLuminance(rgb1);
  const lum2 = getLuminance(rgb2);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * 验证对比度是否符合WCAG标准
 * @param {number} ratio - 对比度值
 * @param {string} level - 标准级别 ('AA' 或 'AAA')
 * @param {string} size - 文字大小 ('normal' 或 'large')
 * @returns {Object} 验证结果
 */
function validateWCAG(ratio, level = 'AA', size = 'normal') {
  const requirements = {
    AA: {
      normal: 4.5,
      large: 3.0
    },
    AAA: {
      normal: 7.0,
      large: 4.5
    }
  };
  
  const required = requirements[level][size];
  const passes = ratio >= required;
  
  return {
    ratio: Math.round(ratio * 100) / 100,
    required,
    passes,
    level,
    size,
    grade: passes ? (ratio >= requirements.AAA[size] ? 'AAA' : 'AA') : 'FAIL'
  };
}

/**
 * iFlytek系统色彩对比度测试套件 - 全面分析
 */
const iFlytekColorTests = [
  // 当前系统中发现的问题区域
  {
    name: '紫色背景 + 黑色文字 (#4c51bf + #000000)',
    foreground: '#000000',
    background: '#4c51bf',
    context: 'iFlytek主色背景上的黑色文字',
    isProblematic: true
  },
  {
    name: '紫色渐变背景 + 黑色文字 (#6b21a8 + #000000)',
    foreground: '#000000',
    background: '#6b21a8',
    context: 'iFlytek渐变色背景上的黑色文字',
    isProblematic: true
  },
  {
    name: '深色文字在浅紫色背景 (#2d3748 + #f8fafc)',
    foreground: '#2d3748',
    background: '#f8fafc',
    context: 'DemoPage中的文字颜色',
    isProblematic: false
  },

  // AI思考过程区域
  {
    name: 'AI思考内容 - 主要文字',
    foreground: '#1a1a1a',  // --thinking-text-primary
    background: '#ffffff',   // --bg-thinking
    context: 'AI思考过程显示区域的主要文字'
  },
  {
    name: 'AI思考内容 - 次要文字',
    foreground: '#2d2d2d',  // --thinking-text-secondary
    background: '#f8fafc',   // --bg-thinking-secondary
    context: 'AI思考过程摘要按钮文字'
  },

  // 消息气泡
  {
    name: '用户消息气泡',
    foreground: '#ffffff',  // --text-on-gradient
    background: '#4c51bf',  // 新的高对比度渐变主色
    context: '用户消息气泡中的文字'
  },
  {
    name: 'AI消息气泡',
    foreground: '#1a1a1a',  // --text-primary
    background: '#ffffff',   // --bg-message-ai
    context: 'AI消息气泡中的文字'
  },
  
  // 状态指示器
  {
    name: '状态文字',
    foreground: '#1a1a1a',  // --text-primary
    background: '#ffffff',   // --bg-primary
    context: '状态指示器文字'
  },
  
  // 按钮和交互元素
  {
    name: 'iFlytek主按钮',
    foreground: '#ffffff',  // --text-on-iflytek-gradient
    background: '#4c51bf',  // 新的高对比度主色
    context: 'iFlytek品牌主按钮文字'
  },

  // 成功状态
  {
    name: '成功状态',
    foreground: '#ffffff',  // 白色文字
    background: '#047857',  // 最新的高对比度成功色
    context: '成功状态指示器'
  },

  // 警告状态
  {
    name: '警告状态',
    foreground: '#ffffff',  // 白色文字
    background: '#b45309',  // 最新的高对比度警告色
    context: '警告状态指示器'
  },

  // 错误状态
  {
    name: '错误状态',
    foreground: '#ffffff',  // 白色文字
    background: '#dc2626',  // 新的高对比度错误色
    context: '错误状态指示器'
  }
];

/**
 * 运行iFlytek系统色彩对比度测试
 * @returns {Array} 测试结果数组
 */
function runIFlytekColorTests() {
  const results = [];
  
  console.log('🎨 iFlytek Spark面试AI系统 - 色彩对比度验证');
  console.log('=' .repeat(60));
  
  iFlytekColorTests.forEach(test => {
    try {
      const ratio = getContrastRatio(test.foreground, test.background);
      const validation = validateWCAG(ratio, 'AA', 'normal');
      
      const result = {
        ...test,
        ...validation,
        status: validation.passes ? '✅ PASS' : '❌ FAIL'
      };
      
      results.push(result);
      
      console.log(`\n📋 ${test.name}`);
      console.log(`   前景色: ${test.foreground}`);
      console.log(`   背景色: ${test.background}`);
      console.log(`   对比度: ${validation.ratio}:1`);
      console.log(`   标准: WCAG 2.1 AA (≥4.5:1)`);
      console.log(`   结果: ${result.status} (${validation.grade})`);
      console.log(`   用途: ${test.context}`);
      
    } catch (error) {
      console.error(`❌ 测试失败: ${test.name} - ${error.message}`);
      results.push({
        ...test,
        error: error.message,
        status: '❌ ERROR'
      });
    }
  });
  
  // 生成总结报告
  const passed = results.filter(r => r.passes).length;
  const total = results.length;
  const passRate = Math.round((passed / total) * 100);
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 测试总结');
  console.log(`   通过: ${passed}/${total} (${passRate}%)`);
  console.log(`   WCAG 2.1 AA 合规性: ${passRate >= 100 ? '✅ 完全合规' : '⚠️ 需要优化'}`);
  
  if (passRate < 100) {
    console.log('\n🔧 建议优化的色彩组合:');
    results.filter(r => !r.passes).forEach(r => {
      console.log(`   • ${r.name}: 当前${r.ratio}:1, 需要≥4.5:1`);
    });
  }
  
  return results;
}

// 导出函数
export {
  hexToRgb,
  getLuminance,
  getContrastRatio,
  validateWCAG,
  runIFlytekColorTests,
  iFlytekColorTests
};

// 如果在浏览器环境中直接运行
if (typeof window !== 'undefined') {
  window.iFlytekColorValidator = {
    hexToRgb,
    getLuminance,
    getContrastRatio,
    validateWCAG,
    runIFlytekColorTests,
    iFlytekColorTests
  };
}
