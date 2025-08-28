<template>
  <div class="optimized-branch-diagram">
    <!-- 图表选择器 -->
    <div class="diagram-selector">
      <el-tabs v-model="activeDiagramType" type="border-card" class="diagram-tabs">
        <el-tab-pane label="🏗️ 技术架构" name="technical_architecture">
          <div class="tab-content">
            <h4>iFlytek星火大模型技术架构</h4>
            <p>展示多模态智能面试系统的完整技术架构和数据流</p>
          </div>
        </el-tab-pane>

        <el-tab-pane label="🤖 AI人工智能" name="ai_domain">
          <div class="tab-content">
            <h4>AI技术栈分支图</h4>
            <p>机器学习、深度学习、NLP等AI核心技术领域</p>
          </div>
        </el-tab-pane>

        <el-tab-pane label="📊 大数据" name="bigdata_domain">
          <div class="tab-content">
            <h4>大数据技术架构</h4>
            <p>分布式计算、数据存储、实时处理等大数据技术</p>
          </div>
        </el-tab-pane>

        <el-tab-pane label="🌐 IoT物联网" name="iot_domain">
          <div class="tab-content">
            <h4>IoT物联网架构</h4>
            <p>设备层、通信层、平台层的完整IoT技术栈</p>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 图表容器 -->
    <div class="enhanced-branch-diagram-container">
      <div class="diagram-header">
        <h3 class="diagram-title">{{ currentDiagram.title }}</h3>
        <p class="diagram-description">{{ currentDiagram.description }}</p>
      </div>

      <div class="diagram-content" ref="diagramContainer">
        <div :id="diagramId" class="mermaid-container"></div>

        <!-- 加载状态 -->
        <div v-if="isLoading" class="loading-overlay">
          <el-icon class="loading-icon"><Loading /></el-icon>
          <p>正在渲染图表...</p>
        </div>

        <!-- 错误状态 -->
        <div v-if="hasError" class="error-overlay">
          <el-icon class="error-icon"><Warning /></el-icon>
          <p>图表渲染失败，请刷新重试</p>
          <el-button @click="retryRender" type="primary" size="small">重新渲染</el-button>
        </div>
      </div>

      <!-- 控制按钮 -->
      <div class="diagram-controls">
        <el-button-group>
          <el-button @click="zoomIn" :icon="ZoomIn" size="small">放大</el-button>
          <el-button @click="zoomOut" :icon="ZoomOut" size="small">缩小</el-button>
          <el-button @click="resetView" :icon="Refresh" size="small">重置</el-button>
          <el-button @click="toggleFullscreen" :icon="FullScreen" size="small">全屏</el-button>
        </el-button-group>

        <div class="diagram-info">
          <el-tag size="small" type="info">{{ nodeCount }} 个节点</el-tag>
          <el-tag size="small" type="success">{{ connectionCount }} 个连接</el-tag>
        </div>
      </div>
    </div>

    <!-- 技术详情面板 -->
    <div v-if="selectedNode" class="node-details-panel">
      <el-card class="details-card">
        <template #header>
          <div class="card-header">
            <span>{{ selectedNode.icon }} {{ selectedNode.label }}</span>
            <el-button @click="selectedNode = null" :icon="Close" size="small" text></el-button>
          </div>
        </template>

        <div class="node-details">
          <p class="node-description">{{ selectedNode.description }}</p>

          <div v-if="selectedNode.technical_details" class="technical-details">
            <h5>技术特性：</h5>
            <ul>
              <li v-for="detail in selectedNode.technical_details" :key="detail">
                {{ detail }}
              </li>
            </ul>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Loading, Warning, ZoomIn, ZoomOut, Refresh, FullScreen, Close
} from '@element-plus/icons-vue'

// 动态导入Mermaid
let mermaid = null
const initMermaid = async () => {
  try {
    const mermaidModule = await import('mermaid')
    mermaid = mermaidModule.default

    // 优化的Mermaid配置
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      themeVariables: {
        // iFlytek品牌色彩配置 - WCAG 2.1 AA合规版本
        primaryColor: '#0066cc',        // 深蓝色，对比度5.12:1 ✅
        primaryTextColor: '#ffffff',
        primaryBorderColor: '#0066cc',
        lineColor: '#4c51bf',          // 深紫色，对比度4.89:1 ✅
        secondaryColor: '#4c51bf',
        tertiaryColor: '#764ba2',      // 已符合标准，对比度6.37:1 ✅
        background: '#ffffff',
        mainBkg: '#0066cc',
        secondBkg: '#4c51bf',
        tertiaryBkg: '#764ba2',

        // 确保文字颜色符合WCAG 2.1 AA标准 (对比度≥4.5:1)
        primaryTextColor: '#ffffff',
        secondaryTextColor: '#ffffff',
        tertiaryTextColor: '#ffffff',
        nodeTextColor: '#ffffff',
        edgeLabelBackground: '#ffffff',
        clusterBkg: '#f7fafc',         // 浅灰背景
        clusterBorder: '#0066cc',
        defaultLinkColor: '#4c51bf',
        titleColor: '#1a202c',         // 深色文字，对比度15.8:1 ✅
        darkMode: false,

        // 节点样式优化 - WCAG合规
        nodeBorder: '#0066cc',
        textColor: '#1a202c'
      },
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis',
        padding: 30,
        nodeSpacing: 80,
        rankSpacing: 120,
        // 响应式配置
        diagramPadding: 20
      },
      // Microsoft YaHei字体配置
      fontFamily: 'Microsoft YaHei, SimHei, sans-serif',
      fontSize: 14,
      // 安全配置
      securityLevel: 'loose',
      // 渲染配置
      maxTextSize: 50000,
      maxEdges: 500
    })
  } catch (error) {
    console.warn('Mermaid初始化失败:', error)
    hasError.value = true
  }
}

// 响应式数据
const activeDiagramType = ref('technical_architecture')
const isLoading = ref(false)
const hasError = ref(false)
const selectedNode = ref(null)
const diagramContainer = ref(null)
const zoomLevel = ref(1)

// 计算属性
const diagramId = computed(() => `mermaid-${activeDiagramType.value}-${Date.now()}`)
const nodeCount = ref(0)
const connectionCount = ref(0)

// 图表配置数据
const diagramConfigs = {
  technical_architecture: {
    title: 'iFlytek星火大模型技术架构',
    description: '基于iFlytek Spark V3.5的多模态智能面试系统完整技术架构',
    mermaidCode: `
      graph TB
        UI["🖥️ 用户界面层<br/>Vue.js 3 + Element Plus"]
        API["🚪 API网关层<br/>FastAPI + 路由管理"]
        SPARK["🧠 iFlytek星火大模型<br/>Spark V3.5核心引擎"]
        MODAL["🎭 多模态分析层<br/>语音+视频+文本"]
        ASSESS["📊 六维评估引擎<br/>智能评分算法"]
        DATA["💾 数据存储层<br/>MySQL + Redis"]

        UI --> API
        API --> SPARK
        SPARK --> MODAL
        MODAL --> ASSESS
        ASSESS --> DATA
        DATA --> API

        classDef userInterface fill:#0066cc,stroke:#333,stroke-width:2px,color:#fff
        classDef apiGateway fill:#2d7d32,stroke:#333,stroke-width:2px,color:#fff
        classDef sparkCore fill:#4c51bf,stroke:#333,stroke-width:2px,color:#fff
        classDef multimodal fill:#bf8f00,stroke:#333,stroke-width:2px,color:#fff
        classDef assessment fill:#c53030,stroke:#333,stroke-width:2px,color:#fff
        classDef dataStorage fill:#764ba2,stroke:#333,stroke-width:2px,color:#fff

        class UI userInterface
        class API apiGateway
        class SPARK sparkCore
        class MODAL multimodal
        class ASSESS assessment
        class DATA dataStorage
    `,
    nodes: {
      UI: {
        icon: '🖥️',
        label: '用户界面层',
        description: '响应式前端界面，支持多模态输入交互',
        technical_details: [
          'Vue.js 3 Composition API架构',
          'Element Plus企业级UI组件',
          'Microsoft YaHei中文字体优化',
          'WCAG 2.1 AA无障碍标准',
          '响应式设计支持移动端'
        ]
      },
      API: {
        icon: '🚪',
        label: 'API网关层',
        description: '高性能API网关，负责请求路由和负载均衡',
        technical_details: [
          'FastAPI异步框架',
          '智能请求路由',
          'JWT身份认证',
          'API限流和熔断',
          'OpenAPI文档自动生成'
        ]
      },
      SPARK: {
        icon: '🧠',
        label: 'iFlytek星火大模型',
        description: '科大讯飞星火大模型，提供强大的多模态AI能力',
        technical_details: [
          'Spark V3.5大语言模型',
          '多模态数据融合分析',
          '实时语音识别(ASR)',
          '自然语言理解(NLU)',
          '情感分析和意图识别',
          '智能对话生成'
        ]
      }
    }
  },

  ai_domain: {
    title: 'AI人工智能技术栈',
    description: '基于iFlytek Spark的AI技术生态系统',
    mermaidCode: `
      graph TD
        ROOT["🤖 AI人工智能<br/>基于iFlytek Spark的AI技术生态"]

        ML["🔬 机器学习"]
        NLP["💬 自然语言处理"]
        CV["👁️ 计算机视觉"]

        ROOT --> ML
        ROOT --> NLP
        ROOT --> CV

        ML --> ML1["监督学习<br/><small>分类、回归算法</small>"]
        ML --> ML2["无监督学习<br/><small>聚类、降维技术</small>"]
        ML --> ML3["强化学习<br/><small>智能决策系统</small>"]
        ML --> ML4["深度学习<br/><small>CNN、RNN、Transformer</small>"]

        NLP --> NLP1["文本理解<br/><small>NLU、语义分析</small>"]
        NLP --> NLP2["对话系统<br/><small>多轮对话管理</small>"]
        NLP --> NLP3["知识图谱<br/><small>实体关系抽取</small>"]
        NLP --> NLP4["文本生成<br/><small>NLG、摘要生成</small>"]

        CV --> CV1["图像识别<br/><small>目标检测、分类</small>"]
        CV --> CV2["人脸识别<br/><small>表情分析、身份验证</small>"]
        CV --> CV3["视频分析<br/><small>行为识别、动作捕捉</small>"]
        CV --> CV4["图像生成<br/><small>GAN、扩散模型</small>"]

        classDef rootNode fill:#0066cc,stroke:#333,stroke-width:3px,color:#fff,font-weight:bold
        classDef branchNode fill:#f7fafc,stroke:#0066cc,stroke-width:2px,color:#1a202c
        classDef leafNode fill:#ffffff,stroke:#4c51bf,stroke-width:1px,color:#1a202c

        class ROOT rootNode
        class ML,NLP,CV branchNode
        class ML1,ML2,ML3,ML4,NLP1,NLP2,NLP3,NLP4,CV1,CV2,CV3,CV4 leafNode
    `
  },

  bigdata_domain: {
    title: '大数据技术架构',
    description: '基于iFlytek Spark的大数据处理和分析技术栈',
    mermaidCode: `
      graph TD
        ROOT["📊 大数据技术<br/>基于iFlytek Spark的大数据生态"]

        STORAGE["💾 数据存储"]
        COMPUTE["⚡ 分布式计算"]
        STREAM["🌊 流式处理"]

        ROOT --> STORAGE
        ROOT --> COMPUTE
        ROOT --> STREAM

        STORAGE --> ST1["关系数据库<br/><small>MySQL、PostgreSQL</small>"]
        STORAGE --> ST2["NoSQL数据库<br/><small>MongoDB、Redis</small>"]
        STORAGE --> ST3["分布式存储<br/><small>HDFS、MinIO</small>"]
        STORAGE --> ST4["数据仓库<br/><small>ClickHouse、Hive</small>"]

        COMPUTE --> CP1["批处理<br/><small>Spark、MapReduce</small>"]
        COMPUTE --> CP2["内存计算<br/><small>Spark SQL、Flink</small>"]
        COMPUTE --> CP3["机器学习<br/><small>MLlib、TensorFlow</small>"]
        COMPUTE --> CP4["图计算<br/><small>GraphX、Neo4j</small>"]

        STREAM --> ST1_["实时流处理<br/><small>Kafka、Pulsar</small>"]
        STREAM --> ST2_["事件驱动<br/><small>EventBridge、RabbitMQ</small>"]
        STREAM --> ST3_["实时分析<br/><small>Flink、Storm</small>"]
        STREAM --> ST4_["监控告警<br/><small>Prometheus、Grafana</small>"]

        classDef rootNode fill:#0066cc,stroke:#333,stroke-width:3px,color:#fff,font-weight:bold
        classDef branchNode fill:#f7fafc,stroke:#0066cc,stroke-width:2px,color:#1a202c
        classDef leafNode fill:#ffffff,stroke:#4c51bf,stroke-width:1px,color:#1a202c

        class ROOT rootNode
        class STORAGE,COMPUTE,STREAM branchNode
        class ST1,ST2,ST3,ST4,CP1,CP2,CP3,CP4,ST1_,ST2_,ST3_,ST4_ leafNode
    `
  },

  iot_domain: {
    title: 'IoT物联网技术栈',
    description: '基于iFlytek Spark的物联网智能系统架构',
    mermaidCode: `
      graph TD
        ROOT["🌐 IoT物联网<br/>基于iFlytek Spark的智能物联网"]

        DEVICE["📱 设备层"]
        CONNECT["🔗 连接层"]
        PLATFORM["🏗️ 平台层"]

        ROOT --> DEVICE
        ROOT --> CONNECT
        ROOT --> PLATFORM

        DEVICE --> DV1["传感器<br/><small>温度、湿度、光照</small>"]
        DEVICE --> DV2["执行器<br/><small>电机、继电器、LED</small>"]
        DEVICE --> DV3["智能终端<br/><small>摄像头、麦克风</small>"]
        DEVICE --> DV4["边缘计算<br/><small>边缘AI、本地处理</small>"]

        CONNECT --> CN1["无线通信<br/><small>WiFi、蓝牙、5G</small>"]
        CONNECT --> CN2["物联网协议<br/><small>MQTT、CoAP、HTTP</small>"]
        CONNECT --> CN3["网关设备<br/><small>协议转换、数据聚合</small>"]
        CONNECT --> CN4["网络安全<br/><small>加密、认证、防护</small>"]

        PLATFORM --> PF1["设备管理<br/><small>注册、配置、监控</small>"]
        PLATFORM --> PF2["数据处理<br/><small>采集、存储、分析</small>"]
        PLATFORM --> PF3["应用服务<br/><small>业务逻辑、API接口</small>"]
        PLATFORM --> PF4["智能分析<br/><small>AI算法、预测维护</small>"]

        classDef rootNode fill:#0066cc,stroke:#333,stroke-width:3px,color:#fff,font-weight:bold
        classDef branchNode fill:#f7fafc,stroke:#0066cc,stroke-width:2px,color:#1a202c
        classDef leafNode fill:#ffffff,stroke:#4c51bf,stroke-width:1px,color:#1a202c

        class ROOT rootNode
        class DEVICE,CONNECT,PLATFORM branchNode
        class DV1,DV2,DV3,DV4,CN1,CN2,CN3,CN4,PF1,PF2,PF3,PF4 leafNode
    `
  }
}

const currentDiagram = computed(() => diagramConfigs[activeDiagramType.value])

// 动画和交互方法
const onTabChange = (tabName) => {
  isTabChanging.value = true
  loadingText.value = '正在切换图表...'

  // 添加切换动画延迟
  setTimeout(() => {
    isTabChanging.value = false
  }, 300)
}

const onDiagramHover = (isHovered) => {
  isDiagramHovered.value = isHovered
}

const closeNodeDetails = () => {
  selectedNode.value = null
  ElMessage.success('已关闭节点详情')
}

const startLoadingAnimation = () => {
  loadingProgress.value = 0
  loadingDot.value = 1

  // 模拟加载进度
  const progressInterval = setInterval(() => {
    loadingProgress.value += Math.random() * 15
    if (loadingProgress.value >= 100) {
      loadingProgress.value = 100
      clearInterval(progressInterval)
    }
  }, 200)

  // 加载点动画
  const dotInterval = setInterval(() => {
    loadingDot.value = loadingDot.value === 3 ? 1 : loadingDot.value + 1
  }, 500)

  // 清理定时器
  setTimeout(() => {
    clearInterval(progressInterval)
    clearInterval(dotInterval)
  }, 3000)
}

const updateLoadingText = (text) => {
  loadingText.value = text
}

// 键盘快捷键支持
const handleKeydown = (event) => {
  if (event.ctrlKey) {
    switch (event.key) {
      case '=':
      case '+':
        event.preventDefault()
        zoomIn()
        break
      case '-':
        event.preventDefault()
        zoomOut()
        break
      case '0':
        event.preventDefault()
        resetView()
        break
    }
  } else if (event.key === 'Escape') {
    if (selectedNode.value) {
      closeNodeDetails()
    }
  } else if (event.key === 'F11') {
    event.preventDefault()
    toggleFullscreen()
  }
}

// 方法定义
const renderDiagram = async () => {
  if (!mermaid) {
    await initMermaid()
  }

  if (!mermaid || !currentDiagram.value) return

  isLoading.value = true
  hasError.value = false

  // 启动加载动画
  startLoadingAnimation()
  updateLoadingText('正在初始化图表引擎...')

  try {
    await nextTick()
    const element = document.getElementById(diagramId.value)

    if (element) {
      // 清空容器
      element.innerHTML = ''
      updateLoadingText('正在生成图表结构...')

      // 渲染Mermaid图表
      updateLoadingText('正在渲染图表节点...')
      const { svg } = await mermaid.render(
        `${diagramId.value}-svg`,
        currentDiagram.value.mermaidCode
      )

      updateLoadingText('正在应用交互效果...')
      element.innerHTML = svg

      // 添加交互功能
      const svgElement = element.querySelector('svg')
      if (svgElement) {
        svgElement.style.cursor = 'grab'
        svgElement.style.maxWidth = '100%'
        svgElement.style.height = 'auto'
        svgElement.style.transform = `scale(${zoomLevel.value})`

        // 添加节点点击事件
        const nodes = svgElement.querySelectorAll('.node')
        nodes.forEach(node => {
          node.style.cursor = 'pointer'
          node.addEventListener('click', (e) => {
            const nodeId = node.id || node.getAttribute('data-id')
            if (nodeId && currentDiagram.value.nodes && currentDiagram.value.nodes[nodeId]) {
              selectedNode.value = currentDiagram.value.nodes[nodeId]
              ElMessage.success(`已选择节点: ${selectedNode.value.label}`)
            }
          })
        })

        // 统计节点和连接数
        nodeCount.value = nodes.length
        connectionCount.value = svgElement.querySelectorAll('.edge').length
      }
    }
  } catch (error) {
    console.error('图表渲染失败:', error)
    hasError.value = true
    ElMessage.error('图表渲染失败，请重试')
  } finally {
    isLoading.value = false
  }
}

const retryRender = () => {
  hasError.value = false
  renderDiagram()
}

const zoomIn = () => {
  zoomLevel.value = Math.min(zoomLevel.value + 0.2, 3)
  updateZoom()
}

const zoomOut = () => {
  zoomLevel.value = Math.max(zoomLevel.value - 0.2, 0.5)
  updateZoom()
}

const resetView = () => {
  zoomLevel.value = 1
  updateZoom()
  ElMessage.success('视图已重置')
}

const updateZoom = () => {
  const svgElement = document.querySelector(`#${diagramId.value} svg`)
  if (svgElement) {
    svgElement.style.transform = `scale(${zoomLevel.value})`
  }
}

const toggleFullscreen = () => {
  const container = diagramContainer.value
  if (container) {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      container.requestFullscreen()
    }
  }
}

// 监听图表类型变化
watch(activeDiagramType, () => {
  selectedNode.value = null
  setTimeout(renderDiagram, 100)
})

// 组件挂载
onMounted(async () => {
  await initMermaid()
  setTimeout(renderDiagram, 500)

  // 添加键盘事件监听
  document.addEventListener('keydown', handleKeydown)
})

// 组件卸载
onUnmounted(() => {
  // 移除键盘事件监听
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.optimized-branch-diagram {
  font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  animation: fadeInUp 0.6s ease-out;
}

/* 核心动画定义 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes popIn {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

/* 响应式设计优化 */
@media (max-width: 1024px) {
  .optimized-branch-diagram {
    max-width: 100%;
    padding: 15px;
  }
}

@media (max-width: 768px) {
  .optimized-branch-diagram {
    padding: 10px;
  }

  .diagram-header {
    padding: 20px 15px !important;
  }

  .diagram-title {
    font-size: 1.5rem !important;
  }

  .diagram-description {
    font-size: 0.9rem !important;
  }
}

@media (max-width: 480px) {
  .optimized-branch-diagram {
    padding: 8px;
  }

  .diagram-header {
    padding: 15px 10px !important;
  }

  .diagram-title {
    font-size: 1.3rem !important;
  }

  .diagram-description {
    font-size: 0.8rem !important;
  }
}

/* 图表选择器样式 */
.diagram-selector {
  margin-bottom: 30px;
  animation: slideInLeft 0.5s ease-out;
}

.diagram-tabs.enhanced-tabs {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.diagram-tabs.enhanced-tabs:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.diagram-tabs.enhanced-tabs :deep(.el-tabs__item) {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.diagram-tabs.enhanced-tabs :deep(.el-tabs__item:hover) {
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  transform: translateY(-1px);
}

.diagram-tabs.enhanced-tabs :deep(.el-tabs__item.is-active) {
  background: linear-gradient(135deg, #0066cc 0%, #4c51bf 100%);
  color: white !important;
  font-weight: 600;
}

.diagram-tabs.enhanced-tabs :deep(.el-tabs__item.is-active::before) {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 100%);
  pointer-events: none;
}

.tab-content {
  padding: 20px;
  text-align: center;
}

.tab-content h4 {
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.tab-content p {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.5;
}

/* 图表容器样式 */
.enhanced-branch-diagram-container {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin: 20px 0;
  border: 1px solid #e9ecef;
}

.diagram-header {
  background: linear-gradient(135deg, #0066cc 0%, #4c51bf 100%);
  padding: 25px;
  text-align: center;
  position: relative;
}

.diagram-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.diagram-title {
  color: #ffffff !important;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 10px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6) !important;
  position: relative;
  z-index: 1;
}

.diagram-description {
  color: #ffffff !important;
  font-size: 1rem;
  margin: 0;
  opacity: 0.95;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5) !important;
  position: relative;
  z-index: 1;
  line-height: 1.5;
}

/* 图表内容区域 */
.diagram-content {
  padding: 40px;
  background: linear-gradient(135deg, #fafbfc 0%, #f8f9fa 100%);
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.mermaid-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.mermaid-container :deep(svg) {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 20px;
  transition: transform 0.3s ease;
}

/* 增强的图表容器样式 */
.interactive-diagram {
  transition: all 0.3s ease;
  border-radius: 8px;
  overflow: hidden;
}

.interactive-diagram.diagram-loaded {
  animation: fadeInUp 0.6s ease-out;
}

.interactive-diagram.diagram-loading {
  opacity: 0.7;
  filter: blur(1px);
}

.interactive-diagram:hover {
  box-shadow: 0 4px 20px rgba(0, 102, 204, 0.1);
}

/* 进度指示器 */
.progress-indicator {
  width: 100%;
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 10px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #ffffff 0%, #f0f8ff 100%);
  border-radius: 2px;
  transition: width 0.3s ease;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
}

/* 增强的加载和错误状态 */
.loading-overlay.enhanced-loading,
.error-overlay.enhanced-error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  animation: popIn 0.4s ease-out;
}

.loading-content,
.error-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.loading-spinner {
  position: relative;
}

.loading-icon.rotating {
  animation: rotate 2s linear infinite;
  font-size: 2rem;
  color: #0066cc;
}

.loading-text {
  font-size: 14px;
  color: #4a5568;
  font-weight: 500;
  margin: 0;
}

.loading-dots {
  display: flex;
  gap: 8px;
}

.loading-dots .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #cbd5e0;
  transition: all 0.3s ease;
}

.loading-dots .dot.active {
  background: #0066cc;
  transform: scale(1.2);
}

/* 错误状态样式 */
.error-icon.pulse {
  animation: pulse 1.5s ease-in-out infinite;
  font-size: 2rem;
  color: #c53030;
}

.error-message {
  font-size: 14px;
  color: #4a5568;
  margin: 0;
}

.retry-button {
  transition: all 0.3s ease;
}

.retry-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
}

/* 原有的加载和错误状态 */
.loading-overlay,
.error-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.loading-icon,
.error-icon {
  font-size: 2rem;
  margin-bottom: 15px;
}

.loading-icon {
  color: #409EFF;
  animation: spin 1s linear infinite;
}

.error-icon {
  color: #F56C6C;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 控制按钮区域 */
.diagram-controls {
  background: #f8f9fa;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #e9ecef;
  flex-wrap: wrap;
  gap: 10px;
}

.diagram-info {
  display: flex;
  gap: 10px;
  align-items: center;
}

/* 节点详情面板 */
.node-details-panel {
  margin-top: 30px;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.details-card {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: #2c3e50;
}

.node-details {
  padding: 10px 0;
}

.node-description {
  color: #495057;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 20px;
}

.technical-details h5 {
  color: #2c3e50;
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 15px 0;
}

.technical-details ul {
  margin: 0;
  padding-left: 20px;
  list-style-type: none;
}

.technical-details li {
  color: #495057;
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 8px;
  position: relative;
  padding-left: 20px;
}

.technical-details li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #67C23A;
  font-weight: bold;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .optimized-branch-diagram {
    padding: 15px;
  }

  .diagram-header {
    padding: 20px 15px;
  }

  .diagram-title {
    font-size: 1.4rem !important;
  }

  .diagram-description {
    font-size: 0.9rem !important;
  }

  .diagram-content {
    padding: 20px 15px;
    min-height: 400px;
  }

  .diagram-controls {
    padding: 15px;
    flex-direction: column;
    gap: 15px;
  }

  .diagram-info {
    justify-content: center;
  }

  .tab-content {
    padding: 15px;
  }

  .tab-content h4 {
    font-size: 1.1rem;
  }

  .tab-content p {
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .diagram-title {
    font-size: 1.2rem !important;
  }

  .diagram-content {
    padding: 15px 10px;
    min-height: 350px;
  }

  .mermaid-container :deep(svg) {
    padding: 15px;
  }
}

/* WCAG 2.1 AA合规性增强 - 对比度≥4.5:1 */
.diagram-title,
.diagram-description {
  color: #ffffff !important;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8) !important;
  font-weight: 600 !important;
}

/* 确保所有iFlytek品牌色背景上的文字都是白色 - WCAG 2.1 AA合规 */
.enhanced-branch-diagram-container [style*="#0066cc"] *,
.enhanced-branch-diagram-container [style*="#4c51bf"] *,
.enhanced-branch-diagram-container [style*="#764ba2"] *,
.enhanced-branch-diagram-container [style*="#2d7d32"] *,
.enhanced-branch-diagram-container [style*="#bf8f00"] *,
.enhanced-branch-diagram-container [style*="#c53030"] * {
  color: #ffffff !important;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8) !important;
  font-weight: 600 !important;
}

/* Mermaid图表内部样式优化 */
.mermaid-container :deep(.node) {
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Microsoft YaHei', 'SimHei', sans-serif !important;
}

.mermaid-container :deep(.node:hover) {
  filter: brightness(1.1);
  transform: scale(1.02);
}

/* Microsoft YaHei字体强制应用 */
.mermaid-container :deep(text) {
  font-family: 'Microsoft YaHei', 'SimHei', sans-serif !important;
  font-weight: 500 !important;
}

.mermaid-container :deep(.nodeLabel) {
  font-family: 'Microsoft YaHei', 'SimHei', sans-serif !important;
  font-weight: 600 !important;
}

/* 响应式设计优化 */
@media (max-width: 768px) {
  .mermaid-container :deep(svg) {
    max-width: 100% !important;
    height: auto !important;
  }

  .mermaid-container :deep(text) {
    font-size: 12px !important;
  }
}

@media (max-width: 480px) {
  .mermaid-container :deep(text) {
    font-size: 10px !important;
  }
}

.mermaid-container :deep(.node text) {
  font-family: 'Microsoft YaHei', 'SimHei', sans-serif !important;
  font-weight: 500;
}

/* 确保Mermaid节点文字在紫色背景上显示为白色 */
.mermaid-container :deep(.node[fill*="#4c51bf"]) text,
.mermaid-container :deep(.node[fill*="#6b21a8"]) text,
.mermaid-container :deep(.node[fill*="#9C27B0"]) text {
  fill: #ffffff !important;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
}
</style>