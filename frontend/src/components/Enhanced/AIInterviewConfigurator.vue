<template>
  <div class="ai-interview-configurator">
    <!-- 配置向导头部 -->
    <div class="configurator-header">
      <div class="header-content">
        <div class="header-info">
          <h1 class="configurator-title">
            <el-icon><Cpu /></el-icon>
            iFlytek Spark AI面试配置
          </h1>
          <p class="configurator-subtitle">基于讯飞星火大模型，打造个性化智能面试体验</p>
        </div>
        <div class="ai-status">
          <div class="status-indicator online">
            <div class="status-dot"></div>
            <span>AI引擎在线</span>
          </div>
          <div class="model-info">
            <span class="model-name">Spark V3.5</span>
            <span class="model-version">最新版本</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 配置步骤 -->
    <div class="configuration-steps">
      <el-steps :active="currentStep" align-center class="config-steps">
        <el-step title="基础设置" description="职位信息与面试类型"></el-step>
        <el-step title="AI能力配置" description="多模态分析设置"></el-step>
        <el-step title="评估标准" description="评分权重与标准"></el-step>
        <el-step title="预览确认" description="配置预览与发布"></el-step>
      </el-steps>
    </div>

    <!-- 配置内容区域 -->
    <div class="configuration-content">
      <!-- 步骤1: 基础设置 -->
      <div v-show="currentStep === 0" class="config-panel">
        <div class="panel-header">
          <h3 class="panel-title">基础面试设置</h3>
          <p class="panel-subtitle">配置职位信息和面试基本参数</p>
        </div>
        
        <div class="config-grid">
          <div class="config-section">
            <h4 class="section-title">职位信息</h4>
            <el-form :model="basicConfig" label-width="120px" class="config-form">
              <el-form-item label="职位名称">
                <el-input v-model="basicConfig.position" placeholder="请输入职位名称" />
              </el-form-item>
              <el-form-item label="技术领域">
                <el-select v-model="basicConfig.domain" placeholder="选择技术领域">
                  <el-option label="人工智能" value="ai" />
                  <el-option label="大数据" value="bigdata" />
                  <el-option label="物联网" value="iot" />
                </el-select>
              </el-form-item>
              <el-form-item label="经验要求">
                <el-radio-group v-model="basicConfig.experience">
                  <el-radio label="junior">初级 (0-2年)</el-radio>
                  <el-radio label="middle">中级 (3-5年)</el-radio>
                  <el-radio label="senior">高级 (5年以上)</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </div>
          
          <div class="config-section">
            <h4 class="section-title">面试参数</h4>
            <el-form :model="basicConfig" label-width="120px" class="config-form">
              <el-form-item label="面试时长">
                <el-slider 
                  v-model="basicConfig.duration" 
                  :min="15" 
                  :max="60" 
                  :step="5"
                  show-input
                  :format-tooltip="(val) => `${val}分钟`"
                />
              </el-form-item>
              <el-form-item label="问题数量">
                <el-input-number v-model="basicConfig.questionCount" :min="5" :max="20" />
              </el-form-item>
              <el-form-item label="难度分布">
                <div class="difficulty-config">
                  <div class="difficulty-item">
                    <span>基础题</span>
                    <el-input-number v-model="basicConfig.difficulty.basic" :min="0" :max="10" size="small" />
                  </div>
                  <div class="difficulty-item">
                    <span>进阶题</span>
                    <el-input-number v-model="basicConfig.difficulty.advanced" :min="0" :max="10" size="small" />
                  </div>
                  <div class="difficulty-item">
                    <span>挑战题</span>
                    <el-input-number v-model="basicConfig.difficulty.expert" :min="0" :max="10" size="small" />
                  </div>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>

      <!-- 步骤2: AI能力配置 -->
      <div v-show="currentStep === 1" class="config-panel">
        <div class="panel-header">
          <h3 class="panel-title">iFlytek Spark AI能力配置</h3>
          <p class="panel-subtitle">配置多模态分析能力和AI交互参数</p>
        </div>
        
        <div class="ai-capabilities-grid">
          <div class="capability-card" v-for="capability in aiCapabilities" :key="capability.id">
            <div class="capability-header">
              <div class="capability-icon" :style="{ background: capability.gradient }">
                <el-icon :size="24"><component :is="capability.icon" /></el-icon>
              </div>
              <div class="capability-info">
                <h4 class="capability-title">{{ capability.title }}</h4>
                <p class="capability-description">{{ capability.description }}</p>
              </div>
              <el-switch 
                v-model="capability.enabled" 
                size="large"
                :active-color="capability.color"
              />
            </div>
            
            <div v-if="capability.enabled" class="capability-settings">
              <div class="setting-item" v-for="setting in capability.settings" :key="setting.key">
                <label class="setting-label">{{ setting.label }}</label>
                <el-slider 
                  v-model="setting.value" 
                  :min="setting.min" 
                  :max="setting.max"
                  :step="setting.step"
                  show-input
                  size="small"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- AI模型参数调优 -->
        <div class="model-tuning-section">
          <h4 class="section-title">
            <el-icon><Setting /></el-icon>
            Spark模型参数调优
          </h4>
          <div class="tuning-grid">
            <div class="tuning-item">
              <label>创造性水平</label>
              <el-slider v-model="modelConfig.creativity" :min="0" :max="1" :step="0.1" show-input />
              <span class="tuning-hint">控制AI回答的创新程度</span>
            </div>
            <div class="tuning-item">
              <label>专业深度</label>
              <el-slider v-model="modelConfig.depth" :min="0" :max="1" :step="0.1" show-input />
              <span class="tuning-hint">调整技术问题的深度</span>
            </div>
            <div class="tuning-item">
              <label>交互友好度</label>
              <el-slider v-model="modelConfig.friendliness" :min="0" :max="1" :step="0.1" show-input />
              <span class="tuning-hint">设置AI面试官的亲和力</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 步骤3: 评估标准 -->
      <div v-show="currentStep === 2" class="config-panel">
        <div class="panel-header">
          <h3 class="panel-title">智能评估标准配置</h3>
          <p class="panel-subtitle">设置多维度评估权重和评分标准</p>
        </div>
        
        <div class="evaluation-config">
          <div class="weight-config">
            <h4 class="section-title">评估维度权重</h4>
            <div class="weight-items">
              <div class="weight-item" v-for="dimension in evaluationDimensions" :key="dimension.key">
                <div class="dimension-info">
                  <div class="dimension-icon" :style="{ background: dimension.color }">
                    <el-icon><component :is="dimension.icon" /></el-icon>
                  </div>
                  <div class="dimension-details">
                    <span class="dimension-name">{{ dimension.name }}</span>
                    <span class="dimension-desc">{{ dimension.description }}</span>
                  </div>
                </div>
                <div class="weight-control">
                  <el-input-number 
                    v-model="dimension.weight" 
                    :min="0" 
                    :max="100" 
                    :step="5"
                    size="small"
                  />
                  <span class="weight-unit">%</span>
                </div>
              </div>
            </div>
          </div>

          <div class="scoring-preview">
            <h4 class="section-title">评分预览</h4>
            <div class="preview-chart">
              <div ref="evaluationChart" class="chart-container"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 步骤4: 预览确认 -->
      <div v-show="currentStep === 3" class="config-panel">
        <div class="panel-header">
          <h3 class="panel-title">配置预览与确认</h3>
          <p class="panel-subtitle">检查配置信息并发布AI面试</p>
        </div>
        
        <div class="preview-content">
          <div class="config-summary">
            <div class="summary-section">
              <h4>基础信息</h4>
              <div class="summary-items">
                <div class="summary-item">
                  <span class="item-label">职位名称:</span>
                  <span class="item-value">{{ basicConfig.position }}</span>
                </div>
                <div class="summary-item">
                  <span class="item-label">技术领域:</span>
                  <span class="item-value">{{ getDomainName(basicConfig.domain) }}</span>
                </div>
                <div class="summary-item">
                  <span class="item-label">面试时长:</span>
                  <span class="item-value">{{ basicConfig.duration }}分钟</span>
                </div>
              </div>
            </div>
            
            <div class="summary-section">
              <h4>AI能力配置</h4>
              <div class="enabled-capabilities">
                <el-tag 
                  v-for="capability in enabledCapabilities" 
                  :key="capability.id"
                  :color="capability.color"
                  class="capability-tag"
                >
                  {{ capability.title }}
                </el-tag>
              </div>
            </div>
          </div>

          <div class="preview-actions">
            <el-button size="large" @click="saveAsDraft">
              <el-icon><Document /></el-icon>
              保存草稿
            </el-button>
            <el-button type="primary" size="large" @click="publishInterview">
              <el-icon><Promotion /></el-icon>
              发布面试
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div class="configurator-footer">
      <div class="footer-actions">
        <el-button v-if="currentStep > 0" @click="prevStep">
          <el-icon><ArrowLeft /></el-icon>
          上一步
        </el-button>
        <el-button v-if="currentStep < 3" type="primary" @click="nextStep">
          下一步
          <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import {
  Cpu, Setting, Document, Promotion, ArrowLeft, ArrowRight,
  Microphone, VideoCamera, Grid, Star, TrendCharts
} from '@element-plus/icons-vue'

// 当前步骤
const currentStep = ref(0)

// 基础配置
const basicConfig = ref({
  position: 'AI算法工程师',
  domain: 'ai',
  experience: 'middle',
  duration: 30,
  questionCount: 10,
  difficulty: {
    basic: 3,
    advanced: 5,
    expert: 2
  }
})

// AI能力配置
const aiCapabilities = ref([
  {
    id: 1,
    title: '智能语音分析',
    description: '基于iFlytek语音识别技术，分析语音质量、语速、停顿等',
    icon: 'Microphone',
    gradient: 'linear-gradient(135deg, #1890ff 0%, #0066cc 100%)',
    color: '#1890ff',
    enabled: true,
    settings: [
      { key: 'sensitivity', label: '识别敏感度', value: 80, min: 0, max: 100, step: 10 },
      { key: 'analysis_depth', label: '分析深度', value: 70, min: 0, max: 100, step: 10 }
    ]
  },
  {
    id: 2,
    title: '实时情感识别',
    description: '通过语音语调分析候选人的情感状态和紧张程度',
    icon: 'Cpu',
    gradient: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
    color: '#52c41a',
    enabled: true,
    settings: [
      { key: 'emotion_weight', label: '情感权重', value: 60, min: 0, max: 100, step: 10 }
    ]
  },
  {
    id: 3,
    title: '智能内容分析',
    description: '基于Spark大模型分析回答内容的逻辑性和专业性',
    icon: 'Grid',
    gradient: 'linear-gradient(135deg, #722ed1 0%, #531dab 100%)',
    color: '#722ed1',
    enabled: true,
    settings: [
      { key: 'content_depth', label: '内容深度分析', value: 90, min: 0, max: 100, step: 10 },
      { key: 'logic_weight', label: '逻辑性权重', value: 85, min: 0, max: 100, step: 10 }
    ]
  }
])

// 模型配置
const modelConfig = ref({
  creativity: 0.7,
  depth: 0.8,
  friendliness: 0.6
})

// 评估维度
const evaluationDimensions = ref([
  {
    key: 'professional',
    name: '专业知识',
    description: '技术能力和专业素养',
    weight: 30,
    color: '#1890ff',
    icon: 'Star'
  },
  {
    key: 'communication',
    name: '沟通表达',
    description: '语言表达和沟通能力',
    weight: 25,
    color: '#52c41a',
    icon: 'Microphone'
  },
  {
    key: 'logic',
    name: '逻辑思维',
    description: '问题分析和逻辑推理',
    weight: 25,
    color: '#722ed1',
    icon: 'Cpu'
  },
  {
    key: 'innovation',
    name: '创新能力',
    description: '创新思维和解决方案',
    weight: 20,
    color: '#fa8c16',
    icon: 'TrendCharts'
  }
])

// 计算属性
const enabledCapabilities = computed(() => {
  return aiCapabilities.value.filter(cap => cap.enabled)
})

// 方法
const nextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const getDomainName = (domain) => {
  const domainMap = {
    'ai': '人工智能',
    'bigdata': '大数据',
    'iot': '物联网'
  }
  return domainMap[domain] || domain
}

const saveAsDraft = () => {
  console.log('保存草稿')
}

const publishInterview = () => {
  console.log('发布面试')
}

// 图表引用
const evaluationChart = ref(null)

// 初始化评估图表
const initEvaluationChart = () => {
  nextTick(() => {
    if (evaluationChart.value) {
      const chartInstance = echarts.init(evaluationChart.value)
      const option = {
        tooltip: { trigger: 'item' },
        series: [{
          type: 'pie',
          radius: ['40%', '70%'],
          data: evaluationDimensions.value.map(dim => ({
            value: dim.weight,
            name: dim.name,
            itemStyle: { color: dim.color }
          })),
          label: {
            show: true,
            formatter: '{b}: {c}%'
          }
        }]
      }
      chartInstance.setOption(option)
    }
  })
}

onMounted(() => {
  initEvaluationChart()
})
</script>

<style scoped>
.ai-interview-configurator {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  background: #f8fafc;
  min-height: 100vh;
}

/* 配置向导头部 */
.configurator-header {
  background: white;
  border-radius: 12px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.configurator-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.configurator-subtitle {
  color: #64748b;
  font-size: 1rem;
}

.ai-status {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.status-indicator.online {
  color: #52c41a;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #52c41a;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.model-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.model-name {
  font-weight: 600;
  color: #1890ff;
}

.model-version {
  font-size: 12px;
  color: #64748b;
}

/* 配置步骤 */
.configuration-steps {
  background: white;
  border-radius: 12px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.config-steps {
  max-width: 800px;
  margin: 0 auto;
}

/* 配置内容 */
.configuration-content {
  background: white;
  border-radius: 12px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  min-height: 600px;
}

.panel-header {
  text-align: center;
  margin-bottom: 40px;
}

.panel-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
}

.panel-subtitle {
  color: #64748b;
}

.config-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.config-section {
  background: #f8fafc;
  border-radius: 8px;
  padding: 24px;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.difficulty-config {
  display: flex;
  gap: 16px;
}

.difficulty-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

/* AI能力配置 */
.ai-capabilities-grid {
  display: grid;
  gap: 20px;
  margin-bottom: 40px;
}

.capability-card {
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease;
}

.capability-card:hover {
  border-color: #1890ff;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.1);
}

.capability-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.capability-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.capability-info {
  flex: 1;
}

.capability-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
}

.capability-description {
  color: #64748b;
  font-size: 14px;
}

.capability-settings {
  padding-left: 64px;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.setting-label {
  min-width: 120px;
  font-size: 14px;
  color: #64748b;
}

/* 模型调优 */
.model-tuning-section {
  background: #f8fafc;
  border-radius: 8px;
  padding: 24px;
}

.tuning-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.tuning-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tuning-item label {
  font-weight: 600;
  color: #2c3e50;
}

.tuning-hint {
  font-size: 12px;
  color: #94a3b8;
}

/* 评估配置 */
.evaluation-config {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.weight-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.weight-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
}

.dimension-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dimension-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.dimension-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dimension-name {
  font-weight: 600;
  color: #2c3e50;
}

.dimension-desc {
  font-size: 12px;
  color: #64748b;
}

.weight-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.weight-unit {
  color: #64748b;
  font-size: 14px;
}

.chart-container {
  height: 300px;
}

/* 预览确认 */
.preview-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.config-summary {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.summary-section h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 16px;
}

.summary-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f1f5f9;
}

.item-label {
  color: #64748b;
}

.item-value {
  font-weight: 600;
  color: #2c3e50;
}

.enabled-capabilities {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.capability-tag {
  border: none;
  color: white;
  font-weight: 600;
}

.preview-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

/* 底部操作栏 */
.configurator-footer {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.footer-actions {
  display: flex;
  justify-content: space-between;
  max-width: 800px;
  margin: 0 auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }
  
  .config-grid,
  .evaluation-config,
  .config-summary {
    grid-template-columns: 1fr;
  }
  
  .tuning-grid {
    grid-template-columns: 1fr;
  }
}
</style>
