/**
 * 页面过渡动画系统
 * 提供统一的页面切换动画和全局加载状态管理
 */

import { ref, nextTick } from 'vue'
import { ElMessage } from 'element-plus'

// 全局状态管理
export const globalState = {
  isLoading: ref(false),
  loadingText: ref(''),
  loadingProgress: ref(0),
  currentRoute: ref(''),
  previousRoute: ref(''),
  transitionName: ref('fade'),
  isTransitioning: ref(false)
}

// 过渡动画配置
const TRANSITION_CONFIG = {
  // 页面过渡动画
  transitions: {
    fade: {
      name: 'fade',
      duration: 300,
      enterFrom: 'opacity: 0;',
      enterTo: 'opacity: 1;',
      leaveFrom: 'opacity: 1;',
      leaveTo: 'opacity: 0;'
    },
    
    slide: {
      name: 'slide',
      duration: 400,
      enterFrom: 'opacity: 0; transform: translateX(30px);',
      enterTo: 'opacity: 1; transform: translateX(0);',
      leaveFrom: 'opacity: 1; transform: translateX(0);',
      leaveTo: 'opacity: 0; transform: translateX(-30px);'
    },
    
    slideUp: {
      name: 'slide-up',
      duration: 400,
      enterFrom: 'opacity: 0; transform: translateY(30px);',
      enterTo: 'opacity: 1; transform: translateY(0);',
      leaveFrom: 'opacity: 1; transform: translateY(0);',
      leaveTo: 'opacity: 0; transform: translateY(-30px);'
    },
    
    scale: {
      name: 'scale',
      duration: 350,
      enterFrom: 'opacity: 0; transform: scale(0.9);',
      enterTo: 'opacity: 1; transform: scale(1);',
      leaveFrom: 'opacity: 1; transform: scale(1);',
      leaveTo: 'opacity: 0; transform: scale(1.1);'
    },
    
    rotate: {
      name: 'rotate',
      duration: 500,
      enterFrom: 'opacity: 0; transform: rotateY(90deg);',
      enterTo: 'opacity: 1; transform: rotateY(0deg);',
      leaveFrom: 'opacity: 1; transform: rotateY(0deg);',
      leaveTo: 'opacity: 0; transform: rotateY(-90deg);'
    }
  },
  
  // 路由特定过渡
  routeTransitions: {
    '/': 'fade',
    '/enhanced-home': 'scale',
    '/demo': 'slide',
    '/enhanced-branch-diagram': 'slideUp',
    '/interview-selection': 'slide',
    '/interviewing': 'scale',
    '/report': 'slideUp',
    '/learning-path': 'slide'
  }
}

// 创建过渡样式
const createTransitionStyles = () => {
  const style = document.createElement('style')
  style.id = 'page-transition-styles'
  
  let css = `
    /* 页面过渡容器 */
    .page-transition-container {
      position: relative;
      width: 100%;
      min-height: 100vh;
      overflow: hidden;
    }
    
    /* 全局加载遮罩 */
    .global-loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(0, 102, 204, 0.9) 0%, rgba(76, 81, 191, 0.9) 100%);
      backdrop-filter: blur(20px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: globalLoadingFadeIn 0.3s ease-out;
    }
    
    @keyframes globalLoadingFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    .global-loading-content {
      text-align: center;
      color: white;
      max-width: 400px;
      padding: 40px;
    }
    
    .global-loading-spinner {
      width: 60px;
      height: 60px;
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-top: 4px solid white;
      border-radius: 50%;
      animation: globalLoadingSpin 1s linear infinite;
      margin: 0 auto 20px;
    }
    
    @keyframes globalLoadingSpin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .global-loading-text {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 20px;
      font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
    }
    
    .global-loading-progress {
      width: 100%;
      height: 4px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 2px;
      overflow: hidden;
      margin-bottom: 15px;
    }
    
    .global-loading-progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #ffffff 0%, #f0f8ff 100%);
      border-radius: 2px;
      transition: width 0.3s ease;
      animation: progressShimmer 1.5s infinite;
    }
    
    @keyframes progressShimmer {
      0% { background-position: -200px 0; }
      100% { background-position: 200px 0; }
    }
    
    .global-loading-subtitle {
      font-size: 14px;
      opacity: 0.9;
      font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
    }
    
    /* 页面过渡动画基础样式 */
    .page-transition {
      transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
    }
  `
  
  // 为每个过渡动画生成CSS
  Object.values(TRANSITION_CONFIG.transitions).forEach(transition => {
    css += `
      /* ${transition.name} 过渡动画 */
      .${transition.name}-enter-active,
      .${transition.name}-leave-active {
        transition: all ${transition.duration}ms cubic-bezier(0.25, 0.8, 0.25, 1);
      }
      
      .${transition.name}-enter-from {
        ${transition.enterFrom}
      }
      
      .${transition.name}-enter-to {
        ${transition.enterTo}
      }
      
      .${transition.name}-leave-from {
        ${transition.leaveFrom}
      }
      
      .${transition.name}-leave-to {
        ${transition.leaveTo}
      }
    `
  })
  
  // 响应式和无障碍支持
  css += `
    /* 减少动画模式支持 */
    @media (prefers-reduced-motion: reduce) {
      .page-transition,
      .global-loading-spinner,
      .global-loading-progress-bar {
        animation: none !important;
        transition: none !important;
      }
      
      .global-loading-overlay {
        animation: none !important;
      }
    }
    
    /* 高对比度模式支持 */
    @media (prefers-contrast: high) {
      .global-loading-overlay {
        background: #000000;
        color: #ffffff;
      }
      
      .global-loading-spinner {
        border-color: #ffffff;
        border-top-color: #000000;
      }
    }
    
    /* 移动端优化 */
    @media (max-width: 768px) {
      .global-loading-content {
        padding: 30px 20px;
      }
      
      .global-loading-spinner {
        width: 50px;
        height: 50px;
      }
      
      .global-loading-text {
        font-size: 16px;
      }
      
      .global-loading-subtitle {
        font-size: 13px;
      }
    }
  `
  
  style.textContent = css
  return style
}

// 全局加载管理器
export const loadingManager = {
  // 显示加载
  show(text = '正在加载...', subtitle = '') {
    globalState.isLoading.value = true
    globalState.loadingText.value = text
    globalState.loadingProgress.value = 0
    
    if (subtitle) {
      globalState.loadingSubtitle = ref(subtitle)
    }
    
    // 模拟进度更新
    const progressInterval = setInterval(() => {
      if (globalState.loadingProgress.value < 90) {
        globalState.loadingProgress.value += Math.random() * 10
      } else {
        clearInterval(progressInterval)
      }
    }, 200)
    
    globalState._progressInterval = progressInterval
  },
  
  // 更新加载文本
  updateText(text, subtitle = '') {
    globalState.loadingText.value = text
    if (subtitle) {
      globalState.loadingSubtitle.value = subtitle
    }
  },
  
  // 更新进度
  updateProgress(progress) {
    globalState.loadingProgress.value = Math.min(100, Math.max(0, progress))
  },
  
  // 隐藏加载
  hide() {
    globalState.loadingProgress.value = 100
    
    setTimeout(() => {
      globalState.isLoading.value = false
      globalState.loadingText.value = ''
      globalState.loadingProgress.value = 0
      
      if (globalState._progressInterval) {
        clearInterval(globalState._progressInterval)
        delete globalState._progressInterval
      }
    }, 300)
  }
}

// 页面过渡管理器
export const transitionManager = {
  // 获取路由过渡名称
  getTransitionName(to, from) {
    // 根据路由路径确定过渡动画
    const toTransition = TRANSITION_CONFIG.routeTransitions[to.path]
    const fromTransition = TRANSITION_CONFIG.routeTransitions[from?.path]
    
    // 如果有特定的过渡配置，使用它
    if (toTransition) {
      return toTransition
    }
    
    // 根据路由层级确定过渡方向
    const toDepth = to.path.split('/').length
    const fromDepth = from?.path?.split('/').length || 0
    
    if (toDepth > fromDepth) {
      return 'slide' // 进入更深层级
    } else if (toDepth < fromDepth) {
      return 'slideUp' // 返回上层
    } else {
      return 'fade' // 同级切换
    }
  },
  
  // 设置过渡动画
  setTransition(name) {
    globalState.transitionName.value = name
  },
  
  // 开始过渡
  startTransition() {
    globalState.isTransitioning.value = true
  },
  
  // 结束过渡
  endTransition() {
    globalState.isTransitioning.value = false
  }
}

// 路由守卫集成
export const setupRouterGuards = (router) => {
  // 路由开始前
  router.beforeEach((to, from, next) => {
    // 更新路由状态
    globalState.previousRoute.value = from.path
    globalState.currentRoute.value = to.path
    
    // 设置过渡动画
    const transitionName = transitionManager.getTransitionName(to, from)
    transitionManager.setTransition(transitionName)
    
    // 开始过渡
    transitionManager.startTransition()
    
    // 显示加载（对于需要异步加载的路由）
    if (to.meta?.requiresLoading) {
      loadingManager.show(to.meta.loadingText || '正在加载页面...', to.meta.loadingSubtitle)
    }
    
    next()
  })
  
  // 路由完成后
  router.afterEach((to, from) => {
    // 延迟结束过渡，确保动画完成
    setTimeout(() => {
      transitionManager.endTransition()
      
      // 隐藏加载
      if (to.meta?.requiresLoading) {
        loadingManager.hide()
      }
    }, 100)
    
    // 页面切换成功提示
    if (to.meta?.showSuccessMessage) {
      ElMessage.success(to.meta.successMessage || `已切换到${to.meta.title || '新页面'}`)
    }
  })
  
  // 路由错误处理
  router.onError((error) => {
    console.error('路由错误:', error)
    loadingManager.hide()
    transitionManager.endTransition()
    ElMessage.error('页面加载失败，请重试')
  })
}

// 插件安装函数
export const pageTransitions = {
  install(app, options = {}) {
    // 合并配置
    const config = { ...TRANSITION_CONFIG, ...options }
    
    // 添加过渡样式
    const styleElement = createTransitionStyles()
    document.head.appendChild(styleElement)
    
    // 提供全局状态和管理器
    app.config.globalProperties.$globalState = globalState
    app.config.globalProperties.$loadingManager = loadingManager
    app.config.globalProperties.$transitionManager = transitionManager
    
    // 提供全局方法
    app.provide('globalState', globalState)
    app.provide('loadingManager', loadingManager)
    app.provide('transitionManager', transitionManager)
    
    console.log('🎬 页面过渡系统已加载')
  }
}

export default pageTransitions
