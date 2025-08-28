<template>
  <div class="enterprise-homepage">
    <!-- 顶部导航栏 -->
    <header class="enterprise-header">
      <div class="header-container">
        <div class="logo-section">
          <img src="/images/iflytek-spark-logo.svg" alt="iFlytek Spark" class="logo" />
          <span class="brand-text">iFlytek Spark AI面试系统</span>
        </div>
        
        <nav class="nav-menu">
          <el-menu mode="horizontal" :default-active="activeMenu" class="enterprise-nav">
            <el-menu-item index="home" @click="navigateTo('/')">首页</el-menu-item>
            <el-menu-item index="demo" @click="navigateTo('/demo')">产品演示</el-menu-item>
            <el-menu-item index="interview" @click="navigateTo('/interview-selection')">开始面试</el-menu-item>
            <el-menu-item index="reports" @click="navigateTo('/reports')">面试报告</el-menu-item>
            <el-menu-item index="dashboard" @click="navigateTo('/intelligent-dashboard')">数据洞察</el-menu-item>
          </el-menu>
        </nav>
        
        <div class="header-actions">
          <el-button @click="navigateTo('/candidate-portal')" class="secondary-btn">
            候选人入口
          </el-button>
          <el-button type="primary" @click="navigateTo('/enterprise-home')" class="cta-button">
            <el-icon><Plus /></el-icon>
            企业版体验
          </el-button>
        </div>
      </div>
    </header>

    <!-- 主横幅区域 - 借鉴大易平台设计 -->
    <section class="hero-section">
      <div class="hero-container">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">
              <span class="gradient-text">AI+招聘</span><br>
              <span class="hero-brand">iFlytek Spark智能面试系统</span>
            </h1>
            <p class="hero-subtitle">
              基于讯飞星火大模型的多模态AI面试解决方案<br>
              让招聘更智能、更高效、更精准
            </p>
            <div class="hero-stats">
              <div class="stat-item">
                <span class="stat-number">95%+</span>
                <span class="stat-label">语音识别准确率</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">&lt;100ms</span>
                <span class="stat-label">平均响应时间</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">99.9%</span>
                <span class="stat-label">系统可用性</span>
              </div>
            </div>
            <div class="hero-actions">
              <el-button type="primary" size="large" @click="startInterview" class="primary-cta">
                立即开始面试
                <el-icon><ArrowRight /></el-icon>
              </el-button>
              <el-button size="large" @click="watchDemo" class="secondary-cta">
                观看产品演示
                <el-icon><VideoPlay /></el-icon>
              </el-button>
            </div>
          </div>
          <div class="hero-visual">
            <!-- 浮动卡片已移除 -->
          </div>
        </div>
      </div>
    </section>

    <!-- 核心产品模块 - 借鉴大易平台卡片设计 -->
    <section class="products-section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">核心AI面试解决方案</h2>
          <p class="section-subtitle">
            基于iFlytek Spark大模型，提供全方位智能面试体验
          </p>
        </div>
        
        <div class="products-grid">
          <div class="product-card primary-product" v-for="product in coreProducts" :key="product.id" @click="navigateToProduct(product.route)">
            <div class="card-header">
              <div class="product-icon" :style="{ background: product.gradient }">
                <el-icon :size="32"><component :is="product.icon" /></el-icon>
              </div>
              <h3 class="product-title">{{ product.title }}</h3>
            </div>
            <p class="product-description">{{ product.description }}</p>
            <ul class="feature-list">
              <li v-for="feature in product.features" :key="feature">
                <el-icon class="check-icon"><Check /></el-icon>
                {{ feature }}
              </li>
            </ul>
            <div class="card-footer">
              <el-button type="primary" class="learn-more-btn">
                立即体验
                <el-icon><ArrowRight /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 技术优势展示 - 大易平台风格 -->
    <section class="advantages-section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">iFlytek Spark技术优势</h2>
          <p class="section-subtitle">领先的多模态AI技术，重新定义智能面试</p>
        </div>
        
        <div class="advantages-grid">
          <div class="advantage-item" v-for="advantage in techAdvantages" :key="advantage.id">
            <div class="advantage-icon">
              <el-icon :size="48"><component :is="advantage.icon" /></el-icon>
            </div>
            <h4 class="advantage-title">{{ advantage.title }}</h4>
            <p class="advantage-description">{{ advantage.description }}</p>
            <div class="advantage-metrics">
              <span class="metric-value">{{ advantage.metric }}</span>
              <span class="metric-label">{{ advantage.metricLabel }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 快速开始区域 -->
    <section class="quick-start-section">
      <div class="section-container">
        <div class="quick-start-card">
          <div class="quick-start-content">
            <h2 class="quick-start-title">立即开始您的AI面试之旅</h2>
            <p class="quick-start-subtitle">选择适合您的使用方式，体验智能面试的魅力</p>
            <div class="quick-start-actions">
              <el-button type="primary" size="large" @click="startInterview" class="iflytek-btn-primary start-btn">
                <el-icon class="btn-icon"><VideoCamera /></el-icon>
                开始AI面试
              </el-button>
              <el-button size="large" @click="watchDemo" class="iflytek-btn-secondary demo-btn">
                <el-icon class="btn-icon"><VideoPlay /></el-icon>
                观看演示
              </el-button>
              <el-button size="large" @click="viewReports" class="iflytek-btn-secondary report-btn">
                <el-icon class="btn-icon"><Grid /></el-icon>
                查看报告
              </el-button>
            </div>
          </div>
          <div class="quick-start-visual">
            <div class="visual-elements">
              <div class="element-1"></div>
              <div class="element-2"></div>
              <div class="element-3"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Plus, ArrowRight, VideoPlay, Cpu, Microphone, Grid,
  Check, TrendCharts, Lock, Clock, VideoCamera
} from '@element-plus/icons-vue'

const router = useRouter()
const activeMenu = ref('home')

// 核心产品数据
const coreProducts = ref([
  {
    id: 1,
    title: 'AI智能面试官',
    description: '基于iFlytek Spark大模型的智能面试官，支持多轮对话、实时评估和个性化问题生成',
    icon: 'Cpu',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    route: '/interview-selection',
    features: [
      '自然语言理解与生成',
      '实时语音交互分析', 
      '智能问题动态调整',
      '多维度能力评估'
    ]
  },
  {
    id: 2,
    title: '多模态分析引擎',
    description: '集成语音识别、情感分析和行为评估的综合分析系统',
    icon: 'Grid',
    gradient: 'linear-gradient(135deg, #1890ff 0%, #0066cc 100%)',
    route: '/demo',
    features: [
      '语音质量智能评估',
      '情感状态实时监测',
      '表达能力量化分析',
      '综合评分自动生成'
    ]
  },
  {
    id: 3,
    title: '智能招聘管理',
    description: '企业级招聘流程管理，从职位发布到人才录用的全链路智能化',
    icon: 'TrendCharts',
    gradient: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
    route: '/intelligent-dashboard',
    features: [
      '职位智能匹配推荐',
      '候选人批量筛选',
      '面试流程自动化',
      '数据驱动决策支持'
    ]
  }
])

// 技术优势数据
const techAdvantages = ref([
  {
    id: 1,
    title: '领先AI技术',
    description: '基于iFlytek Spark大模型，具备强大的自然语言理解和生成能力',
    icon: 'Cpu',
    metric: '95%+',
    metricLabel: '语音识别准确率'
  },
  {
    id: 2,
    title: '实时处理能力',
    description: '毫秒级响应速度，支持大规模并发面试场景',
    icon: 'Clock',
    metric: '<100ms',
    metricLabel: '平均响应时间'
  },
  {
    id: 3,
    title: '数据安全保障',
    description: '企业级安全防护，确保面试数据和候选人隐私安全',
    icon: 'Lock',
    metric: '99.9%',
    metricLabel: '系统可用性'
  }
])

// 导航方法
const navigateTo = (path) => {
  router.push(path)
}

const navigateToProduct = (route) => {
  router.push(route)
}

const startInterview = () => {
  router.push('/interview-selection')
}

const watchDemo = () => {
  router.push('/demo')
}

const viewReports = () => {
  router.push('/reports')
}
</script>

<style scoped>
/* 引入修复样式 */
@import '../styles/homepage-display-fix.css';

/* 使用 WCAG 优化的 iFlytek 品牌色彩系统 */
.enterprise-homepage {
  /* 使用 WCAG 优化的颜色变量 */
  --local-primary: var(--iflytek-primary-wcag);
  --local-primary-dark: var(--iflytek-primary-dark-wcag);
  --local-secondary: var(--iflytek-secondary-wcag);
  --local-accent: var(--iflytek-accent-wcag);
  --local-success: var(--success-wcag-aa);

  /* 使用 WCAG AA/AAA 级别文字色彩 */
  --local-text-primary: var(--text-primary-aaa);
  --local-text-secondary: var(--text-secondary-aaa);
  --local-text-tertiary: var(--text-tertiary-aaa);
  --local-text-white: var(--text-inverse-aaa);
  --local-text-white-secondary: rgba(255, 255, 255, 0.95);
  --local-text-white-tertiary: rgba(255, 255, 255, 0.85);

  /* 使用 WCAG 优化的背景色彩 */
  --local-bg-primary: var(--bg-primary-wcag);
  --local-bg-secondary: var(--bg-secondary-wcag);
  --local-bg-card: var(--bg-card-wcag);
  --local-bg-panel: var(--bg-panel-wcag);

  /* 使用 WCAG 优化的渐变背景 */
  --local-gradient-hero: var(--gradient-primary-wcag);
  --local-gradient-secondary: var(--gradient-secondary-wcag);

  /* 中文字体系统 */
  --font-family-chinese: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', 'SimHei', sans-serif;
  --font-family-chinese-title: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', 'SimHei', sans-serif;
}

.enterprise-homepage {
  min-height: 100vh !important;
  background: #f7fafc !important;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', 'SimHei', sans-serif !important;
  color: #1a1a1a !important;
  line-height: 1.6 !important;
  /* 确保页面正确加载 */
  opacity: 1;
  visibility: visible;
  transition: opacity 0.3s ease-in-out;
}

/* 品牌文字样式 */
.hero-brand {
  color: var(--local-text-white) !important;
  font-weight: 600;
  font-family: var(--font-family-chinese-title) !important;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

/* 顶部导航 */
.enterprise-header {
  background: var(--local-bg-primary) !important;
  box-shadow: var(--shadow-md-wcag);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid var(--border-base-wcag);
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  height: 40px;
  width: auto;
}

.brand-text {
  font-size: 18px;
  font-weight: 600;
  color: var(--local-primary) !important;
  font-family: var(--font-family-chinese-title) !important;
}

.enterprise-nav {
  border: none;
  background: transparent;
}

.enterprise-nav .el-menu-item {
  font-family: var(--font-family-chinese) !important;
  font-size: 16px !important;
  font-weight: 500 !important;
  color: var(--text-primary) !important;
  border-bottom: none !important;
}

.enterprise-nav .el-menu-item:hover {
  color: var(--iflytek-primary) !important;
  background-color: rgba(24, 144, 255, 0.06) !important;
}

.enterprise-nav .el-menu-item.is-active {
  color: var(--iflytek-primary) !important;
  border-bottom: 2px solid var(--iflytek-primary) !important;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.secondary-btn {
  background: #f8fafc !important;
  color: var(--iflytek-primary) !important;
  border: 1px solid #e2e8f0 !important;
  border-radius: 8px;
  padding: 8px 16px;
  font-family: var(--font-family-chinese) !important;
}

.cta-button {
  background: var(--iflytek-gradient-hero) !important;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
  font-family: var(--font-family-chinese) !important;
  color: var(--text-white) !important;
}

/* 主横幅区域 - iFlytek 品牌渐变背景 */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  padding: 80px 0 120px !important;
  position: relative !important;
  overflow: hidden !important;
  min-height: 600px !important;
}

/* 英雄区域背景增强层 */
.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%);
  z-index: 1;
}

.hero-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
  z-index: 2;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

.hero-title {
  font-size: 3.5rem !important;
  font-weight: 700 !important;
  color: #ffffff !important;
  line-height: 1.2 !important;
  margin-bottom: 24px !important;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', 'SimHei', sans-serif !important;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5) !important;
}

.gradient-text {
  background: linear-gradient(45deg, #fff 0%, #e0e7ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline-block;
}

.hero-subtitle {
  font-size: 1.25rem !important;
  color: rgba(255, 255, 255, 0.9) !important;
  line-height: 1.6 !important;
  margin-bottom: 32px !important;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', 'SimHei', sans-serif !important;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3) !important;
}

.hero-stats {
  display: flex;
  gap: 32px;
  margin-bottom: 40px;
}

.stat-item {
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 16px 20px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-number {
  display: block !important;
  font-size: 1.5rem !important;
  font-weight: 700 !important;
  color: #ffffff !important;
  margin-bottom: 4px !important;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', 'SimHei', sans-serif !important;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5) !important;
}

.stat-label {
  font-size: 0.875rem !important;
  color: rgba(255, 255, 255, 0.8) !important;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', 'SimHei', sans-serif !important;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3) !important;
}

.hero-actions {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.primary-cta {
  background: var(--bg-primary) !important;
  color: var(--iflytek-primary) !important;
  border: 2px solid var(--iflytek-primary) !important;
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  font-family: var(--font-family-chinese) !important;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.primary-cta:hover {
  background: #f0f9ff !important;
  transform: translateY(-2px);
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
}

.secondary-cta {
  background: rgba(255, 255, 255, 0.1) !important;
  color: var(--text-white) !important;
  border: 2px solid rgba(255, 255, 255, 0.3) !important;
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  font-family: var(--font-family-chinese) !important;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.secondary-cta:hover {
  background: rgba(255, 255, 255, 0.2) !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
  transform: translateY(-2px);
}

/* 浮动卡片样式已移除 */

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.card-icon {
  color: var(--iflytek-primary);
}

/* 产品模块 */
.products-section {
  padding: 100px 0;
  background: var(--bg-primary) !important;
}

.section-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

.section-header {
  text-align: center;
  margin-bottom: 80px;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary) !important;
  margin-bottom: 16px;
  font-family: var(--font-family-chinese-title) !important;
}

.section-subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary) !important;
  max-width: 600px;
  margin: 0 auto;
  font-family: var(--font-family-chinese) !important;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 32px;
}

.product-card {
  background: var(--bg-card) !important;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
  border: 1px solid #e8e8e8 !important;
  transition: all 0.3s ease;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15) !important;
  border-color: var(--iflytek-primary) !important;
}

.card-header {
  margin-bottom: 24px;
}

.product-icon {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  color: var(--text-white) !important;
  background: var(--iflytek-gradient-hero) !important;
}

.product-title {
  font-size: 1.5rem !important;
  font-weight: 600 !important;
  color: var(--text-primary-aaa) !important;
  margin: 0 0 16px 0 !important;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'SimHei', sans-serif !important;
  /* 确保标题完整显示 */
  overflow: visible !important;
  text-overflow: unset !important;
  white-space: normal !important;
  line-height: 1.4 !important;
}

.product-description {
  color: var(--text-secondary-aaa) !important;
  font-size: 15px !important;
  line-height: 1.7 !important;
  margin-bottom: 24px !important;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'SimHei', sans-serif !important;
  font-weight: 400 !important;
  /* 确保文本完整显示，不被截断 */
  overflow: visible !important;
  text-overflow: unset !important;
  white-space: normal !important;
  min-height: 3em !important;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0 0 32px 0;
}

.feature-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0 !important;
  color: var(--text-secondary-aaa) !important;
  font-size: 14px !important;
  line-height: 1.6 !important;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'SimHei', sans-serif !important;
  font-weight: 400 !important;
  /* 确保列表项文本完整显示 */
  overflow: visible !important;
  text-overflow: unset !important;
  white-space: normal !important;
  min-height: 1.6em !important;
}

.check-icon {
  color: var(--iflytek-success) !important;
  flex-shrink: 0;
}

.learn-more-btn {
  background: var(--local-gradient-hero) !important;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px !important;
  font-weight: 600 !important;
  color: var(--text-inverse-aaa) !important;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'SimHei', sans-serif !important;
  cursor: pointer;
  transition: all 0.3s ease;
  /* 确保按钮文字清晰可见 */
  text-shadow: none !important;
  -webkit-font-smoothing: antialiased !important;
  -moz-osx-font-smoothing: grayscale !important;
  /* 确保文字不被截断 */
  overflow: visible !important;
  text-overflow: unset !important;
  white-space: nowrap !important;
}

/* 技术优势 */
.advantages-section {
  padding: 100px 0;
  background: var(--bg-secondary) !important;
}

.advantages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
}

.advantage-item {
  text-align: center;
  padding: 40px 20px;
}

.advantage-icon {
  width: 96px;
  height: 96px;
  background: var(--iflytek-gradient-hero) !important;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  color: var(--text-white) !important;
}

.advantage-title {
  font-size: 1.25rem !important;
  font-weight: 600 !important;
  color: var(--text-primary-aaa) !important;
  margin-bottom: 16px !important;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'SimHei', sans-serif !important;
  /* 确保标题完整显示 */
  overflow: visible !important;
  text-overflow: unset !important;
  white-space: normal !important;
  line-height: 1.4 !important;
}

.advantage-description {
  color: var(--text-secondary-aaa) !important;
  font-size: 15px !important;
  line-height: 1.7 !important;
  margin-bottom: 24px !important;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'SimHei', sans-serif !important;
  font-weight: 400 !important;
  /* 确保优势描述文本完整显示 */
  overflow: visible !important;
  text-overflow: unset !important;
  white-space: normal !important;
  min-height: 3em !important;
}

.advantage-metrics {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.metric-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--iflytek-primary) !important;
  font-family: var(--font-family-chinese-title) !important;
}

.metric-label {
  font-size: 0.875rem;
  color: var(--text-secondary) !important;
  font-family: var(--font-family-chinese) !important;
}

/* 快速开始 */
.quick-start-section {
  padding: 100px 0;
  background: var(--bg-primary) !important;
}

.quick-start-card {
  background: var(--iflytek-gradient-hero) !important;
  border-radius: 24px;
  padding: 80px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 60px;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.quick-start-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-white) !important;
  margin-bottom: 16px;
  font-family: var(--font-family-chinese-title) !important;
}

.quick-start-subtitle {
  font-size: 1.125rem;
  color: var(--text-white-secondary) !important;
  margin-bottom: 40px;
  font-family: var(--font-family-chinese) !important;
}

.quick-start-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.start-btn,
.demo-btn,
.report-btn {
  background: var(--bg-primary) !important;
  color: var(--iflytek-primary) !important;
  border: 2px solid var(--bg-primary) !important;
  border-radius: 12px;
  padding: 16px 24px;
  font-weight: 600;
  font-family: var(--font-family-chinese) !important;
  transition: all 0.3s ease;
}

.start-btn:hover,
.demo-btn:hover,
.report-btn:hover {
  background: #f0f9ff !important;
  transform: translateY(-2px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.visual-elements {
  position: relative;
  height: 200px;
}

.element-1,
.element-2,
.element-3 {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: pulse 4s ease-in-out infinite;
}

.element-1 {
  width: 80px;
  height: 80px;
  top: 20px;
  right: 40px;
  animation-delay: 0s;
}

.element-2 {
  width: 60px;
  height: 60px;
  top: 80px;
  right: 120px;
  animation-delay: 1s;
}

.element-3 {
  width: 100px;
  height: 100px;
  top: 120px;
  right: 20px;
  animation-delay: 2s;
}

@keyframes pulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.1); }
}

/* 响应式设计 - 确保背景在所有设备上正确显示 */
@media (max-width: 1024px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-stats {
    justify-content: center;
    flex-wrap: wrap;
  }

  /* 浮动卡片样式已移除 */
}

@media (max-width: 768px) {
  .enterprise-homepage {
    background: #f7fafc !important;
  }

  .hero-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    padding: 60px 0 80px !important;
    min-height: 500px !important;
  }

  .hero-container {
    padding: 0 16px;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .hero-stats {
    flex-direction: column;
    gap: 16px;
    align-items: center;
  }

  .stat-item {
    width: 100%;
    max-width: 200px;
    background: rgba(255, 255, 255, 0.1) !important;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .primary-cta,
  .secondary-cta {
    width: 100%;
    max-width: 280px;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }

  .advantages-grid {
    grid-template-columns: 1fr;
  }

  .quick-start-card {
    grid-template-columns: 1fr;
    padding: 40px;
    text-align: center;
    background: var(--iflytek-gradient-hero) !important;
  }

  .header-container {
    padding: 0 16px;
    height: 64px;
  }
}
</style>
