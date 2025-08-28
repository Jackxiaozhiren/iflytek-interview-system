/**
 * iFlytek星火大模型服务验证工具
 * 用于验证服务增强功能是否正常工作
 */

import enhancedIflytekSparkService from '@/services/enhancedIflytekSparkService'

/**
 * 验证服务基础配置
 */
export function validateServiceConfiguration() {
  const results = {
    success: true,
    errors: [],
    warnings: [],
    details: {}
  }

  try {
    // 检查基础配置
    if (!enhancedIflytekSparkService.config) {
      results.errors.push('服务配置对象不存在')
      results.success = false
    } else {
      results.details.config = {
        hasApiVersion: !!enhancedIflytekSparkService.config.apiVersion,
        hasBaseUrl: !!enhancedIflytekSparkService.config.baseUrl,
        enterpriseMode: !!enhancedIflytekSparkService.config.enterpriseMode,
        batchProcessing: !!enhancedIflytekSparkService.config.batchProcessing,
        realTimeAssistant: !!enhancedIflytekSparkService.config.realTimeAssistant
      }
    }

    // 检查面试模式配置
    if (!enhancedIflytekSparkService.interviewModes) {
      results.errors.push('面试模式配置不存在')
      results.success = false
    } else {
      const modes = enhancedIflytekSparkService.interviewModes
      results.details.interviewModes = {
        hasTechnical: !!modes.technical,
        hasBehavioral: !!modes.behavioral,
        hasComprehensive: !!modes.comprehensive,
        hasEnterprise: !!modes.enterprise // 新增的企业级模式
      }
    }

    // 检查AI能力配置
    if (!enhancedIflytekSparkService.capabilities) {
      results.errors.push('AI能力配置不存在')
      results.success = false
    } else {
      const capabilities = enhancedIflytekSparkService.capabilities
      results.details.capabilities = {
        hasTextAnalysis: !!capabilities.textAnalysis,
        hasSpeechAssistant: !!capabilities.speechAssistant,
        hasIntelligentAssistant: !!capabilities.intelligentAssistant,
        textAnalysisWeight: capabilities.textAnalysis?.weight,
        speechAssistantWeight: capabilities.speechAssistant?.weight,
        intelligentAssistantWeight: capabilities.intelligentAssistant?.weight
      }
    }

    // 检查企业级管理功能
    if (!enhancedIflytekSparkService.enterpriseManagement) {
      results.errors.push('企业级管理功能配置不存在')
      results.success = false
    } else {
      const enterprise = enhancedIflytekSparkService.enterpriseManagement
      results.details.enterpriseManagement = {
        hasBatchProcessing: !!enterprise.batchProcessing,
        hasOrganizationManagement: !!enterprise.organizationManagement,
        hasHrIntegration: !!enterprise.hrIntegration,
        hasQualityControl: !!enterprise.qualityControl
      }
    }

    // 检查数据分析功能
    if (!enhancedIflytekSparkService.dataAnalytics) {
      results.errors.push('数据分析功能配置不存在')
      results.success = false
    } else {
      const analytics = enhancedIflytekSparkService.dataAnalytics
      results.details.dataAnalytics = {
        hasRealTimeMetrics: !!analytics.realTimeMetrics,
        hasPredictiveAnalytics: !!analytics.predictiveAnalytics,
        hasBenchmarkingSystem: !!analytics.benchmarkingSystem
      }
    }

    // 检查专业领域配置
    if (!enhancedIflytekSparkService.professionalDomains) {
      results.errors.push('专业领域配置不存在')
      results.success = false
    } else {
      const domains = enhancedIflytekSparkService.professionalDomains
      results.details.professionalDomains = {
        hasAI: !!domains.ai,
        hasBigData: !!domains.bigdata,
        hasIoT: !!domains.iot,
        aiHasIndustryApplications: !!domains.ai?.industryApplications,
        bigdataHasCompetencyLevels: !!domains.bigdata?.competencyLevels,
        iotHasBusinessImpactMetrics: !!domains.iot?.businessImpactMetrics
      }
    }

  } catch (error) {
    results.errors.push(`配置验证过程中发生错误: ${error.message}`)
    results.success = false
  }

  return results
}

/**
 * 验证服务方法是否存在
 */
export function validateServiceMethods() {
  const results = {
    success: true,
    errors: [],
    warnings: [],
    methods: {}
  }

  const requiredMethods = [
    'initializeInterviewSession',
    'analyzeTextPrimary',
    'generateNextQuestion',
    'provideRealTimeAssistance', // 增强的实时助手
    'processBatchInterviews', // 新增的批量处理
    'generateDataDrivenInsights', // 新增的数据洞察
    'processVoiceInput',
    'generateSessionId',
    'generateBatchId' // 新增的批次ID生成
  ]

  requiredMethods.forEach(methodName => {
    const methodExists = typeof enhancedIflytekSparkService[methodName] === 'function'
    results.methods[methodName] = methodExists
    
    if (!methodExists) {
      results.errors.push(`缺少必需的方法: ${methodName}`)
      results.success = false
    }
  })

  return results
}

/**
 * 验证新增功能的配置完整性
 */
export function validateEnhancedFeatures() {
  const results = {
    success: true,
    errors: [],
    warnings: [],
    features: {}
  }

  try {
    // 验证实时智能助手增强功能
    const intelligentAssistant = enhancedIflytekSparkService.capabilities?.intelligentAssistant
    if (intelligentAssistant) {
      results.features.intelligentAssistant = {
        hasIntelligentSuggestions: !!intelligentAssistant.features?.intelligentSuggestions,
        hasAnswerStructureGuidance: !!intelligentAssistant.features?.answerStructureGuidance,
        hasKeyPointReminders: !!intelligentAssistant.features?.keyPointReminders,
        hasTimeManagementAlerts: !!intelligentAssistant.features?.timeManagementAlerts,
        hasConfidenceBooster: !!intelligentAssistant.features?.confidenceBooster,
        hasStressReductionSupport: !!intelligentAssistant.features?.stressReductionSupport
      }
    } else {
      results.errors.push('智能助手配置不存在')
      results.success = false
    }

    // 验证语音助手增强功能
    const speechAssistant = enhancedIflytekSparkService.capabilities?.speechAssistant
    if (speechAssistant) {
      results.features.speechAssistant = {
        hasRealTimeTranscription: !!speechAssistant.features?.realTimeTranscription,
        hasVoiceEmotionAnalysis: !!speechAssistant.features?.voiceEmotionAnalysis,
        hasSpeechPatternRecognition: !!speechAssistant.features?.speechPatternRecognition,
        hasAdaptiveListening: !!speechAssistant.features?.adaptiveListening,
        hasContextualVoiceAnalysis: !!speechAssistant.features?.contextualVoiceAnalysis
      }
    } else {
      results.errors.push('语音助手配置不存在')
      results.success = false
    }

    // 验证文本分析增强功能
    const textAnalysis = enhancedIflytekSparkService.capabilities?.textAnalysis
    if (textAnalysis) {
      results.features.textAnalysis = {
        hasBusinessContextAnalysis: !!textAnalysis.features?.businessContextAnalysis,
        hasRoleSpecificEvaluation: !!textAnalysis.features?.roleSpecificEvaluation,
        hasCompetencyMapping: !!textAnalysis.features?.competencyMapping,
        hasPotentialAssessment: !!textAnalysis.features?.potentialAssessment,
        hasSemanticAnalysis: !!textAnalysis.features?.semanticAnalysis,
        hasInnovativeThinking: !!textAnalysis.features?.innovativeThinking
      }
    } else {
      results.errors.push('文本分析配置不存在')
      results.success = false
    }

    // 验证企业级面试模式
    const enterpriseMode = enhancedIflytekSparkService.interviewModes?.enterprise
    if (enterpriseMode) {
      results.features.enterpriseMode = {
        hasEnterpriseFeatures: !!enterpriseMode.enterpriseFeatures,
        hasRoleBasedAssessment: !!enterpriseMode.enterpriseFeatures?.roleBasedAssessment,
        hasOrganizationalFitAnalysis: !!enterpriseMode.enterpriseFeatures?.organizationalFitAnalysis,
        hasBusinessImpactEvaluation: !!enterpriseMode.enterpriseFeatures?.businessImpactEvaluation,
        hasLongTermPotentialAssessment: !!enterpriseMode.enterpriseFeatures?.longTermPotentialAssessment
      }
    } else {
      results.warnings.push('企业级面试模式配置不存在')
    }

  } catch (error) {
    results.errors.push(`增强功能验证过程中发生错误: ${error.message}`)
    results.success = false
  }

  return results
}

/**
 * 执行完整的服务验证
 */
export async function validateCompleteService() {
  const results = {
    timestamp: new Date().toISOString(),
    overall: { success: true, errors: [], warnings: [] },
    configuration: null,
    methods: null,
    enhancedFeatures: null
  }

  try {
    // 验证配置
    results.configuration = validateServiceConfiguration()
    if (!results.configuration.success) {
      results.overall.success = false
      results.overall.errors.push(...results.configuration.errors)
    }
    results.overall.warnings.push(...results.configuration.warnings)

    // 验证方法
    results.methods = validateServiceMethods()
    if (!results.methods.success) {
      results.overall.success = false
      results.overall.errors.push(...results.methods.errors)
    }
    results.overall.warnings.push(...results.methods.warnings)

    // 验证增强功能
    results.enhancedFeatures = validateEnhancedFeatures()
    if (!results.enhancedFeatures.success) {
      results.overall.success = false
      results.overall.errors.push(...results.enhancedFeatures.errors)
    }
    results.overall.warnings.push(...results.enhancedFeatures.warnings)

    // 生成总结
    results.summary = {
      totalErrors: results.overall.errors.length,
      totalWarnings: results.overall.warnings.length,
      configurationValid: results.configuration.success,
      methodsValid: results.methods.success,
      enhancedFeaturesValid: results.enhancedFeatures.success,
      serviceReady: results.overall.success
    }

  } catch (error) {
    results.overall.success = false
    results.overall.errors.push(`完整验证过程中发生错误: ${error.message}`)
  }

  return results
}

export default {
  validateServiceConfiguration,
  validateServiceMethods,
  validateEnhancedFeatures,
  validateCompleteService
}
