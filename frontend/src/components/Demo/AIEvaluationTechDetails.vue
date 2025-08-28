<template>
  <div class="ai-eval-tech-page">
    <!-- 页面头部 -->
    <div class="tech-header">
      <div class="tech-container">
        <div class="breadcrumb">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item @click="goToDemo">产品演示</el-breadcrumb-item>
            <el-breadcrumb-item>AI智能评估</el-breadcrumb-item>
            <el-breadcrumb-item>技术详情</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        
        <div class="tech-hero">
          <h1 class="tech-title">AI智能评估技术详情</h1>
          <p class="tech-subtitle">基于机器学习的六维能力评估系统技术架构与算法实现</p>
          
          <div class="tech-stats">
            <div class="tech-stat-item">
              <span class="tech-stat-number">6</span>
              <span class="tech-stat-label">评估维度</span>
            </div>
            <div class="tech-stat-item">
              <span class="tech-stat-number">94.5%</span>
              <span class="tech-stat-label">评估准确率</span>
            </div>
            <div class="tech-stat-item">
              <span class="tech-stat-number">&lt; 2s</span>
              <span class="tech-stat-label">分析时间</span>
            </div>
            <div class="tech-stat-item">
              <span class="tech-stat-number">50,000+</span>
              <span class="tech-stat-label">训练样本</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 六维评估模型 -->
    <section class="evaluation-model-section">
      <div class="tech-container">
        <h2 class="section-title">六维评估模型</h2>
        <div class="model-overview">
          <div class="model-diagram">
            <div class="center-node">
              <div class="center-icon">
                <el-icon><TrendCharts /></el-icon>
              </div>
              <h3>综合评估</h3>
            </div>
            <div class="dimension-nodes">
              <div class="dimension-node" v-for="dimension in evaluationDimensions" :key="dimension.id">
                <div class="dimension-icon" :style="{ backgroundColor: dimension.color }">
                  <el-icon><component :is="dimension.icon" /></el-icon>
                </div>
                <h4>{{ dimension.name }}</h4>
                <p>{{ dimension.weight }}%</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="dimensions-detail">
          <div class="dimension-card" v-for="dimension in evaluationDimensions" :key="dimension.id">
            <div class="dimension-header">
              <div class="dimension-icon" :style="{ backgroundColor: dimension.color }">
                <el-icon><component :is="dimension.icon" /></el-icon>
              </div>
              <div class="dimension-info">
                <h3>{{ dimension.name }}</h3>
                <p>{{ dimension.description }}</p>
              </div>
            </div>
            
            <div class="dimension-indicators">
              <h4>评估指标</h4>
              <ul>
                <li v-for="indicator in dimension.indicators" :key="indicator">{{ indicator }}</li>
              </ul>
            </div>
            
            <div class="dimension-algorithm">
              <h4>算法模型</h4>
              <div class="algorithm-info">
                <span class="algorithm-type">{{ dimension.algorithm.type }}</span>
                <span class="algorithm-accuracy">准确率: {{ dimension.algorithm.accuracy }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 机器学习算法架构 -->
    <section class="ml-architecture-section">
      <div class="tech-container">
        <h2 class="section-title">机器学习算法架构</h2>
        <div class="ml-pipeline">
          <div class="pipeline-stage" v-for="stage in mlPipeline" :key="stage.id">
            <div class="stage-icon">
              <el-icon><component :is="stage.icon" /></el-icon>
            </div>
            <h3>{{ stage.name }}</h3>
            <p>{{ stage.description }}</p>
            <div class="stage-details">
              <div class="detail-item" v-for="detail in stage.details" :key="detail.name">
                <span class="detail-name">{{ detail.name }}:</span>
                <span class="detail-value">{{ detail.value }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 算法流程图 -->
    <section class="algorithm-flow-section">
      <div class="tech-container">
        <h2 class="section-title">评估算法流程</h2>
        <div class="flow-diagram">
          <div class="flow-step" v-for="(step, index) in algorithmFlow" :key="step.id">
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-content">
              <h3>{{ step.name }}</h3>
              <p>{{ step.description }}</p>
              <div class="step-tech">
                <el-tag v-for="tech in step.technologies" :key="tech" size="small">{{ tech }}</el-tag>
              </div>
            </div>
            <div v-if="index < algorithmFlow.length - 1" class="flow-arrow">
              <el-icon><ArrowRight /></el-icon>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 性能基准测试 -->
    <section class="performance-section">
      <div class="tech-container">
        <h2 class="section-title">性能基准测试</h2>
        <div class="performance-grid">
          <div class="performance-card" v-for="test in performanceTests" :key="test.id">
            <h3>{{ test.name }}</h3>
            <div class="performance-chart">
              <div class="chart-placeholder">
                <el-icon><DataAnalysis /></el-icon>
                <p>{{ test.description }}</p>
              </div>
            </div>
            <div class="performance-metrics">
              <div class="metric-row" v-for="metric in test.metrics" :key="metric.name">
                <span class="metric-name">{{ metric.name }}</span>
                <div class="metric-bar">
                  <div class="metric-fill" :style="{ width: metric.percentage + '%' }"></div>
                </div>
                <span class="metric-value">{{ metric.value }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- API接口文档 -->
    <section class="api-section">
      <div class="tech-container">
        <h2 class="section-title">评估API接口</h2>
        <div class="api-tabs">
          <el-tabs v-model="activeApiTab" type="border-card">
            <el-tab-pane label="综合评估" name="comprehensive">
              <div class="api-content">
                <h3>综合能力评估</h3>
                <div class="api-endpoint">
                  <span class="method">POST</span>
                  <span class="url">/api/v1/evaluation/comprehensive</span>
                </div>
                
                <h4>请求参数</h4>
                <div class="code-block">
                  <pre><code>{{ comprehensiveApiExample }}</code></pre>
                </div>
                
                <h4>响应示例</h4>
                <div class="code-block">
                  <pre><code>{{ comprehensiveResponseExample }}</code></pre>
                </div>
              </div>
            </el-tab-pane>
            
            <el-tab-pane label="单维度评估" name="single">
              <div class="api-content">
                <h3>单维度能力评估</h3>
                <div class="api-endpoint">
                  <span class="method">POST</span>
                  <span class="url">/api/v1/evaluation/dimension</span>
                </div>
                
                <h4>请求参数</h4>
                <div class="code-block">
                  <pre><code>{{ dimensionApiExample }}</code></pre>
                </div>
                
                <h4>响应示例</h4>
                <div class="code-block">
                  <pre><code>{{ dimensionResponseExample }}</code></pre>
                </div>
              </div>
            </el-tab-pane>
            
            <el-tab-pane label="批量评估" name="batch">
              <div class="api-content">
                <h3>批量评估处理</h3>
                <div class="api-endpoint">
                  <span class="method">POST</span>
                  <span class="url">/api/v1/evaluation/batch</span>
                </div>
                
                <h4>请求参数</h4>
                <div class="code-block">
                  <pre><code>{{ batchApiExample }}</code></pre>
                </div>
                
                <h4>响应示例</h4>
                <div class="code-block">
                  <pre><code>{{ batchResponseExample }}</code></pre>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </section>

    <!-- 返回按钮 -->
    <div class="back-actions">
      <el-button type="primary" @click="goToDemo">
        <el-icon><ArrowLeft /></el-icon>
        返回演示页面
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowLeft, ArrowRight, TrendCharts, DataAnalysis, Cpu, 
  ChatDotRound, Document, Star, Setting, Timer, 
  Connection, Monitor, PieChart
} from '@element-plus/icons-vue'

const router = useRouter()
const activeApiTab = ref('comprehensive')

// 六维评估维度
const evaluationDimensions = reactive([
  {
    id: 1,
    name: '技术能力',
    description: '专业技术知识掌握程度和实际应用能力',
    weight: 25,
    color: '#667eea',
    icon: Cpu,
    indicators: [
      '技术概念理解深度',
      '代码实现能力',
      '问题解决思路',
      '技术选型判断',
      '性能优化意识'
    ],
    algorithm: {
      type: '深度神经网络',
      accuracy: 96.2
    }
  },
  {
    id: 2,
    name: '沟通表达',
    description: '语言表达能力和思路清晰度评估',
    weight: 20,
    color: '#764ba2',
    icon: ChatDotRound,
    indicators: [
      '语言表达清晰度',
      '逻辑结构完整性',
      '专业术语使用准确性',
      '回答完整性',
      '互动沟通效果'
    ],
    algorithm: {
      type: 'BERT语言模型',
      accuracy: 94.8
    }
  },
  {
    id: 3,
    name: '逻辑思维',
    description: '分析问题和逻辑推理能力评估',
    weight: 20,
    color: '#1890ff',
    icon: TrendCharts,
    indicators: [
      '问题分析能力',
      '逻辑推理过程',
      '解决方案设计',
      '因果关系理解',
      '系统性思考'
    ],
    algorithm: {
      type: '图神经网络',
      accuracy: 93.5
    }
  },
  {
    id: 4,
    name: '学习能力',
    description: '学习新知识和适应变化的能力',
    weight: 15,
    color: '#52c41a',
    icon: Document,
    indicators: [
      '知识迁移能力',
      '学习方法论',
      '适应性表现',
      '持续改进意识',
      '自我反思能力'
    ],
    algorithm: {
      type: '强化学习',
      accuracy: 91.7
    }
  },
  {
    id: 5,
    name: '创新能力',
    description: '创新思维和创造性解决问题的能力',
    weight: 10,
    color: '#fa8c16',
    icon: Star,
    indicators: [
      '创新思维表现',
      '解决方案独特性',
      '技术前瞻性',
      '跨领域思考',
      '改进优化建议'
    ],
    algorithm: {
      type: '生成对抗网络',
      accuracy: 89.3
    }
  },
  {
    id: 6,
    name: '团队协作',
    description: '团队合作和协调沟通能力',
    weight: 10,
    color: '#eb2f96',
    icon: Setting,
    indicators: [
      '团队意识表现',
      '协作沟通能力',
      '冲突处理方式',
      '领导力潜质',
      '责任感体现'
    ],
    algorithm: {
      type: '社交网络分析',
      accuracy: 87.9
    }
  }
])

// 机器学习管道
const mlPipeline = reactive([
  {
    id: 1,
    name: '数据预处理',
    description: '文本清洗、分词、特征提取',
    icon: DataAnalysis,
    details: [
      { name: '文本清洗', value: 'NLP预处理' },
      { name: '特征提取', value: 'TF-IDF + Word2Vec' },
      { name: '数据增强', value: '同义词替换' }
    ]
  },
  {
    id: 2,
    name: '特征工程',
    description: '多维特征构建和选择',
    icon: Setting,
    details: [
      { name: '语义特征', value: 'BERT嵌入' },
      { name: '统计特征', value: '词频、句长' },
      { name: '领域特征', value: '专业词汇' }
    ]
  },
  {
    id: 3,
    name: '模型训练',
    description: '多模型集成训练',
    icon: Cpu,
    details: [
      { name: '基础模型', value: 'Transformer' },
      { name: '集成方法', value: 'Stacking' },
      { name: '优化算法', value: 'AdamW' }
    ]
  },
  {
    id: 4,
    name: '评估输出',
    description: '综合评分和建议生成',
    icon: TrendCharts,
    details: [
      { name: '评分融合', value: '加权平均' },
      { name: '置信度', value: '贝叶斯估计' },
      { name: '建议生成', value: '规则引擎' }
    ]
  }
])

// 算法流程
const algorithmFlow = reactive([
  {
    id: 1,
    name: '输入处理',
    description: '接收面试文本和上下文信息',
    technologies: ['文本预处理', 'JSON解析', '数据验证']
  },
  {
    id: 2,
    name: '特征提取',
    description: '提取语义、语法、领域特征',
    technologies: ['BERT', 'Word2Vec', '正则表达式']
  },
  {
    id: 3,
    name: '多维分析',
    description: '并行进行六个维度的能力分析',
    technologies: ['深度学习', '机器学习', '规则引擎']
  },
  {
    id: 4,
    name: '结果融合',
    description: '融合各维度评分生成综合评估',
    technologies: ['集成学习', '权重优化', '置信度计算']
  },
  {
    id: 5,
    name: '输出生成',
    description: '生成评估报告和改进建议',
    technologies: ['模板引擎', '自然语言生成', 'JSON输出']
  }
])

// 性能测试数据
const performanceTests = reactive([
  {
    id: 1,
    name: '准确率测试',
    description: '各维度评估准确率对比',
    metrics: [
      { name: '技术能力', value: '96.2%', percentage: 96.2 },
      { name: '沟通表达', value: '94.8%', percentage: 94.8 },
      { name: '逻辑思维', value: '93.5%', percentage: 93.5 },
      { name: '学习能力', value: '91.7%', percentage: 91.7 },
      { name: '创新能力', value: '89.3%', percentage: 89.3 },
      { name: '团队协作', value: '87.9%', percentage: 87.9 }
    ]
  },
  {
    id: 2,
    name: '性能指标',
    description: '系统性能和效率测试',
    metrics: [
      { name: '响应时间', value: '< 2s', percentage: 95 },
      { name: '并发处理', value: '1000+', percentage: 88 },
      { name: '内存使用', value: '< 512MB', percentage: 92 },
      { name: 'CPU使用率', value: '< 60%', percentage: 85 }
    ]
  }
])

// API示例
const comprehensiveApiExample = `{
  "sessionId": "eval_20241124_001",
  "candidateData": {
    "textResponses": [
      "Vue.js的响应式原理基于Object.defineProperty...",
      "在大型项目中，我会采用模块化架构..."
    ],
    "interviewContext": {
      "domain": "frontend",
      "position": "高级前端工程师",
      "experience": "5年"
    }
  },
  "evaluationConfig": {
    "dimensions": ["all"],
    "detailLevel": "comprehensive",
    "includeRecommendations": true
  }
}`

const comprehensiveResponseExample = `{
  "evaluationId": "eval_20241124_001_result",
  "overallScore": 85.6,
  "dimensionScores": {
    "技术能力": 88.5,
    "沟通表达": 82.3,
    "逻辑思维": 87.1,
    "学习能力": 84.7,
    "创新能力": 81.9,
    "团队协作": 79.2
  },
  "confidenceLevel": 0.92,
  "strengths": ["技术深度扎实", "逻辑思维清晰"],
  "improvements": ["可加强团队协作表达"],
  "recommendations": [
    "建议在回答中更多体现团队合作经验",
    "可以结合具体项目案例说明技术选型"
  ],
  "processingTime": 1.8
}`

const dimensionApiExample = `{
  "sessionId": "eval_20241124_001",
  "dimension": "技术能力",
  "candidateResponse": "Vue.js的响应式原理基于Object.defineProperty...",
  "context": {
    "questionType": "technical_depth",
    "domain": "frontend",
    "difficulty": "intermediate"
  }
}`

const dimensionResponseExample = `{
  "dimension": "技术能力",
  "score": 88.5,
  "confidence": 0.94,
  "indicators": {
    "技术概念理解": 90,
    "代码实现能力": 85,
    "问题解决思路": 92,
    "技术选型判断": 87,
    "性能优化意识": 88
  },
  "evidence": [
    "准确描述了Vue.js响应式原理",
    "提到了Object.defineProperty的使用",
    "展现了对虚拟DOM的理解"
  ],
  "improvements": [
    "可以更详细地解释diff算法",
    "建议补充性能优化的具体实践"
  ]
}`

const batchApiExample = `{
  "batchId": "batch_20241124_001",
  "candidates": [
    {
      "candidateId": "candidate_001",
      "responses": ["回答1", "回答2", "回答3"],
      "profile": { "experience": "3年", "domain": "frontend" }
    },
    {
      "candidateId": "candidate_002",
      "responses": ["回答1", "回答2", "回答3"],
      "profile": { "experience": "5年", "domain": "backend" }
    }
  ],
  "evaluationConfig": {
    "dimensions": ["技术能力", "沟通表达", "逻辑思维"],
    "outputFormat": "detailed"
  }
}`

const batchResponseExample = `{
  "batchId": "batch_20241124_001",
  "processedCount": 2,
  "results": [
    {
      "candidateId": "candidate_001",
      "overallScore": 85.6,
      "dimensionScores": { "技术能力": 88.5, "沟通表达": 82.3 },
      "ranking": 1
    },
    {
      "candidateId": "candidate_002",
      "overallScore": 82.3,
      "dimensionScores": { "技术能力": 85.2, "沟通表达": 79.1 },
      "ranking": 2
    }
  ],
  "batchStatistics": {
    "averageScore": 83.95,
    "topPerformer": "candidate_001",
    "processingTime": 4.2
  }
}`

// 返回演示页面
const goToDemo = () => {
  router.push('/demo')
}

onMounted(() => {
  console.log('AI智能评估技术详情页面已加载')
})
</script>

<style scoped>
.ai-eval-tech-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.tech-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem 0 4rem;
}

.tech-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.breadcrumb {
  margin-bottom: 2rem;
}

.breadcrumb :deep(.el-breadcrumb__item) {
  color: rgba(255, 255, 255, 0.8);
}

.breadcrumb :deep(.el-breadcrumb__item:hover) {
  color: white;
  cursor: pointer;
}

.tech-hero {
  text-align: center;
}

.tech-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.tech-subtitle {
  font-size: 1.25rem;
  margin-bottom: 3rem;
  opacity: 0.9;
}

.tech-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.tech-stat-item {
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.tech-stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.tech-stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

.evaluation-model-section,
.ml-architecture-section,
.algorithm-flow-section,
.performance-section,
.api-section {
  padding: 4rem 0;
}

.section-title {
  font-size: 2.5rem;
  color: #1890ff;
  text-align: center;
  margin-bottom: 3rem;
}

.model-overview {
  margin-bottom: 4rem;
}

.model-diagram {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.center-node {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 2rem;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.center-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.dimension-nodes {
  position: relative;
  width: 100%;
  height: 100%;
}

.dimension-node {
  position: absolute;
  text-align: center;
  background: white;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 2px solid #f0f0f0;
  min-width: 100px;
}

.dimension-node:nth-child(1) { top: 10%; left: 50%; transform: translateX(-50%); }
.dimension-node:nth-child(2) { top: 30%; right: 10%; }
.dimension-node:nth-child(3) { bottom: 30%; right: 10%; }
.dimension-node:nth-child(4) { bottom: 10%; left: 50%; transform: translateX(-50%); }
.dimension-node:nth-child(5) { bottom: 30%; left: 10%; }
.dimension-node:nth-child(6) { top: 30%; left: 10%; }

.dimension-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin: 0 auto 0.5rem;
  font-size: 1.2rem;
}

.dimension-node h4 {
  color: #333;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.dimension-node p {
  color: #666;
  font-size: 0.8rem;
  margin: 0;
}

.dimensions-detail {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.dimension-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.dimension-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.dimension-header .dimension-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  margin-right: 1.5rem;
  flex-shrink: 0;
  font-size: 1.5rem;
}

.dimension-info h3 {
  color: #1890ff;
  margin-bottom: 0.5rem;
}

.dimension-indicators,
.dimension-algorithm {
  margin-bottom: 1.5rem;
}

.dimension-indicators h4,
.dimension-algorithm h4 {
  color: #333;
  margin-bottom: 1rem;
}

.dimension-indicators ul {
  list-style: none;
  padding: 0;
}

.dimension-indicators li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
  padding-left: 1.5rem;
}

.dimension-indicators li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #1890ff;
  font-weight: bold;
}

.algorithm-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 6px;
}

.algorithm-type {
  color: #1890ff;
  font-weight: 600;
}

.algorithm-accuracy {
  color: #52c41a;
  font-weight: 600;
}

.ml-pipeline {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.pipeline-stage {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stage-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  margin: 0 auto 1.5rem;
}

.stage-details {
  margin-top: 1.5rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-name {
  color: #666;
}

.detail-value {
  color: #1890ff;
  font-weight: 600;
}

.flow-diagram {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
  background: white;
  border-radius: 12px;
  padding: 3rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.flow-step {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.step-number {
  width: 40px;
  height: 40px;
  background: #1890ff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
}

.step-content {
  max-width: 200px;
}

.step-content h3 {
  color: #1890ff;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.step-content p {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.step-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.flow-arrow {
  color: #1890ff;
  font-size: 1.5rem;
}

.performance-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.performance-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.performance-card h3 {
  color: #1890ff;
  margin-bottom: 1rem;
}

.performance-chart {
  margin: 2rem 0;
}

.chart-placeholder {
  text-align: center;
  padding: 2rem;
  background: #f8fafc;
  border-radius: 8px;
  color: #666;
}

.chart-placeholder .el-icon {
  font-size: 3rem;
  color: #1890ff;
  margin-bottom: 1rem;
}

.performance-metrics {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.metric-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.metric-name {
  min-width: 80px;
  color: #666;
  font-size: 0.9rem;
}

.metric-bar {
  flex: 1;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.metric-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: width 0.3s ease;
}

.metric-value {
  min-width: 60px;
  text-align: right;
  color: #1890ff;
  font-weight: 600;
  font-size: 0.9rem;
}

.api-content {
  padding: 1rem 0;
}

.api-endpoint {
  margin: 1rem 0;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.method {
  background: #52c41a;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.875rem;
}

.url {
  font-family: 'Courier New', monospace;
  color: #1890ff;
  font-weight: 600;
}

.code-block {
  background: #2d3748;
  color: #e2e8f0;
  padding: 1.5rem;
  border-radius: 8px;
  margin: 1rem 0;
  overflow-x: auto;
}

.code-block pre {
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
}

.back-actions {
  text-align: center;
  padding: 2rem 0;
}

@media (max-width: 768px) {
  .tech-title {
    font-size: 2rem;
  }

  .tech-stats {
    grid-template-columns: 1fr;
  }

  .dimensions-detail,
  .ml-pipeline,
  .performance-grid {
    grid-template-columns: 1fr;
  }

  .flow-diagram {
    flex-direction: column;
  }

  .flow-arrow {
    transform: rotate(90deg);
  }

  .dimension-nodes .dimension-node {
    position: static;
    transform: none;
    margin-bottom: 1rem;
  }

  .model-diagram {
    flex-direction: column;
    min-height: auto;
  }

  .center-node {
    position: static;
    transform: none;
    margin-bottom: 2rem;
  }
}
</style>
