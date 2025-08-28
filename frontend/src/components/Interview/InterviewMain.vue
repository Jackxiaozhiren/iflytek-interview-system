<template>
  <div class="interview-main">
    <!-- 增强版面试头部信息 -->
    <div class="interview-header enhanced-header">
      <div class="session-info">
        <div class="title-section">
          <h2 class="animated-title">
            <el-icon class="domain-icon"><Document /></el-icon>
            {{ domainName }} - {{ positionName }}
          </h2>
          <el-tag class="session-tag" type="success" effect="dark">
            会话 #{{ sessionId }}
          </el-tag>
        </div>
        <div class="progress-info enhanced-progress">
          <div class="progress-text">
            <span class="current-progress">题目进度: {{ currentQuestionIndex + 1 }} / {{ totalQuestions }}</span>
            <span class="completion-rate">完成率: {{ progressPercentage }}%</span>
          </div>
          <el-progress
            :percentage="progressPercentage"
            :stroke-width="12"
            :color="progressColor"
            :show-text="false"
            class="enhanced-progress-bar"
          />
        </div>
      </div>
      <div class="timer-section">
        <div class="timer enhanced-timer">
          <el-icon class="timer-icon"><Clock /></el-icon>
          <div class="time-display">
            <span class="time-value">{{ formatTime(elapsedTime) }}</span>
            <span class="time-label">已用时间</span>
          </div>
        </div>
        <div class="status-indicators">
          <el-tooltip content="网络连接状态" placement="bottom">
            <el-icon class="status-icon" :class="{ 'connected': isConnected }">
              <Grid />
            </el-icon>
          </el-tooltip>
          <el-tooltip content="分析状态" placement="bottom">
            <el-icon class="status-icon" :class="{ 'analyzing': isAnalyzing }">
              <Loading />
            </el-icon>
          </el-tooltip>
        </div>
      </div>
    </div>

    <!-- 面试内容区域 -->
    <div class="interview-content">
      <!-- 增强版题目显示区 -->
      <div class="question-section enhanced-question">
        <div class="question-header">
          <div class="header-left">
            <h3 class="question-title">
              <el-icon class="question-icon"><QuestionFilled /></el-icon>
              面试题目
            </h3>
            <div class="question-meta">
              <el-tag :type="difficultyColor" size="large" effect="dark">
                {{ currentQuestion?.difficulty || '中等' }}
              </el-tag>
              <el-tag type="info" size="large" effect="plain">
                {{ currentQuestion?.type || '技术问题' }}
              </el-tag>
            </div>
          </div>
          <div class="header-right">
            <el-tooltip content="朗读题目" placement="top">
              <el-button
                circle
                size="large"
                :icon="isReading ? 'VideoPause' : 'VideoPlay'"
                @click="toggleQuestionReading"
                :loading="isReading"
              />
            </el-tooltip>
            <el-tooltip content="题目提示" placement="top">
              <el-button
                circle
                size="large"
                icon="InfoFilled"
                @click="showQuestionHint"
              />
            </el-tooltip>
          </div>
        </div>
        <div class="question-content enhanced-content">
          <div class="question-text" :class="{ 'reading': isReading }">
            <p>{{ currentQuestion?.question || '正在加载题目...' }}</p>
          </div>
          <div class="question-details" v-if="currentQuestion?.details">
            <el-collapse v-model="activeCollapse">
              <el-collapse-item title="题目要求" name="requirements">
                <ul class="requirements-list">
                  <li v-for="req in currentQuestion.requirements" :key="req">{{ req }}</li>
                </ul>
              </el-collapse-item>
              <el-collapse-item title="评分标准" name="criteria">
                <div class="criteria-grid">
                  <div v-for="criterion in currentQuestion.criteria" :key="criterion.name" class="criterion-item">
                    <span class="criterion-name">{{ criterion.name }}</span>
                    <span class="criterion-weight">{{ criterion.weight }}%</span>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </div>

      <!-- 增强版多模态输入区 -->
      <div class="input-section enhanced-input">
        <div class="input-header">
          <h4 class="input-title">
            <el-icon><Setting /></el-icon>
            选择回答方式
          </h4>
          <div class="input-tips">
            <el-alert
              :title="getInputTip(activeTab)"
              type="info"
              :closable="false"
              show-icon
            />
          </div>
        </div>

        <el-tabs v-model="activeTab" @tab-click="handleTabClick" class="enhanced-tabs">
          <!-- 文本回答 -->
          <el-tab-pane name="text">
            <template #label>
              <span class="tab-label">
                <el-icon><Document /></el-icon>
                文本回答
              </span>
            </template>
            <div class="text-input enhanced-text-input">
              <div class="input-toolbar">
                <el-button-group>
                  <el-button size="small" @click="insertTemplate('技术方案')">
                    <el-icon><Document /></el-icon>
                    技术方案
                  </el-button>
                  <el-button size="small" @click="insertTemplate('项目经验')">
                    <el-icon><Folder /></el-icon>
                    项目经验
                  </el-button>
                  <el-button size="small" @click="insertTemplate('问题解决')">
                    <el-icon><Setting /></el-icon>
                    问题解决
                  </el-button>
                </el-button-group>
                <div class="input-actions">
                  <el-button size="small" @click="clearText" :disabled="!textResponse">
                    <el-icon><Close /></el-icon>
                    清空
                  </el-button>
                  <el-button size="small" @click="formatText" :disabled="!textResponse">
                    <el-icon><Promotion /></el-icon>
                    格式化
                  </el-button>
                </div>
              </div>
              <el-input
                v-model="textResponse"
                type="textarea"
                :rows="10"
                placeholder="请在此输入您的回答...&#10;&#10;💡 提示：&#10;• 结构化表达：首先、其次、最后&#10;• 具体举例：结合实际项目经验&#10;• 技术深度：展示专业知识和思考过程"
                :disabled="isSubmitting"
                class="enhanced-textarea"
                @input="handleTextInput"
              />
              <div class="input-stats enhanced-stats">
                <div class="stats-left">
                  <el-tag size="small" type="info">字数: {{ textResponse.length }}</el-tag>
                  <el-tag size="small" type="success">预计用时: {{ Math.ceil(textResponse.length / 5) }}秒</el-tag>
                  <el-tag size="small" :type="getWordCountType(textResponse.length)">
                    {{ getWordCountStatus(textResponse.length) }}
                  </el-tag>
                </div>
                <div class="stats-right">
                  <el-progress
                    :percentage="Math.min(100, (textResponse.length / 500) * 100)"
                    :stroke-width="4"
                    :show-text="false"
                    :color="getProgressColor(textResponse.length)"
                  />
                </div>
              </div>
              </div>
            </div>
          </el-tab-pane>




        </el-tabs>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button 
          type="primary" 
          @click="submitResponse"
          :loading="isSubmitting"
          :disabled="!hasValidResponse"
        >
          提交回答
        </el-button>
        
        <el-button 
          @click="skipQuestion"
          :disabled="isSubmitting"
        >
          跳过此题
        </el-button>
        
        <el-button 
          type="danger"
          @click="endInterview"
          :disabled="isSubmitting"
        >
          结束面试
        </el-button>
      </div>
    </div>

    <!-- 简化的实时反馈面板 -->
    <div v-if="showAnalysis" class="analysis-panel">
      <h4>实时反馈</h4>
      <div class="analysis-content">
        <div v-if="lastAnalysis" class="basic-analysis">
          <p>整体评分: {{ lastAnalysis.overallScore || 0 }}分</p>
          <p>技术能力: {{ lastAnalysis.technicalCompetency || 0 }}分</p>
          <p>沟通技巧: {{ lastAnalysis.communicationSkills || 0 }}分</p>
        </div>
        
        <div v-if="lastAnalysis?.video_analysis" class="video-analysis">
          <h5>视频分析</h5>
          <p>眼神交流: {{ lastAnalysis.video_analysis.eye_contact_score }}%</p>
          <p>面部表情: {{ lastAnalysis.video_analysis.facial_expression_score }}%</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { interviewApi } from '@/api/interview'

export default {
  name: 'InterviewMain',
  props: {
    sessionId: {
      type: Number,
      required: true
    },
    domain: {
      type: String,
      required: true
    },
    position: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const router = useRouter()
    
    // 响应式数据
    const currentQuestion = ref(null)
    const currentQuestionIndex = ref(0)
    const totalQuestions = ref(0)
    const activeTab = ref('text')
    const textResponse = ref('')
    const isSubmitting = ref(false)
    const showAnalysis = ref(false)
    const lastAnalysis = ref(null)
    
    // 计时相关
    const startTime = ref(Date.now())
    const elapsedTime = ref(0)
    const timer = ref(null)
    
    // 录音相关
    const isRecording = ref(false)
    const recordingTime = ref(0)
    const audioBlob = ref(null)
    const audioUrl = ref('')
    const mediaRecorder = ref(null)
    const recordingTimer = ref(null)
    
    // 视频相关
    const isVideoRecording = ref(false)
    const videoRecordingTime = ref(0)
    const videoStream = ref(null)
    const videoRecorder = ref(null)
    const videoBlob = ref(null)
    const videoElement = ref(null)

    // 增强功能的响应式数据
    const isConnected = ref(true)
    const isAnalyzing = ref(false)
    const isReading = ref(false)
    const activeCollapse = ref([])
    const textInputHistory = ref([])
    const autoSaveTimer = ref(null)
    
    // 计算属性
    const domainName = computed(() => props.domain)
    const positionName = computed(() => props.position)
    const progressPercentage = computed(() => {
      return totalQuestions.value > 0 ?
        ((currentQuestionIndex.value + 1) / totalQuestions.value) * 100 : 0
    })

    const progressColor = computed(() => {
      const percentage = progressPercentage.value
      if (percentage < 30) return '#f56c6c'
      if (percentage < 70) return '#e6a23c'
      return '#67c23a'
    })
    
    const difficultyColor = computed(() => {
      const difficulty = currentQuestion.value?.difficulty
      switch(difficulty) {
        case 'easy': return 'success'
        case 'medium': return 'warning'
        case 'hard': return 'danger'
        default: return 'info'
      }
    })
    
    const hasValidResponse = computed(() => {
      switch(activeTab.value) {
        case 'text':
          return textResponse.value.trim().length > 0
        case 'audio':
          return audioBlob.value !== null
        case 'video':
          return videoBlob.value !== null
        default:
          return false
      }
    })
    
    // 方法
    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    
    const startTimer = () => {
      timer.value = setInterval(() => {
        elapsedTime.value = Math.floor((Date.now() - startTime.value) / 1000)
      }, 1000)
    }
    
    const loadCurrentQuestion = async () => {
      try {
        const response = await interviewApi.getCurrentQuestion(props.sessionId)
        if (response.finished) {
          await endInterview()
          return
        }
        
        currentQuestion.value = response.question
        currentQuestionIndex.value = response.current_index
        totalQuestions.value = response.total_questions
      } catch (error) {
        ElMessage.error('加载题目失败: ' + error.message)
      }
    }
    
    const submitResponse = async () => {
      if (!hasValidResponse.value) {
        ElMessage.warning('请先完成回答')
        return
      }
      
      isSubmitting.value = true
      
      try {
        // 准备提交数据
        const submitData = {
          session_id: props.sessionId,
          question_text: currentQuestion.value.question,
          text_data: textResponse.value
        }
        
        // 如果有音频数据
        if (activeTab.value === 'audio' && audioBlob.value) {
          const audioBase64 = await blobToBase64(audioBlob.value)
          submitData.audio_data = audioBase64
        }
        
        // 如果有视频数据
        if (activeTab.value === 'video' && videoBlob.value) {
          const videoBase64 = await blobToBase64(videoBlob.value)
          submitData.video_data = videoBase64
        }
        
        // 提交多模态分析
        const analysisResult = await interviewApi.analyzeMultimodal(submitData)
        lastAnalysis.value = analysisResult.analysis_results
        
        ElMessage.success('回答提交成功')
        
        // 移动到下一题
        await moveToNextQuestion()
        
      } catch (error) {
        ElMessage.error('提交失败: ' + error.message)
      } finally {
        isSubmitting.value = false
      }
    }
    
    const moveToNextQuestion = async () => {
      try {
        const response = await interviewApi.moveToNextQuestion(props.sessionId)
        
        if (response.has_next) {
          currentQuestion.value = response.question
          currentQuestionIndex.value = response.current_index
          clearAllInputs()
        } else {
          ElMessage.success('面试已完成!')
          await endInterview()
        }
      } catch (error) {
        ElMessage.error('获取下一题失败: ' + error.message)
      }
    }
    
    const clearAllInputs = () => {
      textResponse.value = ''
      clearAudio()
      clearVideo()
    }
    
    const blobToBase64 = (blob) => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result.split(',')[1])
        reader.readAsDataURL(blob)
      })
    }
    
    // 生命周期
    // 增强功能方法
    const getInputTip = (tabName) => {
      const tips = {
        text: '💡 建议：结构化表达，使用"首先、其次、最后"等逻辑词',
        audio: '🎤 建议：保持清晰的语速，避免长时间停顿',
        video: '📹 建议：保持良好的眼神接触和自然的肢体语言'
      }
      return tips[tabName] || '请选择合适的回答方式'
    }

    const getWordCountType = (count) => {
      if (count < 50) return 'warning'
      if (count < 200) return 'success'
      if (count < 500) return 'primary'
      return 'danger'
    }

    const getWordCountStatus = (count) => {
      if (count < 50) return '内容较少'
      if (count < 200) return '内容适中'
      if (count < 500) return '内容丰富'
      return '内容过多'
    }

    const getProgressColor = (count) => {
      if (count < 100) return '#f56c6c'
      if (count < 300) return '#e6a23c'
      return '#67c23a'
    }

    const insertTemplate = (type) => {
      const templates = {
        '技术方案': '\n\n## 技术方案\n\n**技术选型：**\n- \n\n**实现思路：**\n1. \n2. \n3. \n\n**关键技术点：**\n- \n\n',
        '项目经验': '\n\n## 项目经验\n\n**项目背景：**\n\n\n**我的职责：**\n- \n\n**技术难点：**\n\n\n**解决方案：**\n\n\n**项目成果：**\n\n',
        '问题解决': '\n\n## 问题解决\n\n**问题描述：**\n\n\n**分析过程：**\n1. \n2. \n3. \n\n**解决方案：**\n\n\n**经验总结：**\n\n'
      }
      textResponse.value += templates[type] || ''
    }

    const clearText = () => {
      if (textResponse.value) {
        textInputHistory.value.push(textResponse.value)
        textResponse.value = ''
        ElMessage.success('文本已清空，可通过撤销恢复')
      }
    }

    const formatText = () => {
      if (textResponse.value) {
        let formatted = textResponse.value
          .replace(/([。！？])\s*/g, '$1\n\n')
          .replace(/([：])\s*/g, '$1\n')
          .replace(/\n{3,}/g, '\n\n')
          .trim()

        textResponse.value = formatted
        ElMessage.success('文本格式化完成')
      }
    }

    const handleTextInput = () => {
      if (autoSaveTimer.value) {
        clearTimeout(autoSaveTimer.value)
      }
      autoSaveTimer.value = setTimeout(() => {
        localStorage.setItem(`interview_text_${props.sessionId}`, textResponse.value)
      }, 1000)
    }

    const toggleQuestionReading = () => {
      if (isReading.value) {
        speechSynthesis.cancel()
        isReading.value = false
      } else {
        const utterance = new SpeechSynthesisUtterance(currentQuestion.value?.question || '')
        utterance.lang = 'zh-CN'
        utterance.rate = 0.8
        utterance.onstart = () => { isReading.value = true }
        utterance.onend = () => { isReading.value = false }
        utterance.onerror = () => { isReading.value = false }
        speechSynthesis.speak(utterance)
      }
    }

    const showQuestionHint = () => {
      ElMessageBox.alert(
        '💡 回答提示：\n\n• 结合具体项目经验\n• 展示技术深度和广度\n• 说明解决问题的思路\n• 体现学习和成长能力',
        '题目提示',
        {
          confirmButtonText: '知道了',
          type: 'info'
        }
      )
    }

    onMounted(async () => {
      startTimer()
      await loadCurrentQuestion()
      await initMediaDevices()

      // 恢复自动保存的文本
      const savedText = localStorage.getItem(`interview_text_${props.sessionId}`)
      if (savedText) {
        textResponse.value = savedText
      }
    })

    onUnmounted(() => {
      if (timer.value) clearInterval(timer.value)
      if (recordingTimer.value) clearInterval(recordingTimer.value)
      if (autoSaveTimer.value) clearTimeout(autoSaveTimer.value)
      if (videoStream.value) {
        videoStream.value.getTracks().forEach(track => track.stop())
      }
      speechSynthesis.cancel()
    })
    
    return {
      // 数据
      currentQuestion,
      currentQuestionIndex,
      totalQuestions,
      activeTab,
      textResponse,
      isSubmitting,
      showAnalysis,
      lastAnalysis,
      elapsedTime,
      isRecording,
      recordingTime,
      audioBlob,
      audioUrl,
      isVideoRecording,
      videoRecordingTime,
      videoStream,
      videoElement,
      
      // 计算属性
      domainName,
      positionName,
      progressPercentage,
      difficultyColor,
      hasValidResponse,
      
      // 增强功能数据
      isConnected,
      isAnalyzing,
      isReading,
      activeCollapse,
      progressColor,

      // 方法
      formatTime,
      submitResponse,
      moveToNextQuestion,
      endInterview,
      handleTabClick,
      startRecording,
      stopRecording,
      playAudio,
      startVideoRecording,
      stopVideoRecording,
      blobToBase64,

      // 增强功能方法
      getInputTip,
      getWordCountType,
      getWordCountStatus,
      getProgressColor,
      insertTemplate,
      clearText,
      formatText,
      handleTextInput,
      toggleQuestionReading,
      showQuestionHint
    }
  }
}
</script>

<style scoped>
.interview-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.interview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.session-info h2 {
  margin: 0 0 10px 0;
  color: #333;
}

.progress-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.timer {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: bold;
  color: #409EFF;
}

.interview-content {
  display: grid;
  gap: 30px;
}

.question-section {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.question-content p {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  margin: 0;
}

.input-section {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.text-input {
  position: relative;
}

.input-stats {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 12px;
  color: #666;
}

.audio-controls, .video-controls {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.recording-time {
  color: #f56c6c;
  font-weight: bold;
}

.video-preview video {
  width: 100%;
  max-width: 400px;
  border-radius: 8px;
  border: 2px solid #ddd;
}

.video-preview video.recording {
  border-color: #f56c6c;
  box-shadow: 0 0 10px rgba(245, 108, 108, 0.3);
}

.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  padding: 20px;
}

.analysis-panel {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-top: 20px;
}

.analysis-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 15px;
}

.analysis-content > div {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
}

.analysis-content h5 {
  margin: 0 0 10px 0;
  color: #409EFF;
}

.analysis-content p {
  margin: 5px 0;
  font-size: 14px;
}

/* 增强版样式 */
.enhanced-header {
  background: linear-gradient(135deg, #4c51bf 0%, #6b21a8 100%);
  color: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.title-section {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.animated-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  animation: fadeInUp 0.6s ease-out;
}

.enhanced-progress {
  background: rgba(255,255,255,0.1);
  padding: 15px;
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.progress-text {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
}

.enhanced-timer {
  background: rgba(255,255,255,0.15);
  padding: 15px 20px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

.time-display {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.time-value {
  font-size: 20px;
  font-weight: bold;
  font-family: 'Courier New', monospace;
}

.enhanced-question {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border: 1px solid #e9ecef;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.question-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  color: #2c3e50;
}

.question-meta {
  display: flex;
  gap: 10px;
}

.enhanced-content {
  position: relative;
}

.question-text {
  font-size: 16px;
  line-height: 1.8;
  color: #2c3e50;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #409eff;
  transition: all 0.3s ease;
}

.question-text.reading {
  background: #e3f2fd;
  border-left-color: #2196f3;
  animation: pulse 2s infinite;
}

.enhanced-input {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border: 1px solid #e9ecef;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.input-header {
  margin-bottom: 20px;
}

.input-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 15px 0;
  color: #2c3e50;
}

.enhanced-tabs .el-tabs__header {
  margin-bottom: 20px;
}

.tab-label {
  display: flex;
  align-items: center;
  gap: 6px;
}

.enhanced-text-input {
  position: relative;
}

.input-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 6px;
}

.enhanced-textarea {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.enhanced-textarea:focus-within {
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.enhanced-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 6px;
}

.stats-left {
  display: flex;
  gap: 8px;
}

.stats-right {
  width: 100px;
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .interview-main {
    padding: 10px;
  }

  .enhanced-header {
    padding: 15px;
  }

  .title-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .timer-section {
    flex-direction: column;
    gap: 10px;
  }

  .input-toolbar {
    flex-direction: column;
    gap: 10px;
  }

  .enhanced-stats {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
