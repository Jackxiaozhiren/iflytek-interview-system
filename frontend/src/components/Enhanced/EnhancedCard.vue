<template>
  <div 
    class="enhanced-card"
    :class="[
      `enhanced-card--${variant}`,
      `enhanced-card--${size}`,
      {
        'enhanced-card--hoverable': hoverable,
        'enhanced-card--loading': loading,
        'enhanced-card--interactive': interactive
      }
    ]"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- 加载状态 -->
    <div v-if="loading" class="enhanced-card__loading">
      <div class="loading-spinner"></div>
      <span class="loading-text">{{ loadingText }}</span>
    </div>
    
    <!-- 卡片头部 -->
    <div v-if="$slots.header || title" class="enhanced-card__header">
      <slot name="header">
        <div class="enhanced-card__title">
          <el-icon v-if="icon" class="enhanced-card__icon">
            <component :is="icon" />
          </el-icon>
          <h3>{{ title }}</h3>
        </div>
        <div v-if="$slots.extra" class="enhanced-card__extra">
          <slot name="extra"></slot>
        </div>
      </slot>
    </div>
    
    <!-- 卡片内容 -->
    <div class="enhanced-card__body">
      <slot></slot>
    </div>
    
    <!-- 卡片底部 -->
    <div v-if="$slots.footer" class="enhanced-card__footer">
      <slot name="footer"></slot>
    </div>
    
    <!-- 悬浮效果背景 -->
    <div class="enhanced-card__glow" :style="glowStyle"></div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'EnhancedCard',
  props: {
    title: {
      type: String,
      default: ''
    },
    icon: {
      type: [String, Object],
      default: null
    },
    variant: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'primary', 'success', 'warning', 'error', 'gradient'].includes(value)
    },
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    },
    hoverable: {
      type: Boolean,
      default: true
    },
    interactive: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    loadingText: {
      type: String,
      default: '加载中...'
    }
  },
  emits: ['click', 'mouseenter', 'mouseleave'],
  setup(props, { emit }) {
    const isHovered = ref(false)
    
    const glowStyle = computed(() => {
      if (!isHovered.value || !props.hoverable) return {}
      
      const colors = {
        default: 'rgba(24, 144, 255, 0.1)',
        primary: 'rgba(24, 144, 255, 0.15)',
        success: 'rgba(82, 196, 26, 0.15)',
        warning: 'rgba(250, 173, 20, 0.15)',
        error: 'rgba(255, 77, 79, 0.15)',
        gradient: 'rgba(76, 81, 191, 0.15)'
      }
      
      return {
        background: `radial-gradient(circle at center, ${colors[props.variant]} 0%, transparent 70%)`
      }
    })
    
    const handleClick = (event) => {
      if (!props.loading) {
        emit('click', event)
      }
    }
    
    const handleMouseEnter = (event) => {
      isHovered.value = true
      emit('mouseenter', event)
    }
    
    const handleMouseLeave = (event) => {
      isHovered.value = false
      emit('mouseleave', event)
    }
    
    return {
      isHovered,
      glowStyle,
      handleClick,
      handleMouseEnter,
      handleMouseLeave
    }
  }
}
</script>

<style scoped>
.enhanced-card {
  position: relative;
  background: var(--bg-primary);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-base);
  overflow: hidden;
  transition: all var(--transition-base);
  border: 1px solid var(--border-light);
}

/* 尺寸变体 */
.enhanced-card--small {
  padding: var(--spacing-sm);
}

.enhanced-card--medium {
  padding: var(--spacing-base);
}

.enhanced-card--large {
  padding: var(--spacing-lg);
}

/* 颜色变体 */
.enhanced-card--primary {
  border-color: var(--primary-color);
}

.enhanced-card--success {
  border-color: var(--success-color);
}

.enhanced-card--warning {
  border-color: var(--warning-color);
}

.enhanced-card--error {
  border-color: var(--error-color);
}

.enhanced-card--gradient {
  background: var(--gradient-tech);
  color: white;
}

/* 悬浮效果 */
.enhanced-card--hoverable:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.enhanced-card--interactive {
  cursor: pointer;
}

.enhanced-card--interactive:active {
  transform: translateY(-2px);
}

/* 加载状态 */
.enhanced-card--loading {
  pointer-events: none;
  opacity: 0.7;
}

.enhanced-card__loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  z-index: 10;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border-light);
  border-top: 3px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: var(--spacing-sm);
}

.loading-text {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 头部样式 */
.enhanced-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-base);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--border-light);
}

.enhanced-card__title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.enhanced-card__title h3 {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.enhanced-card__icon {
  font-size: var(--font-size-xl);
  color: var(--primary-color);
}

/* 内容区域 */
.enhanced-card__body {
  flex: 1;
}

/* 底部样式 */
.enhanced-card__footer {
  margin-top: var(--spacing-base);
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--border-light);
}

/* 发光效果 */
.enhanced-card__glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--transition-base);
}

.enhanced-card--hoverable:hover .enhanced-card__glow {
  opacity: 1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .enhanced-card--large {
    padding: var(--spacing-base);
  }
  
  .enhanced-card__header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
}
</style>
