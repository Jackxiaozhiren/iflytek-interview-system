<template>
  <div class="enhanced-demo-page">
    <!-- 页面头部 -->
    <div class="demo-header">
      <div class="demo-container">
        <div class="demo-hero">
          <h1 class="demo-title">iFlytek Spark 增强演示系统</h1>
          <p class="demo-subtitle">基于讯飞星火大模型的智能面试评估平台 - 增强版</p>
          <div class="demo-stats">
            <div class="demo-stat-item">
              <span class="demo-stat-number">98.5%</span>
              <span class="demo-stat-label">AI识别准确率</span>
            </div>
            <div class="demo-stat-item">
              <span class="demo-stat-number">&lt;50ms</span>
              <span class="demo-stat-label">响应时间</span>
            </div>
            <div class="demo-stat-item">
              <span class="demo-stat-number">50,000+</span>
              <span class="demo-stat-label">企业用户</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 增强功能展示 -->
    <section class="enhanced-features">
      <div class="demo-container">
        <h2 class="section-title">增强功能特性</h2>
        <div class="features-grid">
          <div class="feature-item" v-for="feature in enhancedFeatures" :key="feature.id">
            <div class="feature-icon">
              <el-icon class="feature-icon-el"><component :is="feature.icon" /></el-icon>
            </div>
            <h4>{{ feature.title }}</h4>
            <p>{{ feature.description }}</p>
            <div class="feature-tags">
              <el-tag v-for="tag in feature.tags" :key="tag" size="small">{{ tag }}</el-tag>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 开始体验 -->
    <section class="demo-cta">
      <div class="demo-container">
        <div class="cta-content">
          <h2 class="cta-title">体验增强版智能面试</h2>
          <p class="cta-subtitle">探索更强大的AI面试功能和多模态分析能力</p>
          <div class="cta-buttons">
            <el-button type="primary" size="large" @click="startEnhancedDemo">
              <el-icon class="cta-icon"><VideoPlay /></el-icon>
              开始增强演示
            </el-button>
            <el-button size="large" @click="viewStandardDemo">
              <el-icon class="cta-icon"><Document /></el-icon>
              标准版演示
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
  Document, VideoPlay, Cpu, TrendCharts, Setting, Grid
} from '@element-plus/icons-vue'

const router = useRouter()

// 增强功能数据
const enhancedFeatures = ref([
  {
    id: 1,
    title: '深度学习分析',
    description: '基于深度神经网络的多维度候选人能力分析',
    icon: Cpu,
    tags: ['AI算法', '深度学习', '能力评估']
  },
  {
    id: 2,
    title: '实时情感识别',
    description: '实时分析候选人情感状态和心理压力指标',
    icon: TrendCharts,
    tags: ['情感AI', '心理分析', '实时监测']
  },
  {
    id: 3,
    title: '智能适应调整',
    description: '根据候选人表现动态调整面试难度和问题类型',
    icon: Setting,
    tags: ['自适应', '智能调节', '个性化']
  },
  {
    id: 4,
    title: '多模态融合',
    description: '融合文本、语音、视频多种模态的综合分析',
    icon: Grid,
    tags: ['多模态', '数据融合', '综合分析']
  }
])

// 开始增强演示
const startEnhancedDemo = () => {
  ElMessage.success('正在启动增强版演示...')
  router.push('/media-showcase')
}

// 查看标准演示
const viewStandardDemo = () => {
  router.push('/demo')
}

onMounted(() => {
  console.log('增强演示页面已加载')
})
</script>

<style scoped>
.enhanced-demo-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.demo-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.demo-header {
  padding: 80px 0;
  text-align: center;
  color: white;
}

.demo-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.demo-subtitle {
  font-size: 1.25rem;
  margin-bottom: 3rem;
  opacity: 0.9;
}

.demo-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.demo-stat-item {
  text-align: center;
}

.demo-stat-number {
  display: block;
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffd700;
  margin-bottom: 0.5rem;
}

.demo-stat-label {
  font-size: 1rem;
  opacity: 0.8;
}

.enhanced-features {
  padding: 80px 0;
  background: white;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 3rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.feature-item {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-5px);
}

.feature-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.feature-icon-el {
  font-size: 2rem;
  color: white;
}

.feature-item h4 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
}

.feature-item p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.feature-tags {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.demo-cta {
  padding: 80px 0;
  background: #f8f9fa;
  text-align: center;
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
}

.cta-subtitle {
  font-size: 1.25rem;
  color: #666;
  margin-bottom: 3rem;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-icon {
  margin-right: 0.5rem;
}

@media (max-width: 768px) {
  .demo-title {
    font-size: 2.5rem;
  }

  .demo-stats {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
}
</style>
