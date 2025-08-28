<template>
  <div class="interview-selection-page">
    <!-- 顶部导航 -->
    <header class="page-header">
      <div class="header-container">
        <div class="header-left">
          <el-button @click="goBack" class="back-btn">
            <el-icon><ArrowLeft /></el-icon>
            返回首页
          </el-button>
        </div>
        <div class="header-center">
          <h1 class="page-title">AI面试配置</h1>
          <p class="page-subtitle">选择面试类型和技术领域，开始您的智能面试之旅</p>
        </div>
        <div class="header-right">
          <div class="progress-indicator">
            <span class="step active">1</span>
            <span class="step-label">选择配置</span>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="selection-main">
      <div class="main-container">
        <!-- 面试类型选择 -->
        <section class="selection-section">
          <div class="section-header">
            <h2 class="section-title">
              <el-icon><VideoCamera /></el-icon>
              选择面试类型
            </h2>
            <p class="section-subtitle">根据您的需求选择最适合的面试模式</p>
          </div>
          
          <div class="type-grid">
            <div 
              v-for="type in interviewTypes" 
              :key="type.id"
              class="type-card"
              :class="{ active: selectedType === type.id, recommended: type.recommended }"
              @click="selectType(type.id)"
            >
              <div class="card-badge" v-if="type.recommended">推荐</div>
              <div class="type-icon" :style="{ background: type.gradient }">
                <el-icon :size="32"><component :is="type.icon" /></el-icon>
              </div>
              <div class="type-content">
                <h3 class="type-title">{{ type.name }}</h3>
                <p class="type-description">{{ type.description }}</p>
                <div class="type-features">
                  <div class="feature-item" v-for="feature in type.features" :key="feature">
                    <el-icon class="feature-icon"><Check /></el-icon>
                    <span>{{ feature }}</span>
                  </div>
                </div>
                <div class="type-stats">
                  <div class="stat-item">
                    <span class="stat-value">{{ type.duration }}</span>
                    <span class="stat-label">预计时长</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-value">{{ type.difficulty }}</span>
                    <span class="stat-label">难度等级</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 技术领域选择 -->
        <section class="selection-section">
          <div class="section-header">
            <h2 class="section-title">
              <el-icon><Cpu /></el-icon>
              选择技术领域
            </h2>
            <p class="section-subtitle">选择您要面试的技术专业领域</p>
          </div>
          
          <div class="domain-grid">
            <div 
              v-for="domain in techDomains" 
              :key="domain.id"
              class="domain-card"
              :class="{ active: selectedDomain === domain.id }"
              @click="selectDomain(domain.id)"
            >
              <div class="domain-header">
                <div class="domain-icon" :style="{ background: domain.gradient }">
                  <el-icon :size="28"><component :is="domain.icon" /></el-icon>
                </div>
                <div class="domain-info">
                  <h3 class="domain-title">{{ domain.name }}</h3>
                  <p class="domain-description">{{ domain.description }}</p>
                </div>
              </div>
              <div class="domain-skills">
                <span class="skill-tag" v-for="skill in domain.skills" :key="skill">
                  {{ skill }}
                </span>
              </div>
              <div class="domain-stats">
                <div class="stat-row">
                  <span class="stat-label">热门程度:</span>
                  <el-rate v-model="domain.popularity" disabled size="small" />
                </div>
                <div class="stat-row">
                  <span class="stat-label">岗位需求:</span>
                  <span class="stat-value">{{ domain.demand }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 配置预览和开始按钮 -->
        <section class="action-section">
          <div class="config-preview">
            <h3 class="preview-title">配置预览</h3>
            <div class="preview-content">
              <div class="preview-item">
                <span class="preview-label">面试类型:</span>
                <span class="preview-value">{{ getSelectedTypeName() }}</span>
              </div>
              <div class="preview-item">
                <span class="preview-label">技术领域:</span>
                <span class="preview-value">{{ getSelectedDomainName() }}</span>
              </div>
              <div class="preview-item">
                <span class="preview-label">预计时长:</span>
                <span class="preview-value">{{ getSelectedDuration() }}</span>
              </div>
            </div>
          </div>
          
          <div class="action-buttons">
            <el-button size="large" @click="resetSelection" class="reset-btn">
              <el-icon><Refresh /></el-icon>
              重新选择
            </el-button>
            <el-button
              type="primary"
              size="large"
              @click="startInterview"
              :disabled="!canStart"
              class="start-btn"
            >
              <el-icon><VideoPlay /></el-icon>
              开始AI面试
            </el-button>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowLeft, VideoCamera, Cpu, Check, VideoPlay, Refresh,
  Grid, TrendCharts, Microphone, Setting, ChatDotRound
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()

// 选择状态
const selectedType = ref(null)
const selectedDomain = ref(null)

// 面试类型数据
const interviewTypes = ref([
  {
    id: 'text-based',
    name: 'iFlytek Spark文本面试',
    description: '基于iFlytek Spark大模型的智能文本对话面试，专注于逻辑思维和专业技能评估',
    icon: 'ChatDotRound',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    recommended: true,
    duration: '20-30分钟',
    difficulty: '标准',
    features: [
      'iFlytek Spark AI对话',
      '智能问题生成',
      '实时思维分析',
      '专业技能评估',
      '逻辑推理测试',
      '知识深度挖掘'
    ]
  }
])

// 技术领域数据
const techDomains = ref([
  {
    id: 'ai',
    name: '人工智能',
    description: '机器学习、深度学习、自然语言处理等AI核心技术',
    icon: 'Cpu',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    popularity: 5,
    demand: '极高',
    skills: ['Python', '机器学习', '深度学习', 'TensorFlow', 'PyTorch']
  },
  {
    id: 'bigdata',
    name: '大数据',
    description: '数据处理、分析挖掘、分布式计算等大数据技术栈',
    icon: 'Grid',
    gradient: 'linear-gradient(135deg, #1890ff 0%, #0066cc 100%)',
    popularity: 4,
    demand: '很高',
    skills: ['Hadoop', 'Spark', 'Kafka', 'Elasticsearch', 'SQL']
  },
  {
    id: 'iot',
    name: '物联网',
    description: '嵌入式开发、传感器技术、边缘计算等IoT相关技术',
    icon: 'Setting',
    gradient: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
    popularity: 3,
    demand: '较高',
    skills: ['C/C++', '嵌入式', 'MQTT', '边缘计算', '传感器']
  }
])

// 计算属性
const canStart = computed(() => {
  return selectedType.value && selectedDomain.value
})

// 方法
const goBack = () => {
  router.push('/')
}

const selectType = (typeId) => {
  selectedType.value = typeId
}

const selectDomain = (domainId) => {
  selectedDomain.value = domainId
}

const getSelectedTypeName = () => {
  const type = interviewTypes.value.find(t => t.id === selectedType.value)
  return type ? type.name : '请选择面试类型'
}

const getSelectedDomainName = () => {
  const domain = techDomains.value.find(d => d.id === selectedDomain.value)
  return domain ? domain.name : '请选择技术领域'
}

const getSelectedDuration = () => {
  const type = interviewTypes.value.find(t => t.id === selectedType.value)
  return type ? type.duration : '--'
}

const resetSelection = () => {
  selectedType.value = null
  selectedDomain.value = null
  ElMessage.info('已重置选择')
}

const startInterview = () => {
  if (!canStart.value) {
    ElMessage.warning('请先选择面试类型和技术领域')
    return
  }

  // 直接跳转到文本面试页面
  const targetRoute = '/text-interview'
  
  // 传递选择的参数
  router.push({
    path: targetRoute,
    query: {
      type: selectedType.value,
      domain: selectedDomain.value
    }
  })
  
  ElMessage.success('正在启动AI面试...')
}
</script>

<style scoped>
.interview-selection-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  position: relative;
  overflow-x: hidden;
}

/* 顶部导航 */
.page-header {
  background: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 24px 0;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back-btn {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #64748b;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
}

.page-subtitle {
  color: #64748b;
  font-size: 14px;
}

.progress-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.step {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #1890ff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.step-label {
  color: #64748b;
  font-size: 14px;
}

/* 主要内容 */
.selection-main {
  padding: 40px 0;
  min-height: calc(100vh - 120px); /* 减去头部高度 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  width: 100%;
}

.selection-section {
  margin-bottom: 60px;
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 8px;
}

.section-subtitle {
  color: #64748b;
}

/* 面试类型卡片 */
.type-grid {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.type-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 2px solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  width: 100%;
  max-width: 500px;
  min-width: 350px;
}

.type-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.type-card.active {
  border-color: #1890ff;
  box-shadow: 0 8px 32px rgba(24, 144, 255, 0.2);
}

.type-card.recommended::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  border-radius: 16px 16px 0 0;
}

.card-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: #1890ff;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.type-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 20px;
}

.type-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
}

.type-description {
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 20px;
}

.type-features {
  margin-bottom: 20px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: #64748b;
  font-size: 14px;
}

.feature-icon {
  color: #52c41a;
  flex-shrink: 0;
}

.type-stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-weight: 600;
  color: #1890ff;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #94a3b8;
}

/* 技术领域卡片 */
.domain-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.domain-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 2px solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;
}

.domain-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
}

.domain-card.active {
  border-color: #1890ff;
  box-shadow: 0 6px 24px rgba(24, 144, 255, 0.15);
}

.domain-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.domain-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.domain-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
}

.domain-description {
  color: #64748b;
  font-size: 14px;
}

.domain-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.skill-tag {
  background: #f1f5f9;
  color: #64748b;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.domain-stats {
  space-y: 8px;
}

.stat-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.stat-row:last-child {
  margin-bottom: 0;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
}

.stat-value {
  font-weight: 600;
  color: #1890ff;
}

/* 操作区域 */
.action-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
}

.config-preview {
  flex: 1;
}

.preview-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 16px;
}

.preview-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.preview-label {
  color: #64748b;
}

.preview-value {
  font-weight: 600;
  color: #2c3e50;
}

.action-buttons {
  display: flex;
  gap: 16px;
}

.reset-btn {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #64748b;
}

.start-btn {
  background: linear-gradient(135deg, #1890ff 0%, #0066cc 100%);
  border: none;
  padding: 12px 32px;
  font-weight: 600;
}

.start-btn:disabled {
  background: #f1f5f9;
  color: #94a3b8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .type-grid,
  .domain-grid {
    grid-template-columns: 1fr;
  }
  
  .action-section {
    flex-direction: column;
    text-align: center;
  }
  
  .action-buttons {
    width: 100%;
    justify-content: center;
  }
}
</style>
