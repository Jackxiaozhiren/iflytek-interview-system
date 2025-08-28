<template>
  <div class="skill-radar-chart chart-container enhanced-chart radar-chart" :class="getChartThemeClass()">
    <div class="chart-header">
      <h3 class="chart-title">
        <div class="chart-icon">
          <el-icon><TrendCharts /></el-icon>
        </div>
        {{ title }}
      </h3>
      <p class="chart-subtitle">{{ subtitle }}</p>
      <div class="chart-actions">
        <el-button-group>
          <el-button 
            v-for="preset in presets" 
            :key="preset.name"
            @click="loadPreset(preset)"
            size="small"
            :type="currentPreset === preset.name ? 'primary' : 'default'"
            class="btn-enhanced"
            :class="preset.theme"
          >
            {{ preset.name }}
          </el-button>
        </el-button-group>
      </div>
    </div>
    
    <div class="radar-container">
      <div class="radar-chart">
        <svg viewBox="0 0 400 400" class="radar-svg">
          <!-- 背景网格 -->
          <g class="radar-background">
            <!-- 同心圆 -->
            <circle v-for="i in 5" :key="`circle-${i}`"
              :r="i * 30" 
              cx="200" 
              cy="200" 
              class="radar-grid"
            />
            
            <!-- 轴线 -->
            <g class="radar-axes">
              <line 
                v-for="(skill, index) in skills" 
                :key="`axis-${index}`"
                x1="200" 
                y1="200"
                :x2="getAxisPoint(index, 150).x"
                :y2="getAxisPoint(index, 150).y"
                class="radar-axis"
              />
            </g>
            
            <!-- 分值标签 -->
            <g class="score-labels">
              <text v-for="i in 5" :key="`score-${i}`"
                x="205"
                :y="200 - i * 30 + 5"
                class="score-label"
              >
                {{ i * 20 }}
              </text>
            </g>
          </g>
          
          <!-- 数据区域 -->
          <g class="radar-data">
            <!-- 填充区域 -->
            <polygon 
              :points="radarPolygonPoints"
              class="radar-area"
              :class="currentTheme"
              v-motion-fade-visible
            />
            
            <!-- 数据点 -->
            <g class="radar-points">
              <circle 
                v-for="(point, index) in radarPoints" 
                :key="`point-${index}`"
                :cx="point.x"
                :cy="point.y"
                class="radar-point"
                :class="skills[index].theme"
                v-tooltip="getPointTooltip(skills[index])"
                v-motion-pop-visible
                :delay="index * 100"
              />
            </g>
          </g>
          
          <!-- 技能标签 -->
          <g class="skill-labels">
            <g v-for="(skill, index) in skills" :key="`label-${index}`">
              <circle 
                :cx="getLabelPoint(index, 170).x"
                :cy="getLabelPoint(index, 170).y"
                r="20"
                class="label-background"
                :class="skill.theme"
              />
              <text 
                :x="getLabelPoint(index, 170).x"
                :y="getLabelPoint(index, 170).y + 5"
                class="radar-label"
                text-anchor="middle"
              >
                {{ skill.shortName || skill.name }}
              </text>
            </g>
          </g>
        </svg>
      </div>
      
      <!-- 技能详情面板 -->
      <div class="skills-panel">
        <div 
          v-for="(skill, index) in skills" 
          :key="skill.name"
          class="skill-item enhanced-card"
          :class="skill.theme"
          v-motion-slide-visible-once-right
          :delay="index * 50"
        >
          <div class="skill-header">
            <div class="skill-icon icon-enhanced icon-md" :class="skill.theme">
              <el-icon><component :is="skill.icon" /></el-icon>
            </div>
            <div class="skill-info">
              <div class="skill-name">{{ skill.name }}</div>
              <div class="skill-category">{{ skill.category }}</div>
            </div>
            <div class="skill-score">
              <div class="score-value">{{ skill.score }}</div>
              <div class="score-max">/100</div>
            </div>
          </div>
          
          <div class="skill-progress">
            <div class="progress-enhanced">
              <div 
                class="progress-bar"
                :class="skill.theme"
                :style="{ width: skill.score + '%' }"
              ></div>
            </div>
          </div>
          
          <div class="skill-description">{{ skill.description }}</div>
          
          <div class="skill-tags">
            <span 
              v-for="tag in skill.tags" 
              :key="tag"
              class="tag-enhanced"
              :class="skill.theme"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  Cpu, DataBoard, Connection, Star, TrendCharts, User
} from '@element-plus/icons-vue'

const props = defineProps({
  title: {
    type: String,
    default: '技能雷达分析'
  },
  subtitle: {
    type: String,
    default: '基于iFlytek星火大模型的综合能力评估'
  },
  data: {
    type: Array,
    default: () => []
  },
  theme: {
    type: String,
    default: 'interview'
  }
})

const currentTheme = ref(props.theme)
const currentPreset = ref('综合')

// 预设数据
const presets = ref([
  {
    name: '综合',
    theme: 'interview',
    data: [
      { name: 'AI技术', shortName: 'AI', score: 85, category: '人工智能', theme: 'ai', icon: Cpu, description: '机器学习、深度学习等AI核心技术', tags: ['机器学习', '深度学习', 'NLP'] },
      { name: '大数据', shortName: '数据', score: 78, category: '数据科学', theme: 'data', icon: DataBoard, description: '大数据处理、分析与挖掘能力', tags: ['Spark', 'Hadoop', '数据挖掘'] },
      { name: 'IoT物联网', shortName: 'IoT', score: 72, category: '物联网', theme: 'iot', icon: Connection, description: '物联网系统设计与开发', tags: ['传感器', '通信协议', '边缘计算'] },
      { name: '系统架构', shortName: '架构', score: 90, category: '系统设计', theme: 'interview', icon: Monitor, description: '分布式系统架构设计能力', tags: ['微服务', '分布式', '高并发'] },
      { name: '项目管理', shortName: '管理', score: 82, category: '管理能力', theme: 'interview', icon: User, description: '项目规划与团队协作能力', tags: ['敏捷开发', '团队协作', '风险控制'] },
      { name: '创新思维', shortName: '创新', score: 88, category: '软技能', theme: 'interview', icon: Star, description: '创新解决方案设计能力', tags: ['创新思维', '问题解决', '技术前瞻'] }
    ]
  },
  {
    name: 'AI专家',
    theme: 'ai',
    data: [
      { name: '机器学习', shortName: 'ML', score: 92, category: '核心技术', theme: 'ai', icon: Cpu, description: '机器学习算法与模型设计', tags: ['监督学习', '无监督学习', '强化学习'] },
      { name: '深度学习', shortName: 'DL', score: 88, category: '核心技术', theme: 'ai', icon: Cpu, description: '神经网络与深度学习框架', tags: ['CNN', 'RNN', 'Transformer'] },
      { name: '自然语言处理', shortName: 'NLP', score: 85, category: '应用领域', theme: 'ai', icon: Cpu, description: 'NLP技术与语言模型', tags: ['文本分析', '语义理解', '对话系统'] },
      { name: '计算机视觉', shortName: 'CV', score: 80, category: '应用领域', theme: 'ai', icon: Cpu, description: '图像识别与视觉分析', tags: ['图像识别', '目标检测', '图像生成'] },
      { name: '数据科学', shortName: '数据', score: 87, category: '支撑技术', theme: 'data', icon: DataBoard, description: '数据分析与统计建模', tags: ['统计分析', '数据可视化', '特征工程'] },
      { name: 'AI工程化', shortName: '工程', score: 83, category: '工程能力', theme: 'interview', icon: Monitor, description: 'AI系统部署与优化', tags: ['模型部署', '性能优化', 'MLOps'] }
    ]
  }
])

const skills = computed(() => {
  if (props.data.length > 0) return props.data
  const preset = presets.value.find(p => p.name === currentPreset.value)
  return preset ? preset.data : presets.value[0].data
})

// 雷达图计算
const getAxisPoint = (index, radius) => {
  const angle = (index * 2 * Math.PI) / skills.value.length - Math.PI / 2
  return {
    x: 200 + radius * Math.cos(angle),
    y: 200 + radius * Math.sin(angle)
  }
}

const getLabelPoint = (index, radius) => {
  return getAxisPoint(index, radius)
}

const radarPoints = computed(() => {
  return skills.value.map((skill, index) => {
    const radius = (skill.score / 100) * 150
    return getAxisPoint(index, radius)
  })
})

const radarPolygonPoints = computed(() => {
  return radarPoints.value.map(point => `${point.x},${point.y}`).join(' ')
})

// 方法
const loadPreset = (preset) => {
  currentPreset.value = preset.name
  currentTheme.value = preset.theme
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

const getPointTooltip = (skill) => {
  return `${skill.name}: ${skill.score}分`
}

onMounted(() => {
  console.log('Skill Radar Chart mounted')
})
</script>

<style scoped>
.skill-radar-chart {
  min-height: 600px;
}

.radar-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
  margin-top: var(--spacing-lg);
}

.radar-chart {
  display: flex;
  justify-content: center;
  align-items: center;
}

.radar-svg {
  width: 100%;
  max-width: 400px;
  height: 400px;
}

.label-background {
  fill: var(--module-light, var(--bg-secondary));
  stroke: var(--module-primary, var(--border-medium));
  stroke-width: 2;
}

.skills-panel {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  max-height: 600px;
  overflow-y: auto;
}

.skill-item {
  padding: var(--spacing-md);
}

.skill-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
}

.skill-info {
  flex: 1;
}

.skill-name {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.skill-category {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.skill-score {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.score-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--module-primary, var(--text-primary));
}

.score-max {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.skill-progress {
  margin: var(--spacing-sm) 0;
}

.skill-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
  line-height: 1.4;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.score-label {
  font-size: 10px;
  fill: var(--text-tertiary);
  font-family: 'Microsoft YaHei', sans-serif;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .radar-container {
    grid-template-columns: 1fr;
  }
  
  .skills-panel {
    max-height: none;
  }
}

@media (max-width: 768px) {
  .chart-actions {
    overflow-x: auto;
  }
  
  .radar-svg {
    max-width: 300px;
    height: 300px;
  }
}
</style>
