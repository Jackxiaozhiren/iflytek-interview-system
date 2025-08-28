<template>
  <div class="learning-path-details">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="breadcrumb">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item @click="router.push('/learning-path')">学习路径</el-breadcrumb-item>
            <el-breadcrumb-item @click="router.push(`/learning-path/${route.params.id}/details`)">{{ pathDetails.title }}</el-breadcrumb-item>
            <el-breadcrumb-item>学习模块</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="path-header">
          <div class="path-info">
            <h1>
              <el-icon><Reading /></el-icon>
              {{ pathDetails.title }} - 学习模块
            </h1>
            <p>开始您的学习之旅，逐步掌握核心技能和知识体系</p>
            <div class="path-meta">
              <el-tag :type="getDifficultyType(pathDetails.difficulty)" size="large">
                {{ getDifficultyText(pathDetails.difficulty) }}
              </el-tag>
              <el-tag type="info" size="large">{{ pathDetails.domain }}</el-tag>
              <span class="duration">预计学习时间：{{ pathDetails.duration }}</span>
            </div>
          </div>
          
          <div class="path-actions">
            <el-button size="large" @click="router.back()">返回路径</el-button>
            <el-button size="large" @click="router.push(`/learning-path/${route.params.id}/details`)">
              <el-icon><InfoFilled /></el-icon>
              查看详情
            </el-button>
            <el-button type="primary" size="large" @click="startLearning">
              <el-icon><CaretRight /></el-icon>
              开始第一个模块
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 学习进度概览 -->
    <div class="progress-overview">
      <el-card class="progress-card">
        <template #header>
          <div class="card-header">
            <el-icon><TrendCharts /></el-icon>
            <span>学习进度概览</span>
          </div>
        </template>
        
        <div class="progress-content">
          <div class="overall-progress">
            <div class="progress-circle">
              <el-progress 
                type="circle" 
                :percentage="overallProgress" 
                :width="120"
                :stroke-width="8"
                color="#1890ff"
              >
                <template #default="{ percentage }">
                  <span class="progress-text">{{ percentage }}%</span>
                  <span class="progress-label">总进度</span>
                </template>
              </el-progress>
            </div>
            
            <div class="progress-stats">
              <div class="stat-item">
                <span class="stat-number">{{ completedModules }}</span>
                <span class="stat-label">已完成模块</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ totalHours }}</span>
                <span class="stat-label">学习时长(小时)</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ remainingWeeks }}</span>
                <span class="stat-label">剩余周数</span>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 技能发展路径 -->
    <div class="skill-development">
      <el-card class="skill-card">
        <template #header>
          <div class="card-header">
            <el-icon><Star /></el-icon>
            <span>技能发展路径</span>
          </div>
        </template>
        
        <!-- 图例说明 -->
        <div class="skill-legend">
          <div class="legend-item">
            <div class="legend-color current-color"></div>
            <span>当前水平</span>
          </div>
          <div class="legend-item">
            <div class="legend-color target-color"></div>
            <span>目标水平</span>
          </div>
          <div class="legend-item">
            <div class="legend-marker"></div>
            <span>目标线</span>
          </div>
        </div>

        <div class="skill-tree">
          <div v-for="skill in pathDetails.skillTree" :key="skill.name" class="skill-item">
            <div class="skill-info">
              <h4>{{ skill.name }}</h4>
              <div class="skill-progress">
                <span class="current-level">当前: {{ skill.currentLevel }}%</span>
                <span class="target-level">目标: {{ skill.targetLevel }}%</span>
                <span class="gap-level">差距: {{ skill.targetLevel - skill.currentLevel }}%</span>
              </div>
            </div>
            <div class="skill-bar">
              <!-- 目标进度条背景 -->
              <div class="target-progress-bg">
                <el-progress
                  :percentage="skill.targetLevel"
                  :stroke-width="12"
                  color="#e6f7ff"
                  :show-text="false"
                  class="target-progress"
                />
              </div>
              <!-- 当前进度条 -->
              <div class="current-progress">
                <el-progress
                  :percentage="skill.currentLevel"
                  :stroke-width="12"
                  :color="getSkillProgressColor(skill.currentLevel, skill.targetLevel)"
                  :show-text="false"
                />
              </div>
              <!-- 目标标记线 -->
              <div
                class="target-marker"
                :style="{ left: skill.targetLevel + '%' }"
                :title="`目标水平: ${skill.targetLevel}%`"
              >
                <div class="marker-line"></div>
                <div class="marker-label">{{ skill.targetLevel }}%</div>
              </div>
              <!-- 当前水平标记 -->
              <div
                class="current-marker"
                :style="{ left: skill.currentLevel + '%' }"
                :title="`当前水平: ${skill.currentLevel}%`"
              >
                <div class="current-label">{{ skill.currentLevel }}%</div>
              </div>
            </div>
            <!-- 技能提升建议 -->
            <div class="skill-suggestion">
              <el-icon><InfoFilled /></el-icon>
              <span>{{ getSkillSuggestion(skill) }}</span>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 学习模块详情 -->
    <div class="learning-modules">
      <el-card class="modules-card">
        <template #header>
          <div class="card-header">
            <el-icon><Reading /></el-icon>
            <span>学习模块 ({{ pathDetails.modules.length }}个)</span>
          </div>
        </template>
        
        <div class="modules-list">
          <div v-for="(module, index) in pathDetails.modules" :key="module.id" class="module-item">
            <div class="module-number">{{ index + 1 }}</div>
            <div class="module-content">
              <div class="module-header">
                <h4>{{ module.name }}</h4>
                <div class="module-meta">
                  <el-tag :type="getModuleTypeColor(module.type)" size="small">
                    {{ getModuleTypeName(module.type) }}
                  </el-tag>
                  <span class="module-duration">{{ module.duration }}小时</span>
                </div>
              </div>
              <div class="module-status">
                <el-tag v-if="module.status === 'completed'" type="success">已完成</el-tag>
                <el-tag v-else-if="module.status === 'in_progress'" type="warning">进行中</el-tag>
                <el-tag v-else type="info">未开始</el-tag>
              </div>
            </div>
            <div class="module-actions">
              <el-button v-if="module.status === 'not_started'" type="primary" size="small" @click="startModule(module.id)">
                开始学习
              </el-button>
              <el-button v-else-if="module.status === 'in_progress'" type="warning" size="small" @click="continueModule(module.id)">
                继续学习
              </el-button>
              <el-button v-else type="success" size="small" @click="reviewModule(module.id)">
                复习回顾
              </el-button>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 推荐资源 -->
    <div class="learning-resources">
      <el-card class="resources-card">
        <template #header>
          <div class="card-header">
            <el-icon><Folder /></el-icon>
            <span>推荐学习资源</span>
          </div>
        </template>
        
        <div class="resources-grid">
          <div v-for="resource in pathDetails.resources" :key="resource.id" class="resource-item">
            <div class="resource-icon">
              <el-icon v-if="resource.type === 'video'"><VideoPlay /></el-icon>
              <el-icon v-else-if="resource.type === 'document'"><Document /></el-icon>
              <el-icon v-else-if="resource.type === 'project'"><Folder /></el-icon>
              <el-icon v-else><Link /></el-icon>
            </div>
            <div class="resource-info">
              <h5>{{ resource.name }}</h5>
              <span class="resource-type">{{ getResourceTypeName(resource.type) }}</span>
            </div>
            <div class="resource-actions">
              <el-button size="small" @click="previewResource(resource)">预览</el-button>
              <el-button size="small" type="primary" @click="openResource(resource)">查看</el-button>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 资源预览弹窗 -->
    <ResourcePreviewModal
      v-model="showResourcePreview"
      :resource="selectedResource"
      @action="handleResourceAction"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElNotification } from 'element-plus'
import {
  TrendCharts, Star, Reading, Folder, CaretRight, VideoPlay, Document, Link, InfoFilled
} from '@element-plus/icons-vue'
import ResourcePreviewModal from '../components/ResourcePreviewModal.vue'

const router = useRouter()
const route = useRoute()

// 资源预览相关数据
const showResourcePreview = ref(false)
const selectedResource = ref({})

// 路径详情数据
const pathDetails = ref({
  id: 1,
  title: 'AI算法基础强化路径',
  domain: '人工智能',
  difficulty: 4,
  duration: '16周',
  description: '基于iFlytek Spark技术栈，深入学习机器学习和深度学习核心算法，掌握AI工程化实践',
  skillTree: [
    { name: 'Python基础', currentLevel: 85, targetLevel: 95 },
    { name: '机器学习', currentLevel: 60, targetLevel: 90 },
    { name: '深度学习', currentLevel: 45, targetLevel: 85 },
    { name: 'TensorFlow', currentLevel: 30, targetLevel: 80 },
    { name: '数据处理', currentLevel: 70, targetLevel: 90 },
    { name: '模型部署', currentLevel: 20, targetLevel: 75 }
  ],
  modules: [
    { id: 'm1', name: 'Python数据科学基础', type: 'theory', duration: 40, status: 'completed' },
    { id: 'm2', name: '机器学习算法实战', type: 'practice', duration: 60, status: 'in_progress' },
    { id: 'm3', name: '深度学习框架应用', type: 'practice', duration: 80, status: 'not_started' },
    { id: 'm4', name: 'iFlytek Spark集成项目', type: 'project', duration: 100, status: 'not_started' }
  ],
  resources: [
    {
      id: 'r1',
      name: 'Python机器学习实战',
      type: 'video',
      description: '从零开始学习Python机器学习，包含完整的项目实战案例',
      duration: '8小时30分钟',
      quality: '1080P',
      size: '2.1GB',
      videoUrl: 'https://example.com/video1.mp4'
    },
    {
      id: 'r2',
      name: 'TensorFlow官方文档',
      type: 'document',
      description: 'TensorFlow 2.x 官方中文文档，包含API参考和教程',
      format: 'PDF',
      pages: '1200',
      size: '15.6MB',
      downloadUrl: 'https://example.com/tensorflow-docs.pdf',
      previewContent: '<h3>TensorFlow 简介</h3><p>TensorFlow 是一个开源的机器学习框架...</p>'
    },
    {
      id: 'r3',
      name: '图像识别项目',
      type: 'project',
      description: '基于CNN的图像分类项目，包含完整的代码和数据集',
      technologies: ['Python', 'TensorFlow', 'OpenCV', 'Jupyter'],
      features: ['数据预处理', '模型训练', '性能评估', '可视化分析'],
      projectUrl: 'https://github.com/example/image-recognition',
      screenshots: [
        'https://example.com/screenshot1.jpg',
        'https://example.com/screenshot2.jpg'
      ]
    },
    {
      id: 'r4',
      name: 'Kaggle竞赛案例',
      type: 'practice',
      description: '精选Kaggle机器学习竞赛题目，提升实战能力',
      difficulty: 'medium',
      questionCount: 50,
      estimatedTime: '20小时',
      topics: ['数据清洗', '特征工程', '模型调优', '集成学习'],
      sampleQuestions: [
        {
          title: '房价预测模型优化',
          description: '使用回归算法预测房价，要求RMSE < 0.15'
        },
        {
          title: '客户流失预测',
          description: '构建分类模型预测客户流失，要求AUC > 0.85'
        }
      ]
    },
    {
      id: 'r5',
      name: 'iFlytek开发者社区',
      type: 'community',
      description: 'iFlytek官方开发者社区，获取最新技术动态和解决方案',
      url: 'https://www.xfyun.cn/community',
      preview: {
        title: 'iFlytek开发者社区',
        description: '汇聚AI开发者，分享技术经验，探讨前沿技术',
        image: 'https://example.com/community-preview.jpg'
      }
    },
    {
      id: 'r6',
      name: 'AI论文精读',
      type: 'document',
      description: '精选AI领域经典论文，深入理解算法原理',
      format: 'PDF合集',
      pages: '800',
      size: '45.2MB',
      downloadUrl: 'https://example.com/ai-papers.pdf',
      previewContent: '<h3>论文目录</h3><ul><li>Attention Is All You Need</li><li>BERT: Pre-training of Deep Bidirectional Transformers</li></ul>'
    }
  ]
})

// 计算属性
const overallProgress = computed(() => {
  const completed = pathDetails.value.modules.filter(m => m.status === 'completed').length
  const inProgress = pathDetails.value.modules.filter(m => m.status === 'in_progress').length * 0.5
  return Math.round((completed + inProgress) / pathDetails.value.modules.length * 100)
})

const completedModules = computed(() => {
  return pathDetails.value.modules.filter(m => m.status === 'completed').length
})

const totalHours = computed(() => {
  return pathDetails.value.modules.reduce((total, module) => {
    if (module.status === 'completed') return total + module.duration
    if (module.status === 'in_progress') return total + module.duration * 0.5
    return total
  }, 0)
})

const remainingWeeks = computed(() => {
  const remainingHours = pathDetails.value.modules.reduce((total, module) => {
    if (module.status === 'not_started') return total + module.duration
    if (module.status === 'in_progress') return total + module.duration * 0.5
    return total
  }, 0)
  return Math.ceil(remainingHours / 40) // 假设每周40小时
})

// 方法
const getDifficultyType = (difficulty) => {
  if (difficulty <= 2) return 'success'
  if (difficulty <= 3) return 'warning'
  return 'danger'
}

const getDifficultyText = (difficulty) => {
  const levels = ['', '入门', '初级', '中级', '高级', '专家']
  return levels[difficulty] || '未知'
}

const getModuleTypeColor = (type) => {
  const colorMap = {
    theory: 'info',
    practice: 'warning',
    project: 'success'
  }
  return colorMap[type] || 'info'
}

const getModuleTypeName = (type) => {
  const nameMap = {
    theory: '理论学习',
    practice: '实践练习',
    project: '项目实战'
  }
  return nameMap[type] || '未知'
}

const getResourceTypeName = (type) => {
  const nameMap = {
    video: '视频教程',
    document: '文档资料',
    project: '项目案例',
    practice: '练习题库',
    community: '社区论坛',
    api: 'API文档'
  }
  return nameMap[type] || '其他'
}

const startLearning = () => {
  ElNotification.success({
    title: '🚀 开始学习',
    message: '欢迎开始您的AI学习之旅！',
    duration: 3000
  })
  // 跳转到第一个未完成的模块
  const firstIncompleteModule = pathDetails.value.modules.find(m => m.status !== 'completed')
  if (firstIncompleteModule) {
    startModule(firstIncompleteModule.id)
  }
}

const startModule = (moduleId) => {
  ElMessage.success('开始学习模块...')
  router.push(`/learning-path/${route.params.id}/module/${moduleId}/study`)
}

const continueModule = (moduleId) => {
  ElMessage.info('继续学习模块...')
  router.push(`/learning-path/${route.params.id}/module/${moduleId}/study`)
}

const reviewModule = (moduleId) => {
  ElMessage.info('复习模块内容...')
  router.push(`/learning-path/${route.params.id}/module/${moduleId}/review`)
}

const previewResource = (resource) => {
  selectedResource.value = resource
  showResourcePreview.value = true
}

const openResource = (resource) => {
  // 根据资源类型执行不同的操作
  switch (resource.type) {
    case 'video':
      if (resource.videoUrl) {
        window.open(resource.videoUrl, '_blank')
        ElMessage.success('正在打开视频...')
      } else {
        ElMessage.warning('视频链接不可用')
      }
      break
    case 'document':
      if (resource.downloadUrl) {
        window.open(resource.downloadUrl, '_blank')
        ElMessage.success('正在下载文档...')
      } else {
        ElMessage.warning('下载链接不可用')
      }
      break
    case 'project':
      if (resource.projectUrl) {
        window.open(resource.projectUrl, '_blank')
        ElMessage.success('正在打开项目页面...')
      } else {
        ElMessage.warning('项目链接不可用')
      }
      break
    case 'community':
    case 'link':
      if (resource.url) {
        window.open(resource.url, '_blank')
        ElMessage.success('正在打开链接...')
      } else {
        ElMessage.warning('链接地址不可用')
      }
      break
    case 'practice':
      ElMessage.success('正在启动练习模式...')
      // 这里可以跳转到练习页面
      break
    default:
      ElMessage.info(`打开资源：${resource.name}`)
  }
}

const handleResourceAction = (action) => {
  console.log('资源操作:', action)
  switch (action.type) {
    case 'watch':
      ElMessage.success('开始观看视频')
      break
    case 'download':
      ElMessage.success('开始下载文档')
      break
    case 'view':
      ElMessage.success('查看项目详情')
      break
    case 'open':
      ElMessage.success('打开外部链接')
      break
    case 'practice':
      ElMessage.success('开始练习')
      break
    case 'favorite':
      ElMessage.success('已添加到收藏夹')
      break
    default:
      ElMessage.info('操作完成')
  }
}

// 技能相关方法
const getSkillProgressColor = (current, target) => {
  const progress = current / target
  if (progress >= 0.8) return '#52c41a' // 绿色 - 接近目标
  if (progress >= 0.6) return '#1890ff' // 蓝色 - 进展良好
  if (progress >= 0.4) return '#faad14' // 橙色 - 需要努力
  return '#f5222d' // 红色 - 差距较大
}

const getSkillSuggestion = (skill) => {
  const gap = skill.targetLevel - skill.currentLevel
  if (gap <= 10) {
    return '您已接近目标水平，继续保持！'
  } else if (gap <= 30) {
    return '通过专项练习可以快速提升'
  } else if (gap <= 50) {
    return '建议系统学习相关课程'
  } else {
    return '需要从基础开始，制定长期学习计划'
  }
}

// 生命周期
onMounted(() => {
  // 确保页面滚动到顶部
  window.scrollTo(0, 0)

  const pathId = route.params.id
  console.log('加载学习路径详情:', pathId)
  // 这里可以根据pathId加载具体的路径数据
})
</script>

<style scoped>
/* 页面整体样式 */
.learning-path-details {
  min-height: 100vh;
  background: linear-gradient(135deg,
    rgba(24, 144, 255, 0.08) 0%,
    rgba(102, 126, 234, 0.06) 25%,
    rgba(0, 102, 204, 0.04) 50%,
    rgba(76, 81, 191, 0.06) 75%,
    rgba(118, 75, 162, 0.08) 100%
  );
  background-attachment: fixed;
  padding: 24px;
}

/* 页面头部 */
.page-header {
  margin-bottom: 32px;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.breadcrumb {
  margin-bottom: 24px;
}

.breadcrumb :deep(.el-breadcrumb__item) {
  font-size: 14px;
}

.breadcrumb :deep(.el-breadcrumb__inner) {
  color: #1890ff;
  cursor: pointer;
}

.path-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 32px;
}

.path-info h1 {
  font-size: 32px;
  font-weight: 700;
  color: #262626;
  margin: 0 0 12px 0;
}

.path-info p {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin: 0 0 16px 0;
}

.path-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.duration {
  font-size: 14px;
  color: #8c8c8c;
  font-weight: 500;
}

.path-actions {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

/* 卡片通用样式 */
.progress-overview,
.skill-development,
.learning-modules,
.learning-resources {
  max-width: 1200px;
  margin: 0 auto 32px auto;
}

.progress-card,
.skill-card,
.modules-card,
.resources-card {
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #1890ff;
}

/* 进度概览 */
.progress-content {
  padding: 8px 0;
}

.overall-progress {
  display: flex;
  align-items: center;
  gap: 48px;
}

.progress-circle {
  flex-shrink: 0;
}

.progress-text {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: #1890ff;
}

.progress-label {
  display: block;
  font-size: 14px;
  color: #8c8c8c;
  margin-top: 4px;
}

.progress-stats {
  display: flex;
  gap: 48px;
  flex: 1;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 28px;
  font-weight: 700;
  color: #1890ff;
  line-height: 1;
}

.stat-label {
  display: block;
  font-size: 14px;
  color: #8c8c8c;
  margin-top: 4px;
}

/* 技能发展 */
.skill-legend {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #1890ff;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.legend-color {
  width: 16px;
  height: 8px;
  border-radius: 4px;
}

.current-color {
  background: #1890ff;
}

.target-color {
  background: #e6f7ff;
}

.legend-marker {
  width: 3px;
  height: 16px;
  background: #52c41a;
  border-radius: 2px;
}

.skill-tree {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 8px 0;
}

.skill-item {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: #fafafa;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.skill-item:hover {
  border-color: #d9f7be;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.skill-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.skill-info h4 {
  font-size: 18px;
  font-weight: 600;
  color: #262626;
  margin: 0;
}

.skill-progress {
  display: flex;
  gap: 16px;
  font-size: 12px;
  align-items: center;
}

.current-level {
  color: #1890ff;
  font-weight: 600;
}

.target-level {
  color: #52c41a;
  font-weight: 600;
}

.gap-level {
  color: #fa8c16;
  font-weight: 600;
}

.skill-bar {
  position: relative;
  height: 20px;
  margin: 8px 0;
}

.target-progress-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
}

.current-progress {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
}

.target-marker {
  position: absolute;
  top: -2px;
  transform: translateX(-50%);
  z-index: 3;
  cursor: pointer;
}

.marker-line {
  width: 3px;
  height: 24px;
  background: #52c41a;
  border-radius: 2px;
  box-shadow: 0 2px 4px rgba(82, 196, 26, 0.3);
}

.marker-label {
  position: absolute;
  top: -24px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  color: #52c41a;
  font-weight: 600;
  background: white;
  padding: 2px 4px;
  border-radius: 3px;
  border: 1px solid #52c41a;
  white-space: nowrap;
}

.current-marker {
  position: absolute;
  top: -2px;
  transform: translateX(-50%);
  z-index: 3;
}

.current-label {
  position: absolute;
  top: 26px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  color: #1890ff;
  font-weight: 600;
  background: white;
  padding: 2px 4px;
  border-radius: 3px;
  border: 1px solid #1890ff;
  white-space: nowrap;
}

.skill-suggestion {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #666;
  background: white;
  padding: 8px 12px;
  border-radius: 6px;
  border-left: 3px solid #1890ff;
}

.skill-suggestion .el-icon {
  color: #1890ff;
  font-size: 14px;
}

/* 学习模块 */
.modules-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px 0;
}

.module-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.module-item:hover {
  background: #f0f8ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.module-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #1890ff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  flex-shrink: 0;
}

.module-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.module-header h4 {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 8px 0;
}

.module-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.module-duration {
  font-size: 12px;
  color: #8c8c8c;
}

.module-actions {
  flex-shrink: 0;
}

/* 学习资源 */
.resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  padding: 8px 0;
}

.resource-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.resource-item:hover {
  background: #f0f8ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.resource-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #e6f7ff;
  color: #1890ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.resource-info {
  flex: 1;
}

.resource-info h5 {
  font-size: 14px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 4px 0;
}

.resource-type {
  font-size: 12px;
  color: #8c8c8c;
}

.resource-actions {
  flex-shrink: 0;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .path-header {
    flex-direction: column;
    gap: 24px;
    align-items: flex-start;
  }

  .path-actions {
    width: 100%;
    justify-content: center;
  }

  .overall-progress {
    flex-direction: column;
    gap: 32px;
    text-align: center;
  }

  .progress-stats {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .learning-path-details {
    padding: 16px;
  }

  .header-content {
    padding: 24px 20px;
  }

  .path-info h1 {
    font-size: 24px;
  }

  .path-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .path-actions {
    flex-direction: column;
  }

  .progress-stats {
    flex-direction: column;
    gap: 24px;
  }

  .skill-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .skill-info {
    min-width: auto;
    width: 100%;
  }

  .skill-bar {
    width: 100%;
  }

  .module-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .module-content {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .module-actions {
    width: 100%;
    text-align: center;
  }

  .resources-grid {
    grid-template-columns: 1fr;
  }

  .resource-item {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .learning-path-details {
    padding: 12px;
  }

  .header-content {
    padding: 20px 16px;
  }

  .path-info h1 {
    font-size: 20px;
  }

  .path-info p {
    font-size: 14px;
  }

  .stat-number {
    font-size: 20px;
  }

  .module-number {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }
}

/* 动画效果 */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.progress-overview,
.skill-development,
.learning-modules,
.learning-resources {
  animation: slideInUp 0.6s ease-out;
}

.skill-development {
  animation-delay: 0.1s;
}

.learning-modules {
  animation-delay: 0.2s;
}

.learning-resources {
  animation-delay: 0.3s;
}

/* iFlytek品牌色彩 */
.el-button--primary {
  background-color: #1890ff;
  border-color: #1890ff;
}

.el-button--primary:hover {
  background-color: #40a9ff;
  border-color: #40a9ff;
}

.el-progress__text {
  color: #1890ff !important;
}

.el-tag--primary {
  background-color: #e6f7ff;
  border-color: #91d5ff;
  color: #1890ff;
}
</style>
