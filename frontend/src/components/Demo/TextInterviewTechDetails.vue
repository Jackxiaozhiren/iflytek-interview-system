<template>
  <div class="tech-details-page">
    <!-- 页面头部 -->
    <div class="tech-header">
      <div class="tech-container">
        <div class="breadcrumb">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item @click="goToDemo">产品演示</el-breadcrumb-item>
            <el-breadcrumb-item>智能文本面试</el-breadcrumb-item>
            <el-breadcrumb-item>技术详情</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        
        <div class="tech-hero">
          <h1 class="tech-title">智能文本面试技术详情</h1>
          <p class="tech-subtitle">基于iFlytek Spark大模型的智能对话面试系统技术架构与实现</p>
          
          <div class="tech-stats">
            <div class="tech-stat-item">
              <span class="tech-stat-number">iFlytek Spark 3.5</span>
              <span class="tech-stat-label">AI模型版本</span>
            </div>
            <div class="tech-stat-item">
              <span class="tech-stat-number">&lt; 500ms</span>
              <span class="tech-stat-label">响应时间</span>
            </div>
            <div class="tech-stat-item">
              <span class="tech-stat-number">96.2%</span>
              <span class="tech-stat-label">语义理解准确率</span>
            </div>
            <div class="tech-stat-item">
              <span class="tech-stat-number">10,000+</span>
              <span class="tech-stat-label">并发支持</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 技术架构图 -->
    <section class="architecture-section">
      <div class="tech-container">
        <h2 class="section-title">技术架构</h2>
        <div class="architecture-diagram">
          <div class="architecture-layer" v-for="layer in architectureLayers" :key="layer.id">
            <div class="layer-header">
              <h3>{{ layer.name }}</h3>
              <p>{{ layer.description }}</p>
            </div>
            <div class="layer-components">
              <div class="component-card" v-for="component in layer.components" :key="component.name">
                <div class="component-icon">
                  <el-icon><component :is="component.icon" /></el-icon>
                </div>
                <h4>{{ component.name }}</h4>
                <p>{{ component.description }}</p>
                <div class="component-tech">
                  <el-tag v-for="tech in component.technologies" :key="tech" size="small">{{ tech }}</el-tag>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 核心功能模块 -->
    <section class="features-section">
      <div class="tech-container">
        <h2 class="section-title">核心功能模块</h2>
        <div class="features-grid">
          <div class="feature-detail-card" v-for="feature in coreFeatures" :key="feature.id">
            <div class="feature-header">
              <div class="feature-icon">
                <el-icon><component :is="feature.icon" /></el-icon>
              </div>
              <div class="feature-info">
                <h3>{{ feature.name }}</h3>
                <p>{{ feature.description }}</p>
              </div>
            </div>
            
            <div class="feature-specs">
              <h4>技术规格</h4>
              <ul>
                <li v-for="spec in feature.specifications" :key="spec">{{ spec }}</li>
              </ul>
            </div>
            
            <div class="feature-performance">
              <h4>性能指标</h4>
              <div class="performance-metrics">
                <div class="metric" v-for="metric in feature.metrics" :key="metric.name">
                  <span class="metric-name">{{ metric.name }}</span>
                  <span class="metric-value">{{ metric.value }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- API接口文档 -->
    <section class="api-section">
      <div class="tech-container">
        <h2 class="section-title">API接口文档</h2>
        <div class="api-tabs">
          <el-tabs v-model="activeApiTab" type="border-card">
            <el-tab-pane label="会话初始化" name="init">
              <div class="api-content">
                <h3>初始化面试会话</h3>
                <div class="api-endpoint">
                  <span class="method">POST</span>
                  <span class="url">/api/v1/interview/initialize</span>
                </div>
                
                <h4>请求参数</h4>
                <div class="code-block">
                  <pre><code>{{ initApiExample }}</code></pre>
                </div>
                
                <h4>响应示例</h4>
                <div class="code-block">
                  <pre><code>{{ initResponseExample }}</code></pre>
                </div>
              </div>
            </el-tab-pane>
            
            <el-tab-pane label="问题生成" name="question">
              <div class="api-content">
                <h3>智能问题生成</h3>
                <div class="api-endpoint">
                  <span class="method">POST</span>
                  <span class="url">/api/v1/interview/generate-question</span>
                </div>
                
                <h4>请求参数</h4>
                <div class="code-block">
                  <pre><code>{{ questionApiExample }}</code></pre>
                </div>
                
                <h4>响应示例</h4>
                <div class="code-block">
                  <pre><code>{{ questionResponseExample }}</code></pre>
                </div>
              </div>
            </el-tab-pane>
            
            <el-tab-pane label="文本分析" name="analysis">
              <div class="api-content">
                <h3>文本语义分析</h3>
                <div class="api-endpoint">
                  <span class="method">POST</span>
                  <span class="url">/api/v1/interview/analyze-text</span>
                </div>
                
                <h4>请求参数</h4>
                <div class="code-block">
                  <pre><code>{{ analysisApiExample }}</code></pre>
                </div>
                
                <h4>响应示例</h4>
                <div class="code-block">
                  <pre><code>{{ analysisResponseExample }}</code></pre>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </section>

    <!-- 常见问题解答 -->
    <section class="faq-section">
      <div class="tech-container">
        <h2 class="section-title">常见问题解答</h2>
        <div class="faq-list">
          <el-collapse v-model="activeFaq">
            <el-collapse-item v-for="faq in faqs" :key="faq.id" :title="faq.question" :name="faq.id">
              <div class="faq-answer">
                <p>{{ faq.answer }}</p>
              </div>
            </el-collapse-item>
          </el-collapse>
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
  ArrowLeft, Cpu, TrendCharts, ChatDotRound, Document, 
  Setting, DataAnalysis, Connection, Monitor
} from '@element-plus/icons-vue'

const router = useRouter()
const activeApiTab = ref('init')
const activeFaq = ref(['1'])

// 技术架构层次
const architectureLayers = reactive([
  {
    id: 1,
    name: '前端展示层',
    description: '用户交互界面和实时通信',
    components: [
      {
        name: 'Vue.js 3 应用',
        description: '响应式用户界面',
        icon: Monitor,
        technologies: ['Vue.js 3', 'Element Plus', 'WebSocket']
      },
      {
        name: '实时通信模块',
        description: '双向数据传输',
        icon: Connection,
        technologies: ['WebSocket', 'Socket.io', 'HTTP/2']
      }
    ]
  },
  {
    id: 2,
    name: '业务逻辑层',
    description: '面试流程控制和智能决策',
    components: [
      {
        name: '面试引擎',
        description: '面试流程管理',
        icon: Setting,
        technologies: ['Node.js', 'Express', 'Redis']
      },
      {
        name: '智能决策模块',
        description: '自适应问题生成',
        icon: Cpu,
        technologies: ['机器学习', '规则引擎', '决策树']
      }
    ]
  },
  {
    id: 3,
    name: 'AI服务层',
    description: 'iFlytek Spark大模型集成',
    components: [
      {
        name: 'iFlytek Spark LLM',
        description: '大语言模型服务',
        icon: DataAnalysis,
        technologies: ['iFlytek Spark 3.5', 'NLP', '中文优化']
      },
      {
        name: '语义分析引擎',
        description: '文本理解和分析',
        icon: TrendCharts,
        technologies: ['语义分析', '情感分析', '关键词提取']
      }
    ]
  }
])

// 核心功能模块
const coreFeatures = reactive([
  {
    id: 1,
    name: 'iFlytek Spark LLM集成',
    description: '基于讯飞星火大模型的智能对话系统',
    icon: Cpu,
    specifications: [
      '支持iFlytek Spark 3.5最新版本',
      '中文语言深度优化',
      '上下文理解长度：8K tokens',
      '支持流式响应和批量处理',
      '企业级安全认证'
    ],
    metrics: [
      { name: '响应时间', value: '< 500ms' },
      { name: '准确率', value: '96.2%' },
      { name: '并发支持', value: '10,000+' },
      { name: '可用性', value: '99.9%' }
    ]
  }
])

// API示例代码（简化版本）
const initApiExample = '{\n  "candidateProfile": {\n    "name": "张三",\n    "experience": "3年前端开发经验",\n    "skills": ["Vue.js", "JavaScript", "Python"],\n    "position": "前端工程师"\n  },\n  "interviewType": "technical",\n  "domain": "frontend",\n  "difficulty": "intermediate"\n}'

const initResponseExample = '{\n  "sessionId": "interview_20241124_001",\n  "status": "initialized",\n  "aiInterviewer": {\n    "personality": "professional_technical",\n    "adaptiveLevel": "intermediate"\n  },\n  "estimatedDuration": "20-25分钟",\n  "totalQuestions": 8\n}'

const questionApiExample = '{\n  "sessionId": "interview_20241124_001",\n  "context": {\n    "questionNumber": 2,\n    "previousAnswers": ["..."],\n    "currentDifficulty": "intermediate",\n    "domain": "frontend"\n  }\n}'

const questionResponseExample = '{\n  "question": "请描述Vue.js的响应式原理，并说明如何优化大型应用的性能？",\n  "type": "technical_depth",\n  "difficulty": "intermediate",\n  "expectedKeywords": ["响应式", "虚拟DOM", "性能优化"],\n  "timeEstimate": "3-5分钟"\n}'

const analysisApiExample = '{\n  "sessionId": "interview_20241124_001",\n  "text": "Vue.js的响应式原理基于Object.defineProperty...",\n  "domain": "frontend",\n  "analysisType": "comprehensive"\n}'

const analysisResponseExample = '{\n  "overallScore": 85,\n  "technicalAccuracy": 88,\n  "communicationClarity": 82,\n  "keywordMatching": 90,\n  "recommendations": ["可以更详细地解释虚拟DOM的diff算法"],\n  "nextQuestionSuggestion": "深入探讨组件通信机制"\n}'

// FAQ数据
const faqs = reactive([
  {
    id: '1',
    question: '如何集成iFlytek Spark智能面试系统？',
    answer: '集成iFlytek Spark智能面试系统非常简单。首先需要申请API密钥，然后安装我们的SDK，最后按照文档进行配置即可。整个过程通常只需要30分钟。'
  },
  {
    id: '2',
    question: '系统支持哪些编程语言和框架？',
    answer: '我们提供多种语言的SDK支持，包括JavaScript/Node.js、Python、Java、Go等。前端支持Vue.js、React、Angular等主流框架。'
  },
  {
    id: '3',
    question: '如何自定义面试问题和评估标准？',
    answer: '系统提供灵活的配置选项，您可以通过管理后台或API配置自定义问题库、评估维度权重、难度等级等。同时支持导入企业特定的问题模板。'
  },
  {
    id: '4',
    question: '系统的安全性如何保障？',
    answer: '我们采用企业级安全标准，包括数据加密传输、访问权限控制、审计日志、防作弊检测等多重安全机制，确保面试数据的安全性和隐私保护。'
  },
  {
    id: '5',
    question: '如何处理大规模并发面试？',
    answer: '系统支持水平扩展，可以处理10,000+并发面试。采用分布式架构、负载均衡、缓存优化等技术，确保在高并发场景下的稳定性能。'
  }
])

// 返回演示页面
const goToDemo = () => {
  router.push('/demo')
}

onMounted(() => {
  console.log('智能文本面试技术详情页面已加载')
})
</script>

<style scoped>
.tech-details-page {
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

.architecture-section,
.features-section,
.api-section,
.faq-section {
  padding: 4rem 0;
}

.section-title {
  font-size: 2.5rem;
  color: #1890ff;
  text-align: center;
  margin-bottom: 3rem;
}

.architecture-diagram {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.architecture-layer {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.layer-header h3 {
  color: #1890ff;
  margin-bottom: 0.5rem;
}

.layer-components {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.component-card {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #1890ff;
}

.component-icon {
  width: 40px;
  height: 40px;
  background: #1890ff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.component-tech {
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 2rem;
}

.feature-detail-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.feature-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.feature-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  margin-right: 1.5rem;
  flex-shrink: 0;
}

.feature-info h3 {
  color: #1890ff;
  margin-bottom: 0.5rem;
}

.feature-specs,
.feature-performance {
  margin-bottom: 1.5rem;
}

.feature-specs h4,
.feature-performance h4 {
  color: #333;
  margin-bottom: 1rem;
}

.feature-specs ul {
  list-style: none;
  padding: 0;
}

.feature-specs li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
  padding-left: 1.5rem;
}

.feature-specs li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #52c41a;
  font-weight: bold;
}

.performance-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.metric {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 6px;
}

.metric-name {
  color: #666;
}

.metric-value {
  color: #1890ff;
  font-weight: 600;
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

.faq-answer {
  padding: 1rem 0;
  color: #666;
  line-height: 1.6;
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

  .features-grid {
    grid-template-columns: 1fr;
  }

  .feature-header {
    flex-direction: column;
    text-align: center;
  }

  .feature-icon {
    margin: 0 auto 1rem;
  }
}
</style>
