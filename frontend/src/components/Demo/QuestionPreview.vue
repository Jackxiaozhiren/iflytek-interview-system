<template>
  <div class="question-preview">
    <!-- 题目预览头部 -->
    <div class="preview-header" data-aos="fade-up">
      <h2>
        <el-icon><Document /></el-icon>
        面试题目预览
      </h2>
      <p>浏览和筛选专业面试题目，为您的面试做好充分准备</p>
    </div>

    <!-- 筛选和搜索区域 -->
    <div class="filter-section" data-aos="fade-up" data-aos-delay="200">
      <div class="filter-controls">
        <div class="filter-group">
          <label>技术领域：</label>
          <el-select v-model="selectedDomain" placeholder="选择技术领域" @change="filterQuestions">
            <el-option label="全部" value="all"></el-option>
            <el-option label="人工智能" value="AI"></el-option>
            <el-option label="大数据" value="大数据"></el-option>
            <el-option label="物联网" value="物联网"></el-option>
            <el-option label="通用" value="通用"></el-option>
          </el-select>
        </div>

        <div class="filter-group">
          <label>难度等级：</label>
          <el-select v-model="selectedDifficulty" placeholder="选择难度" @change="filterQuestions">
            <el-option label="全部" value="all"></el-option>
            <el-option label="基础" value="基础"></el-option>
            <el-option label="中级" value="中级"></el-option>
            <el-option label="高级" value="高级"></el-option>
          </el-select>
        </div>

        <div class="filter-group">
          <label>题目类型：</label>
          <el-select v-model="selectedType" placeholder="选择类型" @change="filterQuestions">
            <el-option label="全部" value="all"></el-option>
            <el-option label="技术概念" value="技术概念"></el-option>
            <el-option label="实际应用" value="实际应用"></el-option>
            <el-option label="项目经验" value="项目经验"></el-option>
            <el-option label="问题解决" value="问题解决"></el-option>
            <el-option label="系统设计" value="系统设计"></el-option>
            <el-option label="架构设计" value="架构设计"></el-option>
          </el-select>
        </div>

        <div class="search-group">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索题目关键词..."
            @input="filterQuestions"
            clearable
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
      </div>

      <!-- 统计信息 -->
      <div class="filter-stats">
        <span class="stats-item">
          <el-icon><Document /></el-icon>
          共 {{ filteredQuestions.length }} 道题目
        </span>
        <span class="stats-item">
          <el-icon><Timer /></el-icon>
          预计用时 {{ totalEstimatedTime }}
        </span>
      </div>
    </div>

    <!-- 题目列表 -->
    <div class="questions-list" data-aos="fade-up" data-aos-delay="400">
      <div
        v-for="(question, index) in paginatedQuestions"
        :key="index"
        class="question-card"
        :class="{ 'expanded': expandedQuestions.includes(index) }"
        @click="toggleExpand(index)"
      >
        <!-- 题目卡片头部 -->
        <div class="question-header">
          <div class="question-title">
            <h4>{{ question.title }}</h4>
            <div class="question-badges">
              <el-tag
                :type="getDifficultyType(question.difficulty)"
                size="small"
                effect="dark"
              >
                {{ question.difficulty }}
              </el-tag>
              <el-tag type="info" size="small">{{ question.domain }}</el-tag>
              <el-tag type="warning" size="small">{{ question.type }}</el-tag>
            </div>
          </div>
          
          <div class="question-actions">
            <el-tooltip content="收藏题目" placement="top">
              <el-button
                :type="favoriteQuestions.includes(index) ? 'primary' : 'default'"
                :icon="favoriteQuestions.includes(index) ? Star : StarFilled"
                circle
                size="small"
                @click.stop="toggleFavorite(index)"
              />
            </el-tooltip>
            <el-tooltip content="展开详情" placement="top">
              <el-button
                :icon="expandedQuestions.includes(index) ? ArrowUp : ArrowDown"
                circle
                size="small"
                @click.stop="toggleExpand(index)"
              />
            </el-tooltip>
          </div>
        </div>

        <!-- 题目元数据 -->
        <div class="question-meta">
          <div class="meta-item">
            <el-icon><Timer /></el-icon>
            <span>{{ question.estimatedTime }}</span>
          </div>
          <div class="meta-item">
            <el-icon><Star /></el-icon>
            <span>考察重点: {{ question.focusPoints?.join('、') || '综合能力' }}</span>
          </div>
        </div>

        <!-- 题目内容预览 -->
        <div class="question-preview-content">
          <p>{{ question.content.substring(0, 100) }}{{ question.content.length > 100 ? '...' : '' }}</p>
        </div>

        <!-- 展开的详细内容 -->
        <div v-if="expandedQuestions.includes(index)" class="question-details">
          <div class="full-content">
            <h5>完整题目：</h5>
            <p>{{ question.content }}</p>
          </div>

          <div v-if="question.keywords" class="keywords-section">
            <h5>关键词：</h5>
            <div class="keywords">
              <el-tag
                v-for="keyword in question.keywords"
                :key="keyword"
                size="small"
                type="success"
                effect="plain"
              >
                {{ keyword }}
              </el-tag>
            </div>
          </div>

          <div class="action-buttons">
            <el-button type="primary" @click="startPractice(question)">
              <el-icon><VideoCamera /></el-icon>
              开始练习
            </el-button>
            <el-button @click="viewSimilar(question)">
              <el-icon><Connection /></el-icon>
              相似题目
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination-section" v-if="filteredQuestions.length > pageSize">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="filteredQuestions.length"
        layout="prev, pager, next, jumper, total"
        @current-change="handlePageChange"
      />
    </div>

    <!-- 相似题目对话框 -->
    <el-dialog
      v-model="similarQuestionsVisible"
      title="相似题目推荐"
      width="60%"
      :before-close="closeSimilarDialog"
    >
      <div class="similar-questions">
        <div
          v-for="(similar, index) in similarQuestions"
          :key="index"
          class="similar-question-item"
        >
          <h5>{{ similar.title }}</h5>
          <p>{{ similar.content }}</p>
          <div class="similar-meta">
            <el-tag size="small" :type="getDifficultyType(similar.difficulty)">
              {{ similar.difficulty }}
            </el-tag>
            <el-tag size="small" type="info">{{ similar.domain }}</el-tag>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Document, Search, Timer, Star, StarFilled, ArrowUp, ArrowDown, VideoCamera, Connection
} from '@element-plus/icons-vue'

// 响应式数据
const selectedDomain = ref('all')
const selectedDifficulty = ref('all')
const selectedType = ref('all')
const searchKeyword = ref('')
const expandedQuestions = ref([])
const favoriteQuestions = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const similarQuestionsVisible = ref(false)
const similarQuestions = ref([])

// Props
const props = defineProps({
  questions: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits(['start-practice', 'question-selected'])

// 计算属性
const filteredQuestions = computed(() => {
  let questions = props.questions

  // 按领域筛选
  if (selectedDomain.value !== 'all') {
    questions = questions.filter(q => q.domain === selectedDomain.value)
  }

  // 按难度筛选
  if (selectedDifficulty.value !== 'all') {
    questions = questions.filter(q => q.difficulty === selectedDifficulty.value)
  }

  // 按类型筛选
  if (selectedType.value !== 'all') {
    questions = questions.filter(q => q.type === selectedType.value)
  }

  // 按关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    questions = questions.filter(q =>
      q.title.toLowerCase().includes(keyword) ||
      q.content.toLowerCase().includes(keyword) ||
      (q.keywords && q.keywords.some(k => k.toLowerCase().includes(keyword)))
    )
  }

  return questions
})

const paginatedQuestions = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredQuestions.value.slice(start, end)
})

const totalEstimatedTime = computed(() => {
  const totalMinutes = filteredQuestions.value.reduce((total, q) => {
    const time = parseInt(q.estimatedTime) || 0
    return total + time
  }, 0)
  return `${totalMinutes}分钟`
})

// 方法
const filterQuestions = () => {
  currentPage.value = 1
}

const toggleExpand = (index) => {
  const globalIndex = (currentPage.value - 1) * pageSize.value + index
  const expandIndex = expandedQuestions.value.indexOf(globalIndex)
  if (expandIndex > -1) {
    expandedQuestions.value.splice(expandIndex, 1)
  } else {
    expandedQuestions.value.push(globalIndex)
  }
}

const toggleFavorite = (index) => {
  const globalIndex = (currentPage.value - 1) * pageSize.value + index
  const favoriteIndex = favoriteQuestions.value.indexOf(globalIndex)
  if (favoriteIndex > -1) {
    favoriteQuestions.value.splice(favoriteIndex, 1)
    ElMessage.success('已取消收藏')
  } else {
    favoriteQuestions.value.push(globalIndex)
    ElMessage.success('已添加到收藏')
  }
}

const getDifficultyType = (difficulty) => {
  const types = {
    '基础': 'success',
    '中级': 'warning',
    '高级': 'danger',
    '入门': 'info'
  }
  return types[difficulty] || 'info'
}

const startPractice = (question) => {
  emit('start-practice', question)
  ElMessage.success('开始练习模式')
}

const viewSimilar = (question) => {
  // 模拟查找相似题目
  similarQuestions.value = props.questions
    .filter(q => 
      q.domain === question.domain && 
      q.difficulty === question.difficulty &&
      q.title !== question.title
    )
    .slice(0, 3)
  
  similarQuestionsVisible.value = true
}

const closeSimilarDialog = () => {
  similarQuestionsVisible.value = false
  similarQuestions.value = []
}

const handlePageChange = (page) => {
  currentPage.value = page
  // 清除当前页的展开状态
  expandedQuestions.value = expandedQuestions.value.filter(index => 
    index < (page - 1) * pageSize.value || index >= page * pageSize.value
  )
}

onMounted(() => {
  // 从localStorage加载收藏的题目
  const saved = localStorage.getItem('favoriteQuestions')
  if (saved) {
    favoriteQuestions.value = JSON.parse(saved)
  }
})

// 监听收藏变化，保存到localStorage
watch(favoriteQuestions, (newVal) => {
  localStorage.setItem('favoriteQuestions', JSON.stringify(newVal))
}, { deep: true })
</script>

<style scoped>
.question-preview {
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.preview-header {
  text-align: center;
  margin-bottom: 3rem;
}

.preview-header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #4c51bf 0%, #6b21a8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.preview-header p {
  font-size: 1.1rem;
  color: #6c757d;
  max-width: 600px;
  margin: 0 auto;
}

.filter-section {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.filter-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.9rem;
}

.search-group {
  grid-column: span 2;
}

.filter-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
  color: #6c757d;
}

.stats-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.questions-list {
  display: grid;
  gap: 1.5rem;
}

.question-card {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
}

.question-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  border-color: #4c51bf;
}

.question-card.expanded {
  border-color: #4c51bf;
  box-shadow: 0 10px 30px rgba(76, 81, 191, 0.2);
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.question-title h4 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.question-badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.question-actions {
  display: flex;
  gap: 0.5rem;
}

.question-meta {
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
  color: #6c757d;
  font-size: 0.9rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.question-preview-content {
  color: #495057;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.question-details {
  border-top: 1px solid #e9ecef;
  padding-top: 1.5rem;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.full-content h5,
.keywords-section h5 {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.keywords {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.pagination-section {
  display: flex;
  justify-content: center;
  margin-top: 3rem;
}

.similar-questions {
  display: grid;
  gap: 1.5rem;
}

.similar-question-item {
  padding: 1rem;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  background: #f8f9fa;
}

.similar-question-item h5 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.similar-question-item p {
  color: #495057;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.similar-meta {
  display: flex;
  gap: 0.5rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .question-preview {
    padding: 1rem;
  }

  .preview-header h2 {
    font-size: 2rem;
  }

  .filter-controls {
    grid-template-columns: 1fr;
  }

  .search-group {
    grid-column: span 1;
  }

  .filter-stats {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }

  .question-header {
    flex-direction: column;
    gap: 1rem;
  }

  .question-meta {
    flex-direction: column;
    gap: 0.5rem;
  }

  .action-buttons {
    flex-direction: column;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .question-preview {
    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  }

  .filter-section,
  .question-card {
    background: #34495e;
    color: #ecf0f1;
  }

  .question-card:hover {
    border-color: #3498db;
  }

  .question-card.expanded {
    border-color: #3498db;
    box-shadow: 0 10px 30px rgba(52, 152, 219, 0.2);
  }
}

/* ==================== 紫色背景高对比度修复 ==================== */
/* 确保所有在紫色背景上的文字都是白色，符合WCAG 2.1 AA标准 */
.question-preview [style*="background"][style*="#6b21a8"] *,
.question-preview [style*="background"][style*="#4c51bf"] *,
.question-preview .difficulty-badge,
.question-preview .difficulty-badge *,
.question-preview .domain-tag,
.question-preview .domain-tag * {
  color: #ffffff !important;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6) !important;
  font-weight: 500 !important;
}

/* 难度标签和领域标签 */
.question-preview .difficulty-badge.高级,
.question-preview .difficulty-badge.中级,
.question-preview .domain-tag.AI,
.question-preview .domain-tag.大数据,
.question-preview .domain-tag.物联网 {
  color: #ffffff !important;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6) !important;
}

/* 题目卡片中的紫色元素 */
.question-preview .question-icon,
.question-preview .question-icon * {
  color: #ffffff !important;
  fill: #ffffff !important;
}
</style>
