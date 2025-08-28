<template>
  <div class="multimodal-fusion-container demo-gradient">
    <!-- 多模态数据融合头部 -->
    <div class="fusion-header section-spacing gradient-overlay-bg">
      <div class="optimized-container">
        <div class="header-content symmetric-layout">
          <div class="header-left">
            <el-icon class="fusion-icon"><DataBoard /></el-icon>
            <h3 class="fusion-title optimized-title-h3">多模态数据融合分析</h3>
            <el-tag type="primary" size="small">iFlytek Spark驱动</el-tag>
          </div>
          <div class="header-right">
            <el-button-group size="small">
              <el-button
                :type="viewMode === 'integrated' ? 'primary' : 'default'"
                @click="setViewMode('integrated')"
              >
                <el-icon><Cpu /></el-icon>
                融合视图
              </el-button>
              <el-button
                :type="viewMode === 'separated' ? 'primary' : 'default'"
                @click="setViewMode('separated')"
              >
                <el-icon><Grid /></el-icon>
                分离视图
              </el-button>
              <el-button
                :type="viewMode === 'timeline' ? 'primary' : 'default'"
                @click="setViewMode('timeline')"
              >
                <el-icon><Clock /></el-icon>
                时序视图
              </el-button>
            </el-button-group>
          </div>
        </div>
      </div>
    </div>

    <!-- 融合视图 -->
    <div v-if="viewMode === 'integrated'" class="integrated-view">
      <div class="fusion-dashboard">
        <!-- 综合评分圆环 -->
        <div class="fusion-score-ring">
          <div class="score-ring-container">
            <v-chart
              :option="fusionScoreOption"
              :style="{ height: '300px', width: '300px' }"
              autoresize
            />
          </div>
          <div class="score-details">
            <div class="overall-score">
              <span class="score-number">{{ fusionData.overallScore }}</span>
              <span class="score-label">综合评分</span>
            </div>
            <div class="modality-contributions">
              <div class="contribution-item" v-for="contrib in modalityContributions" :key="contrib.name">
                <div class="contrib-header">
                  <el-icon><component :is="contrib.icon" /></el-icon>
                  <span class="contrib-name">{{ contrib.name }}</span>
                  <span class="contrib-weight">{{ contrib.weight }}%</span>
                </div>
                <div class="contrib-bar">
                  <div class="contrib-fill" :style="{
                    width: contrib.score + '%',
                    background: contrib.color
                  }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 多模态协同分析 -->
        <div class="synergy-analysis">
          <h4 class="analysis-title">
            <el-icon><Connection /></el-icon>
            多模态协同效应
          </h4>
          <div class="synergy-grid">
            <div class="synergy-card" v-for="synergy in synergyAnalysis" :key="synergy.id">
              <div class="synergy-header">
                <div class="synergy-modalities">
                  <el-icon v-for="icon in synergy.modalities" :key="icon">
                    <component :is="icon" />
                  </el-icon>
                </div>
                <span class="synergy-score">{{ synergy.score }}%</span>
              </div>
              <div class="synergy-title">{{ synergy.title }}</div>
              <div class="synergy-description">{{ synergy.description }}</div>
              <div class="synergy-insights">
                <el-tag
                  v-for="insight in synergy.insights"
                  :key="insight"
                  size="small"
                  :type="getSynergyTagType(synergy.score)"
                >
                  {{ insight }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分离视图 -->
    <div v-else-if="viewMode === 'separated'" class="separated-view">
      <div class="modality-panels">
        <!-- 语音模态面板 -->
        <div class="modality-panel voice-panel">
          <div class="panel-header">
            <el-icon class="panel-icon"><Microphone /></el-icon>
            <h4 class="panel-title">语音模态分析</h4>
            <div class="panel-score">{{ voiceData.score }}分</div>
          </div>
          <div class="panel-content">
            <div class="voice-waveform-mini">
              <div class="waveform-bars">
                <div
                  v-for="i in 16"
                  :key="i"
                  class="wave-bar-mini"
                  :style="{ height: getWaveHeight(i) + '%' }"
                ></div>
              </div>
            </div>
            <div class="voice-metrics-grid">
              <div class="metric-item" v-for="metric in voiceData.metrics" :key="metric.name">
                <span class="metric-name">{{ metric.name }}</span>
                <div class="metric-progress">
                  <el-progress
                    :percentage="metric.value"
                    :stroke-width="4"
                    :show-text="false"
                    :color="getMetricColor(metric.value)"
                  />
                </div>
                <span class="metric-value">{{ metric.value }}%</span>
              </div>
            </div>
          </div>
        </div>



        <!-- 文本模态面板 -->
        <div class="modality-panel text-panel">
          <div class="panel-header">
            <el-icon class="panel-icon"><Document /></el-icon>
            <h4 class="panel-title">文本模态分析</h4>
            <div class="panel-score">{{ textData.score }}分</div>
          </div>
          <div class="panel-content">
            <div class="text-wordcloud">
              <div class="wordcloud-container">
                <span
                  v-for="word in keywordCloud"
                  :key="word.text"
                  class="keyword-item"
                  :style="{
                    fontSize: word.size + 'px',
                    color: word.color,
                    opacity: word.weight / 100
                  }"
                >
                  {{ word.text }}
                </span>
              </div>
            </div>
            <div class="text-metrics-grid">
              <div class="metric-item" v-for="metric in textData.metrics" :key="metric.name">
                <span class="metric-name">{{ metric.name }}</span>
                <div class="metric-progress">
                  <el-progress
                    :percentage="metric.value"
                    :stroke-width="4"
                    :show-text="false"
                    :color="getMetricColor(metric.value)"
                  />
                </div>
                <span class="metric-value">{{ metric.value }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 时序视图 -->
    <div v-else-if="viewMode === 'timeline'" class="timeline-view">
      <div class="timeline-container">
        <h4 class="timeline-title">
          <el-icon><Clock /></el-icon>
          多模态时序分析
        </h4>
        <div class="timeline-chart">
          <v-chart
            :option="timelineChartOption"
            :style="{ height: '400px', width: '100%' }"
            autoresize
          />
        </div>
        <div class="timeline-insights">
          <div class="insight-item" v-for="insight in timelineInsights" :key="insight.id">
            <div class="insight-time">{{ insight.time }}</div>
            <div class="insight-content">
              <div class="insight-title">{{ insight.title }}</div>
              <div class="insight-description">{{ insight.description }}</div>
            </div>
            <div class="insight-modalities">
              <el-icon v-for="modality in insight.modalities" :key="modality">
                <component :is="modality" />
              </el-icon>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 数据导出和分享 -->
    <div class="fusion-actions">
      <el-button type="primary" @click="exportFusionData">
        <el-icon><Download /></el-icon>
        导出融合数据
      </el-button>
      <el-button type="success" @click="generateFusionReport">
        <el-icon><Document /></el-icon>
        生成融合报告
      </el-button>
      <el-button type="info" @click="shareFusionInsights">
        <el-icon><Share /></el-icon>
        分享洞察
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'
import {
  DataBoard, Cpu, Grid, Clock, Microphone, Document,
  Connection, Download, Share
} from '@element-plus/icons-vue'
import enhancedDataExportService from '@/services/enhancedDataExportService'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'

// 注册ECharts组件
use([
  CanvasRenderer,
  PieChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

// Props
const props = defineProps({
  candidateData: {
    type: Object,
    default: () => ({})
  },
  interviewData: {
    type: Object,
    default: () => ({})
  }
})

// 响应式数据
const viewMode = ref('integrated')

// 融合数据
const fusionData = ref({
  overallScore: 87,
  confidence: 92,
  reliability: 89
})

// 模态贡献度
const modalityContributions = ref([
  {
    name: '语音分析',
    icon: 'Microphone',
    weight: 50,
    score: 88,
    color: '#1890ff'
  },
  {
    name: '文本分析',
    icon: 'Document',
    weight: 50,
    score: 89,
    color: '#722ed1'
  }
])

// 协同效应分析
const synergyAnalysis = ref([
  {
    id: 1,
    title: '语音-文本一致性',
    description: '语音表达与文本内容的一致性分析',
    modalities: ['Microphone', 'Document'],
    score: 92,
    insights: ['表达一致', '逻辑清晰']
  },
  {
    id: 2,
    title: '双模态置信度',
    description: '语音和文本模态数据的整体可信度评估',
    modalities: ['Microphone', 'Document'],
    score: 89,
    insights: ['数据可靠', '分析准确']
  }
])

// 各模态数据
const voiceData = ref({
  score: 88,
  metrics: [
    { name: '语音质量', value: 92 },
    { name: '语速适中', value: 85 },
    { name: '情感表达', value: 87 },
    { name: '专业术语', value: 91 }
  ]
})



const textData = ref({
  score: 89,
  metrics: [
    { name: '逻辑结构', value: 92 },
    { name: '内容深度', value: 87 },
    { name: '关键词匹配', value: 89 },
    { name: '表达准确性', value: 91 }
  ]
})



// 关键词云数据
const keywordCloud = ref([
  { text: '算法', size: 24, weight: 95, color: '#1890ff' },
  { text: '架构', size: 20, weight: 88, color: '#52c41a' },
  { text: '优化', size: 18, weight: 82, color: '#722ed1' },
  { text: '分布式', size: 16, weight: 76, color: '#fa8c16' },
  { text: '机器学习', size: 22, weight: 90, color: '#eb2f96' },
  { text: '性能', size: 14, weight: 70, color: '#13c2c2' }
])

// 时序洞察数据
const timelineInsights = ref([
  {
    id: 1,
    time: '00:02',
    title: '开场表现优秀',
    description: '候选人展现出良好的职业素养和沟通能力，语音清晰度高达94%，表情自然得体，文本表达准确流畅，为面试开了一个好头。',
    modalities: ['Microphone', 'VideoCamera', 'Document']
  },
  {
    id: 2,
    time: '03:45',
    title: '自我介绍亮点突出',
    description: '结构化表达能力强，逻辑清晰，重点突出。语音节奏控制得当，眼神交流自然，技术背景介绍专业且具体。',
    modalities: ['Document', 'Microphone', 'VideoCamera']
  },
  {
    id: 3,
    time: '05:30',
    title: '技术深度展现',
    description: '专业术语使用准确率达91%，技术理解深入，能够清晰阐述复杂概念。语音表达中体现出扎实的技术功底和实践经验。',
    modalities: ['Document', 'Microphone']
  },
  {
    id: 4,
    time: '08:12',
    title: '项目经验详述',
    description: '项目描述具体详实，技术栈掌握全面。通过具体案例展示问题解决能力，语音情感表达积极，展现出对技术工作的热情。',
    modalities: ['Document', 'Microphone', 'VideoCamera']
  },
  {
    id: 5,
    time: '12:15',
    title: '压力应对能力测试',
    description: '面对复杂技术问题时出现轻微紧张，语音略有停顿，但能够快速调整状态，展现出良好的抗压能力和自我调节能力。',
    modalities: ['VideoCamera', 'Microphone']
  },
  {
    id: 6,
    time: '15:48',
    title: '创新思维展现',
    description: '在讨论技术方案时展现出创新思维，提出了独特的解决思路。语音表达充满自信，肢体语言积极，体现出强烈的技术探索欲望。',
    modalities: ['Document', 'Microphone', 'VideoCamera']
  },
  {
    id: 7,
    time: '18:30',
    title: '团队协作意识',
    description: '在回答团队合作相关问题时，表达清晰有条理，语音温和友善，面部表情真诚，展现出良好的团队协作意识和沟通能力。',
    modalities: ['Microphone', 'VideoCamera', 'Document']
  },
  {
    id: 8,
    time: '22:05',
    title: '学习能力体现',
    description: '对新技术的学习态度积极主动，能够快速理解和掌握新概念。语音表达中体现出强烈的求知欲和持续学习的意愿。',
    modalities: ['Document', 'Microphone']
  },
  {
    id: 9,
    time: '25:20',
    title: '综合素质评估',
    description: '整体表现稳定，多模态数据一致性良好。技术能力、沟通表达、学习能力等各方面均达到预期水平，展现出全面的职业素养。',
    modalities: ['Microphone', 'VideoCamera', 'Document']
  },
  {
    id: 10,
    time: '28:45',
    title: '面试收尾表现',
    description: '面试结束阶段保持专业态度，对面试过程表示感谢，语音表达礼貌得体，展现出良好的职业礼仪和个人修养。',
    modalities: ['Microphone', 'VideoCamera']
  }
])

// 计算属性
const fusionScoreOption = computed(() => ({
  title: {
    text: '多模态融合评分',
    left: 'center',
    top: 20,
    textStyle: {
      fontSize: 16,
      fontWeight: 'bold'
    }
  },
  series: [{
    type: 'pie',
    radius: ['60%', '80%'],
    center: ['50%', '60%'],
    data: modalityContributions.value.map(item => ({
      name: item.name,
      value: item.weight,
      itemStyle: {
        color: item.color
      }
    })),
    label: {
      show: false
    },
    emphasis: {
      label: {
        show: true,
        fontSize: 14,
        fontWeight: 'bold'
      }
    }
  }],
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c}% ({d}%)'
  }
}))

const timelineChartOption = computed(() => ({
  title: {
    text: '多模态时序变化',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['语音质量', '文本质量'],
    top: 30
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['0min', '5min', '10min', '15min', '20min', '25min', '30min']
  },
  yAxis: {
    type: 'value',
    min: 0,
    max: 100
  },
  series: [
    {
      name: '语音质量',
      type: 'line',
      data: [85, 88, 92, 89, 87, 90, 88],
      smooth: true,
      itemStyle: { color: '#1890ff' }
    },
    {
      name: '文本质量',
      type: 'line',
      data: [88, 89, 91, 90, 89, 92, 89],
      smooth: true,
      itemStyle: { color: '#722ed1' }
    }
  ]
}))

// 方法
const setViewMode = (mode) => {
  viewMode.value = mode
  ElMessage.info(`切换到${mode === 'integrated' ? '融合' : mode === 'separated' ? '分离' : '时序'}视图`)
}

const getSynergyTagType = (score) => {
  if (score >= 90) return 'success'
  if (score >= 80) return 'primary'
  if (score >= 70) return 'warning'
  return 'danger'
}

const getWaveHeight = (index) => {
  return 20 + Math.sin(Date.now() / 1000 + index * 0.5) * 30 + Math.random() * 20
}

const getMetricColor = (value) => {
  if (value >= 90) return '#52c41a'
  if (value >= 80) return '#1890ff'
  if (value >= 70) return '#faad14'
  return '#ff4d4f'
}



const exportFusionData = async () => {
  try {
    const fusionDataForExport = {
      overallScore: fusionData.value.overallScore,
      confidence: fusionData.value.confidence,
      reliability: fusionData.value.reliability,
      modalityContributions: modalityContributions.value,
      synergyAnalysis: synergyAnalysis.value,
      timelineInsights: timelineInsights.value,
      voiceData: voiceData.value,
      textData: textData.value
    }

    await enhancedDataExportService.exportMultimodalFusionData(fusionDataForExport, 'excel')
  } catch (error) {
    console.error('❌ 导出失败:', error)
  }
}

const generateFusionReport = async () => {
  try {
    // 确保数据完整性和安全性
    const fusionDataForReport = {
      // PDF导出需要的summary结构
      summary: {
        overallScore: fusionData.value?.overallScore || 87,
        confidence: fusionData.value?.confidence || 92,
        reliability: fusionData.value?.reliability || 89
      },
      // PDF导出需要的modalityAnalysis结构
      modalityAnalysis: [
        {
          name: '语音分析',
          score: voiceData.value?.score || 88,
          weight: 50
        },
        {
          name: '文本分析',
          score: textData.value?.score || 89,
          weight: 50
        }
      ],
      // 保持原有数据结构
      overallScore: fusionData.value?.overallScore || 87,
      confidence: fusionData.value?.confidence || 92,
      reliability: fusionData.value?.reliability || 89,
      modalityContributions: modalityContributions.value || [],
      synergyAnalysis: synergyAnalysis.value || [],
      timelineInsights: timelineInsights.value || [],
      voiceData: voiceData.value || { score: 88, metrics: [] },
      textData: textData.value || { score: 89, metrics: [] },
      // 添加详细指标数据
      detailedMetrics: {
        voice: voiceData.value || { score: 88, metrics: [] },
        text: textData.value || { score: 89, metrics: [] }
      },
      // 添加推荐建议
      recommendations: [
        '继续保持良好的沟通表达能力',
        '加强技术深度的展示',
        '提升多模态协调性'
      ]
    }

    console.log('📊 生成融合报告数据:', fusionDataForReport)
    await enhancedDataExportService.generateFusionReport(fusionDataForReport, 'pdf')
  } catch (error) {
    console.error('❌ 报告生成失败:', error)
    ElMessage.error('报告生成失败，请稍后重试')
  }
}

const shareFusionInsights = async () => {
  try {
    const fusionDataForShare = {
      overallScore: fusionData.value.overallScore,
      confidence: fusionData.value.confidence,
      reliability: fusionData.value.reliability,
      modalityContributions: modalityContributions.value,
      synergyAnalysis: synergyAnalysis.value,
      timelineInsights: timelineInsights.value
    }

    const shareResult = await enhancedDataExportService.generateShareLink(fusionDataForShare)

    // 显示分享结果
    ElNotification({
      title: '分享链接已生成',
      message: `链接: ${shareResult.shareLink}`,
      type: 'success',
      duration: 0,
      dangerouslyUseHTMLString: true,
      customClass: 'share-notification'
    })

    // 复制到剪贴板
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareResult.shareLink)
      ElMessage.success('分享链接已复制到剪贴板')
    }
  } catch (error) {
    console.error('❌ 分享失败:', error)
  }
}

// 生命周期
onMounted(() => {
  console.log('🔗 多模态数据融合组件已加载')
})
</script>

<style scoped>
/* 导入优化系统 */
@import '@/styles/gradient-background-system.css';
@import '@/styles/layout-optimization.css';

.multimodal-fusion-container {
  border-radius: 16px;
  padding: 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.fusion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.fusion-icon {
  color: #1890ff;
  font-size: 24px;
}

.fusion-title {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
  color: #2d3748;
}

/* 融合视图样式 */
.integrated-view {
  margin-bottom: 24px;
}

.fusion-dashboard {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: start;
}

.fusion-score-ring {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.score-ring-container {
  position: relative;
}

.score-details {
  width: 100%;
}

.overall-score {
  text-align: center;
  margin-bottom: 24px;
}

.score-number {
  display: block;
  font-size: 3rem;
  font-weight: 700;
  color: #1890ff;
  line-height: 1;
}

.score-label {
  font-size: 1rem;
  color: #6b7280;
  margin-top: 8px;
}

.modality-contributions {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.contribution-item {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
}

.contrib-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.contrib-name {
  flex: 1;
  font-size: 0.9rem;
  font-weight: 600;
  color: #2d3748;
}

.contrib-weight {
  font-size: 0.8rem;
  font-weight: 600;
  color: #1890ff;
}

.contrib-bar {
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.contrib-fill {
  height: 100%;
  transition: width 0.3s ease;
}

/* 协同分析样式 */
.synergy-analysis {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
}

.analysis-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 20px 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
}

.synergy-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.synergy-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  border-left: 4px solid #1890ff;
}

.synergy-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.synergy-modalities {
  display: flex;
  gap: 8px;
}

.synergy-modalities .el-icon {
  color: #1890ff;
  font-size: 16px;
}

.synergy-score {
  font-size: 1.1rem;
  font-weight: 700;
  color: #52c41a;
}

.synergy-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 4px;
}

.synergy-description {
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 12px;
  line-height: 1.4;
}

.synergy-insights {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* 分离视图样式 */
.separated-view {
  margin-bottom: 24px;
}

.modality-panels {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
}

.modality-panel {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  border-left: 4px solid transparent;
}

.voice-panel {
  border-left-color: #1890ff;
}

.text-panel {
  border-left-color: #722ed1;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e2e8f0;
}

.panel-icon {
  font-size: 20px;
}

.voice-panel .panel-icon {
  color: #1890ff;
}

.text-panel .panel-icon {
  color: #722ed1;
}

.panel-title {
  flex: 1;
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
}

.panel-score {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1890ff;
}

.panel-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 文本模态分析样式 */
.text-wordcloud {
  margin-bottom: 16px;
}

.wordcloud-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 20px;
  background: rgba(114, 46, 209, 0.05);
  border-radius: 8px;
  min-height: 120px;
}

.keyword-item {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.8);
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
}

.keyword-item:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* 语音波形样式 */
.voice-waveform-mini {
  margin-bottom: 16px;
}

.waveform-bars {
  display: flex;
  justify-content: center;
  align-items: end;
  gap: 2px;
  height: 60px;
  padding: 10px;
  background: rgba(24, 144, 255, 0.05);
  border-radius: 8px;
}

.wave-bar-mini {
  width: 4px;
  background: linear-gradient(to top, #1890ff, #69c0ff);
  border-radius: 2px;
  transition: height 0.3s ease;
  min-height: 8px;
}

/* 指标网格样式 */
.voice-metrics-grid,
.text-metrics-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.metric-name {
  min-width: 80px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #4a5568;
}

.metric-progress {
  flex: 1;
}

.metric-value {
  min-width: 40px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #2d3748;
  text-align: right;
}
</style>