<template>
  <div class="realtime-data-chart chart-container enhanced-chart realtime-chart" :class="getChartThemeClass()">
    <div class="chart-header">
      <h3 class="chart-title">
        <div class="chart-icon">
          <el-icon><TrendCharts /></el-icon>
        </div>
        {{ title }}
      </h3>
      <div class="chart-actions">
        <div class="status-indicator" :class="connectionStatus">
          {{ connectionStatus === 'online' ? '实时连接' : '连接断开' }}
        </div>
        <el-button 
          :icon="isPlaying ? VideoPause : VideoPlay" 
          @click="togglePlayback"
          size="small"
          class="btn-enhanced"
          :class="theme"
        >
          {{ isPlaying ? '暂停' : '播放' }}
        </el-button>
      </div>
    </div>
    
    <div class="chart-content">
      <!-- 数据流动效果 -->
      <div class="data-stream" v-if="isPlaying"></div>
      
      <!-- 主要指标卡片 -->
      <div class="metrics-grid">
        <div 
          v-for="(metric, index) in metrics" 
          :key="metric.name"
          class="metric-card enhanced-card"
          :class="metric.theme"
          v-motion-slide-visible-once-up
          :delay="index * 100"
        >
          <div class="metric-icon icon-enhanced icon-lg" :class="metric.theme">
            <el-icon><component :is="metric.icon" /></el-icon>
          </div>
          <div class="metric-content">
            <div class="metric-value">{{ formatValue(metric.value) }}</div>
            <div class="metric-name">{{ metric.name }}</div>
            <div class="metric-change" :class="metric.trend">
              <el-icon><component :is="getTrendIcon(metric.trend)" /></el-icon>
              {{ metric.change }}
            </div>
          </div>
        </div>
      </div>
      
      <!-- 实时图表区域 -->
      <div class="chart-area">
        <svg class="realtime-svg" viewBox="0 0 800 300">
          <!-- 网格线 -->
          <defs>
            <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 30" fill="none" stroke="var(--border-light)" stroke-width="1" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          <!-- 数据线 -->
          <g v-for="(line, index) in chartLines" :key="line.name">
            <path 
              :d="line.path"
              fill="none"
              :stroke="line.color"
              stroke-width="3"
              stroke-linecap="round"
              class="chart-line"
              :style="{ 
                strokeDasharray: line.length,
                strokeDashoffset: animateLines ? 0 : line.length,
                transition: 'stroke-dashoffset 2s ease-out'
              }"
            />
            
            <!-- 数据点 -->
            <circle 
              v-for="(point, pointIndex) in line.points" 
              :key="pointIndex"
              :cx="point.x"
              :cy="point.y"
              r="4"
              :fill="line.color"
              class="data-point"
              v-tooltip="`${line.name}: ${point.value}`"
            />
          </g>
          
          <!-- Y轴标签 -->
          <g class="y-axis">
            <text v-for="i in 6" :key="i" 
              x="10" 
              :y="i * 50 + 5" 
              class="axis-label"
            >
              {{ 100 - (i - 1) * 20 }}%
            </text>
          </g>
          
          <!-- X轴标签 -->
          <g class="x-axis">
            <text v-for="(label, index) in timeLabels" :key="index"
              :x="index * 100 + 50"
              y="290"
              class="axis-label"
              text-anchor="middle"
            >
              {{ label }}
            </text>
          </g>
        </svg>
      </div>
      
      <!-- 图例 -->
      <div class="chart-legend">
        <div 
          v-for="line in chartLines" 
          :key="line.name"
          class="legend-item"
          @click="toggleLine(line.name)"
          :class="{ disabled: line.hidden }"
        >
          <div class="legend-color" :style="{ background: line.color }"></div>
          <span class="legend-text">{{ line.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { VideoPlay, VideoPause, TrendCharts, User, Timer, DataBoard, ArrowUp, ArrowDown } from '@element-plus/icons-vue'

const props = defineProps({
  title: {
    type: String,
    default: '实时系统监控'
  },
  theme: {
    type: String,
    default: 'interview'
  },
  autoUpdate: {
    type: Boolean,
    default: true
  }
})

// 状态管理
const isPlaying = ref(true)
const connectionStatus = ref('online')
const animateLines = ref(false)
const updateInterval = ref(null)

// 指标数据
const metrics = ref([
  {
    name: 'AI处理速度',
    value: 1247,
    unit: 'ms',
    change: '+12.5%',
    trend: 'up',
    theme: 'ai',
    icon: TrendCharts
  },
  {
    name: '并发用户',
    value: 2856,
    unit: '人',
    change: '+8.3%',
    trend: 'up',
    theme: 'data',
    icon: User
  },
  {
    name: '响应时间',
    value: 156,
    unit: 'ms',
    change: '-5.2%',
    trend: 'down',
    theme: 'iot',
    icon: Timer
  },
  {
    name: '准确率',
    value: 94.7,
    unit: '%',
    change: '+2.1%',
    trend: 'up',
    theme: 'interview',
    icon: DataBoard
  }
])

// 图表数据
const chartData = ref({
  ai: [85, 87, 82, 90, 88, 92, 89, 94],
  data: [78, 82, 85, 83, 87, 85, 90, 88],
  iot: [72, 75, 78, 76, 80, 82, 79, 85],
  system: [90, 88, 92, 89, 91, 93, 90, 95]
})

const timeLabels = computed(() => {
  const now = new Date()
  return Array.from({ length: 8 }, (_, i) => {
    const time = new Date(now.getTime() - (7 - i) * 60000)
    return time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  })
})

// 图表线条
const chartLines = computed(() => {
  const colors = {
    ai: 'var(--ai-primary)',
    data: 'var(--data-primary)',
    iot: 'var(--iot-primary)',
    system: 'var(--interview-primary)'
  }
  
  const names = {
    ai: 'AI处理',
    data: '数据分析',
    iot: 'IoT连接',
    system: '系统性能'
  }
  
  return Object.entries(chartData.value).map(([key, values]) => {
    const points = values.map((value, index) => ({
      x: index * 100 + 50,
      y: 250 - (value / 100) * 200,
      value
    }))
    
    const path = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`
    
    return {
      name: names[key],
      color: colors[key],
      path,
      points,
      length: path.length,
      hidden: false
    }
  })
})

// 方法
const formatValue = (value) => {
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K'
  }
  return value.toString()
}

const getTrendIcon = (trend) => {
  return trend === 'up' ? ArrowUp : ArrowDown
}

const togglePlayback = () => {
  isPlaying.value = !isPlaying.value
  if (isPlaying.value) {
    startUpdating()
  } else {
    stopUpdating()
  }
}

const toggleLine = (lineName) => {
  const line = chartLines.value.find(l => l.name === lineName)
  if (line) {
    line.hidden = !line.hidden
  }
}

const updateData = () => {
  // 模拟实时数据更新
  Object.keys(chartData.value).forEach(key => {
    const values = chartData.value[key]
    values.shift()
    values.push(Math.floor(Math.random() * 30) + 70)
  })
  
  // 更新指标
  metrics.value.forEach(metric => {
    const change = (Math.random() - 0.5) * 10
    metric.value += Math.floor(change)
    metric.change = (change > 0 ? '+' : '') + change.toFixed(1) + '%'
    metric.trend = change > 0 ? 'up' : 'down'
  })
}

const startUpdating = () => {
  if (props.autoUpdate && !updateInterval.value) {
    updateInterval.value = setInterval(updateData, 3000)
  }
}

const stopUpdating = () => {
  if (updateInterval.value) {
    clearInterval(updateInterval.value)
    updateInterval.value = null
  }
}

// 获取图表主题类
const getChartThemeClass = () => {
  const themeMap = {
    'ai': 'chart-ai-theme',
    'data': 'chart-bigdata-theme',
    'iot': 'chart-iot-theme',
    'interview': 'chart-interview-theme'
  }
  return themeMap[props.theme] || 'chart-bigdata-theme'
}

onMounted(() => {
  setTimeout(() => {
    animateLines.value = true
  }, 500)
  
  if (props.autoUpdate) {
    startUpdating()
  }
})

onUnmounted(() => {
  stopUpdating()
})
</script>

<style scoped>
.realtime-data-chart {
  position: relative;
  min-height: 500px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.metric-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
}

.metric-content {
  flex: 1;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
}

.metric-name {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: var(--spacing-xs) 0;
}

.metric-change {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 0.75rem;
  font-weight: 600;
}

.metric-change.up {
  color: var(--success);
}

.metric-change.down {
  color: var(--error);
}

.chart-area {
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.realtime-svg {
  width: 100%;
  height: 300px;
}

.chart-line {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.data-point {
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.data-point:hover {
  r: 6;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));
}

.axis-label {
  font-size: 12px;
  fill: var(--text-secondary);
  font-family: 'Microsoft YaHei', sans-serif;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-header {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
}
</style>
