<template>
  <div class="system-overview">
    <!-- 系统介绍卡片 -->
    <div class="intro-section" data-aos="fade-up">
      <div class="intro-card">
        <div class="card-header">
          <h2>
            <el-icon class="title-icon"><Cpu /></el-icon>
            多模态智能面试评估系统
          </h2>
          <p class="subtitle">基于iFlytek Spark LLM的下一代人才评估解决方案</p>
        </div>
        
        <div class="intro-content">
          <div class="feature-highlight">
            <div class="highlight-item" v-for="(item, index) in highlights" :key="index">
              <div class="highlight-icon">
                <el-icon><component :is="item.icon" /></el-icon>
              </div>
              <div class="highlight-text">
                <h4>{{ item.title }}</h4>
                <p>{{ item.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 核心功能展示 -->
    <div class="features-section" data-aos="fade-up" data-aos-delay="200">
      <h3 class="section-title">
        <el-icon><Star /></el-icon>
        核心功能特性
      </h3>
      
      <div class="features-grid">
        <div 
          class="feature-card" 
          v-for="(feature, index) in coreFeatures" 
          :key="index"
          data-aos="zoom-in"
          :data-aos-delay="300 + index * 100"
        >
          <div class="feature-icon" :style="{ background: feature.color }">
            <el-icon><component :is="feature.icon" /></el-icon>
          </div>
          <h4>{{ feature.title }}</h4>
          <p>{{ feature.description }}</p>
          <div class="feature-stats">
            <span class="stat-item" v-for="stat in feature.stats" :key="stat.label">
              <strong>{{ stat.value }}</strong>
              <small>{{ stat.label }}</small>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 技术优势 -->
    <div class="advantages-section" data-aos="fade-up" data-aos-delay="400">
      <h3 class="section-title">
        <el-icon><TrendCharts /></el-icon>
        技术优势
      </h3>
      
      <div class="advantages-container">
        <div class="advantage-item" v-for="(advantage, index) in advantages" :key="index">
          <div class="advantage-number">{{ index + 1 }}</div>
          <div class="advantage-content">
            <h4>{{ advantage.title }}</h4>
            <p>{{ advantage.description }}</p>
            <div class="advantage-tags">
              <el-tag 
                v-for="tag in advantage.tags" 
                :key="tag" 
                size="small" 
                type="info"
              >
                {{ tag }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 应用场景 -->
    <div class="scenarios-section" data-aos="fade-up" data-aos-delay="600">
      <h3 class="section-title">
        <el-icon><Grid /></el-icon>
        应用场景
      </h3>
      
      <div class="scenarios-grid">
        <div 
          class="scenario-card" 
          v-for="(scenario, index) in scenarios" 
          :key="index"
          @click="showScenarioDetail(scenario)"
        >
          <div class="scenario-image">
            <img :src="scenario.image" :alt="scenario.title" />
            <div class="scenario-overlay">
              <el-button type="primary" circle>
                <el-icon><View /></el-icon>
              </el-button>
            </div>
          </div>
          <div class="scenario-content">
            <h4>{{ scenario.title }}</h4>
            <p>{{ scenario.description }}</p>
            <div class="scenario-metrics">
              <span>适用岗位: {{ scenario.positions }}</span>
              <span>评估维度: {{ scenario.dimensions }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 快速开始 -->
    <div class="quick-start-section" data-aos="fade-up" data-aos-delay="800">
      <div class="quick-start-card">
        <h3>立即体验智能面试评估</h3>
        <p>选择您感兴趣的技术领域，开始专业的面试评估体验</p>
        <div class="quick-start-buttons">
          <el-button 
            v-for="domain in quickStartDomains" 
            :key="domain.key"
            :type="domain.type" 
            size="large"
            @click="startQuickDemo(domain.key)"
          >
            <el-icon><component :is="domain.icon" /></el-icon>
            {{ domain.label }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, markRaw } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Cpu, Star, TrendCharts, Grid, View, VideoCamera,
  Setting, Timer
} from '@element-plus/icons-vue'

// 系统亮点
const highlights = ref([
  {
    icon: 'Cpu',
    title: 'iFlytek Spark LLM',
    description: '基于讯飞星火认知大模型，提供智能化面试问答和评估'
  },
  {
    icon: 'VideoCamera',
    title: '多模态交互',
    description: '支持文本、语音、视频三种交互方式，全方位评估候选人'
  },
  {
    icon: 'Timer',
    title: '实时分析',
    description: '毫秒级响应，实时生成评估结果和改进建议'
  },
  {
    icon: 'Star',
    title: '精准匹配',
    description: '基于岗位要求和技能图谱，精准匹配候选人能力'
  }
])

// 核心功能
const coreFeatures = ref([
  {
    title: '智能问答系统',
    description: '基于AI大模型的智能问答，支持上下文理解和个性化提问',
    icon: 'VideoCamera',
    color: 'linear-gradient(45deg, #409EFF, #36CFC9)',
    stats: [
      { value: '95.8%', label: '准确率' },
      { value: '<500ms', label: '响应时间' }
    ]
  },
  {
    title: '多模态分析',
    description: '综合分析文本、语音、视频数据，提供全面的候选人评估',
    icon: 'DataBoard',
    color: 'linear-gradient(45deg, #67C23A, #95DE64)',
    stats: [
      { value: '6项', label: '核心能力' },
      { value: '3种', label: '输入模式' }
    ]
  },
  {
    title: '智能评估引擎',
    description: '科学的评估算法，多维度量化候选人的专业能力和综合素质',
    icon: 'TrendCharts',
    color: 'linear-gradient(45deg, #E6A23C, #FADB14)',
    stats: [
      { value: '87.5%', label: '平均分数' },
      { value: '15+', label: '评估指标' }
    ]
  }
])

// 技术优势
const advantages = ref([
  {
    title: '先进的AI技术栈',
    description: '采用iFlytek Spark LLM作为核心引擎，结合自然语言处理、计算机视觉、语音识别等前沿技术',
    tags: ['NLP', '计算机视觉', '语音识别', 'LLM']
  },
  {
    title: '科学的评估体系',
    description: '基于心理学和人力资源理论，构建6维度评估模型，确保评估结果的科学性和准确性',
    tags: ['心理学', '人力资源', '多维评估', '科学量化']
  },
  {
    title: '灵活的部署方案',
    description: '支持云端部署和本地化部署，满足不同企业的安全和合规要求',
    tags: ['云端部署', '本地化', '安全合规', '弹性扩展']
  },
  {
    title: '丰富的集成能力',
    description: '提供完善的API接口和SDK，支持与现有HR系统、ATS系统的无缝集成',
    tags: ['API接口', 'SDK', 'HR系统', 'ATS集成']
  }
])

// 应用场景
const scenarios = ref([
  {
    title: '技术岗位招聘',
    description: '专业的技术面试评估，覆盖AI、大数据、物联网等热门领域',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400',
    positions: '50+',
    dimensions: '6项'
  },
  {
    title: '校园招聘',
    description: '批量化的应届生评估，快速筛选优秀人才',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400',
    positions: '30+',
    dimensions: '5项'
  },
  {
    title: '内部晋升评估',
    description: '员工能力评估和职业发展规划支持',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400',
    positions: '全岗位',
    dimensions: '8项'
  }
])

// 快速开始选项
const quickStartDomains = ref([
  { key: 'ai', label: 'AI面试体验', icon: 'Cpu', type: 'primary' },
  { key: 'bigdata', label: '大数据面试', icon: 'DataBoard', type: 'success' },
  { key: 'iot', label: '物联网面试', icon: 'Setting', type: 'warning' }
])

const showScenarioDetail = (scenario) => {
  ElMessage.info(`查看 ${scenario.title} 详细信息`)
}

const startQuickDemo = (domain) => {
  const domainNames = {
    'ai': '人工智能',
    'bigdata': '大数据',
    'iot': '物联网'
  }
  ElMessage.success(`开始 ${domainNames[domain] || domain} 领域的面试演示`)
}
</script>

<style scoped>
.system-overview {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.intro-section {
  margin-bottom: 4rem;
}

.intro-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85));
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.card-header {
  text-align: center;
  margin-bottom: 2rem;
}

.card-header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.title-icon {
  font-size: 2.5rem;
  color: #409EFF;
}

.subtitle {
  font-size: 1.2rem;
  color: #7f8c8d;
  font-weight: 300;
}

.feature-highlight {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.highlight-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 15px;
  transition: transform 0.3s ease;
}

.highlight-item:hover {
  transform: translateY(-5px);
}

.highlight-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(45deg, #409EFF, #36CFC9);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.highlight-text h4 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-weight: 600;
}

.highlight-text p {
  margin: 0;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.feature-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
}

.feature-icon {
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

.feature-card h4 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.feature-card p {
  color: #7f8c8d;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.feature-stats {
  display: flex;
  justify-content: space-around;
  padding-top: 1rem;
  border-top: 1px solid #ecf0f1;
}

.stat-item {
  text-align: center;
}

.stat-item strong {
  display: block;
  font-size: 1.2rem;
  color: #409EFF;
  font-weight: 700;
}

.stat-item small {
  color: #95a5a6;
  font-size: 0.8rem;
}

.advantages-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 4rem;
}

.advantage-item {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  padding: 2rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.advantage-number {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(45deg, #409EFF, #36CFC9);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  flex-shrink: 0;
}

.advantage-content h4 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.advantage-content p {
  color: #7f8c8d;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.advantage-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.scenarios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.scenario-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.scenario-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
}

.scenario-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.scenario-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.scenario-card:hover .scenario-image img {
  transform: scale(1.1);
}

.scenario-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.scenario-card:hover .scenario-overlay {
  opacity: 1;
}

.scenario-content {
  padding: 1.5rem;
}

.scenario-content h4 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.scenario-content p {
  color: #7f8c8d;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.scenario-metrics {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #95a5a6;
}

.quick-start-section {
  text-align: center;
}

.quick-start-card {
  background: linear-gradient(135deg, #4c51bf 0%, #6b21a8 100%);
  color: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.quick-start-card h3 {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.quick-start-card p {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 2rem;
}

.quick-start-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.quick-start-buttons .el-button {
  padding: 15px 30px;
  font-size: 1rem;
  border-radius: 25px;
}

@media (max-width: 768px) {
  .system-overview {
    padding: 1rem;
  }
  
  .intro-card {
    padding: 2rem;
  }
  
  .card-header h2 {
    font-size: 2rem;
  }
  
  .feature-highlight {
    grid-template-columns: 1fr;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .scenarios-grid {
    grid-template-columns: 1fr;
  }
  
  .advantage-item {
    flex-direction: column;
    text-align: center;
  }
  
  .quick-start-buttons {
    flex-direction: column;
    align-items: center;
  }
}

/* ==================== 紫色背景高对比度修复 ==================== */
/* 确保所有在紫色背景上的文字都是白色，符合WCAG 2.1 AA标准 */
.system-overview [style*="background"][style*="#6b21a8"] *,
.system-overview [style*="background"][style*="#4c51bf"] *,
.system-overview .highlight-icon,
.system-overview .highlight-icon *,
.system-overview .core-feature-icon,
.system-overview .core-feature-icon * {
  color: #ffffff !important;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6) !important;
  font-weight: 500 !important;
}

/* 图标区域 */
.system-overview .highlight-icon svg,
.system-overview .highlight-icon svg *,
.system-overview .core-feature-icon svg,
.system-overview .core-feature-icon svg * {
  color: #ffffff !important;
  fill: #ffffff !important;
}

/* 系统架构图中的紫色元素 */
.system-overview .architecture-node,
.system-overview .tech-badge {
  color: #ffffff !important;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6) !important;
}
</style>
