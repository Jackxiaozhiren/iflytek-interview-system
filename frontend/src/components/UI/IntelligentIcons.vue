<template>
  <div class="intelligent-icon" :class="[`size-${size}`, `type-${type}`]">
    <el-icon :size="iconSize">
      <component :is="iconComponent" />
    </el-icon>
    <span v-if="showLabel" class="icon-label">{{ iconLabel }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  Cpu, DataBoard, Connection, Microphone, VideoCamera, Document,
  Setting, VideoPause, VideoPlay, Star, TrendCharts, Odometer,
  Grid, Upload, Download, Search, Edit, Delete,
  Plus, Minus, Refresh, Check, Close, Warning, InfoFilled
} from '@element-plus/icons-vue'

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => [
      'ai', 'bigdata', 'iot', 'voice', 'video', 'text',
      'record', 'pause', 'play', 'settings', 'analysis',
      'upload', 'download', 'search', 'edit', 'delete',
      'add', 'remove', 'refresh', 'success', 'error', 'warning', 'info'
    ].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  showLabel: {
    type: Boolean,
    default: false
  }
})

// 图标映射
const iconMap = {
  // 技术领域图标
  ai: Cpu,
  bigdata: DataBoard,
  iot: Connection,
  
  // 功能模块图标
  voice: Microphone,
  video: VideoCamera,
  text: Document,
  
  // 控制图标
  record: VideoPlay,
  pause: VideoPause,
  play: VideoPlay,
  settings: Setting,
  
  // 分析图标
  analysis: TrendCharts,
  monitor: Odometer,
  data: Grid,
  
  // 操作图标
  upload: Upload,
  download: Download,
  search: Search,
  edit: Edit,
  delete: Delete,
  add: Plus,
  remove: Minus,
  refresh: Refresh,
  
  // 状态图标
  success: Check,
  error: Close,
  warning: Warning,
  info: InfoFilled
}

// 标签映射
const labelMap = {
  ai: 'AI智能',
  bigdata: '大数据',
  iot: '物联网',
  voice: '语音分析',
  video: '视频分析',
  text: '文本分析',
  record: '开始录制',
  pause: '暂停',
  play: '播放',
  settings: '设置',
  analysis: '数据分析',
  monitor: '系统监控',
  data: '数据处理',
  upload: '上传',
  download: '下载',
  search: '搜索',
  edit: '编辑',
  delete: '删除',
  add: '添加',
  remove: '移除',
  refresh: '刷新',
  success: '成功',
  error: '错误',
  warning: '警告',
  info: '信息'
}

// 尺寸映射
const sizeMap = {
  small: 16,
  medium: 24,
  large: 32
}

// 计算属性
const iconComponent = computed(() => {
  return iconMap[props.type] || Document
})

const iconLabel = computed(() => {
  return labelMap[props.type] || props.type
})

const iconSize = computed(() => {
  return sizeMap[props.size] || 24
})
</script>

<style scoped>
.intelligent-icon {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.intelligent-icon:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
}

/* 尺寸样式 */
.size-small {
  font-size: 12px;
}

.size-small .icon-label {
  font-size: 12px;
}

.size-medium {
  font-size: 14px;
}

.size-medium .icon-label {
  font-size: 14px;
}

.size-large {
  font-size: 16px;
}

.size-large .icon-label {
  font-size: 16px;
}

/* 类型样式 */
.type-ai {
  color: var(--el-color-primary);
}

.type-bigdata {
  color: var(--el-color-success);
}

.type-iot {
  color: var(--el-color-warning);
}

.type-voice {
  color: #667eea;
}

.type-video {
  color: #764ba2;
}

.type-text {
  color: #4c51bf;
}

.type-record {
  color: var(--el-color-danger);
}

.type-pause {
  color: var(--el-color-warning);
}

.type-play {
  color: var(--el-color-success);
}

.type-settings {
  color: var(--el-color-info);
}

.type-analysis {
  color: var(--el-color-primary);
}

.type-success {
  color: var(--el-color-success);
}

.type-error {
  color: var(--el-color-danger);
}

.type-warning {
  color: var(--el-color-warning);
}

.type-info {
  color: var(--el-color-info);
}

/* 标签样式 */
.icon-label {
  font-weight: 500;
  color: var(--el-text-color-primary);
  white-space: nowrap;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .intelligent-icon {
    gap: 4px;
  }
  
  .size-large {
    font-size: 14px;
  }
  
  .size-large .icon-label {
    font-size: 14px;
  }
}

/* iFlytek品牌色彩增强 */
.intelligent-icon.iflytek-primary {
  color: #1890ff;
}

.intelligent-icon.iflytek-secondary {
  color: #667eea;
}

.intelligent-icon.iflytek-accent {
  color: #0066cc;
}

/* 动画效果 */
@keyframes icon-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.intelligent-icon.pulse {
  animation: icon-pulse 2s infinite;
}

.intelligent-icon.glow {
  filter: drop-shadow(0 0 8px currentColor);
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .icon-label {
    color: var(--el-text-color-primary);
  }
}
</style>
