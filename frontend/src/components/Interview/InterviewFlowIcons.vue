<template>
  <div class="interview-flow-icons">
    <!-- 面试阶段指示器 -->
    <div class="interview-stages">
      <div 
        v-for="(stage, index) in interviewStages" 
        :key="stage.id"
        class="stage-item"
        :class="{ 
          active: currentStage === stage.id,
          completed: completedStages.includes(stage.id),
          disabled: !availableStages.includes(stage.id)
        }"
        @click="$emit('stage-change', stage.id)"
      >
        <div class="stage-icon">
          <EnhancedIcon 
            :name="stage.icon"
            :size="currentStage === stage.id ? 'lg' : 'md'"
            :theme="getStageTheme(stage.id)"
            :status="getStageStatus(stage.id)"
            :animation="currentStage === stage.id ? 'pulse' : undefined"
            interactive
          />
        </div>
        <div class="stage-label">{{ stage.name }}</div>
        <div class="stage-progress" v-if="stage.progress !== undefined">
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: `${stage.progress}%` }"
            ></div>
          </div>
          <span class="progress-text">{{ stage.progress }}%</span>
        </div>
      </div>
    </div>

    <!-- 面试控制按钮组 -->
    <div class="interview-controls">
      <div class="primary-controls">
        <button 
          class="control-btn primary"
          :class="{ active: isRecording }"
          @click="$emit('toggle-recording')"
          :disabled="!canRecord"
        >
          <EnhancedIcon 
            :name="isRecording ? 'interview-pause' : 'interview-start'"
            size="md"
            :theme="isRecording ? 'warning' : 'primary'"
            :animation="isRecording ? 'pulse' : undefined"
          />
          <span>{{ isRecording ? '暂停面试' : '开始面试' }}</span>
        </button>

        <button 
          class="control-btn secondary"
          @click="$emit('next-question')"
          :disabled="!canProceed"
        >
          <EnhancedIcon 
            name="interview-next"
            size="md"
            theme="primary"
          />
          <span>下一题</span>
        </button>

        <button 
          class="control-btn tertiary"
          @click="$emit('end-interview')"
          :disabled="!canEnd"
        >
          <EnhancedIcon 
            name="interview-end"
            size="md"
            theme="error"
          />
          <span>结束面试</span>
        </button>
      </div>

      <div class="secondary-controls">
        <button 
          class="quick-btn"
          @click="$emit('toggle-ai-assistant')"
          :title="aiAssistantActive ? 'AI助手活跃中' : '启用AI助手'"
        >
          <EnhancedIcon 
            name="analysis-ai"
            size="lg"
            :status="aiAssistantActive ? 'active' : undefined"
            :animation="aiAssistantActive ? 'pulse' : undefined"
          />
        </button>

        <button 
          class="quick-btn"
          @click="$emit('toggle-multimodal')"
          :title="multimodalActive ? '多模态分析中' : '启用多模态分析'"
        >
          <EnhancedIcon 
            name="analysis-data"
            size="lg"
            :status="multimodalActive ? 'processing' : undefined"
            :animation="multimodalActive ? 'spin' : undefined"
          />
        </button>

        <button 
          class="quick-btn"
          @click="$emit('save-progress')"
          title="保存进度"
        >
          <EnhancedIcon 
            name="reports-generate"
            size="lg"
          />
        </button>
      </div>
    </div>

    <!-- 实时状态指示器 -->
    <div class="status-indicators">
      <div class="status-item" :class="{ active: isRecording }">
        <EnhancedIcon 
          name="analysis-voice"
          size="sm"
          :status="isRecording ? 'active' : undefined"
          :animation="isRecording ? 'pulse' : undefined"
        />
        <span>语音{{ isRecording ? '录制中' : '待机' }}</span>
      </div>

      <div class="status-item" :class="{ active: videoActive }">
        <EnhancedIcon 
          name="analysis-video"
          size="sm"
          :status="videoActive ? 'active' : undefined"
        />
        <span>视频{{ videoActive ? '分析中' : '待机' }}</span>
      </div>

      <div class="status-item" :class="{ active: aiProcessing }">
        <EnhancedIcon 
          name="analysis-ai"
          size="sm"
          :status="aiProcessing ? 'processing' : undefined"
          :animation="aiProcessing ? 'spin' : undefined"
        />
        <span>AI{{ aiProcessing ? '分析中' : '待机' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import EnhancedIcon from '@/components/common/EnhancedIcon.vue'

const props = defineProps({
  currentStage: {
    type: String,
    default: 'preparation'
  },
  completedStages: {
    type: Array,
    default: () => []
  },
  availableStages: {
    type: Array,
    default: () => ['preparation', 'interview', 'evaluation']
  },
  isRecording: {
    type: Boolean,
    default: false
  },
  canRecord: {
    type: Boolean,
    default: true
  },
  canProceed: {
    type: Boolean,
    default: false
  },
  canEnd: {
    type: Boolean,
    default: false
  },
  aiAssistantActive: {
    type: Boolean,
    default: false
  },
  multimodalActive: {
    type: Boolean,
    default: false
  },
  videoActive: {
    type: Boolean,
    default: false
  },
  aiProcessing: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'stage-change',
  'toggle-recording',
  'next-question',
  'end-interview',
  'toggle-ai-assistant',
  'toggle-multimodal',
  'save-progress'
])

// 面试阶段配置
const interviewStages = computed(() => [
  {
    id: 'preparation',
    name: '准备阶段',
    icon: 'interview-start',
    progress: props.currentStage === 'preparation' ? 100 : 
              props.completedStages.includes('preparation') ? 100 : 0
  },
  {
    id: 'interview',
    name: '面试进行',
    icon: 'analysis-voice',
    progress: props.currentStage === 'interview' ? 50 : 
              props.completedStages.includes('interview') ? 100 : 0
  },
  {
    id: 'evaluation',
    name: '评估分析',
    icon: 'analysis-data',
    progress: props.currentStage === 'evaluation' ? 75 : 
              props.completedStages.includes('evaluation') ? 100 : 0
  },
  {
    id: 'report',
    name: '生成报告',
    icon: 'reports-generate',
    progress: props.currentStage === 'report' ? 90 : 
              props.completedStages.includes('report') ? 100 : 0
  }
])

// 获取阶段主题
function getStageTheme(stageId) {
  if (props.completedStages.includes(stageId)) {
    return 'primary'
  } else if (props.currentStage === stageId) {
    return 'ai'
  } else if (props.availableStages.includes(stageId)) {
    return 'default'
  } else {
    return 'default'
  }
}

// 获取阶段状态
function getStageStatus(stageId) {
  if (props.completedStages.includes(stageId)) {
    return 'success'
  } else if (props.currentStage === stageId) {
    return 'active'
  } else {
    return undefined
  }
}
</script>

<style scoped>
.interview-flow-icons {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px;
  background: var(--iflytek-bg-primary);
  border-radius: 12px;
  border: 1px solid var(--iflytek-border-secondary);
}

.interview-stages {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.interview-stages::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--iflytek-border-secondary);
  z-index: 0;
}

.stage-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1;
  background: var(--iflytek-bg-primary);
  padding: 12px;
  border-radius: 8px;
  min-width: 120px;
}

.stage-item:hover {
  background: var(--iflytek-bg-secondary);
  transform: translateY(-2px);
}

.stage-item.active {
  background: rgba(24, 144, 255, 0.1);
  border: 2px solid var(--iflytek-primary);
}

.stage-item.completed {
  background: rgba(16, 185, 129, 0.1);
}

.stage-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.stage-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stage-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--iflytek-text-primary);
  text-align: center;
}

.stage-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 100%;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: var(--iflytek-border-secondary);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--iflytek-primary);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: var(--iflytek-text-secondary);
}

.interview-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.primary-controls {
  display: flex;
  gap: 12px;
}

.control-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.control-btn.primary {
  background: var(--iflytek-primary);
  color: white;
}

.control-btn.primary:hover {
  background: var(--iflytek-primary-dark);
  transform: translateY(-1px);
}

.control-btn.primary.active {
  background: var(--iflytek-warning);
  animation: recordingPulse 2s ease-in-out infinite;
}

.control-btn.secondary {
  background: var(--iflytek-bg-secondary);
  color: var(--iflytek-text-primary);
  border: 1px solid var(--iflytek-border-primary);
}

.control-btn.secondary:hover {
  background: var(--iflytek-bg-tertiary);
}

.control-btn.tertiary {
  background: rgba(239, 68, 68, 0.1);
  color: var(--iflytek-error);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.control-btn.tertiary:hover {
  background: rgba(239, 68, 68, 0.15);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.secondary-controls {
  display: flex;
  gap: 8px;
}

.quick-btn {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--iflytek-bg-secondary);
  border: 1px solid var(--iflytek-border-primary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quick-btn:hover {
  background: var(--iflytek-bg-tertiary);
  transform: translateY(-1px);
}

.status-indicators {
  display: flex;
  justify-content: center;
  gap: 24px;
  padding: 16px;
  background: var(--iflytek-bg-secondary);
  border-radius: 8px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--iflytek-text-secondary);
  transition: all 0.3s ease;
}

.status-item.active {
  color: var(--iflytek-primary);
  font-weight: 500;
}

@keyframes recordingPulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.02);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .interview-stages {
    flex-direction: column;
    gap: 16px;
  }
  
  .interview-stages::before {
    display: none;
  }
  
  .stage-item {
    min-width: auto;
    width: 100%;
  }
  
  .interview-controls {
    flex-direction: column;
    gap: 16px;
  }
  
  .primary-controls {
    width: 100%;
    justify-content: center;
  }
  
  .control-btn {
    flex: 1;
    justify-content: center;
  }
  
  .status-indicators {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
