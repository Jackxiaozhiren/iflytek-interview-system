<template>
  <div class="multimodal-showcase">
    <div class="container">
      <div class="showcase-header">
        <h2 class="showcase-title">iFlytek Spark 多模态AI能力</h2>
        <p class="showcase-subtitle">基于星火大模型的全方位智能面试解决方案</p>
      </div>

      <div class="capabilities-grid">
        <div 
          class="capability-card" 
          v-for="(capability, index) in capabilities" 
          :key="index"
          :class="{ 'active': activeCapability === index }"
          @click="setActiveCapability(index)"
        >
          <div class="capability-icon">
            <el-icon><component :is="capability.icon" /></el-icon>
          </div>
          <h3 class="capability-title">{{ capability.title }}</h3>
          <p class="capability-description">{{ capability.description }}</p>
          
          <div class="capability-features">
            <div class="feature-item" v-for="feature in capability.features" :key="feature.name">
              <div class="feature-icon">
                <el-icon><component :is="feature.icon" /></el-icon>
              </div>
              <div class="feature-content">
                <span class="feature-name">{{ feature.name }}</span>
                <span class="feature-value">{{ feature.value }}</span>
              </div>
            </div>
          </div>

          <div class="capability-demo" v-if="activeCapability === index">
            <div class="demo-content">
              <h4>实时演示</h4>
              <div class="demo-visualization">
                <component :is="capability.demoComponent" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 技术优势对比 -->
      <div class="advantage-section">
        <h3 class="advantage-title">技术优势对比</h3>
        <div class="comparison-table">
          <div class="comparison-header">
            <div class="feature-column">功能特性</div>
            <div class="competitor-column">传统方案</div>
            <div class="iflytek-column">iFlytek Spark</div>
          </div>
          <div 
            class="comparison-row" 
            v-for="(comparison, index) in comparisons" 
            :key="index"
          >
            <div class="feature-column">{{ comparison.feature }}</div>
            <div class="competitor-column">
              <el-icon class="status-icon error"><CloseBold /></el-icon>
              {{ comparison.competitor }}
            </div>
            <div class="iflytek-column">
              <el-icon class="status-icon success"><SuccessFilled /></el-icon>
              {{ comparison.iflytek }}
            </div>
          </div>
        </div>
      </div>

      <!-- 应用场景展示 -->
      <div class="scenarios-showcase">
        <h3 class="scenarios-title">多模态应用场景</h3>
        <div class="scenarios-tabs">
          <div 
            class="scenario-tab" 
            v-for="(scenario, index) in scenarios" 
            :key="index"
            :class="{ 'active': activeScenario === index }"
            @click="activeScenario = index"
          >
            <el-icon><component :is="scenario.icon" /></el-icon>
            <span>{{ scenario.title }}</span>
          </div>
        </div>
        <div class="scenario-content">
          <div class="scenario-details">
            <h4>{{ scenarios[activeScenario].title }}</h4>
            <p>{{ scenarios[activeScenario].description }}</p>
            <div class="scenario-benefits">
              <div 
                class="benefit-item" 
                v-for="benefit in scenarios[activeScenario].benefits" 
                :key="benefit"
              >
                <el-icon><Check /></el-icon>
                <span>{{ benefit }}</span>
              </div>
            </div>
          </div>
          <div class="scenario-visual">
            <div class="visual-placeholder">
              <el-icon><component :is="scenarios[activeScenario].icon" /></el-icon>
              <span>{{ scenarios[activeScenario].title }}演示</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  VideoCamera, Microphone, Document, Grid, Connection, User, TrendCharts, ChatDotRound, SuccessFilled, CloseBold, Check, School, OfficeBuilding, UserFilled
} from '@element-plus/icons-vue'

// 引入演示组件
import VoiceAnalysisDemo from './VoiceAnalysisDemo.vue'
import VideoAnalysisDemo from './VideoAnalysisDemo.vue'
import TextAnalysisDemo from './TextAnalysisDemo.vue'
import ReportGenerationDemo from './ReportGenerationDemo.vue'

const activeCapability = ref(0)
const activeScenario = ref(0)

const setActiveCapability = (index) => {
  activeCapability.value = index
}

const capabilities = [
  {
    icon: 'Microphone',
    title: '智能语音分析',
    description: '基于iFlytek语音识别技术，实现高精度语音转写和情感分析',
    features: [
      { name: '识别准确率', value: '98.5%', icon: 'TrendCharts' },
      { name: '响应时间', value: '<100ms', icon: 'TrendCharts' },
      { name: '支持语言', value: '中英双语', icon: 'ChatDotRound' },
      { name: '情感识别', value: '15种情绪', icon: 'Connection' }
    ],
    demoComponent: 'VoiceAnalysisDemo'
  },
  {
    icon: 'VideoCamera',
    title: '视频行为分析',
    description: '通过计算机视觉技术分析候选人的表情、姿态和专注度',
    features: [
      { name: '人脸检测', value: '99.9%', icon: 'User' },
      { name: '表情识别', value: '20种表情', icon: 'Connection' },
      { name: '姿态分析', value: '实时监测', icon: 'TrendCharts' },
      { name: '专注度评估', value: '智能算法', icon: 'Grid' }
    ],
    demoComponent: 'VideoAnalysisDemo'
  },
  {
    icon: 'Document',
    title: '文本内容分析',
    description: '利用NLP技术深度分析回答内容的逻辑性和专业性',
    features: [
      { name: '关键词提取', value: '智能识别', icon: 'Connection' },
      { name: '逻辑分析', value: '结构化评估', icon: 'Grid' },
      { name: '专业度评分', value: '多维度', icon: 'TrendCharts' },
      { name: '语言流畅度', value: '自动评估', icon: 'ChatDotRound' }
    ],
    demoComponent: 'TextAnalysisDemo'
  },
  {
    icon: 'Grid',
    title: '智能报告生成',
    description: '综合多模态数据生成详细的候选人评估报告',
    features: [
      { name: '综合评分', value: '多维度算法', icon: 'TrendCharts' },
      { name: '能力画像', value: '可视化展示', icon: 'User' },
      { name: '改进建议', value: 'AI生成', icon: 'Connection' },
      { name: '报告导出', value: '多种格式', icon: 'Document' }
    ],
    demoComponent: 'ReportGenerationDemo'
  }
]

const comparisons = [
  {
    feature: '语音识别准确率',
    competitor: '85-90%',
    iflytek: '98.5%+'
  },
  {
    feature: '多模态融合',
    competitor: '单一模态分析',
    iflytek: '语音+视频+文本'
  },
  {
    feature: '实时处理能力',
    competitor: '延迟较高',
    iflytek: '<100ms响应'
  },
  {
    feature: '中文支持',
    competitor: '支持有限',
    iflytek: '原生中文优化'
  },
  {
    feature: '定制化程度',
    competitor: '标准化方案',
    iflytek: '深度定制'
  }
]

const scenarios = [
  {
    icon: 'School',
    title: '校园招聘',
    description: '针对应届毕业生的大规模面试筛选，通过多模态分析全面评估学生的综合素质和潜力。',
    benefits: [
      '批量处理大量应聘者',
      '公平公正的评估标准',
      '识别学生真实能力',
      '提升招聘效率50%+'
    ]
  },
  {
    icon: 'OfficeBuilding',
    title: '企业招聘',
    description: '适用于各类企业职位的专业面试，通过AI技术精准匹配岗位要求和候选人能力。',
    benefits: [
      '精准岗位匹配',
      '降低招聘成本',
      '提升面试质量',
      '减少人为偏见'
    ]
  },
  {
    icon: 'UserFilled',
    title: '高端人才',
    description: '针对高级管理和技术岗位的深度面试分析，全方位评估候选人的领导力和专业能力。',
    benefits: [
      '深度能力分析',
      '领导力评估',
      '文化匹配度',
      '决策支持数据'
    ]
  }
]
</script>

<style scoped>
.multimodal-showcase {
  padding: 60px 0;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.showcase-header {
  text-align: center;
  margin-bottom: 60px;
}

.showcase-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 16px;
}

.showcase-subtitle {
  font-size: 1.2rem;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto;
}

.capabilities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 80px;
}

.capability-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
}

.capability-card:hover,
.capability-card.active {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  border-color: #1890ff;
}

.capability-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #1890ff, #667eea);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  margin-bottom: 24px;
}

.capability-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 12px;
}

.capability-description {
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 24px;
}

.capability-features {
  display: grid;
  gap: 16px;
  margin-bottom: 24px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
}

.feature-icon {
  width: 32px;
  height: 32px;
  background: #e2e8f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1890ff;
}

.feature-content {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.feature-name {
  font-size: 0.875rem;
  color: #64748b;
}

.feature-value {
  font-weight: 600;
  color: #1a202c;
}

.capability-demo {
  margin-top: 24px;
  padding: 24px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.demo-content h4 {
  margin-bottom: 16px;
  color: #1a202c;
}

.demo-visualization {
  min-height: 200px;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e8f0;
}

/* 技术优势对比 */
.advantage-section {
  margin-bottom: 80px;
}

.advantage-title {
  font-size: 2rem;
  font-weight: 600;
  color: #1a202c;
  text-align: center;
  margin-bottom: 40px;
}

.comparison-table {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.comparison-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  background: #1890ff;
  color: white;
  font-weight: 600;
}

.comparison-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  border-bottom: 1px solid #e2e8f0;
}

.comparison-row:last-child {
  border-bottom: none;
}

.feature-column,
.competitor-column,
.iflytek-column {
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.feature-column {
  font-weight: 600;
  color: #1a202c;
  background: #f8fafc;
}

.competitor-column {
  color: #64748b;
}

.iflytek-column {
  color: #1a202c;
  background: #f0f9ff;
}

.status-icon {
  font-size: 1.2rem;
}

.status-icon.success {
  color: #10b981;
}

.status-icon.error {
  color: #ef4444;
}

/* 应用场景展示 */
.scenarios-showcase {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.scenarios-title {
  font-size: 2rem;
  font-weight: 600;
  color: #1a202c;
  text-align: center;
  margin-bottom: 32px;
}

.scenarios-tabs {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 40px;
}

.scenario-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 8px;
  background: #f8fafc;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.scenario-tab.active {
  background: #1890ff;
  color: white;
  border-color: #1890ff;
}

.scenario-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
}

.scenario-details h4 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 16px;
}

.scenario-details p {
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 24px;
}

.scenario-benefits {
  display: grid;
  gap: 12px;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #1a202c;
}

.benefit-item .el-icon {
  color: #10b981;
  font-size: 1.2rem;
}

.scenario-visual {
  display: flex;
  justify-content: center;
}

.visual-placeholder {
  width: 300px;
  height: 200px;
  background: linear-gradient(135deg, #e2e8f0, #f8fafc);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: #64748b;
  border: 2px dashed #cbd5e1;
}

.visual-placeholder .el-icon {
  font-size: 3rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .capabilities-grid {
    grid-template-columns: 1fr;
  }
  
  .comparison-header,
  .comparison-row {
    grid-template-columns: 1fr;
  }
  
  .scenario-content {
    grid-template-columns: 1fr;
  }
  
  .scenarios-tabs {
    flex-direction: column;
    align-items: center;
  }
}
</style>
