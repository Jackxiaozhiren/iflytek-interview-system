<template>
  <div class="report-page">
    <div class="report-header">
      <h1>面试报告</h1>
      <p>详细的面试评估结果和建议</p>
    </div>

    <div class="report-content">
      <div class="score-overview">
        <h2>总体评分</h2>
        <div class="score-circle">
          <div class="score-value">{{ overallScore }}</div>
          <div class="score-label">分</div>
        </div>
      </div>

      <div class="capability-scores">
        <h2>能力评估</h2>
        <div class="capability-grid">
          <div v-for="capability in capabilities" :key="capability.name" class="capability-item">
            <div class="capability-name">{{ capability.name }}</div>
            <el-progress :percentage="capability.score" :color="getScoreColor(capability.score)" />
            <div class="capability-score">{{ capability.score }}分</div>
          </div>
        </div>
      </div>

      <div class="suggestions">
        <h2>改进建议</h2>
        <ul>
          <li v-for="suggestion in suggestions" :key="suggestion">{{ suggestion }}</li>
        </ul>
      </div>

      <div class="report-actions">
        <el-button @click="downloadReport">下载报告</el-button>
        <el-button type="primary" @click="goHome">返回首页</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const overallScore = ref(85)
const capabilities = ref([
  { name: '技术能力', score: 88 },
  { name: '沟通能力', score: 82 },
  { name: '逻辑思维', score: 90 },
  { name: '学习能力', score: 85 },
  { name: '团队协作', score: 78 },
  { name: '创新能力', score: 83 }
])

const suggestions = ref([
  '加强算法基础知识的学习',
  '提升口语表达的流畅度',
  '多参与团队项目实践',
  '关注最新技术发展趋势'
])

const getScoreColor = (score) => {
  if (score >= 90) return '#52c41a'
  if (score >= 80) return '#1890ff'
  if (score >= 70) return '#faad14'
  return '#ff4d4f'
}

const downloadReport = () => {
  console.log('下载报告')
}

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.report-page {
  min-height: 100vh;
  background: var(--iflytek-bg-secondary);
  padding: 24px;
}

.report-header {
  text-align: center;
  margin-bottom: 32px;
}

.report-header h1 {
  font-size: var(--font-size-2xl);
  color: var(--iflytek-text-primary);
  margin: 0 0 8px 0;
}

.report-content {
  max-width: 800px;
  margin: 0 auto;
  background: var(--iflytek-bg-primary);
  border-radius: 12px;
  padding: 32px;
  box-shadow: var(--iflytek-shadow-sm);
}

.score-overview {
  text-align: center;
  margin-bottom: 32px;
}

.score-circle {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: var(--iflytek-gradient-primary);
  color: white;
  margin-top: 16px;
}

.score-value {
  font-size: 2rem;
  font-weight: bold;
}

.capability-scores {
  margin-bottom: 32px;
}

.capability-grid {
  display: grid;
  gap: 16px;
}

.capability-item {
  display: grid;
  grid-template-columns: 120px 1fr 60px;
  align-items: center;
  gap: 16px;
}

.capability-name {
  font-weight: var(--font-weight-medium);
  color: var(--iflytek-text-primary);
}

.capability-score {
  text-align: right;
  font-weight: var(--font-weight-medium);
  color: var(--iflytek-text-secondary);
}

.suggestions {
  margin-bottom: 32px;
}

.suggestions ul {
  list-style-type: disc;
  padding-left: 20px;
}

.suggestions li {
  margin-bottom: 8px;
  color: var(--iflytek-text-secondary);
  line-height: 1.5;
}

.report-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}
</style>
