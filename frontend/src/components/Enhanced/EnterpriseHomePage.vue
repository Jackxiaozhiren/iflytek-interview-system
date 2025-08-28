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
            <el-menu-item index="dashboard">智能仪表板</el-menu-item>
            <el-menu-item index="interviews">AI面试管理</el-menu-item>
            <el-menu-item index="candidates">候选人中心</el-menu-item>
            <el-menu-item index="analytics">数据洞察</el-menu-item>
            <el-menu-item index="settings">系统配置</el-menu-item>
          </el-menu>
        </nav>
        
        <div class="header-actions">
          <el-button type="primary" class="cta-button">
            <el-icon><Plus /></el-icon>
            创建面试
          </el-button>
          <el-avatar :size="40" src="/images/candidate-avatar.svg" />
        </div>
      </div>
    </header>

    <!-- 主横幅区域 -->
    <section class="hero-section">
      <div class="hero-container">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">
              <span class="gradient-text">AI+招聘</span><br>
              iFlytek Spark智能面试系统
            </h1>
            <p class="hero-subtitle">
              基于讯飞星火大模型的多模态AI面试解决方案，
              让招聘更智能、更高效、更精准
            </p>
            <div class="hero-actions">
              <el-button type="primary" size="large" class="primary-cta">
                立即体验
                <el-icon><ArrowRight /></el-icon>
              </el-button>
              <el-button size="large" class="secondary-cta">
                观看演示
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

    <!-- 核心产品模块 -->
    <section class="products-section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">核心AI面试解决方案</h2>
          <p class="section-subtitle">
            基于iFlytek Spark大模型，提供全方位智能面试体验
          </p>
        </div>
        
        <div class="products-grid">
          <div class="product-card primary-product" v-for="product in coreProducts" :key="product.id">
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
                了解更多
                <el-icon><ArrowRight /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 技术优势展示 -->
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  Plus, ArrowRight, VideoPlay, Cpu, Microphone, Grid,
  Check, TrendCharts, Lock, Clock
} from '@element-plus/icons-vue'

const activeMenu = ref('dashboard')

// 核心产品数据
const coreProducts = ref([
  {
    id: 1,
    title: 'AI智能面试官',
    description: '基于iFlytek Spark大模型的智能面试官，支持多轮对话、实时评估和个性化问题生成',
    icon: 'Cpu',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
</script>

<style scoped>
/* 基础样式变量 */
:root {
  --iflytek-primary: #1890ff;
  --iflytek-secondary: #667eea;
  --iflytek-accent: #764ba2;
  --iflytek-success: #52c41a;
  --text-primary: #2c3e50;
  --text-secondary: #64748b;
  --bg-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.enterprise-homepage {
  min-height: 100vh;
  background: #f8fafc;
}

/* 顶部导航 */
.enterprise-header {
  background: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 1000;
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
  color: var(--iflytek-primary);
}

.enterprise-nav {
  border: none;
  background: transparent;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.cta-button {
  background: var(--bg-gradient);
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
}

/* 主横幅区域 */
.hero-section {
  background: var(--bg-gradient);
  padding: 80px 0 120px;
  position: relative;
  overflow: hidden;
}

.hero-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  color: white;
  line-height: 1.2;
  margin-bottom: 24px;
}

.gradient-text {
  background: linear-gradient(45deg, #fff 0%, #e0e7ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  margin-bottom: 40px;
}

.hero-actions {
  display: flex;
  gap: 20px;
}

.primary-cta {
  background: white;
  color: var(--iflytek-primary);
  border: none;
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
}

.secondary-cta {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
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
  background: white;
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
  color: var(--text-primary);
  margin-bottom: 16px;
}

.section-subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 32px;
}

.product-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.12);
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
  color: white;
}

.product-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.product-description {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 24px;
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
  padding: 8px 0;
  color: var(--text-secondary);
}

.check-icon {
  color: var(--iflytek-success);
  flex-shrink: 0;
}

.learn-more-btn {
  background: var(--bg-gradient);
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
}

/* 技术优势 */
.advantages-section {
  padding: 100px 0;
  background: #f8fafc;
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
  background: var(--bg-gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  color: white;
}

.advantage-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.advantage-description {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 24px;
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
  color: var(--iflytek-primary);
}

.metric-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .advantages-grid {
    grid-template-columns: 1fr;
  }
}
</style>
