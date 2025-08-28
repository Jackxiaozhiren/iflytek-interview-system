<template>
  <div class="ui-optimization-demo homepage-gradient">
    <!-- 演示页面头部 -->
    <section class="demo-hero gradient-hero-bg optimized-hero">
      <div class="optimized-container">
        <div class="hero-content content-center">
          <h1 class="optimized-title-h1" style="color: white;">
            iFlytek星火多模态面试AI系统
          </h1>
          <h2 class="optimized-title-h2" style="color: rgba(255,255,255,0.9);">
            界面设计优化演示
          </h2>
          <p class="optimized-text-large" style="color: rgba(255,255,255,0.8);">
            基于用友大易设计风格的渐变背景系统 + 响应式布局优化
          </p>
          
          <div class="demo-stats stats-display">
            <div class="stat-item optimized-card">
              <div class="stat-number">100%</div>
              <div class="stat-label">响应式设计</div>
            </div>
            <div class="stat-item optimized-card">
              <div class="stat-number">WCAG 2.1</div>
              <div class="stat-label">无障碍标准</div>
            </div>
            <div class="stat-item optimized-card">
              <div class="stat-number">4.5:1</div>
              <div class="stat-label">对比度比例</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 优化特性展示 -->
    <section class="optimization-features section-spacing gradient-fade-top">
      <div class="optimized-container">
        <div class="content-center">
          <h2 class="optimized-title-h2">界面优化特性</h2>
          <p class="optimized-text">全面提升用户体验的设计系统</p>
        </div>

        <div class="features-grid equal-height-cards optimized-grid-3">
          <div class="feature-card optimized-card" v-for="feature in optimizationFeatures" :key="feature.id">
            <div class="feature-icon" :style="{ background: feature.color }">
              <el-icon><component :is="feature.icon" /></el-icon>
            </div>
            <h3 class="optimized-title-h3">{{ feature.title }}</h3>
            <p class="optimized-text">{{ feature.description }}</p>
            <ul class="feature-list">
              <li v-for="item in feature.features" :key="item">
                <el-icon class="check-icon"><Check /></el-icon>
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- 渐变背景演示 -->
    <section class="gradient-demo section-spacing gradient-overlay-bg">
      <div class="optimized-container">
        <div class="content-center">
          <h2 class="optimized-title-h2">渐变背景系统演示</h2>
          <p class="optimized-text">参考用友大易设计风格的多种渐变效果</p>
        </div>

        <div class="gradient-showcase optimized-grid-2">
          <div class="gradient-sample gradient-hero-bg optimized-card">
            <h4 class="optimized-title-h3" style="color: white;">英雄区域渐变</h4>
            <p style="color: rgba(255,255,255,0.9);">主要页面头部使用的渐变背景</p>
          </div>
          
          <div class="gradient-sample gradient-animated-bg optimized-card">
            <h4 class="optimized-title-h3" style="color: white;">动态渐变效果</h4>
            <p style="color: rgba(255,255,255,0.9);">具有动画效果的渐变背景</p>
          </div>
          
          <div class="gradient-sample gradient-overlay-bg optimized-card">
            <h4 class="optimized-title-h3">覆盖层渐变</h4>
            <p class="optimized-text">微妙的覆盖层效果，增强内容层次</p>
          </div>
          
          <div class="gradient-sample gradient-breathing-bg optimized-card">
            <h4 class="optimized-title-h3" style="color: white;">呼吸效果</h4>
            <p style="color: rgba(255,255,255,0.9);">具有呼吸动画的渐变背景</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 布局优化演示 -->
    <section class="layout-demo section-spacing">
      <div class="optimized-container">
        <div class="content-center">
          <h2 class="optimized-title-h2">布局优化演示</h2>
          <p class="optimized-text">解决空白区域过多、比例不协调等问题</p>
        </div>

        <div class="layout-examples">
          <!-- 黄金比例布局 -->
          <div class="layout-example">
            <h3 class="optimized-title-h3">黄金比例布局</h3>
            <div class="golden-ratio-layout">
              <div class="layout-content optimized-card">
                <h4>主要内容区域</h4>
                <p class="optimized-text">采用1.618:1的黄金比例，提供最佳的视觉平衡</p>
              </div>
              <div class="layout-sidebar optimized-card">
                <h4>侧边栏区域</h4>
                <p class="optimized-text">辅助信息展示</p>
              </div>
            </div>
          </div>

          <!-- 对称布局 -->
          <div class="layout-example">
            <h3 class="optimized-title-h3">对称布局</h3>
            <div class="symmetric-layout">
              <div class="layout-item optimized-card">
                <h4>左侧内容</h4>
                <p class="optimized-text">等宽对称布局，适合并列展示</p>
              </div>
              <div class="layout-item optimized-card">
                <h4>右侧内容</h4>
                <p class="optimized-text">保持视觉平衡和协调性</p>
              </div>
            </div>
          </div>

          <!-- 智能网格 -->
          <div class="layout-example">
            <h3 class="optimized-title-h3">智能网格系统</h3>
            <div class="smart-grid">
              <div class="grid-item optimized-card" v-for="i in 6" :key="i">
                <h4>网格项目 {{ i }}</h4>
                <p class="optimized-text">自适应网格布局</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 响应式演示 -->
    <section class="responsive-demo section-spacing gradient-fade-bottom">
      <div class="optimized-container">
        <div class="content-center">
          <h2 class="optimized-title-h2">响应式设计演示</h2>
          <p class="optimized-text">在不同屏幕尺寸下的自适应效果</p>
        </div>

        <div class="responsive-showcase">
          <div class="device-preview">
            <div class="device desktop">
              <div class="screen">
                <div class="mini-layout">
                  <div class="mini-header"></div>
                  <div class="mini-content">
                    <div class="mini-grid">
                      <div class="mini-card"></div>
                      <div class="mini-card"></div>
                      <div class="mini-card"></div>
                      <div class="mini-card"></div>
                    </div>
                  </div>
                </div>
              </div>
              <p>桌面端 (1200px+)</p>
            </div>

            <div class="device tablet">
              <div class="screen">
                <div class="mini-layout">
                  <div class="mini-header"></div>
                  <div class="mini-content">
                    <div class="mini-grid tablet-grid">
                      <div class="mini-card"></div>
                      <div class="mini-card"></div>
                    </div>
                  </div>
                </div>
              </div>
              <p>平板端 (768px-1200px)</p>
            </div>

            <div class="device mobile">
              <div class="screen">
                <div class="mini-layout">
                  <div class="mini-header"></div>
                  <div class="mini-content">
                    <div class="mini-grid mobile-grid">
                      <div class="mini-card"></div>
                    </div>
                  </div>
                </div>
              </div>
              <p>移动端 (< 768px)</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 技术规格 -->
    <section class="tech-specs section-spacing gradient-animated-bg">
      <div class="optimized-container">
        <div class="content-center">
          <h2 class="optimized-title-h2" style="color: white;">技术规格</h2>
          <p class="optimized-text-large" style="color: rgba(255,255,255,0.9);">
            符合现代Web标准的设计系统
          </p>
        </div>

        <div class="specs-grid optimized-grid-2">
          <div class="spec-category optimized-card">
            <h3 class="optimized-title-h3">设计标准</h3>
            <ul class="spec-list">
              <li>WCAG 2.1 AA 无障碍标准</li>
              <li>4.5:1 最小对比度比例</li>
              <li>Microsoft YaHei 中文字体</li>
              <li>响应式断点设计</li>
            </ul>
          </div>

          <div class="spec-category optimized-card">
            <h3 class="optimized-title-h3">技术实现</h3>
            <ul class="spec-list">
              <li>CSS Grid + Flexbox 布局</li>
              <li>CSS 自定义属性 (变量)</li>
              <li>GPU 加速动画</li>
              <li>性能优化的渐变效果</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  Cpu, Grid, TrendCharts, Check, Star
} from '@element-plus/icons-vue'

const optimizationFeatures = ref([
  {
    id: 1,
    title: '渐变背景系统',
    description: '参考用友大易设计风格的多层次渐变背景',
    icon: Cpu,
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    features: [
      '平滑的渐变过渡效果',
      '自然的视觉衔接',
      'iFlytek品牌色彩一致性',
      '动态渐变动画效果'
    ]
  },
  {
    id: 2,
    title: '响应式布局优化',
    description: '解决空白区域过多、比例不协调等问题',
    icon: Grid,
    color: 'linear-gradient(135deg, #52c41a 0%, #1890ff 100%)',
    features: [
      '黄金比例布局系统',
      '智能网格自适应',
      '居中排版优化',
      '等高卡片布局'
    ]
  },
  {
    id: 3,
    title: '性能与可访问性',
    description: '确保优秀的用户体验和无障碍访问',
    icon: Monitor,
    color: 'linear-gradient(135deg, #faad14 0%, #ff7875 100%)',
    features: [
      'WCAG 2.1 AA标准合规',
      'GPU加速动画',
      '减少重排重绘',
      '中文字体优化'
    ]
  }
])
</script>

<style scoped>
/* 导入优化系统 */
@import '@/styles/gradient-background-system.css';
@import '@/styles/layout-optimization.css';

.ui-optimization-demo {
  min-height: 100vh;
}

.demo-stats .stat-item {
  min-width: 120px;
}

.feature-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: white;
  font-size: 24px;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 16px 0 0 0;
}

.feature-list li {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
}

.check-icon {
  color: #52c41a;
  margin-right: 8px;
  font-size: 16px;
}

.gradient-showcase {
  gap: clamp(20px, 4vw, 32px);
}

.gradient-sample {
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 24px;
}

.layout-examples {
  display: flex;
  flex-direction: column;
  gap: clamp(30px, 6vh, 60px);
}

.layout-example {
  margin-bottom: 40px;
}

.layout-content,
.layout-sidebar,
.layout-item {
  padding: 20px;
  text-align: center;
}

.grid-item {
  padding: 16px;
  text-align: center;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.responsive-showcase {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.device-preview {
  display: flex;
  gap: 40px;
  align-items: flex-end;
}

.device {
  text-align: center;
}

.screen {
  border: 2px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.desktop .screen {
  width: 200px;
  height: 120px;
}

.tablet .screen {
  width: 120px;
  height: 160px;
}

.mobile .screen {
  width: 80px;
  height: 140px;
}

.mini-layout {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.mini-header {
  height: 20%;
  background: #1890ff;
}

.mini-content {
  flex: 1;
  padding: 8px;
}

.mini-grid {
  display: grid;
  gap: 4px;
  height: 100%;
  grid-template-columns: repeat(2, 1fr);
}

.tablet-grid {
  grid-template-columns: repeat(2, 1fr);
}

.mobile-grid {
  grid-template-columns: 1fr;
}

.mini-card {
  background: #f0f0f0;
  border-radius: 2px;
}

.device p {
  margin-top: 12px;
  font-size: 12px;
  color: #666;
}

.specs-grid {
  margin-top: 40px;
}

.spec-list {
  list-style: none;
  padding: 0;
  margin: 16px 0 0 0;
}

.spec-list li {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
}

.spec-list li:last-child {
  border-bottom: none;
}

@media (max-width: 768px) {
  .device-preview {
    flex-direction: column;
    gap: 20px;
    align-items: center;
  }
  
  .gradient-showcase {
    grid-template-columns: 1fr;
  }
}
</style>
