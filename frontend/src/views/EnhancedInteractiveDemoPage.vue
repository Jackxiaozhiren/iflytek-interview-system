<template>
  <div class="enhanced-interactive-demo-page">
    <!-- 页面头部 -->
    <div class="demo-header">
      <div class="demo-container">
        <div class="demo-hero">
          <h1 class="demo-title">iFlytek Spark 交互式演示</h1>
          <p class="demo-subtitle">沉浸式体验智能面试系统的强大功能</p>
        </div>
      </div>
    </div>

    <!-- 交互式演示区域 -->
    <section class="interactive-demo">
      <div class="demo-container">
        <div class="demo-tabs">
          <el-tabs v-model="activeTab" type="border-card" class="demo-tabs-container">
            <el-tab-pane label="🎯 智能问答" name="qa">
              <div class="demo-content">
                <h3>AI智能问答演示</h3>
                <p>体验基于iFlytek Spark大模型的智能对话系统</p>
                <div class="demo-chat">
                  <div class="chat-messages">
                    <div v-for="message in chatMessages" :key="message.id"
                         :class="['message', message.type]">
                      <div class="message-content">{{ message.content }}</div>
                      <div class="message-time">{{ message.time }}</div>
                    </div>
                  </div>
                  <div class="chat-input">
                    <el-input v-model="userInput" placeholder="请输入您的问题..."
                              @keyup.enter="sendMessage">
                      <template #append>
                        <el-button @click="sendMessage" type="primary">发送</el-button>
                      </template>
                    </el-input>
                  </div>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="🎤 语音识别" name="voice">
              <div class="demo-content">
                <h3>语音识别演示</h3>
                <p>体验高精度语音转文字功能</p>
                <div class="voice-demo">
                  <div class="voice-controls">
                    <el-button :type="isRecording ? 'danger' : 'primary'"
                               @click="toggleRecording" size="large">
                      <el-icon><Microphone /></el-icon>
                      {{ isRecording ? '停止录音' : '开始录音' }}
                    </el-button>
                  </div>
                  <div class="voice-result">
                    <el-card>
                      <h4>识别结果：</h4>
                      <p>{{ voiceResult || '点击开始录音按钮开始语音识别...' }}</p>
                    </el-card>
                  </div>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="📊 实时分析" name="analysis">
              <div class="demo-content">
                <h3>实时分析演示</h3>
                <p>查看AI对候选人表现的实时分析结果</p>
                <div class="analysis-dashboard">
                  <div class="analysis-cards">
                    <el-card v-for="metric in analysisMetrics" :key="metric.name"
                             class="analysis-card">
                      <div class="metric-header">
                        <span class="metric-name">{{ metric.name }}</span>
                        <span class="metric-score">{{ metric.score }}%</span>
                      </div>
                      <el-progress :percentage="metric.score" :color="getProgressColor(metric.score)" />
                      <p class="metric-desc">{{ metric.description }}</p>
                    </el-card>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </section>

    <!-- 操作按钮 -->
    <section class="demo-actions">
      <div class="demo-container">
        <div class="actions-content">
          <h2>开始您的智能面试体验</h2>
          <div class="action-buttons">
            <el-button type="primary" size="large" @click="startFullDemo">
              <el-icon><VideoPlay /></el-icon>
              完整演示
            </el-button>
            <el-button size="large" @click="startPractice">
              <el-icon><Edit /></el-icon>
              模拟练习
            </el-button>
            <el-button size="large" @click="viewReports">
              <el-icon><Document /></el-icon>
              查看报告
            </el-button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  VideoPlay, Edit, Document, Microphone
} from '@element-plus/icons-vue'

const router = useRouter()

// 响应式数据
const activeTab = ref('qa')
const userInput = ref('')
const isRecording = ref(false)
const voiceResult = ref('')

// 聊天消息
const chatMessages = ref([
  {
    id: 1,
    type: 'ai',
    content: '您好！我是iFlytek Spark智能面试官，很高兴为您服务。请问您想了解什么？',
    time: '10:00'
  }
])

// 分析指标
const analysisMetrics = ref([
  {
    name: '语言表达能力',
    score: 85,
    description: '候选人语言表达清晰，逻辑性强'
  },
  {
    name: '专业知识水平',
    score: 78,
    description: '专业知识掌握较好，有一定深度'
  },
  {
    name: '沟通交流能力',
    score: 92,
    description: '沟通能力优秀，善于表达观点'
  },
  {
    name: '问题解决能力',
    score: 76,
    description: '具备基本的问题分析和解决能力'
  }
])

// 发送消息
const sendMessage = () => {
  if (!userInput.value.trim()) return

  // 添加用户消息
  chatMessages.value.push({
    id: Date.now(),
    type: 'user',
    content: userInput.value,
    time: new Date().toLocaleTimeString().slice(0, 5)
  })

  // 模拟AI回复
  setTimeout(() => {
    const aiResponses = [
      '这是一个很好的问题。基于我的分析...',
      '根据您的回答，我建议您可以从以下几个方面来考虑...',
      '您的想法很有创意，让我们深入探讨一下...',
      '这个观点很有意思，能否详细说明一下您的思路？'
    ]

    chatMessages.value.push({
      id: Date.now() + 1,
      type: 'ai',
      content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
      time: new Date().toLocaleTimeString().slice(0, 5)
    })
  }, 1000)

  userInput.value = ''
}

// 切换录音状态
const toggleRecording = () => {
  isRecording.value = !isRecording.value

  if (isRecording.value) {
    ElMessage.success('开始录音...')
    // 模拟语音识别
    setTimeout(() => {
      voiceResult.value = '这是一个模拟的语音识别结果，展示了iFlytek Spark强大的语音处理能力。'
      isRecording.value = false
      ElMessage.success('录音完成，识别成功！')
    }, 3000)
  } else {
    ElMessage.info('录音已停止')
  }
}

// 获取进度条颜色
const getProgressColor = (score) => {
  if (score >= 80) return '#67c23a'
  if (score >= 60) return '#e6a23c'
  return '#f56c6c'
}

// 导航方法
const startFullDemo = () => {
  router.push('/demo')
}

const startPractice = () => {
  router.push('/interview-selection')
}

const viewReports = () => {
  router.push('/reports')
}

onMounted(() => {
  console.log('交互式演示页面已加载')
})
</script>

<style scoped>
.enhanced-interactive-demo-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.demo-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.demo-header {
  padding: 60px 0;
  text-align: center;
  color: white;
}

.demo-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.demo-subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
}

.interactive-demo {
  padding: 40px 0;
  background: white;
}

.demo-tabs-container {
  min-height: 500px;
}

.demo-content {
  padding: 20px;
}

.demo-content h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.demo-content p {
  color: #666;
  margin-bottom: 2rem;
}

.demo-chat {
  max-width: 600px;
  margin: 0 auto;
}

.chat-messages {
  height: 300px;
  overflow-y: auto;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  background: #f8f9fa;
}

.message {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

.message.user {
  align-items: flex-end;
}

.message.ai {
  align-items: flex-start;
}

.message-content {
  max-width: 70%;
  padding: 10px 15px;
  border-radius: 18px;
  word-wrap: break-word;
}

.message.user .message-content {
  background: #409eff;
  color: white;
}

.message.ai .message-content {
  background: white;
  border: 1px solid #e4e7ed;
  color: #333;
}

.message-time {
  font-size: 0.75rem;
  color: #999;
  margin-top: 5px;
}

.voice-demo {
  text-align: center;
  max-width: 500px;
  margin: 0 auto;
}

.voice-controls {
  margin-bottom: 2rem;
}

.voice-result {
  text-align: left;
}

.analysis-dashboard {
  max-width: 800px;
  margin: 0 auto;
}

.analysis-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.analysis-card {
  margin-bottom: 1rem;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.metric-name {
  font-weight: 600;
  color: #333;
}

.metric-score {
  font-size: 1.25rem;
  font-weight: 700;
  color: #409eff;
}

.metric-desc {
  margin-top: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.demo-actions {
  padding: 60px 0;
  background: #f8f9fa;
  text-align: center;
}

.actions-content h2 {
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 2rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .demo-title {
    font-size: 2rem;
  }

  .analysis-cards {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
    align-items: center;
  }

  .message-content {
    max-width: 85%;
  }
}
</style>
