/**
 * 中文本地化配置
 * 多模态智能面试评估系统专用中文文案
 * 集成竞品分析功能的中文本地化
 */

// 引入竞品功能中文本地化配置
import { competitorFeaturesLocale } from './competitor-features-zh-cn'

// 系统通用文案
export const common = {
  // 基础操作
  confirm: '确认',
  cancel: '取消',
  save: '保存',
  delete: '删除',
  edit: '编辑',
  add: '添加',
  search: '搜索',
  reset: '重置',
  submit: '提交',
  back: '返回',
  next: '下一步',
  previous: '上一步',
  finish: '完成',
  close: '关闭',
  
  // 状态文案
  loading: '加载中...',
  success: '操作成功',
  error: '操作失败',
  warning: '警告',
  info: '提示',
  
  // 时间相关
  today: '今天',
  yesterday: '昨天',
  thisWeek: '本周',
  thisMonth: '本月',
  
  // 数据状态
  noData: '暂无数据',
  loadMore: '加载更多',
  refresh: '刷新',
  
  // 文件操作
  upload: '上传',
  download: '下载',
  preview: '预览',
  
  // 权限相关
  unauthorized: '无权限访问',
  loginRequired: '请先登录',
  
  // 网络状态
  networkError: '网络连接异常',
  timeout: '请求超时',
  serverError: '服务器错误'
};

// 面试系统专用文案
export const interview = {
  // 面试流程
  startInterview: '开始面试',
  endInterview: '结束面试',
  pauseInterview: '暂停面试',
  resumeInterview: '继续面试',
  
  // 技术领域
  domains: {
    ai: '人工智能',
    bigdata: '大数据',
    iot: '物联网',
    frontend: '前端开发',
    backend: '后端开发',
    mobile: '移动开发',
    devops: '运维开发'
  },
  
  // 岗位类型
  positions: {
    engineer: '工程师',
    senior: '高级工程师',
    lead: '技术负责人',
    architect: '架构师',
    manager: '技术经理',
    intern: '实习生'
  },
  
  // 面试模式
  modes: {
    text: '文本面试',
    voice: '语音面试',
    video: '视频面试',
    multimodal: '多模态面试'
  },
  
  // 难度等级
  difficulty: {
    beginner: '入门级',
    intermediate: '中级',
    advanced: '高级',
    expert: '专家级'
  },
  
  // 面试状态
  status: {
    waiting: '等待开始',
    inProgress: '进行中',
    paused: '已暂停',
    completed: '已完成',
    cancelled: '已取消'
  },
  
  // 评估维度
  capabilities: {
    technical: '技术能力',
    communication: '沟通表达',
    logic: '逻辑思维',
    innovation: '创新能力',
    teamwork: '团队协作',
    learning: '学习能力'
  }
};

// 多媒体相关文案
export const media = {
  // 视频控制
  play: '播放',
  pause: '暂停',
  stop: '停止',
  mute: '静音',
  unmute: '取消静音',
  fullscreen: '全屏',
  exitFullscreen: '退出全屏',
  pictureInPicture: '画中画',
  
  // 视频质量
  quality: {
    auto: '自动',
    '1080p': '超清 1080p',
    '720p': '高清 720p',
    '480p': '标清 480p',
    '360p': '流畅 360p'
  },
  
  // 播放速度
  speed: {
    '0.5': '0.5倍速',
    '0.75': '0.75倍速',
    '1': '正常速度',
    '1.25': '1.25倍速',
    '1.5': '1.5倍速',
    '2': '2倍速'
  },
  
  // 字幕
  subtitles: '字幕',
  enableSubtitles: '开启字幕',
  disableSubtitles: '关闭字幕',
  
  // 录制
  startRecording: '开始录制',
  stopRecording: '停止录制',
  recording: '录制中',
  recordingTime: '录制时长',
  
  // 设备检测
  deviceCheck: '设备检测',
  cameraPermission: '摄像头权限',
  microphonePermission: '麦克风权限',
  deviceReady: '设备就绪',
  deviceError: '设备异常'
};

// AI相关文案 - 增强版本
export const ai = {
  // iFlytek Spark 核心
  sparkModel: 'iFlytek星火大模型',
  aiInterviewer: 'AI智能面试官',
  aiAnalysis: 'AI智能分析',
  aiRecommendation: 'AI智能推荐',
  sparkPowered: '星火大模型驱动',

  // 核心技术
  deepLearning: '深度学习',
  neuralNetwork: '神经网络',
  machineLearning: '机器学习',
  naturalLanguageProcessing: '自然语言处理',
  computerVision: '计算机视觉',
  speechRecognition: '语音识别',
  largeLanguageModel: '大语言模型',
  transformerArchitecture: 'Transformer架构',

  // 分析状态
  analyzing: 'AI分析中...',
  analysisComplete: 'AI分析完成',
  analysisError: 'AI分析失败',
  processingData: '正在处理数据...',
  generatingReport: '正在生成报告...',
  optimizingModel: '正在优化模型...',
  calibratingAlgorithm: '正在校准算法...',

  // 智能功能
  smartQuestion: '智能提问',
  realTimeAnalysis: '实时智能分析',
  multimodalFusion: '多模态数据融合',
  personalizedRecommendation: '个性化推荐',
  contextualUnderstanding: '上下文理解',
  semanticAnalysis: '语义分析',
  emotionalIntelligence: '情感智能',
  adaptiveLearning: '自适应学习',

  // 技术优势
  highAccuracy: '高准确率',
  realTimeProcessing: '实时处理',
  multiLanguageSupport: '多语言支持',
  continuousLearning: '持续学习',
  scalableArchitecture: '可扩展架构',
  robustPerformance: '稳健性能',
  lowLatency: '低延迟响应',

  // 评估结果
  excellent: '优秀',
  good: '良好',
  average: '中等',
  needImprovement: '待提升',
  outstanding: '卓越',
  belowAverage: '偏低',

  // 评估维度
  technicalProficiency: '技术熟练度',
  problemSolvingAbility: '问题解决能力',
  communicationSkills: '沟通表达能力',
  innovativeThinking: '创新思维能力',
  learningAgility: '学习敏捷性',
  stressResilience: '抗压适应能力',

  // 建议类型
  technicalAdvice: '技术能力建议',
  communicationAdvice: '沟通表达建议',
  learningPath: '个性化学习路径',
  careerGuidance: '职业发展指导',
  skillImprovement: '技能提升方案',
  performanceOptimization: '表现优化建议',

  // 应用场景
  interviewAssessment: '面试智能评估',
  skillEvaluation: '技能水平评估',
  performanceAnalysis: '表现深度分析',
  talentSelection: '人才智能选拔',
  competencyMapping: '能力全景画像',
  learningPathOptimization: '学习路径优化'
};

// 报告相关文案
export const report = {
  // 报告类型
  overallReport: '综合报告',
  detailedReport: '详细报告',
  comparisonReport: '对比报告',
  progressReport: '进度报告',
  
  // 报告部分
  executiveSummary: '执行摘要',
  capabilityAssessment: '能力评估',
  behaviorAnalysis: '行为分析',
  improvementSuggestions: '改进建议',
  learningRecommendations: '学习推荐',
  
  // 图表类型
  radarChart: '雷达图',
  barChart: '柱状图',
  lineChart: '折线图',
  pieChart: '饼图',
  heatmap: '热力图',
  
  // 数据指标
  score: '得分',
  rank: '排名',
  percentile: '百分位',
  improvement: '提升幅度',
  benchmark: '基准对比',
  
  // 导出功能
  exportPDF: '导出PDF',
  exportWord: '导出Word',
  exportExcel: '导出Excel',
  shareReport: '分享报告'
};

// 演示页面文案 - 增强版本
export const demo = {
  // 页面标题
  systemDemo: '多模态智能面试评测系统演示',
  featureShowcase: '核心功能全景展示',
  technicalDemo: '技术架构深度演示',
  interactiveDemo: '交互式体验演示',

  // 演示类型
  quickStart: '快速体验',
  fullDemo: '完整功能演示',
  featureDemo: '分模块功能演示',
  technicalDeepDive: '技术架构深度解析',
  realTimeDemo: '实时交互演示',
  scenarioDemo: '场景化应用演示',

  // 演示控制
  playDemo: '开始演示',
  pauseDemo: '暂停演示',
  restartDemo: '重新演示',
  skipStep: '跳过当前步骤',
  nextStep: '下一步骤',
  previousStep: '上一步骤',
  fullScreen: '全屏演示',
  exitFullScreen: '退出全屏',

  // 演示内容
  systemOverview: '系统全景概览',
  coreFeatures: '六大核心功能',
  aiCapabilities: 'iFlytek星火AI能力',
  multimodalAnalysis: '多模态智能分析',
  realTimeEvaluation: '实时评估体验',
  reportGeneration: '智能报告生成',

  // 技术展示
  architectureOverview: '技术架构总览',
  frontendTech: '前端技术栈',
  backendTech: '后端技术栈',
  aiIntegration: 'AI服务集成',
  dataFlow: '数据流转过程',
  performanceMetrics: '性能指标展示',

  // 交互元素
  clickToExplore: '点击探索',
  hoverForDetails: '悬停查看详情',
  dragToNavigate: '拖拽导航',
  scrollToDiscover: '滚动发现更多',

  // 演示状态
  demoLoading: '演示加载中...',
  demoReady: '演示准备就绪',
  demoInProgress: '演示进行中',
  demoCompleted: '演示已完成',
  demoError: '演示出现错误',

  // 用户引导
  welcomeMessage: '欢迎体验多模态智能面试评测系统',
  getStarted: '开始探索之旅',
  exploreFeatures: '探索强大功能',
  tryItYourself: '亲自体验',
  learnMore: '了解更多',

  // 功能亮点
  intelligentQA: '智能问答系统',
  multimodalInput: '多模态输入支持',
  realTimeAnalysis: '实时智能分析',
  comprehensiveEvaluation: '全面能力评估',
  personalizedRecommendation: '个性化推荐',
  professionalReporting: '专业报告生成',
  userExperience: '用户体验',

  // 交互提示
  clickToExplore: '点击探索',
  hoverForDetails: '悬停查看详情',
  dragToInteract: '拖拽交互',
  scrollToNavigate: '滚动导航'
};

// 错误信息文案
export const errors = {
  // 网络错误
  networkUnavailable: '网络不可用，请检查网络连接',
  requestTimeout: '请求超时，请稍后重试',
  serverUnavailable: '服务器暂时不可用',
  
  // 权限错误
  accessDenied: '访问被拒绝',
  insufficientPermissions: '权限不足',
  sessionExpired: '会话已过期，请重新登录',
  
  // 数据错误
  dataNotFound: '数据不存在',
  dataCorrupted: '数据已损坏',
  invalidFormat: '格式不正确',
  
  // 设备错误
  cameraNotFound: '未检测到摄像头',
  microphoneNotFound: '未检测到麦克风',
  deviceBusy: '设备正在被其他应用使用',
  
  // AI服务错误
  aiServiceUnavailable: 'AI服务暂时不可用',
  analysisTimeout: '分析超时，请重试',
  modelLoadError: '模型加载失败'
};

// 成功信息文案
export const success = {
  // 操作成功
  saveSuccess: '保存成功',
  uploadSuccess: '上传成功',
  deleteSuccess: '删除成功',
  updateSuccess: '更新成功',
  
  // 面试相关
  interviewStarted: '面试已开始',
  interviewCompleted: '面试已完成',
  analysisCompleted: '分析已完成',
  reportGenerated: '报告已生成',
  
  // 设备相关
  deviceConnected: '设备连接成功',
  permissionGranted: '权限授予成功',
  recordingStarted: '录制已开始',
  recordingStopped: '录制已停止'
};

// 导出所有文案
export default {
  common,
  interview,
  media,
  ai,
  report,
  demo,
  errors,
  success,
  // 集成竞品功能本地化
  competitor: competitorFeaturesLocale
};
