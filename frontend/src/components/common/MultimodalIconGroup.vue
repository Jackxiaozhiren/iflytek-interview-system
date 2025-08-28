<template>
  <div class="multimodal-icon-group">
    <!-- 多模态分析流程图标组 -->
    <div class="analysis-flow" v-motion-slide-visible-once-bottom>
      <h3 class="flow-title">多模态分析流程</h3>
      <div class="flow-icons multimodal-group">

        
        <div 
          class="multimodal-icon video-icon icon-lg icon-status processing"
          :style="{ '--index': 1 }"
          @click="showIconDetails('video')"
          title="视频行为分析"
        >
          <el-icon><VideoCamera /></el-icon>
        </div>
        
        <div class="flow-arrow">
          <el-icon><ArrowRight /></el-icon>
        </div>
        
        <div 
          class="multimodal-icon text-icon icon-lg icon-status active"
          :style="{ '--index': 2 }"
          @click="showIconDetails('text')"
          title="文本内容理解"
        >
          <el-icon><Document /></el-icon>
        </div>
        
        <div class="flow-arrow">
          <el-icon><ArrowRight /></el-icon>
        </div>
        
        <div 
          class="multimodal-icon assessment-icon icon-lg icon-status active"
          :style="{ '--index': 3 }"
          @click="showIconDetails('assessment')"
          title="综合能力评估"
        >
          <el-icon><TrendCharts /></el-icon>
        </div>
      </div>
    </div>

    <!-- 功能特性图标展示 -->
    <div class="features-showcase" v-motion-slide-visible-once-bottom :delay="200">
      <h3 class="showcase-title">核心功能特性</h3>
      <div class="features-grid grid grid-cols-2 grid-gap-lg">
        <div class="feature-item">
          <div class="multimodal-icon voice-icon recording icon-xl">
            <el-icon><Microphone /></el-icon>
          </div>
          <h4>实时语音识别</h4>
          <p>基于iFlytek Spark的高精度语音识别技术</p>
        </div>
        
        <div class="feature-item">
          <div class="multimodal-icon video-icon scanning icon-xl">
            <el-icon><VideoCamera /></el-icon>
          </div>
          <h4>智能视频分析</h4>
          <p>面部表情、肢体语言多维度分析</p>
        </div>
        
        <div class="feature-item">
          <div class="multimodal-icon text-icon flowing icon-xl">
            <el-icon><Document /></el-icon>
          </div>
          <h4>深度文本理解</h4>
          <p>语义分析、情感识别、逻辑推理</p>
        </div>
        
        <div class="feature-item">
          <div class="multimodal-icon assessment-icon progress icon-xl">
            <el-icon><TrendCharts /></el-icon>
          </div>
          <h4>综合能力评估</h4>
          <p>六维能力模型智能评估</p>
        </div>
      </div>
    </div>

    <!-- 图标详情弹窗 -->
    <el-dialog
      v-model="showDetails"
      :title="currentIcon.title"
      width="500px"
      center
    >
      <div class="icon-details">
        <div class="detail-icon">
          <div class="multimodal-icon icon-3xl" :class="currentIcon.class">
            <el-icon><component :is="currentIcon.icon" /></el-icon>
          </div>
        </div>
        <div class="detail-content">
          <h4>{{ currentIcon.title }}</h4>
          <p>{{ currentIcon.description }}</p>
          <div class="detail-features">
            <h5>核心特性：</h5>
            <ul>
              <li v-for="feature in currentIcon.features" :key="feature">
                <el-icon><Check /></el-icon>
                {{ feature }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  Microphone, 
  VideoCamera, 
  Document, 
  TrendCharts, 
  ArrowRight,
  Check
} from '@element-plus/icons-vue'


// 弹窗控制
const showDetails = ref(false)
const currentIcon = ref({})

// 图标详情数据
const iconDetails = {
  voice: {
    title: '语音智能分析',
    description: '基于iFlytek Spark大模型的高精度语音识别和分析技术，实现实时语音转文字、情感识别、语调分析等功能。',
    class: 'voice-icon pulse',
    icon: 'Microphone',
    features: [
      '实时语音识别，准确率达95%+',
      '情感色彩分析，识别紧张、自信等状态',
      '语速流畅度评估',
      '关键词提取和语义理解',
      '多语言支持'
    ]
  },
  video: {
    title: '视频行为分析',
    description: '运用计算机视觉技术，智能分析面试者的面部表情、肢体语言、眼神交流等非语言沟通信息。',
    class: 'video-icon scanning',
    icon: 'VideoCamera',
    features: [
      '面部表情识别，分析情绪变化',
      '肢体语言评估，判断自信程度',
      '眼神交流分析，评估专注度',
      '姿态检测，评估专业形象',
      '实时视频处理'
    ]
  },
  text: {
    title: '文本内容理解',
    description: '深度分析面试回答的文本内容，评估逻辑性、专业性、创新性等多个维度。',
    class: 'text-icon flowing',
    icon: 'Document',
    features: [
      '语义理解和逻辑分析',
      '专业术语识别和评估',
      '创新思维评估',
      '回答完整性分析',
      '关键信息提取'
    ]
  },
  assessment: {
    title: '综合能力评估',
    description: '整合语音、视频、文本三个维度的分析结果，生成全面的六维能力评估报告。',
    class: 'assessment-icon analyzing',
    icon: 'TrendCharts',
    features: [
      '六维能力模型评估',
      '多模态数据融合分析',
      '个性化评估报告生成',
      '能力雷达图可视化',
      '改进建议推荐'
    ]
  }
}

// 显示图标详情
const showIconDetails = (iconType) => {
  currentIcon.value = iconDetails[iconType]
  showDetails.value = true
}
</script>

<style scoped>
.multimodal-icon-group {
  padding: 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 20px;
  margin: 2rem 0;
}

.flow-title,
.showcase-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1.5rem;
  text-align: center;
}

.analysis-flow {
  margin-bottom: 3rem;
}

.flow-icons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.flow-arrow {
  color: #64748b;
  font-size: 1.2rem;
  animation: arrowPulse 2s infinite;
}

@keyframes arrowPulse {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

.features-showcase {
  margin-top: 2rem;
}

.feature-item {
  text-align: center;
  padding: 1.5rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.feature-item h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 1rem 0 0.5rem;
}

.feature-item p {
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.5;
}

.icon-details {
  text-align: center;
}

.detail-icon {
  margin-bottom: 1.5rem;
}

.detail-content h4 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
}

.detail-content p {
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.detail-features h5 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
  text-align: left;
}

.detail-features ul {
  list-style: none;
  padding: 0;
  text-align: left;
}

.detail-features li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.detail-features li .el-icon {
  color: #10b981;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .flow-icons {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .flow-arrow {
    transform: rotate(90deg);
  }
  
  .features-grid {
    grid-template-columns: 1fr !important;
  }
}
</style>
