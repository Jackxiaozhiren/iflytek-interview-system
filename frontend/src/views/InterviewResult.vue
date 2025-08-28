<template>
  <div class="interview-result">
    <!-- 结果头部 -->
    <header class="result-header">
      <div class="header-container">
        <div class="result-info">
          <h1 class="result-title">
            <el-icon class="title-icon"><Trophy /></el-icon>
            面试完成
          </h1>
          <p class="result-subtitle">感谢您参与iFlytek AI智能面试，以下是您的面试结果</p>
        </div>
        <div class="result-actions">
          <el-button type="primary" @click="downloadReport">
            <el-icon><Download /></el-icon>
            下载报告
          </el-button>
          <el-button @click="backToHome">
            <el-icon><House /></el-icon>
            返回首页
          </el-button>
        </div>
      </div>
    </header>

    <!-- 结果主体 -->
    <main class="result-main">
      <div class="result-container">
        <!-- 总体评分 -->
        <section class="overall-score">
          <h2>总体评分</h2>
          <div class="score-display">
            <div class="score-circle">
              <el-progress 
                type="circle" 
                :percentage="overallScore" 
                :width="120"
                :stroke-width="8"
                color="#1890ff"
              >
                <template #default="{ percentage }">
                  <span class="score-text">{{ percentage }}</span>
                  <span class="score-unit">分</span>
                </template>
              </el-progress>
            </div>
            <div class="score-details">
              <div class="score-item">
                <span class="label">技术能力</span>
                <el-progress :percentage="85" color="#1890ff" />
                <span class="value">85分</span>
              </div>
              <div class="score-item">
                <span class="label">沟通技巧</span>
                <el-progress :percentage="88" color="#52c41a" />
                <span class="value">88分</span>
              </div>
              <div class="score-item">
                <span class="label">逻辑思维</span>
                <el-progress :percentage="79" color="#722ed1" />
                <span class="value">79分</span>
              </div>
              <div class="score-item">
                <span class="label">综合表现</span>
                <el-progress :percentage="84" color="#fa8c16" />
                <span class="value">84分</span>
              </div>
            </div>
          </div>
        </section>

        <!-- 详细分析 -->
        <section class="detailed-analysis">
          <h2>详细分析</h2>
          <div class="analysis-grid">
            <div class="analysis-card">
              <h3>
                <el-icon><Microphone /></el-icon>
                语音分析
              </h3>
              <div class="analysis-content">
                <div class="metric">
                  <span>流畅度</span>
                  <span class="score">94%</span>
                </div>
                <div class="metric">
                  <span>语速适中</span>
                  <span class="score">88%</span>
                </div>
                <div class="metric">
                  <span>音调稳定</span>
                  <span class="score">91%</span>
                </div>
              </div>
            </div>

            <div class="analysis-card">
              <h3>
                <el-icon><Document /></el-icon>
                文本分析
              </h3>
              <div class="analysis-content">
                <div class="metric">
                  <span>关键词匹配</span>
                  <span class="score">87%</span>
                </div>
                <div class="metric">
                  <span>逻辑结构</span>
                  <span class="score">85%</span>
                </div>
                <div class="metric">
                  <span>专业术语</span>
                  <span class="score">92%</span>
                </div>
              </div>
            </div>

            <div class="analysis-card">
              <h3>
                <el-icon><Star /></el-icon>
                综合评价
              </h3>
              <div class="analysis-content">
                <p>候选人在技术问题回答中表现出色，具备扎实的专业基础。沟通表达清晰，逻辑思维较强。建议在某些细节问题上可以更加深入。</p>
              </div>
            </div>
          </div>
        </section>

        <!-- 改进建议 -->
        <section class="improvement-suggestions">
          <h2>改进建议</h2>
          <div class="suggestions-list">
            <div class="suggestion-item">
              <el-icon class="suggestion-icon"><Check /></el-icon>
              <div class="suggestion-content">
                <h4>技术深度</h4>
                <p>建议在回答技术问题时，可以结合更多实际项目经验，展示技术应用的深度。</p>
              </div>
            </div>
            <div class="suggestion-item">
              <el-icon class="suggestion-icon"><Check /></el-icon>
              <div class="suggestion-content">
                <h4>表达技巧</h4>
                <p>整体表达清晰，建议在描述复杂概念时可以使用更多具体的例子来说明。</p>
              </div>
            </div>
            <div class="suggestion-item">
              <el-icon class="suggestion-icon"><Check /></el-icon>
              <div class="suggestion-content">
                <h4>互动交流</h4>
                <p>面试过程中互动良好，建议可以主动提出一些相关的技术问题，展示学习热情。</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Trophy, Download, House, Microphone, Document, 
  Star, Check
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()

// 响应式数据
const overallScore = ref(84)

const interviewData = reactive({
  candidateName: '张三',
  position: 'AI算法工程师',
  duration: '45分钟',
  completedQuestions: 8,
  totalQuestions: 10
})

// 方法
const downloadReport = () => {
  ElMessage.success('报告下载功能开发中...')
}

const backToHome = () => {
  router.push('/')
}
</script>

<style scoped>
/* iFlytek 品牌色彩变量 */
.interview-result {
  --iflytek-primary: #1890ff;
  --iflytek-secondary: #667eea;
  --iflytek-success: #52c41a;
  --iflytek-warning: #fa8c16;
  --iflytek-purple: #722ed1;
  --text-primary: #333333;
  --text-secondary: #666666;
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --border-color: #e8e8e8;
  --shadow-light: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-medium: 0 4px 16px rgba(0, 0, 0, 0.15);
}

/* 页面主容器 */
.interview-result {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
}

/* 头部样式 */
.result-header {
  background: linear-gradient(135deg, var(--iflytek-primary) 0%, var(--iflytek-secondary) 100%);
  color: white;
  padding: 30px 0;
  box-shadow: var(--shadow-medium);
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.result-title {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  font-size: 32px;
}

.result-subtitle {
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
}

.result-actions {
  display: flex;
  gap: 12px;
}

/* 主体区域 */
.result-main {
  padding: 40px 0;
}

.result-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

/* 总体评分 */
.overall-score {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 30px;
  box-shadow: var(--shadow-light);
  border: 1px solid var(--border-color);
}

.overall-score h2 {
  margin: 0 0 24px 0;
  color: var(--text-primary);
  font-size: 20px;
  font-weight: 600;
}

.score-display {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 40px;
  align-items: center;
}

.score-circle {
  text-align: center;
}

.score-text {
  font-size: 24px;
  font-weight: 600;
  color: var(--iflytek-primary);
}

.score-unit {
  font-size: 14px;
  color: var(--text-secondary);
}

.score-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.score-item {
  display: grid;
  grid-template-columns: 100px 1fr 60px;
  gap: 16px;
  align-items: center;
}

.score-item .label {
  color: var(--text-secondary);
  font-size: 14px;
}

.score-item .value {
  color: var(--text-primary);
  font-weight: 600;
  font-size: 14px;
  text-align: right;
}

/* 详细分析 */
.detailed-analysis {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 30px;
  box-shadow: var(--shadow-light);
  border: 1px solid var(--border-color);
}

.detailed-analysis h2 {
  margin: 0 0 24px 0;
  color: var(--text-primary);
  font-size: 20px;
  font-weight: 600;
}

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.analysis-card {
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 20px;
  border: 1px solid var(--border-color);
}

.analysis-card h3 {
  margin: 0 0 16px 0;
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;
}

.metric:last-child {
  border-bottom: none;
}

.metric span:first-child {
  color: var(--text-secondary);
  font-size: 14px;
}

.metric .score {
  color: var(--iflytek-primary);
  font-weight: 600;
  font-size: 14px;
}

/* 改进建议 */
.improvement-suggestions {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 30px;
  box-shadow: var(--shadow-light);
  border: 1px solid var(--border-color);
}

.improvement-suggestions h2 {
  margin: 0 0 24px 0;
  color: var(--text-primary);
  font-size: 20px;
  font-weight: 600;
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.suggestion-item {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.suggestion-icon {
  color: var(--iflytek-success);
  font-size: 20px;
  margin-top: 2px;
}

.suggestion-content h4 {
  margin: 0 0 8px 0;
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 600;
}

.suggestion-content p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .result-container {
    padding: 0 16px;
  }
  
  .score-display {
    grid-template-columns: 1fr;
    gap: 24px;
    text-align: center;
  }
  
  .analysis-grid {
    grid-template-columns: 1fr;
  }
  
  .score-item {
    grid-template-columns: 80px 1fr 50px;
    gap: 12px;
  }
}
</style>
