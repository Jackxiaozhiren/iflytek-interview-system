// ECharts管理器 - 统一管理ECharts的初始化和使用
import * as echarts from 'echarts'

class EChartsManager {
  constructor() {
    this.isReady = false
    this.readyPromise = null
    this.pendingInits = []
    this.charts = new Map()
  }

  // 初始化ECharts管理器
  async initialize() {
    if (this.readyPromise) {
      return this.readyPromise
    }

    this.readyPromise = new Promise((resolve, reject) => {
      try {
        // 等待DOM完全加载
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => {
            this._completeInitialization(resolve, reject)
          })
        } else {
          this._completeInitialization(resolve, reject)
        }
      } catch (error) {
        reject(error)
      }
    })

    return this.readyPromise
  }

  _completeInitialization(resolve, reject) {
    try {
      // 检查ECharts是否已经正确加载
      if (typeof echarts === 'undefined') {
        throw new Error('ECharts未正确加载')
      }

      // 检查全局注册标志
      if (!window.ECHARTS_READY) {
        // 等待全局注册完成
        const checkReady = () => {
          if (window.ECHARTS_READY) {
            this.isReady = true
            console.log('✅ ECharts管理器初始化完成')
            resolve(true)
            
            // 处理待处理的初始化请求
            this._processPendingInits()
          } else {
            setTimeout(checkReady, 50)
          }
        }
        checkReady()
      } else {
        this.isReady = true
        console.log('✅ ECharts管理器初始化完成')
        resolve(true)
        this._processPendingInits()
      }
    } catch (error) {
      console.error('❌ ECharts管理器初始化失败:', error)
      reject(error)
    }
  }

  // 处理待处理的初始化请求
  _processPendingInits() {
    while (this.pendingInits.length > 0) {
      const { resolve, reject, container, options } = this.pendingInits.shift()
      try {
        const chart = this._createChart(container, options)
        resolve(chart)
      } catch (error) {
        reject(error)
      }
    }
  }

  // 安全创建图表
  async createChart(container, options = {}) {
    if (!this.isReady) {
      await this.initialize()
    }

    return new Promise((resolve, reject) => {
      if (this.isReady) {
        try {
          const chart = this._createChart(container, options)
          resolve(chart)
        } catch (error) {
          reject(error)
        }
      } else {
        // 添加到待处理队列
        this.pendingInits.push({ resolve, reject, container, options })
      }
    })
  }

  // 内部创建图表方法
  _createChart(container, options) {
    if (!container) {
      throw new Error('图表容器不能为空')
    }

    // 检查容器尺寸
    const rect = container.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) {
      throw new Error(`图表容器尺寸异常: ${rect.width}x${rect.height}`)
    }

    try {
      const chart = echarts.init(container, options.theme, options.opts)
      
      // 生成唯一ID并存储图表实例
      const chartId = `chart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      this.charts.set(chartId, {
        instance: chart,
        container,
        created: new Date()
      })

      // 添加销毁方法
      chart._managerId = chartId
      const originalDispose = chart.dispose
      chart.dispose = () => {
        this.charts.delete(chartId)
        originalDispose.call(chart)
      }

      console.log(`✅ 图表创建成功 (ID: ${chartId})`)
      return chart
    } catch (error) {
      console.error('❌ 图表创建失败:', error)
      throw error
    }
  }

  // 安全初始化图表的辅助函数
  async safeInitChart(containerRef, initFunction, maxRetries = 3, delay = 200) {
    let retries = 0
    
    const tryInit = async () => {
      try {
        if (!containerRef.value) {
          throw new Error('容器引用为空')
        }

        await this.initialize()
        
        const result = await initFunction(containerRef.value)
        console.log('✅ 安全图表初始化成功')
        return result
      } catch (error) {
        retries++
        console.warn(`⚠️ 图表初始化失败 (尝试 ${retries}/${maxRetries}):`, error.message)
        
        if (retries < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delay))
          return tryInit()
        } else {
          console.error('❌ 图表初始化最终失败')
          throw error
        }
      }
    }

    return tryInit()
  }

  // 获取所有图表实例
  getAllCharts() {
    return Array.from(this.charts.values())
  }

  // 销毁所有图表
  disposeAllCharts() {
    this.charts.forEach(({ instance }) => {
      try {
        instance.dispose()
      } catch (error) {
        console.warn('图表销毁时出错:', error)
      }
    })
    this.charts.clear()
    console.log('🧹 所有图表已清理')
  }

  // 调整所有图表大小
  resizeAllCharts() {
    this.charts.forEach(({ instance }) => {
      try {
        instance.resize()
      } catch (error) {
        console.warn('图表调整大小时出错:', error)
      }
    })
  }

  // 获取状态信息
  getStatus() {
    return {
      isReady: this.isReady,
      chartCount: this.charts.size,
      pendingInits: this.pendingInits.length
    }
  }
}

// 创建全局实例
const echartsManager = new EChartsManager()

// 导出
export default echartsManager
export { EChartsManager }
