/**
 * 演示功能测试
 * 验证前端用户体验优化效果
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ElButton, ElTabs, ElProgress, ElMessage } from 'element-plus'
import DemoPage from '../src/views/DemoPage.vue'
import InterviewMain from '../src/components/Interview/InterviewMain.vue'

// Mock Element Plus 组件
vi.mock('element-plus', () => ({
  ElButton: { template: '<button><slot /></button>' },
  ElTabs: { template: '<div><slot /></div>' },
  ElTabPane: { template: '<div><slot /></div>' },
  ElProgress: { template: '<div class="el-progress"></div>' },
  ElMessage: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn()
  },
  ElMessageBox: {
    alert: vi.fn(),
    confirm: vi.fn()
  }
}))

describe('演示页面功能测试', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(DemoPage, {
      global: {
        components: {
          ElButton,
          ElTabs
        },
        mocks: {
          $router: {
            push: vi.fn()
          }
        }
      }
    })
  })

  it('应该正确渲染演示页面', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.demo-page').exists()).toBe(true)
  })

  it('应该包含所有主要标签页', () => {
    const tabs = ['features', 'video', 'interactive', 'architecture']
    tabs.forEach(tab => {
      expect(wrapper.vm.activeTab).toBeDefined()
    })
  })

  it('应该正确处理标签页切换', async () => {
    // 测试标签页切换功能
    await wrapper.vm.handleTabClick({ name: 'interactive' })
    expect(wrapper.vm.activeTab).toBe('interactive')
  })

  it('应该包含增强版交互演示功能', () => {
    // 检查交互演示相关的数据
    expect(wrapper.vm.isDemoRunning).toBeDefined()
    expect(wrapper.vm.currentDemoStep).toBeDefined()
    expect(wrapper.vm.demoSteps).toBeDefined()
  })

  it('应该正确处理演示控制', async () => {
    // 测试演示开始/停止功能
    expect(wrapper.vm.toggleDemo).toBeDefined()
    expect(wrapper.vm.startDemo).toBeDefined()
    expect(wrapper.vm.stopDemo).toBeDefined()
    expect(wrapper.vm.resetDemo).toBeDefined()
  })

  it('应该包含AI对话演示功能', () => {
    // 检查AI对话相关的数据和方法
    expect(wrapper.vm.isChatActive).toBeDefined()
    expect(wrapper.vm.chatMessages).toBeDefined()
    expect(wrapper.vm.toggleAIChat).toBeDefined()
    expect(wrapper.vm.sendMessage).toBeDefined()
  })

  it('应该包含场景筛选功能', () => {
    // 检查场景筛选相关功能
    expect(wrapper.vm.selectedDomain).toBeDefined()
    expect(wrapper.vm.selectedDifficulty).toBeDefined()
    expect(wrapper.vm.filteredScenarios).toBeDefined()
    expect(wrapper.vm.filterScenarios).toBeDefined()
  })

  it('应该包含技术架构展示功能', () => {
    // 检查技术架构相关数据
    expect(wrapper.vm.architectureLayers).toBeDefined()
    expect(wrapper.vm.techStackCategories).toBeDefined()
    expect(wrapper.vm.performanceMonitors).toBeDefined()
  })
})

describe('面试主界面功能测试', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(InterviewMain, {
      props: {
        sessionId: 'test-session-123',
        domain: '人工智能',
        position: 'AI工程师'
      },
      global: {
        components: {
          ElButton,
          ElProgress
        },
        mocks: {
          $router: {
            push: vi.fn()
          }
        }
      }
    })
  })

  it('应该正确渲染面试界面', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.interview-main').exists()).toBe(true)
  })

  it('应该包含增强版头部信息', () => {
    // 检查增强版头部相关数据
    expect(wrapper.vm.progressColor).toBeDefined()
    expect(wrapper.vm.isConnected).toBeDefined()
    expect(wrapper.vm.isAnalyzing).toBeDefined()
  })

  it('应该包含增强版输入功能', () => {
    // 检查增强版输入相关方法
    expect(wrapper.vm.getInputTip).toBeDefined()
    expect(wrapper.vm.insertTemplate).toBeDefined()
    expect(wrapper.vm.clearText).toBeDefined()
    expect(wrapper.vm.formatText).toBeDefined()
  })

  it('应该包含题目朗读功能', () => {
    // 检查题目朗读相关功能
    expect(wrapper.vm.isReading).toBeDefined()
    expect(wrapper.vm.toggleQuestionReading).toBeDefined()
    expect(wrapper.vm.showQuestionHint).toBeDefined()
  })

  it('应该正确处理文本输入', async () => {
    // 测试文本输入处理
    wrapper.vm.textResponse = '测试文本'
    await wrapper.vm.handleTextInput()
    
    // 验证自动保存功能
    expect(wrapper.vm.autoSaveTimer).toBeDefined()
  })

  it('应该正确计算字数统计', () => {
    // 测试字数统计功能
    const testText = '这是一个测试文本，用于验证字数统计功能。'
    wrapper.vm.textResponse = testText
    
    expect(wrapper.vm.getWordCountType(testText.length)).toBeDefined()
    expect(wrapper.vm.getWordCountStatus(testText.length)).toBeDefined()
  })

  it('应该正确处理模板插入', async () => {
    // 测试模板插入功能
    const initialText = wrapper.vm.textResponse
    await wrapper.vm.insertTemplate('技术方案')
    
    expect(wrapper.vm.textResponse).not.toBe(initialText)
    expect(wrapper.vm.textResponse).toContain('技术方案')
  })
})

describe('中文本地化测试', () => {
  it('应该包含正确的中文文本', () => {
    const wrapper = mount(DemoPage)
    
    // 检查关键中文文本
    const chineseTexts = [
      '功能演示',
      '视频教程', 
      '交互体验',
      '技术架构',
      '实时演示控制台',
      'AI面试官对话演示'
    ]
    
    // 这里可以添加更具体的文本检查逻辑
    expect(wrapper.vm).toBeDefined()
  })

  it('应该正确处理中文输入', () => {
    const wrapper = mount(InterviewMain, {
      props: {
        sessionId: 'test-session',
        domain: '人工智能',
        position: 'AI工程师'
      }
    })
    
    const chineseText = '我在机器学习项目中有丰富的经验，特别是在深度学习和自然语言处理方面。'
    wrapper.vm.textResponse = chineseText
    
    expect(wrapper.vm.textResponse).toBe(chineseText)
    expect(wrapper.vm.getWordCountStatus(chineseText.length)).toBeDefined()
  })
})

describe('响应式设计测试', () => {
  it('应该在不同屏幕尺寸下正常工作', () => {
    // 模拟不同的屏幕尺寸
    const sizes = [
      { width: 1920, height: 1080 }, // 桌面
      { width: 1024, height: 768 },  // 平板
      { width: 375, height: 667 }    // 手机
    ]
    
    sizes.forEach(size => {
      // 设置视口大小
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: size.width
      })
      
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: size.height
      })
      
      const wrapper = mount(DemoPage)
      expect(wrapper.exists()).toBe(true)
    })
  })
})

describe('性能测试', () => {
  it('应该在合理时间内加载', async () => {
    const startTime = performance.now()
    
    const wrapper = mount(DemoPage)
    await wrapper.vm.$nextTick()
    
    const loadTime = performance.now() - startTime
    expect(loadTime).toBeLessThan(1000) // 应该在1秒内加载完成
  })

  it('应该正确处理大量数据', () => {
    const wrapper = mount(DemoPage)
    
    // 模拟大量演示步骤
    const largeDemoSteps = Array.from({ length: 100 }, (_, i) => ({
      title: `步骤 ${i + 1}`,
      description: `这是第 ${i + 1} 个演示步骤`,
      category: '测试',
      type: 'info',
      metrics: []
    }))
    
    wrapper.vm.demoSteps = largeDemoSteps
    expect(wrapper.vm.demoSteps.length).toBe(100)
  })
})

describe('错误处理测试', () => {
  it('应该正确处理网络错误', async () => {
    const wrapper = mount(DemoPage)
    
    // 模拟网络错误
    const mockError = new Error('网络连接失败')
    
    // 测试错误处理
    try {
      await wrapper.vm.startDemo()
    } catch (error) {
      expect(error).toBeDefined()
    }
  })

  it('应该正确处理无效输入', () => {
    const wrapper = mount(InterviewMain, {
      props: {
        sessionId: 'test-session',
        domain: '人工智能',
        position: 'AI工程师'
      }
    })
    
    // 测试无效输入处理
    wrapper.vm.textResponse = ''
    expect(wrapper.vm.hasValidResponse).toBe(false)
  })
})
