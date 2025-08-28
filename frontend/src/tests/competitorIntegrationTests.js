/**
 * 🧪 竞品功能集成测试套件
 * 验证面试猫、用友大易、海纳AI功能集成的稳定性和性能
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ElMessage, ElNotification } from 'element-plus'
import { nextTick } from 'vue'

// 导入测试组件
import CompetitorInspiredFeatures from '../components/Enhanced/CompetitorInspiredFeatures.vue'
import TechnicalArchitecture from '../components/Enhanced/TechnicalArchitecture.vue'
import SystemPerformanceMonitor from '../components/Enhanced/SystemPerformanceMonitor.vue'
import BrandConsistencyChecker from '../components/Enhanced/BrandConsistencyChecker.vue'

// 导入服务和工具
import competitorOptimizer from '../services/competitorAnalysisOptimizer'
import { useIntelligentFeatures } from '../composables/useIntelligentFeatures'
import iflytekBrandConsistency from '../utils/iflytekBrandConsistency'

describe('竞品功能集成测试', () => {
  let mockConsole

  beforeEach(() => {
    // 模拟控制台输出
    mockConsole = {
      log: vi.fn(),
      warn: vi.fn(),
      error: vi.fn()
    }
    global.console = mockConsole
  })

  afterEach(() => {
    // 清理模拟
    vi.clearAllMocks()
  })

  describe('实时辅助功能集成测试', () => {
    it('应该正确初始化实时AI辅助功能', async () => {
      const { isRealTimeAssistanceActive, speechRecognitionSupported, currentSuggestion, assistanceHistory } = useIntelligentFeatures()

      expect(isRealTimeAssistanceActive.value).toBe(false)
      expect(speechRecognitionSupported.value).toBe(false)
      expect(currentSuggestion.value).toBe('')
      expect(assistanceHistory.value).toEqual([])
    })

    it('应该能够启动和停止实时辅助', async () => {
      const { offerMoreFeatures } = useCompetitorFeatures()
      
      // 模拟浏览器支持语音识别
      global.window = {
        webkitSpeechRecognition: class MockSpeechRecognition {}
      }
      
      offerMoreFeatures.startRealTimeAssistance()
      expect(offerMoreFeatures.isRealTimeAssistanceActive.value).toBe(true)
      
      offerMoreFeatures.stopRealTimeAssistance()
      expect(offerMoreFeatures.isRealTimeAssistanceActive.value).toBe(false)
    })

    it('应该能够生成智能建议', async () => {
      const { offerMoreFeatures } = useCompetitorFeatures()
      
      const context = '技术面试'
      offerMoreFeatures.generateSuggestion(context)
      
      expect(offerMoreFeatures.currentSuggestion.value).not.toBe('')
      expect(offerMoreFeatures.assistanceHistory.value).toHaveLength(1)
      expect(offerMoreFeatures.assistanceHistory.value[0].context).toBe(context)
    })
  })

  describe('用友大易功能集成测试', () => {
    it('应该正确初始化防作弊系统', async () => {
      const { dayeeFeatures } = useCompetitorFeatures()
      
      expect(dayeeFeatures.antiCheatStatus.faceRecognition).toBe(false)
      expect(dayeeFeatures.antiCheatStatus.behaviorDetection).toBe(false)
      expect(dayeeFeatures.antiCheatStatus.environmentMonitoring).toBe(false)
      expect(dayeeFeatures.antiCheatStatus.alerts).toEqual([])
    })

    it('应该能够启动和停止防作弊监控', async () => {
      const { dayeeFeatures } = useCompetitorFeatures()
      
      dayeeFeatures.startAntiCheatMonitoring()
      expect(dayeeFeatures.antiCheatStatus.faceRecognition).toBe(true)
      expect(dayeeFeatures.antiCheatStatus.behaviorDetection).toBe(true)
      expect(dayeeFeatures.antiCheatStatus.environmentMonitoring).toBe(true)
      
      dayeeFeatures.stopAntiCheatMonitoring()
      expect(dayeeFeatures.antiCheatStatus.faceRecognition).toBe(false)
      expect(dayeeFeatures.antiCheatStatus.behaviorDetection).toBe(false)
      expect(dayeeFeatures.antiCheatStatus.environmentMonitoring).toBe(false)
    })

    it('应该能够添加安全警告', async () => {
      const { dayeeFeatures } = useCompetitorFeatures()
      
      const alertType = 'screenSwitch'
      const alertMessage = '检测到切换屏幕'
      
      dayeeFeatures.addSecurityAlert(alertType, alertMessage)
      
      expect(dayeeFeatures.antiCheatStatus.alerts).toHaveLength(1)
      expect(dayeeFeatures.antiCheatStatus.alerts[0].type).toBe(alertType)
      expect(dayeeFeatures.antiCheatStatus.alerts[0].message).toBe(alertMessage)
    })

    it('应该正确管理工作流程步骤', async () => {
      const { dayeeFeatures } = useCompetitorFeatures()
      
      expect(dayeeFeatures.workflowStatus.currentStep).toBe(1)
      expect(dayeeFeatures.getCurrentStepInfo.value.name).toBe('筛选简历')
      
      dayeeFeatures.updateWorkflowStep(2)
      expect(dayeeFeatures.workflowStatus.currentStep).toBe(2)
      expect(dayeeFeatures.getCurrentStepInfo.value.name).toBe('智能出题')
      expect(dayeeFeatures.workflowStatus.completed).toContain(1)
    })
  })

  describe('海纳AI功能集成测试', () => {
    it('应该正确初始化数据驱动功能', async () => {
      const { hinaFeatures } = useCompetitorFeatures()
      
      expect(hinaFeatures.performanceMetrics.interviews).toBe(0)
      expect(hinaFeatures.performanceMetrics.accuracy).toBe(0)
      expect(hinaFeatures.performanceMetrics.companies).toBe(0)
      expect(hinaFeatures.performanceMetrics.satisfaction).toBe(0)
    })

    it('应该能够更新性能指标', async () => {
      const { hinaFeatures } = useCompetitorFeatures()
      
      const newMetrics = {
        interviews: 500,
        accuracy: 98.5,
        companies: 1000,
        satisfaction: 95
      }
      
      hinaFeatures.updateMetrics(newMetrics)
      
      expect(hinaFeatures.performanceMetrics.interviews).toBe(500)
      expect(hinaFeatures.performanceMetrics.accuracy).toBe(98.5)
      expect(hinaFeatures.performanceMetrics.companies).toBe(1000)
      expect(hinaFeatures.performanceMetrics.satisfaction).toBe(95)
    })

    it('应该能够激活和停用场景', async () => {
      const { hinaFeatures } = useCompetitorFeatures()
      
      hinaFeatures.activateScenario('campus')
      expect(hinaFeatures.scenarioData.campus.active).toBe(true)
      
      hinaFeatures.deactivateScenario('campus')
      expect(hinaFeatures.scenarioData.campus.active).toBe(false)
    })

    it('应该能够生成数据报告', async () => {
      const { hinaFeatures } = useCompetitorFeatures()
      
      hinaFeatures.updateMetrics({ interviews: 100, accuracy: 95 })
      hinaFeatures.activateScenario('campus')
      
      const report = hinaFeatures.generateDataReport()
      
      expect(report).toHaveProperty('timestamp')
      expect(report).toHaveProperty('metrics')
      expect(report).toHaveProperty('scenarios')
      expect(report).toHaveProperty('summary')
      expect(report.metrics.interviews).toBe(100)
      expect(report.summary.activeScenarios).toBe(1)
    })
  })

  describe('竞品优化器测试', () => {
    it('应该正确初始化优化器', () => {
      const status = competitorOptimizer.getOptimizationStatus()
      
      expect(status).toHaveProperty('summary')
      expect(status).toHaveProperty('details')
      expect(status).toHaveProperty('performance')
      expect(status.summary.totalOptimizations).toBe(3)
      expect(status.summary.implementedOptimizations).toBe(3)
      expect(status.summary.implementationRate).toBe('100.0%')
    })

    it('应该能够生成优化报告', () => {
      const report = competitorOptimizer.generateOptimizationReport()
      
      expect(report).toHaveProperty('timestamp')
      expect(report).toHaveProperty('competitorAnalysis')
      expect(report).toHaveProperty('technicalOptimizations')
      expect(report).toHaveProperty('overallStatus')
      expect(report).toHaveProperty('recommendations')
      
      expect(report.competitorAnalysis.offermore.status).toBe('✅ 已实施')
      expect(report.competitorAnalysis.dayee.status).toBe('✅ 已实施')
      expect(report.competitorAnalysis.hina.status).toBe('✅ 已实施')
    })

    it('应该能够获取竞品对比数据', () => {
      const comparison = competitorOptimizer.getCompetitorComparison()
      
      expect(comparison).toHaveProperty('features')
      expect(comparison).toHaveProperty('overallScore')
      expect(comparison.features['实时AI辅助'].ourSystem).toBe('✅ 已集成')
      expect(comparison.features['防作弊机制'].ourSystem).toBe('✅ 已集成')
      expect(comparison.features['数据可视化'].ourSystem).toBe('✅ 已集成')
      expect(comparison.overallScore.ourSystem).toBe(95)
    })
  })

  describe('品牌一致性检查测试', () => {
    beforeEach(() => {
      // 模拟DOM环境
      global.document = {
        querySelectorAll: vi.fn(() => [
          {
            tagName: 'DIV',
            className: 'test-element',
            id: 'test-id',
            closest: vi.fn(() => null),
            hasAttribute: vi.fn(() => false)
          }
        ])
      }
      
      global.window = {
        getComputedStyle: vi.fn(() => ({
          backgroundColor: '#1890ff',
          color: '#ffffff',
          fontFamily: 'Microsoft YaHei',
          fontSize: '14px',
          margin: '16px',
          padding: '16px',
          display: 'block',
          visibility: 'visible',
          opacity: '1'
        }))
      }
    })

    it('应该能够执行品牌合规性检查', () => {
      const result = iflytekBrandConsistency.performFullComplianceCheck()
      
      expect(result).toHaveProperty('timestamp')
      expect(result).toHaveProperty('summary')
      expect(result).toHaveProperty('details')
      expect(result).toHaveProperty('recommendations')
      
      expect(result.summary).toHaveProperty('totalElements')
      expect(result.summary).toHaveProperty('compliantElements')
      expect(result.summary).toHaveProperty('violations')
      expect(result.summary).toHaveProperty('complianceRate')
    })

    it('应该能够检查颜色合规性', () => {
      const mockElement = {
        style: {
          backgroundColor: '#1890ff',
          color: '#ffffff'
        }
      }
      
      global.window.getComputedStyle = vi.fn(() => ({
        backgroundColor: '#1890ff',
        color: '#ffffff'
      }))
      
      const result = iflytekBrandConsistency.checkColorCompliance(mockElement)
      
      expect(result).toHaveProperty('hasValidBrandColor')
      expect(result).toHaveProperty('hasGoodContrast')
      expect(result).toHaveProperty('followsColorScheme')
    })

    it('应该能够检查字体合规性', () => {
      const mockElement = {}
      
      global.window.getComputedStyle = vi.fn(() => ({
        fontFamily: 'Microsoft YaHei, sans-serif',
        fontSize: '14px'
      }))
      
      const result = iflytekBrandConsistency.checkFontCompliance(mockElement)
      
      expect(result).toHaveProperty('usesBrandFont')
      expect(result).toHaveProperty('hasProperFallback')
      expect(result).toHaveProperty('appropriateSize')
      expect(result.usesBrandFont).toBe(true)
    })
  })

  describe('组件渲染测试', () => {
    it('应该正确渲染竞品功能展示组件', async () => {
      const wrapper = mount(CompetitorInspiredFeatures)
      
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.competitor-inspired-features').exists()).toBe(true)
      expect(wrapper.find('.section-title').exists()).toBe(true)
    })

    it('应该正确渲染技术架构组件', async () => {
      const wrapper = mount(TechnicalArchitecture)
      
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.technical-architecture').exists()).toBe(true)
      expect(wrapper.find('.architecture-overview').exists()).toBe(true)
    })

    it('应该正确渲染性能监控组件', async () => {
      const wrapper = mount(SystemPerformanceMonitor)
      
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.system-performance-monitor').exists()).toBe(true)
      expect(wrapper.find('.monitor-header').exists()).toBe(true)
    })

    it('应该正确渲染品牌一致性检查组件', async () => {
      const wrapper = mount(BrandConsistencyChecker)
      
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.brand-consistency-checker').exists()).toBe(true)
      expect(wrapper.find('.checker-header').exists()).toBe(true)
    })
  })

  describe('性能测试', () => {
    it('应该在合理时间内完成优化器初始化', () => {
      const startTime = performance.now()
      const status = competitorOptimizer.getOptimizationStatus()
      const endTime = performance.now()
      
      expect(endTime - startTime).toBeLessThan(100) // 应在100ms内完成
      expect(status).toBeDefined()
    })

    it('应该在合理时间内完成品牌检查', () => {
      const startTime = performance.now()
      const result = iflytekBrandConsistency.performFullComplianceCheck()
      const endTime = performance.now()
      
      expect(endTime - startTime).toBeLessThan(1000) // 应在1秒内完成
      expect(result).toBeDefined()
    })

    it('应该正确处理大量元素的检查', () => {
      // 模拟大量DOM元素
      const mockElements = Array.from({ length: 1000 }, (_, i) => ({
        tagName: 'DIV',
        className: `element-${i}`,
        id: `id-${i}`,
        closest: vi.fn(() => null),
        hasAttribute: vi.fn(() => false)
      }))
      
      global.document.querySelectorAll = vi.fn(() => mockElements)
      
      const startTime = performance.now()
      const result = iflytekBrandConsistency.performFullComplianceCheck()
      const endTime = performance.now()
      
      expect(result.summary.totalElements).toBe(1000)
      expect(endTime - startTime).toBeLessThan(5000) // 应在5秒内完成
    })
  })

  describe('错误处理测试', () => {
    it('应该正确处理语音识别不支持的情况', () => {
      const { offerMoreFeatures } = useCompetitorFeatures()
      
      // 模拟不支持语音识别的浏览器
      global.window = {}
      
      offerMoreFeatures.startRealTimeAssistance()
      expect(offerMoreFeatures.isRealTimeAssistanceActive.value).toBe(false)
    })

    it('应该正确处理DOM元素不存在的情况', () => {
      global.document.querySelectorAll = vi.fn(() => [])
      
      const result = iflytekBrandConsistency.performFullComplianceCheck()
      expect(result.summary.totalElements).toBe(0)
      expect(result.summary.complianceRate).toBe('0.00')
    })

    it('应该正确处理样式获取失败的情况', () => {
      global.window.getComputedStyle = vi.fn(() => {
        throw new Error('样式获取失败')
      })
      
      expect(() => {
        iflytekBrandConsistency.performFullComplianceCheck()
      }).not.toThrow()
    })
  })
})
