<template>
  <div class="assessment-exam-page">
    <!-- 页面头部 -->
    <div class="exam-header">
      <div class="header-container">
        <div class="exam-info">
          <h1>{{ currentAssessment.title }}</h1>
          <p>{{ currentAssessment.description }}</p>
        </div>
        <div class="exam-progress">
          <div class="progress-info">
            <span>进度: {{ currentQuestionIndex + 1 }}/{{ questions.length }}</span>
            <span>剩余时间: {{ formatTime(remainingTime) }}</span>
          </div>
          <el-progress 
            :percentage="progressPercentage" 
            :stroke-width="8"
            color="#1890ff"
          />
        </div>
      </div>
    </div>

    <!-- 题目内容 -->
    <div class="exam-content">
      <div class="content-container">
        <div class="question-card">
          <div class="question-header">
            <div class="question-number">
              第 {{ currentQuestionIndex + 1 }} 题
            </div>
            <div class="question-type">
              <el-tag :type="getQuestionTypeColor(currentQuestion.type)">
                {{ getQuestionTypeName(currentQuestion.type) }}
              </el-tag>
            </div>
          </div>
          
          <div class="question-content">
            <h3>{{ currentQuestion.title }}</h3>
            <div class="question-description" v-html="currentQuestion.description"></div>
            
            <!-- 选择题 -->
            <div v-if="currentQuestion.type === 'choice'" class="question-options">
              <el-radio-group v-model="currentAnswer" size="large">
                <div 
                  v-for="(option, index) in currentQuestion.options" 
                  :key="index"
                  class="option-item"
                >
                  <el-radio :value="option.value" class="option-radio">
                    <div class="option-content">
                      <div class="option-label">{{ option.label }}</div>
                      <div class="option-text">{{ option.text }}</div>
                    </div>
                  </el-radio>
                </div>
              </el-radio-group>
            </div>
            
            <!-- 多选题 -->
            <div v-else-if="currentQuestion.type === 'multiple'" class="question-options">
              <el-checkbox-group v-model="currentAnswer" size="large">
                <div 
                  v-for="(option, index) in currentQuestion.options" 
                  :key="index"
                  class="option-item"
                >
                  <el-checkbox :value="option.value" class="option-checkbox">
                    <div class="option-content">
                      <div class="option-label">{{ option.label }}</div>
                      <div class="option-text">{{ option.text }}</div>
                    </div>
                  </el-checkbox>
                </div>
              </el-checkbox-group>
            </div>
            
            <!-- 文本题 -->
            <div v-else-if="currentQuestion.type === 'text'" class="question-input">
              <el-input
                v-model="currentAnswer"
                type="textarea"
                :rows="6"
                placeholder="请输入您的答案..."
                maxlength="1000"
                show-word-limit
              />
            </div>
            
            <!-- 代码题 -->
            <div v-else-if="currentQuestion.type === 'code'" class="question-code">
              <div class="code-editor">
                <el-input
                  v-model="currentAnswer"
                  type="textarea"
                  :rows="12"
                  placeholder="请输入您的代码..."
                  class="code-textarea"
                />
              </div>
              <div class="code-info">
                <el-tag type="info">语言: {{ currentQuestion.language || 'JavaScript' }}</el-tag>
                <el-tag type="warning">时间限制: {{ currentQuestion.timeLimit || '1000ms' }}</el-tag>
              </div>
            </div>
          </div>
          
          <div class="question-actions">
            <el-button 
              @click="previousQuestion" 
              :disabled="currentQuestionIndex === 0"
            >
              上一题
            </el-button>
            <el-button 
              type="primary" 
              @click="nextQuestion"
              :disabled="!isAnswered"
            >
              {{ isLastQuestion ? '提交评估' : '下一题' }}
            </el-button>
          </div>
        </div>
        
        <!-- 题目导航 -->
        <div class="question-navigation">
          <h4>题目导航</h4>
          <div class="nav-grid">
            <div
              v-for="(question, index) in questions"
              :key="index"
              class="nav-item"
              :class="{
                'current': index === currentQuestionIndex,
                'answered': answers[index] !== undefined && answers[index] !== null && answers[index] !== '',
                'unanswered': answers[index] === undefined || answers[index] === null || answers[index] === ''
              }"
              @click="goToQuestion(index)"
            >
              {{ index + 1 }}
            </div>
          </div>
          
          <div class="nav-summary">
            <div class="summary-item">
              <span class="summary-label">已答题:</span>
              <span class="summary-value">{{ answeredCount }}/{{ questions.length }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">剩余:</span>
              <span class="summary-value">{{ remainingCount }}</span>
            </div>
          </div>
          
          <el-button 
            type="danger" 
            @click="submitAssessment"
            :disabled="answeredCount === 0"
            class="submit-btn"
          >
            提交评估
          </el-button>
        </div>
      </div>
    </div>

    <!-- 提交确认对话框 -->
    <el-dialog
      v-model="showSubmitDialog"
      title="确认提交评估"
      width="400px"
      center
    >
      <div class="submit-summary">
        <p>您即将提交评估，请确认以下信息：</p>
        <div class="summary-stats">
          <div class="stat-item">
            <span>总题数:</span>
            <span>{{ questions.length }}</span>
          </div>
          <div class="stat-item">
            <span>已答题:</span>
            <span>{{ answeredCount }}</span>
          </div>
          <div class="stat-item">
            <span>未答题:</span>
            <span>{{ remainingCount }}</span>
          </div>
        </div>
        <p class="warning-text">提交后将无法修改答案，确定要提交吗？</p>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showSubmitDialog = false">取消</el-button>
          <el-button type="primary" @click="confirmSubmit">确认提交</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElNotification } from 'element-plus'

const router = useRouter()
const route = useRoute()

// 响应式数据
const currentQuestionIndex = ref(0)
const answers = ref({})
const remainingTime = ref(45 * 60) // 45分钟，单位秒
const showSubmitDialog = ref(false)
const timer = ref(null)

// 当前评估信息
const currentAssessment = ref({
  id: route.query.type || 'technical',
  title: '技术能力评估',
  description: '评估编程、算法、系统设计等技术技能',
  duration: 45,
  questionCount: 25
})

// 题目数据
const questions = ref([
  {
    id: 1,
    type: 'choice',
    title: 'JavaScript中哪个方法用于向数组末尾添加元素？',
    description: '请选择正确的答案',
    options: [
      { label: 'A', value: 'push', text: 'push()' },
      { label: 'B', value: 'pop', text: 'pop()' },
      { label: 'C', value: 'shift', text: 'shift()' },
      { label: 'D', value: 'unshift', text: 'unshift()' }
    ],
    correctAnswer: 'push',
    difficulty: 'easy'
  },
  {
    id: 2,
    type: 'multiple',
    title: '以下哪些是Vue.js的核心特性？',
    description: '请选择所有正确的答案',
    options: [
      { label: 'A', value: 'reactive', text: '响应式数据绑定' },
      { label: 'B', value: 'component', text: '组件化开发' },
      { label: 'C', value: 'virtual-dom', text: '虚拟DOM' },
      { label: 'D', value: 'jquery', text: 'jQuery集成' }
    ],
    correctAnswer: ['reactive', 'component', 'virtual-dom'],
    difficulty: 'medium'
  },
  {
    id: 3,
    type: 'text',
    title: '请解释什么是闭包，并举一个实际应用的例子',
    description: '请用自己的话详细解释闭包的概念和应用场景',
    difficulty: 'hard'
  },
  {
    id: 4,
    type: 'code',
    title: '实现一个函数，判断一个字符串是否为回文',
    description: '请编写一个函数isPalindrome(str)，判断给定字符串是否为回文字符串',
    language: 'JavaScript',
    timeLimit: '1000ms',
    difficulty: 'medium'
  }
])

// 计算属性
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])
const currentAnswer = computed({
  get: () => answers.value[currentQuestionIndex.value] || (currentQuestion.value.type === 'multiple' ? [] : ''),
  set: (value) => {
    answers.value[currentQuestionIndex.value] = value
  }
})

const progressPercentage = computed(() => {
  return Math.round(((currentQuestionIndex.value + 1) / questions.value.length) * 100)
})

const isAnswered = computed(() => {
  const answer = answers.value[currentQuestionIndex.value]
  if (currentQuestion.value.type === 'multiple') {
    return Array.isArray(answer) && answer.length > 0
  }
  return answer !== undefined && answer !== null && answer !== ''
})

const isLastQuestion = computed(() => {
  return currentQuestionIndex.value === questions.value.length - 1
})

const answeredCount = computed(() => {
  return Object.keys(answers.value).filter(key => {
    const answer = answers.value[key]
    if (Array.isArray(answer)) {
      return answer.length > 0
    }
    return answer !== undefined && answer !== null && answer !== ''
  }).length
})

const remainingCount = computed(() => {
  return questions.value.length - answeredCount.value
})

// 方法
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

const getQuestionTypeColor = (type) => {
  const colorMap = {
    choice: 'primary',
    multiple: 'success',
    text: 'warning',
    code: 'danger'
  }
  return colorMap[type] || 'info'
}

const getQuestionTypeName = (type) => {
  const nameMap = {
    choice: '单选题',
    multiple: '多选题',
    text: '问答题',
    code: '编程题'
  }
  return nameMap[type] || '未知'
}

const nextQuestion = () => {
  if (isLastQuestion.value) {
    submitAssessment()
  } else {
    currentQuestionIndex.value++
  }
}

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  }
}

const goToQuestion = (index) => {
  currentQuestionIndex.value = index
}

const submitAssessment = () => {
  showSubmitDialog.value = true
}

const confirmSubmit = () => {
  // 停止计时器
  if (timer.value) {
    clearInterval(timer.value)
  }
  
  // 计算得分
  const score = calculateScore()
  
  // 保存评估结果
  const result = {
    assessmentId: currentAssessment.value.id,
    answers: answers.value,
    score: score,
    completedAt: new Date(),
    timeSpent: (currentAssessment.value.duration * 60) - remainingTime.value
  }
  
  // 存储到本地存储
  const assessmentResults = JSON.parse(localStorage.getItem('assessmentResults') || '[]')
  assessmentResults.push(result)
  localStorage.setItem('assessmentResults', JSON.stringify(assessmentResults))
  
  ElNotification({
    title: '评估完成',
    message: `您的得分是 ${score} 分，评估结果已保存`,
    type: 'success',
    duration: 3000
  })
  
  // 跳转到结果页面
  router.push(`/assessment-result?score=${score}&type=${currentAssessment.value.id}`)
}

const calculateScore = () => {
  let totalScore = 0
  let maxScore = 0
  
  questions.value.forEach((question, index) => {
    const answer = answers.value[index]
    maxScore += 100 / questions.value.length
    
    if (question.type === 'choice') {
      if (answer === question.correctAnswer) {
        totalScore += 100 / questions.value.length
      }
    } else if (question.type === 'multiple') {
      if (Array.isArray(answer) && Array.isArray(question.correctAnswer)) {
        const correctCount = answer.filter(a => question.correctAnswer.includes(a)).length
        const incorrectCount = answer.filter(a => !question.correctAnswer.includes(a)).length
        const score = Math.max(0, (correctCount - incorrectCount) / question.correctAnswer.length)
        totalScore += (score * 100) / questions.value.length
      }
    } else {
      // 文本题和代码题给予部分分数
      if (answer && answer.trim().length > 10) {
        totalScore += (60 / questions.value.length) // 给予60%的分数
      }
    }
  })
  
  return Math.round(totalScore)
}

const startTimer = () => {
  timer.value = setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value--
    } else {
      ElMessage.warning('时间到，自动提交评估')
      confirmSubmit()
    }
  }, 1000)
}

// 生命周期
onMounted(() => {
  // 根据路由参数设置评估信息
  const assessmentTypes = {
    technical: { title: '技术能力评估', description: '评估编程、算法、系统设计等技术技能', duration: 45 },
    communication: { title: '沟通表达评估', description: '评估口语表达、文字沟通、演讲能力', duration: 30 },
    leadership: { title: '领导力评估', description: '评估团队管理、决策能力、影响力', duration: 35 },
    'problem-solving': { title: '问题解决评估', description: '评估逻辑思维、分析能力、创新思维', duration: 40 }
  }
  
  const type = route.query.type
  if (type && assessmentTypes[type]) {
    currentAssessment.value = {
      id: type,
      ...assessmentTypes[type]
    }
    remainingTime.value = assessmentTypes[type].duration * 60
  }
  
  startTimer()
})

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})
</script>

<style scoped>
.assessment-exam-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.exam-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 20px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.exam-info h1 {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.exam-info p {
  color: #666;
  margin: 0;
}

.exam-progress {
  min-width: 300px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
}

.exam-content {
  padding: 40px 0;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 40px;
}

.question-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 32px;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.question-number {
  font-size: 18px;
  font-weight: 600;
  color: #1890ff;
}

.question-content h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
  line-height: 1.5;
}

.question-description {
  color: #666;
  margin-bottom: 24px;
  line-height: 1.6;
}

.question-options {
  margin-bottom: 32px;
}

.option-item {
  margin-bottom: 16px;
}

.option-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.option-label {
  font-weight: 600;
  color: #1890ff;
  min-width: 24px;
}

.option-text {
  color: #1a1a1a;
}

.question-input,
.question-code {
  margin-bottom: 32px;
}

.code-editor {
  margin-bottom: 12px;
}

.code-textarea {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
}

.code-info {
  display: flex;
  gap: 8px;
}

.question-actions {
  display: flex;
  justify-content: space-between;
}

.question-navigation {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 24px;
  height: fit-content;
}

.question-navigation h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.nav-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  margin-bottom: 24px;
}

.nav-item {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 2px solid #e6f7ff;
  background: #f8f9fa;
  color: #666;
}

.nav-item.current {
  background: #1890ff;
  color: white;
  border-color: #1890ff;
}

.nav-item.answered {
  background: #52c41a;
  color: white;
  border-color: #52c41a;
}

.nav-item.unanswered {
  background: #f8f9fa;
  color: #999;
  border-color: #f0f0f0;
}

.nav-item:hover {
  transform: scale(1.1);
}

.nav-summary {
  margin-bottom: 24px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.summary-item:last-child {
  margin-bottom: 0;
}

.summary-label {
  color: #666;
}

.summary-value {
  font-weight: 600;
  color: #1a1a1a;
}

.submit-btn {
  width: 100%;
}

.submit-summary {
  text-align: center;
}

.summary-stats {
  margin: 20px 0;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.stat-item:last-child {
  margin-bottom: 0;
}

.warning-text {
  color: #ff4d4f;
  font-weight: 600;
  margin-top: 16px;
}

@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    gap: 16px;
  }
  
  .content-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .question-navigation {
    order: -1;
  }
  
  .nav-grid {
    grid-template-columns: repeat(8, 1fr);
  }
}
</style>
