<template>
  <div class="optimized-enterprise-page">
    <!-- 使用新的响应式模块网格 - 企业端 -->
    <ResponsiveModuleGrid
      title="iFlytek Spark 企业招聘管理平台"
      subtitle="智能化招聘流程，数据驱动人才决策，提升招聘效率与质量"
      gradient-type="enterprise"
      layout-type="wide"
      :stats="enterpriseStats"
      :modules="enterpriseModules"
      :secondary-modules="managementTools"
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
  User,
  TrendCharts,
  Document,
  Setting,
  DataBoard,
  Timer,
  Star,
  ArrowUp,
  VideoCamera,
  Microphone,
  Grid,
  Download,
  Upload,
  Search,
  Bell
} from '@element-plus/icons-vue'

const router = useRouter()

// 企业统计数据
const enterpriseStats = ref([
  {
    icon: User,
    value: '2,580',
    label: '候选人总数',
    trend: {
      type: 'up',
      value: '+12%'
    }
  },
  {
    icon: TrendCharts,
    value: '156',
    label: '本月面试',
    trend: {
      type: 'up',
      value: '+25%'
    }
  },
  {
    icon: Star,
    value: '89%',
    label: '面试通过率',
    trend: {
      type: 'up',
      value: '+5%'
    }
  },
  {
    icon: Timer,
    value: '3.2天',
    label: '平均招聘周期',
    trend: {
      type: 'down',
      value: '-15%'
    }
  }
])

// 企业主要功能模块
const enterpriseModules = ref([
  {
    id: 1,
    title: '批量招聘管理',
    description: '高效管理大规模招聘需求，支持批量面试创建和候选人筛选',
    icon: User,
    gradientClass: 'enterprise-gradient',
    route: '/batch-interview-setup',
    features: [
      '批量职位发布',
      '智能候选人匹配',
      '一键创建多场面试',
      '自动化筛选流程'
    ],
    stats: {
      positions: { value: '45', label: '活跃职位' },
      candidates: { value: '1,200', label: '候选人池' }
    },
    actions: [
      {
        id: 'create-batch',
        label: '创建批量面试',
        type: 'primary',
        route: '/batch-interview-setup',
        icon: User
      },
      {
        id: 'manage-positions',
        label: '职位管理',
        type: 'default',
        route: '/position-management'
      }
    ]
  },
  {
    id: 2,
    title: '数据分析中心',
    description: '全方位招聘数据分析，提供深度洞察和决策支持',
    icon: DataBoard,
    gradientClass: 'analytics-gradient',
    route: '/intelligent-dashboard',
    features: [
      '实时招聘仪表板',
      '候选人质量分析',
      '面试效果评估',
      '趋势预测报告'
    ],
    stats: {
      reports: { value: '50+', label: '分析报告' },
      insights: { value: '15', label: '关键洞察' }
    },
    actions: [
      {
        id: 'view-dashboard',
        label: '查看仪表板',
        type: 'primary',
        route: '/intelligent-dashboard',
        icon: DataBoard
      },
      {
        id: 'export-data',
        label: '导出数据',
        type: 'default',
        icon: Download
      }
    ]
  },
  {
    id: 3,
    title: '面试质量管控',
    description: '确保面试标准化和质量一致性，提升招聘决策准确性',
    icon: TrendCharts,
    gradientClass: 'recruitment-gradient',
    route: '/quality-control',
    features: [
      '面试标准制定',
      '评估质量监控',
      '面试官培训',
      '结果校准分析'
    ],
    stats: {
      standards: { value: '12', label: '评估标准' },
      quality: { value: '94%', label: '质量得分' }
    },
    actions: [
      {
        id: 'quality-settings',
        label: '质量设置',
        type: 'primary',
        route: '/quality-control',
        icon: TrendCharts
      }
    ]
  },
  {
    id: 4,
    title: '候选人管理',
    description: '全生命周期候选人管理，从简历筛选到入职跟踪',
    icon: Search,
    gradientClass: 'multimodal-gradient',
    route: '/candidate-management',
    features: [
      '智能简历解析',
      '候选人标签管理',
      '沟通记录跟踪',
      '入职流程管理'
    ],
    stats: {
      active: { value: '856', label: '活跃候选人' },
      pipeline: { value: '234', label: '面试流水线' }
    },
    actions: [
      {
        id: 'candidate-search',
        label: '搜索候选人',
        type: 'primary',
        route: '/candidate-management',
        icon: Search
      },
      {
        id: 'import-resumes',
        label: '导入简历',
        type: 'default',
        icon: Upload
      }
    ]
  }
])

// 管理工具
const managementTools = ref([
  {
    id: 'notifications',
    title: '通知中心',
    description: '实时接收面试进度、候选人状态等重要通知',
    icon: Bell,
    action: {
      label: '查看通知',
      type: 'default',
      route: '/notifications'
    }
  },
  {
    id: 'team-management',
    title: '团队管理',
    description: '管理面试官权限、分配面试任务、协调团队工作',
    icon: User,
    action: {
      label: '团队设置',
      type: 'default',
      route: '/team-management'
    }
  },
  {
    id: 'system-config',
    title: '系统配置',
    description: '自定义面试流程、评估标准、通知规则等系统设置',
    icon: Setting,
    action: {
      label: '系统设置',
      type: 'default',
      route: '/system-config'
    }
  },
  {
    id: 'api-integration',
    title: 'API集成',
    description: '与现有HR系统、ATS平台无缝集成，数据同步',
    icon: Grid,
    action: {
      label: 'API文档',
      type: 'default',
      route: '/api-docs'
    }
  },
  {
    id: 'reports-center',
    title: '报告中心',
    description: '生成各类招聘报告，支持自定义报告模板',
    icon: Document,
    action: {
      label: '报告中心',
      type: 'default',
      route: '/reports'
    }
  },
  {
    id: 'training-resources',
    title: '培训资源',
    description: '面试官培训材料、最佳实践指南、操作手册',
    icon: VideoCamera,
    action: {
      label: '培训中心',
      type: 'default',
      route: '/training'
    }
  }
])

// 事件处理
const handleModuleClick = (module) => {
  console.log('企业模块点击:', module.title)
  if (module.route) {
    router.push(module.route)
  }
}

const handleActionClick = (action, module) => {
  console.log('企业操作点击:', action.label, '模块:', module.title)
  
  // 特殊操作处理
  if (action.id === 'export-data') {
    // 导出数据逻辑
    console.log('开始导出数据...')
    return
  }
  
  if (action.id === 'import-resumes') {
    // 导入简历逻辑
    console.log('开始导入简历...')
    return
  }
  
  if (action.route) {
    router.push(action.route)
  }
}
</script>

<style scoped>
.optimized-enterprise-page {
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    var(--iflytek-secondary) 0%,
    rgba(102, 126, 234, 0.05) 100%
  );
  position: relative;
}

/* 确保渐变背景覆盖整个页面 */
.optimized-enterprise-page :deep(.responsive-module-grid) {
  background: transparent;
}

/* 企业端专用渐变样式 */
.optimized-enterprise-page :deep(.enterprise-gradient) {
  background: linear-gradient(135deg, #667eea 0%, rgba(102, 126, 234, 0.15) 100%);
  color: white;
}

.optimized-enterprise-page :deep(.analytics-gradient) {
  background: linear-gradient(135deg, #764ba2 0%, rgba(118, 75, 162, 0.15) 100%);
  color: white;
}

.optimized-enterprise-page :deep(.recruitment-gradient) {
  background: linear-gradient(135deg, #52c41a 0%, rgba(82, 196, 26, 0.15) 100%);
  color: white;
}

.optimized-enterprise-page :deep(.multimodal-gradient) {
  background: linear-gradient(135deg, #1890ff 0%, rgba(24, 144, 255, 0.15) 100%);
  color: white;
}

/* 企业端特殊样式 */
.optimized-enterprise-page :deep(.module-card) {
  border-left: 4px solid var(--iflytek-secondary);
}

.optimized-enterprise-page :deep(.stat-card) {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .optimized-enterprise-page {
    background-attachment: scroll;
  }
}
</style>
