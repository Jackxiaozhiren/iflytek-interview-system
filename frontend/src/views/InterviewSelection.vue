<template>
  <div class="interview-selection">
    <div class="selection-header">
      <h1 class="selection-title">选择面试类型</h1>
      <p class="selection-subtitle">请选择适合您的面试类型和技术领域</p>
    </div>

    <div class="selection-content">
      <!-- 面试类型选择 -->
      <div class="type-section">
        <h2>面试类型</h2>
        <div class="type-cards">
          <div 
            v-for="type in interviewTypes" 
            :key="type.id"
            class="type-card"
            :class="{ active: selectedType === type.id }"
            @click="selectType(type.id)"
          >
            <div class="type-icon">
              <el-icon><component :is="type.icon" /></el-icon>
            </div>
            <h3>{{ type.name }}</h3>
            <p>{{ type.description }}</p>
            <div class="type-features">
              <span v-for="feature in type.features" :key="feature" class="feature-tag">
                {{ feature }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 技术领域选择 -->
      <div class="domain-section">
        <h2>技术领域</h2>
        <div class="domain-cards">
          <div 
            v-for="domain in techDomains" 
            :key="domain.id"
            class="domain-card"
            :class="[domain.theme, { active: selectedDomain === domain.id }]"
            @click="selectDomain(domain.id)"
          >
            <div class="domain-icon">
              <el-icon><component :is="domain.icon" /></el-icon>
            </div>
            <h3>{{ domain.name }}</h3>
            <p>{{ domain.description }}</p>
            <div class="domain-skills">
              <span v-for="skill in domain.skills" :key="skill" class="skill-tag">
                {{ skill }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 难度级别选择 -->
      <div class="difficulty-section">
        <h2>难度级别</h2>
        <div class="difficulty-options">
          <div 
            v-for="level in difficultyLevels" 
            :key="level.id"
            class="difficulty-option"
            :class="{ active: selectedDifficulty === level.id }"
            @click="selectDifficulty(level.id)"
          >
            <div class="difficulty-indicator" :class="level.class"></div>
            <div class="difficulty-info">
              <h4>{{ level.name }}</h4>
              <p>{{ level.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="selection-actions">
        <el-button size="large" @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
        <el-button 
          type="primary" 
          size="large" 
          :disabled="!canProceed"
          @click="proceedToSetup"
        >
          下一步：面试设置
          <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  ChatDotRound, DataBoard, Connection, ArrowLeft, ArrowRight
} from '@element-plus/icons-vue'

const router = useRouter()

const selectedType = ref('')
const selectedDomain = ref('')
const selectedDifficulty = ref('')

const interviewTypes = ref([
  {
    id: 'text-interview',
    name: 'iFlytek Spark 文本面试',
    description: '基于iFlytek Spark大模型的智能文本对话面试',
    icon: 'ChatDotRound',
    features: ['AI智能对话', '实时分析', '专业评估', '中文优化']
  }
])

const techDomains = ref([
  {
    id: 'ai',
    name: 'AI人工智能',
    description: '机器学习、深度学习、自然语言处理',
    icon: 'Cpu',
    theme: 'ai-theme',
    skills: ['Python', 'TensorFlow', '算法设计', '数据分析']
  },
  {
    id: 'bigdata',
    name: '大数据',
    description: '数据处理、分析、挖掘和可视化',
    icon: 'DataBoard',
    theme: 'bigdata-theme',
    skills: ['Hadoop', 'Spark', 'SQL', '数据仓库']
  },
  {
    id: 'iot',
    name: 'IoT物联网',
    description: '物联网系统设计和嵌入式开发',
    icon: 'Connection',
    theme: 'iot-theme',
    skills: ['嵌入式', '传感器', '通信协议', '系统集成']
  }
])

const difficultyLevels = ref([
  {
    id: 'junior',
    name: '初级',
    description: '适合1-2年工作经验的候选人',
    class: 'easy'
  },
  {
    id: 'intermediate',
    name: '中级',
    description: '适合3-5年工作经验的候选人',
    class: 'medium'
  },
  {
    id: 'senior',
    name: '高级',
    description: '适合5年以上工作经验的候选人',
    class: 'hard'
  }
])

const canProceed = computed(() => {
  return selectedType.value && selectedDomain.value && selectedDifficulty.value
})

const selectType = (typeId) => {
  selectedType.value = typeId
}

const selectDomain = (domainId) => {
  selectedDomain.value = domainId
}

const selectDifficulty = (difficultyId) => {
  selectedDifficulty.value = difficultyId
}

const goBack = () => {
  router.go(-1)
}

const proceedToSetup = () => {
  if (canProceed.value) {
    // 直接跳转到面试页面
    const sessionId = 'interview_' + Date.now()
    router.push({
      name: 'Interviewing',
      params: { sessionId },
      query: {
        type: selectedType.value,
        domain: selectedDomain.value,
        difficulty: selectedDifficulty.value
      }
    })
  }
}
</script>

<style scoped>
.interview-selection {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #1890ff 100%);
  position: relative;
  overflow-x: hidden;
  padding: 24px;
}

.interview-selection::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.9) 0%,
    rgba(118, 75, 162, 0.8) 30%,
    rgba(24, 144, 255, 0.7) 60%,
    rgba(102, 204, 255, 0.6) 100%
  );
  z-index: -1;
}

.selection-header {
  text-align: center;
  margin-bottom: 40px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 40px 20px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.selection-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: white;
  margin: 0 0 12px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.selection-subtitle {
  font-size: var(--font-size-lg);
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

.selection-content {
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(5px);
  padding: 40px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.type-section,
.domain-section,
.difficulty-section {
  margin-bottom: 40px;
}

.type-section h2,
.domain-section h2,
.difficulty-section h2 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: white;
  margin: 0 0 24px 0;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.type-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.type-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.type-card:hover {
  border-color: var(--iflytek-primary);
  transform: translateY(-2px);
  box-shadow: var(--iflytek-shadow-md);
}

.type-card.active {
  border-color: var(--iflytek-primary);
  background: var(--iflytek-bg-secondary);
  box-shadow: var(--iflytek-shadow-md);
}

.type-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--iflytek-gradient-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin: 0 auto 16px auto;
}

.type-card h3 {
  margin: 0 0 8px 0;
  color: var(--iflytek-text-primary);
  font-weight: var(--font-weight-semibold);
}

.type-card p {
  margin: 0 0 16px 0;
  color: var(--iflytek-text-secondary);
  line-height: 1.5;
}

.type-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.feature-tag {
  background: var(--iflytek-primary);
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.domain-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
}

.domain-card {
  background: var(--iflytek-bg-primary);
  border: 2px solid var(--iflytek-border-secondary);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.domain-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--iflytek-primary);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.domain-card:hover::before,
.domain-card.active::before {
  transform: scaleX(1);
}

.domain-card.ai-theme::before {
  background: var(--ai-module-gradient);
}

.domain-card.bigdata-theme::before {
  background: var(--bigdata-module-gradient);
}

.domain-card.iot-theme::before {
  background: var(--iot-module-gradient);
}

.domain-card:hover {
  border-color: var(--iflytek-primary);
  transform: translateY(-2px);
  box-shadow: var(--iflytek-shadow-md);
}

.domain-card.active {
  border-color: var(--iflytek-primary);
  background: var(--iflytek-bg-secondary);
  box-shadow: var(--iflytek-shadow-md);
}

.domain-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--iflytek-bg-secondary);
  color: var(--iflytek-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin: 0 auto 16px auto;
}

.domain-card h3 {
  margin: 0 0 8px 0;
  color: var(--iflytek-text-primary);
  font-weight: var(--font-weight-semibold);
}

.domain-card p {
  margin: 0 0 16px 0;
  color: var(--iflytek-text-secondary);
  line-height: 1.5;
  font-size: var(--font-size-sm);
}

.domain-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
}

.skill-tag {
  background: var(--iflytek-bg-secondary);
  color: var(--iflytek-text-secondary);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: var(--font-size-xs);
  border: 1px solid var(--iflytek-border-secondary);
}

.difficulty-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.difficulty-option {
  background: var(--iflytek-bg-primary);
  border: 2px solid var(--iflytek-border-secondary);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.difficulty-option:hover {
  border-color: var(--iflytek-primary);
  box-shadow: var(--iflytek-shadow-sm);
}

.difficulty-option.active {
  border-color: var(--iflytek-primary);
  background: var(--iflytek-bg-secondary);
  box-shadow: var(--iflytek-shadow-sm);
}

.difficulty-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.difficulty-indicator.easy {
  background: #52c41a;
}

.difficulty-indicator.medium {
  background: #faad14;
}

.difficulty-indicator.hard {
  background: #ff4d4f;
}

.difficulty-info h4 {
  margin: 0 0 4px 0;
  color: var(--iflytek-text-primary);
  font-weight: var(--font-weight-semibold);
}

.difficulty-info p {
  margin: 0;
  color: var(--iflytek-text-secondary);
  font-size: var(--font-size-sm);
}

.selection-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid var(--iflytek-border-secondary);
}

@media (max-width: 768px) {
  .interview-selection {
    padding: 16px;
  }
  
  .type-cards,
  .domain-cards {
    grid-template-columns: 1fr;
  }
  
  .difficulty-options {
    grid-template-columns: 1fr;
  }
  
  .selection-actions {
    flex-direction: column;
    gap: 16px;
  }
  
  .selection-actions .el-button {
    width: 100%;
  }
}
</style>
