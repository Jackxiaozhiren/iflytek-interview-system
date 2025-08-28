<template>
  <div class="enhanced-homepage">
    <!-- 英雄区域 -->
    <section class="hero-section">
      <div class="hero-container">
        <div class="hero-content">
          <h1 class="hero-title">iFlytek Spark 增强版</h1>
          <h2 class="hero-subtitle">下一代智能面试评估系统</h2>
          <p class="hero-description">
            基于讯飞星火大模型的增强版智能面试系统，提供更精准的AI分析、
            更丰富的多模态交互和更智能的评估体验。
          </p>
          <div class="hero-actions">
            <el-button type="primary" size="large" @click="startEnhancedDemo">
              <el-icon><VideoPlay /></el-icon>
              体验增强版
            </el-button>
            <el-button size="large" @click="viewFeatures">
              <el-icon><Grid /></el-icon>
              查看功能
            </el-button>
          </div>
        </div>
        <div class="hero-visual">
          <div class="visual-placeholder">
            <el-icon class="visual-icon"><Cpu /></el-icon>
            <p>AI智能分析引擎</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 增强功能特性 -->
    <section class="enhanced-features">
      <div class="container">
        <h2 class="section-title">增强版核心特性</h2>
        <div class="features-grid">
          <div class="feature-card" v-for="feature in enhancedFeatures" :key="feature.id">
            <div class="feature-icon">
              <el-icon><component :is="feature.icon" /></el-icon>
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
            <ul class="feature-highlights">
              <li v-for="highlight in feature.highlights" :key="highlight">
                {{ highlight }}
              </li>
            </ul>
            <div class="feature-action">
              <el-button @click="exploreFeature(feature.route)">
                了解更多
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 技术优势 -->
    <section class="tech-advantages">
      <div class="container">
        <h2 class="section-title">技术优势</h2>
        <div class="advantages-grid">
          <div class="advantage-item" v-for="advantage in techAdvantages" :key="advantage.id">
            <div class="advantage-metric">{{ advantage.metric }}</div>
            <h4 class="advantage-title">{{ advantage.title }}</h4>
            <p class="advantage-description">{{ advantage.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 开始使用 -->
    <section class="get-started">
      <div class="container">
        <div class="get-started-content">
          <h2 class="get-started-title">开始使用增强版系统</h2>
          <p class="get-started-description">
            立即体验iFlytek Spark增强版智能面试系统的强大功能
          </p>
          <div class="get-started-actions">
            <el-button type="primary" size="large" @click="startTrial">
              <el-icon><Star /></el-icon>
              免费试用
            </el-button>
            <el-button size="large" @click="contactSales">
              <el-icon><Phone /></el-icon>
              联系销售
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
  VideoPlay, Grid, Cpu, TrendCharts, Setting, Lock,
  Star, Phone, Microphone, Document
} from '@element-plus/icons-vue'

const router = useRouter()

// 增强功能特性
const enhancedFeatures = ref([
  {
    id: 1,
    title: '深度AI分析',
    description: '基于深度学习的多维度智能分析引擎',
    icon: 'Cpu',
    highlights: [
      '12维度能力评估模型',
      '实时情感状态分析',
      '智能行为模式识别',
      '个性化评估报告'
    ],
    route: '/enhanced-demo'
  },
  {
    id: 2,
    title: '多模态融合',
    description: '文本、语音、视频多模态数据智能融合',
    icon: 'Grid',
    highlights: [
      '高精度语音识别',
      '实时视频分析',
      '多模态数据融合',
      '综合评分算法'
    ],
    route: '/media-showcase'
  },
  {
    id: 3,
    title: '智能适应系统',
    description: '根据候选人表现动态调整面试策略',
    icon: 'Setting',
    highlights: [
      '自适应难度调节',
      '个性化问题生成',
      '智能引导对话',
      '实时反馈优化'
    ],
    route: '/ai-configurator'
  },
  {
    id: 4,
    title: '企业级安全',
    description: '金融级数据安全保障和隐私保护',
    icon: 'Lock',
    highlights: [
      '端到端加密传输',
      '数据本地化存储',
      '权限精细化管理',
      '审计日志追踪'
    ],
    route: '/enterprise'
  }
])

// 技术优势
const techAdvantages = ref([
  {
    id: 1,
    metric: '99.2%',
    title: '识别准确率',
    description: '业界领先的AI识别精度，确保评估结果的可靠性'
  },
  {
    id: 2,
    metric: '<30ms',
    title: '响应延迟',
    description: '超低延迟的实时处理能力，提供流畅的交互体验'
  },
  {
    id: 3,
    metric: '100K+',
    title: '并发支持',
    description: '大规模并发处理能力，满足企业级应用需求'
  },
  {
    id: 4,
    metric: '24/7',
    title: '服务保障',
    description: '全天候技术支持和服务保障，确保系统稳定运行'
  }
])

// 导航方法
const startEnhancedDemo = () => {
  ElMessage.success('正在启动增强版演示...')
  router.push('/enhanced-demo')
}

const viewFeatures = () => {
  router.push('/competitor-features')
}

const exploreFeature = (route) => {
  router.push(route)
}

const startTrial = () => {
  ElMessage.success('正在为您开启免费试用...')
  router.push('/interview-selection')
}

const contactSales = () => {
  ElMessage.info('销售团队将尽快与您联系')
  // 这里可以添加联系表单或跳转到联系页面
}

onMounted(() => {
  console.log('增强版主页已加载')
})
</script>

<style scoped>
.enhanced-homepage {
  min-height: 100vh;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 英雄区域 */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 100px 0;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: 1.5rem;
  font-weight: 400;
  margin-bottom: 1.5rem;
  opacity: 0.9;
}

.hero-description {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2.5rem;
  opacity: 0.8;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.visual-placeholder {
  width: 300px;
  height: 300px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.visual-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

/* 增强功能特性 */
.enhanced-features {
  padding: 100px 0;
  background: white;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 4rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
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
  font-size: 2rem;
  color: white;
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
}

.feature-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.feature-highlights {
  list-style: none;
  padding: 0;
  margin-bottom: 2rem;
  text-align: left;
}

.feature-highlights li {
  padding: 0.5rem 0;
  color: #555;
  position: relative;
  padding-left: 1.5rem;
}

.feature-highlights li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #52c41a;
  font-weight: bold;
}

/* 技术优势 */
.tech-advantages {
  padding: 100px 0;
  background: #f8f9fa;
}

.advantages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.advantage-item {
  text-align: center;
  padding: 2rem;
}

.advantage-metric {
  font-size: 3rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 1rem;
}

.advantage-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
}

.advantage-description {
  color: #666;
  line-height: 1.6;
}

/* 开始使用 */
.get-started {
  padding: 100px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
}

.get-started-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.get-started-description {
  font-size: 1.25rem;
  margin-bottom: 2.5rem;
  opacity: 0.9;
}

.get-started-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-container {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .advantages-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .get-started-actions {
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 480px) {
  .advantages-grid {
    grid-template-columns: 1fr;
  }
}
</style>
