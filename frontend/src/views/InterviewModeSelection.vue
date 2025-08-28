<template>
  <div class="interview-mode-selection">
    <div class="selection-container">
      <!-- 页面标题 -->
      <div class="page-header">
        <div class="header-content">
          <el-icon class="logo-icon"><Star /></el-icon>
          <h1>iFlytek星火智能面试</h1>
          <p class="subtitle">选择您偏好的面试交互模式</p>
        </div>
      </div>

      <!-- 模式选择卡片 -->
      <div class="mode-cards">
        <!-- 文本优先模式 -->
        <div class="mode-card primary" @click="selectMode('text-primary')">
          <div class="card-header">
            <div class="mode-icon text-mode">
              <el-icon><Document /></el-icon>
            </div>
            <div class="mode-info">
              <h3>文本优先模式</h3>
              <span class="mode-badge recommended">推荐</span>
            </div>
          </div>
          
          <div class="card-content">
            <p class="mode-description">
              以文字对话为核心的面试体验，专注于内容质量和逻辑表达的深度分析
            </p>
            
            <div class="mode-features">
              <div class="feature-item">
                <el-icon><Check /></el-icon>
                <span>智能文本分析</span>
              </div>
              <div class="feature-item">
                <el-icon><Check /></el-icon>
                <span>技术关键词提取</span>
              </div>
              <div class="feature-item">
                <el-icon><Check /></el-icon>
                <span>逻辑结构评估</span>
              </div>

            </div>
            
            <div class="mode-advantages">
              <div class="advantage-tag">响应迅速</div>
              <div class="advantage-tag">分析精准</div>
              <div class="advantage-tag">专注内容</div>
            </div>
          </div>
          
          <div class="card-footer">
            <el-button type="primary" size="large" @click.stop="startTextPrimaryInterview">
              开始文本面试
            </el-button>
          </div>
        </div>



        <!-- 测试模式 -->
        <div class="mode-card test" @click="selectMode('test')">
          <div class="card-header">
            <div class="mode-icon test-mode">
              <el-icon><Setting /></el-icon>
            </div>
            <div class="mode-info">
              <h3>测试模式</h3>
              <span class="mode-badge test">开发测试</span>
            </div>
          </div>
          
          <div class="card-content">
            <p class="mode-description">
              用于测试iFlytek星火大模型功能和系统性能
            </p>
            
            <div class="mode-features">
              <div class="feature-item">
                <el-icon><Check /></el-icon>
                <span>API连接测试</span>
              </div>
              <div class="feature-item">
                <el-icon><Check /></el-icon>
                <span>功能验证</span>
              </div>
              <div class="feature-item">
                <el-icon><Check /></el-icon>
                <span>性能监控</span>
              </div>
              <div class="feature-item">
                <el-icon><Check /></el-icon>
                <span>错误诊断</span>
              </div>
            </div>
          </div>
          
          <div class="card-footer">
            <el-button type="info" size="large" @click.stop="startTestMode">
              进入测试模式
            </el-button>
          </div>
        </div>
      </div>

      <!-- 模式对比说明 -->
      <div class="comparison-section">
        <h3>模式对比</h3>
        <div class="comparison-table">
          <div class="comparison-header">
            <div class="feature-name">功能特性</div>
            <div class="mode-column">文本优先</div>
            <div class="mode-column">多模态</div>
            <div class="mode-column">测试模式</div>
          </div>
          
          <div class="comparison-row">
            <div class="feature-name">文本分析</div>
            <div class="mode-column"><el-icon class="check"><Check /></el-icon></div>
            <div class="mode-column"><el-icon class="check"><Check /></el-icon></div>
            <div class="mode-column"><el-icon class="check"><Check /></el-icon></div>
          </div>
          
          <div class="comparison-row">
            <div class="feature-name">语音识别</div>
            <div class="mode-column"><el-icon class="disabled"><Close /></el-icon></div>
            <div class="mode-column"><el-icon class="disabled"><Close /></el-icon></div>
            <div class="mode-column"><el-icon class="disabled"><Close /></el-icon></div>
          </div>
          
          <div class="comparison-row">
            <div class="feature-name">视频分析</div>
            <div class="mode-column"><el-icon class="disabled"><Close /></el-icon></div>
            <div class="mode-column"><el-icon class="disabled"><Close /></el-icon></div>
            <div class="mode-column"><el-icon class="disabled"><Close /></el-icon></div>
          </div>
          
          <div class="comparison-row">
            <div class="feature-name">响应速度</div>
            <div class="mode-column">⚡ 快速</div>
            <div class="mode-column">🔄 中等</div>
            <div class="mode-column">🧪 测试</div>
          </div>
          
          <div class="comparison-row">
            <div class="feature-name">分析深度</div>
            <div class="mode-column">📊 深度</div>
            <div class="mode-column">📈 综合</div>
            <div class="mode-column">🔍 诊断</div>
          </div>
        </div>
      </div>

      <!-- 底部说明 -->
      <div class="footer-info">
        <div class="info-item">
          <el-icon><InfoFilled /></el-icon>
          <span>推荐使用文本优先模式获得最佳面试体验</span>
        </div>
        <div class="info-item">
          <el-icon><Star /></el-icon>
          <span>所有模式均基于iFlytek星火大模型技术</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Star, Document, VideoCamera, Setting, Check, Close, 
  Warning, InfoFilled
} from '@element-plus/icons-vue'

const router = useRouter()

// 选择模式
const selectMode = (mode) => {
  console.log('选择模式:', mode)
}

// 开始文本优先面试
const startTextPrimaryInterview = () => {
  ElMessage.success('正在启动文本优先面试模式...')
  const sessionId = 'text_primary_' + Date.now()
  router.push(`/interviewing/${sessionId}`)
}



// 开始测试模式
const startTestMode = () => {
  ElMessage.info('正在进入测试模式...')
  router.push('/spark-test')
}
</script>

<style scoped>
.interview-mode-selection {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
}

.selection-container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.header-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.logo-icon {
  font-size: 48px;
  color: #1890ff;
  margin-bottom: 16px;
}

.header-content h1 {
  margin: 0 0 12px 0;
  color: #262626;
  font-size: 32px;
  font-weight: 600;
}

.subtitle {
  margin: 0;
  color: #8c8c8c;
  font-size: 16px;
}

.mode-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.mode-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.mode-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.mode-card.primary {
  border-color: #1890ff;
}

.mode-card.primary:hover {
  border-color: #40a9ff;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.mode-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.mode-icon.text-mode {
  background: #e6f7ff;
  color: #1890ff;
}

.mode-icon.multimodal-mode {
  background: #f6ffed;
  color: #52c41a;
}

.mode-icon.test-mode {
  background: #fff7e6;
  color: #fa8c16;
}

.mode-info h3 {
  margin: 0 0 4px 0;
  color: #262626;
  font-size: 20px;
}

.mode-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.mode-badge.recommended {
  background: #f6ffed;
  color: #52c41a;
}

.mode-badge.test {
  background: #fff7e6;
  color: #fa8c16;
}

.mode-description {
  color: #595959;
  line-height: 1.6;
  margin-bottom: 20px;
}

.mode-features {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #262626;
}

.feature-item.disabled {
  color: #8c8c8c;
}

.mode-advantages {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.advantage-tag {
  padding: 4px 8px;
  background: #e6f7ff;
  color: #1890ff;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.advantage-tag.secondary {
  background: #f6ffed;
  color: #52c41a;
}

.card-footer {
  text-align: center;
}

.comparison-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.comparison-section h3 {
  margin: 0 0 20px 0;
  color: #262626;
  font-size: 20px;
  text-align: center;
}

.comparison-table {
  display: grid;
  grid-template-columns: 1fr repeat(3, 120px);
  gap: 1px;
  background: #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
}

.comparison-header,
.comparison-row {
  display: contents;
}

.comparison-header > div {
  background: #fafafa;
  padding: 12px;
  font-weight: 600;
  color: #262626;
  text-align: center;
}

.comparison-row > div {
  background: white;
  padding: 12px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-name {
  text-align: left !important;
  justify-content: flex-start !important;
}

.check {
  color: #52c41a;
}

.optional {
  color: #fa8c16;
}

.disabled {
  color: #d9d9d9;
}

.footer-info {
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
}

@media (max-width: 768px) {
  .mode-cards {
    grid-template-columns: 1fr;
  }
  
  .comparison-table {
    grid-template-columns: 1fr repeat(3, 80px);
    font-size: 12px;
  }
  
  .footer-info {
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
}
</style>
