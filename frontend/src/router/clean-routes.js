import { createRouter, createWebHistory } from 'vue-router'
import { markRaw } from 'vue'

// 核心页面组件
import CleanHomePage from '../views/CleanHomePage.vue'
import DemoPage from '../views/DemoPage.vue'
import InterviewSelection from '../views/InterviewSelection.vue'
import TextBasedInterviewPage from '../views/TextBasedInterviewPage.vue'

import InterviewResult from '../views/InterviewResult.vue'
import ReportView from '../views/ReportView.vue'
import CandidatePortal from '../views/CandidatePortal.vue'
import EnterpriseDashboard from '../views/EnterpriseDashboard.vue'
import PositionManagement from '../views/PositionManagement.vue'
import EnterpriseReports from '../views/EnterpriseReports.vue'
import BatchInterviewSetup from '../views/BatchInterviewSetup.vue'
import LearningPathPage from '../views/LearningPathPage.vue'
import QuestionPreviewPage from '../views/QuestionPreviewPage.vue'
import NotFound from '../views/NotFound.vue'
import OptimizedHomePage from '../views/OptimizedHomePage.vue'

// 求职者中心相关页面
import PracticeInterviewPage from '../views/PracticeInterviewPage.vue'
import CandidateProfilePage from '../views/CandidateProfilePage.vue'
import InterviewAssistantPage from '../views/InterviewAssistantPage.vue'
import SkillAssessmentPage from '../views/SkillAssessmentPage.vue'
import SimpleEnhancedDemo from '../views/SimpleEnhancedDemo.vue'
import ProcessEnvFixTest from '../views/ProcessEnvFixTest.vue'
import EnvDebugPage from '../views/EnvDebugPage.vue'
import TestDebugPage from '../views/TestDebugPage.vue'
import IconTestPage from '../views/IconTestPage.vue'
import FixedInterviewPage from '../views/FixedInterviewPage.vue'
import VoiceInterviewPage from '../views/VoiceInterviewPage.vue'
import InterviewingPage from '../views/InterviewingPage.vue'
import InterviewSetup from '../views/InterviewSetup.vue'
import InterviewRoom from '../views/InterviewRoom.vue'
import SimpleEvaluationDemo from '../components/Demo/SimpleEvaluationDemo.vue'

// 简化的路由配置
const routes = [
  // 主页
  {
    path: '/',
    name: 'Home',
    component: markRaw(CleanHomePage),
    meta: {
      title: 'iFlytek Spark 智能面试系统',
      requiresAuth: false
    }
  },

  // 产品演示
  {
    path: '/demo',
    name: 'Demo',
    component: markRaw(DemoPage),
    meta: {
      title: '产品演示',
      requiresAuth: false
    }
  },

  // 增强演示
  {
    path: '/enhanced-demo',
    name: 'EnhancedDemo',
    component: markRaw(SimpleEnhancedDemo),
    meta: {
      title: 'iFlytek Spark 增强演示',
      requiresAuth: false
    }
  },

  // AI智能评估演示
  {
    path: '/evaluation',
    name: 'EvaluationDemo',
    component: markRaw(SimpleEvaluationDemo),
    meta: {
      title: 'AI实时评估演示',
      requiresAuth: false
    }
  },

  // 面试相关
  {
    path: '/interview-selection',
    name: 'InterviewSelection',
    component: markRaw(InterviewSelection),
    meta: {
      title: '面试选择',
      requiresAuth: false
    }
  },
  {
    path: '/interview-setup',
    name: 'InterviewSetup',
    component: markRaw(InterviewSetup),
    meta: {
      title: '面试设置',
      requiresAuth: false
    }
  },
  {
    path: '/interview-room',
    name: 'InterviewRoom',
    component: markRaw(InterviewRoom),
    meta: {
      title: 'iFlytek Spark 面试房间',
      requiresAuth: false
    }
  },

  {
    path: '/fixed-interview',
    name: 'FixedInterview',
    component: markRaw(FixedInterviewPage),
    meta: {
      title: '修复后的面试页面',
      requiresAuth: false
    }
  },
  {
    path: '/voice-interview',
    name: 'VoiceInterview',
    component: markRaw(VoiceInterviewPage),
    meta: {
      title: 'iFlytek Spark 语音面试',
      requiresAuth: false
    }
  },
  {
    path: '/text-interview',
    name: 'TextInterview',
    component: markRaw(TextBasedInterviewPage),
    meta: {
      title: 'iFlytek Spark 文字面试',
      requiresAuth: false
    }
  },
  {
    path: '/interview-result',
    name: 'InterviewResult',
    component: markRaw(InterviewResult),
    meta: {
      title: '面试结果',
      requiresAuth: false
    }
  },

  // 报告查看
  {
    path: '/reports',
    name: 'Reports',
    component: markRaw(ReportView),
    meta: {
      title: '面试报告',
      requiresAuth: false
    }
  },

  // 候选人入口
  {
    path: '/candidate',
    name: 'Candidate',
    component: markRaw(CandidatePortal),
    meta: {
      title: '候选人入口',
      requiresAuth: false
    }
  },

  // 企业版功能
  {
    path: '/enterprise',
    name: 'Enterprise',
    component: markRaw(EnterpriseDashboard),
    meta: {
      title: '企业管理中心',
      requiresAuth: false
    }
  },
  {
    path: '/position-management',
    name: 'PositionManagement',
    component: markRaw(PositionManagement),
    meta: {
      title: '职位管理',
      requiresAuth: false
    }
  },
  {
    path: '/enterprise-reports',
    name: 'EnterpriseReports',
    component: markRaw(EnterpriseReports),
    meta: {
      title: '企业报告',
      requiresAuth: false
    }
  },
  {
    path: '/batch-interview-setup',
    name: 'BatchInterviewSetup',
    component: markRaw(BatchInterviewSetup),
    meta: {
      title: '批量创建面试',
      requiresAuth: false,
      role: 'enterprise'
    }
  },

  // 学习路径
  {
    path: '/learning-path',
    name: 'LearningPath',
    component: markRaw(LearningPathPage),
    meta: {
      title: '智能学习路径',
      requiresAuth: false
    }
  },

  // 求职者中心相关路由
  {
    path: '/practice-interview',
    name: 'PracticeInterview',
    component: markRaw(PracticeInterviewPage),
    meta: {
      title: '面试练习',
      requiresAuth: false
    }
  },
  {
    path: '/candidate-profile',
    name: 'CandidateProfile',
    component: markRaw(CandidateProfilePage),
    meta: {
      title: '个人设置',
      requiresAuth: false
    }
  },
  {
    path: '/interview-assistant',
    name: 'InterviewAssistant',
    component: markRaw(InterviewAssistantPage),
    meta: {
      title: '面试助手',
      requiresAuth: false
    }
  },
  {
    path: '/skill-assessment',
    name: 'SkillAssessment',
    component: markRaw(SkillAssessmentPage),
    meta: {
      title: '技能评估',
      requiresAuth: false
    }
  },

  // 题目预览
  {
    path: '/question-preview',
    name: 'QuestionPreview',
    component: markRaw(QuestionPreviewPage),
    meta: {
      title: '题目预览',
      requiresAuth: false
    }
  },

  // 优化主页
  {
    path: '/optimized-home',
    name: 'OptimizedHome',
    component: markRaw(OptimizedHomePage),
    meta: {
      title: 'iFlytek Spark 智能面试系统 - 优化版',
      requiresAuth: false
    }
  },

  // 测试页面
  {
    path: '/process-env-fix-test',
    name: 'ProcessEnvFixTest',
    component: markRaw(ProcessEnvFixTest),
    meta: {
      title: 'Process.env 修复验证',
      requiresAuth: false
    }
  },

  // 环境变量调试页面
  {
    path: '/env-debug',
    name: 'EnvDebugPage',
    component: markRaw(EnvDebugPage),
    meta: {
      title: '环境变量调试',
      requiresAuth: false
    }
  },

  // 测试调试页面
  {
    path: '/test-debug',
    name: 'TestDebugPage',
    component: markRaw(TestDebugPage),
    meta: {
      title: '测试调试',
      requiresAuth: false
    }
  },

  // 图标测试页面
  {
    path: '/icon-test',
    name: 'IconTest',
    component: markRaw(IconTestPage),
    meta: {
      title: '图标测试',
      requiresAuth: false
    }
  },

  // ResizeObserver测试页面
  {
    path: '/resize-observer-test',
    name: 'ResizeObserverTest',
    component: () => import('../views/ResizeObserverTestPage.vue'),
    meta: {
      title: 'ResizeObserver 错误修复测试',
      requiresAuth: false
    }
  },

  // 404页面
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: markRaw(NotFound),
    meta: {
      title: '页面未找到',
      requiresAuth: false
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - iFlytek Spark`
  }
  
  next()
})

export default router
