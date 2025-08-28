<template>
  <el-dialog
    v-model="visible"
    :title="resourceTitle"
    width="80%"
    :before-close="handleClose"
    class="resource-preview-modal"
  >
    <div class="resource-content">
      <!-- 视频资源 -->
      <div v-if="resource.type === 'video'" class="video-content">
        <div class="video-player">
          <video
            v-if="resource.videoUrl"
            :src="resource.videoUrl"
            controls
            width="100%"
            height="400"
            class="video-element"
          >
            您的浏览器不支持视频播放
          </video>
          <div v-else class="video-placeholder">
            <el-icon class="placeholder-icon"><VideoPlay /></el-icon>
            <p>视频加载中...</p>
          </div>
        </div>
        
        <div class="video-info">
          <h3>{{ resource.name }}</h3>
          <div class="video-meta">
            <span class="duration">时长：{{ resource.duration || '未知' }}</span>
            <span class="quality">画质：{{ resource.quality || '高清' }}</span>
            <span class="size">大小：{{ resource.size || '未知' }}</span>
          </div>
          <p class="description">{{ resource.description }}</p>
        </div>
      </div>

      <!-- 文档资源 -->
      <div v-else-if="resource.type === 'document'" class="document-content">
        <div class="document-header">
          <div class="doc-icon">
            <el-icon><Document /></el-icon>
          </div>
          <div class="doc-info">
            <h3>{{ resource.name }}</h3>
            <div class="doc-meta">
              <span class="format">格式：{{ resource.format || 'PDF' }}</span>
              <span class="pages">页数：{{ resource.pages || '未知' }}</span>
              <span class="size">大小：{{ resource.size || '未知' }}</span>
            </div>
          </div>
        </div>
        
        <div class="document-preview">
          <div v-if="resource.previewContent" class="preview-content">
            <h4>文档预览</h4>
            <div class="content-text" v-html="resource.previewContent"></div>
          </div>
          <div v-else class="preview-placeholder">
            <el-icon class="placeholder-icon"><Document /></el-icon>
            <p>文档预览不可用</p>
            <p class="hint">请下载查看完整内容</p>
          </div>
        </div>
        
        <div class="document-description">
          <h4>文档简介</h4>
          <p>{{ resource.description }}</p>
        </div>
      </div>

      <!-- 项目资源 -->
      <div v-else-if="resource.type === 'project'" class="project-content">
        <div class="project-header">
          <div class="project-icon">
            <el-icon><Folder /></el-icon>
          </div>
          <div class="project-info">
            <h3>{{ resource.name }}</h3>
            <div class="project-meta">
              <el-tag v-for="tech in resource.technologies" :key="tech" size="small" class="tech-tag">
                {{ tech }}
              </el-tag>
            </div>
          </div>
        </div>
        
        <div class="project-details">
          <div class="detail-section">
            <h4>项目描述</h4>
            <p>{{ resource.description }}</p>
          </div>
          
          <div class="detail-section">
            <h4>技术栈</h4>
            <div class="tech-list">
              <span v-for="tech in resource.technologies" :key="tech" class="tech-item">
                {{ tech }}
              </span>
            </div>
          </div>
          
          <div v-if="resource.features" class="detail-section">
            <h4>主要功能</h4>
            <ul class="feature-list">
              <li v-for="feature in resource.features" :key="feature">{{ feature }}</li>
            </ul>
          </div>
          
          <div v-if="resource.screenshots" class="detail-section">
            <h4>项目截图</h4>
            <div class="screenshot-gallery">
              <img
                v-for="(screenshot, index) in resource.screenshots"
                :key="index"
                :src="screenshot"
                :alt="`截图 ${index + 1}`"
                class="screenshot"
                @click="previewImage(screenshot)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 社区/链接资源 -->
      <div v-else-if="resource.type === 'community' || resource.type === 'link'" class="link-content">
        <div class="link-header">
          <div class="link-icon">
            <el-icon><Link /></el-icon>
          </div>
          <div class="link-info">
            <h3>{{ resource.name }}</h3>
            <div class="link-meta">
              <span class="domain">{{ getDomain(resource.url) }}</span>
              <span class="type">{{ getResourceTypeName(resource.type) }}</span>
            </div>
          </div>
        </div>
        
        <div class="link-preview">
          <div v-if="resource.preview" class="preview-card">
            <img v-if="resource.preview.image" :src="resource.preview.image" alt="预览图" class="preview-image" />
            <div class="preview-text">
              <h4>{{ resource.preview.title || resource.name }}</h4>
              <p>{{ resource.preview.description || resource.description }}</p>
            </div>
          </div>
          <div v-else class="preview-placeholder">
            <el-icon class="placeholder-icon"><Link /></el-icon>
            <p>链接预览不可用</p>
          </div>
        </div>
        
        <div class="link-description">
          <h4>资源简介</h4>
          <p>{{ resource.description }}</p>
        </div>
      </div>

      <!-- 练习/题库资源 -->
      <div v-else-if="resource.type === 'practice'" class="practice-content">
        <div class="practice-header">
          <div class="practice-icon">
            <el-icon><EditPen /></el-icon>
          </div>
          <div class="practice-info">
            <h3>{{ resource.name }}</h3>
            <div class="practice-meta">
              <span class="difficulty">难度：{{ getDifficultyText(resource.difficulty) }}</span>
              <span class="count">题目数量：{{ resource.questionCount || '未知' }}</span>
              <span class="time">预计时间：{{ resource.estimatedTime || '未知' }}</span>
            </div>
          </div>
        </div>
        
        <div class="practice-details">
          <div class="detail-section">
            <h4>练习内容</h4>
            <p>{{ resource.description }}</p>
          </div>
          
          <div v-if="resource.topics" class="detail-section">
            <h4>涵盖主题</h4>
            <div class="topic-tags">
              <el-tag v-for="topic in resource.topics" :key="topic" size="small" type="info">
                {{ topic }}
              </el-tag>
            </div>
          </div>
          
          <div v-if="resource.sampleQuestions" class="detail-section">
            <h4>示例题目</h4>
            <div class="sample-questions">
              <div v-for="(question, index) in resource.sampleQuestions" :key="index" class="sample-question">
                <strong>{{ index + 1 }}. {{ question.title }}</strong>
                <p>{{ question.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <div class="footer-actions">
          <el-button @click="handleClose">关闭</el-button>
          
          <!-- 根据资源类型显示不同的操作按钮 -->
          <el-button v-if="resource.type === 'video'" type="primary" @click="watchVideo">
            <el-icon><VideoPlay /></el-icon>
            观看视频
          </el-button>
          
          <el-button v-else-if="resource.type === 'document'" type="primary" @click="downloadDocument">
            <el-icon><Download /></el-icon>
            下载文档
          </el-button>
          
          <el-button v-else-if="resource.type === 'project'" type="primary" @click="viewProject">
            <el-icon><View /></el-icon>
            查看项目
          </el-button>
          
          <el-button v-else-if="resource.type === 'community' || resource.type === 'link'" type="primary" @click="openLink">
            <el-icon><Link /></el-icon>
            访问链接
          </el-button>
          
          <el-button v-else-if="resource.type === 'practice'" type="primary" @click="startPractice">
            <el-icon><EditPen /></el-icon>
            开始练习
          </el-button>
          
          <el-button type="success" @click="addToFavorites">
            <el-icon><Star /></el-icon>
            收藏
          </el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  VideoPlay, Document, Folder, Link, EditPen, Download, 
  View, Star 
} from '@element-plus/icons-vue'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  resource: {
    type: Object,
    default: () => ({})
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'action'])

// 计算属性
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const resourceTitle = computed(() => {
  const typeNames = {
    video: '视频教程',
    document: '文档资料',
    project: '项目案例',
    community: '社区讨论',
    link: '外部链接',
    practice: '练习题库'
  }
  return `${typeNames[props.resource.type] || '资源'} - ${props.resource.name}`
})

// 方法
const handleClose = () => {
  visible.value = false
}

const getDomain = (url) => {
  if (!url) return '未知'
  try {
    return new URL(url).hostname
  } catch {
    return '未知'
  }
}

const getResourceTypeName = (type) => {
  const names = {
    community: '社区资源',
    link: '外部链接',
    video: '视频教程',
    document: '文档资料',
    project: '项目案例',
    practice: '练习题库'
  }
  return names[type] || '其他'
}

const getDifficultyText = (difficulty) => {
  const texts = {
    easy: '简单',
    medium: '中等',
    hard: '困难'
  }
  return texts[difficulty] || '未知'
}

const previewImage = (imageUrl) => {
  // 实现图片预览功能
  ElMessage.info('图片预览功能开发中...')
}

// 操作方法
const watchVideo = () => {
  ElMessage.success('正在打开视频播放器...')
  emit('action', { type: 'watch', resource: props.resource })
  handleClose()
}

const downloadDocument = () => {
  if (props.resource.downloadUrl) {
    window.open(props.resource.downloadUrl, '_blank')
    ElMessage.success('开始下载文档...')
  } else {
    ElMessage.warning('下载链接不可用')
  }
  emit('action', { type: 'download', resource: props.resource })
}

const viewProject = () => {
  if (props.resource.projectUrl) {
    window.open(props.resource.projectUrl, '_blank')
    ElMessage.success('正在打开项目页面...')
  } else {
    ElMessage.warning('项目链接不可用')
  }
  emit('action', { type: 'view', resource: props.resource })
}

const openLink = () => {
  if (props.resource.url) {
    window.open(props.resource.url, '_blank')
    ElMessage.success('正在打开链接...')
  } else {
    ElMessage.warning('链接地址不可用')
  }
  emit('action', { type: 'open', resource: props.resource })
}

const startPractice = () => {
  ElMessage.success('正在启动练习模式...')
  emit('action', { type: 'practice', resource: props.resource })
  handleClose()
}

const addToFavorites = () => {
  ElMessage.success('已添加到收藏夹')
  emit('action', { type: 'favorite', resource: props.resource })
}
</script>

<style scoped>
/* 对话框样式 */
.resource-preview-modal :deep(.el-dialog) {
  border-radius: 16px;
  overflow: hidden;
}

.resource-preview-modal :deep(.el-dialog__header) {
  background: linear-gradient(135deg, #1890ff 0%, #667eea 100%);
  color: white;
  padding: 20px 24px;
}

.resource-preview-modal :deep(.el-dialog__title) {
  color: white;
  font-weight: 600;
  font-size: 18px;
}

.resource-preview-modal :deep(.el-dialog__headerbtn .el-dialog__close) {
  color: white;
  font-size: 20px;
}

.resource-preview-modal :deep(.el-dialog__body) {
  padding: 0;
}

.resource-preview-modal :deep(.el-dialog__footer) {
  padding: 20px 24px;
  background: #fafafa;
  border-top: 1px solid #f0f0f0;
}

/* 资源内容样式 */
.resource-content {
  padding: 24px;
  max-height: 70vh;
  overflow-y: auto;
}

/* 视频内容 */
.video-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.video-player {
  border-radius: 12px;
  overflow: hidden;
  background: #000;
}

.video-element {
  width: 100%;
  height: auto;
  display: block;
}

.video-placeholder {
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #666;
  background: #f5f5f5;
}

.placeholder-icon {
  font-size: 48px;
  margin-bottom: 12px;
  color: #1890ff;
}

.video-info h3 {
  font-size: 20px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 12px 0;
}

.video-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.video-meta span {
  font-size: 14px;
  color: #666;
  padding: 4px 8px;
  background: #f0f0f0;
  border-radius: 4px;
}

.description {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

/* 文档内容 */
.document-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.document-header {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.doc-icon {
  width: 48px;
  height: 48px;
  background: #1890ff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  flex-shrink: 0;
}

.doc-info h3 {
  font-size: 18px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 8px 0;
}

.doc-meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.doc-meta span {
  font-size: 12px;
  color: #666;
  padding: 2px 6px;
  background: #f0f0f0;
  border-radius: 3px;
}

.document-preview {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
}

.preview-content {
  padding: 16px;
}

.preview-content h4 {
  font-size: 14px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 12px 0;
}

.content-text {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
  max-height: 200px;
  overflow-y: auto;
}

.preview-placeholder {
  height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  background: #fafafa;
}

.hint {
  font-size: 12px;
  color: #999;
  margin: 4px 0 0 0;
}

.document-description h4 {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 8px 0;
}

/* 项目内容 */
.project-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.project-header {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.project-icon {
  width: 48px;
  height: 48px;
  background: #52c41a;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  flex-shrink: 0;
}

.project-info h3 {
  font-size: 18px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 8px 0;
}

.project-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tech-tag {
  background: #e6f7ff;
  color: #1890ff;
  border: 1px solid #91d5ff;
}

.project-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-section h4 {
  font-size: 14px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 8px 0;
}

.tech-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tech-item {
  padding: 4px 8px;
  background: #f0f0f0;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
}

.feature-list {
  margin: 0;
  padding-left: 20px;
}

.feature-list li {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 4px;
}

.screenshot-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.screenshot {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.screenshot:hover {
  transform: scale(1.05);
}

/* 链接内容 */
.link-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.link-header {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.link-icon {
  width: 48px;
  height: 48px;
  background: #722ed1;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  flex-shrink: 0;
}

.link-info h3 {
  font-size: 18px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 8px 0;
}

.link-meta {
  display: flex;
  gap: 12px;
}

.link-meta span {
  font-size: 12px;
  color: #666;
  padding: 2px 6px;
  background: #f0f0f0;
  border-radius: 3px;
}

.link-preview {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
}

.preview-card {
  display: flex;
  gap: 16px;
  padding: 16px;
}

.preview-image {
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
}

.preview-text h4 {
  font-size: 14px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 8px 0;
}

.preview-text p {
  font-size: 12px;
  color: #666;
  line-height: 1.5;
  margin: 0;
}

.link-description h4 {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 8px 0;
}

/* 练习内容 */
.practice-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.practice-header {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.practice-icon {
  width: 48px;
  height: 48px;
  background: #fa8c16;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  flex-shrink: 0;
}

.practice-info h3 {
  font-size: 18px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 8px 0;
}

.practice-meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.practice-meta span {
  font-size: 12px;
  color: #666;
  padding: 2px 6px;
  background: #f0f0f0;
  border-radius: 3px;
}

.topic-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.sample-questions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sample-question {
  padding: 12px;
  background: #fafafa;
  border-radius: 6px;
  border-left: 3px solid #1890ff;
}

.sample-question strong {
  font-size: 14px;
  color: #262626;
  display: block;
  margin-bottom: 4px;
}

.sample-question p {
  font-size: 12px;
  color: #666;
  line-height: 1.5;
  margin: 0;
}

/* 底部操作区域 */
.dialog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}
</style>
