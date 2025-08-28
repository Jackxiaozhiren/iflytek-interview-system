<template>
  <div class="voice-interview-mode-card">
    <div class="mode-card-header">
      <div class="mode-icon">
        <el-icon class="icon-microphone"><Microphone /></el-icon>
        <div class="icon-pulse"></div>
      </div>
      <div class="mode-title">
        <h3>语音专项面试</h3>
        <p>重点评估语音表达和沟通能力的专项面试模式</p>
      </div>
    </div>

    <div class="mode-features">
      <div class="feature-item">
        <el-icon class="feature-icon"><Check /></el-icon>
        <span>语音质量分析</span>
      </div>
      <div class="feature-item">
        <el-icon class="feature-icon"><Check /></el-icon>
        <span>表达流畅度评估</span>
      </div>
      <div class="feature-item">
        <el-icon class="feature-icon"><Check /></el-icon>
        <span>语调情感识别</span>
      </div>
      <div class="feature-item">
        <el-icon class="feature-icon"><Check /></el-icon>
        <span>沟通技巧评价</span>
      </div>
    </div>

    <div class="mode-details">
      <div class="detail-row">
        <span class="detail-label">预计时长</span>
        <span class="detail-value">25-35分钟</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">难度等级</span>
        <span class="detail-value">中等</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">评估维度</span>
        <span class="detail-value">语音表达 + 技术能力</span>
      </div>
    </div>

    <div class="mode-requirements">
      <h4>
        <el-icon><InfoFilled /></el-icon>
        技术要求
      </h4>
      <ul class="requirements-list">
        <li>需要麦克风设备</li>
        <li>建议使用Chrome浏览器</li>
        <li>确保网络环境稳定</li>
        <li>选择安静的面试环境</li>
      </ul>
    </div>

    <div class="mode-actions">
      <el-button 
        type="primary" 
        size="large" 
        @click="startVoiceInterview"
        class="start-button"
      >
        <el-icon><VideoPlay /></el-icon>
        开始语音面试
      </el-button>
      <el-button 
        size="large" 
        @click="testMicrophone"
        class="test-button"
      >
        <el-icon><Setting /></el-icon>
        麦克风测试
      </el-button>
    </div>

    <!-- 麦克风测试对话框 -->
    <el-dialog
      v-model="showMicTest"
      title="麦克风测试"
      width="500px"
      :close-on-click-modal="false"
    >
      <div class="mic-test-content">
        <div class="test-status">
          <div class="status-icon" :class="{ active: isTesting }">
            <el-icon><Microphone /></el-icon>
          </div>
          <div class="status-text">
            {{ testStatus }}
          </div>
        </div>
        
        <div class="volume-meter">
          <div class="volume-label">音量检测</div>
          <div class="volume-bars">
            <div 
              class="volume-bar" 
              v-for="i in 10" 
              :key="i"
              :class="{ active: volumeLevel >= i }"
            ></div>
          </div>
        </div>
        
        <div class="test-result" v-if="testResult">
          <el-alert
            :title="testResult.title"
            :type="testResult.type"
            :description="testResult.description"
            show-icon
            :closable="false"
          />
        </div>
      </div>
      
      <template #footer>
        <el-button @click="showMicTest = false">关闭</el-button>
        <el-button 
          type="primary" 
          @click="toggleMicTest"
          :disabled="!micPermission"
        >
          {{ isTesting ? '停止测试' : '开始测试' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Microphone, Check, InfoFilled, VideoPlay, Setting
} from '@element-plus/icons-vue'

const router = useRouter()

// 麦克风测试相关
const showMicTest = ref(false)
const isTesting = ref(false)
const testStatus = ref('准备测试麦克风')
const volumeLevel = ref(0)
const micPermission = ref(false)
const testResult = ref(null)

let audioContext = null
let analyser = null
let microphone = null
let testInterval = null

// 方法
const startVoiceInterview = () => {
  // 检查麦克风权限
  checkMicrophonePermission().then(hasPermission => {
    if (hasPermission) {
      // 生成面试会话ID
      const sessionId = 'voice_' + Date.now()
      router.push(`/voice-interview/${sessionId}`)
    } else {
      ElMessage.warning('请先允许麦克风权限，然后重试')
      testMicrophone()
    }
  })
}

const testMicrophone = () => {
  showMicTest.value = true
  checkMicrophonePermission()
}

const checkMicrophonePermission = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    micPermission.value = true
    testStatus.value = '麦克风权限已获取，可以开始测试'
    
    // 立即停止流以释放资源
    stream.getTracks().forEach(track => track.stop())
    
    return true
  } catch (error) {
    micPermission.value = false
    testStatus.value = '无法获取麦克风权限，请检查浏览器设置'
    testResult.value = {
      title: '麦克风权限被拒绝',
      type: 'error',
      description: '请在浏览器设置中允许麦克风权限，然后刷新页面重试'
    }
    return false
  }
}

const toggleMicTest = async () => {
  if (isTesting.value) {
    stopMicTest()
  } else {
    await startMicTest()
  }
}

const startMicTest = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    })
    
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
    analyser = audioContext.createAnalyser()
    microphone = audioContext.createMediaStreamSource(stream)
    microphone.connect(analyser)
    
    analyser.fftSize = 256
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    
    isTesting.value = true
    testStatus.value = '正在测试麦克风，请说话...'
    
    testInterval = setInterval(() => {
      analyser.getByteFrequencyData(dataArray)
      const volume = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength
      volumeLevel.value = Math.min(10, Math.floor(volume / 15))
      
      if (volumeLevel.value > 0) {
        testResult.value = {
          title: '麦克风工作正常',
          type: 'success',
          description: '检测到音频输入，您的麦克风设备工作正常'
        }
      }
    }, 100)
    
  } catch (error) {
    console.error('麦克风测试失败:', error)
    testResult.value = {
      title: '麦克风测试失败',
      type: 'error',
      description: '无法访问麦克风设备，请检查设备连接和权限设置'
    }
  }
}

const stopMicTest = () => {
  isTesting.value = false
  testStatus.value = '测试已停止'
  volumeLevel.value = 0
  
  if (testInterval) {
    clearInterval(testInterval)
    testInterval = null
  }
  
  if (audioContext) {
    audioContext.close()
    audioContext = null
  }
  
  if (microphone) {
    microphone.disconnect()
    microphone = null
  }
}

// 生命周期
onMounted(() => {
  checkMicrophonePermission()
})

onUnmounted(() => {
  stopMicTest()
})
</script>

<style scoped>
.voice-interview-mode-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 2px solid #e6f7ff;
  transition: all 0.3s ease;
  max-width: 480px;
  margin: 0 auto;
}

.voice-interview-mode-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(24, 144, 255, 0.15);
  border-color: #91d5ff;
}

.mode-card-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
}

.mode-icon {
  position: relative;
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #1890ff, #40a9ff);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 28px;
}

.icon-pulse {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid #1890ff;
  animation: pulse 2s infinite;
  opacity: 0.6;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.3;
  }
  100% {
    transform: scale(1.2);
    opacity: 0;
  }
}

.mode-title h3 {
  color: #1890ff;
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.mode-title p {
  color: #7f8c8d;
  font-size: 14px;
  margin: 0;
  line-height: 1.5;
}

.mode-features {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 24px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(82, 196, 26, 0.05);
  border-radius: 8px;
  font-size: 14px;
  color: #2c3e50;
}

.feature-icon {
  color: #52c41a;
  font-size: 16px;
}

.mode-details {
  background: #f8fafc;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 24px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.detail-label {
  color: #7f8c8d;
  font-size: 14px;
}

.detail-value {
  color: #2c3e50;
  font-weight: 600;
  font-size: 14px;
}

.mode-requirements {
  margin-bottom: 32px;
}

.mode-requirements h4 {
  color: #fa8c16;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.requirements-list {
  margin: 0;
  padding-left: 20px;
}

.requirements-list li {
  color: #5a6c7d;
  font-size: 14px;
  margin-bottom: 8px;
  line-height: 1.4;
}

.mode-actions {
  display: flex;
  gap: 12px;
}

.start-button,
.test-button {
  flex: 1;
  padding: 16px 24px;
  font-weight: 600;
  border-radius: 8px;
  font-size: 16px;
}

.start-button {
  background: linear-gradient(135deg, #1890ff, #40a9ff);
  border: none;
}

.start-button:hover {
  background: linear-gradient(135deg, #0066cc, #1890ff);
}

.mic-test-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px 0;
}

.test-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.status-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #f0f2f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #8c8c8c;
  transition: all 0.3s ease;
}

.status-icon.active {
  background: linear-gradient(135deg, #1890ff, #40a9ff);
  color: white;
  animation: micPulse 1.5s infinite;
}

@keyframes micPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.status-text {
  font-size: 16px;
  color: #2c3e50;
  text-align: center;
}

.volume-meter {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.volume-label {
  font-size: 14px;
  color: #7f8c8d;
  text-align: center;
}

.volume-bars {
  display: flex;
  justify-content: center;
  gap: 4px;
  height: 40px;
  align-items: end;
}

.volume-bar {
  width: 8px;
  height: 8px;
  background: #e6e6e6;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.volume-bar.active {
  background: #52c41a;
  height: 32px;
}

.test-result {
  margin-top: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .voice-interview-mode-card {
    padding: 24px;
    margin: 16px;
  }
  
  .mode-features {
    grid-template-columns: 1fr;
  }
  
  .mode-actions {
    flex-direction: column;
  }
  
  .mode-card-header {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
}
</style>
