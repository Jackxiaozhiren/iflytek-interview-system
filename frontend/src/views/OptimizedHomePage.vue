<template>
  <div class="optimized-homepage">
    <!-- 导航栏 -->
    <header class="modern-header">
      <div class="container">
        <nav class="nav-wrapper">
          <router-link to="/" class="brand-logo">
            <div class="logo-icon">
              <el-icon><Cpu /></el-icon>
            </div>
            <span class="brand-text">iFlytek Spark</span>
          </router-link>
          
          <ul class="nav-menu">
            <li><router-link to="/" class="nav-link">首页</router-link></li>
            <li><router-link to="/demo" class="nav-link">产品演示</router-link></li>
            <li><router-link to="/interview-selection" class="nav-link">开始面试</router-link></li>
            <li><router-link to="/reports" class="nav-link">面试报告</router-link></li>
          </ul>
          
          <div class="nav-actions">
            <router-link to="/candidate" class="btn btn-outline">候选人入口</router-link>
            <router-link to="/enterprise" class="btn btn-primary">
              免费试用
              <el-icon><ArrowRight /></el-icon>
            </router-link>
          </div>
        </nav>
      </div>
    </header>

    <!-- Hero区域 -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">
              让候选人<span class="highlight">智能呈现</span>
            </h1>
            <p class="hero-subtitle">
              传统面试成本高？仅基于简历难以准确评估？<br>
              现在，面试的第一关可以交给<strong>iFlytek Spark AI</strong>
            </p>
            <div class="hero-actions">
              <router-link to="/interview-selection" class="btn btn-primary btn-large">
                免费试用
                <el-icon><ArrowRight /></el-icon>
              </router-link>
              <router-link to="/demo" class="btn btn-outline btn-large">
                产品演示
              </router-link>
            </div>
          </div>
          <div class="hero-visual">
            <div class="feature-showcase">
              <div class="showcase-item" v-for="(feature, index) in heroFeatures" :key="index">
                <div class="showcase-icon">
                  <el-icon><component :is="feature.icon" /></el-icon>
                </div>
                <span class="showcase-text">{{ feature.text }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 四步流程 -->
    <section class="process-section">
      <div class="container">
        <h2 class="section-title">四步解锁AI智能面试</h2>
        <div class="process-grid">
          <div 
            class="process-card" 
            v-for="(step, index) in processSteps" 
            :key="index"
            :class="{ 'active': activeStep === index }"
            @mouseenter="activeStep = index"
          >
            <div class="step-header">
              <div class="step-number">STEP{{ index + 1 }}</div>
              <h3 class="step-title">{{ step.title }}</h3>
            </div>
            <div class="step-content">
              <ul class="step-features">
                <li v-for="feature in step.features" :key="feature">{{ feature }}</li>
              </ul>
              <div class="step-visual">
                <img :src="step.image" :alt="step.title" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 核心技术 -->
    <section class="technology-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">核心技术</h2>
          <p class="section-subtitle">基于iFlytek星火大模型，真正的多模态AI技术</p>
        </div>
        <div class="tech-grid">
          <div 
            class="tech-card" 
            v-for="(tech, index) in technologies" 
            :key="index"
          >
            <div class="tech-icon">
              <el-icon><component :is="tech.icon" /></el-icon>
            </div>
            <h3 class="tech-title">{{ tech.title }}</h3>
            <p class="tech-description">{{ tech.description }}</p>
            <div class="tech-features">
              <span v-for="feature in tech.features" :key="feature" class="tech-tag">
                {{ feature }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 适用场景 -->
    <section class="scenarios-section">
      <div class="container">
        <h2 class="section-title">AI面试适用场景</h2>
        <div class="scenarios-grid">
          <div 
            class="scenario-card" 
            v-for="(scenario, index) in scenarios" 
            :key="index"
          >
            <div class="scenario-image">
              <img :src="scenario.image" :alt="scenario.title" />
            </div>
            <div class="scenario-content">
              <h3 class="scenario-title">{{ scenario.title }}</h3>
              <p class="scenario-description">{{ scenario.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA区域 -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">开启智能化人才面试新体验</h2>
          <p class="cta-subtitle">基于iFlytek星火大模型的多模态AI面试解决方案</p>
          <router-link to="/interview-selection" class="btn btn-primary btn-large">
            免费试用
            <el-icon><ArrowRight /></el-icon>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  Cpu, ArrowRight, VideoCamera, Microphone,
  Document, Grid, User, TrendCharts,
  Connection, ChatDotRound
} from '@element-plus/icons-vue'

const activeStep = ref(0)

const heroFeatures = [
  { icon: 'VideoCamera', text: '视频面试' },
  { icon: 'Microphone', text: '语音识别' },
  { icon: 'Grid', text: '智能分析' },
  { icon: 'Document', text: '自动报告' }
]

const processSteps = [
  {
    title: '智能筛选 自动邀约',
    features: [
      '基于iFlytek AI模型，智能初筛简历',
      '自动发送面试邀约链接',
      '候选人一键进入线上面试间'
    ],
    image: '/images/process-1.png'
  },
  {
    title: '因岗设题 精准考核',
    features: [
      '海量面试题库，覆盖600+岗位',
      '基于岗位智能生成面试题目',
      '支持HR手动调整，契合企业需求'
    ],
    image: '/images/process-2.png'
  },
  {
    title: '多模态面试 提升体验',
    features: [
      '音视频采集，确保信息合规',
      '支持模拟练习和重新作答',
      '人脸识别防作弊，保证公平性'
    ],
    image: '/images/process-3.png'
  },
  {
    title: '智能评估 综合分析',
    features: [
      '面试过程实时转写记录',
      '多维度能力特质分析',
      '生成客观详细的评估报告'
    ],
    image: '/images/process-4.png'
  }
]

const technologies = [
  {
    icon: 'Connection',
    title: 'iFlytek星火大模型',
    description: 'AI+HR专家共建胜任力模型',
    features: ['30+能力素质项', '智能建模', '精准匹配']
  },
  {
    icon: 'VideoCamera',
    title: '多模态识别技术',
    description: '基于视频进行检测和分析',
    features: ['人脸识别', '表情分析', '仪容评估']
  },
  {
    icon: 'Microphone',
    title: '语音分析技术',
    description: '通过声纹识别等核心技术',
    features: ['语音转写', '情感分析', '流畅度评估']
  },
  {
    icon: 'Grid',
    title: '智能评估算法',
    description: '综合多维度数据进行分析',
    features: ['能力评估', '性格分析', '匹配度计算']
  }
]

const scenarios = [
  {
    title: '校园招聘面试',
    description: '跳出千篇一律的简历，用多模态面试全方位了解学生群体',
    image: '/images/scenario-1.png'
  },
  {
    title: '大批量人才筛选',
    description: '身份核验、能力测试、意向确认，显著提升招聘效率',
    image: '/images/scenario-2.png'
  },
  {
    title: '高端人才面试',
    description: '快速识别人才综合能力，减少无效面试，提升招聘质量',
    image: '/images/scenario-3.png'
  }
]
</script>

<style scoped>
/* 基础样式变量 */
:root {
  --primary-color: #1890ff;
  --primary-hover: #0066cc;
  --secondary-color: #667eea;
  --accent-color: #764ba2;
  --text-primary: #262626;
  --text-secondary: #595959;
  --text-tertiary: #8c8c8c;
  --bg-primary: #ffffff;
  --bg-secondary: #fafafa;
  --border-color: #e8e8e8;
  --shadow-light: 0 2px 8px rgba(0, 0, 0, 0.06);
  --shadow-medium: 0 4px 16px rgba(0, 0, 0, 0.12);
  --border-radius: 8px;
  --spacing-xs: 8px;
  --spacing-sm: 16px;
  --spacing-md: 24px;
  --spacing-lg: 32px;
  --spacing-xl: 48px;
}

.optimized-homepage {
  min-height: 100vh;
  background: var(--bg-primary);
}

/* 现代化导航栏 */
.modern-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm) 0;
}

.brand-logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 600;
  font-size: 1.25rem;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-right: var(--spacing-sm);
}

.nav-menu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: var(--spacing-lg);
}

.nav-link {
  text-decoration: none;
  color: var(--text-secondary);
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--primary-color);
}

.nav-actions {
  display: flex;
  gap: var(--spacing-sm);
}

/* 按钮样式 */
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: 12px 24px;
  border-radius: var(--border-radius);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

.btn-outline {
  background: transparent;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
}

.btn-outline:hover {
  background: var(--primary-color);
  color: white;
}

.btn-large {
  padding: 16px 32px;
  font-size: 1.1rem;
}

/* Hero区域 */
.hero-section {
  padding: var(--spacing-xl) 0;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
  align-items: center;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
  line-height: 1.2;
}

.highlight {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: var(--spacing-sm);
}

/* 功能展示 */
.feature-showcase {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

.showcase-item {
  background: white;
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-light);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.showcase-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

/* 流程区域 */
.process-section {
  padding: var(--spacing-xl) 0;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xl);
}

.process-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.process-card {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-light);
  padding: var(--spacing-lg);
  transition: all 0.3s ease;
  cursor: pointer;
}

.process-card:hover,
.process-card.active {
  transform: translateY(-4px);
  box-shadow: var(--shadow-medium);
}

.step-number {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  display: inline-block;
  margin-bottom: var(--spacing-sm);
}

.step-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.step-features {
  list-style: none;
  padding: 0;
  margin-bottom: var(--spacing-md);
}

.step-features li {
  padding: var(--spacing-xs) 0;
  color: var(--text-secondary);
  position: relative;
  padding-left: 20px;
}

.step-features li::before {
  content: '•';
  color: var(--primary-color);
  position: absolute;
  left: 0;
}

/* 技术区域 */
.technology-section {
  padding: var(--spacing-xl) 0;
  background: var(--bg-secondary);
}

.section-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.section-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-top: var(--spacing-sm);
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

.tech-card {
  background: white;
  padding: var(--spacing-lg);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-light);
  text-align: center;
  transition: transform 0.3s ease;
}

.tech-card:hover {
  transform: translateY(-4px);
}

.tech-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  margin: 0 auto var(--spacing-md);
}

.tech-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.tech-description {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
}

.tech-features {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  justify-content: center;
}

.tech-tag {
  background: #e6f7ff;
  color: var(--primary-color);
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.875rem;
}

/* 场景区域 */
.scenarios-section {
  padding: var(--spacing-xl) 0;
}

.scenarios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--spacing-lg);
}

.scenario-card {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-light);
  overflow: hidden;
  transition: transform 0.3s ease;
}

.scenario-card:hover {
  transform: translateY(-4px);
}

.scenario-image {
  height: 200px;
  background: linear-gradient(135deg, #e6f7ff, #f0f9ff);
  display: flex;
  align-items: center;
  justify-content: center;
}

.scenario-content {
  padding: var(--spacing-lg);
}

.scenario-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.scenario-description {
  color: var(--text-secondary);
  line-height: 1.6;
}

/* CTA区域 */
.cta-section {
  padding: var(--spacing-xl) 0;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  text-align: center;
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
}

.cta-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: var(--spacing-lg);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .nav-menu {
    display: none;
  }
  
  .process-grid,
  .tech-grid,
  .scenarios-grid {
    grid-template-columns: 1fr;
  }
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}
</style>
