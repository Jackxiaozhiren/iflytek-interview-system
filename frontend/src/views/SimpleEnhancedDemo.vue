<template>
  <div class="simple-enhanced-demo">
    <div class="demo-header">
      <h1>iFlytek Spark 增强演示系统</h1>
      <p>基于讯飞星火大模型的智能面试评估平台</p>
    </div>

    <div class="features-section">
      <h2>增强功能特性</h2>
      <div class="features-grid">
        <div class="feature-card" v-for="feature in features" :key="feature.id">
          <div class="feature-icon">
            <el-icon size="32">
              <component :is="feature.icon" />
            </el-icon>
          </div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </div>
      </div>
    </div>

    <div class="demo-actions">
      <el-button type="primary" size="large" @click="startDemo">
        开始演示
      </el-button>
      <el-button size="large" @click="goBack">
        返回首页
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Cpu, TrendCharts, Setting, Grid } from '@element-plus/icons-vue'

const router = useRouter()

const features = ref([
  {
    id: 1,
    title: '深度学习分析',
    description: '基于深度神经网络的多维度候选人能力分析',
    icon: Cpu
  },
  {
    id: 2,
    title: '实时情感识别',
    description: '实时分析候选人情感状态和心理压力指标',
    icon: TrendCharts
  },
  {
    id: 3,
    title: '智能适应调整',
    description: '根据候选人表现动态调整面试难度和问题类型',
    icon: Setting
  },
  {
    id: 4,
    title: '多模态融合',
    description: '融合文本、语音、视频多种模态的综合分析',
    icon: Grid
  }
])

const startDemo = () => {
  ElMessage.success('演示功能启动成功！')
}

const goBack = () => {
  router.push('/')
}
</script>

<style scoped>
.simple-enhanced-demo {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
}

.demo-header {
  text-align: center;
  color: white;
  margin-bottom: 60px;
}

.demo-header h1 {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 20px;
}

.demo-header p {
  font-size: 1.2rem;
  opacity: 0.9;
}

.features-section {
  max-width: 1200px;
  margin: 0 auto 60px;
}

.features-section h2 {
  text-align: center;
  color: white;
  font-size: 2.5rem;
  margin-bottom: 40px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
}

.feature-card {
  background: white;
  border-radius: 16px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  margin-bottom: 20px;
  color: #1890ff;
}

.feature-card h3 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 15px;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

.demo-actions {
  text-align: center;
  max-width: 400px;
  margin: 0 auto;
  display: flex;
  gap: 20px;
  justify-content: center;
}

.demo-actions .el-button {
  flex: 1;
}
</style>
