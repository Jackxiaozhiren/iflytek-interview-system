<template>
  <div class="ai-evaluation-page">
    <!-- 页面头部 -->
    <div class="evaluation-header">
      <div class="evaluation-container">
        <div class="evaluation-hero">
          <h1 class="evaluation-title">AI智能评估系统</h1>
          <p class="evaluation-subtitle">基于iFlytek Spark的多维度智能评估平台</p>
          <div class="evaluation-stats">
            <div class="evaluation-stat-item">
              <span class="evaluation-stat-number">6</span>
              <span class="evaluation-stat-label">评估维度</span>
            </div>
            <div class="evaluation-stat-item">
              <span class="evaluation-stat-number">94.5%</span>
              <span class="evaluation-stat-label">评估准确率</span>
            </div>
            <div class="evaluation-stat-item">
              <span class="evaluation-stat-number">&lt;2s</span>
              <span class="evaluation-stat-label">分析时间</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 评估功能展示 -->
    <section class="evaluation-features">
      <div class="evaluation-container">
        <div class="section-header">
          <h2 class="section-title">核心评估功能</h2>
          <p class="section-subtitle">全方位智能分析，精准评估候选人能力</p>
        </div>

        <div class="features-grid">
          <div class="feature-card" v-for="feature in evaluationFeatures" :key="feature.id">
            <div class="feature-icon">
              <el-icon><component :is="feature.icon" /></el-icon>
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
            <div class="feature-metrics">
              <span class="metric-label">准确率:</span>
              <span class="metric-value">{{ feature.accuracy }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 评估演示区域 -->
    <section class="evaluation-demo">
      <div class="evaluation-container">
        <div class="demo-header">
          <h2 class="demo-title">实时评估演示</h2>
          <p class="demo-subtitle">体验AI智能评估的完整流程</p>
        </div>

        <div class="demo-content">
          <div class="demo-steps">
            <div class="demo-step" v-for="(step, index) in demoSteps" :key="step.id">
              <div class="step-number">{{ index + 1 }}</div>
              <div class="step-content">
                <h4 class="step-title">{{ step.title }}</h4>
                <p class="step-description">{{ step.description }}</p>
              </div>
            </div>
          </div>

          <div class="demo-actions">
            <el-button type="primary" size="large" @click="startEvaluation" :loading="isEvaluating">
              <el-icon><VideoPlay /></el-icon>
              开始评估演示
            </el-button>
            <el-button size="large" @click="goBack">
              <el-icon><ArrowLeft /></el-icon>
              返回演示页面
            </el-button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  TrendCharts, DataAnalysis, PieChart, Document, Star, Setting,
  VideoPlay, ArrowLeft, Timer
} from '@element-plus/icons-vue'

const router = useRouter()

// 评估状态
const isEvaluating = ref(false)

// 评估功能特性
const evaluationFeatures = reactive([
  {
    id: 1,
    title: '技术能力评估',
    description: '深度分析技术知识掌握程度和实际应用能力',
    icon: DataAnalysis,
    accuracy: '96.2%'
  },
  {
    id: 2,
    title: '逻辑思维分析',
    description: '评估问题分析、逻辑推理和解决方案设计能力',
    icon: TrendCharts,
    accuracy: '94.8%'
  },
  {
    id: 3,
    title: '沟通表达评估',
    description: '分析语言表达、思路清晰度和沟通效果',
    icon: Document,
    accuracy: '93.5%'
  },
  {
    id: 4,
    title: '学习能力分析',
    description: '评估学习新知识的能力和适应性',
    icon: Star,
    accuracy: '95.1%'
  },
  {
    id: 5,
    title: '创新思维评估',
    description: '分析创新意识、创造性思维和解决问题的独特性',
    icon: Setting,
    accuracy: '92.7%'
  },
  {
    id: 6,
    title: '综合素质分析',
    description: '整体评估候选人的综合能力和发展潜力',
    icon: PieChart,
    accuracy: '94.5%'
  }
])

// 演示步骤
const demoSteps = reactive([
  {
    id: 1,
    title: '数据收集',
    description: '收集面试过程中的文本、语音等多模态数据'
  },
  {
    id: 2,
    title: '智能分析',
    description: '使用iFlytek Spark进行深度语义分析和能力评估'
  },
  {
    id: 3,
    title: '多维评分',
    description: '从六个核心维度进行量化评分和能力分析'
  },
  {
    id: 4,
    title: '报告生成',
    description: '生成详细的评估报告和个性化改进建议'
  }
])

// 开始评估演示
const startEvaluation = async () => {
  isEvaluating.value = true
  ElMessage.success('正在启动AI智能评估演示...')

  // 模拟评估过程
  setTimeout(() => {
    isEvaluating.value = false
    ElMessage.success('评估演示完成！')
    // 可以跳转到报告页面或显示评估结果
  }, 3000)
}

// 返回演示页面
const goBack = () => {
  router.push('/demo')
}

onMounted(() => {
  console.log('AI智能评估页面已加载')
})
</script>

<style scoped>
.ai-evaluation-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #1890ff 100%);
  position: relative;
  overflow-x: hidden;
}

.ai-evaluation-page::before {
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

.evaluation-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.evaluation-header {
  padding: 80px 0;
  color: white;
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.evaluation-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.evaluation-subtitle {
  font-size: 1.25rem;
  margin-bottom: 3rem;
  opacity: 0.9;
}

.evaluation-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
}

.evaluation-stat-item {
  text-align: center;
}

.evaluation-stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.evaluation-stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

.evaluation-features {
  padding: 80px 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: 2.5rem;
  color: #1890ff;
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.1rem;
  color: #666;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  text-align: center;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border-color: #1890ff;
}

.feature-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
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
  margin-bottom: 1rem;
}

.feature-metrics {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  align-items: center;
}

.metric-label {
  color: #666;
  font-size: 0.9rem;
}

.metric-value {
  color: #1890ff;
  font-weight: 600;
  font-size: 1rem;
}

.evaluation-demo {
  padding: 80px 0;
  background: #f8f9fa;
}

.demo-header {
  text-align: center;
  margin-bottom: 4rem;
}

.demo-title {
  font-size: 2.5rem;
  color: #1890ff;
  margin-bottom: 1rem;
}

.demo-subtitle {
  font-size: 1.1rem;
  color: #666;
}

.demo-content {
  max-width: 800px;
  margin: 0 auto;
}

.demo-steps {
  margin-bottom: 3rem;
}

.demo-step {
  display: flex;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.step-number {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  margin-right: 1.5rem;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-title {
  color: #1890ff;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.step-description {
  color: #666;
  line-height: 1.6;
}

.demo-actions {
  text-align: center;
}

.demo-actions .el-button {
  margin: 0 0.5rem;
}

@media (max-width: 768px) {
  .evaluation-title {
    font-size: 2rem;
  }

  .evaluation-stats {
    flex-direction: column;
    gap: 1.5rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .demo-step {
    flex-direction: column;
    text-align: center;
  }

  .step-number {
    margin: 0 auto 1rem;
  }
}
</style>
