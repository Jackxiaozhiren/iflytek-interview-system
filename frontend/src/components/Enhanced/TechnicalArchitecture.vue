<template>
  <div class="technical-architecture">
    <!-- 技术架构概览 -->
    <section class="architecture-overview">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">iFlytek Spark 技术架构</h2>
          <p class="section-subtitle">基于科大讯飞星火大模型的多模态AI面试系统</p>
        </div>

        <div class="architecture-diagram">
          <div class="tech-layer" v-for="(layer, index) in techLayers" :key="layer.id">
            <div class="layer-header">
              <div class="layer-icon">
                <el-icon>
                  <component :is="layer.icon" />
                </el-icon>
              </div>
              <h3 class="layer-title">{{ layer.name }}</h3>
            </div>
            <div class="layer-components">
              <div 
                v-for="component in layer.components" 
                :key="component.id"
                class="component-card card-modern-hover"
                :class="`delay-${index * 100 + component.id * 50}`"
              >
                <div class="component-icon">
                  <el-icon>
                    <component :is="component.icon" />
                  </el-icon>
                </div>
                <h4 class="component-name">{{ component.name }}</h4>
                <p class="component-desc">{{ component.description }}</p>
                <div class="component-status">
                  <span class="status-dot" :class="component.status"></span>
                  <span class="status-text">{{ getStatusText(component.status) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 核心技术特性 -->
    <section class="core-technologies">
      <div class="container">
        <h2 class="section-title">核心技术优势</h2>
        <div class="tech-grid">
          <div 
            v-for="(tech, index) in coreTechnologies" 
            :key="tech.id"
            class="tech-card enterprise-fade-scale"
            :class="`delay-${index * 100}`"
          >
            <div class="tech-header">
              <div class="tech-icon professional-glow">
                <el-icon>
                  <component :is="tech.icon" />
                </el-icon>
              </div>
              <h3 class="tech-title">{{ tech.name }}</h3>
            </div>
            <div class="tech-content">
              <p class="tech-description">{{ tech.description }}</p>
              <div class="tech-metrics">
                <div class="metric" v-for="metric in tech.metrics" :key="metric.label">
                  <span class="metric-value">{{ metric.value }}</span>
                  <span class="metric-label">{{ metric.label }}</span>
                </div>
              </div>
              <div class="tech-features">
                <div class="feature-item" v-for="feature in tech.features" :key="feature">
                  <el-icon><Check /></el-icon>
                  <span>{{ feature }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 技术对比 -->
    <section class="tech-comparison">
      <div class="container">
        <h2 class="section-title">技术对比优势</h2>
        <div class="comparison-table">
          <div class="comparison-header">
            <div class="feature-column">功能特性</div>
            <div class="competitor-column">传统方案</div>
            <div class="iflytek-column">iFlytek Spark</div>
          </div>
          <div 
            v-for="(item, index) in comparisonItems" 
            :key="item.feature"
            class="comparison-row card-modern-entrance"
            :class="`delay-${index * 100}`"
          >
            <div class="feature-cell">{{ item.feature }}</div>
            <div class="competitor-cell">
              <el-icon class="status-icon error"><Close /></el-icon>
              <span>{{ item.traditional }}</span>
            </div>
            <div class="iflytek-cell">
              <el-icon class="status-icon success"><Check /></el-icon>
              <span>{{ item.iflytek }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 性能指标 -->
    <section class="performance-metrics">
      <div class="container">
        <h2 class="section-title">性能指标</h2>
        <div class="metrics-grid">
          <div 
            v-for="(metric, index) in performanceMetrics" 
            :key="metric.id"
            class="metric-card stats-card-hina-style"
            :class="`delay-${index * 150}`"
          >
            <div class="metric-icon data-visualization-glow">
              <el-icon>
                <component :is="metric.icon" />
              </el-icon>
            </div>
            <div class="metric-value">{{ metric.value }}</div>
            <div class="metric-label">{{ metric.label }}</div>
            <div class="metric-trend">
              <el-icon class="trend-icon" :class="metric.trend">
                <component :is="metric.trend === 'up' ? 'TrendCharts' : 'Bottom'" />
              </el-icon>
              <span class="trend-text">{{ metric.trendText }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import {
  Cpu, Grid, Microphone, VideoCamera, Document, Check, Close, TrendCharts, Bottom, Timer, Lock, Connection, Tools
} from '@element-plus/icons-vue'

export default {
  name: 'TechnicalArchitecture',
  components: {
    Cpu, Monitor, Grid, Microphone, VideoCamera,
    Document, Check, Close, TrendCharts, Bottom, Timer,
    Lock, Connection, Tools
  },
  setup() {
    const techLayers = [
      {
        id: 1,
        name: '应用层',
        icon: 'Document',
        components: [
          {
            id: 1,
            name: '面试管理',
            description: '面试流程管理和调度',
            icon: 'Timer',
            status: 'active'
          },
          {
            id: 2,
            name: '实时交互',
            description: '音视频实时通信',
            icon: 'VideoCamera',
            status: 'active'
          },
          {
            id: 3,
            name: '报告生成',
            description: '智能评估报告',
            icon: 'DataBoard',
            status: 'active'
          }
        ]
      },
      {
        id: 2,
        name: 'AI服务层',
        icon: 'Cpu',
        components: [
          {
            id: 1,
            name: 'Spark大模型',
            description: 'iFlytek核心AI引擎',
            icon: 'Cpu',
            status: 'active'
          },
          {
            id: 2,
            name: '语音识别',
            description: '实时语音转文字',
            icon: 'Microphone',
            status: 'active'
          },
          {
            id: 3,
            name: '视频分析',
            description: '表情行为分析',
            icon: 'VideoCamera',
            status: 'active'
          }
        ]
      },
      {
        id: 3,
        name: '基础设施层',
        icon: 'TrendCharts',
        components: [
          {
            id: 1,
            name: '云计算平台',
            description: '弹性计算资源',
            icon: 'TrendCharts',
            status: 'stable'
          },
          {
            id: 2,
            name: '安全防护',
            description: '数据安全保障',
            icon: 'Lock',
            status: 'stable'
          },
          {
            id: 3,
            name: '网络通信',
            description: '高速网络连接',
            icon: 'Connection',
            status: 'stable'
          }
        ]
      }
    ]

    const coreTechnologies = [
      {
        id: 1,
        name: 'iFlytek Spark 大模型',
        icon: 'Cpu',
        description: '基于科大讯飞星火认知大模型，具备强大的语言理解和生成能力',
        metrics: [
          { label: '参数规模', value: '千亿级' },
          { label: '响应时间', value: '<100ms' },
          { label: '准确率', value: '98.5%' }
        ],
        features: [
          '多轮对话理解',
          '专业领域知识',
          '实时推理能力',
          '中文优化处理'
        ]
      },
      {
        id: 2,
        name: '多模态融合分析',
        icon: 'DataBoard',
        description: '融合语音、视频、文本多维度信息，提供全面的候选人评估',
        metrics: [
          { label: '模态数量', value: '3+' },
          { label: '融合精度', value: '96.8%' },
          { label: '处理速度', value: '实时' }
        ],
        features: [
          '语音情感分析',
          '视频行为识别',
          '文本语义理解',
          '综合能力评估'
        ]
      },
      {
        id: 3,
        name: '智能防作弊系统',
        icon: 'Lock',
        description: '基于AI的智能监控系统，确保面试过程的公平性和真实性',
        metrics: [
          { label: '检测准确率', value: '99.2%' },
          { label: '误报率', value: '<0.5%' },
          { label: '响应时间', value: '<50ms' }
        ],
        features: [
          '人脸识别验证',
          '行为异常检测',
          '环境监控分析',
          '实时预警提醒'
        ]
      }
    ]

    const comparisonItems = [
      {
        feature: '语音识别准确率',
        traditional: '85-90%',
        iflytek: '98.5%+'
      },
      {
        feature: '实时处理能力',
        traditional: '延迟明显',
        iflytek: '<100ms响应'
      },
      {
        feature: '多模态融合',
        traditional: '单一维度',
        iflytek: '3+维度融合'
      },
      {
        feature: '中文优化',
        traditional: '基础支持',
        iflytek: '深度优化'
      },
      {
        feature: '防作弊机制',
        traditional: '人工监控',
        iflytek: 'AI智能检测'
      }
    ]

    const performanceMetrics = [
      {
        id: 1,
        label: '系统可用性',
        value: '99.9%',
        icon: 'TrendCharts',
        trend: 'up',
        trendText: '持续稳定'
      },
      {
        id: 2,
        label: '响应时间',
        value: '<100ms',
        icon: 'Timer',
        trend: 'up',
        trendText: '极速响应'
      },
      {
        id: 3,
        label: '并发处理',
        value: '10000+',
        icon: 'Connection',
        trend: 'up',
        trendText: '高并发'
      },
      {
        id: 4,
        label: '准确率',
        value: '98.5%',
        icon: 'TrendCharts',
        trend: 'up',
        trendText: '行业领先'
      }
    ]

    const getStatusText = (status) => {
      const statusMap = {
        active: '运行中',
        stable: '稳定',
        warning: '警告',
        error: '错误'
      }
      return statusMap[status] || '未知'
    }

    return {
      techLayers,
      coreTechnologies,
      comparisonItems,
      performanceMetrics,
      getStatusText
    }
  }
}
</script>

<style scoped>
@import '../../styles/competitor-inspired-ui.css';

.technical-architecture {
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 50%, #f8fafc 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.architecture-overview {
  padding: 80px 0;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
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

.architecture-diagram {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.tech-layer {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(24, 144, 255, 0.1);
}

.layer-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.layer-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #1890ff, #667eea);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.layer-title {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
}

.layer-components {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.component-card {
  background: #f8fafc;
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease;
  border: 1px solid #e8e8e8;
}

.component-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 16px;
}

.component-name {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.component-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
  line-height: 1.5;
}

.component-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot.active {
  background: #52c41a;
  animation: pulse 2s infinite;
}

.status-dot.stable {
  background: #1890ff;
}

.status-text {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.core-technologies {
  padding: 80px 0;
  background: white;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 32px;
}

.tech-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(24, 144, 255, 0.1);
}

.tech-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.tech-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #1890ff, #667eea);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.tech-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
}

.tech-description {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 24px;
}

.tech-metrics {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}

.metric {
  text-align: center;
}

.metric-value {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: #1890ff;
}

.metric-label {
  font-size: 12px;
  color: #666;
}

.tech-features {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #333;
}

.feature-item .el-icon {
  color: #52c41a;
}

.tech-comparison {
  padding: 80px 0;
  background: #f8fafc;
}

.comparison-table {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.comparison-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  background: linear-gradient(135deg, #1890ff, #667eea);
  color: white;
  font-weight: 600;
}

.comparison-header > div {
  padding: 20px;
  text-align: center;
}

.comparison-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  border-bottom: 1px solid #f0f0f0;
}

.comparison-row:last-child {
  border-bottom: none;
}

.comparison-row > div {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.feature-cell {
  font-weight: 600;
  color: #1a1a1a;
  justify-content: flex-start !important;
}

.status-icon.success {
  color: #52c41a;
}

.status-icon.error {
  color: #ff4d4f;
}

.performance-metrics {
  padding: 80px 0;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 32px;
}

.metric-card {
  text-align: center;
  position: relative;
}

.metric-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #1890ff, #667eea);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 28px;
  margin: 0 auto 16px;
}

.metric-value {
  font-size: 36px;
  font-weight: 700;
  color: #1890ff;
  margin-bottom: 8px;
}

.metric-label {
  font-size: 16px;
  color: #666;
  margin-bottom: 16px;
}

.metric-trend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.trend-icon {
  color: #52c41a;
}

.trend-text {
  font-size: 12px;
  color: #666;
}

@media (max-width: 768px) {
  .layer-components {
    grid-template-columns: 1fr;
  }
  
  .tech-grid {
    grid-template-columns: 1fr;
  }
  
  .comparison-header,
  .comparison-row {
    grid-template-columns: 1fr;
  }
  
  .comparison-header > div,
  .comparison-row > div {
    text-align: left;
  }
  
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }
}
</style>
