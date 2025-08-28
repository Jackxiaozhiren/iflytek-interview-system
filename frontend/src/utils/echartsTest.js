// ECharts配置测试工具
import * as echarts from 'echarts'

// 测试ECharts配置
export function testEChartsConfiguration() {
  console.log('🔧 开始测试ECharts配置...')

  try {
    // 检查ECharts是否正确加载
    if (typeof echarts === 'undefined') {
      throw new Error('ECharts未正确加载')
    }

    // 检查基本功能
    const testDiv = document.createElement('div')
    testDiv.style.width = '100px'
    testDiv.style.height = '100px'
    document.body.appendChild(testDiv)

    const testChart = echarts.init(testDiv)
    testChart.dispose()
    document.body.removeChild(testDiv)

    console.log('✅ ECharts配置测试成功')
    return true
  } catch (error) {
    console.error('❌ ECharts配置测试失败:', error)
    return false
  }
}

// 测试DOM容器
export function testDOMContainer(containerId) {
  const container = document.getElementById(containerId)
  if (!container) {
    console.error(`❌ 找不到容器: ${containerId}`)
    return false
  }
  
  const { clientWidth, clientHeight } = container
  if (clientWidth === 0 || clientHeight === 0) {
    console.warn(`⚠️ 容器尺寸异常: ${clientWidth}x${clientHeight}`)
    return false
  }
  
  console.log(`✅ 容器尺寸正常: ${clientWidth}x${clientHeight}`)
  return true
}

// 等待ECharts准备就绪
export function waitForEChartsReady(timeout = 5000) {
  return new Promise((resolve, reject) => {
    if (window.ECHARTS_READY) {
      resolve(true)
      return
    }

    const startTime = Date.now()
    const checkReady = () => {
      if (window.ECHARTS_READY) {
        resolve(true)
      } else if (Date.now() - startTime > timeout) {
        reject(new Error('ECharts准备超时'))
      } else {
        setTimeout(checkReady, 50)
      }
    }

    checkReady()
  })
}

// 延迟初始化图表的辅助函数
export function safeInitChart(initFunction, maxRetries = 5, delay = 100) {
  let retries = 0

  const tryInit = async () => {
    try {
      // 首先等待ECharts准备就绪
      await waitForEChartsReady()

      const result = initFunction()
      if (result) {
        console.log('✅ 图表初始化成功')
        return result
      }
    } catch (error) {
      console.warn(`⚠️ 图表初始化失败 (尝试 ${retries + 1}/${maxRetries}):`, error.message)
    }

    retries++
    if (retries < maxRetries) {
      setTimeout(tryInit, delay)
    } else {
      console.error('❌ 图表初始化最终失败')
    }
  }

  tryInit()
}

export default {
  testEChartsConfiguration,
  testDOMContainer,
  safeInitChart
}
