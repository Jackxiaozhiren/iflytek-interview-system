<template>
  <div class="interview-flow-system enhanced-chart" :class="getSystemThemeClass()">
    <!-- 系统头部 -->
    <div class="system-header">
      <h2 class="system-title">
        <div class="chart-icon">
          <el-icon><Promotion /></el-icon>
        </div>
        四步解锁AI面试流程
      </h2>
      <p class="system-subtitle">借鉴Dayee大易的成功模式，结合iFlytek Spark技术优势</p>
    </div>

    <!-- 流程步骤展示 -->
    <div class="flow-steps-container">
      <div class="flow-timeline">
        <div 
          v-for="(step, index) in interviewSteps" 
          :key="step.id"
          class="flow-step"
          :class="[step.theme, { 'active': currentStep >= index + 1, 'completed': currentStep > index + 1 }]"
          v-motion-slide-visible-once-right
          :delay="index * 300"
        >
          <!-- 步骤图标 -->
          <div class="step-icon-container">
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-icon multimodal-icon" :class="step.iconClass">
              <el-icon><component :is="step.icon" /></el-icon>
            </div>
          </div>
          
          <!-- 步骤内容 -->
          <div class="step-content">
            <h3 class="step-title">{{ step.title }}</h3>
            <p class="step-description">{{ step.description }}</p>
            
            <!-- 步骤特性 -->
            <div class="step-features">
              <div 
                v-for="feature in step.features" 
                :key="feature"
                class="feature-tag"
              >
                <el-icon><Check /></el-icon>
                <span>{{ feature }}</span>
              </div>
            </div>
            
            <!-- 步骤统计 -->
            <div class="step-stats">
              <div class="stat-item">
                <span class="stat-value">{{ step.efficiency }}</span>
                <span class="stat-label">效率提升</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ step.accuracy }}</span>
                <span class="stat-label">准确率</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ step.time }}</span>
                <span class="stat-label">处理时间</span>
              </div>
            </div>
          </div>
          
          <!-- 连接线 -->
          <div class="step-connector" v-if="index < interviewSteps.length - 1">
            <div class="connector-line"></div>
            <div class="connector-arrow">
              <el-icon><ArrowRight /></el-icon>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 技术对比展示 -->
    <div class="tech-comparison">
      <h3>
        <el-icon><TrendCharts /></el-icon>
        技术优势对比
      </h3>
      <div class="comparison-table">
        <div class="comparison-header">
          <div class="header-item">功能特性</div>
          <div class="header-item">传统面试</div>
          <div class="header-item">竞品系统</div>
          <div class="header-item our-system">我们的系统</div>
        </div>
        
        <div 
          v-for="comparison in techComparisons" 
          :key="comparison.feature"
          class="comparison-row"
        >
          <div class="feature-name">{{ comparison.feature }}</div>
          <div class="traditional-value">{{ comparison.traditional }}</div>
          <div class="competitor-value">{{ comparison.competitor }}</div>
          <div class="our-value">
            <span class="value-text">{{ comparison.ours }}</span>
            <el-tag type="success" size="small">优势</el-tag>
          </div>
        </div>
      </div>
    </div>

    <!-- 实时演示控制 -->
    <div class="demo-controls">
      <h3>
        <el-icon><VideoPlay /></el-icon>
        实时流程演示
      </h3>
      <div class="controls-panel">
        <div class="control-buttons">
          <el-button 
            type="primary" 
            @click="startDemo" 
            :loading="isDemoRunning"
            size="large"
          >
            <el-icon><VideoPlay /></el-icon>
            {{ isDemoRunning ? '演示进行中...' : '开始演示' }}
          </el-button>
          <el-button 
            @click="pauseDemo" 
            :disabled="!isDemoRunning"
            size="large"
          >
            <el-icon><VideoPause /></el-icon>
            暂停
          </el-button>
          <el-button 
            @click="resetDemo"
            size="large"
          >
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </div>
        
        <div class="demo-progress">
          <div class="progress-info">
            <span>演示进度：步骤 {{ currentStep }}/{{ interviewSteps.length }}</span>
            <span>{{ getCurrentStepName() }}</span>
          </div>
          <el-progress 
            :percentage="(currentStep / interviewSteps.length) * 100" 
            :color="getProgressColor()"
            :stroke-width="8"
            :show-text="false"
          />
        </div>
      </div>
    </div>

    <!-- 成功案例展示 */
    <div class="success-cases">
      <h3>
        <el-icon><Trophy /></el-icon>
        成功案例
      </h3>
      <div class="cases-grid">
        <div 
          v-for="case_item in successCases" 
          :key="case_item.id"
          class="case-card"
          :class="case_item.theme"
        >
          <div class="case-header">
            <div class="company-logo">
              <img :src="case_item.logo" :alt="case_item.company" class="logo-image">
            </div>
            <div class="company-info">
              <h4>{{ case_item.company }}</h4>
              <p>{{ case_item.industry }}</p>
            </div>
          </div>
          
          <div class="case-content">
            <p class="case-description">{{ case_item.description }}</p>
            
            <div class="case-results">
              <div class="result-item">
                <span class="result-label">效率提升：</span>
                <span class="result-value">{{ case_item.efficiency }}</span>
              </div>
              <div class="result-item">
                <span class="result-label">成本节省：</span>
                <span class="result-value">{{ case_item.cost_saving }}</span>
              </div>
              <div class="result-item">
                <span class="result-label">满意度：</span>
                <span class="result-value">{{ case_item.satisfaction }}</span>
              </div>
            </div>
          </div>
          
          <div class="case-action">
            <el-button type="primary" size="small" @click="viewCaseDetail(case_item)">
              查看详情
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <el-button type="primary" size="large" @click="startInterviewFlow" :loading="isStarting">
        <el-icon><Promotion /></el-icon>
        开始面试流程
      </el-button>
      <el-button size="large" @click="customizeFlow">
        <el-icon><Setting /></el-icon>
        自定义流程
      </el-button>
      <el-button size="large" @click="viewDocumentation">
        <el-icon><Document /></el-icon>
        查看文档
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
  Promotion, Check, ArrowRight, TrendCharts, VideoPlay, VideoPause, 
  Refresh, Trophy, Setting, Document, Cpu, User, Grid, Lock
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 响应式数据
const currentStep = ref(1)
const isDemoRunning = ref(false)
const isStarting = ref(false)
let demoInterval = null

// 面试流程步骤
const interviewSteps = ref([
  {
    id: 1,
    title: '自主筛选',
    description: '基于iFlytek Spark的AI智能简历分析和候选人筛选',
    icon: 'Cpu',
    iconClass: 'ai-icon pulse',
    theme: 'ai-theme',
    features: ['AI简历解析', '技能匹配度分析', '自动排序推荐'],
    efficiency: '90%',
    accuracy: '96.8%',
    time: '2分钟'
  },
  {
    id: 2,
    title: '因岗设题',
    description: '根据岗位要求和技术领域自动生成专业面试题目',
    icon: 'DataBoard',
    iconClass: 'bigdata-icon',
    theme: 'bigdata-theme',
    features: ['专业题库', '难度自适应', '多维度考察'],
    efficiency: '85%',
    accuracy: '94.2%',
    time: '30秒'
  },
  {
    id: 3,
    title: '高效面试',
    description: '多模态AI面试官进行实时互动和专业评估',
    icon: 'User',
    iconClass: 'iot-icon',
    theme: 'iot-theme',
    features: ['语音识别', '视频分析', '实时反馈'],
    efficiency: '80%',
    accuracy: '92.5%',
    time: '15分钟'
  },
  {
    id: 4,
    title: '智能打分',
    description: '综合多维度数据生成详细评估报告和建议',
    icon: 'Lock',
    iconClass: 'assessment-icon analyzing',
    theme: 'interview-theme',
    features: ['胜任力评估', '详细报告', '改进建议'],
    efficiency: '95%',
    accuracy: '97.1%',
    time: '1分钟'
  }
])

// 技术对比数据
const techComparisons = ref([
  {
    feature: 'AI模型',
    traditional: '无',
    competitor: 'GPT/通用模型',
    ours: 'iFlytek Spark专业模型'
  },
  {
    feature: '中文理解',
    traditional: '人工判断',
    competitor: '基础支持',
    ours: '深度优化'
  },
  {
    feature: '技术领域',
    traditional: '通用评估',
    competitor: '基础分类',
    ours: 'AI/大数据/IoT专业化'
  },
  {
    feature: '防作弊',
    traditional: '人工监督',
    competitor: '基础检测',
    ours: '多模态智能监控'
  },
  {
    feature: '评估准确率',
    traditional: '70-80%',
    competitor: '85-90%',
    ours: '96.8%'
  }
])

// 成功案例
const successCases = ref([
  {
    id: 1,
    company: '科技独角兽A',
    industry: 'AI技术',
    logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIzMCIgZmlsbD0iIzAwNjZjYyIvPjx0ZXh0IHg9IjMwIiB5PSIzNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QTwvdGV4dD48L3N2Zz4=',
    description: '通过我们的AI面试系统，成功招聘了50+优秀算法工程师',
    efficiency: '90%',
    cost_saving: '60%',
    satisfaction: '95%',
    theme: 'ai-theme'
  },
  {
    id: 2,
    company: '大数据公司B',
    industry: '大数据分析',
    logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIzMCIgZmlsbD0iIzA1OTY2OSIvPjx0ZXh0IHg9IjMwIiB5PSIzNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QjwvdGV4dD48L3N2Zz4=',
    description: '大规模招聘数据工程师，显著提升了招聘效率和质量',
    efficiency: '85%',
    cost_saving: '55%',
    satisfaction: '92%',
    theme: 'bigdata-theme'
  },
  {
    id: 3,
    company: 'IoT企业C',
    industry: '物联网',
    logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIzMCIgZmlsbD0iI2VhNTgwYyIvPjx0ZXh0IHg9IjMwIiB5PSIzNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QzwvdGV4dD48L3N2Zz4=',
    description: '专业的IoT技术评估帮助快速识别优秀的嵌入式工程师',
    efficiency: '88%',
    cost_saving: '50%',
    satisfaction: '94%',
    theme: 'iot-theme'
  }
])

// 计算属性
const getCurrentStepName = () => {
  const step = interviewSteps.value[currentStep.value - 1]
  return step ? step.title : '未知步骤'
}

const getProgressColor = () => {
  const colors = ['#0066cc', '#059669', '#ea580c', '#7c3aed']
  return colors[(currentStep.value - 1) % colors.length]
}

const getSystemThemeClass = () => {
  return 'chart-interview-theme'
}

// 方法
const startDemo = () => {
  if (isDemoRunning.value) return
  
  isDemoRunning.value = true
  currentStep.value = 1
  
  demoInterval = setInterval(() => {
    if (currentStep.value < interviewSteps.value.length) {
      currentStep.value++
    } else {
      pauseDemo()
      ElMessage.success('演示完成！')
    }
  }, 3000)
  
  ElMessage.success('开始流程演示')
}

const pauseDemo = () => {
  isDemoRunning.value = false
  if (demoInterval) {
    clearInterval(demoInterval)
    demoInterval = null
  }
}

const resetDemo = () => {
  pauseDemo()
  currentStep.value = 1
  ElMessage.info('演示已重置')
}

const startInterviewFlow = () => {
  isStarting.value = true
  ElMessage.success('正在启动面试流程...')
  
  setTimeout(() => {
    isStarting.value = false
    ElMessage.success('面试流程启动成功！')
  }, 2000)
}

const customizeFlow = () => {
  ElMessage.info('打开流程自定义面板...')
}

const viewDocumentation = () => {
  ElMessage.info('查看详细文档...')
}

const viewCaseDetail = (case_item) => {
  ElMessage.success(`查看${case_item.company}的详细案例`)
}

// 生命周期
onMounted(() => {
  // 自动开始演示
  setTimeout(() => {
    startDemo()
  }, 1000)
})

onUnmounted(() => {
  pauseDemo()
})
</script>

<style scoped>
.interview-flow-system {
  padding: 2rem;
  margin: 2rem 0;
}

.system-header {
  text-align: center;
  margin-bottom: 3rem;
}

.system-title {
  font-size: 2rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.system-subtitle {
  color: #64748b;
  font-size: 1.1rem;
}

.flow-steps-container {
  margin-bottom: 3rem;
}

.flow-timeline {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.flow-step {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
}

.flow-step.active {
  border-color: var(--theme-primary);
  transform: translateX(10px);
  box-shadow: 0 8px 25px var(--theme-shadow);
}

.flow-step.completed {
  background: var(--theme-light);
}

.step-icon-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 2rem;
}

.step-number {
  background: var(--theme-primary);
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-bottom: 1rem;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.step-description {
  color: #64748b;
  margin-bottom: 1rem;
}

.step-features {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.feature-tag {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: var(--theme-light);
  color: var(--theme-primary);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.step-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--theme-primary);
}

.stat-label {
  font-size: 0.8rem;
  color: #64748b;
}

.step-connector {
  position: absolute;
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
}

.connector-line {
  width: 40px;
  height: 2px;
  background: var(--theme-primary);
}

.connector-arrow {
  position: absolute;
  right: -5px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--theme-primary);
}

.tech-comparison,
.demo-controls,
.success-cases {
  margin-bottom: 3rem;
}

.tech-comparison h3,
.demo-controls h3,
.success-cases h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.comparison-table {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.comparison-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  background: #f8fafc;
  font-weight: 600;
  color: #2d3748;
}

.header-item {
  padding: 1rem;
  border-right: 1px solid #e2e8f0;
}

.header-item.our-system {
  background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%);
  color: white;
}

.comparison-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  border-bottom: 1px solid #e2e8f0;
}

.comparison-row > div {
  padding: 1rem;
  border-right: 1px solid #e2e8f0;
}

.our-value {
  background: #faf5ff;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.controls-panel {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.control-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.demo-progress {
  margin-top: 1rem;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #64748b;
}

.cases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.case-card {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  border: 2px solid var(--theme-light);
  transition: all 0.3s ease;
}

.case-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px var(--theme-shadow);
}

.case-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.company-logo {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  overflow: hidden;
  background: var(--theme-light);
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.company-info h4 {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.company-info p {
  color: #64748b;
  font-size: 0.9rem;
}

.case-description {
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.case-results {
  margin-bottom: 1rem;
}

.result-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.result-label {
  color: #64748b;
}

.result-value {
  font-weight: 600;
  color: var(--theme-primary);
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .flow-step {
    flex-direction: column;
    text-align: center;
  }
  
  .step-icon-container {
    margin-right: 0;
    margin-bottom: 1rem;
  }
  
  .comparison-header,
  .comparison-row {
    grid-template-columns: 1fr;
  }
  
  .control-buttons {
    flex-direction: column;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>
