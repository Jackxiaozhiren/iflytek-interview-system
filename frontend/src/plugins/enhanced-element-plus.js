/**
 * Element Plus组件动效增强插件
 * 为Element Plus组件添加统一的动画主题和微交互
 */

// 全局动画配置
const ANIMATION_CONFIG = {
  duration: {
    fast: '0.2s',
    normal: '0.3s',
    slow: '0.5s'
  },
  easing: {
    ease: 'ease',
    easeInOut: 'ease-in-out',
    easeOut: 'ease-out',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  },
  colors: {
    primary: '#0066cc',
    secondary: '#4c51bf',
    tertiary: '#764ba2',
    success: '#2d7d32',
    warning: '#bf8f00',
    danger: '#c53030'
  }
}

// 微交互动画类
const MICRO_INTERACTIONS = {
  // 按钮微交互
  button: {
    hover: 'transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);',
    active: 'transform: translateY(0px); box-shadow: 0 2px 6px rgba(0, 102, 204, 0.2);',
    focus: 'outline: 3px solid rgba(0, 102, 204, 0.3); outline-offset: 2px;'
  },
  
  // 输入框微交互
  input: {
    focus: 'border-color: #0066cc; box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);',
    error: 'border-color: #c53030; box-shadow: 0 0 0 3px rgba(197, 48, 48, 0.1);'
  },
  
  // 卡片微交互
  card: {
    hover: 'transform: translateY(-4px); box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);',
    active: 'transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);'
  },
  
  // 标签微交互
  tag: {
    hover: 'transform: scale(1.05); box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);'
  }
}

// 创建动画样式
const createAnimationStyles = () => {
  const style = document.createElement('style')
  style.id = 'enhanced-element-plus-animations'
  
  style.textContent = `
    /* Element Plus 按钮增强 */
    .el-button {
      transition: all ${ANIMATION_CONFIG.duration.normal} ${ANIMATION_CONFIG.easing.easeOut};
      position: relative;
      overflow: hidden;
      font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
      font-weight: 500;
    }
    
    .el-button:hover {
      ${MICRO_INTERACTIONS.button.hover}
    }
    
    .el-button:active {
      ${MICRO_INTERACTIONS.button.active}
    }
    
    .el-button:focus {
      ${MICRO_INTERACTIONS.button.focus}
    }
    
    /* 按钮涟漪效果 */
    .el-button::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      transition: width 0.3s, height 0.3s;
      pointer-events: none;
    }
    
    .el-button:active::after {
      width: 200px;
      height: 200px;
    }
    
    /* Element Plus 输入框增强 */
    .el-input__wrapper {
      transition: all ${ANIMATION_CONFIG.duration.normal} ${ANIMATION_CONFIG.easing.easeOut};
      border-radius: 8px;
    }
    
    .el-input__wrapper:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .el-input.is-focus .el-input__wrapper {
      ${MICRO_INTERACTIONS.input.focus}
    }
    
    .el-input.is-error .el-input__wrapper {
      ${MICRO_INTERACTIONS.input.error}
    }
    
    /* Element Plus 卡片增强 */
    .el-card {
      transition: all ${ANIMATION_CONFIG.duration.normal} ${ANIMATION_CONFIG.easing.easeOut};
      border-radius: 12px;
      border: 1px solid #e2e8f0;
    }
    
    .el-card.is-hoverable:hover {
      ${MICRO_INTERACTIONS.card.hover}
    }
    
    .el-card.is-hoverable:active {
      ${MICRO_INTERACTIONS.card.active}
    }
    
    /* Element Plus 标签增强 */
    .el-tag {
      transition: all ${ANIMATION_CONFIG.duration.normal} ${ANIMATION_CONFIG.easing.easeOut};
      border-radius: 16px;
      font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
      font-weight: 500;
    }
    
    .el-tag:hover {
      ${MICRO_INTERACTIONS.tag.hover}
    }
    
    /* Element Plus 消息提示增强 */
    .el-message {
      animation: messageSlideIn ${ANIMATION_CONFIG.duration.normal} ${ANIMATION_CONFIG.easing.bounce};
      border-radius: 12px;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      backdrop-filter: blur(10px);
      font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
    }
    
    @keyframes messageSlideIn {
      0% {
        opacity: 0;
        transform: translateY(-20px) scale(0.9);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    
    /* Element Plus 对话框增强 */
    .el-dialog {
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(10px);
    }
    
    .el-dialog__header {
      background: linear-gradient(135deg, #0066cc 0%, #4c51bf 100%);
      color: white;
      border-radius: 16px 16px 0 0;
      padding: 20px 30px;
    }
    
    .el-dialog__title {
      font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
      font-weight: 600;
      color: white;
    }
    
    .el-dialog__headerbtn .el-dialog__close {
      color: white;
      font-size: 18px;
    }
    
    /* Element Plus 表格增强 */
    .el-table {
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }
    
    .el-table th {
      background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
      font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
      font-weight: 600;
      color: #2d3748;
    }
    
    .el-table tr:hover {
      background: rgba(0, 102, 204, 0.05);
      transition: background ${ANIMATION_CONFIG.duration.fast} ${ANIMATION_CONFIG.easing.easeOut};
    }
    
    /* Element Plus 分页增强 */
    .el-pagination {
      font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
    }
    
    .el-pagination .el-pager li {
      transition: all ${ANIMATION_CONFIG.duration.normal} ${ANIMATION_CONFIG.easing.easeOut};
      border-radius: 8px;
      margin: 0 2px;
    }
    
    .el-pagination .el-pager li:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
    }
    
    /* Element Plus 标签页增强 */
    .el-tabs__item {
      transition: all ${ANIMATION_CONFIG.duration.normal} ${ANIMATION_CONFIG.easing.easeOut};
      font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
      font-weight: 500;
      border-radius: 8px 8px 0 0;
      margin: 0 2px;
    }
    
    .el-tabs__item:hover {
      background: rgba(0, 102, 204, 0.1);
      transform: translateY(-2px);
    }
    
    .el-tabs__item.is-active {
      background: linear-gradient(135deg, #0066cc 0%, #4c51bf 100%);
      color: white;
      font-weight: 600;
    }
    
    /* Element Plus 进度条增强 */
    .el-progress-bar__outer {
      border-radius: 10px;
      overflow: hidden;
    }
    
    .el-progress-bar__inner {
      background: linear-gradient(90deg, #0066cc 0%, #4c51bf 100%);
      border-radius: 10px;
      transition: width ${ANIMATION_CONFIG.duration.normal} ${ANIMATION_CONFIG.easing.easeOut};
    }
    
    /* Element Plus 开关增强 */
    .el-switch {
      transition: all ${ANIMATION_CONFIG.duration.normal} ${ANIMATION_CONFIG.easing.easeOut};
    }
    
    .el-switch:hover {
      transform: scale(1.05);
    }
    
    .el-switch.is-checked .el-switch__core {
      background: linear-gradient(90deg, #0066cc 0%, #4c51bf 100%);
    }
    
    /* Element Plus 滑块增强 */
    .el-slider__runway {
      border-radius: 10px;
    }
    
    .el-slider__bar {
      background: linear-gradient(90deg, #0066cc 0%, #4c51bf 100%);
      border-radius: 10px;
    }
    
    .el-slider__button {
      border: 3px solid #0066cc;
      box-shadow: 0 2px 8px rgba(0, 102, 204, 0.3);
      transition: all ${ANIMATION_CONFIG.duration.normal} ${ANIMATION_CONFIG.easing.easeOut};
    }
    
    .el-slider__button:hover {
      transform: scale(1.2);
      box-shadow: 0 4px 15px rgba(0, 102, 204, 0.4);
    }
    
    /* Element Plus 加载增强 */
    .el-loading-mask {
      backdrop-filter: blur(10px);
      background: rgba(255, 255, 255, 0.8);
    }
    
    .el-loading-spinner {
      animation: loadingPulse 1.5s ease-in-out infinite;
    }
    
    @keyframes loadingPulse {
      0%, 100% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.1);
        opacity: 0.8;
      }
    }
    
    /* 全局字体优化 */
    .el-button,
    .el-input,
    .el-select,
    .el-table,
    .el-dialog,
    .el-message,
    .el-notification,
    .el-tabs,
    .el-tag {
      font-family: 'Microsoft YaHei', 'SimHei', sans-serif !important;
    }
    
    /* WCAG 2.1 AA 对比度优化 */
    .el-button--primary {
      background: linear-gradient(135deg, #0066cc 0%, #4c51bf 100%);
      border-color: #0066cc;
      color: #ffffff;
    }
    
    .el-button--success {
      background: linear-gradient(135deg, #2d7d32 0%, #388e3c 100%);
      border-color: #2d7d32;
      color: #ffffff;
    }
    
    .el-button--warning {
      background: linear-gradient(135deg, #bf8f00 0%, #f57c00 100%);
      border-color: #bf8f00;
      color: #ffffff;
    }
    
    .el-button--danger {
      background: linear-gradient(135deg, #c53030 0%, #e53e3e 100%);
      border-color: #c53030;
      color: #ffffff;
    }
    
    /* 动画性能优化 */
    @media (prefers-reduced-motion: reduce) {
      .el-button,
      .el-input__wrapper,
      .el-card,
      .el-tag,
      .el-table tr,
      .el-pagination .el-pager li,
      .el-tabs__item,
      .el-switch,
      .el-slider__button {
        transition: none !important;
        animation: none !important;
      }
    }
  `
  
  return style
}

// 键盘快捷键支持
const setupKeyboardShortcuts = () => {
  document.addEventListener('keydown', (event) => {
    // Ctrl + Enter: 提交表单
    if (event.ctrlKey && event.key === 'Enter') {
      const submitButton = document.querySelector('.el-button--primary[type="submit"], .el-button--primary[native-type="submit"]')
      if (submitButton && !submitButton.disabled) {
        submitButton.click()
        event.preventDefault()
      }
    }
    
    // Escape: 关闭对话框/抽屉
    if (event.key === 'Escape') {
      const closeButton = document.querySelector('.el-dialog__close, .el-drawer__close-btn')
      if (closeButton) {
        closeButton.click()
        event.preventDefault()
      }
    }
    
    // Tab: 焦点管理增强
    if (event.key === 'Tab') {
      const focusableElements = document.querySelectorAll(
        '.el-button:not([disabled]), .el-input:not([disabled]) input, .el-select:not([disabled]), .el-checkbox:not([disabled]), .el-radio:not([disabled])'
      )
      
      // 添加焦点指示器
      focusableElements.forEach(el => {
        el.addEventListener('focus', () => {
          el.style.outline = '3px solid rgba(0, 102, 204, 0.3)'
          el.style.outlineOffset = '2px'
        })
        
        el.addEventListener('blur', () => {
          el.style.outline = 'none'
        })
      })
    }
  })
}

// 消息提示增强
const enhanceMessages = () => {
  // 重写 ElMessage 方法
  const originalMessage = window.ElMessage || {}
  
  const enhancedMessage = {
    success: (message, options = {}) => {
      return originalMessage.success({
        message,
        duration: 3000,
        showClose: true,
        ...options
      })
    },
    
    error: (message, options = {}) => {
      return originalMessage.error({
        message,
        duration: 5000,
        showClose: true,
        ...options
      })
    },
    
    warning: (message, options = {}) => {
      return originalMessage.warning({
        message,
        duration: 4000,
        showClose: true,
        ...options
      })
    },
    
    info: (message, options = {}) => {
      return originalMessage.info({
        message,
        duration: 3000,
        showClose: true,
        ...options
      })
    }
  }
  
  // 替换全局 ElMessage
  if (window.ElMessage) {
    Object.assign(window.ElMessage, enhancedMessage)
  }
}

// 表单验证增强
const enhanceFormValidation = () => {
  // 监听表单验证事件
  document.addEventListener('input', (event) => {
    const input = event.target
    if (input.classList.contains('el-input__inner')) {
      const wrapper = input.closest('.el-input__wrapper')
      if (wrapper) {
        // 添加实时验证反馈
        wrapper.style.transition = 'all 0.3s ease'
        
        if (input.validity.valid) {
          wrapper.style.borderColor = '#2d7d32'
          wrapper.style.boxShadow = '0 0 0 3px rgba(45, 125, 50, 0.1)'
        } else if (input.value) {
          wrapper.style.borderColor = '#c53030'
          wrapper.style.boxShadow = '0 0 0 3px rgba(197, 48, 48, 0.1)'
        }
      }
    }
  })
}

// 插件安装函数
export const enhancedElementPlus = {
  install(app) {
    // 添加动画样式
    const styleElement = createAnimationStyles()
    document.head.appendChild(styleElement)
    
    // 设置键盘快捷键
    setupKeyboardShortcuts()
    
    // 增强消息提示
    enhanceMessages()
    
    // 增强表单验证
    enhanceFormValidation()
    
    // 提供全局配置
    app.config.globalProperties.$enhancedElementPlus = {
      config: ANIMATION_CONFIG,
      interactions: MICRO_INTERACTIONS
    }
    
    console.log('🎨 Enhanced Element Plus 插件已加载')
  }
}

export default enhancedElementPlus
