<template>
  <div class="enhanced-progress" :class="[`enhanced-progress--${type}`, `enhanced-progress--${size}`]">
    <!-- 线性进度条 -->
    <div v-if="type === 'line'" class="enhanced-progress__line">
      <div class="enhanced-progress__track">
        <div 
          class="enhanced-progress__fill"
          :style="fillStyle"
        >
          <div v-if="showStripes" class="enhanced-progress__stripes"></div>
        </div>
      </div>
      <div v-if="showText" class="enhanced-progress__text">
        {{ displayText }}
      </div>
    </div>
    
    <!-- 圆形进度条 -->
    <div v-else-if="type === 'circle'" class="enhanced-progress__circle">
      <svg :width="circleSize" :height="circleSize" class="enhanced-progress__svg">
        <!-- 背景圆环 -->
        <circle
          :cx="circleSize / 2"
          :cy="circleSize / 2"
          :r="radius"
          class="enhanced-progress__circle-bg"
          :stroke-width="strokeWidth"
        />
        <!-- 进度圆环 -->
        <circle
          :cx="circleSize / 2"
          :cy="circleSize / 2"
          :r="radius"
          class="enhanced-progress__circle-fill"
          :stroke-width="strokeWidth"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="strokeDashoffset"
          :style="circleStyle"
        />
      </svg>
      <div v-if="showText" class="enhanced-progress__circle-text">
        {{ displayText }}
      </div>
    </div>
    
    <!-- 仪表盘进度条 -->
    <div v-else-if="type === 'dashboard'" class="enhanced-progress__dashboard">
      <svg :width="circleSize" :height="circleSize * 0.75" class="enhanced-progress__svg">
        <!-- 背景弧线 -->
        <path
          :d="dashboardPath"
          class="enhanced-progress__dashboard-bg"
          :stroke-width="strokeWidth"
        />
        <!-- 进度弧线 -->
        <path
          :d="dashboardPath"
          class="enhanced-progress__dashboard-fill"
          :stroke-width="strokeWidth"
          :stroke-dasharray="dashboardLength"
          :stroke-dashoffset="dashboardOffset"
          :style="circleStyle"
        />
      </svg>
      <div v-if="showText" class="enhanced-progress__dashboard-text">
        {{ displayText }}
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'EnhancedProgress',
  props: {
    type: {
      type: String,
      default: 'line',
      validator: (value) => ['line', 'circle', 'dashboard'].includes(value)
    },
    percentage: {
      type: Number,
      default: 0,
      validator: (value) => value >= 0 && value <= 100
    },
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    },
    status: {
      type: String,
      default: 'normal',
      validator: (value) => ['normal', 'success', 'warning', 'error'].includes(value)
    },
    showText: {
      type: Boolean,
      default: true
    },
    format: {
      type: Function,
      default: null
    },
    showStripes: {
      type: Boolean,
      default: false
    },
    animated: {
      type: Boolean,
      default: true
    },
    width: {
      type: Number,
      default: 120
    }
  },
  setup(props) {
    const circleSize = computed(() => {
      const sizes = {
        small: 80,
        medium: 120,
        large: 160
      }
      return props.width || sizes[props.size]
    })
    
    const strokeWidth = computed(() => {
      const widths = {
        small: 4,
        medium: 6,
        large: 8
      }
      return widths[props.size]
    })
    
    const radius = computed(() => {
      return (circleSize.value - strokeWidth.value) / 2
    })
    
    const circumference = computed(() => {
      return 2 * Math.PI * radius.value
    })
    
    const strokeDashoffset = computed(() => {
      return circumference.value * (1 - props.percentage / 100)
    })
    
    const dashboardPath = computed(() => {
      const cx = circleSize.value / 2
      const cy = circleSize.value / 2
      const r = radius.value
      const startAngle = -135 * (Math.PI / 180)
      const endAngle = 135 * (Math.PI / 180)
      
      const x1 = cx + r * Math.cos(startAngle)
      const y1 = cy + r * Math.sin(startAngle)
      const x2 = cx + r * Math.cos(endAngle)
      const y2 = cy + r * Math.sin(endAngle)
      
      return `M ${x1} ${y1} A ${r} ${r} 0 1 1 ${x2} ${y2}`
    })
    
    const dashboardLength = computed(() => {
      return circumference.value * 0.75 // 270度弧线
    })
    
    const dashboardOffset = computed(() => {
      return dashboardLength.value * (1 - props.percentage / 100)
    })
    
    const fillStyle = computed(() => {
      const colors = {
        normal: 'var(--primary-color)',
        success: 'var(--success-color)',
        warning: 'var(--warning-color)',
        error: 'var(--error-color)'
      }
      
      return {
        width: `${props.percentage}%`,
        backgroundColor: colors[props.status],
        transition: props.animated ? 'width 0.3s ease' : 'none'
      }
    })
    
    const circleStyle = computed(() => {
      const colors = {
        normal: 'var(--primary-color)',
        success: 'var(--success-color)',
        warning: 'var(--warning-color)',
        error: 'var(--error-color)'
      }
      
      return {
        stroke: colors[props.status],
        transition: props.animated ? 'stroke-dashoffset 0.3s ease' : 'none'
      }
    })
    
    const displayText = computed(() => {
      if (props.format && typeof props.format === 'function') {
        return props.format(props.percentage)
      }
      return `${props.percentage}%`
    })
    
    return {
      circleSize,
      strokeWidth,
      radius,
      circumference,
      strokeDashoffset,
      dashboardPath,
      dashboardLength,
      dashboardOffset,
      fillStyle,
      circleStyle,
      displayText
    }
  }
}
</script>

<style scoped>
.enhanced-progress {
  position: relative;
}

/* 线性进度条 */
.enhanced-progress__line {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.enhanced-progress__track {
  flex: 1;
  height: 8px;
  background-color: var(--bg-tertiary);
  border-radius: var(--border-radius-full);
  overflow: hidden;
  position: relative;
}

.enhanced-progress--small .enhanced-progress__track {
  height: 4px;
}

.enhanced-progress--large .enhanced-progress__track {
  height: 12px;
}

.enhanced-progress__fill {
  height: 100%;
  border-radius: var(--border-radius-full);
  position: relative;
  overflow: hidden;
}

.enhanced-progress__stripes {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.2) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.2) 75%,
    transparent 75%,
    transparent
  );
  background-size: 20px 20px;
  animation: stripes 1s linear infinite;
}

@keyframes stripes {
  0% { background-position: 0 0; }
  100% { background-position: 20px 0; }
}

.enhanced-progress__text {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  white-space: nowrap;
  min-width: 40px;
  text-align: right;
}

/* 圆形进度条 */
.enhanced-progress__circle {
  position: relative;
  display: inline-block;
}

.enhanced-progress__svg {
  transform: rotate(-90deg);
}

.enhanced-progress__circle-bg {
  fill: none;
  stroke: var(--bg-tertiary);
}

.enhanced-progress__circle-fill {
  fill: none;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.3s ease;
}

.enhanced-progress__circle-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

.enhanced-progress--small .enhanced-progress__circle-text {
  font-size: var(--font-size-sm);
}

.enhanced-progress--large .enhanced-progress__circle-text {
  font-size: var(--font-size-lg);
}

/* 仪表盘进度条 */
.enhanced-progress__dashboard {
  position: relative;
  display: inline-block;
}

.enhanced-progress__dashboard-bg {
  fill: none;
  stroke: var(--bg-tertiary);
}

.enhanced-progress__dashboard-fill {
  fill: none;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.3s ease;
}

.enhanced-progress__dashboard-text {
  position: absolute;
  bottom: 20%;
  left: 50%;
  transform: translateX(-50%);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .enhanced-progress--large {
    transform: scale(0.8);
  }
}
</style>
