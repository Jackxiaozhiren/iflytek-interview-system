<template>
  <div class="enhanced-progress-chart enhanced-chart progress-chart" :class="getChartThemeClass()">
    <div class="chart-header">
      <h3 class="chart-title">
        <div class="chart-icon">
          <el-icon><TrendCharts /></el-icon>
        </div>
        {{ title }}
      </h3>
      <p class="chart-subtitle">{{ subtitle }}</p>
    </div>
    
    <div class="progress-grid">
      <div 
        v-for="(item, index) in progressData" 
        :key="item.name"
        class="progress-item"
        :class="item.theme"
        v-motion-slide-visible-once-left
        :delay="index * 100"
      >
        <!-- 环形进度条 -->
        <div class="circular-progress">
          <svg viewBox="0 0 120 120">
            <circle 
              class="track" 
              cx="60" 
              cy="60" 
              r="54"
            />
            <circle 
              class="progress"
              :class="item.theme"
              cx="60" 
              cy="60" 
              r="54"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="getStrokeDashoffset(item.value)"
              :style="{ 
                animationDelay: (index * 100) + 'ms',
                animationDuration: '2s'
              }"
            />
          </svg>
          
          <div class="circular-progress-text">
            <div class="circular-progress-value">{{ item.value }}%</div>
            <div class="circular-progress-label">{{ item.name }}</div>
          </div>
        </div>
        
        <!-- 技能详情 -->
        <div class="skill-details">
          <div class="skill-name">{{ item.name }}</div>
          <div class="skill-description">{{ item.description }}</div>
          
          <!-- 线性进度条 -->
          <div class="progress-enhanced">
            <div 
              class="progress-bar"
              :class="item.theme"
              :style="{ width: item.value + '%' }"
            ></div>
          </div>
          
          <!-- 技能标签 -->
          <div class="skill-tags">
            <span 
              v-for="tag in item.tags" 
              :key="tag"
              class="tag-enhanced"
              :class="item.theme"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 雷达图 -->
    <div class="radar-section" v-if="showRadar">
      <h4 class="section-title">技能雷达图</h4>
      <div class="radar-chart">
        <svg viewBox="0 0 300 300">
          <!-- 网格 -->
          <g class="radar-grid">
            <circle v-for="i in 5" :key="i" 
              :r="i * 24" 
              cx="150" 
              cy="150" 
              class="radar-grid"
            />
          </g>
          
          <!-- 轴线 -->
          <g class="radar-axes">
            <line 
              v-for="(item, index) in progressData" 
              :key="index"
              x1="150" 
              y1="150"
              :x2="getRadarPoint(index, 120).x"
              :y2="getRadarPoint(index, 120).y"
              class="radar-axis"
            />
          </g>
          
          <!-- 数据区域 -->
          <polygon 
            :points="radarPoints"
            class="radar-area"
            :class="currentTheme"
          />
          
          <!-- 数据点 -->
          <circle 
            v-for="(point, index) in radarPointsArray" 
            :key="index"
            :cx="point.x"
            :cy="point.y"
            class="radar-point"
            :class="progressData[index].theme"
          />
          
          <!-- 标签 -->
          <text 
            v-for="(item, index) in progressData" 
            :key="index"
            :x="getRadarPoint(index, 140).x"
            :y="getRadarPoint(index, 140).y"
            class="radar-label"
            text-anchor="middle"
          >
            {{ item.name }}
          </text>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { TrendCharts } from '@element-plus/icons-vue'

const props = defineProps({
  title: {
    type: String,
    default: '技能评估报告'
  },
  subtitle: {
    type: String,
    default: '基于iFlytek星火大模型的多维度能力分析'
  },
  data: {
    type: Array,
    default: () => []
  },
  showRadar: {
    type: Boolean,
    default: true
  },
  theme: {
    type: String,
    default: 'interview'
  }
})

// 默认数据
const defaultData = [
  {
    name: 'AI技术',
    value: 85,
    description: '人工智能核心技术掌握',
    theme: 'ai',
    tags: ['机器学习', '深度学习', 'NLP']
  },
  {
    name: '大数据',
    value: 78,
    description: '大数据处理与分析能力',
    theme: 'data',
    tags: ['Spark', 'Hadoop', '实时计算']
  },
  {
    name: 'IoT物联网',
    value: 72,
    description: '物联网系统设计与开发',
    theme: 'iot',
    tags: ['传感器', '通信协议', '边缘计算']
  },
  {
    name: '系统架构',
    value: 90,
    description: '系统设计与架构能力',
    theme: 'interview',
    tags: ['微服务', '分布式', '高并发']
  }
]

const progressData = computed(() => props.data.length > 0 ? props.data : defaultData)
const currentTheme = ref(props.theme)

// 圆形进度条计算
const circumference = 2 * Math.PI * 54

const getStrokeDashoffset = (value) => {
  return circumference - (value / 100) * circumference
}

// 获取图表主题类
const getChartThemeClass = () => {
  const themeMap = {
    'ai': 'chart-ai-theme',
    'data': 'chart-bigdata-theme',
    'iot': 'chart-iot-theme',
    'interview': 'chart-interview-theme'
  }
  return themeMap[currentTheme.value] || 'chart-interview-theme'
}

// 雷达图计算
const getRadarPoint = (index, radius) => {
  const angle = (index * 2 * Math.PI) / progressData.value.length - Math.PI / 2
  return {
    x: 150 + radius * Math.cos(angle),
    y: 150 + radius * Math.sin(angle)
  }
}

const radarPointsArray = computed(() => {
  return progressData.value.map((item, index) => {
    const radius = (item.value / 100) * 120
    return getRadarPoint(index, radius)
  })
})

const radarPoints = computed(() => {
  return radarPointsArray.value.map(point => `${point.x},${point.y}`).join(' ')
})

onMounted(() => {
  // 动画初始化
  console.log('Enhanced Progress Chart mounted')
})
</script>

<style scoped>
.enhanced-progress-chart {
  padding: var(--spacing-lg);
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.progress-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-lg);
  margin: var(--spacing-xl) 0;
}

.progress-item {
  display: flex;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: var(--module-light, var(--bg-secondary));
  border-radius: var(--radius-lg);
  border: 1px solid var(--module-border, var(--border-light));
  transition: all var(--duration-normal) var(--ease-out);
}

.progress-item:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.skill-details {
  flex: 1;
}

.skill-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--module-text, var(--text-primary));
  margin-bottom: var(--spacing-xs);
}

.skill-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-md);
}

.radar-section {
  margin-top: var(--spacing-2xl);
  text-align: center;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .progress-grid {
    grid-template-columns: 1fr;
  }
  
  .progress-item {
    flex-direction: column;
    text-align: center;
  }
  
  .radar-chart {
    width: 250px;
    height: 250px;
    margin: 0 auto;
  }
}
</style>
