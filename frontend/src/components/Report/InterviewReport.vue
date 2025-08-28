<template>
  <div class="interview-report">
    <div class="report-header">
      <div class="header-content">
        <h1>面试评估报告</h1>
        <div class="session-info">
          <el-tag type="primary">{{ reportData.session_info?.domain }}</el-tag>
          <el-tag type="success">{{ reportData.session_info?.position }}</el-tag>
          <span class="report-time">
            生成时间: {{ formatDateTime(reportData.generated_at) }}
          </span>
        </div>
      </div>
      
      <div class="overall-score">
        <div class="score-circle">
          <el-progress
            type="circle"
            :percentage="reportData.overall_score"
            :width="120"
            :stroke-width="8"
            :color="getScoreColor(reportData.overall_score)"
          >
            <template #default="{ percentage }">
              <span class="score-text">{{ percentage }}</span>
              <span class="score-label">总分</span>
            </template>
          </el-progress>
        </div>
        <div class="performance-level">
          <el-tag 
            :type="getPerformanceLevelType(reportData.performance_level?.level)"
            size="large"
          >
            {{ reportData.performance_level?.level }}
          </el-tag>
          <p class="level-description">
            {{ reportData.performance_level?.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- 能力雷达图 -->
    <div class="capability-section">
      <el-card class="section-card">
        <template #header>
          <div class="card-header">
            <span>六大核心能力评估</span>
            <el-button link @click="showRadarDetails = !showRadarDetails">
              {{ showRadarDetails ? '隐藏详情' : '显示详情' }}
            </el-button>
          </div>
        </template>
        
        <div class="radar-container">
          <div class="radar-chart">
            <canvas ref="radarCanvas" width="400" height="400"></canvas>
          </div>
          
          <div class="capability-scores">
            <div 
              v-for="(score, capability) in reportData.capability_scores" 
              :key="capability"
              class="capability-item"
            >
              <div class="capability-name">{{ capability }}</div>
              <div class="capability-progress">
                <el-progress 
                  :percentage="score" 
                  :stroke-width="6"
                  :color="getScoreColor(score)"
                />
              </div>
              <div class="capability-score">{{ score }}分</div>
            </div>
          </div>
        </div>
        
        <div v-if="showRadarDetails" class="radar-details">
          <h4>能力详细分析</h4>
          <div class="details-grid">
            <div 
              v-for="(score, capability) in reportData.capability_scores" 
              :key="capability"
              class="detail-item"
            >
              <h5>{{ capability }}</h5>
              <p>{{ getCapabilityDescription(capability) }}</p>
              <div class="score-analysis">
                <span :class="getScoreClass(score)">
                  {{ getScoreLevel(score) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 详细分析 -->
    <div class="detailed-analysis">
      <el-row :gutter="20">
        <!-- 文本分析 -->
        <el-col :span="8">
          <el-card class="analysis-card">
            <template #header>
              <div class="card-header">
                <i class="el-icon-document"></i>
                <span>文本分析</span>
              </div>
            </template>
            
            <div class="analysis-content">
              <div class="metric-item">
                <span class="metric-label">内容相关性</span>
                <span class="metric-value">
                  {{ reportData.detailed_analysis?.text_analysis?.average_relevance || 0 }}%
                </span>
              </div>
              
              <div class="metric-item">
                <span class="metric-label">逻辑结构</span>
                <span class="metric-value">
                  {{ reportData.detailed_analysis?.text_analysis?.average_structure || 0 }}%
                </span>
              </div>
              
              <div class="metric-item">
                <span class="metric-label">创新性</span>
                <span class="metric-value">
                  {{ reportData.detailed_analysis?.text_analysis?.average_innovation || 0 }}%
                </span>
              </div>
              
              <div class="consistency-info">
                <h5>表现一致性</h5>
                <div class="consistency-bars">
                  <div class="consistency-item">
                    <span>相关性</span>
                    <el-progress 
                      :percentage="(reportData.detailed_analysis?.text_analysis?.consistency?.relevance || 0) * 100"
                      :stroke-width="4"
                      :show-text="false"
                    />
                  </div>
                  <div class="consistency-item">
                    <span>结构性</span>
                    <el-progress 
                      :percentage="(reportData.detailed_analysis?.text_analysis?.consistency?.structure || 0) * 100"
                      :stroke-width="4"
                      :show-text="false"
                    />
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- 语音分析 -->
        <el-col :span="8">
          <el-card class="analysis-card">
            <template #header>
              <div class="card-header">
                <i class="el-icon-microphone"></i>
                <span>语音分析</span>
              </div>
            </template>
            
            <div class="analysis-content">
              <div class="metric-item">
                <span class="metric-label">语音清晰度</span>
                <span class="metric-value">
                  {{ reportData.detailed_analysis?.audio_analysis?.average_clarity || 0 }}%
                </span>
              </div>
              
              <div class="metric-item">
                <span class="metric-label">情感表达</span>
                <span class="metric-value">
                  {{ reportData.detailed_analysis?.audio_analysis?.average_emotion || 0 }}%
                </span>
              </div>
              
              <div class="metric-item">
                <span class="metric-label">语速</span>
                <span class="metric-value">
                  {{ reportData.detailed_analysis?.audio_analysis?.average_speed || 0 }} 字/分
                </span>
              </div>
              
              <div class="stability-info">
                <h5>语速稳定性</h5>
                <el-progress 
                  :percentage="(reportData.detailed_analysis?.audio_analysis?.speed_stability || 0) * 100"
                  :stroke-width="6"
                  color="#67C23A"
                />
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- 视频分析 -->
        <el-col :span="8">
          <el-card class="analysis-card">
            <template #header>
              <div class="card-header">
                <i class="el-icon-video-camera"></i>
                <span>视频分析</span>
              </div>
            </template>
            
            <div class="analysis-content">
              <div class="metric-item">
                <span class="metric-label">眼神交流</span>
                <span class="metric-value">
                  {{ reportData.detailed_analysis?.video_analysis?.average_eye_contact || 0 }}%
                </span>
              </div>
              
              <div class="metric-item">
                <span class="metric-label">面部表情</span>
                <span class="metric-value">
                  {{ reportData.detailed_analysis?.video_analysis?.average_expression || 0 }}%
                </span>
              </div>
              
              <div class="metric-item">
                <span class="metric-label">身体姿态</span>
                <span class="metric-value">
                  {{ reportData.detailed_analysis?.video_analysis?.average_posture || 0 }}%
                </span>
              </div>
              
              <div class="consistency-info">
                <h5>视觉一致性</h5>
                <el-progress 
                  :percentage="(reportData.detailed_analysis?.video_analysis?.visual_consistency || 0) * 100"
                  :stroke-width="6"
                  color="#409EFF"
                />
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 改进建议 -->
    <div class="improvement-section">
      <el-card class="section-card">
        <template #header>
          <div class="card-header">
            <span>个性化改进建议</span>
            <el-tag type="warning">
              {{ (reportData.priority_recommendations?.length || 0) + Object.keys(reportData.improvement_suggestions || {}).length }} 项建议
            </el-tag>
          </div>
        </template>

        <!-- 优先级建议 -->
        <div v-if="reportData.priority_recommendations?.length > 0" class="priority-recommendations">
          <h4 class="section-title">
            <el-icon><Star /></el-icon>
            优先改进项目
          </h4>
          <div
            v-for="(rec, index) in reportData.priority_recommendations"
            :key="index"
            class="priority-item"
          >
            <div class="priority-header">
              <span class="capability-name">{{ rec.capability }}</span>
              <div class="priority-tags">
                <el-tag :type="getPriorityType(rec.priority)" size="small">
                  {{ rec.priority }}优先级
                </el-tag>
                <el-tag :type="getUrgencyType(rec.urgency)" size="small">
                  {{ rec.urgency }}
                </el-tag>
              </div>
            </div>
            <div class="priority-details">
              <div class="score-info">
                <span class="score">当前得分: {{ rec.score }}分</span>
                <span class="potential">改进潜力: +{{ rec.improvement_potential }}分</span>
              </div>
              <div class="progress-bar">
                <el-progress
                  :percentage="rec.score"
                  :stroke-width="8"
                  :color="getScoreColor(rec.score)"
                />
              </div>
            </div>
            <div class="action-list">
              <h5>具体行动建议:</h5>
              <ul>
                <li v-for="(action, idx) in rec.recommended_actions" :key="idx">
                  <el-icon><Check /></el-icon>
                  {{ action }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 详细建议 -->
        <div v-if="reportData.improvement_suggestions && Object.keys(reportData.improvement_suggestions).length > 0"
             class="detailed-suggestions">
          <h4 class="section-title">
            <el-icon><Document /></el-icon>
            详细改进建议
          </h4>
          <el-collapse v-model="activeSuggestions">
            <el-collapse-item
              v-for="(suggestions, capability) in reportData.improvement_suggestions"
              :key="capability"
              :title="`${capability} (${suggestions.length}条建议)`"
              :name="capability"
            >
              <ul class="suggestion-list">
                <li v-for="(suggestion, index) in suggestions" :key="index">
                  <el-icon><ArrowRight /></el-icon>
                  {{ suggestion }}
                </li>
              </ul>
            </el-collapse-item>
          </el-collapse>
        </div>

        <div v-if="!reportData.improvement_suggestions && !reportData.priority_recommendations?.length"
             class="no-suggestions">
          <el-empty description="恭喜！您的表现很好，暂无特别需要改进的地方">
            <el-button type="primary">继续保持</el-button>
          </el-empty>
        </div>
      </el-card>
    </div>

    <!-- 操作按钮 -->
    <div class="report-actions">
      <el-button type="primary" @click="downloadReport">
        <i class="el-icon-download"></i>
        下载报告
      </el-button>
      
      <el-button @click="shareReport">
        <i class="el-icon-share"></i>
        分享报告
      </el-button>
      
      <el-button @click="startNewInterview">
        <i class="el-icon-refresh"></i>
        重新面试
      </el-button>
      
      <el-button type="success" @click="viewLearningPath">
        <i class="el-icon-guide"></i>
        查看学习路径
      </el-button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Star, Document, ArrowRight, Check } from '@element-plus/icons-vue'

export default {
  name: 'InterviewReport',
  components: {
    Star,
    Document,
    ArrowRight,
    Check
  },
  props: {
    reportData: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const router = useRouter()
    const radarCanvas = ref(null)
    const showRadarDetails = ref(false)
    const activeSuggestions = ref([])
    
    // 方法
    const formatDateTime = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleString('zh-CN')
    }
    
    const getScoreColor = (score) => {
      if (score >= 90) return '#67C23A'
      if (score >= 80) return '#409EFF'
      if (score >= 70) return '#E6A23C'
      if (score >= 60) return '#F56C6C'
      return '#909399'
    }
    
    const getPerformanceLevelType = (level) => {
      const typeMap = {
        '优秀': 'success',
        '良好': 'primary',
        '中等': 'warning',
        '及格': 'danger',
        '不及格': 'info'
      }
      return typeMap[level] || 'info'
    }
    
    const getScoreLevel = (score) => {
      if (score >= 90) return '优秀'
      if (score >= 80) return '良好'
      if (score >= 70) return '中等'
      if (score >= 60) return '及格'
      return '不及格'
    }
    
    const getScoreClass = (score) => {
      if (score >= 90) return 'score-excellent'
      if (score >= 80) return 'score-good'
      if (score >= 70) return 'score-average'
      if (score >= 60) return 'score-pass'
      return 'score-fail'
    }
    
    const getCapabilityDescription = (capability) => {
      const descriptions = {
        '专业技能': '在相关技术领域的知识深度和应用能力',
        '沟通表达': '清晰表达想法和与他人有效沟通的能力',
        '逻辑思维': '分析问题、推理和解决问题的思维能力',
        '学习能力': '快速掌握新知识和适应变化的能力',
        '抗压能力': '在压力环境下保持稳定表现的能力',
        '团队协作': '与团队成员协作完成任务的能力'
      }
      return descriptions[capability] || ''
    }

    const getPriorityType = (priority) => {
      const typeMap = {
        '高': 'danger',
        '中': 'warning',
        '低': 'info'
      }
      return typeMap[priority] || 'info'
    }

    const getUrgencyType = (urgency) => {
      const typeMap = {
        '紧急': 'danger',
        '重要': 'warning',
        '一般': 'info'
      }
      return typeMap[urgency] || 'info'
    }
    
    const drawRadarChart = () => {
      if (!radarCanvas.value || !props.reportData.radar_chart_data) return
      
      const canvas = radarCanvas.value
      const ctx = canvas.getContext('2d')
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = 150
      
      // 清空画布
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const data = props.reportData.radar_chart_data
      const categories = data.categories
      const values = data.values
      const maxValue = data.max_value
      
      // 绘制网格
      ctx.strokeStyle = '#e0e0e0'
      ctx.lineWidth = 1
      
      for (let i = 1; i <= 5; i++) {
        ctx.beginPath()
        ctx.arc(centerX, centerY, (radius * i) / 5, 0, 2 * Math.PI)
        ctx.stroke()
      }
      
      // 绘制轴线和标签
      const angleStep = (2 * Math.PI) / categories.length
      
      for (let i = 0; i < categories.length; i++) {
        const angle = i * angleStep - Math.PI / 2
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius
        
        // 轴线
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(x, y)
        ctx.stroke()
        
        // 标签
        ctx.fillStyle = '#333'
        ctx.font = '12px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        
        const labelX = centerX + Math.cos(angle) * (radius + 20)
        const labelY = centerY + Math.sin(angle) * (radius + 20)
        ctx.fillText(categories[i], labelX, labelY)
      }
      
      // 绘制数据区域
      ctx.fillStyle = 'rgba(64, 158, 255, 0.2)'
      ctx.strokeStyle = '#409EFF'
      ctx.lineWidth = 2
      
      ctx.beginPath()
      for (let i = 0; i < values.length; i++) {
        const angle = i * angleStep - Math.PI / 2
        const value = values[i]
        const distance = (value / maxValue) * radius
        const x = centerX + Math.cos(angle) * distance
        const y = centerY + Math.sin(angle) * distance
        
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      
      // 绘制数据点
      ctx.fillStyle = '#409EFF'
      for (let i = 0; i < values.length; i++) {
        const angle = i * angleStep - Math.PI / 2
        const value = values[i]
        const distance = (value / maxValue) * radius
        const x = centerX + Math.cos(angle) * distance
        const y = centerY + Math.sin(angle) * distance
        
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, 2 * Math.PI)
        ctx.fill()
      }
    }
    
    const downloadReport = async () => {
      try {
        // 生成报告数据
        const reportData = {
          candidateName: props.candidateData.name,
          position: props.candidateData.position,
          interviewDate: new Date().toLocaleDateString('zh-CN'),
          overallScore: props.candidateData.overallScore,
          professionalKnowledge: props.candidateData.professionalKnowledge,
          skillMatching: props.candidateData.skillMatching,
          languageExpression: props.candidateData.languageExpression,
          logicalThinking: props.candidateData.logicalThinking,
          innovationAbility: props.candidateData.innovationAbility,
          stressResistance: props.candidateData.stressResistance
        }

        // 创建简单的文本报告
        const reportContent = `
iFlytek 面试评估报告

候选人: ${reportData.candidateName}
职位: ${reportData.position}
面试时间: ${reportData.interviewDate}

评估结果:
综合评分: ${reportData.overallScore}分
专业知识: ${reportData.professionalKnowledge}分
技能匹配: ${reportData.skillMatching}分
语言表达: ${reportData.languageExpression}分
逻辑思维: ${reportData.logicalThinking}分
创新能力: ${reportData.innovationAbility}分
抗压能力: ${reportData.stressResistance}分
        `

        // 创建下载链接
        const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `iFlytek面试报告_${reportData.candidateName}_${Date.now()}.txt`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        ElMessage.success('报告下载成功')
      } catch (error) {
        console.error('下载失败:', error)
        ElMessage.error('下载失败，请稍后重试')
      }
    }
    
    const shareReport = async () => {
      try {
        // 生成分享链接
        const shareUrl = `${window.location.origin}/report/share/${props.candidateData.name}_${Date.now()}`

        // 复制到剪贴板
        await navigator.clipboard.writeText(shareUrl)

        ElMessage.success('分享链接已复制到剪贴板')
      } catch (error) {
        console.error('分享失败:', error)
        ElMessage.error('分享失败，请稍后重试')
      }
    }
    
    const startNewInterview = () => {
      router.push('/interview-selection')
    }
    
    const viewLearningPath = () => {
      // 跳转到学习路径页面，传递sessionId
      const sessionId = props.reportData?.session_id || props.reportData?.sessionId
      if (sessionId) {
        router.push(`/learning-path/${sessionId}`)
      } else {
        router.push('/learning-path')
      }
    }
    
    // 生命周期
    onMounted(() => {
      nextTick(() => {
        drawRadarChart()
      })
    })
    
    return {
      radarCanvas,
      showRadarDetails,
      activeSuggestions,
      formatDateTime,
      getScoreColor,
      getPerformanceLevelType,
      getScoreLevel,
      getScoreClass,
      getCapabilityDescription,
      getPriorityType,
      getUrgencyType,
      downloadReport,
      shareReport,
      startNewInterview,
      viewLearningPath
    }
  }
}
</script>

<style scoped>
.interview-report {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-xl);
  background: var(--bg-secondary);
  min-height: 100vh;
  animation: fade-in 0.6s ease-out;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--gradient-tech);
  color: white;
  padding: var(--spacing-2xl);
  border-radius: var(--border-radius-2xl);
  box-shadow: var(--shadow-xl);
  margin-bottom: var(--spacing-2xl);
  position: relative;
  overflow: hidden;
}

.report-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.header-content {
  position: relative;
  z-index: 1;
}

.header-content h1 {
  margin: 0 0 var(--spacing-base) 0;
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-light);
  background: linear-gradient(45deg, #ffffff, #f0f8ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.session-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-base);
  flex-wrap: wrap;
}

.report-time {
  font-size: var(--font-size-sm);
  opacity: 0.9;
  font-weight: var(--font-weight-normal);
}

.overall-score {
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
  position: relative;
  z-index: 1;
}

.score-circle {
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-full);
  padding: var(--spacing-lg);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.score-text {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: white;
  display: block;
}

.score-label {
  font-size: var(--font-size-xs);
  color: white;
  opacity: 0.8;
  display: block;
}

.performance-level {
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-base) var(--spacing-lg);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.level-description {
  margin: 10px 0 0 0;
  color: #666;
  font-size: 14px;
  max-width: 200px;
}

.section-card {
  margin-bottom: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 500;
}

.radar-container {
  display: flex;
  gap: 40px;
  align-items: center;
}

.radar-chart {
  flex-shrink: 0;
}

.capability-scores {
  flex: 1;
}

.capability-item {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.capability-name {
  width: 80px;
  font-size: 14px;
  color: #333;
}

.capability-progress {
  flex: 1;
}

.capability-score {
  width: 50px;
  text-align: right;
  font-weight: bold;
  color: #409EFF;
}

.radar-details {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 15px;
}

.detail-item {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.detail-item h5 {
  margin: 0 0 8px 0;
  color: #409EFF;
}

.detail-item p {
  margin: 0 0 10px 0;
  font-size: 13px;
  color: #666;
  line-height: 1.4;
}

.score-analysis {
  text-align: right;
}

.score-excellent { color: #67C23A; }
.score-good { color: #409EFF; }
.score-average { color: #E6A23C; }
.score-pass { color: #F56C6C; }
.score-fail { color: #909399; }

.analysis-card {
  height: 100%;
  border-radius: 12px;
}

.analysis-content {
  padding: 10px 0;
}

.metric-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.metric-label {
  font-size: 14px;
  color: #666;
}

.metric-value {
  font-weight: bold;
  color: #333;
}

.consistency-info, .stability-info {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
}

.consistency-info h5, .stability-info h5 {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #333;
}

.consistency-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.consistency-item span {
  width: 60px;
  font-size: 12px;
  color: #666;
}

.suggestions-list {
  space-y: 20px;
}

.suggestion-item {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 20px;
}

.suggestion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.suggestion-header h4 {
  margin: 0;
  color: #333;
}

.suggestion-meta {
  display: flex;
  align-items: center;
  gap: 15px;
}

.current-score {
  font-size: 14px;
  color: #666;
}

.suggestion-content ul {
  margin: 0;
  padding-left: 20px;
}

.suggestion-content li {
  margin-bottom: 8px;
  line-height: 1.5;
  color: #555;
}

.no-suggestions {
  text-align: center;
  padding: 40px;
}

.report-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 40px;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

/* 优先级建议样式 */
.priority-recommendations {
  margin-bottom: 30px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

.priority-item {
  background: #fafafa;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.priority-item:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border-color: #409eff;
}

.priority-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.capability-name {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.priority-tags {
  display: flex;
  gap: 8px;
}

.priority-details {
  margin-bottom: 15px;
}

.score-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.score {
  font-size: 14px;
  color: #606266;
}

.potential {
  font-size: 14px;
  color: #67c23a;
  font-weight: 600;
}

.progress-bar {
  margin-bottom: 15px;
}

.action-list h5 {
  font-size: 14px;
  color: #303133;
  margin-bottom: 10px;
}

.action-list ul {
  list-style: none;
  padding: 0;
}

.action-list li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
  padding: 8px;
  background: white;
  border-radius: 4px;
  font-size: 14px;
  line-height: 1.5;
}

.detailed-suggestions {
  margin-top: 30px;
}

.suggestion-list {
  list-style: none;
  padding: 0;
}

.suggestion-list li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 10px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 6px;
  font-size: 14px;
  line-height: 1.6;
  color: #555;
}
</style>
