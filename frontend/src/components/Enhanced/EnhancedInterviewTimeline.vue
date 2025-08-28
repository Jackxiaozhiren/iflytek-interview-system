<template>
  <div class="enhanced-interview-timeline">
    <!-- 时间轴头部 -->
    <div class="timeline-header">
      <div class="header-left">
        <el-icon class="timeline-icon"><Clock /></el-icon>
        <h3 class="timeline-title">iFlytek星火智能面试时间轴</h3>
        <el-tag type="primary" size="small">实时分析</el-tag>
      </div>
      <div class="header-right">
        <el-button-group size="small">
          <el-button
            :type="viewMode === 'detailed' ? 'primary' : 'default'"
            @click="setViewMode('detailed')"
          >
            <el-icon><Document /></el-icon>
            详细视图
          </el-button>
          <el-button
            :type="viewMode === 'summary' ? 'primary' : 'default'"
            @click="setViewMode('summary')"
          >
            <el-icon><List /></el-icon>
            摘要视图
          </el-button>
        </el-button-group>
        <el-button type="info" size="small" @click="exportTimeline">
          <el-icon><Download /></el-icon>
          导出时间轴
        </el-button>
      </div>
    </div>

    <!-- 时间轴进度条 -->
    <div class="timeline-progress">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${interviewProgress}%` }"></div>
        <div class="progress-markers">
          <div 
            v-for="marker in progressMarkers" 
            :key="marker.time"
            class="progress-marker"
            :class="{ active: marker.passed }"
            :style="{ left: `${marker.position}%` }"
            :title="marker.description"
          >
            <div class="marker-dot"></div>
            <div class="marker-time">{{ marker.time }}</div>
          </div>
        </div>
      </div>
      <div class="progress-info">
        <span class="current-time">{{ currentTime }}</span>
        <span class="total-time">/ {{ totalTime }}</span>
        <span class="progress-percentage">{{ interviewProgress.toFixed(1) }}%</span>
      </div>
    </div>

    <!-- 时间轴内容 -->
    <div class="timeline-content" :class="{ 'detailed-mode': viewMode === 'detailed' }">
      <div 
        v-for="(event, index) in timelineEvents" 
        :key="event.id"
        class="timeline-event"
        :class="[event.type, { 'highlighted': event.highlighted }]"
        v-motion-slide-visible-once-right
        :delay="index * 100"
      >
        <!-- 时间标记 -->
        <div class="event-time">
          <div class="time-badge" :class="getTimeBadgeClass(event.type)">
            {{ event.time }}
          </div>
          <div class="time-duration" v-if="event.duration">
            {{ event.duration }}
          </div>
        </div>

        <!-- 事件内容 -->
        <div class="event-content">
          <div class="event-header">
            <div class="event-title-section">
              <el-icon class="event-icon" :class="getEventIconClass(event.type)">
                <component :is="event.icon" />
              </el-icon>
              <h4 class="event-title">{{ event.title }}</h4>
              <div class="event-tags">
                <el-tag 
                  v-for="tag in event.tags" 
                  :key="tag.name"
                  :type="tag.type" 
                  size="small"
                  class="event-tag"
                >
                  {{ tag.name }}
                </el-tag>
              </div>
            </div>
            <div class="event-score" v-if="event.score">
              <div class="score-value" :class="getScoreClass(event.score)">
                {{ event.score }}
              </div>
              <div class="score-label">评分</div>
            </div>
          </div>

          <div class="event-description">
            {{ event.description }}
          </div>

          <!-- 详细分析 (详细视图模式) -->
          <div v-if="viewMode === 'detailed' && event.analysis" class="event-analysis">
            <div class="analysis-section" v-for="analysis in event.analysis" :key="analysis.type">
              <div class="analysis-header">
                <el-icon><component :is="analysis.icon" /></el-icon>
                <span class="analysis-title">{{ analysis.title }}</span>
                <el-tag :type="analysis.level" size="small">{{ analysis.levelText }}</el-tag>
              </div>
              <div class="analysis-content">
                <div class="analysis-metrics">
                  <div 
                    v-for="metric in analysis.metrics" 
                    :key="metric.name"
                    class="metric-item"
                  >
                    <span class="metric-name">{{ metric.name }}</span>
                    <div class="metric-bar">
                      <div 
                        class="metric-fill" 
                        :style="{ 
                          width: `${metric.value}%`, 
                          backgroundColor: getMetricColor(metric.value) 
                        }"
                      ></div>
                    </div>
                    <span class="metric-value">{{ metric.value }}%</span>
                  </div>
                </div>
                <div class="analysis-insights" v-if="analysis.insights">
                  <div class="insights-title">关键洞察：</div>
                  <ul class="insights-list">
                    <li v-for="insight in analysis.insights" :key="insight">{{ insight }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- 多模态指标 -->
          <div class="event-modalities" v-if="event.modalities">
            <div class="modality-title">多模态分析：</div>
            <div class="modality-indicators">
              <div 
                v-for="modality in event.modalities" 
                :key="modality.type"
                class="modality-indicator"
                :class="modality.type"
              >
                <el-icon><component :is="modality.icon" /></el-icon>
                <span class="modality-name">{{ modality.name }}</span>
                <div class="modality-score" :class="getScoreClass(modality.score)">
                  {{ modality.score }}
                </div>
              </div>
            </div>
          </div>

          <!-- 改进建议 -->
          <div class="event-suggestions" v-if="event.suggestions && event.suggestions.length > 0">
            <div class="suggestions-title">
              <el-icon><Star /></el-icon>
              智能建议
            </div>
            <div class="suggestions-list">
              <div 
                v-for="suggestion in event.suggestions" 
                :key="suggestion.id"
                class="suggestion-item"
                :class="suggestion.priority"
              >
                <div class="suggestion-content">{{ suggestion.content }}</div>
                <el-tag :type="getSuggestionTagType(suggestion.priority)" size="small">
                  {{ suggestion.priority }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>

        <!-- 连接线 -->
        <div class="event-connector" v-if="index < timelineEvents.length - 1"></div>
      </div>
    </div>

    <!-- 时间轴统计 -->
    <div class="timeline-statistics">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <el-icon><TrendCharts /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ overallStats.averageScore }}</div>
            <div class="stat-label">平均评分</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <el-icon><Star /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ overallStats.peakMoments }}</div>
            <div class="stat-label">高光时刻</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <el-icon><Warning /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ overallStats.improvementAreas }}</div>
            <div class="stat-label">改进点</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <el-icon><DataBoard /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ overallStats.modalityConsistency }}%</div>
            <div class="stat-label">多模态一致性</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Clock, Document, List, Download, TrendCharts, Star, Warning, DataBoard,
  Microphone, VideoCamera, ChatDotRound, User
} from '@element-plus/icons-vue'

// Props
const props = defineProps({
  interviewData: {
    type: Object,
    default: () => ({})
  },
  realTimeMode: {
    type: Boolean,
    default: true
  }
})

// 响应式数据
const viewMode = ref('detailed')
const currentTime = ref('15:32')
const totalTime = ref('30:00')
const interviewProgress = ref(51.7)

// 进度标记点
const progressMarkers = ref([
  { time: '00:00', position: 0, description: '面试开始', passed: true },
  { time: '05:00', position: 16.7, description: '自我介绍', passed: true },
  { time: '10:00', position: 33.3, description: '技术问答', passed: true },
  { time: '15:00', position: 50, description: '项目经验', passed: true },
  { time: '20:00', position: 66.7, description: '情景模拟', passed: false },
  { time: '25:00', position: 83.3, description: '综合评估', passed: false },
  { time: '30:00', position: 100, description: '面试结束', passed: false }
])

// 时间轴事件数据
const timelineEvents = ref([
  {
    id: 1,
    time: '00:02',
    duration: '2分钟',
    type: 'excellent',
    icon: 'User',
    title: '开场表现优秀',
    description: '候选人展现出良好的职业素养和沟通能力，语音清晰度高，表情自然得体，文本表达准确流畅，为面试开了一个好头。',
    score: 92,
    tags: [
      { name: '语音清晰', type: 'success' },
      { name: '表情自然', type: 'primary' },
      { name: '表达准确', type: 'success' }
    ],
    modalities: [
      { type: 'voice', icon: 'Microphone', name: '语音分析', score: 94 },
      { type: 'video', icon: 'VideoCamera', name: '视频分析', score: 89 },
      { type: 'text', icon: 'ChatDotRound', name: '文本分析', score: 93 }
    ],
    analysis: [
      {
        type: 'voice',
        icon: 'Microphone',
        title: '语音质量分析',
        level: 'success',
        levelText: '优秀',
        metrics: [
          { name: '清晰度', value: 94 },
          { name: '语速适中', value: 88 },
          { name: '音调稳定', value: 91 },
          { name: '停顿合理', value: 87 }
        ],
        insights: [
          '语音清晰度达到专业水准，发音标准',
          '语速控制得当，便于理解和记录',
          '音调变化自然，体现良好的表达能力'
        ]
      }
    ],
    suggestions: [
      { id: 1, content: '保持当前的优秀状态，继续展现专业素养', priority: '维持' }
    ],
    highlighted: true
  }
])

// 统计数据
const overallStats = ref({
  averageScore: 87.3,
  peakMoments: 3,
  improvementAreas: 2,
  modalityConsistency: 89
})

// 计算属性和方法
const setViewMode = (mode) => {
  viewMode.value = mode
  ElMessage.info(`切换到${mode === 'detailed' ? '详细' : '摘要'}视图`)
}

const getTimeBadgeClass = (type) => {
  const classes = {
    excellent: 'time-badge-excellent',
    good: 'time-badge-good',
    warning: 'time-badge-warning',
    critical: 'time-badge-critical'
  }
  return classes[type] || 'time-badge-default'
}

const getEventIconClass = (type) => {
  const classes = {
    excellent: 'event-icon-excellent',
    good: 'event-icon-good',
    warning: 'event-icon-warning',
    critical: 'event-icon-critical'
  }
  return classes[type] || 'event-icon-default'
}

const getScoreClass = (score) => {
  if (score >= 90) return 'score-excellent'
  if (score >= 80) return 'score-good'
  if (score >= 70) return 'score-average'
  return 'score-poor'
}

const getMetricColor = (value) => {
  if (value >= 90) return '#52c41a'
  if (value >= 80) return '#1890ff'
  if (value >= 70) return '#faad14'
  return '#ff4d4f'
}

const getSuggestionTagType = (priority) => {
  const types = {
    '高优先级': 'danger',
    '中优先级': 'warning',
    '低优先级': 'info',
    '维持': 'success'
  }
  return types[priority] || 'default'
}

const exportTimeline = () => {
  ElMessage.success('时间轴数据导出功能开发中...')
}

// 生命周期
onMounted(() => {
  console.log('🕒 增强面试时间轴组件已加载')
  
  // 模拟实时更新
  if (props.realTimeMode) {
    setInterval(() => {
      // 更新当前时间和进度
      const [minutes, seconds] = currentTime.value.split(':').map(Number)
      const totalSeconds = minutes * 60 + seconds + 1
      const newMinutes = Math.floor(totalSeconds / 60)
      const newSeconds = totalSeconds % 60
      currentTime.value = `${newMinutes.toString().padStart(2, '0')}:${newSeconds.toString().padStart(2, '0')}`
      
      // 更新进度
      const [totalMin] = totalTime.value.split(':').map(Number)
      interviewProgress.value = (totalSeconds / (totalMin * 60)) * 100
    }, 1000)
  }
})
</script>

<style scoped>
.enhanced-interview-timeline {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f0f0f0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.timeline-icon {
  color: #1890ff;
  font-size: 24px;
}

.timeline-title {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
  color: #2d3748;
}

.timeline-progress {
  margin-bottom: 32px;
}

.progress-bar {
  position: relative;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  margin-bottom: 12px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #1890ff 0%, #52c41a 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-markers {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
}

.progress-marker {
  position: absolute;
  top: -6px;
  transform: translateX(-50%);
}

.marker-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #d9d9d9;
  border: 3px solid white;
  transition: all 0.3s ease;
}

.progress-marker.active .marker-dot {
  background: #1890ff;
}

.marker-time {
  position: absolute;
  top: 25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.75rem;
  color: #666;
  white-space: nowrap;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #666;
}

.current-time {
  font-weight: 600;
  color: #1890ff;
}

.progress-percentage {
  font-weight: 600;
  color: #52c41a;
}

.timeline-content {
  position: relative;
}

.timeline-event {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
  position: relative;
}

.event-time {
  flex-shrink: 0;
  width: 120px;
  text-align: center;
}

.time-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
  margin-bottom: 4px;
}

.time-badge-excellent {
  background: linear-gradient(135deg, #52c41a, #73d13d);
}

.time-badge-good {
  background: linear-gradient(135deg, #1890ff, #40a9ff);
}

.time-badge-warning {
  background: linear-gradient(135deg, #faad14, #ffc53d);
}

.time-badge-critical {
  background: linear-gradient(135deg, #ff4d4f, #ff7875);
}

.time-duration {
  font-size: 0.75rem;
  color: #666;
}

.event-content {
  flex: 1;
  background: #fafafa;
  border-radius: 12px;
  padding: 20px;
  border-left: 4px solid #1890ff;
}

.timeline-event.excellent .event-content {
  border-left-color: #52c41a;
  background: linear-gradient(135deg, #f6ffed, #fafafa);
}

.timeline-event.warning .event-content {
  border-left-color: #faad14;
  background: linear-gradient(135deg, #fffbe6, #fafafa);
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.event-title-section {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.event-icon {
  font-size: 20px;
  color: #1890ff;
}

.event-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
}

.event-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.event-score {
  text-align: center;
  min-width: 60px;
}

.score-value {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 2px;
}

.score-excellent {
  color: #52c41a;
}

.score-good {
  color: #1890ff;
}

.score-average {
  color: #faad14;
}

.score-poor {
  color: #ff4d4f;
}

.score-label {
  font-size: 0.75rem;
  color: #666;
}

.event-description {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #4a5568;
  margin-bottom: 16px;
}

.event-modalities {
  margin-bottom: 16px;
}

.modality-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 8px;
}

.modality-indicators {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.modality-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  font-size: 0.85rem;
}

.modality-name {
  color: #4a5568;
}

.modality-score {
  font-weight: 600;
  font-size: 0.9rem;
}

.event-analysis {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.analysis-section {
  margin-bottom: 16px;
}

.analysis-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.analysis-title {
  font-weight: 600;
  color: #2d3748;
}

.analysis-metrics {
  margin-bottom: 12px;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.metric-name {
  min-width: 80px;
  font-size: 0.85rem;
  color: #4a5568;
}

.metric-bar {
  flex: 1;
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.metric-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.metric-value {
  min-width: 40px;
  text-align: right;
  font-size: 0.85rem;
  font-weight: 600;
}

.insights-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 8px;
}

.insights-list {
  margin: 0;
  padding-left: 16px;
}

.insights-list li {
  font-size: 0.85rem;
  color: #4a5568;
  line-height: 1.5;
  margin-bottom: 4px;
}

.event-suggestions {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.suggestions-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 8px;
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.suggestion-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.suggestion-content {
  font-size: 0.85rem;
  color: #4a5568;
  flex: 1;
}

.timeline-statistics {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 2px solid #f0f0f0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.stat-icon {
  color: #1890ff;
  font-size: 24px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 2px;
}

.stat-label {
  font-size: 0.85rem;
  color: #666;
}

.event-connector {
  position: absolute;
  left: 144px;
  top: 100%;
  width: 2px;
  height: 32px;
  background: linear-gradient(to bottom, #1890ff, transparent);
}

.timeline-event:last-child .event-connector {
  display: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .timeline-event {
    flex-direction: column;
    gap: 12px;
  }
  
  .event-time {
    width: auto;
    text-align: left;
  }
  
  .event-connector {
    display: none;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
