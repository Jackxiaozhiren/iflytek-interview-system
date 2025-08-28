<template>
  <div class="enhanced-charts-container">
    <!-- 能力雷达图 -->
    <div class="chart-card enhanced-card-hover report-chart-enter">
      <div class="chart-header">
        <h3 class="chart-title chinese-text-fade-in">
          <el-icon><TrendCharts /></el-icon>
          六维能力雷达图
        </h3>
        <div class="chart-controls">
          <el-tooltip content="全屏显示">
            <el-button size="small" circle @click="toggleFullscreen('radar')">
              <el-icon><View /></el-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip content="导出图片">
            <el-button size="small" circle @click="exportChart('radar')">
              <el-icon><ArrowDown /></el-icon>
            </el-button>
          </el-tooltip>
        </div>
      </div>
      <div class="chart-container" ref="radarChartRef" @click="onChartClick('radar')"></div>
      <div class="chart-legend">
        <div class="legend-item" v-for="item in radarLegend" :key="item.name">
          <span class="legend-color" :style="{ backgroundColor: item.color }"></span>
          <span class="legend-text">{{ item.name }}: {{ item.value }}分</span>
        </div>
      </div>
    </div>

    <!-- 技术领域分布饼图 -->
    <div class="chart-card enhanced-card-hover report-chart-enter">
      <div class="chart-header">
        <h3 class="chart-title chinese-text-fade-in">
          <el-icon><TrendCharts /></el-icon>
          技术领域分布
        </h3>
        <div class="chart-controls">
          <el-select v-model="pieChartType" size="small" style="width: 120px">
            <el-option label="饼图" value="pie"></el-option>
            <el-option label="环形图" value="doughnut"></el-option>
            <el-option label="玫瑰图" value="rose"></el-option>
          </el-select>
          <el-tooltip content="导出图片">
            <el-button size="small" circle @click="exportChart('pie')">
              <el-icon><ArrowDown /></el-icon>
            </el-button>
          </el-tooltip>
        </div>
      </div>
      <div class="chart-container" ref="pieChartRef"></div>
      <div class="chart-stats">
        <div class="stat-item" v-for="item in pieStats" :key="item.name">
          <span class="stat-label">{{ item.name }}</span>
          <span class="stat-value">{{ item.value }}%</span>
          <div class="stat-bar">
            <div class="stat-fill" :style="{ width: item.value + '%', backgroundColor: item.color }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 面试表现趋势图 -->
    <div class="chart-card enhanced-card-hover report-chart-enter">
      <div class="chart-header">
        <h3 class="chart-title chinese-text-fade-in">
          <el-icon><TrendCharts /></el-icon>
          面试表现趋势
        </h3>
        <div class="chart-controls">
          <el-radio-group v-model="trendTimeRange" size="small">
            <el-radio-button value="5min">5分钟</el-radio-button>
            <el-radio-button value="10min">10分钟</el-radio-button>
            <el-radio-button value="all">全程</el-radio-button>
          </el-radio-group>
          <el-tooltip content="导出图片">
            <el-button size="small" circle @click="exportChart('trend')">
              <el-icon><ArrowDown /></el-icon>
            </el-button>
          </el-tooltip>
        </div>
      </div>
      <div class="chart-container" ref="trendChartRef"></div>
      <div class="trend-analysis">
        <div class="analysis-item">
          <el-icon class="analysis-icon success"><TrendCharts /></el-icon>
          <span>整体表现呈上升趋势</span>
        </div>
        <div class="analysis-item">
          <el-icon class="analysis-icon warning"><Warning /></el-icon>
          <span>第8-12分钟表现略有波动</span>
        </div>
        <div class="analysis-item">
          <el-icon class="analysis-icon info"><InfoFilled /></el-icon>
          <span>最佳表现时段：第15-20分钟</span>
        </div>
      </div>
    </div>

    <!-- 详细分析图表 -->
    <div class="chart-card enhanced-card-hover report-chart-enter full-width">
      <div class="chart-header">
        <h3 class="chart-title chinese-text-fade-in">
          <el-icon><DataBoard /></el-icon>
          详细能力分析
        </h3>
        <div class="chart-controls">
          <el-tabs v-model="detailAnalysisTab" size="small">
            <el-tab-pane label="技术深度" name="technical"></el-tab-pane>
            <el-tab-pane label="沟通能力" name="communication"></el-tab-pane>
            <el-tab-pane label="问题解决" name="problem-solving"></el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div class="chart-container large" ref="detailChartRef"></div>
    </div>

    <!-- 全屏图表对话框 -->
    <el-dialog
      v-model="fullscreenDialog"
      :title="fullscreenTitle"
      width="90%"
      top="5vh"
      class="fullscreen-chart-dialog"
    >
      <div class="fullscreen-chart-container" ref="fullscreenChartRef"></div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import {
  TrendCharts, Grid, View, ArrowDown, Warning, InfoFilled
} from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import echartsManager from '@/utils/echartsManager'

// Props
const props = defineProps({
  reportData: {
    type: Object,
    required: true
  }
})

// 响应式数据
const radarChartRef = ref(null)
const pieChartRef = ref(null)
const trendChartRef = ref(null)
const detailChartRef = ref(null)
const fullscreenChartRef = ref(null)

const pieChartType = ref('pie')
const trendTimeRange = ref('all')
const detailAnalysisTab = ref('technical')
const fullscreenDialog = ref(false)
const fullscreenTitle = ref('')

// 图表实例
let radarChart = null
let pieChart = null
let trendChart = null
let detailChart = null
let fullscreenChart = null

// 图例数据
const radarLegend = ref([
  { name: '技术理解', value: 85, color: '#4c51bf' },
  { name: '问题解决', value: 78, color: '#6b21a8' },
  { name: '沟通表达', value: 82, color: '#f093fb' },
  { name: '学习适应', value: 88, color: '#f5576c' },
  { name: '团队协作', value: 75, color: '#4facfe' },
  { name: '创新思维', value: 80, color: '#43e97b' }
])

const pieStats = ref([
  { name: '人工智能', value: 45, color: '#4c51bf' },
  { name: '大数据', value: 30, color: '#6b21a8' },
  { name: '物联网', value: 25, color: '#f093fb' }
])

// 方法
const initCharts = async () => {
  console.log('🚀 开始初始化图表...')

  try {
    // 使用ECharts管理器安全初始化
    await echartsManager.safeInitChart(radarChartRef, async (container) => {
      radarChart = await echartsManager.createChart(container)
      updateRadarChart()
      return radarChart
    })

    await echartsManager.safeInitChart(pieChartRef, async (container) => {
      pieChart = await echartsManager.createChart(container)
      updatePieChart()
      return pieChart
    })

    await echartsManager.safeInitChart(trendChartRef, async (container) => {
      trendChart = await echartsManager.createChart(container)
      updateTrendChart()
      return trendChart
    })

    await echartsManager.safeInitChart(detailChartRef, async (container) => {
      detailChart = await echartsManager.createChart(container)
      updateDetailChart()
      return detailChart
    })

    console.log('✅ 所有图表初始化完成')
  } catch (error) {
    console.error('❌ 图表初始化失败:', error)
    ElMessage.error('图表初始化失败，请刷新页面重试')
  }
}

// 图表初始化函数已由echartsManager处理，这里只保留更新函数

const updateRadarChart = () => {
  if (!radarChart) return

  const option = {
    title: {
      text: '能力评估雷达图',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}分'
    },
    radar: {
      indicator: [
        { name: '技术理解', max: 100 },
        { name: '问题解决', max: 100 },
        { name: '沟通表达', max: 100 },
        { name: '学习适应', max: 100 },
        { name: '团队协作', max: 100 },
        { name: '创新思维', max: 100 }
      ],
      shape: 'polygon',
      splitNumber: 5,
      axisName: {
        color: '#666',
        fontSize: 12
      },
      splitLine: {
        lineStyle: {
          color: '#e0e0e0'
        }
      },
      splitArea: {
        areaStyle: {
          color: ['rgba(76, 81, 191, 0.1)', 'rgba(76, 81, 191, 0.05)']
        }
      }
    },
    series: [{
      name: '能力评估',
      type: 'radar',
      data: [{
        value: [85, 78, 82, 88, 75, 80],
        name: '当前表现',
        areaStyle: {
          color: 'rgba(76, 81, 191, 0.3)'
        },
        lineStyle: {
          color: '#4c51bf',
          width: 2
        },
        itemStyle: {
          color: '#4c51bf'
        }
      }],
      emphasis: {
        areaStyle: {
          color: 'rgba(76, 81, 191, 0.5)'
        }
      }
    }],
    animation: true,
    animationDuration: 1000,
    animationEasing: 'cubicOut'
  }
  
  radarChart.setOption(option)
}

// initPieChart函数已由echartsManager处理

const updatePieChart = () => {
  if (!pieChart) return
  
  const data = [
    { value: 45, name: '人工智能', itemStyle: { color: '#4c51bf' } },
    { value: 30, name: '大数据', itemStyle: { color: '#6b21a8' } },
    { value: 25, name: '物联网', itemStyle: { color: '#f093fb' } }
  ]
  
  const option = {
    title: {
      text: '技术领域分布',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}% ({d}%)'
    },
    series: [{
      name: '技术领域',
      type: 'pie',
      radius: pieChartType.value === 'doughnut' ? ['40%', '70%'] : '70%',
      roseType: pieChartType.value === 'rose' ? 'area' : false,
      data: data,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      label: {
        show: true,
        formatter: '{b}\n{c}%'
      },
      labelLine: {
        show: true
      }
    }],
    animation: true,
    animationDuration: 1000
  }
  
  pieChart.setOption(option)
}

// initTrendChart函数已由echartsManager处理

const updateTrendChart = () => {
  if (!trendChart) return
  
  const option = {
    title: {
      text: '面试表现趋势',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: '时间: {b}<br/>表现分数: {c}分'
    },
    xAxis: {
      type: 'category',
      data: ['0min', '5min', '10min', '15min', '20min', '25min'],
      axisLine: {
        lineStyle: {
          color: '#e0e0e0'
        }
      },
      axisLabel: {
        color: '#666'
      }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLine: {
        lineStyle: {
          color: '#e0e0e0'
        }
      },
      axisLabel: {
        color: '#666'
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0'
        }
      }
    },
    series: [{
      data: [65, 72, 68, 85, 90, 88],
      type: 'line',
      smooth: true,
      lineStyle: {
        color: '#4c51bf',
        width: 3
      },
      itemStyle: {
        color: '#4c51bf'
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: 'rgba(76, 81, 191, 0.3)'
          }, {
            offset: 1, color: 'rgba(76, 81, 191, 0.1)'
          }]
        }
      }
    }],
    animation: true,
    animationDuration: 1500
  }
  
  trendChart.setOption(option)
}

// initDetailChart函数已由echartsManager处理

const updateDetailChart = () => {
  if (!detailChart) return
  
  // 根据选中的标签页显示不同的详细分析
  const dataMap = {
    technical: {
      title: '技术深度分析',
      categories: ['基础概念', '实践经验', '架构设计', '性能优化', '最佳实践'],
      values: [85, 78, 82, 75, 88]
    },
    communication: {
      title: '沟通能力分析',
      categories: ['表达清晰度', '逻辑性', '专业术语', '互动性', '说服力'],
      values: [82, 85, 78, 80, 75]
    },
    'problem-solving': {
      title: '问题解决能力分析',
      categories: ['问题识别', '方案设计', '实施能力', '风险评估', '持续改进'],
      values: [88, 82, 85, 78, 80]
    }
  }
  
  const currentData = dataMap[detailAnalysisTab.value]
  
  const option = {
    title: {
      text: currentData.title,
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: currentData.categories,
      axisLabel: {
        interval: 0,
        rotate: 45,
        color: '#666'
      }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLabel: {
        color: '#666'
      }
    },
    series: [{
      data: currentData.values.map((value, index) => ({
        value,
        itemStyle: {
          color: `rgba(76, 81, 191, ${0.6 + index * 0.1})`
        }
      })),
      type: 'bar',
      barWidth: '60%',
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.3)'
        }
      }
    }],
    animation: true,
    animationDuration: 1000
  }
  
  detailChart.setOption(option)
}

// 事件处理
const onChartClick = (chartType) => {
  console.log(`点击了${chartType}图表`)
  ElMessage.info('点击图表查看详细数据')
}

const toggleFullscreen = (chartType) => {
  fullscreenTitle.value = `${chartType}图表 - 全屏显示`
  fullscreenDialog.value = true
  
  nextTick(() => {
    if (fullscreenChartRef.value) {
      // 在全屏对话框中重新渲染图表
      fullscreenChart = echarts.init(fullscreenChartRef.value)
      // 复制当前图表的配置
      const sourceChart = chartType === 'radar' ? radarChart : 
                         chartType === 'pie' ? pieChart : trendChart
      if (sourceChart) {
        fullscreenChart.setOption(sourceChart.getOption())
      }
    }
  })
}

const exportChart = (chartType) => {
  const chart = chartType === 'radar' ? radarChart :
                chartType === 'pie' ? pieChart :
                chartType === 'trend' ? trendChart : detailChart
  
  if (chart) {
    const url = chart.getDataURL({
      type: 'png',
      pixelRatio: 2,
      backgroundColor: '#fff'
    })
    
    const link = document.createElement('a')
    link.download = `${chartType}_chart.png`
    link.href = url
    link.click()
    
    ElMessage.success('图表导出成功')
  }
}

// 监听器
watch(pieChartType, () => {
  updatePieChart()
})

watch(detailAnalysisTab, () => {
  updateDetailChart()
})

// 响应式处理
const handleResize = () => {
  if (radarChart) radarChart.resize()
  if (pieChart) pieChart.resize()
  if (trendChart) trendChart.resize()
  if (detailChart) detailChart.resize()
  if (fullscreenChart) fullscreenChart.resize()
}

// 生命周期
onMounted(() => {
  // 使用多重延迟确保DOM完全渲染
  nextTick(() => {
    setTimeout(() => {
      initCharts()
      window.addEventListener('resize', handleResize)
    }, 50)
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)

  // 使用管理器清理图表
  if (radarChart) radarChart.dispose()
  if (pieChart) pieChart.dispose()
  if (trendChart) trendChart.dispose()
  if (detailChart) detailChart.dispose()
  if (fullscreenChart) fullscreenChart.dispose()

  console.log('🧹 图表组件已清理')
})

// 导出接口
defineExpose({
  exportChart,
  getChartImages: () => {
    const images = {}
    if (radarChart) images.radar = radarChart.getDataURL({ type: 'png', pixelRatio: 2, backgroundColor: '#fff' })
    if (pieChart) images.pie = pieChart.getDataURL({ type: 'png', pixelRatio: 2, backgroundColor: '#fff' })
    if (trendChart) images.trend = trendChart.getDataURL({ type: 'png', pixelRatio: 2, backgroundColor: '#fff' })
    if (detailChart) images.detail = detailChart.getDataURL({ type: 'png', pixelRatio: 2, backgroundColor: '#fff' })
    return images
  }
})
</script>

<style scoped>
.enhanced-charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  padding: 20px;
}

.chart-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.chart-card.full-width {
  grid-column: 1 / -1;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.chart-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chart-container {
  height: 300px;
  width: 100%;
}

.chart-container.large {
  height: 400px;
}

.chart-legend {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.chart-stats {
  margin-top: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.stat-bar {
  flex: 1;
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  margin: 0 12px;
  overflow: hidden;
}

.stat-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.trend-analysis {
  margin-top: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.analysis-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.analysis-icon.success {
  color: #52c41a;
}

.analysis-icon.warning {
  color: #faad14;
}

.analysis-icon.info {
  color: #1890ff;
}

.fullscreen-chart-container {
  height: 70vh;
  width: 100%;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .enhanced-charts-container {
    grid-template-columns: 1fr;
    padding: 16px;
  }
  
  .chart-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  
  .chart-controls {
    width: 100%;
    justify-content: space-between;
  }
  
  .chart-container {
    height: 250px;
  }
  
  .legend-item {
    font-size: 0.8rem;
  }
}
</style>
