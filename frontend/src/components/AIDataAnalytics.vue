<template>
  <div class="ai-data-analytics">
    <!-- 数据分析控制台 -->
    <div class="analytics-console">
      <div class="console-header">
        <h3>iFlytek Spark AI数据分析中心</h3>
        <div class="analysis-controls">
          <el-select v-model="selectedTimeRange" placeholder="选择时间范围" size="large">
            <el-option label="最近7天" value="7d" />
            <el-option label="最近30天" value="30d" />
            <el-option label="最近90天" value="90d" />
            <el-option label="自定义" value="custom" />
          </el-select>
          <el-button type="primary" @click="generateReport">
            <el-icon><Document /></el-icon>
            生成报告
          </el-button>
        </div>
      </div>

      <!-- 核心指标概览 -->
      <div class="metrics-overview">
        <div class="metric-card" v-for="metric in coreMetrics" :key="metric.name">
          <div class="metric-icon" :style="{ backgroundColor: metric.color }">
            <el-icon>
              <component :is="metric.icon" />
            </el-icon>
          </div>
          <div class="metric-content">
            <div class="metric-value">{{ metric.value }}</div>
            <div class="metric-label">{{ metric.name }}</div>
            <div class="metric-trend" :class="{ positive: metric.trend > 0, negative: metric.trend < 0 }">
              <el-icon>
                <component :is="metric.trend > 0 ? 'ArrowUp' : 'ArrowDown'" />
              </el-icon>
              {{ Math.abs(metric.trend) }}%
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 面试质量分析 -->
    <div class="interview-quality-analysis">
      <div class="analysis-header">
        <h4>面试质量深度分析</h4>
        <div class="quality-filter">
          <el-radio-group v-model="qualityFilter" size="small">
            <el-radio-button value="all">全部</el-radio-button>
            <el-radio-button value="excellent">优秀</el-radio-button>
            <el-radio-button value="good">良好</el-radio-button>
            <el-radio-button value="average">一般</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <div class="quality-charts">
        <!-- 质量分布饼图 -->
        <div class="chart-container quality-distribution">
          <div class="chart-header">
            <h5>面试质量分布</h5>
            <div class="chart-legend">
              <div class="legend-item" v-for="item in qualityDistribution" :key="item.name">
                <span class="legend-color" :style="{ backgroundColor: item.color }"></span>
                <span class="legend-text">{{ item.name }} ({{ item.percentage }}%)</span>
              </div>
            </div>
          </div>
          <div class="pie-chart">
            <div class="pie-center">
              <span class="center-value">{{ totalInterviews }}</span>
              <small>总面试数</small>
            </div>
            <svg class="pie-svg" viewBox="0 0 200 200">
              <circle
                v-for="(segment, index) in pieSegments"
                :key="index"
                cx="100"
                cy="100"
                r="80"
                :stroke="segment.color"
                :stroke-width="20"
                :stroke-dasharray="segment.dashArray"
                :stroke-dashoffset="segment.dashOffset"
                fill="none"
                :transform="segment.transform"
              />
            </svg>
          </div>
        </div>

        <!-- 技能评估雷达图 -->
        <div class="chart-container skill-radar">
          <div class="chart-header">
            <h5>技能评估雷达图</h5>
            <div class="radar-controls">
              <el-switch v-model="showComparison" active-text="对比模式" />
            </div>
          </div>
          <div class="radar-chart">
            <svg class="radar-svg" viewBox="0 0 300 300">
              <!-- 雷达网格 -->
              <g class="radar-grid">
                <circle v-for="i in 5" :key="i" 
                        cx="150" cy="150" 
                        :r="i * 25" 
                        stroke="#e9ecef" 
                        stroke-width="1" 
                        fill="none" />
                <g v-for="(axis, index) in radarAxes" :key="axis.name">
                  <line x1="150" y1="150" 
                        :x2="axis.x" :y2="axis.y" 
                        stroke="#e9ecef" 
                        stroke-width="1" />
                  <text :x="axis.labelX" :y="axis.labelY" 
                        text-anchor="middle" 
                        class="axis-label">
                    {{ axis.name }}
                  </text>
                </g>
              </g>
              <!-- 数据多边形 -->
              <polygon :points="radarPolygon" 
                       fill="rgba(33, 111, 255, 0.3)" 
                       stroke="var(--iflytek-primary)" 
                       stroke-width="2" />
              <g v-for="(point, index) in radarPoints" :key="index">
                <circle :cx="point.x" :cy="point.y" r="4" 
                        fill="var(--iflytek-primary)" />
              </g>
            </svg>
          </div>
        </div>

        <!-- 趋势分析图 -->
        <div class="chart-container trend-analysis">
          <div class="chart-header">
            <h5>面试表现趋势</h5>
            <div class="trend-metrics">
              <span class="trend-metric">
                平均分: <strong>{{ averageScore }}</strong>
              </span>
              <span class="trend-metric">
                改进率: <strong>{{ improvementRate }}%</strong>
              </span>
            </div>
          </div>
          <div class="line-chart">
            <svg class="trend-svg" viewBox="0 0 400 200">
              <!-- 网格线 -->
              <g class="grid-lines">
                <line v-for="i in 5" :key="'h' + i" 
                      x1="40" :y1="i * 32 + 20" 
                      x2="380" :y2="i * 32 + 20" 
                      stroke="#f0f0f0" stroke-width="1" />
                <line v-for="i in 7" :key="'v' + i" 
                      :x1="i * 50 + 40" y1="20" 
                      :x2="i * 50 + 40" y2="180" 
                      stroke="#f0f0f0" stroke-width="1" />
              </g>
              <!-- 趋势线 -->
              <polyline :points="trendLine" 
                        fill="none" 
                        stroke="var(--iflytek-primary)" 
                        stroke-width="3" />
              <!-- 数据点 -->
              <g v-for="(point, index) in trendPoints" :key="index">
                <circle :cx="point.x" :cy="point.y" r="5" 
                        fill="var(--iflytek-primary)" />
                <text :x="point.x" :y="point.y - 10" 
                      text-anchor="middle" 
                      class="point-label">
                  {{ point.value }}
                </text>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- 候选人洞察分析 -->
    <div class="candidate-insights">
      <div class="insights-header">
        <h4>候选人深度洞察</h4>
        <div class="insight-tabs">
          <el-tabs v-model="activeInsightTab" type="card">
            <el-tab-pane label="能力分析" name="abilities" />
            <el-tab-pane label="行为特征" name="behavior" />
            <el-tab-pane label="匹配度评估" name="matching" />
          </el-tabs>
        </div>
      </div>

      <div class="insights-content">
        <!-- 能力分析 -->
        <div v-if="activeInsightTab === 'abilities'" class="ability-analysis">
          <div class="ability-matrix">
            <div class="matrix-header">
              <h5>技能能力矩阵</h5>
              <div class="matrix-legend">
                <span class="legend-item">
                  <span class="legend-dot high"></span>高水平 (80-100)
                </span>
                <span class="legend-item">
                  <span class="legend-dot medium"></span>中等 (60-79)
                </span>
                <span class="legend-item">
                  <span class="legend-dot low"></span>待提升 (0-59)
                </span>
              </div>
            </div>
            <div class="matrix-grid">
              <div class="matrix-row" v-for="skill in skillMatrix" :key="skill.name">
                <div class="skill-name">{{ skill.name }}</div>
                <div class="skill-levels">
                  <div 
                    v-for="level in skill.levels" 
                    :key="level.name"
                    class="level-cell"
                    :class="level.class"
                    :title="`${level.name}: ${level.count}人`"
                  >
                    {{ level.count }}
                  </div>
                </div>
                <div class="skill-average">{{ skill.average }}</div>
              </div>
            </div>
          </div>

          <div class="ability-recommendations">
            <h5>AI智能建议</h5>
            <div class="recommendation-list">
              <div class="recommendation-item" v-for="rec in abilityRecommendations" :key="rec.id">
                <div class="rec-priority" :class="rec.priority">{{ rec.priorityText }}</div>
                <div class="rec-content">
                  <h6>{{ rec.title }}</h6>
                  <p>{{ rec.description }}</p>
                </div>
                <div class="rec-impact">
                  <span class="impact-label">预期提升</span>
                  <span class="impact-value">{{ rec.expectedImprovement }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 行为特征分析 -->
        <div v-if="activeInsightTab === 'behavior'" class="behavior-analysis">
          <div class="behavior-patterns">
            <h5>行为模式识别</h5>
            <div class="pattern-grid">
              <div class="pattern-card" v-for="pattern in behaviorPatterns" :key="pattern.name">
                <div class="pattern-icon" :style="{ backgroundColor: pattern.color }">
                  {{ pattern.icon }}
                </div>
                <div class="pattern-info">
                  <h6>{{ pattern.name }}</h6>
                  <div class="pattern-percentage">{{ pattern.percentage }}%</div>
                  <div class="pattern-description">{{ pattern.description }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="interaction-heatmap">
            <h5>交互热力图</h5>
            <div class="heatmap-container">
              <div class="heatmap-grid">
                <div 
                  v-for="(cell, index) in interactionHeatmap" 
                  :key="index"
                  class="heatmap-cell"
                  :style="{ backgroundColor: getHeatmapColor(cell.intensity) }"
                  :title="`时间段 ${cell.time}: ${cell.intensity}% 活跃度`"
                ></div>
              </div>
              <div class="heatmap-labels">
                <div class="time-labels">
                  <span v-for="time in timeLabels" :key="time">{{ time }}</span>
                </div>
                <div class="day-labels">
                  <span v-for="day in dayLabels" :key="day">{{ day }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 匹配度评估 -->
        <div v-if="activeInsightTab === 'matching'" class="matching-analysis">
          <div class="matching-overview">
            <h5>岗位匹配度分析</h5>
            <div class="matching-stats">
              <div class="stat-item">
                <div class="stat-value">{{ matchingStats.highMatch }}</div>
                <div class="stat-label">高匹配度</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ matchingStats.mediumMatch }}</div>
                <div class="stat-label">中等匹配</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ matchingStats.lowMatch }}</div>
                <div class="stat-label">低匹配度</div>
              </div>
            </div>
          </div>

          <div class="matching-factors">
            <h5>关键匹配因素</h5>
            <div class="factors-list">
              <div class="factor-item" v-for="factor in matchingFactors" :key="factor.name">
                <div class="factor-name">{{ factor.name }}</div>
                <div class="factor-weight">权重: {{ factor.weight }}%</div>
                <div class="factor-bar">
                  <div class="factor-fill" :style="{ 
                    width: factor.score + '%', 
                    backgroundColor: getFactorColor(factor.score) 
                  }"></div>
                </div>
                <div class="factor-score">{{ factor.score }}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 智能报告生成 -->
    <div class="intelligent-report-generation">
      <div class="report-header">
        <h4>智能报告生成</h4>
        <div class="report-actions">
          <el-button @click="previewReport">预览报告</el-button>
          <el-button type="primary" @click="exportReport">
            <el-icon><Download /></el-icon>
            导出报告
          </el-button>
        </div>
      </div>

      <div class="report-templates">
        <div class="template-item" v-for="template in reportTemplates" :key="template.id">
          <div class="template-preview">
            <div class="preview-image" :style="{ backgroundColor: template.color }">
              <el-icon>
                <component :is="template.icon" />
              </el-icon>
            </div>
          </div>
          <div class="template-info">
            <h6>{{ template.name }}</h6>
            <p>{{ template.description }}</p>
            <div class="template-features">
              <el-tag v-for="feature in template.features" :key="feature" size="small">
                {{ feature }}
              </el-tag>
            </div>
          </div>
          <div class="template-actions">
            <el-button size="small" @click="selectTemplate(template)">选择模板</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import {
  Document, ArrowUp, ArrowDown, Download, TrendCharts,
  User, DataBoard, PieChart, Medal
} from '@element-plus/icons-vue'

// 基础数据
const selectedTimeRange = ref('30d')
const qualityFilter = ref('all')
const activeInsightTab = ref('abilities')
const showComparison = ref(false)

// 核心指标数据
const coreMetrics = reactive([
  {
    name: '总面试数量',
    value: '2,847',
    trend: 12.5,
    color: '#3498db',
    icon: 'User'
  },
  {
    name: '平均面试质量',
    value: '87.3',
    trend: 8.2,
    color: '#2ecc71',
    icon: 'TrendCharts'
  },
  {
    name: '候选人满意度',
    value: '94.6%',
    trend: 5.7,
    color: '#f39c12',
    icon: 'Medal'
  },
  {
    name: '面试效率',
    value: '76.8%',
    trend: -2.1,
    color: '#e74c3c',
    icon: 'DataBoard'
  }
])

// 质量分布数据
const qualityDistribution = reactive([
  { name: '优秀', percentage: 35, color: '#2ecc71' },
  { name: '良好', percentage: 42, color: '#f39c12' },
  { name: '一般', percentage: 18, color: '#e67e22' },
  { name: '待改进', percentage: 5, color: '#e74c3c' }
])

const totalInterviews = computed(() => {
  return qualityDistribution.reduce((sum, item) => sum + item.percentage, 0) * 28 // 假设基数
})

// 饼图分段计算
const pieSegments = computed(() => {
  let cumulativePercentage = 0
  const circumference = 2 * Math.PI * 80 // r=80

  return qualityDistribution.map(item => {
    const percentage = item.percentage / 100
    const dashArray = `${percentage * circumference} ${circumference}`
    const dashOffset = -cumulativePercentage * circumference
    const rotation = cumulativePercentage * 360

    cumulativePercentage += percentage

    return {
      color: item.color,
      dashArray,
      dashOffset,
      transform: `rotate(${rotation} 100 100)`
    }
  })
})

// 雷达图数据
const radarAxes = reactive([
  { name: '技术能力', angle: 0, x: 275, y: 150, labelX: 285, labelY: 155 },
  { name: '沟通表达', angle: 60, x: 212.5, y: 66.5, labelX: 220, labelY: 55 },
  { name: '逻辑思维', angle: 120, x: 87.5, y: 66.5, labelX: 80, labelY: 55 },
  { name: '学习能力', angle: 180, x: 25, y: 150, labelX: 15, labelY: 155 },
  { name: '团队协作', angle: 240, x: 87.5, y: 233.5, labelX: 80, labelY: 245 },
  { name: '创新思维', angle: 300, x: 212.5, y: 233.5, labelX: 220, labelY: 245 }
])

const radarData = reactive([85, 78, 92, 88, 76, 82])

const radarPoints = computed(() => {
  return radarAxes.map((axis, index) => {
    const value = radarData[index]
    const radius = (value / 100) * 125 // 最大半径125
    const angle = (axis.angle - 90) * (Math.PI / 180) // 转换为弧度，-90度使第一个点在顶部

    return {
      x: 150 + radius * Math.cos(angle),
      y: 150 + radius * Math.sin(angle)
    }
  })
})

const radarPolygon = computed(() => {
  return radarPoints.value.map(point => `${point.x},${point.y}`).join(' ')
})

// 趋势分析数据
const trendData = reactive([72, 75, 78, 82, 85, 87, 89])
const averageScore = computed(() => {
  return (trendData.reduce((sum, val) => sum + val, 0) / trendData.length).toFixed(1)
})
const improvementRate = computed(() => {
  const first = trendData[0]
  const last = trendData[trendData.length - 1]
  return ((last - first) / first * 100).toFixed(1)
})

const trendPoints = computed(() => {
  return trendData.map((value, index) => ({
    x: index * 50 + 65,
    y: 180 - (value - 60) * 3, // 缩放到图表高度
    value
  }))
})

const trendLine = computed(() => {
  return trendPoints.value.map(point => `${point.x},${point.y}`).join(' ')
})

// 技能矩阵数据
const skillMatrix = reactive([
  {
    name: 'JavaScript',
    levels: [
      { name: '高水平', count: 45, class: 'high' },
      { name: '中等', count: 32, class: 'medium' },
      { name: '待提升', count: 8, class: 'low' }
    ],
    average: 82
  },
  {
    name: 'Vue.js',
    levels: [
      { name: '高水平', count: 38, class: 'high' },
      { name: '中等', count: 28, class: 'medium' },
      { name: '待提升', count: 12, class: 'low' }
    ],
    average: 78
  },
  {
    name: '系统设计',
    levels: [
      { name: '高水平', count: 25, class: 'high' },
      { name: '中等', count: 35, class: 'medium' },
      { name: '待提升', count: 18, class: 'low' }
    ],
    average: 71
  },
  {
    name: '算法思维',
    levels: [
      { name: '高水平', count: 42, class: 'high' },
      { name: '中等', count: 30, class: 'medium' },
      { name: '待提升', count: 6, class: 'low' }
    ],
    average: 85
  }
])

// AI建议数据
const abilityRecommendations = reactive([
  {
    id: 1,
    priority: 'high',
    priorityText: '高优先级',
    title: '加强系统设计能力培训',
    description: '系统设计是当前候选人普遍薄弱的环节，建议增加相关培训内容',
    expectedImprovement: 15
  },
  {
    id: 2,
    priority: 'medium',
    priorityText: '中优先级',
    title: '优化Vue.js技术面试题',
    description: '当前Vue.js相关题目难度分布不均，建议调整题目梯度',
    expectedImprovement: 8
  },
  {
    id: 3,
    priority: 'low',
    priorityText: '低优先级',
    title: '增加实战项目评估',
    description: '理论知识掌握较好，但实际项目经验评估可以加强',
    expectedImprovement: 12
  }
])

// 行为模式数据
const behaviorPatterns = reactive([
  {
    name: '积极主动型',
    percentage: 42,
    icon: '🚀',
    color: '#2ecc71',
    description: '主动提问，表达积极'
  },
  {
    name: '稳重思考型',
    percentage: 35,
    icon: '🤔',
    color: '#3498db',
    description: '深思熟虑，回答谨慎'
  },
  {
    name: '紧张焦虑型',
    percentage: 18,
    icon: '😰',
    color: '#f39c12',
    description: '表现紧张，需要引导'
  },
  {
    name: '过度自信型',
    percentage: 5,
    icon: '😎',
    color: '#e74c3c',
    description: '过于自信，可能夸大'
  }
])

// 交互热力图数据
const interactionHeatmap = reactive(
  Array.from({ length: 168 }, (_, i) => ({
    time: `${Math.floor(i / 7)}:00`,
    intensity: Math.random() * 100
  }))
)

const timeLabels = ['00', '04', '08', '12', '16', '20']
const dayLabels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

// 匹配度数据
const matchingStats = reactive({
  highMatch: 156,
  mediumMatch: 89,
  lowMatch: 23
})

const matchingFactors = reactive([
  { name: '技术技能匹配', weight: 35, score: 87 },
  { name: '工作经验匹配', weight: 25, score: 78 },
  { name: '教育背景匹配', weight: 15, score: 92 },
  { name: '软技能匹配', weight: 15, score: 83 },
  { name: '文化适应性', weight: 10, score: 76 }
])

// 报告模板数据
const reportTemplates = reactive([
  {
    id: 1,
    name: '综合评估报告',
    description: '包含完整的面试数据分析和候选人评估',
    features: ['数据统计', '趋势分析', '建议推荐'],
    color: '#3498db',
    icon: 'Document'
  },
  {
    id: 2,
    name: '技能分析报告',
    description: '专注于技术技能和能力评估的详细报告',
    features: ['技能矩阵', '能力雷达', '提升建议'],
    color: '#2ecc71',
    icon: 'TrendCharts'
  },
  {
    id: 3,
    name: '行为洞察报告',
    description: '深度分析候选人行为模式和特征',
    features: ['行为分析', '模式识别', '个性评估'],
    color: '#f39c12',
    icon: 'User'
  }
])

// 方法定义
const generateReport = () => {
  console.log('生成报告，时间范围:', selectedTimeRange.value)
}

const getHeatmapColor = (intensity) => {
  const alpha = intensity / 100
  return `rgba(33, 111, 255, ${alpha})`
}

const getFactorColor = (score) => {
  if (score >= 85) return '#2ecc71'
  if (score >= 70) return '#f39c12'
  return '#e74c3c'
}

const previewReport = () => {
  // 显示报告预览对话框
  ElMessage.info('正在生成报告预览...')

  // TODO: 实现报告预览功能
  setTimeout(() => {
    ElMessage.success('报告预览已生成')
  }, 1000)
}

const exportReport = () => {
  // 显示导出进度
  ElMessage.info('正在导出报告...')

  // TODO: 实现报告导出功能
  setTimeout(() => {
    ElMessage.success('报告导出成功')
  }, 1500)
}

const selectTemplate = (template) => {
  console.log('选择模板:', template.name)
}

onMounted(() => {
  console.log('AI数据分析组件已加载')
})
</script>

<style scoped>
.ai-data-analytics {
  padding: 24px;
  background: #f8f9fa;
  min-height: 100vh;
}

/* 数据分析控制台样式 */
.analytics-console {
  background: white;
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.analytics-console::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #1890ff 0%, #667eea 50%, #764ba2 100%);
}

.console-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f2f5;
  gap: 20px;
}

.console-header h3 {
  font-size: 24px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
  line-height: 1.3;
}

.analysis-controls {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-shrink: 0;
}

/* 核心指标概览样式 */
.metrics-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 8px;
}

.metric-card {
  background: white;
  border: 1px solid #f1f5f9;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(135deg, #1890ff 0%, #0066cc 100%);
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  border-color: #1890ff;
}

.metric-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.metric-content {
  flex: 1;
}

.metric-value {
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 4px;
}

.metric-label {
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 8px;
}

.metric-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
}

.metric-trend.positive {
  color: #2ecc71;
}

.metric-trend.negative {
  color: #e74c3c;
}

/* 面试质量分析样式 */
.interview-quality-analysis {
  background: white;
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.analysis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.analysis-header h4 {
  font-size: 20px;
  color: #2c3e50;
  margin: 0;
}

.quality-charts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 32px;
}

.chart-container {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 24px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.chart-header h5 {
  font-size: 16px;
  color: #2c3e50;
  margin: 0;
}

/* 饼图样式 */
.quality-distribution {
  text-align: center;
}

.chart-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.pie-chart {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto;
}

.pie-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.center-value {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: var(--iflytek-primary);
  margin-bottom: 4px;
}

.pie-center small {
  font-size: 12px;
  color: #7f8c8d;
}

.pie-svg {
  width: 100%;
  height: 100%;
}

/* 雷达图样式 */
.radar-chart {
  text-align: center;
}

.radar-svg {
  width: 300px;
  height: 300px;
}

.axis-label {
  font-size: 12px;
  fill: #2c3e50;
  font-weight: 600;
}

/* 趋势图样式 */
.trend-analysis {
  text-align: center;
}

.trend-metrics {
  display: flex;
  gap: 24px;
}

.trend-metric {
  font-size: 14px;
  color: #7f8c8d;
}

.trend-metric strong {
  color: var(--iflytek-primary);
}

.trend-svg {
  width: 100%;
  height: 200px;
}

.point-label {
  font-size: 10px;
  fill: #2c3e50;
  font-weight: 600;
}

/* 候选人洞察分析样式 */
.candidate-insights {
  background: white;
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.insights-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.insights-header h4 {
  font-size: 20px;
  color: #2c3e50;
  margin: 0;
}

/* 技能矩阵样式 */
.ability-matrix {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
}

.matrix-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.matrix-header h5 {
  font-size: 16px;
  color: #2c3e50;
  margin: 0;
}

.matrix-legend {
  display: flex;
  gap: 16px;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 4px;
}

.legend-dot.high { background: #2ecc71; }
.legend-dot.medium { background: #f39c12; }
.legend-dot.low { background: #e74c3c; }

.matrix-grid {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.matrix-row {
  display: grid;
  grid-template-columns: 120px 1fr 60px;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e9ecef;
}

.matrix-row:last-child {
  border-bottom: none;
}

.skill-name {
  font-weight: 600;
  color: #2c3e50;
}

.skill-levels {
  display: flex;
  gap: 8px;
}

.level-cell {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  min-width: 24px;
  text-align: center;
}

.level-cell.high { background: #2ecc71; }
.level-cell.medium { background: #f39c12; }
.level-cell.low { background: #e74c3c; }

.skill-average {
  font-weight: 700;
  color: var(--iflytek-primary);
  text-align: center;
}

/* AI建议样式 */
.ability-recommendations {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 24px;
}

.ability-recommendations h5 {
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 20px;
}

.recommendation-list {
  space-y: 16px;
}

.recommendation-item {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.rec-priority {
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  min-width: 80px;
  text-align: center;
}

.rec-priority.high { background: #e74c3c; }
.rec-priority.medium { background: #f39c12; }
.rec-priority.low { background: #2ecc71; }

.rec-content {
  flex: 1;
}

.rec-content h6 {
  font-size: 14px;
  color: #2c3e50;
  margin-bottom: 4px;
}

.rec-content p {
  font-size: 12px;
  color: #7f8c8d;
  line-height: 1.4;
  margin: 0;
}

.rec-impact {
  text-align: center;
}

.impact-label {
  display: block;
  font-size: 10px;
  color: #7f8c8d;
  margin-bottom: 4px;
}

.impact-value {
  font-size: 16px;
  font-weight: 700;
  color: var(--iflytek-primary);
}

/* 行为模式样式 */
.behavior-patterns {
  margin-bottom: 32px;
}

.behavior-patterns h5 {
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 20px;
}

.pattern-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.pattern-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.pattern-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.pattern-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin: 0 auto 12px;
}

.pattern-info h6 {
  font-size: 14px;
  color: #2c3e50;
  margin-bottom: 8px;
}

.pattern-percentage {
  font-size: 20px;
  font-weight: 700;
  color: var(--iflytek-primary);
  margin-bottom: 8px;
}

.pattern-description {
  font-size: 12px;
  color: #7f8c8d;
  line-height: 1.4;
}

/* 交互热力图样式 */
.interaction-heatmap h5 {
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 20px;
}

.heatmap-container {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.heatmap-grid {
  display: grid;
  grid-template-columns: repeat(24, 1fr);
  gap: 2px;
  margin-bottom: 16px;
}

.heatmap-cell {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.heatmap-cell:hover {
  transform: scale(1.2);
}

.heatmap-labels {
  display: flex;
  justify-content: space-between;
}

.time-labels,
.day-labels {
  display: flex;
  gap: 8px;
}

.time-labels span,
.day-labels span {
  font-size: 10px;
  color: #7f8c8d;
}

/* 匹配度分析样式 */
.matching-overview {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
}

.matching-overview h5 {
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 20px;
}

.matching-stats {
  display: flex;
  justify-content: space-around;
  text-align: center;
}

.stat-item {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--iflytek-primary);
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #7f8c8d;
}

.matching-factors h5 {
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 20px;
}

.factors-list {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.factor-item {
  display: grid;
  grid-template-columns: 150px 80px 1fr 60px;
  align-items: center;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #e9ecef;
}

.factor-item:last-child {
  border-bottom: none;
}

.factor-name {
  font-weight: 600;
  color: #2c3e50;
}

.factor-weight {
  font-size: 12px;
  color: #7f8c8d;
}

.factor-bar {
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.factor-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.factor-score {
  font-weight: 700;
  color: var(--iflytek-primary);
  text-align: center;
}

/* 智能报告生成样式 */
.intelligent-report-generation {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.report-header h4 {
  font-size: 20px;
  color: #2c3e50;
  margin: 0;
}

.report-actions {
  display: flex;
  gap: 12px;
}

.report-templates {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.template-item {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: all 0.3s ease;
}

.template-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.template-preview {
  text-align: center;
}

.preview-image {
  width: 80px;
  height: 80px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  color: white;
  font-size: 32px;
}

.template-info h6 {
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 8px;
}

.template-info p {
  font-size: 14px;
  color: #7f8c8d;
  line-height: 1.5;
  margin-bottom: 12px;
}

.template-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.template-actions {
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .ai-data-analytics {
    padding: 16px;
  }

  .analytics-console,
  .interview-quality-analysis,
  .candidate-insights,
  .intelligent-report-generation {
    padding: 20px;
  }

  .console-header,
  .analysis-header,
  .insights-header,
  .report-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
    text-align: left;
  }

  .analysis-controls {
    width: 100%;
    justify-content: flex-start;
  }

  .metrics-overview {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .metric-card {
    padding: 20px;
    gap: 16px;
  }

  .metric-icon {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }

  .metric-value {
    font-size: 24px;
  }

  .quality-charts {
    grid-template-columns: 1fr;
  }

  .pattern-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }

  .matching-stats {
    flex-direction: column;
    gap: 16px;
  }

  .report-templates {
    grid-template-columns: 1fr;
  }

  .factor-item {
    grid-template-columns: 1fr;
    gap: 8px;
    text-align: center;
  }

  .matrix-row {
    grid-template-columns: 1fr;
    gap: 8px;
    text-align: center;
  }
}
</style>
