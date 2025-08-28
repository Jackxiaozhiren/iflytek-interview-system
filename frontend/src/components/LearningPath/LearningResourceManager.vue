<template>
  <div class="learning-resource-manager">
    <!-- 资源搜索和筛选 -->
    <el-card class="search-section" shadow="hover">
      <div class="search-controls">
        <div class="search-input">
          <el-input
            v-model="searchQuery"
            placeholder="搜索学习资源..."
            size="large"
            clearable
            @input="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
        
        <div class="filter-controls">
          <el-select v-model="selectedCategory" placeholder="资源类型" size="large">
            <el-option label="全部" value="all" />
            <el-option label="书籍" value="books" />
            <el-option label="课程" value="courses" />
            <el-option label="文档" value="docs" />
            <el-option label="工具" value="tools" />
            <el-option label="项目" value="projects" />
          </el-select>
          
          <el-select v-model="selectedLevel" placeholder="难度等级" size="large">
            <el-option label="全部" value="all" />
            <el-option label="初级" value="beginner" />
            <el-option label="中级" value="intermediate" />
            <el-option label="高级" value="advanced" />
          </el-select>
          
          <el-select v-model="selectedDomain" placeholder="技术领域" size="large">
            <el-option label="全部" value="all" />
            <el-option label="人工智能" value="ai" />
            <el-option label="大数据" value="bigdata" />
            <el-option label="物联网" value="iot" />
          </el-select>
        </div>
      </div>
    </el-card>

    <!-- 资源统计 -->
    <el-card class="stats-section" shadow="hover">
      <div class="resource-stats">
        <div class="stat-item">
          <div class="stat-icon">📚</div>
          <div class="stat-content">
            <span class="stat-number">{{ stats.books }}</span>
            <span class="stat-label">推荐书籍</span>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon">🎓</div>
          <div class="stat-content">
            <span class="stat-number">{{ stats.courses }}</span>
            <span class="stat-label">在线课程</span>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon">📖</div>
          <div class="stat-content">
            <span class="stat-number">{{ stats.docs }}</span>
            <span class="stat-label">技术文档</span>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon">🛠️</div>
          <div class="stat-content">
            <span class="stat-number">{{ stats.tools }}</span>
            <span class="stat-label">开发工具</span>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 资源列表 -->
    <el-card class="resources-section" shadow="hover">
      <template #header>
        <div class="resources-header">
          <h3>
            <el-icon><Collection /></el-icon>
            学习资源 ({{ filteredResources.length }})
          </h3>
          <div class="view-controls">
            <el-radio-group v-model="viewMode" size="small">
              <el-radio-button value="grid">网格</el-radio-button>
              <el-radio-button value="list">列表</el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </template>

      <!-- 网格视图 -->
      <div v-if="viewMode === 'grid'" class="resources-grid">
        <div 
          v-for="resource in paginatedResources"
          :key="resource.id"
          class="resource-card"
          :class="`resource-${resource.type}`"
        >
          <div class="resource-header">
            <div class="resource-icon">{{ getResourceIcon(resource.type) }}</div>
            <div class="resource-meta">
              <el-tag size="small" :type="getTypeColor(resource.type)">
                {{ getTypeText(resource.type) }}
              </el-tag>
              <el-tag size="small" :type="getLevelColor(resource.level)">
                {{ resource.level }}
              </el-tag>
            </div>
          </div>
          
          <div class="resource-content">
            <h4 class="resource-title">{{ resource.title }}</h4>
            <p class="resource-description">{{ resource.description }}</p>
            
            <div class="resource-details">
              <div class="detail-item" v-if="resource.author">
                <el-icon><User /></el-icon>
                <span>{{ resource.author }}</span>
              </div>
              <div class="detail-item" v-if="resource.platform">
                <el-icon><Platform /></el-icon>
                <span>{{ resource.platform }}</span>
              </div>
              <div class="detail-item" v-if="resource.duration">
                <el-icon><Clock /></el-icon>
                <span>{{ resource.duration }}</span>
              </div>
              <div class="detail-item" v-if="resource.rating">
                <el-rate v-model="resource.rating" disabled size="small" />
              </div>
            </div>
          </div>
          
          <div class="resource-actions">
            <el-button 
              size="small" 
              type="primary"
              @click="accessResource(resource)"
            >
              {{ getActionText(resource.type) }}
            </el-button>
            <el-button 
              size="small"
              :icon="resource.bookmarked ? 'StarFilled' : 'Star'"
              @click="toggleBookmark(resource)"
            >
              {{ resource.bookmarked ? '已收藏' : '收藏' }}
            </el-button>
          </div>
        </div>
      </div>

      <!-- 列表视图 -->
      <div v-else class="resources-list">
        <div 
          v-for="resource in paginatedResources"
          :key="resource.id"
          class="resource-list-item"
        >
          <div class="resource-info">
            <div class="resource-icon">{{ getResourceIcon(resource.type) }}</div>
            <div class="resource-details">
              <div class="resource-title-row">
                <h4>{{ resource.title }}</h4>
                <div class="resource-tags">
                  <el-tag size="small" :type="getTypeColor(resource.type)">
                    {{ getTypeText(resource.type) }}
                  </el-tag>
                  <el-tag size="small" :type="getLevelColor(resource.level)">
                    {{ resource.level }}
                  </el-tag>
                </div>
              </div>
              <p class="resource-description">{{ resource.description }}</p>
              <div class="resource-meta-row">
                <span v-if="resource.author">作者: {{ resource.author }}</span>
                <span v-if="resource.platform">平台: {{ resource.platform }}</span>
                <span v-if="resource.duration">时长: {{ resource.duration }}</span>
                <el-rate v-if="resource.rating" v-model="resource.rating" disabled size="small" />
              </div>
            </div>
          </div>
          <div class="resource-actions">
            <el-button 
              size="small" 
              type="primary"
              @click="accessResource(resource)"
            >
              {{ getActionText(resource.type) }}
            </el-button>
            <el-button 
              size="small"
              :icon="resource.bookmarked ? 'StarFilled' : 'Star'"
              @click="toggleBookmark(resource)"
            >
              {{ resource.bookmarked ? '已收藏' : '收藏' }}
            </el-button>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination-section">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[12, 24, 48, 96]"
          :total="filteredResources.length"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- iFlytek专区 -->
    <el-card class="iflytek-section" shadow="hover">
      <template #header>
        <h3>
          <el-icon><Star /></el-icon>
          iFlytek技术专区
        </h3>
      </template>

      <div class="iflytek-resources">
        <div 
          v-for="resource in iflytekResources"
          :key="resource.id"
          class="iflytek-resource-card"
        >
          <div class="iflytek-logo">🎤</div>
          <div class="iflytek-content">
            <h4>{{ resource.title }}</h4>
            <p>{{ resource.description }}</p>
            <div class="iflytek-features">
              <el-tag 
                v-for="feature in resource.features"
                :key="feature"
                size="small"
                type="success"
              >
                {{ feature }}
              </el-tag>
            </div>
          </div>
          <div class="iflytek-actions">
            <el-button type="primary" size="small">
              访问官网
            </el-button>
            <el-button size="small">
              查看文档
            </el-button>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Search, Collection, User, Clock, Star, StarFilled
} from '@element-plus/icons-vue'

// 响应式数据
const searchQuery = ref('')
const selectedCategory = ref('all')
const selectedLevel = ref('all')
const selectedDomain = ref('all')
const viewMode = ref('grid')
const currentPage = ref(1)
const pageSize = ref(12)

// 资源数据
const resources = ref([
  {
    id: 1,
    type: 'books',
    title: '机器学习实战',
    description: '通过实际案例学习机器学习算法的应用',
    author: 'Peter Harrington',
    level: 'beginner',
    domain: 'ai',
    rating: 4.5,
    bookmarked: false,
    url: 'https://example.com/book1'
  },
  {
    id: 2,
    type: 'courses',
    title: 'Andrew Ng机器学习课程',
    description: '斯坦福大学机器学习经典课程',
    platform: 'Coursera',
    level: 'beginner',
    domain: 'ai',
    duration: '11周',
    rating: 4.9,
    bookmarked: true,
    url: 'https://coursera.org/learn/machine-learning'
  },
  {
    id: 3,
    type: 'docs',
    title: 'TensorFlow官方文档',
    description: 'TensorFlow深度学习框架完整文档',
    platform: 'TensorFlow',
    level: 'intermediate',
    domain: 'ai',
    bookmarked: false,
    url: 'https://tensorflow.org/docs'
  },
  {
    id: 4,
    type: 'tools',
    title: 'Jupyter Notebook',
    description: '交互式Python开发环境',
    level: 'beginner',
    domain: 'ai',
    bookmarked: true,
    url: 'https://jupyter.org'
  },
  {
    id: 5,
    type: 'projects',
    title: '房价预测项目',
    description: '使用线性回归预测房价的完整项目',
    level: 'beginner',
    domain: 'ai',
    bookmarked: false,
    url: 'https://github.com/example/house-price-prediction'
  }
])

const iflytekResources = ref([
  {
    id: 'iflytek_1',
    title: 'iFlytek开放平台',
    description: '提供语音识别、语音合成、自然语言处理等AI能力',
    features: ['语音识别', '语音合成', 'NLP', '机器翻译'],
    url: 'https://www.xfyun.cn'
  },
  {
    id: 'iflytek_2',
    title: 'Spark大模型API',
    description: '科大讯飞星火认知大模型API接口服务',
    features: ['对话生成', '文本创作', '代码生成', '知识问答'],
    url: 'https://xinghuo.xfyun.cn'
  },
  {
    id: 'iflytek_3',
    title: 'iFlytek SDK开发包',
    description: '多平台语音技术开发包，支持Android、iOS、Web等',
    features: ['多平台支持', '离线识别', '实时语音', '声纹识别'],
    url: 'https://doc.xfyun.cn'
  }
])

// 统计数据
const stats = computed(() => {
  const counts = resources.value.reduce((acc, resource) => {
    acc[resource.type] = (acc[resource.type] || 0) + 1
    return acc
  }, {})
  
  return {
    books: counts.books || 0,
    courses: counts.courses || 0,
    docs: counts.docs || 0,
    tools: counts.tools || 0,
    projects: counts.projects || 0
  }
})

// 筛选后的资源
const filteredResources = computed(() => {
  return resources.value.filter(resource => {
    const matchesSearch = !searchQuery.value || 
      resource.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesCategory = selectedCategory.value === 'all' || 
      resource.type === selectedCategory.value
    
    const matchesLevel = selectedLevel.value === 'all' || 
      resource.level === selectedLevel.value
    
    const matchesDomain = selectedDomain.value === 'all' || 
      resource.domain === selectedDomain.value
    
    return matchesSearch && matchesCategory && matchesLevel && matchesDomain
  })
})

// 分页后的资源
const paginatedResources = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredResources.value.slice(start, end)
})

// 方法
const handleSearch = () => {
  currentPage.value = 1
}

const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}

const getResourceIcon = (type) => {
  const icons = {
    books: '📚',
    courses: '🎓',
    docs: '📖',
    tools: '🛠️',
    projects: '💼'
  }
  return icons[type] || '📄'
}

const getTypeColor = (type) => {
  const colors = {
    books: 'success',
    courses: 'primary',
    docs: 'info',
    tools: 'warning',
    projects: 'danger'
  }
  return colors[type] || 'default'
}

const getTypeText = (type) => {
  const texts = {
    books: '书籍',
    courses: '课程',
    docs: '文档',
    tools: '工具',
    projects: '项目'
  }
  return texts[type] || type
}

const getLevelColor = (level) => {
  const colors = {
    beginner: 'success',
    intermediate: 'warning',
    advanced: 'danger'
  }
  return colors[level] || 'default'
}

const getActionText = (type) => {
  const texts = {
    books: '阅读',
    courses: '学习',
    docs: '查看',
    tools: '使用',
    projects: '查看'
  }
  return texts[type] || '访问'
}

const accessResource = (resource) => {
  ElMessage.success(`正在访问: ${resource.title}`)
  // 这里可以打开新窗口或跳转到资源页面
  if (resource.url) {
    window.open(resource.url, '_blank')
  }
}

const toggleBookmark = (resource) => {
  resource.bookmarked = !resource.bookmarked
  ElMessage.success(resource.bookmarked ? '已添加到收藏' : '已取消收藏')
}

// 生命周期
onMounted(() => {
  // 初始化数据
})
</script>

<style scoped>
.learning-resource-manager {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px;
}

.search-controls {
  display: flex;
  gap: 16px;
  align-items: center;
}

.search-input {
  flex: 1;
  max-width: 400px;
}

.filter-controls {
  display: flex;
  gap: 12px;
}

.resource-stats {
  display: flex;
  justify-content: space-around;
  padding: 20px 0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-icon {
  font-size: 2rem;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #4c51bf;
}

.stat-label {
  font-size: 0.9rem;
  color: #7f8c8d;
}

.resources-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.resources-header h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}

.resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.resource-card {
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  background: white;
}

.resource-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-color: #4c51bf;
}

.resource-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.resource-icon {
  font-size: 2rem;
}

.resource-meta {
  display: flex;
  gap: 8px;
}

.resource-title {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.resource-description {
  color: #7f8c8d;
  line-height: 1.6;
  margin-bottom: 16px;
}

.resource-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #7f8c8d;
}

.resource-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.resources-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.resource-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.resource-list-item:hover {
  border-color: #4c51bf;
  box-shadow: 0 4px 12px rgba(76, 81, 191, 0.1);
}

.resource-info {
  display: flex;
  gap: 16px;
  flex: 1;
}

.resource-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.resource-tags {
  display: flex;
  gap: 8px;
}

.resource-meta-row {
  display: flex;
  gap: 16px;
  align-items: center;
  font-size: 0.9rem;
  color: #7f8c8d;
}

.pagination-section {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.iflytek-resources {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.iflytek-resource-card {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e8f4fd 100%);
  border: 1px solid #409eff;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.iflytek-resource-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(64, 158, 255, 0.2);
}

.iflytek-logo {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.iflytek-content {
  flex: 1;
}

.iflytek-content h4 {
  margin: 0 0 8px 0;
  color: #2c3e50;
}

.iflytek-content p {
  color: #7f8c8d;
  margin-bottom: 12px;
  line-height: 1.6;
}

.iflytek-features {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.iflytek-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-self: flex-start;
}

@media (max-width: 768px) {
  .search-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-controls {
    flex-wrap: wrap;
  }
  
  .resource-stats {
    flex-wrap: wrap;
    gap: 20px;
  }
  
  .resources-grid {
    grid-template-columns: 1fr;
  }
  
  .iflytek-resources {
    grid-template-columns: 1fr;
  }
}
</style>
