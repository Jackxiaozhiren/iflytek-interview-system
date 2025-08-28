<template>
  <div class="ai-thinking-container" v-if="isVisible">
    <div class="thinking-card">
      <!-- 思考过程头部 -->
      <div class="thinking-header" @click="toggleThinking">
        <div class="header-left">
          <div class="thinking-avatar">
            <el-icon class="thinking-icon" :class="{ spinning: isThinking }">
              <Cpu />
            </el-icon>
          </div>
          <div class="thinking-info">
            <h4 class="thinking-title">iFlytek Spark AI 思考过程</h4>
            <p class="thinking-status">{{ currentStatus }}</p>
          </div>
        </div>
        <div class="header-right">
          <el-button 
            text 
            size="small" 
            @click.stop="toggleThinking"
            class="collapse-btn"
          >
            <el-icon :class="{ 'rotate-180': !isThinkingCollapsed }">
              <ArrowDown />
            </el-icon>
          </el-button>
        </div>
      </div>

      <!-- 思考过程内容 -->
      <div class="thinking-content" v-show="!isThinkingCollapsed" ref="thinkingContentRef">
        <div class="thinking-process">
          <div class="process-section" v-if="thinkingText">
            <div class="section-header">
              <el-icon><Cpu /></el-icon>
              <span>分析思路</span>
            </div>
            <div class="typewriter-text" ref="thinkingTextRef">
              {{ displayedThinkingText }}
              <span class="cursor" v-if="isTypingThinking">|</span>
            </div>
          </div>
        </div>
        <div class="scroll-hint" v-if="showScrollHint">可滚动查看</div>
      </div>

      <!-- 最终回答内容 -->
      <div class="answer-content" v-if="answerText" ref="answerContentRef">
        <div class="answer-section">
          <div class="section-header">
            <el-icon><ChatDotRound /></el-icon>
            <span>AI回答</span>
          </div>
          <div class="typewriter-text" ref="answerTextRef">
            {{ displayedAnswerText }}
            <span class="cursor" v-if="isTypingAnswer">|</span>
          </div>
        </div>
        <div class="scroll-hint" v-if="showScrollHint">可滚动查看</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import {
  Cpu, ArrowDown, ChatDotRound
} from '@element-plus/icons-vue'

// Props
const props = defineProps({
  thinkingText: {
    type: String,
    default: ''
  },
  answerText: {
    type: String,
    default: ''
  },
  isVisible: {
    type: Boolean,
    default: false
  },
  autoCollapse: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['thinking-complete', 'answer-complete'])

// 响应式数据
const isThinking = ref(false)
const isThinkingCollapsed = ref(false)
const displayedThinkingText = ref('')
const displayedAnswerText = ref('')
const isTypingThinking = ref(false)
const isTypingAnswer = ref(false)
const showScrollHint = ref(false)

// 容器引用
const thinkingContentRef = ref(null)
const answerContentRef = ref(null)

// 计算属性
const currentStatus = computed(() => {
  if (isTypingThinking.value) return '正在思考分析...'
  if (isTypingAnswer.value) return '正在生成回答...'
  if (displayedAnswerText.value) return '回答完成'
  if (displayedThinkingText.value) return '思考完成'
  return '准备中...'
})

// 打字机效果配置
const typingSpeed = 50 // 毫秒
const thinkingTextRef = ref(null)
const answerTextRef = ref(null)

// 方法
const toggleThinking = () => {
  isThinkingCollapsed.value = !isThinkingCollapsed.value
}

const typeText = async (text, targetRef, isThinkingType = true) => {
  if (isThinkingType) {
    isTypingThinking.value = true
    displayedThinkingText.value = ''
  } else {
    isTypingAnswer.value = true
    displayedAnswerText.value = ''
  }

  // 优化的打字机效果：按字符分割，支持中文和标点符号
  const chars = text.split('')

  for (let i = 0; i <= chars.length; i++) {
    const currentText = chars.slice(0, i).join('')

    if (isThinkingType) {
      displayedThinkingText.value = currentText
    } else {
      displayedAnswerText.value = currentText
    }

    // 智能延迟：标点符号稍慢，普通字符较快
    const char = chars[i - 1]
    let delay = typingSpeed

    if (char) {
      if (/[，。！？；：]/.test(char)) {
        delay = 150 // 中文标点符号
      } else if (/[,.\!?;:]/.test(char)) {
        delay = 150 // 英文标点符号
      } else if (/[\s\n]/.test(char)) {
        delay = 30 // 空格和换行
      } else if (/[\u4e00-\u9fa5]/.test(char)) {
        delay = 60 // 中文字符
      } else {
        delay = 40 // 英文字符
      }
    }

    await new Promise(resolve => setTimeout(resolve, delay))
  }

  if (isThinkingType) {
    isTypingThinking.value = false
    emit('thinking-complete')
  } else {
    isTypingAnswer.value = false
    emit('answer-complete')
  }
}

// 检查内容是否需要滚动
const checkScrollNeeded = () => {
  nextTick(() => {
    const thinkingContainer = thinkingContentRef.value
    const answerContainer = answerContentRef.value

    if (thinkingContainer && thinkingContainer.scrollHeight > thinkingContainer.clientHeight) {
      showScrollHint.value = true
    } else if (answerContainer && answerContainer.scrollHeight > answerContainer.clientHeight) {
      showScrollHint.value = true
    } else {
      showScrollHint.value = false
    }
  })
}

const startThinkingProcess = async () => {
  if (!props.thinkingText) return

  isThinking.value = true
  await typeText(props.thinkingText, thinkingTextRef, true)
  isThinking.value = false

  // 检查是否需要滚动
  checkScrollNeeded()

  // 如果有回答文本，等待一下再开始打字
  if (props.answerText) {
    await new Promise(resolve => setTimeout(resolve, 800))
    await typeText(props.answerText, answerTextRef, false)

    // 再次检查滚动
    checkScrollNeeded()

    // 自动折叠思考过程 - 增强版淡出效果
    if (props.autoCollapse) {
      await new Promise(resolve => setTimeout(resolve, 2000))

      // 添加淡出效果
      const thinkingContent = thinkingContentRef.value
      if (thinkingContent) {
        thinkingContent.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out'
        thinkingContent.style.opacity = '0.7'
        thinkingContent.style.transform = 'translateY(-10px)'
      }

      await new Promise(resolve => setTimeout(resolve, 600))
      isThinkingCollapsed.value = true

      // 恢复样式
      if (thinkingContent) {
        thinkingContent.style.opacity = ''
        thinkingContent.style.transform = ''
      }
    }
  }
}

// 监听思考文本变化
watch(() => props.thinkingText, (newText) => {
  if (newText && props.isVisible) {
    nextTick(() => {
      startThinkingProcess()
    })
  }
})

// 监听可见性变化
watch(() => props.isVisible, (visible) => {
  if (visible && props.thinkingText) {
    nextTick(() => {
      startThinkingProcess()
    })
  }
})
</script>

<style scoped>
.ai-thinking-container {
  margin: 16px 0;
}

.thinking-card {
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid rgba(24, 144, 255, 0.2);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(24, 144, 255, 0.1);
  transition: all 0.3s ease;
}

.thinking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(90deg, rgba(24, 144, 255, 0.05), rgba(102, 126, 234, 0.05));
  border-bottom: 1px solid rgba(24, 144, 255, 0.1);
  cursor: pointer;
  transition: background 0.3s ease;
}

.thinking-header:hover {
  background: linear-gradient(90deg, rgba(24, 144, 255, 0.08), rgba(102, 126, 234, 0.08));
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.thinking-avatar {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #1890ff, #667eea);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.thinking-icon {
  font-size: 18px;
  transition: transform 0.3s ease;
}

.thinking-icon.spinning {
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.thinking-info h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #1890ff;
  font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
}

.thinking-info p {
  margin: 0;
  font-size: 12px;
  color: #666;
  font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
}

.collapse-btn .el-icon {
  transition: transform 0.3s ease;
}

.rotate-180 {
  transform: rotate(180deg);
}

.thinking-content, .answer-content {
  padding: 20px;
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: top;
}

/* 折叠动画效果 */
.thinking-content {
  animation: fadeInDown 0.5s ease-out;
}

.answer-content {
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.process-section, .answer-section {
  margin-bottom: 16px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: 600;
  color: #1890ff;
  font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
}

.typewriter-text {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
  white-space: pre-wrap;
  word-break: break-word;
}

.cursor {
  color: #1890ff;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.answer-content {
  border-top: 1px solid rgba(24, 144, 255, 0.1);
  background: rgba(24, 144, 255, 0.02);
}

/* 滚动条样式优化 */
.thinking-content::-webkit-scrollbar,
.answer-content::-webkit-scrollbar {
  width: 6px;
}

.thinking-content::-webkit-scrollbar-track,
.answer-content::-webkit-scrollbar-track {
  background: rgba(24, 144, 255, 0.05);
  border-radius: 3px;
}

.thinking-content::-webkit-scrollbar-thumb,
.answer-content::-webkit-scrollbar-thumb {
  background: rgba(24, 144, 255, 0.3);
  border-radius: 3px;
  transition: background 0.3s ease;
}

.thinking-content::-webkit-scrollbar-thumb:hover,
.answer-content::-webkit-scrollbar-thumb:hover {
  background: rgba(24, 144, 255, 0.5);
}

/* 滚动提示 */
.scroll-hint {
  position: absolute;
  bottom: 8px;
  right: 12px;
  background: rgba(24, 144, 255, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.thinking-content:hover .scroll-hint,
.answer-content:hover .scroll-hint {
  opacity: 1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .thinking-content, .answer-content {
    max-height: 300px;
    padding: 16px;
  }

  .thinking-header {
    padding: 12px 16px;
  }

  .thinking-avatar {
    width: 32px;
    height: 32px;
  }

  .thinking-icon {
    font-size: 16px;
  }
}
</style>
