<template>
  <div id="app" class="ai-app">
    <!-- 顶部导航栏 -->
    <header class="ai-header">
      <div class="ai-container">
        <!-- Logo和品牌 -->
        <div class="ai-brand">
          <router-link to="/" class="ai-brand-link">
            <div class="ai-logo">
              <img src="/images/iflytek-spark-logo.svg" alt="iFlytek Spark" class="ai-logo-image" />
            </div>
            <div class="ai-brand-text">
              <div class="ai-brand-name">iFlytek</div>
              <div class="ai-brand-tagline">多模态面试评估系统</div>
            </div>
          </router-link>
        </div>

        <!-- 主导航菜单 -->
        <nav class="ai-nav" v-if="!isMobile">
          <div class="ai-nav-links">
            <router-link to="/" class="ai-nav-link" active-class="ai-nav-link-active">
              <el-icon><House /></el-icon>
              <span>首页</span>
            </router-link>
            <router-link to="/enterprise" class="ai-nav-link" active-class="ai-nav-link-active">
              <el-icon><Setting /></el-icon>
              <span>企业端</span>
            </router-link>
            <router-link to="/candidate" class="ai-nav-link" active-class="ai-nav-link-active">
              <el-icon><User /></el-icon>
              <span>求职者</span>
            </router-link>
            <router-link to="/reports" class="ai-nav-link" active-class="ai-nav-link-active">
              <el-icon><DataBoard /></el-icon>
              <span>报告中心</span>
            </router-link>
          </div>

          <!-- 用户操作区域 -->
          <div class="ai-nav-actions">
            <button class="ai-btn ai-btn-secondary ai-btn-sm" @click="showDemo">
              <el-icon><VideoPlay /></el-icon>
              <span>产品演示</span>
            </button>
            <button class="ai-btn ai-btn-primary ai-btn-sm" @click="startInterview">
              <el-icon><VideoCamera /></el-icon>
              <span>开始面试</span>
            </button>
          </div>
        </nav>

        <!-- 移动端菜单按钮 -->
        <button class="ai-mobile-menu-btn" v-if="isMobile" @click="toggleMobileMenu">
          <el-icon><Grid /></el-icon>
        </button>
      </div>
    </header>

    <!-- 移动端导航菜单 -->
    <div class="ai-mobile-menu" v-if="isMobile && showMobileMenu">
      <div class="ai-mobile-menu-overlay" @click="closeMobileMenu"></div>
      <div class="ai-mobile-menu-content">
        <div class="ai-mobile-menu-header">
          <div class="ai-brand-text">
            <div class="ai-brand-name">iFlytek</div>
            <div class="ai-brand-tagline">多模态面试评估系统</div>
          </div>
          <button class="ai-mobile-menu-close" @click="closeMobileMenu">
            <el-icon><Close /></el-icon>
          </button>
        </div>
        <nav class="ai-mobile-nav">
          <router-link to="/" class="ai-mobile-nav-link" @click="closeMobileMenu">
            <el-icon><House /></el-icon>
            <span>首页</span>
          </router-link>
          <router-link to="/enterprise" class="ai-mobile-nav-link" @click="closeMobileMenu">
            <el-icon><Setting /></el-icon>
            <span>企业端</span>
          </router-link>
          <router-link to="/candidate" class="ai-mobile-nav-link" @click="closeMobileMenu">
            <el-icon class="nav-icon"><User /></el-icon>
            <span>求职者</span>
          </router-link>
          <router-link to="/reports" class="ai-mobile-nav-link" @click="closeMobileMenu">
            <el-icon class="nav-icon"><DataBoard /></el-icon>
            <span>报告中心</span>
          </router-link>
        </nav>
        <div class="ai-mobile-actions">
          <button class="ai-btn ai-btn-secondary ai-btn-block" @click="showDemo">
            <el-icon class="btn-icon"><VideoPlay /></el-icon>
            <span>产品演示</span>
          </button>
          <button class="ai-btn ai-btn-primary ai-btn-block" @click="startInterview">
            <el-icon class="btn-icon"><VideoCamera /></el-icon>
            <span>开始面试</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <main class="ai-main">
      <router-view />
    </main>

    <!-- 页脚 -->
    <footer class="ai-footer">
      <div class="ai-container">
        <div class="ai-footer-content">
          <div class="ai-footer-section">
            <h4>产品服务</h4>
            <ul>
              <li><a href="#">AI面试评估</a></li>
              <li><a href="#">多模态分析</a></li>
              <li><a href="#">智能报告</a></li>
              <li><a href="#">数据洞察</a></li>
            </ul>
          </div>
          <div class="ai-footer-section">
            <h4>解决方案</h4>
            <ul>
              <li><a href="#">企业招聘</a></li>
              <li><a href="#">人才评估</a></li>
              <li><a href="#">技能测试</a></li>
              <li><a href="#">培训评估</a></li>
            </ul>
          </div>
          <div class="ai-footer-section">
            <h4>技术支持</h4>
            <ul>
              <li><a href="#">API文档</a></li>
              <li><a href="#">开发指南</a></li>
              <li><a href="#">常见问题</a></li>
              <li><a href="#">联系我们</a></li>
            </ul>
          </div>
          <div class="ai-footer-section">
            <h4>关于我们</h4>
            <ul>
              <li><a href="#">公司介绍</a></li>
              <li><a href="#">新闻动态</a></li>
              <li><a href="#">加入我们</a></li>
              <li><a href="#">隐私政策</a></li>
            </ul>
          </div>
        </div>
        <div class="ai-footer-bottom">
          <div class="ai-footer-copyright">
            © 2024 iFlytek Co., Ltd. 保留所有权利
          </div>
          <div class="ai-footer-links">
            <a href="#">服务条款</a>
            <a href="#">隐私政策</a>
            <a href="#">Cookie政策</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  House, Setting, User, DataBoard, VideoPlay, VideoCamera,
  Grid, Close
} from '@element-plus/icons-vue'

const router = useRouter()

// 响应式数据
const isMobile = ref(false)
const showMobileMenu = ref(false)

// 方法
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}

const showDemo = () => {
  console.log('显示产品演示')
  router.push('/demo')
}

const startInterview = () => {
  console.log('开始面试')
  router.push('/interview-selection')
}

// 生命周期
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style>
/* ===== 响应式图标系统 ===== */
/* 导航栏图标 - 响应式尺寸 */
.ai-nav-link .el-icon,
.ai-mobile-nav-link .el-icon {
  font-size: var(--icon-base);
  width: var(--icon-base);
  height: var(--icon-base);
  vertical-align: middle;
}

/* 按钮图标 - 响应式尺寸 */
.ai-btn .el-icon {
  font-size: var(--icon-sm);
  width: var(--icon-sm);
  height: var(--icon-sm);
  vertical-align: middle;
}

/* 移动端菜单按钮图标 */
.ai-mobile-menu-btn .el-icon,
.ai-mobile-menu-close .el-icon {
  font-size: var(--icon-lg);
  width: var(--icon-lg);
  height: var(--icon-lg);
}

/* Logo占位符响应式 */
.ai-logo-placeholder {
  width: var(--icon-lg);
  height: var(--icon-lg);
  background: var(--iflytek-gradient-primary);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: var(--font-xs);
  font-weight: bold;
}

/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: var(--font-family-chinese-base);
  background: var(--iflytek-bg-primary);
  color: var(--iflytek-text-primary);
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 容器样式 - 使用响应式框架 */
.ai-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-responsive-lg);
}

/* 头部样式 - 优化品牌标识协调性 */
.ai-header {
  background: var(--iflytek-bg-primary);
  border-bottom: 1px solid var(--iflytek-border-secondary);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.08); /* 轻微阴影增强层次感 */
}

.ai-header .ai-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: clamp(72px, 10vw, 96px); /* 进一步增加高度 */
  min-height: 72px;
  padding: 0 clamp(20px, 4vw, 32px); /* 增大内边距 */
}

/* 品牌样式 - 优化图标文字协调性 */
.ai-brand-link {
  display: flex;
  align-items: center;
  gap: clamp(12px, 3vw, 16px); /* 增大间距，防止重叠 */
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
}

.ai-brand-link:hover {
  transform: translateY(-1px);
}

.ai-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0; /* 防止图标被压缩 */
}

.ai-logo-image {
  width: clamp(32px, 5vw, 48px); /* 增大图标尺寸，提高可见性 */
  height: clamp(32px, 5vw, 48px);
  object-fit: contain;
  transition: all 0.3s ease;
}

.ai-brand-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  line-height: 1.2; /* 紧凑行高 */
}

.ai-brand-name {
  font-size: clamp(20px, 4.5vw, 24px); /* 增大主标题字体 */
  font-weight: var(--font-weight-bold);
  color: var(--iflytek-primary);
  line-height: 1.3;
  margin: 0;
  font-family: 'Microsoft YaHei', sans-serif;
}

.ai-brand-tagline {
  font-size: clamp(13px, 3vw, 16px); /* 增大副标题字体 */
  color: var(--iflytek-text-secondary);
  line-height: 1.3;
  margin: 0;
  font-family: 'Microsoft YaHei', sans-serif;
  white-space: nowrap; /* 防止换行 */
}

/* 导航样式 */
.ai-nav {
  display: flex;
  align-items: center;
  gap: var(--space-responsive-xl);
}

.ai-nav-links {
  display: flex;
  gap: var(--space-responsive-sm);
}

.ai-nav-link {
  display: flex;
  align-items: center;
  gap: var(--space-responsive-sm);
  padding: var(--space-responsive-md) var(--space-responsive-lg);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--iflytek-text-secondary);
  transition: all 0.3s ease;
  font-weight: var(--font-weight-medium);
  font-size: var(--font-base);
  white-space: nowrap;
}

.ai-nav-link:hover {
  background: var(--iflytek-bg-secondary);
  color: var(--iflytek-text-primary);
}

.ai-nav-link-active {
  background: var(--iflytek-primary);
  color: white !important;
}

.ai-nav-actions {
  display: flex;
  gap: var(--space-responsive-md);
}

/* 按钮样式 - 响应式设计 */
.ai-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-responsive-sm);
  padding: var(--space-responsive-md) var(--space-responsive-lg);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  min-height: var(--btn-height-md);
  white-space: nowrap;
}

.ai-btn-primary {
  background: transparent;
  color: var(--iflytek-primary);
  border: 2px solid var(--iflytek-primary);
}

.ai-btn-primary:hover {
  background: var(--iflytek-primary);
  color: white;
  transform: translateY(-2px);
  box-shadow: var(--iflytek-shadow-md);
}

.ai-btn-secondary {
  background: transparent;
  color: var(--iflytek-primary);
  border: 2px solid var(--iflytek-primary);
}

.ai-btn-secondary:hover {
  background: var(--iflytek-primary);
  color: white;
}

.ai-btn-sm {
  padding: var(--space-responsive-sm) var(--space-responsive-md);
  font-size: var(--font-sm);
  min-height: var(--btn-height-sm);
}

.ai-btn-block {
  width: 100%;
  justify-content: center;
}

/* 移动端菜单 */
.ai-mobile-menu-btn {
  background: none;
  border: none;
  color: var(--iflytek-text-primary);
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
}

.ai-mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
}

.ai-mobile-menu-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}

.ai-mobile-menu-content {
  position: absolute;
  top: 0;
  right: 0;
  width: clamp(280px, 80vw, 320px);
  height: 100%;
  background: var(--iflytek-bg-primary);
  padding: var(--space-responsive-lg);
  overflow-y: auto;
}

.ai-mobile-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--iflytek-border-secondary);
}

.ai-mobile-menu-close {
  background: none;
  border: none;
  color: var(--iflytek-text-primary);
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
}

.ai-mobile-nav {
  margin-bottom: 32px;
}

.ai-mobile-nav-link {
  display: flex;
  align-items: center;
  gap: var(--space-responsive-md);
  padding: var(--space-responsive-lg) 0;
  text-decoration: none;
  color: var(--iflytek-text-primary);
  border-bottom: 1px solid var(--iflytek-border-tertiary);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-lg);
  min-height: var(--table-row-height);
}

.ai-mobile-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 主要内容 */
.ai-main {
  flex: 1;
}

/* 页脚样式 */
.ai-footer {
  background: var(--iflytek-bg-secondary);
  border-top: 1px solid var(--iflytek-border-secondary);
  padding: var(--space-responsive-2xl) 0 var(--space-responsive-lg);
  margin-top: var(--space-responsive-2xl);
}

.ai-footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 32px;
  margin-bottom: 32px;
}

.ai-footer-section h4 {
  color: var(--iflytek-text-primary);
  margin-bottom: 16px;
  font-weight: var(--font-weight-semibold);
}

.ai-footer-section ul {
  list-style: none;
}

.ai-footer-section li {
  margin-bottom: 8px;
}

.ai-footer-section a {
  color: var(--iflytek-text-secondary);
  text-decoration: none;
  transition: color 0.3s ease;
}

.ai-footer-section a:hover {
  color: var(--iflytek-primary);
}

.ai-footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 24px;
  border-top: 1px solid var(--iflytek-border-secondary);
  color: var(--iflytek-text-tertiary);
  font-size: var(--font-size-sm);
}

.ai-footer-links {
  display: flex;
  gap: 24px;
}

.ai-footer-links a {
  color: var(--iflytek-text-tertiary);
  text-decoration: none;
}

.ai-footer-links a:hover {
  color: var(--iflytek-primary);
}

/* 响应式设计 - 使用响应式框架 */
@media (max-width: 768px) {
  .ai-container {
    padding: 0 var(--space-responsive-md);
  }

  .ai-header .ai-container {
    height: clamp(64px, 10vw, 72px); /* 移动端也增加高度 */
    padding: 0 16px;
  }

  .ai-brand-link {
    gap: 10px; /* 移动端保持适中间距 */
  }

  .ai-logo-image {
    width: 36px; /* 移动端图标也增大 */
    height: 36px;
  }

  .ai-brand-name {
    font-size: 20px; /* 移动端主标题增大 */
    line-height: 1.3;
  }

  .ai-brand-tagline {
    font-size: 14px; /* 移动端副标题增大 */
    line-height: 1.3;
  }

  .ai-nav {
    display: none; /* 隐藏桌面导航 */
  }

  .ai-mobile-menu-btn {
    display: flex; /* 显示移动端菜单按钮 */
  }

  .ai-footer-bottom {
    flex-direction: column;
    gap: var(--space-responsive-md);
    text-align: center;
  }

  .ai-footer-links {
    justify-content: center;
    gap: var(--space-responsive-md);
  }

  .ai-footer-content {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: var(--space-responsive-lg);
  }
}

/* 超小屏幕优化 - 品牌标识精细调整 */
@media (max-width: 480px) {
  .ai-container {
    padding: 0 var(--space-responsive-sm);
  }

  .ai-brand-link {
    gap: 6px; /* 小屏幕紧凑间距 */
  }

  .ai-logo-image {
    width: 24px;
    height: 24px;
  }

  .ai-brand-name {
    font-size: 16px;
    line-height: 1.1;
  }

  .ai-brand-tagline {
    font-size: 11px;
    line-height: 1.1;
  }

  .ai-header .ai-container {
    height: 56px;
    min-height: 56px;
    padding: 0 12px;
  }

  .ai-brand-tagline {
    display: none;
  }

  .ai-mobile-menu-content {
    width: 100vw;
    padding: var(--space-responsive-md);
  }

  .ai-footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
}

/* 大屏幕优化 - 品牌标识最佳显示 */
@media (min-width: 1200px) {
  .ai-nav {
    gap: var(--space-responsive-2xl);
  }

  .ai-nav-links {
    gap: var(--space-responsive-md);
  }

  /* 品牌标识大屏幕优化 */
  .ai-brand-link {
    gap: 16px; /* 大屏幕更宽松间距 */
  }

  .ai-logo-image {
    width: 48px; /* 大屏幕图标最大 */
    height: 48px;
  }

  .ai-brand-name {
    font-size: 24px; /* 大屏幕主标题最大 */
    line-height: 1.3;
  }

  .ai-brand-tagline {
    font-size: 16px; /* 大屏幕副标题最大 */
    line-height: 1.3;
  }

  .ai-header .ai-container {
    height: 96px; /* 大屏幕头部最高 */
    min-height: 96px;
    padding: 0 32px;
  }
}

/* 中等屏幕优化 */
@media (min-width: 769px) and (max-width: 1199px) {
  .ai-brand-link {
    gap: 14px; /* 中等屏幕适中间距 */
  }

  .ai-logo-image {
    width: 40px; /* 中等屏幕图标增大 */
    height: 40px;
  }

  .ai-brand-name {
    font-size: 22px; /* 中等屏幕主标题增大 */
    line-height: 1.3;
  }

  .ai-brand-tagline {
    font-size: 15px; /* 中等屏幕副标题增大 */
    line-height: 1.3;
  }

  .ai-header .ai-container {
    height: 84px; /* 中等屏幕头部增高 */
    min-height: 84px;
    padding: 0 24px;
  }
}

/* 高对比度和可访问性优化 */
@media (prefers-contrast: high) {
  .ai-brand-name {
    color: #0066cc; /* 更高对比度的蓝色，符合WCAG 2.1 AA */
    font-weight: 700;
  }

  .ai-brand-tagline {
    color: #333333; /* 更高对比度的灰色 */
  }

  .ai-header {
    border-bottom: 2px solid #0066cc;
  }
}

/* 半屏显示模式优化 - 防止文字重叠 */
@media (min-width: 769px) and (max-width: 1024px) {
  .ai-brand-tagline {
    display: none; /* 在半屏模式下隐藏副标题，防止重叠 */
  }

  .ai-brand-name {
    font-size: 20px; /* 半屏模式下主标题适中 */
  }

  .ai-header .ai-container {
    height: 72px;
    min-height: 72px;
  }
}

/* 超小屏幕优化 - 进一步防止重叠 */
@media (max-width: 480px) {
  .ai-brand-tagline {
    display: none; /* 小屏幕隐藏副标题 */
  }

  .ai-brand-name {
    font-size: 18px;
  }

  .ai-logo-image {
    width: 32px;
    height: 32px;
  }

  .ai-brand-link {
    gap: 8px;
  }
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  .ai-brand-link,
  .ai-logo-image {
    transition: none;
  }

  .ai-brand-link:hover {
    transform: none;
  }
}
</style>
