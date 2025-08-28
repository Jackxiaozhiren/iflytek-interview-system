<template>
  <el-dialog
    v-model="visible"
    title="报告导出进度"
    width="400px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    class="export-progress-dialog"
  >
    <div class="progress-content">
      <!-- 导出状态图标 -->
      <div class="status-icon">
        <el-icon v-if="status === 'preparing'" class="rotating">
          <Loading />
        </el-icon>
        <el-icon v-else-if="status === 'processing'" class="rotating">
          <Document />
        </el-icon>
        <el-icon v-else-if="status === 'success'" class="success-icon">
          <CircleCheck />
        </el-icon>
        <el-icon v-else-if="status === 'error'" class="error-icon">
          <CircleClose />
        </el-icon>
      </div>

      <!-- 状态文本 -->
      <div class="status-text">
        <h3 class="status-title">{{ statusTitle }}</h3>
        <p class="status-description">{{ statusDescription }}</p>
      </div>

      <!-- 进度条 -->
      <div v-if="showProgress" class="progress-section">
        <el-progress 
          :percentage="progress" 
          :status="progressStatus"
          :stroke-width="8"
          :show-text="true"
        />
        <div class="progress-details">
          <span class="progress-text">{{ progressText }}</span>
          <span class="progress-time">{{ elapsedTime }}</span>
        </div>
      </div>

      <!-- 导出详情 -->
      <div v-if="exportDetails" class="export-details">
        <div class="detail-item">
          <span class="detail-label">导出格式：</span>
          <el-tag :type="formatTagType" size="small">{{ formatLabel }}</el-tag>
        </div>
        <div class="detail-item">
          <span class="detail-label">报告数量：</span>
          <span class="detail-value">{{ exportDetails.reportCount }} 份</span>
        </div>
        <div v-if="exportDetails.fileSize" class="detail-item">
          <span class="detail-label">文件大小：</span>
          <span class="detail-value">{{ formatFileSize(exportDetails.fileSize) }}</span>
        </div>
      </div>

      <!-- 错误信息 -->
      <div v-if="status === 'error'" class="error-section">
        <el-alert
          :title="errorMessage"
          type="error"
          :closable="false"
          show-icon
        />
      </div>

      <!-- 成功信息 -->
      <div v-if="status === 'success'" class="success-section">
        <el-alert
          title="导出成功！"
          :description="successMessage"
          type="success"
          :closable="false"
          show-icon
        />
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button 
          v-if="status === 'error'" 
          type="primary" 
          @click="handleRetry"
        >
          <el-icon><Refresh /></el-icon>
          重试
        </el-button>
        <el-button 
          v-if="status === 'success'" 
          type="primary" 
          @click="handleClose"
        >
          <el-icon><Check /></el-icon>
          完成
        </el-button>
        <el-button 
          v-if="status === 'error'" 
          @click="handleClose"
        >
          取消
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import {
  Loading, Document, CircleCheck, CircleClose, Refresh, Check
} from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    default: 'preparing', // preparing, processing, success, error
    validator: (value) => ['preparing', 'processing', 'success', 'error'].includes(value)
  },
  progress: {
    type: Number,
    default: 0
  },
  format: {
    type: String,
    default: 'excel'
  },
  exportDetails: {
    type: Object,
    default: null
  },
  errorMessage: {
    type: String,
    default: '导出过程中发生错误'
  }
})

const emit = defineEmits(['update:modelValue', 'retry', 'close'])

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const startTime = ref(Date.now())
const elapsedTime = ref('00:00')
let timer = null

// 状态标题
const statusTitle = computed(() => {
  switch (props.status) {
    case 'preparing':
      return '准备导出...'
    case 'processing':
      return '正在导出报告'
    case 'success':
      return '导出完成'
    case 'error':
      return '导出失败'
    default:
      return '导出中...'
  }
})

// 状态描述
const statusDescription = computed(() => {
  switch (props.status) {
    case 'preparing':
      return '正在准备导出数据，请稍候...'
    case 'processing':
      return '正在生成报告文件，请耐心等待...'
    case 'success':
      return '报告已成功导出到您的下载文件夹'
    case 'error':
      return '导出过程中遇到问题，请检查后重试'
    default:
      return '处理中...'
  }
})

// 是否显示进度条
const showProgress = computed(() => {
  return ['preparing', 'processing'].includes(props.status)
})

// 进度条状态
const progressStatus = computed(() => {
  if (props.status === 'success') return 'success'
  if (props.status === 'error') return 'exception'
  return undefined
})

// 进度文本
const progressText = computed(() => {
  if (props.progress === 0) return '初始化中...'
  if (props.progress < 30) return '准备数据中...'
  if (props.progress < 60) return '生成文件中...'
  if (props.progress < 90) return '优化格式中...'
  if (props.progress < 100) return '即将完成...'
  return '处理完成'
})

// 格式标签类型
const formatTagType = computed(() => {
  return props.format === 'excel' ? 'primary' : 'success'
})

// 格式标签
const formatLabel = computed(() => {
  return props.format === 'excel' ? 'Excel (.xlsx)' : 'CSV (.csv)'
})

// 成功消息
const successMessage = computed(() => {
  const count = props.exportDetails?.reportCount || 1
  const format = props.format.toUpperCase()
  return `已成功导出 ${count} 份报告为 ${format} 格式`
})

// 更新计时器
const updateElapsedTime = () => {
  const elapsed = Date.now() - startTime.value
  const seconds = Math.floor(elapsed / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  elapsedTime.value = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 处理重试
const handleRetry = () => {
  emit('retry')
}

// 处理关闭
const handleClose = () => {
  emit('close')
  visible.value = false
}

// 监听对话框显示状态
watch(visible, (newValue) => {
  if (newValue) {
    startTime.value = Date.now()
    timer = setInterval(updateElapsedTime, 1000)
  } else {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }
})

onMounted(() => {
  if (visible.value) {
    timer = setInterval(updateElapsedTime, 1000)
  }
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.export-progress-dialog {
  --el-dialog-border-radius: 12px;
}

.progress-content {
  text-align: center;
  padding: 20px 0;
}

.status-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.rotating {
  animation: rotate 2s linear infinite;
  color: #1890ff;
}

.success-icon {
  color: #52c41a;
}

.error-icon {
  color: #ff4d4f;
}

.status-text {
  margin-bottom: 24px;
}

.status-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.status-description {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.5;
}

.progress-section {
  margin-bottom: 24px;
}

.progress-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  font-size: 12px;
  color: #999;
}

.export-details {
  background: #fafafa;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 16px;
  text-align: left;
}

.detail-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-label {
  font-weight: 500;
  color: #666;
  min-width: 80px;
}

.detail-value {
  color: #333;
}

.error-section,
.success-section {
  margin-bottom: 16px;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 12px;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .export-progress-dialog {
    width: 95% !important;
  }
  
  .progress-content {
    padding: 16px 0;
  }
  
  .status-icon {
    font-size: 40px;
  }
  
  .status-title {
    font-size: 16px;
  }
  
  .export-details {
    padding: 12px;
  }
  
  .detail-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .detail-label {
    min-width: auto;
    font-size: 12px;
  }
}
</style>
