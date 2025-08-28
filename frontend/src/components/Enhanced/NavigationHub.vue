<template>
  <div class="navigation-hub">
    <div class="hub-container">
      <!-- 头部标题 -->
      <div class="hub-header">
        <h1 class="hub-title">
          <el-icon><Grid /></el-icon>
          iFlytek Spark AI面试系统导航中心
        </h1>
        <p class="hub-subtitle">基于用友大易平台设计理念的企业级组件展示</p>
      </div>

      <!-- 组件导航卡片 -->
      <div class="navigation-grid">
        <!-- 企业端主页 -->
        <div class="nav-card enterprise-card" @click="navigateTo('/enterprise-home')">
          <div class="card-header">
            <div class="card-icon enterprise-icon">
              <el-icon :size="32"><OfficeBuilding /></el-icon>
            </div>
            <div class="card-badge">企业端</div>
          </div>
          <div class="card-content">
            <h3 class="card-title">企业级主页</h3>
            <p class="card-description">
              借鉴大易平台的渐变背景和卡片式布局，突出iFlytek Spark AI技术优势
            </p>
            <div class="card-features">
              <span class="feature-tag">渐变背景</span>
              <span class="feature-tag">浮动动画</span>
              <span class="feature-tag">技术展示</span>
            </div>
          </div>
          <div class="card-footer">
            <el-button type="primary" class="nav-button">
              访问企业主页
              <el-icon><ArrowRight /></el-icon>
            </el-button>
          </div>
        </div>

        <!-- 候选人门户 -->
        <div class="nav-card candidate-card" @click="navigateTo('/candidate-portal')">
          <div class="card-header">
            <div class="card-icon candidate-icon">
              <el-icon :size="32"><User /></el-icon>
            </div>
            <div class="card-badge">候选人端</div>
          </div>
          <div class="card-content">
            <h3 class="card-title">候选人专属门户</h3>
            <p class="card-description">
              差异化的候选人体验设计，AI智能建议和个性化学习路径
            </p>
            <div class="card-features">
              <span class="feature-tag">AI建议</span>
              <span class="feature-tag">学习路径</span>
              <span class="feature-tag">进度跟踪</span>
            </div>
          </div>
          <div class="card-footer">
            <el-button type="success" class="nav-button">
              进入候选人门户
              <el-icon><ArrowRight /></el-icon>
            </el-button>
          </div>
        </div>

        <!-- 智能仪表板 -->
        <div class="nav-card dashboard-card" @click="navigateTo('/intelligent-dashboard')">
          <div class="card-header">
            <div class="card-icon dashboard-icon">
              <el-icon :size="32"><Grid /></el-icon>
            </div>
            <div class="card-badge">数据分析</div>
          </div>
          <div class="card-content">
            <h3 class="card-title">智能数据仪表板</h3>
            <p class="card-description">
              专业级数据可视化展示，实时指标监控和AI洞察建议
            </p>
            <div class="card-features">
              <span class="feature-tag">实时监控</span>
              <span class="feature-tag">数据可视化</span>
              <span class="feature-tag">AI洞察</span>
            </div>
          </div>
          <div class="card-footer">
            <el-button type="warning" class="nav-button">
              查看数据仪表板
              <el-icon><ArrowRight /></el-icon>
            </el-button>
          </div>
        </div>

        <!-- AI配置器 -->
        <div class="nav-card configurator-card" @click="navigateTo('/ai-configurator')">
          <div class="card-header">
            <div class="card-icon configurator-icon">
              <el-icon :size="32"><Setting /></el-icon>
            </div>
            <div class="card-badge">AI配置</div>
          </div>
          <div class="card-content">
            <h3 class="card-title">AI面试配置器</h3>
            <p class="card-description">
              4步式专业配置向导，多模态AI能力配置和Spark模型调优
            </p>
            <div class="card-features">
              <span class="feature-tag">配置向导</span>
              <span class="feature-tag">多模态AI</span>
              <span class="feature-tag">模型调优</span>
            </div>
          </div>
          <div class="card-footer">
            <el-button type="info" class="nav-button">
              打开AI配置器
              <el-icon><ArrowRight /></el-icon>
            </el-button>
          </div>
        </div>
      </div>

      <!-- 原有系统快速访问 -->
      <div class="legacy-section">
        <h2 class="section-title">原有系统快速访问</h2>
        <div class="legacy-grid">
          <div class="legacy-item" @click="navigateTo('/')">
            <el-icon><House /></el-icon>
            <span>系统首页</span>
          </div>
          <div class="legacy-item" @click="navigateTo('/demo')">
            <el-icon><VideoPlay /></el-icon>
            <span>演示页面</span>
          </div>
          <div class="legacy-item" @click="navigateTo('/interview-selection')">
            <el-icon><Select /></el-icon>
            <span>面试选择</span>
          </div>
          <div class="legacy-item" @click="navigateTo('/interviewing')">
            <el-icon><Microphone /></el-icon>
            <span>面试页面</span>
          </div>
          <div class="legacy-item" @click="navigateTo('/reports')">
            <el-icon><Document /></el-icon>
            <span>报告页面</span>
          </div>
        </div>
      </div>

      <!-- 设计特色说明 -->
      <div class="design-highlights">
        <h2 class="section-title">设计特色亮点</h2>
        <div class="highlights-grid">
          <div class="highlight-item">
            <div class="highlight-icon">
              <el-icon><Cpu /></el-icon>
            </div>
            <h4>iFlytek Spark AI技术</h4>
            <p>突出讯飞星火大模型的技术优势和多模态分析能力</p>
          </div>
          <div class="highlight-item">
            <div class="highlight-icon">
              <el-icon><Brush /></el-icon>
            </div>
            <h4>大易平台设计理念</h4>
            <p>借鉴渐变背景、卡片布局、现代交互等优秀设计元素</p>
          </div>
          <div class="highlight-item">
            <div class="highlight-icon">
              <el-icon><TrendCharts /></el-icon>
            </div>
            <h4>企业级用户体验</h4>
            <p>专业的数据可视化和差异化的用户界面设计</p>
          </div>
          <div class="highlight-item">
            <div class="highlight-icon">
              <el-icon><Star /></el-icon>
            </div>
            <h4>品牌一致性</h4>
            <p>保持iFlytek品牌色彩和中文本地化标准</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import {
  Grid, OfficeBuilding, User, Setting, ArrowRight,
  House, VideoPlay, Select, Microphone, Document, Cpu, Brush,
  TrendCharts, Star
} from '@element-plus/icons-vue'

const router = useRouter()

const navigateTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
.navigation-hub {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%);
  padding: 40px 20px;
}

.hub-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* 头部样式 */
.hub-header {
  text-align: center;
  margin-bottom: 60px;
}

.hub-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;
}

.hub-subtitle {
  font-size: 1.125rem;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto;
}

/* 导航卡片网格 */
.navigation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 32px;
  margin-bottom: 80px;
}

.nav-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.nav-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
}

.nav-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #1890ff, #52c41a, #722ed1, #fa8c16);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.enterprise-icon {
  background: linear-gradient(135deg, #1890ff 0%, #0066cc 100%);
}

.candidate-icon {
  background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
}

.dashboard-icon {
  background: linear-gradient(135deg, #fa8c16 0%, #d46b08 100%);
}

.configurator-icon {
  background: linear-gradient(135deg, #722ed1 0%, #531dab 100%);
}

.card-badge {
  background: #f0f8ff;
  color: #1890ff;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.card-content {
  margin-bottom: 24px;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 12px;
}

.card-description {
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 16px;
}

.card-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.feature-tag {
  background: #f8fafc;
  color: #64748b;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  border: 1px solid #e2e8f0;
}

.nav-button {
  width: 100%;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
}

/* 原有系统访问 */
.legacy-section {
  margin-bottom: 60px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 32px;
}

.legacy-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.legacy-item {
  background: white;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #f1f5f9;
}

.legacy-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-color: #1890ff;
}

.legacy-item .el-icon {
  font-size: 32px;
  color: #1890ff;
  margin-bottom: 12px;
}

.legacy-item span {
  display: block;
  font-weight: 600;
  color: #2c3e50;
}

/* 设计亮点 */
.design-highlights {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.highlights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 32px;
}

.highlight-item {
  text-align: center;
}

.highlight-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: white;
}

.highlight-item h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
}

.highlight-item p {
  color: #64748b;
  line-height: 1.6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hub-title {
    font-size: 2rem;
    flex-direction: column;
    gap: 8px;
  }
  
  .navigation-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .legacy-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .highlights-grid {
    grid-template-columns: 1fr;
  }
}
</style>
