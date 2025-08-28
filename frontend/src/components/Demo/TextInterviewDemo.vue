<template>
  <div class="text-interview-demo">
    <!-- 演示介绍区域 -->
    <div class="demo-intro" v-if="!isDemoStarted">
      <div class="intro-content">
        <div class="intro-header">
          <el-icon class="intro-icon"><Document /></el-icon>
          <h2>智能文本面试演示</h2>
          <p class="intro-subtitle">体验基于iFlytek Spark大模型的智能对话面试系统</p>
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
            开始体验智能文本面试
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
              <span class="spec-label">AI模型</span>
              <span class="spec-value">iFlytek Spark 3.5</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">响应时间</span>
              <span class="spec-value">&lt; 500ms</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">准确率</span>
              <span class="spec-value">96.2%</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">语言支持</span>
              <span class="spec-value">中文优化</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 演示进行中的状态 -->
    <div class="demo-progress" v-if="isDemoStarted && !isDemoCompleted">
      <div class="progress-content">
        <el-icon class="progress-icon"><Loading /></el-icon>
        <h3>正在启动智能文本面试系统...</h3>
        <p>即将跳转到完整的面试体验界面</p>
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
  Document, VideoPlay, InfoFilled, Loading, Cpu, TrendCharts, 
  ChatDotRound, Star, Setting, Timer
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
    title: '智能问题生成',
    description: '基于iFlytek Spark动态生成个性化面试问题',
    icon: Cpu,
    iconClass: 'ai-icon'
  },
  {
    id: 2,
    title: '实时语义分析',
    description: '深度理解回答内容，提供精准的能力评估',
    icon: TrendCharts,
    iconClass: 'analysis-icon'
  },
  {
    id: 3,
    title: '智能对话交互',
    description: '自然流畅的多轮对话，支持上下文理解',
    icon: ChatDotRound,
    iconClass: 'chat-icon'
  },
  {
    id: 4,
    title: '个性化反馈',
    description: '提供针对性的改进建议和学习指导',
    icon: Star,
    iconClass: 'feedback-icon'
  }
])

// 开始演示
const startDemo = async () => {
  isLoading.value = true
  isDemoStarted.value = true
  
  ElMessage.success('正在启动iFlytek Spark智能文本面试系统...')
  
  // 模拟加载进度
  const progressInterval = setInterval(() => {
    progressValue.value += 10
    if (progressValue.value >= 100) {
      clearInterval(progressInterval)
      // 跳转到真实的文本面试页面
      setTimeout(() => {
        router.push('/text-primary-interview')
      }, 500)
    }
  }, 200)
}

// 查看详情
const viewDetails = () => {
  router.push('/demo/text-interview/details')
}

onMounted(() => {
  console.log('文本面试演示组件已加载')
})
</script>

<style scoped>
.text-interview-demo {
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

.ai-icon { color: #667eea; }
.analysis-icon { color: #764ba2; }
.chat-icon { color: #1890ff; }
.feedback-icon { color: #52c41a; }

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
  .text-interview-demo {
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
