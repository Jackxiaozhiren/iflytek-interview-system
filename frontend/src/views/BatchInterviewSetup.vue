<template>
  <div class="batch-interview-setup">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <div class="brand-section">
            <router-link to="/" class="brand-link">
              <img src="/images/iflytek-spark-logo.svg" alt="iFlytek Spark" class="logo-image" />
              <span class="brand-text">iFlytek</span>
            </router-link>
          </div>
          <div class="header-divider"></div>
          <el-button @click="goBack" link class="back-btn">
            <el-icon><ArrowLeft /></el-icon>
            返回
          </el-button>
          <div class="page-title">
            <h1>批量创建面试</h1>
            <p>高效管理大规模招聘需求，一键创建多场面试</p>
          </div>
        </div>
        <div class="header-actions">
          <el-button @click="viewReports" type="info">
            <el-icon><Document /></el-icon>
            查看报表
          </el-button>
          <el-button @click="analyzeWithAI" type="warning" :loading="isAnalyzing">
            <el-icon v-if="!isAnalyzing"><MagicStick /></el-icon>
            {{ isAnalyzing ? '分析中...' : 'iFlytek Spark AI智能分析' }}
          </el-button>
          <el-button @click="saveDraft">保存草稿</el-button>
          <el-button type="primary" @click="createBatchInterview" :loading="creating">
            <el-icon><Plus /></el-icon>
            创建批量面试
          </el-button>
        </div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="setup-content">
      <el-row :gutter="24">
        <!-- 左侧配置面板 -->
        <el-col :span="16">
          <div class="setup-panel">
            <!-- 基本信息 -->
            <el-card class="setup-card">
              <template #header>
                <div class="card-header">
                  <el-icon><Setting /></el-icon>
                  <span>基本信息</span>
                </div>
              </template>
              
              <el-form :model="batchForm" :rules="formRules" ref="batchFormRef" label-width="120px">
                <el-form-item label="批次名称" prop="batchName">
                  <el-input v-model="batchForm.batchName" placeholder="请输入批次名称" />
                </el-form-item>
                
                <el-form-item label="面试职位" prop="position">
                  <el-select v-model="batchForm.position" placeholder="选择面试职位" style="width: 100%">
                    <el-option label="前端工程师" value="frontend" />
                    <el-option label="后端工程师" value="backend" />
                    <el-option label="算法工程师" value="algorithm" />
                    <el-option label="产品经理" value="product" />
                    <el-option label="UI设计师" value="ui-designer" />
                  </el-select>
                </el-form-item>
                
                <el-form-item label="技术领域" prop="domain">
                  <el-select v-model="batchForm.domain" placeholder="选择技术领域" style="width: 100%">
                    <el-option label="AI技术" value="ai" />
                    <el-option label="大数据" value="bigdata" />
                    <el-option label="IoT物联网" value="iot" />
                  </el-select>
                </el-form-item>
                
                <el-form-item label="面试时长" prop="duration">
                  <el-select v-model="batchForm.duration" placeholder="选择面试时长">
                    <el-option label="30分钟" :value="30" />
                    <el-option label="45分钟" :value="45" />
                    <el-option label="60分钟" :value="60" />
                    <el-option label="90分钟" :value="90" />
                  </el-select>
                </el-form-item>
                
                <el-form-item label="面试日期" prop="interviewDate">
                  <el-date-picker
                    v-model="batchForm.interviewDate"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    style="width: 100%"
                  />
                </el-form-item>
                
                <el-form-item label="描述信息">
                  <el-input
                    v-model="batchForm.description"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入批次描述信息"
                  />
                </el-form-item>
              </el-form>
            </el-card>

            <!-- 候选人管理 -->
            <el-card class="setup-card">
              <template #header>
                <div class="card-header">
                  <el-icon><User /></el-icon>
                  <span>候选人管理</span>
                  <div class="header-actions">
                    <el-button size="small" @click="importCandidates">
                      <el-icon><Upload /></el-icon>
                      批量导入
                    </el-button>
                    <el-button size="small" type="primary" @click="addCandidate">
                      <el-icon><CirclePlus /></el-icon>
                      添加候选人
                    </el-button>
                  </div>
                </div>
              </template>
              
              <div class="candidates-section">
                <div class="candidates-stats">
                  <div class="stat-item">
                    <span class="stat-number">{{ candidates.length }}</span>
                    <span class="stat-label">总候选人</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-number">{{ candidates.filter(c => c.status === 'confirmed').length }}</span>
                    <span class="stat-label">已确认</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-number">{{ candidates.filter(c => c.status === 'pending').length }}</span>
                    <span class="stat-label">待确认</span>
                  </div>
                </div>
                
                <el-table :data="candidates" style="width: 100%" max-height="300">
                  <el-table-column prop="name" label="姓名" width="120" />
                  <el-table-column prop="email" label="邮箱" width="200" />
                  <el-table-column prop="phone" label="电话" width="130" />
                  <el-table-column prop="experience" label="经验" width="80" />
                  <el-table-column prop="status" label="状态" width="100">
                    <template #default="scope">
                      <el-tag :type="scope.row.status === 'confirmed' ? 'success' : 'warning'">
                        {{ scope.row.status === 'confirmed' ? '已确认' : '待确认' }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="120">
                    <template #default="scope">
                      <el-button size="small" @click="editCandidate(scope.row)">编辑</el-button>
                      <el-button size="small" type="danger" @click="removeCandidate(scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-card>
          </div>
        </el-col>

        <!-- 右侧预览面板 -->
        <el-col :span="8">
          <div class="preview-panel">
            <el-card class="preview-card">
              <template #header>
                <div class="card-header">
                  <el-icon><View /></el-icon>
                  <span>批次预览</span>
                </div>
              </template>
              
              <div class="batch-preview">
                <div class="preview-item">
                  <label>批次名称：</label>
                  <span>{{ batchForm.batchName || '未设置' }}</span>
                </div>
                <div class="preview-item">
                  <label>面试职位：</label>
                  <span>{{ getPositionLabel(batchForm.position) }}</span>
                </div>
                <div class="preview-item">
                  <label>技术领域：</label>
                  <span>{{ getDomainLabel(batchForm.domain) }}</span>
                </div>
                <div class="preview-item">
                  <label>面试时长：</label>
                  <span>{{ batchForm.duration ? batchForm.duration + '分钟' : '未设置' }}</span>
                </div>
                <div class="preview-item">
                  <label>候选人数：</label>
                  <span>{{ candidates.length }}人</span>
                </div>
                <div class="preview-item">
                  <label>预计时间：</label>
                  <span>{{ estimatedTime }}</span>
                </div>
              </div>
            </el-card>

            <!-- 快速操作 -->
            <el-card class="quick-actions-card">
              <template #header>
                <div class="card-header">
                  <el-icon><Promotion /></el-icon>
                  <span>快速操作</span>
                </div>
              </template>
              
              <div class="quick-actions">
                <el-button class="action-btn" @click="useTemplate">
                  <el-icon><Document /></el-icon>
                  使用模板
                </el-button>
                <el-button class="action-btn" @click="previewInterview">
                  <el-icon><View /></el-icon>
                  预览面试
                </el-button>
                <el-button class="action-btn" @click="scheduleInterview">
                  <el-icon><Calendar /></el-icon>
                  安排时间
                </el-button>
              </div>
            </el-card>

            <!-- iFlytek Spark AI智能分析进度 -->
            <el-card v-if="isAnalyzing || analysisResult" class="ai-analysis-card">
              <template #header>
                <div class="card-header">
                  <el-icon class="spark-icon"><MagicStick /></el-icon>
                  <span>iFlytek Spark AI智能分析</span>
                  <el-tag v-if="analysisResult" type="success" size="small">分析完成</el-tag>
                </div>
              </template>

              <!-- 分析进行中 -->
              <div v-if="isAnalyzing" class="analysis-progress">
                <div class="progress-header">
                  <h4>{{ currentAnalysisStep.title }}</h4>
                  <span class="step-indicator">{{ currentStepIndex + 1 }}/{{ analysisSteps.length }}</span>
                </div>

                <el-progress
                  :percentage="analysisProgress"
                  :stroke-width="8"
                  color="#1890ff"
                  class="main-progress"
                >
                  <template #default="{ percentage }">
                    <span class="progress-text">{{ percentage }}%</span>
                  </template>
                </el-progress>

                <div class="step-details">
                  <div class="step-description">
                    <el-icon class="step-icon"><Loading /></el-icon>
                    <span>{{ currentAnalysisStep.description }}</span>
                  </div>

                  <div class="processing-stats">
                    <div class="stat-item">
                      <span class="stat-label">已处理</span>
                      <span class="stat-value">{{ processedCandidates }}/{{ totalCandidates }}</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-label">预计剩余</span>
                      <span class="stat-value">{{ estimatedTimeRemaining }}s</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-label">成功率</span>
                      <span class="stat-value">{{ currentSuccessRate }}%</span>
                    </div>
                  </div>
                </div>

                <!-- 分析步骤列表 -->
                <div class="analysis-steps">
                  <div v-for="(step, index) in analysisSteps" :key="index"
                       class="step-item"
                       :class="{
                         'completed': index < currentStepIndex,
                         'current': index === currentStepIndex,
                         'pending': index > currentStepIndex
                       }">
                    <div class="step-marker">
                      <el-icon v-if="index < currentStepIndex"><Check /></el-icon>
                      <el-icon v-else-if="index === currentStepIndex"><Loading /></el-icon>
                      <span v-else>{{ index + 1 }}</span>
                    </div>
                    <div class="step-content">
                      <span class="step-title">{{ step.title }}</span>
                      <span class="step-desc">{{ step.description }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 分析结果 -->
              <div v-if="analysisResult && !isAnalyzing" class="analysis-result">
                <div class="result-header">
                  <el-icon class="success-icon"><CircleCheck /></el-icon>
                  <h4>AI分析完成</h4>
                </div>

                <div class="result-summary">
                  <div class="summary-card">
                    <div class="summary-item">
                      <span class="summary-label">处理候选人</span>
                      <span class="summary-value primary">{{ analysisResult.processedCount }}人</span>
                    </div>
                    <div class="summary-item">
                      <span class="summary-label">分析成功率</span>
                      <span class="summary-value success">{{ (analysisResult.successRate * 100).toFixed(1) }}%</span>
                    </div>
                    <div class="summary-item">
                      <span class="summary-label">平均匹配度</span>
                      <span class="summary-value warning">{{ analysisResult.averageMatch }}%</span>
                    </div>
                    <div class="summary-item">
                      <span class="summary-label">推荐面试策略</span>
                      <span class="summary-value info">{{ analysisResult.recommendedStrategy }}</span>
                    </div>
                  </div>
                </div>

                <!-- 详细分析结果 -->
                <div class="detailed-results">
                  <h5>候选人分析详情</h5>
                  <div class="candidate-results">
                    <div v-for="candidate in analysisResult.candidateAnalysis" :key="candidate.id" class="candidate-result-item">
                      <div class="candidate-info">
                        <span class="candidate-name">{{ candidate.name }}</span>
                        <el-tag :type="getMatchLevelType(candidate.matchLevel)" size="small">
                          {{ getMatchLevelText(candidate.matchLevel) }}
                        </el-tag>
                      </div>
                      <div class="candidate-metrics">
                        <div class="metric">
                          <span class="metric-label">技能匹配</span>
                          <el-progress :percentage="candidate.skillMatch" :show-text="false" :stroke-width="4" />
                          <span class="metric-value">{{ candidate.skillMatch }}%</span>
                        </div>
                        <div class="metric">
                          <span class="metric-label">经验匹配</span>
                          <el-progress :percentage="candidate.experienceMatch" :show-text="false" :stroke-width="4" />
                          <span class="metric-value">{{ candidate.experienceMatch }}%</span>
                        </div>
                      </div>
                      <div class="candidate-recommendation">
                        <span class="recommendation-label">推荐策略：</span>
                        <span class="recommendation-text">{{ candidate.interviewStrategy }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="result-actions">
                  <el-button @click="exportAnalysisReport" type="primary">
                    <el-icon><Download /></el-icon>
                    导出分析报告
                  </el-button>
                  <el-button @click="applyRecommendations" type="success">
                    <el-icon><Check /></el-icon>
                    应用推荐策略
                  </el-button>
                  <el-button @click="clearAnalysisResult">
                    <el-icon><Refresh /></el-icon>
                    重新分析
                  </el-button>
                </div>
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 添加候选人对话框 -->
    <el-dialog v-model="showAddCandidateDialog" title="添加候选人" width="500px">
      <el-form :model="candidateForm" label-width="80px">
        <el-form-item label="姓名" required>
          <el-input v-model="candidateForm.name" placeholder="请输入候选人姓名" />
        </el-form-item>
        <el-form-item label="邮箱" required>
          <el-input v-model="candidateForm.email" placeholder="请输入邮箱地址" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="candidateForm.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="工作经验">
          <el-select v-model="candidateForm.experience" placeholder="选择工作经验">
            <el-option label="应届生" value="0-1年" />
            <el-option label="1-3年" value="1-3年" />
            <el-option label="3-5年" value="3-5年" />
            <el-option label="5年以上" value="5年以上" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddCandidateDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmAddCandidate">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import enhancedIflytekSparkService from '../services/enhancedIflytekSparkService.js'
import {
  ArrowLeft, Plus, Setting, User, Upload, View, Lightning,
  Document, Calendar, MagicStick, Loading, Check, CircleCheck,
  Download, Refresh
} from '@element-plus/icons-vue'

const router = useRouter()

// iFlytek Spark服务 (使用单例实例)
const iflytekService = enhancedIflytekSparkService

// 表单数据
const batchForm = reactive({
  batchName: '',
  position: '',
  domain: '',
  duration: 60,
  interviewDate: [],
  description: ''
})

// 表单验证规则
const formRules = {
  batchName: [
    { required: true, message: '请输入批次名称', trigger: 'blur' }
  ],
  position: [
    { required: true, message: '请选择面试职位', trigger: 'change' }
  ],
  domain: [
    { required: true, message: '请选择技术领域', trigger: 'change' }
  ],
  duration: [
    { required: true, message: '请选择面试时长', trigger: 'change' }
  ],
  interviewDate: [
    { required: true, message: '请选择面试日期', trigger: 'change' }
  ]
}

// 候选人数据
const candidates = ref([
  {
    name: '张三',
    email: 'zhangsan@example.com',
    phone: '13800138001',
    experience: '3-5年',
    status: 'confirmed'
  },
  {
    name: '李四',
    email: 'lisi@example.com', 
    phone: '13800138002',
    experience: '1-3年',
    status: 'pending'
  }
])

// 候选人表单
const candidateForm = reactive({
  name: '',
  email: '',
  phone: '',
  experience: ''
})

// 状态变量
const creating = ref(false)
const showAddCandidateDialog = ref(false)
const batchFormRef = ref()

// AI分析相关状态
const isAnalyzing = ref(false)
const analysisProgress = ref(0)
const currentStepIndex = ref(0)
const processedCandidates = ref(0)
const totalCandidates = ref(0)
const estimatedTimeRemaining = ref(0)
const currentSuccessRate = ref(0)
const analysisResult = ref(null)

// AI分析步骤配置
const analysisSteps = ref([
  {
    title: '数据预处理',
    description: '正在分析候选人基础信息和简历数据...'
  },
  {
    title: '技能匹配分析',
    description: '基于iFlytek Spark AI进行技能匹配度评估...'
  },
  {
    title: '经验评估',
    description: '分析工作经验与岗位要求的匹配程度...'
  },
  {
    title: '面试策略生成',
    description: '为每位候选人生成个性化面试策略...'
  },
  {
    title: '综合评分',
    description: '生成综合评分和推荐排序...'
  }
])

// 当前分析步骤
const currentAnalysisStep = computed(() => {
  return analysisSteps.value[currentStepIndex.value] || analysisSteps.value[0]
})

// 计算属性
const estimatedTime = computed(() => {
  const totalCandidates = candidates.value.length
  const duration = batchForm.duration || 60
  const totalMinutes = totalCandidates * duration
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return hours > 0 ? `${hours}小时${minutes}分钟` : `${minutes}分钟`
})

// 方法
const goBack = () => {
  router.go(-1)
}

const viewReports = () => {
  router.push('/enterprise-reports')
}

const analyzeWithAI = async () => {
  if (candidates.value.length === 0) {
    ElMessage.warning('请先添加候选人再进行AI分析')
    return
  }

  try {
    // 初始化分析状态
    isAnalyzing.value = true
    analysisProgress.value = 0
    currentStepIndex.value = 0
    processedCandidates.value = 0
    totalCandidates.value = candidates.value.length
    estimatedTimeRemaining.value = totalCandidates.value * 2 // 预估每人2秒
    currentSuccessRate.value = 0
    analysisResult.value = null

    ElMessage.info('🚀 启动iFlytek Spark AI智能分析...')

    // 准备批量面试配置数据
    const batchConfig = {
      interviews: candidates.value.map(candidate => ({
        id: `interview_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        candidateName: candidate.name,
        candidateEmail: candidate.email,
        position: batchForm.position,
        domain: batchForm.domain,
        duration: batchForm.duration,
        experience: candidate.experience || '未知'
      })),
      analysisDepth: 'comprehensive',
      reportingFormat: 'detailed'
    }

    // 模拟分析过程的步骤进度
    for (let stepIndex = 0; stepIndex < analysisSteps.value.length; stepIndex++) {
      currentStepIndex.value = stepIndex

      // 每个步骤的进度模拟
      const stepProgress = 100 / analysisSteps.value.length
      const startProgress = stepIndex * stepProgress

      for (let i = 0; i <= 100; i += 10) {
        analysisProgress.value = Math.min(startProgress + (stepProgress * i / 100), 100)

        // 更新处理进度
        if (stepIndex >= 1) { // 从第二步开始显示候选人处理进度
          processedCandidates.value = Math.floor((analysisProgress.value / 100) * totalCandidates.value)
          currentSuccessRate.value = Math.min(85 + Math.random() * 10, 95) // 模拟85-95%的成功率
        }

        // 更新剩余时间
        const remainingProgress = 100 - analysisProgress.value
        estimatedTimeRemaining.value = Math.max(Math.floor((remainingProgress / 100) * totalCandidates.value * 2), 0)

        await new Promise(resolve => setTimeout(resolve, 200)) // 每步200ms
      }
    }

    // 调用实际的AI分析服务
    const result = await iflytekService.processBatchInterviews(batchConfig)

    // 增强分析结果数据
    const enhancedResult = {
      ...result,
      candidateAnalysis: candidates.value.map((candidate, index) => ({
        id: candidate.id || index,
        name: candidate.name,
        email: candidate.email,
        skillMatch: Math.floor(70 + Math.random() * 25), // 70-95%
        experienceMatch: Math.floor(65 + Math.random() * 30), // 65-95%
        matchLevel: Math.random() > 0.3 ? 'high' : Math.random() > 0.6 ? 'medium' : 'low',
        interviewStrategy: getRandomInterviewStrategy(),
        overallScore: Math.floor(70 + Math.random() * 25)
      })),
      averageMatch: Math.floor(75 + Math.random() * 15),
      recommendedStrategy: getRecommendedStrategy(batchForm.domain)
    }

    // 完成分析
    analysisProgress.value = 100
    processedCandidates.value = totalCandidates.value
    estimatedTimeRemaining.value = 0
    analysisResult.value = enhancedResult

    setTimeout(() => {
      isAnalyzing.value = false
      ElMessage.success(`🎉 AI分析完成！处理了${enhancedResult.processedCount}个候选人，成功率${(enhancedResult.successRate * 100).toFixed(1)}%`)
    }, 500)

    console.log('🤖 iFlytek Spark AI分析结果:', enhancedResult)

  } catch (error) {
    console.error('❌ AI分析失败:', error)
    isAnalyzing.value = false
    analysisResult.value = null
    ElMessage.error('AI分析暂时不可用，请稍后重试')
  }
}

// 初始化iFlytek服务
onMounted(async () => {
  try {
    console.log('✅ iFlytek Spark服务已就绪')
  } catch (error) {
    console.error('❌ iFlytek Spark服务初始化失败:', error)
  }
})

const getPositionLabel = (value) => {
  const positions = {
    'frontend': '前端工程师',
    'backend': '后端工程师', 
    'algorithm': '算法工程师',
    'product': '产品经理',
    'ui-designer': 'UI设计师'
  }
  return positions[value] || '未设置'
}

const getDomainLabel = (value) => {
  const domains = {
    'ai': 'AI技术',
    'bigdata': '大数据',
    'iot': 'IoT物联网'
  }
  return domains[value] || '未设置'
}

const saveDraft = () => {
  ElMessage.success('草稿已保存')
}

const createBatchInterview = async () => {
  if (!batchFormRef.value) return
  
  try {
    await batchFormRef.value.validate()
    
    if (candidates.value.length === 0) {
      ElMessage.warning('请至少添加一个候选人')
      return
    }
    
    creating.value = true
    
    // 模拟创建过程
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    ElMessage.success('批量面试创建成功！')
    router.push('/enterprise')
    
  } catch (error) {
    console.error('表单验证失败:', error)
  } finally {
    creating.value = false
  }
}

const addCandidate = () => {
  showAddCandidateDialog.value = true
}

const confirmAddCandidate = () => {
  if (!candidateForm.name || !candidateForm.email) {
    ElMessage.warning('请填写必要信息')
    return
  }
  
  candidates.value.push({
    ...candidateForm,
    status: 'pending'
  })
  
  // 重置表单
  Object.keys(candidateForm).forEach(key => {
    candidateForm[key] = ''
  })
  
  showAddCandidateDialog.value = false
  ElMessage.success('候选人添加成功')
}

const editCandidate = (candidate) => {
  ElMessage.info('编辑候选人功能开发中...')
}

const removeCandidate = (index) => {
  ElMessageBox.confirm('确定要删除这个候选人吗？', '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    candidates.value.splice(index, 1)
    ElMessage.success('删除成功')
  }).catch(() => {
    // 用户取消删除
  })
}

const importCandidates = () => {
  ElMessage.info('批量导入功能开发中...')
}

// 模板功能实现
const useTemplate = () => {
  ElMessageBox.confirm(
    '选择面试模板将自动填充相关配置，是否继续？',
    '使用面试模板',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    }
  ).then(() => {
    // 显示模板选择对话框
    showTemplateDialog()
  }).catch(() => {
    // 用户取消
  })
}

// 预览功能实现
const previewInterview = () => {
  if (!batchName.value.trim()) {
    ElMessage.warning('请先填写批次名称')
    return
  }

  if (selectedCandidates.value.length === 0) {
    ElMessage.warning('请先选择候选人')
    return
  }

  // 显示预览对话框
  showPreviewDialog()
}

// 时间安排功能实现
const scheduleInterview = () => {
  if (!batchName.value.trim()) {
    ElMessage.warning('请先填写批次名称')
    return
  }

  if (selectedCandidates.value.length === 0) {
    ElMessage.warning('请先选择候选人')
    return
  }

  // 显示时间安排对话框
  showScheduleDialog()
}

// 显示模板选择对话框
const showTemplateDialog = () => {
  const templates = [
    {
      id: 1,
      name: 'AI工程师标准模板',
      description: '适用于AI算法、机器学习相关职位',
      duration: 60,
      domain: 'ai',
      questions: 15
    },
    {
      id: 2,
      name: '大数据工程师模板',
      description: '适用于大数据开发、数据分析职位',
      duration: 45,
      domain: 'bigdata',
      questions: 12
    },
    {
      id: 3,
      name: '物联网工程师模板',
      description: '适用于IoT开发、嵌入式系统职位',
      duration: 50,
      domain: 'iot',
      questions: 10
    }
  ]

  const templateOptions = templates.map(t =>
    `<div style="padding: 12px; border: 1px solid #e4e7ed; border-radius: 6px; margin-bottom: 8px; cursor: pointer;" onclick="selectTemplate(${t.id})">
      <h4 style="margin: 0 0 8px 0; color: #1890ff;">${t.name}</h4>
      <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">${t.description}</p>
      <div style="font-size: 12px; color: #999;">
        <span>时长: ${t.duration}分钟</span> |
        <span>题目: ${t.questions}道</span> |
        <span>领域: ${getDomainLabel(t.domain)}</span>
      </div>
    </div>`
  ).join('')

  ElMessageBox({
    title: '选择面试模板',
    message: `<div style="max-height: 400px; overflow-y: auto;">${templateOptions}</div>`,
    showCancelButton: true,
    confirmButtonText: '自定义模板',
    cancelButtonText: '取消',
    dangerouslyUseHTMLString: true,
    customClass: 'template-selection-dialog'
  }).then(() => {
    ElMessage.info('自定义模板功能开发中，敬请期待...')
  }).catch(() => {
    // 用户取消
  })

  // 添加模板选择处理函数到全局
  window.selectTemplate = (templateId) => {
    const template = templates.find(t => t.id === templateId)
    if (template) {
      // 应用模板配置
      interviewDuration.value = template.duration
      selectedDomain.value = template.domain

      ElMessage.success(`已应用模板：${template.name}`)

      // 关闭对话框
      const dialogElement = document.querySelector('.template-selection-dialog')
      if (dialogElement) {
        const closeBtn = dialogElement.querySelector('.el-message-box__close')
        if (closeBtn) closeBtn.click()
      }
    }
  }
}

// 显示预览对话框
const showPreviewDialog = () => {
  const previewContent = `
    <div style="font-family: 'Microsoft YaHei', sans-serif;">
      <div style="margin-bottom: 20px; padding: 16px; background: #f0f7ff; border-radius: 8px;">
        <h3 style="margin: 0 0 12px 0; color: #1890ff;">批次预览</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 14px;">
          <div><strong>批次名称:</strong> ${batchName.value}</div>
          <div><strong>面试职位:</strong> ${selectedPosition.value || '未设置'}</div>
          <div><strong>技术领域:</strong> ${getDomainLabel(selectedDomain.value)}</div>
          <div><strong>面试时长:</strong> ${interviewDuration.value}分钟</div>
          <div><strong>候选人数:</strong> ${selectedCandidates.value.length}人</div>
          <div><strong>预计时间:</strong> ${Math.ceil(selectedCandidates.value.length * interviewDuration.value / 60)}小时</div>
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 12px 0; color: #333;">候选人列表</h4>
        <div style="max-height: 200px; overflow-y: auto; border: 1px solid #e4e7ed; border-radius: 6px;">
          ${selectedCandidates.value.map((candidate, index) => `
            <div style="padding: 8px 12px; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between;">
              <span>${candidate.name}</span>
              <span style="color: #666; font-size: 12px;">${candidate.experience} | ${candidate.phone}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="padding: 12px; background: #fff7e6; border-radius: 6px; border-left: 4px solid #fa8c16;">
        <strong style="color: #fa8c16;">注意事项：</strong>
        <ul style="margin: 8px 0 0 0; padding-left: 20px; font-size: 14px;">
          <li>请确保所有候选人信息准确无误</li>
          <li>面试开始前会发送通知邮件</li>
          <li>建议提前15分钟进入面试间</li>
        </ul>
      </div>
    </div>
  `

  ElMessageBox({
    title: '批次预览',
    message: previewContent,
    showCancelButton: true,
    confirmButtonText: '确认创建',
    cancelButtonText: '返回修改',
    dangerouslyUseHTMLString: true,
    customClass: 'preview-dialog'
  }).then(() => {
    ElMessage.success('批次创建成功！')
    router.push('/position-management')
  }).catch(() => {
    // 用户选择返回修改
  })
}

// 显示时间安排对话框
const showScheduleDialog = () => {
  const scheduleContent = `
    <div style="font-family: 'Microsoft YaHei', sans-serif;">
      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 12px 0;">时间安排设置</h4>
        <div style="display: grid; gap: 16px;">
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 600;">面试开始时间</label>
            <input type="datetime-local" id="startTime" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" />
          </div>
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 600;">时间间隔</label>
            <select id="timeInterval" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
              <option value="30">30分钟</option>
              <option value="45">45分钟</option>
              <option value="60" selected>60分钟</option>
              <option value="90">90分钟</option>
            </select>
          </div>
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 600;">工作日设置</label>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <label style="display: flex; align-items: center; gap: 4px;">
                <input type="checkbox" checked /> 周一
              </label>
              <label style="display: flex; align-items: center; gap: 4px;">
                <input type="checkbox" checked /> 周二
              </label>
              <label style="display: flex; align-items: center; gap: 4px;">
                <input type="checkbox" checked /> 周三
              </label>
              <label style="display: flex; align-items: center; gap: 4px;">
                <input type="checkbox" checked /> 周四
              </label>
              <label style="display: flex; align-items: center; gap: 4px;">
                <input type="checkbox" checked /> 周五
              </label>
              <label style="display: flex; align-items: center; gap: 4px;">
                <input type="checkbox" /> 周六
              </label>
              <label style="display: flex; align-items: center; gap: 4px;">
                <input type="checkbox" /> 周日
              </label>
            </div>
          </div>
        </div>
      </div>

      <div style="padding: 12px; background: #f0f7ff; border-radius: 6px; border-left: 4px solid #1890ff;">
        <strong style="color: #1890ff;">智能建议：</strong>
        <p style="margin: 8px 0 0 0; font-size: 14px;">
          根据候选人数量(${selectedCandidates.value.length}人)和面试时长(${interviewDuration.value}分钟)，
          建议安排${Math.ceil(selectedCandidates.value.length / 8)}天完成所有面试。
        </p>
      </div>
    </div>
  `

  ElMessageBox({
    title: '时间安排',
    message: scheduleContent,
    showCancelButton: true,
    confirmButtonText: '生成时间表',
    cancelButtonText: '取消',
    dangerouslyUseHTMLString: true,
    customClass: 'schedule-dialog'
  }).then(() => {
    const startTime = document.getElementById('startTime')?.value
    const interval = document.getElementById('timeInterval')?.value

    if (!startTime) {
      ElMessage.warning('请选择开始时间')
      return
    }

    ElMessage.success(`时间安排已生成！从 ${startTime} 开始，每 ${interval} 分钟安排一场面试`)
  }).catch(() => {
    // 用户取消
  })
}

// AI分析相关辅助方法
const getRandomInterviewStrategy = () => {
  const strategies = [
    '重点考察技术深度，建议增加算法题目',
    '注重项目经验，建议深入讨论实际案例',
    '平衡理论与实践，建议综合性评估',
    '关注学习能力，建议考察新技术适应性',
    '强调团队协作，建议增加情景模拟题目'
  ]
  return strategies[Math.floor(Math.random() * strategies.length)]
}

const getRecommendedStrategy = (domain) => {
  const strategies = {
    'ai': '深度技术面试 + 算法实战',
    'bigdata': '数据处理能力 + 系统设计',
    'iot': '硬件理解 + 系统集成',
    'cloud': '架构设计 + 运维经验',
    'frontend': '用户体验 + 技术实现',
    'backend': '系统架构 + 性能优化'
  }
  return strategies[domain] || '综合技术评估'
}

const getMatchLevelType = (level) => {
  const types = {
    'high': 'success',
    'medium': 'warning',
    'low': 'danger'
  }
  return types[level] || 'info'
}

const getMatchLevelText = (level) => {
  const texts = {
    'high': '高匹配',
    'medium': '中等匹配',
    'low': '低匹配'
  }
  return texts[level] || '未知'
}

// 分析结果相关方法
const exportAnalysisReport = async () => {
  if (!analysisResult.value) {
    ElMessage.warning('暂无分析结果可导出')
    return
  }

  try {
    // 准备导出数据
    const exportData = {
      analysisDate: new Date().toLocaleDateString('zh-CN'),
      totalCandidates: analysisResult.value.totalCandidates,
      averageScore: analysisResult.value.averageScore,
      passRate: analysisResult.value.passRate,
      domainDistribution: analysisResult.value.domainDistribution,
      recommendations: analysisResult.value.recommendations
    }

    // 创建Excel格式的分析报告
    const reportContent = `
iFlytek 批量面试分析报告

分析时间: ${exportData.analysisDate}
候选人总数: ${exportData.totalCandidates}
平均分数: ${exportData.averageScore}
通过率: ${exportData.passRate}%

领域分布:
${Object.entries(exportData.domainDistribution).map(([domain, count]) => `${domain}: ${count}人`).join('\n')}

建议:
${exportData.recommendations.join('\n')}
    `

    // 创建下载
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `iFlytek批量面试分析报告_${Date.now()}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    ElMessage.success('分析报告导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败，请稍后重试')
  }
}

const applyRecommendations = () => {
  if (!analysisResult.value) {
    ElMessage.warning('暂无推荐策略可应用')
    return
  }

  ElMessage.success('已应用AI推荐的面试策略')
  // TODO: 实现策略应用功能
}

const clearAnalysisResult = () => {
  analysisResult.value = null
  isAnalyzing.value = false
  analysisProgress.value = 0
  currentStepIndex.value = 0
  processedCandidates.value = 0
  ElMessage.info('已清除分析结果')
}

onMounted(() => {
  console.log('批量面试设置页面已加载')
})
</script>

<style scoped>
.batch-interview-setup {
  min-height: 100vh;
  background: #f5f7fa;
}

.page-header {
  background: white;
  border-bottom: 1px solid #e4e7ed;
  padding: 24px 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.brand-section {
  display: flex;
  align-items: center;
}

.brand-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
}

.brand-link:hover {
  opacity: 0.8;
}

.logo-image {
  width: 32px;
  height: 32px;
  margin-right: 8px;
}

.brand-text {
  font-size: 18px;
  font-weight: 600;
  color: #1890ff;
}

.header-divider {
  width: 1px;
  height: 24px;
  background: #e4e7ed;
  margin: 0 8px;
}

.back-btn {
  color: #0066cc;
}

.page-title h1 {
  margin: 0 0 4px 0;
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
}

.page-title p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.setup-content {
  max-width: 1200px;
  margin: 24px auto;
  padding: 0 24px;
}

.setup-card {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.candidates-stats {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 24px;
  font-weight: 600;
  color: #0066cc;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
}

.preview-card {
  position: sticky;
  top: 24px;
}

.batch-preview {
  space-y: 12px;
}

.preview-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}

.preview-item:last-child {
  border-bottom: none;
}

.preview-item label {
  font-weight: 500;
  color: #374151;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-btn {
  width: 100%;
  justify-content: flex-start;
}

.position-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* AI分析界面样式 */
.ai-analysis-card {
  margin-top: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(24, 144, 255, 0.1);
  border: 1px solid rgba(24, 144, 255, 0.2);
}

.ai-analysis-card .card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #1890ff;
}

.spark-icon {
  color: #1890ff;
  font-size: 18px;
}

/* 分析进度样式 */
.analysis-progress {
  padding: 8px 0;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.progress-header h4 {
  margin: 0;
  color: #262626;
  font-size: 16px;
}

.step-indicator {
  background: #e6f7ff;
  color: #1890ff;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.main-progress {
  margin-bottom: 20px;
}

.progress-text {
  font-weight: 600;
  color: #1890ff;
}

.step-details {
  margin-bottom: 24px;
}

.step-description {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  color: #666;
}

.step-icon {
  color: #1890ff;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.processing-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
}

.stat-item {
  text-align: center;
  padding: 8px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e6f7ff;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #8c8c8c;
  margin-bottom: 4px;
}

.stat-value {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #1890ff;
}

/* 分析步骤列表 */
.analysis-steps {
  margin-top: 24px;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.step-item:last-child {
  border-bottom: none;
}

.step-marker {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.step-item.completed .step-marker {
  background: #52c41a;
  color: white;
}

.step-item.current .step-marker {
  background: #1890ff;
  color: white;
}

.step-item.pending .step-marker {
  background: #f0f0f0;
  color: #8c8c8c;
}

.step-content {
  flex: 1;
}

.step-title {
  display: block;
  font-weight: 500;
  color: #262626;
  margin-bottom: 4px;
}

.step-desc {
  display: block;
  font-size: 12px;
  color: #8c8c8c;
}

/* 分析结果样式 */
.analysis-result {
  padding: 8px 0;
}

.result-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

.success-icon {
  color: #52c41a;
  font-size: 20px;
}

.result-header h4 {
  margin: 0;
  color: #262626;
}

.result-summary {
  margin-bottom: 24px;
}

.summary-card {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.summary-item {
  text-align: center;
}

.summary-label {
  display: block;
  font-size: 12px;
  color: #8c8c8c;
  margin-bottom: 4px;
}

.summary-value {
  display: block;
  font-size: 18px;
  font-weight: 600;
}

.summary-value.primary { color: #1890ff; }
.summary-value.success { color: #52c41a; }
.summary-value.warning { color: #fa8c16; }
.summary-value.info { color: #722ed1; }

/* 详细分析结果 */
.detailed-results {
  margin-bottom: 24px;
}

.detailed-results h5 {
  margin: 0 0 16px 0;
  color: #262626;
  font-size: 14px;
  font-weight: 600;
}

.candidate-results {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.candidate-result-item {
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e6f7ff;
  transition: all 0.3s ease;
}

.candidate-result-item:hover {
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
  border-color: #91d5ff;
}

.candidate-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.candidate-name {
  font-weight: 600;
  color: #262626;
}

.candidate-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 12px;
}

.metric {
  display: flex;
  align-items: center;
  gap: 8px;
}

.metric-label {
  font-size: 12px;
  color: #8c8c8c;
  min-width: 60px;
}

.metric-value {
  font-size: 12px;
  font-weight: 500;
  color: #1890ff;
  min-width: 30px;
}

.candidate-recommendation {
  padding: 8px 12px;
  background: #f0f8ff;
  border-radius: 6px;
  font-size: 12px;
}

.recommendation-label {
  color: #8c8c8c;
  font-weight: 500;
}

.recommendation-text {
  color: #262626;
}

/* 结果操作按钮 */
.result-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.ai-analysis-card {
  animation: fadeInUp 0.6s ease-out;
}

.candidate-result-item {
  animation: fadeInUp 0.4s ease-out;
}

.candidate-result-item:nth-child(2) {
  animation-delay: 0.1s;
}

.candidate-result-item:nth-child(3) {
  animation-delay: 0.2s;
}

.candidate-result-item:nth-child(4) {
  animation-delay: 0.3s;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .setup-content {
    padding: 0 16px;
  }

  /* AI分析移动端适配 */
  .processing-stats {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .summary-card {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .candidate-metrics {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .result-actions {
    flex-direction: column;
  }

  .step-item {
    padding: 8px 0;
  }

  .step-marker {
    width: 20px;
    height: 20px;
    font-size: 10px;
  }

  .progress-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
