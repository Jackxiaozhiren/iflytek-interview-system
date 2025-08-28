<template>
  <div class="interactive-guide-system">
    <!-- 引导遮罩层 -->
    <div 
      v-if="isGuideActive" 
      class="guide-overlay"
      @click="handleOverlayClick"
    >
      <!-- 高亮区域 -->
      <div 
        class="highlight-area"
        :style="highlightStyle"
      ></div>
      
      <!-- 引导提示框 -->
      <div 
        class="guide-tooltip"
        :style="tooltipStyle"
        :class="tooltipClass"
      >
        <div class="tooltip-header">
          <h3 class="tooltip-title chinese-title-animation">{{ currentStep.title }}</h3>
          <div class="step-indicator">
            {{ currentStepIndex + 1 }} / {{ guideSteps.length }}
          </div>
        </div>
        
        <div class="tooltip-content chinese-text-fade-in">
          <p class="tooltip-description">{{ currentStep.description }}</p>
          
          <!-- 交互提示 -->
          <div v-if="currentStep.interaction" class="interaction-hint">
            <el-icon class="hint-icon"><Mouse /></el-icon>
            <span>{{ currentStep.interaction }}</span>
          </div>
          
          <!-- 功能亮点 -->
          <div v-if="currentStep.highlights" class="feature-highlights">
            <div 
              v-for="(highlight, index) in currentStep.highlights" 
              :key="index"
              class="highlight-item"
            >
              <el-icon class="highlight-icon"><Check /></el-icon>
              <span>{{ highlight }}</span>
            </div>
          </div>
        </div>
        
        <div class="tooltip-actions">
          <el-button 
            v-if="currentStepIndex > 0"
            size="small" 
            @click="previousStep"
            class="action-btn touch-target"
          >
            上一步
          </el-button>
          
          <el-button 
            v-if="currentStepIndex < guideSteps.length - 1"
            type="primary" 
            size="small" 
            @click="nextStep"
            class="action-btn touch-target"
          >
            下一步
          </el-button>
          
          <el-button 
            v-else
            type="success" 
            size="small" 
            @click="finishGuide"
            class="action-btn touch-target"
          >
            完成引导
          </el-button>
          
          <el-button 
            size="small" 
            @click="skipGuide"
            class="skip-btn touch-target"
          >
            跳过
          </el-button>
        </div>
        
        <!-- 进度条 -->
        <div class="guide-progress">
          <div 
            class="progress-fill"
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>
      </div>
    </div>
    
    <!-- 引导启动按钮 -->
    <el-button
      v-if="!isGuideActive && showStartButton"
      type="primary"
      circle
      size="large"
      @click="startGuide"
      class="guide-start-btn touch-target button-click-feedback"
    >
      <el-icon><QuestionFilled /></el-icon>
    </el-button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Mouse, Check, QuestionFilled } from '@element-plus/icons-vue'

// Props
const props = defineProps({
  guideSteps: {
    type: Array,
    required: true
  },
  autoStart: {
    type: Boolean,
    default: false
  },
  showStartButton: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['guide-started', 'guide-finished', 'step-changed'])

// 响应式数据
const isGuideActive = ref(false)
const currentStepIndex = ref(0)
const highlightElement = ref(null)

// 计算属性
const currentStep = computed(() => props.guideSteps[currentStepIndex.value] || {})

const progressPercentage = computed(() => {
  return ((currentStepIndex.value + 1) / props.guideSteps.length) * 100
})

const highlightStyle = computed(() => {
  if (!highlightElement.value) return {}
  
  const rect = highlightElement.value.getBoundingClientRect()
  return {
    top: rect.top - 8 + 'px',
    left: rect.left - 8 + 'px',
    width: rect.width + 16 + 'px',
    height: rect.height + 16 + 'px'
  }
})

const tooltipStyle = computed(() => {
  if (!highlightElement.value) return {}
  
  const rect = highlightElement.value.getBoundingClientRect()
  const tooltipWidth = 320
  const tooltipHeight = 200
  
  let top = rect.bottom + 20
  let left = rect.left + (rect.width / 2) - (tooltipWidth / 2)
  
  // 边界检查
  if (left < 20) left = 20
  if (left + tooltipWidth > window.innerWidth - 20) {
    left = window.innerWidth - tooltipWidth - 20
  }
  
  if (top + tooltipHeight > window.innerHeight - 20) {
    top = rect.top - tooltipHeight - 20
  }
  
  return {
    top: top + 'px',
    left: left + 'px'
  }
})

const tooltipClass = computed(() => {
  if (!highlightElement.value) return ''
  
  const rect = highlightElement.value.getBoundingClientRect()
  const tooltipHeight = 200
  
  return rect.bottom + tooltipHeight > window.innerHeight - 20 ? 'tooltip-above' : 'tooltip-below'
})

// 方法
const startGuide = () => {
  isGuideActive.value = true
  currentStepIndex.value = 0
  updateHighlight()
  emit('guide-started')
  ElMessage.success('开始交互引导')
}

const nextStep = () => {
  if (currentStepIndex.value < props.guideSteps.length - 1) {
    currentStepIndex.value++
    updateHighlight()
    emit('step-changed', currentStepIndex.value)
  }
}

const previousStep = () => {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--
    updateHighlight()
    emit('step-changed', currentStepIndex.value)
  }
}

const finishGuide = () => {
  isGuideActive.value = false
  highlightElement.value = null
  emit('guide-finished')
  ElMessage.success('引导完成！')
}

const skipGuide = () => {
  isGuideActive.value = false
  highlightElement.value = null
  emit('guide-finished')
  ElMessage.info('已跳过引导')
}

const updateHighlight = () => {
  const step = currentStep.value
  if (step.selector) {
    const element = document.querySelector(step.selector)
    if (element) {
      highlightElement.value = element
      
      // 滚动到元素位置
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
      
      // 添加高亮效果
      element.classList.add('guide-highlight')
      
      // 移除之前的高亮
      document.querySelectorAll('.guide-highlight').forEach(el => {
        if (el !== element) {
          el.classList.remove('guide-highlight')
        }
      })
    }
  }
}

const handleOverlayClick = (event) => {
  // 如果点击的是高亮区域，不关闭引导
  if (event.target.classList.contains('highlight-area')) {
    return
  }
  
  // 点击其他区域可以选择跳过或继续
  if (currentStep.value.allowSkipOnClick !== false) {
    nextStep()
  }
}

// 键盘事件处理
const handleKeydown = (event) => {
  if (!isGuideActive.value) return
  
  switch (event.key) {
    case 'ArrowRight':
    case ' ':
      event.preventDefault()
      nextStep()
      break
    case 'ArrowLeft':
      event.preventDefault()
      previousStep()
      break
    case 'Escape':
      event.preventDefault()
      skipGuide()
      break
  }
}

// 生命周期
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  
  if (props.autoStart) {
    setTimeout(startGuide, 1000)
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  
  // 清理高亮效果
  document.querySelectorAll('.guide-highlight').forEach(el => {
    el.classList.remove('guide-highlight')
  })
})
</script>

<style scoped>
.interactive-guide-system {
  position: relative;
}

.guide-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  backdrop-filter: blur(2px);
}

.highlight-area {
  position: absolute;
  border: 3px solid #4c51bf;
  border-radius: 8px;
  background: rgba(76, 81, 191, 0.1);
  box-shadow: 0 0 20px rgba(76, 81, 191, 0.3);
  animation: highlightPulse 2s infinite;
  pointer-events: none;
}

@keyframes highlightPulse {
  0%, 100% { 
    box-shadow: 0 0 20px rgba(76, 81, 191, 0.3);
    border-color: #4c51bf;
  }
  50% { 
    box-shadow: 0 0 30px rgba(76, 81, 191, 0.6);
    border-color: #6b21a8;
  }
}

.guide-tooltip {
  position: absolute;
  width: 320px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  padding: 20px;
  z-index: 10000;
  animation: tooltipFadeIn 0.3s ease-out;
}

@keyframes tooltipFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.tooltip-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.tooltip-title {
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.step-indicator {
  background: #4c51bf;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
}

.tooltip-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 12px;
}

.interaction-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f0f7ff;
  padding: 8px 12px;
  border-radius: 6px;
  margin-bottom: 12px;
  color: #1890ff;
  font-size: 0.9rem;
}

.feature-highlights {
  margin-bottom: 16px;
}

.highlight-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  color: #52c41a;
  font-size: 0.9rem;
}

.tooltip-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.action-btn {
  flex: 1;
}

.skip-btn {
  color: #999;
}

.guide-progress {
  height: 4px;
  background: #f0f0f0;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4c51bf, #6b21a8);
  transition: width 0.3s ease;
}

.guide-start-btn {
  position: fixed;
  bottom: 120px;
  right: 30px;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(76, 81, 191, 0.3);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .guide-tooltip {
    width: calc(100vw - 40px);
    left: 20px !important;
    right: 20px;
  }
  
  .tooltip-actions {
    flex-direction: column;
  }
  
  .guide-start-btn {
    bottom: 80px;
    right: 20px;
  }
}

/* 高亮元素样式 */
:global(.guide-highlight) {
  position: relative;
  z-index: 10001;
  box-shadow: 0 0 20px rgba(76, 81, 191, 0.5) !important;
  border-radius: 8px;
}
</style>
