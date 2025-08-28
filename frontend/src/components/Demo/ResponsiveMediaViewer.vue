<template>
  <div class="responsive-media-viewer">
    <!-- 移动端优化的媒体查看器 -->
    <div class="media-container" :class="{ 'mobile-view': isMobile }">
      
      <!-- 媒体头部信息 -->
      <div class="media-header">
        <div class="media-title">
          <h3>{{ currentMedia?.title }}</h3>
          <p class="media-description">{{ currentMedia?.description }}</p>
        </div>
        <div class="media-controls">
          <el-button 
            v-if="!isMobile" 
            @click="toggleFullscreen" 
            :icon="FullScreen" 
            circle
            size="small"
          />
          <el-button 
            @click="closeViewer" 
            :icon="Close" 
            circle
            size="small"
          />
        </div>
      </div>

      <!-- 功能演示区域 -->
      <div v-if="mediaType === 'demo'" class="demo-container">
        <div class="demo-content">
          <div class="demo-icon">
            <el-icon><component :is="currentMedia?.icon || 'Document'" /></el-icon>
          </div>
          <h3 class="demo-title">{{ currentMedia?.title }}</h3>
          <p class="demo-description">{{ currentMedia?.description }}</p>
          <div class="demo-actions">
            <el-button type="primary" @click="onDemoStart">
              <el-icon><Setting /></el-icon>
              开始体验
            </el-button>
          </div>
        </div>
      </div>

      <!-- 图片查看器 -->
      <div v-if="mediaType === 'image'" class="image-container">
        <img 
          :src="currentMedia?.src" 
          :alt="currentMedia?.title"
          class="responsive-image"
          @load="onMediaLoaded"
        />
        
        <!-- 图片信息覆盖层 -->
        <div class="image-overlay" v-show="showOverlay">
          <div class="image-info">
            <div class="info-item">
              <el-icon><Document /></el-icon>
              <span>{{ currentMedia?.size }}</span>
            </div>
            <div class="info-item">
              <el-icon><TrendCharts /></el-icon>
              <span>1024×1024</span>
            </div>
            <div class="info-item">
              <el-icon><Setting /></el-icon>
              <span>Microsoft YaHei</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 媒体元数据 -->
      <div class="media-metadata">
        <div class="metadata-section">
          <h4>技术特性</h4>
          <div class="feature-tags">
            <el-tag 
              v-for="feature in currentMedia?.features || currentMedia?.tags" 
              :key="feature"
              size="small"
              :type="getFeatureTagType(feature)"
            >
              {{ feature }}
            </el-tag>
          </div>
        </div>
        
        <div v-if="mediaType === 'video'" class="metadata-section">
          <h4>视频规格</h4>
          <div class="spec-grid">
            <div class="spec-item">
              <span class="spec-label">分辨率:</span>
              <span class="spec-value">1920x1080</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">编码:</span>
              <span class="spec-value">H.264</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">帧率:</span>
              <span class="spec-value">30fps</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">中文字体:</span>
              <span class="spec-value">Microsoft YaHei</span>
            </div>
          </div>
        </div>

        <div v-if="mediaType === 'image'" class="metadata-section">
          <h4>图片规格</h4>
          <div class="spec-grid">
            <div class="spec-item">
              <span class="spec-label">分辨率:</span>
              <span class="spec-value">1024×1024</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">格式:</span>
              <span class="spec-value">PNG</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">质量:</span>
              <span class="spec-value">企业级</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">中文字体:</span>
              <span class="spec-value">Microsoft YaHei</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 移动端操作按钮 -->
      <div v-if="isMobile" class="mobile-actions">
        <el-button 
          v-if="mediaType === 'video'" 
          @click="togglePlay" 
          :icon="isPlaying ? VideoPause : VideoPlay"
          type="primary"
          size="large"
          round
        >
          {{ isPlaying ? '暂停' : '播放' }}
        </el-button>
        <el-button 
          @click="shareMedia" 
          :icon="Share"
          size="large"
          round
        >
          分享
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  View, Close, Timer, TrendCharts, Document, Setting, VideoPlay, ArrowRight
} from '@element-plus/icons-vue'

// Props
const props = defineProps({
  media: {
    type: Object,
    required: true
  },
  type: {
    type: String,
    required: true,
    validator: (value) => ['video', 'image'].includes(value)
  }
})

// Emits
const emit = defineEmits(['close', 'fullscreen'])

// 响应式数据
const videoElement = ref(null)
const showOverlay = ref(true)
const isPlaying = ref(false)
const isFullscreen = ref(false)
const screenWidth = ref(window.innerWidth)

// 计算属性
const currentMedia = computed(() => props.media)
const mediaType = computed(() => props.type)
const isMobile = computed(() => screenWidth.value < 768)

// 方法
const onMediaLoaded = () => {
  console.log('媒体加载完成')
  ElMessage.success('媒体加载完成')
}

const onMediaPlay = () => {
  isPlaying.value = true
  showOverlay.value = false
}

const onMediaPause = () => {
  isPlaying.value = false
  showOverlay.value = true
}

const togglePlay = () => {
  if (videoElement.value) {
    if (isPlaying.value) {
      videoElement.value.pause()
    } else {
      videoElement.value.play()
    }
  }
}

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  emit('fullscreen', isFullscreen.value)
}

const closeViewer = () => {
  emit('close')
}

const shareMedia = () => {
  if (navigator.share) {
    navigator.share({
      title: currentMedia.value?.title,
      text: currentMedia.value?.description,
      url: window.location.href
    })
  } else {
    ElMessage.info('分享功能需要在HTTPS环境下使用')
  }
}

const getFeatureTagType = (feature) => {
  const tagTypes = {
    '完整演示': 'primary',
    'AI技术': 'success',
    '案例分析': 'warning',
    '大数据': 'info',
    'IoT': 'danger',
    '主控制台': 'primary',
    '技术架构': 'success',
    'Microsoft YaHei': 'success',
    '功能导航': 'info',
    '中文界面': 'primary',
    '神经网络': 'success',
    '算法优化': 'warning',
    '深度学习': 'success'
  }
  return tagTypes[feature] || 'info'
}

const handleResize = () => {
  screenWidth.value = window.innerWidth
}

// 生命周期
onMounted(() => {
  window.addEventListener('resize', handleResize)
  
  // 自动隐藏覆盖层
  setTimeout(() => {
    if (mediaType.value === 'video' && !isPlaying.value) {
      showOverlay.value = false
    }
  }, 3000)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.responsive-media-viewer {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.media-container {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  max-width: 90vw;
  max-height: 90vh;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.media-container.mobile-view {
  max-width: 95vw;
  max-height: 95vh;
  border-radius: 12px;
}

.media-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.media-title h3 {
  margin: 0 0 8px 0;
  color: #1a202c;
  font-size: 1.2rem;
}

.media-description {
  margin: 0;
  color: #4a5568;
  font-size: 0.9rem;
  line-height: 1.4;
}

.media-controls {
  display: flex;
  gap: 8px;
}

.video-container, .image-container {
  position: relative;
  background: #000;
}

.responsive-video, .responsive-image {
  width: 100%;
  height: auto;
  max-height: 60vh;
  object-fit: contain;
}

.video-overlay, .image-overlay {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.video-info, .image-info {
  display: flex;
  gap: 16px;
  align-items: center;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.9rem;
}

.media-metadata {
  padding: 20px;
}

.metadata-section {
  margin-bottom: 20px;
}

.metadata-section h4 {
  margin: 0 0 12px 0;
  color: #1a202c;
  font-size: 1rem;
}

.feature-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.spec-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.spec-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background: #f7fafc;
  border-radius: 6px;
}

.spec-label {
  font-weight: 500;
  color: #4a5568;
}

.spec-value {
  color: #1a202c;
  font-weight: 600;
}

.mobile-actions {
  padding: 20px;
  display: flex;
  gap: 12px;
  justify-content: center;
  border-top: 1px solid #eee;
}

@media (max-width: 768px) {
  .responsive-media-viewer {
    padding: 10px;
  }
  
  .media-header {
    padding: 16px;
    flex-direction: column;
    gap: 12px;
  }
  
  .media-controls {
    align-self: flex-end;
  }
  
  .responsive-video, .responsive-image {
    max-height: 50vh;
  }
  
  .video-info, .image-info {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
  
  .spec-grid {
    grid-template-columns: 1fr;
  }
  
  .metadata-section {
    margin-bottom: 16px;
  }
}

@media (max-width: 480px) {
  .feature-tags {
    justify-content: center;
  }
  
  .mobile-actions {
    flex-direction: column;
  }
}
</style>
