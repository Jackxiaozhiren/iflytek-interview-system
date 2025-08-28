<template>
  <div class="report-center">
    <!-- 🎯 增强的报告中心头部 - 借鉴竞品设计 -->
    <div class="center-header">
      <div class="header-background">
        <div class="header-gradient"></div>
        <div class="header-particles">
          <div v-for="i in 8" :key="i" class="particle" :style="getParticleStyle(i)"></div>
        </div>
      </div>

      <div class="header-content">
        <div class="header-info">
          <div class="title-section">
            <h1 class="center-title">
              <el-icon class="title-icon"><TrendCharts /></el-icon>
              iFlytek Spark 报告中心
            </h1>
            <p class="center-subtitle">基于星火大模型的多模态面试智能分析平台</p>
          </div>

          <!-- 实时统计概览 -->
          <div class="header-stats">
            <div class="stat-item">
              <span class="stat-value">{{ reportStats.totalReports }}</span>
              <span class="stat-label">总报告数</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ reportStats.todayGenerated }}</span>
              <span class="stat-label">今日生成</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ reportStats.avgScore }}%</span>
              <span class="stat-label">平均得分</span>
            </div>
          </div>
        </div>

        <div class="header-actions">
          <el-button type="primary" size="large" @click="generateReport" class="action-btn">
            <el-icon><DocumentAdd /></el-icon>
            生成新报告
          </el-button>
          <el-button size="large" @click="exportReports" class="action-btn">
            <el-icon><Download /></el-icon>
            批量导出
          </el-button>
          <el-button size="large" @click="showAnalytics" class="action-btn">
            <el-icon><Grid /></el-icon>
            数据分析
          </el-button>
        </div>
      </div>
    </div>

    <!-- 🔍 增强的筛选和搜索区域 -->
    <div class="filter-section">
      <div class="filter-content">
        <div class="filter-left">
          <!-- 快速筛选标签 -->
          <div class="quick-filters">
            <el-tag
              v-for="filter in quickFilters"
              :key="filter.key"
              :type="activeQuickFilter === filter.key ? 'primary' : ''"
              :effect="activeQuickFilter === filter.key ? 'dark' : 'plain'"
              @click="setQuickFilter(filter.key)"
              class="quick-filter-tag"
            >
              <el-icon>{{ filter.icon }}</el-icon>
              {{ filter.label }}
            </el-tag>
          </div>

          <!-- 详细筛选 -->
          <div class="detailed-filters">
            <el-select v-model="filterType" placeholder="报告类型" style="width: 160px;" clearable>
              <el-option label="全部报告" value="all" />
              <el-option label="个人评估" value="individual" />
              <el-option label="团队分析" value="team" />
              <el-option label="统计报告" value="statistics" />
              <el-option label="对比分析" value="comparison" />
            </el-select>

            <el-select v-model="filterDomain" placeholder="技术领域" style="width: 160px;" clearable>
              <el-option label="全部领域" value="all" />
              <el-option label="AI人工智能" value="ai" />
              <el-option label="大数据分析" value="bigdata" />
              <el-option label="IoT物联网" value="iot" />
              <el-option label="云计算架构" value="cloud" />
              <el-option label="前端开发" value="frontend" />
              <el-option label="后端开发" value="backend" />
            </el-select>

            <el-select v-model="filterScore" placeholder="评分范围" style="width: 140px;" clearable>
              <el-option label="全部分数" value="all" />
              <el-option label="优秀 (90-100)" value="excellent" />
              <el-option label="良好 (80-89)" value="good" />
              <el-option label="中等 (70-79)" value="average" />
              <el-option label="待提升 (<70)" value="poor" />
            </el-select>

            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 260px;"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </div>
        </div>

        <div class="filter-right">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索候选人姓名、职位或报告内容..."
            style="width: 350px;"
            clearable
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
            <template #suffix>
              <el-button text @click="showAdvancedSearch">
                <el-icon><Setting /></el-icon>
              </el-button>
            </template>
          </el-input>

          <el-button @click="resetFilters" class="reset-btn">
            <el-icon><RefreshLeft /></el-icon>
            重置
          </el-button>
        </div>
      </div>
    </div>

    <!-- 📊 增强的统计卡片和数据可视化 -->
    <div class="analytics-section">
      <!-- 统计卡片 -->
      <div class="stats-grid">
        <div class="stat-card ai-theme" @click="filterByDomain('ai')">
          <div class="stat-icon">
            <el-icon><Cpu /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ reportStats.totalReports }}</div>
            <div class="stat-label">总报告数</div>
            <div class="stat-trend">
              <el-icon class="trend-up"><TrendCharts /></el-icon>
              <span>+12%</span>
            </div>
          </div>
        </div>

        <div class="stat-card bigdata-theme" @click="showCandidateAnalysis">
          <div class="stat-icon">
            <el-icon><User /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ reportStats.totalCandidates }}</div>
            <div class="stat-label">评估人数</div>
            <div class="stat-trend">
              <el-icon class="trend-up"><TrendCharts /></el-icon>
              <span>+8%</span>
            </div>
          </div>
        </div>

        <div class="stat-card iot-theme" @click="showScoreAnalysis">
          <div class="stat-icon">
            <el-icon><Grid /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ reportStats.avgScore }}%</div>
            <div class="stat-label">平均得分</div>
            <div class="stat-trend">
              <el-icon class="trend-up"><TrendCharts /></el-icon>
              <span>+3%</span>
            </div>
          </div>
        </div>

        <div class="stat-card cloud-theme" @click="showMonthlyTrend">
          <div class="stat-icon">
            <el-icon><Calendar /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ reportStats.thisMonth }}</div>
            <div class="stat-label">本月新增</div>
            <div class="stat-trend">
              <el-icon class="trend-up"><TrendCharts /></el-icon>
              <span>+15%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ECharts 数据可视化图表区域 -->
      <div class="charts-section">
        <div class="charts-grid">
          <!-- 报告趋势图 -->
          <div class="chart-card">
            <div class="chart-header">
              <h3 class="chart-title">
                <el-icon><TrendCharts /></el-icon>
                报告生成趋势
              </h3>
              <div class="chart-controls">
                <el-radio-group v-model="trendPeriod" size="small">
                  <el-radio-button value="week">近7天</el-radio-button>
                  <el-radio-button value="month">近30天</el-radio-button>
                  <el-radio-button value="quarter">近3月</el-radio-button>
                </el-radio-group>
              </div>
            </div>
            <div class="chart-container">
              <v-chart
                :option="trendChartOption"
                :style="{ height: '300px' }"
                autoresize
              />
            </div>
          </div>

          <!-- 技术领域分布图 -->
          <div class="chart-card">
            <div class="chart-header">
              <h3 class="chart-title">
                <el-icon><PieChart /></el-icon>
                技术领域分布
              </h3>
              <div class="chart-controls">
                <el-button size="small" text @click="refreshDomainChart">
                  <el-icon><Refresh /></el-icon>
                </el-button>
              </div>
            </div>
            <div class="chart-container">
              <v-chart
                :option="domainChartOption"
                :style="{ height: '300px' }"
                autoresize
              />
            </div>
          </div>

          <!-- 评分分布图 -->
          <div class="chart-card">
            <div class="chart-header">
              <h3 class="chart-title">
                <el-icon><DataBoard /></el-icon>
                评分分布分析
              </h3>
              <div class="chart-controls">
                <el-select v-model="scoreAnalysisType" size="small" style="width: 120px;">
                  <el-option label="总体分布" value="overall" />
                  <el-option label="按领域" value="domain" />
                  <el-option label="按时间" value="time" />
                </el-select>
              </div>
            </div>
            <div class="chart-container">
              <v-chart
                :option="scoreChartOption"
                :style="{ height: '300px' }"
                autoresize
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 报告列表 -->
    <div class="reports-section">
      <div class="section-header">
        <h2>报告列表</h2>
        <div class="view-controls">
          <el-radio-group v-model="viewMode" size="small">
            <el-radio-button value="list">列表视图</el-radio-button>
            <el-radio-button value="grid">卡片视图</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <!-- 列表视图 -->
      <div v-if="viewMode === 'list'" class="reports-table reports-table-enhanced">
        <el-table :data="filteredReports" style="width: 100%">
          <el-table-column prop="title" label="报告标题" min-width="200">
            <template #default="{ row }">
              <div class="report-title-cell report-title-cell-enhanced">
                <el-icon class="report-icon report-icon-enhanced"><Document /></el-icon>
                <div class="title-content title-content-enhanced">
                  <div class="title-text title-text-enhanced">{{ row.title }}</div>
                  <div class="title-summary-container" v-if="row.summary">
                    <div class="title-summary title-summary-enhanced title-summary-scrollable">{{ row.summary }}</div>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="type" label="类型" width="120">
            <template #default="{ row }">
              <el-tag :type="getTypeColor(row.type)" size="small" class="type-tag type-tag-enhanced">
                {{ getTypeText(row.type) }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="domain" label="技术领域" width="120">
            <template #default="{ row }">
              <el-tag :type="getDomainColor(row.domain)" size="small" class="domain-tag domain-tag-enhanced">
                {{ getDomainText(row.domain) }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="candidateName" label="候选人" width="120">
            <template #default="{ row }">
              <div class="candidate-cell candidate-cell-enhanced">
                <span class="candidate-name candidate-name-enhanced">{{ row.candidateName }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="score" label="评分" width="100">
            <template #default="{ row }">
              <div class="score-cell score-cell-enhanced">
                <span :class="getScoreClass(row.score)" class="score-value score-value-enhanced">{{ row.score }}</span>
                <span class="score-unit score-unit-enhanced">分</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="createdAt" label="创建时间" width="180">
            <template #default="{ row }">
              <div class="time-cell time-cell-enhanced">
                <span class="time-text time-text-enhanced">{{ formatDate(row.createdAt) }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <div class="action-buttons action-buttons-enhanced action-buttons-uniform">
                <el-button size="small" type="primary" plain @click="viewReport(row.id)" class="action-btn action-btn-enhanced action-btn-uniform">
                  <el-icon><View /></el-icon>
                  <span class="btn-text">查看</span>
                </el-button>
                <el-button size="small" plain @click="downloadReport(row.id)" class="action-btn action-btn-enhanced action-btn-uniform">
                  <el-icon><Download /></el-icon>
                  <span class="btn-text">下载</span>
                </el-button>
                <el-button size="small" type="danger" plain @click="deleteReport(row.id)" class="action-btn action-btn-enhanced action-btn-uniform">
                  <el-icon><Delete /></el-icon>
                  <span class="btn-text">删除</span>
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 卡片视图 -->
      <div v-else class="reports-grid">
        <div 
          v-for="report in filteredReports" 
          :key="report.id"
          class="report-card"
          @click="viewReport(report.id)"
        >
          <div class="card-header">
            <div class="card-icon" :class="getDomainTheme(report.domain)">
              <el-icon><Document /></el-icon>
            </div>
            <div class="card-actions">
              <el-dropdown @command="handleCardAction">
                <el-button text>
                  <el-icon><More /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item :command="`view-${report.id}`">查看报告</el-dropdown-item>
                    <el-dropdown-item :command="`download-${report.id}`">下载报告</el-dropdown-item>
                    <el-dropdown-item :command="`delete-${report.id}`">删除报告</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
          
          <div class="card-content">
            <h3 class="card-title">{{ report.title }}</h3>
            <div class="card-meta">
              <div class="meta-item">
                <span class="meta-label">候选人:</span>
                <span class="meta-value">{{ report.candidateName }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">评分:</span>
                <span class="meta-value" :class="getScoreClass(report.score)">{{ report.score }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">时间:</span>
                <span class="meta-value">{{ formatDate(report.createdAt) }}</span>
              </div>
            </div>
          </div>
          
          <div class="card-footer">
            <el-tag :type="getTypeColor(report.type)" size="small">
              {{ getTypeText(report.type) }}
            </el-tag>
            <el-tag :type="getDomainColor(report.domain)" size="small">
              {{ getDomainText(report.domain) }}
            </el-tag>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="totalReports"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 导出进度对话框 -->
    <ExportProgressDialog
      v-model="showExportProgress"
      :status="exportStatus"
      :progress="exportProgress"
      :format="exportFormat"
      :export-details="exportDetails"
      :error-message="exportErrorMessage"
      @retry="handleExportRetry"
      @close="handleExportClose"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import VChart from 'vue-echarts'
import {
  Document, Download, Search, User, TrendCharts, Calendar, MoreFilled,
  DocumentAdd, Grid, Cpu, PieChart as PieChart, DataBoard, Refresh,
  Setting, RefreshLeft, More, View, Delete
} from '@element-plus/icons-vue'
import enhancedIflytekSparkService from '@/services/enhancedIflytekSparkService'
import reportExportShareService from '@/services/reportExportShareService'
import ExportProgressDialog from '@/components/Report/ExportProgressDialog.vue'

// ECharts组件已在main.js中全局注册，无需重复注册

// 响应式数据
const filterType = ref('all')
const filterDomain = ref('all')
const filterScore = ref('all')
const dateRange = ref([])
const searchKeyword = ref('')
const viewMode = ref('list')
const currentPage = ref(1)
const pageSize = ref(20)
const activeQuickFilter = ref('all')
const trendPeriod = ref('month')
const scoreAnalysisType = ref('overall')
const selectedReports = ref([]) // 选中的报告ID列表

// 导出进度相关状态
const showExportProgress = ref(false)
const exportStatus = ref('preparing')
const exportProgress = ref(0)
const exportFormat = ref('excel')
const exportDetails = ref(null)
const exportErrorMessage = ref('')
const currentExportData = ref(null)

// 快速筛选配置
const quickFilters = ref([
  { key: 'all', label: '全部报告', icon: 'Document' },
  { key: 'today', label: '今日生成', icon: 'Calendar' },
  { key: 'excellent', label: '优秀评分', icon: 'TrendCharts' },
  { key: 'ai', label: 'AI领域', icon: 'Cpu' },
  { key: 'pending', label: '待审核', icon: 'Clock' }
])

const reportStats = reactive({
  totalReports: 1248,
  totalCandidates: 856,
  avgScore: 82.5,
  thisMonth: 156,
  todayGenerated: 23
})

// ECharts图表配置
const trendChartOption = computed(() => ({
  title: {
    text: '',
    textStyle: { color: '#1890ff', fontSize: 16 }
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#1890ff',
    textStyle: { color: '#333' }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: getTrendData().dates,
    axisLine: { lineStyle: { color: '#e8e8e8' } },
    axisLabel: { color: '#666' }
  },
  yAxis: {
    type: 'value',
    axisLine: { lineStyle: { color: '#e8e8e8' } },
    axisLabel: { color: '#666' },
    splitLine: { lineStyle: { color: '#f0f0f0' } }
  },
  series: [
    {
      name: '报告数量',
      type: 'line',
      data: getTrendData().values,
      smooth: true,
      lineStyle: { color: '#1890ff', width: 3 },
      itemStyle: { color: '#1890ff' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
            { offset: 1, color: 'rgba(24, 144, 255, 0.05)' }
          ]
        }
      }
    }
  ]
}))

const domainChartOption = computed(() => ({
  title: {
    text: '',
    left: 'center',
    textStyle: { color: '#1890ff', fontSize: 16 }
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'horizontal',
    bottom: '0%',
    textStyle: { color: '#666' }
  },
  series: [
    {
      name: '技术领域',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '45%'],
      data: [
        { value: 335, name: 'AI人工智能', itemStyle: { color: '#1890ff' } },
        { value: 310, name: '大数据分析', itemStyle: { color: '#52c41a' } },
        { value: 234, name: 'IoT物联网', itemStyle: { color: '#faad14' } },
        { value: 135, name: '云计算架构', itemStyle: { color: '#f5222d' } },
        { value: 148, name: '前端开发', itemStyle: { color: '#722ed1' } },
        { value: 86, name: '后端开发', itemStyle: { color: '#13c2c2' } }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}))

const scoreChartOption = computed(() => ({
  title: {
    text: '',
    textStyle: { color: '#1890ff', fontSize: 16 }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['0-60', '60-70', '70-80', '80-90', '90-100'],
    axisLine: { lineStyle: { color: '#e8e8e8' } },
    axisLabel: { color: '#666' }
  },
  yAxis: {
    type: 'value',
    axisLine: { lineStyle: { color: '#e8e8e8' } },
    axisLabel: { color: '#666' },
    splitLine: { lineStyle: { color: '#f0f0f0' } }
  },
  series: [
    {
      name: '人数分布',
      type: 'bar',
      data: [12, 45, 186, 324, 289],
      itemStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: '#1890ff' },
            { offset: 1, color: '#69c0ff' }
          ]
        }
      },
      emphasis: {
        itemStyle: { color: '#0050b3' }
      }
    }
  ]
}))

const reports = ref([
  {
    id: 1,
    title: 'AI算法工程师面试评估报告',
    summary: '深度学习算法理解扎实，编程能力优秀，具备良好的数学基础和工程实践经验。候选人在机器学习模型设计、神经网络优化、数据预处理等方面表现突出，能够独立完成复杂的AI项目开发。同时具备良好的代码规范意识和团队协作能力，建议优先考虑录用。',
    type: 'individual',
    domain: 'ai',
    candidateName: '张三',
    score: 88,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: 2,
    title: '大数据开发团队评估报告',
    summary: 'Spark和Hadoop生态系统掌握良好，数据处理能力强，团队协作表现出色。在大数据架构设计、ETL流程优化、实时数据处理等核心技能方面展现了扎实的基础。具备丰富的分布式系统开发经验，能够处理PB级别的数据处理任务，是团队中的技术骨干。',
    type: 'team',
    domain: 'bigdata',
    candidateName: '李四',
    score: 85,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  },
  {
    id: 3,
    title: 'IoT系统架构师技能分析',
    summary: '物联网架构设计思路清晰，嵌入式开发经验丰富，但在云端集成方面需要加强。对传感器网络、通信协议、边缘计算等IoT核心技术有深入理解，具备完整的物联网系统设计和实施能力。建议在云平台集成和大规模设备管理方面进行进一步培训。',
    type: 'individual',
    domain: 'iot',
    candidateName: '王五',
    score: 79,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  },
  {
    id: 4,
    title: '云计算平台开发统计报告',
    summary: 'Kubernetes和Docker容器化技术精通，微服务架构设计能力突出，技术视野开阔。在云原生应用开发、DevOps流程设计、自动化运维等方面具备丰富的实战经验。能够独立设计和实施大规模云平台架构，是云计算领域的专家级人才，强烈推荐录用。',
    type: 'statistics',
    domain: 'cloud',
    candidateName: '赵六',
    score: 92,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
  }
])

// 计算属性
const filteredReports = computed(() => {
  let filtered = reports.value

  if (filterType.value !== 'all') {
    filtered = filtered.filter(report => report.type === filterType.value)
  }

  if (filterDomain.value !== 'all') {
    filtered = filtered.filter(report => report.domain === filterDomain.value)
  }

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(report => 
      report.title.toLowerCase().includes(keyword) ||
      report.candidateName.toLowerCase().includes(keyword)
    )
  }

  return filtered
})

const totalReports = computed(() => filteredReports.value.length)

// 工具方法
const getTrendData = () => {
  const period = trendPeriod.value
  if (period === 'week') {
    return {
      dates: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      values: [23, 34, 28, 45, 38, 52, 41]
    }
  } else if (period === 'month') {
    return {
      dates: Array.from({ length: 30 }, (_, i) => `${i + 1}日`),
      values: Array.from({ length: 30 }, () => Math.floor(Math.random() * 50) + 10)
    }
  } else {
    return {
      dates: ['1月', '2月', '3月'],
      values: [456, 523, 612]
    }
  }
}

const getParticleStyle = (index) => ({
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  animationDelay: `${index * 0.5}s`,
  animationDuration: `${3 + Math.random() * 2}s`
})

// 筛选和搜索方法
const setQuickFilter = (filterKey) => {
  activeQuickFilter.value = filterKey

  // 根据快速筛选设置其他筛选条件
  switch (filterKey) {
    case 'today':
      dateRange.value = [new Date().toISOString().split('T')[0], new Date().toISOString().split('T')[0]]
      break
    case 'excellent':
      filterScore.value = 'excellent'
      break
    case 'ai':
      filterDomain.value = 'ai'
      break
    case 'pending':
      // 设置待审核状态筛选
      break
    default:
      // 重置所有筛选
      resetFilters()
  }
}

const resetFilters = () => {
  filterType.value = 'all'
  filterDomain.value = 'all'
  filterScore.value = 'all'
  dateRange.value = []
  searchKeyword.value = ''
  activeQuickFilter.value = 'all'
}

const handleSearch = () => {
  console.log('执行搜索:', searchKeyword.value)
  // 这里可以调用API进行搜索
}

const showAdvancedSearch = () => {
  console.log('显示高级搜索')
  // 打开高级搜索对话框
}

const showAnalytics = () => {
  console.log('显示数据分析')
  // 跳转到详细分析页面
}

// 图表交互方法
const filterByDomain = (domain) => {
  filterDomain.value = domain
  activeQuickFilter.value = domain
}

const showCandidateAnalysis = () => {
  console.log('显示候选人分析')
}

const showScoreAnalysis = () => {
  console.log('显示评分分析')
}

const showMonthlyTrend = () => {
  console.log('显示月度趋势')
}

const refreshDomainChart = () => {
  console.log('刷新领域分布图')
}

// 报告操作方法
const generateReport = async () => {
  try {
    console.log('生成新报告')
    // 调用iFlytek Spark服务生成报告
    const result = await enhancedIflytekSparkService.generateComprehensiveReport({
      type: 'comprehensive',
      domain: 'all',
      timeRange: dateRange.value
    })
    console.log('报告生成成功:', result)
  } catch (error) {
    console.error('报告生成失败:', error)
  }
}

const exportReports = async () => {
  try {
    // 显示格式选择对话框
    const format = await reportExportShareService.showFormatDialog()
    if (!format) return // 用户取消了选择

    // 获取选中的报告或全部报告
    const reportsToExport = selectedReports.value.length > 0
      ? selectedReports.value.map(id => reports.value.find(r => r.id === id))
      : reports.value

    if (reportsToExport.length === 0) {
      ElMessage.warning('没有可导出的报告')
      return
    }

    // 设置导出状态
    exportFormat.value = format
    exportDetails.value = {
      reportCount: reportsToExport.length,
      fileSize: null
    }
    currentExportData.value = reportsToExport

    // 显示进度对话框
    showExportProgress.value = true
    exportStatus.value = 'preparing'
    exportProgress.value = 0

    // 执行批量导出
    await reportExportShareService.exportBatchReports(
      reportsToExport,
      format,
      {
        useProgressDialog: true,
        progressCallback: handleExportProgress
      }
    )

  } catch (error) {
    console.error('批量导出失败:', error)
    exportStatus.value = 'error'
    exportErrorMessage.value = error.message || '导出过程中发生未知错误'
  }
}

const viewReport = (id) => {
  console.log('查看报告:', id)
  // 跳转到报告详情页
  router.push(`/report/${id}`)
}

const downloadReport = async (id) => {
  try {
    // 显示格式选择对话框
    const format = await reportExportShareService.showFormatDialog()
    if (!format) return

    // 获取报告数据
    const report = reports.value.find(r => r.id === id)
    if (!report) {
      ElMessage.error('报告不存在')
      return
    }

    // 转换为导出格式
    const reportData = convertToExportFormat(report)

    // 设置导出状态
    exportFormat.value = format
    exportDetails.value = {
      reportCount: 1,
      fileSize: null
    }
    currentExportData.value = reportData

    // 显示进度对话框
    showExportProgress.value = true
    exportStatus.value = 'preparing'
    exportProgress.value = 0

    // 执行导出
    await reportExportShareService.exportSingleReport(
      reportData,
      format,
      {
        useProgressDialog: true,
        progressCallback: handleExportProgress
      }
    )

  } catch (error) {
    console.error('报告下载失败:', error)
    exportStatus.value = 'error'
    exportErrorMessage.value = error.message || '下载过程中发生未知错误'
  }
}

// 转换报告数据为导出格式
const convertToExportFormat = (report) => {
  return {
    candidateName: report.candidateName,
    interviewDate: report.date,
    duration: report.duration || '未知',
    domain: report.domain,
    mode: '文本面试',
    overallScore: report.score,
    professionalKnowledge: report.professionalKnowledge || report.score,
    skillMatching: report.skillMatching || report.score - 5,
    languageExpression: report.languageExpression || report.score + 2,
    logicalThinking: report.logicalThinking || report.score - 3,
    innovationAbility: report.innovationAbility || report.score - 8,
    stressResistance: report.stressResistance || report.score + 1,
    strengths: report.strengths || ['技术基础扎实', '学习能力强'],
    improvements: report.improvements || ['需要更多实践经验', '可以提升沟通技巧'],
    overallEvaluation: report.evaluation || '综合表现良好，具有发展潜力',
    qaRecords: report.qaRecords || []
  }
}

// 处理导出进度
const handleExportProgress = (progressData) => {
  exportStatus.value = progressData.status
  exportProgress.value = progressData.progress || 0

  if (progressData.error) {
    exportErrorMessage.value = progressData.error
  }

  if (progressData.status === 'success' && exportDetails.value) {
    // 更新文件大小信息
    if (progressData.fileSize) {
      exportDetails.value.fileSize = progressData.fileSize
    }
  }
}

// 处理导出重试
const handleExportRetry = async () => {
  try {
    exportStatus.value = 'preparing'
    exportProgress.value = 0
    exportErrorMessage.value = ''

    if (currentExportData.value) {
      if (Array.isArray(currentExportData.value)) {
        // 批量导出重试
        await reportExportShareService.exportBatchReports(
          currentExportData.value,
          exportFormat.value,
          {
            useProgressDialog: true,
            progressCallback: handleExportProgress
          }
        )
      } else {
        // 单个报告导出重试
        await reportExportShareService.exportSingleReport(
          currentExportData.value,
          exportFormat.value,
          {
            useProgressDialog: true,
            progressCallback: handleExportProgress
          }
        )
      }
    }
  } catch (error) {
    console.error('导出重试失败:', error)
    exportStatus.value = 'error'
    exportErrorMessage.value = error.message || '重试失败'
  }
}

// 处理导出对话框关闭
const handleExportClose = () => {
  showExportProgress.value = false
  exportStatus.value = 'preparing'
  exportProgress.value = 0
  exportDetails.value = null
  exportErrorMessage.value = ''
  currentExportData.value = null
}

const deleteReport = (id) => {
  console.log('删除报告:', id)
  // 实现报告删除功能
}

const handleCardAction = (command) => {
  const [action, id] = command.split('-')
  switch (action) {
    case 'view':
      viewReport(parseInt(id))
      break
    case 'download':
      downloadReport(parseInt(id))
      break
    case 'delete':
      deleteReport(parseInt(id))
      break
  }
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (page) => {
  currentPage.value = page
}

const formatDate = (date) => {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getTypeColor = (type) => {
  const colorMap = {
    individual: 'primary',
    team: 'success',
    statistics: 'warning'
  }
  return colorMap[type] || 'info'
}

const getTypeText = (type) => {
  const textMap = {
    individual: '个人报告',
    team: '团队报告',
    statistics: '统计报告'
  }
  return textMap[type] || '未知'
}

const getDomainColor = (domain) => {
  const colorMap = {
    ai: 'primary',
    bigdata: 'success',
    iot: 'danger',
    cloud: 'warning'
  }
  return colorMap[domain] || 'info'
}

const getDomainText = (domain) => {
  const textMap = {
    ai: 'AI人工智能',
    bigdata: '大数据',
    iot: 'IoT物联网',
    cloud: '云计算'
  }
  return textMap[domain] || '未知'
}

const getDomainTheme = (domain) => {
  const themeMap = {
    ai: 'ai-theme',
    bigdata: 'bigdata-theme',
    iot: 'iot-theme',
    cloud: 'cloud-theme'
  }
  return themeMap[domain] || ''
}

const getScoreClass = (score) => {
  if (score >= 90) return 'score-excellent'
  if (score >= 80) return 'score-good'
  if (score >= 70) return 'score-average'
  return 'score-poor'
}

onMounted(() => {
  console.log('报告中心已加载')
})
</script>

<style scoped>
@import '@/styles/report-list-optimization.css';

.report-center {
  min-height: 100vh;
  background: var(--iflytek-bg-secondary);
  padding: 24px;
}

/* 🎨 增强的头部样式 */
.center-header {
  position: relative;
  background: var(--iflytek-bg-primary);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: var(--iflytek-shadow-lg);
  overflow: hidden;
}

.header-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.header-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg,
    rgba(24, 144, 255, 0.05) 0%,
    rgba(102, 126, 234, 0.03) 50%,
    rgba(118, 75, 162, 0.02) 100%);
}

.header-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: var(--iflytek-primary);
  border-radius: 50%;
  opacity: 0.3;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.header-content {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 32px;
}

.header-info {
  flex: 1;
}

.title-section {
  margin-bottom: 24px;
}

.center-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 28px;
  font-weight: var(--font-weight-bold);
  color: var(--iflytek-text-primary);
  margin: 0 0 8px 0;
}

.title-icon {
  font-size: 32px;
  color: var(--iflytek-primary);
}

.center-subtitle {
  color: var(--iflytek-text-secondary);
  font-size: var(--font-size-lg);
  margin: 0;
}

.header-stats {
  display: flex;
  gap: 32px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: var(--font-weight-bold);
  color: var(--iflytek-primary);
  margin-bottom: 4px;
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--iflytek-text-secondary);
}

.header-actions {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.action-btn {
  min-width: 120px;
  height: 44px;
  border-radius: 8px;
  font-weight: var(--font-weight-medium);
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--iflytek-shadow-md);
}

/* 🔍 筛选区域样式 */
.filter-section {
  background: var(--iflytek-bg-primary);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: var(--iflytek-shadow-sm);
}

.filter-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.filter-left {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.quick-filters {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.quick-filter-tag {
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: var(--font-size-sm);
}

.quick-filter-tag:hover {
  transform: translateY(-1px);
  box-shadow: var(--iflytek-shadow-sm);
}

.detailed-filters {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-right {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: flex-end;
}

.reset-btn {
  min-width: 80px;
  border-radius: 6px;
}

/* 📊 分析区域和统计卡片样式 */
.analytics-section {
  margin-bottom: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: var(--iflytek-bg-primary);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: var(--iflytek-shadow-sm);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--iflytek-gradient-primary);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--iflytek-shadow-lg);
}

.stat-content {
  flex: 1;
  position: relative;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  font-size: var(--font-size-xs);
  color: var(--iflytek-success);
}

.trend-up {
  font-size: 14px;
  color: var(--iflytek-success);
}

/* 📈 图表区域样式 */
.charts-section {
  margin-top: 32px;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.chart-card {
  background: var(--iflytek-bg-primary);
  border-radius: 16px;
  padding: 24px;
  box-shadow: var(--iflytek-shadow-sm);
  transition: all 0.3s ease;
}

.chart-card:hover {
  box-shadow: var(--iflytek-shadow-md);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--iflytek-border-secondary);
}

.chart-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--iflytek-text-primary);
}

.chart-title .el-icon {
  color: var(--iflytek-primary);
  font-size: 20px;
}

.chart-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.chart-container {
  position: relative;
  width: 100%;
}

.stat-card.ai-theme .stat-icon {
  background: var(--ai-module-gradient);
}

.stat-card.bigdata-theme .stat-icon {
  background: var(--bigdata-module-gradient);
}

.stat-card.iot-theme .stat-icon {
  background: var(--iot-module-gradient);
}

.stat-card.cloud-theme .stat-icon {
  background: var(--cloud-module-gradient);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.stat-value {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--iflytek-text-primary);
  margin-bottom: 4px;
}

.stat-label {
  color: var(--iflytek-text-secondary);
  font-size: var(--font-size-sm);
}

.reports-section {
  background: var(--iflytek-bg-primary);
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--iflytek-shadow-sm);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--iflytek-border-secondary);
}

.section-header h2 {
  margin: 0;
  color: var(--iflytek-text-primary);
  font-weight: var(--font-weight-semibold);
}

/* 📋 表格单元格优化样式 */
.report-title-cell {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 8px 0;
}

.report-icon {
  color: var(--iflytek-primary);
  font-size: 18px;
  margin-top: 2px;
  flex-shrink: 0;
}

.title-content {
  flex: 1;
  min-width: 0;
}

.title-text {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--iflytek-text-primary);
  line-height: 1.4;
  margin-bottom: 4px;
  font-family: var(--font-family-chinese-base);
}

.title-summary {
  font-size: var(--font-size-sm);
  color: var(--iflytek-text-secondary);
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-family: var(--font-family-chinese-base);
}

.candidate-cell {
  padding: 4px 0;
}

.candidate-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--iflytek-text-primary);
  font-family: var(--font-family-chinese-base);
}

.score-cell {
  display: flex;
  align-items: baseline;
  gap: 2px;
  padding: 4px 0;
}

.score-value {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  font-family: var(--font-family-chinese-base);
}

.score-unit {
  font-size: var(--font-size-xs);
  color: var(--iflytek-text-secondary);
  font-family: var(--font-family-chinese-base);
}

.time-cell {
  padding: 4px 0;
}

.time-text {
  font-size: var(--font-size-sm);
  color: var(--iflytek-text-secondary);
  font-family: var(--font-family-chinese-base);
  line-height: 1.4;
}

.type-tag, .domain-tag {
  font-family: var(--font-family-chinese-base);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.report-card {
  border: 1px solid var(--iflytek-border-secondary);
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.report-card:hover {
  border-color: var(--iflytek-primary);
  box-shadow: var(--iflytek-shadow-md);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.card-icon.ai-theme {
  background: var(--ai-module-gradient);
}

.card-icon.bigdata-theme {
  background: var(--bigdata-module-gradient);
}

.card-icon.iot-theme {
  background: var(--iot-module-gradient);
}

.card-icon.cloud-theme {
  background: var(--cloud-module-gradient);
}

.card-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--iflytek-text-primary);
  margin: 0 0 12px 0;
}

.card-meta {
  margin-bottom: 16px;
}

.meta-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: var(--font-size-sm);
}

.meta-label {
  color: var(--iflytek-text-secondary);
}

.meta-value {
  color: var(--iflytek-text-primary);
  font-weight: var(--font-weight-medium);
}

.card-footer {
  display: flex;
  gap: 8px;
}

/* 🎯 操作按钮区域优化 */
.action-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: flex-start;
  padding: 4px 0;
}

.action-btn {
  min-width: 60px;
  height: 28px;
  font-size: var(--font-size-xs);
  font-family: var(--font-family-chinese-base);
  font-weight: var(--font-weight-medium);
  border-radius: 4px;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.action-btn .el-icon {
  font-size: 12px;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: var(--iflytek-shadow-sm);
}

/* 📊 评分样式优化 */
.score-excellent {
  color: #52c41a;
  font-weight: var(--font-weight-bold);
}

.score-good {
  color: #1890ff;
  font-weight: var(--font-weight-bold);
}

.score-average {
  color: #faad14;
  font-weight: var(--font-weight-bold);
}

.score-poor {
  color: #ff4d4f;
  font-weight: var(--font-weight-bold);
}

/* 📋 表格整体样式优化 */
.reports-table {
  background: var(--iflytek-bg-primary);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--iflytek-shadow-sm);
}

.reports-table .el-table {
  font-family: var(--font-family-chinese-base);
}

.reports-table .el-table th {
  background-color: var(--iflytek-bg-secondary);
  color: var(--iflytek-text-primary);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
  padding: 12px 8px;
  border-bottom: 1px solid var(--iflytek-border-secondary);
}

.reports-table .el-table td {
  padding: 12px 8px;
  border-bottom: 1px solid var(--iflytek-border-tertiary);
  vertical-align: top;
}

.reports-table .el-table tbody tr:hover {
  background-color: var(--iflytek-bg-tertiary);
}

.reports-table .el-table tbody tr:hover td {
  background-color: transparent;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

/* 📱 响应式设计优化 */
@media (max-width: 1200px) {
  .action-buttons {
    flex-direction: column;
    gap: 4px;
    align-items: stretch;
  }

  .action-btn {
    min-width: 50px;
    height: 24px;
    font-size: 11px;
  }
}

@media (max-width: 768px) {
  .report-center {
    padding: 16px;
  }

  .header-content {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .filter-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .filter-left {
    flex-wrap: wrap;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .reports-grid {
    grid-template-columns: 1fr;
  }

  /* 移动端表格优化 */
  .reports-table .el-table th,
  .reports-table .el-table td {
    padding: 8px 4px;
  }

  .title-text {
    font-size: var(--font-size-sm);
  }

  .title-summary {
    font-size: var(--font-size-xs);
    -webkit-line-clamp: 1;
  }

  .action-buttons {
    flex-direction: row;
    gap: 2px;
  }

  .action-btn {
    min-width: 40px;
    height: 26px;
    font-size: 10px;
    padding: 0 4px;
  }

  .action-btn .el-icon {
    font-size: 10px;
  }

  .score-value {
    font-size: var(--font-size-base);
  }
}

@media (max-width: 480px) {
  .report-center {
    padding: 12px;
  }

  .action-buttons {
    flex-direction: column;
    gap: 2px;
  }

  .action-btn {
    width: 100%;
    min-width: unset;
    height: 24px;
  }

  .title-text {
    font-size: var(--font-size-xs);
  }

  .candidate-name,
  .time-text {
    font-size: var(--font-size-xs);
  }
}
</style>
