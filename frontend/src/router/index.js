import { createRouter, createWebHistory } from 'vue-router'
import { markRaw } from 'vue'
import CleanHomePage from '../views/CleanHomePage.vue'
import DemoPage from '../views/DemoPage.vue'
import InterviewSelection from '../views/InterviewSelection.vue'
import NewInterviewSelection from '../views/NewInterviewSelection.vue'
import InterviewSetup from '../views/InterviewSetup.vue'
import InterviewingPage from '../views/InterviewingPageFixed.vue'
import NewInterviewingPage from '../views/NewInterviewingPage.vue'
import ReportView from '../views/ReportView.vue'
import NewReportView from '../views/NewReportView.vue'
import ReportCenter from '../views/ReportCenter.vue'
import LearningPathPage from '../views/LearningPathPage.vue'
import LearningPathDetailsPage from '../views/LearningPathDetailsPage.vue'
import LearningPathOverviewPage from '../views/LearningPathOverviewPage.vue'
import LearningModuleDetailsPage from '../views/LearningModuleDetailsPage.vue'
import PersonalSettingsPage from '../views/PersonalSettingsPage.vue'
import SkillAssessmentPage from '../views/SkillAssessmentPage.vue'
import SettingsTestPage from '../views/SettingsTestPage.vue'
import FunctionModificationTestPage from '../views/FunctionModificationTestPage.vue'
import ThemeTestPage from '../views/ThemeTestPage.vue'
import ComprehensiveTestPage from '../views/ComprehensiveTestPage.vue'
import FeatureTestPage from '../views/FeatureTestPage.vue'
import EnhancedLearningPathPage from '../views/EnhancedLearningPathPage.vue'
import DebugLearningPath from '../views/DebugLearningPath.vue'
import StatusCheck from '../views/StatusCheck.vue'
import EnhancedDemoPage from '../views/EnhancedDemoPage.vue'
import SimpleEnhancedDemo from '../views/SimpleEnhancedDemo.vue'
import EnhancedMediaShowcase from '../views/EnhancedMediaShowcase.vue'
// 移除不存在的SimpleHomePage导入
import OptimizedBranchDiagramDemo from '../views/OptimizedBranchDiagramDemo.vue'
import EnhancedBranchDiagramDemo from '../views/EnhancedBranchDiagramDemo.vue'
import EnhancedHomePage from '../views/EnhancedHomePage.vue'
import OptimizedEnterprisePage from '../views/OptimizedEnterprisePage.vue'
import OptimizedCandidatePage from '../views/OptimizedCandidatePage.vue'
import OptimizedReportCenter from '../views/OptimizedReportCenter.vue'
import LayoutTestPage from '../views/LayoutTestPage.vue'
// 移除不存在的组件导入
// import ChartDemoPage from '../views/ChartDemoPage.vue'
// import EnhancedInteractiveDemoPage from '../views/EnhancedInteractiveDemoPage.vue'
// import CompetitorIntegrationDemo from '../views/CompetitorIntegrationDemo.vue'
// import SparkTestPage from '../views/SparkTestPage.vue'
import TextPrimaryInterviewPage from '../views/TextPrimaryInterviewPage.vue'
import VoiceInterviewPage from '../views/VoiceInterviewPage.vue'
import InterviewModeSelection from '../views/InterviewModeSelection.vue'
import PDFTestPage from '../views/PDFTestPage.vue'
import UIOptimizationDemo from '../views/UIOptimizationDemo.vue'
import TestEvaluationPage from '../components/Demo/TestEvaluationPage.vue'
import TextInterviewTechDetails from '../components/Demo/TextInterviewTechDetails.vue'
import AIEvaluationTechDetails from '../components/Demo/AIEvaluationTechDetails.vue'
import AIRecruitmentAssistant from '../views/AIRecruitmentAssistant.vue'
import AssessmentExamPage from '../views/AssessmentExamPage.vue'
import AssessmentResultPage from '../views/AssessmentResultPage.vue'
import ReportTestPage from '../views/ReportTestPage.vue'
// import EChartsTestPage from '../views/EChartsTestPage.vue'
// import SparkServiceTest from '../views/SparkServiceTest.vue'
// import AIResponseTestPage from '../views/AIResponseTestPage.vue'
// import IntegrationTestPage from '../views/IntegrationTestPage.vue'
import InterviewResult from '../views/InterviewResult.vue'
import TextBasedInterviewPage from '../views/TextBasedInterviewPage.vue'
import CompactTextInterviewPage from '../views/CompactTextInterviewPage.vue'
import InterviewModeSelector from '../views/InterviewModeSelector.vue'
import SystemTestPage from '../views/SystemTestPage.vue'
import PersonalizedHomePage from '../views/PersonalizedHomePage.vue'
import FixedPersonalizedHomePage from '../views/FixedPersonalizedHomePage.vue'
// ResizeObserverTestPage 已移除
// 移除不存在的测试页面导入
// import HomepageDisplayTestPage from '../views/HomepageDisplayTestPage.vue'
import IconTestPage from '../views/IconTestPage.vue'
// import UIAlignmentTestPage from '../views/UIAlignmentTestPage.vue'
import ReportEnhancerTest from '../views/ReportEnhancerTest.vue'
import ComprehensiveOptimizationTest from '../views/ComprehensiveOptimizationTest.vue'
import NotFound from '../views/NotFound.vue'
// 测试页面已移除

const routes = [
  {
    path: '/',
    name: 'Home',
    component: markRaw(FixedPersonalizedHomePage),
    meta: {
      title: 'iFlytek 星火智能面试系统 - 个性化首页',
      requiresAuth: false
    }
  },
  {
    path: '/clean-home',
    name: 'CleanHome',
    component: markRaw(CleanHomePage),
    meta: {
      title: 'iFlytek 星火智能面试系统 - 简洁版',
      requiresAuth: false
    }
  },
  {
    path: '/demo',
    name: 'Demo',
    component: markRaw(DemoPage),
  },

  {
    path: '/enhanced-demo',
    name: 'EnhancedDemo',
    component: markRaw(SimpleEnhancedDemo),
  },
  {
    path: '/media-showcase',
    name: 'MediaShowcase',
    component: markRaw(EnhancedMediaShowcase),
  },
  {
    path: '/evaluation',
    name: 'EvaluationDemo',
    component: markRaw(TestEvaluationPage),
    meta: {
      title: 'AI实时评估演示',
      requiresAuth: false
    }
  },
  {
    path: '/demo/text-interview/details',
    name: 'TextInterviewTechDetails',
    component: markRaw(TextInterviewTechDetails),
    meta: {
      title: '智能文本面试技术详情',
      requiresAuth: false
    }
  },
  {
    path: '/demo/ai-evaluation/details',
    name: 'AIEvaluationTechDetails',
    component: markRaw(AIEvaluationTechDetails),
    meta: {
      title: 'AI智能评估技术详情',
      requiresAuth: false
    }
  },
  {
    path: '/competitor-features',
    name: 'CompetitorFeatures',
    component: () => import('../components/Enhanced/CompetitorInspiredFeatures.vue'),
  },
  {
    path: '/technical-architecture',
    name: 'TechnicalArchitecture',
    component: () => import('../components/Enhanced/TechnicalArchitecture.vue'),
  },
  {
    path: '/enterprise-home',
    name: 'EnterpriseHome',
    component: () => import('../components/Enhanced/EnterpriseHomePage.vue'),
  },
  {
    path: '/optimized-enterprise',
    name: 'OptimizedEnterprise',
    component: markRaw(OptimizedEnterprisePage),
    meta: {
      title: 'iFlytek Spark 企业招聘管理平台',
      requiresAuth: false
    }
  },
  {
    path: '/candidate-portal',
    name: 'CandidatePortal',
    component: () => import('../components/Enhanced/CandidatePortal.vue'),
  },
  {
    path: '/optimized-candidate',
    name: 'OptimizedCandidate',
    component: markRaw(OptimizedCandidatePage),
    meta: {
      title: 'iFlytek Spark 候选人门户',
      requiresAuth: false
    }
  },
  {
    path: '/intelligent-dashboard',
    name: 'IntelligentDashboard',
    component: () => import('../components/Enhanced/IntelligentDashboard.vue'),
  },
  {
    path: '/ai-configurator',
    name: 'AIConfigurator',
    component: () => import('../components/Enhanced/AIInterviewConfigurator.vue'),
  },
  {
    path: '/navigation-hub',
    name: 'NavigationHub',
    component: () => import('../components/Enhanced/NavigationHub.vue'),
  },
  {
    path: '/interview-selection',
    name: 'InterviewSelection',
    component: markRaw(NewInterviewSelection),
  },
  {
    path: '/old-interview-selection',
    name: 'OldInterviewSelection',
    component: markRaw(InterviewSelection),
  },
  {
    path: '/setup',
    name: 'InterviewSetup',
    component: markRaw(InterviewSetup),
  },
  {
    path: '/interviewing/:sessionId?',
    name: 'Interviewing',
    component: markRaw(InterviewingPage),
    props: true
  },
  {
    path: '/old-interviewing/:sessionId?',
    name: 'OldInterviewing',
    component: markRaw(InterviewingPage),
    props: true
  },
  {
    path: '/interview-result/:sessionId?',
    name: 'InterviewResult',
    component: markRaw(InterviewResult),
    props: true
  },
  {
    path: '/interview/:sessionId?',
    redirect: to => `/interviewing/${to.params.sessionId || ''}`
  },
  {
    path: '/interview-room/:sessionId?',
    redirect: to => `/interviewing/${to.params.sessionId || ''}`
  },
  {
    path: '/report-center',
    name: 'ReportCenter',
    component: markRaw(ReportCenter)
  },
  {
    path: '/optimized-reports',
    name: 'OptimizedReports',
    component: markRaw(OptimizedReportCenter),
    meta: {
      title: 'iFlytek Spark 报告分析中心',
      requiresAuth: false
    }
  },
  {
    path: '/layout-showcase',
    name: 'LayoutShowcase',
    component: () => import('../components/Layout/OptimizedLayoutShowcase.vue'),
    meta: {
      title: 'iFlytek Spark 优化布局展示',
      requiresAuth: false
    }
  },
  {
    path: '/layout-test',
    name: 'LayoutTest',
    component: markRaw(LayoutTestPage),
    meta: {
      title: 'iFlytek Spark 布局测试',
      requiresAuth: false
    }
  },
  {
    path: '/gradient-fade-demo',
    name: 'GradientFadeDemo',
    component: () => import('../components/Layout/GradientFadeDemo.vue'),
    meta: {
      title: 'iFlytek Spark 渐变淡出效果演示',
      requiresAuth: false
    }
  },
  {
    path: '/report/:sessionId?',
    name: 'Report',
    component: markRaw(NewReportView),
    props: true
  },
  {
    path: '/old-report/:sessionId?',
    name: 'OldReport',
    component: markRaw(ReportView),
    props: true
  },
  {
    path: '/reports/:sessionId?',
    redirect: to => `/report/${to.params.sessionId || ''}`
  },
  {
    path: '/reports',
    name: 'Reports',
    component: markRaw(ReportCenter)
  },
  {
    path: '/enterprise',
    name: 'Enterprise',
    component: () => import('../views/EnterpriseDashboard.vue')
  },
  {
    path: '/enterprise-original',
    name: 'EnterpriseOriginal',
    component: () => import('../views/EnterpriseDashboard.vue')
  },
  {
    path: '/candidate',
    name: 'Candidate',
    component: () => import('../views/CandidatePortal.vue')
  },
  // 路由重定向规则 - 解决导航冲突
  {
    path: '/candidate-portal',
    redirect: '/candidate'
  },
  {
    path: '/enterprise-home',
    redirect: '/enterprise'
  },
  {
    path: '/practice-interview',
    name: 'PracticeInterview',
    component: () => import('../views/InterviewSelection.vue'),
    meta: {
      title: '模拟面试练习',
      requiresAuth: false
    }
  },
  {
    path: '/skill-assessment',
    name: 'SkillAssessment',
    component: markRaw(SkillAssessmentPage),
    meta: {
      title: '技能分析报告',
      requiresAuth: false
    }
  },
  {
    path: '/interview-assistant',
    name: 'InterviewAssistant',
    component: () => import('../views/InterviewSelection.vue'),
    meta: {
      title: '实时面试辅助',
      requiresAuth: false
    }
  },
  {
    path: '/candidate-profile',
    name: 'CandidateProfile',
    component: () => import('../views/CandidatePortal.vue'),
    meta: {
      title: '候选人档案',
      requiresAuth: false
    }
  },
  {
    path: '/personal-settings',
    name: 'PersonalSettings',
    component: markRaw(PersonalSettingsPage),
    meta: {
      title: '个人设置',
      requiresAuth: false
    }
  },
  {
    path: '/practice-interview',
    name: 'PracticeInterview',
    component: markRaw(TextPrimaryInterviewPage),
    meta: {
      title: '模拟练习面试',
      requiresAuth: false
    }
  },
  {
    path: '/learning-path/:id',
    name: 'LearningPathDetail',
    component: markRaw(LearningPathPage),
    meta: {
      title: '学习路径详情',
      requiresAuth: false
    }
  },
  {
    path: '/settings-test',
    name: 'SettingsTest',
    component: markRaw(SettingsTestPage),
    meta: {
      title: '个人设置功能测试',
      requiresAuth: false
    }
  },
  {
    path: '/function-modification-test',
    name: 'FunctionModificationTest',
    component: markRaw(FunctionModificationTestPage),
    meta: {
      title: '功能修改验证测试',
      requiresAuth: false
    }
  },
  {
    path: '/theme-test',
    name: 'ThemeTest',
    component: markRaw(ThemeTestPage),
    meta: {
      title: '主题切换功能测试',
      requiresAuth: false
    }
  },
  {
    path: '/comprehensive-test',
    name: 'ComprehensiveTest',
    component: markRaw(ComprehensiveTestPage),
    meta: {
      title: '功能完善验证测试',
      requiresAuth: false
    }
  },
  {
    path: '/feature-test',
    name: 'FeatureTest',
    component: markRaw(FeatureTestPage),
    meta: {
      title: '功能测试页面',
      requiresAuth: false
    }
  },
  // 移除不存在的星火测试页面
  // {
  //   path: '/spark-test',
  //   name: 'SparkTest',
  //   component: markRaw(SparkTestPage),
  //   meta: {
  //     title: 'iFlytek星火大模型测试',
  //     requiresAuth: false
  //   }
  // },
  {
    path: '/pdf-test',
    name: 'PDFTest',
    component: markRaw(PDFTestPage),
    meta: {
      title: 'PDF中文字体测试',
      requiresAuth: false
    }
  },
  {
    path: '/ui-optimization-demo',
    name: 'UIOptimizationDemo',
    component: markRaw(UIOptimizationDemo),
    meta: {
      title: 'UI界面优化演示',
      requiresAuth: false
    }
  },
  // 移除不存在的星火服务测试页面
  // {
  //   path: '/spark-service-test',
  //   name: 'SparkServiceTest',
  //   component: markRaw(SparkServiceTest),
  //   meta: {
  //     title: 'iFlytek星火服务功能测试',
  //     requiresAuth: false
  //   }
  // },
  // 移除不存在的ECharts测试页面
  // {
  //   path: '/echarts-test',
  //   name: 'EChartsTest',
  //   component: markRaw(EChartsTestPage),
  //   meta: {
  //     title: 'ECharts功能测试',
  //     requiresAuth: false
  //   }
  // },
  {
    path: '/text-interview',
    name: 'TextPrimaryInterview',
    component: markRaw(TextPrimaryInterviewPage),
    meta: {
      title: '文本优先智能面试',
      requiresAuth: false
    }
  },
  {
    path: '/text-primary-interview',
    name: 'TextPrimaryInterviewAlias',
    component: markRaw(TextPrimaryInterviewPage),
    meta: {
      title: '文本优先智能面试',
      requiresAuth: false
    }
  },
  {
    path: '/voice-interview/:sessionId?',
    name: 'VoiceInterview',
    component: markRaw(VoiceInterviewPage),
    props: true,
    meta: {
      title: 'iFlytek语音专项面试',
      requiresAuth: false
    }
  },
  {
    path: '/text-based-interview/:sessionId?',
    name: 'TextBasedInterview',
    component: markRaw(TextBasedInterviewPage),
    props: true,
    meta: {
      title: 'iFlytek文字面试',
      requiresAuth: false
    }
  },
  {
    path: '/compact-text-interview/:sessionId?',
    name: 'CompactTextInterview',
    component: markRaw(CompactTextInterviewPage),
    props: true,
    meta: {
      title: 'iFlytek紧凑型文字面试',
      requiresAuth: false
    }
  },
  // 移除不存在的AI响应测试页面
  // {
  //   path: '/ai-response-test',
  //   name: 'AIResponseTest',
  //   component: markRaw(AIResponseTestPage),
  //   meta: {
  //     title: 'AI响应功能测试',
  //     requiresAuth: false
  //   }
  // },
  {
    path: '/interview-modes',
    name: 'InterviewModeSelection',
    component: markRaw(InterviewModeSelection),
    meta: {
      title: '选择面试模式',
      requiresAuth: false
    }
  },
  {
    path: '/select-interview-mode',
    name: 'InterviewModeSelector',
    component: markRaw(InterviewModeSelector),
    meta: {
      title: '选择面试模式',
      requiresAuth: false
    }
  },
  {
    path: '/learning-path/:sessionId?',
    name: 'LearningPath',
    component: markRaw(LearningPathPage),
    props: true
  },
  {
    path: '/learning-path/:id/details',
    name: 'LearningPathDetails',
    component: markRaw(LearningPathOverviewPage),
    props: true
  },
  {
    path: '/learning-path/:id/study',
    name: 'LearningPathStudy',
    component: markRaw(LearningPathDetailsPage),
    props: true
  },
  {
    path: '/learning-path/:pathId/module/:moduleId/:mode?',
    name: 'LearningModuleDetails',
    component: markRaw(LearningModuleDetailsPage),
    props: true,
    meta: {
      title: '学习模块详情',
      requiresAuth: false
    }
  },
  {
    path: '/enhanced-learning-path/:sessionId?',
    name: 'EnhancedLearningPath',
    component: markRaw(EnhancedLearningPathPage),
    props: true
  },

  {
    path: '/debug-learning-path',
    name: 'DebugLearningPath',
    component: markRaw(DebugLearningPath)
  },

  {
    path: '/status-check',
    name: 'StatusCheck',
    component: markRaw(StatusCheck)
  },

  {
    path: '/simple-home',
    name: 'SimpleHome',
    component: markRaw(CleanHomePage)
  },
  {
    path: '/branch-diagram',
    name: 'BranchDiagram',
    component: markRaw(OptimizedBranchDiagramDemo)
  },
  {
    path: '/enhanced-branch-diagram',
    name: 'EnhancedBranchDiagram',
    component: markRaw(EnhancedBranchDiagramDemo)
  },
  {
    path: '/enhanced-home',
    name: 'EnhancedHome',
    component: markRaw(EnhancedHomePage),
    meta: {
      title: '增强主页',
      requiresLoading: true,
      loadingText: '正在加载增强主页...',
      showSuccessMessage: true,
      successMessage: '欢迎使用iFlytek星火大模型智能面试系统'
    }
  },

  // 移除不存在的图表演示页面
  // {
  //   path: '/chart-demo',
  //   name: 'ChartDemo',
  //   component: markRaw(ChartDemoPage),
  //   meta: {
  //     title: '图表系统演示',
  //     requiresLoading: true,
  //     loadingText: '正在加载图表系统...',
  //     loadingSubtitle: '初始化数据可视化引擎',
  //     showSuccessMessage: true,
  //     successMessage: '图表系统已就绪'
  //   }
  // },

  // 移除不存在的竞品整合演示页面
  // {
  //   path: '/competitor-demo',
  //   name: 'CompetitorIntegrationDemo',
  //   component: markRaw(CompetitorIntegrationDemo),
  //   meta: {
  //     title: '竞品设计整合演示',
  //     requiresLoading: true,
  //     loadingTitle: '加载竞品设计整合演示',
  //     loadingSubtitle: '展示Offermore.cc和Dayee.com设计元素整合',
  //     showSuccessMessage: true,
  //     successMessage: '演示页面已准备就绪'
  //   }
  // },

  // 企业端功能路由
  {
    path: '/batch-interview-setup',
    name: 'BatchInterviewSetup',
    component: () => import('../views/BatchInterviewSetup.vue'),
    meta: {
      title: '批量创建面试',
      requiresAuth: false,
      role: 'enterprise'
    }
  },
  {
    path: '/position-management',
    name: 'PositionManagement',
    component: () => import('../views/PositionManagement.vue'),
    meta: {
      title: '职位管理',
      requiresAuth: false,
      role: 'enterprise'
    }
  },
  {
    path: '/enterprise-reports',
    name: 'EnterpriseReports',
    component: () => import('../views/EnterpriseReports.vue'),
    meta: {
      title: '数据报表',
      requiresAuth: false,
      role: 'enterprise'
    }
  },
  // 移除不存在的集成测试页面
  // {
  //   path: '/integration-test',
  //   name: 'IntegrationTest',
  //   component: markRaw(IntegrationTestPage),
  //   meta: {
  //     title: '集成测试',
  //     requiresAuth: false,
  //     role: 'developer'
  //   }
  // },
  // {
  //   path: '/route-test',
  //   name: 'RouteTest',
  //   component: () => import('../views/RouteTestPage.vue'),
  //   meta: {
  //     title: '路由测试',
  //     requiresAuth: false,
  //     role: 'developer'
  //   }
  // },
  // ResizeObserver 测试页面已移除
  // 移除不存在的首页显示测试页面
  // {
  //   path: '/homepage-display-test',
  //   name: 'HomepageDisplayTest',
  //   component: markRaw(HomepageDisplayTestPage),
  //   meta: {
  //     title: '首页显示修复验证',
  //     requiresAuth: false,
  //     role: 'developer'
  //   }
  // },
  {
    path: '/icon-test',
    name: 'IconTest',
    component: markRaw(IconTestPage),
    meta: {
      title: 'Element Plus 图标测试',
      requiresAuth: false,
      role: 'developer'
    }
  },
  // {
  //   path: '/layout-fix-verification',
  //   name: 'LayoutFixVerification',
  //   component: () => import('../views/LayoutFixVerificationPage.vue'),
  //   meta: {
  //     title: 'iFlytek 系统布局修复验证',
  //     requiresAuth: false,
  //     role: 'developer'
  //   }
  // },
  // 移除不存在的UI对齐测试页面
  // {
  //   path: '/ui-alignment-test',
  //   name: 'UIAlignmentTest',
  //   component: markRaw(UIAlignmentTestPage),
  //   meta: {
  //     title: 'UI对齐修复效果验证',
  //     requiresAuth: false,
  //     role: 'developer'
  //   }
  // },
  {
    path: '/report-enhancer-test',
    name: 'ReportEnhancerTest',
    component: ReportEnhancerTest,
    meta: {
      title: '报告中心设置悬浮按钮功能测试',
      requiresAuth: false,
      role: 'developer'
    }
  },
  {
    path: '/comprehensive-optimization-test',
    name: 'ComprehensiveOptimizationTest',
    component: ComprehensiveOptimizationTest,
    meta: {
      title: 'iFlytek Spark 面试系统优化验证',
      requiresAuth: false,
      role: 'developer'
    }
  },
  {
    path: '/system-test',
    name: 'SystemTest',
    component: markRaw(SystemTestPage),
    meta: {
      title: 'iFlytek面试系统集成测试',
      requiresAuth: false,
      role: 'developer'
    }
  },

  // AI招聘助手
  {
    path: '/ai-recruitment-assistant',
    name: 'AIRecruitmentAssistant',
    component: markRaw(AIRecruitmentAssistant),
    meta: {
      title: 'AI助手 - 招聘效率优化',
      requiresAuth: false
    }
  },
  // 技能评估考试页面
  {
    path: '/assessment-exam',
    name: 'AssessmentExam',
    component: markRaw(AssessmentExamPage),
    meta: {
      title: '技能评估考试',
      requiresAuth: false
    }
  },
  // 评估结果页面
  {
    path: '/assessment-result',
    name: 'AssessmentResult',
    component: markRaw(AssessmentResultPage),
    meta: {
      title: '评估结果',
      requiresAuth: false
    }
  },
  // 报告功能测试页面
  {
    path: '/report-test',
    name: 'ReportTest',
    component: markRaw(ReportTestPage),
    meta: {
      title: '报告功能测试',
      requiresAuth: false
    }
  },
  // 404错误处理和通用重定向
  {
    path: '/404',
    name: 'NotFound',
    component: markRaw(NotFound),
    meta: {
      title: '页面未找到',
      requiresAuth: false
    }
  },
  // 通配符路由 - 必须放在最后
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router 