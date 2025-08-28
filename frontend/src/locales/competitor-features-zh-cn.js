/**
 * 🌏 竞品功能中文本地化配置
 * 基于面试猫、用友大易、海纳AI的功能特性进行中文优化
 */

export const competitorFeaturesLocale = {
  // 面试猫功能本地化
  offermore: {
    name: '面试猫功能集成',
    description: '实时AI辅助面试系统',
    features: {
      realTimeAssistance: {
        title: '实时AI辅助',
        description: '基于iFlytek Spark的智能面试辅助功能',
        status: {
          active: '辅助中',
          inactive: '未启用',
          starting: '正在启动...',
          stopping: '正在停止...'
        },
        actions: {
          start: '启动辅助',
          stop: '停止辅助',
          configure: '配置设置'
        },
        notifications: {
          started: '实时AI辅助已启动，正在监听您的语音',
          stopped: '实时AI辅助已停止',
          error: '启动失败，请检查浏览器权限设置',
          noSupport: '您的浏览器不支持语音识别功能'
        }
      },
      speechRecognition: {
        title: '语音识别',
        description: '实时语音转文字功能',
        accuracy: '识别准确率',
        languages: '支持语言',
        settings: {
          sensitivity: '灵敏度',
          noiseReduction: '降噪处理',
          autoStop: '自动停止'
        }
      },
      intelligentSuggestions: {
        title: '智能建议',
        description: 'AI分析面试内容，提供专业建议',
        types: {
          followUp: '追问建议',
          evaluation: '评估要点',
          technical: '技术深度',
          behavioral: '行为分析'
        },
        suggestions: [
          '建议深入了解候选人的项目经验和技术细节',
          '可以询问具体的技术实现方案和架构设计',
          '关注候选人的团队协作能力和沟通技巧',
          '评估候选人的学习能力和技术发展潜力',
          '了解候选人对新技术的接受度和适应性',
          '询问候选人在项目中遇到的挑战及解决方案'
        ]
      }
    }
  },

  // 用友大易功能本地化
  dayee: {
    name: '用友大易功能集成',
    description: '企业级面试流程管理系统',
    features: {
      antiCheating: {
        title: '智能防作弊系统',
        description: '确保面试过程的公平性和真实性',
        components: {
          faceRecognition: {
            title: '人脸识别验证',
            description: '实时人脸检测和身份验证',
            status: {
              detecting: '正在检测',
              verified: '身份已验证',
              failed: '验证失败',
              warning: '检测异常'
            }
          },
          behaviorDetection: {
            title: '行为异常检测',
            description: '监测切屏、多窗口等异常行为',
            alerts: {
              screenSwitch: '检测到切换屏幕',
              multiWindow: '检测到多窗口操作',
              suspiciousActivity: '检测到可疑活动',
              environmentChange: '环境发生变化'
            }
          },
          environmentMonitoring: {
            title: '环境安全检查',
            description: '确保面试环境无第三方干扰',
            checks: {
              lighting: '光线检查',
              background: '背景检查',
              noise: '噪音检测',
              interference: '干扰检测'
            }
          }
        },
        notifications: {
          systemStarted: '防作弊系统已启动，正在监控面试环境',
          systemStopped: '防作弊监控已停止',
          alertGenerated: '安全警告：{message}',
          verificationSuccess: '身份验证成功',
          verificationFailed: '身份验证失败，请重新验证'
        }
      },
      enterpriseWorkflow: {
        title: '企业级工作流程',
        description: '标准化的面试流程管理',
        steps: {
          1: '简历筛选',
          2: '智能出题',
          3: '在线面试',
          4: '生成报告'
        },
        stepDescriptions: {
          1: '基于AI算法自动筛选符合要求的简历',
          2: '根据岗位要求和候选人背景智能生成面试题目',
          3: '进行多模态在线面试，实时评估候选人能力',
          4: '生成详细的面试评估报告和录用建议'
        },
        status: {
          pending: '待处理',
          inProgress: '进行中',
          completed: '已完成',
          failed: '失败'
        }
      }
    }
  },

  // 海纳AI功能本地化
  hina: {
    name: '海纳AI功能集成',
    description: '数据驱动的智能招聘解决方案',
    features: {
      dataDriven: {
        title: '数据驱动决策',
        description: '基于大数据分析提供科学的招聘决策',
        metrics: {
          interviews: '累计面试场次',
          accuracy: 'AI评估准确率',
          companies: '服务企业数量',
          satisfaction: '用户满意度',
          candidates: '候选人数量',
          successRate: '录用成功率'
        },
        insights: {
          trendAnalysis: '趋势分析',
          performanceMetrics: '性能指标',
          benchmarking: '行业对比',
          predictiveAnalysis: '预测分析'
        }
      },
      scenarioBasedSolutions: {
        title: '场景化解决方案',
        description: '针对不同招聘场景的专业解决方案',
        scenarios: {
          campus: {
            name: '校园招聘',
            description: '面向应届毕业生的招聘解决方案',
            features: [
              '批量面试管理',
              '学生群体适配',
              '潜力评估模型',
              '校园宣讲支持'
            ]
          },
          social: {
            name: '社会招聘',
            description: '面向有工作经验人员的招聘方案',
            features: [
              '经验技能评估',
              '专业能力测试',
              '团队协作评估',
              '职业发展规划'
            ]
          },
          technical: {
            name: '技术人才招聘',
            description: '专门针对技术岗位的招聘解决方案',
            features: [
              '技术深度考察',
              '编程能力测试',
              '项目经验评估',
              '技术架构设计'
            ]
          },
          executive: {
            name: '高管招聘',
            description: '面向高级管理人员的招聘方案',
            features: [
              '领导力评估',
              '战略思维测试',
              '管理经验分析',
              '文化匹配度'
            ]
          }
        }
      },
      technicalShowcase: {
        title: '技术架构展示',
        description: '透明化的技术实现和架构设计',
        components: {
          architectureDiagram: '架构图',
          performanceMetrics: '性能指标',
          comparisonAnalysis: '对比分析',
          caseStudies: '案例研究'
        },
        layers: {
          application: '应用层',
          service: 'AI服务层',
          infrastructure: '基础设施层'
        }
      }
    }
  },

  // 系统集成本地化
  integration: {
    title: '竞品功能集成管理',
    description: '统一管理和控制所有竞品功能',
    status: {
      enabled: '已启用',
      disabled: '已禁用',
      configuring: '配置中',
      error: '错误'
    },
    actions: {
      enableAll: '启用所有功能',
      disableAll: '禁用所有功能',
      configure: '配置设置',
      viewReport: '查看报告',
      exportData: '导出数据'
    },
    notifications: {
      allEnabled: '所有竞品功能已成功启用',
      allDisabled: '所有竞品功能已禁用',
      integrationComplete: '竞品功能集成完成',
      configurationSaved: '配置已保存',
      reportGenerated: '报告已生成'
    },
    reports: {
      title: '集成状态报告',
      summary: '概要信息',
      details: '详细信息',
      performance: '性能分析',
      recommendations: '优化建议'
    }
  },

  // 性能监控本地化
  monitoring: {
    title: '系统性能监控',
    description: '实时监控系统性能和用户体验',
    metrics: {
      loadTime: '页面加载时间',
      memoryUsage: '内存使用量',
      apiResponseTime: 'API响应时间',
      renderTime: '渲染时间',
      fps: '渲染帧率',
      errorRate: '错误率'
    },
    status: {
      monitoring: '监控中',
      stopped: '已停止',
      warning: '警告',
      error: '错误',
      normal: '正常'
    },
    alerts: {
      highMemoryUsage: '内存使用过高',
      slowResponse: 'API响应缓慢',
      longLoadTime: '页面加载时间过长',
      lowFps: '渲染帧率过低'
    },
    suggestions: {
      enableLazyLoading: '启用组件懒加载',
      optimizeImages: '优化图片资源',
      enableCdn: '启用CDN加速',
      cacheOptimization: '优化缓存策略',
      codeOptimization: '代码优化',
      databaseOptimization: '数据库优化'
    }
  },

  // 通用术语本地化
  common: {
    actions: {
      start: '开始',
      stop: '停止',
      pause: '暂停',
      resume: '继续',
      reset: '重置',
      save: '保存',
      cancel: '取消',
      confirm: '确认',
      apply: '应用',
      dismiss: '忽略'
    },
    status: {
      active: '活跃',
      inactive: '非活跃',
      pending: '待处理',
      processing: '处理中',
      completed: '已完成',
      failed: '失败',
      success: '成功',
      warning: '警告',
      error: '错误'
    },
    time: {
      seconds: '秒',
      minutes: '分钟',
      hours: '小时',
      days: '天',
      weeks: '周',
      months: '月',
      years: '年'
    },
    units: {
      ms: '毫秒',
      mb: 'MB',
      gb: 'GB',
      fps: '帧/秒',
      percent: '%',
      count: '次'
    }
  }
}

// 导出默认配置
export default competitorFeaturesLocale
