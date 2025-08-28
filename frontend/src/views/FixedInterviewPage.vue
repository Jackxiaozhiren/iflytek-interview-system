<template>
  <div class="fixed-interview-page">
    <!-- iFlytek Spark 面试头部 -->
    <header class="interview-header">
      <div class="header-container">
        <div class="interview-info">
          <div class="logo-section">
            <h1 class="interview-title">
              <span class="title-icon">🎯</span>
              iFlytek Spark AI智能面试
            </h1>
            <p class="interview-subtitle">智能多模态面试系统</p>
          </div>
          <div class="interview-meta">
            <div class="meta-item">
              <el-icon><User /></el-icon>
              <span class="meta-label">候选人</span>
              <span class="meta-value">张三</span>
            </div>
            <div class="meta-item">
              <el-icon><House /></el-icon>
              <span class="meta-label">职位</span>
              <span class="meta-value">AI工程师</span>
            </div>
            <div class="meta-item">
              <el-icon><Clock /></el-icon>
              <span class="meta-label">用时</span>
              <span class="meta-value">{{ formatTime(elapsedTime) }}</span>
            </div>
          </div>
        </div>
        
        <div class="interview-status">
          <div class="status-indicator" :class="{ active: isActive }">
            <div class="status-dot"></div>
            <span class="status-text">{{ isActive ? 'AI助手活跃中' : 'AI助手待机' }}</span>
          </div>
          <div class="interview-progress">
            <div class="progress-header">
              <span class="progress-text">面试进度</span>
              <span class="progress-numbers">{{ currentQuestion }}/{{ totalQuestions }}</span>
            </div>
            <el-progress 
              :percentage="progressPercentage" 
              :stroke-width="6"
              color="#1890ff"
            />
          </div>
        </div>
      </div>
    </header>

    <!-- 主要面试区域 -->
    <main class="interview-main">
      <div class="main-container">
        <!-- 左侧：候选人交互区域 -->
        <section class="candidate-section">
          <div class="interaction-card">
            <div class="interview-frame">
              <div class="interview-placeholder">
                <div class="placeholder-content">
                  <el-icon class="placeholder-icon"><User /></el-icon>
                  <h3>iFlytek Spark 智能面试进行中</h3>
                  <p>请专注于回答问题，AI正在进行实时智能分析</p>
                </div>
              </div>
            </div>
            
            <div class="candidate-info">
              <div class="info-header">
                <h4>候选人信息</h4>
              </div>
              <div class="info-content">
                <div class="info-item">
                  <span class="info-label">姓名：</span>
                  <span class="info-value">张三</span>
                </div>
                <div class="info-item">
                  <span class="info-label">职位：</span>
                  <span class="info-value">AI工程师</span>
                </div>
                <div class="info-item">
                  <span class="info-label">技能：</span>
                  <div class="skills-tags">
                    <el-tag size="small" v-for="skill in skills" :key="skill">{{ skill }}</el-tag>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 右侧：AI面试官区域 -->
        <section class="ai-section">
          <div class="ai-interviewer-card">
            <div class="ai-header">
              <div class="ai-avatar">
                <el-icon class="ai-icon"><Cpu /></el-icon>
              </div>
              <div class="ai-info">
                <h3>iFlytek Spark AI面试官</h3>
                <p class="ai-status">{{ aiStatus }}</p>
              </div>
              <div class="question-counter">
                <span class="counter-text">第 {{ currentQuestion }} 题</span>
              </div>
            </div>
            
            <div class="question-content">
              <div class="question-header">
                <span class="question-label">当前问题</span>
                <el-tag type="primary" size="small">{{ questionDifficulty }}</el-tag>
              </div>
              <div class="question-text">
                {{ currentQuestionText }}
              </div>
            </div>
            
            <div class="answer-area">
              <el-input
                v-model="answer"
                type="textarea"
                :rows="6"
                placeholder="请在此输入您的回答..."
                class="answer-input"
              />
              <div class="answer-actions">
                <div class="char-count">{{ answer.length }}/1000</div>
                <el-button type="primary" @click="submitAnswer" :disabled="!answer.trim()">
                  提交回答
                </el-button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- 底部控制栏 -->
    <footer class="interview-footer">
      <div class="footer-container">
        <div class="footer-left">
          <el-button @click="pauseInterview">
            <el-icon><VideoPause /></el-icon>
            暂停面试
          </el-button>
        </div>
        
        <div class="footer-center">
          <div class="ai-analysis">
            <el-icon class="analysis-icon"><TrendCharts /></el-icon>
            <span>iFlytek Spark AI正在实时分析您的表现...</span>
          </div>
        </div>
        
        <div class="footer-right">
          <el-button type="primary" @click="nextQuestion" :disabled="!canProceed">
            {{ isLastQuestion ? '完成面试' : '下一题' }}
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  User, House, Clock, Cpu, VideoPause, TrendCharts, ArrowRight 
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()

// 面试状态
const currentQuestion = ref(1)
const totalQuestions = ref(10)
const elapsedTime = ref(0)
const isActive = ref(true)
const answer = ref('')
const canProceed = ref(false)

// 面试数据
const skills = ref(['Python', 'TensorFlow', '机器学习', '深度学习'])
const aiStatus = ref('等待您的回答')
const questionDifficulty = ref('中等')
const currentQuestionText = ref('请介绍一下您在人工智能领域的项目经验，特别是在机器学习算法优化方面的实践。')

// 计算属性
const progressPercentage = computed(() => {
  return Math.round((currentQuestion.value / totalQuestions.value) * 100)
})

const isLastQuestion = computed(() => {
  return currentQuestion.value === totalQuestions.value
})

// 方法
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const submitAnswer = () => {
  if (!answer.value.trim()) return
  
  ElMessage.success('回答已提交')
  canProceed.value = true
  answer.value = ''
}

const nextQuestion = () => {
  if (isLastQuestion.value) {
    ElMessage.success('面试完成！')
    router.push('/interview-result')
  } else {
    currentQuestion.value++
    canProceed.value = false
    ElMessage.info(`进入第 ${currentQuestion.value} 题`)
  }
}

const pauseInterview = () => {
  ElMessage.info('面试已暂停')
}

// 定时器
let timer = null

onMounted(() => {
  timer = setInterval(() => {
    elapsedTime.value++
  }, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.fixed-interview-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%);
  display: flex;
  flex-direction: column;
  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
}

/* 头部样式 */
.interview-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  padding: 20px 0;
  border-bottom: 1px solid rgba(24, 144, 255, 0.1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 32px;
}

.interview-info {
  flex: 1;
  min-width: 0;
}

.logo-section {
  margin-bottom: 16px;
}

.interview-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 6px 0;
  color: #1890ff;
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  font-size: 20px;
}

.interview-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.interview-meta {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(24, 144, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(24, 144, 255, 0.1);
}

.meta-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.meta-value {
  font-size: 12px;
  color: #2c3e50;
  font-weight: 600;
}

.interview-status {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 300px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  border: 1px solid rgba(24, 144, 255, 0.2);
}

.status-indicator.active {
  border-color: #52c41a;
  background: rgba(82, 196, 26, 0.1);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #d9d9d9;
}

.status-indicator.active .status-dot {
  background: #52c41a;
}

.status-text {
  font-size: 12px;
  font-weight: 500;
  color: #2c3e50;
}

.interview-progress {
  background: rgba(255, 255, 255, 0.9);
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(24, 144, 255, 0.1);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-text {
  font-size: 12px;
  font-weight: 600;
  color: #2c3e50;
}

.progress-numbers {
  font-size: 12px;
  color: #1890ff;
  font-weight: 600;
}

/* 主要面试区域 */
.interview-main {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.main-container {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: start;
  min-height: calc(100vh - 200px);
}

.candidate-section,
.ai-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.interaction-card,
.ai-interviewer-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(24, 144, 255, 0.1);
}

.interview-frame {
  margin-bottom: 20px;
}

.interview-placeholder {
  background: #f8fafc;
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  border: 2px dashed #e2e8f0;
}

.placeholder-icon {
  font-size: 48px;
  color: #1890ff;
  margin-bottom: 16px;
}

.placeholder-content h3 {
  font-size: 18px;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.placeholder-content p {
  color: #64748b;
  margin: 0;
}

.candidate-info {
  border-top: 1px solid #f0f2f5;
  padding-top: 16px;
}

.info-header h4 {
  font-size: 16px;
  color: #2c3e50;
  margin: 0 0 12px 0;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.info-label {
  font-size: 14px;
  color: #64748b;
  min-width: 60px;
}

.info-value {
  font-size: 14px;
  color: #2c3e50;
  font-weight: 500;
}

.skills-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.ai-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.ai-avatar {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai-icon {
  font-size: 24px;
  color: white;
}

.ai-info {
  flex: 1;
}

.ai-info h3 {
  font-size: 16px;
  color: #2c3e50;
  margin: 0 0 4px 0;
}

.ai-status {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.counter-text {
  font-size: 12px;
  color: #1890ff;
  font-weight: 600;
}

.question-content {
  margin-bottom: 20px;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.question-label {
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
}

.question-text {
  font-size: 16px;
  line-height: 1.6;
  color: #2c3e50;
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #1890ff;
}

.answer-area {
  margin-top: 16px;
}

.answer-input {
  margin-bottom: 12px;
}

.answer-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.char-count {
  font-size: 12px;
  color: #94a3b8;
}

/* 底部控制栏 */
.interview-footer {
  background: white;
  border-top: 1px solid #f1f5f9;
  padding: 16px 0;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-center {
  flex: 1;
  text-align: center;
}

.ai-analysis {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #64748b;
  font-size: 14px;
}

.analysis-icon {
  color: #1890ff;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .main-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .header-container {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .interview-status {
    max-width: none;
  }
}

@media (max-width: 768px) {
  .interview-main {
    padding: 16px;
  }
  
  .header-container {
    padding: 0 16px;
  }
  
  .interview-title {
    font-size: 20px;
  }
  
  .interview-meta {
    gap: 12px;
  }
  
  .interaction-card,
  .ai-interviewer-card {
    padding: 16px;
  }
  
  .footer-container {
    flex-direction: column;
    gap: 12px;
    padding: 0 16px;
  }
  
  .footer-left,
  .footer-right {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  
  .footer-center {
    order: -1;
  }
}

@media (max-width: 480px) {
  .interview-title {
    font-size: 18px;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .interview-meta {
    flex-direction: column;
    gap: 8px;
  }
  
  .ai-header {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
}
</style>
