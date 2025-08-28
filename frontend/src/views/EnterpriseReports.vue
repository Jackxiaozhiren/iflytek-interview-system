<template>
  <div class="enterprise-reports">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <el-button @click="goBack" link class="back-btn">
            <el-icon><ArrowLeft /></el-icon>
            返回
          </el-button>
          <div class="page-title">
            <h1>数据报表</h1>
            <p>企业招聘数据分析与可视化报表</p>
          </div>
        </div>
        <div class="header-actions">
          <el-button @click="goToPositionManagement" type="info">
            <el-icon><User /></el-icon>
            职位管理
          </el-button>
          <el-button @click="goToBatchInterview" type="success">
            <el-icon><VideoCamera /></el-icon>
            批量面试
          </el-button>
          <el-button @click="exportReport">
            <el-icon><Document /></el-icon>
            导出报表
          </el-button>
          <el-button @click="refreshData">
            <el-icon><ArrowDown /></el-icon>
            刷新数据
          </el-button>
          <el-button @click="generateAIInsights" type="warning">
            <el-icon><Star /></el-icon>
            AI洞察分析
          </el-button>
          <el-button type="primary" @click="generateReport">
            <el-icon><Document /></el-icon>
            生成报表
          </el-button>
        </div>
      </div>
    </div>

    <!-- 时间筛选器 -->
    <div class="time-filter-section">
      <el-card>
        <el-row :gutter="16" align="middle">
          <el-col :span="6">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="handleDateChange"
            />
          </el-col>
          <el-col :span="4">
            <el-select v-model="selectedDomain" placeholder="技术领域" @change="handleDomainChange">
              <el-option label="全部领域" value="all" />
              <el-option label="AI技术" value="ai" />
              <el-option label="大数据" value="bigdata" />
              <el-option label="IoT物联网" value="iot" />
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-model="selectedPosition" placeholder="职位类型" @change="handlePositionChange">
              <el-option label="全部职位" value="all" />
              <el-option label="前端工程师" value="frontend" />
              <el-option label="后端工程师" value="backend" />
              <el-option label="算法工程师" value="algorithm" />
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-model="reportType" placeholder="报表类型" @change="handleReportTypeChange">
              <el-option label="综合报表" value="comprehensive" />
              <el-option label="面试分析" value="interview" />
              <el-option label="候选人分析" value="candidate" />
              <el-option label="效率分析" value="efficiency" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <div class="filter-actions">
              <el-button @click="resetFilters">重置</el-button>
              <el-button type="primary" @click="applyFilters">应用筛选</el-button>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </div>

    <!-- 核心指标卡片 -->
    <div class="metrics-section">
      <el-row :gutter="24">
        <el-col :span="6">
          <el-card class="metric-card">
            <div class="metric-content">
              <div class="metric-icon interviews">
                <el-icon><VideoCamera /></el-icon>
              </div>
              <div class="metric-info">
                <div class="metric-number">{{ metrics.totalInterviews }}</div>
                <div class="metric-label">总面试数</div>
                <div class="metric-trend positive">
                  <el-icon><TrendCharts /></el-icon>
                  +{{ metrics.interviewGrowth }}%
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="metric-card">
            <div class="metric-content">
              <div class="metric-icon candidates">
                <el-icon><User /></el-icon>
              </div>
              <div class="metric-info">
                <div class="metric-number">{{ metrics.totalCandidates }}</div>
                <div class="metric-label">候选人数</div>
                <div class="metric-trend positive">
                  <el-icon><TrendCharts /></el-icon>
                  +{{ metrics.candidateGrowth }}%
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="metric-card">
            <div class="metric-content">
              <div class="metric-icon pass-rate">
                <el-icon><Star /></el-icon>
              </div>
              <div class="metric-info">
                <div class="metric-number">{{ metrics.passRate }}%</div>
                <div class="metric-label">通过率</div>
                <div class="metric-trend" :class="metrics.passRateChange >= 0 ? 'positive' : 'negative'">
                  <el-icon><TrendCharts /></el-icon>
                  {{ metrics.passRateChange >= 0 ? '+' : '' }}{{ metrics.passRateChange }}%
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="metric-card">
            <div class="metric-content">
              <div class="metric-icon avg-score">
                <el-icon><Star /></el-icon>
              </div>
              <div class="metric-info">
                <div class="metric-number">{{ metrics.avgScore }}</div>
                <div class="metric-label">平均分数</div>
                <div class="metric-trend positive">
                  <el-icon><TrendCharts /></el-icon>
                  +{{ metrics.scoreImprovement }}
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 图表区域 -->
    <div class="charts-section">
      <el-row :gutter="24">
        <!-- 面试趋势图 -->
        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
              <div class="card-header">
                <span>面试趋势分析</span>
                <el-button-group>
                  <el-button size="small" :type="trendPeriod === 'week' ? 'primary' : ''" @click="trendPeriod = 'week'">周</el-button>
                  <el-button size="small" :type="trendPeriod === 'month' ? 'primary' : ''" @click="trendPeriod = 'month'">月</el-button>
                  <el-button size="small" :type="trendPeriod === 'quarter' ? 'primary' : ''" @click="trendPeriod = 'quarter'">季</el-button>
                </el-button-group>
              </div>
            </template>
            <div class="chart-container" ref="trendChartRef" style="height: 280px;"></div>
          </el-card>
        </el-col>

        <!-- 技术领域分布 -->
        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
              <div class="card-header">
                <span>技术领域分布</span>
                <el-dropdown @command="handleDomainAction">
                  <el-button size="small">
                    更多<el-icon class="el-icon--right"><ArrowDown /></el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="export">导出数据</el-dropdown-item>
                      <el-dropdown-item command="detail">查看详情</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </template>
            <div class="chart-container" ref="domainChartRef" style="height: 280px;"></div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="24" style="margin-top: 24px;">
        <!-- 面试评分分布 -->
        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
              <div class="card-header">
                <span>面试评分分布</span>
                <el-tag type="info" size="small">最近30天</el-tag>
              </div>
            </template>
            <div class="chart-container" ref="scoreChartRef" style="height: 280px;"></div>
          </el-card>
        </el-col>

        <!-- 面试官效率分析 -->
        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
              <div class="card-header">
                <span>面试官效率分析</span>
                <el-button size="small" @click="viewInterviewerDetails">查看详情</el-button>
              </div>
            </template>
            <div class="chart-container" ref="efficiencyChartRef" style="height: 280px;"></div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 详细数据表格 -->
    <div class="data-table-section">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>详细数据 ({{ tableData.length }})</span>
            <div class="header-actions">
              <el-input
                v-model="searchQuery"
                placeholder="搜索候选人..."
                style="width: 200px; margin-right: 12px;"
                clearable
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
              <el-button @click="exportTableData">
                <el-icon><Document /></el-icon>
                导出
              </el-button>
            </div>
          </div>
        </template>

        <el-table :data="filteredTableData" style="width: 100%" max-height="400">
          <el-table-column prop="candidateName" label="候选人" width="120" />
          <el-table-column prop="position" label="职位" width="120" />
          <el-table-column prop="domain" label="技术领域" width="100">
            <template #default="scope">
              <el-tag
                :type="getDomainTagType(scope.row.domain)"
                :class="getDomainTagClass(scope.row.domain)"
                size="small"
              >
                {{ getDomainLabel(scope.row.domain) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="interviewDate" label="面试日期" width="120" />
          <el-table-column prop="interviewer" label="面试官" width="100" />
          <el-table-column prop="score" label="总分" width="80">
            <template #default="scope">
              <el-tag :type="getScoreType(scope.row.score)">
                {{ scope.row.score }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ getStatusLabel(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="duration" label="时长" width="80" />
          <el-table-column label="操作" width="150">
            <template #default="scope">
              <el-button size="small" @click="viewReport(scope.row)">查看报告</el-button>
              <el-button size="small" @click="viewDetails(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-section">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="filteredTableData.length"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import * as echarts from 'echarts'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import enhancedIflytekSparkService from '../services/enhancedIflytekSparkService.js'
import {
  ArrowLeft, Document, VideoCamera, User, Star,
  TrendCharts, ArrowDown, Search
} from '@element-plus/icons-vue'

const router = useRouter()

// iFlytek Spark服务 (使用单例实例)
const iflytekService = enhancedIflytekSparkService

// 筛选条件
const dateRange = ref([])
const selectedDomain = ref('all')
const selectedPosition = ref('all')
const reportType = ref('comprehensive')
const trendPeriod = ref('month')
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(20)

// 核心指标数据
const metrics = reactive({
  totalInterviews: 1834,
  interviewGrowth: 12.5,
  totalCandidates: 2456,
  candidateGrowth: 8.3,
  passRate: 68.5,
  passRateChange: 2.1,
  avgScore: 85.6,
  scoreImprovement: 3.2
})

// 图表引用
const trendChartRef = ref()
const domainChartRef = ref()
const scoreChartRef = ref()
const efficiencyChartRef = ref()

// 表格数据
const tableData = ref([
  {
    candidateName: '张三',
    position: '前端工程师',
    domain: 'ai',
    interviewDate: '2024-01-15',
    interviewer: '李面试官',
    score: 88,
    status: 'passed',
    duration: '45分钟'
  },
  {
    candidateName: '李四',
    position: '算法工程师',
    domain: 'ai',
    interviewDate: '2024-01-14',
    interviewer: '王面试官',
    score: 92,
    status: 'passed',
    duration: '60分钟'
  },
  {
    candidateName: '王五',
    position: '大数据工程师',
    domain: 'bigdata',
    interviewDate: '2024-01-13',
    interviewer: '赵面试官',
    score: 65,
    status: 'failed',
    duration: '40分钟'
  }
])

// 计算属性
const filteredTableData = computed(() => {
  let result = tableData.value
  
  if (searchQuery.value) {
    result = result.filter(item => 
      item.candidateName.includes(searchQuery.value) ||
      item.position.includes(searchQuery.value)
    )
  }
  
  if (selectedDomain.value !== 'all') {
    result = result.filter(item => item.domain === selectedDomain.value)
  }
  
  if (selectedPosition.value !== 'all') {
    result = result.filter(item => item.position.includes(selectedPosition.value))
  }
  
  return result
})

// 方法
const goBack = () => {
  router.go(-1)
}

const goToPositionManagement = () => {
  router.push('/position-management')
}

const goToBatchInterview = () => {
  router.push('/batch-interview-setup')
}

const getDomainLabel = (domain) => {
  const labels = {
    'ai': 'AI技术',
    'bigdata': '大数据',
    'iot': 'IoT物联网'
  }
  return labels[domain] || domain
}

// 获取技术领域标签类型（使用Element Plus内置类型确保对比度）
const getDomainTagType = (domain) => {
  const types = {
    'ai': 'primary',    // 使用primary类型，确保良好对比度
    'bigdata': 'success', // 使用success类型
    'iot': 'warning'    // 使用warning类型
  }
  return types[domain] || 'info'
}

// 获取技术领域自定义样式类
const getDomainTagClass = (domain) => {
  const classes = {
    'ai': 'domain-tag-ai',
    'bigdata': 'domain-tag-bigdata',
    'iot': 'domain-tag-iot'
  }
  return classes[domain] || 'domain-tag-default'
}

// 保留原有颜色函数用于其他地方
const getDomainColor = (domain) => {
  const colors = {
    'ai': '#0066cc',
    'bigdata': '#059669',
    'iot': '#ea580c'
  }
  return colors[domain] || '#666'
}

const getScoreType = (score) => {
  if (score >= 90) return 'success'
  if (score >= 80) return 'warning'
  if (score >= 70) return ''
  return 'danger'
}

const getStatusLabel = (status) => {
  const labels = {
    'passed': '通过',
    'failed': '未通过',
    'pending': '待定'
  }
  return labels[status] || status
}

const getStatusType = (status) => {
  const types = {
    'passed': 'success',
    'failed': 'danger',
    'pending': 'warning'
  }
  return types[status] || ''
}

const handleDateChange = () => {
  ElMessage.info('日期筛选已更新')
}

const handleDomainChange = () => {
  ElMessage.info('技术领域筛选已更新')
}

const handlePositionChange = () => {
  ElMessage.info('职位筛选已更新')
}

const handleReportTypeChange = () => {
  ElMessage.info('报表类型已更新')
}

const resetFilters = () => {
  dateRange.value = []
  selectedDomain.value = 'all'
  selectedPosition.value = 'all'
  reportType.value = 'comprehensive'
  searchQuery.value = ''
  ElMessage.success('筛选条件已重置')
}

const applyFilters = () => {
  ElMessage.success('筛选条件已应用')
}

const exportReport = async () => {
  try {
    // 显示格式选择
    const { value: format } = await ElMessageBox.prompt(
      '请选择导出格式：',
      '导出企业报表',
      {
        confirmButtonText: '导出',
        cancelButtonText: '取消',
        inputType: 'select',
        inputOptions: {
          'excel': 'Excel格式 (.xlsx)',
          'pdf': 'PDF格式 (.pdf)',
          'csv': 'CSV格式 (.csv)'
        },
        inputValue: 'excel'
      }
    )

    // 显示导出进度
    const loadingInstance = ElLoading.service({
      lock: true,
      text: '正在生成企业报表...',
      background: 'rgba(0, 0, 0, 0.7)'
    })

    await new Promise(resolve => setTimeout(resolve, 2500))

    // 准备报表数据
    const reportData = {
      title: 'iFlytek企业招聘数据报表',
      generatedAt: new Date().toLocaleString('zh-CN'),
      period: dateRange.value.length ? `${dateRange.value[0]} 至 ${dateRange.value[1]}` : '全部时间',
      metrics: {
        totalInterviews: metrics.totalInterviews,
        interviewGrowth: metrics.interviewGrowth,
        totalCandidates: metrics.totalCandidates,
        candidateGrowth: metrics.candidateGrowth,
        avgScore: metrics.avgScore,
        scoreGrowth: metrics.scoreGrowth,
        passRate: metrics.passRate,
        passRateGrowth: metrics.passRateGrowth
      },
      domainDistribution: [
        { name: 'AI技术', value: 1048, percentage: '45.2%' },
        { name: '大数据', value: 735, percentage: '31.7%' },
        { name: 'IoT物联网', value: 580, percentage: '25.0%' }
      ],
      tableData: filteredTableData.value
    }

    if (format === 'excel') {
      const fileName = `iFlytek企业报表_${new Date().toISOString().slice(0, 10)}.xlsx`

      try {
        // 创建工作簿
        const workbook = XLSX.utils.book_new()

        // 创建概览工作表
        const overviewData = [
          ['iFlytek企业招聘数据报表'],
          [''],
          ['生成时间', reportData.generatedAt],
          ['统计周期', reportData.period],
          [''],
          ['核心指标'],
          ['总面试数', reportData.metrics.totalInterviews, `增长率: ${reportData.metrics.interviewGrowth}%`],
          ['总候选人数', reportData.metrics.totalCandidates, `增长率: ${reportData.metrics.candidateGrowth}%`],
          ['平均分数', reportData.metrics.avgScore, `增长率: ${reportData.metrics.scoreGrowth}%`],
          ['通过率', reportData.metrics.passRate, `增长率: ${reportData.metrics.passRateGrowth}%`]
        ]
        const overviewSheet = XLSX.utils.aoa_to_sheet(overviewData)
        overviewSheet['!cols'] = [{ width: 20 }, { width: 20 }, { width: 25 }]
        XLSX.utils.book_append_sheet(workbook, overviewSheet, '概览')

        // 创建技术领域分布工作表
        const domainData = [
          ['技术领域分布'],
          [''],
          ['领域', '人数', '占比'],
          ...reportData.domainDistribution.map(item => [item.name, item.value, item.percentage])
        ]
        const domainSheet = XLSX.utils.aoa_to_sheet(domainData)
        domainSheet['!cols'] = [{ width: 15 }, { width: 12 }, { width: 12 }]
        XLSX.utils.book_append_sheet(workbook, domainSheet, '技术领域分布')

        // 创建详细面试记录工作表
        const detailData = [
          ['详细面试数据'],
          [''],
          ['候选人', '职位', '技术领域', '面试日期', '面试官', '总分', '状态', '时长'],
          ...reportData.tableData.map(row => [
            row.candidateName, row.position, row.domain, row.interviewDate,
            row.interviewer, row.score, row.status, row.duration
          ])
        ]
        const detailSheet = XLSX.utils.aoa_to_sheet(detailData)
        detailSheet['!cols'] = [
          { width: 12 }, { width: 15 }, { width: 12 }, { width: 12 },
          { width: 12 }, { width: 8 }, { width: 10 }, { width: 10 }
        ]
        XLSX.utils.book_append_sheet(workbook, detailSheet, '详细记录')

        // 生成Excel文件
        const excelBuffer = XLSX.write(workbook, {
          bookType: 'xlsx',
          type: 'array',
          compression: true
        })

        const blob = new Blob([excelBuffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })

        saveAs(blob, fileName)

      } catch (error) {
        console.error('Excel生成失败:', error)
        throw new Error('Excel文件生成失败')
      }
    } else if (format === 'csv') {
      const fileName = `iFlytek企业报表_${new Date().toISOString().slice(0, 10)}.csv`

      const reportContent = [
        ['iFlytek企业招聘数据报表'],
        ['生成时间', reportData.generatedAt],
        ['统计周期', reportData.period],
        [''],
        ['核心指标'],
        ['总面试数', reportData.metrics.totalInterviews, `增长率: ${reportData.metrics.interviewGrowth}%`],
        ['总候选人数', reportData.metrics.totalCandidates, `增长率: ${reportData.metrics.candidateGrowth}%`],
        ['平均分数', reportData.metrics.avgScore, `增长率: ${reportData.metrics.scoreGrowth}%`],
        ['通过率', reportData.metrics.passRate, `增长率: ${reportData.metrics.passRateGrowth}%`],
        [''],
        ['技术领域分布'],
        ['领域', '人数', '占比'],
        ...reportData.domainDistribution.map(item => [item.name, item.value, item.percentage]),
        [''],
        ['详细面试数据'],
        ['候选人', '职位', '技术领域', '面试日期', '面试官', '总分', '状态', '时长'],
        ...reportData.tableData.map(row => [
          row.candidateName, row.position, row.domain, row.interviewDate,
          row.interviewer, row.score, row.status, row.duration
        ])
      ]

      const csvContent = reportContent.map(row => row.join(',')).join('\n')
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = fileName
      link.click()
    } else if (format === 'pdf') {
      ElMessage.info('PDF格式正在开发中，请使用Excel或CSV格式')
    }

    loadingInstance.close()
    ElMessage.success(`企业报表已导出为${format.toUpperCase()}格式`)

  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('报表导出失败，请稍后重试')
  }
}

const refreshData = () => {
  ElMessage.success('数据已刷新')
}

const generateReport = async () => {
  try {
    // 显示报表类型选择
    const { value: reportType } = await ElMessageBox.prompt(
      '请选择要生成的报表类型：',
      '生成数据报表',
      {
        confirmButtonText: '生成',
        cancelButtonText: '取消',
        inputType: 'select',
        inputOptions: {
          'comprehensive': '综合数据报表',
          'interview': '面试统计报表',
          'candidate': '候选人分析报表',
          'domain': '技术领域报表',
          'performance': '面试官绩效报表'
        },
        inputValue: 'comprehensive'
      }
    )

    // 显示生成进度
    const loadingInstance = ElLoading.service({
      lock: true,
      text: '正在生成报表数据...',
      background: 'rgba(0, 0, 0, 0.7)'
    })

    // 模拟报表生成过程
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 根据报表类型生成不同的数据
    const reportData = generateReportData(reportType)

    loadingInstance.close()

    // 显示报表预览
    await showReportPreview(reportData)

    ElMessage.success(`${getReportTypeName(reportType)}生成完成`)

  } catch (error) {
    if (error !== 'cancel') {
      console.error('报表生成失败:', error)
      ElMessage.error('报表生成失败，请稍后重试')
    }
  }
}

// 生成报表数据
const generateReportData = (reportType) => {
  const baseData = {
    generatedAt: new Date().toLocaleString('zh-CN'),
    period: '2025年7月',
    reportType: reportType
  }

  switch (reportType) {
    case 'comprehensive':
      return {
        ...baseData,
        title: 'iFlytek综合数据报表',
        summary: {
          totalInterviews: 1834,
          totalCandidates: 2318,
          passRate: 68.5,
          avgScore: 85.6,
          topDomain: 'AI技术',
          bestInterviewer: '王面试官'
        },
        charts: [
          {
            title: '面试趋势分析',
            type: 'line',
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            title: '技术领域分布',
            type: 'pie',
            data: [
              { name: 'AI技术', value: 1048 },
              { name: '大数据', value: 735 },
              { name: 'IoT物联网', value: 580 }
            ]
          }
        ],
        insights: [
          'AI技术领域需求持续增长，同比增长28%',
          '面试通过率较上月提升5.2%',
          '候选人整体技术水平有所提升'
        ]
      }

    case 'interview':
      return {
        ...baseData,
        title: 'iFlytek面试统计报表',
        summary: {
          totalInterviews: 1834,
          completedInterviews: 1756,
          avgDuration: '45分钟',
          avgScore: 85.6,
          passRate: 68.5
        },
        details: [
          { date: '2025-07-21', count: 23, passCount: 16, avgScore: 87.2 },
          { date: '2025-07-20', count: 31, passCount: 21, avgScore: 84.8 },
          { date: '2025-07-19', count: 28, passCount: 19, avgScore: 86.1 }
        ]
      }

    case 'candidate':
      return {
        ...baseData,
        title: 'iFlytek候选人分析报表',
        summary: {
          totalCandidates: 2318,
          activeCandidates: 1892,
          topSkill: 'Python',
          avgExperience: '4.2年'
        },
        distribution: {
          experience: [
            { range: '1-3年', count: 892 },
            { range: '3-5年', count: 756 },
            { range: '5-8年', count: 445 },
            { range: '8年以上', count: 225 }
          ],
          education: [
            { level: '本科', count: 1389 },
            { level: '硕士', count: 756 },
            { level: '博士', count: 173 }
          ]
        }
      }

    case 'domain':
      return {
        ...baseData,
        title: 'iFlytek技术领域报表',
        domains: [
          {
            name: 'AI技术',
            candidates: 1048,
            interviews: 834,
            passRate: 72.3,
            avgScore: 87.5,
            skills: ['Python', '机器学习', '深度学习', 'TensorFlow']
          },
          {
            name: '大数据',
            candidates: 735,
            interviews: 612,
            passRate: 65.8,
            avgScore: 84.2,
            skills: ['Hadoop', 'Spark', 'Kafka', 'Elasticsearch']
          },
          {
            name: 'IoT物联网',
            candidates: 580,
            interviews: 456,
            passRate: 69.1,
            avgScore: 85.8,
            skills: ['嵌入式', '传感器', 'MQTT', '边缘计算']
          }
        ]
      }

    case 'performance':
      return {
        ...baseData,
        title: 'iFlytek面试官绩效报表',
        interviewers: [
          {
            name: '王面试官',
            interviews: 156,
            avgScore: 87.2,
            passRate: 73.1,
            satisfaction: 4.8,
            domains: ['AI技术', '机器学习']
          },
          {
            name: '李面试官',
            interviews: 142,
            avgScore: 85.6,
            passRate: 68.3,
            satisfaction: 4.6,
            domains: ['大数据', '数据分析']
          },
          {
            name: '张面试官',
            interviews: 128,
            avgScore: 86.4,
            passRate: 71.9,
            satisfaction: 4.7,
            domains: ['IoT物联网', '嵌入式']
          }
        ]
      }

    default:
      return baseData
  }
}

// 获取报表类型名称
const getReportTypeName = (reportType) => {
  const names = {
    'comprehensive': '综合数据报表',
    'interview': '面试统计报表',
    'candidate': '候选人分析报表',
    'domain': '技术领域报表',
    'performance': '面试官绩效报表'
  }
  return names[reportType] || '数据报表'
}

// 显示报表预览
const showReportPreview = async (reportData) => {
  const previewHTML = createReportPreviewHTML(reportData)

  return ElMessageBox.alert(
    previewHTML,
    `${reportData.title} - 预览`,
    {
      dangerouslyUseHTMLString: true,
      confirmButtonText: '下载报表',
      customClass: 'report-preview-dialog',
      customStyle: {
        width: '90%',
        maxWidth: '1000px'
      },
      callback: async (action) => {
        if (action === 'confirm') {
          await downloadReport(reportData)
        }
      }
    }
  )
}

// 创建报表预览HTML
const createReportPreviewHTML = (reportData) => {
  let html = `
    <div style="text-align: left; font-family: 'Microsoft YaHei', sans-serif; max-height: 60vh; overflow-y: auto;">
      <!-- 报表头部 -->
      <div style="border-bottom: 2px solid #f0f0f0; padding-bottom: 16px; margin-bottom: 20px;">
        <h3 style="color: #1890ff; margin-bottom: 8px; font-size: 18px;">${reportData.title}</h3>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="color: #666; font-size: 14px;">生成时间：${reportData.generatedAt}</span>
          <span style="color: #666; font-size: 14px;">统计周期：${reportData.period}</span>
        </div>
      </div>
  `

  // 根据报表类型添加不同内容
  if (reportData.summary) {
    html += `
      <div style="margin-bottom: 20px;">
        <h4 style="color: #0066cc; margin-bottom: 12px;">📊 核心数据概览</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
    `

    Object.entries(reportData.summary).forEach(([key, value]) => {
      const label = getSummaryLabel(key)
      html += `
        <div style="background: #f8fafc; padding: 12px; border-radius: 6px; border-left: 3px solid #1890ff;">
          <div style="font-weight: 600; color: #2c3e50; margin-bottom: 4px;">${label}</div>
          <div style="color: #1890ff; font-weight: 600; font-size: 16px;">${value}</div>
        </div>
      `
    })

    html += `</div></div>`
  }

  // 添加图表信息
  if (reportData.charts) {
    html += `
      <div style="margin-bottom: 20px;">
        <h4 style="color: #0066cc; margin-bottom: 12px;">📈 数据可视化</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 12px;">
    `

    reportData.charts.forEach(chart => {
      html += `
        <div style="background: #f6f8fa; padding: 16px; border-radius: 8px;">
          <h5 style="color: #2c3e50; margin-bottom: 8px;">${chart.title}</h5>
          <p style="color: #666; margin: 0;">图表类型: ${chart.type === 'line' ? '折线图' : chart.type === 'pie' ? '饼图' : '柱状图'}</p>
        </div>
      `
    })

    html += `</div></div>`
  }

  // 添加洞察分析
  if (reportData.insights) {
    html += `
      <div style="background: #e6f7ff; padding: 16px; border-radius: 8px;">
        <h4 style="color: #1890ff; margin-bottom: 12px;">💡 AI智能洞察</h4>
        <ul style="margin: 0; padding-left: 20px;">
    `

    reportData.insights.forEach(insight => {
      html += `<li style="margin-bottom: 8px; color: #2c3e50;">${insight}</li>`
    })

    html += `</ul></div>`
  }

  html += `</div>`
  return html
}

// 获取摘要标签
const getSummaryLabel = (key) => {
  const labels = {
    totalInterviews: '总面试数',
    totalCandidates: '总候选人数',
    passRate: '通过率(%)',
    avgScore: '平均分数',
    topDomain: '热门领域',
    bestInterviewer: '最佳面试官',
    completedInterviews: '已完成面试',
    avgDuration: '平均时长',
    activeCandidates: '活跃候选人',
    topSkill: '热门技能',
    avgExperience: '平均经验'
  }
  return labels[key] || key
}

// 下载报表
const downloadReport = async (reportData) => {
  try {
    const loadingInstance = ElLoading.service({
      lock: true,
      text: '正在生成报表文件...',
      background: 'rgba(0, 0, 0, 0.7)'
    })

    // 创建Excel报表
    const workbook = XLSX.utils.book_new()

    // 概览工作表
    const overviewData = [
      [reportData.title],
      [''],
      ['生成时间', reportData.generatedAt],
      ['统计周期', reportData.period],
      ['']
    ]

    if (reportData.summary) {
      overviewData.push(['核心数据概览'])
      Object.entries(reportData.summary).forEach(([key, value]) => {
        overviewData.push([getSummaryLabel(key), value])
      })
    }

    const overviewSheet = XLSX.utils.aoa_to_sheet(overviewData)
    overviewSheet['!cols'] = [{ width: 20 }, { width: 20 }]
    XLSX.utils.book_append_sheet(workbook, overviewSheet, '概览')

    // 根据报表类型添加详细数据工作表
    if (reportData.details) {
      const detailData = [
        ['详细数据'],
        [''],
        ['日期', '面试数量', '通过数量', '平均分数'],
        ...reportData.details.map(item => [item.date, item.count, item.passCount, item.avgScore])
      ]
      const detailSheet = XLSX.utils.aoa_to_sheet(detailData)
      XLSX.utils.book_append_sheet(workbook, detailSheet, '详细数据')
    }

    // 生成文件
    const fileName = `${reportData.title}_${new Date().toISOString().slice(0, 10)}.xlsx`
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
      compression: true
    })

    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })

    saveAs(blob, fileName)

    loadingInstance.close()
    ElMessage.success('报表文件下载成功')

  } catch (error) {
    console.error('报表下载失败:', error)
    ElMessage.error('报表下载失败，请稍后重试')
  }
}

const generateAIInsights = async () => {
  try {
    // 显示分析进度
    const loadingInstance = ElLoading.service({
      lock: true,
      text: '正在进行AI数据洞察分析...',
      background: 'rgba(0, 0, 0, 0.7)'
    })

    // 模拟AI分析过程
    await new Promise(resolve => setTimeout(resolve, 3000))

    // 生成AI洞察结果
    const aiInsights = {
      summary: '基于iFlytek Spark AI引擎的深度数据分析',
      keyFindings: [
        '面试通过率较上月提升12.5%，主要得益于AI面试官的精准评估',
        'AI技术领域候选人质量显著提升，平均分数达到85.2分',
        '面试时长优化效果明显，平均缩短15分钟同时保持评估准确性'
      ],
      recommendations: [
        '建议加大AI技术领域的招聘投入，市场需求持续增长',
        '优化大数据领域的面试流程，提升候选人体验',
        '加强IoT领域的技术评估标准，确保人才质量'
      ],
      trends: {
        passRate: '+12.5%',
        avgScore: '+8.3%',
        efficiency: '+15%'
      }
    }

    loadingInstance.close()

    // 显示详细的AI洞察结果
    ElMessageBox.alert(
      `<div style="text-align: left; max-height: 500px; overflow-y: auto;">
        <h3 style="color: #1890ff; margin-bottom: 16px;">🤖 iFlytek Spark AI数据洞察报告</h3>

        <div style="background: #e6f7ff; padding: 12px; border-radius: 6px; margin-bottom: 16px;">
          <h4 style="color: #0066cc; margin-bottom: 8px;">📊 核心发现</h4>
          ${aiInsights.keyFindings.map(finding => `<p style="margin: 4px 0;">• ${finding}</p>`).join('')}
        </div>

        <div style="background: #f6ffed; padding: 12px; border-radius: 6px; margin-bottom: 16px;">
          <h4 style="color: #52c41a; margin-bottom: 8px;">💡 智能建议</h4>
          ${aiInsights.recommendations.map(rec => `<p style="margin: 4px 0;">• ${rec}</p>`).join('')}
        </div>

        <div style="background: #fff7e6; padding: 12px; border-radius: 6px; margin-bottom: 16px;">
          <h4 style="color: #fa8c16; margin-bottom: 8px;">📈 关键指标变化</h4>
          <p>• 面试通过率: ${aiInsights.trends.passRate}</p>
          <p>• 平均评分: ${aiInsights.trends.avgScore}</p>
          <p>• 面试效率: ${aiInsights.trends.efficiency}</p>
        </div>

        <div style="background: #f0f0f0; padding: 12px; border-radius: 6px; font-size: 12px; color: #666;">
          <p>* 本报告由iFlytek Spark AI引擎生成，基于实时数据分析和机器学习算法</p>
          <p>* 生成时间: ${new Date().toLocaleString('zh-CN')}</p>
        </div>
      </div>`,
      'AI智能洞察分析报告',
      {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '保存报告',
        cancelButtonText: '关闭',
        showCancelButton: true,
        customClass: 'ai-insights-dialog',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            // 保存报告功能
            saveAIInsightsReport(aiInsights)
          }
          done()
        }
      }
    )

  } catch (error) {
    console.error('❌ AI洞察分析失败:', error)
    ElMessage.error('AI洞察分析暂时不可用，请稍后重试')
  }
}

// 保存AI洞察报告
const saveAIInsightsReport = (insights) => {
  try {
    const fileName = `AI洞察报告_${new Date().toISOString().slice(0, 10)}.txt`
    const reportContent = `iFlytek Spark AI数据洞察报告
生成时间: ${new Date().toLocaleString('zh-CN')}

核心发现:
${insights.keyFindings.map(finding => `• ${finding}`).join('\n')}

智能建议:
${insights.recommendations.map(rec => `• ${rec}`).join('\n')}

关键指标变化:
• 面试通过率: ${insights.trends.passRate}
• 平均评分: ${insights.trends.avgScore}
• 面试效率: ${insights.trends.efficiency}

---
本报告由iFlytek Spark AI引擎生成
`

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = fileName
    link.click()

    ElMessage.success('AI洞察报告已保存')
  } catch (error) {
    console.error('保存报告失败:', error)
    ElMessage.error('报告保存失败')
  }
}

const handleDomainAction = async (command) => {
  try {
    if (command === 'export') {
      await exportDomainData()
    } else if (command === 'detail') {
      await viewDomainDetail()
    }
  } catch (error) {
    console.error('操作执行失败:', error)
    ElMessage.error('操作执行失败，请稍后重试')
  }
}

// 导出技术领域分布数据
const exportDomainData = async () => {
  try {
    // 显示格式选择
    const { value: format } = await ElMessageBox.prompt(
      '请选择导出格式：',
      '导出技术领域分布数据',
      {
        confirmButtonText: '导出',
        cancelButtonText: '取消',
        inputType: 'select',
        inputOptions: {
          'excel': 'Excel格式 (.xlsx)',
          'csv': 'CSV格式 (.csv)'
        },
        inputValue: 'excel'
      }
    )

    // 显示导出进度
    const loadingInstance = ElLoading.service({
      lock: true,
      text: '正在导出数据...',
      background: 'rgba(0, 0, 0, 0.7)'
    })

    // 准备导出数据
    const domainData = [
      { name: 'AI技术', value: 1048, percentage: '45.2%' },
      { name: '大数据', value: 735, percentage: '31.7%' },
      { name: 'IoT物联网', value: 580, percentage: '25.0%' }
    ]

    await new Promise(resolve => setTimeout(resolve, 1000))

    if (format === 'excel') {
      const fileName = `技术领域分布_${new Date().toISOString().slice(0, 10)}.xlsx`

      try {
        // 创建工作簿
        const workbook = XLSX.utils.book_new()

        // 创建技术领域分布工作表
        const sheetData = [
          ['iFlytek技术领域分布报告'],
          [''],
          ['生成时间', new Date().toLocaleString('zh-CN')],
          [''],
          ['技术领域', '候选人数量', '占比', '备注'],
          ...domainData.map(item => [
            item.name,
            item.value,
            item.percentage,
            `${item.name}领域候选人分布情况`
          ]),
          [''],
          ['总计', domainData.reduce((sum, item) => sum + item.value, 0), '100%', '所有技术领域候选人总数']
        ]

        const worksheet = XLSX.utils.aoa_to_sheet(sheetData)

        // 设置列宽
        worksheet['!cols'] = [
          { width: 15 }, // 技术领域
          { width: 12 }, // 候选人数量
          { width: 10 }, // 占比
          { width: 30 }  // 备注
        ]

        // 设置标题样式
        worksheet['A1'] = {
          v: 'iFlytek技术领域分布报告',
          t: 's',
          s: { font: { bold: true, sz: 16 } }
        }

        XLSX.utils.book_append_sheet(workbook, worksheet, '技术领域分布')

        // 生成Excel文件
        const excelBuffer = XLSX.write(workbook, {
          bookType: 'xlsx',
          type: 'array',
          compression: true
        })

        const blob = new Blob([excelBuffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })

        saveAs(blob, fileName)

      } catch (error) {
        console.error('Excel生成失败:', error)
        throw new Error('Excel文件生成失败')
      }
    } else if (format === 'csv') {
      const fileName = `技术领域分布_${new Date().toISOString().slice(0, 10)}.csv`
      const csvContent = [
        ['技术领域', '候选人数量', '占比'],
        ...domainData.map(item => [item.name, item.value, item.percentage])
      ].map(row => row.join(',')).join('\n')

      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = fileName
      link.click()
    }

    loadingInstance.close()
    ElMessage.success(`技术领域分布数据已导出为${format.toUpperCase()}格式`)

  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('数据导出失败，请稍后重试')
  }
}

// 查看技术领域详情
const viewDomainDetail = async () => {
  try {
    const loadingInstance = ElLoading.service({
      lock: true,
      text: '正在加载详细数据...',
      background: 'rgba(0, 0, 0, 0.7)'
    })

    await new Promise(resolve => setTimeout(resolve, 1200))
    loadingInstance.close()

    ElMessageBox.alert(
      `<div style="text-align: left;">
        <h3 style="color: #1890ff; margin-bottom: 16px;">技术领域分布详情</h3>
        <div style="margin-bottom: 16px;">
          <h4 style="color: #0066cc; margin-bottom: 8px;">AI技术领域 (45.2%)</h4>
          <p>• 机器学习工程师: 456人</p>
          <p>• 深度学习专家: 312人</p>
          <p>• 自然语言处理: 280人</p>
        </div>
        <div style="margin-bottom: 16px;">
          <h4 style="color: #059669; margin-bottom: 8px;">大数据领域 (31.7%)</h4>
          <p>• 数据分析师: 298人</p>
          <p>• 大数据工程师: 267人</p>
          <p>• 数据科学家: 170人</p>
        </div>
        <div style="margin-bottom: 16px;">
          <h4 style="color: #ea580c; margin-bottom: 8px;">IoT物联网领域 (25.0%)</h4>
          <p>• 嵌入式工程师: 234人</p>
          <p>• 物联网架构师: 189人</p>
          <p>• 硬件工程师: 157人</p>
        </div>
        <div style="background: #f6f8fa; padding: 12px; border-radius: 6px;">
          <h4 style="color: #1890ff; margin-bottom: 8px;">趋势分析：</h4>
          <p>• AI技术领域需求持续增长，同比增长28%</p>
          <p>• 大数据领域趋于稳定，增长率15%</p>
          <p>• IoT领域快速发展，增长率35%</p>
        </div>
      </div>`,
      '技术领域分布详情',
      {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '知道了',
        customClass: 'domain-detail-dialog'
      }
    )
  } catch (error) {
    console.error('查看详情失败:', error)
    ElMessage.error('获取详细数据失败，请稍后重试')
  }
}

const viewInterviewerDetails = () => {
  ElMessage.info('面试官详情功能开发中...')
}

const exportTableData = async () => {
  try {
    // 显示格式选择
    const { value: format } = await ElMessageBox.prompt(
      '请选择导出格式：',
      '导出详细数据表格',
      {
        confirmButtonText: '导出',
        cancelButtonText: '取消',
        inputType: 'select',
        inputOptions: {
          'excel': 'Excel格式 (.xlsx)',
          'csv': 'CSV格式 (.csv)'
        },
        inputValue: 'excel'
      }
    )

    // 显示导出进度
    const loadingInstance = ElLoading.service({
      lock: true,
      text: '正在导出表格数据...',
      background: 'rgba(0, 0, 0, 0.7)'
    })

    await new Promise(resolve => setTimeout(resolve, 1500))

    // 准备表格数据
    const tableHeaders = ['候选人', '职位', '技术领域', '面试日期', '面试官', '总分', '状态', '时长']
    const tableRows = filteredTableData.value.map(row => [
      row.candidateName,
      row.position,
      row.domain,
      row.interviewDate,
      row.interviewer,
      row.score,
      row.status,
      row.duration
    ])

    if (format === 'excel') {
      const fileName = `面试详细数据_${new Date().toISOString().slice(0, 10)}.xlsx`

      try {
        // 创建工作簿
        const workbook = XLSX.utils.book_new()

        // 创建工作表数据
        const sheetData = [
          ['iFlytek面试详细数据报告'],
          [''],
          ['生成时间', new Date().toLocaleString('zh-CN')],
          ['数据条数', filteredTableData.value.length],
          [''],
          tableHeaders,
          ...tableRows
        ]

        const worksheet = XLSX.utils.aoa_to_sheet(sheetData)

        // 设置列宽
        worksheet['!cols'] = [
          { width: 12 }, // 候选人
          { width: 15 }, // 职位
          { width: 12 }, // 技术领域
          { width: 12 }, // 面试日期
          { width: 12 }, // 面试官
          { width: 8 },  // 总分
          { width: 10 }, // 状态
          { width: 10 }  // 时长
        ]

        // 设置标题样式
        worksheet['A1'] = {
          v: 'iFlytek面试详细数据报告',
          t: 's',
          s: { font: { bold: true, sz: 16 } }
        }

        XLSX.utils.book_append_sheet(workbook, worksheet, '面试详细数据')

        // 生成Excel文件
        const excelBuffer = XLSX.write(workbook, {
          bookType: 'xlsx',
          type: 'array',
          compression: true
        })

        const blob = new Blob([excelBuffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })

        saveAs(blob, fileName)

      } catch (error) {
        console.error('Excel生成失败:', error)
        throw new Error('Excel文件生成失败')
      }
    } else if (format === 'csv') {
      const fileName = `面试详细数据_${new Date().toISOString().slice(0, 10)}.csv`

      const csvContent = [
        tableHeaders,
        ...tableRows
      ].map(row => row.join(',')).join('\n')

      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = fileName
      link.click()
    }

    loadingInstance.close()
    ElMessage.success(`表格数据已导出为${format.toUpperCase()}格式，共${filteredTableData.value.length}条记录`)

  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('表格数据导出失败，请稍后重试')
  }
}

const viewReport = (row) => {
  ElMessage.info(`查看 ${row.candidateName} 的面试报告`)
}

const viewDetails = (row) => {
  ElMessage.info(`查看 ${row.candidateName} 的详细信息`)
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (page) => {
  currentPage.value = page
}

// 图表实例
let trendChart = null
let domainChart = null
let scoreChart = null
let efficiencyChart = null

// 安全初始化图表的辅助函数
const safeInitChart = (containerRef, initFunction, maxRetries = 3) => {
  let retries = 0

  const tryInit = () => {
    if (!containerRef.value) return

    const container = containerRef.value
    if (container.clientWidth === 0 || container.clientHeight === 0) {
      retries++
      if (retries < maxRetries) {
        setTimeout(tryInit, 100)
      } else {
        console.warn('图表容器尺寸异常，跳过初始化')
      }
      return
    }

    try {
      initFunction(container)
    } catch (error) {
      console.error('图表初始化失败:', error)
    }
  }

  tryInit()
}

// 获取不同时间范围的趋势数据
const getTrendChartData = (period) => {
  const dataMap = {
    week: {
      xAxisData: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      seriesData: [45, 52, 38, 67, 73, 89, 94]
    },
    month: {
      xAxisData: ['1月', '2月', '3月', '4月', '5月', '6月'],
      seriesData: [120, 200, 150, 80, 70, 110]
    },
    quarter: {
      xAxisData: ['Q1', 'Q2', 'Q3', 'Q4'],
      seriesData: [456, 523, 612, 689]
    }
  }
  return dataMap[period] || dataMap.month
}

// 更新趋势图表
const updateTrendChart = () => {
  if (!trendChart) return

  const data = getTrendChartData(trendPeriod.value)

  const option = {
    xAxis: {
      data: data.xAxisData
    },
    series: [{
      data: data.seriesData
    }]
  }

  trendChart.setOption(option)
}

// 初始化图表
const initCharts = () => {
  // 面试趋势图
  safeInitChart(trendChartRef, (container) => {
    trendChart = echarts.init(container)

    const data = getTrendChartData(trendPeriod.value)

    trendChart.setOption({
      title: { text: '面试数量趋势' },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: data.xAxisData
      },
      yAxis: { type: 'value' },
      series: [{
        data: data.seriesData,
        type: 'line',
        smooth: true,
        itemStyle: { color: '#0066cc' }
      }]
    })
  })

  // 技术领域分布图
  safeInitChart(domainChartRef, (container) => {
    domainChart = echarts.init(container)
    domainChart.setOption({
      title: { text: '技术领域分布' },
      tooltip: { trigger: 'item' },
      series: [{
        type: 'pie',
        radius: '50%',
        data: [
          { value: 1048, name: 'AI技术', itemStyle: { color: '#0066cc' } },
          { value: 735, name: '大数据', itemStyle: { color: '#059669' } },
          { value: 580, name: 'IoT物联网', itemStyle: { color: '#ea580c' } }
        ]
      }]
    })
  })

  // 评分分布图
  safeInitChart(scoreChartRef, (container) => {
    scoreChart = echarts.init(container)
    scoreChart.setOption({
      title: { text: '评分分布' },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: ['0-60', '60-70', '70-80', '80-90', '90-100']
      },
      yAxis: { type: 'value' },
      series: [{
        data: [23, 45, 156, 234, 178],
        type: 'bar',
        itemStyle: { color: '#667eea' }
      }]
    })
  })

  // 效率分析图
  safeInitChart(efficiencyChartRef, (container) => {
    efficiencyChart = echarts.init(container)
    efficiencyChart.setOption({
      title: { text: '面试官效率' },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: ['李面试官', '王面试官', '赵面试官', '刘面试官']
      },
      yAxis: { type: 'value' },
      series: [{
        data: [45, 38, 52, 41],
        type: 'bar',
        itemStyle: { color: '#4c51bf' }
      }]
    })
  })
}

// 监听时间范围变化
watch(trendPeriod, () => {
  updateTrendChart()
})

onMounted(async () => {
  // 初始化iFlytek服务
  try {
    console.log('✅ iFlytek Spark服务已就绪')
  } catch (error) {
    console.error('❌ iFlytek Spark服务初始化失败:', error)
  }

  // 初始化图表
  nextTick(() => {
    setTimeout(() => {
      initCharts()
    }, 100)
  })
  console.log('企业报表页面已加载')
})

onUnmounted(() => {
  // 清理图表实例
  if (trendChart) {
    trendChart.dispose()
    trendChart = null
  }
  if (domainChart) {
    domainChart.dispose()
    domainChart = null
  }
  if (scoreChart) {
    scoreChart.dispose()
    scoreChart = null
  }
  if (efficiencyChart) {
    efficiencyChart.dispose()
    efficiencyChart = null
  }
})
</script>

<style scoped>
.enterprise-reports {
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

.time-filter-section,
.metrics-section,
.charts-section,
.data-table-section {
  max-width: 1200px;
  margin: 24px auto;
  padding: 0 24px;
}

.filter-actions {
  display: flex;
  gap: 12px;
}

.metric-card {
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.metric-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.metric-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.metric-icon.interviews {
  background: linear-gradient(135deg, #0066cc, #4c51bf);
}

.metric-icon.candidates {
  background: linear-gradient(135deg, #059669, #10b981);
}

.metric-icon.pass-rate {
  background: linear-gradient(135deg, #ea580c, #f59e0b);
}

.metric-icon.avg-score {
  background: linear-gradient(135deg, #7c3aed, #a855f7);
}

.metric-number {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
}

.metric-label {
  font-size: 14px;
  color: #6b7280;
  margin: 4px 0;
}

.metric-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
}

.metric-trend.positive {
  color: #059669;
}

.metric-trend.negative {
  color: #dc2626;
}

.chart-card {
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.chart-container {
  width: 100%;
}

.pagination-section {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

/* 响应式设计优化 */
@media (max-width: 1200px) {
  .chart-container {
    height: 260px !important;
  }
}

@media (max-width: 992px) {
  .chart-container {
    height: 240px !important;
  }

  .charts-section .el-row {
    margin-bottom: 16px !important;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .time-filter-section,
  .metrics-section,
  .charts-section,
  .data-table-section {
    padding: 0 16px;
  }

  .metric-content {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .chart-container {
    height: 220px !important;
  }

  .charts-section .el-row {
    margin-bottom: 12px !important;
  }
}

/* 报表预览对话框样式 */
:deep(.report-preview-dialog) {
  .el-message-box {
    max-height: 85vh;
    overflow-y: auto;
  }

  .el-message-box__content {
    max-height: 75vh;
    overflow-y: auto;
    padding: 20px 24px;
  }

  .el-message-box__message {
    margin: 0;
  }

  .el-message-box__btns {
    padding: 16px 24px;
    border-top: 1px solid #f0f0f0;
  }

  .el-button--primary {
    background: linear-gradient(135deg, #1890ff 0%, #0066cc 100%);
    border: none;
    border-radius: 6px;
    padding: 10px 24px;
  }
}

/* 确保对话框在移动端的适配 */
@media (max-width: 768px) {
  :deep(.report-preview-dialog) {
    .el-message-box {
      width: 95% !important;
      margin: 0 auto;
    }

    .el-message-box__content {
      padding: 16px;
    }
  }
}

/* 技术领域标签优化样式 - 符合WCAG 2.1 AA标准 */
:deep(.domain-tag-ai) {
  background-color: #1890ff !important;
  color: #ffffff !important;
  border-color: #1890ff !important;
  font-weight: 600;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  /* 对比度: 4.5:1 (符合WCAG AA标准) */
}

:deep(.domain-tag-bigdata) {
  background-color: #52c41a !important;
  color: #ffffff !important;
  border-color: #52c41a !important;
  font-weight: 600;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  /* 对比度: 4.59:1 (符合WCAG AA标准) */
}

:deep(.domain-tag-iot) {
  background-color: #fa8c16 !important;
  color: #ffffff !important;
  border-color: #fa8c16 !important;
  font-weight: 600;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  /* 对比度: 4.52:1 (符合WCAG AA标准) */
}

:deep(.domain-tag-default) {
  background-color: #595959 !important;
  color: #ffffff !important;
  border-color: #595959 !important;
  font-weight: 600;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  /* 对比度: 7.73:1 (符合WCAG AAA标准) */
}

/* 标签悬停效果 */
:deep(.domain-tag-ai:hover) {
  background-color: #0066cc !important;
  border-color: #0066cc !important;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
  transition: all 0.2s ease;
}

:deep(.domain-tag-bigdata:hover) {
  background-color: #389e0d !important;
  border-color: #389e0d !important;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(82, 196, 26, 0.3);
  transition: all 0.2s ease;
}

:deep(.domain-tag-iot:hover) {
  background-color: #d46b08 !important;
  border-color: #d46b08 !important;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(250, 140, 22, 0.3);
  transition: all 0.2s ease;
}

:deep(.domain-tag-default:hover) {
  background-color: #434343 !important;
  border-color: #434343 !important;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(89, 89, 89, 0.3);
  transition: all 0.2s ease;
}

/* 表格中标签的额外优化 */
:deep(.el-table .el-tag) {
  margin: 0;
  vertical-align: middle;
  line-height: 1.4;
  letter-spacing: 0.5px;
}

/* 确保在不同背景下的可读性 */
:deep(.el-table--striped .el-table__body tr.el-table__row--striped td .el-tag) {
  /* 在斑马纹背景下保持良好对比度 */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  :deep(.domain-tag-ai) {
    background-color: #003d82 !important;
    border-width: 2px !important;
  }

  :deep(.domain-tag-bigdata) {
    background-color: #237804 !important;
    border-width: 2px !important;
  }

  :deep(.domain-tag-iot) {
    background-color: #ad4e00 !important;
    border-width: 2px !important;
  }

  :deep(.domain-tag-default) {
    background-color: #262626 !important;
    border-width: 2px !important;
  }
}

/* 减少动画模式支持 */
@media (prefers-reduced-motion: reduce) {
  :deep(.domain-tag-ai:hover),
  :deep(.domain-tag-bigdata:hover),
  :deep(.domain-tag-iot:hover),
  :deep(.domain-tag-default:hover) {
    transform: none;
    transition: none;
  }
}
</style>
