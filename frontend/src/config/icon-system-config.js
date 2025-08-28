/**
 * iFlytek 星火大模型智能面试系统 - 图标系统配置
 * Icon System Configuration for iFlytek Spark Interview System
 * 
 * 统一管理系统中所有图标的使用规范和配置
 */

// iFlytek 品牌主题色彩配置
export const iflytekThemeColors = {
  primary: '#1890ff',
  secondary: '#667eea', 
  accent: '#0066cc',
  purple: '#4c51bf',
  gradient: '#764ba2',
  
  // 技术领域主题色
  ai: '#0066cc',
  bigdata: '#059669',
  iot: '#dc2626',
  cloud: '#7c3aed',
  
  // 状态色彩
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6'
}

// 图标尺寸标准
export const iconSizes = {
  xs: '12px',
  sm: '14px',
  md: '16px',
  lg: '20px',
  xl: '24px',
  xxl: '32px',
  xxxl: '48px'
}

// 面试系统功能图标映射
export const interviewSystemIcons = {
  // 核心面试功能
  interview: {
    start: 'VideoPlay',
    pause: 'Pause',
    stop: 'Close',
    next: 'ArrowRight',
    previous: 'ArrowLeft',
    record: 'Microphone',
    settings: 'Setting'
  },

  // 多模态分析
  analysis: {
    voice: 'Microphone',
    text: 'Document',
    data: 'TrendCharts',
    ai: 'Cpu',
    realtime: 'TrendCharts'
  },
  
  // 用户角色
  users: {
    candidate: 'User',
    interviewer: 'User',
    enterprise: 'OfficeBuilding',
    admin: 'Setting'
  },
  
  // 技术领域
  domains: {
    ai: 'Cpu',
    bigdata: 'DataBoard',
    iot: 'Connection',
    cloud: 'TrendCharts',
    general: 'Star'
  },
  
  // 评估状态
  status: {
    active: 'Star',
    completed: 'CircleCheck',
    pending: 'Clock',
    processing: 'Loading',
    warning: 'WarningFilled',
    error: 'Close',
    success: 'CircleCheck'
  },
  
  // 报告和导出
  reports: {
    generate: 'Document',
    download: 'Download',
    share: 'Share',
    print: 'Printer',
    export: 'Upload',
    view: 'View'
  },
  
  // 导航和操作
  navigation: {
    home: 'House',
    back: 'ArrowLeft',
    forward: 'ArrowRight',
    up: 'ArrowUp',
    down: 'ArrowDown',
    close: 'Close',
    menu: 'Menu',
    search: 'Search'
  },
  
  // 数据和图表
  data: {
    chart: 'TrendCharts',
    table: 'Grid',
    analytics: 'Grid',
    statistics: 'DataBoard',
    trend: 'TrendCharts',
    progress: 'TrendCharts'
  }
}

// 图标样式类配置
export const iconStyleClasses = {
  // 尺寸类
  sizes: {
    xs: 'icon-xs',
    sm: 'icon-sm', 
    md: 'icon-md',
    lg: 'icon-lg',
    xl: 'icon-xl',
    xxl: 'icon-xxl',
    xxxl: 'icon-xxxl'
  },
  
  // 主题类
  themes: {
    primary: 'icon-primary',
    secondary: 'icon-secondary',
    ai: 'icon-ai',
    bigdata: 'icon-bigdata',
    iot: 'icon-iot',
    cloud: 'icon-cloud'
  },
  
  // 状态类
  states: {
    active: 'icon-active',
    disabled: 'icon-disabled',
    loading: 'icon-loading',
    success: 'icon-success',
    warning: 'icon-warning',
    error: 'icon-error'
  },
  
  // 动画类
  animations: {
    spin: 'icon-spin',
    pulse: 'icon-pulse',
    bounce: 'icon-bounce',
    shake: 'icon-shake'
  },
  
  // 交互类
  interactions: {
    clickable: 'icon-interactive',
    hoverable: 'icon-hoverable',
    focusable: 'icon-focusable'
  }
}

// 响应式断点配置
export const responsiveBreakpoints = {
  mobile: '480px',
  tablet: '768px',
  laptop: '1024px',
  desktop: '1200px'
}

// 图标使用规范
export const iconUsageGuidelines = {
  // 文本旁图标尺寸建议
  textIcon: {
    '12px': 'xs',  // 小号文字
    '14px': 'sm',  // 正文文字
    '16px': 'md',  // 标题文字
    '18px': 'lg',  // 大标题
    '20px': 'xl'   // 特大标题
  },
  
  // 按钮图标尺寸建议
  buttonIcon: {
    small: 'sm',
    medium: 'md', 
    large: 'lg'
  },
  
  // 导航图标尺寸建议
  navigationIcon: {
    sidebar: 'md',
    topbar: 'md',
    breadcrumb: 'sm',
    pagination: 'sm'
  }
}

// 可访问性配置
export const accessibilityConfig = {
  // 最小点击区域 (WCAG 2.1 AA)
  minTouchTarget: '44px',
  
  // 对比度要求
  contrastRatio: {
    normal: 4.5,
    large: 3.0
  },
  
  // 焦点指示器
  focusIndicator: {
    width: '2px',
    color: iflytekThemeColors.primary,
    offset: '2px'
  }
}

// 图标优化建议
export const optimizationTips = {
  performance: [
    '使用 SVG 图标以获得最佳缩放效果',
    '避免过度使用动画图标影响性能',
    '合理使用图标缓存机制'
  ],
  
  usability: [
    '确保图标语义与功能匹配',
    '保持图标风格一致性',
    '提供适当的图标标签和提示'
  ],
  
  accessibility: [
    '为图标提供 aria-label 属性',
    '确保足够的颜色对比度',
    '支持键盘导航和屏幕阅读器'
  ],
  
  branding: [
    '遵循 iFlytek 品牌色彩规范',
    '保持技术领域图标的主题一致性',
    '使用品牌认可的图标样式'
  ]
}

// 导出默认配置
export default {
  colors: iflytekThemeColors,
  sizes: iconSizes,
  icons: interviewSystemIcons,
  styles: iconStyleClasses,
  breakpoints: responsiveBreakpoints,
  guidelines: iconUsageGuidelines,
  accessibility: accessibilityConfig,
  tips: optimizationTips
}
