/**
 * Motion Shake 指令
 * 为元素添加震动动画效果
 */

const shakeAnimation = `
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
  20%, 40%, 60%, 80% { transform: translateX(2px); }
}

@keyframes shake-vertical {
  0%, 100% { transform: translateY(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateY(-2px); }
  20%, 40%, 60%, 80% { transform: translateY(2px); }
}

@keyframes shake-rotate {
  0%, 100% { transform: rotate(0deg); }
  10%, 30%, 50%, 70%, 90% { transform: rotate(-1deg); }
  20%, 40%, 60%, 80% { transform: rotate(1deg); }
}

.motion-shake-horizontal {
  animation: shake 0.5s ease-in-out;
}

.motion-shake-vertical {
  animation: shake-vertical 0.5s ease-in-out;
}

.motion-shake-rotate {
  animation: shake-rotate 0.5s ease-in-out;
}

.motion-shake-intense {
  animation: shake 0.3s ease-in-out;
}

.motion-shake-gentle {
  animation: shake 0.8s ease-in-out;
}
`

// 注入样式
const injectStyles = () => {
  if (!document.getElementById('motion-shake-styles')) {
    const style = document.createElement('style')
    style.id = 'motion-shake-styles'
    style.textContent = shakeAnimation
    document.head.appendChild(style)
  }
}

const triggerShake = (el, options = {}) => {
  const {
    type = 'horizontal',
    intensity = 'normal',
    duration = 500,
    trigger = 'manual'
  } = options
  
  // 移除之前的动画类
  el.classList.remove(
    'motion-shake-horizontal',
    'motion-shake-vertical', 
    'motion-shake-rotate',
    'motion-shake-intense',
    'motion-shake-gentle'
  )
  
  // 确定动画类名
  let shakeClass = 'motion-shake-horizontal'
  
  if (type === 'vertical') {
    shakeClass = 'motion-shake-vertical'
  } else if (type === 'rotate') {
    shakeClass = 'motion-shake-rotate'
  }
  
  if (intensity === 'intense') {
    shakeClass = 'motion-shake-intense'
  } else if (intensity === 'gentle') {
    shakeClass = 'motion-shake-gentle'
  }
  
  // 添加动画类
  el.classList.add(shakeClass)
  
  // 动画结束后移除类
  const removeAnimation = () => {
    el.classList.remove(shakeClass)
    el.removeEventListener('animationend', removeAnimation)
  }
  
  el.addEventListener('animationend', removeAnimation)
  
  // 备用清理机制
  setTimeout(() => {
    if (el.classList.contains(shakeClass)) {
      el.classList.remove(shakeClass)
    }
  }, duration + 100)
}

const motionShakeDirective = {
  mounted(el, binding) {
    // 注入样式
    injectStyles()
    
    const options = typeof binding.value === 'object' ? binding.value : {}
    const trigger = options.trigger || binding.arg || 'click'
    
    // 存储配置
    el._shakeOptions = options
    
    if (trigger === 'hover') {
      const hoverHandler = () => triggerShake(el, options)
      el.addEventListener('mouseenter', hoverHandler)
      el._shakeHandler = hoverHandler
      el._shakeTrigger = 'mouseenter'
    } else if (trigger === 'focus') {
      const focusHandler = () => triggerShake(el, options)
      el.addEventListener('focus', focusHandler)
      el._shakeHandler = focusHandler
      el._shakeTrigger = 'focus'
    } else if (trigger === 'click') {
      const clickHandler = () => triggerShake(el, options)
      el.addEventListener('click', clickHandler)
      el._shakeHandler = clickHandler
      el._shakeTrigger = 'click'
    } else if (trigger === 'error') {
      // 错误触发，通常通过程序调用
      el._shakeOnError = true
    } else if (trigger === 'auto' || trigger === 'immediate') {
      // 立即触发
      setTimeout(() => triggerShake(el, options), 100)
    }
    
    // 提供手动触发方法
    el.shake = () => triggerShake(el, options)
  },
  
  updated(el, binding) {
    const newOptions = typeof binding.value === 'object' ? binding.value : {}
    el._shakeOptions = { ...el._shakeOptions, ...newOptions }
  },
  
  unmounted(el) {
    // 清理事件监听器
    if (el._shakeHandler && el._shakeTrigger) {
      el.removeEventListener(el._shakeTrigger, el._shakeHandler)
    }
    
    // 清理属性
    delete el._shakeOptions
    delete el._shakeHandler
    delete el._shakeTrigger
    delete el._shakeOnError
    delete el.shake
    
    // 移除动画类
    el.classList.remove(
      'motion-shake-horizontal',
      'motion-shake-vertical',
      'motion-shake-rotate',
      'motion-shake-intense',
      'motion-shake-gentle'
    )
  }
}

export default motionShakeDirective

// 导出触发函数供外部使用
export { triggerShake }
