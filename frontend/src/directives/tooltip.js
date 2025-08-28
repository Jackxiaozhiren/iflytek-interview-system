/**
 * Tooltip 指令
 * 为元素添加简单的 tooltip 功能
 */

let tooltipInstance = null

const createTooltip = (text) => {
  const tooltip = document.createElement('div')
  tooltip.className = 'custom-tooltip'
  tooltip.textContent = text
  tooltip.style.cssText = `
    position: absolute;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    z-index: 9999;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s ease;
    font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
  `
  document.body.appendChild(tooltip)
  return tooltip
}

const showTooltip = (el, text, event) => {
  if (tooltipInstance) {
    hideTooltip()
  }
  
  tooltipInstance = createTooltip(text)
  
  const rect = el.getBoundingClientRect()
  const tooltipRect = tooltipInstance.getBoundingClientRect()
  
  let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2)
  let top = rect.top - tooltipRect.height - 8
  
  // 边界检查
  if (left < 8) left = 8
  if (left + tooltipRect.width > window.innerWidth - 8) {
    left = window.innerWidth - tooltipRect.width - 8
  }
  if (top < 8) {
    top = rect.bottom + 8
  }
  
  tooltipInstance.style.left = left + 'px'
  tooltipInstance.style.top = top + 'px'
  
  // 显示动画
  requestAnimationFrame(() => {
    if (tooltipInstance) {
      tooltipInstance.style.opacity = '1'
    }
  })
}

const hideTooltip = () => {
  if (tooltipInstance) {
    tooltipInstance.style.opacity = '0'
    setTimeout(() => {
      if (tooltipInstance && tooltipInstance.parentNode) {
        tooltipInstance.parentNode.removeChild(tooltipInstance)
      }
      tooltipInstance = null
    }, 200)
  }
}

const tooltipDirective = {
  mounted(el, binding) {
    const text = binding.value || binding.arg || el.getAttribute('title')
    if (!text) return
    
    // 移除原生 title 属性避免冲突
    el.removeAttribute('title')
    
    const showHandler = (event) => showTooltip(el, text, event)
    const hideHandler = () => hideTooltip()
    
    el.addEventListener('mouseenter', showHandler)
    el.addEventListener('mouseleave', hideHandler)
    el.addEventListener('focus', showHandler)
    el.addEventListener('blur', hideHandler)
    
    // 存储事件处理器以便清理
    el._tooltipHandlers = {
      show: showHandler,
      hide: hideHandler
    }
  },
  
  updated(el, binding) {
    // 更新 tooltip 文本
    const text = binding.value || binding.arg
    if (text && el._tooltipText !== text) {
      el._tooltipText = text
    }
  },
  
  unmounted(el) {
    // 清理事件监听器
    if (el._tooltipHandlers) {
      el.removeEventListener('mouseenter', el._tooltipHandlers.show)
      el.removeEventListener('mouseleave', el._tooltipHandlers.hide)
      el.removeEventListener('focus', el._tooltipHandlers.show)
      el.removeEventListener('blur', el._tooltipHandlers.hide)
      delete el._tooltipHandlers
    }
    
    // 如果当前元素的 tooltip 正在显示，隐藏它
    if (tooltipInstance) {
      hideTooltip()
    }
  }
}

export default tooltipDirective
