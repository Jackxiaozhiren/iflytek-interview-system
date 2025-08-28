<template>
  <div class="interview-mode-selector">
    <!-- 页面头部 -->
    <header class="page-header">
      <div class="header-container">
        <h1 class="page-title">
          <el-icon class="title-icon"><ChatDotRound /></el-icon>
          选择面试模式
        </h1>
        <p class="page-subtitle">iFlytek AI智能面试系统为您提供多种面试模式，请选择最适合您的方式</p>
      </div>
    </header>

    <!-- 面试模式选择 -->
    <main class="mode-selection">
      <div class="selection-container">
        <div class="mode-cards">
          <!-- 语音面试模式 -->
          <div class="mode-card featured dayee-card-hover dayee-progressive-load" @click="selectMode('voice')">
            <div class="card-header">
              <div class="mode-icon voice-mode">
                <el-icon><Microphone /></el-icon>
              </div>
              <div class="mode-info">
                <h3 class="mode-title">语音专项面试</h3>
                <span class="mode-badge featured-badge">专项</span>
              </div>
            </div>

            <div class="mode-description">
              <p>专注语音表达和沟通能力的智能面试模式，评估语音质量和表达技巧</p>
            </div>

            <div class="mode-features">
              <div class="feature-item">
                <el-icon class="feature-icon"><Check /></el-icon>
                <span>实时语音识别转换</span>
              </div>
              <div class="feature-item">
                <el-icon class="feature-icon"><Check /></el-icon>
                <span>语音特征智能分析</span>
              </div>
              <div class="feature-item">
                <el-icon class="feature-icon"><Check /></el-icon>
                <span>表达流畅度评估</span>
              </div>
              <div class="feature-item">
                <el-icon class="feature-icon"><Check /></el-icon>
                <span>情感语调识别</span>
              </div>
            </div>

            <div class="mode-details">
              <div class="detail-item">
                <span class="detail-label">时长</span>
                <span class="detail-value">25-35分钟</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">难度</span>
                <span class="detail-value">中等</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">设备要求</span>
                <span class="detail-value">需要麦克风</span>
              </div>
            </div>

            <div class="mode-action">
              <el-button type="primary" size="large" class="select-btn">
                <el-icon><VideoPlay /></el-icon>
                开始语音面试
              </el-button>
            </div>
          </div>

          <!-- 文字面试模式 -->
          <div class="mode-card recommended dayee-card-hover dayee-progressive-load" @click="selectMode('text')">
            <div class="card-header">
              <div class="mode-icon text-mode">
                <el-icon><ChatDotRound /></el-icon>
              </div>
              <div class="mode-info">
                <h3 class="mode-title">文字对话面试</h3>
                <span class="mode-badge recommended-badge">推荐</span>
              </div>
            </div>
            
            <div class="mode-description">
              <p>专注于文字交流的智能面试模式，通过文字对话进行深度技术交流</p>
            </div>
            
            <div class="mode-features">
              <div class="feature-item">
                <el-icon class="feature-icon"><Check /></el-icon>
                <span>实时文字对话交互</span>
              </div>
              <div class="feature-item">
                <el-icon class="feature-icon"><Check /></el-icon>
                <span>智能文本分析评估</span>
              </div>
              <div class="feature-item">
                <el-icon class="feature-icon"><Check /></el-icon>
                <span>AI智能问题生成</span>
              </div>
              <div class="feature-item">
                <el-icon class="feature-icon"><Check /></el-icon>
                <span>实时评分反馈</span>
              </div>
              <div class="feature-item">
                <el-icon class="feature-icon"><Check /></el-icon>
                <span>可选音频辅助</span>
              </div>
            </div>
            
            <div class="mode-advantages">
              <h4>适合场景：</h4>
              <ul>
                <li>技术深度交流</li>
                <li>逻辑思维考察</li>
                <li>文字表达能力评估</li>
                <li>专业知识问答</li>
              </ul>
            </div>
            
            <div class="card-footer">
              <el-button type="primary" size="large" class="select-btn dayee-btn-micro">
                <el-icon><ArrowRight /></el-icon>
                选择文字面试
              </el-button>
            </div>
          </div>


        </div>

        <!-- 模式对比 -->
        <div class="mode-comparison">
          <h3>模式对比</h3>
          <div class="comparison-table">
            <div class="comparison-header">
              <div class="feature-name">功能特性</div>
              <div class="mode-name">文字面试</div>
              <div class="mode-name">多媒体面试</div>
            </div>
            <div class="comparison-row">
              <div class="feature-name">设备要求</div>
              <div class="feature-value">
                <el-icon class="status-icon success"><Check /></el-icon>
                <span>低 (仅需键盘)</span>
              </div>
              <div class="feature-value">
                <el-icon class="status-icon warning"><Warning /></el-icon>
                <span>高 (摄像头+麦克风)</span>
              </div>
            </div>
            <div class="comparison-row">
              <div class="feature-name">网络要求</div>
              <div class="feature-value">
                <el-icon class="status-icon success"><Check /></el-icon>
                <span>低带宽</span>
              </div>
              <div class="feature-value">
                <el-icon class="status-icon warning"><Warning /></el-icon>
                <span>高带宽</span>
              </div>
            </div>
            <div class="comparison-row">
              <div class="feature-name">专注度</div>
              <div class="feature-value">
                <el-icon class="status-icon success"><Check /></el-icon>
                <span>高 (专注思考)</span>
              </div>
              <div class="feature-value">
                <el-icon class="status-icon info"><InfoFilled /></el-icon>
                <span>中等</span>
              </div>
            </div>
            <div class="comparison-row">
              <div class="feature-name">技术深度</div>
              <div class="feature-value">
                <el-icon class="status-icon success"><Check /></el-icon>
                <span>优秀</span>
              </div>
              <div class="feature-value">
                <el-icon class="status-icon info"><InfoFilled /></el-icon>
                <span>良好</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部操作 -->
        <div class="bottom-actions">
          <el-button @click="goBack" size="large">
            <el-icon><ArrowLeft /></el-icon>
            返回上一步
          </el-button>
          <el-button type="info" @click="viewDemo" size="large">
            <el-icon><View /></el-icon>
            查看演示
          </el-button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import {
  ChatDotRound, Microphone, Check, ArrowRight, ArrowLeft,
  View, Warning, InfoFilled
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()

const selectMode = (mode) => {
  if (mode === 'voice') {
    ElMessage.success('已选择语音专项面试模式')
    // 生成面试会话ID
    const sessionId = 'voice_' + Date.now()
    router.push(`/voice-interview/${sessionId}`)
  } else if (mode === 'text') {
    ElMessage.success('已选择文字对话面试模式')
    // 生成面试会话ID
    const sessionId = 'text_' + Date.now()
    router.push(`/interviewing/${sessionId}`)
  } else {
    ElMessage.info('该模式正在开发中...')
  }
}

const goBack = () => {
  router.go(-1)
}

const viewDemo = () => {
  router.push('/demo')
}
</script>

<style scoped>
/* iFlytek 品牌色彩变量 */
.interview-mode-selector {
  --iflytek-primary: #1890ff;
  --iflytek-secondary: #667eea;
  --iflytek-accent: #764ba2;
  --iflytek-success: #52c41a;
  --iflytek-warning: #faad14;
  --iflytek-info: #13c2c2;
  --text-primary: #333333;
  --text-secondary: #666666;
  --text-light: #999999;
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --border-color: #e8e8e8;
  --border-light: #f0f0f0;
  --shadow-light: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-medium: 0 4px 16px rgba(0, 0, 0, 0.15);
  --shadow-hover: 0 8px 24px rgba(0, 0, 0, 0.2);
  --radius-small: 6px;
  --radius-medium: 8px;
  --radius-large: 12px;
}

/* 页面主容器 */
.interview-mode-selector {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
}

/* 页面头部 */
.page-header {
  background: linear-gradient(135deg, var(--iflytek-primary) 0%, var(--iflytek-secondary) 100%);
  color: white;
  padding: 40px 0;
  text-align: center;
  box-shadow: var(--shadow-medium);
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-title {
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.title-icon {
  font-size: 36px;
}

.page-subtitle {
  font-size: 16px;
  margin: 0;
  opacity: 0.9;
  line-height: 1.6;
}

/* 模式选择区域 */
.mode-selection {
  padding: 40px 0;
}

.selection-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.mode-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

/* 模式卡片 */
.mode-card {
  background: var(--bg-primary);
  border-radius: var(--radius-large);
  padding: 30px;
  box-shadow: var(--shadow-light);
  border: 2px solid var(--border-light);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.mode-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
  border-color: var(--iflytek-primary);
}

.mode-card.recommended {
  border-color: var(--iflytek-primary);
  background: linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%);
}

.mode-card.recommended::before {
  content: '推荐';
  position: absolute;
  top: -1px;
  right: 20px;
  background: linear-gradient(135deg, var(--iflytek-primary), var(--iflytek-secondary));
  color: white;
  padding: 4px 12px;
  border-radius: 0 0 var(--radius-small) var(--radius-small);
  font-size: 12px;
  font-weight: 600;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.mode-icon {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-medium);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
}

.mode-icon.voice-mode {
  background: linear-gradient(135deg, #52c41a, #73d13d);
}

.mode-icon.text-mode {
  background: linear-gradient(135deg, var(--iflytek-primary), var(--iflytek-secondary));
}

.mode-icon.multimedia-mode {
  background: linear-gradient(135deg, var(--iflytek-accent), #9c88ff);
}

.mode-info {
  flex: 1;
}

.mode-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: var(--text-primary);
}

.mode-badge {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: var(--radius-small);
  background: var(--bg-secondary);
  color: var(--text-secondary);
}

.featured-badge {
  background: linear-gradient(135deg, #fa8c16, #ffa940);
  color: white;
}

.recommended-badge {
  background: linear-gradient(135deg, var(--iflytek-primary), var(--iflytek-secondary));
  color: white;
}

.mode-description {
  margin-bottom: 20px;
}

.mode-description p {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.6;
}

.mode-features {
  margin-bottom: 20px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  color: var(--text-primary);
}

.feature-icon {
  color: var(--iflytek-success);
  font-size: 16px;
}

.mode-advantages {
  margin-bottom: 24px;
}

.mode-advantages h4 {
  margin: 0 0 8px 0;
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
}

.mode-advantages ul {
  margin: 0;
  padding-left: 16px;
  color: var(--text-secondary);
  font-size: 13px;
}

.mode-advantages li {
  margin-bottom: 4px;
}

.card-footer {
  text-align: center;
}

.select-btn {
  width: 100%;
  height: 44px;
  font-weight: 600;
}

/* 模式对比 */
.mode-comparison {
  background: var(--bg-primary);
  border-radius: var(--radius-large);
  padding: 30px;
  box-shadow: var(--shadow-light);
  border: 1px solid var(--border-color);
  margin-bottom: 30px;
}

.mode-comparison h3 {
  margin: 0 0 20px 0;
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 600;
  text-align: center;
}

.comparison-table {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1px;
  background: var(--border-light);
  border-radius: var(--radius-medium);
  overflow: hidden;
}

.comparison-header,
.comparison-row {
  display: contents;
}

.comparison-header > div {
  background: var(--bg-secondary);
  padding: 12px 16px;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 14px;
}

.comparison-row > div {
  background: var(--bg-primary);
  padding: 12px 16px;
  font-size: 13px;
}

.feature-name {
  color: var(--text-primary);
  font-weight: 500;
}

.feature-value {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
}

.status-icon {
  font-size: 14px;
}

.status-icon.success {
  color: var(--iflytek-success);
}

.status-icon.warning {
  color: var(--iflytek-warning);
}

.status-icon.info {
  color: var(--iflytek-info);
}

/* 底部操作 */
.bottom-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .mode-cards {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .comparison-table {
    font-size: 12px;
  }
  
  .comparison-header > div,
  .comparison-row > div {
    padding: 8px 12px;
  }
  
  .bottom-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .mode-card {
    padding: 20px;
  }
}
</style>
