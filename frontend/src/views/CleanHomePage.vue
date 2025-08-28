<template>
  <div class="homepage homepage-gradient">
    <!-- Hero区域 -->
    <section class="hero-section gradient-hero-bg optimized-hero">
      <div class="optimized-container">
        <div class="hero-content symmetric-layout">
          <div class="hero-text content-center">
            <h1 class="hero-title optimized-title-h1">
              <span class="gradient-text">AI+招聘</span><br>
              <span class="hero-brand">iFlytek Spark智能面试系统</span>
            </h1>
            <p class="hero-subtitle optimized-text-large">
              基于讯飞星火大模型的多模态AI面试解决方案<br>
              让招聘更智能、更高效、更精准
            </p>

            <div class="stats-display">
              <div class="stat-item optimized-card">
                <div class="stat-number">95%+</div>
                <div class="stat-label">语音识别准确率</div>
              </div>
              <div class="stat-item optimized-card">
                <div class="stat-number">&lt;100ms</div>
                <div class="stat-label">平均响应时间</div>
              </div>
              <div class="stat-item optimized-card">
                <div class="stat-number">99.9%</div>
                <div class="stat-label">系统可用性</div>
              </div>
            </div>

            <div class="hero-actions">
              <router-link to="/interview-selection" class="btn btn-primary">立即开始面试</router-link>
              <router-link to="/demo" class="btn btn-secondary">观看产品演示</router-link>
            </div>
          </div>
          <div class="hero-visual">
            <!-- 可选的视觉元素 -->
          </div>
        </div>
      </div>
    </section>

    <!-- 核心功能 -->
    <section class="features-section features-showcase gradient-fade-top">
      <div class="optimized-container">
        <div class="section-header content-center">
          <h2 class="section-title optimized-title-h2">核心AI面试解决方案</h2>
          <p class="section-subtitle optimized-text-large">
            基于iFlytek Spark大模型，提供全方位智能面试体验
          </p>
        </div>

        <div class="features-grid equal-height-cards optimized-grid-3">
          <div class="feature-card optimized-card" v-for="feature in features" :key="feature.id" @click="navigateTo(feature.route)">
            <div class="card-header">
              <div class="feature-icon" :style="{ background: feature.color }">
                <el-icon :size="32"><component :is="feature.icon" /></el-icon>
              </div>
              <h3 class="feature-title optimized-title-h3">{{ feature.title }}</h3>
            </div>
            <p class="feature-description optimized-text">{{ feature.description }}</p>
            <ul class="feature-list" v-if="feature.features">
              <li v-for="item in feature.features" :key="item">
                <el-icon class="check-icon"><Check /></el-icon>
                {{ item }}
              </li>
            </ul>
            <div class="card-footer">
              <el-button type="primary" class="feature-btn">
                立即体验
                <el-icon><ArrowRight /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 技术优势 -->
    <section class="advantages-section section-spacing gradient-overlay-bg">
      <div class="optimized-container">
        <div class="content-center">
          <h2 class="optimized-title-h2">技术优势</h2>
          <p class="optimized-text">基于iFlytek星火大模型的核心技术能力</p>
        </div>

        <div class="symmetric-layout optimized-grid-2">
          <div class="card optimized-card" v-for="advantage in advantages" :key="advantage.id">
            <h3 class="card-title optimized-title-h3">{{ advantage.title }}</h3>
            <p class="card-description optimized-text">{{ advantage.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 快速开始 -->
    <section class="cta-section section-spacing gradient-animated-bg">
      <div class="optimized-container">
        <div class="cta-card optimized-card content-center">
          <h2 class="optimized-title-h2" style="color: white;">开始您的智能面试之旅</h2>
          <p class="optimized-text-large" style="color: rgba(255,255,255,0.9);">立即体验iFlytek Spark AI面试系统的强大功能</p>
          <div class="cta-actions">
            <router-link to="/interview-selection" class="btn btn-primary">开始面试</router-link>
            <router-link to="/demo" class="btn btn-secondary">产品演示</router-link>
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
  VideoCamera,
  Microphone,
  Grid,
  Check,
  ArrowRight,
  TrendCharts
} from '@element-plus/icons-vue'

const router = useRouter()

const features = ref([
  {
    id: 1,
    title: 'AI智能面试官',
    description: '基于iFlytek Spark大模型的智能面试官，支持多轮对话、实时评估和个性化问题生成',
    icon: VideoCamera,
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
    icon: Microphone,
    color: 'linear-gradient(135deg, #1890ff 0%, #0066cc 100%)',
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
    icon: TrendCharts,
    color: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
    route: '/intelligent-dashboard',
    features: [
      '职位智能匹配推荐',
      '候选人批量筛选',
      '面试流程自动化',
      '数据驱动决策支持'
    ]
  }
])

const advantages = ref([
  {
    id: 1,
    title: '先进的AI技术',
    description: '基于讯飞星火大模型，具备强大的自然语言理解和生成能力'
  },
  {
    id: 2,
    title: '多模态交互',
    description: '支持文字、语音等多种交互方式，提供自然流畅的面试体验'
  },
  {
    id: 3,
    title: '智能化评估',
    description: 'AI自动分析候选人回答，提供客观准确的能力评估'
  },
  {
    id: 4,
    title: '个性化定制',
    description: '根据不同岗位需求，定制专业的面试题目和评估标准'
  }
])

const navigateTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
/* 导入优化系统 */
@import '@/styles/gradient-background-system.css';
@import '@/styles/layout-optimization.css';
@import '@/styles/emergency-layout-fix.css';

/* 使用iFlytek品牌色彩系统 */
.homepage {
  min-height: 100vh;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', 'SimHei', sans-serif;
}

/* 移除重复的导航栏样式，使用App.vue中的全局导航 */

.container {
  max-width: min(1200px, calc(100vw - 48px));
  margin: 0 auto;
  padding: 0 24px;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* Hero区域样式 */
.hero-section {
  background: var(--gradient-hero);
  padding: 80px 0 120px;
  position: relative;
  overflow: hidden;
  min-height: 600px;
}

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

.hero-content {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(40px, 8vw, 80px);
  align-items: center;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  text-align: center;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  color: var(--text-white);
  line-height: 1.2;
  margin-bottom: var(--space-lg);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.gradient-text {
  background: linear-gradient(45deg, #fff 0%, #e0e7ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline-block;
}

.hero-brand {
  color: var(--text-white);
  font-weight: 600;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  margin-bottom: var(--space-xl);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.stats-grid {
  display: flex;
  gap: clamp(16px, 4vw, 32px);
  margin-bottom: var(--space-2xl);
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.stat-item {
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  flex: 0 1 auto;
  min-width: 120px;
  max-width: 200px;
  box-sizing: border-box;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-white);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
}

.hero-actions {
  display: flex;
  gap: var(--space-md);
  flex-wrap: wrap;
}

/* 按钮样式 */
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-xl);
  border: none;
  border-radius: var(--radius-lg);
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
}

.btn-primary {
  background: var(--bg-primary);
  color: var(--iflytek-primary);
  border: 2px solid var(--bg-primary);
  box-shadow: var(--shadow-lg);
}

.btn-primary:hover {
  background: #f0f9ff;
  transform: translateY(-2px);
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-white);
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

/* 产品功能区域 */
.features-section {
  padding: 100px 0;
  background: var(--bg-primary);
}

.section-header {
  text-align: center;
  margin-bottom: 80px;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-md);
  font-family: inherit;
}

.section-subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--space-xl);
}

.feature-card {
  background: var(--bg-primary);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid #e8e8e8;
  transition: all 0.3s ease;
  cursor: pointer;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
  border-color: var(--iflytek-primary);
}

.card-header {
  margin-bottom: var(--space-lg);
}

.feature-icon {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-lg);
  color: var(--text-white);
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--space-md) 0;
  line-height: 1.4;
}

.feature-description {
  color: var(--text-secondary);
  font-size: 15px;
  line-height: 1.7;
  margin-bottom: var(--space-lg);
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--space-xl) 0;
}

.feature-list li {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 10px 0;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.6;
}

.check-icon {
  color: #52c41a;
  flex-shrink: 0;
}

.card-footer {
  margin-top: var(--space-lg);
}

.feature-btn {
  background: var(--gradient-button);
  border: none;
  border-radius: var(--radius-md);
  padding: var(--space-sm) var(--space-lg);
  font-size: 14px;
  font-weight: 600;
  color: var(--text-white);
  cursor: pointer;
  transition: all 0.3s ease;
}

.feature-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.advantages-section {
  padding: var(--space-2xl) 0;
  background: var(--bg-secondary);
}

.cta-section {
  padding: var(--space-2xl) 0;
  background: var(--bg-primary);
}

.cta-card {
  background: var(--gradient-hero);
  color: var(--text-white);
  padding: var(--space-2xl);
  border-radius: var(--radius-xl);
  text-align: center;
}

.cta-card h2 {
  color: var(--text-white);
  margin-bottom: var(--space-md);
}

.cta-card p {
  opacity: 0.9;
  margin-bottom: var(--space-xl);
}

.cta-actions {
  display: flex;
  gap: var(--space-md);
  justify-content: center;
  flex-wrap: wrap;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .stats-grid {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .nav {
    flex-direction: column;
    gap: var(--space-md);
    height: auto;
    padding: var(--space-md) 0;
  }

  .nav-menu {
    flex-direction: column;
    text-align: center;
    gap: var(--space-md);
  }

  .nav-actions {
    flex-direction: column;
    width: 100%;
    gap: var(--space-sm);
  }

  .hero-section {
    padding: 60px 0 80px;
    min-height: 500px;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .stats-grid {
    flex-direction: column;
    gap: var(--space-md);
    align-items: center;
  }

  .stat-item {
    width: 100%;
    max-width: 200px;
  }

  .hero-actions,
  .cta-actions {
    flex-direction: column;
    align-items: center;
  }

  .btn {
    width: 100%;
    max-width: 280px;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: var(--space-lg);
  }

  .feature-card {
    padding: var(--space-lg);
  }

  .section-title {
    font-size: 2rem;
  }

  .feature-icon {
    width: 60px;
    height: 60px;
  }

  .feature-title {
    font-size: 1.25rem;
  }
}
</style>
