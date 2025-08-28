import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 导入Pinia状态管理
import pinia from './stores/index.js'

// 导入优化样式系统
import './styles/gradient-background-system.css'
import './styles/layout-optimization.css'
// 导入增强样式系统
import './styles/enhanced-responsive-layout.css'
import './styles/enhanced-gradient-system.css'
import { MotionPlugin } from '@vueuse/motion'

// 引入ECharts
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import {
  LineChart,
  BarChart,
  PieChart,
  RadarChart,
  ScatterChart,
  EffectScatterChart,
  GraphChart,
  FunnelChart,
  GaugeChart,
  TreeChart,
  TreemapChart,
  SunburstChart,
  BoxplotChart,
  CandlestickChart,
  HeatmapChart,
  MapChart,
  ParallelChart,
  LinesChart,
  ThemeRiverChart,
  SankeyChart,
  PictorialBarChart
} from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
  ToolboxComponent,
  MarkLineComponent,
  MarkPointComponent,
  GraphicComponent,
  RadarComponent,
  PolarComponent,
  GeoComponent,
  SingleAxisComponent,
  ParallelComponent,
  CalendarComponent,
  TimelineComponent,
  VisualMapComponent,
  DatasetComponent,
  TransformComponent,
  BrushComponent,
  AriaComponent
} from 'echarts/components'
import VChart from 'vue-echarts'

// 注册ECharts组件 - 确保在应用启动前完成
console.log('📊 开始注册ECharts组件...')
try {
  use([
    CanvasRenderer,
    LineChart,
    BarChart,
    PieChart,
    RadarChart,
    ScatterChart,
    EffectScatterChart,
    GraphChart,
    FunnelChart,
    GaugeChart,
    TreeChart,
    TreemapChart,
    SunburstChart,
    BoxplotChart,
    CandlestickChart,
    HeatmapChart,
    MapChart,
    ParallelChart,
    LinesChart,
    ThemeRiverChart,
    SankeyChart,
    PictorialBarChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
    DataZoomComponent,
    ToolboxComponent,
    MarkLineComponent,
    MarkPointComponent,
    GraphicComponent,
    RadarComponent,
    PolarComponent,
    GeoComponent,
    SingleAxisComponent,
    ParallelComponent,
    CalendarComponent,
    TimelineComponent,
    VisualMapComponent,
    DatasetComponent,
    TransformComponent,
    BrushComponent,
    AriaComponent
  ])
  console.log('✅ ECharts组件注册成功')

  // 设置全局标志，表示ECharts已准备就绪
  window.ECHARTS_READY = true

} catch (error) {
  console.error('❌ ECharts组件注册失败:', error)
  window.ECHARTS_READY = false
}

// Element Plus 中文本地化
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

// 引入简化的样式系统
import './styles/iflytek-simple.css'  // 🎯 iFlytek 简洁样式系统 - 统一配置

// 引入新的主题和字体系统
import './styles/theme-system.css'    // 🎨 完整主题切换系统
import './styles/font-size-system.css' // 🔤 字体大小调整系统

// 引入选择框组件优化样式
import './styles/select-component-optimization.css' // 🎯 选择框中文显示优化

// 开发环境简化配置
if (import.meta.env.DEV) {
  console.log('🚀 iFlytek 多模态面试系统 - 开发模式')
}

// 引入中文本地化配置
import './locales/zh-cn'

// 引入简化的ResizeObserver修复工具
import './utils/simple-resize-observer-fix.js'

// 简化的应用初始化

const app = createApp(App)

// 开发环境警告过滤 - 解决Vue响应式组件警告
if (import.meta.env.DEV) {
  const originalWarn = console.warn
  console.warn = function(...args) {
    try {
      // 安全地获取第一个参数的字符串表示
      const firstArg = args[0]
      let firstArgStr = ''

      if (firstArg !== null && firstArg !== undefined) {
        if (typeof firstArg === 'string') {
          firstArgStr = firstArg
        } else if (typeof firstArg === 'object') {
          try {
            firstArgStr = JSON.stringify(firstArg)
          } catch (e) {
            firstArgStr = String(firstArg)
          }
        } else {
          firstArgStr = String(firstArg)
        }
      }

      // 过滤ResizeObserver相关警告
      if (firstArgStr.includes('ResizeObserver loop completed with undelivered notifications') ||
          firstArgStr.includes('ResizeObserver loop limit exceeded') ||
          firstArgStr.includes('ResizeObserver callback threw an exception')) {
        return
      }

      // 过滤Vue响应式组件警告
      if (firstArgStr.includes('Vue received a Component that was made a reactive object')) {
        return
      }
      // 过滤其他已知的开发警告
      if (firstArgStr.includes('performance overhead') ||
          firstArgStr.includes('markRaw') ||
          firstArgStr.includes('shallowRef') ||
          firstArgStr.includes('[object Object]') ||
          firstArgStr.includes('Non-function value encountered for default slot') ||
          firstArgStr.includes('Invalid prop') ||
          firstArgStr.includes('Missing required prop')) {
        return
      }
    } catch (e) {
      // 如果处理失败，继续执行原始警告
    }

    originalWarn.apply(console, args)
  }

  // 处理ResizeObserver错误
  const originalError = console.error
  console.error = function(...args) {
    try {
      const firstArg = args[0]
      let firstArgStr = ''

      if (firstArg !== null && firstArg !== undefined) {
        if (typeof firstArg === 'string') {
          firstArgStr = firstArg
        } else if (typeof firstArg === 'object') {
          try {
            firstArgStr = JSON.stringify(firstArg)
          } catch (e) {
            firstArgStr = String(firstArg)
          }
        } else {
          firstArgStr = String(firstArg)
        }
      }

      // 过滤ResizeObserver相关错误
      if (firstArgStr.includes('ResizeObserver loop completed with undelivered notifications') ||
          firstArgStr.includes('ResizeObserver loop limit exceeded') ||
          firstArgStr.includes('ResizeObserver callback threw an exception')) {
        return
      }

      // 过滤Grammarly相关错误
      if (firstArgStr.includes('grammarly') ||
          firstArgStr.includes('Grammarly') ||
          firstArgStr.includes('gnar_') ||
          firstArgStr.includes('grammarly-extension')) {
        return
      }

      // 过滤其他浏览器扩展错误
      if (firstArgStr.includes('extension') &&
          (firstArgStr.includes('chrome-extension') ||
           firstArgStr.includes('moz-extension') ||
           firstArgStr.includes('safari-extension'))) {
        return
      }
    } catch (e) {
      // 如果处理失败，继续执行原始错误输出
    }

    originalError.apply(console, args)
  }

  // 全局错误处理 - 捕获未处理的错误
  window.addEventListener('error', (event) => {
    if (event.message) {
      // 过滤ResizeObserver错误
      if (event.message.includes('ResizeObserver loop completed with undelivered notifications')) {
        event.preventDefault()
        return false
      }

      // 过滤Grammarly相关错误
      if (event.message.includes('grammarly') ||
          event.message.includes('Grammarly') ||
          event.message.includes('gnar_') ||
          event.message.includes('grammarly-extension')) {
        event.preventDefault()
        return false
      }

      // 过滤浏览器扩展错误
      if (event.filename &&
          (event.filename.includes('chrome-extension') ||
           event.filename.includes('moz-extension') ||
           event.filename.includes('safari-extension'))) {
        event.preventDefault()
        return false
      }
    }
  })

  // 处理未捕获的Promise拒绝
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && typeof event.reason === 'string') {
      // 过滤Grammarly相关的Promise拒绝
      if (event.reason.includes('grammarly') ||
          event.reason.includes('Grammarly') ||
          event.reason.includes('gnar_')) {
        event.preventDefault()
        return false
      }
    }
  })

  console.log('🔧 Vue响应式警告过滤器和错误处理已启用 (开发环境)')
}

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 注册VChart组件
app.component('VChart', VChart)

app.use(pinia)
app.use(router)
app.use(ElementPlus, {
  locale: zhCn,
  size: 'default'
})
app.use(MotionPlugin)

app.mount('#app')

console.log('🚀 iFlytek 多模态面试系统已启动')
console.log('🎨 基于 Vue 3 + Element Plus + iFlytek Spark')