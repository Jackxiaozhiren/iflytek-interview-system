<template>
  <div 
    :class="iconClasses"
    :style="iconStyles"
    :title="tooltip"
    :aria-label="ariaLabel"
    :tabindex="interactive ? 0 : undefined"
    @click="handleClick"
    @keydown.enter="handleClick"
    @keydown.space.prevent="handleClick"
  >
    <el-icon>
      <component :is="iconComponent" />
    </el-icon>
    
    <!-- 徽章指示器 -->
    <div v-if="badge" class="icon-badge-indicator" :class="badgeType">
      {{ badge }}
    </div>
    
    <!-- 状态指示器 -->
    <div v-if="status" class="icon-status-indicator" :class="status"></div>
  </div>
</template>

<script setup>
import { computed, defineEmits } from 'vue'
import { interviewSystemIcons } from '@/config/icon-system-config.js'

// 导入常用图标
import {
  User, House, VideoCamera, Microphone, Document, TrendCharts, Cpu, DataBoard, Connection, Star, CircleCheck, Clock, Loading, WarningFilled, Close, Setting, Download, Share, Printer, View, Search, ArrowRight, ArrowLeft, ArrowUp, ArrowDown, VideoPlay, VideoPause, Menu
} from '@element-plus/icons-vue'

const props = defineProps({
  // 图标名称或类型
  name: {
    type: String,
    required: true
  },
  
  // 图标尺寸
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'xxxl'].includes(value)
  },
  
  // 主题类型
  theme: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'ai', 'bigdata', 'iot', 'cloud'].includes(value)
  },
  
  // 状态
  status: {
    type: String,
    validator: (value) => ['active', 'success', 'warning', 'error', 'processing'].includes(value)
  },
  
  // 是否可交互
  interactive: {
    type: Boolean,
    default: false
  },
  
  // 动画类型
  animation: {
    type: String,
    validator: (value) => ['spin', 'pulse', 'bounce', 'shake'].includes(value)
  },
  
  // 徽章内容
  badge: {
    type: [String, Number],
    default: null
  },
  
  // 徽章类型
  badgeType: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'success', 'warning', 'error'].includes(value)
  },
  
  // 工具提示
  tooltip: {
    type: String,
    default: ''
  },
  
  // 无障碍标签
  ariaLabel: {
    type: String,
    default: ''
  },
  
  // 自定义颜色
  color: {
    type: String,
    default: ''
  },
  
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

// 图标组件映射
const iconComponents = {
  User, House, VideoCamera, Microphone, Document, TrendCharts,
  Cpu, DataBoard, Connection, Monitor, Star, CircleCheck,
  Clock, Loading, WarningFilled, Close, Setting, Download,
  Share, Printer, View, Search, ArrowRight, ArrowLeft,
  ArrowUp, ArrowDown, VideoPlay, VideoPause, Menu
}

// 计算图标组件
const iconComponent = computed(() => {
  // 首先检查是否是系统预定义的图标
  const systemIcon = getSystemIcon(props.name)
  if (systemIcon && iconComponents[systemIcon]) {
    return iconComponents[systemIcon]
  }
  
  // 直接使用图标名称
  if (iconComponents[props.name]) {
    return iconComponents[props.name]
  }
  
  // 默认返回问号图标
  return iconComponents.QuestionFilled || iconComponents.Star
})

// 获取系统图标映射
function getSystemIcon(name) {
  const parts = name.split('-')
  if (parts.length >= 2) {
    const category = parts[0]
    const type = parts[1]
    
    if (interviewSystemIcons[category] && interviewSystemIcons[category][type]) {
      return interviewSystemIcons[category][type]
    }
  }
  
  return null
}

// 计算图标类名
const iconClasses = computed(() => {
  const classes = ['enhanced-icon']
  
  // 尺寸类
  classes.push(`icon-${props.size}`)
  
  // 主题类
  if (props.theme !== 'default') {
    classes.push(`icon-${props.theme}`)
  }
  
  // 状态类
  if (props.status) {
    classes.push(`icon-status`, `icon-status-${props.status}`)
  }
  
  // 交互类
  if (props.interactive) {
    classes.push('icon-interactive')
  }
  
  // 动画类
  if (props.animation) {
    classes.push(`icon-${props.animation}`)
  }
  
  // 禁用类
  if (props.disabled) {
    classes.push('icon-disabled')
  }
  
  // 特殊图标类
  if (props.name.includes('voice')) {
    classes.push('icon-voice-analysis')
  } else if (props.name.includes('video')) {
    classes.push('icon-video-analysis')
  } else if (props.name.includes('text')) {
    classes.push('icon-text-analysis')
  } else if (props.name.includes('data')) {
    classes.push('icon-data-analysis')
  }
  
  return classes
})

// 计算图标样式
const iconStyles = computed(() => {
  const styles = {}
  
  if (props.color) {
    styles.color = props.color
  }
  
  return styles
})

// 处理点击事件
function handleClick(event) {
  if (!props.disabled && props.interactive) {
    emit('click', event)
  }
}
</script>

<style scoped>
.enhanced-icon {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.enhanced-icon.icon-interactive {
  cursor: pointer;
  border-radius: 4px;
}

.enhanced-icon.icon-interactive:hover {
  transform: translateY(-1px);
}

.enhanced-icon.icon-interactive:active {
  transform: translateY(0);
}

.enhanced-icon.icon-disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}

.icon-badge-indicator {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  min-width: 16px;
  height: 16px;
  font-size: 10px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  z-index: 1;
}

.icon-badge-indicator.success {
  background: #10b981;
}

.icon-badge-indicator.warning {
  background: #f59e0b;
}

.icon-badge-indicator.error {
  background: #ef4444;
}

.icon-status-indicator {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 2px solid white;
  z-index: 1;
}

.icon-status-indicator.active {
  background: #10b981;
  animation: statusPulse 2s ease-in-out infinite;
}

.icon-status-indicator.success {
  background: #10b981;
}

.icon-status-indicator.warning {
  background: #f59e0b;
}

.icon-status-indicator.error {
  background: #ef4444;
}

.icon-status-indicator.processing {
  background: #3b82f6;
  animation: statusSpin 1s linear infinite;
}

@keyframes statusPulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.2);
  }
}

@keyframes statusSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .icon-badge-indicator {
    min-width: 14px;
    height: 14px;
    font-size: 9px;
  }
  
  .icon-status-indicator {
    width: 6px;
    height: 6px;
  }
}
</style>
