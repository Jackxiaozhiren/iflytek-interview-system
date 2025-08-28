<template>
  <div class="modern-report-page">
    <!-- 顶部导航 -->
    <header class="report-header">
      <div class="header-container">
        <div class="header-left">
          <el-button @click="goBack" class="back-btn">
            <el-icon><ArrowLeft /></el-icon>
            返回
          </el-button>
          <div class="report-title">
            <h1>面试评估报告</h1>
            <p>基于iFlytek Spark AI的智能分析结果</p>
          </div>
        </div>
        <div class="header-right">
          <el-button @click="exportReport" class="export-btn">
            <el-icon><Download /></el-icon>
            导出报告
          </el-button>
          <el-button @click="shareReport" type="primary" class="share-btn">
            <el-icon><Share /></el-icon>
            分享报告
          </el-button>
        </div>
      </div>
    </header>

    <!-- 候选人信息卡片 -->
    <section class="candidate-overview">
      <div class="overview-container">
        <div class="candidate-card">
          <div class="candidate-info">
            <div class="candidate-avatar">
              <img :src="candidateInfo.avatar" :alt="candidateInfo.name" />
            </div>
            <div class="candidate-details">
              <h2 class="candidate-name">{{ candidateInfo.name }}</h2>
              <p class="candidate-position">{{ candidateInfo.position }}</p>
              <div class="candidate-meta">
                <div class="meta-item">
                  <el-icon><Calendar /></el-icon>
                  <span>{{ formatDate(reportData.interviewDate) }}</span>
                </div>
                <div class="meta-item">
                  <el-icon><Clock /></el-icon>
                  <span>{{ reportData.duration }}分钟</span>
                </div>
                <div class="meta-item">
                  <el-icon><User /></el-icon>
                  <span>{{ candidateInfo.experience }}年经验</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="overall-score">
            <div class="score-display">
              <div class="score-circle">
                <div class="score-progress" :style="{ '--progress': reportData.overallScore }">
                  <span class="score-value">{{ reportData.overallScore }}</span>
                  <span class="score-label">综合评分</span>
                </div>
              </div>
              <div class="score-grade">
                <div class="grade-badge" :class="getGradeClass(reportData.grade)">
                  {{ reportData.grade }}
                </div>
                <p class="grade-description">{{ getGradeDescription(reportData.grade) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 核心评估指标 -->
    <section class="assessment-metrics">
      <div class="metrics-container">
        <div class="section-header">
          <h3 class="section-title">核心能力评估</h3>
          <p class="section-subtitle">基于iFlytek Spark多模态AI分析的六大核心维度</p>
        </div>
        
        <div class="metrics-grid">
          <div class="metric-card" v-for="metric in assessmentMetrics" :key="metric.id">
            <div class="metric-header">
              <div class="metric-icon" :style="{ background: metric.gradient }">
                <el-icon :size="24"><component :is="metric.icon" /></el-icon>
              </div>
              <div class="metric-info">
                <h4 class="metric-name">{{ metric.name }}</h4>
                <p class="metric-description">{{ metric.description }}</p>
              </div>
            </div>
            
            <div class="metric-score">
              <div class="score-bar">
                <div class="score-fill" :style="{ width: metric.score + '%', background: metric.gradient }"></div>
              </div>
              <div class="score-details">
                <span class="score-number">{{ metric.score }}</span>
                <span class="score-level">{{ getScoreLevel(metric.score) }}</span>
              </div>
            </div>
            
            <div class="metric-insights">
              <div class="insight-item" v-for="insight in metric.insights" :key="insight">
                <el-icon class="insight-icon"><Check /></el-icon>
                <span>{{ insight }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- AI分析洞察 -->
    <section class="ai-insights">
      <div class="insights-container">
        <div class="section-header">
          <h3 class="section-title">
            <el-icon><Cpu /></el-icon>
            AI智能洞察
          </h3>
          <p class="section-subtitle">基于iFlytek Spark大模型的深度分析</p>
        </div>
        
        <div class="insights-grid">
          <div class="insight-card strengths">
            <div class="card-header">
              <el-icon class="card-icon"><TrendCharts /></el-icon>
              <h4>核心优势</h4>
            </div>
            <div class="card-content">
              <ul class="insight-list">
                <li v-for="strength in aiInsights.strengths" :key="strength">
                  <el-icon class="list-icon"><Star /></el-icon>
                  {{ strength }}
                </li>
              </ul>
            </div>
          </div>
          
          <div class="insight-card improvements">
            <div class="card-header">
              <el-icon class="card-icon"><Warning /></el-icon>
              <h4>改进建议</h4>
            </div>
            <div class="card-content">
              <ul class="insight-list">
                <li v-for="improvement in aiInsights.improvements" :key="improvement">
                  <el-icon class="list-icon"><InfoFilled /></el-icon>
                  {{ improvement }}
                </li>
              </ul>
            </div>
          </div>
          
          <div class="insight-card recommendations">
            <div class="card-header">
              <el-icon class="card-icon"><Star /></el-icon>
              <h4>发展建议</h4>
            </div>
            <div class="card-content">
              <ul class="insight-list">
                <li v-for="recommendation in aiInsights.recommendations" :key="recommendation">
                  <el-icon class="list-icon"><Right /></el-icon>
                  {{ recommendation }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 面试表现时间线 -->
    <section class="performance-timeline">
      <div class="timeline-container">
        <div class="section-header">
          <h3 class="section-title">面试表现时间线</h3>
          <p class="section-subtitle">实时记录的面试过程和关键表现节点</p>
        </div>
        
        <div class="timeline-content">
          <div class="timeline-item" v-for="(item, index) in performanceTimeline" :key="index">
            <div class="timeline-marker" :class="item.type">
              <el-icon><component :is="item.icon" /></el-icon>
            </div>
            <div class="timeline-content-item">
              <div class="timeline-header">
                <h5 class="timeline-title">{{ item.title }}</h5>
                <span class="timeline-time">{{ item.time }}</span>
              </div>
              <p class="timeline-description">{{ item.description }}</p>
              <div class="timeline-score" v-if="item.score">
                <span class="score-label">得分:</span>
                <span class="score-value">{{ item.score }}/100</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 操作按钮区域 -->
    <section class="action-section">
      <div class="action-container">
        <div class="action-card">
          <h3>下一步行动</h3>
          <p>根据面试结果，您可以进行以下操作</p>
          <div class="action-buttons">
            <el-button type="primary" size="large" @click="scheduleNextRound">
              <el-icon><Calendar /></el-icon>
              安排下轮面试
            </el-button>
            <el-button size="large" @click="sendFeedback">
              <el-icon><Message /></el-icon>
              发送反馈
            </el-button>
            <el-button size="large" @click="addToTalentPool">
              <el-icon><UserFilled /></el-icon>
              加入人才库
            </el-button>
          </div>
        </div>
      </div>
    </section>

    <!-- 对话框组件 -->
    <ScheduleInterviewDialog
      v-model="showScheduleDialog"
      :candidate-info="candidateInfo"
      @scheduled="handleInterviewScheduled"
    />

    <SendFeedbackDialog
      v-model="showFeedbackDialog"
      :candidate-info="candidateInfo"
      @sent="handleFeedbackSent"
    />

    <TalentPoolDialog
      v-model="showTalentDialog"
      :candidate-info="candidateInfo"
      @added="handleTalentAdded"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowLeft, Download, Share, Calendar, Clock, User, Cpu, Check,
  TrendCharts, Star, Warning, InfoFilled, Right,
  Message, UserFilled, Microphone, Grid, Setting
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import ScheduleInterviewDialog from '@/components/Report/ScheduleInterviewDialog.vue'
import SendFeedbackDialog from '@/components/Report/SendFeedbackDialog.vue'
import TalentPoolDialog from '@/components/Report/TalentPoolDialog.vue'

const router = useRouter()

// 候选人信息
const candidateInfo = ref({
  name: '张三',
  position: 'AI算法工程师',
  avatar: '/images/candidate-avatar.svg',
  experience: 5
})

// 报告数据
const reportData = ref({
  interviewDate: new Date(),
  duration: 45,
  overallScore: 87,
  grade: 'A'
})

// 评估指标
const assessmentMetrics = ref([
  {
    id: 1,
    name: '专业技能',
    description: '技术知识深度和广度',
    score: 92,
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    icon: 'Setting',
    insights: ['算法理论扎实', '项目经验丰富', '技术视野开阔']
  },
  {
    id: 2,
    name: '沟通表达',
    description: '语言表达和沟通能力',
    score: 85,
    gradient: 'linear-gradient(135deg, #1890ff 0%, #0066cc 100%)',
    icon: 'Microphone',
    insights: ['表达清晰流畅', '逻辑思维清晰', '互动积极主动']
  },
  {
    id: 3,
    name: '问题解决',
    description: '分析和解决问题的能力',
    score: 88,
    gradient: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
    icon: 'Cpu',
    insights: ['思路清晰', '方法得当', '举一反三']
  },
  {
    id: 4,
    name: '学习能力',
    description: '持续学习和适应能力',
    score: 90,
    gradient: 'linear-gradient(135deg, #fa8c16 0%, #d46b08 100%)',
    icon: 'TrendCharts',
    insights: ['学习主动性强', '知识更新及时', '适应能力强']
  },
  {
    id: 5,
    name: '团队协作',
    description: '团队合作和协调能力',
    score: 82,
    gradient: 'linear-gradient(135deg, #722ed1 0%, #531dab 100%)',
    icon: 'UserFilled',
    insights: ['团队意识强', '协作经验丰富', '沟通配合良好']
  },
  {
    id: 6,
    name: '创新思维',
    description: '创新意识和创造能力',
    score: 86,
    gradient: 'linear-gradient(135deg, #eb2f96 0%, #c41d7f 100%)',
    icon: 'Star',
    insights: ['思维活跃', '创新意识强', '解决方案独特']
  }
])

// AI洞察
const aiInsights = ref({
  strengths: [
    '技术基础扎实，对AI算法有深入理解',
    '项目经验丰富，能够结合实际场景分析问题',
    '学习能力强，对新技术保持敏感度',
    '表达能力良好，能够清晰阐述技术观点'
  ],
  improvements: [
    '在复杂问题分析时可以更加系统化',
    '团队协作经验可以进一步丰富',
    '对业务理解可以更加深入'
  ],
  recommendations: [
    '建议参与更多跨部门协作项目',
    '可以考虑技术管理方向发展',
    '建议关注AI技术的商业化应用'
  ]
})

// 表现时间线
const performanceTimeline = ref([
  {
    title: '面试开始',
    time: '14:00',
    description: '候选人准时参加面试，状态良好',
    type: 'start',
    icon: 'Calendar'
  },
  {
    title: '自我介绍',
    time: '14:05',
    description: '表达清晰，重点突出，展现了良好的沟通能力',
    type: 'good',
    icon: 'User',
    score: 88
  },
  {
    title: '技术问题回答',
    time: '14:15',
    description: '对算法原理理解深入，能够结合实际项目经验分析',
    type: 'excellent',
    icon: 'Cpu',
    score: 92
  },
  {
    title: '项目经验分享',
    time: '14:30',
    description: '项目描述详细，技术选型合理，体现了良好的工程能力',
    type: 'good',
    icon: 'Setting',
    score: 85
  },
  {
    title: '面试结束',
    time: '14:45',
    description: '面试顺利完成，候选人表现优秀',
    type: 'end',
    icon: 'Check'
  }
])

// 方法
const goBack = () => {
  router.push('/')
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

const getGradeClass = (grade) => {
  const gradeMap = {
    'A+': 'grade-a-plus',
    'A': 'grade-a',
    'B+': 'grade-b-plus',
    'B': 'grade-b',
    'C': 'grade-c'
  }
  return gradeMap[grade] || 'grade-c'
}

const getGradeDescription = (grade) => {
  const descriptions = {
    'A+': '优秀，强烈推荐录用',
    'A': '良好，推荐录用',
    'B+': '合格，可以考虑',
    'B': '一般，需要进一步评估',
    'C': '不符合要求'
  }
  return descriptions[grade] || '需要评估'
}

const getScoreLevel = (score) => {
  if (score >= 90) return '优秀'
  if (score >= 80) return '良好'
  if (score >= 70) return '合格'
  if (score >= 60) return '一般'
  return '待提升'
}

const exportReport = async () => {
  try {
    // 显示导出格式选择对话框
    const { value: format } = await ElMessageBox.confirm(
      '请选择导出格式',
      '导出报告',
      {
        distinguishCancelAndClose: true,
        confirmButtonText: 'PDF格式',
        cancelButtonText: 'Excel格式',
        type: 'info'
      }
    ).then(() => 'pdf').catch((action) => {
      if (action === 'cancel') return 'excel'
      return null
    })

    if (!format) return

    // 准备报告数据
    const reportData = {
      candidateName: candidateInfo.value.name,
      position: candidateInfo.value.position,
      interviewDate: candidateInfo.value.interviewDate,
      overallScore: candidateInfo.value.overallScore,
      professionalKnowledge: candidateInfo.value.professionalKnowledge,
      skillMatching: candidateInfo.value.skillMatching,
      languageExpression: candidateInfo.value.languageExpression,
      logicalThinking: candidateInfo.value.logicalThinking,
      innovationAbility: candidateInfo.value.innovationAbility,
      stressResistance: candidateInfo.value.stressResistance,
      strengths: candidateInfo.value.strengths,
      improvements: candidateInfo.value.improvements,
      overallEvaluation: candidateInfo.value.overallEvaluation
    }

    // 执行导出
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')
    const fileName = `iFlytek面试报告_${reportData.candidateName}_${timestamp}`

    if (format === 'pdf') {
      await exportToPDF(reportData, fileName)
    } else {
      await exportToExcel(reportData, fileName)
    }

    ElNotification({
      title: '导出成功',
      message: `面试报告已成功导出为 ${format.toUpperCase()} 格式`,
      type: 'success',
      duration: 3000
    })

  } catch (error) {
    console.error('导出报告失败:', error)
    ElMessage.error('导出失败，请稍后重试')
  }
}

// 对话框控制
const showScheduleDialog = ref(false)
const showFeedbackDialog = ref(false)
const showTalentDialog = ref(false)

const shareReport = async () => {
  try {
    // 生成分享链接
    const shareUrl = `${window.location.origin}/report/share/${candidateInfo.value.name}_${Date.now()}`

    // 复制到剪贴板
    await navigator.clipboard.writeText(shareUrl)

    ElNotification({
      title: '分享链接已生成',
      message: '链接已复制到剪贴板，您可以分享给相关人员查看',
      type: 'success',
      duration: 5000
    })

  } catch (error) {
    console.error('分享失败:', error)
    ElMessage.error('分享链接生成失败，请稍后重试')
  }
}

const scheduleNextRound = () => {
  showScheduleDialog.value = true
}

const sendFeedback = () => {
  showFeedbackDialog.value = true
}

const addToTalentPool = () => {
  showTalentDialog.value = true
}

// 对话框事件处理
const handleInterviewScheduled = (scheduleData) => {
  console.log('面试已安排:', scheduleData)
  ElMessage.success(`已成功安排${scheduleData.interviewType}面试`)
}

const handleFeedbackSent = (feedbackData) => {
  console.log('反馈已发送:', feedbackData)
  ElMessage.success('面试反馈已发送给候选人')
}

const handleTalentAdded = (talentData) => {
  console.log('已加入人才库:', talentData)
  ElMessage.success(`${talentData.candidateName}已成功加入${talentData.level}级人才库`)
}

// 导出为PDF
const exportToPDF = async (reportData, fileName) => {
  // 动态导入jsPDF
  const { jsPDF } = await import('jspdf')

  const doc = new jsPDF()

  // 设置中文字体（如果需要）
  doc.setFont('helvetica')

  // 添加标题
  doc.setFontSize(20)
  doc.text('iFlytek 面试评估报告', 20, 30)

  // 添加候选人信息
  doc.setFontSize(14)
  doc.text(`候选人: ${reportData.candidateName}`, 20, 50)
  doc.text(`职位: ${reportData.position}`, 20, 65)
  doc.text(`面试时间: ${reportData.interviewDate}`, 20, 80)

  // 添加评分信息
  doc.text('评估结果:', 20, 105)
  doc.setFontSize(12)
  doc.text(`综合评分: ${reportData.overallScore}分`, 30, 120)
  doc.text(`专业知识: ${reportData.professionalKnowledge}分`, 30, 135)
  doc.text(`技能匹配: ${reportData.skillMatching}分`, 30, 150)
  doc.text(`语言表达: ${reportData.languageExpression}分`, 30, 165)
  doc.text(`逻辑思维: ${reportData.logicalThinking}分`, 30, 180)
  doc.text(`创新能力: ${reportData.innovationAbility}分`, 30, 195)
  doc.text(`抗压能力: ${reportData.stressResistance}分`, 30, 210)

  // 保存PDF
  doc.save(`${fileName}.pdf`)
}

// 导出为Excel
const exportToExcel = async (reportData, fileName) => {
  // 动态导入xlsx
  const XLSX = await import('xlsx')

  // 创建工作簿
  const workbook = XLSX.utils.book_new()

  // 基本信息工作表
  const basicData = [
    ['iFlytek 面试评估报告'],
    [''],
    ['候选人信息'],
    ['姓名', reportData.candidateName],
    ['职位', reportData.position],
    ['面试时间', reportData.interviewDate],
    [''],
    ['评估结果'],
    ['综合评分', reportData.overallScore],
    ['专业知识', reportData.professionalKnowledge],
    ['技能匹配', reportData.skillMatching],
    ['语言表达', reportData.languageExpression],
    ['逻辑思维', reportData.logicalThinking],
    ['创新能力', reportData.innovationAbility],
    ['抗压能力', reportData.stressResistance]
  ]

  const basicSheet = XLSX.utils.aoa_to_sheet(basicData)
  XLSX.utils.book_append_sheet(workbook, basicSheet, '基本信息')

  // 导出文件
  XLSX.writeFile(workbook, `${fileName}.xlsx`)
}
</script>

<style scoped>
.modern-report-page {
  min-height: 100vh;
  background: #f8fafc;
}

/* 顶部导航 */
.report-header {
  background: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 20px 0;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.back-btn {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #64748b;
}

.report-title h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 4px 0;
}

.report-title p {
  color: #64748b;
  margin: 0;
  font-size: 14px;
}

.header-right {
  display: flex;
  gap: 12px;
}

.export-btn {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #64748b;
}

.share-btn {
  background: linear-gradient(135deg, #1890ff 0%, #0066cc 100%);
  border: none;
}

/* 候选人概览 */
.candidate-overview {
  padding: 32px 0;
}

.overview-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.candidate-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.candidate-info {
  display: flex;
  align-items: center;
  gap: 24px;
}

.candidate-avatar img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.candidate-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.candidate-position {
  color: #64748b;
  font-size: 1.125rem;
  margin: 0 0 16px 0;
}

.candidate-meta {
  display: flex;
  gap: 24px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  font-size: 14px;
}

.overall-score {
  text-align: center;
}

.score-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: conic-gradient(#1890ff calc(var(--progress) * 1%), #f1f5f9 0);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 16px;
}

.score-circle::before {
  content: '';
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: white;
  position: absolute;
}

.score-progress {
  position: relative;
  z-index: 1;
  text-align: center;
}

.score-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1890ff;
}

.score-label {
  font-size: 12px;
  color: #64748b;
}

.grade-badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  margin-bottom: 8px;
}

.grade-a-plus,
.grade-a {
  background: #f6ffed;
  color: #52c41a;
}

.grade-b-plus,
.grade-b {
  background: #fff7e6;
  color: #fa8c16;
}

.grade-c {
  background: #fff2f0;
  color: #ff4d4f;
}

.grade-description {
  color: #64748b;
  font-size: 14px;
  margin: 0;
}

/* 评估指标 */
.assessment-metrics {
  padding: 40px 0;
}

.metrics-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.section-subtitle {
  color: #64748b;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
}

.metric-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.metric-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.metric-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.metric-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 4px 0;
}

.metric-description {
  color: #64748b;
  font-size: 14px;
  margin: 0;
}

.metric-score {
  margin-bottom: 16px;
}

.score-bar {
  height: 8px;
  background: #f1f5f9;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.score-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.score-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.score-number {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1890ff;
}

.score-level {
  color: #64748b;
  font-size: 14px;
}

.metric-insights {
  space-y: 8px;
}

.insight-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: #64748b;
  font-size: 14px;
}

.insight-icon {
  color: #52c41a;
  flex-shrink: 0;
}

/* AI洞察 */
.ai-insights {
  padding: 40px 0;
  background: white;
}

.insights-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
}

.insight-card {
  background: #f8fafc;
  border-radius: 12px;
  padding: 24px;
  border-left: 4px solid;
}

.insight-card.strengths {
  border-left-color: #52c41a;
}

.insight-card.improvements {
  border-left-color: #fa8c16;
}

.insight-card.recommendations {
  border-left-color: #1890ff;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.card-icon {
  color: #1890ff;
}

.card-header h4 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #2c3e50;
}

.insight-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.insight-list li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 12px;
  color: #64748b;
  line-height: 1.5;
}

.list-icon {
  color: #1890ff;
  flex-shrink: 0;
  margin-top: 2px;
}

/* 时间线 */
.performance-timeline {
  padding: 40px 0;
}

.timeline-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.timeline-content {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.timeline-item {
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
  position: relative;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-item:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 20px;
  top: 40px;
  bottom: -24px;
  width: 2px;
  background: #f1f5f9;
}

.timeline-marker {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.timeline-marker.start {
  background: #64748b;
}

.timeline-marker.good {
  background: #1890ff;
}

.timeline-marker.excellent {
  background: #52c41a;
}

.timeline-marker.end {
  background: #722ed1;
}

.timeline-content-item {
  flex: 1;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.timeline-title {
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.timeline-time {
  color: #64748b;
  font-size: 14px;
}

.timeline-description {
  color: #64748b;
  line-height: 1.5;
  margin: 0 0 8px 0;
}

.timeline-score {
  display: flex;
  gap: 8px;
  align-items: center;
}

.timeline-score .score-label {
  color: #64748b;
  font-size: 14px;
}

.timeline-score .score-value {
  font-weight: 600;
  color: #1890ff;
}

/* 操作区域 */
.action-section {
  padding: 40px 0;
}

.action-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.action-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  color: white;
}

.action-card h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.action-card p {
  margin: 0 0 32px 0;
  opacity: 0.9;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.action-buttons .el-button {
  background: white;
  color: #1890ff;
  border: none;
  padding: 12px 24px;
  font-weight: 600;
}

/* 响应式设计 */
/* 响应式设计 */
@media (max-width: 1024px) {
  .header-container {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .header-right {
    width: 100%;
    justify-content: flex-end;
  }

  .candidate-card {
    flex-direction: column;
    gap: 24px;
    text-align: center;
  }

  .overall-score {
    width: 100%;
    display: flex;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .header-container,
  .overview-container,
  .metrics-container,
  .insights-container,
  .timeline-container {
    padding: 0 16px;
  }

  .candidate-card {
    padding: 24px;
    flex-direction: column;
    gap: 24px;
    text-align: center;
  }

  .candidate-info {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }

  .candidate-meta {
    justify-content: center;
    flex-wrap: wrap;
    gap: 12px;
  }

  .meta-item {
    flex-direction: column;
    gap: 4px;
    text-align: center;
  }

  .metrics-grid,
  .insights-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .metric-card {
    padding: 20px;
  }

  .action-buttons {
    flex-direction: column;
    align-items: center;
    gap: 12px;
    width: 100%;
  }

  .header-right {
    flex-direction: column;
    gap: 12px;
    width: 100%;
  }

  .export-btn,
  .share-btn {
    width: 100%;
    justify-content: center;
  }

  .score-circle {
    width: 120px;
    height: 120px;
  }

  .score-value {
    font-size: 2rem;
  }
}
</style>
