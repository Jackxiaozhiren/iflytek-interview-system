<template>
  <div class="analysis-demo">
    <!-- 分析演示头部 -->
    <div class="analysis-header" data-aos="fade-up">
      <h2>
        <el-icon><DataBoard /></el-icon>
        多模态智能分析展示
      </h2>
      <p>体验AI如何从文本、语音、视频三个维度进行综合分析和评估</p>
    </div>

    <!-- 分析场景选择 -->
    <div class="scenario-selector" data-aos="fade-up" data-aos-delay="200">
      <h3>选择分析场景</h3>
      <div class="scenario-cards grid grid-auto-fit-md grid-gap-xl">
        <div
          class="scenario-card"
          v-for="scenario in scenarios"
          :key="scenario.key"
          @click="selectScenario(scenario.key)"
          :class="{ 'active': activeScenario === scenario.key }"
        >
          <div class="scenario-icon" :style="{ background: scenario.color }">
            <el-icon><component :is="scenario.icon" /></el-icon>
          </div>
          <h4>{{ scenario.title }}</h4>
          <p>{{ scenario.description }}</p>
          <div class="scenario-stats">
            <span>{{ scenario.domain }}</span>
            <span>{{ scenario.position }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 分析结果展示 -->
    <div class="analysis-results" v-if="currentAnalysis" data-aos="fade-up" data-aos-delay="400">
      <!-- 综合评分 -->
      <div class="overall-score">
        <div class="score-card">
          <div class="score-circle">
            <div class="score-value">{{ currentAnalysis.overallScore }}</div>
            <div class="score-label">综合得分</div>
          </div>
          <div class="score-details">
            <h4>{{ currentAnalysis.domain }} - {{ currentAnalysis.position }}</h4>
            <p>基于iFlytek Spark LLM的智能评估结果</p>
            <div class="score-breakdown">
              <div class="breakdown-item" v-for="(score, key) in currentAnalysis.capabilities" :key="key">
                <span class="capability-name">{{ getCapabilityName(key) }}</span>
                <div class="capability-bar">
                  <div
                    class="capability-fill"
                    :style="{
                      width: score + '%',
                      background: getCapabilityColor(key)
                    }"
                  ></div>
                </div>
                <span class="capability-score">{{ score }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 多模态分析详情 -->
      <div class="multimodal-analysis">
        <h3>
          <el-icon><TrendCharts /></el-icon>
          多模态分析详情
        </h3>

        <div class="analysis-tabs">
          <el-tabs v-model="activeAnalysisTab" @tab-click="handleAnalysisTabClick">
            <el-tab-pane label="文本分析" name="text">
              <div class="text-analysis">
                <div class="analysis-score">
                  <div class="score-circle-small">
                    <span>{{ currentAnalysis.multimodalAnalysis.text.score }}</span>
                  </div>
                  <div class="score-info">
                    <h4>文本分析得分</h4>
                    <p>基于自然语言处理技术的文本内容分析</p>
                  </div>
                </div>

                <div class="analysis-content">
                  <div class="highlights-section">
                    <h5>
                      <el-icon><Check /></el-icon>
                      表现亮点
                    </h5>
                    <ul class="highlights-list">
                      <li v-for="highlight in currentAnalysis.multimodalAnalysis.text.highlights" :key="highlight">
                        <el-icon><CircleCheck /></el-icon>
                        {{ highlight }}
                      </li>
                    </ul>
                  </div>

                  <div class="improvements-section">
                    <h5>
                      <el-icon><Warning /></el-icon>
                      改进建议
                    </h5>
                    <ul class="improvements-list">
                      <li v-for="improvement in currentAnalysis.multimodalAnalysis.text.improvements" :key="improvement">
                        <el-icon><InfoFilled /></el-icon>
                        {{ improvement }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="语音分析" name="speech">
              <div class="speech-analysis">
                <div class="analysis-score">
                  <div class="score-circle-small">
                    <span>{{ currentAnalysis.multimodalAnalysis.speech.score }}</span>
                  </div>
                  <div class="score-info">
                    <h4>语音分析得分</h4>
                    <p>基于语音识别和情感分析技术的语音评估</p>
                  </div>
                </div>

                <div class="analysis-content">
                  <div class="highlights-section">
                    <h5>
                      <el-icon><Check /></el-icon>
                      表现亮点
                    </h5>
                    <ul class="highlights-list">
                      <li v-for="highlight in currentAnalysis.multimodalAnalysis.speech.highlights" :key="highlight">
                        <el-icon><CircleCheck /></el-icon>
                        {{ highlight }}
                      </li>
                    </ul>
                  </div>

                  <div class="improvements-section">
                    <h5>
                      <el-icon><Warning /></el-icon>
                      改进建议
                    </h5>
                    <ul class="improvements-list">
                      <li v-for="improvement in currentAnalysis.multimodalAnalysis.speech.improvements" :key="improvement">
                        <el-icon><InfoFilled /></el-icon>
                        {{ improvement }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </el-tab-pane>


          </el-tabs>
        </div>
      </div>

      <!-- 6核心能力雷达图 -->
      <div class="capabilities-radar">
        <h3>
          <el-icon><TrendCharts /></el-icon>
          6核心能力评估
        </h3>
        <div class="radar-container">
          <div class="radar-chart" ref="radarChart"></div>
          <div class="capabilities-legend">
            <div
              class="legend-item"
              v-for="(capability, key) in coreCapabilities"
              :key="key"
            >
              <div class="legend-color" :style="{ background: capability.color }"></div>
              <div class="legend-info">
                <h5>{{ capability.name }}</h5>
                <p>{{ capability.description }}</p>
                <div class="capability-metrics">
                  <span
                    v-for="metric in capability.metrics"
                    :key="metric"
                    class="metric-tag"
                  >
                    {{ metric }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, onUnmounted, markRaw } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Grid, TrendCharts, Check, Warning, InfoFilled,
  CircleCheck, Cpu, Setting
} from '@element-plus/icons-vue'
import { coreCapabilities } from '@/services/demoService'
import * as echarts from 'echarts'

const activeScenario = ref('ai')
const activeAnalysisTab = ref('text')
const radarChart = ref(null)
let radarChartInstance = null

// 分析场景
const scenarios = ref([
  {
    key: 'ai',
    title: 'AI工程师面试',
    description: '机器学习算法工程师的技术面试分析',
    domain: '人工智能',
    position: '机器学习工程师',
    icon: 'Cpu',
    color: 'linear-gradient(45deg, #4c51bf 0%, #6b21a8 100%)'
  },
  {
    key: 'bigdata',
    title: '大数据工程师面试',
    description: '数据工程师的技术能力评估分析',
    domain: '大数据',
    position: '数据工程师',
    icon: 'DataBoard',
    color: 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    key: 'iot',
    title: '物联网工程师面试',
    description: '嵌入式工程师的综合能力分析',
    domain: '物联网',
    position: '嵌入式工程师',
    icon: 'Setting',
    color: 'linear-gradient(45deg, #a8edea 0%, #fed6e3 100%)'
  }
])

// 分析结果数据
const analysisResults = ref({
  ai: {
    domain: '人工智能',
    position: '机器学习工程师',
    overallScore: 87.5,
    capabilities: {
      professionalKnowledge: 92,
      skillMatching: 88,
      languageExpression: 85,
      logicalThinking: 89,
      innovation: 86,
      stressResistance: 82
    },
    multimodalAnalysis: {
      text: {
        score: 88,
        highlights: ['技术术语使用准确', '逻辑结构清晰', '回答完整性高'],
        improvements: ['可以增加更多实际案例', '表达可以更加简洁']
      },
      speech: {
        score: 86,
        highlights: ['语音清晰度高', '语速适中', '专业词汇发音准确'],
        improvements: ['可以增强语调变化', '减少口头禅使用']
      },
      video: {
        score: 85,
        highlights: ['眼神交流良好', '肢体语言自然', '表情丰富'],
        improvements: ['可以保持更稳定的坐姿', '手势可以更加丰富']
      }
    },
    detailedFeedback: {
      strengths: [
        '对机器学习算法有深入理解',
        '项目经验丰富，能够结合实际案例',
        '技术表达清晰，逻辑性强',
        '对新技术有敏锐的洞察力'
      ],
      improvements: [
        '可以加强对深度学习框架的实践经验',
        '建议多关注行业最新发展趋势',
        '可以提升在压力环境下的表现',
        '增强团队协作经验的表达'
      ]
    }
  },
  bigdata: {
    domain: '大数据',
    position: '数据工程师',
    overallScore: 84.2,
    capabilities: {
      professionalKnowledge: 88,
      skillMatching: 85,
      languageExpression: 82,
      logicalThinking: 87,
      innovation: 81,
      stressResistance: 84
    },
    multimodalAnalysis: {
      text: {
        score: 85,
        highlights: ['数据处理流程描述详细', '技术选型合理', '性能优化意识强'],
        improvements: ['可以增加更多业务理解', '表达可以更加生动']
      },
      speech: {
        score: 83,
        highlights: ['技术概念解释清楚', '语音稳定', '专业性强'],
        improvements: ['可以增加语调变化', '提升表达的感染力']
      },
      video: {
        score: 84,
        highlights: ['专注度高', '手势配合恰当', '整体形象专业'],
        improvements: ['可以增加更多眼神交流', '表情可以更加丰富']
      }
    }
  },
  iot: {
    domain: '物联网',
    position: '嵌入式工程师',
    overallScore: 82.8,
    capabilities: {
      professionalKnowledge: 86,
      skillMatching: 83,
      languageExpression: 80,
      logicalThinking: 85,
      innovation: 84,
      stressResistance: 79
    },
    multimodalAnalysis: {
      text: {
        score: 83,
        highlights: ['硬件知识扎实', '系统架构理解深入', '实践经验丰富'],
        improvements: ['可以增强软件开发能力表达', '加强通信协议知识']
      },
      speech: {
        score: 81,
        highlights: ['技术细节描述准确', '逻辑清晰', '专业术语使用恰当'],
        improvements: ['可以提升语音的自信度', '增加表达的流畅性']
      },
      video: {
        score: 83,
        highlights: ['技术演示手势清晰', '专注度高', '整体表现稳定'],
        improvements: ['可以增加更多互动性', '提升表达的生动性']
      }
    }
  }
})

const currentAnalysis = computed(() => {
  return analysisResults.value[activeScenario.value]
})

const selectScenario = (scenarioKey) => {
  activeScenario.value = scenarioKey
  const scenario = scenarios.value.find(s => s.key === scenarioKey)
  ElMessage.success(`正在加载 ${scenario.title} 的分析结果...`)

  // 重新渲染雷达图
  nextTick(() => {
    renderRadarChart()
    ElMessage.info('AI分析结果已更新，您可以查看详细的多模态评估数据')
  })
}

const handleAnalysisTabClick = (tab) => {
  console.log('切换分析标签:', tab.name)
}

const getCapabilityName = (key) => {
  const nameMap = {
    professionalKnowledge: '专业知识',
    skillMatching: '技能匹配',
    languageExpression: '语言表达',
    logicalThinking: '逻辑思维',
    innovation: '创新能力',
    stressResistance: '抗压能力'
  }
  return nameMap[key] || key
}

const getCapabilityColor = (key) => {
  const colorMap = {
    professionalKnowledge: '#409EFF',
    skillMatching: '#67C23A',
    languageExpression: '#E6A23C',
    logicalThinking: '#F56C6C',
    innovation: '#909399',
    stressResistance: '#606266'
  }
  return colorMap[key] || '#409EFF'
}

// 渲染雷达图
const renderRadarChart = () => {
  if (!radarChart.value || !currentAnalysis.value) return

  // 检查DOM元素是否有有效尺寸
  const element = radarChart.value
  if (!element.clientWidth || !element.clientHeight) {
    // 如果DOM尺寸为0，延迟初始化
    setTimeout(() => renderRadarChart(), 100)
    return
  }

  // 销毁之前的图表实例
  if (radarChartInstance) {
    radarChartInstance.dispose()
  }

  // 创建新的图表实例
  radarChartInstance = echarts.init(element)

  // 准备数据
  const capabilities = Object.keys(currentAnalysis.value.capabilities)
  const capabilityNames = capabilities.map(key => getCapabilityName(key))
  const capabilityValues = capabilities.map(key => currentAnalysis.value.capabilities[key])

  // 配置雷达图选项
  const option = {
    title: {
      text: '6核心能力评估',
      left: 'center',
      top: 20,
      textStyle: {
        color: '#2c3e50',
        fontSize: 16,
        fontWeight: 600
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: function(params) {
        return `${params.name}: ${params.value}分`
      }
    },
    legend: {
      data: ['能力评分'],
      bottom: 20,
      textStyle: {
        color: '#6c757d'
      }
    },
    radar: {
      center: ['50%', '55%'],
      radius: '65%',
      indicator: capabilityNames.map(name => ({
        name: name,
        max: 100,
        nameGap: 10,
        axisLabel: {
          show: true,
          fontSize: 10,
          color: '#95a5a6'
        }
      })),
      splitArea: {
        areaStyle: {
          color: ['rgba(64, 158, 255, 0.05)', 'rgba(64, 158, 255, 0.1)']
        }
      },
      splitLine: {
        lineStyle: {
          color: '#e0e6ed'
        }
      },
      axisLine: {
        lineStyle: {
          color: '#d1dbe5'
        }
      }
    },
    series: [{
      name: '能力评分',
      type: 'radar',
      data: [{
        value: capabilityValues,
        name: '当前评分',
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          color: '#409EFF',
          width: 3
        },
        areaStyle: {
          color: 'rgba(64, 158, 255, 0.2)'
        },
        itemStyle: {
          color: '#409EFF',
          borderColor: '#fff',
          borderWidth: 2
        }
      }],
      emphasis: {
        lineStyle: {
          width: 4
        }
      }
    }],
    animation: true,
    animationDuration: 1000,
    animationEasing: 'cubicOut'
  }

  // 设置图表选项
  radarChartInstance.setOption(option)

  // 响应式调整
  window.addEventListener('resize', () => {
    if (radarChartInstance) {
      radarChartInstance.resize()
    }
  })
}

onMounted(() => {
  // 确保DOM完全渲染后再初始化图表
  nextTick(() => {
    // 额外延迟确保容器有正确的尺寸
    setTimeout(() => {
      renderRadarChart()
    }, 200)
  })
})

onUnmounted(() => {
  if (radarChartInstance) {
    radarChartInstance.dispose()
    radarChartInstance = null
  }
  window.removeEventListener('resize', () => {
    if (radarChartInstance) {
      radarChartInstance.resize()
    }
  })
})
</script>

<style scoped>
.analysis-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.analysis-header {
  text-align: center;
  margin-bottom: 3rem;
}

.analysis-header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.analysis-header p {
  font-size: 1.2rem;
  color: #7f8c8d;
}

.scenario-selector {
  margin-bottom: 3rem;
}

.scenario-selector h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  text-align: center;
}

.scenario-cards {
  /* 网格布局已通过CSS类定义 */
}

.scenario-card {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.scenario-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.scenario-card.active {
  border-color: #409EFF;
  box-shadow: 0 15px 40px rgba(64, 158, 255, 0.3);
}

.scenario-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
}

.scenario-card h4 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.scenario-card p {
  color: #7f8c8d;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.scenario-stats {
  display: flex;
  justify-content: center;
  gap: 1rem;
  font-size: 0.9rem;
  color: #95a5a6;
}

.analysis-results {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.overall-score {
  margin-bottom: 3rem;
}

.score-card {
  display: flex;
  gap: 3rem;
  align-items: center;
  background: linear-gradient(135deg, #4c51bf 0%, #6b21a8 100%);
  color: white;
  padding: 3rem;
  border-radius: 20px;
}

.score-circle {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  backdrop-filter: blur(10px);
}

.score-value {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.score-label {
  font-size: 1rem;
  opacity: 0.9;
}

.score-details {
  flex: 1;
}

.score-details h4 {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.score-details p {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 2rem;
}

.score-breakdown {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.breakdown-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

.capability-name {
  font-size: 0.9rem;
  font-weight: 500;
  min-width: 80px;
}

.capability-bar {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  overflow: hidden;
}

.capability-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease;
}

.capability-score {
  font-size: 0.9rem;
  font-weight: 600;
  min-width: 30px;
  text-align: right;
}

.multimodal-analysis {
  margin-bottom: 3rem;
}

.multimodal-analysis h3 {
  font-size: 1.8rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.analysis-tabs {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 2rem;
}

.text-analysis,
.speech-analysis,
.video-analysis {
  padding: 1rem 0;
}

.analysis-score {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.score-circle-small {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(45deg, #409EFF, #36CFC9);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  flex-shrink: 0;
}

.score-info h4 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.score-info p {
  color: #7f8c8d;
  margin: 0;
}

.analysis-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.highlights-section,
.improvements-section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.highlights-section h5,
.improvements-section h5 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.highlights-section h5 {
  color: #67C23A;
}

.improvements-section h5 {
  color: #E6A23C;
}

.highlights-list,
.improvements-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.highlights-list li,
.improvements-list li {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.highlights-list li {
  color: #2c3e50;
}

.improvements-list li {
  color: #6c757d;
}

.capabilities-radar {
  margin-bottom: 2rem;
}

.capabilities-radar h3 {
  font-size: 1.8rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.radar-container {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 3rem;
  align-items: center;
}

.radar-chart {
  width: 450px;
  height: 450px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  padding: 20px;
}

.capabilities-legend {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.legend-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  flex-shrink: 0;
  margin-top: 2px;
}

.legend-info h5 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.25rem 0;
}

.legend-info p {
  color: #7f8c8d;
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  line-height: 1.4;
}

.capability-metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.metric-tag {
  background: #f0f0f0;
  color: #666;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
}

@media (max-width: 768px) {
  .analysis-demo {
    padding: 1rem;
  }

  .scenario-cards {
    grid-template-columns: 1fr;
  }

  .score-card {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
  }

  .score-breakdown {
    grid-template-columns: 1fr;
  }

  .breakdown-item {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }

  .analysis-content {
    grid-template-columns: 1fr;
  }

  .radar-container {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .radar-chart {
    margin: 0 auto;
  }
}

/* ==================== 紫色背景高对比度修复 ==================== */
/* 确保所有在紫色背景上的文字都是白色，符合WCAG 2.1 AA标准 */
.analysis-demo [style*="background"][style*="#6b21a8"] *,
.analysis-demo [style*="background"][style*="#4c51bf"] *,
.analysis-demo .scenario-icon,
.analysis-demo .scenario-icon * {
  color: #ffffff !important;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6) !important;
  font-weight: 500 !important;
}

/* 场景图标区域 */
.analysis-demo .scenario-icon svg,
.analysis-demo .scenario-icon svg * {
  color: #ffffff !important;
  fill: #ffffff !important;
}

/* 分析结果区域的紫色背景元素 */
.analysis-demo .score-circle,
.analysis-demo .capability-bar,
.analysis-demo .analysis-tag {
  color: #ffffff !important;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6) !important;
}
</style>