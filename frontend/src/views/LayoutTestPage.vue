<template>
  <div class="layout-test-page homepage-gradient-fade">
    <div class="test-navigation">
      <h1>iFlytek Spark 优化布局测试</h1>
      <p>点击下方按钮测试不同的优化页面布局和渐变淡出效果</p>
      
      <div class="test-buttons">
        <el-button 
          type="primary" 
          size="large"
          @click="navigateTo('/layout-showcase')"
        >
          <el-icon><Grid /></el-icon>
          布局展示中心
        </el-button>
        
        <el-button 
          type="primary" 
          size="large"
          @click="navigateTo('/optimized-enterprise')"
        >
          <el-icon><TrendCharts /></el-icon>
          企业端管理平台
        </el-button>
        
        <el-button 
          type="primary" 
          size="large"
          @click="navigateTo('/optimized-candidate')"
        >
          <el-icon><User /></el-icon>
          候选人门户
        </el-button>
        
        <el-button
          type="primary"
          size="large"
          @click="navigateTo('/optimized-reports')"
        >
          <el-icon><DataBoard /></el-icon>
          报告分析中心
        </el-button>

        <el-button
          type="success"
          size="large"
          @click="navigateTo('/gradient-fade-demo')"
        >
          <el-icon><Grid /></el-icon>
          渐变淡出演示
        </el-button>
      </div>
    </div>

    <!-- 布局特性展示 -->
    <div class="features-demo">
      <h2>新布局系统特性</h2>
      
      <div class="feature-grid">
        <div class="feature-card responsive-demo">
          <h3>响应式网格布局</h3>
          <div class="grid-demo">
            <div class="grid-item">大屏: 2列</div>
            <div class="grid-item">中屏: 3列</div>
            <div class="grid-item">小屏: 1列</div>
          </div>
        </div>
        
        <div class="feature-card gradient-demo">
          <h3>渐变背景系统</h3>
          <div class="gradient-samples">
            <div class="gradient-sample homepage-gradient">首页</div>
            <div class="gradient-sample enterprise-gradient">企业</div>
            <div class="gradient-sample candidate-gradient">候选人</div>
            <div class="gradient-sample report-gradient">报告</div>
          </div>
        </div>
        
        <div class="feature-card animation-demo">
          <h3>动画过渡效果</h3>
          <div class="animation-samples">
            <div class="hover-lift">悬停提升</div>
            <div class="fade-in-up">淡入上升</div>
            <div class="gradient-pulse">渐变脉冲</div>
          </div>
        </div>

        <div class="feature-card gradient-fade-demo">
          <h3>渐变淡出效果</h3>
          <div class="fade-samples">
            <div class="fade-sample gradient-fade-top">顶部淡出</div>
            <div class="fade-sample gradient-fade-bottom">底部淡出</div>
            <div class="fade-sample gradient-fade-sides">侧边淡出</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import {
  Grid,
  TrendCharts,
  User,
  DataBoard
} from '@element-plus/icons-vue'

const router = useRouter()

const navigateTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
.layout-test-page {
  min-height: 100vh;
  padding: var(--spacing-xl);
  background: linear-gradient(
    135deg,
    var(--iflytek-primary) 0%,
    rgba(24, 144, 255, 0.05) 100%
  );
  position: relative;
}

.test-navigation {
  text-align: center;
  margin-bottom: var(--spacing-xxl);
}

.test-navigation h1 {
  font-size: 2.5rem;
  color: white;
  margin-bottom: var(--spacing-md);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.test-navigation p {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: var(--spacing-xl);
}

.test-buttons {
  display: flex;
  gap: var(--spacing-lg);
  justify-content: center;
  flex-wrap: wrap;
}

.test-buttons .el-button {
  min-width: 200px;
  height: 60px;
  font-size: 1.1rem;
}

.features-demo {
  max-width: 1200px;
  margin: 0 auto;
}

.features-demo h2 {
  text-align: center;
  color: white;
  font-size: 2rem;
  margin-bottom: var(--spacing-xl);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-lg);
}

.feature-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: var(--spacing-lg);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
}

.feature-card h3 {
  color: var(--iflytek-primary);
  margin-bottom: var(--spacing-md);
  font-size: 1.3rem;
}

/* 响应式演示 */
.grid-demo {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-sm);
}

.grid-item {
  background: var(--iflytek-primary);
  color: white;
  padding: var(--spacing-sm);
  border-radius: 8px;
  text-align: center;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .grid-demo {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 769px) and (max-width: 1199px) {
  .grid-demo {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1200px) {
  .grid-demo {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 渐变演示 */
.gradient-samples {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-sm);
}

.gradient-sample {
  padding: var(--spacing-md);
  border-radius: 8px;
  color: white;
  text-align: center;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.gradient-sample.homepage-gradient {
  background: linear-gradient(135deg, #1890ff 0%, rgba(24, 144, 255, 0.7) 100%);
}

.gradient-sample.enterprise-gradient {
  background: linear-gradient(135deg, #667eea 0%, rgba(102, 126, 234, 0.7) 100%);
}

.gradient-sample.candidate-gradient {
  background: linear-gradient(135deg, #0066cc 0%, rgba(0, 102, 204, 0.7) 100%);
}

.gradient-sample.report-gradient {
  background: linear-gradient(135deg, #52c41a 0%, rgba(82, 196, 26, 0.7) 100%);
}

/* 动画演示 */
.animation-samples {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.animation-samples > div {
  background: var(--iflytek-primary);
  color: white;
  padding: var(--spacing-md);
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
}

.hover-lift {
  transition: transform 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
}

.fade-in-up {
  animation: fadeInUp 2s ease infinite;
}

@keyframes fadeInUp {
  0%, 100% { opacity: 0.7; transform: translateY(0); }
  50% { opacity: 1; transform: translateY(-4px); }
}

.gradient-pulse {
  animation: gradientPulse 3s ease-in-out infinite;
}

@keyframes gradientPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* 渐变淡出演示样式 */
.gradient-fade-demo {
  background: linear-gradient(135deg, #f0f2f5 0%, #e6f7ff 100%);
}

.fade-samples {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.fade-sample {
  background: linear-gradient(135deg, #1890ff 0%, #52c41a 100%);
  color: white;
  padding: var(--spacing-lg);
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .layout-test-page {
    padding: var(--spacing-md);
  }
  
  .test-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .test-buttons .el-button {
    width: 100%;
    max-width: 300px;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
  }
  
  .gradient-samples {
    grid-template-columns: 1fr;
  }
}
</style>
