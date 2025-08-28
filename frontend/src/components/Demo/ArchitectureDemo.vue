<template>
  <div class="architecture-demo">
    <!-- 架构演示头部 -->
    <div class="architecture-header" data-aos="fade-up">
      <h2>
        <el-icon><Setting /></el-icon>
        系统技术架构
      </h2>
      <p>深入了解多模态面试评估系统的技术实现和iFlytek Spark LLM集成方案</p>
    </div>

    <!-- 架构概览 -->
    <div class="architecture-overview" data-aos="fade-up" data-aos-delay="200">
      <div class="overview-card">
        <h3>
          <el-icon><Cpu /></el-icon>
          核心技术架构
        </h3>
        <div class="architecture-diagram" ref="architectureDiagram">
          <!-- 架构图将通过JavaScript动态生成 -->
        </div>
        <div class="architecture-legend">
          <div class="legend-section">
            <h4>技术层级</h4>
            <div class="legend-items">
              <div class="legend-item" v-for="layer in architectureLayers" :key="layer.name">
                <div class="legend-color" :style="{ background: layer.color }"></div>
                <span>{{ layer.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- iFlytek Spark LLM集成 -->
    <div class="spark-integration" data-aos="fade-up" data-aos-delay="400">
      <h3>
        <el-icon><Star /></el-icon>
        iFlytek Spark LLM 智能引擎
      </h3>
      
      <div class="integration-content">
        <div class="spark-overview">
          <div class="spark-logo">
            <img src="/images/iflytek-spark-logo.png" alt="iFlytek Spark" />
          </div>
          <div class="spark-info">
            <h4>讯飞星火认知大模型 V3.5</h4>
            <p>基于讯飞星火认知大模型的多模态智能分析引擎，提供业界领先的自然语言理解和生成能力。</p>
            <div class="spark-features">
              <div class="feature-item" v-for="feature in sparkFeatures" :key="feature.name">
                <el-icon><component :is="feature.icon" /></el-icon>
                <div class="feature-content">
                  <h5>{{ feature.name }}</h5>
                  <p>{{ feature.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- API集成流程 -->
        <div class="api-integration">
          <h4>API集成流程</h4>
          <div class="integration-flow">
            <div class="flow-step" v-for="(step, index) in integrationSteps" :key="index">
              <div class="step-number">{{ index + 1 }}</div>
              <div class="step-content">
                <h5>{{ step.title }}</h5>
                <p>{{ step.description }}</p>
                <div class="step-code" v-if="step.code">
                  <pre><code>{{ step.code }}</code></pre>
                </div>
              </div>
              <div class="step-arrow" v-if="index < integrationSteps.length - 1">
                <el-icon><ArrowRight /></el-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 技术栈详情 -->
    <div class="tech-stack" data-aos="fade-up" data-aos-delay="600">
      <h3>
        <el-icon><Grid /></el-icon>
        完整技术栈
      </h3>
      
      <div class="stack-categories">
        <el-tabs v-model="activeStackTab" @tab-click="handleStackTabClick">
          <el-tab-pane label="前端技术" name="frontend">
            <div class="tech-grid">
              <div class="tech-card" v-for="tech in frontendTech" :key="tech.name">
                <div class="tech-icon">
                  <img :src="tech.logo" :alt="tech.name" />
                </div>
                <div class="tech-info">
                  <h4>{{ tech.name }}</h4>
                  <p>{{ tech.description }}</p>
                  <div class="tech-version">版本: {{ tech.version }}</div>
                  <div class="tech-purpose">用途: {{ tech.purpose }}</div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="后端技术" name="backend">
            <div class="tech-grid">
              <div class="tech-card" v-for="tech in backendTech" :key="tech.name">
                <div class="tech-icon">
                  <img :src="tech.logo" :alt="tech.name" />
                </div>
                <div class="tech-info">
                  <h4>{{ tech.name }}</h4>
                  <p>{{ tech.description }}</p>
                  <div class="tech-version">版本: {{ tech.version }}</div>
                  <div class="tech-purpose">用途: {{ tech.purpose }}</div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="AI技术" name="ai">
            <div class="tech-grid">
              <div class="tech-card" v-for="tech in aiTech" :key="tech.name">
                <div class="tech-icon">
                  <img :src="tech.logo" :alt="tech.name" />
                </div>
                <div class="tech-info">
                  <h4>{{ tech.name }}</h4>
                  <p>{{ tech.description }}</p>
                  <div class="tech-version">版本: {{ tech.version }}</div>
                  <div class="tech-purpose">用途: {{ tech.purpose }}</div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="基础设施" name="infrastructure">
            <div class="tech-grid">
              <div class="tech-card" v-for="tech in infrastructureTech" :key="tech.name">
                <div class="tech-icon">
                  <img :src="tech.logo" :alt="tech.name" />
                </div>
                <div class="tech-info">
                  <h4>{{ tech.name }}</h4>
                  <p>{{ tech.description }}</p>
                  <div class="tech-version">版本: {{ tech.version }}</div>
                  <div class="tech-purpose">用途: {{ tech.purpose }}</div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <!-- 数据流程图 -->
    <div class="data-flow" data-aos="fade-up" data-aos-delay="800">
      <h3>
        <el-icon><ArrowRight /></el-icon>
        多模态数据处理流程
      </h3>
      
      <div class="flow-diagram">
        <div class="flow-container" ref="dataFlowDiagram">
          <!-- 数据流程图将通过JavaScript动态生成 -->
        </div>
        
        <div class="flow-description">
          <h4>处理流程说明</h4>
          <div class="process-steps">
            <div class="process-step" v-for="(step, index) in dataProcessSteps" :key="index">
              <div class="step-icon" :style="{ background: step.color }">
                <el-icon><component :is="step.icon" /></el-icon>
              </div>
              <div class="step-details">
                <h5>{{ step.title }}</h5>
                <p>{{ step.description }}</p>
                <div class="step-tech">
                  <span v-for="tech in step.technologies" :key="tech" class="tech-tag">
                    {{ tech }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 性能指标 -->
    <div class="performance-metrics" data-aos="fade-up" data-aos-delay="1000">
      <h3>
        <el-icon><TrendCharts /></el-icon>
        系统性能指标
      </h3>
      
      <div class="metrics-grid">
        <div class="metric-card" v-for="metric in performanceMetrics" :key="metric.name">
          <div class="metric-icon" :style="{ background: metric.color }">
            <el-icon><component :is="metric.icon" /></el-icon>
          </div>
          <div class="metric-content">
            <h4>{{ metric.name }}</h4>
            <div class="metric-value">{{ metric.value }}</div>
            <div class="metric-description">{{ metric.description }}</div>
            <div class="metric-benchmark">
              <span class="benchmark-label">行业基准:</span>
              <span class="benchmark-value">{{ metric.benchmark }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 部署架构 -->
    <div class="deployment-architecture" data-aos="fade-up" data-aos-delay="1200">
      <h3>
        <el-icon><TrendCharts /></el-icon>
        部署架构方案
      </h3>
      
      <div class="deployment-options">
        <div class="deployment-option" v-for="option in deploymentOptions" :key="option.name">
          <div class="option-header">
            <h4>{{ option.name }}</h4>
            <el-tag :type="option.recommended ? 'success' : 'info'">
              {{ option.recommended ? '推荐' : '可选' }}
            </el-tag>
          </div>
          <div class="option-content">
            <p>{{ option.description }}</p>
            <div class="option-features">
              <h5>特性优势:</h5>
              <ul>
                <li v-for="feature in option.features" :key="feature">{{ feature }}</li>
              </ul>
            </div>
            <div class="option-specs">
              <h5>技术规格:</h5>
              <div class="spec-grid">
                <div class="spec-item" v-for="(value, key) in option.specs" :key="key">
                  <span class="spec-label">{{ getSpecLabel(key) }}:</span>
                  <span class="spec-value">{{ value }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 开发指南 -->
    <div class="development-guide" data-aos="fade-up" data-aos-delay="1400">
      <h3>
        <el-icon><Document /></el-icon>
        开发集成指南
      </h3>
      
      <div class="guide-content">
        <div class="guide-section">
          <h4>快速开始</h4>
          <div class="code-example">
            <h5>1. 安装依赖</h5>
            <pre><code>npm install @iflytek/spark-sdk
pip install iflytek-spark-python</code></pre>
          </div>
          <div class="code-example">
            <h5>2. 初始化配置</h5>
            <pre><code>import { SparkAPI } from '@iflytek/spark-sdk'

const spark = new SparkAPI({
  appId: 'your-app-id',
  apiKey: 'your-api-key',
  apiSecret: 'your-api-secret'
})</code></pre>
          </div>
          <div class="code-example">
            <h5>3. 调用分析接口</h5>
            <pre><code>const result = await spark.analyze({
  text: '用户回答内容',
  audio: audioBlob,
  video: videoBlob,
  mode: 'multimodal'
})</code></pre>
          </div>
        </div>
        
        <div class="guide-links">
          <h4>相关资源</h4>
          <div class="resource-links">
            <el-button type="primary" @click="openDocumentation">
              <el-icon><Document /></el-icon>
              API文档
            </el-button>
            <el-button @click="openSDK">
              <el-icon><ArrowDown /></el-icon>
              SDK下载
            </el-button>
            <el-button @click="openExamples">
              <el-icon><View /></el-icon>
              示例代码
            </el-button>
            <el-button @click="openSupport">
              <el-icon><Setting /></el-icon>
              技术支持
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, markRaw } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Setting, Cpu, Star, Grid, ArrowRight, TrendCharts,
  Document, ArrowDown, View, VideoCamera,
  Timer
} from '@element-plus/icons-vue'

const activeStackTab = ref('frontend')
const architectureDiagram = ref(null)
const dataFlowDiagram = ref(null)

// 架构层级
const architectureLayers = ref([
  { name: '用户界面层', color: '#409EFF' },
  { name: '业务逻辑层', color: '#67C23A' },
  { name: 'AI服务层', color: '#E6A23C' },
  { name: '数据存储层', color: '#F56C6C' },
  { name: '基础设施层', color: '#909399' }
])

// iFlytek Spark特性
const sparkFeatures = ref([
  {
    name: '多模态理解',
    description: '支持文本、语音、图像的综合理解和分析',
    icon: 'DataBoard'
  },
  {
    name: '实时响应',
    description: '毫秒级响应速度，支持实时交互和分析',
    icon: 'Timer'
  },
  {
    name: '智能评估',
    description: '基于深度学习的智能评估和打分算法',
    icon: 'TrendCharts'
  },
  {
    name: '个性化适配',
    description: '根据不同领域和岗位进行个性化调优',
    icon: 'Setting'
  }
])

// API集成步骤
const integrationSteps = ref([
  {
    title: '身份认证',
    description: '使用API密钥进行身份验证',
    code: `const auth = {
  appId: 'your-app-id',
  apiKey: 'your-api-key',
  apiSecret: 'your-api-secret'
}`
  },
  {
    title: '数据预处理',
    description: '对多模态输入数据进行格式化和预处理',
    code: `const processedData = {
  text: preprocessText(userInput),
  audio: encodeAudio(audioBlob),
  video: extractFrames(videoBlob)
}`
  },
  {
    title: 'API调用',
    description: '调用iFlytek Spark API进行智能分析',
    code: `const result = await spark.analyze({
  data: processedData,
  domain: 'technical_interview',
  mode: 'comprehensive'
})`
  },
  {
    title: '结果处理',
    description: '解析API响应并生成评估报告',
    code: `const report = {
  overallScore: result.score,
  capabilities: result.capabilities,
  suggestions: result.suggestions
}`
  }
])

// 前端技术栈
const frontendTech = ref([
  {
    name: 'Vue.js 3',
    version: '3.3.4',
    description: '现代化的渐进式JavaScript框架',
    purpose: '构建响应式用户界面',
    logo: 'https://vuejs.org/images/logo.png'
  },
  {
    name: 'Element Plus',
    version: '2.3.8',
    description: '基于Vue 3的组件库',
    purpose: '提供丰富的UI组件',
    logo: 'https://element-plus.org/images/element-plus-logo.svg'
  },
  {
    name: 'TypeScript',
    version: '5.1.6',
    description: 'JavaScript的超集，提供静态类型检查',
    purpose: '提高代码质量和开发效率',
    logo: 'https://www.typescriptlang.org/favicon-32x32.png'
  },
  {
    name: 'Vite',
    version: '4.4.5',
    description: '下一代前端构建工具',
    purpose: '快速开发和构建',
    logo: 'https://vitejs.dev/logo.svg'
  }
])

// 后端技术栈
const backendTech = ref([
  {
    name: 'FastAPI',
    version: '0.103.0',
    description: '现代、快速的Python Web框架',
    purpose: '构建高性能API服务',
    logo: 'https://fastapi.tiangolo.com/img/logo-margin/logo-teal.png'
  },
  {
    name: 'Python',
    version: '3.11',
    description: '高级编程语言',
    purpose: '后端逻辑和AI集成',
    logo: 'https://www.python.org/static/favicon.ico'
  },
  {
    name: 'SQLAlchemy',
    version: '2.0.19',
    description: 'Python SQL工具包和ORM',
    purpose: '数据库操作和管理',
    logo: 'https://www.sqlalchemy.org/img/sqla_logo.png'
  },
  {
    name: 'Redis',
    version: '7.0',
    description: '内存数据结构存储',
    purpose: '缓存和会话管理',
    logo: 'https://redis.io/images/redis-white.png'
  }
])

// AI技术栈
const aiTech = ref([
  {
    name: 'iFlytek Spark',
    version: 'V3.5',
    description: '讯飞星火认知大模型',
    purpose: '多模态智能分析',
    logo: '/images/iflytek-logo.svg'
  },
  {
    name: 'OpenCV',
    version: '4.8.0',
    description: '计算机视觉库',
    purpose: '视频和图像处理',
    logo: 'https://opencv.org/wp-content/uploads/2020/07/cropped-OpenCV_logo_white_600x.png'
  },
  {
    name: 'librosa',
    version: '0.10.1',
    description: '音频分析库',
    purpose: '语音特征提取',
    logo: 'https://librosa.org/doc/latest/_static/librosa_logo_text.svg'
  },
  {
    name: 'scikit-learn',
    version: '1.3.0',
    description: '机器学习库',
    purpose: '特征工程和模型训练',
    logo: 'https://scikit-learn.org/stable/_static/scikit-learn-logo-small.png'
  }
])

// 基础设施技术
const infrastructureTech = ref([
  {
    name: 'Docker',
    version: '24.0.5',
    description: '容器化平台',
    purpose: '应用部署和管理',
    logo: 'https://www.docker.com/wp-content/uploads/2022/03/Moby-logo.png'
  },
  {
    name: 'Nginx',
    version: '1.25.1',
    description: '高性能Web服务器',
    purpose: '反向代理和负载均衡',
    logo: 'https://nginx.org/nginx.png'
  },
  {
    name: 'PostgreSQL',
    version: '15.3',
    description: '开源关系型数据库',
    purpose: '数据持久化存储',
    logo: 'https://www.postgresql.org/media/img/about/press/elephant.png'
  },
  {
    name: 'Kubernetes',
    version: '1.27.3',
    description: '容器编排平台',
    purpose: '集群管理和自动化部署',
    logo: 'https://kubernetes.io/images/kubernetes-horizontal-color.png'
  }
])

// 数据处理步骤
const dataProcessSteps = ref([
  {
    title: '数据采集',
    description: '收集用户的文本、语音、视频输入数据',
    icon: 'VideoCamera',
    color: '#409EFF',
    technologies: ['WebRTC', 'MediaRecorder API', 'File Upload']
  },
  {
    title: '预处理',
    description: '对原始数据进行清洗、格式化和特征提取',
    icon: 'Setting',
    color: '#67C23A',
    technologies: ['OpenCV', 'librosa', 'NLTK']
  },
  {
    title: 'AI分析',
    description: '使用iFlytek Spark进行多模态智能分析',
    icon: 'Cpu',
    color: '#E6A23C',
    technologies: ['iFlytek Spark', 'Transformer', 'CNN']
  },
  {
    title: '结果生成',
    description: '生成评估报告和个性化建议',
    icon: 'Document',
    color: '#F56C6C',
    technologies: ['报告模板', '数据可视化', 'PDF生成']
  }
])

// 性能指标
const performanceMetrics = ref([
  {
    name: '响应时间',
    value: '< 500ms',
    description: 'API平均响应时间',
    benchmark: '< 1000ms',
    color: '#409EFF',
    icon: 'Timer'
  },
  {
    name: '准确率',
    value: '95.8%',
    description: '评估结果准确率',
    benchmark: '90%',
    color: '#67C23A',
    icon: 'TrendCharts'
  },
  {
    name: '并发用户',
    value: '1000+',
    description: '支持同时在线用户数',
    benchmark: '500',
    color: '#E6A23C',
    icon: 'TrendCharts'
  },
  {
    name: '可用性',
    value: '99.9%',
    description: '系统可用性保证',
    benchmark: '99.5%',
    color: '#F56C6C',
    icon: 'Setting'
  }
])

// 部署选项
const deploymentOptions = ref([
  {
    name: '云端部署',
    recommended: true,
    description: '基于云服务的弹性部署方案，支持自动扩缩容和高可用性',
    features: [
      '弹性伸缩，按需付费',
      '全球CDN加速',
      '自动备份和恢复',
      '7x24小时监控'
    ],
    specs: {
      cpu: '2-16核',
      memory: '4-64GB',
      storage: '100GB-10TB',
      bandwidth: '100Mbps-10Gbps'
    }
  },
  {
    name: '本地化部署',
    recommended: false,
    description: '企业内网部署方案，确保数据安全和合规性要求',
    features: [
      '数据完全本地化',
      '自主可控',
      '定制化配置',
      '专属技术支持'
    ],
    specs: {
      cpu: '8-32核',
      memory: '16-128GB',
      storage: '1TB-50TB',
      bandwidth: '1Gbps-10Gbps'
    }
  },
  {
    name: '混合部署',
    recommended: false,
    description: '云端和本地相结合的混合部署方案',
    features: [
      '灵活的数据分布',
      '成本优化',
      '渐进式迁移',
      '多环境管理'
    ],
    specs: {
      cpu: '4-24核',
      memory: '8-96GB',
      storage: '500GB-20TB',
      bandwidth: '500Mbps-5Gbps'
    }
  }
])

const handleStackTabClick = (tab) => {
  console.log('切换技术栈标签:', tab.name)
}

const getSpecLabel = (key) => {
  const labelMap = {
    cpu: 'CPU',
    memory: '内存',
    storage: '存储',
    bandwidth: '带宽'
  }
  return labelMap[key] || key
}

const openDocumentation = () => {
  ElMessage.info('打开API文档')
}

const openSDK = () => {
  ElMessage.info('下载SDK')
}

const openExamples = () => {
  ElMessage.info('查看示例代码')
}

const openSupport = () => {
  ElMessage.info('联系技术支持')
}

// 绘制架构图
const drawArchitectureDiagram = () => {
  if (!architectureDiagram.value) return

  const canvas = document.createElement('canvas')
  canvas.width = 800
  canvas.height = 500
  architectureDiagram.value.innerHTML = ''
  architectureDiagram.value.appendChild(canvas)

  const ctx = canvas.getContext('2d')

  // 绘制架构层级
  const layerHeight = 80
  const layerSpacing = 10
  const startY = 50

  architectureLayers.value.forEach((layer, index) => {
    const y = startY + index * (layerHeight + layerSpacing)

    // 绘制层级矩形
    ctx.fillStyle = layer.color
    ctx.fillRect(50, y, 700, layerHeight)

    // 绘制层级文字
    ctx.fillStyle = 'white'
    ctx.font = 'bold 16px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(layer.name, 400, y + layerHeight / 2 + 6)
  })

  // 绘制连接线
  ctx.strokeStyle = '#ddd'
  ctx.lineWidth = 2
  for (let i = 0; i < architectureLayers.value.length - 1; i++) {
    const y = startY + (i + 1) * (layerHeight + layerSpacing) - layerSpacing / 2
    ctx.beginPath()
    ctx.moveTo(100, y)
    ctx.lineTo(700, y)
    ctx.stroke()
  }
}

// 绘制数据流程图
const drawDataFlowDiagram = () => {
  if (!dataFlowDiagram.value) return

  const canvas = document.createElement('canvas')
  canvas.width = 800
  canvas.height = 300
  dataFlowDiagram.value.innerHTML = ''
  dataFlowDiagram.value.appendChild(canvas)

  const ctx = canvas.getContext('2d')

  // 绘制流程步骤
  const stepWidth = 150
  const stepHeight = 80
  const stepSpacing = 50
  const startX = 50
  const y = 110

  dataProcessSteps.value.forEach((step, index) => {
    const x = startX + index * (stepWidth + stepSpacing)

    // 绘制步骤矩形
    ctx.fillStyle = step.color
    ctx.fillRect(x, y, stepWidth, stepHeight)

    // 绘制步骤文字
    ctx.fillStyle = 'white'
    ctx.font = 'bold 14px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(step.title, x + stepWidth / 2, y + stepHeight / 2 + 5)

    // 绘制箭头
    if (index < dataProcessSteps.value.length - 1) {
      const arrowX = x + stepWidth + 10
      const arrowY = y + stepHeight / 2

      ctx.strokeStyle = '#666'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(arrowX, arrowY)
      ctx.lineTo(arrowX + 30, arrowY)
      ctx.stroke()

      // 箭头头部
      ctx.beginPath()
      ctx.moveTo(arrowX + 25, arrowY - 5)
      ctx.lineTo(arrowX + 30, arrowY)
      ctx.lineTo(arrowX + 25, arrowY + 5)
      ctx.stroke()
    }
  })
}

onMounted(() => {
  nextTick(() => {
    drawArchitectureDiagram()
    drawDataFlowDiagram()
  })
})
</script>

<style scoped>
.architecture-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.architecture-header {
  text-align: center;
  margin-bottom: 3rem;
}

.architecture-header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.architecture-header p {
  font-size: 1.2rem;
  color: #7f8c8d;
}

.architecture-overview {
  margin-bottom: 4rem;
}

.overview-card {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.overview-card h3 {
  font-size: 1.8rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.architecture-diagram {
  width: 100%;
  height: 500px;
  background: #f8f9fa;
  border-radius: 15px;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #dee2e6;
}

.architecture-legend {
  display: flex;
  justify-content: center;
}

.legend-section h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
  text-align: center;
}

.legend-items {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.spark-integration {
  margin-bottom: 4rem;
}

.spark-integration h3 {
  font-size: 1.8rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.integration-content {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.spark-overview {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
  align-items: center;
}

.spark-logo {
  text-align: center;
}

.spark-logo img {
  width: 150px;
  height: auto;
  border-radius: 10px;
}

.spark-info h4 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.spark-info p {
  color: #7f8c8d;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.spark-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.feature-item {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-2px);
}

.feature-item .el-icon {
  font-size: 1.5rem;
  color: #409EFF;
  margin-top: 0.25rem;
}

.feature-content h5 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.feature-content p {
  color: #6c757d;
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0;
}

.api-integration {
  border-top: 1px solid #e9ecef;
  padding-top: 3rem;
}

.api-integration h4 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.integration-flow {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  overflow-x: auto;
  padding: 1rem 0;
}

.flow-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 200px;
  flex-shrink: 0;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #409EFF;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-bottom: 1rem;
}

.step-content {
  text-align: center;
  flex: 1;
}

.step-content h5 {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.step-content p {
  color: #6c757d;
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 1rem;
}

.step-code {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
}

.step-code pre {
  margin: 0;
  font-size: 0.8rem;
  color: #495057;
  white-space: pre-wrap;
}

.step-arrow {
  display: flex;
  align-items: center;
  margin: 0 1rem;
  color: #6c757d;
  font-size: 1.5rem;
}

.tech-stack {
  margin-bottom: 4rem;
}

.tech-stack h3 {
  font-size: 1.8rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stack-categories {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem 0;
}

.tech-card {
  display: flex;
  gap: 1.5rem;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 15px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.tech-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border-color: #409EFF;
}

.tech-icon {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 10px;
  flex-shrink: 0;
}

.tech-icon img {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.tech-info h4 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.tech-info p {
  color: #6c757d;
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 1rem;
}

.tech-version,
.tech-purpose {
  font-size: 0.8rem;
  color: #95a5a6;
  margin-bottom: 0.25rem;
}

.tech-version {
  font-weight: 600;
}

.data-flow {
  margin-bottom: 4rem;
}

.data-flow h3 {
  font-size: 1.8rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.flow-diagram {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.flow-container {
  width: 100%;
  height: 300px;
  background: #f8f9fa;
  border-radius: 15px;
  margin-bottom: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #dee2e6;
}

.flow-description h4 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.process-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.process-step {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.step-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.step-details h5 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.step-details p {
  color: #6c757d;
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 1rem;
}

.step-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.tech-tag {
  background: #e9ecef;
  color: #6c757d;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
}

.performance-metrics {
  margin-bottom: 4rem;
}

.performance-metrics h3 {
  font-size: 1.8rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.metric-card {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: transform 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-5px);
}

.metric-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
}

.metric-content h4 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.metric-value {
  font-size: 2rem;
  font-weight: 700;
  color: #409EFF;
  margin-bottom: 0.5rem;
}

.metric-description {
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.metric-benchmark {
  font-size: 0.8rem;
  color: #95a5a6;
}

.benchmark-label {
  margin-right: 0.5rem;
}

.benchmark-value {
  font-weight: 600;
}

.deployment-architecture {
  margin-bottom: 4rem;
}

.deployment-architecture h3 {
  font-size: 1.8rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.deployment-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.deployment-option {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.option-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.option-header h4 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.option-content p {
  color: #6c757d;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.option-features h5,
.option-specs h5 {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.option-features ul {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
}

.option-features li {
  padding: 0.5rem 0;
  color: #6c757d;
  position: relative;
  padding-left: 1.5rem;
}

.option-features li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #67C23A;
  font-weight: 600;
}

.spec-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.spec-item {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.spec-label {
  font-size: 0.8rem;
  color: #95a5a6;
  margin-bottom: 0.25rem;
}

.spec-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2c3e50;
}

.development-guide {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.development-guide h3 {
  font-size: 1.8rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.guide-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
}

.guide-section h4 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.code-example {
  margin-bottom: 2rem;
}

.code-example h5 {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.code-example pre {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1rem;
  overflow-x: auto;
  font-size: 0.9rem;
  color: #495057;
}

.guide-links h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.resource-links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.resource-links .el-button {
  justify-content: flex-start;
  text-align: left;
}

@media (max-width: 768px) {
  .architecture-demo {
    padding: 1rem;
  }

  .overview-card,
  .integration-content,
  .stack-categories,
  .flow-diagram,
  .development-guide {
    padding: 2rem;
  }

  .spark-overview {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .integration-flow {
    flex-direction: column;
    align-items: center;
  }

  .step-arrow {
    transform: rotate(90deg);
    margin: 1rem 0;
  }

  .tech-grid,
  .metrics-grid,
  .deployment-options,
  .process-steps {
    grid-template-columns: 1fr;
  }

  .guide-content {
    grid-template-columns: 1fr;
  }

  .architecture-diagram,
  .flow-container {
    height: 300px;
  }
}
</style>
