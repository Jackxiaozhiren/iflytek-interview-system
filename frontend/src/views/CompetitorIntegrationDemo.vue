<template>
  <div class="competitor-integration-demo">
    <!-- 页面头部 -->
    <header class="demo-header">
      <div class="header-content">
        <h1 class="demo-title">
          <span class="title-icon">🎯</span>
          竞品设计整合演示
        </h1>
        <p class="demo-subtitle">
          展示基于Offermore.cc和Dayee.com设计元素的多模态面试评估系统
        </p>
      </div>
    </header>

    <!-- 导航标签 -->
    <div class="demo-navigation">
      <button 
        v-for="tab in demoTabs" 
        :key="tab.id"
        class="nav-tab"
        :class="{ active: activeTab === tab.id }"
        @click="setActiveTab(tab.id)"
      >
        <el-icon><component :is="tab.icon" /></el-icon>
        <span>{{ tab.name }}</span>
      </button>
    </div>

    <!-- 演示内容区域 -->
    <main class="demo-content">
      <!-- Dayee风格图标系统演示 -->
      <section v-if="activeTab === 'icons'" class="demo-section">
        <div class="section-header">
          <h2 class="section-title">Dayee风格图标系统</h2>
          <p class="section-description">参考用友大易的图标设计风格，创建统一的图标体系</p>
        </div>
        
        <div class="icons-showcase">
          <div class="icon-category">
            <h3>技术领域图标</h3>
            <div class="icon-grid">
              <IntelligentIcons type="ai" size="large" show-label />
              <IntelligentIcons type="bigdata" size="large" show-label />
              <IntelligentIcons type="iot" size="large" show-label />
            </div>
          </div>

          <div class="icon-category">
            <h3>功能模块图标</h3>
            <div class="icon-grid">
              <IntelligentIcons type="voice" size="large" show-label />
              <IntelligentIcons type="video" size="large" show-label />
              <IntelligentIcons type="text" size="large" show-label />
            </div>
          </div>

          <div class="icon-category">
            <h3>界面控制图标</h3>
            <div class="icon-grid">
              <IntelligentIcons type="record" size="large" show-label />
              <IntelligentIcons type="pause" size="large" show-label />
              <IntelligentIcons type="settings" size="large" show-label />
            </div>
          </div>
        </div>
      </section>

      <!-- Offermore风格案例展示演示 -->
      <section v-if="activeTab === 'cases'" class="demo-section">
        <div class="section-header">
          <h2 class="section-title">Offermore风格案例展示</h2>
          <p class="section-description">借鉴面试猫的案例展示设计，创建吸引人的成功案例模块</p>
        </div>
        
        <OffermoreStyleCases />
      </section>

      <!-- 动态特效演示 -->
      <section v-if="activeTab === 'effects'" class="demo-section">
        <div class="section-header">
          <h2 class="section-title">Dayee风格动态特效</h2>
          <p class="section-description">实现类似用友大易的动态特效和交互动画</p>
        </div>
        
        <div class="effects-showcase">
          <!-- 页面加载动画 -->
          <div class="effect-demo">
            <h3>页面加载动画</h3>
            <div class="animation-demo">
              <div class="demo-card dayee-page-enter">页面进入动画</div>
              <div class="demo-card dayee-slide-left dayee-delay-100">左侧滑入</div>
              <div class="demo-card dayee-slide-right dayee-delay-200">右侧滑入</div>
              <div class="demo-card dayee-fade-up dayee-delay-300">淡入上升</div>
            </div>
          </div>

          <!-- 图标悬停效果 -->
          <div class="effect-demo">
            <h3>图标悬停效果</h3>
            <div class="animation-demo">
              <div class="demo-icon dayee-icon-hover">悬停动画</div>
              <div class="demo-icon dayee-icon-pulse">脉冲效果</div>
              <div class="demo-icon dayee-icon-float">浮动效果</div>
            </div>
          </div>

          <!-- 按钮动画 -->
          <div class="effect-demo">
            <h3>按钮交互动画</h3>
            <div class="animation-demo">
              <button class="demo-btn dayee-btn-glow">发光按钮</button>
              <button class="demo-btn dayee-btn-ripple">波纹按钮</button>
              <button class="demo-btn dayee-hover-lift">悬停上升</button>
            </div>
          </div>

          <!-- 数据可视化动画 -->
          <div class="effect-demo">
            <h3>数据可视化动画</h3>
            <div class="animation-demo">
              <div class="chart-demo">
                <div class="chart-bar dayee-chart-bar" style="height: 60%"></div>
                <div class="chart-bar dayee-chart-bar" style="height: 80%; animation-delay: 0.2s"></div>
                <div class="chart-bar dayee-chart-bar" style="height: 45%; animation-delay: 0.4s"></div>
                <div class="chart-bar dayee-chart-bar" style="height: 90%; animation-delay: 0.6s"></div>
              </div>
              <div class="progress-demo">
                <div class="progress-bar-demo">
                  <div class="progress-fill dayee-progress-bar" style="--progress-width: 75%"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 面试界面预览 -->
      <section v-if="activeTab === 'interview'" class="demo-section">
        <div class="section-header">
          <h2 class="section-title">增强面试界面预览</h2>
          <p class="section-description">整合Offermore和Dayee设计元素的面试界面</p>
        </div>
        
        <div class="interview-preview">
          <div class="preview-frame">
            <iframe 
              src="/interviewing" 
              class="preview-iframe"
              title="面试界面预览"
            ></iframe>
          </div>
          <div class="preview-controls">
            <button class="preview-btn" @click="openInterviewPage">
              <el-icon><View /></el-icon>
              <span>打开完整界面</span>
            </button>
            <button class="preview-btn" @click="refreshPreview">
              <el-icon><Refresh /></el-icon>
              <span>刷新预览</span>
            </button>
          </div>
        </div>
      </section>
    </main>

    <!-- 底部信息 -->
    <footer class="demo-footer">
      <div class="footer-content">
        <p class="footer-text">
          基于 <strong>Offermore.cc</strong> 和 <strong>Dayee.com</strong> 设计元素的多模态面试评估系统
        </p>
        <div class="footer-features">
          <span class="feature-tag">Vue.js 3</span>
          <span class="feature-tag">Element Plus</span>
          <span class="feature-tag">iFlytek Spark</span>
          <span class="feature-tag">WCAG 2.1 AA</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Star, Document, MagicStick, VideoPlay, View, Refresh 
} from '@element-plus/icons-vue'
import IntelligentIcons from '@/components/UI/IntelligentIcons.vue'
import OffermoreStyleCases from '@/components/Demo/OffermoreStyleCases.vue'

const router = useRouter()

// 响应式数据
const activeTab = ref('icons')

const demoTabs = ref([
  { id: 'icons', name: '图标系统', icon: 'Star' },
  { id: 'cases', name: '案例展示', icon: 'Document' },
  { id: 'effects', name: '动态特效', icon: 'MagicStick' },
  { id: 'interview', name: '面试界面', icon: 'VideoPlay' }
])

// 方法
const setActiveTab = (tabId) => {
  activeTab.value = tabId
}

const openInterviewPage = () => {
  router.push('/interviewing')
}

const refreshPreview = () => {
  const iframe = document.querySelector('.preview-iframe')
  if (iframe) {
    iframe.src = iframe.src
  }
}
</script>

<style scoped>
/* 导入动态特效 */
@import '@/styles/intelligent-dynamic-effects.css';

.competitor-integration-demo {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  font-family: 'Microsoft YaHei', sans-serif;
}

.demo-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  padding: 40px 20px;
  text-align: center;
  border-bottom: 1px solid rgba(24, 144, 255, 0.1);
}

.demo-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.title-icon {
  font-size: 2rem;
}

.demo-subtitle {
  font-size: 1.2rem;
  color: #7f8c8d;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
}

.demo-navigation {
  display: flex;
  justify-content: center;
  gap: 4px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
}

.nav-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  color: #7f8c8d;
  transition: all 0.3s ease;
}

.nav-tab.active {
  background: #1890ff;
  color: white;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}

.nav-tab:hover:not(.active) {
  background: rgba(24, 144, 255, 0.1);
  color: #1890ff;
}

.demo-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
}

.demo-section {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(24, 144, 255, 0.1);
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
}

.section-title {
  font-size: 2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 12px;
}

.section-description {
  font-size: 1.1rem;
  color: #7f8c8d;
  line-height: 1.6;
}

/* 图标展示样式 */
.icons-showcase {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.icon-category h3 {
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
}

.icon-grid {
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
}

/* 特效展示样式 */
.effects-showcase {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.effect-demo h3 {
  font-size: 1.2rem;
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
}

.animation-demo {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.demo-card {
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  font-weight: 500;
  color: #2c3e50;
}

.demo-icon {
  width: 80px;
  height: 80px;
  background: #1890ff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  cursor: pointer;
}

.demo-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  background: #1890ff;
  color: white;
  font-weight: 500;
  cursor: pointer;
}

.chart-demo {
  display: flex;
  align-items: end;
  gap: 8px;
  height: 100px;
}

.chart-bar {
  width: 20px;
  background: linear-gradient(to top, #1890ff, #40a9ff);
  border-radius: 2px;
}

.progress-demo {
  width: 200px;
}

.progress-bar-demo {
  height: 8px;
  background: #f0f2f5;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #1890ff, #40a9ff);
  border-radius: 4px;
}

/* 面试界面预览 */
.interview-preview {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.preview-frame {
  width: 100%;
  height: 600px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.preview-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.preview-controls {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.preview-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  background: #1890ff;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.preview-btn:hover {
  background: #40a9ff;
  transform: translateY(-2px);
}

.demo-footer {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  padding: 30px 20px;
  text-align: center;
  border-top: 1px solid rgba(24, 144, 255, 0.1);
}

.footer-text {
  font-size: 1rem;
  color: #5a6c7d;
  margin-bottom: 16px;
}

.footer-features {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.feature-tag {
  padding: 4px 12px;
  background: #e6f7ff;
  color: #1890ff;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .demo-navigation {
    flex-wrap: wrap;
  }
  
  .nav-tab {
    padding: 8px 16px;
    font-size: 14px;
  }
  
  .demo-section {
    padding: 20px;
  }
  
  .icon-grid {
    gap: 20px;
  }
  
  .animation-demo {
    gap: 12px;
  }
  
  .preview-frame {
    height: 400px;
  }
}
</style>
