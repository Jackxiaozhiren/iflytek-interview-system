<template>
  <div class="intelligent-cases-showcase">
    <!-- 案例展示头部 -->
    <div class="cases-header">
      <div class="header-content">
        <h2 class="cases-title">
          <span class="title-icon">🎯</span>
          成功案例展示
        </h2>
        <p class="cases-subtitle">
          真实面试场景，智能AI助手让每次面试都轻松
        </p>
      </div>
      
      <!-- 筛选标签 -->
      <div class="cases-filters">
        <button 
          v-for="category in categories" 
          :key="category.id"
          class="filter-btn"
          :class="{ active: activeCategory === category.id }"
          @click="setActiveCategory(category.id)"
        >
          <span class="filter-icon">{{ category.icon }}</span>
          <span class="filter-text">{{ category.name }}</span>
        </button>
      </div>
    </div>

    <!-- 案例网格 -->
    <div class="cases-grid">
      <div 
        v-for="(caseItem, index) in filteredCases" 
        :key="caseItem.id"
        class="case-card intelligent-style"
        :class="{ 'featured': caseItem.featured }"
        @click="openCaseDetail(caseItem)"
      >
        <!-- 案例缩略图 -->
        <div class="case-thumbnail">
          <img 
            :src="caseItem.thumbnail" 
            :alt="caseItem.title"
            class="thumbnail-image"
            @error="handleImageError"
          />
          <div class="thumbnail-overlay">
            <div class="play-button">
              <el-icon><VideoPlay /></el-icon>
            </div>
            <div class="case-duration">{{ caseItem.duration }}</div>
          </div>
          
          <!-- 特色标签 -->
          <div v-if="caseItem.featured" class="featured-badge">
            <el-icon><Star /></el-icon>
            <span>推荐</span>
          </div>
        </div>

        <!-- 案例信息 -->
        <div class="case-info">
          <div class="case-header">
            <h3 class="case-title">{{ caseItem.title }}</h3>
            <div class="case-category">
              <span class="category-tag" :style="{ backgroundColor: caseItem.categoryColor }">
                {{ caseItem.category }}
              </span>
            </div>
          </div>

          <p class="case-description">{{ caseItem.description }}</p>

          <!-- 案例统计 -->
          <div class="case-stats">
            <div class="stat-item">
              <el-icon><User /></el-icon>
              <span>{{ caseItem.candidateName }}</span>
            </div>
            <div class="stat-item">
              <el-icon><House /></el-icon>
              <span>{{ caseItem.company }}</span>
            </div>
            <div class="stat-item">
              <el-icon><TrendCharts /></el-icon>
              <span>成功率 {{ caseItem.successRate }}%</span>
            </div>
          </div>

          <!-- 技能标签 -->
          <div class="case-skills">
            <span 
              v-for="skill in caseItem.skills" 
              :key="skill"
              class="skill-tag"
            >
              {{ skill }}
            </span>
          </div>

          <!-- 交互按钮 -->
          <div class="case-actions">
            <button class="action-btn primary" @click.stop="playDemo(caseItem)">
              <el-icon><VideoPlay /></el-icon>
              <span>观看演示</span>
            </button>
            <button class="action-btn secondary" @click.stop="viewDetails(caseItem)">
              <el-icon><View /></el-icon>
              <span>查看详情</span>
            </button>
          </div>
        </div>

        <!-- 悬停效果 -->
        <div class="case-hover-effect"></div>
      </div>
    </div>

    <!-- 加载更多 -->
    <div class="load-more-section" v-if="hasMoreCases">
      <button class="load-more-btn" @click="loadMoreCases" :loading="loading">
        <el-icon v-if="!loading"><ArrowDown /></el-icon>
        <el-icon v-else><Loading /></el-icon>
        <span>{{ loading ? '加载中...' : '加载更多案例' }}</span>
      </button>
    </div>

    <!-- 案例详情弹窗 -->
    <el-dialog
      v-model="showCaseDetail"
      :title="selectedCase?.title"
      width="80%"
      class="case-detail-dialog"
    >
      <div v-if="selectedCase" class="case-detail-content">
        <!-- 案例演示区域 -->
        <div class="detail-demo-section">
          <div class="demo-placeholder">
            <div class="demo-content">
              <el-icon class="demo-icon"><Document /></el-icon>
              <h3>案例演示</h3>
              <p>{{ selectedCase.title }} - {{ selectedCase.position }}</p>
              <el-button type="primary" @click="startCaseDemo">
                <el-icon><Setting /></el-icon>
                开始体验
              </el-button>
            </div>
          </div>
        </div>

        <!-- 详细信息 -->
        <div class="detail-info-section">
          <div class="detail-meta">
            <div class="meta-item">
              <strong>候选人：</strong>{{ selectedCase.candidateName }}
            </div>
            <div class="meta-item">
              <strong>职位：</strong>{{ selectedCase.position }}
            </div>
            <div class="meta-item">
              <strong>公司：</strong>{{ selectedCase.company }}
            </div>
            <div class="meta-item">
              <strong>面试时长：</strong>{{ selectedCase.duration }}
            </div>
          </div>

          <div class="detail-description">
            <h4>案例描述</h4>
            <p>{{ selectedCase.fullDescription }}</p>
          </div>

          <div class="detail-highlights">
            <h4>亮点特色</h4>
            <ul>
              <li v-for="highlight in selectedCase.highlights" :key="highlight">
                {{ highlight }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { VideoPlay, Star, User, House, TrendCharts, View, ArrowDown, Loading } from '@element-plus/icons-vue'

export default {
  name: 'OffermoreStyleCases',
  components: {
    VideoPlay, Star, User, House, TrendCharts, View, ArrowDown, Loading
  },
  setup() {
    const activeCategory = ref('all')
    const showCaseDetail = ref(false)
    const selectedCase = ref(null)
    const loading = ref(false)
    const hasMoreCases = ref(true)

    // 分类数据
    const categories = ref([
      { id: 'all', name: '全部案例', icon: '📋' },
      { id: 'tech', name: '技术开发', icon: '💻' },
      { id: 'product', name: '产品运营', icon: '📊' },
      { id: 'sales', name: '销售市场', icon: '📈' },
      { id: 'management', name: '管理咨询', icon: '👔' }
    ])

    // 案例数据
    const cases = ref([
      {
        id: 1,
        title: '前端工程师技术面试',
        description: '通过AI实时辅助，成功回答React、Vue等前端技术问题，获得字节跳动offer',
        fullDescription: '该候选人在面试过程中遇到了复杂的前端架构问题，通过AI面试助手的实时提示和技术要点梳理，成功展示了扎实的技术功底和解决问题的能力。',
        category: '技术开发',
        categoryColor: '#1890ff',
        candidateName: 'Lucas',
        company: '字节跳动',
        position: '前端工程师',
        duration: '45分钟',
        successRate: 95,
        skills: ['React', 'Vue', 'JavaScript', 'TypeScript'],
        thumbnail: '/images/case-frontend.jpg',
        demoUrl: '/demo/frontend-interview',
        featured: true,
        highlights: [
          'AI实时识别技术问题关键词',
          '提供结构化的回答思路',
          '技术深度和广度并重的解答',
          '面试官高度认可技术能力'
        ]
      },
      {
        id: 2,
        title: '产品经理综合面试',
        description: '运用AI分析产品思维逻辑，成功通过微软产品经理面试',
        fullDescription: '面试过程中涉及产品设计、用户体验、数据分析等多个维度，AI助手帮助候选人整理思路，提供了清晰的产品思维框架。',
        category: '产品运营',
        categoryColor: '#52c41a',
        candidateName: '鱼不吃宵夜',
        company: '微软',
        position: '产品经理',
        duration: '60分钟',
        successRate: 92,
        skills: ['产品设计', '用户体验', '数据分析', '项目管理'],
        thumbnail: '/images/case-product.jpg',
        demoUrl: '/demo/product-interview',
        featured: true,
        highlights: [
          '产品思维逻辑清晰',
          '用户体验设计能力突出',
          '数据驱动决策思路',
          '跨部门协作经验丰富'
        ]
      },
      {
        id: 3,
        title: '数据分析师技术面试',
        description: '跨专业求职成功案例，AI助手深度理解数据科学概念',
        fullDescription: '候选人从非技术背景转向数据分析岗位，通过AI面试助手的专业知识补充和逻辑梳理，成功展示了数据分析能力。',
        category: '技术开发',
        categoryColor: '#1890ff',
        candidateName: '林Yori',
        company: '亚马逊',
        position: '数据分析师',
        duration: '50分钟',
        successRate: 88,
        skills: ['Python', 'SQL', '机器学习', '数据可视化'],
        thumbnail: '/images/case-data.jpg',
        demoUrl: '/demo/data-interview',
        featured: false,
        highlights: [
          '跨专业转型成功',
          '技术概念理解深入',
          '实际项目经验丰富',
          '学习能力强'
        ]
      },
      {
        id: 4,
        title: '算法工程师面试',
        description: '八次面试均获offer的秘诀，AI助手保持最佳状态',
        fullDescription: '通过AI面试助手的持续支持，候选人在多轮技术面试中保持了稳定的发挥，展现了扎实的算法基础和工程能力。',
        category: '技术开发',
        categoryColor: '#1890ff',
        candidateName: '刘晓宇',
        company: '美团',
        position: '算法工程师',
        duration: '55分钟',
        successRate: 98,
        skills: ['算法设计', '机器学习', 'Python', '系统设计'],
        thumbnail: '/images/case-algorithm.jpg',
        demoUrl: '/demo/algorithm-interview',
        featured: true,
        highlights: [
          '算法思维清晰',
          '代码实现能力强',
          '系统设计经验丰富',
          '面试心态稳定'
        ]
      }
    ])

    // 计算属性
    const filteredCases = computed(() => {
      if (activeCategory.value === 'all') {
        return cases.value
      }
      return cases.value.filter(caseItem => {
        const categoryMap = {
          'tech': '技术开发',
          'product': '产品运营',
          'sales': '销售市场',
          'management': '管理咨询'
        }
        return caseItem.category === categoryMap[activeCategory.value]
      })
    })

    // 方法
    const setActiveCategory = (categoryId) => {
      activeCategory.value = categoryId
    }

    const openCaseDetail = (caseItem) => {
      selectedCase.value = caseItem
      showCaseDetail.value = true
    }

    const playDemo = (caseItem) => {
      // 播放演示逻辑
      console.log('播放演示:', caseItem.title)
    }

    const viewDetails = (caseItem) => {
      openCaseDetail(caseItem)
    }

    const loadMoreCases = () => {
      loading.value = true
      // 模拟加载更多
      setTimeout(() => {
        loading.value = false
        hasMoreCases.value = false
      }, 1000)
    }

    const startCaseDemo = () => {
      ElMessage.success('正在启动案例演示...')
      // 这里可以跳转到相应的演示页面
    }

    const handleImageError = (event) => {
      // 使用统一的图片错误处理
      if (!event.target.src.includes('placeholder-case.jpg')) {
        event.target.src = '/images/placeholder-case.jpg'
      } else {
        // 如果连占位符也加载失败，使用内联SVG
        const svgPlaceholder = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
          <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="300" fill="#4c51bf"/>
            <text x="200" y="150" text-anchor="middle" dominant-baseline="middle"
                  fill="#ffffff" font-size="20" font-family="Microsoft YaHei, Arial, sans-serif">
              案例演示
            </text>
          </svg>
        `)}`
        event.target.src = svgPlaceholder
      }
    }

    return {
      activeCategory,
      showCaseDetail,
      selectedCase,
      loading,
      hasMoreCases,
      categories,
      cases,
      filteredCases,
      setActiveCategory,
      openCaseDetail,
      playDemo,
      viewDetails,
      loadMoreCases,
      startCaseDemo,
      handleImageError
    }
  }
}
</script>

<style scoped>
.intelligent-cases-showcase {
  padding: 40px 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.cases-header {
  text-align: center;
  margin-bottom: 40px;
}

.header-content {
  margin-bottom: 30px;
}

.cases-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 16px;
  font-family: 'Microsoft YaHei', sans-serif;
}

.title-icon {
  margin-right: 12px;
  font-size: 2rem;
}

.cases-subtitle {
  font-size: 1.2rem;
  color: #7f8c8d;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.cases-filters {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: 2px solid #e1e8ed;
  background: white;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 500;
  color: #5a6c7d;
}

.filter-btn:hover {
  border-color: #1890ff;
  color: #1890ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.2);
}

.filter-btn.active {
  background: #1890ff;
  border-color: #1890ff;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}

.cases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 30px;
  max-width: 1400px;
  margin: 0 auto;
}

.case-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
}

.case-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.case-card.featured {
  border: 2px solid #ffd700;
}

.case-thumbnail {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.case-card:hover .thumbnail-image {
  transform: scale(1.05);
}

.thumbnail-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.case-card:hover .thumbnail-overlay {
  opacity: 1;
}

.play-button {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #1890ff;
}

.case-duration {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.featured-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #ffd700;
  color: #333;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

.case-info {
  padding: 24px;
}

.case-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.case-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  flex: 1;
}

.category-tag {
  padding: 4px 12px;
  border-radius: 12px;
  color: white;
  font-size: 12px;
  font-weight: 500;
}

.case-description {
  color: #7f8c8d;
  line-height: 1.6;
  margin-bottom: 16px;
}

.case-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #5a6c7d;
}

.case-skills {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.skill-tag {
  padding: 4px 8px;
  background: #f0f2f5;
  border-radius: 8px;
  font-size: 12px;
  color: #5a6c7d;
}

.case-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.action-btn.primary {
  background: #1890ff;
  color: white;
}

.action-btn.primary:hover {
  background: #40a9ff;
  transform: translateY(-1px);
}

.action-btn.secondary {
  background: #f0f2f5;
  color: #5a6c7d;
}

.action-btn.secondary:hover {
  background: #e6f7ff;
  color: #1890ff;
}

.load-more-section {
  text-align: center;
  margin-top: 40px;
}

.load-more-btn {
  padding: 12px 32px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.load-more-btn:hover {
  background: #40a9ff;
  transform: translateY(-2px);
}

/* 弹窗样式 */
.case-detail-dialog {
  border-radius: 16px;
}

.case-detail-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.detail-video-section {
  position: relative;
}

.detail-video {
  width: 100%;
  border-radius: 8px;
}

.detail-info-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.meta-item {
  font-size: 14px;
  color: #5a6c7d;
}

.detail-description h4,
.detail-highlights h4 {
  color: #2c3e50;
  margin-bottom: 12px;
}

.detail-highlights ul {
  padding-left: 20px;
}

.detail-highlights li {
  margin-bottom: 8px;
  color: #5a6c7d;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .cases-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .case-card {
    margin: 0 10px;
  }
  
  .cases-filters {
    gap: 8px;
  }
  
  .filter-btn {
    padding: 8px 16px;
    font-size: 14px;
  }
  
  .case-detail-content {
    grid-template-columns: 1fr;
  }
}
</style>
