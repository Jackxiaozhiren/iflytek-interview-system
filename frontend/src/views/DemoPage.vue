<template>
  <div class="demo-page">
    <!-- 页面头部 -->
    <div class="demo-header">
      <div class="demo-container">
        <div class="demo-hero">
          <h1 class="demo-title">iFlytek Spark 智能面试系统演示</h1>
          <p class="demo-subtitle">基于讯飞星火大模型的智能面试评估平台</p>
          <div class="demo-stats">
            <div class="demo-stat-item">
              <span class="demo-stat-number">95.8%</span>
              <span class="demo-stat-label">识别准确率</span>
            </div>
            <div class="demo-stat-item">
              <span class="demo-stat-number">&lt;200ms</span>
              <span class="demo-stat-label">响应时间</span>
            </div>
            <div class="demo-stat-item">
              <span class="demo-stat-number">10,000+</span>
              <span class="demo-stat-label">并发用户</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 功能演示区域 -->
    <section class="demo-features-showcase">
      <div class="demo-container">
        <div class="demo-section-header">
          <h2 class="demo-section-title">智能面试功能演示</h2>
          <p class="demo-section-subtitle">体验基于iFlytek Spark的智能面试评估系统</p>
        </div>

        <div class="demo-features-container">
          <!-- 演示功能卡片 -->
          <div class="demo-feature-card featured-card" v-for="feature in demoFeatures" :key="feature.id">
            <!-- 智能文本面试演示 -->
            <div v-if="feature.id === 'text-interview'" class="feature-showcase">
              <TextInterviewDemo />
            </div>
            <!-- AI智能评估演示 -->
            <div v-else-if="feature.id === 'ai-evaluation'" class="feature-showcase">
              <AIEvaluationDemo />
            </div>
            <!-- 其他功能的通用展示 -->
            <div v-else>
              <div class="feature-icon">
                <el-icon><component :is="feature.icon" /></el-icon>
              </div>
              <div class="feature-content">
                <h3 class="feature-title">{{ feature.title }}</h3>
                <p class="feature-description">{{ feature.description }}</p>
                <div class="feature-actions">
                  <el-button type="primary" @click="startFeatureDemo(feature)">
                    <el-icon><Setting /></el-icon>
                    立即体验
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 技术特性展示 -->
    <section class="tech-features">
      <div class="demo-container">
        <h2 class="section-title">技术特性</h2>
        <div class="tech-grid">
          <div class="tech-item">
            <div class="tech-icon">
              <el-icon class="feature-icon"><Microphone /></el-icon>
            </div>
            <h4>语音识别</h4>
            <p>高精度语音转文字，支持多种方言</p>
          </div>

          <div class="tech-item">
            <div class="tech-icon">
              <el-icon class="feature-icon"><ChatDotRound /></el-icon>
            </div>
            <h4>语义理解</h4>
            <p>深度理解回答内容的语义和逻辑</p>
          </div>

          <div class="tech-item">
            <div class="tech-icon">
              <el-icon class="feature-icon"><TrendCharts /></el-icon>
            </div>
            <h4>能力评估</h4>
            <p>六维能力模型精准评估候选人</p>
          </div>

          <div class="tech-item">
            <div class="tech-icon">
              <el-icon class="feature-icon"><Document /></el-icon>
            </div>
            <h4>智能报告</h4>
            <p>自动生成专业的面试评估报告</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 开始体验 -->
    <section class="demo-cta">
      <div class="demo-container">
        <div class="cta-content">
          <h2 class="cta-title">开始您的智能面试体验</h2>
          <p class="cta-subtitle">选择适合的面试模式，体验AI驱动的面试评估</p>
          <div class="cta-buttons">
            <el-button type="primary" size="large" @click="startTextInterview">
              <el-icon class="cta-icon"><Document /></el-icon>
              文本面试
            </el-button>

          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Document, Microphone, ChatDotRound, TrendCharts, Setting
} from '@element-plus/icons-vue'
import { featuresDemos } from '@/services/demoService'
import TextInterviewDemo from '@/components/Demo/TextInterviewDemo.vue'
import AIEvaluationDemo from '@/components/Demo/AIEvaluationDemo.vue'

const router = useRouter()

// 演示功能数据
const demoFeatures = ref(featuresDemos)

// 开始功能演示
const startFeatureDemo = (feature) => {
  ElMessage.success(`正在启动 ${feature.title} 演示...`)

  // 根据功能类型跳转到相应页面
  switch (feature.id) {
    case 'text-interview':
      // 直接跳转到文本优先面试页面，使用真实的面试组件
      router.push('/text-primary-interview')
      break
    case 'ai-evaluation':
      router.push('/evaluation')
      break
    default:
      ElMessage.info('该功能演示正在开发中...')
  }
}

// 开始文本面试
const startTextInterview = () => {
  // 直接跳转到文本优先面试页面，提供完整的面试体验
  router.push('/text-primary-interview')
}



onMounted(() => {
  console.log('演示页面已加载')
})
</script>

<style scoped>
/* 导入优化系统 */
@import '@/styles/gradient-background-system.css';
@import '@/styles/layout-optimization.css';
@import '@/styles/emergency-layout-fix.css';

.demo-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #1890ff 100%);
  position: relative;
  overflow-x: hidden;
}

.demo-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.9) 0%,
    rgba(118, 75, 162, 0.8) 30%,
    rgba(24, 144, 255, 0.7) 60%,
    rgba(102, 204, 255, 0.6) 100%
  );
  z-index: -1;
}

.demo-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.demo-header {
  padding: 80px 0;
  color: white;
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.demo-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.demo-subtitle {
  font-size: 1.25rem;
  margin-bottom: 3rem;
  opacity: 0.9;
}

.demo-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
}

.demo-stat-item {
  text-align: center;
}

.demo-stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.demo-stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

.demo-features-showcase {
  padding: 80px 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.demo-section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.demo-section-title {
  font-size: 2.5rem;
  color: #1890ff;
  margin-bottom: 1rem;
}

.demo-section-subtitle {
  font-size: 1.1rem;
  color: #666;
}

.demo-features-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.demo-feature-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.demo-feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border-color: #1890ff;
}

/* 演示功能特殊样式 - 统一样式 */
.featured-card .feature-showcase {
  padding: 0;
  margin: -2rem;
  border-radius: 12px;
  overflow: hidden;
}

.featured-card:has(.feature-showcase) {
  padding: 0;
  background: transparent;
  border: none;
  box-shadow: none;
}

.featured-card:has(.feature-showcase):hover {
  transform: none;
  box-shadow: none;
}

.feature-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  color: white;
  font-size: 1.5rem;
}

.feature-title {
  font-size: 1.5rem;
  color: #1890ff;
  margin-bottom: 1rem;
}

.feature-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.tech-features {
  padding: 80px 0;
  background: #f8f9fa;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  color: #1890ff;
  margin-bottom: 3rem;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.tech-item {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.tech-item:hover {
  transform: translateY(-4px);
}

.tech-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: white;
  font-size: 1.5rem;
}

.demo-cta {
  padding: 80px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
}

.cta-title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.cta-subtitle {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

@media (max-width: 768px) {
  .demo-title {
    font-size: 2rem;
  }
  
  .demo-stats {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
}
</style>
