<template>
  <div class="ai-recruitment-assistant">
    <!-- 页面头部 -->
    <div class="page-header">
      <el-card class="header-card">
        <div class="header-content">
          <div class="header-left">
            <el-icon class="header-icon"><Cpu /></el-icon>
            <div class="header-text">
              <h1>AI助手 - 招聘效率优化</h1>
              <p>基于iFlytek Spark大模型的智能招聘解决方案</p>
            </div>
          </div>
          <div class="header-right">
            <el-button type="primary" @click="goBack">
              <el-icon><ArrowLeft /></el-icon>
              返回首页
            </el-button>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 功能模块网格 -->
    <div class="features-grid">
      <!-- 面试流程优化 -->
      <el-card class="feature-card interview-optimization" @click="openFeature('interview')">
        <div class="feature-content">
          <div class="feature-icon">
            <el-icon><VideoPlay /></el-icon>
          </div>
          <div class="feature-info">
            <h3>面试流程优化</h3>
            <p>智能分析面试流程，提供优化建议</p>
            <ul class="feature-list">
              <li>面试时长优化</li>
              <li>问题序列调整</li>
              <li>评估标准制定</li>
            </ul>
          </div>
        </div>
      </el-card>

      <!-- 候选人筛选策略 -->
      <el-card class="feature-card candidate-screening" @click="openFeature('screening')">
        <div class="feature-content">
          <div class="feature-icon">
            <el-icon><User /></el-icon>
          </div>
          <div class="feature-info">
            <h3>候选人筛选策略</h3>
            <p>AI驱动的智能候选人筛选</p>
            <ul class="feature-list">
              <li>简历智能分析</li>
              <li>技能匹配评估</li>
              <li>潜力预测模型</li>
            </ul>
          </div>
        </div>
      </el-card>

      <!-- 评估标准制定 -->
      <el-card class="feature-card evaluation-standards" @click="openFeature('evaluation')">
        <div class="feature-content">
          <div class="feature-icon">
            <el-icon><Document /></el-icon>
          </div>
          <div class="feature-info">
            <h3>评估标准制定</h3>
            <p>个性化评估标准和权重配置</p>
            <ul class="feature-list">
              <li>能力维度定义</li>
              <li>权重智能分配</li>
              <li>评分标准优化</li>
            </ul>
          </div>
        </div>
      </el-card>

      <!-- 数据洞察分析 -->
      <el-card class="feature-card data-insights" @click="openFeature('insights')">
        <div class="feature-content">
          <div class="feature-icon">
            <el-icon><TrendCharts /></el-icon>
          </div>
          <div class="feature-info">
            <h3>数据洞察分析</h3>
            <p>深度挖掘招聘数据价值</p>
            <ul class="feature-list">
              <li>招聘效率分析</li>
              <li>候选人质量评估</li>
              <li>趋势预测报告</li>
            </ul>
          </div>
        </div>
      </el-card>

      <!-- 智能推荐系统 -->
      <el-card class="feature-card recommendation-system" @click="openFeature('recommendation')">
        <div class="feature-content">
          <div class="feature-icon">
            <el-icon><Star /></el-icon>
          </div>
          <div class="feature-info">
            <h3>智能推荐系统</h3>
            <p>AI驱动的个性化推荐</p>
            <ul class="feature-list">
              <li>岗位匹配推荐</li>
              <li>面试官分配</li>
              <li>培训计划建议</li>
            </ul>
          </div>
        </div>
      </el-card>

      <!-- 自动化工具 -->
      <el-card class="feature-card automation-tools" @click="openFeature('automation')">
        <div class="feature-content">
          <div class="feature-icon">
            <el-icon><Setting /></el-icon>
          </div>
          <div class="feature-info">
            <h3>自动化工具</h3>
            <p>提升招聘流程自动化水平</p>
            <ul class="feature-list">
              <li>邮件自动发送</li>
              <li>日程智能安排</li>
              <li>报告自动生成</li>
            </ul>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 快速操作面板 -->
    <div class="quick-actions-panel">
      <el-card class="actions-card">
        <template #header>
          <div class="actions-header">
            <el-icon><Operation /></el-icon>
            <span>快速操作</span>
          </div>
        </template>
        <div class="actions-grid">
          <el-button type="primary" @click="startOptimization">
            <el-icon><Cpu /></el-icon>
            开始优化分析
          </el-button>
          <el-button type="success" @click="viewReports">
            <el-icon><Document /></el-icon>
            查看分析报告
          </el-button>
          <el-button type="warning" @click="configureSettings">
            <el-icon><Setting /></el-icon>
            配置优化参数
          </el-button>
          <el-button type="info" @click="exportResults">
            <el-icon><Download /></el-icon>
            导出优化结果
          </el-button>
        </div>
      </el-card>
    </div>

    <!-- 功能详情对话框 -->
    <el-dialog
      v-model="showFeatureDialog"
      :title="currentFeature.title"
      width="60%"
      center
    >
      <div class="feature-detail">
        <div class="detail-header">
          <el-icon class="detail-icon"><component :is="currentFeature.icon" /></el-icon>
          <div class="detail-info">
            <h3>{{ currentFeature.title }}</h3>
            <p>{{ currentFeature.description }}</p>
          </div>
        </div>
        
        <div class="detail-content">
          <h4>主要功能</h4>
          <ul class="detail-features">
            <li v-for="feature in currentFeature.features" :key="feature">
              <el-icon><Check /></el-icon>
              {{ feature }}
            </li>
          </ul>
          
          <h4>预期效果</h4>
          <div class="expected-results">
            <el-tag
              v-for="result in currentFeature.results"
              :key="result"
              type="success"
              class="result-tag"
            >
              {{ result }}
            </el-tag>
          </div>
        </div>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showFeatureDialog = false">取消</el-button>
          <el-button type="primary" @click="enableFeature">
            启用此功能
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElNotification } from 'element-plus'
import {
  Cpu, ArrowLeft, VideoPlay, User, Document, TrendCharts,
  Star, Setting, Operation, Download, Check
} from '@element-plus/icons-vue'

const router = useRouter()

// 响应式数据
const showFeatureDialog = ref(false)
const currentFeature = ref({})

// 功能配置
const featureConfigs = {
  interview: {
    title: '面试流程优化',
    icon: 'VideoPlay',
    description: '通过AI分析优化面试流程，提升面试效率和质量',
    features: [
      '智能分析面试时长分布，优化时间安排',
      '根据岗位特点调整问题序列和难度',
      '制定个性化评估标准和权重',
      '实时监控面试质量指标',
      '提供面试官培训建议'
    ],
    results: ['效率提升30%', '质量改善25%', '成本降低20%']
  },
  screening: {
    title: '候选人筛选策略',
    icon: 'User',
    description: 'AI驱动的智能候选人筛选，提高匹配精度',
    features: [
      '简历关键信息智能提取和分析',
      '技能与岗位需求匹配度评估',
      '候选人潜力和发展空间预测',
      '多维度综合评分排序',
      '筛选标准动态优化'
    ],
    results: ['匹配度提升40%', '筛选效率提升50%', '误判率降低35%']
  },
  evaluation: {
    title: '评估标准制定',
    icon: 'Document',
    description: '个性化评估标准和权重配置，确保评估公平性',
    features: [
      '基于岗位需求定义能力维度',
      '智能分配各维度权重',
      '评分标准自动优化调整',
      '评估结果一致性检验',
      '评估偏差识别和纠正'
    ],
    results: ['评估准确性提升35%', '一致性改善30%', '偏差减少40%']
  },
  insights: {
    title: '数据洞察分析',
    icon: 'TrendCharts',
    description: '深度挖掘招聘数据价值，提供决策支持',
    features: [
      '招聘漏斗各环节效率分析',
      '候选人质量趋势监控',
      '招聘成本效益分析',
      '市场竞争力评估',
      '预测性分析和建议'
    ],
    results: ['决策效率提升45%', '成本优化25%', '预测准确率85%']
  },
  recommendation: {
    title: '智能推荐系统',
    icon: 'Star',
    description: 'AI驱动的个性化推荐，优化资源配置',
    features: [
      '候选人与岗位智能匹配',
      '面试官专业领域匹配',
      '个性化培训计划推荐',
      '职业发展路径建议',
      '团队配置优化建议'
    ],
    results: ['匹配成功率提升60%', '满意度提升40%', '流失率降低30%']
  },
  automation: {
    title: '自动化工具',
    icon: 'Setting',
    description: '提升招聘流程自动化水平，减少人工操作',
    features: [
      '面试邀请邮件自动发送',
      '面试日程智能安排',
      '评估报告自动生成',
      '候选人状态自动更新',
      '数据同步和备份'
    ],
    results: ['人工成本降低50%', '处理速度提升80%', '错误率降低90%']
  }
}

// 方法
const goBack = () => {
  router.push('/')
}

const openFeature = (featureKey) => {
  currentFeature.value = featureConfigs[featureKey]
  showFeatureDialog.value = true
}

const enableFeature = () => {
  ElNotification({
    title: '功能启用成功',
    message: `${currentFeature.value.title}已成功启用，系统将开始优化分析`,
    type: 'success',
    duration: 3000
  })
  showFeatureDialog.value = false
}

const startOptimization = () => {
  ElMessage.success('正在启动AI优化分析...')
  // 这里可以添加实际的优化逻辑
}

const viewReports = () => {
  router.push('/report-center')
}

const configureSettings = () => {
  ElMessage.info('配置功能开发中...')
}

const exportResults = () => {
  ElMessage.success('优化结果导出功能开发中...')
}
</script>

<style scoped>
.ai-recruitment-assistant {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 24px;
}

.page-header {
  margin-bottom: 32px;
}

.header-card {
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  font-size: 48px;
  color: #722ed1;
}

.header-text h1 {
  margin: 0 0 8px 0;
  color: #1f2937;
  font-size: 28px;
  font-weight: 600;
}

.header-text p {
  margin: 0;
  color: #6b7280;
  font-size: 16px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.feature-card {
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  border-color: #722ed1;
}

.feature-content {
  display: flex;
  gap: 20px;
}

.feature-icon {
  font-size: 40px;
  color: #722ed1;
  flex-shrink: 0;
}

.feature-info h3 {
  margin: 0 0 8px 0;
  color: #1f2937;
  font-size: 20px;
  font-weight: 600;
}

.feature-info p {
  margin: 0 0 16px 0;
  color: #6b7280;
  font-size: 14px;
}

.feature-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.feature-list li {
  color: #4b5563;
  font-size: 13px;
  margin-bottom: 4px;
  position: relative;
  padding-left: 16px;
}

.feature-list li::before {
  content: '•';
  color: #722ed1;
  position: absolute;
  left: 0;
}

.quick-actions-panel {
  margin-bottom: 32px;
}

.actions-card {
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.actions-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.actions-grid .el-button {
  height: 48px;
  font-size: 14px;
  border-radius: 8px;
}

.feature-detail {
  padding: 20px 0;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.detail-icon {
  font-size: 32px;
  color: #722ed1;
}

.detail-info h3 {
  margin: 0 0 8px 0;
  color: #1f2937;
  font-size: 20px;
}

.detail-info p {
  margin: 0;
  color: #6b7280;
}

.detail-content h4 {
  color: #1f2937;
  margin: 20px 0 12px 0;
  font-size: 16px;
}

.detail-features {
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;
}

.detail-features li {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: #4b5563;
}

.detail-features .el-icon {
  color: #10b981;
  font-size: 16px;
}

.expected-results {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.result-tag {
  font-size: 12px;
}

@media (max-width: 768px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .header-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
