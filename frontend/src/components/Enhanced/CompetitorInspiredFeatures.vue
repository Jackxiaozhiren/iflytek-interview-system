<template>
  <div class="competitor-inspired-features">
    <!-- 🎯 实时AI辅助功能 - 借鉴面试猫 -->
    <section class="feature-section">
      <div class="section-header">
        <h2 class="section-title">实时AI面试辅助</h2>
        <p class="section-subtitle">借鉴OfferMore的实时辅助理念，提供智能面试支持</p>
      </div>
      
      <div class="features-grid">
        <div class="feature-card-dayee-style card-modern-entrance">
          <div class="feature-icon-dayee">
            <el-icon><Microphone /></el-icon>
          </div>
          <h3 class="feature-title-dayee">实时语音识别</h3>
          <p class="feature-description-dayee">基于iFlytek Spark的实时语音转文字，准确识别候选人回答内容</p>
          <div class="feature-tags">
            <span class="tag-modern">语音识别</span>
            <span class="tag-modern success">实时处理</span>
          </div>
        </div>

        <div class="feature-card-dayee-style card-modern-entrance delay-100">
          <div class="feature-icon-dayee">
            <el-icon><ChatDotRound /></el-icon>
          </div>
          <h3 class="feature-title-dayee">智能回答建议</h3>
          <p class="feature-description-dayee">AI分析面试问题，为面试官提供专业的追问建议和评估要点</p>
          <div class="feature-tags">
            <span class="tag-modern">智能分析</span>
            <span class="tag-modern warning">辅助决策</span>
          </div>
        </div>

        <div class="feature-card-dayee-style card-modern-entrance delay-200">
          <div class="feature-icon-dayee">
            <el-icon><TrendCharts /></el-icon>
          </div>
          <h3 class="feature-title-dayee">实时能力评估</h3>
          <p class="feature-description-dayee">面试过程中实时分析候选人表现，动态更新六维能力评分</p>
          <div class="feature-tags">
            <span class="tag-modern">实时评估</span>
            <span class="tag-modern success">六维分析</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 🛡️ 防作弊机制 - 借鉴用友大易 -->
    <section class="feature-section">
      <div class="section-header">
        <h2 class="section-title">智能防作弊系统</h2>
        <p class="section-subtitle">参考Dayee的企业级安全机制，确保面试公平性</p>
      </div>
      
      <div class="features-grid">
        <div class="feature-card-dayee-style card-modern-entrance">
          <div class="feature-icon-dayee">
            <el-icon><View /></el-icon>
          </div>
          <h3 class="feature-title-dayee">人脸识别验证</h3>
          <p class="feature-description-dayee">实时人脸检测和身份验证，防止替考和身份造假</p>
          <div class="feature-status">
            <span class="status-indicator active"></span>
            <span class="status-text">实时监控中</span>
          </div>
        </div>

        <div class="feature-card-dayee-style card-modern-entrance delay-100">
          <div class="feature-icon-dayee">
            <el-icon><TrendCharts /></el-icon>
          </div>
          <h3 class="feature-title-dayee">行为异常检测</h3>
          <p class="feature-description-dayee">检测切屏、多窗口、异常操作等作弊行为，自动记录和预警</p>
          <div class="feature-status">
            <span class="status-indicator warning"></span>
            <span class="status-text">智能监测</span>
          </div>
        </div>

        <div class="feature-card-dayee-style card-modern-entrance delay-200">
          <div class="feature-icon-dayee">
            <el-icon><Lock /></el-icon>
          </div>
          <h3 class="feature-title-dayee">环境安全检查</h3>
          <p class="feature-description-dayee">检测面试环境，确保无第三方干扰，维护面试公平性</p>
          <div class="feature-status">
            <span class="status-indicator success"></span>
            <span class="status-text">环境安全</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 📊 多场景适配 - 借鉴海纳AI -->
    <section class="feature-section">
      <div class="section-header">
        <h2 class="section-title">多场景智能适配</h2>
        <p class="section-subtitle">学习Hina的场景化解决方案，满足不同招聘需求</p>
      </div>
      
      <div class="scenario-tabs">
        <div 
          v-for="scenario in scenarios" 
          :key="scenario.id"
          :class="['scenario-tab', { active: activeScenario === scenario.id }]"
          @click="switchScenario(scenario.id)"
        >
          <el-icon>
            <component :is="scenario.icon" />
          </el-icon>
          <span>{{ scenario.name }}</span>
        </div>
      </div>

      <div class="scenario-content">
        <div v-if="activeScenario === 'campus'" class="scenario-details">
          <h3>校园招聘场景</h3>
          <div class="scenario-features">
            <div class="scenario-feature">
              <el-icon><User /></el-icon>
              <span>批量面试管理</span>
            </div>
            <div class="scenario-feature">
              <el-icon><School /></el-icon>
              <span>学生群体适配</span>
            </div>
            <div class="scenario-feature">
              <el-icon><DataBoard /></el-icon>
              <span>潜力评估模型</span>
            </div>
          </div>
        </div>

        <div v-if="activeScenario === 'social'" class="scenario-details">
          <h3>社会招聘场景</h3>
          <div class="scenario-features">
            <div class="scenario-feature">
              <el-icon><OfficeBuilding /></el-icon>
              <span>经验技能评估</span>
            </div>
            <div class="scenario-feature">
              <el-icon><Trophy /></el-icon>
              <span>专业能力测试</span>
            </div>
            <div class="scenario-feature">
              <el-icon><Connection /></el-icon>
              <span>团队协作评估</span>
            </div>
          </div>
        </div>

        <div v-if="activeScenario === 'technical'" class="scenario-details">
          <h3>技术人才招聘</h3>
          <div class="scenario-features">
            <div class="scenario-feature">
              <el-icon><Cpu /></el-icon>
              <span>技术深度考察</span>
            </div>
            <div class="scenario-feature">
              <el-icon><Setting /></el-icon>
              <span>编程能力测试</span>
            </div>
            <div class="scenario-feature">
              <el-icon><Setting /></el-icon>
              <span>项目经验评估</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 📈 数据驱动展示 - 借鉴海纳AI的数据展示方式 -->
    <section class="feature-section">
      <div class="section-header">
        <h2 class="section-title">数据驱动的智能决策</h2>
        <p class="section-subtitle">基于海量面试数据，提供科学的招聘决策支持</p>
      </div>
      
      <div class="data-showcase">
        <div class="stats-card-hina-style professional-glow">
          <div class="stats-number-hina">{{ animatedStats.interviews }}</div>
          <div class="stats-label-hina">累计面试场次</div>
        </div>
        <div class="stats-card-hina-style professional-glow delay-100">
          <div class="stats-number-hina">{{ animatedStats.accuracy }}%</div>
          <div class="stats-label-hina">AI评估准确率</div>
        </div>
        <div class="stats-card-hina-style professional-glow delay-200">
          <div class="stats-number-hina">{{ animatedStats.companies }}+</div>
          <div class="stats-label-hina">服务企业数量</div>
        </div>
        <div class="stats-card-hina-style professional-glow delay-300">
          <div class="stats-number-hina">{{ animatedStats.satisfaction }}%</div>
          <div class="stats-label-hina">用户满意度</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import {
  Microphone, ChatDotRound, TrendCharts, View, Lock, UserFilled, School, Grid, Briefcase, Trophy, Connection, Cpu, Tools
} from '@element-plus/icons-vue'

export default {
  name: 'CompetitorInspiredFeatures',
  components: {
    Microphone, ChatDotRound, TrendCharts, View, Monitor, Lock,
    UserFilled, School, DataAnalysis, Briefcase, Trophy, Connection,
    Cpu, Tools
  },
  setup() {
    const activeScenario = ref('campus')
    
    const scenarios = [
      { id: 'campus', name: '校园招聘', icon: 'School' },
      { id: 'social', name: '社会招聘', icon: 'Briefcase' },
      { id: 'technical', name: '技术招聘', icon: 'Cpu' }
    ]

    const animatedStats = reactive({
      interviews: 0,
      accuracy: 0,
      companies: 0,
      satisfaction: 0
    })

    const targetStats = {
      interviews: 500,
      accuracy: 98,
      companies: 1000,
      satisfaction: 95
    }

    const switchScenario = (scenarioId) => {
      activeScenario.value = scenarioId
    }

    const animateNumbers = () => {
      const duration = 2000
      const steps = 60
      const stepDuration = duration / steps

      Object.keys(targetStats).forEach(key => {
        const target = targetStats[key]
        const step = target / steps
        let current = 0

        const timer = setInterval(() => {
          current += step
          if (current >= target) {
            animatedStats[key] = target
            clearInterval(timer)
          } else {
            animatedStats[key] = Math.floor(current)
          }
        }, stepDuration)
      })
    }

    onMounted(() => {
      setTimeout(animateNumbers, 500)
    })

    return {
      activeScenario,
      scenarios,
      animatedStats,
      switchScenario
    }
  }
}
</script>

<style scoped>
@import '../../styles/competitor-inspired-ui.css';

.competitor-inspired-features {
  padding: 60px 0;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
}

.feature-section {
  max-width: 1200px;
  margin: 0 auto 80px;
  padding: 0 24px;
}

.section-header {
  text-align: center;
  margin-bottom: 48px;
}

.section-title {
  font-size: 36px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #1890ff, #667eea);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-subtitle {
  font-size: 18px;
  color: #666;
  line-height: 1.6;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 32px;
}

.feature-tags {
  display: flex;
  gap: 8px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.feature-status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #52c41a;
}

.status-indicator.warning {
  background: #faad14;
}

.status-indicator.active {
  background: #1890ff;
  animation: pulse 2s infinite;
}

.status-text {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.scenario-tabs {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 32px;
}

.scenario-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 12px;
  background: white;
  border: 2px solid #e8e8e8;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.scenario-tab:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.scenario-tab.active {
  background: #1890ff;
  color: white;
  border-color: #1890ff;
}

.scenario-content {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.scenario-details h3 {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 24px;
}

.scenario-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.scenario-feature {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  font-weight: 500;
  color: #333;
}

.data-showcase {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
}

@media (max-width: 768px) {
  .features-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .scenario-tabs {
    flex-direction: column;
    align-items: center;
  }
  
  .scenario-features {
    grid-template-columns: 1fr;
  }
  
  .data-showcase {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .data-showcase {
    grid-template-columns: 1fr;
  }
}
</style>
