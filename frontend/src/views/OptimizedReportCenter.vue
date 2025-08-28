<template>
  <div class="optimized-report-center">
    <!-- 使用新的响应式模块网格 - 报告中心 -->
    <ResponsiveModuleGrid
      title="iFlytek Spark 报告分析中心"
      subtitle="深度数据洞察，智能报告生成，驱动科学决策"
      gradient-type="report"
      layout-type="wide"
      :stats="reportStats"
      :modules="reportModules"
      :secondary-modules="analysisTools"
      @module-click="handleModuleClick"
      @action-click="handleActionClick"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ResponsiveModuleGrid from '@/components/Layout/ResponsiveModuleGrid.vue'
import {
  Document,
  TrendCharts,
  DataBoard,
  Download,
  Share,
  Timer,
  Star,
  ArrowUp,
  ArrowDown,
  User,
  VideoCamera,
  Grid,
  Setting,
  Bell,
  Calendar
} from '@element-plus/icons-vue'

const router = useRouter()

// 报告统计数据
const reportStats = ref([
  {
    icon: Document,
    value: '1,247',
    label: '生成报告总数',
    trend: {
      type: 'up',
      value: '+156 本月'
    }
  },
  {
    icon: TrendCharts,
    value: '89%',
    label: '报告准确率',
    trend: {
      type: 'up',
      value: '+3%'
    }
  },
  {
    icon: Timer,
    value: '2.3秒',
    label: '平均生成时间',
    trend: {
      type: 'down',
      value: '-0.5秒'
    }
  },
  {
    icon: Star,
    value: '4.8分',
    label: '用户满意度',
    trend: {
      type: 'up',
      value: '+0.2分'
    }
  }
])

// 报告主要功能模块
const reportModules = ref([
  {
    id: 1,
    title: '智能报告生成',
    description: '基于AI的自动化报告生成，支持多种模板和自定义格式',
    icon: Document,
    gradientClass: 'report-gradient',
    route: '/report-generator',
    features: [
      '多模板智能生成',
      '自定义报告格式',
      '实时数据更新',
      '批量报告处理'
    ],
    stats: {
      templates: { value: '25', label: '报告模板' },
      generated: { value: '156', label: '本月生成' }
    },
    actions: [
      {
        id: 'create-report',
        label: '创建报告',
        type: 'primary',
        route: '/report-generator',
        icon: Document
      },
      {
        id: 'template-library',
        label: '模板库',
        type: 'default',
        route: '/report-templates'
      }
    ]
  },
  {
    id: 2,
    title: '数据可视化分析',
    description: '丰富的图表类型和交互式数据可视化，直观展示分析结果',
    icon: TrendCharts,
    gradientClass: 'analytics-gradient',
    route: '/data-visualization',
    features: [
      '多种图表类型',
      '交互式数据探索',
      '实时数据监控',
      '趋势预测分析'
    ],
    stats: {
      charts: { value: '15', label: '图表类型' },
      dashboards: { value: '8', label: '仪表板' }
    },
    actions: [
      {
        id: 'view-charts',
        label: '查看图表',
        type: 'primary',
        route: '/data-visualization',
        icon: TrendCharts
      },
      {
        id: 'create-dashboard',
        label: '创建仪表板',
        type: 'default',
        route: '/dashboard-builder'
      }
    ]
  },
  {
    id: 3,
    title: '面试质量分析',
    description: '深度分析面试质量，提供改进建议和最佳实践指导',
    icon: VideoCamera,
    gradientClass: 'multimodal-gradient',
    route: '/interview-quality-analysis',
    features: [
      '面试质量评估',
      '面试官表现分析',
      '候选人体验评价',
      '流程优化建议'
    ],
    stats: {
      interviews: { value: '342', label: '分析面试' },
      quality: { value: '92%', label: '质量得分' }
    },
    actions: [
      {
        id: 'quality-analysis',
        label: '质量分析',
        type: 'primary',
        route: '/interview-quality-analysis',
        icon: VideoCamera
      }
    ]
  },
  {
    id: 4,
    title: '招聘效果评估',
    description: '全面评估招聘效果，分析ROI和关键绩效指标',
    icon: DataBoard,
    gradientClass: 'enterprise-gradient',
    route: '/recruitment-effectiveness',
    features: [
      '招聘ROI分析',
      '关键指标监控',
      '成本效益评估',
      '绩效对比分析'
    ],
    stats: {
      roi: { value: '285%', label: '招聘ROI' },
      efficiency: { value: '+45%', label: '效率提升' }
    },
    actions: [
      {
        id: 'effectiveness-report',
        label: '效果报告',
        type: 'primary',
        route: '/recruitment-effectiveness',
        icon: DataBoard
      }
    ]
  }
])

// 分析工具
const analysisTools = ref([
  {
    id: 'export-center',
    title: '导出中心',
    description: '支持多种格式的报告导出，包括PDF、Excel、PPT等',
    icon: Download,
    action: {
      label: '导出报告',
      type: 'default',
      route: '/export-center'
    }
  },
  {
    id: 'share-management',
    title: '分享管理',
    description: '灵活的报告分享机制，支持权限控制和访问统计',
    icon: Share,
    action: {
      label: '分享设置',
      type: 'default',
      route: '/share-management'
    }
  },
  {
    id: 'scheduled-reports',
    title: '定时报告',
    description: '自动化定时报告生成和发送，支持多种触发条件',
    icon: Calendar,
    action: {
      label: '定时设置',
      type: 'default',
      route: '/scheduled-reports'
    }
  },
  {
    id: 'data-sources',
    title: '数据源管理',
    description: '管理和配置各种数据源，确保数据质量和一致性',
    icon: Grid,
    action: {
      label: '数据源',
      type: 'default',
      route: '/data-sources'
    }
  },
  {
    id: 'report-alerts',
    title: '报告预警',
    description: '智能预警系统，及时发现异常数据和趋势变化',
    icon: Bell,
    action: {
      label: '预警设置',
      type: 'default',
      route: '/report-alerts'
    }
  },
  {
    id: 'analytics-settings',
    title: '分析设置',
    description: '自定义分析参数、算法配置和报告生成规则',
    icon: Setting,
    action: {
      label: '分析配置',
      type: 'default',
      route: '/analytics-settings'
    }
  }
])

// 事件处理
const handleModuleClick = (module) => {
  console.log('报告模块点击:', module.title)
  if (module.route) {
    router.push(module.route)
  }
}

const handleActionClick = (action, module) => {
  console.log('报告操作点击:', action.label, '模块:', module.title)
  
  // 特殊操作处理
  if (action.id === 'export-report') {
    // 导出报告逻辑
    console.log('开始导出报告...')
    return
  }
  
  if (action.route) {
    router.push(action.route)
  }
}
</script>

<style scoped>
.optimized-report-center {
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    var(--iflytek-success) 0%,
    rgba(82, 196, 26, 0.05) 100%
  );
  position: relative;
}

/* 确保渐变背景覆盖整个页面 */
.optimized-report-center :deep(.responsive-module-grid) {
  background: transparent;
}

/* 报告中心专用渐变样式 */
.optimized-report-center :deep(.report-gradient) {
  background: linear-gradient(135deg, #52c41a 0%, rgba(82, 196, 26, 0.15) 100%);
  color: white;
}

.optimized-report-center :deep(.analytics-gradient) {
  background: linear-gradient(135deg, #764ba2 0%, rgba(118, 75, 162, 0.15) 100%);
  color: white;
}

.optimized-report-center :deep(.multimodal-gradient) {
  background: linear-gradient(135deg, #1890ff 0%, rgba(24, 144, 255, 0.15) 100%);
  color: white;
}

.optimized-report-center :deep(.enterprise-gradient) {
  background: linear-gradient(135deg, #667eea 0%, rgba(102, 126, 234, 0.15) 100%);
  color: white;
}

/* 报告中心特殊样式 */
.optimized-report-center :deep(.module-card) {
  border-left: 4px solid var(--iflytek-success);
}

.optimized-report-center :deep(.stat-card) {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .optimized-report-center {
    background-attachment: scroll;
  }
}
</style>
