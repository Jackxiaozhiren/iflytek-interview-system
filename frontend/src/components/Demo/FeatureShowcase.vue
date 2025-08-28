<template>
  <div class="feature-showcase">
    <div class="showcase-header">
      <div class="feature-icon">
        <el-icon :size="60">
          <component :is="feature.icon" />
        </el-icon>
      </div>
      <h2>{{ feature.title }}</h2>
      <p>{{ feature.description }}</p>

      <!-- 功能标签 -->
      <div class="feature-tags" v-if="feature.category || feature.difficulty || feature.estimatedTime">
        <el-tag v-if="feature.category" type="primary" size="small">{{ feature.category }}</el-tag>
        <el-tag v-if="feature.difficulty" :type="getDifficultyType(feature.difficulty)" size="small">
          {{ feature.difficulty }}
        </el-tag>
        <el-tag v-if="feature.estimatedTime" type="info" size="small">
          <el-icon><Clock /></el-icon>
          {{ feature.estimatedTime }}
        </el-tag>
      </div>
    </div>

    <div class="showcase-content">
      <!-- 功能亮点 -->
      <div class="highlights-section">
        <h3>核心亮点</h3>
        <div class="highlights-grid">
          <div 
            v-for="(highlight, index) in feature.highlights" 
            :key="index"
            class="highlight-item"
          >
            <el-icon><Star /></el-icon>
            <span>{{ highlight }}</span>
          </div>
        </div>
      </div>

      <!-- 演示步骤 -->
      <div class="steps-section">
        <h3>演示步骤</h3>
        <div class="steps-timeline">
          <div 
            v-for="(step, index) in feature.demoSteps" 
            :key="index"
            class="step-item"
            :class="{ active: currentStep === index }"
            @click="goToStep(index)"
          >
            <div class="step-number">{{ step.step }}</div>
            <div class="step-content">
              <h4>{{ step.title }}</h4>
              <p>{{ step.description }}</p>

              <!-- 步骤详细信息 -->
              <div class="step-details" v-if="step.duration || step.tips">
                <div class="step-meta">
                  <span v-if="step.duration" class="step-duration">
                    <el-icon><Clock /></el-icon>
                    {{ step.duration }}
                  </span>
                  <span v-if="step.interactiveElements" class="step-elements">
                    <el-icon><Setting /></el-icon>
                    {{ step.interactiveElements.length }}个交互元素
                  </span>
                </div>

                <div v-if="step.tips" class="step-tips">
                  <el-icon><InfoFilled /></el-icon>
                  <span>{{ step.tips }}</span>
                </div>
              </div>

              <div class="step-screenshot">
                <LazyImage
                  :src="step.screenshot || getStepScreenshot(step.step, feature.id)"
                  :fallback-src="getStepPlaceholder(step.step, feature.id)"
                  :alt="step.title + '演示截图'"
                  class="step-image"
                  :hover-zoom="true"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="showcase-actions">
        <el-button 
          type="primary" 
          size="large"
          @click="startDemo"
        >
          <el-icon><VideoPlay /></el-icon>
          开始演示
        </el-button>
        <el-button 
          size="large"
          @click="tryFeature"
        >
          <el-icon><Setting /></el-icon>
          立即体验
        </el-button>
        <el-button 
          size="large"
          @click="viewDetails"
        >
          <el-icon><Document /></el-icon>
          查看详情
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, markRaw } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Star, VideoPlay, Setting, Document, Clock, InfoFilled
} from '@element-plus/icons-vue'
import LazyImage from './LazyImage.vue'
import MediaService from '../../services/mediaService.js'

const props = defineProps({
  feature: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['start-demo', 'try-feature', 'view-details'])

const currentStep = ref(0)

const goToStep = (index) => {
  currentStep.value = index
  ElMessage.info(`查看步骤 ${index + 1}: ${props.feature.demoSteps[index].title}`)
}

const startDemo = () => {
  emit('start-demo', props.feature)
}

const tryFeature = () => {
  emit('try-feature', props.feature)
}

const viewDetails = () => {
  emit('view-details', props.feature)
}

const getDifficultyType = (difficulty) => {
  const typeMap = {
    '入门': 'success',
    '中级': 'warning',
    '高级': 'danger'
  }
  return typeMap[difficulty] || 'info'
}

// 获取步骤截图
const getStepScreenshot = (stepNumber, featureId) => {
  const keywords = getStepKeywords(stepNumber, featureId)
  return MediaService.createUnsplashImage(keywords, 600, 400)
}

// 获取步骤占位符
const getStepPlaceholder = (stepNumber, featureId) => {
  return MediaService.createPlaceholder(600, 400, `步骤 ${stepNumber}`, '1890ff')
}

// 根据功能ID和步骤获取关键词
const getStepKeywords = (stepNumber, featureId) => {
  const keywordMap = {
    'multimodal-input': {
      1: 'interface,selection,mode,technology',
      2: 'device,setup,microphone,camera',
      3: 'recording,video,audio,capture',
      4: 'processing,analysis,ai,data'
    },
    'ai-analysis': {
      1: 'artificial-intelligence,brain,analysis',
      2: 'data,processing,algorithm,machine',
      3: 'results,evaluation,metrics,score',
      4: 'report,visualization,chart,graph'
    },
    'comprehensive-report': {
      1: 'report,document,analysis,professional',
      2: 'chart,graph,visualization,data',
      3: 'recommendation,advice,improvement',
      4: 'export,download,pdf,sharing'
    }
  }

  return keywordMap[featureId]?.[stepNumber] || 'technology,demo,interface,modern'
}
</script>

<style scoped>
.feature-showcase {
  background: white;
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-lg);
  max-width: 800px;
  margin: 0 auto;
}

.showcase-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
}

.feature-icon {
  color: var(--color-primary);
  margin-bottom: var(--spacing-lg);
}

.showcase-header h2 {
  font-size: 2rem;
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
}

.showcase-header p {
  font-size: 1.1rem;
  color: var(--text-secondary);
}

.feature-tags {
  margin-top: var(--spacing-md);
  display: flex;
  justify-content: center;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.feature-tags .el-tag {
  display: flex;
  align-items: center;
  gap: 4px;
}

.highlights-section,
.steps-section {
  margin-bottom: var(--spacing-xl);
}

.highlights-section h3,
.steps-section h3 {
  font-size: 1.3rem;
  margin-bottom: var(--spacing-lg);
  color: var(--text-primary);
}

.highlights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.highlight-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--bg-secondary);
  border-radius: var(--border-radius-md);
  transition: all 0.3s ease;
}

.highlight-item:hover {
  background: var(--color-primary-light);
  transform: translateY(-2px);
}

.highlight-item .el-icon {
  color: var(--color-primary);
}

.steps-timeline {
  position: relative;
}

.step-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-lg);
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all 0.3s ease;
}

.step-item:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
}

.step-item.active {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: var(--spacing-lg);
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-content h4 {
  font-size: 1.1rem;
  margin-bottom: var(--spacing-sm);
  color: var(--text-primary);
}

.step-content p {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
}

.step-details {
  margin-bottom: var(--spacing-md);
}

.step-meta {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
  flex-wrap: wrap;
}

.step-duration,
.step-elements {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.9rem;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  padding: 4px 8px;
  border-radius: var(--border-radius-sm);
}

.step-tips {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  background: var(--color-info-light);
  border-radius: var(--border-radius-sm);
  font-size: 0.9rem;
  color: var(--color-info-dark);
}

.step-tips .el-icon {
  margin-top: 2px;
  flex-shrink: 0;
}

.step-screenshot {
  width: 100%;
  max-width: 300px;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.step-screenshot img {
  width: 100%;
  height: auto;
  display: block;
}

.showcase-actions {
  text-align: center;
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
}

.showcase-actions .el-button {
  margin: 0 var(--spacing-sm);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .feature-showcase {
    padding: var(--spacing-lg);
  }
  
  .highlights-grid {
    grid-template-columns: 1fr;
  }
  
  .step-item {
    flex-direction: column;
    text-align: center;
  }
  
  .step-number {
    margin-right: 0;
    margin-bottom: var(--spacing-md);
  }
  
  .showcase-actions .el-button {
    display: block;
    width: 100%;
    margin: var(--spacing-sm) 0;
  }
}
</style>
