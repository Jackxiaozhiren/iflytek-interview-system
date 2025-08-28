<template>
  <div class="intelligent-dashboard">
    <!-- 仪表板头部 -->
    <div class="dashboard-header">
      <div class="header-content">
        <div class="header-info">
          <h1 class="dashboard-title">智能招聘仪表板</h1>
          <p class="dashboard-subtitle">基于iFlytek Spark AI的数据洞察与决策支持</p>
        </div>
        <div class="header-actions">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            class="date-picker"
          />
          <el-button type="primary" class="export-btn" @click="exportDashboardReport">
            <el-icon><Download /></el-icon>
            导出报告
          </el-button>
        </div>
      </div>
    </div>

    <!-- 核心指标卡片 -->
    <div class="metrics-grid">
      <div class="metric-card" v-for="metric in coreMetrics" :key="metric.id">
        <div class="metric-header">
          <div class="metric-icon" :style="{ background: metric.gradient }">
            <el-icon :size="24"><component :is="metric.icon" /></el-icon>
          </div>
          <div class="metric-trend" :class="metric.trend">
            <el-icon><component :is="metric.trendIcon" /></el-icon>
            <span>{{ metric.change }}</span>
          </div>
        </div>
        <div class="metric-content">
          <h3 class="metric-value">{{ metric.value }}</h3>
          <p class="metric-label">{{ metric.label }}</p>
          <div class="metric-description">{{ metric.description }}</div>
        </div>
      </div>
    </div>

    <!-- 图表分析区域 -->
    <div class="charts-section">
      <!-- 第一行：面试趋势图（全宽） -->
      <div class="charts-row">
        <div class="chart-card trend-chart">
          <div class="chart-header">
            <h3 class="chart-title">面试活动趋势</h3>
            <div class="chart-controls">
              <el-radio-group v-model="trendPeriod" size="small">
                <el-radio-button label="week">本周</el-radio-button>
                <el-radio-button label="month">本月</el-radio-button>
                <el-radio-button label="quarter">本季度</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div class="chart-content">
            <div ref="trendChart" class="chart-container"></div>
          </div>
        </div>
      </div>

      <!-- 第二行：AI评分分布和技能匹配度（并排） -->
      <div class="charts-row">
        <div class="chart-card">
          <div class="chart-header">
            <h3 class="chart-title">AI评分分布</h3>
          </div>
          <div class="chart-content">
            <div ref="scoreChart" class="chart-container"></div>
          </div>
        </div>

        <div class="chart-card">
          <div class="chart-header">
            <h3 class="chart-title">技能匹配度分析</h3>
          </div>
          <div class="chart-content">
            <div ref="skillChart" class="chart-container"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 实时活动流 -->
    <div class="activity-section">
      <div class="section-header">
        <h3 class="section-title">
          <el-icon><Bell /></el-icon>
          实时活动动态
        </h3>
        <el-button size="small" text type="primary">查看全部</el-button>
      </div>
      
      <div class="activity-list">
        <div class="activity-item" v-for="activity in recentActivities" :key="activity.id">
          <div class="activity-avatar">
            <img :src="activity.avatar" :alt="activity.user" />
          </div>
          <div class="activity-content">
            <div class="activity-text">
              <span class="activity-user">{{ activity.user }}</span>
              <span class="activity-action">{{ activity.action }}</span>
              <span class="activity-target">{{ activity.target }}</span>
            </div>
            <div class="activity-meta">
              <span class="activity-time">{{ activity.time }}</span>
              <el-tag :type="activity.status === 'success' ? 'success' : 'info'" size="small">
                {{ activity.statusText }}
              </el-tag>
            </div>
          </div>
          <div class="activity-score" v-if="activity.score">
            <span class="score-value">{{ activity.score }}</span>
            <span class="score-label">分</span>
          </div>
        </div>
      </div>
    </div>

    <!-- AI洞察建议 -->
    <div class="insights-section">
      <div class="section-header">
        <h3 class="section-title">
          <el-icon><Cpu /></el-icon>
          AI智能洞察
        </h3>
      </div>
      
      <div class="insights-grid">
        <div class="insight-card" v-for="insight in aiInsights" :key="insight.id">
          <div class="insight-header">
            <div class="insight-icon" :class="insight.type">
              <el-icon><component :is="insight.icon" /></el-icon>
            </div>
            <div class="insight-priority" :class="insight.priority">
              {{ insight.priorityText }}
            </div>
          </div>
          <div class="insight-content">
            <h4 class="insight-title">{{ insight.title }}</h4>
            <p class="insight-description">{{ insight.description }}</p>
            <div class="insight-actions">
              <el-button size="small" type="primary" text @click="viewInsightDetail(insight)">
                查看详情
                <el-icon><ArrowRight /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import * as echarts from 'echarts'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import {
  Download, TrendCharts, User, Clock, Star, CaretTop, CaretBottom,
  Bell, Cpu, ArrowRight, Warning, InfoFilled, SuccessFilled
} from '@element-plus/icons-vue'

// 响应式数据
const dateRange = ref([])
const trendPeriod = ref('month')

// 图表引用
const trendChart = ref(null)
const scoreChart = ref(null)
const skillChart = ref(null)

// 图表实例
let trendChartInstance = null

// 核心指标数据
const coreMetrics = ref([
  {
    id: 1,
    label: '本月面试总数',
    value: '1,247',
    description: '较上月增长 12.5%',
    icon: 'User',
    gradient: 'linear-gradient(135deg, #1890ff 0%, #0066cc 100%)',
    trend: 'up',
    trendIcon: 'CaretTop',
    change: '+12.5%'
  },
  {
    id: 2,
    label: '平均AI评分',
    value: '87.3',
    description: '整体表现优秀',
    icon: 'Star',
    gradient: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
    trend: 'up',
    trendIcon: 'CaretTop',
    change: '+3.2'
  },
  {
    id: 3,
    label: '平均面试时长',
    value: '28分钟',
    description: '效率提升 8%',
    icon: 'Clock',
    gradient: 'linear-gradient(135deg, #722ed1 0%, #531dab 100%)',
    trend: 'down',
    trendIcon: 'CaretBottom',
    change: '-8%'
  },
  {
    id: 4,
    label: '技能匹配度',
    value: '92.1%',
    description: '匹配精准度高',
    icon: 'TrendCharts',
    gradient: 'linear-gradient(135deg, #fa8c16 0%, #d46b08 100%)',
    trend: 'up',
    trendIcon: 'CaretTop',
    change: '+5.3%'
  }
])

// 实时活动数据
const recentActivities = ref([
  {
    id: 1,
    user: '张三',
    action: '完成了',
    target: 'AI算法工程师面试',
    time: '2分钟前',
    avatar: '/images/candidate-avatar.svg',
    status: 'success',
    statusText: '已完成',
    score: 89
  },
  {
    id: 2,
    user: '李四',
    action: '开始了',
    target: '大数据工程师面试',
    time: '5分钟前',
    avatar: '/images/candidate-avatar.svg',
    status: 'progress',
    statusText: '进行中'
  },
  {
    id: 3,
    user: '王五',
    action: '完成了',
    target: 'IoT开发工程师面试',
    time: '10分钟前',
    avatar: '/images/candidate-avatar.svg',
    status: 'success',
    statusText: '已完成',
    score: 92
  }
])

// AI洞察建议
const aiInsights = ref([
  {
    id: 1,
    type: 'warning',
    priority: 'high',
    priorityText: '高优先级',
    icon: 'Warning',
    title: '面试通过率下降',
    description: '本周AI算法岗位面试通过率较上周下降15%，建议调整面试难度或优化题目设置'
  },
  {
    id: 2,
    type: 'info',
    priority: 'medium',
    priorityText: '中优先级',
    icon: 'InfoFilled',
    title: '候选人技能分布变化',
    description: '深度学习技能的候选人比例上升20%，建议增加相关岗位需求'
  },
  {
    id: 3,
    type: 'success',
    priority: 'low',
    priorityText: '低优先级',
    icon: 'SuccessFilled',
    title: '面试体验优化建议',
    description: '候选人反馈AI面试官响应速度很好，建议保持当前配置'
  }
])

// 获取不同时间范围的数据
const getTrendData = (period) => {
  const dataMap = {
    week: {
      xAxisData: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      interviewData: [45, 52, 38, 67, 73, 89, 94],
      passData: [32, 41, 28, 52, 58, 71, 76]
    },
    month: {
      xAxisData: ['第1周', '第2周', '第3周', '第4周'],
      interviewData: [156, 189, 167, 203],
      passData: [98, 134, 112, 156]
    },
    quarter: {
      xAxisData: ['1月', '2月', '3月'],
      interviewData: [456, 523, 612],
      passData: [298, 367, 445]
    }
  }
  return dataMap[period] || dataMap.month
}

// 更新趋势图表
const updateTrendChart = () => {
  if (!trendChartInstance) return

  const data = getTrendData(trendPeriod.value)

  const option = {
    xAxis: {
      data: data.xAxisData
    },
    series: [
      {
        name: '面试数量',
        data: data.interviewData
      },
      {
        name: '通过数量',
        data: data.passData
      }
    ]
  }

  trendChartInstance.setOption(option)
}

// 初始化图表
const initCharts = () => {
  nextTick(() => {
    // 趋势图
    if (trendChart.value) {
      trendChartInstance = echarts.init(trendChart.value)

      const data = getTrendData(trendPeriod.value)

      const trendOption = {
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#e6f7ff',
          borderWidth: 1,
          textStyle: { color: '#2c3e50', fontSize: 12 },
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#1890ff'
            }
          }
        },
        legend: {
          data: ['面试数量', '通过数量'],
          textStyle: { color: '#64748b', fontSize: 12 },
          top: 15,
          left: 'center'
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '8%',
          top: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: data.xAxisData,
          axisLine: { lineStyle: { color: '#e6f7ff' } },
          axisTick: { show: false },
          axisLabel: {
            color: '#64748b',
            fontSize: 11,
            interval: 0,
            rotate: data.xAxisData.length > 7 ? 45 : 0
          }
        },
        yAxis: {
          type: 'value',
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            color: '#64748b',
            fontSize: 11
          },
          splitLine: {
            lineStyle: {
              color: '#f1f5f9',
              type: 'dashed'
            }
          }
        },
        series: [
          {
            name: '面试数量',
            type: 'line',
            data: data.interviewData,
            smooth: true,
            symbol: 'circle',
            symbolSize: 6,
            lineStyle: { width: 3 },
            itemStyle: { color: '#1890ff' },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
                { offset: 1, color: 'rgba(24, 144, 255, 0.05)' }
              ])
            }
          },
          {
            name: '通过数量',
            type: 'line',
            data: data.passData,
            smooth: true,
            symbol: 'circle',
            symbolSize: 6,
            lineStyle: { width: 3 },
            itemStyle: { color: '#52c41a' },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(82, 196, 26, 0.3)' },
                { offset: 1, color: 'rgba(82, 196, 26, 0.05)' }
              ])
            }
          }
        ]
      }
      trendChartInstance.setOption(trendOption)

      // 添加图表自适应
      const resizeHandler = () => {
        if (trendChartInstance) {
          trendChartInstance.resize()
        }
      }
      window.addEventListener('resize', resizeHandler)
    }

    // 评分分布图
    if (scoreChart.value) {
      const scoreChartInstance = echarts.init(scoreChart.value)
      const scoreOption = {
        tooltip: { trigger: 'item' },
        series: [{
          type: 'pie',
          radius: ['40%', '70%'],
          data: [
            { value: 35, name: '优秀(90-100)' },
            { value: 45, name: '良好(80-89)' },
            { value: 15, name: '中等(70-79)' },
            { value: 5, name: '待提升(<70)' }
          ],
          itemStyle: {
            borderRadius: 8,
            borderColor: '#fff',
            borderWidth: 2
          }
        }]
      }
      scoreChartInstance.setOption(scoreOption)
    }

    // 技能匹配度图
    if (skillChart.value) {
      const skillChartInstance = echarts.init(skillChart.value)
      const skillOption = {
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#e6f7ff',
          borderWidth: 1,
          textStyle: { color: '#2c3e50', fontSize: 12 },
          formatter: function(params) {
            const data = params[0]
            return `${data.name}<br/>匹配度: ${data.value}%`
          }
        },
        grid: {
          left: '8%',
          right: '8%',
          bottom: '15%',
          top: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['Python', '机器学习', '深度学习', '数据分析', 'TensorFlow'],
          axisLine: { lineStyle: { color: '#e6f7ff' } },
          axisTick: { show: false },
          axisLabel: {
            color: '#64748b',
            fontSize: 10,
            interval: 0,
            rotate: 30,
            margin: 8
          }
        },
        yAxis: {
          type: 'value',
          max: 100,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            color: '#64748b',
            fontSize: 11,
            formatter: '{value}%'
          },
          splitLine: {
            lineStyle: {
              color: '#f1f5f9',
              type: 'dashed'
            }
          }
        },
        series: [{
          type: 'bar',
          data: [92, 88, 85, 90, 87],
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#1890ff' },
              { offset: 1, color: '#0066cc' }
            ]),
            borderRadius: [4, 4, 0, 0]
          },
          barWidth: '50%',
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#40a9ff' },
                { offset: 1, color: '#1890ff' }
              ])
            }
          },
          label: {
            show: true,
            position: 'top',
            color: '#64748b',
            fontSize: 10,
            formatter: '{c}%'
          }
        }]
      }
      skillChartInstance.setOption(skillOption)

      // 添加图表自适应
      const resizeHandler = () => {
        if (skillChartInstance) {
          skillChartInstance.resize()
        }
      }
      window.addEventListener('resize', resizeHandler)
    }
  })
}

// AI洞察详情查看
const viewInsightDetail = async (insight) => {
  try {
    // 显示加载状态
    const loadingInstance = ElLoading.service({
      lock: true,
      text: '正在生成详细分析...',
      background: 'rgba(0, 0, 0, 0.7)'
    })

    // 模拟AI分析过程
    await new Promise(resolve => setTimeout(resolve, 1500))

    loadingInstance.close()

    // 生成详细的AI分析数据
    const detailData = generateInsightDetailData(insight)

    // 显示详情弹窗
    ElMessageBox.alert(
      createInsightDetailHTML(detailData),
      'AI智能洞察详情',
      {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '知道了',
        customClass: 'insight-detail-dialog',
        customStyle: {
          width: '80%',
          maxWidth: '900px'
        }
      }
    )
  } catch (error) {
    console.error('查看洞察详情失败:', error)
    ElMessage.error('获取详细分析失败，请稍后重试')
  }
}

// 生成洞察详情数据
const generateInsightDetailData = (insight) => {
  const baseData = {
    title: insight.title,
    priority: insight.priorityText,
    description: insight.description,
    timestamp: new Date().toLocaleString('zh-CN'),
    confidence: Math.floor(Math.random() * 20) + 80, // 80-99%
  }

  // 根据洞察类型生成不同的详细数据
  switch (insight.type) {
    case 'warning':
      return {
        ...baseData,
        analysisType: '风险预警分析',
        metrics: [
          { name: '风险等级', value: '中等', trend: 'up' },
          { name: '影响范围', value: '15%', trend: 'stable' },
          { name: '预计损失', value: '较低', trend: 'down' }
        ],
        recommendations: [
          '立即关注相关指标变化趋势',
          '调整面试官培训计划',
          '优化候选人筛选标准',
          '加强质量控制流程'
        ],
        chartData: {
          type: 'line',
          data: [65, 70, 68, 75, 72, 78, 74]
        }
      }
    case 'info':
      return {
        ...baseData,
        analysisType: '趋势洞察分析',
        metrics: [
          { name: '趋势强度', value: '强', trend: 'up' },
          { name: '持续时间', value: '7天', trend: 'stable' },
          { name: '影响程度', value: '显著', trend: 'up' }
        ],
        recommendations: [
          '继续保持当前优势策略',
          '扩大成功经验应用范围',
          '建立最佳实践文档',
          '定期评估效果持续性'
        ],
        chartData: {
          type: 'bar',
          data: [85, 88, 92, 89, 94, 91, 96]
        }
      }
    default:
      return {
        ...baseData,
        analysisType: '综合效能分析',
        metrics: [
          { name: '整体表现', value: '优秀', trend: 'up' },
          { name: '改进空间', value: '中等', trend: 'stable' },
          { name: '执行难度', value: '较低', trend: 'down' }
        ],
        recommendations: [
          '保持现有优势并持续优化',
          '关注潜在改进机会',
          '建立长期监控机制',
          '定期回顾和调整策略'
        ],
        chartData: {
          type: 'radar',
          data: [90, 85, 88, 92, 87, 89]
        }
      }
  }
}

// 创建洞察详情HTML
const createInsightDetailHTML = (data) => {
  return `
    <div style="text-align: left; font-family: 'Microsoft YaHei', sans-serif;">
      <!-- 头部信息 -->
      <div style="border-bottom: 2px solid #f0f0f0; padding-bottom: 16px; margin-bottom: 20px;">
        <h3 style="color: #1890ff; margin-bottom: 8px; font-size: 18px;">${data.title}</h3>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span style="color: #666; font-size: 14px;">分析类型：${data.analysisType}</span>
          <span style="background: #e6f7ff; color: #1890ff; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
            置信度: ${data.confidence}%
          </span>
        </div>
        <p style="color: #666; font-size: 13px; margin: 0;">生成时间：${data.timestamp}</p>
      </div>

      <!-- 核心指标 -->
      <div style="margin-bottom: 20px;">
        <h4 style="color: #0066cc; margin-bottom: 12px; font-size: 16px;">📊 核心指标分析</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px;">
          ${data.metrics.map(metric => `
            <div style="background: #f8fafc; padding: 12px; border-radius: 6px; border-left: 3px solid #1890ff;">
              <div style="font-weight: 600; color: #2c3e50; margin-bottom: 4px;">${metric.name}</div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="color: #1890ff; font-weight: 600;">${metric.value}</span>
                <span style="color: ${metric.trend === 'up' ? '#52c41a' : metric.trend === 'down' ? '#ff4d4f' : '#faad14'}; font-size: 12px;">
                  ${metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
                </span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- AI深度分析 -->
      <div style="background: #f6f8fa; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
        <h4 style="color: #0066cc; margin-bottom: 12px; font-size: 16px;">🤖 iFlytek Spark AI深度分析</h4>
        <div style="line-height: 1.6; color: #2c3e50;">
          <p style="margin-bottom: 8px;">• 基于iFlytek Spark AI引擎的多维度数据洞察</p>
          <p style="margin-bottom: 8px;">• 结合历史趋势和实时数据的智能分析</p>
          <p style="margin-bottom: 8px;">• 运用机器学习算法识别潜在模式和异常</p>
          <p style="margin: 0;">• 提供个性化的优化建议和预测性洞察</p>
        </div>
      </div>

      <!-- 数据趋势图表 -->
      <div style="background: #fff; border: 1px solid #e6e6e6; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
        <h4 style="color: #0066cc; margin-bottom: 12px; font-size: 16px;">📈 数据趋势可视化</h4>
        <div style="height: 120px; background: linear-gradient(135deg, #e6f7ff 0%, #f0f9ff 100%); border-radius: 6px; display: flex; align-items: center; justify-content: center; position: relative;">
          <div style="text-align: center; color: #1890ff;">
            <div style="font-size: 24px; margin-bottom: 8px;">📊</div>
            <div style="font-size: 14px;">趋势图表 (${data.chartData.type})</div>
            <div style="font-size: 12px; color: #666; margin-top: 4px;">
              数据点: ${data.chartData.data.join(', ')}
            </div>
          </div>
        </div>
      </div>

      <!-- 建议行动 -->
      <div style="background: #e6f7ff; padding: 16px; border-radius: 8px;">
        <h4 style="color: #1890ff; margin-bottom: 12px; font-size: 16px;">💡 智能建议行动</h4>
        <div style="line-height: 1.6;">
          ${data.recommendations.map((rec, index) => `
            <div style="display: flex; align-items: flex-start; margin-bottom: 8px;">
              <span style="background: #1890ff; color: white; border-radius: 50%; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; font-size: 12px; margin-right: 10px; flex-shrink: 0;">
                ${index + 1}
              </span>
              <span style="color: #2c3e50;">${rec}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `
}

// 导出仪表板报告
const exportDashboardReport = async () => {
  try {
    // 显示格式选择对话框
    const { value: format } = await ElMessageBox.prompt(
      '请选择导出格式：',
      '导出仪表板报告',
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
      text: '正在生成报告...',
      background: 'rgba(0, 0, 0, 0.7)'
    })

    // 模拟报告生成过程
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 准备导出数据
    const reportData = {
      title: 'iFlytek智能招聘仪表板报告',
      generatedAt: new Date().toLocaleString('zh-CN'),
      metrics: coreMetrics.value,
      insights: aiInsights.value,
      summary: {
        totalInterviews: 1234,
        passRate: '78.5%',
        avgScore: 82.3,
        aiAccuracy: '95.2%'
      }
    }

    // 根据格式导出
    if (format === 'excel') {
      await exportToExcel(reportData)
    } else if (format === 'pdf') {
      await exportToPDF(reportData)
    } else if (format === 'csv') {
      await exportToCSV(reportData)
    }

    loadingInstance.close()
    ElMessage.success(`报告已成功导出为${format.toUpperCase()}格式`)

  } catch (error) {
    console.error('导出报告失败:', error)
    ElMessage.error('报告导出失败，请稍后重试')
  }
}

// Excel导出功能
const exportToExcel = async (data) => {
  try {
    const fileName = `iFlytek智能招聘仪表板_${new Date().toISOString().slice(0, 10)}.xlsx`

    // 创建工作簿
    const workbook = XLSX.utils.book_new()

    // 创建概览工作表
    const overviewData = [
      ['iFlytek智能招聘仪表板报告'],
      [''],
      ['生成时间', data.generatedAt],
      ['报告周期', dateRange.value.length > 0 ?
        `${dateRange.value[0].toLocaleDateString('zh-CN')} 至 ${dateRange.value[1].toLocaleDateString('zh-CN')}` :
        '全部数据'],
      [''],
      ['报告摘要'],
      ['总面试数量', data.summary.totalInterviews],
      ['通过率', data.summary.passRate],
      ['平均分数', data.summary.avgScore],
      ['AI准确率', data.summary.aiAccuracy]
    ]
    const overviewSheet = XLSX.utils.aoa_to_sheet(overviewData)

    // 设置列宽
    overviewSheet['!cols'] = [
      { width: 20 },
      { width: 20 }
    ]

    // 设置标题样式
    overviewSheet['A1'] = {
      v: 'iFlytek智能招聘仪表板报告',
      t: 's',
      s: { font: { bold: true, sz: 16 } }
    }

    XLSX.utils.book_append_sheet(workbook, overviewSheet, '概览')

    // 创建核心指标工作表
    const metricsData = [
      ['核心指标详情'],
      [''],
      ['指标名称', '数值', '变化趋势', '描述'],
      ...data.metrics.map(m => [m.label, m.value, m.change, m.description || ''])
    ]
    const metricsSheet = XLSX.utils.aoa_to_sheet(metricsData)
    metricsSheet['!cols'] = [
      { width: 15 },
      { width: 12 },
      { width: 12 },
      { width: 30 }
    ]
    XLSX.utils.book_append_sheet(workbook, metricsSheet, '核心指标')

    // 创建AI洞察工作表
    const insightsData = [
      ['AI智能洞察分析'],
      [''],
      ['优先级', '洞察标题', '详细描述', '建议行动'],
      ...data.insights.map(i => [
        i.priorityText,
        i.title,
        i.description,
        '关注相关指标变化，及时调整策略'
      ])
    ]
    const insightsSheet = XLSX.utils.aoa_to_sheet(insightsData)
    insightsSheet['!cols'] = [
      { width: 10 },
      { width: 25 },
      { width: 40 },
      { width: 30 }
    ]
    XLSX.utils.book_append_sheet(workbook, insightsSheet, 'AI洞察')

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

    console.log('📊 Excel文件已生成:', fileName)

  } catch (error) {
    console.error('❌ Excel导出失败:', error)
    throw new Error('Excel文件生成失败，请检查数据格式')
  }
}

// PDF导出功能
const exportToPDF = async (data) => {
  ElMessage.info('PDF导出功能正在开发中，请使用Excel格式')
}

// CSV导出功能
const exportToCSV = async (data) => {
  const fileName = `iFlytek智能招聘仪表板_${new Date().toISOString().slice(0, 10)}.csv`

  const csvData = [
    ['指标名称', '数值', '变化趋势'],
    ...data.metrics.map(m => [m.label, m.value, m.change])
  ]

  const csvContent = csvData.map(row => row.join(',')).join('\n')
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = fileName
  link.click()
}

// 监听时间范围变化
watch(trendPeriod, () => {
  updateTrendChart()
})

onMounted(() => {
  initCharts()
})
</script>

<style scoped>
.intelligent-dashboard {
  padding: 24px;
  background: #f8fafc;
  min-height: 100vh;
}

/* 仪表板头部 */
.dashboard-header {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 8px;
}

.dashboard-subtitle {
  color: #64748b;
  font-size: 1rem;
}

.header-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.export-btn {
  background: linear-gradient(135deg, #1890ff 0%, #0066cc 100%);
  border: none;
  border-radius: 8px;
}

/* 指标卡片 */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.metric-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
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

.metric-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 600;
}

.metric-trend.up {
  color: #52c41a;
}

.metric-trend.down {
  color: #ff4d4f;
}

.metric-value {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 4px;
}

.metric-label {
  color: #64748b;
  font-size: 14px;
  margin-bottom: 8px;
}

.metric-description {
  color: #94a3b8;
  font-size: 12px;
}

/* 图表区域 */
.charts-section {
  margin-bottom: 32px;
}

.charts-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.charts-row:last-child {
  margin-bottom: 0;
}

/* 第一行趋势图占满宽度 */
.charts-row:first-child {
  display: block;
}

.chart-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  flex: 1;
}

/* 趋势图样式 */
.trend-chart {
  width: 100%;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

/* 统一图表容器高度 */
.chart-container {
  height: 280px;
  width: 100%;
  min-height: 240px;
  position: relative;
}

/* 趋势图稍微高一些，更协调 */
.trend-chart .chart-container {
  height: 320px;
  min-height: 280px;
}

/* 确保图表容器不会溢出 */
.chart-card {
  overflow: hidden;
  min-width: 0; /* 防止flex子项溢出 */
}

.charts-row .chart-card {
  flex: 1;
  min-width: 300px; /* 最小宽度确保内容可读 */
}

/* 活动流 */
.activity-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}

.activity-list {
  space-y: 16px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #f1f5f9;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.activity-content {
  flex: 1;
}

.activity-text {
  margin-bottom: 4px;
}

.activity-user {
  font-weight: 600;
  color: #2c3e50;
}

.activity-action,
.activity-target {
  color: #64748b;
}

.activity-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.activity-time {
  font-size: 12px;
  color: #94a3b8;
}

.activity-score {
  text-align: center;
}

.score-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1890ff;
}

.score-label {
  font-size: 12px;
  color: #64748b;
}

/* AI洞察 */
.insights-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
}

.insight-card {
  border: 1px solid #f1f5f9;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s ease;
}

.insight-card:hover {
  border-color: #1890ff;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.1);
}

.insight-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.insight-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.insight-icon.warning {
  background: #fa8c16;
}

.insight-icon.info {
  background: #1890ff;
}

.insight-icon.success {
  background: #52c41a;
}

.insight-priority {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.insight-priority.high {
  background: #fff2f0;
  color: #ff4d4f;
}

.insight-priority.medium {
  background: #fff7e6;
  color: #fa8c16;
}

.insight-priority.low {
  background: #f6ffed;
  color: #52c41a;
}

.insight-title {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
}

.insight-description {
  color: #64748b;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 12px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .charts-row {
    flex-direction: column;
    gap: 16px;
  }

  .charts-row .chart-card {
    min-width: auto;
  }

  .chart-container {
    height: 240px;
    min-height: 200px;
  }

  .trend-chart .chart-container {
    height: 280px;
    min-height: 240px;
  }
}

@media (max-width: 992px) {
  .intelligent-dashboard {
    padding: 16px;
  }

  .charts-row {
    gap: 16px;
    margin-bottom: 16px;
  }

  .chart-card {
    padding: 20px;
  }

  .chart-container {
    height: 220px;
    min-height: 180px;
  }

  .trend-chart .chart-container {
    height: 260px;
    min-height: 220px;
  }

  .chart-title {
    font-size: 1rem;
  }
}

@media (max-width: 768px) {
  .intelligent-dashboard {
    padding: 12px;
  }

  .header-content {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .metrics-grid,
  .insights-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .activity-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .chart-container {
    height: 200px;
    min-height: 160px;
  }

  .trend-chart .chart-container {
    height: 240px;
    min-height: 200px;
  }

  .chart-card {
    padding: 16px;
  }

  .chart-title {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .chart-container {
    height: 180px;
    min-height: 140px;
  }

  .trend-chart .chart-container {
    height: 220px;
    min-height: 180px;
  }

  .header-actions {
    flex-direction: column;
    width: 100%;
    gap: 12px;
  }

  .date-picker,
  .export-btn {
    width: 100%;
  }
}

/* AI洞察详情弹窗样式 */
:deep(.insight-detail-dialog) {
  .el-message-box {
    max-height: 80vh;
    overflow-y: auto;
  }

  .el-message-box__content {
    max-height: 70vh;
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

/* 确保弹窗在移动端的适配 */
@media (max-width: 768px) {
  :deep(.insight-detail-dialog) {
    .el-message-box {
      width: 95% !important;
      margin: 0 auto;
    }

    .el-message-box__content {
      padding: 16px;
    }
  }
}
</style>
