<template>
  <div class="optimized-layout-showcase">
    <!-- 使用新的响应式模块网格 - 布局展示 -->
    <ResponsiveModuleGrid
      title="iFlytek Spark 优化布局展示"
      subtitle="全新响应式设计，渐变视觉效果，提升用户体验"
      gradient-type="homepage"
      layout-type="standard"
      :stats="showcaseStats"
      :modules="layoutPages"
      :secondary-modules="designFeatures"
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
  TrendCharts,
  Grid,
  Palette,
  Mobile,
  Star,
  User,
  Document,
  VideoCamera,
  DataBoard,
  Setting,
  View,
  Odometer
} from '@element-plus/icons-vue'

const router = useRouter()

// 展示统计数据
const showcaseStats = ref([
  {
    icon: Grid,
    value: '4',
    label: '优化页面',
    trend: {
      type: 'up',
      value: '全新设计'
    }
  },
  {
    icon: Palette,
    value: '18',
    label: '渐变主题',
    trend: {
      type: 'up',
      value: '品牌一致'
    }
  },
  {
    icon: Mobile,
    value: '100%',
    label: '响应式适配',
    trend: {
      type: 'up',
      value: '全设备支持'
    }
  },
  {
    icon: Star,
    value: '4.5:1',
    label: '对比度比例',
    trend: {
      type: 'up',
      value: 'WCAG标准'
    }
  }
])

// 布局页面展示
const layoutPages = ref([
  {
    id: 1,
    title: '首页布局优化',
    description: '全新的首页设计，采用响应式网格布局和蓝色系渐变背景',
    icon: Odometer,
    gradientClass: 'homepage-gradient',
    route: '/optimized-homepage',
    features: [
      '2列/3列/1列响应式布局',
      '蓝色系品牌渐变',
      '统计数据可视化',
      '交互动画效果'
    ],
    stats: {
      breakpoints: { value: '5', label: '响应断点' },
      animations: { value: '8', label: '动画效果' }
    },
    actions: [
      {
        id: 'view-homepage',
        label: '查看首页',
        type: 'primary',
        route: '/optimized-homepage',
        icon: Odometer
      },
      {
        id: 'design-specs',
        label: '设计规范',
        type: 'default'
      }
    ]
  },
  {
    id: 2,
    title: '企业端管理平台',
    description: '企业招聘管理专用界面，紫色系渐变，宽屏布局优化',
    icon: TrendCharts,
    gradientClass: 'enterprise-gradient',
    route: '/optimized-enterprise',
    features: [
      '企业级功能模块',
      '紫色系专业渐变',
      '宽屏布局优化',
      '数据分析仪表板'
    ],
    stats: {
      modules: { value: '4', label: '核心模块' },
      tools: { value: '6', label: '管理工具' }
    },
    actions: [
      {
        id: 'view-enterprise',
        label: '查看企业端',
        type: 'primary',
        route: '/optimized-enterprise',
        icon: TrendCharts
      }
    ]
  },
  {
    id: 3,
    title: '候选人门户',
    description: '候选人专用界面，青色系渐变，注重用户体验和学习引导',
    icon: User,
    gradientClass: 'candidate-gradient',
    route: '/optimized-candidate',
    features: [
      '候选人友好界面',
      '青色系温和渐变',
      '学习路径引导',
      '个人成长跟踪'
    ],
    stats: {
      features: { value: '4', label: '主要功能' },
      tools: { value: '6', label: '支持工具' }
    },
    actions: [
      {
        id: 'view-candidate',
        label: '查看候选人端',
        type: 'primary',
        route: '/optimized-candidate',
        icon: User
      }
    ]
  },
  {
    id: 4,
    title: '报告分析中心',
    description: '数据报告专用界面，绿色系渐变，强调数据可视化和分析功能',
    icon: DataBoard,
    gradientClass: 'report-gradient',
    route: '/optimized-reports',
    features: [
      '数据可视化界面',
      '绿色系成功渐变',
      '报告生成工具',
      '分析洞察展示'
    ],
    stats: {
      reports: { value: '4', label: '报告类型' },
      analytics: { value: '6', label: '分析工具' }
    },
    actions: [
      {
        id: 'view-reports',
        label: '查看报告中心',
        type: 'primary',
        route: '/optimized-reports',
        icon: DataBoard
      }
    ]
  }
])

// 设计特性
const designFeatures = ref([
  {
    id: 'responsive-grid',
    title: '响应式网格系统',
    description: '智能适配不同屏幕尺寸，确保最佳用户体验',
    icon: Grid,
    action: {
      label: '查看文档',
      type: 'default'
    }
  },
  {
    id: 'gradient-system',
    title: '渐变背景系统',
    description: '18种主题渐变，135度角设计，品牌色彩一致性',
    icon: Palette,
    action: {
      label: '色彩指南',
      type: 'default'
    }
  },
  {
    id: 'animation-effects',
    title: '动画过渡效果',
    description: '流畅的交互动画，提升用户体验和视觉吸引力',
    icon: VideoCamera,
    action: {
      label: '动画演示',
      type: 'default'
    }
  },
  {
    id: 'accessibility',
    title: '可访问性优化',
    description: 'WCAG 2.1 AA标准，高对比度，减少动画选项',
    icon: View,
    action: {
      label: '可访问性',
      type: 'default'
    }
  },
  {
    id: 'performance',
    title: '性能优化',
    description: 'CSS变量系统，减少重绘，移动端优化',
    icon: TrendCharts,
    action: {
      label: '性能报告',
      type: 'default'
    }
  },
  {
    id: 'customization',
    title: '自定义配置',
    description: '灵活的主题配置，支持品牌定制和个性化设置',
    icon: Setting,
    action: {
      label: '配置选项',
      type: 'default'
    }
  }
])

// 事件处理
const handleModuleClick = (module) => {
  console.log('布局展示模块点击:', module.title)
  if (module.route) {
    router.push(module.route)
  }
}

const handleActionClick = (action, module) => {
  console.log('布局展示操作点击:', action.label, '模块:', module.title)
  
  if (action.route) {
    router.push(action.route)
  }
}
</script>

<style scoped>
.optimized-layout-showcase {
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    var(--iflytek-primary) 0%,
    rgba(24, 144, 255, 0.05) 100%
  );
  position: relative;
}

/* 确保渐变背景覆盖整个页面 */
.optimized-layout-showcase :deep(.responsive-module-grid) {
  background: transparent;
}

/* 展示页面专用渐变样式 */
.optimized-layout-showcase :deep(.homepage-gradient) {
  background: linear-gradient(135deg, #1890ff 0%, rgba(24, 144, 255, 0.15) 100%);
  color: white;
}

.optimized-layout-showcase :deep(.enterprise-gradient) {
  background: linear-gradient(135deg, #667eea 0%, rgba(102, 126, 234, 0.15) 100%);
  color: white;
}

.optimized-layout-showcase :deep(.candidate-gradient) {
  background: linear-gradient(135deg, #0066cc 0%, rgba(0, 102, 204, 0.15) 100%);
  color: white;
}

.optimized-layout-showcase :deep(.report-gradient) {
  background: linear-gradient(135deg, #52c41a 0%, rgba(82, 196, 26, 0.15) 100%);
  color: white;
}

/* 特殊样式 */
.optimized-layout-showcase :deep(.module-card) {
  border-left: 4px solid var(--iflytek-primary);
  transition: all 0.3s ease;
}

.optimized-layout-showcase :deep(.module-card:hover) {
  transform: translateY(-8px);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
}

.optimized-layout-showcase :deep(.stat-card) {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .optimized-layout-showcase {
    background-attachment: scroll;
  }
}
</style>
