<template>
  <div 
    class="lazy-image-container"
    :class="{ 
      'loaded': isLoaded, 
      'loading': isLoading,
      'hover-zoom': hoverZoom,
      'parallax': parallax
    }"
    ref="imageContainer"
  >
    <!-- 占位符 -->
    <div v-if="!isLoaded" class="image-placeholder">
      <div class="placeholder-shimmer"></div>
      <div class="placeholder-content">
        <el-icon class="placeholder-icon"><Document /></el-icon>
        <span class="placeholder-text">{{ placeholderText }}</span>
      </div>
    </div>

    <!-- 实际图片 -->
    <img
      v-show="isLoaded"
      :src="currentSrc"
      :alt="alt"
      :title="title"
      class="lazy-image"
      @load="onImageLoad"
      @error="onImageError"
    />

    <!-- 覆盖层 -->
    <div v-if="overlay" class="image-overlay">
      <slot name="overlay">
        <div class="overlay-content">
          <h4 v-if="overlayTitle">{{ overlayTitle }}</h4>
          <p v-if="overlayDescription">{{ overlayDescription }}</p>
        </div>
      </slot>
    </div>

    <!-- 加载进度 -->
    <div v-if="showProgress && isLoading" class="loading-progress">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${loadingProgress}%` }"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Document } from '@element-plus/icons-vue'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  fallbackSrc: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  placeholderText: {
    type: String,
    default: '加载中...'
  },
  hoverZoom: {
    type: Boolean,
    default: false
  },
  parallax: {
    type: Boolean,
    default: false
  },
  overlay: {
    type: Boolean,
    default: false
  },
  overlayTitle: {
    type: String,
    default: ''
  },
  overlayDescription: {
    type: String,
    default: ''
  },
  showProgress: {
    type: Boolean,
    default: false
  },
  fadeInDuration: {
    type: Number,
    default: 500
  }
})

const emit = defineEmits(['load', 'error'])

const imageContainer = ref(null)
const isLoaded = ref(false)
const isLoading = ref(false)
const hasError = ref(false)
const loadingProgress = ref(0)
const observer = ref(null)

const currentSrc = computed(() => {
  if (hasError.value && props.fallbackSrc) {
    return props.fallbackSrc
  }
  return props.src
})

const onImageLoad = () => {
  console.log('图片加载成功:', currentSrc.value)
  isLoaded.value = true
  isLoading.value = false
  loadingProgress.value = 100
  emit('load')
}

const onImageError = () => {
  console.warn('图片加载失败:', currentSrc.value)

  // 如果当前不是备用图片，尝试备用图片
  if (props.fallbackSrc && currentSrc.value !== props.fallbackSrc) {
    console.log('尝试加载备用图片:', props.fallbackSrc)
    currentSrc.value = props.fallbackSrc
    hasError.value = false
    return
  }

  // 如果备用图片也失败，生成本地SVG占位符
  console.log('所有图片源都失败，生成本地占位符')
  generateLocalFallback()

  emit('error')
}

const generateLocalFallback = () => {
  const width = 400
  const height = 300
  const text = props.alt || '图片加载失败'
  const bgColor = '667eea'

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad-${Date.now()}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#${bgColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#${bgColor}88;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad-${Date.now()})"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16"
            fill="white" text-anchor="middle" dy=".3em">${text}</text>
    </svg>
  `

  const localSrc = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`

  console.log('生成本地SVG占位符:', text)

  // 更新当前图片源并设置状态
  currentSrc.value = localSrc
  hasError.value = false
  isLoaded.value = true
  isLoading.value = false
}

const startLoading = () => {
  if (isLoading.value || isLoaded.value) return

  console.log('开始加载图片:', props.src)
  isLoading.value = true
  loadingProgress.value = 0

  // 模拟加载进度
  if (props.showProgress) {
    const progressInterval = setInterval(() => {
      if (loadingProgress.value < 90) {
        loadingProgress.value += Math.random() * 10
      } else {
        clearInterval(progressInterval)
      }
    }, 100)
  }
}

const setupIntersectionObserver = () => {
  if (!window.IntersectionObserver) {
    // 不支持IntersectionObserver，直接加载
    startLoading()
    return
  }

  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startLoading()
          observer.value?.unobserve(entry.target)
        }
      })
    },
    {
      rootMargin: '50px'
    }
  )

  if (imageContainer.value) {
    observer.value.observe(imageContainer.value)
  }
}

const setupParallax = () => {
  if (!props.parallax) return

  const handleScroll = () => {
    if (!imageContainer.value || !isLoaded.value) return

    const rect = imageContainer.value.getBoundingClientRect()
    const scrolled = window.pageYOffset
    const rate = scrolled * -0.5

    imageContainer.value.style.transform = `translateY(${rate}px)`
  }

  window.addEventListener('scroll', handleScroll, { passive: true })
  
  return () => {
    window.removeEventListener('scroll', handleScroll)
  }
}

onMounted(() => {
  setupIntersectionObserver()
  const cleanupParallax = setupParallax()
  
  onUnmounted(() => {
    observer.value?.disconnect()
    cleanupParallax?.()
  })
})
</script>

<style scoped>
.lazy-image-container {
  position: relative;
  overflow: hidden;
  background: var(--bg-secondary, #f5f5f5);
  border-radius: var(--border-radius-md, 8px);
  transition: all var(--transition-base, 0.3s ease);
}

.lazy-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all var(--transition-base, 0.3s ease);
  opacity: 0;
}

.loaded .lazy-image {
  opacity: 1;
}

.hover-zoom:hover .lazy-image {
  transform: scale(1.05);
}

.image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.placeholder-shimmer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm, 8px);
  color: var(--text-secondary, #666);
  z-index: 1;
}

.placeholder-icon {
  font-size: 2rem;
  opacity: 0.5;
}

.placeholder-text {
  font-size: var(--font-size-sm, 14px);
  opacity: 0.7;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(0, 0, 0, 0.7) 100%
  );
  display: flex;
  align-items: flex-end;
  padding: var(--spacing-lg, 16px);
  opacity: 0;
  transition: opacity var(--transition-base, 0.3s ease);
}

.lazy-image-container:hover .image-overlay {
  opacity: 1;
}

.overlay-content {
  color: white;
}

.overlay-content h4 {
  margin: 0 0 var(--spacing-xs, 4px) 0;
  font-size: var(--font-size-lg, 18px);
  font-weight: var(--font-weight-semibold, 600);
}

.overlay-content p {
  margin: 0;
  font-size: var(--font-size-sm, 14px);
  opacity: 0.9;
}

.loading-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: rgba(0, 0, 0, 0.1);
}

.progress-bar {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary, #1890ff), var(--color-primary-light, #40a9ff));
  transition: width 0.3s ease;
}

.parallax {
  will-change: transform;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hover-zoom:hover .lazy-image {
    transform: none;
  }
  
  .image-overlay {
    opacity: 1;
  }
}
</style>
