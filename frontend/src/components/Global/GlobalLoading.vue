<template>
  <teleport to="body">
    <transition name="loading-fade" appear>
      <div v-if="globalState.isLoading.value" class="global-loading-overlay">
        <div class="global-loading-content">
          <!-- 动态加载图标 -->
          <div class="global-loading-spinner">
            <div class="spinner-inner">
              <div class="spinner-circle" v-for="i in 8" :key="i" :style="{ '--delay': i * 0.1 + 's' }"></div>
            </div>
          </div>
          
          <!-- 加载文本 -->
          <div class="global-loading-text">{{ globalState.loadingText.value }}</div>
          
          <!-- 进度条 -->
          <div class="global-loading-progress">
            <div 
              class="global-loading-progress-bar" 
              :style="{ width: globalState.loadingProgress.value + '%' }">
            </div>
          </div>
          
          <!-- 副标题 -->
          <div v-if="globalState.loadingSubtitle?.value" class="global-loading-subtitle">
            {{ globalState.loadingSubtitle.value }}
          </div>
          
          <!-- iFlytek品牌标识 */
          <div class="global-loading-brand">
            <div class="brand-logo">
              <el-icon><Cpu /></el-icon>
            </div>
            <div class="brand-text">iFlytek星火大模型</div>
          </div>
          
          <!-- 动态粒子背景 -->
          <div class="loading-particles">
            <div 
              v-for="i in 20" 
              :key="i" 
              class="particle" 
              :style="getParticleStyle(i)">
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { inject } from 'vue'
import { Cpu } from '@element-plus/icons-vue'

// 注入全局状态
const globalState = inject('globalState')

// 粒子样式生成
const getParticleStyle = (index) => {
  const size = Math.random() * 4 + 2
  const duration = Math.random() * 3 + 2
  const delay = Math.random() * 2
  
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`
  }
}
</script>

<style scoped>
/* 全局加载遮罩 */
.global-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 102, 204, 0.95) 0%, rgba(76, 81, 191, 0.95) 50%, rgba(118, 75, 162, 0.95) 100%);
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
}

.global-loading-content {
  text-align: center;
  color: white;
  max-width: 400px;
  padding: 40px;
  position: relative;
  z-index: 2;
}

/* 增强的加载动画 */
.global-loading-spinner {
  width: 80px;
  height: 80px;
  margin: 0 auto 30px;
  position: relative;
}

.spinner-inner {
  width: 100%;
  height: 100%;
  position: relative;
}

.spinner-circle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  animation: spinnerPulse 1.5s ease-in-out infinite;
  animation-delay: var(--delay, 0s);
}

.spinner-circle:nth-child(1) { top: 0; left: 50%; transform: translateX(-50%); }
.spinner-circle:nth-child(2) { top: 15%; right: 15%; }
.spinner-circle:nth-child(3) { top: 50%; right: 0; transform: translateY(-50%); }
.spinner-circle:nth-child(4) { bottom: 15%; right: 15%; }
.spinner-circle:nth-child(5) { bottom: 0; left: 50%; transform: translateX(-50%); }
.spinner-circle:nth-child(6) { bottom: 15%; left: 15%; }
.spinner-circle:nth-child(7) { top: 50%; left: 0; transform: translateY(-50%); }
.spinner-circle:nth-child(8) { top: 15%; left: 15%; }

@keyframes spinnerPulse {
  0%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
}

/* 加载文本 */
.global-loading-text {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 25px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  animation: textPulse 2s ease-in-out infinite;
}

@keyframes textPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

/* 进度条 */
.global-loading-progress {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

.global-loading-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #ffffff 0%, #f0f8ff 50%, #ffffff 100%);
  border-radius: 3px;
  transition: width 0.3s ease;
  position: relative;
  overflow: hidden;
}

.global-loading-progress-bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  animation: progressShimmer 1.5s infinite;
}

@keyframes progressShimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

/* 副标题 */
.global-loading-subtitle {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 25px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

/* iFlytek品牌标识 */
.global-loading-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
  opacity: 0.8;
}

.brand-logo {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  animation: brandPulse 2s ease-in-out infinite;
}

@keyframes brandPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.brand-text {
  font-size: 16px;
  font-weight: 500;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

/* 动态粒子背景 */
.loading-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  overflow: hidden;
}

.particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: particleFloat linear infinite;
  pointer-events: none;
}

@keyframes particleFloat {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
}

/* 过渡动画 */
.loading-fade-enter-active,
.loading-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.loading-fade-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.loading-fade-leave-to {
  opacity: 0;
  transform: scale(1.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .global-loading-content {
    padding: 30px 20px;
    max-width: 300px;
  }
  
  .global-loading-spinner {
    width: 60px;
    height: 60px;
  }
  
  .global-loading-text {
    font-size: 18px;
  }
  
  .global-loading-subtitle {
    font-size: 13px;
  }
  
  .brand-logo {
    width: 35px;
    height: 35px;
    font-size: 18px;
  }
  
  .brand-text {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .global-loading-content {
    padding: 25px 15px;
  }
  
  .global-loading-spinner {
    width: 50px;
    height: 50px;
  }
  
  .global-loading-text {
    font-size: 16px;
  }
  
  .brand-logo {
    width: 30px;
    height: 30px;
    font-size: 16px;
  }
  
  .brand-text {
    font-size: 13px;
  }
}

/* 无障碍支持 */
@media (prefers-reduced-motion: reduce) {
  .global-loading-spinner,
  .particle,
  .global-loading-text,
  .brand-logo,
  .global-loading-progress-bar::before {
    animation: none !important;
  }
  
  .loading-fade-enter-active,
  .loading-fade-leave-active {
    transition: none !important;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .global-loading-overlay {
    background: #000000;
    color: #ffffff;
  }
  
  .global-loading-progress {
    background: #333333;
  }
  
  .global-loading-progress-bar {
    background: #ffffff;
  }
}

/* 深色主题支持 */
@media (prefers-color-scheme: dark) {
  .global-loading-overlay {
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(26, 32, 44, 0.95) 50%, rgba(45, 55, 72, 0.95) 100%);
  }
}
</style>
