<template>
  <div class="gradient-fade-demo-container">
    <div class="demo-header">
      <h2>iFlytek Spark 渐变淡出效果演示</h2>
      <p>展示不同主题的渐变淡出效果，确保视觉层次和品牌一致性</p>
    </div>

    <div class="demo-grid">
      <!-- 首页主题演示 -->
      <div class="demo-card homepage-gradient homepage-gradient-fade">
        <div class="demo-content">
          <h3>首页主题渐变淡出</h3>
          <p>蓝色系渐变，135度角，底部平滑淡出到白色</p>
          <div class="color-info">
            <span class="color-sample" style="background: #1890ff;"></span>
            <span>主色调: #1890ff</span>
          </div>
        </div>
      </div>

      <!-- 企业端主题演示 -->
      <div class="demo-card enterprise-gradient enterprise-gradient-fade">
        <div class="demo-content">
          <h3>企业端主题渐变淡出</h3>
          <p>紫色系渐变，专业商务风格，渐进式淡出效果</p>
          <div class="color-info">
            <span class="color-sample" style="background: #667eea;"></span>
            <span>主色调: #667eea</span>
          </div>
        </div>
      </div>

      <!-- 候选人端主题演示 -->
      <div class="demo-card candidate-gradient candidate-gradient-fade">
        <div class="demo-content">
          <h3>候选人端主题渐变淡出</h3>
          <p>青色系渐变，友好温和风格，柔和淡出过渡</p>
          <div class="color-info">
            <span class="color-sample" style="background: #0066cc;"></span>
            <span>主色调: #0066cc</span>
          </div>
        </div>
      </div>

      <!-- 报告中心主题演示 -->
      <div class="demo-card report-gradient report-gradient-fade">
        <div class="demo-content">
          <h3>报告中心主题渐变淡出</h3>
          <p>绿色系渐变，成功数据风格，清晰淡出边界</p>
          <div class="color-info">
            <span class="color-sample" style="background: #52c41a;"></span>
            <span>主色调: #52c41a</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 技术特性说明 -->
    <div class="tech-specs">
      <h3>技术实现特性</h3>
      <div class="specs-grid">
        <div class="spec-item">
          <h4>渐变方向</h4>
          <p>135度角（左上到右下）</p>
        </div>
        <div class="spec-item">
          <h4>透明度过渡</h4>
          <p>0.1 → 0.05 → 0.02 → 0</p>
        </div>
        <div class="spec-item">
          <h4>底部淡出</h4>
          <p>120px高度，多层次渐变</p>
        </div>
        <div class="spec-item">
          <h4>文字对比度</h4>
          <p>≥4.5:1 WCAG标准</p>
        </div>
      </div>
    </div>

    <!-- 交互测试区域 -->
    <div class="interactive-test">
      <h3>交互测试区域</h3>
      <div class="test-controls">
        <el-button @click="toggleFadeEffect" :type="fadeEnabled ? 'primary' : 'default'">
          {{ fadeEnabled ? '关闭淡出效果' : '开启淡出效果' }}
        </el-button>
        <el-button @click="switchTheme" type="info">
          切换主题: {{ currentTheme }}
        </el-button>
      </div>
      
      <div 
        class="test-area" 
        :class="[
          `${currentTheme}-gradient`,
          fadeEnabled ? `${currentTheme}-gradient-fade` : ''
        ]"
      >
        <div class="test-content">
          <h4>动态渐变淡出测试</h4>
          <p>当前主题: {{ themeNames[currentTheme] }}</p>
          <p>淡出效果: {{ fadeEnabled ? '已启用' : '已禁用' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 响应式数据
const fadeEnabled = ref(true)
const currentTheme = ref('homepage')

// 主题配置
const themes = ['homepage', 'enterprise', 'candidate', 'report']
const themeNames = {
  homepage: '首页主题',
  enterprise: '企业端主题',
  candidate: '候选人端主题',
  report: '报告中心主题'
}

// 方法
const toggleFadeEffect = () => {
  fadeEnabled.value = !fadeEnabled.value
}

const switchTheme = () => {
  const currentIndex = themes.indexOf(currentTheme.value)
  const nextIndex = (currentIndex + 1) % themes.length
  currentTheme.value = themes[nextIndex]
}
</script>

<style scoped>
.gradient-fade-demo-container {
  padding: var(--spacing-xl);
  max-width: 1400px;
  margin: 0 auto;
}

.demo-header {
  text-align: center;
  margin-bottom: var(--spacing-xxl);
}

.demo-header h2 {
  color: var(--iflytek-primary);
  font-size: 2rem;
  margin-bottom: var(--spacing-md);
}

.demo-header p {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xxl);
}

.demo-card {
  min-height: 200px;
  border-radius: 16px;
  padding: var(--spacing-lg);
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.demo-card:hover {
  transform: translateY(-4px);
}

.demo-content {
  position: relative;
  z-index: 20;
  color: white;
}

.demo-content h3 {
  margin-bottom: var(--spacing-md);
  font-size: 1.3rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.demo-content p {
  margin-bottom: var(--spacing-md);
  opacity: 0.9;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.color-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: 0.9rem;
}

.color-sample {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 2px solid rgba(255, 255, 255, 0.5);
}

.tech-specs {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-xxl);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.tech-specs h3 {
  color: var(--iflytek-primary);
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.specs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
}

.spec-item {
  text-align: center;
  padding: var(--spacing-md);
  border: 1px solid var(--iflytek-primary);
  border-radius: 8px;
}

.spec-item h4 {
  color: var(--iflytek-primary);
  margin-bottom: var(--spacing-sm);
}

.spec-item p {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.interactive-test {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: var(--spacing-xl);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.interactive-test h3 {
  color: var(--iflytek-primary);
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.test-controls {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.test-area {
  min-height: 150px;
  border-radius: 12px;
  padding: var(--spacing-lg);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.test-content {
  position: relative;
  z-index: 20;
  color: white;
  text-align: center;
}

.test-content h4 {
  margin-bottom: var(--spacing-md);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.test-content p {
  margin-bottom: var(--spacing-sm);
  opacity: 0.9;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .gradient-fade-demo-container {
    padding: var(--spacing-md);
  }
  
  .demo-grid {
    grid-template-columns: 1fr;
  }
  
  .specs-grid {
    grid-template-columns: 1fr;
  }
  
  .test-controls {
    flex-direction: column;
    align-items: center;
  }
}
</style>
