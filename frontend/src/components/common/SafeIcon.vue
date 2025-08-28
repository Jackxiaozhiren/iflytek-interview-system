<template>
  <el-icon :size="size" :color="color" :class="iconClass">
    <component :is="iconComponent" />
  </el-icon>
</template>

<script setup>
import { computed, markRaw } from 'vue'

// Props定义
const props = defineProps({
  icon: {
    type: [Object, String],
    required: true
  },
  size: {
    type: [String, Number],
    default: undefined
  },
  color: {
    type: String,
    default: undefined
  },
  class: {
    type: String,
    default: ''
  }
})

// 计算属性 - 确保图标组件是安全的
const iconComponent = computed(() => {
  if (typeof props.icon === 'string') {
    return props.icon
  }
  
  // 如果是组件对象，确保它被markRaw包装
  return markRaw(props.icon)
})

const iconClass = computed(() => {
  return props.class
})
</script>

<style scoped>
/* 图标容器样式 */
.el-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

/* 悬停效果 */
.el-icon:hover {
  transform: scale(1.1);
}

/* 动画效果 */
.el-icon.animated {
  animation: iconPulse 2s infinite;
}

@keyframes iconPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
</style>
