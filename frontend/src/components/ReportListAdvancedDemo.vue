<template>
  <div class="advanced-demo">
    <div class="demo-header">
      <h2>📋 报告列表高级功能演示</h2>
      <p>展示摘要滚动功能和统一按钮尺寸对齐效果</p>
    </div>

    <!-- 功能演示区域 -->
    <div class="demo-sections">
      
      <!-- 摘要滚动功能演示 -->
      <div class="demo-section">
        <h3>📜 摘要滚动功能演示</h3>
        <div class="scroll-demo-container">
          <div class="mock-table-row">
            <div class="mock-title-cell">
              <div class="report-icon-enhanced">📄</div>
              <div class="title-content-enhanced">
                <div class="title-text-enhanced">AI算法工程师面试评估报告</div>
                <div class="title-summary-container">
                  <div class="title-summary title-summary-enhanced title-summary-scrollable">
                    深度学习算法理解扎实，编程能力优秀，具备良好的数学基础和工程实践经验。候选人在机器学习模型设计、神经网络优化、数据预处理等方面表现突出，能够独立完成复杂的AI项目开发。同时具备良好的代码规范意识和团队协作能力，建议优先考虑录用。在技术深度方面，候选人展现了对深度学习框架的熟练掌握，包括TensorFlow、PyTorch等主流工具的使用。项目经验丰富，参与过多个大型AI项目的开发和部署。
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="scroll-tips">
            <p><strong>💡 使用提示：</strong></p>
            <ul>
              <li>鼠标悬停在摘要区域，使用滚轮上下滚动</li>
              <li>触摸设备可以直接滑动查看完整内容</li>
              <li>滚动条采用iFlytek品牌色彩设计</li>
              <li>不同屏幕尺寸下高度自动调整</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 统一按钮尺寸演示 -->
      <div class="demo-section">
        <h3>🎛️ 统一按钮尺寸对齐演示</h3>
        <div class="button-demo-container">
          <div class="mock-action-cell">
            <div class="action-buttons action-buttons-enhanced action-buttons-uniform">
              <button class="action-btn action-btn-enhanced action-btn-uniform btn-primary">
                <span class="icon">👁️</span>
                <span class="btn-text">查看</span>
              </button>
              <button class="action-btn action-btn-enhanced action-btn-uniform btn-default">
                <span class="icon">⬇️</span>
                <span class="btn-text">下载</span>
              </button>
              <button class="action-btn action-btn-enhanced action-btn-uniform btn-danger">
                <span class="icon">🗑️</span>
                <span class="btn-text">删除</span>
              </button>
            </div>
          </div>
          
          <div class="button-tips">
            <p><strong>💡 设计特点：</strong></p>
            <ul>
              <li>三个按钮具有完全相同的宽度和高度</li>
              <li>文字和图标完美居中对齐</li>
              <li>基于最长文字内容统一设置尺寸</li>
              <li>保持iFlytek品牌色彩和悬停效果</li>
              <li>响应式布局：大屏垂直排列，小屏水平排列</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 响应式效果演示 -->
      <div class="demo-section">
        <h3>📱 响应式效果演示</h3>
        <div class="responsive-demo-container">
          <div class="breakpoint-demo">
            <h4>不同屏幕尺寸下的效果：</h4>
            
            <div class="breakpoint-examples">
              <div class="breakpoint-example">
                <h5>桌面端 (>1200px)</h5>
                <div class="desktop-preview">
                  <div class="preview-summary">摘要高度: 60px</div>
                  <div class="preview-buttons vertical">
                    <div class="preview-btn">查看</div>
                    <div class="preview-btn">下载</div>
                    <div class="preview-btn">删除</div>
                  </div>
                </div>
              </div>
              
              <div class="breakpoint-example">
                <h5>平板端 (768px-1200px)</h5>
                <div class="tablet-preview">
                  <div class="preview-summary">摘要高度: 50px</div>
                  <div class="preview-buttons horizontal">
                    <div class="preview-btn">查看</div>
                    <div class="preview-btn">下载</div>
                    <div class="preview-btn">删除</div>
                  </div>
                </div>
              </div>
              
              <div class="breakpoint-example">
                <h5>手机端 (<480px)</h5>
                <div class="mobile-preview">
                  <div class="preview-summary">摘要高度: 32px</div>
                  <div class="preview-buttons vertical">
                    <div class="preview-btn">查看</div>
                    <div class="preview-btn">下载</div>
                    <div class="preview-btn">删除</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 实际效果测试 -->
      <div class="demo-section">
        <h3>🧪 实际效果测试</h3>
        <div class="test-container">
          <p>请调整浏览器窗口大小来测试响应式效果：</p>
          <div class="test-instructions">
            <ol>
              <li>将浏览器窗口拖拽到不同宽度</li>
              <li>观察摘要区域高度的变化</li>
              <li>查看按钮布局的自动调整</li>
              <li>测试滚动功能的流畅性</li>
            </ol>
          </div>
          
          <div class="current-viewport">
            <p>当前视口宽度: <span id="viewport-width">{{ viewportWidth }}px</span></p>
            <p>当前断点: <span id="current-breakpoint">{{ currentBreakpoint }}</span></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const viewportWidth = ref(window.innerWidth)
const currentBreakpoint = ref('')

const updateViewportInfo = () => {
  viewportWidth.value = window.innerWidth
  
  if (viewportWidth.value > 1200) {
    currentBreakpoint.value = '桌面端'
  } else if (viewportWidth.value > 768) {
    currentBreakpoint.value = '平板端'
  } else if (viewportWidth.value > 480) {
    currentBreakpoint.value = '手机端'
  } else {
    currentBreakpoint.value = '小屏手机'
  }
}

onMounted(() => {
  updateViewportInfo()
  window.addEventListener('resize', updateViewportInfo)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateViewportInfo)
})
</script>

<style scoped>
@import '@/styles/report-list-optimization.css';

.advanced-demo {
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

.demo-sections {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.demo-section {
  background: var(--iflytek-bg-primary);
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--iflytek-shadow-sm);
}

.demo-section h3 {
  color: var(--iflytek-text-primary);
  margin-bottom: 16px;
  font-size: 18px;
  border-bottom: 2px solid var(--iflytek-primary);
  padding-bottom: 8px;
}

.scroll-demo-container {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 24px;
  align-items: start;
}

.mock-table-row {
  border: 1px solid var(--iflytek-border-secondary);
  border-radius: 8px;
  padding: 16px;
  background: var(--iflytek-bg-secondary);
}

.mock-title-cell {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.scroll-tips, .button-tips {
  background: var(--iflytek-bg-tertiary);
  border-radius: 8px;
  padding: 16px;
  border-left: 4px solid var(--iflytek-primary);
}

.scroll-tips ul, .button-tips ul {
  margin-top: 8px;
  padding-left: 20px;
}

.scroll-tips li, .button-tips li {
  margin-bottom: 4px;
  color: var(--iflytek-text-secondary);
  font-size: 13px;
}

.button-demo-container {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 24px;
  align-items: start;
}

.mock-action-cell {
  border: 1px solid var(--iflytek-border-secondary);
  border-radius: 8px;
  padding: 16px;
  background: var(--iflytek-bg-secondary);
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

.breakpoint-examples {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.breakpoint-example {
  border: 1px solid var(--iflytek-border-secondary);
  border-radius: 8px;
  padding: 16px;
  background: var(--iflytek-bg-secondary);
}

.breakpoint-example h5 {
  color: var(--iflytek-primary);
  margin-bottom: 12px;
  font-size: 14px;
}

.preview-summary {
  background: var(--iflytek-bg-tertiary);
  padding: 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-bottom: 8px;
  text-align: center;
}

.preview-buttons.vertical {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.preview-buttons.horizontal {
  display: flex;
  gap: 4px;
}

.preview-btn {
  background: var(--iflytek-primary);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  text-align: center;
  font-size: 10px;
}

.test-container {
  background: var(--iflytek-bg-tertiary);
  border-radius: 8px;
  padding: 20px;
}

.test-instructions {
  margin: 16px 0;
}

.test-instructions ol {
  padding-left: 20px;
}

.test-instructions li {
  margin-bottom: 8px;
  color: var(--iflytek-text-secondary);
}

.current-viewport {
  background: var(--iflytek-bg-primary);
  border-radius: 6px;
  padding: 12px;
  margin-top: 16px;
  border: 1px solid var(--iflytek-border-secondary);
}

.current-viewport span {
  color: var(--iflytek-primary);
  font-weight: var(--font-weight-semibold);
}

@media (max-width: 768px) {
  .scroll-demo-container,
  .button-demo-container {
    grid-template-columns: 1fr;
  }
  
  .breakpoint-examples {
    grid-template-columns: 1fr;
  }
}
</style>
