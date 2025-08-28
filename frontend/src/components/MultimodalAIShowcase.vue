<template>
  <div class="multimodal-showcase">
    <!-- 特色展示头部 -->
    <div class="showcase-header">
      <div class="header-container">
        <div class="header-content">
          <h2 class="showcase-title">iFlytek Spark 全能面试AI</h2>
          <p class="showcase-subtitle">融合行业三强优势，超越传统面试边界</p>
        </div>
        <div class="header-visual">
          <div class="ai-brain-animation">
            <el-icon class="brain-icon"><Cpu /></el-icon>
            <div class="pulse-rings">
              <div class="pulse-ring"></div>
              <div class="pulse-ring"></div>
              <div class="pulse-ring"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 核心特色功能 -->
    <div class="core-features">
      <div class="features-container">
        <div class="features-grid">
          <!-- 实时辅助特色 -->
          <div class="feature-card realtime-inspired">
            <div class="feature-header">
              <div class="feature-icon">
                <el-icon><Headset /></el-icon>
              </div>
              <div class="feature-title">
                <h3>实时智能辅助</h3>
                <p>先进的实时面试辅助技术</p>
              </div>
            </div>
            <div class="feature-content">
              <div class="feature-highlights">
                <div class="highlight-item">
                  <el-icon class="highlight-icon"><Check /></el-icon>
                  <span>98%+ 准确率实时语音识别</span>
                </div>
                <div class="highlight-item">
                  <el-icon class="highlight-icon"><Check /></el-icon>
                  <span>毫秒级智能提示响应</span>
                </div>
                <div class="highlight-item">
                  <el-icon class="highlight-icon"><Check /></el-icon>
                  <span>多模态情绪状态分析</span>
                </div>
                <div class="highlight-item">
                  <el-icon class="highlight-icon"><Check /></el-icon>
                  <span>7×24小时全天候辅助</span>
                </div>
              </div>
              <div class="feature-demo">
                <div class="demo-screen">
                  <div class="demo-content">
                    <div class="voice-wave">
                      <div class="wave-bar" v-for="i in 12" :key="i"></div>
                    </div>
                    <div class="demo-stats">
                      <div class="stat-item">
                        <span class="stat-label">识别准确率</span>
                        <span class="stat-value">{{ realTimeStats.accuracy }}%</span>
                      </div>
                      <div class="stat-item">
                        <span class="stat-label">响应延迟</span>
                        <span class="stat-value">{{ realTimeStats.latency }}ms</span>
                      </div>
                    </div>
                    <p class="demo-text">{{ realTimeStatus }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Hina.com 多维评估特色 -->
          <div class="feature-card hina-inspired">
            <div class="feature-header">
              <div class="feature-icon">
                <el-icon><DataBoard /></el-icon>
              </div>
              <div class="feature-title">
                <h3>多维度智能评估</h3>
                <p>借鉴 Hina.com 专业评估体系</p>
              </div>
            </div>
            <div class="feature-content">
              <div class="feature-highlights">
                <div class="highlight-item">
                  <el-icon class="highlight-icon"><Check /></el-icon>
                  <span>12维度全方位能力评估</span>
                </div>
                <div class="highlight-item">
                  <el-icon class="highlight-icon"><Check /></el-icon>
                  <span>iFlytek Spark深度学习分析</span>
                </div>
                <div class="highlight-item">
                  <el-icon class="highlight-icon"><Check /></el-icon>
                  <span>可视化评估报告生成</span>
                </div>
                <div class="highlight-item">
                  <el-icon class="highlight-icon"><Check /></el-icon>
                  <span>行业标准对比分析</span>
                </div>
              </div>
              <div class="feature-demo">
                <div class="demo-screen">
                  <div class="assessment-radar">
                    <div class="radar-center">
                      <span class="score">85</span>
                      <small>综合得分</small>
                    </div>
                    <div class="radar-axes">
                      <div class="axis" v-for="skill in assessmentSkills" :key="skill.name">
                        <span class="axis-label">{{ skill.name }}</span>
                        <div class="axis-value" :style="{ width: skill.value + '%' }"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Dayee.com 系统化管理特色 -->
          <div class="feature-card dayee-inspired">
            <div class="feature-header">
              <div class="feature-icon">
                <el-icon><Setting /></el-icon>
              </div>
              <div class="feature-title">
                <h3>系统化管理平台</h3>
                <p>参考 Dayee.com 企业级管理优势</p>
              </div>
            </div>
            <div class="feature-content">
              <div class="feature-highlights">
                <div class="highlight-item">
                  <el-icon class="highlight-icon"><Check /></el-icon>
                  <span>ATS+TRM一体化管理</span>
                </div>
                <div class="highlight-item">
                  <el-icon class="highlight-icon"><Check /></el-icon>
                  <span>千人级批量面试调度</span>
                </div>
                <div class="highlight-item">
                  <el-icon class="highlight-icon"><Check /></el-icon>
                  <span>多维度数据洞察分析</span>
                </div>
                <div class="highlight-item">
                  <el-icon class="highlight-icon"><Check /></el-icon>
                  <span>雇主品牌智能建设</span>
                </div>
              </div>
              <div class="feature-demo">
                <div class="demo-screen">
                  <div class="management-dashboard">
                    <div class="dashboard-stats">
                      <div class="stat-item">
                        <span class="stat-number">156</span>
                        <span class="stat-label">候选人</span>
                      </div>
                      <div class="stat-item">
                        <span class="stat-number">23</span>
                        <span class="stat-label">进行中</span>
                      </div>
                      <div class="stat-item">
                        <span class="stat-number">89%</span>
                        <span class="stat-label">完成率</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 技术性能指标 -->
    <div class="performance-metrics">
      <div class="metrics-container">
        <div class="metrics-header">
          <h3>技术性能指标</h3>
          <p>超越行业标准的技术实力证明</p>
        </div>
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-value">98.5%</div>
            <div class="metric-label">语音识别准确率</div>
            <div class="metric-comparison">行业平均 85%</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">< 200ms</div>
            <div class="metric-label">AI响应延迟</div>
            <div class="metric-comparison">行业平均 1.2s</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">95.2%</div>
            <div class="metric-label">面试评估准确率</div>
            <div class="metric-comparison">行业平均 78%</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">12+</div>
            <div class="metric-label">评估维度</div>
            <div class="metric-comparison">行业平均 6维</div>
          </div>
        </div>
      </div>
    </div>

    <!-- iFlytek Spark 独特优势 -->
    <div class="unique-advantages">
      <div class="advantages-container">
        <div class="advantages-header">
          <h3>核心技术优势</h3>
          <p>基于科大讯飞领先AI技术，构建面试AI新标杆</p>
        </div>
        <div class="advantages-grid">
          <div class="advantage-item">
            <div class="advantage-icon spark-gradient">
              <el-icon><Microphone /></el-icon>
            </div>
            <h4>语音识别精度</h4>
            <p>98%+ 准确率，支持多方言识别</p>
          </div>
          <div class="advantage-item">
            <div class="advantage-icon spark-gradient">
              <el-icon><View /></el-icon>
            </div>
            <h4>多模态理解</h4>
            <p>语音+视觉+文本综合分析</p>
          </div>
          <div class="advantage-item">
            <div class="advantage-icon spark-gradient">
              <el-icon><ChatDotRound /></el-icon>
            </div>
            <h4>自然对话</h4>
            <p>类人化交互，降低面试紧张感</p>
          </div>
          <div class="advantage-item">
            <div class="advantage-icon spark-gradient">
              <el-icon><TrendCharts /></el-icon>
            </div>
            <h4>深度学习</h4>
            <p>持续优化，个性化适应</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 增强的实时演示区域 -->
    <div class="enhanced-demo-section">
      <div class="demo-container">
        <div class="demo-header">
          <h3>iFlytek Spark 实时多模态分析演示</h3>
          <p>体验业界领先的AI面试辅助技术</p>
        </div>

        <div class="demo-grid">
          <!-- 语音识别演示（已禁用） -->
          <div class="demo-card voice-demo disabled">
            <div class="demo-card-header">
              <el-icon class="demo-icon"><Microphone /></el-icon>
              <h4>语音识别（已禁用）</h4>
            </div>
            <div class="demo-content">
              <div class="disabled-notice">
                <p>语音识别功能已禁用</p>
                <p>专注于文本和视频分析</p>
              </div>
            </div>
          </div>



          <!-- 实时评估演示 -->
          <div class="demo-card evaluation-demo">
            <div class="demo-card-header">
              <el-icon class="demo-icon"><TrendCharts /></el-icon>
              <h4>实时能力评估</h4>
            </div>
            <div class="demo-content">
              <div class="evaluation-progress">
                <div class="progress-item" v-for="skill in evaluationProgress" :key="skill.name">
                  <div class="progress-header">
                    <span class="skill-name">{{ skill.name }}</span>
                    <span class="skill-score">{{ skill.score }}</span>
                  </div>
                  <el-progress
                    :percentage="skill.score"
                    :color="getSkillColor(skill.score)"
                    :show-text="false"
                    :stroke-width="8"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 实际应用场景案例 -->
    <div class="application-scenarios">
      <div class="scenarios-container">
        <div class="scenarios-header">
          <h3>实际应用场景</h3>
          <p>真实企业案例，验证系统价值</p>
        </div>
        <div class="scenarios-grid">
          <div class="scenario-card">
            <div class="scenario-header">
              <div class="company-info">
                <div class="company-logo">科技</div>
                <div class="company-details">
                  <h4>某知名科技企业</h4>
                  <p>员工规模：10000+</p>
                </div>
              </div>
            </div>
            <div class="scenario-content">
              <div class="challenge">
                <h5>挑战</h5>
                <p>校园招聘量大，传统面试效率低，候选人体验差</p>
              </div>
              <div class="solution">
                <h5>解决方案</h5>
                <p>部署iFlytek Spark AI面试系统，实现批量智能筛选</p>
              </div>
              <div class="results">
                <h5>效果</h5>
                <div class="result-metrics">
                  <span class="result-item">面试效率提升 <strong>300%</strong></span>
                  <span class="result-item">招聘成本降低 <strong>60%</strong></span>
                  <span class="result-item">候选人满意度 <strong>95%</strong></span>
                </div>
              </div>
            </div>
          </div>

          <div class="scenario-card">
            <div class="scenario-header">
              <div class="company-info">
                <div class="company-logo">金融</div>
                <div class="company-details">
                  <h4>某大型金融集团</h4>
                  <p>员工规模：50000+</p>
                </div>
              </div>
            </div>
            <div class="scenario-content">
              <div class="challenge">
                <h5>挑战</h5>
                <p>多地分支机构招聘标准不统一，人才评估主观性强</p>
              </div>
              <div class="solution">
                <h5>解决方案</h5>
                <p>统一部署多维度AI评估系统，建立标准化评估体系</p>
              </div>
              <div class="results">
                <h5>效果</h5>
                <div class="result-metrics">
                  <span class="result-item">评估标准化 <strong>100%</strong></span>
                  <span class="result-item">人才质量提升 <strong>40%</strong></span>
                  <span class="result-item">管理效率提升 <strong>250%</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import {
  Cpu, Headset, Grid, Setting, Check, Microphone,
  View, ChatDotRound, TrendCharts, VideoCamera
} from '@element-plus/icons-vue'

// 评估技能数据 - 12维度评估
const assessmentSkills = reactive([
  { name: '技术能力', value: 92 },
  { name: '沟通表达', value: 88 },
  { name: '逻辑思维', value: 95 },
  { name: '学习能力', value: 90 },
  { name: '团队协作', value: 85 },
  { name: '创新思维', value: 87 },
  { name: '抗压能力', value: 83 },
  { name: '执行力', value: 89 },
  { name: '领导潜质', value: 78 },
  { name: '专业深度', value: 94 },
  { name: '适应性', value: 86 },
  { name: '职业素养', value: 91 }
])

// 实时统计数据
const realTimeStats = reactive({
  accuracy: 98.5,
  latency: 156
})

// 实时状态文本
const realTimeStatus = ref('正在实时分析语音内容...')

// 状态文本数组
const statusTexts = [
  '正在实时分析语音内容...',
  '检测到技术关键词，匹配度95%',
  '情绪状态：自信、专业',
  '语速适中，表达清晰',
  '正在生成智能建议...'
]



// 实时评估进度
const evaluationProgress = reactive([
  { name: '技术能力', score: 88 },
  { name: '沟通表达', score: 92 },
  { name: '逻辑思维', score: 85 },
  { name: '学习能力', score: 90 }
])

// 获取技能颜色
const getSkillColor = (score) => {
  if (score >= 90) return '#2ecc71'
  if (score >= 80) return '#f39c12'
  if (score >= 70) return '#e67e22'
  return '#e74c3c'
}

onMounted(() => {
  // 启动动画效果
  startAnimations()
})

const startAnimations = () => {
  // 语音波形动画
  const waveBars = document.querySelectorAll('.wave-bar')
  waveBars.forEach((bar, index) => {
    setInterval(() => {
      const height = Math.random() * 40 + 15
      bar.style.height = height + 'px'
    }, 150 + index * 30)
  })

  // 实时数据更新动画
  setInterval(() => {
    realTimeStats.accuracy = 98.5 + (Math.random() - 0.5) * 0.8
    realTimeStats.latency = 156 + Math.floor((Math.random() - 0.5) * 40)
  }, 2000)

  // 状态文本轮播
  let statusIndex = 0
  setInterval(() => {
    statusIndex = (statusIndex + 1) % statusTexts.length
    realTimeStatus.value = statusTexts[statusIndex]
  }, 3000)



  // 评估进度动画
  setInterval(() => {
    evaluationProgress.forEach(skill => {
      skill.score = Math.max(60, Math.min(95, skill.score + (Math.random() - 0.5) * 5))
    })
  }, 5000)

  // 技能雷达图动画
  setTimeout(() => {
    assessmentSkills.forEach((skill, index) => {
      setTimeout(() => {
        const originalValue = skill.value
        skill.value = 0
        setTimeout(() => {
          skill.value = originalValue
        }, 100)
      }, index * 200)
    })
  }, 1000)
}
</script>

<style scoped>
/* 使用简化的样式系统 */

.multimodal-showcase {
  background: var(--iflytek-gradient-secondary);
  color: white;
  overflow: hidden;
}

/* 展示头部样式 */
.showcase-header {
  padding: 80px 0;
  position: relative;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 60px;
  align-items: center;
}

.showcase-title {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.showcase-subtitle {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
}

.ai-brain-animation {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 200px;
}

.brain-icon {
  font-size: 80px;
  color: #ffffff;
  z-index: 2;
  position: relative;
}

.pulse-rings {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.pulse-ring {
  position: absolute;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.pulse-ring:nth-child(1) {
  width: 100px;
  height: 100px;
  margin: -50px 0 0 -50px;
  animation-delay: 0s;
}

.pulse-ring:nth-child(2) {
  width: 140px;
  height: 140px;
  margin: -70px 0 0 -70px;
  animation-delay: 0.5s;
}

.pulse-ring:nth-child(3) {
  width: 180px;
  height: 180px;
  margin: -90px 0 0 -90px;
  animation-delay: 1s;
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(1.2);
    opacity: 0;
  }
}

/* 核心特色功能样式 */
.core-features {
  background: #f8f9fa;
  padding: 80px 0;
}

.features-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 32px;
}

.feature-card {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}

.feature-card.offermore-inspired::before {
  background: var(--iflytek-gradient-primary);
}

.feature-card.hina-inspired::before {
  background: var(--iflytek-gradient-accent);
}

.feature-card.dayee-inspired::before {
  background: var(--iflytek-gradient-secondary);
}

.feature-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.feature-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 24px;
  color: white;
}

.offermore-inspired .feature-icon {
  background: var(--iflytek-gradient-primary);
}

.hina-inspired .feature-icon {
  background: var(--iflytek-gradient-accent);
}

.dayee-inspired .feature-icon {
  background: var(--iflytek-gradient-secondary);
}

.feature-title h3 {
  font-size: 20px;
  color: #2c3e50;
  margin-bottom: 4px;
}

.feature-title p {
  font-size: 14px;
  color: #7f8c8d;
}

.feature-highlights {
  margin-bottom: 24px;
}

.highlight-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.highlight-icon {
  color: #2ecc71;
  margin-right: 8px;
  font-size: 16px;
}

.highlight-item span {
  font-size: 14px;
  color: var(--text-primary-high-contrast, #1a1a1a);
  font-weight: 500;
}

.feature-demo {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
}

.demo-screen {
  background: #2c3e50;
  border-radius: 8px;
  padding: 16px;
  color: white;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 语音波形动画 */
.voice-wave {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 12px;
}

.wave-bar {
  width: 4px;
  height: 20px;
  background: var(--iflytek-primary);
  border-radius: 2px;
  animation: wave 1s infinite ease-in-out;
}

.wave-bar:nth-child(2) { animation-delay: 0.1s; }
.wave-bar:nth-child(3) { animation-delay: 0.2s; }
.wave-bar:nth-child(4) { animation-delay: 0.3s; }
.wave-bar:nth-child(5) { animation-delay: 0.4s; }
.wave-bar:nth-child(6) { animation-delay: 0.5s; }
.wave-bar:nth-child(7) { animation-delay: 0.6s; }
.wave-bar:nth-child(8) { animation-delay: 0.7s; }

@keyframes wave {
  0%, 40%, 100% { transform: scaleY(0.4); }
  20% { transform: scaleY(1); }
}

.demo-text {
  font-size: 14px;
  color: #e2e8f0;
  text-align: center;
  margin-top: 12px;
  font-weight: 500;
}

.demo-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 16px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  font-size: 12px;
  color: #cbd5e1;
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
}

.stat-value {
  font-size: 16px;
  font-weight: 700;
  color: var(--iflytek-primary);
}

/* 评估雷达图样式 */
.assessment-radar {
  width: 100%;
}

.radar-center {
  text-align: center;
  margin-bottom: 16px;
}

.radar-center .score {
  font-size: 24px;
  font-weight: 700;
  color: #43e97b;
}

.radar-center small {
  font-size: 12px;
  color: #bdc3c7;
}

.radar-axes {
  space-y: 8px;
}

.axis {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.axis-label {
  font-size: 12px;
  color: #e2e8f0;
  min-width: 60px;
  font-weight: 500;
}

.axis-value {
  height: 4px;
  background: #43e97b;
  border-radius: 2px;
  transition: width 0.3s ease;
  flex: 1;
  margin-left: 12px;
}

/* 管理仪表板样式 */
.management-dashboard {
  width: 100%;
}

.dashboard-stats {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: #fa709a;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #bdc3c7;
}

/* 独特优势样式 */
.unique-advantages {
  background: white;
  padding: 80px 0;
}

.advantages-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.advantages-header {
  text-align: center;
  margin-bottom: 60px;
}

.advantages-header h3 {
  font-size: 36px;
  color: #2c3e50;
  margin-bottom: 16px;
}

.advantages-header p {
  font-size: 18px;
  color: #7f8c8d;
}

.advantages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 32px;
}

.advantage-item {
  text-align: center;
  padding: 32px 24px;
  border-radius: 16px;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.advantage-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.advantage-icon {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 32px;
  color: white;
}

.advantage-icon.spark-gradient {
  background: var(--iflytek-gradient-primary);
}

.advantage-item h4 {
  font-size: 20px;
  color: #2c3e50;
  margin-bottom: 12px;
}

.advantage-item p {
  font-size: 14px;
  color: #7f8c8d;
  line-height: 1.6;
}

/* 技术性能指标样式 */
.performance-metrics {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 80px 0;
}

.metrics-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.metrics-header {
  text-align: center;
  margin-bottom: 60px;
}

.metrics-header h3 {
  font-size: 36px;
  color: #2c3e50;
  margin-bottom: 16px;
}

.metrics-header p {
  font-size: 18px;
  color: #7f8c8d;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 32px;
}

.metric-card {
  background: white;
  border-radius: 20px;
  padding: 40px 24px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.metric-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
}

.metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--iflytek-gradient-primary);
}

.metric-value {
  font-size: 48px;
  font-weight: 700;
  color: var(--iflytek-primary);
  margin-bottom: 12px;
}

.metric-label {
  font-size: 18px;
  color: #2c3e50;
  margin-bottom: 8px;
  font-weight: 600;
}

.metric-comparison {
  font-size: 14px;
  color: #95a5a6;
  padding: 8px 16px;
  background: #f8f9fa;
  border-radius: 20px;
  display: inline-block;
}

/* 增强演示区域样式 */
.enhanced-demo-section {
  background: #f8f9fa;
  padding: 80px 0;
}

.demo-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.demo-header {
  text-align: center;
  margin-bottom: 60px;
}

.demo-header h3 {
  font-size: 36px;
  color: #2c3e50;
  margin-bottom: 16px;
}

.demo-header p {
  font-size: 18px;
  color: #7f8c8d;
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 32px;
}

.demo-card {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.demo-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
}

.demo-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}

.voice-demo::before {
  background: var(--iflytek-gradient-primary);
}

.video-demo::before {
  background: var(--iflytek-gradient-accent);
}

.evaluation-demo::before {
  background: var(--iflytek-gradient-secondary);
}

.demo-card-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.demo-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 20px;
  color: white;
}

.voice-demo .demo-icon {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
}

.video-demo .demo-icon {
  background: linear-gradient(135deg, #43e97b, #38f9d7);
}

.evaluation-demo .demo-icon {
  background: linear-gradient(135deg, #fa709a, #fee140);
}

.demo-card-header h4 {
  font-size: 18px;
  color: #2c3e50;
  margin: 0;
}

.demo-content {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  min-height: 200px;
}

/* 增强语音波形样式 */
.voice-wave-enhanced {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: 20px;
  height: 60px;
}

.voice-wave-enhanced .wave-bar {
  width: 6px;
  height: 20px;
  background: var(--iflytek-gradient-primary);
  border-radius: 3px;
  animation: wave-enhanced 1.5s ease-in-out infinite;
}

.voice-wave-enhanced .wave-bar:nth-child(1) { animation-delay: 0s; }
.voice-wave-enhanced .wave-bar:nth-child(2) { animation-delay: 0.1s; }
.voice-wave-enhanced .wave-bar:nth-child(3) { animation-delay: 0.2s; }
.voice-wave-enhanced .wave-bar:nth-child(4) { animation-delay: 0.3s; }
.voice-wave-enhanced .wave-bar:nth-child(5) { animation-delay: 0.4s; }
.voice-wave-enhanced .wave-bar:nth-child(6) { animation-delay: 0.5s; }
.voice-wave-enhanced .wave-bar:nth-child(7) { animation-delay: 0.6s; }
.voice-wave-enhanced .wave-bar:nth-child(8) { animation-delay: 0.7s; }

@keyframes wave-enhanced {
  0%, 100% { height: 20px; }
  50% { height: 50px; }
}

.demo-stats-enhanced {
  display: flex;
  justify-content: space-around;
  margin-bottom: 16px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.status-text-enhanced {
  text-align: center;
  font-size: 14px;
  color: var(--iflytek-primary);
  font-weight: 600;
  padding: 12px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 情绪分析样式 */
.emotion-radar {
  text-align: center;
}

.emotion-center {
  margin-bottom: 20px;
}

.emotion-score {
  font-size: 32px;
  font-weight: 700;
  color: #43e97b;
  display: block;
}

.emotion-center small {
  font-size: 14px;
  color: #7f8c8d;
}

.emotion-indicators {
  space-y: 12px;
}

.emotion-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.emotion-label {
  font-size: 14px;
  color: #2c3e50;
  min-width: 50px;
}

.emotion-bar {
  flex: 1;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  margin-left: 12px;
  overflow: hidden;
}

.emotion-fill {
  height: 100%;
  background: linear-gradient(90deg, #43e97b, #38f9d7);
  border-radius: 4px;
  transition: width 0.3s ease;
}

/* 评估进度样式 */
.evaluation-progress {
  space-y: 16px;
}

.progress-item {
  margin-bottom: 16px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.skill-name {
  font-size: 14px;
  color: #2c3e50;
  font-weight: 600;
}

.skill-score {
  font-size: 14px;
  color: #667eea;
  font-weight: 700;
}

/* 实际应用场景样式 */
.application-scenarios {
  background: white;
  padding: 80px 0;
}

.scenarios-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.scenarios-header {
  text-align: center;
  margin-bottom: 60px;
}

.scenarios-header h3 {
  font-size: 36px;
  color: #2c3e50;
  margin-bottom: 16px;
}

.scenarios-header p {
  font-size: 18px;
  color: #7f8c8d;
}

.scenarios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 32px;
}

.scenario-card {
  background: #f8f9fa;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.scenario-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.scenario-header {
  margin-bottom: 24px;
}

.company-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.company-logo {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.company-details h4 {
  font-size: 20px;
  color: #2c3e50;
  margin-bottom: 4px;
}

.company-details p {
  font-size: 14px;
  color: #7f8c8d;
}

.scenario-content {
  space-y: 20px;
}

.challenge, .solution, .results {
  margin-bottom: 20px;
}

.challenge h5, .solution h5, .results h5 {
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 8px;
  font-weight: 600;
}

.challenge p, .solution p {
  font-size: 14px;
  color: #7f8c8d;
  line-height: 1.6;
}

.result-metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.result-item {
  background: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  color: #2c3e50;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.result-item strong {
  color: #667eea;
  font-weight: 700;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-container {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 40px;
  }

  .showcase-title {
    font-size: 36px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .demo-grid {
    grid-template-columns: 1fr;
  }

  .demo-stats-enhanced {
    flex-direction: column;
    gap: 12px;
  }

  .advantages-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .scenarios-grid {
    grid-template-columns: 1fr;
  }

  .result-metrics {
    flex-direction: column;
  }

  .emotion-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .emotion-bar {
    margin-left: 0;
    width: 100%;
  }
}
</style>
