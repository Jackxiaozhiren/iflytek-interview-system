<template>
  <div class="ai-evaluation-demo">
    <!-- 演示介绍区域 -->
    <div class="demo-intro" v-if="!isDemoStarted">
      <div class="intro-content">
        <div class="intro-header">
          <el-icon class="intro-icon"><TrendCharts /></el-icon>
          <h2>AI智能评估</h2>
          <p class="intro-subtitle">多维度智能评估系统，提供专业的能力分析报告</p>
        </div>

        <div class="demo-features">
          <div class="feature-grid">
            <div class="feature-item" v-for="feature in demoFeatures" :key="feature.id">
              <el-icon class="feature-icon" :class="feature.iconClass">
                <component :is="feature.icon" />
              </el-icon>
              <h4>{{ feature.title }}</h4>
              <p>{{ feature.description }}</p>
            </div>
          </div>
        </div>

        <div class="demo-actions">
          <el-button type="primary" size="large" @click="startDemo" :loading="isLoading">
            <el-icon><VideoPlay /></el-icon>
            立即体验
          </el-button>
          <el-button size="large" @click="viewDetails">
            <el-icon><InfoFilled /></el-icon>
            了解更多技术细节
          </el-button>
        </div>

        <!-- 技术规格展示 -->
        <div class="tech-specs">
          <h3>技术规格</h3>
          <div class="specs-grid">
            <div class="spec-item">
              <span class="spec-label">评估维度</span>
              <span class="spec-value">6个核心维度</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">算法引擎</span>
              <span class="spec-value">机器学习+规则引擎</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">准确率</span>
              <span class="spec-value">94.5%</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">报告格式</span>
              <span class="spec-value">PDF/HTML</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 演示进行中的状态 -->
    <div class="demo-progress" v-if="isDemoStarted && !isDemoCompleted">
      <div class="progress-content">
        <el-icon class="progress-icon"><Loading /></el-icon>
        <h3>正在启动AI智能评估系统...</h3>
        <p>即将跳转到评估演示界面</p>
        <el-progress :percentage="progressValue" :show-text="false" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  TrendCharts, VideoPlay, InfoFilled, Loading, DataAnalysis, 
  PieChart, Document, Star, Setting, Timer
} from '@element-plus/icons-vue'

const router = useRouter()

// 演示状态
const isDemoStarted = ref(false)
const isDemoCompleted = ref(false)
const isLoading = ref(false)
const progressValue = ref(0)

// 演示功能特性
const demoFeatures = reactive([
  {
    id: 1,
    title: '六大核心能力评估',
    description: '技术能力、逻辑思维、沟通表达、学习能力、创新思维、团队协作',
    icon: DataAnalysis,
    iconClass: 'analysis-icon'
  },
  {
    id: 2,
    title: '实时分析反馈',
    description: '面试过程中实时分析候选人表现，提供即时反馈',
    icon: TrendCharts,
    iconClass: 'trend-icon'
  },
  {
    id: 3,
    title: '个性化建议',
    description: '基于评估结果提供针对性的改进建议和发展方向',
    icon: Star,
    iconClass: 'suggestion-icon'
  },
  {
    id: 4,
    title: '可视化报告',
    description: '生成专业的可视化评估报告，支持多种格式导出',
    icon: PieChart,
    iconClass: 'report-icon'
  }
])

// 开始演示
const startDemo = async () => {
  isLoading.value = true
  isDemoStarted.value = true
  
  ElMessage.success('正在启动AI智能评估系统...')
  
  // 模拟加载进度
  const progressInterval = setInterval(() => {
    progressValue.value += 10
    if (progressValue.value >= 100) {
      clearInterval(progressInterval)
      // 跳转到评估页面
      setTimeout(() => {
        router.push('/evaluation')
      }, 500)
    }
  }, 200)
}

// 查看详情
const viewDetails = () => {
  router.push('/demo/ai-evaluation/details')
}

onMounted(() => {
  console.log('AI评估演示组件已加载')
})
</script>

<style scoped>
.ai-evaluation-demo {
  min-height: 80vh;
  padding: 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 12px;
}

.demo-intro {
  max-width: 1000px;
  margin: 0 auto;
}

.intro-header {
  text-align: center;
  margin-bottom: 3rem;
}

.intro-icon {
  font-size: 3rem;
  color: #1890ff;
  margin-bottom: 1rem;
}

.intro-header h2 {
  font-size: 2.5rem;
  color: #1890ff;
  margin-bottom: 0.5rem;
}

.intro-subtitle {
  font-size: 1.1rem;
  color: #666;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.feature-item {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-2px);
}

.feature-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.analysis-icon { color: #667eea; }
.trend-icon { color: #764ba2; }
.suggestion-icon { color: #52c41a; }
.report-icon { color: #1890ff; }

.feature-item h4 {
  color: #1890ff;
  margin-bottom: 0.5rem;
}

.feature-item p {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
}

.demo-actions {
  text-align: center;
  margin-bottom: 3rem;
}

.demo-actions .el-button {
  margin: 0 0.5rem;
}

.tech-specs {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tech-specs h3 {
  text-align: center;
  color: #1890ff;
  margin-bottom: 1.5rem;
}

.specs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.spec-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 6px;
}

.spec-label {
  color: #666;
  font-weight: 500;
}

.spec-value {
  color: #1890ff;
  font-weight: 600;
}

.demo-progress {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.progress-content {
  text-align: center;
  max-width: 400px;
}

.progress-icon {
  font-size: 3rem;
  color: #1890ff;
  margin-bottom: 1rem;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.progress-content h3 {
  color: #1890ff;
  margin-bottom: 0.5rem;
}

.progress-content p {
  color: #666;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .ai-evaluation-demo {
    padding: 1rem;
  }
  
  .intro-header h2 {
    font-size: 2rem;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
  }
  
  .specs-grid {
    grid-template-columns: 1fr;
  }
}
</style>
