<template>
  <div class="report-list-demo">
    <div class="demo-header">
      <h2>📋 报告列表界面优化演示</h2>
      <p>展示字体大小协调、操作框布局优化、整体视觉协调和移动端适配效果</p>
    </div>

    <!-- 优化前后对比 -->
    <div class="comparison-section">
      <div class="comparison-item">
        <h3>🎯 优化重点展示</h3>
        <div class="feature-grid">
          <div class="feature-card">
            <div class="feature-icon">🔤</div>
            <h4>字体大小协调</h4>
            <ul>
              <li>报告标题: 16px (突出显示)</li>
              <li>内容摘要: 13px (适当弱化)</li>
              <li>元数据: 12px (时间、候选人)</li>
              <li>操作按钮: 11px (功能性文本)</li>
            </ul>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">🎛️</div>
            <h4>操作框布局优化</h4>
            <ul>
              <li>按钮尺寸: 64px × 32px</li>
              <li>间距统一: 8px 水平间距</li>
              <li>悬停效果: 向上移动 + 阴影</li>
              <li>图标配合: 13px 图标大小</li>
            </ul>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">🎨</div>
            <h4>视觉协调优化</h4>
            <ul>
              <li>iFlytek品牌色彩一致性</li>
              <li>Microsoft YaHei字体</li>
              <li>统一间距和圆角系统</li>
              <li>现代化阴影效果</li>
            </ul>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">📱</div>
            <h4>移动端适配</h4>
            <ul>
              <li>响应式字体大小调整</li>
              <li>操作按钮布局优化</li>
              <li>触摸友好的交互设计</li>
              <li>小屏幕内容紧凑化</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 样式示例 -->
    <div class="style-examples">
      <h3>🎨 样式效果预览</h3>
      
      <!-- 字体大小示例 -->
      <div class="example-section">
        <h4>字体大小层次</h4>
        <div class="font-examples">
          <div class="font-example">
            <span class="title-text-enhanced">AI算法工程师面试评估报告</span>
            <span class="title-summary-enhanced">深度学习算法理解扎实，编程能力优秀，具备良好的数学基础和工程实践经验</span>
          </div>
          <div class="font-example">
            <span class="candidate-name-enhanced">候选人: 张三</span>
            <span class="time-text-enhanced">创建时间: 2024-12-19 14:30</span>
          </div>
        </div>
      </div>
      
      <!-- 操作按钮示例 -->
      <div class="example-section">
        <h4>操作按钮效果</h4>
        <div class="action-buttons-enhanced">
          <button class="action-btn-enhanced btn-primary">
            <span class="icon">👁️</span>
            查看
          </button>
          <button class="action-btn-enhanced btn-default">
            <span class="icon">⬇️</span>
            下载
          </button>
          <button class="action-btn-enhanced btn-danger">
            <span class="icon">🗑️</span>
            删除
          </button>
        </div>
      </div>
      
      <!-- 评分显示示例 -->
      <div class="example-section">
        <h4>评分显示效果</h4>
        <div class="score-examples">
          <div class="score-cell-enhanced">
            <span class="score-value-enhanced score-excellent">92</span>
            <span class="score-unit-enhanced">分</span>
          </div>
          <div class="score-cell-enhanced">
            <span class="score-value-enhanced score-good">85</span>
            <span class="score-unit-enhanced">分</span>
          </div>
          <div class="score-cell-enhanced">
            <span class="score-value-enhanced score-average">76</span>
            <span class="score-unit-enhanced">分</span>
          </div>
          <div class="score-cell-enhanced">
            <span class="score-value-enhanced score-poor">68</span>
            <span class="score-unit-enhanced">分</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 响应式演示 -->
    <div class="responsive-demo">
      <h3>📱 响应式效果演示</h3>
      <div class="breakpoint-info">
        <div class="breakpoint-item">
          <strong>桌面端 (>1200px)</strong>
          <p>完整布局，所有功能可见</p>
        </div>
        <div class="breakpoint-item">
          <strong>平板端 (768px-1200px)</strong>
          <p>操作按钮垂直排列，字体适当缩小</p>
        </div>
        <div class="breakpoint-item">
          <strong>手机端 (<768px)</strong>
          <p>紧凑布局，摘要单行显示</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 演示数据
const demoData = ref({
  title: 'AI算法工程师面试评估报告',
  summary: '深度学习算法理解扎实，编程能力优秀，具备良好的数学基础和工程实践经验',
  candidate: '张三',
  score: 88,
  time: '2024-12-19 14:30'
})
</script>

<style scoped>
@import '@/styles/report-list-optimization.css';

.report-list-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  font-family: var(--font-family-chinese-base);
}

.demo-header {
  text-align: center;
  margin-bottom: 32px;
  padding: 24px;
  background: var(--iflytek-bg-primary);
  border-radius: 12px;
  box-shadow: var(--iflytek-shadow-sm);
}

.demo-header h2 {
  color: var(--iflytek-primary);
  margin-bottom: 8px;
  font-size: 24px;
}

.demo-header p {
  color: var(--iflytek-text-secondary);
  font-size: 14px;
}

.comparison-section {
  margin-bottom: 32px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 16px;
}

.feature-card {
  background: var(--iflytek-bg-primary);
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--iflytek-shadow-sm);
  border: 1px solid var(--iflytek-border-secondary);
}

.feature-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.feature-card h4 {
  color: var(--iflytek-text-primary);
  margin-bottom: 12px;
  font-size: 16px;
}

.feature-card ul {
  list-style: none;
  padding: 0;
}

.feature-card li {
  color: var(--iflytek-text-secondary);
  font-size: 13px;
  margin-bottom: 6px;
  padding-left: 16px;
  position: relative;
}

.feature-card li::before {
  content: '•';
  color: var(--iflytek-primary);
  position: absolute;
  left: 0;
}

.style-examples {
  background: var(--iflytek-bg-primary);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: var(--iflytek-shadow-sm);
}

.example-section {
  margin-bottom: 24px;
}

.example-section h4 {
  color: var(--iflytek-text-primary);
  margin-bottom: 12px;
  font-size: 16px;
}

.font-examples {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.font-example {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
  background: var(--iflytek-bg-secondary);
  border-radius: 8px;
}

.score-examples {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.btn-primary {
  background: linear-gradient(135deg, var(--iflytek-primary) 0%, var(--iflytek-secondary) 100%);
  color: white;
  border: 1px solid var(--iflytek-primary);
}

.btn-default {
  background: var(--iflytek-bg-primary);
  color: var(--iflytek-text-primary);
  border: 1px solid var(--iflytek-border-primary);
}

.btn-danger {
  background: var(--iflytek-bg-primary);
  color: #ff4d4f;
  border: 1px solid #ff4d4f;
}

.responsive-demo {
  background: var(--iflytek-bg-primary);
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--iflytek-shadow-sm);
}

.breakpoint-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.breakpoint-item {
  padding: 16px;
  background: var(--iflytek-bg-secondary);
  border-radius: 8px;
  border-left: 4px solid var(--iflytek-primary);
}

.breakpoint-item strong {
  color: var(--iflytek-primary);
  display: block;
  margin-bottom: 8px;
}

.breakpoint-item p {
  color: var(--iflytek-text-secondary);
  font-size: 13px;
  margin: 0;
}

@media (max-width: 768px) {
  .report-list-demo {
    padding: 16px;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
  }
  
  .score-examples {
    justify-content: center;
  }
}
</style>
