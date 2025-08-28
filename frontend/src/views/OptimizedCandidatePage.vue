<template>
  <div class="optimized-candidate-page">
    <!-- 使用新的响应式模块网格 - 候选人端 -->
    <ResponsiveModuleGrid
      title="iFlytek Spark 候选人门户"
      subtitle="智能面试体验，个性化技能提升，助力职业发展"
      gradient-type="candidate"
      layout-type="standard"
      :stats="candidateStats"
      :modules="candidateModules"
      :secondary-modules="supportTools"
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
  VideoCamera,
  Microphone,
  Document,
  TrendCharts,
  Star,
  Timer,
  User,
  ArrowUp,
  ArrowDown,
  Check,
  Trophy,
  Headset,
  Setting
} from '@element-plus/icons-vue'

const router = useRouter()

// 候选人统计数据
const candidateStats = ref([
  {
    icon: VideoCamera,
    value: '12',
    label: '已完成面试',
    trend: {
      type: 'up',
      value: '+3 本月'
    }
  },
  {
    icon: Star,
    value: '85分',
    label: '平均面试得分',
    trend: {
      type: 'up',
      value: '+5分'
    }
  },
  {
    icon: Trophy,
    value: '7',
    label: '技能认证',
    trend: {
      type: 'up',
      value: '+2 新增'
    }
  },
  {
    icon: Trophy,
    value: '92%',
    label: '目标完成度',
    trend: {
      type: 'up',
      value: '+8%'
    }
  }
])

// 候选人主要功能模块
const candidateModules = ref([
  {
    id: 1,
    title: '智能面试练习',
    description: '基于AI的模拟面试，提供实时反馈和改进建议',
    icon: VideoCamera,
    gradientClass: 'candidate-gradient',
    route: '/interview-selection',
    features: [
      '多种面试场景模拟',
      '实时语音分析反馈',
      '个性化问题推荐',
      '面试技巧指导'
    ],
    stats: {
      sessions: { value: '12', label: '练习次数' },
      improvement: { value: '+15%', label: '技能提升' }
    },
    actions: [
      {
        id: 'start-practice',
        label: '开始练习',
        type: 'primary',
        route: '/interview-selection',
        icon: VideoCamera
      },
      {
        id: 'view-history',
        label: '查看历史',
        type: 'default',
        route: '/interview-history'
      }
    ]
  },
  {
    id: 2,
    title: '技能评估报告',
    description: '详细的技能分析报告，了解自己的优势和改进空间',
    icon: TrendCharts,
    gradientClass: 'analytics-gradient',
    route: '/skill-assessment',
    features: [
      '多维度技能分析',
      '行业对比基准',
      '改进建议推荐',
      '进步趋势跟踪'
    ],
    stats: {
      reports: { value: '8', label: '评估报告' },
      skills: { value: '15', label: '技能项目' }
    },
    actions: [
      {
        id: 'view-assessment',
        label: '查看评估',
        type: 'primary',
        route: '/skill-assessment',
        icon: TrendCharts
      },
      {
        id: 'download-report',
        label: '下载报告',
        type: 'default'
      }
    ]
  },
  {
    id: 3,
    title: '个性化学习路径',
    description: '基于面试表现的定制化学习计划和资源推荐',
    icon: Document,
    gradientClass: 'recruitment-gradient',
    route: '/learning-path',
    features: [
      '智能学习路径规划',
      '个性化资源推荐',
      '学习进度跟踪',
      '技能认证体系'
    ],
    stats: {
      courses: { value: '25', label: '推荐课程' },
      progress: { value: '68%', label: '完成进度' }
    },
    actions: [
      {
        id: 'view-path',
        label: '查看路径',
        type: 'primary',
        route: '/learning-path',
        icon: Document
      },
      {
        id: 'browse-courses',
        label: '浏览课程',
        type: 'default',
        route: '/courses'
      }
    ]
  },
  {
    id: 4,
    title: '实时面试助手',
    description: '面试过程中的智能提示和支持，提升面试表现',
    icon: Headset,
    gradientClass: 'multimodal-gradient',
    route: '/interview-assistant',
    features: [
      '实时语音指导',
      '情绪状态监测',
      '回答质量分析',
      '紧张情绪缓解'
    ],
    stats: {
      sessions: { value: '5', label: '使用次数' },
      satisfaction: { value: '4.8', label: '满意度' }
    },
    actions: [
      {
        id: 'try-assistant',
        label: '体验助手',
        type: 'primary',
        route: '/interview-assistant',
        icon: Headset
      }
    ]
  }
])

// 支持工具
const supportTools = ref([
  {
    id: 'interview-tips',
    title: '面试技巧库',
    description: '丰富的面试技巧、常见问题解答和成功案例分享',
    icon: Document,
    action: {
      label: '查看技巧',
      type: 'default',
      route: '/interview-tips'
    }
  },
  {
    id: 'career-guidance',
    title: '职业指导',
    description: '专业的职业规划建议和行业发展趋势分析',
    icon: Trophy,
    action: {
      label: '职业规划',
      type: 'default',
      route: '/career-guidance'
    }
  },
  {
    id: 'mock-interviews',
    title: '模拟面试',
    description: '真实场景模拟，多种岗位类型的专业面试练习',
    icon: VideoCamera,
    action: {
      label: '开始模拟',
      type: 'default',
      route: '/mock-interviews'
    }
  },
  {
    id: 'feedback-center',
    title: '反馈中心',
    description: '收集面试反馈，持续改进面试表现和用户体验',
    icon: Star,
    action: {
      label: '提交反馈',
      type: 'default',
      route: '/feedback'
    }
  },
  {
    id: 'achievement-system',
    title: '成就系统',
    description: '记录学习成果，获得技能认证和成就徽章',
    icon: Trophy,
    action: {
      label: '查看成就',
      type: 'default',
      route: '/achievements'
    }
  },
  {
    id: 'personal-settings',
    title: '个人设置',
    description: '自定义个人信息、偏好设置和隐私控制',
    icon: Setting,
    action: {
      label: '个人设置',
      type: 'default',
      route: '/personal-settings'
    }
  }
])

// 事件处理
const handleModuleClick = (module) => {
  console.log('候选人模块点击:', module.title)
  if (module.route) {
    router.push(module.route)
  }
}

const handleActionClick = (action, module) => {
  console.log('候选人操作点击:', action.label, '模块:', module.title)
  
  // 特殊操作处理
  if (action.id === 'download-report') {
    // 下载报告逻辑
    console.log('开始下载报告...')
    return
  }
  
  if (action.route) {
    router.push(action.route)
  }
}
</script>

<style scoped>
.optimized-candidate-page {
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    var(--iflytek-accent) 0%,
    rgba(0, 102, 204, 0.05) 100%
  );
  position: relative;
}

/* 确保渐变背景覆盖整个页面 */
.optimized-candidate-page :deep(.responsive-module-grid) {
  background: transparent;
}

/* 候选人端专用渐变样式 */
.optimized-candidate-page :deep(.candidate-gradient) {
  background: linear-gradient(135deg, #0066cc 0%, rgba(0, 102, 204, 0.15) 100%);
  color: white;
}

.optimized-candidate-page :deep(.analytics-gradient) {
  background: linear-gradient(135deg, #764ba2 0%, rgba(118, 75, 162, 0.15) 100%);
  color: white;
}

.optimized-candidate-page :deep(.recruitment-gradient) {
  background: linear-gradient(135deg, #52c41a 0%, rgba(82, 196, 26, 0.15) 100%);
  color: white;
}

.optimized-candidate-page :deep(.multimodal-gradient) {
  background: linear-gradient(135deg, #1890ff 0%, rgba(24, 144, 255, 0.15) 100%);
  color: white;
}

/* 候选人端特殊样式 */
.optimized-candidate-page :deep(.module-card) {
  border-left: 4px solid var(--iflytek-accent);
}

.optimized-candidate-page :deep(.stat-card) {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .optimized-candidate-page {
    background-attachment: scroll;
  }
}
</style>
