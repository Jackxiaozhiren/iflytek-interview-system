/**
 * 涟漪效果指令
 * 为按钮和可点击元素添加Material Design风格的涟漪效果
 */

// 创建涟漪元素
const createRipple = (event, element, options = {}) => {
  const {
    color = 'rgba(255, 255, 255, 0.3)',
    duration = 600,
    size = 'auto'
  } = options

  // 获取元素位置和尺寸
  const rect = element.getBoundingClientRect()
  const rippleSize = size === 'auto' 
    ? Math.max(rect.width, rect.height) * 1.5
    : size

  // 计算涟漪起始位置
  const x = event.clientX - rect.left - rippleSize / 2
  const y = event.clientY - rect.top - rippleSize / 2

  // 创建涟漪元素
  const ripple = document.createElement('span')
  ripple.className = 'ripple-effect'
  ripple.style.cssText = `
    position: absolute;
    border-radius: 50%;
    background: ${color};
    width: ${rippleSize}px;
    height: ${rippleSize}px;
    left: ${x}px;
    top: ${y}px;
    transform: scale(0);
    animation: ripple-animation ${duration}ms ease-out;
    pointer-events: none;
    z-index: 1000;
  `

  // 添加到元素中
  element.appendChild(ripple)

  // 动画结束后移除元素
  setTimeout(() => {
    if (ripple.parentNode) {
      ripple.parentNode.removeChild(ripple)
    }
  }, duration)
}

// 添加涟漪动画样式
const addRippleStyles = () => {
  if (document.getElementById('ripple-styles')) return

  const style = document.createElement('style')
  style.id = 'ripple-styles'
  style.textContent = `
    @keyframes ripple-animation {
      0% {
        transform: scale(0);
        opacity: 1;
      }
      50% {
        transform: scale(0.5);
        opacity: 0.8;
      }
      100% {
        transform: scale(1);
        opacity: 0;
      }
    }
    
    .ripple-container {
      position: relative;
      overflow: hidden;
    }
    
    .ripple-effect {
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      z-index: 1000;
    }
    
    /* 为不同类型的元素提供默认涟漪颜色 */
    .el-button--primary .ripple-effect {
      background: rgba(255, 255, 255, 0.3);
    }
    
    .el-button--success .ripple-effect {
      background: rgba(255, 255, 255, 0.3);
    }
    
    .el-button--warning .ripple-effect {
      background: rgba(255, 255, 255, 0.3);
    }
    
    .el-button--danger .ripple-effect {
      background: rgba(255, 255, 255, 0.3);
    }
    
    .el-button--info .ripple-effect {
      background: rgba(255, 255, 255, 0.3);
    }
    
    .el-button--text .ripple-effect {
      background: rgba(0, 102, 204, 0.2);
    }
    
    .el-card .ripple-effect {
      background: rgba(0, 102, 204, 0.1);
    }
    
    .el-tag .ripple-effect {
      background: rgba(255, 255, 255, 0.4);
    }
    
    /* 深色主题支持 */
    .dark .ripple-effect {
      background: rgba(255, 255, 255, 0.2);
    }
    
    /* 高对比度模式支持 */
    @media (prefers-contrast: high) {
      .ripple-effect {
        background: rgba(0, 0, 0, 0.3) !important;
      }
    }
    
    /* 减少动画模式支持 */
    @media (prefers-reduced-motion: reduce) {
      .ripple-effect {
        animation: none !important;
        opacity: 0 !important;
      }
    }
  `
  
  document.head.appendChild(style)
}

// 涟漪指令定义
const rippleDirective = {
  // 元素挂载时
  mounted(el, binding) {
    // 添加样式
    addRippleStyles()
    
    // 确保元素有相对定位
    if (getComputedStyle(el).position === 'static') {
      el.style.position = 'relative'
    }
    
    // 确保元素有overflow: hidden
    el.style.overflow = 'hidden'
    
    // 添加涟漪容器类
    el.classList.add('ripple-container')
    
    // 获取配置选项
    const options = binding.value || {}
    
    // 创建事件处理函数
    const handleClick = (event) => {
      // 检查是否禁用涟漪效果
      if (el.disabled || el.classList.contains('is-disabled')) {
        return
      }
      
      // 检查是否在减少动画模式下
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return
      }
      
      // 创建涟漪效果
      createRipple(event, el, options)
    }
    
    // 绑定事件
    el.addEventListener('click', handleClick)
    
    // 存储事件处理函数以便后续移除
    el._rippleHandler = handleClick
  },
  
  // 元素更新时
  updated(el, binding) {
    // 更新配置选项
    const options = binding.value || {}
    
    // 如果配置发生变化，更新事件处理函数
    if (JSON.stringify(binding.value) !== JSON.stringify(binding.oldValue)) {
      // 移除旧的事件处理函数
      if (el._rippleHandler) {
        el.removeEventListener('click', el._rippleHandler)
      }
      
      // 创建新的事件处理函数
      const handleClick = (event) => {
        if (el.disabled || el.classList.contains('is-disabled')) {
          return
        }
        
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          return
        }
        
        createRipple(event, el, options)
      }
      
      // 绑定新的事件处理函数
      el.addEventListener('click', handleClick)
      el._rippleHandler = handleClick
    }
  },
  
  // 元素卸载时
  unmounted(el) {
    // 移除事件监听器
    if (el._rippleHandler) {
      el.removeEventListener('click', el._rippleHandler)
      delete el._rippleHandler
    }
    
    // 移除涟漪容器类
    el.classList.remove('ripple-container')
    
    // 清理所有涟漪元素
    const ripples = el.querySelectorAll('.ripple-effect')
    ripples.forEach(ripple => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple)
      }
    })
  }
}

// 预设配置
export const ripplePresets = {
  // 主要按钮
  primary: {
    color: 'rgba(255, 255, 255, 0.3)',
    duration: 600
  },
  
  // 次要按钮
  secondary: {
    color: 'rgba(0, 102, 204, 0.2)',
    duration: 500
  },
  
  // 卡片
  card: {
    color: 'rgba(0, 102, 204, 0.1)',
    duration: 800
  },
  
  // 快速涟漪
  fast: {
    color: 'rgba(255, 255, 255, 0.4)',
    duration: 300
  },
  
  // 慢速涟漪
  slow: {
    color: 'rgba(255, 255, 255, 0.2)',
    duration: 1000
  },
  
  // 大尺寸涟漪
  large: {
    color: 'rgba(255, 255, 255, 0.3)',
    duration: 800,
    size: 200
  },
  
  // 小尺寸涟漪
  small: {
    color: 'rgba(255, 255, 255, 0.4)',
    duration: 400,
    size: 50
  }
}

// 工具函数：手动触发涟漪效果
export const triggerRipple = (element, x, y, options = {}) => {
  const event = {
    clientX: x,
    clientY: y
  }
  createRipple(event, element, options)
}

// 工具函数：为元素添加涟漪效果
export const addRippleToElement = (element, options = {}) => {
  addRippleStyles()
  
  if (getComputedStyle(element).position === 'static') {
    element.style.position = 'relative'
  }
  
  element.style.overflow = 'hidden'
  element.classList.add('ripple-container')
  
  const handleClick = (event) => {
    if (element.disabled || element.classList.contains('is-disabled')) {
      return
    }
    
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }
    
    createRipple(event, element, options)
  }
  
  element.addEventListener('click', handleClick)
  
  return () => {
    element.removeEventListener('click', handleClick)
    element.classList.remove('ripple-container')
  }
}

export default rippleDirective
