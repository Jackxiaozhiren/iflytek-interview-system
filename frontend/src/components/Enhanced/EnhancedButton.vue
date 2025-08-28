<template>
  <button
    class="enhanced-button"
    :class="[
      `enhanced-button--${type}`,
      `enhanced-button--${size}`,
      {
        'enhanced-button--loading': loading,
        'enhanced-button--disabled': disabled,
        'enhanced-button--block': block,
        'enhanced-button--round': round,
        'enhanced-button--gradient': gradient
      }
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- 加载图标 -->
    <span v-if="loading" class="enhanced-button__loading">
      <div class="loading-spinner"></div>
    </span>
    
    <!-- 前置图标 -->
    <el-icon v-if="prefixIcon && !loading" class="enhanced-button__prefix-icon">
      <component :is="prefixIcon" />
    </el-icon>
    
    <!-- 按钮文本 -->
    <span class="enhanced-button__text">
      <slot></slot>
    </span>
    
    <!-- 后置图标 -->
    <el-icon v-if="suffixIcon && !loading" class="enhanced-button__suffix-icon">
      <component :is="suffixIcon" />
    </el-icon>
    
    <!-- 波纹效果 -->
    <div class="enhanced-button__ripple" ref="rippleRef"></div>
  </button>
</template>

<script>
import { ref, nextTick } from 'vue'

export default {
  name: 'EnhancedButton',
  props: {
    type: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'primary', 'success', 'warning', 'danger', 'info', 'text'].includes(value)
    },
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    block: {
      type: Boolean,
      default: false
    },
    round: {
      type: Boolean,
      default: false
    },
    gradient: {
      type: Boolean,
      default: false
    },
    prefixIcon: {
      type: [String, Object],
      default: null
    },
    suffixIcon: {
      type: [String, Object],
      default: null
    }
  },
  emits: ['click'],
  setup(props, { emit }) {
    const rippleRef = ref(null)
    
    const handleClick = (event) => {
      if (!props.disabled && !props.loading) {
        createRipple(event)
        emit('click', event)
      }
    }
    
    const handleMouseEnter = () => {
      // 可以添加鼠标悬浮效果
    }
    
    const handleMouseLeave = () => {
      // 可以添加鼠标离开效果
    }
    
    const createRipple = async (event) => {
      const button = event.currentTarget
      const ripple = rippleRef.value
      
      if (!ripple) return
      
      const rect = button.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = event.clientX - rect.left - size / 2
      const y = event.clientY - rect.top - size / 2
      
      // 清除之前的波纹
      ripple.style.width = '0'
      ripple.style.height = '0'
      ripple.style.opacity = '0.6'
      
      await nextTick()
      
      // 创建新的波纹
      ripple.style.width = size + 'px'
      ripple.style.height = size + 'px'
      ripple.style.left = x + 'px'
      ripple.style.top = y + 'px'
      ripple.style.opacity = '0.6'
      
      // 动画结束后清除
      setTimeout(() => {
        ripple.style.opacity = '0'
      }, 300)
    }
    
    return {
      rippleRef,
      handleClick,
      handleMouseEnter,
      handleMouseLeave
    }
  }
}
</script>

<style scoped>
.enhanced-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-base);
  border: 1px solid transparent;
  border-radius: var(--border-radius-base);
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  transition: all var(--transition-base);
  overflow: hidden;
  outline: none;
}

/* 尺寸变体 */
.enhanced-button--small {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-sm);
  border-radius: var(--border-radius-sm);
}

.enhanced-button--medium {
  padding: var(--spacing-sm) var(--spacing-base);
  font-size: var(--font-size-base);
}

.enhanced-button--large {
  padding: var(--spacing-base) var(--spacing-lg);
  font-size: var(--font-size-lg);
  border-radius: var(--border-radius-lg);
}

/* 类型变体 */
.enhanced-button--default {
  background-color: var(--bg-primary);
  border-color: var(--border-base);
  color: var(--text-primary);
}

.enhanced-button--default:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.enhanced-button--primary {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.enhanced-button--primary:hover {
  background-color: var(--primary-light);
  border-color: var(--primary-light);
}

.enhanced-button--success {
  background-color: var(--success-color);
  border-color: var(--success-color);
  color: white;
}

.enhanced-button--success:hover {
  background-color: var(--success-light);
  border-color: var(--success-light);
}

.enhanced-button--warning {
  background-color: var(--warning-color);
  border-color: var(--warning-color);
  color: white;
}

.enhanced-button--warning:hover {
  background-color: var(--warning-light);
  border-color: var(--warning-light);
}

.enhanced-button--danger {
  background-color: var(--error-color);
  border-color: var(--error-color);
  color: white;
}

.enhanced-button--danger:hover {
  background-color: var(--error-light);
  border-color: var(--error-light);
}

.enhanced-button--info {
  background-color: #1890ff;
  border-color: #1890ff;
  color: white;
}

.enhanced-button--text {
  background-color: transparent;
  border-color: transparent;
  color: var(--primary-color);
}

.enhanced-button--text:hover {
  background-color: rgba(24, 144, 255, 0.1);
}

/* 渐变效果 */
.enhanced-button--gradient.enhanced-button--primary {
  background: var(--gradient-primary);
  border: none;
}

.enhanced-button--gradient.enhanced-button--success {
  background: var(--gradient-success);
  border: none;
}

/* 状态变体 */
.enhanced-button--loading {
  pointer-events: none;
}

.enhanced-button--disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

.enhanced-button--block {
  width: 100%;
}

.enhanced-button--round {
  border-radius: var(--border-radius-full);
}

/* 加载状态 */
.enhanced-button__loading {
  display: inline-flex;
  align-items: center;
}

.loading-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 图标样式 */
.enhanced-button__prefix-icon,
.enhanced-button__suffix-icon {
  font-size: 1em;
}

/* 波纹效果 */
.enhanced-button__ripple {
  position: absolute;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.6);
  transform: scale(0);
  animation: ripple 0.6s linear;
  pointer-events: none;
}

@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

/* 焦点状态 */
.enhanced-button:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* 激活状态 */
.enhanced-button:active {
  transform: translateY(1px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .enhanced-button--large {
    padding: var(--spacing-sm) var(--spacing-base);
    font-size: var(--font-size-base);
  }
}
</style>
